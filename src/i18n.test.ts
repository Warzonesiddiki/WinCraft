import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { LANGUAGES, detectInitialLang, langOfTable, loadStrings, stringsFor } from "./i18n";
import { STRINGS } from "./i18n-tables";
import { en } from "./locales/en";

/**
 * A table's shape, with every string replaced by a marker and the keys sorted:
 * two languages have the same shape when they have the same keys in the same
 * nesting, whatever words are in them.
 */
const shapeOf = (value: unknown): string =>
  JSON.stringify(value, (_key, item: unknown) => {
    if (typeof item === "string") return "·";
    if (item && typeof item === "object" && !Array.isArray(item))
      return Object.fromEntries(Object.entries(item).sort(([a], [b]) => a.localeCompare(b)));
    return item;
  });

beforeEach(() => localStorage.clear());
afterEach(() => localStorage.clear());

describe("language tables", () => {
  it("answers with English until the chosen language's table has been read", async () => {
    // There is a window between the choice and the chunk: the app draws English
    // in it rather than an empty window. `main.tsx` has usually closed it before
    // the first frame — this is the safety net underneath that.
    expect(stringsFor("de")).toBe(en);

    const table = await loadStrings("de");
    expect(table).not.toBe(en);
    expect(table.appName).toBe(STRINGS.de.appName);
    // And from then on the table is what the app reads.
    expect(stringsFor("de")).toBe(table);
  });

  it("reads a language once, whatever else asks for it", async () => {
    const [first, second] = await Promise.all([loadStrings("fr"), loadStrings("fr")]);
    expect(second).toBe(first);
    expect(await loadStrings("fr")).toBe(first);
  });

  it("answers for English without fetching anything", async () => {
    // English is in the bundle: the product's primary language and every other
    // language's fallback. It cannot be a chunk or the app would start without it.
    expect(stringsFor("en")).toBe(en);
    expect(await loadStrings("en")).toBe(en);
  });

  it("names the language a table belongs to, by the table itself", async () => {
    // The list filter is handed a table, not a code, and has to name it.
    expect(langOfTable(en)).toBe("en");
    // A language that has been read is named by its own table...
    expect(langOfTable(await loadStrings("pt"))).toBe("pt");
    expect(await loadStrings("pt")).toBe(STRINGS.pt);
    // ...and one that has not is not reported as the language it fell back from:
    // English is English, whoever else is waiting for theirs.
    expect(langOfTable(stringsFor("it"))).toBe("en");
  });

  it("takes the stored language before any table has been read", () => {
    expect(detectInitialLang()).toBe("en");
    localStorage.setItem("wincraft-lang", "pt");
    expect(detectInitialLang()).toBe("pt");
    // A leftover from an older build, or a hand-edited setting, is ignored rather
    // than becoming a language the app cannot draw.
    localStorage.setItem("wincraft-lang", "nl");
    expect(detectInitialLang()).toBe("en");
  });

  it("keeps each language's copy in that language's table", () => {
    // A block-level mix-up shipped once: an index-based rewrite of the pricing
    // copy put the English text in the Italian table, the Italian in the
    // English one, the German in the French and the French in the German. Every
    // gate passed — all six tables still had every key, and every string was
    // distinct from its neighbours: it was simply in the wrong language.
    // Nothing can judge arbitrary copy automatically, so these pin the headline
    // of the section that was crossed. They move with the copy on purpose: a
    // silent swap is exactly what they exist to make impossible.
    expect(STRINGS.en.pricing.title).toBe("Free for everyone");
    expect(STRINGS.it.pricing.title).toBe("Gratis per tutti");
    expect(STRINGS.fr.pricing.title).toBe("Gratuit pour tous");
    expect(STRINGS.de.pricing.title).toBe("Kostenlos für alle");
    expect(STRINGS.es.pricing.title).toBe("Gratis para todos");
    expect(STRINGS.pt.pricing.title).toBe("Grátis para todos");
  });

  it("keeps every language's table the same shape as English", async () => {
    // The i18n gates compare the tables by key; this checks the same thing from
    // inside the app, where the tables are read one at a time. A language that
    // has drifted shows up as a missing or extra key rather than as a blank
    // string at runtime.
    const english = shapeOf(en);
    for (const { code } of LANGUAGES) {
      expect([code, shapeOf(await loadStrings(code)) === english]).toEqual([code, true]);
    }
  });
});
