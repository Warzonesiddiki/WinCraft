/**
 * Abuse controls for the two anonymous public forms (support + reviews).
 *
 * This ceiling does not depend on source identity. It bounds email and
 * database work even across many legitimate IPs. Proxy trust is configured
 * separately by proxy-policy.ts; in-memory budgets require a single replica.
 */

type Bucket = { windowStartedAt: number; count: number };

const WINDOW_MS = 60 * 60 * 1000;

const buckets = new Map<string, Bucket>();

/**
 * Consumes one unit from the named hourly budget.
 *
 * In-memory by design: this backend runs as a single Railway instance, and a
 * shared store would be a new dependency for a control that is a backstop
 * rather than the primary defence. A restart resets the window, which favours
 * availability for real users over perfect enforcement against an attacker
 * who would need to crash the process to benefit.
 *
 * @returns true when the caller may proceed, false when the ceiling is hit.
 */
export function consumeGlobalBudget(name: string, maxPerHour: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(name);

  if (!bucket || now - bucket.windowStartedAt >= WINDOW_MS) {
    buckets.set(name, { windowStartedAt: now, count: 1 });
    return true;
  }
  if (bucket.count >= maxPerHour) return false;

  bucket.count += 1;
  return true;
}

/**
 * Strips CR/LF from a value destined for an email header.
 *
 * Reply-To is fed from a validated address (isValidEmail rejects whitespace,
 * and JS `$` — unlike Python's — does not admit a trailing newline), but
 * Subject is free text. Both mail paths in use are already safe on their own
 * (Resend takes JSON; nodemailer encodes headers), so this is defence in
 * depth against a future third path that isn't.
 */
export function singleLine(s: string): string {
  return s.replace(/[\r\n]+/g, " ").trim();
}
