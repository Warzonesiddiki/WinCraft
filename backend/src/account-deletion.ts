import type { PoolClient } from "pg";
import { isEntitled, PERPETUAL_PLANS } from "./entitlement";

/**
 * What deleting an account means, decided in one place.
 *
 * Two rules shape this file:
 *
 * 1. Deleting our user row cannot stop Stripe from charging a card. An
 *    account with a live subscription is refused before anything is removed,
 *    with a message that says what to do first, because the alternative is a
 *    "deleted" account that keeps being billed.
 * 2. Content somebody published is not account data. A confirmed review stays
 *    published — it is part of the public record other people read — but the
 *    address attached to it is replaced, so the row can no longer be joined
 *    back to a person. Unconfirmed submissions were never published, so they
 *    are removed outright.
 */

/** RFC 2606 reserves `.invalid`, so this address can never receive mail. The
 *  user id keeps the column's unique index usable after deletion. */
export function anonymizedReviewEmail(userId: number): string {
  return `deleted+${userId}@wincraft.invalid`;
}

export type DeletionCandidate = {
  id: number;
  email: string;
  is_pro?: boolean | null;
  plan?: string | null;
  pro_expires_at?: Date | string | null;
  legacy_pro_grant?: boolean | null;
  stripe_subscription_id?: string | null;
};

/** True when deletion would leave a subscription still billing the card. A
 *  cancelled subscription is only safe once its paid period has ended, which
 *  is exactly when `isEntitled` turns false. Hand-granted access (a legacy
 *  grant, or a perpetual plan) has no Stripe subscription and never blocks. */
export function subscriptionBlocksDeletion(account: DeletionCandidate): boolean {
  if (!account.stripe_subscription_id) return false;
  if (account.plan && PERPETUAL_PLANS.has(account.plan)) return false;
  return isEntitled(account as Parameters<typeof isEntitled>[0]);
}

export type DeletionSummary = {
  /** Unconfirmed submissions removed: never published, nothing to preserve. */
  discardedReviews: number;
  /** Published reviews kept with their author address replaced. */
  anonymizedReviews: number;
  /** Addresses marked unsubscribed, so no future mail can reach them. */
  unsubscribed: number;
};

/**
 * Removes everything that belongs to the account, in one transaction, on the
 * caller's checked-out client. Child rows are deleted explicitly rather than
 * left to `ON DELETE CASCADE`: the cascade is a safety net, while these
 * statements are the record of what deletion actually covers, and they are
 * what a test can assert against.
 */
export async function deleteAccountData(
  account: DeletionCandidate,
  client: Pick<PoolClient, "query">,
): Promise<DeletionSummary> {
  await client.query("DELETE FROM lifetime_uninstaller_bonus WHERE user_id = $1", [account.id]);
  await client.query("DELETE FROM billing_receipts WHERE user_id = $1", [account.id]);
  await client.query("DELETE FROM entitlements WHERE user_id = $1", [account.id]);
  await client.query("DELETE FROM checkout_reminders WHERE user_id = $1", [account.id]);
  await client.query("DELETE FROM action_tokens WHERE user_id = $1", [account.id]);

  const discarded = await client.query(
    `DELETE FROM reviews
      WHERE lower(email) = lower($1) AND confirmed_at IS NULL
      RETURNING id`,
    [account.email],
  );
  const anonymized = await client.query(
    `UPDATE reviews SET email = $2, ip = NULL, ip_hash = NULL
      WHERE lower(email) = lower($1) AND confirmed_at IS NOT NULL
      RETURNING id`,
    [account.email, anonymizedReviewEmail(account.id)],
  );
  const unsubscribed = await client.query(
    `UPDATE newsletter_subscribers SET unsubscribed_at = now()
      WHERE lower(email) = lower($1) AND unsubscribed_at IS NULL
      RETURNING id`,
    [account.email],
  );

  // Last: every statement above keys off this row.
  await client.query("DELETE FROM users WHERE id = $1", [account.id]);

  return {
    discardedReviews: discarded.rowCount ?? 0,
    anonymizedReviews: anonymized.rowCount ?? 0,
    unsubscribed: unsubscribed.rowCount ?? 0,
  };
}
