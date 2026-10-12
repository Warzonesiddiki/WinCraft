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
  "site/src/i18n/dictionary.ts",
  "site/src/pages/practical-guides.ts",
  ...listings,
  ...(fs.existsSync(new URL(`../${releaseNotes}`, import.meta.url)) ? [releaseNotes] : []),
];

// A number right before a catalog noun, in the six languages the texts use.
const NOUN = String.raw`(?:Windows[ -])?(?:Free |Pro )?(?:controls?|tweaks?|settings|controlli|impostazioni|réglages|contrôles|ajustes|controles|controlos|Einstellungen)`;
const claim = new RegExp(String.raw`\b(\d{2,3})\s+${NOUN}`, "gi");
const NEW = /^\s*(new|nuovi|nouveaux|nuevos|neue|novos)\b/i;
const problems = [];
for (const file of files) {
  const text = read(file);
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
  for (const m of text.matchAll(
    /\b\d{1,3}\s+(?:Free|Pro)\b|\b(?:Free|Pro)\s*[:/]\s*\d{1,3}\b/gi,
  )) {
    problems.push(
      `${file}: "${m[0]}" — a count labelled Free/Pro; every one of the ${total} controls is free`,
    );
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
