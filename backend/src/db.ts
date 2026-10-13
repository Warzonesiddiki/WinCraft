import { Pool, PoolClient } from "pg";
import { runMigrations, SCHEMA_MIGRATIONS } from "./migrations";
import { databaseOptions } from "./db-config";

const connectionString = process.env.DATABASE_URL;

// The app boots even without a database configured, so `npm start` never
// crashes just because Railway hasn't provisioned Postgres yet — routes that
// need it check `isConfigured` themselves and fail with a clear 503 instead.
//
// `DATABASE_URL=pgmem` runs against an in-memory pg-mem instance instead of
// a real Postgres server — used by the local test scripts (see package.json
// `test` script) so the SQL itself gets exercised without needing a real
// database installed. Never use this value outside of tests.
let pool: Pool | null = null;
if (connectionString === "pgmem") {
  if (process.env.NODE_ENV === "production") throw new Error("pgmem is test-only");
  // Lazily required: pg-mem is a devDependency, never bundled for a real
  // Postgres deployment, so this branch is the only place that touches it.
  const { newDb } = require("pg-mem");
  const mem = newDb();
  mem.public.registerFunction({ name: "now", implementation: () => new Date() });
  const { Pool: MemPool } = mem.adapters.createPg();
  pool = new MemPool();
} else if (connectionString) {
  pool = new Pool(databaseOptions());
  pool.on("error", () => console.error("Idle database connection failed"));
}

/** All statements in a transaction must use this one checked-out client. */
async function withTransaction<T>(work: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await getPool().connect();
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
      console.error("Database transaction rollback failed");
    }
    throw error;
  } finally {
    client.release(discard);
  }
}

async function initSchema(): Promise<void> {
  if (!pool) return;
  await runMigrations(pool, SCHEMA_MIGRATIONS, connectionString === "pgmem");
}

const isConfigured = Boolean(pool);

/** Preserve only grants that existed before this migration. This is also
 * independently executable so its legacy-data behavior can be verified
 * without replaying every unrelated CREATE TABLE statement. */
async function migrateLegacyProGrants(database: Pick<Pool, "query">): Promise<void> {
  await database.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS legacy_pro_grant BOOLEAN;`);
  await database.query(`
    UPDATE users SET legacy_pro_grant = (is_pro = TRUE AND pro_expires_at IS NULL)
    WHERE legacy_pro_grant IS NULL;
  `);
  await database.query(`ALTER TABLE users ALTER COLUMN legacy_pro_grant SET DEFAULT FALSE;`);
  await database.query(`ALTER TABLE users ALTER COLUMN legacy_pro_grant SET NOT NULL;`);
}

/**
 * Every caller already checks `isConfigured` before touching the database
 * (returning a 503 otherwise) — this just gives TypeScript the same
 * guarantee, so route code can write `getPool().query(...)` instead of a
 * non-null assertion at every call site. Throwing here would only ever mean a
 * route forgot its own `isConfigured` check, which is a bug worth surfacing
 * loudly rather than silently proceeding with a null pool.
 */
function getPool(): Pool {
  if (!pool) {
    throw new Error(
      "database is not configured (DATABASE_URL missing) — check isConfigured before calling getPool()",
    );
  }
  return pool;
}

export { pool, getPool, initSchema, isConfigured, migrateLegacyProGrants, withTransaction };
