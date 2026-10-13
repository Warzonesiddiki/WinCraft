/** What every download button on the site points at, and why it is the release
 *  list rather than a file.
 *
 *  The direct one-click target is the stable alias
 *  `.../releases/latest/download/PCTweaker-Setup.exe`, which the "Stable
 *  download alias" workflow re-uploads on every release that passes its
 *  Authenticode check. An alias only exists for a signature-verified release,
 *  and the only release published here so far is an unsigned pre-release, so
 *  that URL answers 404 — measured, not assumed — and this button would send a
 *  visitor to an error page. The release list always resolves and names the
 *  build and its checksums.
 *
 *  Switch this back to the alias URL the moment a signature-verified release is
 *  published: `scripts/check-download-links.mjs` validates the alias against the
 *  workflow that uploads it, and RELEASING.md's listing step says to re-read the
 *  hero note in the same pass. */
export const DOWNLOAD_URL = "https://github.com/Warzonesiddiki/WinCraft/releases";

/** The Uninstaller is a separate product with its own release stream and its
 *  own stable alias. The nav's Download button used to serve WinCraft's
 *  installer on every page, including /uninstaller/ — the loudest control on
 *  that page downloaded the wrong application. */
export const UNINSTALLER_DOWNLOAD_EXE =
  "https://github.com/AurelioAvila/pc-tweaker-uninstaller/releases/latest/download/PCTweakerUninstaller-Setup.exe";

export const UNINSTALLER_RELEASES =
  "https://github.com/AurelioAvila/pc-tweaker-uninstaller/releases/latest";

/** The Microsoft Store listing. It has existed and been live all along, and
 *  appeared only inside the JSON-LD `sameAs` array — invisible to a human
 *  reading the page. It matters more than a mirror: it is Microsoft-signed,
 *  so it is the one route with no SmartScreen prompt for somebody who does
 *  not use a terminal, which is exactly the visitor the warning turns away. */
export const MICROSOFT_STORE = "https://apps.microsoft.com/detail/9nh3c6dt1g87?cid=pct-website";

/** Backend that relays the support form and stores reviews. The support
 *  inbox address itself lives only on that server and is never shipped in
 *  this bundle — see backend/src/support-inbox.ts. */
export const API_BASE = "https://api.wincraft.app";
