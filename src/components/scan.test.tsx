import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { axe } from "jest-axe";
import { format } from "../i18n";
import { STRINGS } from "../i18n-tables";
import { LAST_SCAN_KEY, SCAN_PROBES } from "../scan-runner";
import { SCAN_COPY } from "./scan-copy";
import type { TweakAdvice, TweakInfo } from "../types";
import { ScanPanel } from "./scan";

vi.mock("@tauri-apps/api/core", async () => (await import("../test-bridge")).coreModule());
vi.mock("@tauri-apps/api/event", async () => (await import("../test-bridge")).eventModule());

const { bridge } = await import("../test-bridge");

const c = SCAN_COPY.en;
const s = STRINGS.en;
const pushToast = vi.fn();
const onFixed = vi.fn(async () => {});

beforeEach(() => {
  bridge.reset();
  pushToast.mockReset();
  onFixed.mockClear();
  localStorage.clear();
});
afterEach(cleanup);

const tweak = (id: string, extra: Partial<TweakInfo> = {}): TweakInfo =>
  ({
    id,
    name: id,
    description: "",
    category: "performance",
    hive: "HKCU",
    changes: [],
    requires_admin: false,
    requires_pro: false,
    applied: false,
    ...extra,
  }) as TweakInfo;

/** The three reads that carry the catalogue, plus an answer for the ten others.
 *  `failed` names a read that throws instead, which the panel must report
 *  rather than count as a clean scan. */
function queueScan(options: { failed?: string[] } = {}) {
  const failed = new Set(options.failed ?? []);
  const tweaks = [tweak("disable_game_dvr"), tweak("reduce_input_lag", { requires_admin: true })];
  const advice: TweakAdvice[] = tweaks.map((t) => ({
    id: t.id,
    verdict: "recommended",
    reason_key: null,
  }));
  for (const [command, value] of [
    ["list_tweaks", tweaks],
    ["scan_relevant_ids", tweaks.map((t) => t.id)],
    ["advise_tweaks", advice],
  ] as [string, unknown][])
    bridge.reply(command, value);
  for (const probe of [
    "system_profile",
    "list_drives_cmd",
    "list_startup_items",
    "system_stats",
    "reboot_pending",
    "health_report",
    "driver_audit",
    "list_scheduled_tasks",
    "list_debloat_apps",
    "ecoqos_status",
  ])
    bridge.reply(probe, failed.has(probe) ? new Error("read failed") : null);
  return tweaks;
}

function renderPanel() {
  return render(
    <ScanPanel s={s} lang="en" onFixed={onFixed} pushToast={pushToast} onNavigate={vi.fn()} />,
  );
}

/** The report is on screen once Fix all offers the recommended tweaks. The
 *  progress animation eases towards 100% on a 32 ms interval and the report is
 *  shown only when it arrives, so this waits on real time — about a second. */
async function awaitReport(count: number) {
  await waitFor(
    () =>
      expect(
        screen.getByRole("button", { name: `${s.scan.fixAll} (${count})` }),
      ).toBeInTheDocument(),
    { timeout: 8000 },
  );
}

async function runScan(count = 2) {
  fireEvent.click(screen.getByRole("button", { name: c.start }));
  await awaitReport(count);
}

describe("ScanPanel", () => {
  it("offers the scan as the first action and says how much it will read", () => {
    renderPanel();
    expect(screen.getByRole("button", { name: c.start })).toBeEnabled();
    expect(screen.getByText(c.intro)).toBeInTheDocument();
    expect(
      screen.getByText(format(c.scopeCount, { count: SCAN_PROBES.length })),
    ).toBeInTheDocument();
  });

  it("runs every read once and offers what it found", async () => {
    queueScan();
    renderPanel();
    await runScan();

    for (const probe of SCAN_PROBES) expect(bridge.callsTo(probe)).toHaveLength(1);

    // Once as the section heading, once as the count label beside it.
    expect(screen.getAllByText(c.recommendations)).toHaveLength(2);
    expect(screen.getByRole("heading", { name: c.recommendations })).toBeInTheDocument();
    // Nothing failed, so the report says so rather than "partial".
    expect(screen.getByText(c.complete)).toBeInTheDocument();
    expect(screen.queryByText(c.partial)).toBeNull();
  });

  it("reports a read that failed instead of calling the scan clean", async () => {
    queueScan({ failed: ["health_report"] });
    renderPanel();
    await runScan();

    // The heading says "partial" rather than "Scan complete", and the failed
    // read is listed as one that could not be read.
    expect(screen.queryByText(c.complete)).toBeNull();
    expect(screen.getAllByText(c.partial).length).toBeGreaterThan(0);
    expect(screen.getByText(c.unavailable)).toBeInTheDocument();
    // The rest of the report is still offered.
    expect(screen.getByRole("button", { name: `${s.scan.fixAll} (2)` })).toBeEnabled();
  });

  it("keeps a failed read in the last-scan note for the next visit", async () => {
    queueScan({ failed: ["health_report"] });
    renderPanel();
    await runScan();

    const stored = localStorage.getItem(LAST_SCAN_KEY);
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored as string)).toMatchObject({ partial: true });
  });

  it("applies only what the review dialog lists, then reports it as verified", async () => {
    const before = queueScan();
    // Applying re-reads the catalogue first (still unapplied, still eligible)
    // and reads it again afterwards to verify: only then is it applied.
    bridge.reply("list_tweaks", before, [tweak("disable_game_dvr", { applied: true })]);
    bridge.reply("scan_relevant_ids", ["disable_game_dvr", "reduce_input_lag"]);
    bridge.reply("advise_tweaks", [
      { id: "disable_game_dvr", verdict: "recommended", reason_key: null },
      { id: "reduce_input_lag", verdict: "recommended", reason_key: null },
    ]);
    bridge.reply("apply_tweaks", []);
    renderPanel();
    await runScan();

    // Unselect one: a Fix-all run the user trimmed is not the default list.
    // The row's checkbox is labelled with the translated name, not the id.
    fireEvent.click(screen.getByRole("checkbox", { name: s.tweaks.reduce_input_lag.name }));
    fireEvent.click(screen.getByRole("button", { name: `${c.apply} (1)` }));

    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText(c.confirm)).toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole("button", { name: `${c.apply} (1)` }));

    await waitFor(() =>
      expect(bridge.callsTo("apply_tweaks")[0]?.args).toEqual({
        ids: ["disable_game_dvr"],
        source: "scan",
      }),
    );
    await waitFor(() =>
      expect(pushToast).toHaveBeenCalledWith("success", format(s.scan.fixedToast, { count: 1 })),
    );
    // The verified fix is no longer offered as a recommendation.
    await waitFor(() => expect(screen.queryByRole("button", { name: /Fix all/ })).toBeNull());
    expect(screen.getByText(c.empty)).toBeInTheDocument();
    expect(onFixed).toHaveBeenCalled();
  });

  it("cancelling the review dialog changes nothing", async () => {
    queueScan();
    renderPanel();
    await runScan();

    fireEvent.click(screen.getByRole("button", { name: `${s.scan.fixAll} (2)` }));
    fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: c.cancel }));

    expect(bridge.callsTo("apply_tweaks")).toHaveLength(0);
  });

  it("pauses on request, offering Resume and End scan instead of Stop", async () => {
    queueScan();
    renderPanel();
    // Held so the scan is still reading when Pause is pressed: with every read
    // answered in a microtask there would be nothing left to pause.
    bridge.hold("driver_audit");
    fireEvent.click(screen.getByRole("button", { name: c.start }));

    fireEvent.click(await screen.findByRole("button", { name: c.pause }));
    bridge.release("driver_audit");

    await waitFor(() => expect(screen.getByRole("button", { name: c.resume })).toBeInTheDocument());
    expect(screen.getByRole("button", { name: c.finish })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: c.stop })).toBeNull();
    expect(bridge.callsTo("cancel_scan").length).toBeGreaterThan(0);

    // A paused scan outlives the page, so end it here: leaving it held would
    // hand the next test a panel that opens on someone else's paused scan.
    fireEvent.click(screen.getByRole("button", { name: c.finish }));
    // The partial report it had is shown, and the hero offers a fresh scan.
    await waitFor(() =>
      expect(screen.getByRole("button", { name: s.scan.scanAgain })).toBeInTheDocument(),
    );
  });

  it("a paused scan resumes by reading only what is still missing", async () => {
    queueScan();
    renderPanel();
    // Hold the last read, so the pause lands with twelve finished reads and a
    // driver inventory that was cut off mid-flight.
    bridge.hold("driver_audit");
    fireEvent.click(screen.getByRole("button", { name: c.start }));
    await waitFor(() => expect(bridge.callsTo("list_tweaks")).toHaveLength(1));

    fireEvent.click(await screen.findByRole("button", { name: c.pause }));
    // The paused path waits for the backend audit to save where it was.
    bridge.release("driver_audit");
    await screen.findByRole("button", { name: c.resume });

    bridge.hold("driver_audit");
    fireEvent.click(screen.getByRole("button", { name: c.resume }));
    await waitFor(() => expect(bridge.callsTo("driver_audit")).toHaveLength(2));
    bridge.release("driver_audit");
    await awaitReport(2);

    // The twelve finished reads are kept; the interrupted one is taken again.
    expect(bridge.callsTo("list_tweaks")).toHaveLength(1);
    expect(bridge.callsTo("system_profile")).toHaveLength(1);
    expect(bridge.callsTo("driver_audit")).toHaveLength(2);
  });

  it("has no detectable accessibility violations on the landing state", async () => {
    const { container } = renderPanel();
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
