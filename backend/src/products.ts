import { getPool } from "./db";
import { isEntitled, PERPETUAL_PLANS } from "./entitlement";

/**
 * The ecosystem's product catalogue, and the data access for the per-product
 * `entitlements` table.
 *
 * Product "wincraft" is special: its entitlement predates this module and
 * lives on the `users` row itself (`is_pro` + `pro_expires_at`), so reads for
 * it go through the original columns and the original `isEntitled` logic.
 * Every other product reads and writes `entitlements` rows. Callers never
 * need to know which storage backs which product — `productEntitlement`
 * hides the split.
 */

/** Every product the backend will sign licenses or sell checkouts for.
 *  A request naming anything else is rejected before touching the database. */
export const PRODUCTS = ["wincraft", "uninstaller"] as const;
export type Product = (typeof PRODUCTS)[number];

/**
 * Ids the catalogue sold under before the WinCraft rename.
 *
 * They are not aliases in the cosmetic sense: rows in `entitlements`, Stripe
 * checkout metadata written by the old clients, and installed desktop builds
 * that name their own product id all still say "pctweaker". Dropping the id
 * outright would strand those customers — a refund webhook would fail to match
 * its grant, and an existing Uninstaller subscriber's checkout would 400 on a
 * product the server no longer recognises. So the id stays accepted and always
 * resolves to its canonical product; nothing new is ever written under it
 * (`initSchema` rewrites stored rows).
 */
export const LEGACY_PRODUCT_IDS = { pctweaker: "wincraft" } as const;

/** Any id the backend acts on: the canonical catalogue plus legacy ids. */
export type ProductId = Product | keyof typeof LEGACY_PRODUCT_IDS;

/** The canonical product for an accepted id, or null when nothing matches.
 *  `hasOwnProperty` rather than a plain lookup, so "toString"/"__proto__"
 *  cannot resolve to a prototype member and be mistaken for a product. */
export function canonicalProduct(value: unknown): Product | null {
  if (typeof value !== "string") return null;
  if ((PRODUCTS as readonly string[]).includes(value)) return value as Product;
  return Object.prototype.hasOwnProperty.call(LEGACY_PRODUCT_IDS, value)
    ? LEGACY_PRODUCT_IDS[value as keyof typeof LEGACY_PRODUCT_IDS]
    : null;
}

export function isKnownProduct(value: unknown): value is ProductId {
  return canonicalProduct(value) !== null;
}

export type ProductEntitlement = {
  product: Product;
  active: boolean;
  plan: string | null;
  expiresAt?: string | null;
};

type EntitlementTableRow = {
  plan: string | null;
  expires_at: Date | string | null;
};

/**
 * Entitlement logic for `entitlements` rows. Unlike the legacy `isEntitled`
 * (which grandfathers a NULL expiry because pre-column subscribers exist),
 * rows in this table have no legacy: a NULL expiry grants access only for
 * explicitly perpetual plans. Everything else fails closed.
 */
export function isProductRowEntitled(row: EntitlementTableRow | null | undefined, now: Date = new Date()): boolean {
  if (!row) return false;
  if (row.plan && PERPETUAL_PLANS.has(row.plan)) return true;
  if (row.expires_at == null) return false;
  const expiresAt = row.expires_at instanceof Date ? row.expires_at : new Date(row.expires_at);
  if (Number.isNaN(expiresAt.getTime())) return false;
  return expiresAt.getTime() > now.getTime();
}

/** Resolves one product's entitlement for a user, whichever store backs it. */
export async function productEntitlement(userId: number | string, product: ProductId, activateBonus = false): Promise<ProductEntitlement> {
  // A legacy id must read the rows its canonical product owns: "pctweaker" and
  // "wincraft" are one product with two names, not two products.
  const canonical = canonicalProduct(product) as Product;
  if (canonical === "wincraft") {
    const { rows } = await getPool().query(
      "SELECT is_pro, plan, pro_expires_at, legacy_pro_grant FROM users WHERE id = $1",
      [userId],
    );
    const row = rows[0];
    return {
      product: canonical, active: isEntitled(row), plan: row?.plan ?? null,
      expiresAt: row?.plan && PERPETUAL_PLANS.has(row.plan) ? null
        : row?.pro_expires_at ? new Date(row.pro_expires_at).toISOString() : null,
    };
  }
  const { rows } = await getPool().query(
    "SELECT plan, expires_at FROM entitlements WHERE user_id = $1 AND product = $2",
    [userId, canonical],
  );
  const row = rows[0];
  const paidActive = isProductRowEntitled(row);
  const { rows: owners } = await getPool().query("SELECT is_pro, plan FROM users WHERE id = $1", [userId]);
  const lifetime = owners[0]?.is_pro === true && owners[0]?.plan === "lifetime";
  if (lifetime && activateBonus) {
    const start = new Date();
    const end = new Date(start);
    end.setUTCFullYear(end.getUTCFullYear() + 1);
    await getPool().query(`INSERT INTO lifetime_uninstaller_bonus (user_id, activated_at, expires_at)
      VALUES ($1, $2, $3) ON CONFLICT (user_id) DO NOTHING`, [userId, start, end]);
  }
  const { rows: bonuses } = await getPool().query("SELECT expires_at FROM lifetime_uninstaller_bonus WHERE user_id = $1", [userId]);
  const bonusExpiry = bonuses[0]?.expires_at ? new Date(bonuses[0].expires_at) : null;
  const bonusActive = lifetime && bonusExpiry !== null && bonusExpiry.getTime() > Date.now();
  const paidExpiry = row?.expires_at ? new Date(row.expires_at) : null;
  if (paidActive && (row.plan === "lifetime" || !bonusActive || (paidExpiry && paidExpiry >= bonusExpiry!))) {
    return { product: canonical, active: true, plan: row.plan, expiresAt: row.plan === "lifetime" ? null : paidExpiry?.toISOString() };
  }
  if (bonusActive) return { product: canonical, active: true, plan: "lifetime_bonus", expiresAt: bonusExpiry!.toISOString() };
  return { product: canonical, active: false, plan: row?.plan ?? null, expiresAt: null };
}

/** All products' entitlements for a user, for account UIs and loyalty pricing. */
export async function allEntitlements(userId: number | string): Promise<ProductEntitlement[]> {
  return Promise.all(PRODUCTS.map((product) => productEntitlement(userId, product)));
}

/** True when the user holds at least one active entitlement on any product —
 *  the ecosystem's definition of "existing customer" for loyalty pricing. */
export async function hasAnyActiveEntitlement(userId: number | string): Promise<boolean> {
  const all = await allEntitlements(userId);
  return all.some((entitlement) => entitlement.active);
}

/** Grants or refreshes a non-wincraft product entitlement (webhook path).
 *
 *  `provisional` marks the holding window written by
 *  `checkout.session.completed` before the real period end is known. Stripe
 *  does not order that event against `customer.subscription.*`, so an
 *  unguarded write can replace a real expiry with the guess and cut a paid
 *  period short — see the same guard in grantPro. A provisional value may
 *  only extend, never shorten. */
export async function upsertEntitlement(
  userId: number | string,
  product: ProductId,
  { plan, expiresAt, stripeSubscriptionId, provisional }: { plan: string | null; expiresAt: Date | null; stripeSubscriptionId?: string | null; provisional?: boolean },
): Promise<void> {
  await getPool().query(
    `INSERT INTO entitlements (user_id, product, plan, expires_at, stripe_subscription_id, updated_at)
     VALUES ($1, $2, $3, $4, $5, now())
     ON CONFLICT (user_id, product) DO UPDATE
        SET plan = EXCLUDED.plan,
            expires_at = CASE
              WHEN $6::boolean AND entitlements.expires_at IS NOT NULL
                   AND entitlements.expires_at > EXCLUDED.expires_at
                THEN entitlements.expires_at
              ELSE EXCLUDED.expires_at
            END,
            stripe_subscription_id = COALESCE(EXCLUDED.stripe_subscription_id, entitlements.stripe_subscription_id),
            updated_at = now()`,
    [userId, canonicalProduct(product) as Product, plan, expiresAt, stripeSubscriptionId ?? null, provisional === true],
  );
}

/** Ends a non-wincraft entitlement immediately (cancellation/refund path).
 *  The row is kept — history matters for support — but the expiry is now.
 *  Given a subscription, only that subscription's grant ends: a late event
 *  for an old subscription must not cut off the one that replaced it. */
export async function revokeEntitlement(userId: number | string, product: ProductId, subscriptionId?: string): Promise<void> {
  await getPool().query(
    `UPDATE entitlements SET expires_at = now(), updated_at = now()
      WHERE user_id = $1 AND product = $2
        AND ($3::text IS NULL OR stripe_subscription_id IS NULL OR stripe_subscription_id = $3)`,
    [userId, canonicalProduct(product) as Product, subscriptionId ?? null],
  );
}
