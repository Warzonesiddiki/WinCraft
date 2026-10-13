// Keeps docs/DATA-INVENTORY.md honest: every table the migrations create must
// be classified there, and every row of that table must name a table that
// really exists. Adding a table without deciding what it holds and what
// removes it fails here, which is the point — the page is the place where that
// decision becomes reviewable.
import fs from "node:fs";
import path from "node:path";

const root = new URL("..", import.meta.url).pathname.replace(/^\/(\w:)/, "$1");

/** Every check below reports a sentence and exits 1; a thrown stack trace would
 *  bury the one line that says what is wrong. */
function fail(message) {
  console.error(`data inventory FAILED: ${message}`);
  process.exit(1);
}
const migrationDir = path.join(root, "backend/src/migrations");
const source = fs
  .readdirSync(migrationDir)
  .map((file) => fs.readFileSync(path.join(migrationDir, file), "utf8"))
  .join("\n");

// The generated migrations carry the SQL as string literals, so a table is any
// CREATE TABLE the tree actually ships.
const tables = new Set([...source.matchAll(/CREATE TABLE IF NOT EXISTS (\w+)/g)].map((m) => m[1]));
if (tables.size < 5) fail(`Only ${tables.size} tables found — the migration source did not parse`);

const retentionClasses = new Set([
  "account",
  "security",
  "billing",
  "entitlement",
  "moderation",
  "marketing",
  "support",
  "analytics",
]);
const documented = new Map();
for (const line of fs.readFileSync(path.join(root, "docs/DATA-INVENTORY.md"), "utf8").split("\n")) {
  const row = line.match(/^\|\s*`(\w+)`\s*\|\s*[^|]+\|\s*`(\w+)`\s*\|\s*([^|]+)\|/);
  if (!row) continue;
  const [, table, retention, removed] = row;
  if (!retentionClasses.has(retention)) fail(`${table} has unknown retention class "${retention}"`);
  if (removed.trim().length < 10) fail(`${table} does not say what removes a row`);
  documented.set(table, retention);
}

// The retention windows documented here must be the ones the worker enforces.
// Parsed from the source rather than imported, because this gate runs without
// a backend build; the literal shape of RETENTION is what makes that safe, and
// backend/test/retention.test.mjs asserts the same numbers at runtime.
const retentionSource = fs.readFileSync(path.join(root, "backend/src/retention.ts"), "utf8");
const windows = [
  ...retentionSource.matchAll(/\{ table: "(\w+)", days: (\d+), column: "(\w+)" \}/g),
].map((match) => ({ table: match[1], days: Number(match[2]), column: match[3] }));
if (windows.length < 3) fail("Could not read the retention windows from backend/src/retention.ts");
const graceMatch = retentionSource.match(/UNCONFIRMED_REVIEW_GRACE_DAYS = (\d+)/);
if (!graceMatch) fail("Could not read the unconfirmed-review grace period");

for (const { table, days, column } of windows) {
  const cell = fs
    .readFileSync(path.join(root, "docs/DATA-INVENTORY.md"), "utf8")
    .split("\n")
    .find((line) => line.startsWith(`| \`${table}\``));
  if (!cell) fail(`${table} is pruned by the code but has no row in the inventory`);
  if (!cell.includes(`${days} days`)) {
    fail(`${table} is pruned at ${days} days (from ${column}) but the inventory says otherwise`);
  }
  if (!/retention\.ts/.test(cell)) fail(`${table} does not name the module that prunes it`);
}
const reviewCell = fs
  .readFileSync(path.join(root, "docs/DATA-INVENTORY.md"), "utf8")
  .split("\n")
  .find((line) => line.startsWith("| `reviews`"));
if (!reviewCell.includes(`${graceMatch[1]} days`)) {
  fail(
    `unconfirmed reviews are pruned after ${graceMatch[1]} days but the inventory says otherwise`,
  );
}

const unclassified = [...tables].filter((table) => !documented.has(table));
const phantom = [...documented.keys()].filter((table) => !tables.has(table));
if (unclassified.length)
  fail(`Tables missing from docs/DATA-INVENTORY.md: ${unclassified.join(", ")}`);
if (phantom.length)
  fail(`docs/DATA-INVENTORY.md names tables the schema does not create: ${phantom.join(", ")}`);

console.log(
  `data inventory ok: ${tables.size} tables documented, ${windows.length + 1} retention windows match backend/src/retention.ts`,
);
