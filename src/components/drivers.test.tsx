import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import { STRINGS, format } from "../i18n";
import type { DriverAudit, DriverEntry, InstallOutcome, UpdateSearchResult } from "../types";
import { HardwarePanel } from "./hardware";

vi.mock("@tauri-apps/api/core", async () => (await import("../test-bridge")).coreModule());
vi.mock("@tauri-apps/api/event", async () => (await import("../test-bridge")).eventModule());
vi.mock("@tauri-apps/plugin-opener", async () => (await import("../test-bridge")).openerModule());
// The hardware section mounts the thermo panels, the latency tracer, the
// promo card and the booster card alongside the driver list. Those have their
// own reads and their own suites; here they are only noise, so the driver list
// gets a quiet stage.
vi.mock("./diagnostics", () => ({ LatencyTracePanel: () => null }));
vi.mock("./tweaky-driver-promo", () => ({ TweakyDriverPromoCard: () => null }));
vi.mock("./pro", () => ({ DriverBoosterCard: () => null }));

const { bridge } = await import("../test-bridge");
const { openUrl } = await import("@tauri-apps/plugin-opener");
const { DriversPanel } = await import("./hardware");

/** The spy `openUrl` really is, without the module's declared signature. */
const openUrlMock = openUrl as unknown as Mock;

const s = STRINGS.en;
const pushToast = vi.fn();

/**
 * The audit is cached at module scope and seeded from localStorage, and the
 * panel deliberately never scans on its own. Both facts matter to these tests:
 * the cache is cleared before each one so "shows the last scan" means what it
 * says, and a test that wants a scan has to click Rescan, exactly as a user
 * would.
 */
beforeEach(() => {
  bridge.reset();
  pushToast.mockReset();
  localStorage.clear();
  sessionStorage.clear();
});
afterEach(cleanup);

const entry = (extra: Partial<DriverEntry> = {}): DriverEntry => ({
  device: "NVIDIA High Definition Audio",
  version: "1.4.0.1",
  date: "2019-03-02",
  age_days: 2600,
  class: "Media",
  provider: "NVIDIA",
  tier: "stale",
  vendor_url: "https://www.nvidia.com/drivers",
  important: false,
  ...extra,
});

const audit = (
  entries: DriverEntry[] = [entry()],
  extra: Partial<DriverAudit> = {},
): DriverAudit => ({
  entries,
  excluded_inbox: 12,
  total_scanned: 48,
  classes_scanned: 14,
  ...extra,
});

const searchResult = (extra: Partial<UpdateSearchResult> = {}): UpdateSearchResult => ({
  updates: [
    { title: "Realtek - Audio - 6.0.9", size_mb: 12 },
    { title: "Intel - System - 10.1", size_mb: null },
  ],
  error: null,
  ...extra,
});

/** Mounts the panel with the reads its mount path makes already queued. */
async function mount(rebootPending = false) {
  bridge.reply("reboot_pending", rebootPending);
  const view = render(<DriversPanel s={s} pushToast={pushToast} />);
  await act(async () => {});
  return view;
}

describe("DriversPanel", () => {
  it("never scans on its own, and says why there is nothing yet", async () => {
    await mount();
    // A sixteen-second device walk is not something opening a screen should
    // start by itself.
    expect(bridge.callsTo("driver_audit")).toHaveLength(0);
    expect(screen.getByText(s.hardware.driversNoUpdateCheck)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: s.hardware.driversRescan }));
    expect(bridge.callsTo("driver_audit")).toHaveLength(1);
  });

  it("tracks the scan by the class it is reading, not by a timer", async () => {
    await mount();
    bridge.hold("driver_audit");
    fireEvent.click(screen.getByRole("button", { name: s.hardware.driversRescan }));

    expect(screen.getByText(s.hardware.scanStarting)).toBeInTheDocument();

    // Real progress from the Rust side: which class, and where that sits.
    await act(async () => {
      bridge.emit("driver-scan-progress", { done: 3, total: 12, class: "Display" });
    });
    expect(
      screen.getByText(format(s.hardware.scanReading, { class: "Display" })),
    ).toBeInTheDocument();
    expect(
      screen.getByText(format(s.hardware.scanCount, { done: "3", total: "12", pct: "25" })),
    ).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "25");

    bridge.reply("driver_audit", audit());
    bridge.release("driver_audit");
    await screen.findByText(s.hardware.driversCounted.replace("{count}", "1"));
  });

  it("counts what it found, and flags only the tiers that earned it", async () => {
    await mount();
    bridge.reply(
      "driver_audit",
      audit([entry(), entry({ tier: "current", device: "Intel Wi-Fi" })]),
    );
    fireEvent.click(screen.getByRole("button", { name: s.hardware.driversRescan }));

    await screen.findByText(format(s.hardware.driversCounted, { count: "2" }));
    expect(
      screen.getByText(format(s.hardware.driversScannedAll, { total: "48", classes: "14" })),
    ).toBeInTheDocument();
    expect(screen.getByText(format(s.hardware.driversStale, { count: "1" }))).toBeInTheDocument();
    // Nothing is aging, so that badge is absent rather than reading zero.
    expect(
      screen.queryByText(format(s.hardware.driversAging, { count: "0" })),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(s.hardware.driversAllCurrent)).not.toBeInTheDocument();
  });

  it("says all recent only when every entry really is", async () => {
    await mount();
    bridge.reply("driver_audit", audit([entry({ tier: "current", age_days: 40 })]));
    fireEvent.click(screen.getByRole("button", { name: s.hardware.driversRescan }));
    expect(await screen.findByText(s.hardware.driversAllCurrent)).toBeInTheDocument();
  });

  it("breaks the list after six classes and offers the rest", async () => {
    const many = Array.from({ length: 9 }, (_, i) => entry({ device: `Device ${String(i)}` }));
    await mount();
    bridge.reply("driver_audit", audit(many));
    fireEvent.click(screen.getByRole("button", { name: s.hardware.driversRescan }));

    await screen.findByText("Device 0");
    expect(screen.getByText("Device 5")).toBeInTheDocument();
    expect(screen.queryByText("Device 6")).not.toBeInTheDocument();

    const more = screen.getByRole("button", {
      name: format(s.hardware.driversShowAll, { count: "3" }),
    });
    fireEvent.click(more);
    expect(screen.getByText("Device 8")).toBeInTheDocument();
    // Collapsing is the same control, so it has to change its promise.
    fireEvent.click(screen.getByRole("button", { name: s.hardware.driversShowLess }));
    expect(screen.queryByText("Device 8")).not.toBeInTheDocument();
  });

  it("searches device, provider and class, and says so when nothing matches", async () => {
    await mount();
    bridge.reply(
      "driver_audit",
      audit([entry(), entry({ device: "Intel Wi-Fi 6", provider: "Intel", class: "Net" })]),
    );
    fireEvent.click(screen.getByRole("button", { name: s.hardware.driversRescan }));
    await screen.findByText("NVIDIA High Definition Audio");

    const box = screen.getByRole("searchbox");
    fireEvent.change(box, { target: { value: "intel" } });
    expect(screen.getByText("Intel Wi-Fi 6")).toBeInTheDocument();
    expect(screen.queryByText("NVIDIA High Definition Audio")).not.toBeInTheDocument();

    // A search looks at the provider too, not only the device name.
    fireEvent.change(box, { target: { value: "nvidia" } });
    expect(screen.getByText("NVIDIA High Definition Audio")).toBeInTheDocument();

    fireEvent.change(box, { target: { value: "no such device" } });
    expect(
      screen.getByText(format(s.search.noResults, { query: "no such device" })),
    ).toBeInTheDocument();
  });

  it("prints the driver's age in the unit that reads correctly", async () => {
    await mount();
    bridge.reply(
      "driver_audit",
      audit([
        entry({ device: "Two years", age_days: 730 }),
        entry({ device: "One year", age_days: 366 }),
        entry({ device: "One month", age_days: 33 }),
      ]),
    );
    fireEvent.click(screen.getByRole("button", { name: s.hardware.driversRescan }));

    await screen.findByText("Two years");
    // "1 months" on a driver installed last month reads as a bug even though
    // the arithmetic is right, so the singular forms exist.
    expect(screen.getByText(format(s.hardware.ageYears, { years: "2" }))).toBeInTheDocument();
    expect(screen.getByText(format(s.hardware.ageYear, { years: "1" }))).toBeInTheDocument();
    expect(screen.getByText(format(s.hardware.ageMonth, { months: "1" }))).toBeInTheDocument();
  });

  it("hands over the vendor page only for rows that have one", async () => {
    openUrlMock.mockClear();
    await mount();
    bridge.reply("driver_audit", audit([entry(), entry({ device: "No page", vendor_url: null })]));
    fireEvent.click(screen.getByRole("button", { name: s.hardware.driversRescan }));

    await screen.findByText("NVIDIA High Definition Audio");
    const sites = screen.getAllByRole("button", { name: s.hardware.vendorSite });
    expect(sites).toHaveLength(1);

    fireEvent.click(sites[0] as HTMLElement);
    await waitFor(() => expect(openUrlMock).toHaveBeenCalledWith("https://www.nvidia.com/drivers"));
  });

  it("keeps a failed scan visible and does not pretend it found nothing", async () => {
    await mount();
    bridge.reply("driver_audit", new Error("the device walk failed"));
    fireEvent.click(screen.getByRole("button", { name: s.hardware.driversRescan }));

    expect(await screen.findByRole("alert")).toHaveTextContent("the device walk failed");
    expect(screen.queryByText(s.hardware.driversNone)).not.toBeInTheDocument();
    // Still clickable: a failed scan is exactly when someone retries.
    expect(screen.getByRole("button", { name: s.hardware.driversRescan })).toBeEnabled();
  });

  it("shows the pending restart Windows reported, and can dismiss it", async () => {
    await mount(true);
    expect(await screen.findByText(s.hardware.rebootTitle)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: s.hardware.rebootLater }));
    expect(screen.queryByText(s.hardware.rebootTitle)).not.toBeInTheDocument();
    // Dismissing is a UI decision; it must not restart anything.
    expect(bridge.callsTo("reboot_now")).toHaveLength(0);
  });

  it("restarts only when asked, and toasts if Windows refuses", async () => {
    await mount(true);
    await screen.findByText(s.hardware.rebootTitle);

    bridge.reply("reboot_now", new Error("reboot was refused"));
    fireEvent.click(screen.getByRole("button", { name: s.hardware.rebootNow }));
    await waitFor(() =>
      expect(pushToast).toHaveBeenCalledWith("error", "Error: reboot was refused"),
    );
  });

  it("shows no restart banner when Windows reports none pending", async () => {
    await mount(false);
    expect(screen.queryByText(s.hardware.rebootTitle)).not.toBeInTheDocument();
    // Windows only sets the flag once an install finishes, so regaining focus
    // is what catches one the user ran while they were away.
    expect(bridge.callsTo("reboot_pending")).toHaveLength(1);
    await act(async () => {
      window.dispatchEvent(new Event("focus"));
    });
    expect(bridge.callsTo("reboot_pending")).toHaveLength(2);
  });
});

describe("the Windows Update section", () => {
  /** Mounts with a completed audit, so the update controls are on screen. */
  async function withAudit() {
    await mount();
    bridge.reply("driver_audit", audit());
    fireEvent.click(screen.getByRole("button", { name: s.hardware.driversRescan }));
    await screen.findByText("NVIDIA High Definition Audio");
  }

  it("offers nothing to install until a search has found something", async () => {
    await withAudit();
    expect(screen.queryByRole("button", { name: /Install/ })).not.toBeInTheDocument();
  });

  it("searches, checks every result, and installs the checked titles", async () => {
    await withAudit();
    bridge.hold("search_driver_updates");
    bridge.reply("search_driver_updates", searchResult());
    fireEvent.click(screen.getByRole("button", { name: s.hardware.winUpdateButton }));

    // A real catalogue round trip takes 30-90 seconds, so the button explains
    // itself instead of going dim and silent.
    expect(screen.getByText(s.hardware.winUpdateSearching)).toBeInTheDocument();
    expect(screen.getByText(s.hardware.winUpdateTakesAWhile)).toBeInTheDocument();

    bridge.release("search_driver_updates");
    await screen.findByText("Realtek - Audio - 6.0.9");
    // Every result starts checked: "install all" is the default action.
    const boxes = screen.getAllByRole("checkbox") as HTMLInputElement[];
    expect(boxes).toHaveLength(2);
    expect(boxes.every((b) => b.checked)).toBe(true);
    expect(
      screen.getByRole("button", { name: format(s.hardware.winUpdateInstall, { count: "2" }) }),
    ).toBeInTheDocument();

    // Unchecking one is how you get the subset, without a second flow.
    fireEvent.click(boxes[1] as HTMLInputElement);
    expect(
      screen.getByRole("button", { name: format(s.hardware.winUpdateInstall, { count: "1" }) }),
    ).toBeInTheDocument();

    bridge.reply("install_driver_updates", {
      installed: 1,
      failed: 0,
      reboot_required: false,
    } satisfies InstallOutcome);
    fireEvent.click(
      screen.getByRole("button", { name: format(s.hardware.winUpdateInstall, { count: "1" }) }),
    );

    await screen.findByText(format(s.hardware.winUpdateDone, { installed: "1", failed: "0" }));
    expect(bridge.argsOf("install_driver_updates")).toEqual({
      titles: ["Realtek - Audio - 6.0.9"],
    });
    // The list is gone: there is nothing left to tick.
    expect(screen.queryByText("Realtek - Audio - 6.0.9")).not.toBeInTheDocument();
  });

  it("selects and deselects the whole list, but only when there is more than one row", async () => {
    await withAudit();
    bridge.reply("search_driver_updates", searchResult());
    fireEvent.click(screen.getByRole("button", { name: s.hardware.winUpdateButton }));
    await screen.findByText("Realtek - Audio - 6.0.9");

    fireEvent.click(screen.getByRole("button", { name: s.scan.deselectAll }));
    expect((screen.getAllByRole("checkbox") as HTMLInputElement[]).some((b) => b.checked)).toBe(
      false,
    );
    // With nothing ticked there is nothing to install, so the button is out.
    expect(screen.getByRole("button", { name: s.scan.selectAll })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: s.scan.selectAll }));
    expect((screen.getAllByRole("checkbox") as HTMLInputElement[]).every((b) => b.checked)).toBe(
      true,
    );
  });

  it("raises the restart banner when an install says Windows needs one", async () => {
    await withAudit();
    bridge.reply("search_driver_updates", searchResult());
    fireEvent.click(screen.getByRole("button", { name: s.hardware.winUpdateButton }));
    await screen.findByText("Realtek - Audio - 6.0.9");

    bridge.reply("install_driver_updates", { installed: 2, failed: 0, reboot_required: true });
    fireEvent.click(
      screen.getByRole("button", { name: format(s.hardware.winUpdateInstall, { count: "2" }) }),
    );

    expect(await screen.findByText(s.hardware.rebootTitle)).toBeInTheDocument();
  });

  it("separates a search that failed from one that found nothing", async () => {
    await withAudit();

    // Found nothing: not good news, just what the catalogue happened to have.
    bridge.reply("search_driver_updates", searchResult({ updates: [] }));
    fireEvent.click(screen.getByRole("button", { name: s.hardware.winUpdateButton }));
    expect(await screen.findByText(s.hardware.winUpdateNone)).toBeInTheDocument();

    // Failed: says so with the reason Windows gave.
    bridge.reply(
      "search_driver_updates",
      searchResult({ updates: [], error: "the update service is not running" }),
    );
    fireEvent.click(screen.getByRole("button", { name: s.hardware.winUpdateButton }));
    expect(
      await screen.findByText(
        format(s.hardware.winUpdateFailed, { detail: "the update service is not running" }),
      ),
    ).toBeInTheDocument();
  });

  it("toasts when the search itself cannot be started", async () => {
    await withAudit();
    bridge.reply("search_driver_updates", new Error("WUA is unavailable"));
    fireEvent.click(screen.getByRole("button", { name: s.hardware.winUpdateButton }));
    await waitFor(() =>
      expect(pushToast).toHaveBeenCalledWith("error", "Error: WUA is unavailable"),
    );
    // The button comes back, so the user can try again.
    expect(screen.getByRole("button", { name: s.hardware.winUpdateButton })).toBeEnabled();
  });

  it("keeps the inbox-driver note reachable instead of burying it in the count", async () => {
    await withAudit();
    // ToolDetails is a native <details>, so the summary is the control.
    fireEvent.click(screen.getByText(s.healthPanel.showMore));
    expect(
      screen.getByText(format(s.hardware.driversInboxNote, { count: "12" })),
    ).toBeInTheDocument();
  });
});

describe("HardwarePanel", () => {
  it("paints the heading first and mounts the instruments a frame later", async () => {
    bridge.reply("reboot_pending", false);
    const { container } = render(<HardwarePanel s={s} pushToast={pushToast} />);

    // The click must not wait for two panels' worth of IPC and layout.
    expect(screen.getByText(s.hardware.intro)).toBeInTheDocument();
    expect(screen.queryByText(s.hardware.driversRescan)).not.toBeInTheDocument();
    expect(container.querySelector(".skeleton")).not.toBeNull();

    await act(async () => {
      await new Promise((done) => setTimeout(done, 0));
    });
    await act(async () => {
      await new Promise((done) => setTimeout(done, 0));
    });
    expect(
      await screen.findByRole("button", { name: s.hardware.driversRescan }),
    ).toBeInTheDocument();
  });
});

describe("accessibility", () => {
  it("has no axe violations on a finished audit", async () => {
    vi.useRealTimers();
    bridge.reply("reboot_pending", false);
    const { container } = render(<DriversPanel s={s} pushToast={pushToast} />);
    bridge.reply("driver_audit", audit());
    fireEvent.click(screen.getByRole("button", { name: s.hardware.driversRescan }));
    await screen.findByText("NVIDIA High Definition Audio");
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
