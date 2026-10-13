import express from "express";
import { getPool, isConfigured, withTransaction } from "../db";
import { requireAuth } from "../auth";
import { verifyPassword } from "../auth";
import { isEntitled } from "../entitlement";
import { limitAuthWork } from "../auth-work-guard";
import { accountDeletedHtml, accountDeletedSubject, accountDeletedText } from "../emails/account";
import { sendMail } from "../mailer";
import {
  deleteAccountData,
  subscriptionBlocksDeletion,
  type DeletionCandidate,
} from "../account-deletion";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  if (!isConfigured) {
    return res.status(503).json({ error: "database not configured (DATABASE_URL missing)" });
  }
  try {
    const result = await getPool().query(
      "SELECT email, is_pro, plan, pro_expires_at, legacy_pro_grant, email_verified, stripe_customer_id FROM users WHERE id = $1",
      [req.userId],
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "account not found" });
    }
    const row = result.rows[0];
    // Deliberately not `row.is_pro`: the stored flag is only half the answer,
    // and a lapsed billing period has to revoke access even if no webhook
    // ever told us to clear the flag. See entitlement.ts.
    // `plan` and `hasBilling` are what the pricing screen needs to decide
    // which call to action to offer. Without them it showed every Pro account
    // a Manage subscription button, including accounts granted Pro by hand,
    // which have no Stripe customer and so could only ever be answered with
    // an error. The customer id itself stays on the server; the client only
    // needs to know whether one exists.
    res.json({
      email: row.email,
      isPro: isEntitled(row),
      emailVerified: row.email_verified,
      plan: row.plan ?? null,
      hasBilling: Boolean(row.stripe_customer_id),
    });
  } catch (err) {
    console.error("account lookup failed:", err);
    res.status(500).json({ error: "account lookup failed" });
  }
});

/** The exact word someone has to type. A bare click on a danger button in a
 *  window they left open should not be able to end an account. */
const CONFIRMATION_WORD = "DELETE";

/**
 * Deletes the caller's account.
 *
 * The password prompt is the same one the app already knows how to make, and
 * it is required even though the request is authenticated: a stolen session is
 * exactly the situation where "delete everything" must ask for something the
 * thief does not have.
 *
 * Work order is deliberate — the expensive bcrypt comparison runs before the
 * transaction opens, so a locked row is never held while hashing, and the
 * deletion itself is one short transaction. The notice email is sent only
 * after the transaction has committed, because it tells the reader their
 * account is gone.
 */
router.delete(
  "/",
  requireAuth,
  limitAuthWork("delete-account", async (req, res) => {
    if (!isConfigured) {
      return res.status(503).json({ error: "database not configured (DATABASE_URL missing)" });
    }
    const body = (req.body ?? {}) as { password?: unknown; confirm?: unknown };
    if (body.confirm !== CONFIRMATION_WORD) {
      return res.status(400).json({
        code: "confirmation-required",
        error: `Account deletion requires the word ${CONFIRMATION_WORD} in "confirm".`,
      });
    }
    const password = typeof body.password === "string" ? body.password : "";
    if (password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
      return res
        .status(400)
        .json({
          code: "password-required",
          error: "Enter your current password to delete the account.",
        });
    }

    let account: DeletionCandidate & { password_hash: string; first_name: string | null };
    try {
      const result = await getPool().query(
        `SELECT id, email, password_hash, first_name, is_pro, plan, pro_expires_at,
                legacy_pro_grant, stripe_customer_id, stripe_subscription_id
           FROM users WHERE id = $1`,
        [req.userId],
      );
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "account not found" });
      }
      account = result.rows[0];
    } catch (err) {
      console.error("account deletion lookup failed:", err);
      return res.status(500).json({ error: "account deletion failed" });
    }

    if (subscriptionBlocksDeletion(account)) {
      // Deleting the row cannot cancel the subscription, and pretending
      // otherwise would leave someone billed for an account they closed.
      return res.status(409).json({
        code: "active-subscription",
        error:
          "This account has an active subscription. Cancel it from Manage subscription first; once the paid period ends, deleting the account will not leave anything billing your card.",
      });
    }

    try {
      if (!(await verifyPassword(password, account.password_hash))) {
        return res
          .status(401)
          .json({ code: "password-mismatch", error: "That password does not match this account." });
      }
    } catch (err) {
      console.error("account deletion password check failed:", err);
      return res.status(500).json({ error: "account deletion failed" });
    }

    let summary;
    try {
      summary = await withTransaction((client) => deleteAccountData(account, client));
    } catch (err) {
      console.error("account deletion failed:", err);
      return res.status(500).json({ error: "account deletion failed" });
    }

    // Counts only: the address and the account itself are already gone, and a
    // log line is the wrong place to reintroduce either.
    console.log(
      `account deleted: reviews kept ${summary.anonymizedReviews}, discarded ${summary.discardedReviews}, unsubscribed ${summary.unsubscribed}`,
    );

    res.json({ deleted: true });

    // After the response: this is a courtesy, and a mail provider outage must
    // not turn a completed deletion into an error the caller will retry.
    void sendMail({
      to: account.email,
      subject: accountDeletedSubject(),
      html: accountDeletedHtml({
        reviewsKept: summary.anonymizedReviews,
        reviewsDiscarded: summary.discardedReviews,
      }),
      text: accountDeletedText({
        reviewsKept: summary.anonymizedReviews,
        reviewsDiscarded: summary.discardedReviews,
      }),
    }).catch(() => console.error("account deletion notice could not be sent"));
  }),
);

export default router;
