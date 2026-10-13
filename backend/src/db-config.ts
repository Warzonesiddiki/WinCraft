import fs from "fs";
import { checkServerIdentity } from "tls";
import type { PoolConfig } from "pg";

/** One TLS policy, independent of pg's connection-string SSL overrides. */
export function databaseOptions(env: NodeJS.ProcessEnv = process.env): PoolConfig {
  const raw = env.DATABASE_URL;
  if (!raw) throw new Error("DATABASE_URL is required");
  const url = new URL(raw);
  if (!["postgres:", "postgresql:"].includes(url.protocol))
    throw new Error("Invalid database protocol");
  if (!url.hostname) throw new Error("DATABASE_URL must specify a hostname");
  for (const key of url.searchParams.keys()) {
    if (/^ssl/i.test(key) || key === "uselibpqcompat") {
      throw new Error(
        "Configure database TLS with DATABASE_CA, not connection-string SSL parameters",
      );
    }
    if (key !== "application_name")
      throw new Error("Only application_name is permitted as a database URL query parameter");
  }
  const hostname = url.hostname.replace(/^\[|\]$/g, "");
  const loopback = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  const plaintext = env.DATABASE_ALLOW_PLAINTEXT === "true";
  if (plaintext && (env.NODE_ENV === "production" || !loopback)) {
    throw new Error("Plaintext database connections are permitted only for local development");
  }
  const value = env.DATABASE_CA?.trim();
  // An explicit broken CA is a configuration error, never a downgrade.
  const ca = value
    ? value.includes("BEGIN CERTIFICATE")
      ? value
      : fs.readFileSync(value, "utf8")
    : undefined;
  if (value && !ca?.includes("BEGIN CERTIFICATE"))
    throw new Error("DATABASE_CA must contain a PEM certificate");
  return {
    connectionString: raw,
    ssl: plaintext
      ? false
      : {
          rejectUnauthorized: true,
          ...(ca ? { ca } : {}),
          // pg wraps an existing socket; with IP hosts Node can otherwise fall
          // back to localhost identity checking. Bind verification to the actual
          // URL hostname explicitly, for both DNS names and IP literals.
          checkServerIdentity: (_serverName, certificate) =>
            checkServerIdentity(hostname, certificate),
        },
    max: 10,
    connectionTimeoutMillis: 5_000,
    query_timeout: 15_000,
    statement_timeout: 15_000,
    idleTimeoutMillis: 30_000,
  };
}
