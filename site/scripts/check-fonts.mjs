// Fails when the built site ships a font subset it has no text for.
//
// The default entry of a @fontsource package pulls every subset the family
// ships, and each subset is a render-blocking @font-face rule in the critical
// stylesheet. That was 48 rules and 17 KB of a 57 KB stylesheet describing
// Cyrillic, Greek and Vietnamese — scripts this site has never contained a
// character of. Importing the named subsets (`latin-500.css`) fixed it, and
// this check is what stops it coming back: a new import that pulls a whole
// family, or a copy-pasted weight from the package's default entry, fails
// here rather than quietly adding a kilobyte of dead CSS to every page.
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";

/** One sentence and an exit code; a stack trace would bury the fix. */
function fail(message) {
  console.error(`font subsets FAILED: ${message}`);
  process.exit(1);
}

const dist = new URL("../dist/", import.meta.url);

/** Subsets the site actually needs. `latin-ext` carries the accents in names
 *  and place names; everything else is a script this site cannot render. */
const ALLOWED_SUBSETS = ["latin", "latin-ext"];

/** Families the design uses, so a font added by accident is noticed. */
const ALLOWED_FAMILIES = ["space-grotesk", "jetbrains-mono", "inter"];

const SUBSET_PATTERN =
  /^([a-z-]+?)-(cyrillic-ext|cyrillic|greek-ext|greek|vietnamese|latin-ext|latin|cjk|korean|japanese|arabic|hebrew|thai|devanagari)-/;

const assets = await readdir(new URL("assets/", dist));
const fonts = assets.filter((name) => name.endsWith(".woff2") || name.endsWith(".woff"));
if (fonts.length === 0) fail("No font files were emitted — did the font imports change?");

const shipped = new Map();
for (const name of fonts) {
  const match = name.match(SUBSET_PATTERN);
  if (!match) fail(`Font file does not name its subset, so it cannot be checked: ${name}`);
  const [, family, subset] = match;
  if (!ALLOWED_FAMILIES.includes(family))
    fail(`${name} is a family the design does not use: ${family}`);
  if (!ALLOWED_SUBSETS.includes(subset)) {
    fail(
      `${name} ships the "${subset}" subset, which this site has no text for. ` +
        `Import "@fontsource/<family>/latin-<weight>.css" instead of "@fontsource/<family>/<weight>.css".`,
    );
  }
  shipped.set(subset, (shipped.get(subset) ?? 0) + 1);
}

// The stylesheet is render-blocking, so its @font-face rules are on the
// critical path. Compare against the count the named imports produce rather
// than a magic number: 9 weights x 2 subsets.
const stylesheets = assets.filter((name) => name.endsWith(".css"));
const css = (
  await Promise.all(stylesheets.map((name) => readFile(new URL(`assets/${name}`, dist), "utf8")))
).join("\n");
const rules = [...css.matchAll(/@font-face\{([^}]*)\}/g)];
const weights = new Set();
for (const [, body] of rules) {
  // Minified CSS drops the quotes around an unquoted family name, so match it
  // with or without them rather than assuming the package's formatting.
  const family = body.match(/font-family:['"]?([^;'"]+)['"]?;/)?.[1];
  const weight = body.match(/font-weight:(\d+)/)?.[1];
  if (!family || !weight)
    fail(`@font-face without a family and weight cannot be checked: ${body.slice(0, 80)}`);
  weights.add(`${family}/${weight}`);
}
if (rules.length !== weights.size * 2) {
  fail(
    `Expected ${weights.size} family/weight pairs over 2 subsets, found ${rules.length} @font-face rules`,
  );
}

const fontRuleBytes = rules.reduce((total, match) => total + match[0].length, 0);
console.log(
  `font subsets ok: ${weights.size} family/weight pairs over ${ALLOWED_SUBSETS.join(" + ")}, ` +
    `${fonts.length} files, ${fontRuleBytes} bytes of @font-face in ${css.length} bytes of CSS`,
);
