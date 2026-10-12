import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { axe } from "jest-axe";
import { STRINGS, format } from "../i18n";
import type { DebloatApp, DebloatRecord } from "./debloat";
import { DebloatPanel } from "./debloat";
import { DEBLOAT_COPY } from "./debloat-copy";
import { formatSize } from "../debloat-model";

vi.mock("@tauri-apps/api/core", async () => (await import("../test-bridge")).coreModule());
vi.mock("@tauri-apps/api/event", async () => (await import("../test-bridge")).eventModule());
vi.mock("@tauri-apps/plugin-opener", async () => (await import("../test-bridge")).openerModule());
vi.mock("@tauri-apps/plugin-dialog", async () => (await import("../test-bridge")).dialogModule());

const { bridge, setDialog } = await import("../test-bridge");
const { openUrl } = await import("@tauri-apps/plugin-opener");

/** The spy `openUrl` really is, without the module's declared signature. */
const openUrlMock = openUrl as unknown as ReturnType<typeof vi.fn>;

const c = DEBLOAT_COPY.en;
const s = STRINGS.en;
const onNavigate = vi.fn();

/**
 * The panel reads on mount through a zero-delay timer and reports progress from
 * its own click handlers, so every interaction here is awaited through
 * `findBy…`/`waitFor` rather than a sleep.
 */
beforeEach(() => {
  bridge.reset();
  onNavigate.mockReset();
  openUrlMock.mockClear();
});
afterEach(cleanup);

/**
 * An installed, removable app. Everything the panel shows by default is
 * `canRemove`, so the fixtures start there and opt out per test.
 */
const app = (extra: Partial<DebloatApp> = {}): DebloatApp => ({
  catalogId: "solitaire",
  name: "Solitaire & Casual Games",
  description: "Collection of card games.",
  impact: "The bundled card games go away.",
  packageFullName: "Microsoft.MicrosoftSolitaireCollection_8wekyb3d8bbwe",
  installed: true,
  removable: true,
  reason: null,
  storeUrl: "https://apps.microsoft.com/detail/9wzdncrfj3pt",
  publisher: "Microsoft Corporation",
  sizeBytes: 320 * 1024 * 1024,
  dataBytes: 40 * 1024 * 1024,
  installedAt: 1_700_000_000,
  lastActivity: null,
  startsWithWindows: null,
  memoryBytes: null,
  dataSince: null,
  ...extra,
});

const weather = app({
  catalogId: "weather",
  name: "Weather",
  packageFullName: "Microsoft.BingWeather_8wekyb3d8bbwe",
  sizeBytes: 50 * 1024 * 1024,
  dataBytes: null,
  storeUrl: null,
});

const record = (extra: Partial<DebloatRecord> = {}): DebloatRecord => ({
  catalogId: "solitaire",
  packageFullName: "Microsoft.MicrosoftSolitaireCollection_8wekyb3d8bbwe",
  publisherId: "8wekyb3d8bbwe",
  scope: "currentUser",
  status: "removed",
  error: null,
  timestamp: 1_760_000_000,
  ...extra,
});

/**
 * Rows, not raw text: every app name also appears in its own "what you lose"
 * popover, and the action bar and the preview dialog carry the same button
 * label. Queries are scoped to the row or the dialog so a duplicate can never
 * make an assertion ambiguous.
 */
const rows = () => Array.from(document.querySelectorAll("li.debloat-row"));
const rowFor = (name: string) =>
  rows().find((li) => (li.textContent ?? "").includes(name)) as HTMLElement | undefined;
const rowText = (name: string) => rowFor(name)?.textContent ?? "";
const dialogEl = () => document.querySelector("dialog.debloat-dialog") as HTMLDialogElement;
const inDialog = () => within(dialogEl());
const tick = (name: string) =>
  fireEvent.click(within(rowFor(name) as HTMLElement).getByRole("checkbox"));
const removeButton = () => document.querySelector("button.tool-danger-action") as HTMLElement;

/** Mounts the panel, answering the mount reads with `apps` and `records`. */
async function mount(inventory: DebloatApp[] = [app()], records: DebloatRecord[] = []) {
  bridge.reply("list_debloat_apps", inventory);
  bridge.reply("debloat_history", records);
  const view = render(<DebloatPanel lang="en" onNavigate={onNavigate} />);
  await act(async () => {
    await new Promise((done) => setTimeout(done, 0));
  });
  return view;
}

describe("the app list", () => {
  it("reads the list and the history once, and not again on a return visit", async () => {
    bridge.reply("list_debloat_apps", [app()]);
    bridge.reply("debloat_history", []);
    const { rerender } = render(<DebloatPanel lang="en" onNavigate={onNavigate} active={false} />);
    await act(async () => {
      await new Promise((done) => setTimeout(done, 0));
    });
    // Not the active section yet, so nothing is read at all.
    expect(bridge.callsTo("list_debloat_apps")).toHaveLength(0);
    expect(bridge.callsTo("debloat_history")).toHaveLength(0);

    rerender(<DebloatPanel lang="en" onNavigate={onNavigate} active />);
    await act(async () => {
      await new Promise((done) => setTimeout(done, 0));
    });
    expect(bridge.callsTo("list_debloat_apps")).toHaveLength(1);
    expect(bridge.callsTo("debloat_history")).toHaveLength(1);
    expect(rowFor("Solitaire & Casual Games")).toBeDefined();

    // The parent keeps the panel mounted across navigation so an operation can
    // finish; coming back must not pay for the walk again.
    rerender(<DebloatPanel lang="en" onNavigate={onNavigate} active={false} />);
    rerender(<DebloatPanel lang="en" onNavigate={onNavigate} active />);
    await act(async () => {
      await new Promise((done) => setTimeout(done, 0));
    });
    expect(bridge.callsTo("list_debloat_apps")).toHaveLength(1);
  });

  it("says the list could not be read without losing the selection", async () => {
    bridge.reply("debloat_history", []);
    bridge.reply("list_debloat_apps", new Error("package manager unavailable"));
    render(<DebloatPanel lang="en" onNavigate={onNavigate} />);
    await act(async () => {
      await new Promise((done) => setTimeout(done, 0));
    });
    expect(screen.getByText(new RegExp(c.scanError))).toBeInTheDocument();
    // The error is not dressed up as an empty machine.
    expect(screen.queryByText(c.empty)).not.toBeInTheDocument();
  });

  it("counts what is installed and what can actually go", async () => {
    await mount([
      app(),
      app({
        catalogId: "clipchamp",
        name: "Clipchamp",
        packageFullName: "Clipchamp.Clipchamp_8wekyb3d8bbwe",
        removable: false,
        reason: "protectedPackage",
        sizeBytes: null,
        dataBytes: null,
      }),
      app({
        catalogId: "todo",
        name: "Microsoft To Do",
        packageFullName: "Microsoft.Todos_8wekyb3d8bbwe",
        installed: false,
      }),
    ]);

    // Installed counts the two that are here; removable counts only the one
    // Windows will let this app take away.
    expect(screen.getByText(c.installed).nextElementSibling).toHaveTextContent("2");
    expect(screen.getByText(c.removable).nextElementSibling).toHaveTextContent("1");
  });

  it("keeps a locked app out of reach, with the reason it is locked", async () => {
    await mount([app({ removable: false, reason: "protectedPackage" })]);
    // Locked apps are hidden until asked for, and then cannot be ticked.
    expect(screen.queryByText("Solitaire & Casual Games")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("checkbox", { name: c.showLocked }));
    const box = screen.getByRole("checkbox", {
      name: /Solitaire/i,
      hidden: true,
    }) as HTMLInputElement;
    expect(box).toBeDisabled();
    expect(screen.getByText(c.lockedBadge)).toHaveAttribute("title", c.protectedPackage);
  });

  it("tells the user when removal needs a normal session rather than failing quietly", async () => {
    await mount([
      app({ removable: false, reason: "requiresStandardUser" }),
      app({
        catalogId: "weather",
        name: "Weather",
        packageFullName: "Microsoft.BingWeather_8wekyb3d8bbwe",
      }),
    ]);
    // The list is built from Windows' own report, so the banner explains why
    // those rows are missing instead of leaving one unexplained absence.
    expect(screen.getByText(c.elevatedTitle)).toBeInTheDocument();
    expect(screen.getByText(c.requiresStandardUser)).toBeInTheDocument();
  });

  it("shows apps that are not installed only when asked", async () => {
    await mount([app({ installed: false, removable: false })]);
    expect(rowFor("Solitaire & Casual Games")).toBeUndefined();
    fireEvent.click(screen.getByRole("checkbox", { name: "Include apps not installed" }));
    expect(rowFor("Solitaire & Casual Games")).toBeDefined();
    expect(rowText("Solitaire & Casual Games")).toContain("Not installed");
  });
});

describe("filtering the list", () => {
  it("separates a search with no match from filters that exclude everything", async () => {
    await mount([app(), weather]);

    fireEvent.change(screen.getByRole("searchbox", { name: c.search }), {
      target: { value: "nothing matches this" },
    });
    // A search that matches nothing and a filter combination that excludes
    // everything are different sentences.
    expect(screen.getByText(c.noMatch)).toBeInTheDocument();

    fireEvent.change(screen.getByRole("searchbox", { name: c.search }), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: /Mail & phone/ }));
    expect(screen.getByText(c.emptyFilter)).toBeInTheDocument();

    // Clearing puts the category and the search back, not just one of them.
    fireEvent.click(screen.getByRole("button", { name: c.clearFilters }));
    expect(rowFor("Solitaire & Casual Games")).toBeDefined();
    expect(rowFor("Weather")).toBeDefined();
  });

  it("counts every category, so a filter never looks emptier than it is", async () => {
    await mount([app(), weather]);
    // Solitaire is media, Weather is a Windows extra; both counts are on the
    // segment buttons rather than only in the list.
    const media = screen.getByRole("button", { name: new RegExp(`^Media & games`) });
    expect(media).toHaveTextContent("1");
    expect(screen.getByRole("button", { name: /^Windows extras/ })).toHaveTextContent("1");
  });

  it("groups rows by category and can collapse a group", async () => {
    await mount([app(), weather]);
    expect(screen.getByRole("heading", { name: /Media & games/ })).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: format(c.toggleGroup, { name: "Media & games" }) }),
    );
    expect(rowFor("Solitaire & Casual Games")).toBeUndefined();
    expect(rowFor("Weather")).toBeDefined();

    fireEvent.click(
      screen.getByRole("button", { name: format(c.toggleGroup, { name: "Media & games" }) }),
    );
    expect(rowFor("Solitaire & Casual Games")).toBeDefined();
  });
});

describe("choosing what to remove", () => {
  it("selects a whole group, and only what Windows would allow", async () => {
    await mount([
      app(),
      app({
        catalogId: "clipchamp",
        name: "Clipchamp",
        packageFullName: "Clipchamp.Clipchamp_8wekyb3d8bbwe",
        removable: false,
        reason: "protectedPackage",
      }),
      weather,
    ]);
    fireEvent.click(screen.getAllByRole("button", { name: c.selectGroup })[0] as HTMLElement);
    // Media holds a removable app and a locked one, so exactly one is ticked —
    // and the size quoted is that one app's, not the group's.
    // 320 MB of app files plus 40 MB of this account's data.
    const solitaireSize = formatSize(360 * 1024 * 1024) as string;
    expect(
      screen.getByText(format(c.selectionSummary, { count: "1", size: solitaireSize })),
    ).toBeInTheDocument();
    expect(removeButton()).toBeEnabled();
  });

  it("offers presets that fill the selection without starting anything", async () => {
    await mount([app(), weather]);
    // Aggressive is every removable app: both of these.
    fireEvent.click(screen.getByRole("button", { name: new RegExp(`^${c.presetAggressive}`) }));
    expect(bridge.callsTo("remove_debloat_app")).toHaveLength(0);
    expect(
      screen.getByRole("button", { name: format(c.removeCount, { count: "2" }) }),
    ).toBeInTheDocument();
    // The button reports that the selection now is exactly this preset.
    expect(
      screen.getByRole("button", { name: new RegExp(`^${c.presetAggressive}`) }),
    ).toHaveAttribute("aria-pressed", "true");

    // Minimal is the recommended tier only: Solitaire, not Weather.
    fireEvent.click(screen.getByRole("button", { name: new RegExp(`^${c.presetMinimal}`) }));
    expect(removeButton()).toBeInTheDocument();
  });

  it("clears the selection", async () => {
    await mount();
    tick("Solitaire");
    expect(removeButton()).toBeEnabled();
    fireEvent.click(screen.getByRole("button", { name: "Clear selection" }));
    expect(screen.getByText(c.selectionNone)).toBeInTheDocument();
  });

  it("drops a selection the rescan no longer recognises", async () => {
    await mount();
    tick("Solitaire");
    expect(removeButton()).toBeEnabled();

    // Windows now reports the package as protected, so it is no longer
    // removable and the tick must not survive the re-read.
    bridge.reply("list_debloat_apps", [app({ removable: false, reason: "protectedPackage" })]);
    fireEvent.click(screen.getByRole("button", { name: c.scan }));
    await waitFor(() => expect(screen.getByText(c.selectionNone)).toBeInTheDocument());
    expect(
      screen.getByRole("button", { name: format(c.removeCount, { count: "0" }) }),
    ).toBeDisabled();
  });
});

describe("removing", () => {
  /** Ticks the app, opens the preview dialog, and returns its confirm button. */
  function openPreview() {
    tick("Solitaire");
    fireEvent.click(removeButton());
    return inDialog().getByRole("button", { name: c.removeOne });
  }

  it("previews the exact package before anything is removed", async () => {
    await mount();
    tick("Solitaire");
    fireEvent.click(removeButton());

    expect(dialogEl().open).toBe(true);
    expect(inDialog().getByText(format(c.confirmTitle, { count: "1" }))).toBeInTheDocument();
    // The dialog names the package identity, not just the friendly name: that
    // is the thing being removed.
    expect(
      inDialog().getByText("Microsoft.MicrosoftSolitaireCollection_8wekyb3d8bbwe"),
    ).toBeInTheDocument();
    // What this app loses, from the curated impact copy.
    expect(inDialog().getByText(c.solitaire)).toBeInTheDocument();
    // Cancel closes it and removes nothing.
    fireEvent.click(inDialog().getByRole("button", { name: c.cancel }));
    expect(bridge.callsTo("remove_debloat_app")).toHaveLength(0);
  });

  it("removes, verifies, and reports the outcome per app", async () => {
    await mount();
    const go = openPreview();
    bridge.reply("remove_debloat_app", record());
    bridge.reply("debloat_history", [record()]);
    bridge.reply("list_debloat_apps", [app({ installed: false, removable: false })]);
    fireEvent.click(go);

    await waitFor(() =>
      expect(bridge.argsOf("remove_debloat_app")).toEqual({
        packageFullName: "Microsoft.MicrosoftSolitaireCollection_8wekyb3d8bbwe",
      }),
    );
    // The step list is the receipt: named app, verified outcome, and the count.
    expect(
      await screen.findByText(format(c.summaryDone, { removed: "1", failed: "0" })),
    ).toBeInTheDocument();
    // History is re-read after the write and the list is re-scanned, so the
    // screen shows what Windows now believes rather than what was attempted.
    expect(bridge.callsTo("debloat_history").length).toBeGreaterThan(1);
    await waitFor(() => expect(bridge.callsTo("list_debloat_apps")).toHaveLength(2));
    expect(await screen.findByText(c.empty)).toBeInTheDocument();
  });

  it("never claims success when Windows acted but the answer was lost", async () => {
    await mount();
    const go = openPreview();
    // A transport failure can happen after Windows removed the package, so the
    // record must say "unknown" and the app must not retry on its own.
    bridge.reply("remove_debloat_app", new Error("the pipe closed"));
    bridge.reply("debloat_history", [record({ status: "unknown", error: "the pipe closed" })]);
    bridge.reply("list_debloat_apps", [app()]);
    fireEvent.click(go);

    expect(await screen.findByText(c.unknown)).toBeInTheDocument();
    expect(
      screen.getByText(format(c.summaryDone, { removed: "0", failed: "1" })),
    ).toBeInTheDocument();
    // One attempt only.
    expect(bridge.callsTo("remove_debloat_app")).toHaveLength(1);
  });

  it("reports a refusal as a failure", async () => {
    await mount();
    const go = openPreview();
    bridge.reply("remove_debloat_app", record({ status: "failed", error: "access denied" }));
    bridge.reply("debloat_history", []);
    // The list cannot be re-read afterwards either.
    bridge.reply("list_debloat_apps", new Error("the app list is unavailable"));
    fireEvent.click(go);

    expect(
      await screen.findByText(format(c.summaryDone, { removed: "0", failed: "1" })),
    ).toBeInTheDocument();
    expect(screen.getByText("access denied")).toBeInTheDocument();
    // The receipt stays on screen, and the user is told the state could not be
    // confirmed rather than being left with a stale list and no explanation.
    expect(screen.getByText(c.refreshError)).toBeInTheDocument();
  });
});

describe("saving and loading a list", () => {
  it("saves catalogue ids, not package names", async () => {
    await mount([app(), weather]);
    tick("Solitaire");
    setDialog("save", "/home/user/wincraft-debloat-list.json");
    bridge.reply("write_debloat_list", null);
    fireEvent.click(screen.getByRole("button", { name: c.saveList }));

    await waitFor(() =>
      expect(bridge.argsOf("write_debloat_list")).toEqual({
        path: "/home/user/wincraft-debloat-list.json",
        catalogIds: ["solitaire"],
      }),
    );
    expect(await screen.findByText(c.listSaved)).toBeInTheDocument();
  });

  it("writes nothing when the save dialog is cancelled", async () => {
    await mount();
    tick("Solitaire");
    setDialog("save", null);
    fireEvent.click(screen.getByRole("button", { name: c.saveList }));
    await act(async () => {});
    expect(bridge.callsTo("write_debloat_list")).toHaveLength(0);
  });

  it("loads a list into the selection and counts what it could not match", async () => {
    await mount([app(), weather]);
    setDialog("open", "/home/user/list.json");
    bridge.reply("read_debloat_list", ["solitaire", "news"]);
    fireEvent.click(screen.getByRole("button", { name: c.loadList }));

    expect(
      await screen.findByText(
        `${format(c.listLoaded, { count: "1" })} ${format(c.listMissing, { count: "1" })}`,
      ),
    ).toBeInTheDocument();
    // Loading selects; it never removes. The preview still follows.
    expect(bridge.callsTo("remove_debloat_app")).toHaveLength(0);
    expect(removeButton()).toBeEnabled();
  });

  it("reports a bad list file instead of silently selecting nothing", async () => {
    await mount();
    setDialog("open", "/home/user/broken.json");
    bridge.reply("read_debloat_list", new Error("not a WinCraft list"));
    fireEvent.click(screen.getByRole("button", { name: c.loadList }));
    // The reason is shown rather than an empty selection with no explanation.
    expect(await screen.findByText(/not a WinCraft list/)).toBeInTheDocument();
  });
});

describe("history and recovery", () => {
  it("lists removals newest first and offers the verified Store page back", async () => {
    await mount(
      [app()],
      [
        record({ timestamp: 1_700_000_000, status: "removed" }),
        record({ timestamp: 1_760_000_000, status: "failed", error: "access denied" }),
      ],
    );
    expect(screen.getByRole("button", { name: new RegExp(c.history) })).toHaveTextContent("2");
    fireEvent.click(screen.getByRole("button", { name: new RegExp(c.history) }));

    const rows = screen.getAllByRole("listitem");
    expect(rows[0]).toHaveTextContent(String(new Date(1_760_000_000 * 1000).getFullYear()));
    expect(screen.getByText("access denied")).toBeInTheDocument();
    // Only the successful removal offers a way back.
    expect(screen.getAllByRole("button", { name: new RegExp(c.reinstall) })).toHaveLength(1);

    bridge.reply("debloat_reinstall_link", "https://apps.microsoft.com/detail/9wzdncrfj3pt");
    fireEvent.click(screen.getByRole("button", { name: new RegExp(c.reinstall) }));
    await waitFor(() =>
      expect(openUrlMock).toHaveBeenCalledWith("https://apps.microsoft.com/detail/9wzdncrfj3pt"),
    );
    expect(bridge.argsOf("debloat_reinstall_link")).toEqual({ catalogId: "solitaire" });
  });

  it("says the history could not be read rather than showing it as empty", async () => {
    await mount([app()], []);
    bridge.reply("debloat_history", new Error("the journal is locked"));
    fireEvent.click(screen.getByRole("button", { name: new RegExp(c.history) }));
    fireEvent.click(screen.getByRole("button", { name: c.reloadHistory }));
    expect(await screen.findByText(new RegExp(c.historyError))).toBeInTheDocument();
  });

  it("says so when the recorded date is unusable", async () => {
    await mount([app()], [record({ timestamp: Number.NaN })]);
    fireEvent.click(screen.getByRole("button", { name: new RegExp(c.history) }));
    expect(screen.getByText(c.dateUnknown)).toBeInTheDocument();
  });
});

describe("suggestions", () => {
  it("hands the privacy controls over to the sections that own them", async () => {
    await mount();
    fireEvent.click(screen.getByRole("button", { name: new RegExp(c.suggestions) }));

    expect(screen.getByText(c.privacyTitle)).toBeInTheDocument();
    // The list is the tweaks' own names and descriptions, not a second copy.
    expect(screen.getByText(s.tweaks.disable_start_suggestions.name)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: c.openPrivacy }));
    expect(onNavigate).toHaveBeenCalledWith("privacy");
    fireEvent.click(screen.getByRole("button", { name: new RegExp(`^${c.openProfiles}`) }));
    expect(onNavigate).toHaveBeenCalledWith("profiles");
  });
});

describe("accessibility", () => {
  it("has no axe violations on the app list", async () => {
    const { container } = await mount([app(), weather]);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
