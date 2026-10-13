import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The gates in `npm run check` that `checks.yml` has no step of its own for,
 * run through the suite so CI enforces them anyway.
 *
 * The tree checks — the renderer privilege envelope
 * (`check-no-new-privileges.mjs`), the data inventory
 * (`check-data-inventory.mjs`) and the published download links
 * (`check-download-links.mjs`) — have no runtime dependency. Nothing else
 * would notice if one stopped passing, because CI runs the workflow's steps,
 * not `npm run check`.
 *
 * Adding the steps to `checks.yml` needs a push that touches
 * `.github/workflows/`, and the GitHub App this branch is pushed with does not
 * have the `workflows` permission — the same limit that keeps
 * `docs/checks-annotation.patch` and `docs/workflows-pending.patch` out of the
 * tree. Running them here means the enforcement exists today; the steps
 * remain the tidier home for them if the permission ever arrives, and this
 * test then keeps a local `npm test` honest about the same files.
 *
 * The PowerShell half is the same idea for `scripts/test-quick-installer.ps1`,
 * the offline suite over `install.ps1`'s asset selection, publisher and
 * timestamp checks, its mutation lock and its fail-closed fallback. The
 * `checks` job already runs on a Windows image, so the suite runs where it can
 * actually execute; anywhere without PowerShell the two cases report as
 * skipped rather than passing without having run. `docs/workflows-pending.patch`
 * still holds the tidier `checks.yml` step for it.
 */
// Vitest runs with the project root as the working directory, which is where
// the scripts and the tree they read live.
const repoRoot = process.cwd();

const gates: ReadonlyArray<readonly [name: string, script: string]> = [
  ["renderer privilege envelope", "scripts/check-no-new-privileges.mjs"],
  ["data inventory", "scripts/check-data-inventory.mjs"],
  ["published download links", "scripts/check-download-links.mjs"],
];

describe("repository gates with no CI step of their own", () => {
  for (const [name, script] of gates) {
    it(`${name} (${script}) passes`, () => {
      const result = spawnSync(process.execPath, [script], {
        cwd: repoRoot,
        encoding: "utf8",
      });
      const output = `${result.stdout ?? ""}${result.stderr ?? ""}`.trim();
      expect(result.status, `${script} exited ${result.status}\n${output}`).toBe(0);
      // A gate that prints nothing may have exited before doing its work.
      expect(output, `${script} printed nothing`).not.toBe("");
    });
  }
});

/** Every `.ps1` in the tree, minus the dependency and build directories. */
const SKIPPED_DIRS = new Set(["node_modules", "dist", "dist-ssr", "coverage", "target"]);

function powershellScripts(dir: string, found: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    if (entry.isDirectory()) {
      if (!SKIPPED_DIRS.has(entry.name)) powershellScripts(join(dir, entry.name), found);
    } else if (entry.name.toLowerCase().endsWith(".ps1")) {
      found.push(join(dir, entry.name));
    }
  }
  return found;
}

/**
 * `pwsh` first: the Windows image has both, and PowerShell 7 is the one the
 * scripts are written against. `null` means neither exists, which is every
 * Linux and macOS machine — the two cases below then report as skipped.
 */
function findPowerShell(): string | null {
  const candidates = process.platform === "win32" ? ["pwsh.exe", "powershell.exe"] : ["pwsh"];
  for (const candidate of candidates) {
    const probe = spawnSync(
      candidate,
      ["-NoProfile", "-Command", "$PSVersionTable.PSVersion.Major"],
      {
        encoding: "utf8",
      },
    );
    if (probe.status === 0) return candidate;
  }
  return null;
}

const powershell = findPowerShell();
const powershellArgs = (extra: string[]): string[] => [
  "-NoProfile",
  "-NonInteractive",
  ...(process.platform === "win32" ? ["-ExecutionPolicy", "Bypass"] : []),
  ...extra,
];

describe("PowerShell gates, on the runner that has PowerShell", () => {
  it.runIf(powershell !== null)(
    "the quick installer's offline regression suite passes (scripts/test-quick-installer.ps1)",
    () => {
      const result = spawnSync(
        powershell as string,
        powershellArgs(["-File", join(repoRoot, "scripts", "test-quick-installer.ps1")]),
        { cwd: repoRoot, encoding: "utf8" },
      );
      const output = `${result.stdout ?? ""}${result.stderr ?? ""}`.trim();
      expect(result.status, `test-quick-installer.ps1 exited ${result.status}\n${output}`).toBe(0);
      expect(output, "the suite did not reach its final line").toContain("Quick installer:");
    },
    120_000,
  );

  // The release and Store scripts have no runner outside a release, so a
  // syntax error in one of them survives until the day it is needed. Parsing
  // does not execute anything; it only refuses to let a typo wait there.
  it.runIf(powershell !== null)(
    "every PowerShell script in the tree parses",
    () => {
      const scripts = powershellScripts(repoRoot);
      expect(scripts.length, "found no PowerShell scripts at all").toBeGreaterThan(0);
      const program = [
        '$files = @($env:WINCRAFT_PS_FILES -split "\\n" | Where-Object { $_ })',
        "$bad = @()",
        "foreach ($file in $files) {",
        "  $errors = $null",
        "  [void][System.Management.Automation.Language.Parser]::ParseFile($file, [ref]$null, [ref]$errors)",
        "  if ($errors.Count -gt 0) { $bad += ($file + ': ' + $errors[0].Message) }",
        "}",
        "if ($bad.Count -gt 0) { $bad | ForEach-Object { Write-Host $_ }; exit 1 }",
        'Write-Host ("Parsed " + $files.Count + " PowerShell script(s): no syntax errors.")',
      ].join("\n");
      const result = spawnSync(powershell as string, powershellArgs(["-Command", program]), {
        cwd: repoRoot,
        encoding: "utf8",
        env: { ...process.env, WINCRAFT_PS_FILES: scripts.join("\n") },
      });
      const output = `${result.stdout ?? ""}${result.stderr ?? ""}`.trim();
      expect(result.status, `a PowerShell script does not parse\n${output}`).toBe(0);
      expect(output).toContain(`${scripts.length} PowerShell script(s)`);
    },
    120_000,
  );
});
