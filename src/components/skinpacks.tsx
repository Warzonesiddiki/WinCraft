import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { SkinpackStatus, Toast } from "../types";
import { format, type Strings } from "../i18n";
import { friendlyError } from "../lib";
import { Badge } from "./ui";
import { ToolHeader, ToolStatus } from "./tool-section";

/**
 * The one desktop look this build ships.
 *
 * It is a shell re-theme, not a desktop environment, and the panel says so in
 * its own words in all six languages rather than implying COSMIC, GNOME or
 * macOS is being installed. The scope paragraph is not decoration: it is the
 * claim, and the Rust side cannot do more than it states. Every value it writes
 * is recorded first, so the change appears in Change history with the values
 * before and after and is undone from here in one click.
 */
export function SkinpacksPanel({
  s,
  pushToast,
}: {
  s: Strings;
  pushToast: (kind: Toast["kind"], message: string) => void;
}) {
  const c = s.skinpacks;
  const [packs, setPacks] = useState<SkinpackStatus[]>([]);
  const [busy, setBusy] = useState(false);
  // Held as the raw error and localised at render time, so the read effect
  // depends on nothing that changes with the language.
  const [readError, setReadError] = useState<unknown>(null);

  useEffect(() => {
    let alive = true;
    void invoke<SkinpackStatus[]>("list_skinpacks")
      .then((next) => {
        if (alive && Array.isArray(next)) setPacks(next);
      })
      .catch((e: unknown) => {
        if (alive) setReadError(e);
      });
    return () => {
      alive = false;
    };
  }, []);

  async function apply(id: string) {
    if (busy) return;
    setBusy(true);
    try {
      const next = await invoke<SkinpackStatus>("apply_skinpack", { id });
      setPacks((current) => current.map((p) => (p.id === next.id ? next : p)));
    } catch (e) {
      pushToast("error", friendlyError(e, s));
    } finally {
      setBusy(false);
    }
  }

  async function restore() {
    if (busy) return;
    setBusy(true);
    try {
      await invoke("rollback_skinpack");
      setPacks(await invoke<SkinpackStatus[]>("list_skinpacks"));
    } catch (e) {
      pushToast("error", friendlyError(e, s));
    } finally {
      setBusy(false);
    }
  }

  const pack = packs[0];
  return (
    <section className="tool-panel mb-4" role="region" aria-labelledby="skinpacks-title">
      <ToolHeader titleId="skinpacks-title" title={c.title} description={c.description} />
      {readError !== null && <ToolStatus tone="error">{friendlyError(readError, s)}</ToolStatus>}
      {pack && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-ink">{c.packName}</h3>
            {pack.active && <Badge kind="ok">{c.active}</Badge>}
            <span className="text-[11px] text-ink-3">
              {format(c.valuesSummary, { count: pack.valueCount })}
            </span>
          </div>
          <p className="max-w-[62ch] text-xs leading-relaxed text-ink-2">{c.packBody}</p>
          <p className="max-w-[62ch] text-xs leading-relaxed text-ink-3">{c.scope}</p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {pack.active ? (
              <button
                type="button"
                disabled={busy}
                aria-busy={busy}
                onClick={() => void restore()}
                className="rounded-lg border border-accent/25 bg-surface-2 px-3 py-1.5 text-xs font-semibold text-accent transition-colors hover:bg-surface-3 disabled:opacity-50"
              >
                {busy ? c.applying : c.restore}
              </button>
            ) : (
              <button
                type="button"
                disabled={busy}
                aria-busy={busy}
                onClick={() => void apply(pack.id)}
                className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-surface-base transition-colors hover:bg-accent/90 disabled:opacity-50"
              >
                {busy ? c.applying : c.apply}
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
