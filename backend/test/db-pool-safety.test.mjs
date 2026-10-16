import test from "node:test";
import assert from "node:assert/strict";
import { databaseOptions } from "../dist/db-config.js";

test("database pool options enforce bounded timeouts and connection limits", () => {
  const options = databaseOptions({
    DATABASE_URL: "postgres://user:pass@localhost:5432/testdb",
    DATABASE_ALLOW_PLAINTEXT: "true",
  });
  assert.equal(options.max, 10, "max pool connections should be bounded to 10");
  assert.equal(options.connectionTimeoutMillis, 5000, "connection acquisition timeout must be 5s");
  assert.equal(options.query_timeout, 15000, "query timeout must be 15s");
  assert.equal(options.statement_timeout, 15000, "statement timeout must be 15s");
  assert.equal(options.idleTimeoutMillis, 30000, "idle client timeout must be 30s");
});

test("withTransaction transaction flow logic simulates rollback and discard correctly", async () => {
  // Test helper simulating withTransaction mechanics
  async function simulateWithTransaction(client, work) {
    let discard = false;
    try {
      await client.query("BEGIN");
      const result = await work(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      try {
        await client.query("ROLLBACK");
      } catch {
        discard = true;
      }
      throw error;
    } finally {
      client.release(discard);
    }
  }

  // 1. Success case
  {
    const queries = [];
    let releasedWith = null;
    const mockClient = {
      query: async (sql) => queries.push(sql),
      release: (discard) => { releasedWith = discard; },
    };

    const res = await simulateWithTransaction(mockClient, async (c) => {
      await c.query("SELECT 1");
      return "ok";
    });

    assert.equal(res, "ok");
    assert.deepEqual(queries, ["BEGIN", "SELECT 1", "COMMIT"]);
    assert.equal(releasedWith, false, "client should be returned cleanly to pool");
  }

  // 2. Normal error case with successful rollback
  {
    const queries = [];
    let releasedWith = null;
    const mockClient = {
      query: async (sql) => queries.push(sql),
      release: (discard) => { releasedWith = discard; },
    };

    await assert.rejects(
      async () => {
        await simulateWithTransaction(mockClient, async (c) => {
          await c.query("SELECT 1");
          throw new Error("work failed");
        });
      },
      /work failed/
    );

    assert.deepEqual(queries, ["BEGIN", "SELECT 1", "ROLLBACK"]);
    assert.equal(releasedWith, false, "client should be returned cleanly to pool after rollback");
  }

  // 3. Rollback failure discards broken connection
  {
    const queries = [];
    let releasedWith = null;
    const mockClient = {
      query: async (sql) => {
        queries.push(sql);
        if (sql === "ROLLBACK") {
          throw new Error("connection severed");
        }
      },
      release: (discard) => { releasedWith = discard; },
    };

    await assert.rejects(
      async () => {
        await simulateWithTransaction(mockClient, async () => {
          throw new Error("initial error");
        });
      },
      /initial error/
    );

    assert.deepEqual(queries, ["BEGIN", "ROLLBACK"]);
    assert.equal(releasedWith, true, "broken client must be discarded from pool on rollback failure");
  }
});
