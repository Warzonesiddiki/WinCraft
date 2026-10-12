import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { axe } from "jest-axe";
import { format } from "../i18n";
import { STRINGS } from "../i18n-tables";
import { formatNumber } from "../lib";
import type { AuditEntry, TweakInfo } from "../types";
import {
  BeforeAfterPanel,
  formatDelta,
  formatValue,
  impactValue,
  type BeforeAfter,
  type MetricChange,
} from "./before-after";
import { BEFORE_AFTER_COPY } from "./before-after-copy";

vi.mock("@tauri-apps/api/core", async () => (await import("../test-bridge")).coreModule());
vi.mock("@tauri-apps/api/event", async () => (await import("../test-bridge")).eventModule());
vi.mock("@tauri-apps/plugin-dialog", async () => (await import("../test-bridge")).dialogModule());

const { bridge, setDialog } = await import("../test-bridge");

const c = BEFORE_AFTER_COPY.en;
const s = STRINGS.en;
const pushToast = vi.fn();

/** The two runs the fixtures are measured against, seconds apart. */
const BEFORE_TS = 1_700_000_000;
const AFTER_TS = 1_700_000_600;

beforeEach(() => {
  // `formatNumber` and the dates read the document language.
  document.documentElement.lang = "en";
  bridge.reset();
  pushToast.mockReset();
});
afterEach(() => {
  cleanup();
  document.documentElement.lang = "";
});

const change = (extra: Partial<MetricChange> = {}): MetricChange => ({
  id: "launch_ms",
  before: 420,
  after: 310,
  beforeSamples: 11,
  afterSamples: 11,
  beforeSpreadPct: 4,
  afterSpreadPct: 6,
  changePct: -26.2,
  pValue: 0.002,
  verdict: "better",
  confirmed: 1,
  afterRuns: 1,
  ...extra,
});

/** A comparison with one improvement, which is the panel's happy path. */
const measured = (extra: Partial<BeforeAfter> = {}): BeforeAfter => ({
  before: { ts: BEFORE_TS, role: "before" },
  after: { ts: AFTER_TS, role: "after" },
  afterRuns: 1,
  changes: [change()],
  restartedBetween: false,
  ...extra,
});

const nothingMeasured = (): BeforeAfter => ({
  before: null,
  after: null,
  afterRuns: 0,
  changes: [],
  restartedBetween: false,
});

const beforeOnly = (): BeforeAfter => ({
  before: { ts: BEFORE_TS, role: "before" },
  after: null,
  afterRuns: 0,
  changes: [],
  restartedBetween: false,
});

type BootRecord = { ts: number; bootMs: number };
/** Two restarts before the baseline and one after, by Windows' own log. */
const bootRecords = (): BootRecord[] => [
  { ts: BEFORE_TS - 1000, bootMs: 20_000 },
  { ts: BEFORE_TS - 60, bootMs: 20_000 },
  { ts: AFTER_TS + 1000, bootMs: 20_000 },
];
const bootChange = (extra: Partial<MetricChange> = {}): MetricChange =>
  change({ id: "boot_ms", before: 62_000, after: 41_000, changePct: -33.9, ...extra });
const emptyBoot = () => ({ records: [] as BootRecord[], change: null as MetricChange | null });

const tweak = (id: string, name: string): TweakInfo => ({
  id,
  name,
  description: "",
  category: "performance",
  hive: "HKLM",
  requires_admin: false,
  requires_pro: false,
  applied: false,
  changes: [],
});

const tweaks: TweakInfo[] = [
  tweak("disable_click_to_do", "Disable Click to Do"),
  tweak("quiet_hours", "Quiet hours"),
];

const audit = (extra: Partial<AuditEntry> = {}): AuditEntry => ({
  ts: BEFORE_TS + 10,
  action: "tweak-applied",
  target: "disable_click_to_do",
  elevated: false,
  success: true,
  ...extra,
});

/**
 * Mounts the panel with exactly the replies its own mount reads consume, so a
 * test can queue the next reply for a click without counting mount calls.
 *
 * The panel reads the history whenever the comparison changes, and re-reads the
 * startup log when that comparison's date becomes known — after the mount's
 * first read of it. A comparison that never arrives and one with no before
 * measurement therefore read the log once, not twice.
 */
async function mount(
  data: BeforeAfter | Error = measured(),
  boot: { records: BootRecord[]; change: MetricChange | null } = emptyBoot(),
  log: AuditEntry[] = [],
) {
  const bootReads = data instanceof Error || !data.before ? 1 : 2;
  const auditReads = data instanceof Error ? 1 : 2;
  bridge.reply("before_after", data);
  bridge.reply("boot_times", ...Array<typeof boot>(bootReads).fill(boot));
  bridge.reply("list_audit_log", ...Array<AuditEntry[]>(auditReads).fill(log));
  const view = render(<BeforeAfterPanel s={s} lang="en" tweaks={tweaks} pushToast={pushToast} />);
  // Flushes the mount reads and the re-render they cause.
  await act(async () => {
    await Promise.resolve();
  });
  return view;
}

function el(selector: string): HTMLElement {
  const found = document.querySelector<HTMLElement>(selector);
  if (!found) throw new Error(`no element matching ${selector}`);
  return found;
}

const cards = (): HTMLElement[] => Array.from(document.querySelectorAll<HTMLElement>(".ba-metric"));
const heading = (card: HTMLElement) => card.querySelector(".ba-metric-head h4")?.textContent;
function card(name: string): HTMLElement {
  const found = cards().find((el) => heading(el) === name);
  if (!found)
    throw new Error(`no metric card titled "${name}" — shown: ${cards().map(heading).join(", ")}`);
  return found;
}

describe("BeforeAfterPanel", () => {
  it("explains what it does, and offers the first measurement", async () => {
    await mount(nothingMeasured());

    expect(screen.getByRole("heading", { name: c.title })).toBeInTheDocument();
    expect(screen.getByText(c.subtitle)).toBeInTheDocument();
    expect(screen.getByText(c.emptyIntro)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: c.runBefore })).toBeInTheDocument();
    // The first step is the one the reader is on.
    const steps = within(el(".ba-steps")).getAllByRole("listitem");
    expect(steps.map((step) => step.textContent)).toEqual([
      `1${c.stepBefore}`,
      `2${c.stepChange}`,
      `3${c.stepAfter}`,
    ]);
    expect(steps[0]).toHaveAttribute("aria-current", "step");
    expect(bridge.callsTo("run_baseline")).toHaveLength(0);
  });

  it("runs the before measurement on request and says when it was taken", async () => {
    await mount(nothingMeasured());
    bridge.reply("run_baseline", beforeOnly());

    fireEvent.click(screen.getByRole("button", { name: c.runBefore }));

    expect(
      await screen.findByText(new RegExp(format(c.beforeTaken, { time: ".+" }))),
    ).toBeInTheDocument();
    expect(bridge.argsOf("run_baseline")).toEqual({ role: "before" });
    // The reader is told what to do next, and can start over.
    expect(screen.getByText(c.nextHint)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: c.runAfter })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: c.startOver })).toBeInTheDocument();
    expect(within(el(".ba-steps")).getAllByRole("listitem")[1]).toHaveAttribute(
      "aria-current",
      "step",
    );
  });

  it("says a measurement is under way while it runs", async () => {
    await mount(nothingMeasured());
    bridge.hold("run_baseline");
    bridge.reply("run_baseline", measured());

    fireEvent.click(screen.getByRole("button", { name: c.runBefore }));

    // The panel is busy, and says so in words rather than only in a spinner.
    expect(await screen.findByText(c.running)).toBeInTheDocument();
    expect(el(".ba-panel")).toHaveAttribute("aria-busy", "true");
    bridge.release("run_baseline");
    await waitFor(() => expect(el(".ba-panel")).toHaveAttribute("aria-busy", "false"));
  });

  it("reports a failed measurement in the panel instead of throwing", async () => {
    await mount(nothingMeasured());
    bridge.fail("run_baseline", "the disk test timed out");

    fireEvent.click(screen.getByRole("button", { name: c.runBefore }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(format(c.failed, { error: "the disk test timed out" }));
  });

  it("shows every measured change with the numbers the backend returned", async () => {
    await mount(
      measured({
        changes: [
          change(),
          change({
            id: "disk_read_us",
            before: 850,
            after: 1_400,
            changePct: 64.7,
            verdict: "worse",
            beforeSpreadPct: 3,
            afterSpreadPct: 5,
          }),
        ],
      }),
    );

    const launch = card(c.metrics.launch_ms.name);
    expect(within(launch).getByText(c.colBefore)).toBeInTheDocument();
    expect(within(launch).getByText(c.colAfter)).toBeInTheDocument();
    expect(within(launch).getByText("420 ms")).toBeInTheDocument();
    expect(within(launch).getByText("310 ms")).toBeInTheDocument();
    expect(within(launch).getByText(c.better)).toBeInTheDocument();
    expect(within(launch).getByText(formatDelta(change()))).toBeInTheDocument();
    // The spread is the wider of the two runs, quoted with its own precision.
    expect(
      within(launch).getByText(
        `${format(c.spread, { pct: formatNumber(6, 1) })} · ${format(c.medianOf, { count: 11 })}`,
      ),
    ).toBeInTheDocument();

    // A slower read keeps its own unit, and is called out without being a loss.
    const read = card(c.metrics.disk_read_us.name);
    expect(within(read).getByText("850 µs")).toBeInTheDocument();
    expect(within(read).getByText("1.40 ms")).toBeInTheDocument();
    expect(within(read).getByText(c.slower)).toBeInTheDocument();
    expect(within(read).getByText(c.worseHint)).toBeInTheDocument();
    expect(read).toHaveAttribute("data-verdict", "worse");
  });

  it("orders the rows by what people feel first, not by what the backend sent", async () => {
    await mount(
      measured({
        changes: [
          change({
            id: "disk_free_mb",
            before: 20_480,
            after: 20_480,
            changePct: 0,
            verdict: "same",
          }),
          change({ id: "startup_apps", before: 12, after: 9, changePct: -25, verdict: "better" }),
          change(),
        ],
      }),
    );

    expect(cards().map((card) => heading(card))).toEqual([
      c.metrics.launch_ms.name,
      c.metrics.startup_apps.name,
      c.metrics.disk_free_mb.name,
    ]);
  });

  it("calls a difference inside the run-to-run variation no change", async () => {
    await mount(
      measured({
        changes: [change({ before: 420, after: 412, changePct: -1.9, verdict: "same" })],
      }),
    );

    const hero = el(".ba-hero");
    expect(hero).toHaveAttribute("data-tone", "calm");
    expect(within(hero).getByRole("heading", { name: c.impactNoneTitle })).toBeInTheDocument();
    expect(within(hero).getByText(c.impactNoneNote)).toBeInTheDocument();
    expect(within(hero).queryByRole("list")).not.toBeInTheDocument();
    // The row is shown, but with nothing claiming a gain.
    expect(within(card(c.metrics.launch_ms.name)).getByText(c.same)).toBeInTheDocument();
    expect(document.querySelector(".ba-delta")).toBeNull();
  });

  it("states a lower result plainly and says how to check it", async () => {
    await mount(
      measured({
        changes: [
          change({
            id: "memory_used_mb",
            before: 8_192,
            after: 9_300,
            changePct: 13.5,
            verdict: "worse",
          }),
        ],
      }),
    );

    // Not a timed test, so "higher this time" is the honest wording, and the
    // metric's own help text is the way to check it.
    const row = card(c.metrics.memory_used_mb.name);
    expect(within(row).getByText(c.higher)).toBeInTheDocument();
    expect(within(row).getByText(c.metrics.memory_used_mb.help)).toBeInTheDocument();
    expect(el(".ba-hero")).toHaveAttribute("data-tone", "calm");
    expect(
      within(el(".ba-hero")).getByRole("heading", { name: c.impactWorseTitle }),
    ).toBeInTheDocument();
  });

  it("shows one reading as one reading rather than inventing a spread", async () => {
    await mount(
      measured({
        changes: [
          change({
            id: "processes",
            before: 142,
            after: 139,
            beforeSpreadPct: null,
            afterSpreadPct: null,
          }),
        ],
      }),
    );

    const row = card(c.metrics.processes.name);
    expect(within(row).getByText(c.reading)).toBeInTheDocument();
    expect(within(row).getByText("−3")).toBeInTheDocument();
  });

  it("counts an improvement that was confirmed by later runs", async () => {
    await mount(measured({ changes: [change({ confirmed: 2, afterRuns: 2 })] }));

    expect(
      within(card(c.metrics.launch_ms.name)).getByText(format(c.confirmed, { count: 2, total: 2 })),
    ).toBeInTheDocument();
  });

  it("warns when the runs varied too much to compare", async () => {
    await mount(measured({ changes: [change({ beforeSpreadPct: 24, afterSpreadPct: 31 })] }));

    expect(within(el(".ba-hero")).getByText(c.noisy)).toBeInTheDocument();
  });

  it("notes a restart between the two measurements", async () => {
    await mount(measured({ restartedBetween: true }));

    expect(within(el(".ba-hero")).getByText(c.restartNote)).toBeInTheDocument();
  });

  it("lists what WinCraft changed between the two measurements", async () => {
    await mount(measured(), emptyBoot(), [
      audit(),
      audit({ ts: BEFORE_TS + 12, action: "tweak-reverted" }),
      audit({ ts: BEFORE_TS + 20, action: "cleanup", target: "" }),
      // The same cleanup recorded twice is one line.
      audit({ ts: BEFORE_TS + 22, action: "cleanup", target: "" }),
      audit({ ts: BEFORE_TS + 30, action: "restore-point", target: "" }),
      // Not a tweak the translations know: the catalogue name is used.
      audit({ ts: BEFORE_TS + 40, target: "quiet_hours" }),
      // Dropped: no label for the action, a failed entry, and one that falls
      // outside the two measurements.
      audit({ ts: BEFORE_TS + 50, action: "priority-rule", target: "game" }),
      audit({ ts: BEFORE_TS + 60, action: "cleanup", target: "", success: false }),
      audit({ ts: AFTER_TS + 100, action: "cleanup", target: "" }),
    ]);

    const list = within(el(".ba-between"));
    expect(list.getByRole("heading", { name: c.changesBetween })).toBeInTheDocument();
    expect(list.getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      s.tweaks.disable_click_to_do.name,
      `${s.tweaks.disable_click_to_do.name} (${c.undone})`,
      s.ledger.actions.cleanup,
      s.ledger.actions.restorePoint,
      "Quiet hours",
    ]);
  });

  it("says when WinCraft changed nothing between the measurements", async () => {
    await mount(measured(), emptyBoot(), [audit({ ts: AFTER_TS + 100 })]);

    expect(within(el(".ba-between")).getByText(c.changesNone)).toBeInTheDocument();
    expect(within(el(".ba-between")).queryByRole("list")).not.toBeInTheDocument();
  });

  it("shows the first six changes and counts the rest", async () => {
    await mount(
      measured(),
      emptyBoot(),
      [
        ["cleanup", ""],
        ["files-deleted", ""],
        ["disk-optimize", ""],
        ["startup-change", ""],
        ["restore-point", ""],
        ["tweak-applied", "disable_click_to_do"],
        ["tweak-applied", "disable_edge_ai"],
        ["tweak-applied", "disable_paint_ai"],
      ].map(([action, target], i) => audit({ ts: BEFORE_TS + 10 + i, action, target })),
    );

    // Six named changes, then one line counting what did not fit.
    const items = within(el(".ba-between")).getAllByRole("listitem");
    expect(items).toHaveLength(7);
    expect(items[6]).toHaveTextContent(format(c.changesMore, { count: 2 }));
  });

  it("reads only the startup times Windows already stored until asked", async () => {
    await mount();

    const reads = bridge.callsTo("boot_times");
    // One read before the comparison arrives, one once its date is known.
    expect(reads[0].args).toEqual({ refresh: false, beforeTs: null });
    expect(reads[1].args).toEqual({ refresh: false, beforeTs: BEFORE_TS });
    expect(reads.every((read) => read.args?.refresh === false)).toBe(true);
  });

  it("reads the startup log when asked, and shows what it found", async () => {
    await mount(measured(), { records: bootRecords(), change: bootChange() });

    const read = screen.getByRole("button", { name: c.bootRead });
    bridge.hold("boot_times");
    bridge.reply("boot_times", { records: bootRecords(), change: bootChange() });
    fireEvent.click(read);

    // The button reports the request in flight rather than doing nothing.
    expect(await screen.findByRole("button", { name: c.bootReading })).toBeDisabled();
    bridge.release("boot_times");

    expect(
      await screen.findByText(format(c.bootCounts, { before: 2, after: 1 })),
    ).toBeInTheDocument();
    const reads = bridge.callsTo("boot_times");
    expect(reads[reads.length - 1].args).toEqual({ refresh: true, beforeTs: BEFORE_TS });
    // A faster startup is an improvement like any other, and leads the summary.
    expect(within(el(".ba-hero")).getAllByRole("listitem")[0]).toHaveTextContent(
      impactValue(bootChange()),
    );
    expect(document.querySelector(".ba-boot .ba-metric")).not.toBeNull();
  });

  it("says when Windows has recorded no startup times", async () => {
    await mount(measured(), emptyBoot());

    bridge.reply("boot_times", emptyBoot());
    fireEvent.click(screen.getByRole("button", { name: c.bootRead }));

    expect(await screen.findByText(c.bootNone)).toBeInTheDocument();
  });

  it("explains when there are too few restarts to compare", async () => {
    await mount(measured(), { records: bootRecords(), change: null });

    expect(await screen.findByText(c.bootNeedMore)).toBeInTheDocument();
    expect(document.querySelector(".ba-boot .ba-metric")).toBeNull();
  });

  it("reports a failed startup-log read without losing the comparison", async () => {
    await mount(measured(), { records: bootRecords(), change: bootChange() });

    bridge.fail("boot_times", "reading the log needs administrator permission");
    fireEvent.click(screen.getByRole("button", { name: c.bootRead }));

    // The stored records stay on screen; only the fresh read failed.

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(
      format(c.failed, { error: "reading the log needs administrator permission" }),
    );
    // The measurements themselves are untouched by a log read that failed.
    expect(card(c.metrics.launch_ms.name)).toBeInTheDocument();
  });

  it("offers no export until there is something to export", async () => {
    await mount(beforeOnly());

    expect(screen.queryByRole("button", { name: c.save })).not.toBeInTheDocument();
  });

  it("saves the report through the file dialog", async () => {
    await mount();
    setDialog("save", "/home/user/wincraft-before-after.png");
    bridge.reply("save_report_png", null);

    fireEvent.click(screen.getByRole("button", { name: c.save }));

    await waitFor(() =>
      expect(bridge.argsOf("save_report_png")).toEqual({
        path: "/home/user/wincraft-before-after.png",
        // jsdom has no canvas, so the drawing itself is not exercised here.
        dataBase64: "",
      }),
    );
    expect(pushToast).toHaveBeenCalledWith("success", c.saved);
  });

  it("writes nothing when the save dialog is cancelled", async () => {
    await mount();
    setDialog("save", null);

    fireEvent.click(screen.getByRole("button", { name: c.save }));

    await waitFor(() => expect(pushToast).not.toHaveBeenCalled());
    expect(bridge.callsTo("save_report_png")).toHaveLength(0);
  });

  it("reports a failed save through the toast", async () => {
    await mount();
    setDialog("save", "/home/user/locked.png");
    bridge.reply("save_report_png", new Error("the file is locked"));

    fireEvent.click(screen.getByRole("button", { name: c.save }));

    await waitFor(() =>
      expect(pushToast).toHaveBeenCalledWith("error", "Error: the file is locked"),
    );
  });

  it("has no automatic accessibility violations before it has been run", async () => {
    const { container } = await mount(nothingMeasured());

    expect((await axe(container)).violations).toEqual([]);
  });

  it("has no automatic accessibility violations once it has a comparison", async () => {
    const { container } = await mount(
      measured({
        changes: [
          change(),
          change({ id: "processes", before: 142, after: 145, changePct: 2.1, verdict: "worse" }),
        ],
        restartedBetween: true,
      }),
    );

    expect((await axe(container)).violations).toEqual([]);
  });
});

describe("value and delta formatting", () => {
  it("gives the processor rate as a share of the run it is compared with", () => {
    expect(formatValue("cpu", 100, 100)).toBe("100%");
    expect(formatValue("cpu", 112, 100)).toBe("112%");
    // No baseline to compare with: the run reads as 100% rather than as a
    // division by zero.
    expect(formatValue("cpu", 90, 0)).toBe("100%");
  });

  it("switches units at the point where the reader would", () => {
    expect(formatValue("disk_read_us", 850, 850)).toBe("850 µs");
    expect(formatValue("disk_read_us", 1_400, 850)).toBe("1.40 ms");
    expect(formatValue("boot_ms", 41_000, 41_000)).toBe("41.0 s");
    expect(formatValue("memory_used_mb", 3_072, 3_072)).toBe("3.0 GB");
    expect(formatValue("memory_used_mb", 512, 512)).toBe("512 MB");
    expect(formatValue("disk_free_mb", 20_480, 20_480)).toBe("20.0 GB");
    expect(formatValue("processes", 142, 142)).toBe("142");
  });

  it("signs a difference the way it would be read aloud", () => {
    expect(formatDelta(change({ id: "processes", before: 142, after: 139 }))).toBe("−3");
    expect(formatDelta(change({ id: "processes", before: 139, after: 142 }))).toBe("+3");
    expect(formatDelta(change({ id: "startup_apps", before: 12, after: 9 }))).toBe("−3");
    expect(formatDelta(change({ id: "memory_used_mb", before: 8_192, after: 8_704 }))).toBe(
      "+512 MB",
    );
    expect(formatDelta(change({ id: "disk_free_mb", before: 20_480, after: 18_432 }))).toBe(
      "−2.0 GB",
    );
    expect(formatDelta(change({ id: "boot_ms", before: 62_000, after: 41_000 }))).toBe("−21.0 s");
    expect(formatDelta(change())).toBe("−26%");
  });

  it("quotes an improvement without its sign, because the label carries the direction", () => {
    expect(impactValue(change())).toBe("26%");
    expect(impactValue(change({ id: "boot_ms", before: 62_000, after: 41_000 }))).toBe("21.0 s");
  });
});
