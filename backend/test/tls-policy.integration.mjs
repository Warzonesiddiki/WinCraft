// Explicit integration fixture: localhost-only server certificate, its trusted
// CA, and an unrelated CA. Never target a production database with test fixtures.
import test from "node:test";
import assert from "node:assert/strict";
import dns from "node:dns";
import { Pool } from "pg";
import { databaseOptions } from "../dist/db-config.js";

const url = process.env.TEST_DATABASE_TLS_URL;
test(
  "PostgreSQL TLS accepts the right CA/hostname and rejects wrong identity",
  { skip: !url },
  async () => {
    dns.setDefaultResultOrder("ipv4first");
    const trusted = process.env.TEST_DATABASE_CA;
    const wrong = process.env.TEST_WRONG_DATABASE_CA;
    assert.ok(trusted && wrong, "Provide both trusted and unrelated CA fixture paths");
    const query = async (connectionString, ca) => {
      const pool = new Pool(
        databaseOptions({ DATABASE_URL: connectionString, DATABASE_CA: ca, NODE_ENV: "test" }),
      );
      try {
        return await pool.query("SELECT 1 AS verified");
      } finally {
        await pool.end();
      }
    };
    assert.equal((await query(url, trusted)).rows[0].verified, 1);
    await assert.rejects(query(url, wrong), (error) =>
      [
        "DEPTH_ZERO_SELF_SIGNED_CERT",
        "SELF_SIGNED_CERT_IN_CHAIN",
        "UNABLE_TO_VERIFY_LEAF_SIGNATURE",
      ].includes(error.code),
    );
    const wrongHost = new URL(url);
    wrongHost.hostname = "127.0.0.1";
    await assert.rejects(
      query(wrongHost.toString(), trusted),
      (error) => error.code === "ERR_TLS_CERT_ALTNAME_INVALID",
    );
  },
);
