import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

process.env.DATABASE_URL = "pgmem";
process.env.NODE_ENV = "test";
const require = createRequire(import.meta.url);
const db = require("../dist/db.js");
const {
  RETENTION,
  RETENTION_BATCH,
  UNCONFIRMED_REVIEW_GRACE_DAYS,
  purgeExpiredData,
} = require("../dist/retention.js");

await db.initSchema();
const pool = db.getPool();
const daysAgo = (n) => new Date(Date.now() - n * 86_400_000);
const count = async (sql, args = []) => (await pool.query(sql, args)).rows.length;

/** An account to hang tokens on: action_tokens has a real foreign key. */
const account = async () => {
  const { rows } = await pool.query(
    "INSERT INTO users (email, password_hash) VALUES ($1, 'fixture') RETURNING id",
    [`retention-${Math.random().toString(36).slice(2)}@example.com`],
  );
  return rows[0].id;
};

/** One row of each pruned kind, `days` old, plus the marker used to identify it. */
async function seed(kind, days, marker) {
  if (kind === "error_reports") {
    await pool.query(
      "INSERT INTO error_reports (app, app_version, message, created_at) VALUES ($1, '1.0.0', $2, $3)",
      ["wincraft", marker, daysAgo(days)],
    );
  } else if (kind === "download_attributions") {
    await pool.query("INSERT INTO download_attributions (utm_source, created_at) VALUES ($1, $2)", [
      marker,
      daysAgo(days),
    ]);
  } else {
    // Expiry is what ages, so a token whose expiry is still ahead survives
    // however old the row is: age alone is not the predicate.
    await pool.query(
      `INSERT INTO action_tokens (user_id, token_hash, purpose, expires_at)
       VALUES ($1, $2, 'password_reset', $3)`,
      [await account(), marker, daysAgo(days)],
    );
  }
}

test("the retention windows are the ones the data inventory documents", () => {
  // docs/DATA-INVENTORY.md is checked against this map by
  // scripts/check-data-inventory.mjs, which is why the numbers appear there
  // verbatim.
  assert.deepEqual(
    RETENTION.map((rule) => [rule.table, rule.days, rule.column]),
    [
      ["error_reports", 180, "created_at"],
      ["download_attributions", 400, "created_at"],
      ["action_tokens", 7, "expires_at"],
    ],
  );
  assert.equal(UNCONFIRMED_REVIEW_GRACE_DAYS, 30);
  assert.ok(RETENTION_BATCH >= 1);
});

test("each table keeps rows inside its window and removes the ones past it", async () => {
  await pool.query("DELETE FROM error_reports");
  await pool.query("DELETE FROM download_attributions");
  await pool.query("DELETE FROM action_tokens");
  await seed("error_reports", 30, "recent-report");
  await seed("error_reports", 400, "old-report");
  await seed("download_attributions", 300, "recent-campaign");
  await seed("download_attributions", 500, "old-campaign");
  await seed("action_tokens", 10, "expired-long-ago");
  await seed("action_tokens", 3, "expired-this-week");
  await seed("action_tokens", -1, "still-valid");

  const removed = await purgeExpiredData(pool);

  assert.deepEqual(removed, {
    error_reports: 1,
    download_attributions: 1,
    action_tokens: 1,
    reviews: 0,
  });
  assert.equal(await count("SELECT 1 FROM error_reports WHERE message = 'recent-report'"), 1);
  assert.equal(await count("SELECT 1 FROM error_reports WHERE message = 'old-report'"), 0);
  assert.equal(
    await count("SELECT 1 FROM download_attributions WHERE utm_source = 'recent-campaign'"),
    1,
  );
  assert.equal(
    await count("SELECT 1 FROM download_attributions WHERE utm_source = 'old-campaign'"),
    0,
  );
  // The rule is "expired a week ago", not "old row": a token that expired this
  // week is still inside its grace period, and one that has not expired at all
  // is untouched no matter how long the row has existed.
  assert.equal(
    await count("SELECT 1 FROM action_tokens WHERE token_hash = 'expired-this-week'"),
    1,
  );
  assert.equal(await count("SELECT 1 FROM action_tokens WHERE token_hash = 'still-valid'"), 1);
  assert.equal(await count("SELECT 1 FROM action_tokens WHERE token_hash = 'expired-long-ago'"), 0);

  // A second pass finds nothing: the purge is idempotent.
  assert.deepEqual(await purgeExpiredData(pool), {
    error_reports: 0,
    download_attributions: 0,
    action_tokens: 0,
    reviews: 0,
  });
});

test("an unconfirmed review is discarded only after its window plus the grace period", async () => {
  await pool.query("DELETE FROM reviews");
  const addReview = (marker, confirmedAt, expiresAt) =>
    pool.query(
      `INSERT INTO reviews (name, email, rating, body, published, confirm_token_hash, confirm_expires_at, confirmed_at)
       VALUES ('Person', $1, 5, 'Body.', $2, 'hash', $3, $4)`,
      [`${marker}@example.com`, Boolean(confirmedAt), expiresAt, confirmedAt],
    );
  await addReview("pending-fresh", null, new Date(Date.now() + 3_600_000));
  await addReview("pending-expired", null, daysAgo(2));
  await addReview("pending-stale", null, daysAgo(90));
  await addReview("published", daysAgo(400), daysAgo(401));

  const removed = await purgeExpiredData(pool);

  assert.equal(removed.reviews, 1);
  assert.equal(await count("SELECT 1 FROM reviews WHERE email = 'pending-fresh@example.com'"), 1);
  assert.equal(
    await count("SELECT 1 FROM reviews WHERE email = 'pending-expired@example.com'"),
    1,
    "inside the grace period the address is still recoverable if the mail was slow",
  );
  assert.equal(await count("SELECT 1 FROM reviews WHERE email = 'pending-stale@example.com'"), 0);
  // Published content is never swept by a timer, however old it is.
  assert.equal(await count("SELECT 1 FROM reviews WHERE email = 'published@example.com'"), 1);
});

test("a large backlog is removed in bounded batches", async () => {
  await pool.query("DELETE FROM error_reports");
  for (let i = 0; i < 5; i++) await seed("error_reports", 300, `backlog-${i}`);
  // A batch of two over five rows: the loop has to run three times, and the
  // count has to be the total rather than the last batch.
  const removed = await purgeExpiredData(pool, new Date(), 2);
  assert.equal(removed.error_reports, 5);
  assert.equal(await count("SELECT 1 FROM error_reports"), 0);
});

test("a bad batch size is refused rather than silently pruning nothing", async () => {
  await assert.rejects(purgeExpiredData(pool, new Date(), 0), /positive integer/);
  await assert.rejects(purgeExpiredData(pool, new Date(), 1.5), /positive integer/);
});

test("the worker runs a pass at startup and stops on request", async () => {
  const { startRetentionWorker } = require("../dist/retention.js");
  let passes = 0;
  const stop = startRetentionWorker(async () => {
    passes++;
    return { error_reports: 3 };
  });
  await new Promise((resolve) => setTimeout(resolve, 10));
  assert.equal(passes, 1, "one pass at startup, so a restart-only deployment still prunes");
  stop();
  await new Promise((resolve) => setTimeout(resolve, 10));
  assert.equal(passes, 1, "stopping cancels the timer");
});

test("a failing pass does not stop later ones", async () => {
  const { startRetentionWorker } = require("../dist/retention.js");
  let passes = 0;
  const stop = startRetentionWorker(async () => {
    passes++;
    throw new Error("Injected retention failure");
  });
  await new Promise((resolve) => setTimeout(resolve, 10));
  assert.equal(passes, 1);
  stop();
});

test(
  "PostgreSQL: the shipped statements prune the real schema",
  { skip: !process.env.TEST_DATABASE_URL },
  async () => {
    process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
    process.env.DATABASE_ALLOW_PLAINTEXT = "true";
    const { Pool } = require("pg");
    const { databaseOptions } = require("../dist/db-config.js");
    const { bootstrapStatements } = require("../dist/migrations/001-bootstrap.js");
    const real = new Pool(databaseOptions());
    const schema = `retention_${process.pid}_${Date.now()}`;
    const client = await real.connect();
    try {
      await client.query(`CREATE SCHEMA ${schema}`);
      await client.query(`SET search_path TO ${schema}`);
      for (const statement of bootstrapStatements) await client.query(statement);

      await client.query(
        "INSERT INTO error_reports (app, app_version, message, created_at) VALUES ('wincraft', '1.0.0', 'old', now() - interval '200 days'), ('wincraft', '1.0.0', 'new', now() - interval '10 days')",
      );
      await client.query(
        "INSERT INTO download_attributions (utm_source, created_at) VALUES ('old', now() - interval '401 days'), ('new', now() - interval '20 days')",
      );
      const { rows: user } = await client.query(
        "INSERT INTO users (email, password_hash) VALUES ('retention@example.com', 'hash') RETURNING id",
      );
      await client.query(
        "INSERT INTO action_tokens (user_id, token_hash, purpose, expires_at) VALUES ($1, 'dead', 'password_reset', now() - interval '10 days'), ($1, 'live', 'password_reset', now() + interval '1 hour')",
        [user[0].id],
      );
      await client.query(
        `INSERT INTO reviews (name, email, rating, body, published, confirm_token_hash, confirm_expires_at)
       VALUES ('Person', 'stale@example.com', 5, 'Body.', FALSE, 'hash', now() - interval '60 days'),
              ('Person', 'fresh@example.com', 5, 'Body.', FALSE, 'hash', now() + interval '1 hour')`,
      );

      const removed = await purgeExpiredData(client, new Date(), 1);
      assert.deepEqual(removed, {
        error_reports: 1,
        download_attributions: 1,
        action_tokens: 1,
        reviews: 1,
      });

      // node-postgres returns rows keyed by column name, not by position, so the
      // column is named explicitly rather than read as row[0].
      const left = async (sql, column) => (await client.query(sql)).rows.map((row) => row[column]);
      assert.deepEqual(await left("SELECT message FROM error_reports", "message"), ["new"]);
      assert.deepEqual(await left("SELECT utm_source FROM download_attributions", "utm_source"), [
        "new",
      ]);
      assert.deepEqual(await left("SELECT token_hash FROM action_tokens", "token_hash"), ["live"]);
      assert.deepEqual(await left("SELECT email FROM reviews", "email"), ["fresh@example.com"]);
    } finally {
      await client.query(`DROP SCHEMA ${schema} CASCADE`);
      client.release();
      await real.end();
    }
  },
);
