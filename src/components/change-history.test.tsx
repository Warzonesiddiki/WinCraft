import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { axe } from "jest-axe";
import { format } from "../i18n";
import { STRINGS } from "../i18n-tables";
import type { AuditEntry, TweakInfo, ValueChange } from "../types";
import type { RemovalRecord } from "../history-model";
import { ChangeHistory } from "./change-history";
import { HISTORY_COPY } from "./history-copy";

vi.mock("@tauri-apps/api/core", async () => (await import("../test-bridge")).coreModule());
vi.mock("@tauri-apps/api/event", async () => (await import("../test-bridge")).eventModule());
vi.mock("@tauri-apps/plugin-dialog", async () => (await import("../test-bridge")).dialogModule());

const { bridge, setDialog } = await import("../test-bridge");

const c = HISTORY_COPY.en;
const s = STRINGS.en;
const onChanged = vi.fn(async () => {});
const pushToast = vi.fn();

/** One session, so the day heading and the session count are exercised. */
const T1 = 1_760_000_000;
const T2 = T1 + 120;

beforeEach(() => {
  document.documentElement.lang = "en";
  bridge.reset();
  onChanged.mockReset();
  pushToast.mockReset();
});
afterEach(() => {
  cleanup();
  document.documentElement.lang = "";
});

const entry = (extra: Partial<AuditEntry> = {}): AuditEntry => ({
  ts: T1,
  action: "tweak-applied",
  target: "menu_show_delay",
  elevated: false,
  success: true,
  detail: null,
  ...extra,
});

const value = (extra: Partial<ValueChange> = {}): ValueChange => ({
  path: "HKCU\\Control Panel\\Desktop",
  name: "MenuShowDelay",
  before: "400",
  after: "0",
  ...extra,
});

const tweak = (extra: Partial<TweakInfo> = {}): TweakInfo => ({
  id: "menu_show_delay",
  name: "Menu show delay",
  description: "Removes the pause before a menu opens.",
  category: "performance",
  hive: "HKCU",
  requires_admin: false,
  requires_pro: false,
  applied: false,
  changes: [],
  ...extra,
});

/**
 * The panel the workspace mounts, with the three reads it makes on mount
 * answered. `active_changes` is what the comparison section is built from and
 * `list_tweaks` is read again after an undo, so both get a reply per call.
 */
async function mount({
  log = [] as AuditEntry[],
  removals = [] as RemovalRecord[],
  active = [] as { id: string; changes: ValueChange[] }[],
  tweaks = [] as TweakInfo[],
  hold = false,
} = {}) {
  bridge.reply("list_audit_log", log);
  bridge.reply("debloat_history", removals);
  bridge.reply("active_changes", active);
  if (hold) bridge.hold("list_audit_log");
  const view = render(
    <ChangeHistory s={s} lang="en" tweaks={tweaks} onChanged={onChanged} pushToast={pushToast} />,
  );
  if (!hold) await act(async () => {});
  return view;
}

const rows = () =>
  [...document.querySelectorAll(".workspace-ledger-event")].map((el) => el.textContent ?? "");

describe("Change history", () => {
  it("says it is reading before it has anything to show", async () => {
    const { container } = await mount({ hold: true });

    expect(within(container).getByRole("status")).toHaveTextContent(s.scheduledTasks.refreshing);
    expect(container.querySelector(".workspace-ledger")).toHaveAttribute("aria-busy", "true");
  });

  it("says nothing happened yet on a PC it has not touched", async () => {
    const { container } = await mount();

    expect(screen.getByText(s.ledger.empty)).toBeInTheDocument();
    // Nothing to export, nothing to clear, no filters to filter.
    expect(screen.queryByRole("button", { name: "CSV" })).toBeNull();
    expect(screen.queryByRole("search")).toBeNull();
    // The summary is still stated, at zero.
    const counts = [...container.querySelectorAll(".history-summary dd")].map(
      (dd) => dd.textContent,
    );
    expect(counts).toEqual(["0", "0", "0"]);
  });

  it("lists a change with what it was, where it came from and how it went", async () => {
    await mount({ log: [entry({ elevated: true, changes: [value()] })], tweaks: [tweak()] });

    const row = document.querySelector(".workspace-ledger-event") as HTMLElement;
    // Named by the dictionary the app is showing, not by the id.
    expect(within(row).getByText(s.tweaks.menu_show_delay.name)).toBeInTheDocument();
    expect(within(row).getByText(s.ledger.actions.applied)).toBeInTheDocument();
    expect(within(row).getByText(c.originSwitch)).toBeInTheDocument();
    expect(within(row).getByText(s.ledger.elevated)).toBeInTheDocument();
    // A time element, so the raw stamp stays machine-readable.
    expect(row.querySelector("time")).toHaveAttribute(
      "dateTime",
      new Date(T1 * 1000).toISOString(),
    );
  });

  it("marks a change that failed, and does not offer to undo it", async () => {
    await mount({
      log: [entry({ success: false, detail: "Access is denied" })],
      tweaks: [tweak()],
    });

    expect(screen.getByText(s.ledger.failed)).toBeInTheDocument();
    expect(screen.getByText("Access is denied")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: `${c.undoOne} · ${s.tweaks.menu_show_delay.name}` }),
    ).toBeNull();
  });

  it("says whether a change is still in effect, and offers to undo that one", async () => {
    await mount({
      log: [entry()],
      tweaks: [tweak({ applied: true })],
      active: [{ id: "menu_show_delay", changes: [value()] }],
    });

    const row = document.querySelector(".workspace-ledger-event") as HTMLElement;
    expect(within(row).getByText(c.stillActive)).toBeInTheDocument();
    const undo = within(row).getByRole("button", {
      name: `${c.undoOne} · ${s.tweaks.menu_show_delay.name}`,
    });
    expect(undo).toBeEnabled();
  });

  it("asks before undoing, and shows the registry value it will put back", async () => {
    await mount({
      log: [entry()],
      tweaks: [tweak({ applied: true })],
      active: [{ id: "menu_show_delay", changes: [value()] }],
    });
    bridge.reply("rollback_tweaks", []);
    bridge.reply("list_tweaks", [tweak()]);

    fireEvent.click(
      screen.getByRole("button", { name: `${c.undoOne} · ${s.tweaks.menu_show_delay.name}` }),
    );

    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText(c.undoTitleOne)).toBeInTheDocument();
    expect(within(dialog).getByText(c.undoBody)).toBeInTheDocument();
    expect(within(dialog).getByText(c.before)).toBeInTheDocument();
    expect(within(dialog).getByText("400")).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(within(dialog).getByRole("button", { name: c.undoConfirmOne }));
    });
    expect(bridge.argsOf("rollback_tweaks")).toEqual({ ids: ["menu_show_delay"] });
    expect(onChanged).toHaveBeenCalledTimes(1);
    expect(pushToast).toHaveBeenCalledWith("success", format(c.undoDone, { count: 1 }));
  });

  it("says so plainly when only some of the changes came back", async () => {
    await mount({
      log: [entry()],
      tweaks: [tweak({ applied: true })],
      active: [{ id: "menu_show_delay", changes: [value()] }],
    });
    bridge.reply("rollback_tweaks", ["something went wrong"]);
    // Still applied afterwards: the read that follows says so.
    bridge.reply("list_tweaks", [tweak({ applied: true })]);

    fireEvent.click(
      screen.getByRole("button", { name: `${c.undoOne} · ${s.tweaks.menu_show_delay.name}` }),
    );
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: c.undoConfirmOne }));
    });

    expect(pushToast).toHaveBeenCalledWith("error", format(c.undoPartial, { done: 0, total: 1 }));
  });

  it("cancels a confirmation without writing anything", async () => {
    await mount({
      log: [entry()],
      tweaks: [tweak({ applied: true })],
      active: [{ id: "menu_show_delay", changes: [value()] }],
    });

    fireEvent.click(
      screen.getByRole("button", { name: `${c.undoOne} · ${s.tweaks.menu_show_delay.name}` }),
    );
    fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: c.cancel }));

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.querySelector("dialog")).not.toHaveAttribute("open");
    expect(bridge.callsTo("rollback_tweaks")).toHaveLength(0);
    expect(onChanged).not.toHaveBeenCalled();
  });

  it("undone changes are counted apart from the failures", async () => {
    const { container } = await mount({
      log: [
        entry(),
        entry({ ts: T2, action: "tweak-reverted" }),
        entry({ ts: T2 + 1, action: "cleanup", target: "temp", success: false }),
      ],
      tweaks: [tweak({ applied: true })],
      active: [{ id: "menu_show_delay", changes: [] }],
    });

    const counts = [...container.querySelectorAll(".history-summary dd")].map(
      (dd) => dd.textContent,
    );
    expect(counts).toEqual(["1", "1", "1"]);
  });

  it("filters the list down, and says when nothing matches", async () => {
    await mount({
      log: [entry({ changes: [value()] }), entry({ ts: T2, action: "cleanup", target: "temp" })],
      tweaks: [tweak()],
    });
    expect(rows()).toHaveLength(2);

    const search = screen.getByRole("searchbox", { name: c.search });
    // By the setting: the dictionary's name for it.
    fireEvent.change(search, { target: { value: s.tweaks.menu_show_delay.name } });
    expect(rows()).toHaveLength(1);
    // And by a registry value underneath it, which is on the row only once the
    // values are opened.
    fireEvent.change(search, { target: { value: "MenuShowDelay" } });
    expect(rows()).toHaveLength(1);

    fireEvent.change(search, { target: { value: "nothing like this happened" } });
    expect(screen.getByText(c.emptyFiltered)).toBeInTheDocument();

    // The way out is offered with the dead end.
    fireEvent.click(screen.getByRole("button", { name: c.clearFilters }));
    expect(rows()).toHaveLength(2);
  });

  it("narrows by type and by result", async () => {
    await mount({
      log: [
        entry(),
        entry({ ts: T2, action: "cleanup", target: "temp" }),
        entry({ ts: T2 + 1, action: "startup-change", target: "Steam", success: false }),
      ],
      tweaks: [tweak()],
    });

    fireEvent.change(screen.getByRole("combobox", { name: c.type }), {
      target: { value: "cleanup" },
    });
    expect(rows()).toHaveLength(1);

    fireEvent.change(screen.getByRole("combobox", { name: c.outcome }), {
      target: { value: "failed" },
    });
    // Cleanup succeeded, so the two filters together match nothing.
    expect(screen.getByText(c.emptyFiltered)).toBeInTheDocument();

    fireEvent.change(screen.getByRole("combobox", { name: c.type }), {
      target: { value: "all" },
    });
    expect(rows()).toHaveLength(1);
    expect(screen.getByText(s.ledger.failed)).toBeInTheDocument();
  });

  it("switches the values table on for one row, and off again", async () => {
    await mount({ log: [entry({ changes: [value()] })], tweaks: [tweak()] });

    const toggle = screen.getByRole("button", { name: c.showValues });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(toggle);
    const table = document.querySelector(".history-values") as HTMLElement;
    expect(table).not.toBeNull();
    expect(within(table).getByRole("columnheader", { name: c.after })).toBeInTheDocument();
    // The value that is set, and the one that was there before.
    expect(within(table).getByText("0")).toBeInTheDocument();
    expect(within(table).getByText("400")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: c.hideValues }));
    expect(document.querySelector(".history-values")).toBeNull();
  });

  it("says a value was never recorded instead of showing an empty table", async () => {
    await mount({ log: [entry()], tweaks: [tweak()] });

    fireEvent.click(screen.getByRole("button", { name: c.showValues }));

    expect(screen.getByText(c.notRecorded)).toBeInTheDocument();
    expect(document.querySelector(".history-values")).toBeNull();
  });

  it("compares what is in effect now with what Windows had before", async () => {
    await mount({
      log: [entry()],
      tweaks: [tweak({ applied: true })],
      active: [{ id: "menu_show_delay", changes: [value()] }],
    });

    expect(screen.getByText(c.compareBody)).toBeInTheDocument();
    const show = screen.getByRole("button", {
      name: format(c.compareShow, { count: 1 }),
    });
    expect(show).toHaveAttribute("aria-expanded", "false");
    expect(document.querySelector(".history-compare-list")).toBeNull();

    fireEvent.click(show);
    const list = document.querySelector(".history-compare-list") as HTMLElement;
    expect(list).not.toBeNull();
    expect(within(list).getByText(s.tweaks.menu_show_delay.name)).toBeInTheDocument();
    expect(within(list).getByText("0")).toBeInTheDocument();
  });

  it("says when nothing is being kept in effect", async () => {
    await mount({ log: [entry()], tweaks: [tweak()] });

    expect(screen.getByText(c.compareEmpty)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: format(c.undoAll, { count: 1 }) })).toBeNull();
  });

  it("exports what is on screen through the file dialog", async () => {
    await mount({ log: [entry({ changes: [value()] })], tweaks: [tweak()] });

    setDialog("save", "/tmp/wincraft-history.csv");
    bridge.reply("save_history_export", null);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "CSV" }));
    });

    const args = bridge.argsOf("save_history_export") as { path: string; contents: string };
    expect(args.path).toBe("/tmp/wincraft-history.csv");
    // The row's own words, not a raw action id.
    expect(args.contents).toContain(s.tweaks.menu_show_delay.name);
    expect(pushToast).toHaveBeenCalledWith("success", c.exported);
  });

  it("writes nothing when the export dialog is dismissed", async () => {
    await mount({ log: [entry()], tweaks: [tweak()] });

    setDialog("save", null);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "JSON" }));
    });

    expect(bridge.callsTo("save_history_export")).toHaveLength(0);
    expect(pushToast).not.toHaveBeenCalled();
  });

  it("clears the history only after a confirmation that says what that means", async () => {
    await mount({ log: [entry()], tweaks: [tweak()] });
    bridge.reply("clear_audit_log", null);
    bridge.reply("list_audit_log", []);

    fireEvent.click(screen.getByRole("button", { name: s.ledger.clear }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText(c.clearTitle)).toBeInTheDocument();
    expect(within(dialog).getByText(c.clearBody)).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(within(dialog).getByRole("button", { name: s.ledger.clear }));
    });

    expect(bridge.callsTo("clear_audit_log")).toHaveLength(1);
    expect(pushToast).toHaveBeenCalledWith("success", s.ledger.cleared);
    await waitFor(() => expect(screen.getByText(s.ledger.empty)).toBeInTheDocument());
  });

  it("reports a failed read and offers to read again", async () => {
    bridge.reply("list_audit_log", new Error("audit.rs is not answering"));
    bridge.reply("debloat_history", []);
    bridge.reply("active_changes", []);
    render(
      <ChangeHistory
        s={s}
        lang="en"
        tweaks={[tweak()]}
        onChanged={onChanged}
        pushToast={pushToast}
      />,
    );

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Error: audit.rs is not answering");

    bridge.reply("list_audit_log", [entry()]);
    await act(async () => {
      fireEvent.click(within(alert).getByRole("button", { name: s.scheduledTasks.refresh }));
    });
    expect(await screen.findByText(s.tweaks.menu_show_delay.name)).toBeInTheDocument();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("lists an app removal from the Debloat history beside its own changes", async () => {
    await mount({
      removals: [
        {
          catalogId: "solitaire",
          packageFullName: "Microsoft.MicrosoftSolitaireCollection_8wekyb3d8bbwe",
          status: "removed",
          error: null,
          timestamp: T2,
        },
      ],
      log: [entry()],
      tweaks: [tweak()],
    });

    expect(screen.getByText("solitaire")).toBeInTheDocument();
    expect(screen.getByText(c.removalRemoved)).toBeInTheDocument();
  });

  it("has no automatic accessibility violations", async () => {
    const first = await mount({ log: [entry()], tweaks: [tweak()] });
    expect((await axe(first.container)).violations).toEqual([]);
    cleanup();

    const { container } = await mount({
      log: [
        entry({ changes: [value()], elevated: true }),
        entry({ ts: T2, action: "cleanup", target: "temp" }),
        entry({ ts: T2 + 1, action: "startup-change", target: "Steam", success: false }),
        entry({ ts: T2 + 2, action: "tweak-auto-reverted", target: "game_mode" }),
      ],
      tweaks: [tweak({ applied: true })],
      active: [{ id: "menu_show_delay", changes: [value()] }],
    });
    fireEvent.click(screen.getByRole("button", { name: c.showValues }));
    fireEvent.click(screen.getByRole("button", { name: format(c.compareShow, { count: 1 }) }));
    expect((await axe(container)).violations).toEqual([]);
  });
});
