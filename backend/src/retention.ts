import type { Pool } from "pg";

/**
 * How long each kind of row is allowed to live.
 *
 * The audit found that nothing expired on its own: `error_reports` and
 * `download_attributions` accumulated forever, a pending review whose
 * confirmation link had long expired stayed in the table, and consumed or
 * expired action tokens were kept indefinitely. Account deletion was the only
 * thing that ever removed a row, and it only helps people who leave.
 *
 * Every window here is justified by what the data is for, not by roundness:
 *
 * - `error_reports`: 180 days. Enough to spot a crash pattern that ships in a
 *   monthly release and see it fixed, which is the only reason the pipe exists.
 * - `download_attributions`: 400 days. Must exceed the widest window the
 *   operator report offers (365 days, clamped in routes/downloads.ts), or a
 *   year-over-year comparison would silently lose its oldest days. Campaign
 *   labels only — no IP, no user agent, no identifier.
 * - unconfirmed `reviews`: 30 days past the confirmation window. The address
 *   was typed into a form and the submission was never published; there is
 *   nothing to moderate and no reason to keep it.
 * - `action_tokens`: 7 days past expiry. A token that has expired can never be
 *   consumed again (`tokens.ts` requires `expires_at > now()`), so this only
 *   bounds how long a dead credential sits in the table.
 *
 * Deliberately NOT pruned: `billing_receipts` (the durable record that a
 * receipt was sent), `checkout_reminders` (deleting one would re-send a nudge
 * inside its own 30-day cooldown), `newsletter_subscribers` (the row is what
 * remembers an unsubscribe) and confirmed `reviews` (public content).
 */
export type RetentionRule = {
  /** Table the rule prunes, named exactly as the schema names it. */
  table: string;
  /** Age at which a row becomes eligible. */
  days: number;
  /** Column the age is measured from. */
  column: string;
};

export const RETENTION: readonly RetentionRule[] = [
  { table: "error_reports", days: 180, column: "created_at" },
  { table: "download_attributions", days: 400, column: "created_at" },
  { table: "action_tokens", days: 7, column: "expires_at" },
];

/** Unconfirmed review submissions are pruned 30 days after their own
 *  confirmation window closed. Kept separate from `RETENTION` because the
 *  predicate is not a single age comparison, and the gate that keeps
 *  docs/DATA-INVENTORY.md honest reads `RETENTION` alone. */
export const UNCONFIRMED_REVIEW_GRACE_DAYS = 30;

export type RetentionSummary = Record<string, number>;

/** Rows per statement, so a table that was never pruned does not turn into one
 *  enormous transaction on the first run. */
export const RETENTION_BATCH = 5_000;

const DAY_MS = 86_400_000;

/**
 * Deletes everything past its window, in bounded batches.
 *
 * Returns the number of rows removed per table so the caller can log something
 * true. Safe to run repeatedly and safe to run on two replicas at once: each
 * statement is an `id IN (SELECT ...)` delete, so a row another replica
 * already removed simply is not selected again.
 */
export async function purgeExpiredData(
  pool: Pick<Pool, "query">,
  now: Date = new Date(),
  batch = RETENTION_BATCH,
): Promise<RetentionSummary> {
  if (!Number.isSafeInteger(batch) || batch < 1)
    throw new Error("Retention batch size must be a positive integer");
  const summary: RetentionSummary = {};

  for (const rule of RETENTION) {
    // `days` and the column name come from the map above, never from a
    // request; the cut-off itself is still a bound parameter.
    const cutoff = new Date(now.getTime() - rule.days * DAY_MS);
    let removed = 0;
    for (;;) {
      const result = await pool.query(
        `DELETE FROM ${rule.table} WHERE id IN (
           SELECT id FROM ${rule.table} WHERE ${rule.column} < $1 ORDER BY id LIMIT $2
         )`,
        [cutoff, batch],
      );
      const count = result.rowCount ?? 0;
      removed += count;
      if (count < batch) break;
    }
    summary[rule.table] = removed;
  }

  // Unconfirmed submissions: never published, so there is no public content
  // here to preserve — only a typed address waiting to be forgotten.
  const reviewCutoff = new Date(now.getTime() - UNCONFIRMED_REVIEW_GRACE_DAYS * DAY_MS);
  let discarded = 0;
  for (;;) {
    const result = await pool.query(
      `DELETE FROM reviews WHERE id IN (
         SELECT id FROM reviews
          WHERE confirmed_at IS NULL AND confirm_expires_at IS NOT NULL AND confirm_expires_at < $1
          ORDER BY id LIMIT $2
       )`,
      [reviewCutoff, batch],
    );
    const count = result.rowCount ?? 0;
    discarded += count;
    if (count < batch) break;
  }
  summary.reviews = discarded;

  return summary;
}

/** How often the worker looks for work. The windows are measured in days, so
 *  this only decides how long a row can outlive its window, never whether the
 *  policy is met. */
export const RETENTION_EVERY_MS = 6 * 60 * 60 * 1000;

/**
 * Runs `purgeExpiredData` on a timer, and never twice at once.
 *
 * Nothing here depends on the clock being right in a particular timezone: the
 * comparison is against `now()` minus whole days, applied to timestamps the
 * database itself wrote.
 */
export function startRetentionWorker(purge: () => Promise<RetentionSummary>): () => void {
  let running = false;
  const tick = async () => {
    if (running) return;
    running = true;
    try {
      const removed = await purge();
      const total = Object.values(removed).reduce((sum, n) => sum + n, 0);
      if (total > 0) console.log(`retention: removed ${total} expired row(s)`, removed);
    } catch (err) {
      console.error("retention worker failed; will try again later", err);
    } finally {
      running = false;
    }
  };
  const timer = setInterval(() => void tick(), RETENTION_EVERY_MS);
  timer.unref();
  // One pass at startup: a deployment that is only ever restarted would
  // otherwise never prune anything.
  void tick();
  return () => clearInterval(timer);
}
