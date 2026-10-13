// Fails when the built site can show a reader a page with its content missing.
//
// That is not hypothetical. The entrance animations used to be rendered by an
// animation library, which writes an element's *start* state into the markup —
// so the prerendered homepage carried 47 blocks at `opacity:0`, waiting for a
// bundle that a crawler does not run, that a blocked or failed request never
// delivers, and that a phone on a slow connection delivers seconds late. The
// bytes were there; the headings, feature copy and metric labels were not.
//
// The replacement (`src/reveal.tsx`) never writes a hidden state into the
// markup and only ever hides an element from inside a running observer, which
// is an invariant three separate things can break:
//
//   1. a component that animates itself into view from an inline start state;
//   2. a stylesheet rule that hides `.reveal` without the `[data-reveal-armed]`
//      gate its group sets after the observer exists;
//   3. a reduced-motion reader, who must never be shown a hidden state at all.
//
// Each is checked here against the built output rather than the source, because
// the built output is what a reader gets.
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";

/** One sentence and an exit code; a stack trace would bury the fix. */
function fail(message) {
  console.error(`reveal safety FAILED: ${message}`);
  process.exit(1);
}

const dist = new URL("../dist/", import.meta.url);

/** Every prerendered page, in a stable order.
 *
 *  Directory URLs are built with a trailing slash on purpose: resolving a name
 *  against a base without one replaces the base's last segment, so the walk
 *  would read pages from the wrong place. */
async function pages(dir = new URL("./", dist), prefix = "") {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name === "assets") continue;
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      found.push(...(await pages(new URL(`${entry.name}/`, dir), path)));
    } else if (entry.name.endsWith(".html")) {
      found.push({ path, url: new URL(entry.name, dir) });
    }
  }
  return found.sort((a, b) => a.path.localeCompare(b.path));
}

const prerendered = await pages();
if (prerendered.length === 0) fail("No prerendered pages found — did the build change?");

/* ── 1. The HTML must not carry a hidden start state ─────────────────────── */

/** Inline styles that hide an element. This is the shape the regression took:
 *  the animation library wrote its start state into the markup, so 47 blocks on
 *  the homepage shipped invisible and waited for a bundle. */
const HIDING_STYLE = /style="[^"]*(?:opacity:\s*0(?!\.)|visibility:\s*hidden|display:\s*none)/i;

/** Hidden *and* marked `aria-hidden="true"` is a deliberate reservation, not an
 *  animation waiting to run: the promo components hold a card's exact room
 *  invisibly while the offer request is in flight, so the page does not jump
 *  when the answer arrives. Nothing that animates in is ever aria-hidden, which
 *  is what makes this a safe escape hatch — and it is counted in the report, so
 *  a new one shows up as a number that changed rather than as a silent pass. */
const DELIBERATE = /aria-hidden="true"/;

let reserved = 0;
for (const { path, url } of prerendered) {
  const html = await readFile(url, "utf8");
  for (const tag of html.matchAll(/<[a-z][^>]*>/gi)) {
    if (!HIDING_STYLE.test(tag[0])) continue;
    if (DELIBERATE.test(tag[0])) {
      reserved += 1;
      continue;
    }
    const at = html.slice(Math.max(0, tag.index - 60), tag.index + 40).replace(/\s+/g, " ");
    fail(
      `${path} hides content in its markup without saying so to assistive tech: …${at}… ` +
        `A hidden start state in the prerendered HTML is content that is missing for every reader ` +
        `whose script did not run, so animate from a visible state instead (see src/reveal.tsx).`,
    );
  }
  if (/stroke-dashoffset/.test(html)) {
    fail(
      `${path} renders an SVG path in its "not yet drawn" state, which the prerenderer wrote out because ` +
        `the animation owned it. Draw the full path in the markup and animate from there.`,
    );
  }
}

/* ── 2. The stylesheet may only hide an element under the armed gate ─────── */

const assetsUrl = new URL("assets/", dist);
const assets = await readdir(assetsUrl);
const css = (
  await Promise.all(
    assets
      .filter((name) => name.endsWith(".css"))
      .map((name) => readFile(new URL(name, assetsUrl), "utf8")),
  )
).join("\n");

/**
 * Every rule with its at-rule context, so a `@keyframes` step is not mistaken
 * for a selector and a `@media` block is not mistaken for the page's defaults.
 * The minifier leaves the syntax regular enough that this does not need a real
 * parser: a declaration body never contains a brace.
 */
function rulesIn(source) {
  const found = [];
  const open = [];
  let buffer = "";
  for (const character of source) {
    if (character === "{") {
      open.push(buffer.trim());
      buffer = "";
    } else if (character === "}") {
      const body = buffer;
      const selector = open.pop() ?? "";
      found.push({ selector, body, inside: [...open] });
      buffer = "";
    } else {
      buffer += character;
    }
  }
  return found;
}

const rules = rulesIn(css);
const animationSelectors = /\.reveal|\.trace-draw|\.timeline-badge/;
const HIDES = /opacity:\s*0(?!\.)|visibility:\s*hidden|stroke-dashoffset:\s*1[^0-9]/;

const hiding = rules.filter(
  (rule) =>
    !rule.inside.some((at) => at.startsWith("@keyframes")) &&
    animationSelectors.test(rule.selector) &&
    HIDES.test(rule.body),
);

for (const rule of hiding) {
  if (!rule.selector.includes("[data-reveal-armed]")) {
    fail(
      `"${rule.selector}" hides an animated element without waiting for [data-reveal-armed]. ` +
        `A group only sets that attribute after its observer is running, so hiding without it can ` +
        `leave content invisible with nothing left to reveal it.`,
    );
  }
}

/** The rule that does the hiding has to still be there: gated hiding rules that
 *  nobody applies would pass every check above while the animation silently
 *  stopped running, which is the other way this can go wrong. */
const gate = rules.some(
  (rule) =>
    !rule.inside.some((at) => at.startsWith("@keyframes")) &&
    rule.selector
      .split(",")
      .some((selector) => selector.trim() === "[data-reveal-armed] .reveal") &&
    /opacity:\s*0(?!\.)/.test(rule.body),
);
if (!gate) {
  fail(
    "Nothing hides `.reveal` under [data-reveal-armed] any more, so the entrance animation is not " +
      "running at all. Check that src/index.css still has the reveal block and that RevealGroup is used.",
  );
}

/* ── 3. The entrance must be an animation, not a transition ─────────────── */

/** Rules that target a `.reveal` element itself rather than something inside
 *  one: the last compound selector is what the rule styles, so
 *  `[data-reveal-armed] .reveal .trace-draw` targets the trace while
 *  `[data-reveal-armed] .reveal[data-revealed]` targets the reveal. */
function targetsReveal(rule) {
  return rule.selector.split(",").some((selector) => {
    const last = selector.trim().split(/\s+/).pop() ?? "";
    const compound = last.split("[")[0];
    return compound === ".reveal" || compound.startsWith(".reveal:");
  });
}

/** A transition declaration that overrides something. `transition: none` is the
 *  reduced-motion block switching transitions off on purpose. */
function declaresTransition(body) {
  return body
    .split(";")
    .map((declaration) => declaration.split(":"))
    .some(
      ([property, value]) => property.trim().startsWith("transition") && value.trim() !== "none",
    );
}

/**
 * A transition here silently breaks the animations these elements already had.
 * This stylesheet is unlayered and Tailwind's utilities are not, so a
 * `transition:` on `.reveal` beats the `transition-all duration-500` the card
 * classes carry: the hover lift and the border fade on fifteen cards stopped
 * easing and started snapping, and the stagger `transition-delay` leaked onto
 * every property each card transitioned. The entrance is a keyframe animation
 * instead, which touches none of those properties.
 */
const clobbering = rules.filter((rule) => targetsReveal(rule) && declaresTransition(rule.body));
for (const rule of clobbering) {
  fail(
    `"${rule.selector}" puts a transition on the reveal itself, which overrides the transition ` +
      `utilities the same element carries (unlayered CSS beats @layer utilities), so hover effects on ` +
      `those elements stop easing. Animate the entrance with @keyframes instead.`,
  );
}

/** And the animation has to be wired to something that actually waits. */
const wired = rules.some(
  (rule) =>
    rule.selector.includes("[data-reveal-waiting]") &&
    rule.selector.includes("[data-revealed]") &&
    rule.body.includes("animation:") &&
    rule.body.includes("reveal-in"),
);
if (!wired) {
  fail(
    "Nothing animates an element that waited below the fold, so the entrance animation is not running " +
      "at all and the page simply snaps into view. Check that src/index.css still has the reveal-in " +
      "rule and that src/reveal.tsx sets data-reveal-waiting.",
  );
}

/* ── 4. Reduced motion must never be shown a hidden state ───────────────── */

const reduced = rules.filter(
  (rule) =>
    rule.inside.some((at) => at.includes("prefers-reduced-motion")) &&
    rule.selector.includes("[data-reveal-armed] .reveal"),
);
const neutralised = reduced.some(
  (rule) => /opacity:\s*1/.test(rule.body) && /transform:\s*none/.test(rule.body),
);
if (!neutralised) {
  fail(
    "The reduced-motion block no longer shows revealed elements: a reader who asked for less motion " +
      "would see the hidden state that the animation is supposed to move away from.",
  );
}

console.log(
  `reveal safety ok: ${prerendered.length} prerendered pages carry no hidden start state ` +
    `(${reserved} deliberate reservation(s) marked aria-hidden), ` +
    `${hiding.length} hiding rule(s) are gated on [data-reveal-armed], reduced motion neutralises them.`,
);

// Keeps `assert` imported for the same reason the other gates use it: a future
// edit that swaps these reports for assertions should not have to add it back.
assert.ok(true);
