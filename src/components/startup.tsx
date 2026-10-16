import { ToolHeader, ToolSearch, ToolStatus, ToolDetails } from "./tool-section";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { format, Strings } from "../i18n";
import {
  BareboneTaskEntry,
  BatchTaskOutcome,
  ScheduledTaskEntry,
  StartupEntry,
  Toast,
} from "../types";
import { Badge, Toggle } from "./ui";

function StartupMark({ name, src }: { name: string; src?: string | null }) {
  const [failedSource, setFailedSource] = useState<string>();
  return (
    <span className="tool-program-mark" aria-hidden="true">
      {src?.startsWith("data:image/png;base64,") && src !== failedSource ? (
        <img src={src} alt="" onError={() => setFailedSource(src)} />
      ) : (
        <span>
          {name
            .replace(/^Microsoft\s+/i, "")
            .slice(0, 2)
            .toUpperCase()}
        </span>
      )}
    </span>
  );
}

/**
 * Reads and toggles the same StartupApproved entries Windows' own Task Manager
 * uses, so what's shown here matches what Windows reports and disabling
 * something is exactly as reversible as doing it there.
 *
 * Three places, not one: the 64-bit `Run` key, its 32-bit counterpart under
 * `WOW6432Node`, and the Startup folder. This app is a 64-bit process, so
 * reading only the first meant every entry belonging to 32-bit software — most
 * consumer installers — was silently missing from a list whose entire job is to
 * be complete.
 */
export function StartupManager({
  s,
  pushToast,
}: {
  s: Strings;
  pushToast: (kind: Toast["kind"], message: string) => void;
}) {
  const [items, setItems] = useState<StartupEntry[]>([]);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [rescanning, setRescanning] = useState(false);
  const [query, setQuery] = useState("");
  const [loadError, setLoadError] = useState<string | null>(null);

  // Location is part of the key: the same program name can legitimately
  // appear in the registry and in the Startup folder, and a key without it
  // would put both rows into the busy state on one click.
  const keyOf = (item: StartupEntry) => `${item.scope}:${item.location}:${item.name}`;

  async function refresh() {
    try {
      const list = await invoke<StartupEntry[]>("list_startup_items");
      setLoadError(null);
      setItems(list);
      setLoaded(true);
    } catch (error) {
      setLoadError(String(error));
      throw error;
    }
  }

  /**
   * The user-facing rescan.
   *
   * The list was already read fresh from the registry on every mount — there
   * is no cache — but nothing on screen said so, so a list that still showed
   * software you had just uninstalled looked like the app was holding a stale
   * copy. (It wasn't: the uninstaller left its Run value behind, which is why
   * those rows are now dropped entirely.) An explicit button with a visible
   * pass gives that check somewhere to happen, and the brief hold below makes
   * it legible: an instant no-op re-render reads as a dead button.
   */
  async function rescan() {
    setLoadError(null);
    setRescanning(true);
    const startedAt = Date.now();
    try {
      await refresh();
    } catch (e) {
      pushToast("error", String(e));
    } finally {
      const elapsed = Date.now() - startedAt;
      window.setTimeout(() => setRescanning(false), Math.max(0, 450 - elapsed));
    }
  }

  useEffect(() => {
    // Mount-time load; every setState in refresh() lands after its await.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh().catch((e) => pushToast("error", String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function toggleItem(item: StartupEntry) {
    setLoadError(null);
    setBusyKey(keyOf(item));
    try {
      await invoke("set_startup_enabled", {
        scope: item.scope,
        location: item.location,
        name: item.name,
        enabled: !item.enabled,
      });
      await refresh();
    } catch (e) {
      pushToast("error", String(e));
    } finally {
      setBusyKey(null);
    }
  }

  /**
   * Entries whose executable is gone are dropped, not listed.
   *
   * They were briefly shown with a "no longer installed" badge, on the
   * reasoning that hiding real registry state is worse than explaining it.
   * That was the wrong call for this screen: this list answers "what starts
   * with my PC", and a program that has been uninstalled does not start with
   * anything — the row was noise dressed up as information. The count below
   * keeps it from being a silent disappearance.
   */
  /** Startup-folder rows carry the shortcut's real file name, because that is
   *  the key the registry write needs. Trimming `.lnk` is a display decision
   *  and belongs here rather than in the code that has to get the key right. */
  const displayName = (item: StartupEntry) =>
    item.location === "folder" ? item.name.replace(/\.(lnk|url)$/i, "") : item.name;

  const locationLabel: Record<StartupEntry["location"], string> = {
    run: s.startupManager.locationRun,
    run32: s.startupManager.locationRun32,
    folder: s.startupManager.locationFolder,
  };

  const visible = items.filter((i) => !i.orphaned);
  const hiddenCount = items.length - visible.length;
  const enabledCount = visible.filter((i) => i.enabled).length;
  const filtered = visible.filter((item) =>
    `${displayName(item)} ${item.command}`
      .toLocaleLowerCase()
      .includes(query.trim().toLocaleLowerCase()),
  );

  return (
    <section role="region" aria-labelledby="startup-manager-title" className="tool-list-section">
      <div className="tool-panel tool-list-header">
        <ToolHeader
          titleId="startup-manager-title"
          title={s.startupManager.title}
          description={s.startupManager.description}
          actions={
            <div className="tool-header-actions">
              {loaded && visible.length > 0 && (
                <Badge>
                  {format(s.startupManager.activeCount, {
                    enabled: enabledCount,
                    total: visible.length,
                  })}
                </Badge>
              )}
              <button
                type="button"
                onClick={() => void rescan()}
                disabled={rescanning}
                className="border-line-2 text-ink-2 hover:border-accent/40 hover:text-ink flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors disabled:cursor-wait"
              >
                <span
                  className={`inline-block h-3 w-3 rounded-full border-2 border-current border-t-transparent ${
                    rescanning ? "animate-spin" : ""
                  }`}
                />
                {rescanning ? s.startupManager.refreshing : s.startupManager.refresh}
              </button>
            </div>
          }
        />
        <p className="mt-2 text-xs text-ink-3">{s.startupManager.impactNote}</p>
        {hiddenCount > 0 && (
          <p className="mt-1.5 text-xs text-ink-3">
            {format(s.startupManager.hiddenOrphans, { count: hiddenCount })}
          </p>
        )}
      </div>

      {!loaded && !loadError && <ToolStatus busy>{s.startupManager.refreshing}</ToolStatus>}
      {loadError && <ToolStatus tone="error">{loadError}</ToolStatus>}
      {loaded && visible.length > 0 && (
        <ToolSearch
          s={s}
          value={query}
          onChange={setQuery}
          count={filtered.length}
          total={visible.length}
        />
      )}
      {loaded && visible.length > 0 && filtered.length === 0 && (
        <ToolStatus>{format(s.search.noResults, { query })}</ToolStatus>
      )}
      {loaded && visible.length === 0 && (
        <div className="rounded-2xl border border-dashed border-line p-10 text-center text-sm text-ink-3">
          {s.startupManager.empty}
        </div>
      )}

      {filtered.map((item, i) => (
        <div
          key={keyOf(item)}
          style={{ animationDelay: `${i * 40}ms` }}
          className="tool-startup-row animate-card"
        >
          <div className="flex items-center gap-4">
            <StartupMark name={displayName(item)} src={item.icon_data_url} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-ink">{displayName(item)}</h3>
                <Badge kind="muted">{locationLabel[item.location]}</Badge>
                {item.requires_admin && (
                  <>
                    <Badge>{s.startupManager.machineWide}</Badge>
                    <Badge kind="admin">{s.badges.admin}</Badge>
                  </>
                )}
              </div>
              <ToolDetails label={s.healthPanel.showMore}>
                <code className="tool-command">{item.command}</code>
              </ToolDetails>
            </div>
            <Toggle
              label={item.name}
              checked={item.enabled}
              busy={busyKey === keyOf(item)}
              onClick={() => toggleItem(item)}
              s={s}
            />
          </div>
        </div>
      ))}
    </section>
  );
}

/**
 * Third-party tasks that run at sign-in or boot.
 *
 * A separate list from the one above because it answers the same question
 * through a different mechanism, and because the safety rules differ: these
 * are read from the Task Scheduler, Windows' own tasks are filtered out in the
 * backend and never reach this component, and most rows need administrator
 * rights to change.
 */
export function ScheduledTaskManager({
  s,
  pushToast,
}: {
  s: Strings;
  pushToast: (kind: Toast["kind"], message: string) => void;
}) {
  const [tasks, setTasks] = useState<ScheduledTaskEntry[]>([]);
  const [bareboneTasks, setBareboneTasks] = useState<BareboneTaskEntry[]>([]);
  const [busyPath, setBusyPath] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [rescanning, setRescanning] = useState(false);
  const [query, setQuery] = useState("");
  const [loadError, setLoadError] = useState<string | null>(null);

  async function refresh() {
    try {
      const [list, bbList] = await Promise.all([
        invoke<ScheduledTaskEntry[]>("list_scheduled_tasks"),
        invoke<BareboneTaskEntry[]>("list_barebone_tasks").catch(() => []),
      ]);
      setLoadError(null);
      setTasks(list);
      setBareboneTasks(bbList);
      setLoaded(true);
    } catch (error) {
      setLoadError(String(error));
      throw error;
    }
  }

  /** Reading the tasks means one `schtasks` call per candidate, so unlike the
   *  registry list above this genuinely takes a moment — no artificial hold is
   *  needed to make the button feel like it did something. */
  async function rescan() {
    setLoadError(null);
    setRescanning(true);
    try {
      await refresh();
    } catch (e) {
      pushToast("error", String(e));
    } finally {
      setRescanning(false);
    }
  }

  useEffect(() => {
    // Mount-time load; every setState in refresh() lands after its await.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh().catch((e) => pushToast("error", String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function toggleTask(task: ScheduledTaskEntry) {
    setLoadError(null);
    setBusyPath(task.path);
    try {
      await invoke("set_scheduled_task_enabled", {
        path: task.path,
        enabled: !task.enabled,
      });
      await refresh();
    } catch (e) {
      pushToast("error", String(e));
    } finally {
      setBusyPath(null);
    }
  }

  async function toggleBareboneTask(task: BareboneTaskEntry) {
    setLoadError(null);
    setBusyPath(task.path);
    try {
      if (task.enabled) {
        await invoke("record_barebone_consent", { id: task.path, text: "Disable telemetry task" });
        await invoke("set_barebone_task", { path: task.path, enabled: false });
        pushToast("success", `Disabled ${task.name}`);
      } else {
        await invoke("record_barebone_consent", { id: task.path, text: "Restore telemetry task" });
        await invoke("rollback_barebone_task", { path: task.path });
        pushToast("success", `Restored ${task.name}`);
      }
      await refresh();
    } catch (e) {
      pushToast("error", String(e));
    } finally {
      setBusyPath(null);
    }
  }

  async function disableAllTelemetryTasks() {
    setLoadError(null);
    setBusyPath("all-batch");
    try {
      const outcome = await invoke<BatchTaskOutcome>("disable_all_barebone_tasks");
      pushToast("success", `Disabled ${outcome.modified} telemetry tasks in one batch`);
      await refresh();
    } catch (e) {
      pushToast("error", String(e));
    } finally {
      setBusyPath(null);
    }
  }

  async function restoreAllTelemetryTasks() {
    setLoadError(null);
    setBusyPath("all-batch");
    try {
      const outcome = await invoke<BatchTaskOutcome>("rollback_all_barebone_tasks");
      pushToast("success", `Restored ${outcome.modified} telemetry tasks`);
      await refresh();
    } catch (e) {
      pushToast("error", String(e));
    } finally {
      setBusyPath(null);
    }
  }

  const enabledCount = tasks.filter((t) => t.enabled).length;
  const filtered = tasks.filter((task) =>
    `${task.name} ${task.command} ${task.path}`
      .toLocaleLowerCase()
      .includes(query.trim().toLocaleLowerCase()),
  );

  return (
    <section
      role="region"
      aria-labelledby="scheduled-tasks-title"
      className="tool-list-section mt-5"
    >
      <div className="tool-panel tool-list-header">
        <ToolHeader
          titleId="scheduled-tasks-title"
          title={s.scheduledTasks.title}
          description={s.scheduledTasks.description}
          actions={
            <div className="tool-header-actions">
              {loaded && tasks.length > 0 && (
                <Badge>
                  {format(s.scheduledTasks.activeCount, {
                    enabled: enabledCount,
                    total: tasks.length,
                  })}
                </Badge>
              )}
              <button
                type="button"
                onClick={() => void rescan()}
                disabled={rescanning}
                className="border-line-2 text-ink-2 hover:border-accent/40 hover:text-ink flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors disabled:cursor-wait"
              >
                <span
                  className={`inline-block h-3 w-3 rounded-full border-2 border-current border-t-transparent ${
                    rescanning ? "animate-spin" : ""
                  }`}
                />
                {rescanning ? s.scheduledTasks.refreshing : s.scheduledTasks.refresh}
              </button>
            </div>
          }
        />
        <p className="mt-2 text-xs text-ink-3">{s.scheduledTasks.note}</p>
      </div>

      {!loaded && !loadError && <ToolStatus busy>{s.scheduledTasks.refreshing}</ToolStatus>}
      {loadError && <ToolStatus tone="error">{loadError}</ToolStatus>}
      {loaded && tasks.length > 0 && (
        <ToolSearch
          s={s}
          value={query}
          onChange={setQuery}
          count={filtered.length}
          total={tasks.length}
        />
      )}
      {loaded && tasks.length > 0 && filtered.length === 0 && (
        <ToolStatus>{format(s.search.noResults, { query })}</ToolStatus>
      )}
      {loaded && tasks.length === 0 && (
        <div className="rounded-2xl border border-dashed border-line p-10 text-center text-sm text-ink-3">
          {s.scheduledTasks.empty}
        </div>
      )}

      {filtered.map((task, i) => (
        <div
          key={task.path}
          style={{ animationDelay: `${i * 40}ms` }}
          className="tool-startup-row animate-card"
        >
          <div className="flex items-center gap-4">
            <StartupMark name={task.name} src={task.icon_data_url} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-ink">{task.name}</h3>
                <Badge kind="muted">
                  {task.trigger === "boot"
                    ? s.scheduledTasks.triggerBoot
                    : s.scheduledTasks.triggerLogon}
                </Badge>
                {task.requires_admin && <Badge kind="admin">{s.badges.admin}</Badge>}
              </div>
              <ToolDetails label={s.healthPanel.showMore}>
                <code className="tool-command">{task.command || task.path}</code>
              </ToolDetails>
            </div>
            <Toggle
              label={task.name}
              checked={task.enabled}
              busy={busyPath === task.path}
              onClick={() => toggleTask(task)}
              s={s}
            />
          </div>
        </div>
      ))}

      {loaded && bareboneTasks.filter((t) => t.present).length > 0 && (
        <section
          role="region"
          aria-labelledby="telemetry-tasks-title"
          className="tool-list-section mt-8"
        >
          <div className="tool-panel tool-list-header">
            <ToolHeader
              titleId="telemetry-tasks-title"
              title="Windows Telemetry &amp; Diagnostic Tasks"
              description="Allowlisted background tasks for CEIP, compatibility telemetry, and background diagnostics. Disabling them reduces background wake-ups."
              actions={
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={busyPath !== null}
                    onClick={disableAllTelemetryTasks}
                    className="rounded-lg bg-warn/15 px-2.5 py-1 text-xs font-semibold text-warn hover:bg-warn/25 transition-colors"
                  >
                    Disable All ({bareboneTasks.filter((t) => t.present && t.enabled).length})
                  </button>
                  <button
                    type="button"
                    disabled={busyPath !== null}
                    onClick={restoreAllTelemetryTasks}
                    className="rounded-lg bg-surface-2 px-2.5 py-1 text-xs font-medium text-ink-2 hover:bg-surface-3 transition-colors"
                  >
                    Restore All
                  </button>
                  <Badge kind="caution">Tier 3</Badge>
                </div>
              }
            />
          </div>
          {bareboneTasks
            .filter((t) => t.present)
            .map((task, i) => (
              <div
                key={task.path}
                style={{ animationDelay: `${i * 40}ms` }}
                className="tool-startup-row animate-card"
              >
                <div className="flex items-center gap-4">
                  <StartupMark name={task.name} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-ink">{task.name}</h3>
                      <Badge kind="warn">Telemetry</Badge>
                      <Badge kind="admin">{s.badges.admin}</Badge>
                    </div>
                    <ToolDetails label={s.healthPanel.showMore}>
                      <code className="tool-command">{task.path}</code>
                    </ToolDetails>
                  </div>
                  <Toggle
                    label={task.name}
                    checked={task.enabled}
                    busy={busyPath === task.path}
                    onClick={() => toggleBareboneTask(task)}
                    s={s}
                  />
                </div>
              </div>
            ))}
        </section>
      )}
    </section>
  );
}
