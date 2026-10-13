import test from "node:test";
import assert from "node:assert/strict";
import { limitAuthWork } from "../dist/auth-work-guard.js";

test("rotating source/email cannot exceed global work or active capacity", async () => {
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  const statuses = [];
  const response = () => ({
    status(n) {
      statuses.push(n);
      return this;
    },
    json() {},
  });
  const handler = limitAuthWork("capacity-test", async () => gate);
  const req = {
    body: { email: "rotating@example.com" },
    headers: { "x-forwarded-for": "spoofed" },
  };
  const calls = Array.from({ length: 4 }, () => handler(req, response(), () => {}));
  await handler(req, response(), () => {});
  assert.deepEqual(statuses, [503]);
  release();
  await Promise.all(calls);
  let completed = false;
  await limitAuthWork("capacity-test", async () => {
    completed = true;
  })(req, response(), () => {});
  assert.equal(completed, true);
  const registrations = limitAuthWork("register", async () => {});
  for (let i = 0; i < 101; i++)
    await registrations({ body: { email: `rotating-${i}@example.com` } }, response(), () => {});
  assert.equal(statuses.at(-1), 429);
});

test("a thrown handler releases capacity and reaches error middleware", async () => {
  let error;
  const handler = limitAuthWork("failure-test", async () => {
    throw new Error("test failure");
  });
  for (let i = 0; i < 5; i++)
    await handler({}, {}, (e) => {
      error = e;
    });
  assert.match(error.message, /test failure/);
});
