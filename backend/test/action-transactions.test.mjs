import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
process.env.DATABASE_URL = "pgmem";
process.env.NODE_ENV = "test";
const require = createRequire(import.meta.url);
const db = require("../dist/db.js");
const hashToken = (raw) => createHash("sha256").update(raw).digest("hex");
const router = require("../dist/routes/auth.js").default;
await db.initSchema();

// Fault injection checks route composition against a transactional client.
// pg-mem does NOT implement rollback; real PostgreSQL coverage is separate.
for (const endpoint of ["verify-email", "reset-password"]) {
  test(`${endpoint}: failed account write rolls back token consumption, then retry commits`, async () => {
    const pool = db.getPool();
    const connect = pool.connect;
    const rawToken = "a".repeat(64);
    let committed = { used: false, changed: false };
    let failWrite = true;
    let releases = 0;
    const statements = [];
    pool.connect = async () => {
      let pending;
      return {
        async query(sql, args) {
          statements.push(sql);
          if (sql === "BEGIN") pending = { ...committed };
          else if (sql === "COMMIT") committed = pending;
          else if (sql === "ROLLBACK") pending = null;
          else if (sql.startsWith("UPDATE action_tokens")) {
            assert.equal(args[0], hashToken(rawToken));
            if (pending.used) return { rows: [], rowCount: 0 };
            pending.used = true;
            return { rows: [{ user_id: 999 }], rowCount: 1 };
          } else if (sql.startsWith("UPDATE users")) {
            if (failWrite) throw new Error("Injected account write failure");
            pending.changed = true;
          } else throw new Error(`Unexpected transaction statement: ${sql}`);
          return { rows: [], rowCount: 1 };
        },
        release() {
          releases++;
        },
      };
    };
    try {
      const layer = router.stack.find(
        (entry) =>
          entry.route?.path === `/${endpoint}` &&
          entry.route.methods[endpoint === "verify-email" ? "get" : "post"],
      );
      const handler = layer.route.stack.at(-1).handle;
      const request = {
        query: { token: rawToken },
        body: { token: rawToken, newPassword: "valid-password" },
        get: () => "application/json",
      };
      let status;
      const response = {
        status(n) {
          status = n;
          return this;
        },
        send() {},
        json() {},
      };
      await handler(request, response, (err) => {
        throw err;
      });
      assert.equal(status, 500);
      assert.deepEqual(committed, { used: false, changed: false });
      assert.ok(statements.includes("ROLLBACK"));
      failWrite = false;
      status = 200;
      await handler(request, response, (err) => {
        throw err;
      });
      assert.equal(status, 200);
      assert.deepEqual(committed, { used: true, changed: true });
      assert.equal(releases, 2);
      assert.equal(statements.filter((s) => s === "COMMIT").length, 1);
    } finally {
      pool.connect = connect;
    }
  });
}
