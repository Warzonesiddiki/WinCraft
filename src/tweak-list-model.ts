// Which controls a section shows, and in what order.
//
// Extracted from App.tsx unchanged, so the rule can be tested without mounting
// the shell: the search looks across every section, a category view is ordered
// by the catalogue's own feature order, and the screens that are not a tweak
// category show none.
import type { Strings } from "./i18n";
import { orderSectionTweaks } from "./feature-order";
import { textFor } from "./lib";
import type { Section, TweakInfo } from "./types";

export function tweaksForSection(
  tweaks: TweakInfo[],
  filter: Section,
  query: string,
  s: Strings,
): TweakInfo[] {
  // Turbo Boost is deliberately excluded: it has its own dedicated card on
  // the Gaming screen, so listing it again would show two controls for it.
  const base = tweaks.filter((t) => t.id !== "turbo_boost");

  // While searching, ignore the selected section and look everywhere —
  // otherwise the user has to already know which category a tweak lives in,
  // which is exactly what the search is there to avoid.
  if (query.trim().length > 0) {
    const needle = query.trim().toLowerCase();
    return base.filter((t) => {
      const text = textFor(s.tweaks, t.id, t.name, t.description);
      return (
        text.name.toLowerCase().includes(needle) || text.description.toLowerCase().includes(needle)
      );
    });
  }

  if (
    filter === "overview" ||
    filter === "scan" ||
    filter === "health" ||
    filter === "hardware" ||
    filter === "startup" ||
    filter === "pricing" ||
    filter === "profiles"
  )
    return [];

  const inCategory = base.filter((t) => t.category === filter);

  return orderSectionTweaks(inCategory, filter);
}
