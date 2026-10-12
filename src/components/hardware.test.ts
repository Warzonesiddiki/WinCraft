import { describe, expect, it } from "vitest";
import type { GpuPowerInfo } from "../types";
import { judgeSession, modePlan, type ThermalSample } from "./hardware";

const sample = (tempC: number, loadPct: number | null): ThermalSample => ({ tempC, loadPct });

const gpu = (extra: Partial<GpuPowerInfo> = {}): GpuPowerInfo => ({
  supported: true,
  current_w: 100,
  default_w: 100,
  min_w: 60,
  max_w: 130,
  default_is_max: false,
  max_clock_mhz: 1800,
  current_clock_mhz: 1600,
  ...extra,
});

describe("judgeSession", () => {
  it("has nothing to say before anything was sampled", () => {
    expect(judgeSession([])).toBe("idle");
  });

  it("calls a hot reading risky whether or not the card was working", () => {
    // One hot sample and nothing else: the peak is what matters.
    expect(judgeSession([sample(85, null)])).toBe("risky");
    expect(
      judgeSession([
        sample(70, 80),
        sample(84, 80),
        sample(72, 80),
        sample(71, 80),
        sample(70, 80),
      ]),
    ).toBe("risky");
  });

  it("will not judge the cooler from an idle session", () => {
    // Cool, but under load that never rose: not evidence about the cooler.
    expect(judgeSession([sample(50, 5), sample(52, 10), sample(51, 0)])).toBe("idle");
  });

  it("needs five loaded samples before it calls a session better", () => {
    const loaded = (n: number) => Array.from({ length: n }, () => sample(60, 70));
    expect(judgeSession(loaded(4))).toBe("idle");
    expect(judgeSession(loaded(5))).toBe("better");
  });

  it("is normal when the card works but does not stay cool", () => {
    expect(
      judgeSession([
        sample(70, 90),
        sample(72, 90),
        sample(71, 90),
        sample(70, 90),
        sample(73, 90),
      ]),
    ).toBe("normal");
  });

  it("judges by the peak under load, not by the peak overall", () => {
    // One hot idle blip between loaded, cool samples: still a cool session.
    const samples = [
      sample(80, 5),
      sample(60, 90),
      sample(61, 90),
      sample(62, 90),
      sample(60, 90),
      sample(61, 90),
    ];
    expect(judgeSession(samples)).toBe("better");
  });

  it("treats a missing load figure as no load", () => {
    expect(judgeSession([sample(60, null), sample(61, null)])).toBe("idle");
  });
});

describe("modePlan", () => {
  it("has no plan when the driver will not report a range", () => {
    expect(modePlan(gpu({ min_w: null }), "gaming")).toBeNull();
    expect(modePlan(gpu({ max_w: null }), "silent")).toBeNull();
  });

  it("gaming takes the card's own maximum and pins its top clock", () => {
    expect(modePlan(gpu(), "gaming")).toEqual({ watts: 130, lockClockMhz: 1800 });
  });

  it("standard is 85% of the factory default with the clock left alone", () => {
    expect(modePlan(gpu(), "standard")).toEqual({ watts: 85, lockClockMhz: null });
  });

  it("silent is 60% of the factory default", () => {
    expect(modePlan(gpu(), "silent")).toEqual({ watts: 60, lockClockMhz: null });
  });

  it("falls back to the maximum when the default is unknown", () => {
    expect(modePlan(gpu({ default_w: null }), "standard")).toEqual({
      watts: 111,
      lockClockMhz: null,
    });
  });

  it("never asks for less than the driver accepts", () => {
    // 60% of 100 W would be 60 W, but this card's floor is 90 W.
    expect(modePlan(gpu({ min_w: 90 }), "silent")).toEqual({ watts: 90, lockClockMhz: null });
  });

  it("rounds to a whole watt", () => {
    // 95 W default, and a floor low enough that the percentages, not the
    // floor, decide the answer: 85% is 80.75 and 60% is 57.
    const card = gpu({ default_w: 95, min_w: 40 });
    expect(modePlan(card, "standard")?.watts).toBe(81);
    expect(modePlan(card, "silent")?.watts).toBe(57);
  });
});
