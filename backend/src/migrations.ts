import { createHash } from "crypto";
import type { Pool } from "pg";
import { bootstrapStatements } from "./migrations/001-bootstrap";

export type Migration = { version: number; name: string; statements: readonly string[] };
export const SCHEMA_MIGRATIONS: readonly Migration[] = [
  { version: 1, name: "adopt-existing-schema", statements: bootstrapStatements },
  {
    version: 2,
    name: "pending-receipt-index",
    statements: [
      "CREATE INDEX IF NOT EXISTS billing_receipts_pending_idx ON billing_receipts (next_attempt_at) WHERE delivered_at IS NULL",
    ],
  },
];

export function migrationChecksum(migration: Migration): string {
  return createHash("sha256").update(JSON.stringify(migration)).digest("hex");
}

/** Transaction-scoped advisory lock serializes concurrent deploys and is
 * automatically released on commit, rollback or process loss. Each statement,
 * ledger write and schema read uses the same checked-out connection.
 * pg-mem does not implement advisory locks or real rollback; test-only mode
 * skips the lock, never serves production, and does not prove atomicity. */
export async function runMigrations(
  pool: Pick<Pool, "connect">,
  migrations: readonly Migration[] = SCHEMA_MIGRATIONS,
  testDatabase = false,
): Promise<void> {
  if (
    !migrations.length ||
    migrations.some((m, i) => m.version !== i + 1 || !m.name || !m.statements.length)
  ) {
    throw new Error("Migration versions must be a nonempty contiguous sequence starting at 1");
  }
  if (testDatabase && process.env.NODE_ENV === "production")
    throw new Error("Test migration mode cannot run in production");
  const client = await pool.connect();
  let discard = false;
  try {
    await client.query("BEGIN");
    if (!testDatabase) {
      await client.query("SET LOCAL lock_timeout = '10s'");
      // Stable application lock, independent of migration version or replica.
      await client.query("SELECT pg_advisory_xact_lock(1464421970, 1)");
    }
    await client.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY, name TEXT NOT NULL, checksum TEXT NOT NULL,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`);
    const { rows } = await client.query(
      "SELECT version, name, checksum FROM schema_migrations ORDER BY version",
    );
    // Refuse changed history, holes and a schema from a newer application.
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const expected = migrations[i];
      if (
        !expected ||
        row.version !== expected.version ||
        row.name !== expected.name ||
        row.checksum !== migrationChecksum(expected)
      ) {
        throw new Error(
          "Database migration history is incompatible; no schema changes were committed",
        );
      }
    }
    for (const migration of migrations.slice(rows.length)) {
      for (const sql of migration.statements) await client.query(sql);
      await client.query(
        "INSERT INTO schema_migrations (version, name, checksum) VALUES ($1, $2, $3)",
        [migration.version, migration.name, migrationChecksum(migration)],
      );
    }
    await client.query("COMMIT");
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
