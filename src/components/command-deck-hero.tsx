import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { ask } from "@tauri-apps/plugin-dialog";
import { BatchTaskOutcome, TweakInfo } from "../types";
import { Badge } from "./ui";
import { BoltIcon, UndoIcon } from "./icons";

function batchTaskFailureDetails(outcome: BatchTaskOutcome): string {
  const failedTasks = outcome.failedTasks.filter(
    (path) => !outcome.unavailableTasks.includes(path),
  );
  const names = failedTasks
    .slice(0, 3)
    .map((path) => path.split("\\").filter(Boolean).pop() ?? path);
  const remaining = failedTasks.length - names.length;
  const affected = names.length
    ? ` Affected: ${names.join(", ")}${remaining > 0 ? `, and ${remaining} more` : ""}.`
    : "";
  const retry = outcome.executionError
    ? ` Elevated retry: ${outcome.executionError.slice(0, 180)}${outcome.executionError.length > 180 ? "…" : ""}.`
    : "";
  const unavailable = outcome.unavailableTasks;
  const unavailableNames = unavailable
    .slice(0, 3)
    .map((path) => path.split("\\").filter(Boolean).pop() ?? path);
  const unavailableRemaining = unavailable.length - unavailableNames.length;
  const unverified = unavailable.length
    ? ` Could not verify ${unavailableNames.join(", ")}${unavailableRemaining > 0 ? `, and ${unavailableRemaining} more` : ""}; those tasks may be absent or unreadable.`
    : "";
  return `${affected}${retry}${unverified}`;
}

function tweakBatchFailureDetails(failures: string[]): string {
  const details = failures
    .slice(0, 3)
    .map((failure) => failure.slice(0, 180) + (failure.length > 180 ? "…" : ""));
  const remaining = failures.length - details.length;
  return ` Failed tweaks: ${details.join("; ")}${remaining > 0 ? `; and ${remaining} more` : ""}.`;
}

const ATLAS_TWEAK_IDS = [
  "svchost_split_threshold",
  "disable_autologger_diagtrack",
  "disable_autologger_sqm",
  "disable_autologger_ait",
  "disable_autologger_diaglog",
  "disable_background_apps",
  "disable_game_dvr",
  "disable_start_suggestions",
  "disable_suggested_apps",
  "disable_tailored_experiences",
  "disable_feedback_requests",
  "disable_bing_search",
  "disable_8dot3_names",
  "disable_ntfs_last_access",
];

export function CommandDeckHero({
  tweaks,
  onRefresh,
}: {
  tweaks: TweakInfo[];
  onRefresh: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [rebootNeeded, setRebootNeeded] = useState(false);

  const profileTweaks = tweaks.filter((t) => ATLAS_TWEAK_IDS.includes(t.id));
  const isOptimized =
    profileTweaks.length === ATLAS_TWEAK_IDS.length && profileTweaks.every((t) => t.applied);

  async function handleApplyAtlasOS() {
    setBusy(true);
    setStatusMessage("Reviewing the Windows 11 profile...");
    try {
      const approved = await ask(
        "This profile changes SvcHost grouping and several Windows privacy, startup, and file-system settings, then disables allowlisted scheduled tasks. Effects vary by Windows build and hardware. Some changes affect crash isolation or background features. Review the profile details before continuing; a restart may be required.",
        { title: "Review Windows 11 lightweight profile", kind: "warning" },
      );
      if (!approved) {
        setStatusMessage("No changes were made.");
        return;
      }
      await invoke("record_barebone_consent", {
        id: "barebone_tasks_batch",
        text: "I reviewed the Windows 11 profile warning and consent to its scheduled-task batch.",
      });

      const taskOutcome = await invoke<BatchTaskOutcome>("disable_all_barebone_tasks");
      if (
        taskOutcome.failed > 0 ||
        taskOutcome.executionError ||
        taskOutcome.unavailableTasks.length > 0
      ) {
        setStatusMessage(
          `Scheduled-task changes were partial (${taskOutcome.modified} succeeded, ${taskOutcome.failed} failed).${batchTaskFailureDetails(taskOutcome)} The remaining profile changes were not started.`,
        );
        onRefresh();
        return;
      }

      const tweakFailures = await invoke<string[]>("apply_tweaks", {
        ids: ATLAS_TWEAK_IDS,
        source: "windows11_light_profile",
      });
      if (tweakFailures.length > 0) {
        setStatusMessage(
          `Profile was only partially applied (${tweakFailures.length} tweaks failed).${tweakBatchFailureDetails(tweakFailures)} Other changes may have succeeded; review Change history and restart if required.`,
        );
        setRebootNeeded(true);
        onRefresh();
        return;
      }

      setStatusMessage(
        "Profile applied. Restart may be needed; compare measured results after reboot.",
      );
      setRebootNeeded(true);
      onRefresh();
    } catch (e) {
      setStatusMessage(`Profile was not fully applied: ${String(e)}`);
      onRefresh();
    } finally {
      setBusy(false);
    }
  }

  async function handleRestoreStock() {
    setBusy(true);
    setStatusMessage("Restoring saved profile state...");
    const failures: string[] = [];
    try {
      const taskOutcome = await invoke<BatchTaskOutcome>("rollback_all_barebone_tasks");
      if (
        taskOutcome.failed > 0 ||
        taskOutcome.executionError ||
        taskOutcome.unavailableTasks.length > 0
      ) {
        failures.push(
          `${taskOutcome.failed} scheduled tasks could not be restored.${batchTaskFailureDetails(taskOutcome)}`,
        );
      }
    } catch (error) {
      failures.push(`scheduled-task rollback: ${String(error)}`);
    }
    try {
      const tweakFailures = await invoke<string[]>("rollback_tweaks", { ids: ATLAS_TWEAK_IDS });
      if (tweakFailures.length > 0) {
        failures.push(`tweak rollback${tweakBatchFailureDetails(tweakFailures)}`);
      }
    } catch (error) {
      failures.push(`tweak rollback: ${String(error)}`);
    }
    setStatusMessage(
      failures.length === 0
        ? "Saved profile settings were restored. Restart may be needed."
        : `Profile restore was partial: ${failures.join("; ")}`,
    );
    setRebootNeeded(failures.length > 0);
    onRefresh();
    setBusy(false);
  }

  return (
    <div className="tool-panel p-5 rounded-2xl border border-accent/25 bg-surface-1/80 backdrop-blur-md relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-accent" aria-hidden="true">
              <BoltIcon className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-semibold text-accent uppercase tracking-wider">
              Windows 11 Lightweight Profile
            </span>
            <Badge kind="caution">Review before applying</Badge>
          </div>
          <h3 className="text-lg font-bold text-ink">
            {isOptimized ? "Lightweight Profile Active" : "Review and Apply a Lean Windows Setup"}
          </h3>
          <p className="text-xs text-ink-2 mt-1 leading-relaxed">
            Applies a selected set of service-host, privacy, startup, and file-system settings and
            allowlisted scheduled-task changes. Effects depend on Windows build and hardware. Some
            changes affect crash isolation or background features; rollback is available for
            journaled settings, but runtime effects may require a restart or separate recovery.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            disabled={busy}
            onClick={handleApplyAtlasOS}
            className="flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-surface-base hover:bg-accent/90 transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            <BoltIcon className="w-3.5 h-3.5" />
            {isOptimized ? "Verify / Re-apply Profile" : "Apply Lightweight Profile"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={handleRestoreStock}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-surface-2 px-3 py-2 text-xs font-medium text-ink-2 hover:bg-surface-3 transition-colors active:scale-95 disabled:opacity-50"
          >
            <UndoIcon className="w-3.5 h-3.5" />
            Restore Profile Changes
          </button>
        </div>
      </div>

      {(statusMessage || rebootNeeded) && (
        <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
          <span className="text-ink-2">{statusMessage}</span>
          {rebootNeeded && (
            <span className="text-warn font-medium flex items-center gap-1">
              ● Restart Windows to apply settings marked as reboot-required
            </span>
          )}
        </div>
      )}
    </div>
  );
}
