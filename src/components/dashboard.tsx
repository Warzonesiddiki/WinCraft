import { useCallback, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { type Lang, type Strings } from "../i18n";
import type { Section, TweakInfo } from "../types";
import { textFor } from "../lib";
import { type PulseSample } from "./command";
import { Badge } from "./ui";

/* ==========================================================================
   Widget system: each widget is a self-contained card that can be rearranged.
   The layout order is persisted to localStorage so users keep their own
   arrangement across sessions.
   ========================================================================== */

type WidgetId =
  "stats" | "quick-actions" | "applied-tweaks" | "next-step" | "recent-activity" | "health-score";

type WidgetDef = {
  id: WidgetId;
  label: string;
  defaultOrder: number;
};

const WIDGET_DEFS: WidgetDef[] = [
  { id: "stats", label: "System Stats", defaultOrder: 0 },
  { id: "quick-actions", label: "Quick Actions", defaultOrder: 1 },
  { id: "applied-tweaks", label: "Applied Tweaks", defaultOrder: 2 },
  { id: "next-step", label: "Next Step", defaultOrder: 3 },
  { id: "recent-activity", label: "Recent Activity", defaultOrder: 4 },
  { id: "health-score", label: "Health Score", defaultOrder: 5 },
];

const LAYOUT_KEY = "wincraft-dashboard-layout";

function readLayout(): WidgetId[] {
  try {
    const raw = localStorage.getItem(LAYOUT_KEY);
    if (!raw) return WIDGET_DEFS.map((w) => w.id);
    const parsed = JSON.parse(raw) as WidgetId[];
    // Validate: must contain all widget IDs
    const valid = WIDGET_DEFS.every((w) => parsed.includes(w.id));
    return valid ? parsed : WIDGET_DEFS.map((w) => w.id);
  } catch {
    return WIDGET_DEFS.map((w) => w.id);
  }
}

function saveLayout(order: WidgetId[]) {
  try {
    localStorage.setItem(LAYOUT_KEY, JSON.stringify(order));
  } catch {
    // Storage blocked: layout resets on next launch. Acceptable.
  }
}

/* ---- Stats Widget -------------------------------------------------------- */

function StatsWidget({ samples }: { s: Strings; samples: PulseSample[] }) {
  const latest = samples.length > 0 ? samples[samples.length - 1] : null;

  const readings = [
    {
      label: "CPU",
      value: latest ? `${Math.round(latest.cpu)}%` : "—",
      pct: latest?.cpu ?? 0,
      color:
        (latest?.cpu ?? 0) > 80
          ? "var(--danger)"
          : (latest?.cpu ?? 0) > 60
            ? "var(--warning)"
            : "var(--success)",
    },
    {
      label: "RAM",
      value:
        latest && latest.ramTotal > 0
          ? `${Math.round((latest.ramUsed / latest.ramTotal) * 100)}%`
          : "—",
      pct: latest && latest.ramTotal > 0 ? (latest.ramUsed / latest.ramTotal) * 100 : 0,
      color:
        latest && latest.ramTotal > 0 && latest.ramUsed / latest.ramTotal > 0.85
          ? "var(--danger)"
          : latest && latest.ramTotal > 0 && latest.ramUsed / latest.ramTotal > 0.7
            ? "var(--warning)"
            : "var(--success)",
    },
  ];

  return (
    <div className="dashboard-widget" data-widget="stats">
      <h3 className="widget-title">System Stats</h3>
      <div className="grid grid-cols-2 gap-4">
        {readings.map((r) => (
          <div key={r.label} className="flex flex-col items-center">
            <div className="relative h-16 w-16">
              <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke="var(--border-subtle)"
                  strokeWidth="2.5"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke={r.color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={`${Math.min(100, r.pct)} 100`}
                  className="transition-[stroke-dasharray] duration-700 ease-out"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-ink">
                {r.value}
              </span>
            </div>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-ink-3">
              {r.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- Quick Actions Widget ------------------------------------------------ */

function QuickActionsWidget({
  onNavigate,
  onScan,
  onRestoreAll,
}: {
  s: Strings;
  onNavigate: (section: Section) => void;
  onScan: () => void;
  onRestoreAll: () => void;
}) {
  const actions = [
    { label: "Run Scan", icon: "🔍", onClick: onScan },
    { label: "Restore All", icon: "↩️", onClick: onRestoreAll },
    { label: "Profiles", icon: "📁", onClick: () => onNavigate("profiles") },
    { label: "Debloat", icon: "🧹", onClick: () => onNavigate("debloat") },
  ];

  return (
    <div className="dashboard-widget" data-widget="quick-actions">
      <h3 className="widget-title">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((a) => (
          <button
            key={a.label}
            onClick={a.onClick}
            className="flex items-center gap-2.5 rounded-xl border border-line bg-surface-2 p-3 text-left transition-all hover:border-accent/30 hover:bg-surface-hover"
          >
            <span className="text-lg" aria-hidden="true">
              {a.icon}
            </span>
            <span className="text-[12px] font-semibold text-ink">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---- Applied Tweaks Widget ----------------------------------------------- */

function AppliedTweaksWidget({ s, tweaks }: { s: Strings; tweaks: TweakInfo[] }) {
  const applied = tweaks.filter((t) => t.applied);
  const maxShow = 5;
  const shown = applied.slice(0, maxShow);
  const more = applied.length - maxShow;

  return (
    <div className="dashboard-widget" data-widget="applied-tweaks">
      <div className="flex items-center justify-between">
        <h3 className="widget-title">Applied Settings</h3>
        <Badge kind="accent">{applied.length} active</Badge>
      </div>
      {applied.length === 0 ? (
        <p className="py-4 text-center text-sm text-ink-3">
          No tweaks applied yet. Run a scan to find recommendations.
        </p>
      ) : (
        <ul className="mt-2 flex flex-col gap-1.5">
          {shown.map((t) => (
            <li key={t.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ok" />
              <span className="truncate text-[12px] text-ink">
                {textFor(s.tweaks, t.id, t.name, t.description).name}
              </span>
            </li>
          ))}
          {more > 0 && <li className="px-2 text-[11px] text-ink-3">+{more} more</li>}
        </ul>
      )}
    </div>
  );
}

/* ---- Next Step Widget ---------------------------------------------------- */

function NextStepWidget({
  tweaks,
  onNavigate,
}: {
  s: Strings;
  tweaks: TweakInfo[];
  onNavigate: (section: Section) => void;
}) {
  const appliedCount = tweaks.filter((t) => t.applied).length;
  const total = tweaks.length;

  // Decide the best next step based on current state
  const suggestion =
    appliedCount === 0
      ? {
          title: "Run your first scan",
          description: "Find settings that could improve your PC's performance and privacy.",
          action: "Open Scan",
          icon: "🔍",
          onClick: () => onNavigate("scan"),
        }
      : appliedCount < 5
        ? {
            title: "Explore more tweaks",
            description: `You have ${appliedCount} of ${total} tweaks applied. Discover more in Performance and Privacy.`,
            action: "Browse Performance",
            icon: "⚡",
            onClick: () => onNavigate("performance"),
          }
        : {
            title: "Save your setup as a profile",
            description: "Lock in your configuration so you can restore it anytime or share it.",
            action: "Open Profiles",
            icon: "📁",
            onClick: () => onNavigate("profiles"),
          };

  return (
    <div className="dashboard-widget" data-widget="next-step">
      <h3 className="widget-title">Suggested Next</h3>
      <div className="mt-2 flex items-start gap-3 rounded-xl border border-line bg-surface-2 p-4">
        <span className="text-2xl" aria-hidden="true">
          {suggestion.icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-ink">{suggestion.title}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-ink-3">{suggestion.description}</p>
          <button
            onClick={suggestion.onClick}
            className="mt-3 rounded-lg bg-accent px-3 py-1.5 text-[11px] font-semibold text-on-accent transition-opacity hover:opacity-90"
          >
            {suggestion.action} →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---- Recent Activity Widget ---------------------------------------------- */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function RecentActivityWidget(_props: { s: Strings; lang: Lang }) {
  const [entries, setEntries] = useState<{ id: string; label: string; at: string; kind: string }[]>(
    [],
  );

  useEffect(() => {
    invoke<{ id: string; label: string; at: string; kind: string }[]>("recent_history", {
      limit: 5,
    })
      .then(setEntries)
      .catch(() => setEntries([]));
  }, []);

  return (
    <div className="dashboard-widget" data-widget="recent-activity">
      <h3 className="widget-title">Recent Activity</h3>
      {entries.length === 0 ? (
        <p className="py-4 text-center text-sm text-ink-3">Your activity log starts here.</p>
      ) : (
        <ul className="mt-2 flex flex-col gap-1.5">
          {entries.map((e, i) => (
            <li key={i} className="flex items-center gap-2 rounded-lg px-2 py-1.5">
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${e.kind === "apply" ? "bg-ok" : "bg-warn"}`}
              />
              <span className="min-w-0 flex-1 truncate text-[12px] text-ink">{e.label}</span>
              <span className="shrink-0 text-[10px] text-ink-3">{e.at}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---- Health Score Widget ------------------------------------------------- */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function HealthScoreWidget(_props: { s: Strings }) {
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    invoke<{ report: { score: number } }>("health_report")
      .then((r) => setScore(r.report.score))
      .catch(() => setScore(null));
  }, []);

  const verdict =
    score === null
      ? { label: "Unknown", color: "var(--text-muted)" }
      : score >= 85
        ? { label: "Excellent", color: "var(--success)" }
        : score >= 70
          ? { label: "Good", color: "var(--success)" }
          : score >= 50
            ? { label: "Fair", color: "var(--warning)" }
            : { label: "Needs Work", color: "var(--danger)" };

  return (
    <div className="dashboard-widget" data-widget="health-score">
      <h3 className="widget-title">PC Health</h3>
      <div className="flex items-center justify-center py-4">
        <div className="relative h-24 w-24">
          <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="none"
              stroke="var(--border-subtle)"
              strokeWidth="2"
            />
            {score !== null && (
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke={verdict.color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={`${score} 100`}
                className="transition-[stroke-dasharray] duration-1000 ease-out"
              />
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-ink">{score !== null ? score : "—"}</span>
            <span
              className="text-[9px] font-semibold uppercase tracking-wider"
              style={{ color: verdict.color }}
            >
              {verdict.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   Dashboard shell: renders widgets in the user's preferred order with a
   drag handle on each card for rearranging.
   ========================================================================== */

export function Dashboard({
  s,
  lang,
  tweaks,
  samples,
  onNavigate,
  onScan,
  onRestoreAll,
}: {
  s: Strings;
  lang: Lang;
  tweaks: TweakInfo[];
  samples: PulseSample[];
  onNavigate: (section: Section) => void;
  onScan: () => void;
  onRestoreAll: () => void;
}) {
  const [layout, setLayout] = useState<WidgetId[]>(readLayout);
  const [customizing, setCustomizing] = useState(false);
  const [dragId, setDragId] = useState<WidgetId | null>(null);
  const [dragOverId, setDragOverId] = useState<WidgetId | null>(null);

  const reorder = useCallback((from: WidgetId, to: WidgetId) => {
    setLayout((prev) => {
      const next = [...prev];
      const fromIdx = next.indexOf(from);
      const toIdx = next.indexOf(to);
      if (fromIdx < 0 || toIdx < 0) return prev;
      next.splice(fromIdx, 1);
      next.splice(toIdx, 0, from);
      saveLayout(next);
      return next;
    });
  }, []);

  const widgetMap: Record<WidgetId, React.ReactNode> = {
    stats: <StatsWidget s={s} samples={samples} />,
    "quick-actions": (
      <QuickActionsWidget
        s={s}
        onNavigate={onNavigate}
        onScan={onScan}
        onRestoreAll={onRestoreAll}
      />
    ),
    "applied-tweaks": <AppliedTweaksWidget s={s} tweaks={tweaks} />,
    "next-step": <NextStepWidget s={s} tweaks={tweaks} onNavigate={onNavigate} />,
    "recent-activity": <RecentActivityWidget s={s} lang={lang} />,
    "health-score": <HealthScoreWidget s={s} />,
  };

  return (
    <div className="dashboard-panel">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-accent">
            YOUR PC, IN PERSPECTIVE
          </p>
          <h1 className="mt-1 text-[22px] font-bold tracking-tight text-ink">
            Welcome to WinCraft
          </h1>
        </div>
        <button
          onClick={() => setCustomizing((v) => !v)}
          className={`rounded-lg border px-3 py-1.5 text-[11px] font-semibold transition-colors ${
            customizing
              ? "border-accent bg-accent-soft text-accent"
              : "border-line text-ink-3 hover:text-ink"
          }`}
        >
          {customizing ? "Done" : "Customize"}
        </button>
      </div>

      {customizing && (
        <p className="mb-4 text-[11px] text-ink-3">
          Drag widgets to rearrange your dashboard. Your layout is saved automatically.
        </p>
      )}

      {/* Widget grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {layout.map((id) => (
          <div
            key={id}
            draggable={customizing}
            onDragStart={() => setDragId(id)}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverId(id);
            }}
            onDrop={() => {
              if (dragId && dragId !== id) reorder(dragId, id);
              setDragId(null);
              setDragOverId(null);
            }}
            onDragEnd={() => {
              setDragId(null);
              setDragOverId(null);
            }}
            className={`transition-all ${
              customizing ? "cursor-grab active:cursor-grabbing" : ""
            } ${dragId === id ? "opacity-40" : ""} ${
              dragOverId === id && dragId !== id
                ? "ring-2 ring-accent ring-offset-2 ring-offset-app"
                : ""
            }`}
          >
            {customizing && (
              <div className="mb-1 flex items-center gap-1 px-1 text-[9px] font-semibold uppercase tracking-wider text-ink-3">
                <span>⠿</span>
                <span>{WIDGET_DEFS.find((w) => w.id === id)?.label}</span>
              </div>
            )}
            {widgetMap[id]}
          </div>
        ))}
      </div>

      {/* Keyboard shortcut hint */}
      <p className="mt-8 text-center text-[11px] text-ink-3">
        Press{" "}
        <kbd className="rounded border border-line bg-surface-2 px-1.5 py-0.5 text-[10px] font-semibold">
          Ctrl+K
        </kbd>{" "}
        to search all tweaks and actions
      </p>
    </div>
  );
}
