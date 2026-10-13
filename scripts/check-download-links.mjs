// Every published URL that serves a release artifact has to name an artifact
// that the repository it points at actually publishes.
//
// This exists because the PC Tweaker → WinCraft rename rewrote the *reachable*
// half of a repository rename and left the rest: the alias workflow still
// uploads `PCTweaker-Setup.exe`, while the site's download button, its JSON-LD
// `downloadUrl` and the in-app Uninstaller card were rewritten to
// `WinCraft-Setup.exe`, `WinCraftUninstaller-Setup.exe` and a repository that
// has never hosted an Uninstaller release. Every one of those links 404s, and
// nothing failed, because no gate read a URL. The workflow half of the rename
// could not be pushed from that session (the push credential has no
// `workflows` permission), which is exactly how a rename ends up half applied
// and silently broken.
//
// So: read the alias workflow as the source of truth for stable filenames, read
// every download URL in the tree, and refuse a mismatch. Cross-repository
// aliases cannot be derived from this tree, so they are listed here by hand,
// each with the reason it is not derivable — adding a link to a new repository
// is a deliberate act, not a typo that passes.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);

/** Directories that hold build output, dependencies or VCS data, not sources. */
const SKIP_DIRS = new Set([
  ".git",
  "node_modules",
  "coverage",
  "target",
  ".vite",
  "build",
  "out",
  ".arena",
]);
/** Build output is `dist` in the app and `dist-ssr` in the site; both are
 *  gitignored copies of the sources this check already reads, and counting the
 *  URLs inside them would make the summary depend on whether anyone had built. */
const skipDir = (name) => SKIP_DIRS.has(name) || name.startsWith("dist");

/** Extensions that can carry a public URL; anything else is binary or data. */
const TEXT_EXT = new Set([
  ".md",
  ".ts",
  ".tsx",
  ".js",
  ".mjs",
  ".cjs",
  ".json",
  ".yml",
  ".yaml",
  ".ps1",
  ".xml",
  ".txt",
  ".html",
  ".css",
  ".nsh",
  ".rs",
]);

const MAX_BYTES = 2 * 1024 * 1024;

/**
 * Stable aliases other repositories publish, with the reason this tree cannot
 * derive them. Keep the reason: it is what stops the list from becoming
 * "whatever the gate needed to pass".
 */
const CROSS_REPO_ALIASES = new Map([
  [
    "AurelioAvila/pc-tweaker-uninstaller",
    {
      assets: new Set(["PCTweakerUninstaller-Setup.exe", "PCTweakerUninstaller-Setup.msi"]),
      why: "the Uninstaller is a separate product with its own release stream and its own alias workflow",
    },
  ],
  [
    "AurelioAvila/pc-tweaker-app",
    {
      assets: new Set(["PCTweaker-Setup.exe", "PCTweaker-Setup.msi", "latest.json"]),
      why: "the upstream repository that still hosts the signed 1.18.1 releases and their aliases",
    },
  ],
  [
    "AurelioAvila/Tweaky-Driver-Releases",
    {
      assets: new Set(["TweakyDriver-Setup.exe"]),
      why: "Tweaky Driver is a separate product with its own release-only repository, linked from its page on this site",
    },
  ],
]);

/**
 * Filenames this repository publishes under `releases/latest/download/` that no
 * alias workflow copies: the updater manifest, written by
 * `scripts/make-latest-json.mjs` and attached to the release by hand.
 */
const OWN_MANIFESTS = new Set(["latest.json"]);

/** Artifact name shapes accepted for a version-pinned URL. */
const VERSIONED_ARTIFACT = [
  /^[\w.-]+_(\d+\.\d+\.\d+)_x64-setup\.exe(\.sig)?$/,
  /^[\w.-]+_(\d+\.\d+\.\d+)_x64_en-US\.msi(\.sig)?$/,
  /^(PCTweaker|WinCraft)-(Setup|Uninstaller-Setup)\.(exe|msi)$/,
  /^(latest\.json|SHA256SUMS\.txt)$/,
];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") && entry.name !== ".github") {
      if (entry.isDirectory()) continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (skipDir(entry.name)) continue;
      walk(full, out);
      continue;
    }
    if (!TEXT_EXT.has(path.extname(entry.name))) continue;
    const stat = fs.statSync(full);
    if (stat.size > MAX_BYTES) continue;
    out.push(full);
  }
  return out;
}

/** Stable filenames this repository's own workflows upload to a release. */
function ownAliases() {
  const aliases = new Set();
  const dir = path.join(root, ".github", "workflows");
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith(".yml") && !name.endsWith(".yaml")) continue;
    const text = fs.readFileSync(path.join(dir, name), "utf8");
    // The alias workflow stages files under `out/`, verifies them there and
    // uploads exactly those names; `cp ... out/<Name>` and the two verification
    // lists are the same three places a rename has to touch.
    for (const [, asset] of text.matchAll(/out\/([A-Za-z0-9._-]+)/g)) aliases.add(asset);
  }
  return aliases;
}

/** Package identifiers this repository's workflows submit to WinGet. */
function publishedWingetIds() {
  const ids = new Set();
  const dir = path.join(root, ".github", "workflows");
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith(".yml") && !name.endsWith(".yaml")) continue;
    const text = fs.readFileSync(path.join(dir, name), "utf8");
    for (const [, id] of text.matchAll(/^\s*identifier:\s*([A-Za-z0-9._-]+)\s*$/gm)) ids.add(id);
  }
  return ids;
}

const problems = [];
const rel = (file) => path.relative(root, file);

const OWN_REPO = "Warzonesiddiki/WinCraft";
const aliases = ownAliases();
const wingetIds = publishedWingetIds();
if (aliases.size === 0) problems.push("no stable aliases found in .github/workflows/*.yml");
if (wingetIds.size === 0) problems.push("no WinGet identifier found in .github/workflows/*.yml");

const DOWNLOAD_URL =
  /https:\/\/github\.com\/([A-Za-z0-9._-]+)\/([A-Za-z0-9._-]+)\/releases\/(latest\/download|download\/([^/\s)"'`]+))\/([A-Za-z0-9._+-]+)/g;
const WINGET_ID = /(?:\bwinget\s+(?:install|upgrade)[^\n]*?--id\s+|img\.shields\.io\/winget\/v\/)([A-Za-z0-9._-]+)/g;
const WINGET_MANIFEST =
  /microsoft\/winget-pkgs\/tree\/[^/\s)"']+\/manifests\/([a-z0-9])\/([^/\s)"'`]+)\/([^/\s)"'`)]+)/g;

let urlCount = 0;
let wingetCount = 0;

for (const file of walk(root)) {
  const text = fs.readFileSync(file, "utf8");
  const where = rel(file);

  for (const [match, owner, repo, kind, tag, asset] of text.matchAll(DOWNLOAD_URL)) {
    urlCount += 1;
    const target = `${owner}/${repo}`;
    const known = target === OWN_REPO ? aliases : CROSS_REPO_ALIASES.get(target)?.assets;
    if (!known) {
      problems.push(
        `${where}: ${match} points at ${target}, which no workflow in this repository publishes from ` +
          `and no entry in CROSS_REPO_ALIASES covers. Add the repository deliberately, with the reason.`,
      );
      continue;
    }
    if (kind === "latest/download") {
      if (target === OWN_REPO && OWN_MANIFESTS.has(asset)) continue;
      if (!known.has(asset)) {
        problems.push(
          `${where}: ${match} — ${target} publishes ${[...known].join(", ")} under ` +
            `releases/latest/download/, not ${asset}. An alias has to match the file the workflow uploads.`,
        );
      }
      continue;
    }
    // A template URL (`v${version}`, `v{offered_version}`) builds a filename at
    // run time, so there is no literal name to check and no version to match.
    if (tag.includes("{") || tag.includes("$") || asset.includes("{") || asset.includes("$")) continue;
    // A version-pinned URL: the filename has to look like a release artifact
    // and carry the same version as the tag.
    if (!VERSIONED_ARTIFACT.some((re) => re.test(asset))) {
      problems.push(`${where}: ${match} — ${asset} is not a release artifact name this project publishes.`);
      continue;
    }
    const pinned = tag.replace(/^v/, "");
    const inName = asset.match(/(\d+\.\d+\.\d+)/)?.[1];
    if (/^\d+\.\d+\.\d+$/.test(pinned) && inName && inName !== pinned) {
      problems.push(`${where}: ${match} — the tag says v${pinned} and the filename says ${inName}.`);
    }
  }

  for (const [match, id] of text.matchAll(WINGET_ID)) {
    wingetCount += 1;
    if (!wingetIds.has(id)) {
      problems.push(
        `${where}: "${match.trim()}" — no workflow submits ${id}; this repository publishes ` +
          `${[...wingetIds].join(", ")} to winget-pkgs.`,
      );
    }
  }

  for (const [match, letter, publisher, pkg] of text.matchAll(WINGET_MANIFEST)) {
    wingetCount += 1;
    const id = `${publisher}.${pkg}`;
    if (!wingetIds.has(id)) {
      problems.push(`${where}: ${match} — ${id} is not an identifier this repository publishes.`);
    } else if (letter !== publisher[0].toLowerCase()) {
      problems.push(
        `${where}: ${match} — a winget-pkgs manifest path starts with the lowercased first ` +
          `letter of the publisher, so ${publisher} belongs under manifests/${publisher[0].toLowerCase()}/.`,
      );
    }
  }
}

if (urlCount === 0) problems.push("no release download URLs were found anywhere: this check has lost its subject");
if (wingetCount === 0) problems.push("no WinGet references were found anywhere: this check has lost its subject");

if (problems.length) {
  console.error("check-download-links: published links and the artifacts they name disagree.\n");
  for (const problem of problems) console.error(`  ${problem}`);
  console.error(
    `\n${problems.length} problem(s). Aliases this repository publishes: ${[...aliases].join(", ")}.`,
  );
  process.exit(1);
}

console.log(
  `download links ok: ${urlCount} release URL(s) and ${wingetCount} WinGet reference(s) all name an ` +
    `artifact or package this project publishes (${[...aliases].join(", ")}).`,
);
