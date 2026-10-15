import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { SkinpackInfo, Toast } from "../types";
import { Badge } from "./ui";
import { ToolHeader } from "./tool-section";

export function SkinpacksPanel({
  pushToast,
}: {
  pushToast: (kind: Toast["kind"], message: string) => void;
}) {
  const [skinpacks, setSkinpacks] = useState<SkinpackInfo[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    void invoke<SkinpackInfo[]>("list_skinpacks")
      .then((packs) => {
        if (alive && Array.isArray(packs)) {
          setSkinpacks(packs);
          const active = packs.find((p) => p.active);
          if (active) setActiveId(active.id);
        }
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  async function handleApply(id: string, name: string) {
    setBusy(true);
    try {
      await invoke("apply_skinpack", { id });
      setActiveId(id);
      pushToast("success", `Applied ${name} overlay. Windows Taskbar suppressed safely.`);
    } catch (e) {
      pushToast("error", String(e));
    } finally {
      setBusy(false);
    }
  }

  async function handleRestore() {
    setBusy(true);
    try {
      await invoke("rollback_skinpack");
      setActiveId(null);
      pushToast("success", "Restored standard Windows 11 shell and taskbar.");
    } catch (e) {
      pushToast("error", String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="tool-list-section mb-6">
      <div className="tool-panel tool-list-header mb-4">
        <ToolHeader
          title="Desktop Environment Skinpacks"
          description="100% non-destructive user-space transformation engine. Replicates Linux COSMIC DE, macOS Sequoia, GNOME 47, and KDE Plasma 6 without patching system DLLs or modifying explorer.exe. Revert anytime in under 500ms."
          actions={
            <div className="flex items-center gap-2">
              {activeId && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={handleRestore}
                  className="rounded-lg bg-surface-2 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-surface-3 transition-colors border border-accent/25"
                >
                  Restore Windows Shell
                </button>
              )}
              <Badge kind="ok">Zero DLL Patching</Badge>
            </div>
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {(skinpacks || []).map((pack) => {
          const isActive = activeId === pack.id;
          return (
            <div
              key={pack.id}
              className={`tool-panel relative flex flex-col justify-between p-4 rounded-xl border transition-all ${
                isActive
                  ? "border-accent bg-surface-2 ring-1 ring-accent/30"
                  : "border-border bg-surface-1 hover:border-line"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: pack.previewAccent }}
                      aria-hidden="true"
                    />
                    <h3 className="text-sm font-semibold text-ink-1">{pack.name}</h3>
                  </div>
                  {isActive ? (
                    <Badge kind="ok">Active</Badge>
                  ) : (
                    <span className="text-[10px] text-ink-3 uppercase tracking-wider">
                      {pack.author.split("/")[0].trim()}
                    </span>
                  )}
                </div>
                <p className="text-xs text-ink-2 leading-relaxed mb-4">{pack.description}</p>
              </div>

              <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                <span className="text-[11px] font-mono text-ink-3">
                  {pack.id === "cosmic" ? "System76 / Rust" : "User-space overlay"}
                </span>
                {isActive ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={handleRestore}
                    className="text-xs font-medium text-warn hover:underline"
                  >
                    Revert
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => handleApply(pack.id, pack.name)}
                    className="rounded-md bg-surface-3 px-3 py-1 text-xs font-medium text-ink-1 hover:bg-surface-4 transition-colors"
                  >
                    Apply Theme
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
