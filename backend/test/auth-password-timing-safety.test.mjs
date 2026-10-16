import test from "node:test";
import assert from "node:assert/strict";

const { isValidPassword, hashPassword, verifyPassword } = await import("../dist/auth.js");
const { hashToken, consumeActionToken } = await import("../dist/tokens.js");

test("password hashing parameters and entropy validation", async () => {
  // 1. Minimum entropy: Reject all-whitespace passwords
  assert.equal(isValidPassword("        "), false, "All-whitespace passwords must be rejected");
  assert.equal(isValidPassword("   abc  "), false, "Trimmed length < 8 must be rejected");
  assert.equal(isValidPassword("short"), false, "Passwords < 8 chars must be rejected");
  assert.equal(isValidPassword(null), false);
  assert.equal(isValidPassword(undefined), false);

  // 2. Accept valid passwords >= 8 chars within 72 bytes
  assert.equal(isValidPassword("password123"), true);
  assert.equal(isValidPassword("correct-horse-battery-staple"), true);
  assert.equal(isValidPassword("P@ssw0rd!#%&"), true);

  // 3. Reject passwords exceeding bcrypt 72 byte limit
  assert.equal(isValidPassword("a".repeat(73)), false);
  assert.equal(isValidPassword("🔒".repeat(19)), false); // 19 * 4 = 76 bytes

  // 4. Verify bcrypt cost factor is 12 (OWASP recommended)
  const hash = await hashPassword("my-secure-password-123");
  assert.ok(hash.startsWith("$2b$12$") || hash.startsWith("$2a$12$"), "Hash must use cost factor 12");
  assert.equal(await verifyPassword("my-secure-password-123", hash), true);
  assert.equal(await verifyPassword("wrong-password", hash), false);
});

test("reset token generation entropy and safe lookup", async () => {
  // Tokens use SHA-256 hashing before DB query to neutralize string comparison timing leaks
  const rawToken = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
  const hashed = hashToken(rawToken);
  assert.equal(hashed.length, 64, "SHA-256 hex hash must be 64 characters");

  // consumeActionToken safely rejects invalid inputs without throwing
  assert.equal(await consumeActionToken(null, "password_reset", { query: async () => {} }), null);
  assert.equal(await consumeActionToken("", "password_reset", { query: async () => {} }), null);
});
