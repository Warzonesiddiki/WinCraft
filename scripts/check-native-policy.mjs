import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

// Explicitly selected tests use signed fixtures, a mock IPC runtime, temporary
// files, fake operations, the in-memory registry and power backends, or (for
// core steering) CPU sets on the test process itself. The complete
// integration suite belongs in a VM.
//
// Every entry names a test that exists, and the run below fails if a filter
// matches nothing: that is how a deleted module is meant to surface here. Three
// entries pointed at licence tests — `license::tests`, whose module Batch AE
// removed, and two `tests::a_*_license_*` names, one deleted with the gate it
// proved (Batch AB) and one that had never existed in this repository, which had
// kept this script red since the check below was added.
const filters = [
  "ipc_tests",
  "rollback::tests",
  "game_sessions::tests",
  "lifetime_tools::tests",
  "power_tuning::tests",
  "dns::tests",
  "services::tests",
  "power::tests",
  "turbo::tests",
  "gaming::tests",
  "everyday::tests",
  "contextmenu::tests",
  "netshaper::tests",
  "download_limit::tests",
  "mock_registry",
  "diagnostics::dpc::tests",
  "diagnostics::network_verify::tests",
  "engine::dynamic_session::tests",
  "tests::duplicate_batch_ids_execute_only_once_and_keep_input_order",
];

for (const filter of filters) {
  console.log(`\nChecking isolated native policy: ${filter}`);
  const result = spawnSync(
    "cargo",
    ["test", "--manifest-path", "src-tauri/Cargo.toml", "--lib", filter],
    {
      cwd: fileURLToPath(new URL("..", import.meta.url)),
      stdio: ["inherit", "pipe", "inherit"],
      encoding: "utf8",
    },
  );
  if (result.error) throw result.error;
  process.stdout.write(result.stdout);
  if (result.status !== 0) process.exit(result.status ?? 1);
  // A filter that matches nothing passes with "running 0 tests"; a renamed
  // or re-gated module must fail here instead.
  const ran = [...result.stdout.matchAll(/running (\d+) tests?/g)].reduce(
    (n, m) => n + Number(m[1]),
    0,
  );
  if (ran === 0) {
    console.error(`No test matched ${filter}`);
    process.exit(1);
  }
}
