import test from "node:test";
import assert from "node:assert/strict";

const TEST_SECRET = "test-secret-key-that-is-at-least-32-characters-long!";
process.env.JWT_SECRET = TEST_SECRET;

import jwt from "jsonwebtoken";

const { signToken, verifyToken, renewedToken, requireAuth } = await import("../dist/auth.js");
const routerModule = await import("../dist/routes/auth.js");
const router = routerModule.default.default || routerModule.default;

test("session token signing and expiration mechanics", () => {
  const token = signToken(42, 1);
  assert.ok(token);

  const payload = verifyToken(token);
  assert.equal(payload.sub, 42);
  assert.equal(payload.tv, 1);
  assert.ok(payload.exp > payload.iat);

  // Expired token verification fails
  const expiredToken = jwt.sign(
    { sub: 42, tv: 1, iat: Math.floor(Date.now() / 1000) - 86400 * 10 },
    TEST_SECRET,
    { expiresIn: 1 },
  );
  assert.equal(verifyToken(expiredToken), null);
});

test("renewedToken sliding session renewal and edge cases", () => {
  const now = Math.floor(Date.now() / 1000);

  // 1. Fresh token (< 1 day old) does not renew
  const freshPayload = {
    sub: 42,
    tv: 1,
    iat: now - 3600, // 1 hour old
    exp: now + 86400 * 6,
  };
  assert.equal(renewedToken(freshPayload, now), null);

  // 2. Token older than 1 day renews
  const oldPayload = {
    sub: 42,
    tv: 1,
    iat: now - 86400 * 2, // 2 days old
    exp: now + 86400 * 5,
  };
  const renewed = renewedToken(oldPayload, now);
  assert.ok(renewed);
  const renewedPayload = verifyToken(renewed);
  assert.equal(renewedPayload.sub, 42);

  // 3. Already expired token must NOT renew
  const expiredPayload = {
    sub: 42,
    tv: 1,
    iat: now - 86400 * 8,
    exp: now - 10, // expired 10 seconds ago
  };
  assert.equal(renewedToken(expiredPayload, now), null);

  // 4. Invalid or non-integer sub must NOT renew
  assert.equal(renewedToken({ sub: "bad", tv: 1, iat: now - 86400 * 2, exp: now + 86400 }, now), null);
  assert.equal(renewedToken({ sub: -5, tv: 1, iat: now - 86400 * 2, exp: now + 86400 }, now), null);
  assert.equal(renewedToken({ sub: 0, tv: 1, iat: now - 86400 * 2, exp: now + 86400 }, now), null);
});

test("requireAuth middleware rejects malformed and expired tokens with 401", async () => {
  const makeMockRes = () => {
    let statusCode = 200;
    let body = null;
    return {
      status(c) {
        statusCode = c;
        return this;
      },
      json(b) {
        body = b;
        return this;
      },
      get statusCode() {
        return statusCode;
      },
      get body() {
        return body;
      },
    };
  };

  // Missing Authorization header
  {
    const res = makeMockRes();
    let nextCalled = false;
    await requireAuth({ headers: {} }, res, () => { nextCalled = true; });
    assert.equal(nextCalled, false);
    assert.equal(res.statusCode, 401);
  }

  // Malformed token string
  {
    const res = makeMockRes();
    let nextCalled = false;
    await requireAuth({ headers: { authorization: "Bearer invalid.token.value" } }, res, () => { nextCalled = true; });
    assert.equal(nextCalled, false);
    assert.equal(res.statusCode, 401);
  }

  // Token signed with wrong secret
  {
    const wrongToken = jwt.sign({ sub: 42, tv: 0 }, "wrong-secret-key-123456789012345");
    const res = makeMockRes();
    let nextCalled = false;
    await requireAuth({ headers: { authorization: `Bearer ${wrongToken}` } }, res, () => { nextCalled = true; });
    assert.equal(nextCalled, false);
    assert.equal(res.statusCode, 401);
  }

  // Token with non-numeric sub
  {
    const badSubToken = jwt.sign({ sub: "admin", tv: 0 }, TEST_SECRET);
    const res = makeMockRes();
    let nextCalled = false;
    await requireAuth({ headers: { authorization: `Bearer ${badSubToken}` } }, res, () => { nextCalled = true; });
    assert.equal(nextCalled, false);
    assert.equal(res.statusCode, 401);
  }
});

test("POST /refresh endpoint is registered on router", () => {
  const refreshRoute = router.stack.find(
    (entry) => entry.route?.path === "/refresh" && entry.route.methods.post,
  );
  assert.ok(refreshRoute, "POST /refresh route must exist");
  assert.ok(refreshRoute.route.stack.length >= 2, "POST /refresh must have requireAuth and handler");
});
