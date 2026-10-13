import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

process.env.DATABASE_URL = "pgmem";
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-only";
const require = createRequire(import.meta.url);
const db = require("../dist/db.js");
const router = require("../dist/routes/account.js").default;
const { hashPassword } = require("../dist/auth.js");
const {
  anonymizedReviewEmail,
  subscriptionBlocksDeletion,
} = require("../dist/account-deletion.js");

await db.initSchema();
const pool = db.getPool();

/** The route handler behind DELETE /api/account, with requireAuth already run. */
const deleteHandler = router.stack
  .find((entry) => entry.route?.path === "/" && entry.route.methods.delete)
  .route.stack.at(-1).handle;

const call = async (body, userId) => {
  // Express defaults to 200: the success path calls res.json without setting a
  // status, and a harness that started at 0 would read that as no response.
  let status = 200;
  let payload = null;
  const response = {
    status(n) {
      status = n;
      return this;
    },
    json(value) {
      payload = value;
      return this;
    },
  };
  await deleteHandler({ body, userId }, response, (err) => {
    throw err;
  });
  return { status, payload };
};

const PASSWORD = "correct horse battery";

/** A fresh account with a row in every table deletion is supposed to cover. */
async function seed(overrides = {}, options = {}) {
  const values = {
    email: `person-${Math.random().toString(36).slice(2)}@example.com`,
    password: await hashPassword(PASSWORD),
    is_pro: false,
    plan: null,
    pro_expires_at: null,
    legacy_pro_grant: false,
    stripe_customer_id: null,
    stripe_subscription_id: null,
    ...overrides,
  };
  const { rows } = await pool.query(
    `INSERT INTO users (email, password_hash, first_name, is_pro, plan, pro_expires_at, legacy_pro_grant, stripe_customer_id, stripe_subscription_id)
     VALUES ($1, $2, 'Person', $3, $4, $5, $6, $7, $8) RETURNING id`,
    [
      values.email,
      values.password,
      values.is_pro,
      values.plan,
      values.pro_expires_at,
      values.legacy_pro_grant,
      values.stripe_customer_id,
      values.stripe_subscription_id,
    ],
  );
  const id = rows[0].id;
  await pool.query(
    "INSERT INTO action_tokens (user_id, token_hash, purpose, expires_at) VALUES ($1, 'hash', 'password_reset', now())",
    [id],
  );
  await pool.query(
    "INSERT INTO billing_receipts (receipt_key, user_id, payload) VALUES ($1, $2, '{}')",
    [`checkout:${id}`, id],
  );
  await pool.query("INSERT INTO entitlements (user_id, product) VALUES ($1, 'uninstaller')", [id]);
  await pool.query(
    "INSERT INTO checkout_reminders (user_id, session_id, sent_at) VALUES ($1, 'cs_test', now())",
    [id],
  );
  await pool.query(
    "INSERT INTO lifetime_uninstaller_bonus (user_id, activated_at, expires_at) VALUES ($1, now(), now())",
    [id],
  );
  // The schema allows one review per address, so the two states a published
  // and an unpublished submission are in are seeded separately.
  if ((options.review ?? "confirmed") === "confirmed") {
    await pool.query(
      `INSERT INTO reviews (name, email, rating, body, published, confirmed_at, ip, ip_hash)
       VALUES ('Person', $1, 5, 'Works.', TRUE, now(), '203.0.113.9', 'hash')`,
      [values.email],
    );
  } else {
    await pool.query(
      `INSERT INTO reviews (name, email, rating, body, published, confirm_token_hash, confirm_expires_at)
       VALUES ('Person', $1, 4, 'Half-written.', FALSE, 'token-hash', now())`,
      [values.email],
    );
  }
  await pool.query("INSERT INTO newsletter_subscribers (email, source) VALUES ($1, 'footer')", [
    values.email,
  ]);
  return { id, ...values };
}

const count = async (table, where, args) =>
  (await pool.query(`SELECT * FROM ${table} ${where}`, args)).rows.length;

for (const [label, body, status] of [
  ["a missing confirmation word changes nothing", { password: PASSWORD }, 400],
  ["a wrong confirmation word changes nothing", { password: PASSWORD, confirm: "delete" }, 400],
  ["an empty password changes nothing", { password: "", confirm: "DELETE" }, 400],
]) {
  test(`deleting an account: ${label}`, async () => {
    const account = await seed();
    const result = await call(body, account.id);
    assert.equal(result.status, status);
    assert.equal(await count("users", "WHERE id = $1", [account.id]), 1);
    assert.equal(await count("action_tokens", "WHERE user_id = $1", [account.id]), 1);
    assert.equal(await count("reviews", "WHERE lower(email) = lower($1)", [account.email]), 1);
  });
}

test("deleting an account: a wrong password is refused and nothing is removed", async () => {
  const account = await seed();
  const result = await call({ password: "not the password", confirm: "DELETE" }, account.id);
  assert.equal(result.status, 401);
  assert.equal(await count("users", "WHERE id = $1", [account.id]), 1);
  assert.equal(await count("entitlements", "WHERE user_id = $1", [account.id]), 1);
  assert.equal(
    await count("newsletter_subscribers", "WHERE lower(email) = lower($1)", [account.email]),
    1,
  );
});

test("deleting an account: an active subscription is refused before anything is removed", async () => {
  const account = await seed({
    is_pro: true,
    plan: "monthly",
    pro_expires_at: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    stripe_customer_id: "cus_123",
    stripe_subscription_id: "sub_123",
  });
  const result = await call({ password: PASSWORD, confirm: "DELETE" }, account.id);
  assert.equal(result.status, 409);
  assert.match(result.payload.error, /active subscription/);
  assert.match(result.payload.error, /Cancel it/);
  assert.equal(await count("users", "WHERE id = $1", [account.id]), 1);
  assert.equal(await count("reviews", "WHERE lower(email) = lower($1)", [account.email]), 1);
});

test("a lapsed subscription and a hand-granted entitlement do not block deletion", () => {
  const base = { id: 1, email: "a@example.com", stripe_subscription_id: "sub_123" };
  // Period over: Stripe will not renew a lapsed subscription.
  assert.equal(
    subscriptionBlocksDeletion({
      ...base,
      is_pro: true,
      plan: "monthly",
      pro_expires_at: new Date(Date.now() - 1000),
    }),
    false,
  );
  assert.equal(
    subscriptionBlocksDeletion({ ...base, is_pro: false, plan: "monthly", pro_expires_at: null }),
    false,
  );
  // Lifetime is bought once: no subscription, nothing left to bill.
  assert.equal(
    subscriptionBlocksDeletion({
      ...base,
      is_pro: true,
      plan: "lifetime",
      stripe_subscription_id: null,
    }),
    false,
  );
  // Still inside a paid period: deleting the row would leave the card charged.
  assert.equal(
    subscriptionBlocksDeletion({
      ...base,
      is_pro: true,
      plan: "annual",
      pro_expires_at: new Date(Date.now() + 1000),
    }),
    true,
  );
});

test("deleting an account removes the account, its rows, and the address on published content", async () => {
  const account = await seed();
  const result = await call({ password: PASSWORD, confirm: "DELETE" }, account.id);
  assert.deepEqual(result.payload, { deleted: true });
  assert.equal(result.status, 200);

  for (const [table, where, args] of [
    ["users", "WHERE id = $1", [account.id]],
    ["action_tokens", "WHERE user_id = $1", [account.id]],
    ["billing_receipts", "WHERE user_id = $1", [account.id]],
    ["entitlements", "WHERE user_id = $1", [account.id]],
    ["checkout_reminders", "WHERE user_id = $1", [account.id]],
    ["lifetime_uninstaller_bonus", "WHERE user_id = $1", [account.id]],
  ]) {
    assert.equal(await count(table, where, args), 0, table);
  }

  // The published review stays, with no address and no source address left on it.
  const published = await pool.query("SELECT * FROM reviews WHERE lower(email) = lower($1)", [
    anonymizedReviewEmail(account.id),
  ]);
  assert.equal(published.rows.length, 1);
  assert.equal(published.rows[0].body, "Works.");
  assert.equal(published.rows[0].ip, null);
  assert.equal(published.rows[0].ip_hash, null);
  assert.equal(await count("reviews", "WHERE lower(email) = lower($1)", [account.email]), 0);

  // The address cannot be mailed again, and the row is kept so a later
  // re-subscribe is an update rather than a duplicate.
  const subscriber = await pool.query(
    "SELECT * FROM newsletter_subscribers WHERE lower(email) = lower($1)",
    [account.email],
  );
  assert.equal(subscriber.rows.length, 1);
  assert.ok(subscriber.rows[0].unsubscribed_at, "the address is marked unsubscribed");

  // The account really is gone: the token that was valid a moment ago is not.
  assert.equal(
    (await pool.query("SELECT token_version FROM users WHERE id = $1", [account.id])).rows.length,
    0,
  );
});

test("a submission that was never confirmed is discarded, not published under a placeholder", async () => {
  const account = await seed({}, { review: "pending" });
  assert.equal(await count("reviews", "WHERE lower(email) = lower($1)", [account.email]), 1);
  const result = await call({ password: PASSWORD, confirm: "DELETE" }, account.id);
  assert.equal(result.status, 200);
  assert.equal(await count("reviews", "WHERE body = 'Half-written.'"), 0);
  assert.equal(await count("reviews", "WHERE lower(email) = lower($1)", [account.email]), 0);
  assert.equal(
    await count("reviews", "WHERE lower(email) = lower($1)", [anonymizedReviewEmail(account.id)]),
    0,
  );
});

test("deletion does not touch another account's rows", async () => {
  const [mine, theirs] = await Promise.all([seed(), seed()]);
  // Same review text is not a key: the other account's address must survive.
  const result = await call({ password: PASSWORD, confirm: "DELETE" }, mine.id);
  assert.equal(result.status, 200);
  assert.equal(await count("users", "WHERE id = $1", [theirs.id]), 1);
  assert.equal(await count("reviews", "WHERE lower(email) = lower($1)", [theirs.email]), 1);
  assert.equal(
    await count(
      "newsletter_subscribers",
      "WHERE lower(email) = lower($1) AND unsubscribed_at IS NULL",
      [theirs.email],
    ),
    1,
  );
  assert.equal(
    await count(
      "newsletter_subscribers",
      "WHERE lower(email) = lower($1) AND unsubscribed_at IS NULL",
      [anonymizedReviewEmail(mine.id)],
    ),
    0,
  );
});

// pg-mem does not enforce foreign keys or implement real rollback, so the
// shipped SQL and the row counts are proved against a real server instead.
test(
  "PostgreSQL: deletion covers every table and reports what it removed",
  { skip: !process.env.TEST_DATABASE_URL },
  async () => {
    process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
    process.env.DATABASE_ALLOW_PLAINTEXT = "true";
    const { Pool } = require("pg");
    const { databaseOptions } = require("../dist/db-config.js");
    const { bootstrapStatements } = require("../dist/migrations/001-bootstrap.js");
    const {
      deleteAccountData,
      anonymizedReviewEmail: placeholder,
    } = require("../dist/account-deletion.js");
    const real = new Pool(databaseOptions());
    const schema = `acct_${process.pid}_${Date.now()}`;
    const client = await real.connect();
    try {
      await client.query(`CREATE SCHEMA ${schema}`);
      await client.query(`SET search_path TO ${schema}`);
      for (const statement of bootstrapStatements) await client.query(statement);

      const { rows } = await client.query(
        `INSERT INTO users (email, password_hash, is_pro, plan, pro_expires_at, stripe_subscription_id)
       VALUES ('real@example.com', 'hash', TRUE, 'annual', now() + interval '30 days', 'sub_live') RETURNING id`,
      );
      const id = rows[0].id;
      const { rows: pendingUser } = await client.query(
        `INSERT INTO users (email, password_hash) VALUES ('pending@example.com', 'hash') RETURNING id`,
      );
      await client.query(
        "INSERT INTO action_tokens (user_id, token_hash, purpose, expires_at) VALUES ($1, 'h', 'password_reset', now())",
        [id],
      );
      await client.query(
        "INSERT INTO billing_receipts (receipt_key, user_id, payload) VALUES ('k', $1, '{}')",
        [id],
      );
      await client.query("INSERT INTO entitlements (user_id, product) VALUES ($1, 'uninstaller')", [
        id,
      ]);
      await client.query(
        "INSERT INTO checkout_reminders (user_id, session_id, sent_at) VALUES ($1, 'cs', now())",
        [id],
      );
      await client.query(
        "INSERT INTO lifetime_uninstaller_bonus (user_id, activated_at, expires_at) VALUES ($1, now(), now())",
        [id],
      );
      await client.query(
        "INSERT INTO reviews (name, email, rating, body, published, confirmed_at) VALUES ('Real', 'real@example.com', 5, 'Published.', TRUE, now())",
      );
      await client.query(
        "INSERT INTO reviews (name, email, rating, body, published, confirm_token_hash) VALUES ('Real', 'pending@example.com', 4, 'Pending.', FALSE, 'token')",
      );
      await client.query(
        "INSERT INTO newsletter_subscribers (email, source) VALUES ('real@example.com', 'footer')",
      );

      const summary = await deleteAccountData(
        {
          id,
          email: "real@example.com",
          is_pro: true,
          plan: "annual",
          pro_expires_at: new Date(),
          stripe_subscription_id: "sub_live",
        },
        client,
      );
      assert.deepEqual(summary, { discardedReviews: 0, anonymizedReviews: 1, unsubscribed: 1 });

      // The never-confirmed submission belongs to its own account, and its own
      // address: deleting the published account must leave it alone.
      await deleteAccountData({ id: pendingUser[0].id, email: "pending@example.com" }, client);

      const remaining = async (sql) => (await client.query(sql)).rows.length;
      assert.equal(await remaining("SELECT 1 FROM users"), 0);
      assert.equal(await remaining("SELECT 1 FROM action_tokens"), 0);
      assert.equal(await remaining("SELECT 1 FROM billing_receipts"), 0);
      assert.equal(await remaining("SELECT 1 FROM entitlements"), 0);
      assert.equal(await remaining("SELECT 1 FROM checkout_reminders"), 0);
      assert.equal(await remaining("SELECT 1 FROM lifetime_uninstaller_bonus"), 0);
      const kept = await client.query("SELECT email, body, ip, ip_hash FROM reviews ORDER BY id");
      assert.equal(
        kept.rows.length,
        1,
        "the never-confirmed submission is removed with its account",
      );
      assert.equal(kept.rows[0].body, "Published.");
      assert.equal(kept.rows[0].email, placeholder(id));
      const subscriber = await client.query("SELECT unsubscribed_at FROM newsletter_subscribers");
      assert.ok(subscriber.rows[0].unsubscribed_at);
    } finally {
      await client.query(`DROP SCHEMA ${schema} CASCADE`);
      client.release();
      await real.end();
    }
  },
);
