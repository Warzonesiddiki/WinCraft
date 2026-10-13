/** Direct one-click installer download — bypasses the release page entirely.
 *  `PCTweaker-Setup.exe` is the stable alias the "Stable download alias"
 *  workflow re-uploads on every release that passes its Authenticode check, so
 *  the URL never needs to change again. The filename is the legacy one on
 *  purpose: installed clients and every published verification command look for
 *  that name, and the alias only ever exists for a signature-verified build —
 *  which is why the URL can 404 while the published build is an unsigned
 *  pre-release. `scripts/check-download-links.mjs` fails the build if this
 *  asset name and the workflow that creates it ever disagree again. */
export const DOWNLOAD_EXE =
  "https://github.com/Warzonesiddiki/WinCraft/releases/latest/download/PCTweaker-Setup.exe";

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

/** For people who want the .msi, release notes, checksums, or older versions. */
export const RELEASES_PAGE = "https://github.com/Warzonesiddiki/WinCraft/releases/latest";

/** Backend that relays the support form and stores reviews. The support
 *  inbox address itself lives only on that server and is never shipped in
 *  this bundle — see backend/src/support-inbox.ts. */
export const API_BASE = "https://api.wincraft.app";
