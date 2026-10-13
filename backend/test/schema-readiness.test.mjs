import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { fileURLToPath } from "node:url";

// The success case also proves readiness is not satisfied by connectivity
// alone: here PostgreSQL is reachable but the schema never finished migrating.
for (const fails of [true, false])
  test(
    fails
      ? "a failed migration blocks readiness, API writes and schema-dependent workers"
      : "successful initialization enables readiness and starts workers",
    { timeout: 20000 },
    async (t) => {
      const child = spawn(
        process.execPath,
        [
          "-e",
          `
    const http = require('node:http');
    const listen = http.Server.prototype.listen;
    let workers = 0;
    let retention = 0;
    require('./dist/receipt-outbox').startReceiptWorker = () => { workers++; return () => {}; };
    require('./dist/checkout-recovery').startCheckoutReminderWorker = () => { workers++; return () => {}; };
    // Retention prunes tables by name, so it must never start against a schema
    // that failed to migrate: counted separately from the other workers.
    require('./dist/retention').startRetentionWorker = () => { retention++; return () => {}; };
    const db = require('./dist/db');
    if (${fails}) db.initSchema = async () => { throw new Error('Injected migration failure'); };
    http.Server.prototype.listen = function (...args) {
      this.once('listening', async () => {
        // A plain query succeeds: readiness must require more than connectivity.
        await db.getPool().query('SELECT 1');
        process.send({port: this.address().port, workers, retention});
      });
      return listen.apply(this, args);
    };
    process.on('message', () => process.emit('SIGTERM'));
    require('./dist/index');
  `,
        ],
        {
          cwd: fileURLToPath(new URL("../", import.meta.url)),
          env: {
            ...process.env,
            NODE_ENV: "test",
            PORT: "0",
            DATABASE_URL: "pgmem",
            JWT_SECRET: "test-only",
            RESEND_API_KEY: "",
            SMTP_HOST: "",
            STRIPE_SECRET_KEY: "",
            TRUSTED_PROXY_CIDRS: "",
          },
          stdio: ["ignore", "ignore", "ignore", "ipc"],
        },
      );
      t.after(async () => {
        if (child.exitCode === null && child.signalCode === null) {
          const exit = once(child, "exit");
          child.kill();
          await exit;
        }
      });
      const [{ port, workers, retention }] = await once(child, "message", {
        signal: AbortSignal.timeout(10000),
      });
      assert.equal(workers, fails ? 0 : 1);
      assert.equal(
        retention,
        fails ? 0 : 1,
        "retention prunes by table name and needs the migrated schema",
      );
      const base = `http://127.0.0.1:${port}`;
      assert.equal((await fetch(`${base}/health`)).status, 200);
      assert.equal((await fetch(`${base}/ready`)).status, fails ? 503 : 200);
      for (const route of ["/api/account", "/api/auth/register", "/api/stripe-webhook"]) {
        const res = await fetch(base + route, { method: "POST" });
        if (fails) assert.equal(res.status, 503, route);
        else if (route === "/api/auth/register") assert.equal(res.status, 400, route);
        assert.equal(res.headers.get("cache-control"), "no-store");
      }
      const exit = once(child, "exit");
      child.send("stop");
      await exit;
    },
  );

// A reachable database whose readiness query hangs must not hold the deploy
// gate open: the probe is bounded and answers 503 within its own timeout.
test(
  "a hung readiness query fails the gate instead of hanging it",
  { timeout: 20000 },
  async (t) => {
    const child = spawn(
      process.execPath,
      [
        "-e",
        `
    const http = require('node:http');
    const listen = http.Server.prototype.listen;
    const db = require('./dist/db');
    // Bind the original before replacing the property: a closure that called
    // db.getPool() would find the replacement and recurse forever.
    const realPool = db.getPool.bind(db);
    let pool;
    db.getPool = () => (pool ??= realPool());
    http.Server.prototype.listen = function (...args) {
      this.once('listening', () => { pool = realPool(); pool.query = () => new Promise(() => {}); process.send({ port: this.address().port }); });
      return listen.apply(this, args);
    };
    process.on('message', () => process.emit('SIGTERM'));
    require('./dist/index');
  `,
      ],
      {
        cwd: fileURLToPath(new URL("../", import.meta.url)),
        env: {
          ...process.env,
          NODE_ENV: "test",
          PORT: "0",
          DATABASE_URL: "pgmem",
          JWT_SECRET: "test-only",
          RESEND_API_KEY: "",
          SMTP_HOST: "",
          STRIPE_SECRET_KEY: "",
          TRUSTED_PROXY_CIDRS: "",
        },
        stdio: ["ignore", "ignore", "ignore", "ipc"],
      },
    );
    t.after(() => {
      if (child.exitCode === null && child.signalCode === null) child.kill();
    });
    const [{ port }] = await once(child, "message", { signal: AbortSignal.timeout(10000) });
    const started = Date.now();
    const res = await fetch(`http://127.0.0.1:${port}/ready`);
    assert.equal(res.status, 503);
    assert.ok(Date.now() - started < 8000, "readiness answered before the platform timeout");
    assert.equal(
      (await fetch(`http://127.0.0.1:${port}/health`)).status,
      200,
      "liveness stays cheap and independent",
    );
    // The process must stay up: a readiness failure is not a crash.
    assert.equal(child.exitCode, null);
    child.kill();
  },
);
