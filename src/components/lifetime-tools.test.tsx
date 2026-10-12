import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { axe } from "jest-axe";
import { STRINGS } from "../i18n-tables";
import type { TweakInfo, TweakProfile } from "../types";
import { LifetimeTools } from "./lifetime-tools";
import { PROFILE_TOOLS_COPY } from "./profile-tools-copy";

vi.mock("@tauri-apps/api/core", async () => (await import("../test-bridge")).coreModule());
vi.mock("@tauri-apps/api/event", async () => (await import("../test-bridge")).eventModule());

const { bridge } = await import("../test-bridge");

const s = STRINGS.en;
const c = PROFILE_TOOLS_COPY.en;

const tweak = (id: string, name: string): TweakInfo => ({
  id,
  name,
  description: "",
  category: "performance",
  hive: "HKLM",
  requires_admin: false,
  requires_pro: false,
  applied: false,
  changes: [],
});

const tweaks: TweakInfo[] = [
  tweak("disable_game_dvr", "Game DVR"),
  tweak("reduce_input_lag", "Reduce input lag"),
  tweak("show_file_extensions", "File extensions"),
];

const profile = (name: string, ids: string[]): TweakProfile => ({
  format: 1,
  name,
  created_at: "",
  tweaks: ids,
});

/** What `compare_lifetime_profiles` answers for `left` against `right`. */
const comparison = {
  left_name: "Gaming",
  right_name: "Work",
  common: ["disable_game_dvr"],
  only_left: ["reduce_input_lag"],
  only_right: ["show_file_extensions"],
  unknown_left_count: 0,
  unknown_right_count: 0,
};

function mount(profiles = [profile("Gaming", ["disable_game_dvr"]), profile("Work", [])]) {
  return render(<LifetimeTools s={s} lang="en" profiles={profiles} tweaks={tweaks} />);
}

/** Picks both profiles and waits for the comparison to be on screen. */
async function compare() {
  // Queue the reply here unless the test queued one of its own first.
  if (!bridge.callsTo("compare_lifetime_profiles").length) {
    bridge.reply("compare_lifetime_profiles", comparison);
  }
  fireEvent.change(screen.getByLabelText("Profile A"), { target: { value: "Gaming" } });
  fireEvent.change(screen.getByLabelText("Profile B"), { target: { value: "Work" } });
  fireEvent.click(screen.getByRole("button", { name: "Compare profiles" }));
  await screen.findByText(/In both profiles/);
}

beforeEach(() => bridge.reset());
afterEach(cleanup);

describe("LifetimeTools", () => {
  it("states what the tools are and what they are not", () => {
    mount();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(c.openTools);
    expect(screen.getByText(c.notBenchmark)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: c.reports })).toBeInTheDocument();
  });

  it("asks for a second profile instead of offering a comparison that cannot run", () => {
    mount([profile("Gaming", [])]);
    expect(screen.getByText("Save at least two profiles to compare them.")).toBeInTheDocument();
    expect(screen.getByLabelText("Profile A")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Compare profiles" })).toBeDisabled();
  });

  it("compares the two chosen profiles and names the settings in each group", async () => {
    mount();
    await compare();
    expect(bridge.argsOf("compare_lifetime_profiles")).toEqual({
      leftName: "Gaming",
      rightName: "Work",
    });
    const groups = screen.getAllByRole("heading", { level: 4 });
    expect(groups[0]).toHaveTextContent("In both profiles");
    expect(groups[0]).toHaveTextContent("1");
    // Tweak ids are shown by their translated names, not their registry keys.
    for (const id of ["disable_game_dvr", "reduce_input_lag", "show_file_extensions"]) {
      const shown = s.tweaks[id]?.name ?? tweaks.find((t) => t.id === id)!.name;
      expect(screen.getByText(shown)).toBeInTheDocument();
    }
  });

  it("says so when a profile carries settings this build does not know", async () => {
    bridge.reply("compare_lifetime_profiles", {
      ...comparison,
      unknown_left_count: 2,
      unknown_right_count: 1,
    });
    mount();
    await compare();
    expect(screen.getByText(/Unrecognized settings were excluded: A 2, B 1\./)).toBeInTheDocument();
  });

  it("keeps export closed until a report has been previewed", async () => {
    mount();
    await compare();
    const preview = screen.getByRole("button", { name: "Preview report" });
    const exportButton = screen.getByRole("button", { name: "Export Markdown" });
    expect(exportButton).toBeDisabled();

    bridge.reply("preview_lifetime_report", "# WinCraft report\n");
    fireEvent.click(preview);
    await waitFor(() => expect(bridge.callsTo("preview_lifetime_report")).toHaveLength(1));
    // No comparison is ticked, so the report is asked for with no selection.
    expect(bridge.argsOf("preview_lifetime_report")).toEqual({ comparison: null });
    const shown = await screen.findByLabelText("Preview report", { selector: "pre" });
    expect(shown).toHaveTextContent("# WinCraft report");

    bridge.reply("save_lifetime_report", true);
    fireEvent.click(exportButton);
    expect(await screen.findByRole("status")).toHaveTextContent("Report saved.");
    expect(bridge.argsOf("save_lifetime_report")).toEqual({ comparison: null });
  });

  it("includes the comparison in the report only when it is ticked", async () => {
    mount();
    await compare();
    fireEvent.click(screen.getByLabelText("Include this comparison in the report"));
    bridge.reply("preview_lifetime_report", "report");
    fireEvent.click(screen.getByRole("button", { name: "Preview report" }));
    await waitFor(() => expect(bridge.callsTo("preview_lifetime_report")).toHaveLength(1));
    expect(bridge.argsOf("preview_lifetime_report")).toEqual({
      comparison: { left_name: "Gaming", right_name: "Work" },
    });
  });

  it("announces a failed comparison instead of leaving the panel silent", async () => {
    bridge.fail("compare_lifetime_profiles", "SIGNATURE: the profile is not signed");
    mount();
    fireEvent.change(screen.getByLabelText("Profile A"), { target: { value: "Gaming" } });
    fireEvent.change(screen.getByLabelText("Profile B"), { target: { value: "Work" } });
    fireEvent.click(screen.getByRole("button", { name: "Compare profiles" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "SIGNATURE: the profile is not signed",
    );
  });

  it("has no accessibility violations, before and after a comparison", async () => {
    const { container } = mount();
    expect((await axe(container)).violations).toEqual([]);
    await compare();
    expect((await axe(container)).violations).toEqual([]);
  });

  it("labels both selects and groups the results under their own headings", async () => {
    mount();
    await compare();
    const selectors = screen.getByRole("heading", { level: 3, name: c.profiles }).parentElement!;
    expect(within(selectors).getAllByRole("combobox")).toHaveLength(2);
  });
});
