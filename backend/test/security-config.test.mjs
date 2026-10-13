import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { databaseOptions } from "../dist/db-config.js";
import { trustedProxies } from "../dist/proxy-policy.js";

const remote = "postgres://user:password@db.example.invalid/database";
test("remote TLS always verifies; explicit broken CA never downgrades", () => {
  assert.equal(databaseOptions({ DATABASE_URL: remote }).ssl.rejectUnauthorized, true);
  assert.throws(() =>
    databaseOptions({
      DATABASE_URL: remote,
      DATABASE_CA: path.join(tmpdir(), "no-audit-ca-here.pem"),
    }),
  );
  const dir = mkdtempSync(path.join(tmpdir(), "wincraft-ca-"));
  try {
    const ca = "-----BEGIN CERTIFICATE-----\nfixture\n-----END CERTIFICATE-----";
    const file = path.join(dir, "ca.pem");
    writeFileSync(file, ca);
    assert.equal(databaseOptions({ DATABASE_URL: remote, DATABASE_CA: file }).ssl.ca, ca);
    assert.equal(databaseOptions({ DATABASE_URL: remote, DATABASE_CA: ca }).ssl.ca, ca);
    writeFileSync(file, "not a CA");
    assert.throws(() => databaseOptions({ DATABASE_URL: remote, DATABASE_CA: file }), /PEM/);
  } finally {
    rmSync(dir, { recursive: true });
  }
});

test("URL parameters cannot override the TLS policy or spoof a local host", () => {
  for (const parameter of [
    "sslmode=disable",
    "sslmode=require",
    "sslrootcert=other.pem",
    "ssl=false",
    "uselibpqcompat=true",
  ]) {
    assert.throws(
      () => databaseOptions({ DATABASE_URL: `${remote}?${parameter}` }),
      /connection-string SSL/,
    );
  }
  const misleading = "postgres://localhost:password@db.example.invalid/localhost";
  assert.equal(databaseOptions({ DATABASE_URL: misleading }).ssl.rejectUnauthorized, true);
  assert.throws(
    () => databaseOptions({ DATABASE_URL: misleading, DATABASE_ALLOW_PLAINTEXT: "true" }),
    /local development/,
  );
  assert.throws(
    () =>
      databaseOptions({
        DATABASE_URL: "postgres://user@localhost/db?host=remote.example",
        DATABASE_ALLOW_PLAINTEXT: "true",
      }),
    /query parameter/,
  );
  const local = "postgres://user:password@localhost/database";
  assert.equal(
    databaseOptions({ DATABASE_URL: local, DATABASE_ALLOW_PLAINTEXT: "true", NODE_ENV: "test" })
      .ssl,
    false,
  );
  assert.throws(() =>
    databaseOptions({
      DATABASE_URL: local,
      DATABASE_ALLOW_PLAINTEXT: "true",
      NODE_ENV: "production",
    }),
  );
  assert.equal(databaseOptions({ DATABASE_URL: remote }).connectionTimeoutMillis, 5000);
  const cert = { subject: { CN: "localhost" }, subjectaltname: "DNS:localhost" };
  const ipOptions = databaseOptions({ DATABASE_URL: "postgres://user@127.0.0.1/db" });
  assert.equal(
    ipOptions.ssl.checkServerIdentity("localhost", cert).code,
    "ERR_TLS_CERT_ALTNAME_INVALID",
  );
});

test("proxy trust defaults off and rejects hop counts and wildcard networks", () => {
  assert.equal(trustedProxies(""), false);
  assert.deepEqual(trustedProxies("127.0.0.1, 10.12.0.0/24"), ["127.0.0.1", "10.12.0.0/24"]);
  for (const value of ["1", "true", "0.0.0.0/0", "::/0", "10.0.0.1/33", "10.0.0.1/8/extra"])
    assert.throws(() => trustedProxies(value));
});
