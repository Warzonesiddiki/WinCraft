/**
 * The site's own origin, read from the file that already decides it.
 *
 * `src/seo.ts` builds every canonical and OpenGraph URL the site renders, so it
 * is where the origin genuinely lives. Both Node scripts in this directory need
 * it — `build-sitemap.mjs` to write the `<loc>` URLs, `check-seo.mjs` to assert
 * that the pages agree with them — and both used to restate it by hand instead.
 * That is how the sitemap and the gate kept pointing at the pre-rename domain
 * while every rendered page had already moved to the new one, so the deploy's
 * own SEO step (`npm run check:seo`, a blocking step in
 * `.github/workflows/deploy-site.yml`) failed on all 17 routes.
 *
 * Reading it from one place means the two can no longer disagree. If the line
 * this looks for ever stops matching, both scripts fail loudly rather than
 * silently checking a domain the site does not use.
 */
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../src/seo.ts", import.meta.url), "utf8");
const match = source.match(/^const ORIGIN = "([^"]+)";$/m);
if (!match) {
  throw new Error("site/scripts: could not read ORIGIN from site/src/seo.ts");
}

/** e.g. `https://wincraft.app`, with no trailing slash. */
export const ORIGIN = match[1];

/** `ORIGIN` as a regular-expression source, for matching URLs in text. */
export const ORIGIN_PATTERN = ORIGIN.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
