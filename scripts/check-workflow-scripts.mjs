// Every `node scripts/*.mjs` and `npm run <script>` a workflow names must exist.
//
// The one gate that was broken on master was exactly this: a step in checks.yml
// called scripts/check-no-test-pro.mjs after Batch AE deleted the file, and
// nothing noticed because CI had never executed. This walks every workflow and
// resolves each reference against the filesystem and package.json.
//
// It is a reference check, not an execution: it never runs the steps it reads.
// Dependency-free on purpose — it parses only the `run:` blocks it needs, so the
// repository's dependency surface does not grow a YAML library for one check.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const wfDir = path.join(root, ".github", "workflows");

const indentOf = (line) => line.length - line.trimStart().length;

// Pull every `run:` block out of a workflow, keeping the `working-directory:`
// that applies to it: a sibling key of `run`, or the job-level
// `defaults.run.working-directory`, which may sit before or after the step.
function runBlocks(text) {
  const lines = text.split(/\r?\n/);

  // Job-level default. A workflow may declare more than one, so collect them all
  // and fall back to the first; every workflow in this repository declares at
  // most one, and a step-level key always wins over it.
  let jobDefault = root;
  for (let j = 0; j < lines.length; j++) {
    if (!/^\s*defaults:\s*$/.test(lines[j])) continue;
    const base = indentOf(lines[j]);
    for (let k = j + 1; k < lines.length; k++) {
      if (lines[k].trim() !== "" && indentOf(lines[k]) <= base) break;
      const wd = lines[k].match(/^\s*working-directory:\s*["']?([^"']+?)["']?\s*$/);
      if (wd && indentOf(lines[k]) > base) jobDefault = path.resolve(root, wd[1]);
    }
  }

  const blocks = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^(\s*)(?:-\s+)?run:\s*(.*)$/);
    if (!m) continue;
    const indent = indentOf(lines[i]);
    let body = m[2].trim();
    if (body === "|" || body === ">" || body === "|-" || body === ">-") {
      const parts = [];
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].trim() === "") {
          parts.push("");
          continue;
        }
        if (indentOf(lines[j]) <= indent) break;
        parts.push(lines[j].trim());
      }
      body = parts.join("\n");
      i += parts.length;
    }

    // Nearest sibling `working-directory:` at the same indent. It may sit before
    // or after `run:`, so scan both ways, stopping at the enclosing step (a line
    // indented less ends it).
    let dir = null;
    const wdAt = (j) => {
      if (indentOf(lines[j]) !== indent) return null;
      const wd = lines[j].match(/^(?:\s*)(?:-\s+)?working-directory:\s*["']?([^"']+?)["']?\s*$/);
      return wd ? wd[1] : null;
    };
    for (let j = i - 1; j >= 0; j--) {
      if (lines[j].trim() === "" || lines[j].trim().startsWith("#")) continue;
      if (indentOf(lines[j]) < indent) break;
      const wd = wdAt(j);
      if (wd) {
        dir = wd;
        break;
      }
    }
    if (dir === null) {
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].trim() === "" || lines[j].trim().startsWith("#")) continue;
        if (indentOf(lines[j]) < indent) break;
        const wd = wdAt(j);
        if (wd) {
          dir = wd;
          break;
        }
      }
    }
    blocks.push({ run: body, dir: dir === null ? jobDefault : path.resolve(root, dir) });
  }
  return blocks;
}

const readPkg = (dir) => {
  const p = path.join(dir, "package.json");
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : null;
};

const problems = [];
const counts = { scripts: 0, npm: 0, files: 0, skipped: 0 };

for (const file of fs.readdirSync(wfDir).filter((f) => /\.ya?ml$/.test(f))) {
  const text = fs.readFileSync(path.join(wfDir, file), "utf8");

  for (const { run, dir } of runBlocks(text)) {
    for (const m of run.matchAll(/node\s+(?:\.\/)?([\w./-]+\.(?:mjs|cjs|js))/g)) {
      counts.scripts++;
      if (!fs.existsSync(path.resolve(root, m[1])))
        problems.push(`${file}: calls missing script ${m[1]}`);
    }
    for (const m of run.matchAll(/npm run ([\w:-]+)/g)) {
      counts.npm++;
      const name = m[1];
      // `--prefix <dir>` points at a package that may be deliberately untracked
      // (see youtube-upload-security.yml, which no-ops when it is absent), so an
      // unresolvable prefix directory is skipped rather than reported.
      const pfx = run.match(/--prefix\s+([\w./-]+)/);
      const pkgDir = pfx ? path.resolve(root, pfx[1]) : dir;
      if (pfx && !fs.existsSync(pkgDir)) {
        counts.skipped++;
        continue;
      }
      const rel = path.relative(root, pkgDir) || ".";
      const pkg = readPkg(pkgDir);
      if (!pkg) {
        problems.push(`${file}: runs "npm run ${name}" in ${rel}, which has no package.json`);
      } else if (!pkg.scripts?.[name]) {
        problems.push(`${file}: runs "npm run ${name}" but ${rel} defines no "${name}" script`);
      }
    }
    for (const m of run.matchAll(/(?:^|\s)(\.{1,2}[/\\][\w./\\-]+\.ps1)/g)) {
      counts.files++;
      if (!fs.existsSync(path.resolve(root, m[1])))
        problems.push(`${file}: calls missing file ${m[1]}`);
    }
  }
}

if (problems.length) {
  console.error(`workflow references: ${problems.length} problem(s)`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(
  `workflow references ok: ${counts.scripts} script, ${counts.npm} npm and ${counts.files} file reference(s) across every workflow all resolve.`,
);
