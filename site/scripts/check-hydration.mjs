// Fails when the built site hides content from a reader, or when the page and
// the markup disagree about what should be on it.
//
// `check-reveals.mjs` reads the built output; this runs it. It loads the real
// client bundle into a real DOM, hydrates the prerendered homepage, and then
// looks at what the reveal logic did — because the three ways this can go wrong
// are all invisible in a static file:
//
//   1. **Hydration.** The page is rendered twice, once on the server and once in
//      the browser. If the reveal markup differs between the two, React throws
//      the server's DOM away and rebuilds it, which is a visible flash on the
//      element that was supposed to be the largest one painted.
//   2. **The fold.** Anything on screen when the page loads must never be
//      hidden, not even for a frame: an element that fades in from nothing at
//      the top of the page is an element that is missing at first paint.
//   3. **The gate.** Below the fold, an element may only be hidden while an
//      observer is watching it, and a reader who asked for reduced motion must
//      never be shown a hidden state at all.
//
// The observer in a headless DOM never fires on its own, so this script decides
// when something scrolls into view, which is what makes the last two checkable.
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

/** One sentence and an exit code; a stack trace would bury the fix. */
function fail(message) {
  console.error(`hydration and reveals FAILED: ${message}`);
  process.exit(1);
}

const run = promisify(execFile);
const siteRoot = new URL("../", import.meta.url);
const dist = new URL("../dist/", import.meta.url);
const assets = await readdir(new URL("assets/", dist));
const bundleName = assets.find((name) => name.endsWith(".js"));
const stylesheetName = assets.find((name) => name.endsWith(".css"));
if (!bundleName || !stylesheetName)
  fail("No bundle or stylesheet in dist/assets — did the build change?");

const html = await readFile(new URL("index.html", dist), "utf8");
const bundle = await readFile(new URL(`assets/${bundleName}`, dist), "utf8");
const stylesheet = await readFile(new URL(`assets/${stylesheetName}`, dist), "utf8");

/**
 * A second build, in development mode.
 *
 * Production React does not report a hydration mismatch: it patches the
 * difference and carries on, which is the right thing for a reader and the
 * wrong thing for a check — a client that disagrees with the server would pass
 * every assertion here. Development React names the disagreement on
 * console.error, so this build exists to be listened to. It is written to its
 * own directory so the artifact that ships is untouched.
 */
const devOut = new URL("dist-hydration/", siteRoot);
try {
  await run(
    process.execPath,
    [
      fileURLToPath(new URL("node_modules/vite/bin/vite.js", siteRoot)),
      "build",
      "--mode",
      "development",
      "--outDir",
      fileURLToPath(devOut),
      "--emptyOutDir",
    ],
    // `--mode development` alone still left React's production build in place:
    // NODE_ENV is what selects the development entry point.
    { cwd: fileURLToPath(siteRoot), env: { ...process.env, NODE_ENV: "development" } },
  );
} catch (error) {
  fail(
    `The development build needed to hear React's own reports failed: ${String(error).slice(0, 400)}`,
  );
}
const devAssets = await readdir(new URL("assets/", devOut));
const devBundleName = devAssets.find((name) => name.endsWith(".js"));
if (!devBundleName) fail("The development build produced no JavaScript.");
const devBundle = await readFile(new URL(`assets/${devBundleName}`, devOut), "utf8");

/** What React says when the server's markup and the browser's disagree. */
const HYDRATION_COMPLAINT =
  /hydrat|did not match|server HTML|Text content|Expected server|tree hydrated|server-rendered/i;

const FOLD = 5000;

/** One page load, played out to the end, with the knobs a browser would have. */
async function load({ id, source, reducedMotion = false, onScreen = false, url = "https://wincraft.app/" }) {
  const { JSDOM } = await import("jsdom");
  const dom = new JSDOM(html, { url, pretendToBeVisual: true });
  const { window } = dom;

  // React writes to console.error for a hydration mismatch. It runs in this
  // realm, not the DOM's — replacing `window.console` would capture nothing and
  // the assertions below would pass without ever looking at anything — so the
  // process console is the one that gets wrapped, and put back afterwards.
  const realConsole = globalThis.console;
  const complaints = [];
  const capture = {
    ...realConsole,
    log: () => {},
    error: (...args) => complaints.push(String(args[0])),
    warn: (...args) => complaints.push(`warn: ${String(args[0])}`),
  };
  globalThis.console = capture;
  window.console = capture;

  const observers = [];
  class FakeIntersectionObserver {
    constructor(callback, options) {
      this.callback = callback;
      this.options = options;
      this.targets = new Set();
      observers.push(this);
    }
    observe(element) {
      this.targets.add(element);
    }
    unobserve(element) {
      this.targets.delete(element);
    }
    disconnect() {
      this.targets.clear();
    }
  }

  globalThis.window = window;
  globalThis.document = window.document;
  Object.defineProperty(globalThis, "navigator", { value: window.navigator, configurable: true });
  globalThis.IntersectionObserver = FakeIntersectionObserver;
  window.IntersectionObserver = FakeIntersectionObserver;
  globalThis.requestAnimationFrame = (callback) => setTimeout(() => callback(0), 0);
  globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
  globalThis.matchMedia = window.matchMedia = () => ({
    matches: reducedMotion,
    addEventListener() {},
    removeEventListener() {},
  });
  globalThis.fetch = window.fetch = () => Promise.reject(new Error("offline"));
  globalThis.location = window.location;
  globalThis.HTMLElement = window.HTMLElement;
  globalThis.HTMLAnchorElement = window.HTMLAnchorElement;
  globalThis.Node = window.Node;
  globalThis.Event = window.Event;
  globalThis.CustomEvent = window.CustomEvent;
  globalThis.MutationObserver = window.MutationObserver;
  globalThis.getComputedStyle = window.getComputedStyle;
  globalThis.localStorage = window.localStorage;

  const reveals = () => [...window.document.querySelectorAll(".reveal")];
  const hiddenInline = () => window.document.querySelectorAll('[style*="opacity:0"]').length;
  const count = () => ({
    total: reveals().length,
    shown: reveals().filter((element) => element.hasAttribute("data-revealed")).length,
    observed: observers.reduce((total, observer) => total + observer.targets.size, 0),
    armed: window.document.querySelectorAll("[data-reveal-armed]").length,
    // What the entrance animation is wired to: only an element that waited
    // below the fold animates back in, so this is the count that proves the
    // animation has a subject and that on-screen content does not animate.
    waiting: reveals().filter((element) => element.hasAttribute("data-reveal-waiting")).length,
  });

  const prerendered = { ...count(), hiddenInline: hiddenInline() };

  // Everything sits below the fold unless the scenario says otherwise, which is
  // the state where the page decides whether to hide something.
  const top = onScreen ? 0 : FOLD;
  const rect = () => ({
    top,
    bottom: top + 100,
    left: 0,
    right: 100,
    width: 100,
    height: 100,
    x: 0,
    y: top,
  });
  window.Element.prototype.getBoundingClientRect = rect;
  for (const element of reveals()) element.getBoundingClientRect = rect;

  // A unique data URL per scenario: module imports are cached by URL, and a
  // cached bundle would never run against this scenario's DOM.
  const program = `${source}\n// scenario ${id}\n`;
  await import(`data:text/javascript;base64,${Buffer.from(program).toString("base64")}`);
  await new Promise((resolve) => setTimeout(resolve, 120));
  const mounted = count();

  // The hiding is a stylesheet rule, so what matters is what an element
  // computes to. jsdom does not fetch <link> resources, hence the injection.
  const style = window.document.createElement("style");
  style.textContent = stylesheet;
  window.document.head.append(style);

  const waiting = reveals().find(
    (element) => !element.hasAttribute("data-revealed") && element.closest("[data-reveal-armed]"),
  );
  const whileWaiting = waiting ? window.getComputedStyle(waiting).opacity : null;

  for (const observer of observers) {
    observer.callback([...observer.targets].map((target) => ({ target, isIntersecting: true })));
  }
  await new Promise((resolve) => setTimeout(resolve, 60));

  const revealed = reveals().find((element) => element.hasAttribute("data-revealed"));
  const afterScrolling = {
    ...count(),
    whileWaiting,
    revealedOpacity: revealed ? window.getComputedStyle(revealed).opacity : null,
  };

  // What the page says after it has hydrated: the tip acknowledgement is the
  // only state the site renders from the URL, so it is the one thing to look
  // for besides the reveal counts.
  const banner = window.document.querySelector('[role="status"]')?.textContent?.trim() ?? null;

  window.close();
  globalThis.console = realConsole;
  return { prerendered, mounted, afterScrolling, complaints, banner };
}

const belowFold = await load({ id: "below-the-fold", source: bundle });
const onScreen = await load({ id: "on-screen", source: bundle, onScreen: true });
const reducedMotion = await load({ id: "reduced-motion", source: bundle, reducedMotion: true });
const development = await load({ id: "development", source: devBundle });
// The tip flow's return address. The host serves this path from the page the
// prerender writes for it, and that page is the homepage tree — which is what
// this loads — so hydration here is the same comparison the browser makes, plus
// the one difference that is the point of the route.
const tipThanks = await load({
  id: "tip-thanks",
  source: bundle,
  url: "https://wincraft.app/tip-thanks/",
});

for (const [name, result] of [
  ["below the fold", belowFold],
  ["on screen", onScreen],
  ["reduced motion", reducedMotion],
  ["development build", development],
  ["tip thanks", tipThanks],
]) {
  if (result.prerendered.hiddenInline !== 0) {
    fail(
      `${name}: the prerendered markup hides ${result.prerendered.hiddenInline} element(s) inline.`,
    );
  }
  if (result.prerendered.total === 0) fail(`${name}: no .reveal elements were rendered at all.`);
  if (result.complaints.length > 0) {
    fail(
      `${name}: hydrating the page produced ${result.complaints.length} console error(s), the first being ` +
        `"${result.complaints[0].slice(0, 160)}". The server's markup and the browser's markup have to match.`,
    );
  }
}

// The tip acknowledgement is the only thing this site renders from the URL, and
// the page it belongs on is the one a completed tip is returned to.
if (tipThanks.banner === null) {
  fail(
    "tip thanks: /tip-thanks hydrated without the tip acknowledgement. The backend returns a " +
      "completed tip to this path, so a visitor who just paid would see the homepage and no sign " +
      "that anything happened.",
  );
}
if (!/support/i.test(tipThanks.banner)) {
  fail(`tip thanks: the acknowledgement reads "${tipThanks.banner.slice(0, 120)}", not a thanks.`);
}
if (belowFold.banner !== null) {
  fail(
    `that the homepage says "${belowFold.banner.slice(0, 120)}": the acknowledgement appears without ` +
      "being asked for, so it would greet every visitor.",
  );
}

// Development React reports what production React silently repairs, so this is
// the run that would catch a client which no longer agrees with the server.
const disagreements = development.complaints.filter((line) => HYDRATION_COMPLAINT.test(line));
if (disagreements.length > 0) {
  fail(
    `the development build reported ${disagreements.length} hydration disagreement(s), the first being ` +
      `"${disagreements[0].slice(0, 200)}". Whatever renders differently in the browser throws away the ` +
      `server's markup and rebuilds that part of the page.`,
  );
}

if (belowFold.afterScrolling.armed === 0) {
  fail("below the fold: no group armed itself, so nothing would ever animate in.");
}
if (belowFold.mounted.shown !== 0 || belowFold.mounted.observed !== belowFold.mounted.total) {
  fail(
    `below the fold: ${belowFold.mounted.shown} of ${belowFold.mounted.total} elements were treated as ` +
      `already on screen and ${belowFold.mounted.observed} were observed; expected all ` +
      `${belowFold.mounted.total} to be waiting on the observer.`,
  );
}
if (belowFold.afterScrolling.whileWaiting !== "0") {
  fail(
    `below the fold: an element waiting to animate computes to opacity ` +
      `${belowFold.afterScrolling.whileWaiting}, so it is either visible before its turn or hidden by ` +
      `something other than the armed reveal rule.`,
  );
}
if (belowFold.mounted.waiting !== belowFold.mounted.total) {
  fail(
    `below the fold: ${belowFold.mounted.total - belowFold.mounted.waiting} of ${belowFold.mounted.total} ` +
      `element(s) were not marked as waiting, so the entrance animation has nothing to run on and the ` +
      `page would snap into view instead of revealing.`,
  );
}
if (onScreen.mounted.waiting !== 0) {
  fail(
    `on screen: ${onScreen.mounted.waiting} element(s) at or above the fold were marked as waiting to ` +
      `animate in. Content the reader is already looking at must not be part of an entrance.`,
  );
}
if (belowFold.afterScrolling.total !== belowFold.afterScrolling.shown) {
  fail(
    `below the fold: ${belowFold.afterScrolling.total - belowFold.afterScrolling.shown} element(s) stayed ` +
      `hidden after the observer reported them on screen.`,
  );
}
if (belowFold.afterScrolling.revealedOpacity !== "1") {
  fail(
    `below the fold: a revealed element computes to opacity ${belowFold.afterScrolling.revealedOpacity} ` +
      `instead of 1.`,
  );
}

if (
  onScreen.mounted.shown !== onScreen.mounted.total ||
  onScreen.afterScrolling.whileWaiting !== null
) {
  fail(
    `on screen: ${onScreen.mounted.total - onScreen.mounted.shown} element(s) at or above the fold were ` +
      `not marked shown immediately. Content that is on screen must never be hidden, not even for a frame.`,
  );
}
if (onScreen.afterScrolling.revealedOpacity !== "1") {
  fail("on screen: an element on screen does not compute to opacity 1.");
}

if (reducedMotion.mounted.armed !== 0 || reducedMotion.mounted.observed !== 0) {
  fail(
    `reduced motion: ${reducedMotion.mounted.armed} group(s) armed and ${reducedMotion.mounted.observed} ` +
      `element(s) were observed. A reader who asked for less motion must never be shown a hidden state.`,
  );
}

assert.equal(belowFold.mounted.total, onScreen.mounted.total);
console.log(
  `hydration and reveals ok: ${belowFold.mounted.total} reveals over ${belowFold.mounted.armed} groups ` +
    `hydrate without a console error; nothing on screen is hidden, ${belowFold.mounted.total} below-fold ` +
    `elements are hidden only while observed and shown when scrolled to, and reduced motion never hides. ` +
    `The tip return address (/tip-thanks) hydrates into the homepage and shows the acknowledgement. ` +
    `${development.complaints.length} report(s) from the development build.`,
);
