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
  "tests::the_catalogue_is_159_active_tweaks_all_free_in_output",
  "profiles::tests::retired_ids_from_an_old_profile_are_reported_not_reapplied",
  "recommend::scan_scope_tests::retired_controls_never_enter_scan_recommendations",
  "tweaks::retired_tweaks_are_restore_only",
  "tweaks::catalogue_tests::keyboard_repeat_settings_have_one_current_composite_owner",
];

// Build the test binary once, then execute isolated filters against the binary.
// This preserves complete process isolation while avoiding 19 separate cargo invocations.
const build = spawnSync(
  "cargo",
  ["test", "--manifest-path", "src-tauri/Cargo.toml", "--lib", "--no-run", "--message-format=json"],
  {
    cwd: fileURLToPath(new URL("..", import.meta.url)),
    stdio: ["inherit", "pipe", "inherit"],
    encoding: "utf8",
  },
);
if (build.error) throw build.error;
if (build.status !== 0) process.exit(build.status ?? 1);

let executable = null;
for (const line of build.stdout.split("\n")) {
  if (!line.trim()) continue;
  try {
    const msg = JSON.parse(line);
    if (
      msg.reason === "compiler-artifact" &&
      msg.target?.name === "tauri_app_lib" &&
      msg.executable
    ) {
      executable = msg.executable;
    }
  } catch {}
}

for (const filter of filters) {
  console.log(`\nChecking isolated native policy: ${filter}`);
  const result = executable
    ? spawnSync(executable, [filter], {
        cwd: fileURLToPath(new URL("..", import.meta.url)),
        stdio: ["inherit", "pipe", "inherit"],
        encoding: "utf8",
      })
    : spawnSync("cargo", ["test", "--manifest-path", "src-tauri/Cargo.toml", "--lib", filter], {
        cwd: fileURLToPath(new URL("..", import.meta.url)),
        stdio: ["inherit", "pipe", "inherit"],
        encoding: "utf8",
      });
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
