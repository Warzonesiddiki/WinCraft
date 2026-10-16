import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AdvancedControlCard } from "./advanced-controls";
import { ADVANCED_COPY } from "./advanced-copy";
import { STRINGS } from "../i18n-tables";
import { format } from "../i18n";

vi.mock("@tauri-apps/api/core", async () => (await import("../test-bridge")).coreModule());
vi.mock("@tauri-apps/api/event", async () => (await import("../test-bridge")).eventModule());
vi.mock("@tauri-apps/plugin-dialog", async () => (await import("../test-bridge")).dialogModule());

const { bridge, setDialog, resetDialogs } = await import("../test-bridge");
const c = ADVANCED_COPY.en;
const s = STRINGS.en;

describe("AdvancedControlCard - ecoqos_rules", () => {
  beforeEach(() => bridge.reset());
  afterEach(() => {
    cleanup();
    resetDialogs();
    vi.restoreAllMocks();
  });

  const dummyEcoState = {
    enabled: true,
    blocked_global: false,
    paused: false,
    engine_running: true,
    active_processes: 2,
    pending_restore: 0,
    rules: [{ path: "C:\\apps\\worker.exe", name: "worker.exe" }],
  };

  const dummyPriorityState = {
    enabled: true,
    engineRunning: true,
    paused: false,
    rules: [
      {
        path: "C:\\games\\game.exe",
        name: "game.exe",
        priority: "above_normal" as const,
      },
    ],
    activeProcesses: 1,
    pendingRestore: 0,
    lastError: null,
  };

  it("renders EcoQoS and Priority Rules cards and toggles EcoQoS", async () => {
    const onChanged = vi.fn().mockResolvedValue(undefined);
    bridge.reply("ecoqos_status", dummyEcoState);
    bridge.reply("priority_rules_status", dummyPriorityState);
    bridge.reply("ecoqos_set_enabled", { ...dummyEcoState, enabled: false });
    bridge.reply("ecoqos_status", { ...dummyEcoState, enabled: false });

    render(<AdvancedControlCard id="ecoqos_rules" lang="en" onChanged={onChanged} />);

    await waitFor(() => {
      expect(screen.getByText(c.ecoTitle)).toBeInTheDocument();
      expect(screen.getByText(s.priorityRules.title)).toBeInTheDocument();
      expect(screen.getByText("worker.exe")).toBeInTheDocument();
      expect(screen.getByText("game.exe")).toBeInTheDocument();
    });

    const ecoToggle = screen.getByRole("button", { name: c.ecoTitle });
    await waitFor(() => {
      expect(ecoToggle).not.toBeDisabled();
    });

    await act(async () => {
      fireEvent.click(ecoToggle);
    });

    await waitFor(() => {
      expect(bridge.callsTo("ecoqos_set_enabled")).toHaveLength(1);
      expect(onChanged).toHaveBeenCalled();
    });
  });

  it("adds and removes an EcoQoS rule", async () => {
    const onChanged = vi.fn().mockResolvedValue(undefined);
    bridge.reply("ecoqos_status", dummyEcoState);
    bridge.reply("priority_rules_status", dummyPriorityState);

    setDialog("open", "C:\\newapp\\tool.exe");
    bridge.reply("ecoqos_add_rule", {
      ...dummyEcoState,
      rules: [...dummyEcoState.rules, { path: "C:\\newapp\\tool.exe", name: "tool.exe" }],
    });
    bridge.reply("ecoqos_status", {
      ...dummyEcoState,
      rules: [...dummyEcoState.rules, { path: "C:\\newapp\\tool.exe", name: "tool.exe" }],
    });

    render(<AdvancedControlCard id="ecoqos_rules" lang="en" onChanged={onChanged} />);

    await waitFor(() => {
      expect(screen.getByText("worker.exe")).toBeInTheDocument();
    });

    const chooseBtn = screen.getByRole("button", { name: c.ecoAdd });
    await act(async () => {
      fireEvent.click(chooseBtn);
    });

    await waitFor(() => {
      expect(bridge.callsTo("ecoqos_add_rule")).toHaveLength(1);
    });

    // Remove rule
    bridge.reply("ecoqos_remove_rule", dummyEcoState);
    bridge.reply("ecoqos_status", dummyEcoState);

    const removeBtn = screen.getByRole("button", { name: `${c.remove}: worker.exe` });
    await act(async () => {
      fireEvent.click(removeBtn);
    });

    await waitFor(() => {
      expect(bridge.callsTo("ecoqos_remove_rule")).toHaveLength(1);
    });
  });

  it("adds, changes priority and removes a priority rule", async () => {
    const onChanged = vi.fn().mockResolvedValue(undefined);
    bridge.reply("ecoqos_status", dummyEcoState);
    bridge.reply("priority_rules_status", dummyPriorityState);

    setDialog("open", "C:\\newapp\\task.exe");
    bridge.reply("priority_rules_add", undefined);
    bridge.reply("priority_rules_status", {
      ...dummyPriorityState,
      rules: [
        ...dummyPriorityState.rules,
        { path: "C:\\newapp\\task.exe", name: "task.exe", priority: "above_normal" },
      ],
    });

    render(<AdvancedControlCard id="ecoqos_rules" lang="en" onChanged={onChanged} />);

    await waitFor(() => {
      expect(screen.getByText("game.exe")).toBeInTheDocument();
    });

    const addRuleBtn = screen.getByRole("button", { name: c.priorityAdd });
    await act(async () => {
      fireEvent.click(addRuleBtn);
    });

    await waitFor(() => {
      expect(bridge.callsTo("priority_rules_add")).toHaveLength(1);
    });

    // Change priority level
    bridge.reply("priority_rules_set_priority", undefined);
    bridge.reply("priority_rules_status", dummyPriorityState);

    const select = screen.getByRole("combobox", {
      name: format(s.priorityRules.levelLabel, { name: "game.exe" }),
    });
    await act(async () => {
      fireEvent.change(select, { target: { value: "high" } });
    });

    await waitFor(() => {
      expect(bridge.callsTo("priority_rules_set_priority")).toHaveLength(1);
    });

    // Remove priority rule
    bridge.reply("priority_rules_remove", undefined);
    bridge.reply("priority_rules_status", { ...dummyPriorityState, rules: [] });

    const removeBtn = screen.getByRole("button", { name: `${s.priorityRules.remove}: game.exe` });
    await act(async () => {
      fireEvent.click(removeBtn);
    });

    await waitFor(() => {
      expect(bridge.callsTo("priority_rules_remove")).toHaveLength(1);
    });
  });
});

describe("AdvancedControlCard - limit_do_background_download", () => {
  beforeEach(() => bridge.reset());
  afterEach(() => {
    cleanup();
    resetDialogs();
    vi.restoreAllMocks();
  });

  const dummyDownloadState = {
    supported: true,
    configuredKbps: 5000,
    applied: false,
    provider: "Delivery Optimization",
    conflict: null,
  };

  it("renders download limit facts and handles save and restore", async () => {
    const onChanged = vi.fn().mockResolvedValue(undefined);
    bridge.reply("download_limit_state", dummyDownloadState);

    render(
      <AdvancedControlCard id="limit_do_background_download" lang="en" onChanged={onChanged} />,
    );

    await waitFor(() => {
      expect(screen.getByText(c.doTitle)).toBeInTheDocument();
      expect(screen.getByText(/5000 KB\/s/)).toBeInTheDocument();
      expect(screen.getByText(new RegExp(`^${c.doProvider}`))).toBeInTheDocument();
    });

    // Save download limit
    bridge.reply("set_download_limit", {
      ...dummyDownloadState,
      configuredKbps: 8000,
      applied: true,
    });
    bridge.reply("download_limit_state", {
      ...dummyDownloadState,
      configuredKbps: 8000,
      applied: true,
    });

    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: "8000" } });

    const saveBtn = screen.getByRole("button", { name: c.doSave });
    await act(async () => {
      fireEvent.click(saveBtn);
    });

    await waitFor(() => {
      expect(bridge.callsTo("set_download_limit")).toHaveLength(1);
    });

    // Restore download limit
    bridge.reply("restore_download_limit", {
      ...dummyDownloadState,
      applied: false,
      configuredKbps: null,
    });
    bridge.reply("download_limit_state", {
      ...dummyDownloadState,
      applied: false,
      configuredKbps: null,
    });

    const restoreBtn = screen.getByRole("button", { name: c.doRestore });
    await act(async () => {
      fireEvent.click(restoreBtn);
    });

    await waitFor(() => {
      expect(bridge.callsTo("restore_download_limit")).toHaveLength(1);
    });
  });

  it("renders conflict and unsupported warnings when present", async () => {
    const onChanged = vi.fn().mockResolvedValue(undefined);
    bridge.reply("download_limit_state", {
      supported: false,
      configuredKbps: null,
      applied: false,
      provider: "Group Policy",
      conflict: "Group Policy is enforcing a 1000 KB/s limit",
    });

    render(
      <AdvancedControlCard id="limit_do_background_download" lang="en" onChanged={onChanged} />,
    );

    await waitFor(() => {
      expect(screen.getByText(c.doUnsupported)).toBeInTheDocument();
      expect(screen.getByText("Group Policy is enforcing a 1000 KB/s limit")).toBeInTheDocument();
    });
  });
});

describe("AdvancedControlCard - monitor_refresh_profile", () => {
  beforeEach(() => bridge.reset());
  afterEach(() => {
    cleanup();
    resetDialogs();
    vi.restoreAllMocks();
  });

  const dummyMonitorState = {
    enabled: true,
    active: true,
    displays: [
      {
        id: "display-1",
        name: "Main Monitor",
        supported: true,
        current_hz: 144,
        frequencies: [60, 120, 144],
      },
    ],
    pending_confirmation: false,
    revert_hz: null,
    deadline_ms: null,
    rules: [],
  };

  it("renders monitor display controls and handles preview", async () => {
    const onChanged = vi.fn().mockResolvedValue(undefined);
    bridge.reply("monitor_profiles_state", dummyMonitorState);

    render(<AdvancedControlCard id="monitor_refresh_profile" lang="en" onChanged={onChanged} />);

    await waitFor(() => {
      expect(screen.getByText(c.monitorTitle)).toBeInTheDocument();
      expect(screen.getByText("Main Monitor · 144 Hz")).toBeInTheDocument();
    });

    bridge.reply("monitor_preview", undefined);
    bridge.reply("monitor_profiles_state", {
      ...dummyMonitorState,
      pending_confirmation: true,
      deadline_ms: Date.now() + 15000,
    });

    const previewBtn = screen.getByRole("button", { name: c.monitorPreview });
    await act(async () => {
      fireEvent.click(previewBtn);
    });

    expect(bridge.callsTo("monitor_preview")).toHaveLength(1);
  });

  it("confirms pending monitor change and toggles monitor enabled", async () => {
    const onChanged = vi.fn().mockResolvedValue(undefined);
    bridge.reply("monitor_profiles_state", {
      ...dummyMonitorState,
      pending_confirmation: true,
      deadline_ms: Date.now() + 15000,
    });

    render(<AdvancedControlCard id="monitor_refresh_profile" lang="en" onChanged={onChanged} />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: new RegExp(c.monitorConfirm) }),
      ).toBeInTheDocument();
    });

    bridge.reply("monitor_confirm", undefined);
    bridge.reply("monitor_profiles_state", dummyMonitorState);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: new RegExp(c.monitorConfirm) }));
    });

    expect(bridge.callsTo("monitor_confirm")).toHaveLength(1);

    // Wait for toggle button to not be disabled
    const toggle = screen.getByRole("button", { name: c.monitorTitle });
    await waitFor(() => {
      expect(toggle).not.toBeDisabled();
    });

    bridge.reply("monitor_set_enabled", undefined);
    bridge.reply("monitor_profiles_state", { ...dummyMonitorState, enabled: false });

    await act(async () => {
      fireEvent.click(toggle);
    });

    expect(bridge.callsTo("monitor_set_enabled")).toHaveLength(1);
  });
});
