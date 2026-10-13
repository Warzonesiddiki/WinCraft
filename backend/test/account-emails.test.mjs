import test from "node:test";
import assert from "node:assert/strict";

const {
  verificationText,
  passwordResetText,
  passwordChangedText,
  accountWelcomeText,
  accountWelcomeHtml,
  accountWelcomeSubject,
  accountDeletedHtml,
  accountDeletedSubject,
  accountDeletedText,
  passwordChangedHtml,
  passwordChangedSubject,
  passwordResetHtml,
  passwordResetSubject,
  verificationHtml,
  verificationSubject,
} = await import("../dist/emails/account.js");

const WHEN = "Mon, 01 Sep 2026 09:14:00 GMT";

const LINK = "https://api.pctweaker.app/api/auth/verify-email?token=abc&x=1";

test("plain-text messages preserve action URLs, expiry and account details", () => {
  assert.ok(verificationText(LINK).includes(LINK));
  assert.match(verificationText(LINK), /24 hours/);
  assert.ok(passwordResetText(LINK).includes(LINK));
  assert.match(passwordResetText(LINK), /once.*one hour/);
  assert.ok(passwordChangedText(WHEN).includes(WHEN));
  assert.match(accountWelcomeText(), /All WinCraft controls are free/);
});

test("the confirmation shows the destination as text, after the button", () => {
  // These two messages are the ones phishing imitates, so a reader has to be
  // able to see where the link goes without clicking it. After the button,
  // because that is where someone looks once the button did not work.
  const html = verificationHtml("Marco Rossi", LINK);
  assert.ok(html.includes("Or paste this into your browser"));
  assert.ok(html.indexOf("Confirm my email") < html.indexOf("Or paste this"));
  assert.match(html, /token=abc&amp;x=1/, "the ampersand must be escaped, not dropped");
});

test("only the first name is used, and its absence is not an error", () => {
  assert.match(verificationHtml("Marco Rossi", LINK), /One step left, Marco\./);
  assert.match(verificationHtml("", LINK), /One step left\./);
  assert.match(accountWelcomeHtml(""), /You're in\./);
});

test("a name cannot carry markup into the message", () => {
  const html = accountWelcomeHtml("<script>alert(1)</script>");
  assert.ok(!html.includes("<script>"));
  assert.ok(html.includes("&lt;script&gt;"));
});

test("the reset email states the two limits that matter", () => {
  // Single use and one hour are both true of the token, and both are the
  // kind of thing someone checks before worrying that a link was intercepted.
  const html = passwordResetHtml(LINK);
  assert.match(html, /one hour, and only once/);
  assert.match(html, /your password stays exactly as it is/);
});

test("the welcome describes all-free controls without a stale count or blanket reversibility", () => {
  const html = accountWelcomeHtml("Marco");
  assert.match(html, /All WinCraft controls are free/);
  assert.match(html, /supported settings/);
  assert.doesNotMatch(html, /\d+ tweaks|each.*revertible/);
});

test("every subject names the product", () => {
  for (const subject of [
    verificationSubject(),
    passwordResetSubject(),
    accountWelcomeSubject(),
    passwordChangedSubject(),
  ]) {
    assert.match(subject, /WinCraft/);
  }
});

test("all four are complete documents in the same shell", () => {
  for (const html of [
    verificationHtml("A", LINK),
    passwordResetHtml(LINK),
    accountWelcomeHtml("A"),
    passwordChangedHtml("A", WHEN),
  ]) {
    assert.ok(html.startsWith("<!doctype html>"));
    assert.ok(html.includes("wincraft.app"));
    assert.ok(html.includes("#ff5500"), "the shared accent, not a second visual language");
  }
});

test("the notice carries no link that could change anything", () => {
  // The one message whose reader may not be the person who acted. A reset
  // link here would be the exact shape an attacker forges, arriving on the
  // message a worried reader is most likely to click.
  const html = passwordChangedHtml("Marco", WHEN);
  assert.ok(!html.includes("reset-password"), "no reset route in a message about a reset");
  assert.ok(!html.includes("token="), "no token, so nothing here is worth stealing");
  assert.ok(
    html.includes('href="https://wincraft.app/support"'),
    "the button goes to a place, not an action",
  );
});

test("the notice states when it happened and what it already did", () => {
  // Both are load-bearing: the moment is how a reader decides it was not
  // them, and the sign-out is true because the reset bumps token_version.
  const html = passwordChangedHtml("Marco", WHEN);
  assert.ok(html.includes(WHEN), "quotes the moment the password changed, not the render time");
  assert.match(html, /signed in has been signed out/);
  assert.match(html, /never ask you for your password by email/);
});

test("the notice greets by first name and survives having none", () => {
  assert.match(passwordChangedHtml("Marco Rossi", WHEN), /Your password was changed, Marco\./);
  assert.match(passwordChangedHtml("", WHEN), /Your password was changed\./);
  const html = passwordChangedHtml("<script>alert(1)</script>", WHEN);
  assert.ok(!html.includes("<script>"));
});

test("the deletion notice says what was removed and what stays visible", () => {
  // A reader who did not ask for this needs to know the account is gone; a
  // reader who did needs to know a published review survived without their
  // address on it. Both facts belong in the message, and neither needs a link
  // into an account that no longer exists.
  const kept = accountDeletedHtml({ reviewsKept: 1, reviewsDiscarded: 2 });
  assert.match(kept, /review you published stays visible/);
  assert.ok(!kept.includes("reset-password") && !kept.includes("token="));
  assert.ok(kept.includes('href="https://wincraft.app/support"'));
  const none = accountDeletedHtml({ reviewsKept: 0, reviewsDiscarded: 0 });
  assert.match(none, /Nothing you wrote is published under this address/);
  assert.ok(!none.includes("review you published stays visible"));
  assert.match(
    accountDeletedText({ reviewsKept: 1, reviewsDiscarded: 0 }),
    /can no longer be linked back to you/,
  );
  assert.match(
    accountDeletedText({ reviewsKept: 0, reviewsDiscarded: 0 }),
    /account has been deleted/,
  );
  assert.match(accountDeletedSubject(), /deleted/);
});
