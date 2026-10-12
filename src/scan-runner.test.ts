import { describe, expect, it } from "vitest";
import {
  applyScanSelection,
  optionalScanTweaks,
  recommendedTweaks,
  type ScanReport,
} from "./scan-runner";
import type { TweakAdvice, TweakInfo } from "./types";

type Call = <T>(command: string, args?: Record<string, unknown>) => Promise<T>;

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

const advice = (id: string, verdict: TweakAdvice["verdict"]): TweakAdvice => ({
  id,
  verdict,
  reason_key: null,
});

const report = (extra: Partial<ScanReport> = {}): ScanReport =>
  ({ tweaks: [], ids: [], advice: [], ...extra }) as ScanReport;

/**
 * A stand-in for the Tauri `invoke` bridge. `list` is consumed one reply per
 * read, so a test can make the second read — the one that happens after the
 * writes — disagree with the first, which is exactly the case the code
 * re-checks eligibility for.
 */
function bridge(handlers: {
  list?: (TweakInfo[] | Error)[];
  ids?: string[] | Error;
  advice?: TweakAdvice[] | Error;
  apply?: string[] | Error;
}) {
  const log: { command: string; args?: Record<string, unknown> }[] = [];
  const call: Call = async <T>(command: string, args?: Record<string, unknown>) => {
    log.push({ command, args });
    const next = <V>(value: V | Error | undefined, fallback: V): V => {
      if (value instanceof Error) throw value;
      return (value ?? fallback) as V;
    };
    switch (command) {
      case "list_tweaks":
        return next(handlers.list?.shift(), [] as TweakInfo[]) as T;
      case "scan_relevant_ids":
        return next(handlers.ids, [] as string[]) as T;
      case "advise_tweaks":
        return next(handlers.advice, [] as TweakAdvice[]) as T;
      case "apply_tweaks":
        return next(handlers.apply, [] as string[]) as T;
      default:
        throw new Error(`unexpected command ${command}`);
    }
  };
  return {
    call,
    log,
    applied: () => log.filter((entry) => entry.command === "apply_tweaks").map((e) => e.args?.ids),
  };
}

describe("recommendedTweaks and optionalScanTweaks", () => {
  const tweaks = [
    tweak("recommended"),
    tweak("neutral"),
    tweak("already_on", { applied: true }),
    tweak("outside"),
    tweak("turbo_boost"),
  ];
  const scan = report({
    tweaks,
    ids: tweaks.filter((t) => t.id !== "outside").map((t) => t.id),
    advice: [
      advice("recommended", "recommended"),
      advice("neutral", "neutral"),
      advice("already_on", "recommended"),
      advice("outside", "recommended"),
      advice("turbo_boost", "recommended"),
    ],
  });

  it("offers only what the hardware recommends, is reachable and is not already on", () => {
    expect(recommendedTweaks(scan).map((t) => t.id)).toEqual(["recommended"]);
  });

  it("keeps neutral findings for review instead of folding them into Fix all", () => {
    expect(optionalScanTweaks(scan).map((t) => t.id)).toEqual(["neutral"]);
  });

  it("offers nothing without advice", () => {
    expect(recommendedTweaks(report({ tweaks, ids: scan.ids }))).toEqual([]);
  });
});

describe("applyScanSelection", () => {
  it("applies the selection and reports what it fixed", async () => {
    const tweaks = [tweak("a"), tweak("b")];
    const scan = report({
      tweaks,
      ids: ["a", "b"],
      advice: [advice("a", "recommended"), advice("b", "recommended")],
    });
    const { call } = bridge({
      list: [tweaks, [tweak("a", { applied: true }), tweak("b", { applied: true })]],
      ids: ["a", "b"],
      advice: scan.advice ?? [],
    });

    const outcome = await applyScanSelection(call, scan, ["a", "b"]);
    expect(outcome.fixed).toEqual(["a", "b"]);
    expect(outcome.failed).toEqual([]);
    expect(outcome.skipped).toEqual([]);
    expect(outcome.errors).toEqual([]);
  });

  it("re-reads eligibility before writing, so a stale row is skipped, not applied", async () => {
    const tweaks = [tweak("a"), tweak("b")];
    const scan = report({
      tweaks,
      ids: ["a", "b"],
      advice: [advice("a", "recommended"), advice("b", "recommended")],
    });
    const { call, applied } = bridge({
      // The second opinion has changed since the scan: "b" is no longer advised.
      list: [tweaks, [tweak("a", { applied: true })]],
      ids: ["a", "b"],
      advice: [advice("a", "recommended"), advice("b", "notrecommended")],
    });

    const outcome = await applyScanSelection(call, scan, ["a", "b"]);
    expect(applied()).toEqual([["a"]]);
    expect(outcome.fixed).toEqual(["a"]);
    expect(outcome.skipped).toEqual(["b"]);
  });

  it("ignores ids that were never part of the scan's own offer", async () => {
    const scan = report({
      tweaks: [tweak("a")],
      ids: ["a"],
      advice: [advice("a", "recommended")],
    });
    const { call, applied, log } = bridge({
      // Offered once, still eligible on the re-read, verified applied after.
      list: [[tweak("a")], [tweak("a", { applied: true })]],
      ids: ["a"],
      advice: scan.advice ?? [],
    });

    const outcome = await applyScanSelection(call, scan, ["a", "injected", "a"]);
    expect(applied()).toEqual([["a"]]);
    expect(log.filter((e) => e.command === "apply_tweaks")).toHaveLength(1);
    expect(outcome.skipped).toEqual([]);
  });

  it("does not write at all when nothing is eligible", async () => {
    const scan = report({
      tweaks: [tweak("a")],
      ids: ["a"],
      advice: [advice("a", "recommended")],
    });
    const { call, applied } = bridge({ ids: ["a"], advice: [advice("a", "neutral")] });

    const outcome = await applyScanSelection(call, scan, ["a"]);
    expect(applied()).toEqual([]);
    expect(outcome.skipped).toEqual(["a"]);
    expect(outcome.fixed).toEqual([]);
  });

  it("keeps a failure from looking like a fix", async () => {
    const scan = report({
      tweaks: [tweak("a")],
      ids: ["a"],
      advice: [advice("a", "recommended")],
    });
    const { call } = bridge({
      list: [[tweak("a")]],
      ids: ["a"],
      advice: scan.advice ?? [],
      apply: ["administrator rights are required"],
    });

    const outcome = await applyScanSelection(call, scan, ["a"]);
    expect(outcome.fixed).toEqual([]);
    expect(outcome.failed).toEqual(["a"]);
    expect(outcome.errors).toEqual(["administrator rights are required"]);
  });

  it("reports a thrown apply and a failed verification read", async () => {
    const scan = report({
      tweaks: [tweak("a")],
      ids: ["a"],
      advice: [advice("a", "recommended")],
    });
    const thrown = bridge({
      list: [[tweak("a")]],
      ids: ["a"],
      advice: scan.advice ?? [],
      apply: new Error("the elevated helper is not running"),
    });
    const first = await applyScanSelection(thrown.call, scan, ["a"]);
    expect(first.errors).toEqual(["Error: the elevated helper is not running"]);
    expect(first.failed).toEqual(["a"]);

    const unreadable = bridge({
      list: [[tweak("a")], new Error("list_tweaks failed")],
      ids: ["a"],
      advice: scan.advice ?? [],
    });
    const second = await applyScanSelection(unreadable.call, scan, ["a"]);
    expect(second.errors).toEqual(["Error: list_tweaks failed"]);
    expect(second.fixed).toEqual([]);
    expect(second.failed).toEqual(["a"]);
    expect(second.tweaks).toBeNull();
  });
});
