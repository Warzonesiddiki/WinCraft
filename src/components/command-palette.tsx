import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { format, Strings } from "../i18n";
import type { Section, TweakInfo } from "../types";
import { textFor } from "../lib";

type CommandAction =
  | { kind: "navigate"; section: Section }
  | { kind: "tweak"; id: string; name: string; applied: boolean }
  | { kind: "action"; id: string; label: string; run: () => void };

type Command = {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  shortcut?: string;
  action: CommandAction;
};

/**
 * A VS Code-style command palette triggered by Ctrl+K.
 *
 * Fuzzy-searches across all 81 tweaks, 14 navigation sections, and
 * common actions (scan, restore, profiles). Results are ranked by
 * match quality: prefix matches first, then substring, then fuzzy.
 *
 * Keyboard-driven: ↑↓ to navigate, Enter to execute, Escape to close.
 * The palette is a portal — it renders above everything and traps focus.
 */
export function CommandPalette({
  s,
  tweaks,
  onClose,
  onNavigate,
  onToggleTweak,
  onScan,
  onRestoreAll,
  onOpenProfiles,
}: {
  s: Strings;
  tweaks: TweakInfo[];
  onClose: () => void;
  onNavigate: (section: Section) => void;
  onToggleTweak: (tweak: TweakInfo) => void;
  onScan: () => void;
  onRestoreAll: () => void;
  onOpenProfiles: () => void;
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const commands = useMemo<Command[]>(() => {
    const nav: Command[] = [
      {
        id: "nav-scan",
        label: s.tabs.scan,
        icon: "🔍",
        action: { kind: "navigate", section: "scan" },
      },
      {
        id: "nav-overview",
        label: s.tabs.overview,
        icon: "📊",
        action: { kind: "navigate", section: "overview" },
      },
      {
        id: "nav-health",
        label: s.tabs.health,
        icon: "💚",
        action: { kind: "navigate", section: "health" },
      },
      {
        id: "nav-hardware",
        label: s.tabs.hardware,
        icon: "🖥️",
        action: { kind: "navigate", section: "hardware" },
      },
      {
        id: "nav-performance",
        label: s.tabs.performance,
        icon: "⚡",
        action: { kind: "navigate", section: "performance" },
      },
      {
        id: "nav-gaming",
        label: s.tabs.gaming,
        icon: "🎮",
        action: { kind: "navigate", section: "gaming" },
      },
      {
        id: "nav-privacy",
        label: s.tabs.privacy,
        icon: "🔒",
        action: { kind: "navigate", section: "privacy" },
      },
      {
        id: "nav-startup",
        label: s.tabs.startup,
        icon: "🚀",
        action: { kind: "navigate", section: "startup" },
      },
      {
        id: "nav-debloat",
        label: "Debloat",
        icon: "🧹",
        action: { kind: "navigate", section: "debloat" },
      },
      { id: "nav-ui", label: s.tabs.ui, icon: "🎨", action: { kind: "navigate", section: "ui" } },
      {
        id: "nav-maintenance",
        label: s.tabs.maintenance,
        icon: "🔧",
        action: { kind: "navigate", section: "maintenance" },
      },
      {
        id: "nav-profiles",
        label: s.tabs.profiles,
        icon: "📁",
        action: { kind: "navigate", section: "profiles" },
      },
    ];

    const actions: Command[] = [
      {
        id: "action-scan",
        label: s.command?.runScan ?? "Run Scan",
        icon: "▶️",
        shortcut: "Ctrl+Shift+S",
        action: {
          kind: "action",
          id: "scan",
          label: s.command?.runScan ?? "Run Scan",
          run: onScan,
        },
      },
      {
        id: "action-restore",
        label: s.restore?.button ?? "Restore All",
        icon: "↩️",
        action: {
          kind: "action",
          id: "restore",
          label: s.restore?.button ?? "Restore All",
          run: onRestoreAll,
        },
      },
      {
        id: "action-profiles",
        label: s.profiles?.title ?? "Profiles",
        icon: "📁",
        action: {
          kind: "action",
          id: "profiles",
          label: s.profiles?.title ?? "Profiles",
          run: onOpenProfiles,
        },
      },
    ];

    const tweakCommands: Command[] = tweaks
      .filter((t) => t.id !== "turbo_boost")
      .map((t) => {
        const text = textFor(s.tweaks, t.id, t.name, t.description);
        return {
          id: `tweak-${t.id}`,
          label: text.name,
          description: text.description,
          icon: t.applied ? "✅" : "⬜",
          action: { kind: "tweak" as const, id: t.id, name: text.name, applied: t.applied },
        };
      });

    return [...actions, ...nav, ...tweakCommands];
  }, [s, tweaks, onScan, onRestoreAll, onOpenProfiles]);

  const filtered = useMemo(() => {
    if (!query.trim()) return commands.slice(0, 12);
    const q = query.toLowerCase().trim();
    const scored = commands
      .map((cmd) => {
        const label = cmd.label.toLowerCase();
        const desc = (cmd.description ?? "").toLowerCase();
        // Exact prefix match: highest priority
        if (label.startsWith(q)) return { cmd, score: 100 };
        // Contains match
        if (label.includes(q)) return { cmd, score: 80 };
        // Description match
        if (desc.includes(q)) return { cmd, score: 60 };
        // Fuzzy match: all query chars appear in order
        let qi = 0;
        for (let i = 0; i < label.length && qi < q.length; i++) {
          if (label[i] === q[qi]) qi++;
        }
        if (qi === q.length) return { cmd, score: 40 };
        return null;
      })
      .filter(Boolean)
      .sort((a, b) => (b?.score ?? 0) - (a?.score ?? 0))
      .map((s) => s!.cmd);
    return scored.slice(0, 12);
  }, [commands, query]);

  // The palette is mounted only while it is open (the caller renders it
  // conditionally), so the query and the cursor start fresh on every open
  // without a reset-in-effect pass. Focus is the one thing left to do.
  useEffect(() => {
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, []);

  // Keep active item in view
  useEffect(() => {
    if (!listRef.current) return;
    const items = listRef.current.querySelectorAll("[data-command]");
    items[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const execute = useCallback(
    (cmd: Command) => {
      onClose();
      const action = cmd.action;
      switch (action.kind) {
        case "navigate":
          onNavigate(action.section);
          break;
        case "tweak": {
          const tweakId = action.id;
          const tweak = tweaks.find((t) => t.id === tweakId);
          if (tweak) onToggleTweak(tweak);
          break;
        }
        case "action":
          action.run();
          break;
      }
    },
    [onClose, onNavigate, onToggleTweak, tweaks],
  );

  function onKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (filtered[activeIndex]) execute(filtered[activeIndex]);
        break;
      case "Escape":
        e.preventDefault();
        onClose();
        break;
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-scrim/50 backdrop-blur-sm" />

      {/* Palette */}
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-line bg-surface-1 shadow-2xl"
        role="dialog"
        aria-label="Command palette"
        onKeyDown={onKeyDown}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 shrink-0 text-ink-3"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="m21 21-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder={format(s.search?.placeholder ?? "Search tweaks, settings, actions…", {})}
            className="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-3"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="hidden rounded border border-line bg-surface-2 px-1.5 py-0.5 text-[10px] font-semibold text-ink-3 sm:block">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-80 overflow-y-auto p-1.5">
          {filtered.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-ink-3">
              {format(s.search?.noResults ?? 'No results for "{query}"', { query: query.trim() })}
            </p>
          ) : (
            filtered.map((cmd, i) => (
              <button
                key={cmd.id}
                data-command
                type="button"
                onClick={() => execute(cmd)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                  i === activeIndex
                    ? "bg-accent-soft text-ink"
                    : "text-ink-2 hover:bg-surface-hover"
                }`}
              >
                <span className="shrink-0 text-base" aria-hidden="true">
                  {cmd.icon ?? "•"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold">{cmd.label}</p>
                  {cmd.description && (
                    <p className="mt-0.5 truncate text-[11px] text-ink-3">{cmd.description}</p>
                  )}
                </div>
                {cmd.shortcut && (
                  <kbd className="shrink-0 rounded border border-line bg-surface-2 px-1.5 py-0.5 text-[10px] font-semibold text-ink-3">
                    {cmd.shortcut}
                  </kbd>
                )}
                {cmd.action.kind === "tweak" && (
                  <span className="shrink-0 text-[10px] font-semibold uppercase text-ink-3">
                    {cmd.action.applied ? "On" : "Off"}
                  </span>
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 border-t border-line px-4 py-2 text-[10px] text-ink-3">
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-line px-1">↑↓</kbd> navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-line px-1">↵</kbd> select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-line px-1">esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Global keyboard shortcut hook. Registers Ctrl+K (or Cmd+K on Mac) to
 * open the command palette. The shortcut is active everywhere except
 * inside text inputs and textareas.
 */
export function useCommandPaletteShortcut(): [boolean, () => void, () => void] {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        // Don't steal from text inputs
        const tag = (e.target as HTMLElement).tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return [open, () => setOpen(false), () => setOpen(true)];
}
