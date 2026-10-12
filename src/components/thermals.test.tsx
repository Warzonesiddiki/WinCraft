import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { format } from "../i18n";
import { STRINGS } from "../i18n-tables";
import type { GpuPowerInfo, GpuReading, ThermalReport } from "../types";
import { ThermalsPanel } from "./hardware";

vi.mock("@tauri-apps/api/core", async () => (await import("../test-bridge")).coreModule());
vi.mock("@tauri-apps/api/event", async () => (await import("../test-bridge")).eventModule());

const { bridge } = await import("../test-bridge");

const s = STRINGS.en;
const pushToast = vi.fn();

/**
 * The panel polls `thermal_report` every two seconds and computes its verdict
 * from the samples it has collected, so these tests drive the clock rather than
 * sleeping: the interval *is* the behaviour under test. `tick()` advances one
 * poll; `settle()` flushes the mount reads without advancing the interval.
 */
async function flush(ms = 0) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
}

async function tick() {
  await flush(2000);
}

beforeEach(() => {
  bridge.reset();
  pushToast.mockReset();
  vi.useFakeTimers();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const gpu = (extra: Partial<GpuReading> = {}): GpuReading => ({
  name: "NVIDIA GeForce RTX 4060",
  temp_c: 62,
  utilization_pct: 55,
  vram_used_mb: 4096,
  vram_total_mb: 8192,
  fan_pct: 40,
  power_w: 90,
  power_limit_w: 115,
  driver_version: "560.94",
  ...extra,
});

const report = (extra: Partial<ThermalReport> = {}): ThermalReport => ({
  cpu_temp_c: 58,
  cpu_source: "acpi",
  gpus: [gpu()],
  gpu_source: "nvidia-smi",
  ...extra,
});

const power = (extra: Partial<GpuPowerInfo> = {}): GpuPowerInfo => ({
  supported: true,
  current_w: 115,
  default_w: 115,
  min_w: 60,
  max_w: 115,
  default_is_max: true,
  max_clock_mhz: 2500,
  current_clock_mhz: 2400,
  ...extra,
});

/** Mounts the panel with one reading and one power read already queued. */
async function mount(reading: ThermalReport | Error = report(), info: GpuPowerInfo = power()) {
  bridge.reply("thermal_report", reading);
  bridge.reply("gpu_power_info", info);
  const view = render(<ThermalsPanel s={s} pushToast={pushToast} />);
  await flush();
  return view;
}

describe("ThermalsPanel", () => {
  it("says so when no reading ever arrived, instead of showing a blank card", async () => {
    await mount(new Error("nvidia-smi is not installed"));
    expect(screen.getByText(s.hardware.thermalsUnavailable)).toBeInTheDocument();
  });

  it("keeps the last reading on screen when a later poll fails", async () => {
    await mount();
    expect(screen.getByText("NVIDIA GeForce RTX 4060")).toBeInTheDocument();

    bridge.reply("thermal_report", new Error("nvidia-smi timed out"));
    await tick();

    // The card is still there: one failed poll is momentary and the next is two
    // seconds away, so it must not wipe a working reading.
    expect(screen.getByText("NVIDIA GeForce RTX 4060")).toBeInTheDocument();
    expect(screen.queryByText(s.hardware.thermalsUnavailable)).not.toBeInTheDocument();
    expect(bridge.callsTo("thermal_report")).toHaveLength(2);
  });

  it("reads out the numbers the card's own driver reported", async () => {
    await mount();
    // The arc is an image with the temperature in its accessible name, so a
    // screen reader gets the reading too.
    expect(screen.getByRole("img", { name: "62 °C" })).toBeInTheDocument();
    expect(
      screen.getByText(format(s.hardware.gpuDriver, { version: "560.94" })),
    ).toBeInTheDocument();
    expect(screen.getByText("55%")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
    expect(screen.getByText("4 / 8 GB")).toBeInTheDocument();
    expect(screen.getByText("40%")).toBeInTheDocument();
    expect(screen.getByText("90 W")).toBeInTheDocument();
    expect(screen.getByText(format(s.hardware.powerLimit, { limit: "115" }))).toBeInTheDocument();
  });

  it("marks a missing sensor as missing rather than as zero", async () => {
    await mount(
      report({
        cpu_temp_c: null,
        gpus: [gpu({ temp_c: null, fan_pct: 0, vram_used_mb: null, utilization_pct: null })],
      }),
    );
    expect(screen.getByText(s.hardware.noTempSensor)).toBeInTheDocument();
    // A fan reporting 0% that is not spinning is idle, not broken.
    expect(screen.getByText(s.hardware.fanIdle)).toBeInTheDocument();
    expect(screen.getByText(s.hardware.cpuNoSensor)).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: /°C/ })).not.toBeInTheDocument();
    // A reading with no sensor at all is still shown, with dashes for the gaps.
    expect(screen.getAllByText("—").length).toBeGreaterThan(0);
  });

  it("says when there is no GPU tool to read at all", async () => {
    await mount(report({ gpu_source: "none", gpus: [] }));
    expect(screen.getByText(s.hardware.noGpuTool)).toBeInTheDocument();
  });

  it("stops polling while the window is hidden", async () => {
    await mount();
    expect(bridge.callsTo("thermal_report")).toHaveLength(1);

    const hidden = Object.getOwnPropertyDescriptor(Document.prototype, "hidden");
    Object.defineProperty(document, "hidden", { value: true, configurable: true });
    try {
      await tick();
      await tick();
      // Nothing to read into an invisible window, and the driver is left alone.
      expect(bridge.callsTo("thermal_report")).toHaveLength(1);
    } finally {
      if (hidden) Object.defineProperty(Document.prototype, "hidden", hidden);
      delete (document as { hidden?: unknown }).hidden;
    }
  });

  it("draws the trend only once there is a trend to read", async () => {
    // The mount itself is the first sample, so the trace needs three more
    // polls before it has the four points it draws from.
    await mount();
    for (const temp of [60, 61]) {
      bridge.reply("thermal_report", report({ gpus: [gpu({ temp_c: temp })] }));
      await tick();
    }
    expect(screen.queryByText(s.hardware.traceLabel)).not.toBeInTheDocument();

    bridge.reply("thermal_report", report({ gpus: [gpu({ temp_c: 66 })] }));
    await tick();
    expect(screen.getByText(s.hardware.traceLabel)).toBeInTheDocument();
    expect(
      screen.getByText(format(s.hardware.traceRange, { min: "60", max: "66" })),
    ).toBeInTheDocument();
  });

  it("calls a session idle until the card has actually been working", async () => {
    await mount(report({ gpus: [gpu({ temp_c: 45, utilization_pct: 4 })] }));
    await tick();
    await tick();
    expect(screen.getByText(s.hardware.watchLabel)).toBeInTheDocument();
    expect(screen.getByText(s.hardware.verdictIdle)).toBeInTheDocument();
  });

  it("reports a card that stays cool under load as cooling well", async () => {
    await mount();
    for (let i = 0; i < 4; i++) {
      bridge.reply("thermal_report", report());
      await tick();
    }
    expect(screen.getByText(s.hardware.verdictBetter)).toBeInTheDocument();
    expect(screen.getByText("62°")).toBeInTheDocument();
  });

  it("calls a session risky from a single hot reading under load", async () => {
    await mount(report({ gpus: [gpu({ temp_c: 88 })] }));
    expect(screen.getByText(s.hardware.verdictRisky)).toBeInTheDocument();
  });
});

describe("thermal profiles", () => {
  it("opens on the profile the card is already on", async () => {
    // Current watts are the card's maximum and its clock is at the ceiling,
    // which is what Gaming means — so the screen says Active, not Standard.
    await mount(report(), power({ current_w: 115, current_clock_mhz: 2500 }));
    expect(screen.getByText(s.hardware.profilesTitle)).toBeInTheDocument();
    expect(screen.getByText(format(s.hardware.currentLimit, { watts: "115" }))).toBeInTheDocument();

    const active = screen.getByRole("button", { name: s.hardware.profileActive });
    expect(active).toBeDisabled();
    expect(screen.getByRole("button", { name: new RegExp(s.hardware.modeGaming) })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("applies the plan it showed, then re-reads the card", async () => {
    // Default is the maximum, so Silent is 60% of 115 W = 69 W with no lock.
    await mount();
    bridge.reply("gpu_power_info", power({ current_w: 69, current_clock_mhz: 2400 }));

    fireEvent.click(screen.getByRole("button", { name: new RegExp(s.hardware.modeSilent) }));
    expect(
      screen.getByText(
        format(s.hardware.profileWillSet, { watts: "69", clock: s.hardware.modeClockAuto }),
      ),
    ).toBeInTheDocument();

    // Held so the middle stage is observable: the write itself returns in
    // well under a second, and the stages are there to be read.
    bridge.hold("set_gpu_profile");
    bridge.reply("set_gpu_profile", null);
    fireEvent.click(screen.getByRole("button", { name: s.hardware.profileApply }));
    // The button narrates the steps, because the fan takes seconds to answer.
    expect(screen.getByText(s.hardware.profileStageReading)).toBeInTheDocument();

    await flush(420);
    expect(bridge.argsOf("set_gpu_profile")).toEqual({ watts: 69, lockClockMhz: null });
    expect(screen.getByText(s.hardware.profileStageApplying)).toBeInTheDocument();

    bridge.release("set_gpu_profile");
    await flush(700);
    expect(pushToast).toHaveBeenCalledWith(
      "success",
      format(s.hardware.profileApplied, { watts: "69" }),
    );
    // The read is repeated so the screen shows what the driver now holds.
    expect(bridge.callsTo("gpu_power_info")).toHaveLength(2);
  });

  it("leaves the card alone and says so when the write fails", async () => {
    await mount();
    bridge.reply("set_gpu_profile", new Error("no permission to change the power limit"));

    fireEvent.click(screen.getByRole("button", { name: new RegExp(s.hardware.modeSilent) }));
    fireEvent.click(screen.getByRole("button", { name: s.hardware.profileApply }));
    await flush(420);
    await flush(700);

    // `String(e)` on an Error, which is what the panel shows: a real Tauri
    // rejection is already a string, so this is the fallback path.
    expect(pushToast).toHaveBeenCalledWith(
      "error",
      "Error: no permission to change the power limit",
    );
    // No re-read: nothing changed, so there is nothing new to show.
    expect(bridge.callsTo("gpu_power_info")).toHaveLength(1);
    expect(screen.getByRole("button", { name: s.hardware.profileApply })).toBeEnabled();
  });

  it("offers no profiles when the driver cannot set a limit", async () => {
    await mount(report(), power({ supported: false }));
    expect(screen.queryByText(s.hardware.profilesTitle)).not.toBeInTheDocument();
  });

  it("puts the profiles on the first card only", async () => {
    // The limit is set per GPU index and only index 0 is addressed today.
    await mount(report({ gpus: [gpu(), gpu({ name: "NVIDIA GeForce RTX 4070" })] }));
    expect(screen.getByText("NVIDIA GeForce RTX 4070")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: new RegExp(s.hardware.modeSilent) })).toHaveLength(
      1,
    );
  });

  it("says nothing about the default being the maximum on a card where it is not", async () => {
    await mount(report(), power({ default_w: 100, default_is_max: false }));
    expect(screen.queryByText(s.hardware.profileDefaultIsMax)).not.toBeInTheDocument();
  });
});

describe("accessibility", () => {
  it("has no axe violations with a reading and the profiles on screen", async () => {
    // axe runs on the real clock; the poll interval stays pending but the
    // panel unmounts in afterEach.
    vi.useRealTimers();
    bridge.reply("thermal_report", report());
    bridge.reply("gpu_power_info", power());
    const { container } = render(<ThermalsPanel s={s} pushToast={pushToast} />);
    await screen.findByText("NVIDIA GeForce RTX 4060");
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
