// "Right now" makes two promises that are easy to break by accident: nothing is
// measured in the background, and every number on screen was read from this PC
// rather than guessed. The tests below hold it to both — the timer stops when
// the window loses focus, the slow sources are read on their own schedules, a
// sensor that is not there is said to be absent, and a gap in the readings
// restarts the chart instead of drawing a line across it.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { axe } from "jest-axe";
import { format } from "../i18n";
import { STRINGS } from "../i18n-tables";
import { formatGB, formatRate, type LiveSample } from "../live-metrics";
import type { Section, SystemStats, ThermalReport } from "../types";
import { LiveDashboard, UsersList } from "./live-dashboard";
import type { ResourceUsers } from "./live-dashboard";

vi.mock("@tauri-apps/api/core", async () => (await import("../test-bridge")).coreModule());
vi.mock("@tauri-apps/api/event", async () => (await import("../test-bridge")).eventModule());
vi.mock("@tauri-apps/plugin-dialog", async () => (await import("../test-bridge")).dialogModule());

const { bridge } = await import("../test-bridge");

const s = STRINGS.en;
const l = s.live;
const onNavigate = vi.fn();

/** jsdom has no `matchMedia` at all — which is why the dashboard asks for it
 *  with `?.` — so the preference is installed rather than spied on. */
function setReducedMotion(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn(() => ({
      matches,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
}

beforeEach(() => {
  bridge.reset();
  onNavigate.mockReset();
  // The dashboard reads only while the window is in front, and jsdom reports an
  // unfocused window even when the test is driving it, so the gate is opened
  // explicitly. The suite keeps the spy around to close it on purpose: that is
  // the pause the first test is about.
  vi.spyOn(document, "hasFocus").mockReturnValue(true);
  // Reduced motion makes every number paint immediately instead of easing frame
  // by frame, which is what makes the readings assertable as text.
  setReducedMotion(true);
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const sample = (extra: Partial<LiveSample> = {}): LiveSample => ({
  cpu: 42,
  cores: [40, 44],
  cpu_mhz: 3600,
  ram_total: 16 * 1024 ** 3,
  ram_used: 8 * 1024 ** 3,
  ram_cached: 2 * 1024 ** 3,
  disk_read_bps: 2_000_000,
  disk_write_bps: 500_000,
  net_down_bps: 200_000,
  net_up_bps: 40_000,
  rated_mhz: 3600,
  busiest_mhz: 3600,
  peak_mhz: 4200,
  min_state_pct: 5,
  ...extra,
});

const users = (extra: Partial<ResourceUsers> = {}): ResourceUsers => ({
  cpu: [
    { name: "chrome", processes: 12, cpu: 30, memory: 2 * 1024 ** 3 },
    { name: "explorer", processes: 1, cpu: 4, memory: 200 * 1024 ** 2 },
  ],
  memory: [{ name: "chrome", processes: 12, cpu: 30, memory: 2 * 1024 ** 3 }],
  own_cpu: 2,
  others_cpu: 32,
  ...extra,
});

const stats = (extra: Partial<SystemStats> = {}): SystemStats => ({
  cpu_usage: 42,
  cpu_name: "Test CPU",
  cpu_cores: 2,
  ram_used: 8 * 1024 ** 3,
  ram_total: 16 * 1024 ** 3,
  disk_used: 400 * 1024 ** 3,
  disk_total: 512 * 1024 ** 3,
  os_name: "Windows 11",
  uptime_secs: 1000,
  ...extra,
});

/** A machine whose sensors answer: a CPU zone and one card that reports. */
const report = (extra: Partial<ThermalReport> = {}): ThermalReport => ({
  cpu_temp_c: 65,
  cpu_source: "acpi",
  gpus: [
    {
      name: "Test GPU",
      temp_c: 58,
      utilization_pct: 24,
      fan_pct: 40,
      vram_used_mb: 2048,
      vram_total_mb: 8192,
      power_w: null,
      power_limit_w: null,
      driver_version: null,
    },
  ],
  gpu_source: "nvidia-smi",
  ...extra,
});

const mount = (props: { onNavigate?: (section: Section) => void } = {}) =>
  render(<LiveDashboard s={s} lang="en" onNavigate={props.onNavigate ?? onNavigate} />);

/** The reads a mount makes, in the order it makes them. Slow sources are given
 *  slack: a test that advances the clock past a schedule boundary should not
 *  fail on a command whose answer nobody asserted. */
function feed(
  samples: LiveSample[],
  opts: {
    users?: ResourceUsers;
    stats?: SystemStats;
    report?: ThermalReport | Error | string;
  } = {},
) {
  bridge.reply("live_sample", ...samples);
  for (let i = 0; i < 4; i++) {
    if (opts.users) bridge.reply("resource_users", opts.users);
    if (opts.stats) bridge.reply("system_stats", opts.stats);
    if (opts.report) bridge.reply("thermal_report", opts.report);
    bridge.reply("gpu_readings", report().gpus);
  }
}

/** Flushes the microtask queue and any timer due now. `waitFor` cannot be used
 *  under a fake clock: Testing Library only drives a clock it recognises. */
async function settle(ms = 0) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
}

/** One second of the sampling timer. */
const tick = () => settle(1000);

describe("the promise that nothing runs in the background", () => {
  it("stops sampling the moment the window leaves the front, and picks up again", async () => {
    const focus = vi.spyOn(document, "hasFocus");
    feed([sample(), sample({ cpu: 55 })], { users: users(), stats: stats(), report: report() });
    mount();
    await settle();
    expect(bridge.callsTo("live_sample")).toHaveLength(1);

    focus.mockReturnValue(false);
    fireEvent.blur(window);
    await settle();
    expect(screen.getByText(l.paused)).toBeTruthy();
    expect(screen.getByText(l.pausedHint)).toBeTruthy();

    // A pause is a pause: five seconds later the count is unchanged, and the
    // charts keep the last reading rather than a dash.
    await settle(5000);
    expect(bridge.callsTo("live_sample")).toHaveLength(1);
    expect(document.querySelector(".live-card .live-pair")?.textContent).toContain("42");

    focus.mockReturnValue(true);
    fireEvent.focus(window);
    await settle();
    expect(bridge.callsTo("live_sample")).toHaveLength(2);
    expect(document.querySelector(".live-card .live-pair")?.textContent).toContain("55");
  });

  it("reads the slow sources on their own schedules, not on every tick", async () => {
    feed([sample(), sample(), sample()], { users: users(), stats: stats(), report: report() });
    const { container } = mount();
    await settle();

    // First reading: load, what is using it, the system drive, the sensors.
    const counts = () => ({
      sample: bridge.callsTo("live_sample").length,
      users: bridge.callsTo("resource_users").length,
      drive: bridge.callsTo("system_stats").length,
      sensors: bridge.callsTo("thermal_report").length,
      gpu: bridge.callsTo("gpu_readings").length,
    });
    expect(counts()).toEqual({ sample: 1, users: 1, drive: 1, sensors: 1, gpu: 0 });

    await tick();
    // Second reading: load only, plus the graphics card, which is cheap to read
    // and is where a game's effect shows first. The process table and the
    // sensors are not read again.
    expect(counts()).toEqual({ sample: 2, users: 1, drive: 1, sensors: 1, gpu: 1 });

    await tick();
    // Third reading: the process table is back — every other second, which is
    // plenty for a top five — and nothing else is.
    expect(counts()).toEqual({ sample: 3, users: 2, drive: 1, sensors: 1, gpu: 1 });

    await tick();
    // Fourth reading: nothing but the load itself. The card's sensors are read
    // once every ten seconds and the CPU zone once a minute, so neither is due.
    expect(counts()).toEqual({ sample: 4, users: 2, drive: 1, sensors: 1, gpu: 1 });
    expect(container.querySelectorAll(".live-core")).toHaveLength(2);
  });

  it("starts the chart again after a gap instead of joining two moments", async () => {
    const focus = vi.spyOn(document, "hasFocus");
    feed([sample(), sample({ cpu: 55 }), sample({ cpu: 60 })], {
      users: users(),
      stats: stats(),
      report: report(),
    });
    const { container } = mount();
    await settle();
    const activity = container.querySelector(".live-card")!;
    expect(activity.querySelectorAll("path.live-line")).toHaveLength(0);

    // One more reading half a second of clock later: two points, one line.
    await tick();
    expect(activity.querySelectorAll("path.live-line")).toHaveLength(2);

    focus.mockReturnValue(false);
    fireEvent.blur(window);
    await settle(30_000);
    focus.mockReturnValue(true);
    fireEvent.focus(window);
    await settle();

    // Reading 60% arrives after half a minute of nothing. The CPU line drops
    // back to a single point rather than drawing a straight line across the
    // silence, which would say the machine sat at 55% the whole time.
    expect(bridge.callsTo("live_sample")).toHaveLength(3);
    expect(activity.querySelectorAll("path.live-line")).toHaveLength(0);
    expect(activity.querySelector(".live-value")?.textContent).toContain("60");
  });

  it("does not restart its timer on a re-render", async () => {
    feed([sample(), sample()], { users: users(), stats: stats(), report: report() });
    const view = mount();
    await settle();
    view.rerender(<LiveDashboard s={s} lang="en" onNavigate={onNavigate} />);
    await settle();
    expect(bridge.callsTo("live_sample")).toHaveLength(1);
  });
});

describe("what the readings say", () => {
  it("shows the numbers it was given, and how they were read", async () => {
    feed([sample()], { users: users(), stats: stats(), report: report() });
    const { container } = mount();
    await settle();

    const activity = container.querySelector(".live-card")!;
    expect(within(activity as HTMLElement).getByText(l.activity)).toBeTruthy();
    expect(activity.querySelector(".live-value")?.textContent).toContain("42%");
    expect(activity.querySelector(".live-value")?.textContent).toContain("50%");

    // Memory: used, cached and free as the three parts of the total.
    const memory = within(container.querySelectorAll(".live-card")[1] as HTMLElement);
    const row = (label: string) => {
      const parts = memory.getAllByText(label);
      return parts[parts.length - 1].closest("div")!.querySelector("dd")!.textContent;
    };
    expect(row(l.used)).toBe(formatGB(8 * 1024 ** 3, "en"));
    expect(row(l.cached)).toBe(formatGB(2 * 1024 ** 3, "en"));
    expect(row(l.free)).toBe(formatGB(6 * 1024 ** 3, "en"));
    expect(row(l.total)).toBe(formatGB(16 * 1024 ** 3, "en"));

    // The processor card states the clock it actually reads, not a rating.
    expect(container.querySelectorAll(".live-card")[2].textContent).toContain(
      format(l.speed, { ghz: "3.60" }),
    );
    expect(container.querySelectorAll(".live-card")[2].textContent).toContain("65 °C");

    // Disk and network are rates, in the units the reader can act on.
    const disk = container.querySelectorAll(".live-card")[4];
    expect(disk.textContent).toContain(formatRate(2_000_000, "en")!);
    expect(disk.textContent).toContain(
      format(l.systemDrive, {
        used: formatGB(400 * 1024 ** 3, "en"),
        total: formatGB(512 * 1024 ** 3, "en"),
      }),
    );
    expect(container.querySelectorAll(".live-card")[5].textContent).toContain(
      formatRate(40_000, "en")!,
    );
  });

  it("judges the last ten seconds, and says which ten seconds it judged", async () => {
    feed(
      Array.from({ length: 12 }, () => sample({ cpu: 96 })),
      { users: users(), stats: stats(), report: report() },
    );
    const { container } = mount();
    await settle();
    // Two readings is not a verdict — the badge says it is still measuring.
    expect(screen.getAllByText(l.measuring).length).toBeGreaterThan(0);
    expect(container.querySelector(".live-head")!.textContent).not.toContain(l.strained);
    expect(container.querySelector(".live-notes")!.textContent).toContain(l.insightCalm);

    await tick();
    await tick();
    expect(container.querySelector(".live-head")!.textContent).toContain(l.strained);
    expect(container.querySelector(".live-head")!.textContent).toContain(
      format(l.verdictDetail, { cpu: 96, ram: 50 }),
    );
    // The badge judges three seconds; the sentence about a processor that has
    // been busy for a while waits for ten of them.
    expect(container.querySelector(".live-notes")!.textContent).toContain(l.insightCalm);

    for (let i = 0; i < 8; i++) await tick();
    expect(container.querySelector(".live-notes")!.textContent).toContain(
      format(l.insightCpu, { pct: 96 }),
    );
    expect(container.querySelector(".live-notes")!.textContent).not.toContain(l.insightCalm);
  });

  it("says a sensor is absent rather than guessing at one", async () => {
    // No CPU zone and no card with a readable sensor: the page must say so once
    // and stop asking, not keep calling PowerShell and nvidia-smi every tick.
    feed([sample(), sample()], {
      users: users(),
      stats: stats(),
      report: { cpu_temp_c: null, cpu_source: "unavailable", gpus: [], gpu_source: "none" },
    });
    const { container } = mount();
    await settle();
    await tick();

    const sensors = container.querySelectorAll(".live-card")[6];
    expect(sensors.textContent).toContain(l.sensors);
    expect(sensors.textContent).toContain(l.notAvailable);
    expect(sensors.textContent).toContain(l.sensorsHint);
    expect(bridge.callsTo("thermal_report")).toHaveLength(1);
    expect(bridge.callsTo("gpu_readings")).toHaveLength(0);
  });

  it("shows the graphics card when there is one, with its own sensor readings", async () => {
    feed([sample()], { users: users(), stats: stats(), report: report() });
    const { container } = mount();
    await settle();

    const gpu = container.querySelectorAll(".live-card")[6];
    expect(gpu.textContent).toContain(l.gpu);
    expect(gpu.textContent).toContain("Test GPU");
    expect(gpu.textContent).toContain("24");
    const meter = gpu.querySelector('[role="meter"]')!;
    expect(meter.getAttribute("aria-label")).toBe(l.gpuLoad);
    expect(meter.getAttribute("aria-valuenow")).toBe("24");
    expect(meter.getAttribute("aria-valuemax")).toBe("100");
    expect(gpu.textContent).toContain("58 °C");
    expect(gpu.textContent).toContain("40%");
    expect(gpu.textContent).toContain(formatGB(2048 * 1024 * 1024, "en"));
  });

  it("keeps a missing sensor missing, and a null rate a dash rather than a zero", async () => {
    feed([sample({ ram_cached: null, disk_read_bps: null })], {
      users: users(),
      stats: stats(),
      report: report({ cpu_temp_c: null }),
    });
    const { container } = mount();
    await settle();

    const memory = within(container.querySelectorAll(".live-card")[1] as HTMLElement);
    const cached = memory.getAllByText(l.cached)[0].closest("div")!;
    expect(cached.querySelector("dd")!.textContent).toBe(l.notAvailable);
    // A rate Windows did not report is not 0 B/s — it is unknown, and says so,
    // while the rate it did report is shown as a number.
    const disk = container.querySelectorAll(".live-card")[4].textContent!;
    expect(disk).toContain(l.measuring);
    expect(disk).toContain(formatRate(500_000, "en")!);
  });

  it("says the readings are unavailable, and recovers when they come back", async () => {
    bridge.fail("live_sample", "LIVE_SAMPLE_FAILED: the performance counter is busy");
    feed([sample({ cpu: 33 })], { users: users(), stats: stats(), report: report() });
    const { container } = mount();
    await settle();
    expect(container.querySelector(".live-error")!.textContent).toBe(l.failed);

    await tick();
    expect(container.querySelector(".live-error")).toBeNull();
    expect(container.querySelector(".live-value")!.textContent).toContain("33");
  });
});

describe("reading the charts", () => {
  it("offers the last minute and the last five, and says which is showing", async () => {
    feed([sample(), sample(), sample()], { users: users(), stats: stats(), report: report() });
    const { container } = mount();
    await settle();

    const short = screen.getByRole("button", { name: l.zoomShort });
    const long = screen.getByRole("button", { name: l.zoomLong });
    expect(short.getAttribute("aria-pressed")).toBe("true");
    expect(long.getAttribute("aria-pressed")).toBe("false");
    expect(container.querySelector(".live-axis-x")!.textContent).toContain(
      format(l.minutesAgo, { n: 1 }),
    );

    fireEvent.click(long);
    await settle();
    expect(long.getAttribute("aria-pressed")).toBe("true");
    expect(short.getAttribute("aria-pressed")).toBe("false");
    expect(container.querySelector(".live-axis-x")!.textContent).toContain(
      format(l.minutesAgo, { n: 5 }),
    );
  });

  it("shows the value under the pointer and how long ago it was read", async () => {
    feed([sample(), sample({ cpu: 55 }), sample({ cpu: 60 })], {
      users: users(),
      stats: stats(),
      report: report(),
    });
    const { container } = mount();
    await settle();
    await tick();
    await tick();

    const chart = container.querySelector(".live-spark")! as HTMLElement;
    // jsdom lays nothing out, so the pointer maths needs a box to work in.
    chart.getBoundingClientRect = () => ({ left: 0, width: 600 }) as DOMRect;
    fireEvent.mouseMove(chart, { clientX: 600 });
    let tooltip = screen.getByRole("tooltip");
    expect(tooltip.textContent).toContain(l.cpu);
    expect(tooltip.textContent).toContain("60%");
    expect(tooltip.textContent).toContain(l.now);

    // One slot to the left is the reading before it: 55%, one second ago.
    fireEvent.mouseMove(chart, { clientX: 600 - 600 / 59 });
    tooltip = screen.getByRole("tooltip");
    expect(tooltip.textContent).toContain("55%");
    expect(tooltip.textContent).toContain(format(l.secondsAgo, { s: 1 }));

    fireEvent.mouseLeave(chart);
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("leaves the easing out when the reader asked for less motion", async () => {
    feed([sample(), sample()], { users: users(), stats: stats(), report: report() });
    const view = mount();
    await settle();
    expect(document.querySelector(".live-track")!.className).not.toContain("live-slide");

    // Same dashboard, a reader who did not ask for reduced motion: the chart
    // slides one step per reading.
    view.unmount();
    setReducedMotion(false);
    mount();
    await settle();
    expect(document.querySelector(".live-track")!.className).toContain("live-slide");
  });
});

describe("what is using the machine", () => {
  it("groups processes by name and counts them honestly", async () => {
    feed([sample()], { users: users(), stats: stats(), report: report() });
    const { container } = mount();
    await settle();

    const card = within(container.querySelectorAll(".live-card")[3] as HTMLElement);
    expect(card.getByText(l.usingTitle)).toBeTruthy();
    expect(card.getByText(l.usingHint)).toBeTruthy();
    expect(card.getByText(l.usingCpu)).toBeTruthy();
    expect(card.getByText(l.usingMemory)).toBeTruthy();
    expect(card.getAllByText("chrome").length).toBe(2);
    // Counted in both lists, because that group is the top of both.
    expect(card.getAllByText(format(l.processes, { count: 12 }))).toHaveLength(2);
    // One process is one process, not "1 processes".
    expect(card.getByText(l.processOne)).toBeTruthy();
  });

  it("does not invent a list before the process table has answered", () => {
    const { container } = render(
      <UsersList users={[]} value={() => ({ text: "", ratio: 0 })} s={s} />,
    );
    expect(container.textContent).toBe(l.measuring);
  });

  it("offers the two ways out of a full machine", async () => {
    feed([sample({ ram_used: 14.5 * 1024 ** 3 })], {
      users: users(),
      stats: stats({ disk_used: 96 * 1024 ** 3, disk_total: 100 * 1024 ** 3 }),
      report: report(),
    });
    mount();
    await settle();

    expect(screen.getByText(format(l.insightMemory, { pct: 91 }))).toBeTruthy();
    expect(screen.getByText(format(l.insightDrive, { pct: 96 }))).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: l.actionStartup }));
    expect(onNavigate).toHaveBeenCalledWith("startup");
    fireEvent.click(screen.getByRole("button", { name: l.actionCleanup }));
    expect(onNavigate).toHaveBeenCalledWith("maintenance");
  });

  it("says nothing needs attention when nothing does", async () => {
    feed([sample({ cpu: 4, ram_used: 2 * 1024 ** 3 })], {
      users: users(),
      stats: stats(),
      report: report(),
    });
    const { container } = mount();
    await settle();
    const notes = container.querySelector(".live-notes")!;
    expect(notes.textContent).toContain(l.insightCalm);
    expect(within(notes as HTMLElement).queryByRole("button")).toBeNull();
    // The one calm note carries a tick rather than an exclamation mark.
    expect(notes.querySelector(".badge")?.textContent).toBe("✓");
  });
});

describe("accessibility", () => {
  it("has no axe violations before the first reading arrives", async () => {
    feed([sample()], { users: users(), stats: stats(), report: report() });
    const { container } = mount();
    await settle();
    vi.useRealTimers();
    expect((await axe(container)).violations).toEqual([]);
  });

  it("has no axe violations once it is full of live readings", async () => {
    feed(
      [sample({ cpu: 95, ram_used: 15 * 1024 ** 3 }), sample({ cpu: 96 }), sample({ cpu: 97 })],
      {
        users: users(),
        stats: stats({ disk_used: 98 * 1024 ** 3, disk_total: 100 * 1024 ** 3 }),
        report: report(),
      },
    );
    const { container } = mount();
    await settle();
    await tick();
    await tick();
    vi.useRealTimers();
    expect((await axe(container)).violations).toEqual([]);
  });
});
