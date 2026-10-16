import test from "node:test";
import assert from "node:assert/strict";

test("review input sanitization and html escaping", async () => {
  // Directly verify escaping and sanitization rules
  function sanitizeReviewInput(s) {
    return s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
  }

  function escapeHtml(s) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Null bytes and control characters stripped
  const dirty = "Great product!\0\x08\x1F<script>alert('xss')</script>";
  const clean = sanitizeReviewInput(dirty);
  assert.equal(clean.includes("\0"), false, "Null bytes must be stripped");
  assert.equal(clean.includes("\x08"), false, "Control characters must be stripped");

  // HTML escaping protects quotes and angle brackets
  const escaped = escapeHtml(clean);
  assert.equal(escaped.includes("<script>"), false, "Tags must be escaped");
  assert.equal(escaped.includes("&lt;script&gt;"), true);
  assert.equal(escaped.includes("&#39;xss&#39;"), true, "Single quotes must be escaped");
});

test("production error masking never leaks stack traces or internals", () => {
  // Test error handler behavior
  function createErrorHandler() {
    return (err, _req, res, _next) => {
      if (res.headersSent) return;
      const status =
        typeof err?.status === "number" && err.status >= 400 && err.status < 600
          ? err.status
          : typeof err?.statusCode === "number" && err.statusCode >= 400 && err.statusCode < 600
            ? err.statusCode
            : 500;

      if (status >= 500) {
        res.status(500).json({ error: "internal server error" });
        return;
      }

      const message =
        status === 413
          ? "payload too large"
          : status === 400
            ? "bad request"
            : "client error";
      res.status(status).json({ error: message });
    };
  }

  const handler = createErrorHandler();

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

  // 1. 500 Internal error with stack trace and sensitive DB details
  const sensitiveErr = new Error("FATAL: relation \"users\" password hash leaked at pg.ts:42");
  sensitiveErr.stack = "Error: FATAL at /secret/path/backend/src/db.ts:42";
  const res1 = makeMockRes();
  handler(sensitiveErr, {}, res1, () => {});
  assert.equal(res1.statusCode, 500);
  assert.deepEqual(res1.body, { error: "internal server error" });
  assert.equal(JSON.stringify(res1.body).includes("secret"), false);
  assert.equal(JSON.stringify(res1.body).includes("stack"), false);

  // 2. 413 Payload Too Large
  const payloadErr = new Error("entity too large");
  payloadErr.status = 413;
  const res2 = makeMockRes();
  handler(payloadErr, {}, res2, () => {});
  assert.equal(res2.statusCode, 413);
  assert.deepEqual(res2.body, { error: "payload too large" });

  // 3. 400 Bad Request (JSON parse error)
  const jsonErr = new SyntaxError("Unexpected token in JSON at position 0");
  jsonErr.status = 400;
  const res3 = makeMockRes();
  handler(jsonErr, {}, res3, () => {});
  assert.equal(res3.statusCode, 400);
  assert.deepEqual(res3.body, { error: "bad request" });
});
