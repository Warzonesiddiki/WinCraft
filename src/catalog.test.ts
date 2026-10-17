import { describe, expect, it } from "vitest";
import {
  CONFIGURABLE_TWEAK_IDS,
  MANUAL_ONLY_TWEAK_IDS,
  RETIRED_TWEAK_IDS,
  buildName,
  isCurrentCatalogTweak,
} from "./catalog";
import { LANGUAGES } from "./i18n";
import { STRINGS } from "./i18n-tables";
import { CATEGORY_STYLE } from "./categories";

describe("buildName", () => {
  it("names the builds people know and falls back for the rest", () => {
    expect(buildName(22631)).toBe("Windows 11 23H2");
    expect(buildName(26100)).toBe("Windows 11 24H2");
    expect(buildName(99999)).toBe("Windows build 99999");
  });
});

describe("isCurrentCatalogTweak", () => {
  it("keeps retired entries restorable but out of the current catalogue", () => {
    expect(isCurrentCatalogTweak("disable_game_dvr")).toBe(true);
    for (const id of RETIRED_TWEAK_IDS) expect(isCurrentCatalogTweak(id)).toBe(false);
  });
});

describe("the ids the app special-cases", () => {
  const special = [...CONFIGURABLE_TWEAK_IDS, ...MANUAL_ONLY_TWEAK_IDS, ...RETIRED_TWEAK_IDS];

  it("each have a translated name in every locale", () => {
    // A renamed or added id with no translation would show the English the
    // Rust side ships, inside an otherwise translated screen.
    for (const { code } of LANGUAGES) {
      for (const id of special) {
        const text = STRINGS[code].tweaks[id];
        expect(text, `${code}: ${id}`).toBeTruthy();
        expect(text.name.trim().length, `${code}: ${id} name`).toBeGreaterThan(0);
        expect(text.description.trim().length, `${code}: ${id} description`).toBeGreaterThan(0);
      }
    }
  });

  it("are not both configurable and manual-only: those are different paths", () => {
    for (const id of MANUAL_ONLY_TWEAK_IDS) expect(CONFIGURABLE_TWEAK_IDS.has(id)).toBe(false);
  });
});

describe("CATEGORY_STYLE", () => {
  it("gives every category a complete style set, so no section renders unstyled", () => {
    // The type requires these fields; this catches a category that was added
    // with an empty or placeholder entry.
    for (const [category, style] of Object.entries(CATEGORY_STYLE))
      for (const field of ["chip", "ring", "icon"] as const) {
        expect(style[field], `${category}.${field}`).toBeTruthy();
      }
  });
});
