import { de } from "./locales/de";
import { en } from "./locales/en";
import { es } from "./locales/es";
import { fr } from "./locales/fr";
import { it } from "./locales/it";
import { pt } from "./locales/pt";
import type { Lang, Strings } from "./i18n";

/**
 * Every table, in one place, for the code that needs all six at once: the i18n
 * gates, the live-metrics suite, the catalogue drift guard, and the tests that
 * assert a translated string. The app must never import this module — doing so
 * would pull all 562 kB of strings back into the entry chunk, which is exactly
 * what splitting them out was for (see `src/i18n.ts`).
 */
export const STRINGS: Record<Lang, Strings> = { it, en, fr, es, de, pt };
