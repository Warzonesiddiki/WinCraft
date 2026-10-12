import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import { STRINGS, format } from "../i18n";
import type { ScheduledTaskEntry, StartupEntry } from "../types";
import { ScheduledTaskManager, StartupManager } from "./startup";

vi.mock("@tauri-apps/api/core", async () => (await import("../test-bridge")).coreModule());
vi.mock("@tauri-apps/api/event", async () => (await import("../test-bridge")).eventModule());

const { bridge } = await import("../test-bridge");

const s = STRINGS.en;
const pushToast = vi.fn();

beforeEach(() => {
  bridge.reset();
  pushToast.mockReset();
});
afterEach(cleanup);

const entry = (extra: Partial<StartupEntry> = {}): StartupEntry => ({
  name: "OneDrive",
  command: "C:\\Program Files\\OneDrive\\OneDrive.exe /background",
  scope: "user",
  location: "run",
  enabled: true,
  requires_admin: false,
  orphaned: false,
  ...extra,
});

const task = (extra: Partial<ScheduledTaskEntry> = {}): ScheduledTaskEntry => ({
  name: "Adobe Acrobat Update",
  path: "\\Adobe Acrobat Update Task",
  command: '"C:\\Program Files\\Adobe\\Update.exe" /quiet',
  author: "Adobe Inc.",
  enabled: true,
  trigger: "logon",
  requires_admin: false,
  ...extra,
});

describe("StartupManager", () => {
  it("reads the list on mount and counts what is enabled", async () => {
    bridge.reply("list_startup_items", [
      entry(),
      entry({ name: "Steam", enabled: false, location: "run32" }),
    ]);
    render(<StartupManager s={s} pushToast={pushToast} />);

    expect(await screen.findByText("OneDrive")).toBeInTheDocument();
    expect(bridge.callsTo("list_startup_items")).toHaveLength(1);
    expect(
      screen.getByText(format(s.startupManager.activeCount, { enabled: 1, total: 2 })),
    ).toBeInTheDocument();
  });

  it("drops entries whose program is gone, and says how many it dropped", async () => {
    bridge.reply("list_startup_items", [
      entry(),
      entry({ name: "UninstalledApp", orphaned: true }),
    ]);
    render(<StartupManager s={s} pushToast={pushToast} />);

    await screen.findByText("OneDrive");
    expect(screen.queryByText("UninstalledApp")).toBeNull();
    expect(
      screen.getByText(format(s.startupManager.hiddenOrphans, { count: 1 })),
    ).toBeInTheDocument();
  });

  it("shows a shortcut without its extension but keeps the name it toggles", async () => {
    bridge.reply("list_startup_items", [
      entry({ name: "Discord.lnk", location: "folder", command: "%APPDATA%\\Discord.lnk" }),
    ]);
    render(<StartupManager s={s} pushToast={pushToast} />);

    expect(await screen.findByText("Discord")).toBeInTheDocument();
    expect(screen.queryByText("Discord.lnk")).toBeNull();
    // The switch is labelled with the real name, which is what the write needs.
    expect(screen.getByRole("button", { name: "Discord.lnk" })).toBeInTheDocument();
  });

  it("toggles the row it was clicked on, with every field the write needs", async () => {
    bridge.reply("list_startup_items", [entry()], [entry({ enabled: false })]);
    bridge.reply("set_startup_enabled", undefined);
    render(<StartupManager s={s} pushToast={pushToast} />);
    const toggle = await screen.findByRole("button", { name: "OneDrive" });

    fireEvent.click(toggle);

    await waitFor(() =>
      expect(bridge.argsOf("set_startup_enabled")).toEqual({
        scope: "user",
        location: "run",
        name: "OneDrive",
        enabled: false,
      }),
    );
    // The list is re-read, so the row shows what the registry now says.
    await waitFor(() => expect(bridge.callsTo("list_startup_items")).toHaveLength(2));
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(pushToast).not.toHaveBeenCalled();
  });

  it("keeps the busy state on one row when two entries share a name", async () => {
    // The same program in two of Windows' three startup locations: the key
    // carries the location, so only the clicked row goes busy.
    bridge.reply("list_startup_items", [
      entry({ name: "Teams", location: "run" }),
      entry({ name: "Teams", location: "folder", command: "%APPDATA%\\Teams.lnk" }),
    ]);
    bridge.reply("list_startup_items", [entry({ name: "Teams", location: "run", enabled: false })]);
    bridge.hold("set_startup_enabled");
    render(<StartupManager s={s} pushToast={pushToast} />);
    const rows = await screen.findAllByRole("button", { name: "Teams" });
    expect(rows).toHaveLength(2);

    fireEvent.click(rows[1]);

    await waitFor(() => expect(rows[1]).toBeDisabled());
    expect(rows[0]).toBeEnabled();
    bridge.release("set_startup_enabled");
  });

  it("says so when the write fails and leaves the switch alone", async () => {
    bridge.reply("list_startup_items", [entry()]);
    bridge.reply("set_startup_enabled", new Error("the value is protected"));
    render(<StartupManager s={s} pushToast={pushToast} />);
    const toggle = await screen.findByRole("button", { name: "OneDrive" });
    expect(toggle).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(toggle);

    await waitFor(() =>
      expect(pushToast).toHaveBeenCalledWith("error", "Error: the value is protected"),
    );
    expect(toggle).toHaveAttribute("aria-pressed", "true");
  });

  it("searches by name and command, and says when nothing matches", async () => {
    bridge.reply("list_startup_items", [
      entry(),
      entry({ name: "Steam", command: "C:\\Steam\\steam.exe -silent" }),
    ]);
    render(<StartupManager s={s} pushToast={pushToast} />);
    await screen.findByText("Steam");

    const search = screen.getByRole("searchbox");
    fireEvent.change(search, { target: { value: "steam.exe" } });
    expect(screen.getByText("Steam")).toBeInTheDocument();
    expect(screen.queryByText("OneDrive")).toBeNull();

    fireEvent.change(search, { target: { value: "nothing at all" } });
    expect(
      screen.getByText(format(s.search.noResults, { query: "nothing at all" })),
    ).toBeInTheDocument();
  });

  it("shows the empty state when everything is either gone or absent", async () => {
    bridge.reply("list_startup_items", [entry({ orphaned: true })]);
    render(<StartupManager s={s} pushToast={pushToast} />);

    expect(await screen.findByText(s.startupManager.empty)).toBeInTheDocument();
  });

  it("reports a failed read instead of an empty list", async () => {
    bridge.reply("list_startup_items", new Error("access denied"));
    render(<StartupManager s={s} pushToast={pushToast} />);

    await waitFor(() => expect(screen.getByText("Error: access denied")).toBeInTheDocument());
    expect(pushToast).toHaveBeenCalledWith("error", "Error: access denied");
    expect(screen.queryByText(s.startupManager.empty)).toBeNull();
  });

  it("has no detectable accessibility violations", async () => {
    bridge.reply("list_startup_items", [entry(), entry({ name: "Steam", location: "folder" })]);
    const { container } = render(<StartupManager s={s} pushToast={pushToast} />);
    await screen.findByText("Steam");

    expect((await axe(container)).violations).toEqual([]);
  });
});

describe("ScheduledTaskManager", () => {
  it("lists third-party tasks and toggles one by its path", async () => {
    bridge.reply("list_scheduled_tasks", [task()], [task({ enabled: false })]);
    bridge.reply("set_scheduled_task_enabled", undefined);
    render(<ScheduledTaskManager s={s} pushToast={pushToast} />);
    const toggle = await screen.findByRole("button", { name: task().name });

    fireEvent.click(toggle);

    // The switch is labelled by name but the write is keyed by task path.
    await waitFor(() =>
      expect(bridge.argsOf("set_scheduled_task_enabled")).toEqual({
        path: task().path,
        enabled: false,
      }),
    );
    await waitFor(() => expect(toggle).toHaveAttribute("aria-pressed", "false"));
  });

  it("reports a failed write", async () => {
    bridge.reply("list_scheduled_tasks", [task()]);
    bridge.reply("set_scheduled_task_enabled", new Error("administrator rights are required"));
    render(<ScheduledTaskManager s={s} pushToast={pushToast} />);
    const toggle = await screen.findByRole("button", { name: task().name });

    fireEvent.click(toggle);

    await waitFor(() =>
      expect(pushToast).toHaveBeenCalledWith("error", "Error: administrator rights are required"),
    );
  });

  it("has no detectable accessibility violations", async () => {
    bridge.reply("list_scheduled_tasks", [task(), task({ name: "Teams Update", path: "\\Teams" })]);
    const { container } = render(<ScheduledTaskManager s={s} pushToast={pushToast} />);
    await screen.findByText("Adobe Acrobat Update");

    expect((await axe(container)).violations).toEqual([]);
  });
});
