import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { BatchTaskOutcome, TweakInfo } from "../types";
import { Badge } from "./ui";
import { BoltIcon, UndoIcon } from "./icons";

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

  const isOptimized =
    tweaks.length > 0 &&
    tweaks.filter((t) => ATLAS_TWEAK_IDS.includes(t.id)).every((t) => t.applied);

  async function handleApplyAtlasOS() {
    setBusy(true);
    setStatusMessage("Applying AtlasOS-grade optimization...");
    try {
      // 1. Batch disable all allowlisted telemetry tasks
      await invoke<BatchTaskOutcome>("disable_all_barebone_tasks");

      // 2. Apply SvcHost consolidation, ETW teardown, and lean settings
      await invoke<string[]>("apply_tweaks", {
        ids: ATLAS_TWEAK_IDS,
        source: "atlasos_deck",
      });

      setStatusMessage("Optimization applied. SvcHost grouping and ETW teardown active.");
      setRebootNeeded(true);
      onRefresh();
    } catch (e) {
      setStatusMessage(`Optimization note: ${String(e)}`);
    } finally {
      setBusy(false);
    }
  }

  async function handleRestoreStock() {
    setBusy(true);
    setStatusMessage("Restoring Windows stock configuration...");
    try {
      // 1. Batch rollback all barebone tasks
      await invoke<BatchTaskOutcome>("rollback_all_barebone_tasks");

      // 2. Rollback tweaks
      await invoke<string[]>("rollback_tweaks", { ids: ATLAS_TWEAK_IDS });

      setStatusMessage("Windows stock configuration restored.");
      setRebootNeeded(false);
      onRefresh();
    } catch (e) {
      setStatusMessage(`Restoration note: ${String(e)}`);
    } finally {
      setBusy(false);
    }
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
              1-Click Command Deck
            </span>
            <Badge kind="ok">AtlasOS Target: ~85 Processes</Badge>
          </div>
          <h3 className="text-lg font-bold text-ink">
            {isOptimized
              ? "Extreme Optimization Active"
              : "Extreme Debloat & Process Consolidation"}
          </h3>
          <p className="text-xs text-ink-2 mt-1 leading-relaxed">
            Consolidate 80+ isolated SvcHost instances into shared hosts, silence 40 background
            telemetry tasks, and stop live ETW disk tracing. Zero servicing corruption, 100%
            reversible.
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
            {isOptimized ? "Re-apply AtlasOS Optimization" : "Apply AtlasOS Optimization"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={handleRestoreStock}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-surface-2 px-3 py-2 text-xs font-medium text-ink-2 hover:bg-surface-3 transition-colors active:scale-95 disabled:opacity-50"
          >
            <UndoIcon className="w-3.5 h-3.5" />
            Restore Stock
          </button>
        </div>
      </div>

      {(statusMessage || rebootNeeded) && (
        <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
          <span className="text-ink-2">{statusMessage}</span>
          {rebootNeeded && (
            <span className="text-warn font-medium flex items-center gap-1">
              ● Restart PC to fully collapse SvcHost process trees into ~85 processes
            </span>
          )}
        </div>
      )}
    </div>
  );
}
