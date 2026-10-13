import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

/**
 * The gates in `npm run check` that `checks.yml` has no step of its own for,
 * run through the suite so CI enforces them anyway.
 *
 * All three are tree checks with no runtime dependency: the renderer privilege
 * envelope (`check-no-new-privileges.mjs`), the data inventory
 * (`check-data-inventory.mjs`) and the published download links
 * (`check-download-links.mjs`). Nothing else would notice if one stopped
 * passing, because CI runs the workflow's steps, not `npm run check`.
 *
 * Adding the two steps to `checks.yml` needs a push that touches
 * `.github/workflows/`, and the GitHub App this branch is pushed with does not
 * have the `workflows` permission — the same limit that keeps
 * `docs/checks-annotation.patch` and `docs/workflows-pending.patch` out of the
 * tree. Running them here means the enforcement exists today; the two steps
 * remain the tidier home for them if the permission ever arrives, and this
 * test then keeps a local `npm test` honest about the same two files.
 */
// Vitest runs with the project root as the working directory, which is where
// the two scripts and the tree they read live.
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
