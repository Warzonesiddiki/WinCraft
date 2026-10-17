import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { TweakInfo } from "../types";
import { CommandDeckHero } from "./command-deck-hero";

vi.mock("@tauri-apps/api/core", async () => (await import("../test-bridge")).coreModule());
vi.mock("@tauri-apps/plugin-dialog", async () => (await import("../test-bridge")).dialogModule());

const { bridge, setDialog } = await import("../test-bridge");
const onRefresh = vi.fn();

const tweaks = [
  {
    id: "svchost_split_threshold",
    name: "SvcHost process grouping",
    description: "",
    category: "performance",
    hive: "HKLM",
    requires_admin: true,
    requires_pro: false,
    applied: false,
    changes: [],
  },
] as TweakInfo[];

beforeEach(() => {
  bridge.reset();
  onRefresh.mockReset();
});
afterEach(cleanup);

describe("CommandDeckHero", () => {
  it("makes no changes when the user declines the review", async () => {
    setDialog("ask", false);
    render(<CommandDeckHero tweaks={tweaks} onRefresh={onRefresh} />);

    fireEvent.click(screen.getByRole("button", { name: "Apply Lightweight Profile" }));

    expect(await screen.findByText("No changes were made.")).toBeInTheDocument();
    expect(bridge.callsTo("record_barebone_consent")).toHaveLength(0);
    expect(bridge.callsTo("disable_all_barebone_tasks")).toHaveLength(0);
    expect(bridge.callsTo("apply_tweaks")).toHaveLength(0);
  });

  it("records batch consent before applying and reports successful completion", async () => {
    setDialog("ask", true);
    bridge.reply("record_barebone_consent", undefined);
    bridge.reply("disable_all_barebone_tasks", {
      restorePoint: { kind: "created" },
      total: 40,
      modified: 4,
      failed: 0,
      failedTasks: [],
      unavailableTasks: [],
      executionError: null,
    });
    bridge.reply("apply_tweaks", []);
    render(<CommandDeckHero tweaks={tweaks} onRefresh={onRefresh} />);

    fireEvent.click(screen.getByRole("button", { name: "Apply Lightweight Profile" }));

    await waitFor(() => expect(bridge.callsTo("apply_tweaks")).toHaveLength(1));
    expect(bridge.argsOf("record_barebone_consent")).toEqual({
      id: "barebone_tasks_batch",
      text: "I reviewed the Windows 11 profile warning and consent to its scheduled-task batch.",
    });
    expect(
      bridge.calls().findIndex((call) => call.command === "record_barebone_consent"),
    ).toBeLessThan(
      bridge.calls().findIndex((call) => call.command === "disable_all_barebone_tasks"),
    );
    expect(await screen.findByText(/Profile applied/)).toBeInTheDocument();
    expect(onRefresh).toHaveBeenCalled();
  });

  it("reports partial tweak failures returned by the profile batch", async () => {
    setDialog("ask", true);
    bridge.reply("record_barebone_consent", undefined);
    bridge.reply("disable_all_barebone_tasks", {
      restorePoint: { kind: "created" },
      total: 40,
      modified: 4,
      failed: 0,
      failedTasks: [],
      unavailableTasks: [],
      executionError: null,
    });
    bridge.reply("apply_tweaks", ["svchost_split_threshold: rollback snapshot retained"]);
    render(<CommandDeckHero tweaks={tweaks} onRefresh={onRefresh} />);

    fireEvent.click(screen.getByRole("button", { name: "Apply Lightweight Profile" }));

    const partialStatus = await screen.findByText(/only partially applied/i);
    expect(partialStatus).toHaveTextContent("svchost_split_threshold: rollback snapshot retained");
    expect(partialStatus).toHaveTextContent("Other changes may have succeeded");
    expect(screen.queryByText(/Profile applied/)).not.toBeInTheDocument();
    expect(onRefresh).toHaveBeenCalled();
  });

  it("reports rollback failures returned by the tweak batch", async () => {
    bridge.reply("rollback_all_barebone_tasks", {
      restorePoint: { kind: "created" },
      total: 40,
      modified: 0,
      failed: 0,
      failedTasks: [],
      unavailableTasks: [],
      executionError: null,
    });
    bridge.reply("rollback_tweaks", ["svchost_split_threshold: external drift preserved"]);
    render(<CommandDeckHero tweaks={tweaks} onRefresh={onRefresh} />);

    fireEvent.click(screen.getByRole("button", { name: "Restore Profile Changes" }));

    const partialStatus = await screen.findByText(/Profile restore was partial/i);
    expect(partialStatus).toHaveTextContent("tweak rollback");
    expect(partialStatus).toHaveTextContent("svchost_split_threshold: external drift preserved");
    expect(onRefresh).toHaveBeenCalled();
  });

  it("stops when an allowlisted task state cannot be verified", async () => {
    setDialog("ask", true);
    bridge.reply("record_barebone_consent", undefined);
    bridge.reply("disable_all_barebone_tasks", {
      restorePoint: { kind: "created" },
      total: 40,
      modified: 0,
      failed: 0,
      failedTasks: [],
      unavailableTasks: ["\\Microsoft\\Windows\\Maps\\MapsUpdateTask"],
      executionError: null,
    });
    render(<CommandDeckHero tweaks={tweaks} onRefresh={onRefresh} />);

    fireEvent.click(screen.getByRole("button", { name: "Apply Lightweight Profile" }));

    const partialStatus = await screen.findByText(/scheduled-task changes were partial/i);
    expect(partialStatus).toHaveTextContent("Could not verify MapsUpdateTask");
    expect(bridge.callsTo("apply_tweaks")).toHaveLength(0);
  });

  it("stops after a partial task result instead of claiming the profile was applied", async () => {
    setDialog("ask", true);
    bridge.reply("record_barebone_consent", undefined);
    bridge.reply("disable_all_barebone_tasks", {
      restorePoint: { kind: "created" },
      total: 40,
      modified: 2,
      failed: 1,
      failedTasks: ["\\Microsoft\\Windows\\Task Scheduler\\Example"],
      unavailableTasks: ["\\Microsoft\\Windows\\Maps\\MapsUpdateTask"],
      executionError: "The administrator request was cancelled.",
    });
    render(<CommandDeckHero tweaks={tweaks} onRefresh={onRefresh} />);

    fireEvent.click(screen.getByRole("button", { name: "Apply Lightweight Profile" }));

    const partialStatus = await screen.findByText(/scheduled-task changes were partial/i);
    expect(partialStatus).toHaveTextContent("Example");
    expect(partialStatus).toHaveTextContent("The administrator request was cancelled.");
    expect(partialStatus).toHaveTextContent("Could not verify MapsUpdateTask");
    expect(bridge.callsTo("apply_tweaks")).toHaveLength(0);
    expect(onRefresh).toHaveBeenCalled();
  });
});
