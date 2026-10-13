/**
 * The messages an account produces before anyone has paid anything.
 *
 * Two of them — confirm your address, reset your password — used to be a
 * single line of HTML with a bare link. They are the first things a new
 * customer sees, and they looked like a script had sent them.
 *
 * Both deliberately show the destination as text as well as behind the
 * button. A link the reader can see before clicking is the difference between
 * a mail that looks legitimate and one that looks like phishing, and these
 * are exactly the two messages phishing imitates.
 *
 * The fourth, the password-changed notice, follows the same reasoning to the
 * opposite conclusion: it carries no token and no link that could change
 * anything, because it is the one message whose reader may not be the person
 * who acted.
 */

import { bulletRow, emailShell, EMAIL_MUTED_TEXT } from "./layout";

const ACCENT = "#ff5500";

export function verificationText(link: string): string {
  return `Confirm your email for WinCraft\n\nConfirm this address to activate your account:\n${link}\n\nThis link expires in 24 hours. If you did not create this account, ignore this message.`;
}

export function passwordResetText(link: string): string {
  return `Reset your WinCraft password\n\nChoose a new password:\n${link}\n\nThis link works once and expires in one hour. If you did not request this, ignore this message. Your password stays unchanged.`;
}

export function passwordChangedText(when: string): string {
  return `Your WinCraft password was changed on ${when}. Every device that was signed in has been signed out.\n\nIf this was not you, request a new reset link from the app immediately and contact support: https://wincraft.app/support\n\nWe will never ask you for your password by email.`;
}

export function accountWelcomeText(): string {
  return `Your WinCraft account is ready\n\nYour email is confirmed. Sign in from the app to get started.\n\nAll WinCraft controls are free, with supported settings backed up before changes. Features include, live processor, memory and disk monitoring, a startup manager, temporary file cleanup and a password breach check.\n\nOpen WinCraft: https://wincraft.app\nSupport: https://wincraft.app/support`;
}

/** The URL under the button, shown so it can be read rather than trusted. */
function linkFallback(link: string): string {
  return `
        <tr>
          <td style="padding:24px 40px 0; text-align:center;">
            <p style="margin:0; font-size:12px; line-height:1.6; color:${EMAIL_MUTED_TEXT}; word-break:break-all;">
              Or paste this into your browser:<br>${link.replace(/&/g, "&amp;").replace(/</g, "&lt;")}
            </p>
          </td>
        </tr>`;
}

export function verificationSubject(): string {
  return "Confirm your email for WinCraft";
}

export function verificationHtml(firstName: string, link: string): string {
  const name = (firstName || "").trim().split(/\s+/)[0];
  return emailShell({
    preheader:
      "Confirm this address to activate your WinCraft account. The link works for 24 hours.",
    eyebrow: "Confirm your email",
    headline: name ? `One step left, ${name}.` : "One step left.",
    intro:
      "Confirm this address and your WinCraft account is ready. It is what lets you sign in on another PC and keeps your license attached to you rather than to one machine.",
    action: { label: "Confirm my email", url: link },
    afterActionHtml: linkFallback(link),
    note: "The link works for 24 hours.",
    footerNote:
      "If you did not create a WinCraft account, ignore this message and nothing happens.",
    accent: ACCENT,
  });
}

export function passwordResetSubject(): string {
  return "Reset your WinCraft password";
}

export function passwordResetHtml(link: string): string {
  return emailShell({
    preheader: "Set a new password with the link inside. It works once, for one hour.",
    eyebrow: "Password reset",
    headline: "Choose a new password.",
    intro: "Use the button below to set a new password for your WinCraft account.",
    action: { label: "Set a new password", url: link },
    afterActionHtml: linkFallback(link),
    note: "The link works for one hour, and only once.",
    footerNote:
      "If you did not ask for this, ignore the message — your password stays exactly as it is.",
    accent: ACCENT,
  });
}

export function passwordChangedSubject(): string {
  return "Your WinCraft password was changed";
}

/**
 * Sent after a password has actually changed, never before.
 *
 * This is the only way an account takeover becomes visible to the person who
 * owns the account, so it is the one message here whose reader may not be the
 * person who acted. That is why it carries no reset token and no "this wasn't
 * me" button: by the time it arrives the new password is already set, and a
 * one-click link on the message a worried reader is most likely to click is
 * exactly the shape an attacker would forge. The button goes to the support
 * page, which is a place, not an action.
 *
 * `when` is passed in rather than read here, so the email quotes the moment
 * the password actually changed rather than the moment it was rendered.
 */
export function passwordChangedHtml(firstName: string, when: string): string {
  const name = (firstName || "").trim().split(/\s+/)[0];
  const body = `
        <tr>
          <td style="padding:28px 40px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f12; border:1px solid #2a2d33; border-radius:12px;">
              <tr>
                <td style="padding:18px; color:#9ca3af; font-size:15px; line-height:1.6;">
                  If this was you, there is nothing else to do.<br>
                  If it was not, someone else set that password. Ask for a new
                  reset link from the app right away, choose a password you use
                  nowhere else, and get in touch with us.
                </td>
              </tr>
            </table>
          </td>
        </tr>`;
  return emailShell({
    preheader:
      "Every signed-in device has been signed out. If this was not you, contact support now.",
    eyebrow: "Security notice",
    headline: name ? `Your password was changed, ${name}.` : "Your password was changed.",
    intro: `The password on your WinCraft account was changed on ${when}. Every device that was signed in has been signed out.`,
    bodyHtml: body,
    action: { label: "Contact support", url: "https://wincraft.app/support" },
    note: "We will never ask you for your password by email.",
    footerNote: "This notice is sent every time the password changes and cannot be turned off.",
    accent: ACCENT,
  });
}

export function accountWelcomeSubject(): string {
  return "Your WinCraft account is ready";
}

/**
 * Sent once the address is confirmed, not at registration.
 *
 * At registration the person already has an email from us asking them to
 * confirm, and two messages arriving together makes the one that needs acting
 * on easier to miss. This one also has something the other cannot have: an
 * account that actually works.
 */
export function accountWelcomeHtml(firstName: string): string {
  const name = (firstName || "").trim().split(/\s+/)[0];
  const body = `
        <tr><td style="padding:32px 40px 0;"><div style="height:1px; background:#2a2d33;"></div></td></tr>

        <tr>
          <td style="padding:28px 40px 0;">
            <div style="font-size:13px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:${EMAIL_MUTED_TEXT}; margin-bottom:16px;">Yours without paying anything</div>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${bulletRow(ACCENT, "All WinCraft controls are free; supported settings are backed up before changes")}
${bulletRow(ACCENT, "Live monitoring of processor, memory and disk")}
${bulletRow(ACCENT, "Startup manager, temporary file cleanup and a password breach check")}
            </table>
          </td>
        </tr>`;
  return emailShell({
    preheader: "Your email is confirmed. Here is what your free account already includes.",
    eyebrow: "Account ready",
    headline: name ? `You're in, ${name}.` : "You're in.",
    intro:
      "Your email is confirmed and the account is active. Sign in from the app and everything below is already yours.",
    bodyHtml: body,
    action: { label: "Open WinCraft", url: "https://wincraft.app" },
    footerNote: "Questions? Just reply to this email.",
    accent: ACCENT,
  });
}

/**
 * The confirmation that an account was removed.
 *
 * Two facts belong in it, and both are there so the reader can act if the
 * deletion was not theirs: what was removed, and that a published review they
 * wrote stays visible with the address detached from it. The message carries
 * no link back into the account — there is no account left to link to — so the
 * only action is the support page.
 */
export function accountDeletedText(detail: {
  reviewsKept: number;
  reviewsDiscarded: number;
}): string {
  const reviewLine =
    detail.reviewsKept > 0
      ? `\n\nA review you published stays visible with your name, but the address attached to it has been removed, so it can no longer be linked back to you.`
      : "";
  return `Your WinCraft account has been deleted\n\nYour email address, password and account details have been removed, and every device that was signed in has been signed out.${reviewLine}\n\nNothing further will be emailed to this address. If you did not ask for this, contact us right away: https://wincraft.app/support`;
}

export function accountDeletedSubject(): string {
  return "Your WinCraft account has been deleted";
}

export function accountDeletedHtml(detail: {
  reviewsKept: number;
  reviewsDiscarded: number;
}): string {
  const body = `
        <tr>
          <td style="padding:28px 40px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f12; border:1px solid #2a2d33; border-radius:12px;">
              <tr>
                <td style="padding:18px; color:#9ca3af; font-size:15px; line-height:1.6;">
                  ${
                    detail.reviewsKept > 0
                      ? "A review you published stays visible with your name, but the address attached to it has been removed, so it can no longer be linked back to you."
                      : "Nothing you wrote is published under this address."
                  }<br>
                  If you did not ask for this, contact us right away.
                </td>
              </tr>
            </table>
          </td>
        </tr>`;
  return emailShell({
    preheader:
      "Your account and its details have been removed. Every signed-in device has been signed out.",
    eyebrow: "Account closed",
    headline: "Your account has been deleted.",
    intro:
      "Your email address, password and account details have been removed, and every device that was signed in has been signed out. Nothing further will be emailed to this address.",
    bodyHtml: body,
    action: { label: "Contact support", url: "https://wincraft.app/support" },
    note: "This is the last message this address will receive from us.",
    footerNote: "This notice cannot be switched off: it confirms a change to your account.",
    accent: ACCENT,
  });
}
