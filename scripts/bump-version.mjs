// Bump the version everywhere the release process expects it, and refuse to
// leave the tree half-bumped. RELEASING.md step 1: package.json, its lockfile,
// src-tauri/Cargo.toml, its lockfile and src-tauri/tauri.conf.json must all
// carry the same new version.
//
//   node scripts/bump-version.mjs 1.19.0
//
// It edits the lockfiles in place rather than regenerating them: the only line
// that changes is the package's own version, and a regeneration would churn
// resolved dependency versions this release has not tested.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const next = process.argv[2];
if (!/^\d+\.\d+\.\d+$/.test(next ?? "")) {
  console.error("usage: node scripts/bump-version.mjs <major.minor.patch>");
  process.exit(2);
}

const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const write = (p, s) => fs.writeFileSync(path.join(root, p), s, "utf8");

const edits = [
  {
    file: "package.json",
    apply(text) {
      const before = JSON.parse(text).version;
      return text.replace(`"version": "${before}"`, `"version": "${next}"`);
    },
  },
  {
    file: "package-lock.json",
    apply(text) {
      const json = JSON.parse(text);
      const before = json.version;
      // The root entry carries the version twice: at the top level and under
      // packages[""]. Both have to move or `npm ci` and `npm version` disagree.
      let out = text.replace(`"version": "${before}"`, `"version": "${next}"`);
      out = out.replace(`"": {\n      "name": "wincraft",\n      "version": "${before}"`, `"": {\n      "name": "wincraft",\n      "version": "${next}"`);
      return out;
    },
  },
  {
    file: "src-tauri/Cargo.toml",
    apply(text) {
      return text.replace(/^version = ".*"$/m, `version = "${next}"`);
    },
  },
  {
    file: "src-tauri/Cargo.lock",
    apply(text) {
      // Only this package's own version, not its dependencies'.
      return text.replace(/(name = "tauri-app"\r?\nversion = ")[^"]+(")/, `$1${next}$2`);
    },
  },
  {
    file: "src-tauri/tauri.conf.json",
    apply(text) {
      return text.replace(`"version": "${JSON.parse(text).version}"`, `"version": "${next}"`);
    },
  },
];

for (const { file, apply } of edits) {
  const before = read(file);
  const after = apply(before);
  if (before === after) {
    console.error(`bump-version: ${file} did not change - is the version already ${next}?`);
    process.exit(1);
  }
  write(file, after);
}

// Read every one back. A partial bump is the failure mode that matters: an app
// that reports one version and bundles another.
const problems = [];
const pkg = JSON.parse(read("package.json"));
const lock = JSON.parse(read("package-lock.json"));
const conf = JSON.parse(read("src-tauri/tauri.conf.json"));
const cargoToml = read("src-tauri/Cargo.toml");
const cargoLock = read("src-tauri/Cargo.lock");

if (pkg.version !== next) problems.push(`package.json reads ${pkg.version}`);
if (lock.version !== next) problems.push(`package-lock.json reads ${lock.version}`);
if (lock.packages[""]?.version !== next) problems.push(`package-lock.json packages[""] reads ${lock.packages[""]?.version}`);
if (conf.version !== next) problems.push(`tauri.conf.json reads ${conf.version}`);
if (!new RegExp(`^version = "${next}"$`, "m").test(cargoToml)) problems.push(`Cargo.toml does not read ${next}`);
if (!new RegExp(`name = "tauri-app"\\r?\\nversion = "${next}"`).test(cargoLock)) problems.push(`Cargo.lock does not read ${next}`);

if (problems.length) {
  console.error("bump-version: the tree is inconsistent:");
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

console.log(`bumped ${edits.length} files to ${next}, and all of them read ${next}.`);
