// Public copy has to describe the licence the repository actually ships.
//
// This exists because it stopped being true in three places at once: the site
// footer labelled the MIT `LICENSE` file "Source-Available License", and the
// reel and long-form generators carried the line "WinCraft isn't open source,
// but the code is source-available", each with a comment explaining that it
// must never be called open source. That was correct when the project was
// source-available and it survived the move to MIT — which is why the sentence
// mattered and why no gate noticed it: nothing read a licence claim.
//
// The rule is deliberately narrow. It reads the licence from `LICENSE` itself
// (so changing the licence changes what this check requires) and it only looks
// at the files that speak for WinCraft in public: the repository's own README
// and terms, the published PAD feed, the site, the Store listings and the
// marketing copy generators. Files that describe a *different* product — the
// Tweaky Driver page, whose application is proprietary — are not in the list,
// so "proprietary" there is not a false positive to suppress here.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// `fileURLToPath`, not `.pathname`: on Windows a URL pathname starts with a
// slash before the drive letter and `path.resolve` would then walk `C:\C:\…`.
const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));

/** Files and directories whose text describes WinCraft's own licence. */
const PUBLIC_SOURCES = [
  "README.md",
  "TERMS.md",
  "PRIVACY.md",
  "docs/pad.xml",
  "site/index.html",
  "site/src",
  "scripts/store/listing",
  "marketing",
];

/** Extensions that carry copy. Anything else in those trees is data or art. */
const TEXT_EXT = new Set([".md", ".ts", ".tsx", ".js", ".mjs", ".cjs", ".json", ".py", ".html"]);

const SKIP_DIRS = new Set(["node_modules", "dist", "dist-ssr", "coverage", "__pycache__", ".venv"]);

/**
 * Claims that are wrong while the licence is a permissive, OSI-approved one.
 * Each pattern is a licence claim about the software being described, not a
 * word that may appear for another reason.
 */
const FORBIDDEN = [
  [/source[\s-]+available/i, '"source available"'],
  [/\b(?:isn't|is not|not)\s+open[\s-]?source\b/i, '"not open source"'],
  [/\bclosed[\s-]source\b/i, '"closed source"'],
  [/all rights reserved/i, '"all rights reserved"'],
  [/proprietary\s+(?:licen[cs]e|terms)\b/i, 'a "proprietary licence/terms" claim'],
];

function collect(target, out = []) {
  const full = path.join(root, target);
  const stat = fs.statSync(full);
  if (stat.isFile()) {
    out.push(full);
    return out;
  }
  for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) collect(path.join(target, entry.name), out);
      continue;
    }
    if (TEXT_EXT.has(path.extname(entry.name))) out.push(path.join(full, entry.name));
  }
  return out;
}

const licenceText = fs.readFileSync(path.join(root, "LICENSE"), "utf8");
const licence = licenceText.split("\n")[0].trim();
// "MIT License" → "MIT"; "Apache License 2.0" → "Apache".
const marker = licence.split(/\s+/)[0].replace(/[^\w.-]/g, "");

if (!marker) {
  console.error(`check-license-claims: could not read a licence name from LICENSE (${licence}).`);
  process.exit(1);
}

const problems = [];
const files = [];
for (const target of PUBLIC_SOURCES) {
  if (!fs.existsSync(path.join(root, target))) {
    problems.push(`${target} is listed in PUBLIC_SOURCES but does not exist.`);
    continue;
  }
  files.push(...collect(target));
}

/** Files that must name the licence, because they are where a reader looks. */
const MUST_STATE = ["README.md", "TERMS.md", "docs/pad.xml", "site/src/i18n/dictionary.ts"];

let checked = 0;
const scanned = new Set();
for (const file of files) {
  const where = path.relative(root, file).split(path.sep).join("/");
  if (scanned.has(where)) continue;
  scanned.add(where);
  checked += 1;
  const text = fs.readFileSync(file, "utf8");
  text.split("\n").forEach((line, index) => {
    for (const [pattern, label] of FORBIDDEN) {
      if (pattern.test(line)) {
        problems.push(
          `${where}:${index + 1}: ${label} — LICENSE is ${licence}; "` + line.trim().slice(0, 120) + '"',
        );
      }
    }
  });
}

for (const file of MUST_STATE) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) {
    problems.push(`${file} must state the licence and does not exist.`);
    continue;
  }
  if (!fs.readFileSync(full, "utf8").includes(marker)) {
    problems.push(
      `${file} never names the ${marker} licence, and it is one of the files a reader checks first.`,
    );
  }
}

if (checked === 0) problems.push("no public copy was read: this check has lost its subject");

if (problems.length) {
  console.error("check-license-claims: public copy and LICENSE disagree.\n");
  for (const problem of problems) console.error(`  ${problem}`);
  console.error(
    `\n${problems.length} problem(s). LICENSE is "${licence}"; changing the licence means ` +
      "changing this check with it.",
  );
  process.exit(1);
}

console.log(
  `license claims ok: LICENSE is "${licence}"; ${checked} public file(s) checked and ${MUST_STATE.length} ` +
    `name it (${MUST_STATE.join(", ")}).`,
);
