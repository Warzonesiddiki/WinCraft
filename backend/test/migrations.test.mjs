import test from "node:test";
import assert from "node:assert/strict";
import { runMigrations, migrationChecksum, SCHEMA_MIGRATIONS } from "../dist/migrations.js";

function database(initial = []) {
  let committed = { ledger: initial, changes: [] };
  const calls = [];
  let released = 0;
  return {
    calls,
    state: () => committed,
    releases: () => released,
    pool: {
      async connect() {
        let pending;
        return {
          async query(sql, args) {
            calls.push(sql);
            if (sql === "BEGIN") pending = structuredClone(committed);
            else if (sql === "COMMIT") committed = pending;
            else if (sql === "ROLLBACK") pending = null;
            else if (sql.startsWith("SELECT version")) return { rows: pending.ledger };
            else if (sql.startsWith("INSERT INTO schema_migrations"))
              pending.ledger.push({ version: args[0], name: args[1], checksum: args[2] });
            else if (sql === "FAIL") throw new Error("Injected migration failure");
            else if (sql.startsWith("APPLY")) pending.changes.push(sql);
            return { rows: [] };
          },
          release() {
            released++;
          },
        };
      },
    },
  };
}
const migrations = [
  { version: 1, name: "first", statements: ["APPLY 1"] },
  { version: 2, name: "second", statements: ["APPLY 2"] },
];

test("runs migrations on one locked connection and never replays applied history", async () => {
  const db = database();
  await runMigrations(db.pool, migrations);
  assert.deepEqual(db.state().changes, ["APPLY 1", "APPLY 2"]);
  assert.ok(db.calls.some((s) => s.includes("pg_advisory_xact_lock")));
  await runMigrations(db.pool, migrations);
  assert.deepEqual(db.state().changes, ["APPLY 1", "APPLY 2"]);
  assert.equal(db.state().ledger.length, 2);
  assert.equal(db.releases(), 2);
});

test("a failed later migration rolls back both statements and ledger updates", async () => {
  const db = database();
  await runMigrations(db.pool, migrations.slice(0, 1));
  const before = structuredClone(db.state());
  await assert.rejects(
    runMigrations(db.pool, [migrations[0], { ...migrations[1], statements: ["APPLY 2", "FAIL"] }]),
    /Injected/,
  );
  assert.deepEqual(db.state(), before);
  assert.equal(db.calls.at(-1), "ROLLBACK");
});

test("modified, missing and newer history fail closed", async () => {
  const row = { version: 1, name: migrations[0].name, checksum: migrationChecksum(migrations[0]) };
  for (const ledger of [
    [{ ...row, checksum: "tampered" }],
    [{ ...row, version: 2 }],
    [
      row,
      { version: 2, name: "second", checksum: migrationChecksum(migrations[1]) },
      { ...row, version: 3 },
    ],
  ]) {
    const db = database(ledger);
    await assert.rejects(runMigrations(db.pool, migrations), /incompatible/);
    assert.deepEqual(db.state().changes, []);
  }
  await assert.rejects(runMigrations(database().pool, [migrations[1]]), /contiguous/);
});

test("all checked-in migration definitions are sequential and nonempty", () => {
  assert.deepEqual(
    SCHEMA_MIGRATIONS.map((m) => m.version),
    [1, 2],
  );
  assert.equal(SCHEMA_MIGRATIONS[0].statements.length, 38);
  assert.match(SCHEMA_MIGRATIONS[1].statements[0], /WHERE delivered_at IS NULL/);
});
