import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { STRINGS } from "./i18n";
import { tweaksForSection } from "./tweak-list-model";
import type { Category, Section, TweakInfo } from "./types";

const s = STRINGS.en;

beforeEach(() => {
  document.documentElement.lang = "en";
});
afterEach(() => {
  document.documentElement.lang = "";
});

const tweak = (id: string, category: Category, extra: Partial<TweakInfo> = {}): TweakInfo => ({
  id,
  name: `Catalogue name of ${id}`,
  description: `Catalogue description of ${id}.`,
  category,
  hive: "HKCU",
  requires_admin: false,
  requires_pro: false,
  applied: false,
  changes: [],
  ...extra,
});

/** One entry per case the rule distinguishes, plus one the dictionary knows. */
const catalog: TweakInfo[] = [
  tweak("disable_game_dvr", "performance"),
  tweak("power_plan_performance", "performance"),
  tweak("turbo_boost", "gaming"),
  tweak("reduce_input_lag", "gaming"),
  // A control the translations name themselves: their words are the ones on
  // screen, and so the ones a search has to match.
  tweak("disable_click_to_do", "privacy"),
  tweak("made_up_control", "privacy"),
  tweak("enable_long_paths", "maintenance"),
];

const ids = (filter: Section, query = "") =>
  tweaksForSection(catalog, filter, query, s).map((t) => t.id);

describe("tweaksForSection", () => {
  it("lists only the section's own controls", () => {
    expect(ids("performance")).toEqual(["power_plan_performance", "disable_game_dvr"]);
    expect(ids("maintenance")).toEqual(["enable_long_paths"]);
  });

  it("leaves out the control that already has its own card on Gaming", () => {
    expect(ids("gaming")).toEqual(["reduce_input_lag"]);
    expect(ids("gaming", "turbo")).toEqual([]);
  });

  it("orders a section by the catalogue's own feature order", () => {
    // Both are named in the order list, so the list wins over the input order.
    const reversed = [catalog[0], catalog[1]];
    expect(tweaksForSection(reversed, "performance", "", s).map((t) => t.id)).toEqual([
      "power_plan_performance",
      "disable_game_dvr",
    ]);
    // A category with no order list keeps the order the catalogue sent.
    expect(ids("privacy", "")).toEqual(["disable_click_to_do", "made_up_control"]);
  });

  it("looks across every section while searching, not just the open one", () => {
    // Open on Maintenance, searching for something that lives in Gaming.
    expect(ids("maintenance", s.tweaks.reduce_input_lag.name.toLowerCase())).toEqual([
      "reduce_input_lag",
    ]);
    // A control no translation names is searched by its own catalogue words.
    expect(ids("maintenance", "catalogue name of made_up_control")).toEqual(["made_up_control"]);
  });

  it("searches the words on screen, so a translated name is what matches", () => {
    // The dictionary names this control; its catalogue text is therefore not
    // what the reader sees, and not what the search should match.
    const translated = s.tweaks.disable_click_to_do.name;
    expect(ids("performance", translated.toLowerCase())).toEqual(["disable_click_to_do"]);
    expect(ids("performance", "catalogue description of disable_click_to_do")).toEqual([]);
  });

  it("ignores a query that is only whitespace", () => {
    expect(ids("privacy", "   ")).toEqual(["disable_click_to_do", "made_up_control"]);
  });

  it("shows no controls on the screens that are not a tweak category", () => {
    for (const screen of [
      "overview",
      "scan",
      "health",
      "hardware",
      "startup",
      "pricing",
      "profiles",
    ] as const) {
      expect(ids(screen)).toEqual([]);
    }
  });
});
