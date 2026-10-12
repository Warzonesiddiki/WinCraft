import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { STRINGS, format } from "../i18n";
import type { GameEntry } from "../types";
import { GameSessionsPanel, TurboBoostPanel } from "./gaming";
import { uiLocale } from "../lib";

vi.mock("@tauri-apps/api/core", async () => (await import("../test-bridge")).coreModule());
vi.mock("@tauri-apps/api/event", async () => (await import("../test-bridge")).eventModule());
vi.mock("@tauri-apps/plugin-dialog", async () => (await import("../test-bridge")).dialogModule());

const { bridge, setDialog } = await import("../test-bridge");

const s = STRINGS.en;
const onChanged = vi.fn(async () => {});
const pushToast = vi.fn();

beforeEach(() => {
  bridge.reset();
  pushToast.mockReset();
  onChanged.mockClear();
  // Every mount below settles the switch's anti-flicker hold and the panels'
  // poll intervals, so the clock is faked for the whole file. The axe tests,
  // whose own scheduling does not resolve on a fake clock, switch back.
  vi.useFakeTimers();
  // Both panels only read while the window is in front (useForeground), and
  // jsdom reports an unfocused window even when the test is driving it, so the
  // gate is opened explicitly instead of leaving the live path untested.
  vi.spyOn(document, "hasFocus").mockReturnValue(true);
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

/**
 * `waitFor` cannot be used in this file: Testing Library only advances a fake
 * clock it recognises (Jest's), so under Vitest's fake timers its polling
 * interval never fires and every wait times out. `settle()` is the replacement
 * — it flushes microtasks and the switch's half-second anti-flicker hold, which
 * is what the panels do their work behind.
 */
async function settle() {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(0);
  });
  await act(async () => {
    await vi.advanceTimersByTimeAsync(600);
  });
}

const game = (extra: Partial<GameEntry> = {}): GameEntry => ({
  path: "C:\\Games\\Hades\\Hades.exe",
  name: "Hades",
  self_managed: false,
  ...extra,
});

const steering = (extra: Partial<Record<string, unknown>> = {}) =>
  ({
    enabled: true,
    kind: "hybrid",
    gameCpuSets: 8,
    backgroundCpuSets: 8,
    steeredProcesses: 0,
    ...extra,
  }) as never;

/** Mounts the session panel with its three mount reads answered. */
async function mountSessions(
  options: {
    enabled?: boolean;
    games?: GameEntry[];
    steering?: unknown;
    steeringError?: Error;
  } = {},
) {
  bridge.reply("game_sessions_enabled", options.enabled ?? false);
  bridge.reply("list_game_sessions", options.games ?? []);
  bridge.reply(
    "core_steering_status",
    options.steeringError ?? (options.steering === undefined ? steering() : options.steering),
  );
  const view = render(<GameSessionsPanel s={s} />);
  await settle();
  return view;
}

describe("GameSessionsPanel", () => {
  it("reads the switch, the list and the steering state on mount", async () => {
    await mountSessions({ enabled: true, games: [game()] });
    expect(bridge.callsTo("game_sessions_enabled")).toHaveLength(1);
    expect(bridge.callsTo("list_game_sessions")).toHaveLength(1);
    expect(bridge.callsTo("core_steering_status")).toHaveLength(1);
    expect(screen.getByRole("button", { name: s.gameSessions.title })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("says a failed session read out loud instead of looking switched off", async () => {
    bridge.reply("list_game_sessions", []);
    bridge.reply("game_sessions_enabled", new Error("the watcher is not running"));
    bridge.reply("core_steering_status", steering());
    render(<GameSessionsPanel s={s} />);
    await settle();
    // Shown as the error came; the panel does not dress it up as "off".
    expect(screen.getByText(/the watcher is not running/)).toBeInTheDocument();
  });

  it("hides only the steering row when the journal cannot be read", async () => {
    // Steering status reads the rollback journal; a problem there must never
    // take the session switch down with it.
    await mountSessions({ steeringError: new Error("the journal is busy") });
    expect(screen.queryByText(s.gameSessions.steeringTitle)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: s.gameSessions.title })).toBeInTheDocument();
  });

  it("counts the games, and only opens the list when there is one", async () => {
    await mountSessions({ games: [] });
    const count = screen.getByRole("button", {
      name: format(s.gameSessions.gamesCount, { count: "0" }),
    });
    expect(count).toBeDisabled();

    cleanup();
    await mountSessions({ games: [game(), game({ path: "C:\\G\\A.exe", name: "A" })] });
    fireEvent.click(
      screen.getByRole("button", { name: format(s.gameSessions.gamesCount, { count: "2" }) }),
    );
    expect(screen.getByText("Hades")).toBeInTheDocument();
    expect(screen.getByText("C:\\Games\\Hades\\Hades.exe")).toBeInTheDocument();
  });

  it("marks a game that manages its own performance", async () => {
    // Turbo Gaming still applies to these; only their own process is never
    // steered, and the row has to say so rather than looking like the others.
    await mountSessions({ games: [game({ self_managed: true })] });
    fireEvent.click(
      screen.getByRole("button", { name: format(s.gameSessions.gamesCount, { count: "1" }) }),
    );
    expect(screen.getByText(s.guard.selfManagedBadge)).toBeInTheDocument();
  });

  it("adds nothing when the folder dialog is cancelled", async () => {
    await mountSessions({});
    setDialog("open", null);
    fireEvent.click(screen.getByRole("button", { name: s.gameSessions.addGame }));
    await settle();
    expect(bridge.callsTo("add_game_session")).toHaveLength(0);
  });

  it("adds the picked executable and re-reads the list", async () => {
    await mountSessions({});
    setDialog("open", "C:\\Games\\Celeste\\Celeste.exe");
    bridge.reply("add_game_session", null);
    bridge.reply("list_game_sessions", [
      game({ path: "C:\\Games\\Celeste\\Celeste.exe", name: "Celeste" }),
    ]);
    fireEvent.click(screen.getByRole("button", { name: s.gameSessions.addGame }));
    await settle();

    expect(bridge.argsOf("add_game_session")).toEqual({ path: "C:\\Games\\Celeste\\Celeste.exe" });
    // The list is re-read rather than guessed at, so the row comes from Rust.
    expect(bridge.callsTo("list_game_sessions")).toHaveLength(2);
  });

  it("removes a game by path and re-reads the list", async () => {
    await mountSessions({ games: [game()] });
    fireEvent.click(
      screen.getByRole("button", { name: format(s.gameSessions.gamesCount, { count: "1" }) }),
    );
    bridge.reply("remove_game_session", null);
    bridge.reply("list_game_sessions", []);
    fireEvent.click(screen.getByRole("button", { name: `${s.search.clear}: Hades` }));
    await settle();

    expect(bridge.argsOf("remove_game_session")).toEqual({ path: "C:\\Games\\Hades\\Hades.exe" });
    expect(bridge.callsTo("list_game_sessions")).toHaveLength(2);
  });

  it("turns the feature on and off through the switch", async () => {
    await mountSessions({ enabled: false });
    bridge.reply("set_game_sessions_enabled", null);
    bridge.reply("set_game_sessions_enabled", null);
    const toggle = screen.getByRole("button", { name: s.gameSessions.title });
    expect(toggle).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(toggle);
    await settle();
    expect(bridge.argsOf("set_game_sessions_enabled")).toEqual({ enabled: true });
    expect(toggle).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(toggle);
    await settle();
    expect(bridge.callsTo("set_game_sessions_enabled")[1]?.args).toEqual({ enabled: false });
    expect(toggle).toHaveAttribute("aria-pressed", "false");
  });

  it("shows which game is running, and re-reads steering when it changes", async () => {
    await mountSessions({ enabled: true, games: [game()], steering: steering({ kind: "hybrid" }) });
    expect(bridge.callsTo("core_steering_status")).toHaveLength(1);

    await act(async () => {
      bridge.emit("game-session-changed", { active: true, name: "Hades" });
    });
    expect(screen.getByText(format(s.gameSessions.active, { name: "Hades" }))).toBeInTheDocument();
    // Steering is applied in the same watcher pass that sends this event.
    expect(bridge.callsTo("core_steering_status")).toHaveLength(2);

    await act(async () => {
      bridge.emit("game-session-changed", { active: false, name: null });
    });
    expect(
      screen.queryByText(format(s.gameSessions.active, { name: "Hades" })),
    ).not.toBeInTheDocument();
  });

  it("describes steering by the kind the machine actually reports", async () => {
    await mountSessions({
      steering: steering({ kind: "vCache", gameCpuSets: 16, backgroundCpuSets: 0 }),
    });
    expect(
      screen.getByText(format(s.gameSessions.steeringVcache, { count: "16" })),
    ).toBeInTheDocument();

    cleanup();
    await mountSessions({
      steering: steering({ kind: "hybrid", gameCpuSets: 4, backgroundCpuSets: 12 }),
    });
    expect(
      screen.getByText(format(s.gameSessions.steeringHybrid, { game: "4", background: "12" })),
    ).toBeInTheDocument();

    cleanup();
    await mountSessions({ steering: steering({ kind: null }) });
    expect(screen.getByText(s.gameSessions.steeringNone)).toBeInTheDocument();

    // A reading of null (the first read failed) leaves the whole row out.
    cleanup();
    await mountSessions({ steering: null });
    expect(screen.queryByText(s.gameSessions.steeringTitle)).not.toBeInTheDocument();
  });

  it("keeps the steering switch off when there is nothing to steer between", async () => {
    // A CPU with one group has no steering to offer, so the switch must not
    // look like it is merely turned off.
    await mountSessions({ steering: steering({ kind: null, enabled: false }) });
    expect(screen.getByRole("button", { name: s.gameSessions.steeringTitle })).toBeDisabled();
    expect(screen.getByText(s.gameSessions.steeringNone)).toBeInTheDocument();
  });

  it("explains that steering needs a session before it can do anything", async () => {
    await mountSessions({ enabled: true, games: [], steering: steering({ enabled: true }) });
    expect(screen.getByText(s.gameSessions.steeringNeedsSessions)).toBeInTheDocument();
  });

  it("re-reads steering while a session is running, because it keeps working", async () => {
    await mountSessions({ enabled: true, games: [game()], steering: steering({ enabled: true }) });
    await act(async () => {
      bridge.emit("game-session-changed", { active: true, name: "Hades" });
    });
    const before = bridge.callsTo("core_steering_status").length;

    bridge.reply("core_steering_status", steering({ enabled: true, steeredProcesses: 7 }));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });
    expect(bridge.callsTo("core_steering_status").length).toBeGreaterThan(before);
    // The count is what the watcher keeps growing during a session.
    expect(
      screen.getByText(format(s.gameSessions.steeringActive, { count: "7" })),
    ).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = await mountSessions({ enabled: true, games: [game()] });
    // axe schedules work of its own, which a fake clock never runs.
    vi.useRealTimers();
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});

/* ------------------------------------------------------------------ *
 * Turbo Boost
 * ------------------------------------------------------------------ */

const sample = (extra: Record<string, unknown> = {}) =>
  ({
    cpu: 42,
    cores: [40, 44],
    cpu_mhz: 3600,
    ram_total: 0,
    ram_used: 0,
    ram_cached: null,
    disk_read_bps: null,
    disk_write_bps: null,
    net_down_bps: null,
    net_up_bps: null,
    rated_mhz: 4000,
    busiest_mhz: 3900,
    peak_mhz: 4100,
    min_state_pct: 5,
    ...extra,
  }) as never;

const probe = (extra: Record<string, unknown> = {}) =>
  ({ score: 1000, duration_ms: 3000, avg_mhz: 3200, peak_mhz: 3800, ...extra }) as never;

const auditRow = (extra: Record<string, unknown> = {}) => ({
  ts: 1_760_000_000,
  action: "tweak-applied",
  target: "turbo_boost",
  success: true,
  ...extra,
});

/** Mounts the boost panel with its mount reads and one live sample answered. */
async function mountBoost(
  options: { applied?: boolean; alreadySet?: boolean | null; log?: unknown[]; live?: boolean } = {},
) {
  bridge.reply("turbo_boost_already_set", options.alreadySet ?? false);
  bridge.reply("list_audit_log", options.log ?? []);
  if (options.live !== false) {
    bridge.reply("live_sample", sample());
    bridge.reply("resource_users", { cpu: [{ name: "chrome", cpu: 30 }], memory: [] });
  }
  const view = render(
    <TurboBoostPanel
      s={s}
      applied={options.applied ?? false}
      onChanged={onChanged}
      pushToast={pushToast}
    />,
  );
  await settle();
  return view;
}

describe("TurboBoostPanel", () => {
  it("states which way the processor is set, without grading it", async () => {
    await mountBoost({ applied: false });
    expect(screen.getByText(s.turboBoost.inactive)).toBeInTheDocument();

    cleanup();
    await mountBoost({ applied: true });
    expect(screen.getByText(s.turboBoost.active)).toBeInTheDocument();
  });

  it("shows the live reading, the measured speeds and the power plan's floor", async () => {
    await mountBoost();
    // The dial's own number, labelled, so it cannot be read as the tweak's
    // output: it is live CPU load, which the tweak does not change.
    expect(screen.getByText(s.turboBoost.loadLabel)).toBeInTheDocument();
    // The figure and its unit are one element, and it is the smoothed load.
    expect(document.querySelector(".tool-boost-instrument")?.textContent).toContain("42");

    const facts = document.querySelector(".tool-boost-facts") as HTMLElement;
    expect(facts).toHaveTextContent(s.turboBoost.factAverage);
    expect(facts).toHaveTextContent("3.60 GHz · 90%"); // of the 4,000 MHz the CPU reports
    expect(facts).toHaveTextContent(s.turboBoost.factPeak);
    expect(facts).toHaveTextContent(s.turboBoost.factFloor);
    expect(facts).toHaveTextContent("5%");
  });

  it("leaves out a fact the machine did not report", async () => {
    bridge.reply("turbo_boost_already_set", false);
    bridge.reply("list_audit_log", []);
    bridge.reply("live_sample", sample({ busiest_mhz: null, min_state_pct: null, cpu_mhz: null }));
    bridge.reply("resource_users", { cpu: [], memory: [] });
    render(<TurboBoostPanel s={s} applied={false} onChanged={onChanged} pushToast={pushToast} />);
    await settle();

    // No reading means no row: a blank line would read as a zero.
    expect(screen.queryByText(s.turboBoost.factAverage)).not.toBeInTheDocument();
    expect(screen.queryByText(s.turboBoost.factFloor)).not.toBeInTheDocument();
  });

  it("keeps the dial empty rather than showing a zero when the read fails", async () => {
    bridge.reply("turbo_boost_already_set", false);
    bridge.reply("list_audit_log", []);
    bridge.reply("live_sample", new Error("the performance counters are unavailable"));
    render(<TurboBoostPanel s={s} applied={false} onChanged={onChanged} pushToast={pushToast} />);
    await settle();
    expect(screen.getByRole("status")).toBeInTheDocument();
    // "—" is not 0%: the reading is missing, and saying 0 would be a claim.
    const dial = screen.getByText("—");
    expect(dial).toBeInTheDocument();
  });

  it("says when the plan already ran the processor this way", async () => {
    await mountBoost({ applied: true, alreadySet: true });
    expect(screen.getByText(s.turboBoost.planAlreadyHad)).toBeInTheDocument();

    cleanup();
    await mountBoost({ applied: false, alreadySet: true });
    expect(screen.getByText(s.turboBoost.planAlreadyUses)).toBeInTheDocument();
  });

  it("dates the last time it was applied, from the audit log", async () => {
    // An unrelated successful entry must not be mistaken for this one.
    await mountBoost({
      applied: true,
      log: [auditRow({ target: "dns", ts: 1_700_000_000 }), auditRow({ ts: 1_760_000_000 })],
    });
    const stamp = new Date(1_760_000_000 * 1000).toLocaleString(uiLocale(), {
      dateStyle: "short",
      timeStyle: "short",
    });
    expect(document.querySelector(".tool-boost-note")?.textContent).toContain(stamp);
    // An entry for something else is not mistaken for this tweak's.
    expect(document.querySelector(".tool-boost-note")?.textContent).not.toContain("dns");
  });

  it("runs the fixed test once and files the result under the mode it ran in", async () => {
    await mountBoost({ applied: false });
    bridge.reply("boost_probe", probe());
    bridge.reply("thermal_report", { cpu_temp_c: 61 });
    fireEvent.click(screen.getByRole("button", { name: s.turboBoost.testRun }));
    await settle();

    expect(bridge.argsOf("boost_probe")).toEqual({ seconds: 3 });
    // The result lands in the column for the mode it was measured in.
    const row = screen
      .getByRole("rowheader", { name: s.turboBoost.rowAvg })
      .closest("tr") as HTMLElement;
    expect(row).toHaveTextContent("3.20 GHz");
    // Temperature was reported, so the row appears.
    expect(screen.getByRole("rowheader", { name: s.turboBoost.rowTemp })).toBeInTheDocument();
  });

  it("compares the two runs against the same fixed test", async () => {
    const { rerender } = await mountBoost({ applied: false });
    bridge.reply("boost_probe", probe({ score: 1000 }));
    bridge.reply("thermal_report", { cpu_temp_c: 61 });
    fireEvent.click(screen.getByRole("button", { name: s.turboBoost.testRun }));
    await settle();

    // The parent turns Turbo Boost on and re-renders the same panel, so the
    // measurement it took in the default mode is still there to compare with.
    rerender(<TurboBoostPanel s={s} applied onChanged={onChanged} pushToast={pushToast} />);
    bridge.reply("boost_probe", probe({ score: 1200 }));
    bridge.reply("thermal_report", { cpu_temp_c: 70 });
    fireEvent.click(screen.getByRole("button", { name: s.turboBoost.testRun }));
    await settle();

    const work = screen
      .getByRole("rowheader", { name: s.turboBoost.rowWork })
      .closest("tr") as HTMLElement;
    const cells = work.querySelectorAll("td");
    // The default run is the baseline it is measured against.
    expect(cells[0]).toHaveTextContent("100%");
    expect(cells[1]).toHaveTextContent(format(s.turboBoost.relative, { pct: "120" }));
  });

  it("measures before and after when switching it on", async () => {
    await mountBoost({ applied: false });
    bridge.reply("boost_probe", probe({ score: 1000, avg_mhz: 3000 }));
    bridge.reply("thermal_report", { cpu_temp_c: 60 });
    bridge.reply("boost_probe", probe({ score: 1200, avg_mhz: 3600 }));
    bridge.reply("thermal_report", { cpu_temp_c: 72 });
    bridge.reply("apply_tweak", null);
    fireEvent.click(screen.getByRole("button", { name: s.turboBoost.startLabel }));
    await settle();

    expect(pushToast).toHaveBeenCalledWith(
      "success",
      format(s.toasts.applied, { name: s.turboBoost.title }),
    );
    // Two probes, two seconds each, one before the write and one after.
    expect(bridge.callsTo("boost_probe").map((call) => call.args?.seconds)).toEqual([2, 2]);
    expect(bridge.callsTo("apply_tweak")[0]?.args).toEqual({ id: "turbo_boost" });
    // The parent re-reads so the surrounding screen knows the new state.
    expect(onChanged).toHaveBeenCalled();
  });

  it("rolls back without measuring, because there is nothing to compare", async () => {
    await mountBoost({ applied: true });
    bridge.reply("rollback_tweak", null);
    fireEvent.click(screen.getByRole("button", { name: s.turboBoost.stopLabel }));
    await settle();

    expect(pushToast).toHaveBeenCalledWith(
      "success",
      format(s.toasts.rolledBack, { name: s.turboBoost.title }),
    );
    expect(bridge.callsTo("boost_probe")).toHaveLength(0);
    expect(bridge.callsTo("rollback_tweak")[0]?.args).toEqual({ id: "turbo_boost" });
  });

  it("reports a refusal in the guard's own words", async () => {
    await mountBoost({ applied: false });
    bridge.reply("boost_probe", probe());
    bridge.reply("thermal_report", { cpu_temp_c: 60 });
    // The guard sends its reasons as prefixed strings, which is what the
    // friendly-error mapping reads — so this has to be a raw rejection, not an
    // Error, or the mapping would (correctly) miss it.
    bridge.fail("apply_tweak", "SELF_MANAGED_GAME_RUNNING: Hades");
    fireEvent.click(screen.getByRole("button", { name: s.turboBoost.startLabel }));
    await settle();

    expect(pushToast).toHaveBeenCalledWith("error", s.guard.gameRunning);
    // Nothing changed, so the parent is not told otherwise.
    expect(onChanged).not.toHaveBeenCalled();
  });

  it("survives a probe that cannot run at all", async () => {
    await mountBoost({ applied: false });
    bridge.reply("boost_probe", new Error("the timer resolution is unavailable"));
    bridge.reply("apply_tweak", null);
    fireEvent.click(screen.getByRole("button", { name: s.turboBoost.startLabel }));
    await settle();

    // The tweak still applies; the comparison is simply absent rather than
    // showing numbers that were never measured.
    expect(bridge.callsTo("apply_tweak")).toHaveLength(1);
    expect(screen.getAllByText(s.turboBoost.notRun).length).toBeGreaterThan(0);
  });

  it("has no axe violations", async () => {
    const { container } = await mountBoost({ applied: true });
    vi.useRealTimers();
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
