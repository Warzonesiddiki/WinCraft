// Every URL this repository publishes on its own origin has to name a route or
// a file the site actually ships.
//
// This is `check-download-links.mjs` one origin over, and it exists for the
// same reason: nothing read a wincraft.app URL, so a link to a page that does
// not exist looked exactly like one that does. The tip flow returned buyers to
// `https://wincraft.app/tip-thanks`, a path with no route — GitHub Pages
// answered with the 404 page — and the backend's own pages (`/checkout-success`,
// `/checkout-cancel`, `/tip-thanks`) live on the API origin, so pointing at them
// through this origin is a 404 whichever way the deployment is configured.
//
// What counts as existing:
//   - a route in `site/public/sitemap.xml` (checked in, regenerated with
//     `npm run sitemap`);
//   - a route in the site's `ROUTE_SEO` table — a few are deliberately kept out
//     of the sitemap, `/tip-thanks` among them;
//   - a file under `site/public/` (images, robots.txt, security.txt, the Tweaky
//     Driver page and its own assets);
//   - the bare origin, or any of the above with a query string or a fragment.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// `fileURLToPath`, not `.pathname`: on Windows a URL pathname starts with a
// slash before the drive letter and `path.resolve` would then walk `C:\C:\…`.
const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const siteRoot = path.join(root, "site");

const ORIGIN = "https://wincraft.app";

const SKIP_DIRS = new Set(["node_modules", "coverage", "target", ".git"]);
const skipDir = (name) => SKIP_DIRS.has(name) || name.startsWith("dist");
const TEXT_EXT = new Set([
  ".md",
  ".ts",
  ".tsx",
  ".js",
  ".mjs",
  ".cjs",
  ".json",
  ".yml",
  ".yaml",
  ".ps1",
  ".xml",
  ".txt",
  ".html",
  ".css",
  ".rs",
  ".py",
]);
const MAX_BYTES = 2 * 1024 * 1024;

/** Routes the backend serves on its own origin, for the hint on a failure. */
const BACKEND_ROUTES = ["/checkout-success", "/checkout-cancel", "/tip-thanks"];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") && entry.name !== ".github" && entry.name !== ".well-known")
      continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!skipDir(entry.name)) walk(full, out);
      continue;
    }
    if (!TEXT_EXT.has(path.extname(entry.name))) continue;
    if (fs.statSync(full).size > MAX_BYTES) continue;
    out.push(full);
  }
  return out;
}

/** Every path the site can answer, in both slash forms. */
function sitePaths() {
  const paths = new Set(["/"]);

  const add = (value) => {
    if (!value.startsWith("/")) return;
    paths.add(value);
    paths.add(value.endsWith("/") ? value.slice(0, -1) || "/" : `${value}/`);
  };

  const sitemap = fs.readFileSync(path.join(siteRoot, "public", "sitemap.xml"), "utf8");
  for (const [, loc] of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const { pathname } = new URL(loc);
    add(pathname);
  }

  // The route table, read as text: this script runs before the site is built,
  // and what it needs is the set of path keys, not their copy.
  const seo = fs.readFileSync(path.join(siteRoot, "src", "seo.ts"), "utf8");
  for (const [, route] of seo.matchAll(/^\s*"(\/[^"]*)":\s*\{/gm)) add(route);

  const publicDir = path.join(siteRoot, "public");
  const walkPublic = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkPublic(full);
        continue;
      }
      const rel = path.relative(publicDir, full).split(path.sep).join("/");
      if (rel === "index.html" || rel === "404.html") continue;
      if (rel.endsWith("/index.html")) add(`/${rel.slice(0, -"index.html".length)}`);
      else add(`/${rel}`);
    }
  };
  walkPublic(publicDir);

  return paths;
}

const paths = sitePaths();
const problems = [];
let urlCount = 0;

const URL_PATTERN = new RegExp(`${ORIGIN.replace(/\./g, "\\.")}(/[^\\s"'<>)\\]}\`,]*)?`, "g");

for (const file of walk(root)) {
  const where = path.relative(root, file).split(path.sep).join("/");
  const text = fs.readFileSync(file, "utf8");
  text.split("\n").forEach((line, index) => {
    for (const [match, raw] of line.matchAll(URL_PATTERN)) {
      urlCount += 1;
      // A URL can end in a sentence's full stop, a closing bracket or a quote
      // the regex could not exclude, and inside a template literal it can run
      // straight into an escape sequence (\n\nWe) — trim both before judging.
      const target = (raw ?? "/").split("\\")[0].replace(/[.,;:)`"'\]]+$/, "");
      const { pathname } = new URL(`${ORIGIN}${target}`);
      if (pathname === "/" || paths.has(pathname)) continue;
      const backend = BACKEND_ROUTES.includes(pathname.replace(/\/$/, ""));
      problems.push(
        `${where}:${index + 1}: ${match} — the site has no route or file at ${pathname}.` +
          (backend
            ? ` The backend serves that page on its own origin (https://api.wincraft.app${pathname}), not on this one.`
            : ""),
      );
    }
  });
}

if (urlCount === 0) {
  problems.push(`no ${ORIGIN} URLs were found anywhere: this check has lost its subject`);
}

if (problems.length) {
  console.error("check-site-links: a published URL does not name a page the site ships.\n");
  for (const problem of problems) console.error(`  ${problem}`);
  console.error(
    `\n${problems.length} problem(s). The site answers ${paths.size} path(s); a new page has to be a ` +
      "route (see site/src/seo.ts) or a file under site/public/.",
  );
  process.exit(1);
}

console.log(
  `site links ok: ${urlCount} published URL(s) on ${ORIGIN} all name one of the ${paths.size} ` +
    "path(s) the site answers.",
);
