// Public texts must state the catalog the app actually ships, and must not
// publish it as a Free/Pro split: the app has no licence gate, so there is no
// split to advertise. The catalogue's own flags were flipped to free, which is
// why `pro` is 0 below and the split scan only runs if that ever changes back.
//
// The total comes from the Rust catalogue test (src-tauri/src/lib.rs), which
// fails when the code and that number disagree; this check fails when a public
// text does - either by quoting a different total or by splitting it again.
import fs from "node:fs";

const read = (file) => fs.readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const lib = read("src-tauri/src/lib.rs");
// Whitespace-tolerant on purpose. These two were matched with a single-line
// pattern, and the first `cargo fmt` in this repository reflowed the `pro`
// assertion across four lines - at which point this check could not find the
// number it exists to compare against and every public count became unverified.
// Reading formatted source needs a pattern that survives formatting.
const total = Number(lib.match(/assert_eq!\(\s*total,\s*(\d+)\s*,/)?.[1]);
const pro = Number(lib.match(/assert_eq!\(\s*pro,\s*(\d+)\s*,/)?.[1]);
if (!total || !Number.isInteger(pro)) {
  throw new Error(
    "catalogue counts not found in src-tauri/src/lib.rs: expected an " +
      "`assert_eq!(total, <n>, ...)` and an `assert_eq!(pro, <n>, ...)`",
  );
}
const free = total - pro;

const listings = fs
  .readdirSync(new URL("../scripts/store/listing/", import.meta.url))
  .filter((f) => f.endsWith(".json"))
  .map((f) => `scripts/store/listing/${f}`);

// The release notes for the version being shipped are public copy too, and they
// are where a stale split survives longest: 1.18.1's notes still promised "46
// Free and 35 Pro" after the catalogue had been made free in Batch AI, and
// nothing failed because no gate read this file. Only the current version's
// notes are scanned - older ones describe the split truthfully and rewriting
// history would be the real error.
const version = JSON.parse(read("package.json")).version;
const releaseNotes = `release-notes/RELEASE-NOTES-${version}.md`;

const files = [
  "README.md",
  "backend/src/emails/account.ts",
  "site/src/i18n/dictionary.ts",
  "site/src/pages/practical-guides.ts",
  // The launch kit for the next Product Hunt / AlternativeTo / YouTube post.
  // It carried the paid tier pricing, a dead winget identifier and the
  // pre-1.19 control count for a month after all three had changed, because no
  // gate read it: marketing copy goes out under this repository's name, so it
  // is public text and it is scanned like the rest.
  "marketing/producthunt-assets/SUBMISSION.md",
  "marketing/producthunt-assets/YOUTUBE.md",
  "marketing/instagram-upload/auto-upload.js",
  ...listings,
  ...(fs.existsSync(new URL(`../${releaseNotes}`, import.meta.url)) ? [releaseNotes] : []),
];

const problems = [];

// The changelog is public text too, and its *current* section is release copy
// rather than history: 1.19.0's own entry still said "81 controls" (three
// times) while the catalogue the same build ships held 141. Only the section
// for the version in package.json is scanned, for the same reason the release
// notes are: an older section describing an older catalogue is accurate.
const changelog = read("CHANGELOG.md");
const shippedHeading = `## v${version}`;
const shippedAt = changelog.indexOf(shippedHeading);
if (shippedAt === -1) {
  problems.push(`CHANGELOG.md: no "${shippedHeading}" section for the version being shipped`);
}
const shippedSection =
  shippedAt === -1 ? "" : changelog.slice(shippedAt).split(/\n## /)[0].trimEnd();

// A number right before a catalog noun, in the six languages the texts use.
const NOUN = String.raw`(?:Windows[ -])?(?:Free |Pro )?(?:controls?|tweaks?|settings|controlli|impostazioni|réglages|contrôles|ajustes|controles|controlos|Einstellungen)`;
// Up to two lowercase modifiers may sit between the number and the noun:
// the launch kit's own phrasing is "141 one-click Windows controls", and a
// count written that way has to be checked too.
const claim = new RegExp(String.raw`\b(\d{2,3})((?:\s+[a-z][a-z-]*){0,2})\s+${NOUN}`, "gi");
const NEW = /^\s*(new|nuovi|nouveaux|nuevos|neue|novos)\b/i;
const texts = [
  ...files.map((file) => [file, read(file)]),
  [`CHANGELOG.md (${shippedHeading} section)`, shippedSection],
];
for (const [file, text] of texts) {
  for (const m of text.matchAll(claim)) {
    const n = Number(m[1]);
    if (n === total) continue;
    // "15 new controls" / "15 ajustes nuevos" count a release's additions, not the catalog.
    if (NEW.test(text.slice(m.index + m[1].length)) || NEW.test(text.slice(m.index + m[0].length)))
      continue;
    problems.push(`${file}: "${m[0]}" (the catalog has ${total} controls)`);
  }
  // With every flag free there is no second number to scan for, and scanning
  // for the total on its own would flag the correct sentence.
  if (free !== total) {
    const split = new RegExp(String.raw`\b(?:${String(free)}|${String(pro)})\b`, "g");
    for (const m of text.matchAll(split)) {
      const around = text.slice(Math.max(0, m.index - 40), m.index + 40).replaceAll("\n", " ");
      problems.push(
        `${file}: "${m[0]}" in "...${around}..." — the Free/Pro split is not published`,
      );
    }
  }
  // The wording has nothing to refer to any more, in any language: neither the
  // old split's phrasing nor its slash, which is how a two-tier claim reappears
  // without a number for the check above to compare against.
  for (const m of text.matchAll(
    /\b(?:Pro|Free)\s+(?:controls?|tweaks?|settings)\b|\b(?:Pro|Free)\s*\/\s*(?:Pro|Free)\b/gi,
  )) {
    problems.push(`${file}: "${m[0]}" — the catalogue is not split into paid and free`);
  }
  // A number carrying a tier label is the split's other shape, and the one that
  // actually shipped: 1.18.1's release notes ended "81 controls, 46 Free and 35
  // Pro" for several releases after the catalogue had been made free. The scan
  // above cannot see it ("46 Free and" is not "Free controls"), and the numeric
  // scan is skipped precisely when free === total, so the sentence that should
  // never have been published passed every gate. Matched unconditionally, and
  // without naming the old numbers so it keeps working if the catalogue moves.
  for (const m of text.matchAll(/\b\d{1,3}\s+(?:Free|Pro)\b|\b(?:Free|Pro)\s*[:/]\s*\d{1,3}\b/gi)) {
    problems.push(
      `${file}: "${m[0]}" — a count labelled Free/Pro; every one of the ${total} controls is free`,
    );
  }
  // And the price itself, which outlived the tier in one launch kit: "Pro
  // (€9.99/mo or €59/yr)". A currency amount that is not zero is a price, and
  // there is nothing in this product to price — the app's own pricing card
  // says "€0 / forever".
  for (const m of text.matchAll(/[€$£]\s?(?!0\b)\d+(?:[.,]\d+)?(?:\s?\/\s?(?:mo|month|yr|year))?|\b\d+[.,]\d{2}\s?(?:€|\$|£)|\bper (?:month|year)\b/gi)) {
    problems.push(`${file}: "${m[0]}" — a price; every one of the ${total} controls is free`);
  }
}
for (const file of listings) {
  const { description } = JSON.parse(read(file));
  if (!description.includes(String(total)))
    problems.push(`${file}: description does not state ${total}`);
}
const seo = read("site/scripts/check-seo.mjs");
if (!seo.includes(`[${String(total)}, "CONTROLS IN THIS RELEASE"]`)) {
  problems.push(
    `site/scripts/check-seo.mjs: homepage stats do not show ${total} as the release's control count`,
  );
}
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(
  free === total
    ? `Public counts match the catalog: ${total} controls, all free (${files.length} files checked).`
    : `Public counts match the catalog: ${total} controls, published without a Free/Pro split ` +
        `(the ${free}/${pro} flags stay metadata; ${files.length} files checked).`,
);

if (/FREE_TWEAK_COUNT/.test(read("backend/src/routes/auth.ts"))) {
  throw new Error("Backend welcome must not reintroduce an independently maintained catalog count");
}
