import test from "node:test";
import assert from "node:assert/strict";
import {
  redactSecret,
  redactConfig,
  validateProductionConfig,
  loadConfig,
} from "../dist/config.js";

test("secret redaction hides sensitive keys and preserves non-sensitive fields", () => {
  const env = {
    NODE_ENV: "production",
    PORT: "3000",
    JWT_SECRET: "very-secret-token-value-1234567890",
    STRIPE_SECRET_KEY: "sk_live_1234567890abcdef",
    DATABASE_URL: "postgres://user:password@db.railway.app:5432/railway",
    APP_URL: "https://wincraft.app",
    SMTP_PASS: "secretpass123",
  };

  const redacted = redactConfig(env);

  assert.equal(redacted.NODE_ENV, "production");
  assert.equal(redacted.PORT, "3000");
  assert.equal(redacted.APP_URL, "https://wincraft.app");

  // Sensitive keys must be redacted
  assert.equal(redacted.JWT_SECRET.includes("very-secret-token"), false);
  assert.equal(redacted.STRIPE_SECRET_KEY.includes("1234567890"), false);
  assert.equal(redacted.DATABASE_URL.includes("password"), false);
  assert.equal(redacted.SMTP_PASS.includes("secretpass123"), false);

  assert.equal(redactSecret("short"), "********");
  assert.equal(redactSecret(""), "[REDACTED]");
  assert.equal(redactSecret(null), "[REDACTED]");
});

test("validateProductionConfig enforces required variables in production", () => {
  // Non-production passes without variables
  assert.doesNotThrow(() => {
    validateProductionConfig({ NODE_ENV: "development" });
  });

  // Missing JWT_SECRET in production
  assert.throws(
    () => {
      validateProductionConfig({
        NODE_ENV: "production",
        DATABASE_URL: "postgres://localhost/db",
      });
    },
    /Missing required production environment variable: JWT_SECRET/,
  );

  // Short JWT_SECRET in production
  assert.throws(
    () => {
      validateProductionConfig({
        NODE_ENV: "production",
        JWT_SECRET: "short-secret",
        DATABASE_URL: "postgres://localhost/db",
      });
    },
    /Insecure JWT_SECRET in production/,
  );

  // Missing DATABASE_URL in production
  assert.throws(
    () => {
      validateProductionConfig({
        NODE_ENV: "production",
        JWT_SECRET: "a-very-long-production-grade-jwt-secret-string-123456",
      });
    },
    /Missing required production environment variable: DATABASE_URL/,
  );

  // Stripe secret set but webhook missing in production
  assert.throws(
    () => {
      validateProductionConfig({
        NODE_ENV: "production",
        JWT_SECRET: "a-very-long-production-grade-jwt-secret-string-123456",
        DATABASE_URL: "postgres://localhost/db",
        STRIPE_SECRET_KEY: "sk_live_12345",
      });
    },
    /STRIPE_WEBHOOK_SECRET is missing/,
  );

  // Complete valid production config
  assert.doesNotThrow(() => {
    validateProductionConfig({
      NODE_ENV: "production",
      JWT_SECRET: "a-very-long-production-grade-jwt-secret-string-123456",
      DATABASE_URL: "postgres://localhost/db",
      STRIPE_SECRET_KEY: "sk_live_12345",
      STRIPE_WEBHOOK_SECRET: "whsec_12345",
    });
  });
});

test("loadConfig parses structured configuration", () => {
  const config = loadConfig({
    NODE_ENV: "development",
    PORT: "8080",
    CORS_ORIGINS: "https://foo.com, https://bar.com",
  });

  assert.equal(config.isProduction, false);
  assert.equal(config.port, 8080);
  assert.deepEqual(config.corsOrigins, ["https://foo.com", "https://bar.com"]);
});
