import test from "node:test";
import assert from "node:assert/strict";

const module = await import("../dist/routes/auth.js");
const router = module.default.default || module.default;

test("auth routes have route-specific rate limiting middleware (SIG-4)", () => {
  const routes = [
    { path: "/login", expectedMiddlewares: 2 }, // loginLimiter, limitAuthWork(handler)
    { path: "/register", expectedMiddlewares: 2 }, // registerLimiter, limitAuthWork(handler)
    { path: "/forgot-password", expectedMiddlewares: 2 }, // forgotPasswordLimiter, handler
    { path: "/reset-password", expectedMiddlewares: 2 }, // resetPasswordLimiter, limitAuthWork(handler)
  ];

  for (const { path, expectedMiddlewares } of routes) {
    const layer = router.stack.find(
      (entry) => entry.route?.path === path && entry.route.methods.post,
    );
    assert.ok(layer, `Route ${path} must exist`);
    assert.equal(
      layer.route.stack.length,
      expectedMiddlewares,
      `Route ${path} stack count mismatch`,
    );
  }
});

test("/login rate limiter blocks requests exceeding 10 per minute per IP", async () => {
  const layer = router.stack.find(
    (entry) => entry.route?.path === "/login" && entry.route.methods.post,
  );
  assert.ok(layer);
  const loginLimiter = layer.route.stack[0].handle;

  let statusCode = 200;
  let responseBody = null;
  const headers = {};

  const createReq = (ip) => ({
    ip,
    headers: {},
    app: { get: () => false },
  });

  const createRes = () => ({
    setHeader(name, val) {
      headers[name.toLowerCase()] = val;
      return this;
    },
    getHeader(name) {
      return headers[name.toLowerCase()];
    },
    status(code) {
      statusCode = code;
      return this;
    },
    send(body) {
      responseBody = body;
      return this;
    },
    json(body) {
      responseBody = body;
      return this;
    },
  });

  const testIp = "10.99.88.77";

  // First 10 requests pass
  for (let i = 0; i < 10; i++) {
    let nextCalled = false;
    await loginLimiter(createReq(testIp), createRes(), () => {
      nextCalled = true;
    });
    assert.equal(nextCalled, true, `Request ${i + 1} should have passed`);
  }

  // 11th request is rate-limited
  let nextCalledOn11th = false;
  await loginLimiter(createReq(testIp), createRes(), () => {
    nextCalledOn11th = true;
  });

  assert.equal(nextCalledOn11th, false, "11th request should not call next()");
  assert.equal(statusCode, 429, "11th request should receive 429 status code");
  assert.deepEqual(responseBody, { error: "Too many login attempts. Try again later." });

  // A different IP is not affected
  let differentIpNextCalled = false;
  await loginLimiter(createReq("10.99.88.78"), createRes(), () => {
    differentIpNextCalled = true;
  });
  assert.equal(differentIpNextCalled, true, "Different IP should not be blocked");
});

test("/register rate limiter blocks requests exceeding 5 per hour per IP", async () => {
  const layer = router.stack.find(
    (entry) => entry.route?.path === "/register" && entry.route.methods.post,
  );
  assert.ok(layer);
  const registerLimiter = layer.route.stack[0].handle;

  let statusCode = 200;
  let responseBody = null;
  const headers = {};

  const createReq = (ip) => ({
    ip,
    headers: {},
    app: { get: () => false },
  });

  const createRes = () => ({
    setHeader(name, val) {
      headers[name.toLowerCase()] = val;
      return this;
    },
    getHeader(name) {
      return headers[name.toLowerCase()];
    },
    status(code) {
      statusCode = code;
      return this;
    },
    send(body) {
      responseBody = body;
      return this;
    },
    json(body) {
      responseBody = body;
      return this;
    },
  });

  const testIp = "10.99.88.99";

  // First 5 requests pass
  for (let i = 0; i < 5; i++) {
    let nextCalled = false;
    await registerLimiter(createReq(testIp), createRes(), () => {
      nextCalled = true;
    });
    assert.equal(nextCalled, true, `Register request ${i + 1} should pass`);
  }

  // 6th request is rate-limited
  let nextCalledOn6th = false;
  await registerLimiter(createReq(testIp), createRes(), () => {
    nextCalledOn6th = true;
  });

  assert.equal(nextCalledOn6th, false, "6th request should not call next()");
  assert.equal(statusCode, 429, "6th request should receive 429 status code");
  assert.deepEqual(responseBody, { error: "Too many accounts created from this IP. Try again later." });
});

test("/forgot-password rate limiter blocks requests exceeding 3 per hour per email", async () => {
  const layer = router.stack.find(
    (entry) => entry.route?.path === "/forgot-password" && entry.route.methods.post,
  );
  assert.ok(layer);
  const forgotPasswordLimiter = layer.route.stack[0].handle;

  let statusCode = 200;
  let responseBody = null;
  const headers = {};

  const createReq = (email, ip) => ({
    ip,
    body: { email },
    headers: {},
    app: { get: () => false },
  });

  const createRes = () => ({
    setHeader(name, val) {
      headers[name.toLowerCase()] = val;
      return this;
    },
    getHeader(name) {
      return headers[name.toLowerCase()];
    },
    status(code) {
      statusCode = code;
      return this;
    },
    send(body) {
      responseBody = body;
      return this;
    },
    json(body) {
      responseBody = body;
      return this;
    },
  });

  const targetEmail = "victim@example.com";

  // First 3 requests pass
  for (let i = 0; i < 3; i++) {
    let nextCalled = false;
    await forgotPasswordLimiter(createReq(targetEmail, `192.168.1.${i + 1}`), createRes(), () => {
      nextCalled = true;
    });
    assert.equal(nextCalled, true, `Forgot password request ${i + 1} should pass`);
  }

  // 4th request from any IP for the same email is rate-limited
  let nextCalledOn4th = false;
  await forgotPasswordLimiter(createReq(targetEmail, "192.168.1.99"), createRes(), () => {
    nextCalledOn4th = true;
  });

  assert.equal(nextCalledOn4th, false, "4th request should not call next()");
  assert.equal(statusCode, 429, "4th request should receive 429 status code");
  assert.deepEqual(responseBody, { error: "Too many reset requests. Try again later." });
});
