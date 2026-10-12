import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import { STRINGS, format } from "../i18n";
import type { CrashReport, DriftReport, TweakInfo } from "../types";
import { CrashReportsCard, DriftWatchToggle, UpdateDriftCard } from "./intelligence";

vi.mock("@tauri-apps/api/core", async () => (await import("../test-bridge")).coreModule());
vi.mock("@tauri-apps/api/event", async () => (await import("../test-bridge")).eventModule());

const { bridge } = await import("../test-bridge");

const s = STRINGS.en;
const pushToast = vi.fn();
const onChanged = vi.fn(async () => {});

beforeEach(() => {
  bridge.reset();
  pushToast.mockReset();
  onChanged.mockClear();
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

const drift = (extra: Partial<DriftReport> = {}): DriftReport => ({
  windowsUpdated: true,
  previousPatch: "22631.1",
  currentPatch: "22631.2",
  reverted: ["disable_game_dvr"],
  ...extra,
});

const crash = (extra: Partial<CrashReport> = {}): CrashReport => ({
  ts: 1_760_000_000,
  version: "1.18.1",
  process: "elevated",
  message: "index out of bounds",
  location: "src-tauri/src/cleanup.rs:412",
  thread: "main",
  ...extra,
});

describe("UpdateDriftCard", () => {
  it("stays away when nothing was reverted", async () => {
    bridge.reply("check_update_drift", drift({ reverted: [] }));
    const { container } = render(
      <UpdateDriftCard s={s} tweaks={[]} onChanged={onChanged} pushToast={pushToast} />,
    );

    await waitFor(() => expect(bridge.callsTo("check_update_drift")).toHaveLength(1));
    expect(container.textContent).toBe("");
  });

  it("names the patch Windows moved to and explains what it found", async () => {
    bridge.reply("check_update_drift", drift());
    render(
      <UpdateDriftCard
        s={s}
        tweaks={[tweak("disable_game_dvr")]}
        onChanged={onChanged}
        pushToast={pushToast}
      />,
    );

    expect(await screen.findByText(s.drift.titleAfterUpdate)).toBeInTheDocument();
    expect(
      screen.getByText(format(s.drift.afterUpdateOne, { patch: "22631.2" })),
    ).toBeInTheDocument();
  });

  it("does not blame Windows when the settings changed without it", async () => {
    bridge.reply(
      "check_update_drift",
      drift({ windowsUpdated: false, reverted: ["disable_game_dvr", "reduce_input_lag"] }),
    );
    render(
      <UpdateDriftCard
        s={s}
        tweaks={[tweak("disable_game_dvr"), tweak("reduce_input_lag")]}
        onChanged={onChanged}
        pushToast={pushToast}
      />,
    );

    expect(await screen.findByText(s.drift.titleNoUpdate)).toBeInTheDocument();
    expect(screen.getByText(format(s.drift.noUpdateMany, { count: 2 }))).toBeInTheDocument();
  });

  it("re-applies only the items left ticked", async () => {
    bridge.reply(
      "check_update_drift",
      drift({ reverted: ["disable_game_dvr", "reduce_input_lag"] }),
    );
    // Both came back: the verify read lists them as applied again.
    bridge.reply("list_tweaks", [
      tweak("disable_game_dvr", { applied: true }),
      tweak("reduce_input_lag", { applied: true }),
    ]);
    bridge.reply("apply_tweaks", []);
    render(
      <UpdateDriftCard
        s={s}
        tweaks={[tweak("disable_game_dvr"), tweak("reduce_input_lag")]}
        onChanged={onChanged}
        pushToast={pushToast}
      />,
    );
    const [first] = await screen.findAllByRole("checkbox");

    fireEvent.click(first);
    fireEvent.click(screen.getByRole("button", { name: s.drift.reapplyOne }));

    await waitFor(() =>
      expect(bridge.argsOf("apply_tweaks")).toEqual({
        ids: ["reduce_input_lag"],
        source: "reapply",
      }),
    );
    expect(pushToast).toHaveBeenCalledWith("success", s.drift.reappliedOne);
    expect(onChanged).toHaveBeenCalled();
    // The re-applied item is no longer offered.
    await waitFor(() => expect(screen.getAllByRole("checkbox")).toHaveLength(1));
  });

  it("counts success from what is in effect, not from the failure list", async () => {
    bridge.reply("check_update_drift", drift());
    // The batch was cancelled at the UAC prompt: one failure reported, but the
    // verify read shows the setting is applied.
    bridge.reply("list_tweaks", [tweak("disable_game_dvr", { applied: true })]);
    bridge.reply("apply_tweaks", ["elevation was cancelled or failed"]);
    render(
      <UpdateDriftCard
        s={s}
        tweaks={[tweak("disable_game_dvr")]}
        onChanged={onChanged}
        pushToast={pushToast}
      />,
    );
    await screen.findByText(s.drift.titleAfterUpdate);

    fireEvent.click(screen.getByRole("button", { name: s.drift.reapplyOne }));

    await waitFor(() => expect(pushToast).toHaveBeenCalledWith("success", s.drift.reappliedOne));
    // The declined prompt is reported in words a person can act on.
    expect(pushToast).toHaveBeenCalledWith("error", s.toasts.elevationDeclined);
  });

  it("reports a write that threw, and says it twice only if it happened twice", async () => {
    bridge.reply("check_update_drift", drift());
    bridge.reply("apply_tweaks", new Error("the helper is not running"));
    render(
      <UpdateDriftCard
        s={s}
        tweaks={[tweak("disable_game_dvr")]}
        onChanged={onChanged}
        pushToast={pushToast}
      />,
    );
    await screen.findByText(s.drift.titleAfterUpdate);

    fireEvent.click(screen.getByRole("button", { name: s.drift.reapplyOne }));

    await waitFor(() =>
      expect(pushToast).toHaveBeenCalledWith("error", "Error: the helper is not running"),
    );
    expect(onChanged).not.toHaveBeenCalled();
  });

  it("has no detectable accessibility violations", async () => {
    bridge.reply("check_update_drift", drift({ reverted: ["ecoa", "ecob"] }));
    const { container } = render(
      <UpdateDriftCard s={s} tweaks={[]} onChanged={onChanged} pushToast={pushToast} />,
    );
    await screen.findByText(s.drift.titleAfterUpdate);

    expect((await axe(container)).violations).toEqual([]);
  });
});

describe("CrashReportsCard", () => {
  it("shows nothing when there are no reports", async () => {
    bridge.reply("list_crash_reports", []);
    const { container } = render(<CrashReportsCard s={s} pushToast={pushToast} />);

    await waitFor(() => expect(bridge.callsTo("list_crash_reports")).toHaveLength(1));
    expect(container.textContent).toBe("");
  });

  it("shows nothing when the read fails, which is the same outcome", async () => {
    bridge.reply("list_crash_reports", new Error("no store"));
    const { container } = render(<CrashReportsCard s={s} pushToast={pushToast} />);

    await waitFor(() => expect(bridge.callsTo("list_crash_reports")).toHaveLength(1));
    expect(container.textContent).toBe("");
  });

  it("says which process died and where", async () => {
    bridge.reply("list_crash_reports", [
      crash(),
      crash({ process: "app", message: "unexpected token", thread: "worker-2" }),
    ]);
    render(<CrashReportsCard s={s} pushToast={pushToast} />);

    expect(await screen.findByText(s.crashes.title)).toBeInTheDocument();
    expect(screen.getByText(s.crashes.processElevated)).toBeInTheDocument();
    expect(screen.getByText(s.crashes.processApp)).toBeInTheDocument();
    // Both reports name the version, one line each.
    expect(screen.getAllByText("1.18.1", { exact: false })).toHaveLength(2);
  });

  it("copies the report as plain lines rather than JSON", async () => {
    // The clipboard write is the assertion: capture what the card passed,
    // which also gives the mock a parameter so calls[0][0] stays typed.
    let copied = "";
    const writeText = vi.fn(async (text: string) => {
      copied = text;
    });
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    bridge.reply("list_crash_reports", [crash()]);
    render(<CrashReportsCard s={s} pushToast={pushToast} />);
    await screen.findByText(s.crashes.title);

    fireEvent.click(screen.getByRole("button", { name: s.crashes.copy }));

    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));
    expect(copied).toContain("v1.18.1 (elevated)");
    expect(copied).toContain("index out of bounds");
    expect(copied).toContain("src-tauri/src/cleanup.rs:412");
    expect(copied).not.toContain("{");
    await waitFor(() => expect(pushToast).toHaveBeenCalledWith("success", s.crashes.copied));
  });

  it("clears the list only after the backend confirms", async () => {
    bridge.reply("list_crash_reports", [crash()]);
    bridge.reply("clear_crash_reports", undefined);
    render(<CrashReportsCard s={s} pushToast={pushToast} />);
    await screen.findByText(s.crashes.title);

    fireEvent.click(screen.getByRole("button", { name: s.crashes.clear }));

    await waitFor(() => expect(screen.queryByText(s.crashes.title)).toBeNull());
    expect(pushToast).toHaveBeenCalledWith("success", s.crashes.cleared);
  });

  it("keeps the reports on screen when the clear fails", async () => {
    bridge.reply("list_crash_reports", [crash()]);
    bridge.reply("clear_crash_reports", new Error("file is locked"));
    render(<CrashReportsCard s={s} pushToast={pushToast} />);
    await screen.findByText(s.crashes.title);

    fireEvent.click(screen.getByRole("button", { name: s.crashes.clear }));

    await waitFor(() => expect(pushToast).toHaveBeenCalledWith("error", "Error: file is locked"));
    expect(screen.getByText(s.crashes.title)).toBeInTheDocument();
  });
});

describe("DriftWatchToggle", () => {
  /** The switch holds its "Applying…" state for half a second after the read
   *  (useBusyPresentation), so these two drive that timer explicitly. */
  async function settle() {
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(600);
    });
  }

  it("reflects the stored choice and flips it", async () => {
    vi.useFakeTimers();
    try {
      bridge.reply("drift_watch_enabled", false);
      bridge.reply("set_drift_watch", true);
      render(<DriftWatchToggle s={s} pushToast={pushToast} />);
      await settle();
      const toggle = screen.getByRole("button", { name: s.driftWatch.title });
      expect(toggle).toHaveAttribute("aria-pressed", "false");

      fireEvent.click(toggle);
      await settle();

      expect(bridge.argsOf("set_drift_watch")).toEqual({ enabled: true });
      expect(toggle).toHaveAttribute("aria-pressed", "true");
    } finally {
      vi.useRealTimers();
    }
  });

  it("leaves the switch where it was when the write fails", async () => {
    vi.useFakeTimers();
    try {
      bridge.reply("drift_watch_enabled", true);
      bridge.reply("set_drift_watch", new Error("the scheduled task is gone"));
      render(<DriftWatchToggle s={s} pushToast={pushToast} />);
      await settle();
      const toggle = screen.getByRole("button", { name: s.driftWatch.title });
      expect(toggle).toHaveAttribute("aria-pressed", "true");

      fireEvent.click(toggle);
      await settle();

      expect(toggle).toHaveAttribute("aria-pressed", "true");
      expect(bridge.callsTo("set_drift_watch")).toHaveLength(1);
      expect(pushToast).toHaveBeenCalledWith("error", "Error: the scheduled task is gone");
    } finally {
      vi.useRealTimers();
    }
  });
});
