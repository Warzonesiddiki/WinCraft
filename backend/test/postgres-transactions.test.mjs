import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

// CI supplies a disposable PostgreSQL service; local runs without it explicitly
// skip rather than pretending pg-mem can test transaction rollback/locking.
test(
  "PostgreSQL: account/token rollback and concurrent single-use consumption",
  { skip: !process.env.TEST_DATABASE_URL },
  async () => {
    process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
    process.env.NODE_ENV = "test";
    process.env.DATABASE_ALLOW_PLAINTEXT = "true";
    const require = createRequire(import.meta.url);
    const { getPool, withTransaction } = require("../dist/db.js");
    const { createActionToken, consumeActionToken } = require("../dist/tokens.js");
    const pool = getPool();
    const schema = `audit_${process.pid}_${Date.now()}`;
    const originalConnect = pool.connect;
    await pool.query(`CREATE SCHEMA ${schema}`);
    // Isolate all test rows/tables in a disposable schema, not public.
    pool.connect = function (callback) {
      if (callback) {
        originalConnect.call(pool, async (error, client, release) => {
          if (error) return callback(error);
          try {
            await client.query(`SET search_path TO ${schema}`);
            callback(null, client, release);
          } catch (err) {
            release(err);
            callback(err);
          }
        });
        return;
      }
      return originalConnect.call(pool).then(async (client) => {
        try {
          await client.query(`SET search_path TO ${schema}`);
          return client;
        } catch (error) {
          client.release(error);
          throw error;
        }
      });
    };
    try {
      await pool.query(
        "CREATE TABLE users (id SERIAL PRIMARY KEY, token_version INTEGER NOT NULL DEFAULT 0)",
      );
      await pool.query(
        "CREATE TABLE action_tokens (user_id INTEGER REFERENCES users(id), token_hash TEXT, purpose TEXT, expires_at TIMESTAMPTZ, used_at TIMESTAMPTZ)",
      );
      const { rows } = await pool.query("INSERT INTO users DEFAULT VALUES RETURNING id");
      const id = rows[0].id;
      const token = await createActionToken(id, "password_reset", 60_000);
      await assert.rejects(
        withTransaction(async (client) => {
          assert.equal(await consumeActionToken(token, "password_reset", client), id);
          await client.query("UPDATE users SET token_version = token_version + 1 WHERE id = $1", [
            id,
          ]);
          await client.query("SELECT 1 / 0");
        }),
      );
      assert.equal((await pool.query("SELECT used_at FROM action_tokens")).rows[0].used_at, null);
      assert.equal((await pool.query("SELECT token_version FROM users")).rows[0].token_version, 0);
      const consume = () =>
        withTransaction(async (client) => {
          const userId = await consumeActionToken(token, "password_reset", client);
          if (userId)
            await client.query("UPDATE users SET token_version = token_version + 1 WHERE id = $1", [
              userId,
            ]);
          return userId;
        });
      const results = await Promise.all([consume(), consume()]);
      assert.equal(results.filter((value) => value === id).length, 1);
      assert.equal((await pool.query("SELECT token_version FROM users")).rows[0].token_version, 1);
    } finally {
      pool.connect = originalConnect;
      await pool.query(`DROP SCHEMA ${schema} CASCADE`);
      await pool.end();
    }
  },
);
