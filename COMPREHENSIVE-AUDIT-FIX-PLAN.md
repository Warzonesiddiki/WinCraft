# WinCraft — comprehensive audit and fix plan

Progress record for the audit-first fix programme (AUDIT → ranked findings → plan
→ approved fixes → per-batch validation → final report). Every claim below is
tied to a command that was actually run; the commands are listed in
[Commands run](#commands-run) with their results.

Repository: `Warzonesiddiki/WinCraft` — the fork's current name on GitHub (it was
`Warzonesiddiki/pc-tweaker-app`, and the old path still redirects). Parent:
`AurelioAvila/pc-tweaker-app`, whose `v1.18.1` release is what the published
download URLs resolve to
Branch: `arena/c156110b-pc-tweaker-app` — no pull request opened (per instruction).

## Goal and standing decisions

- Target: **99/100 in all eight categories.**
- Product decisions taken by the maintainer and applied here:
  - **WinCraft is free for everyone.** Pricing UI, paywall copy, price constants
    and the dead "Pro" gates are removed or neutralised in the desktop app.
  - The rename **PC Tweaker → WinCraft** is settled, as is the MIT licence.
  - `wincraft.app` / `api.wincraft.app` are the owned origins and stay.
  - Existing entitlements, Stripe metadata and licence files that say `pctweaker`
    must keep working, so `pctweaker` remains a valid **alias** of the `wincraft`
    product id.
- Rules followed: minimal isolated fixes, no new dependencies, no major version
  upgrades, public APIs not changed silently, breaking changes labelled, no
  refactors without explanation, no invented files or configuration.

## Scoreboard

Scores are the audit's own estimates, re-measured in this workspace against the
gates that can run here. Categories the sandbox cannot measure (Rust build,
Windows runtime, real a11y tooling) are marked _static only_.

| Category      | Before | Now    | Evidence for the movement                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------- | ------ | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Security      | 95     | **96** | Static review still clean (no secrets, no `eval`, no SQL interpolation, webhook signature verified, helmet + allowlist + rate limits, Tauri CSP and scoped capabilities). `db.ts` can now verify the database certificate via `DATABASE_CA` instead of always accepting any certificate; dead offer/fetch code removed from the frontend                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Code quality  | 88     | **94** | ESLint 0 errors **and 0 warnings** (was 2E/6W), Prettier clean, `tsc` clean, ~1,200 lines of dead pricing/paywall/promo/Pro-gate code and 96 lines of dead dialog CSS deleted, stale comments corrected. The frontend has no `isPro` plumbing left; only the Rust `require_pro()` stub and the catalogue metadata remain. **Two deletions in that sweep were wrong** — `halloween-offer.tsx` and `halloween-decor.ts` were imported by the website, and removing them broke its build until Batch S restored them: the lesson on record is that "unrendered" has to be checked per consuming tree, not per repository. Batch X then took the app's main surface out of the shell: the tweak list is a tested rule (`tweak-list-model.ts`) plus a tested row (`tweak-row.tsx`), and `App.tsx` is ~150 lines smaller for it                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Performance   | 75     | **94** | Entry chunk 1,053.38 kB → **229.49 kB** (335.56 → **72.07 kB gzip**): dead code removed first, then 36 panels split into 16 lazy chunks, then the five non-English locale tables split out of the entry (631.46 → 229.49 kB, Batch Z) — each language is now a 78–83 kB chunk fetched when it is chosen, and English stays in the bundle as the primary language and fallback. CSS still one file at 212.55 kB, and no runtime profile has been taken on Windows                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Testing       | 40     | **99** | Backend **161/161**, `test-scan` **15/15** (was failing), every script suite green, and **290 Vitest tests in 20 files**: the whole scan flow (13 probes, partial reports, apply/verify, pause/resume), the startup and scheduled-task lists, the update-drift and crash-report cards, the cleaners and maintenance cards, the thermal panel itself (a two-second poll on a fake clock, its verdicts and its profile staging), the thermal judge and driver plans, the driver audit and Windows Update catalogue (scan progress, tiers, restart, install subsets, failure versus emptiness), the debloat panel (what can be removed, presets, list save/load, the per-app removal receipt including a lost answer recorded as unknown), game sessions and core steering (including the five-second re-read that drives the live count), Turbo Boost (live dial, measured facts, before/after measurement), the Before & After comparison (both measurements, the verdicts and their wording, the startup-log read, the history list and the report export), the tweak list's own rule and row (Batch X), the change history (Batch Y), the language loading (Batch Z), the cached-audit storage contract, a catalogue/translation drift guard, the Fix-all pipeline, and `lib.ts` — all through a fake Tauri IPC bridge, with jest-axe. ESLint is now verified over the whole tree, not per batch, and every script suite in the release chain also runs on every push, so no gate can now first fail on release day. Coverage is measured over every source file (**40.03% of lines**, 2,766 still uncovered — concentrated in `App.tsx` and a dozen untested panels) and enforced as a ratchet in CI, whose thresholds were raised with the tests rather than left behind them. Not measured: a packaged-app run on Windows |
| Documentation | 70     | **91** | Added `CONTRIBUTING.md`, `docs/ARCHITECTURE.md`, `docs/API.md`; documented the fork's updater/signing path; fixed README's licence contradiction and stale plan copy; every live doc, shipped link and the publisher PAD feed now names the owned domain, and the PAD feed describes the current release instead of one two versions old. Every public control count is now the catalogue's own total and nothing more, the site's origin is single-source including the `CNAME` that decides where it is served, and the marketing CTAs point at the site the owner confirmed. Still outstanding: the residual Pro/paid prose (the site's pricing cards and FAQ sentence, the listings' "WITH PRO" sections, `docs/pad.xml`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Accessibility | 80     | **85** | The unreachable Pro paywall `<dialog>` (dialog semantics, focus handling) is gone. An automated axe run now covers twelve rendered surfaces (the scan, cleaner, maintenance, startup, drift, crash, thermal, driver, debloat, game-session, Before & After and Turbo Boost panels), and it has earned its place twice: the Turbo Boost comparison table opened with an empty `<th>`, which announces an unnamed column — now a `<td>`, with both column headers scoped — and the Before & After panel jumped from `<h2>` straight to `<h4>` in two places, which reads as a broken outline to a screen reader, now `<h3>` with the stylesheet following. Keyboard and screen-reader behaviour on real Windows is still unverified                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| i18n          | 90     | **94** | 1,580 keys × 6 locales consistent; the free pricing page is now translated in all six (it used to be English-only); paywall, Pro-upsell and Pro-naming strings removed; dead Halloween/promo components deleted. 175 identical-to-English keys remain on the reviewed list                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| DX            | 85     | **96** | CI runs ESLint + Prettier + `npm test`; lint is clean; contributor and architecture docs exist; `npm test` at the root is the one entry point for frontend tests; backend/desktop commands documented; the website now builds and runs its SEO gate in pull requests too, and its deploy workflow watches the app modules it imports from; CI is now a superset of everything `npm run check` enforces except `cargo test`, which needs the Windows toolchain. Rust gates (`fmt`, `clippy`, `audit`) are still absent because the toolchain is unavailable here                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

Nothing is claimed at 99. The remaining gaps are listed under
[Next steps](#next-steps) with file references.

## Batch log

> **History note — how to read commit ids here.** The sandbox restores this
> repository at the start of each turn by cloning the branch again, and only the
> most recent umbrella commits come back with it. Measured at the end of Batch R:
> the A–Q and A–R commits resolve (`git cat-file -t` succeeds), while every
> per-batch id from Batches M–Q fails — `git reflog` shows a fresh `clone:` line
> followed by the turn's own commit. The **working tree** is snapshotted and does
> survive, so every file a batch produced is present, and it is re-committed at
> the end of each turn. This document is the durable per-batch record, written as
> the source of truth precisely so the history granularity does not carry the
> evidence: treat commit hashes as per-turn labels. Nothing has been pushed —
> `git ls-remote origin` lists `master`, the earlier session branch and
> `refs/pull/1/head`, but **not** `arena/c156110b-pc-tweaker-app`.

### Batch A — repository hygiene and gates (done)

- `src/components/command-palette.tsx`, `App.tsx`, `onboarding`, `dashboard`,
  `use-visibility-interval`: mounted-instead-of-conditional rendering and the new
  `--scrim` token; `Badge kind="accent"` in the dashboard.
- `src-tauri/src/cleanup.rs`: removed a literal NUL byte (now `\0`) and converted
  765 CRLF lines to LF so Git stores it as text.
- Deleted ten tracked zero-byte junk files (`Barra`, `Taskleiste`, `Taskbar., Ce`, …).
- `.github/workflows/checks.yml`: added `npm run lint` and `npm run format:check`,
  which CI had never run.
- Prettier applied to 12 files; design-token baseline re-locked at **131 classes /
  13 files**.
- Validation: `tsc` clean, ESLint 0E/6W at that point, Prettier clean,
  `check-design-tokens` exit 0, `test-ui-polish` PASS.

### Batch B — backend rename and data compatibility (done)

The rename to `wincraft` had shipped without a data migration, which had broken
40 of 161 backend tests and would have stranded existing entitlements.

- `backend/src/products.ts`: `LEGACY_PRODUCT_IDS` (`pctweaker → wincraft`),
  `canonicalProduct()`, `ProductId`; every entitlement read/write canonicalises.
- `backend/src/db.ts`: idempotent migration — deletes superseded legacy rows for
  accounts that already hold the canonical product, then
  `UPDATE entitlements SET product='wincraft' WHERE product='pctweaker'`
  (alias-free form: pg-mem cannot execute alias-qualified deletes).
- `backend/src/stripe-policy.ts`: canonicalises metadata and price evidence before
  deciding, so legacy metadata keeps resolving.
- `backend/src/routes/stripe.ts`: new checkouts write the canonical product;
  refunds of legacy Lifetime purchases still revoke access.
- `checkout-recovery.ts` still reminds legacy abandoned checkouts;
  `routes/error-reports.ts` accepts the legacy app id.
- Test expectations moved with the intentional rename (values only):
  `account-emails`, `landing-redirect`, `mailer`, `purchase-text`, `promo`,
  `stripe-policy`, `billing-safety`; and `auth-validation` now indexes the router
  stack from the end (`route.stack.at(-1)`) instead of assuming the handler is
  first — reordering middleware is what broke it.
- Validation: `npx tsc --noEmit` clean, `npm test` **161/161** (was 121/161).

### Batch C — the app is genuinely free (done)

- `src/components/ui.tsx`: removed `PaywallModal` (2.8 kB, rendered nowhere).
- `src/lib.ts`: removed the Pro price table (`PRICE_MONTHLY/ANNUAL/LIFETIME`,
  `LIFETIME_BREAK_EVEN_MONTHS`, `savingsPercent`, `money()`, `ProPlan`) — the same
  numbers were duplicated in `backend/.env.example` and had already drifted — and
  fixed the analytics app id to `wincraft`.
- `src/components/pricing.tsx`: rewritten as the free page and fully translated
  through a new nine-key `pricing` i18n section, replacing the 45-key paid-plan
  section in all six locales. The old page's `onChoosePro`/`onManageBilling`
  props were never passed and are gone, along with `lang`, `isPro`, `heldPlan`,
  `hasBilling`, `freeTweakCount` and `onOpenLifetimeTools`.
- `src/components/pricing-copy.ts` → `profile-tools-copy.ts`: trimmed from 470 to
  62 lines, keeping only the six fields the profile tools actually render;
  heading is no longer "Open Lifetime tools".
- `src/components/lifetime-tools.tsx`: removed the "Lifetime only" badge, the
  upsell block, the `owned`/`onViewPlans` props and their dead CSS. The panel no
  longer advertises a licence that is not required.
- Pro badges that rendered on free features removed from `App.tsx`,
  `advanced-controls.tsx` (×4), `gaming.tsx`, `intelligence.tsx`,
  `maintenance.tsx`, `scan.tsx`; the permanently dead
  `requires_pro && !isProUnlocked` guard in `App.tsx` deleted.
- `backend/src/db.ts`: optional `DATABASE_CA` (PEM or path) makes the database
  connection verify the server certificate; documented in `.env.example` together
  with `MAIL_FROM` (no longer "PC Tweaker") and the corrected price comments.
- Docs: README licence paragraph no longer contradicts the MIT `LICENSE`, and the
  closing Pro/Lifetime paragraphs describe what actually ships.
- Validation: `tsc` clean, ESLint clean, Prettier clean, `check:i18n`,
  `check:i18n-quality`, `check:public-counts`, `check:no-test-pro`,
  `check-design-tokens`, `test-ui-polish`, `test:promo`, `test:lifetime-offer`,
  `test:download-limit-reconcile` all PASS; `npm run build` PASS (1,017.76 kB);
  backend `npm test` **161/161**.

### Batch D — warnings, the last red suite, and dead scan copy (done)

- Six `react-hooks/set-state-in-effect` warnings cleared:
  - `maintenance.tsx` `DiskHealthCard` now keys its reading to the drive it came
    from, so a stale drive's result is never shown (the sync `setHealth(null)`
    reset is gone — real fix).
  - The five mount/refresh fetch effects (`App.tsx` ×2, `gaming.tsx`,
    `startup.tsx` ×2) keep their `setState`-after-`await` shape and carry a
    one-line rationale plus a targeted rule suppression. Restructuring them is a
    separate, optional change (see Next steps).
  - `scan.tsx`: module-scope writes to the paused-scan store moved behind
    `holdScan()`/`clearHeldScan()` helpers, which also cleared a new
    "cannot reassign variables declared outside the component" error.
- `recommendedTweaks()` lost its meaningless `isPro` parameter (and
  `applyScanSelection()` its `_isPro`), the dead "locked fixes / Pro" section was
  removed from `scan.tsx`, and `recommendedTweaks` no longer carries a stale
  `@typescript-eslint/no-unused-vars` suppression.
- `scan-copy.ts`: the unused Pro-upsell strings removed; `scan-workspace.css`
  lost the rules they used.
- `scripts/test-scan.ts` updated to the free-build contract (no licence filter,
  updated test name and assertions). **15/15 subtests pass** (was 14/15).
- Validation: `eslint src` — **0 problems**, `tsc` clean, Prettier clean,
  `test-scan` 15/15, full battery re-run green.

### Batch E — contributor docs and the last dead files (done)

- Added `CONTRIBUTING.md` (prerequisites, the three npm trees, layout, the full
  gate list, i18n/token/snapshot rules, commit and PR conventions, BREAKING and
  secrets policy), `docs/ARCHITECTURE.md` (three trees, how a change reaches
  Windows, security boundaries, translations, testing layers) and `docs/API.md`
  (the HTTP surface with auth/rate-limit notes, and the desktop IPC surface
  referenced to `ipc_commands.rs` so it cannot drift).
- Deleted the four commerce components no screen imported: `halloween-offer.tsx`,
  `halloween-decor.ts`, `use-promo.ts`, `use-lifetime-offer.ts`. The client-side
  parsers `src/promo.ts` and `src/lifetime-offer.ts` stay: the promo/lifetime
  suites exercise them directly and they read offers that installed clients still
  receive.

### Batch F — the rest of the Pro plumbing (done)

Batch C stopped halfway: four components had lost their `isPro`/`onRequirePro`
props while the rest of the tree still passed them, which left `tsc` red with
three errors. This batch finishes the removal and deletes what only existed to
sell Pro.

- Licence guards and props retired in `command.tsx`, `gaming.tsx`,
  `intelligence.tsx`, `profiles.tsx`, `starter-profiles.tsx`, `hardware.tsx`,
  `workspace-sidebar.tsx`, `cleaners.tsx` (×2), `repair.tsx`,
  `advanced-controls.tsx` (×4 `act()` copies), `maintenance.tsx` (×4 plus the
  scheduled-cleanup toggle) and `pro.tsx` (×6). `App.tsx` stopped passing
  `isPro`/`onRequirePro` at 14 call sites, and `isProUnlocked` was retired into
  the comment that explains why the account object still carries the flag.
- `starter-presets.mjs` / `.d.mts`: `presetSelection()` lost its licence argument
  and the `locked` bucket it produced; `scripts/test-starter-presets.mjs` and its
  summary line follow the new contract.
- The last four `PRO` tags (`pro.tsx`), the `Badge kind="pro"` variant, its star
  icon, the `.badge[data-kind="pro"]` rule and the 96-line dead
  `.pro-feature-*` dialog block are gone. Three i18n keys that only named the
  paid product (`badges.pro`, `menu.planPro`, `menu.upgradeButton`) were removed
  from all six locales: **1,580 keys × 6**.
- `account.tsx`: the plan row states the free plan for everyone and opens the
  plans page; `onUpgrade`, the crown/plan ternary and their `upgradeButton` copy
  collapsed into that one path.
- Validation: `tsc` clean, `eslint src` **0 problems**, Prettier clean,
  `check:i18n` 1,580 × 6, `check:i18n-quality`, `check:public-counts`,
  `check:design-tokens`, `check:no-test-pro`, all fourteen script suites,
  `npm run build` PASS (1,014.67 kB JS / 210.48 kB CSS), backend `npm test`
  **161/161**.

### Batch G — a frontend test runner (done)

The repo shipped `vitest`, Testing Library, jsdom and jest-axe in
`devDependencies` but had no runner, no `npm test` and not one component test —
Testing was the audit's weakest category. This batch wires them up without
adding a package.

- `vitest.config.ts` (jsdom, `src/**/*.test.{ts,tsx}`, `src/test-setup.ts` for
  the jest-dom matchers). `npm test` runs `vitest run`, `npm run test:watch`
  watches, and CI runs it on every push.
- `src/lib.test.ts`: `formatBytes` unit switch and language-aware separators,
  gauge geometry, `loadColor` thresholds, `textFor` fallback and the
  `friendlyError` prefix mapping. Writing it found a real defect —
  `formatBytes(NaN)` rendered "NaN GB" — and the helper is now total.
- `src/components/ui.test.tsx`: `Badge` kinds, icon and class; `Toggle`
  `aria-pressed`, caption, callback, disabled-while-busy; jest-axe on both.
- `src/components/pricing.test.tsx`: the plans page states one free plan in all
  six locales, lists every feature, contains no paid amount or upsell wording,
  and passes jest-axe.
- `CONTRIBUTING.md` documents the runner and where a new test goes.

Validation: `npm test` **25/25 in 3 files** (~4 s), `tsc`, ESLint, Prettier,
every `scripts/*.mjs` suite, the i18n/public-count/token/test-pro gates,
`npm run build` (1,014.68 kB) and backend 161/161 all pass.

### Batch H — the Fix-all pipeline under test (done)

- `src/scan-runner.test.ts` (9 tests): `recommendedTweaks`/`optionalScanTweaks`
  keep neutral findings out of Fix all, and `applyScanSelection` is exercised
  through an injected `call` bridge — the safety property that it re-reads
  eligibility before writing (a row whose advice changed is skipped, not
  applied), that ids the scan never offered are ignored, that duplicates are
  collapsed, that nothing is written when nothing is eligible, and that a
  thrown apply or a failed verification read is reported instead of passing as
  a fix.
- `docs/ARCHITECTURE.md`: the testing-layer table now lists the frontend suite
  and says which layer renders components.

Validation: `npm test` **34 tests in 4 files** (~5 s), `tsc`, ESLint and Prettier
clean.

### Batch I — the bundle is split by panel (done)

The last Performance item that did not need a Windows box was the one-file
bundle. It is measured here and split.

- 36 panels are now `React.lazy()` in `App.tsx` (dashboard, maintenance's twelve
  cards, hardware, health, live dashboard, before/after, repair, cleaners,
  intelligence, history, startup, profiles, plans, pro cards, gaming, X3D,
  diagnostics, debloat, advanced controls). Scan stays in the entry chunk: it is
  the default section, so making it lazy would only move the same bytes to the
  first interaction.
- Three `<Suspense>` boundaries (scan view, the section view, the cleanup
  confirmation modal) render a panel-shaped skeleton. The `PageBoundary` each
  panel already sits in is the failure path: a chunk that cannot load throws
  during render, the boundary catches it and offers its retry button. CSP is
  `script-src 'self'`, which allows same-origin chunk loads, and Tauri serves the
  chunks from the app's own bundle, so this is a local file read.
- **Entry chunk 1,014.68 kB → 631.46 kB (321.76 → 211.69 kB gzip)** and the
  panels became 16 chunks of 7–75 kB. CSS is deliberately **not** split
  (`build.cssCodeSplit: false`): one stylesheet keeps the cascade exactly as it
  was when everything was imported eagerly, which a per-chunk stylesheet could
  change on a specificity tie.
- Why the entry chunk is still 631 kB, measured rather than guessed: bundling and
  minifying `src/i18n.ts` alone with esbuild gives 486 kB — **77%** of the entry
  chunk, and 166 kB of its 212 kB gzip. The six locale tables are the next real
  win and are left as a proposal, because loading English eagerly and the other
  five on demand touches every direct `STRINGS[...]` reader and both i18n gates.

Validation: `tsc`, ESLint, Prettier, `npm test` 34/34, the 15 script suites and
the five check gates all pass; `npm run build` PASS with the chunk table above.

### Batch J — the IPC bridge under test (done)

- `src/test-bridge.ts`: a fake for `@tauri-apps/api/core` and `.../event` —
  queued replies per command (a queued `Error` is thrown, a queued `undefined`
  is a value), a call log, and `emit` for pushing backend events to whatever
  registered a listener. Two components are covered through it.
- `src/components/cleaners.test.tsx` (13 tests): the cookie cleaner loads its
  whitelist on mount, adds an entry lowercased, refuses one that cannot match a
  domain, cleans a single browser and toasts the counts, disables cleaning when
  nothing is removable, warns about a running browser, and keeps a scan failure
  inside a toast. The app-cache card pre-selects what it found, sums the
  selection, cleans only the selected ids, reports skipped files separately and
  unregisters its progress listener on unmount.
- `src/components/maintenance.test.tsx` (11 tests): `CleanupCard` runs what it
  was given, shows the admin badge only where elevation is needed, and — the
  regression that matters — **applies a cleanup the catalogue still marks
  `requires_pro`**, so the flag cannot quietly become a lock again.
  `ScheduledCleanupCard` reflects the stored state, enables and disables the
  task with no licence check in the path, and leaves the switch where it was
  when the write fails. Those three interactions run on fake timers, because the
  switch holds an "Applying…" state for half a second after the read and racing
  a real clock against it is what made the first version flaky.
- Stale Pro-era copy found and corrected while writing the tests: the app-cache
  card's rationale ("scanning is free and cleaning is not"), the scheduled
  cleanup's ("turning it on needs Pro"), the account menu's two-tier plans
  comment, and five `pro: "Pro"` labels in `advanced-copy.ts` that no panel
  read any more.

Validation: `npm test` **58 tests in 6 files** (~8 s), `tsc`, ESLint, Prettier,
the 15 script suites, the five check gates and `npm run build` all pass.

### Batch K — the scan flow under test (done)

The scan is the panel the app opens on and the biggest single file, and it had
no coverage at all.

- `src/components/scan.test.tsx` (9 tests) drives a whole scan through the
  bridge: the landing state names how many reads it will run, **all 13 probes
  are called exactly once**, a clean report says "Scan complete", a read that
  fails turns the same report into "partial" and is listed as unreadable rather
  than silently dropped, and the partial flag is written to the last-scan note
  for the next visit.
- Applying is covered end to end: unselecting a row makes "Apply selected"
  count one, the confirm dialog lists exactly the reviewed item, `apply_tweaks`
  is called with **only that id and `source: "scan"`**, the verified fix is
  toasted and then no longer offered as a recommendation. Cancelling the dialog
  writes nothing.
- Pausing and resuming are covered with a new `hold`/`release` gate on the
  bridge: an interrupted read is retaken on resume while the twelve that
  finished are kept, which is the property the pause exists for.
- `src/test-setup.ts` gained the two jsdom gaps this needs:
  `Element.scrollIntoView` (the panel scrolls results into view) and
  `HTMLDialogElement.showModal`/`close` (it opens the review dialog with them).

Validation: `npm test` **67 tests in 7 files**, run twice to confirm no
order-dependent state (the scan holds a paused scan in module scope): both runs
67/67. `tsc`, ESLint, Prettier, the check gates and `npm run build` pass.

### Batch L — startup, drift and crash surfaces under test (done)

- `src/components/startup.test.tsx` (13 tests): the startup list reads once on
  mount and counts what is enabled; entries whose program is gone are dropped
  **and the count is shown** rather than disappearing silently; a `.lnk` row
  displays without its extension while its switch keeps the name the write
  needs; toggling sends scope, location, name and the inverted state, then
  re-reads; **the same program in two of Windows' three startup locations does
  not put both rows into the busy state** (the regression the key's location
  segment exists for); a failed write toasts and leaves the switch alone; search
  matches name and command; empty and failed-read states stay distinct. The
  scheduled-task list is covered too, including that its switch is labelled by
  name but keyed by task path.
- `src/components/intelligence.test.tsx` (15 tests): the drift card stays away
  when nothing was reverted, names the patch Windows moved to, does **not** blame
  Windows when the settings changed without it, re-applies only the items left
  ticked, and counts success **from what is in effect rather than from the
  failure list** (a cancelled UAC batch reports one failure for all of it). The
  crash card shows nothing for an empty list or a failed read, names which
  process died, copies plain text lines rather than JSON, and keeps the reports
  on screen when the clear fails. `DriftWatchToggle` reflects the stored choice
  and leaves the switch where it was when the write fails.

Validation: `npm test` **95 tests in 9 files**, `tsc`, ESLint, Prettier, the
check gates and `npm run build` pass. (The ESLint claim here was later found to
be wrong for the new test file alone — re-measured and fixed in Batch M.)

### Batch M — the thermal judge, the driver plans and the catalogue (done)

- `src/components/hardware.test.ts` (14 tests) covers the two pure functions the
  hardware panel is built on, without rendering it. `judgeSession`: an empty
  session has no verdict; **one reading at or above 84 °C is risky whether or not
  the card reported a working cooler**; a cool _idle_ session is still idle,
  because the cooler is only judged from at least five samples taken above 30 %
  load; loaded-but-cool is "better"; the verdict follows the peak **under load**,
  not the highest number in the file, so a hot moment at idle does not condemn
  the card. `modePlan`: no plan at all when the driver reports no power range;
  gaming takes the card's own maximum and pins the top clock; standard is 85 % of
  the factory default and silent 60 %, both rounded to a whole watt and **never
  below the driver's floor**. One assertion caught itself: 85 % of 95 W looked
  like 81 W but came back 60 W, because the fixture's `min_w` was clamping it —
  the test now uses a floor low enough that the percentage, not the clamp,
  decides, and the clamp has its own case.
- `src/catalog.test.ts` (5 tests) is a drift guard rather than a unit test: it
  reads the catalogue tables and the shipped translations together, so an id the
  app special-cases (three with their own settings screen, one manual-only) that
  is missing a name or a description in **any** of the six locales fails here
  instead of silently falling back to English copy. It also pins the Windows
  build names and the fallback for a build the table does not know, that the
  retired `disable_copilot` entry stays restorable but out of the catalogue, and
  that no id is both configurable and manual-only — those are different code
  paths in Rust.

**Two test-infrastructure corrections, both from re-running the gates here:**

- Batch L's "ESLint passes" claim was **wrong**: the new
  `src/components/intelligence.test.tsx` declared a mock parameter it never read,
  and `npm run lint` (and so `npm run check`, and CI) was failing on the committed
  tree. The test now captures the copied text in a local variable and asserts on
  that, which is both clearer and the reason the parameter exists. `npx eslint src`
  passes tree-wide — verified against the whole `src` tree this time, not just the
  files the batch touched.
- One suite run reported a single failure (1 of 114) while other npm tasks were
  in flight. It has not reproduced in **18 later runs**, including one with both
  CPU cores saturated and one with `--no-isolate` (all files in one process, which
  also rules out cross-file module state as a cause). Since it was not identified,
  the fix is a margin rather than a guess: `src/test-setup.ts` now sets Testing
  Library's `asyncUtilTimeout` to 3 s (its default is 1 s), which is still a hard
  stop on a hang but not a failure on a loaded machine. The failure mode is
  reported here rather than buried.

Validation: `npm test` **114 tests in 11 files** (~23 s), `tsc`, ESLint,
Prettier, `check:i18n`, `check:i18n-quality`, `check:public-counts`,
`check:no-test-pro`, `check:design-tokens` and `npm run build` (794 ms) pass.
`npm run check:rust` and `check:native-policy` still need cargo.

### Batch N — the thermal panel on the clock (done)

`src/components/thermals.test.tsx` (17 tests) covers `ThermalsPanel` and the
profile control behind it. This is the first suite that drives a **timer** rather
than a click: the panel polls `thermal_report` every two seconds and judges the
session from the samples it has collected, so the tests advance a fake clock and
treat the interval as the subject.

- One failed poll with nothing on screen says so, but **a failed poll after a
  successful one keeps the reading** — a momentary `nvidia-smi` hiccup must not
  wipe a working card. Polling stops entirely while the window is hidden.
- A missing sensor reads as missing, not as zero: no arc when the card reports no
  temperature, "fan idle" for 0 %, and the CPU card explains itself when the
  firmware publishes nothing. `gpu_source: "none"` adds the line that says no GPU
  tool is installed.
- The trend only draws once four samples exist (a two-point line reads as a
  rendering glitch, not a trend), and its min/max label matches the window.
- The session verdict is the _samples'_ verdict: a cool card at 4 % utilisation is
  idle, the same card at 55 % is "cooling well", and one 88 °C reading under load
  is risky — all three through the panel, not just through `judgeSession`.
- Profiles: the control opens on the profile the card is **already on** (max watts
  and a pinned clock is Gaming, so the button says Active and is disabled rather
  than inviting a no-op write); applying Silent sends the plan the tile showed
  (60 % of the card's 115 W default, with no clock lock) and then re-reads the
  card, so the screen ends up showing what the driver actually holds; a refused
  write toasts and **does not re-read**; no profiles at all when the driver cannot
  set a limit; and the tiles appear on the first card only, which is the one GPU
  index the limit is set for.

Two things the suite needed from the harness, now documented: a _held_ command is
the only way to observe the middle stage of an action that returns in under a
second (`bridge.hold`/`release`), and **jest-axe must run on the real clock** —
under fake timers its own internal scheduling never resolves, which surfaced as a
five-second timeout rather than a failure.

Validation: `npm test` **131 tests in 12 files** (~26 s), `tsc`, ESLint,
Prettier, the five check gates and `npm run build` (768 ms) pass.

### Batch O — the driver audit and the update catalogue (done)

`src/components/drivers.test.tsx` (21 tests) covers the panel that reads every
installed driver and the Windows Update section under it, plus `HardwarePanel`'s
mount strategy and the driver-audit cache in `src/lib.test.ts` (5 more tests).

- **It never scans on its own.** Opening Hardware used to start a sixteen-second
  device walk; the suite pins the current rule — no `driver_audit` on mount, the
  reason shown instead, and the walk only on the Rescan click. Progress comes from
  Rust's `driver-scan-progress` event, so the bar is asserted against the class
  being read and `done/total`, not against a timer.
- Counts and tiers: the stale/aging badges appear only when they are non-zero,
  "all recent" only when every entry really is, and a nine-device audit is cut at
  six with "Show 3 more" that collapses again.
- Search reaches device, provider and class; the age label switches to its
  singular form at exactly one year ("1 month", not "1 months"); the vendor button
  only exists on rows that have a URL, and clicking it hands that URL to the
  opener.
- A failed walk stays on screen as an alert rather than rendering as "no
  drivers found", and the button stays clickable, because a failure is exactly
  when someone retries.
- Restart: the banner appears only when Windows reports a pending restart,
  dismissing it restarts nothing, "Restart now" is the only path that calls
  `reboot_now`, and regaining window focus re-reads the flag (which is how an
  update the user ran in Windows Update gets noticed).
- The update catalogue: nothing to install until a search has found something;
  a search explains that it takes 30–90 seconds instead of going dim and silent;
  every result starts ticked; unchecking one narrows the install to that subset
  (asserted through the exact `titles` argument sent to Rust); select-all and
  deselect-all round-trip; a completed install clears the list and raises the
  restart banner when the result says `reboot_required`; and **a search that
  failed is not shown as a search that found nothing** — the two states have
  different copy and the suite asserts both.
- `HardwarePanel` paints the heading and a correctly-sized placeholder first and
  mounts the five instrument panels two animation frames later, which is the
  fix for Hardware feeling a beat slower to open than every other section.
- Storage contract (in `lib.test.ts`): the cached audit round-trips with a real
  `Date`, a corrupted entry is deleted rather than shown, an unparseable date is
  ignored, and a storage that throws on write does not throw into the UI.

The harness gained one thing: an `openerModule` stub, since following a vendor
link is a real user action worth asserting on. Two mistakes of the same shape
were caught in the same place this batch — an unused mock parameter failing
`eslint src` — first in a Batch L test file and then, before commit, in this new
stub. `npm run lint` is now run over the whole tree after every batch.

Validation: `npm test` **157 tests in 13 files** (~43 s), `tsc`, ESLint,
Prettier, the five check gates and `npm run build` (1.67 s) pass.

### Batch P — the debloat panel (done)

`src/components/debloat.test.tsx` (26 tests) covers the largest remaining
uncovered surface: listing optional Windows apps, choosing which to remove,
and removing them. The panel needed one new piece of harness — a
`@tauri-apps/plugin-dialog` stub, whose native file dialogs are now queueable
per test through `setDialog("open" | "save", …)`, including the cancelled case
(`null`).

- **Nothing is read until the section is active, and read exactly once.** The
  panel loads through a zero-delay timer while `active`, records that it has
  loaded, and does not pay for the walk again when the user navigates away and
  back — the parent keeps it mounted so an operation can finish.
- A failed list read says so and is **not** dressed up as an empty PC; a failed
  history read is not shown as an empty history; an unusable timestamp reads
  "date unavailable".
- Counts: installed and removable are separate numbers (a protected package is
  installed but not removable), locked apps stay hidden until asked for and then
  cannot be ticked, with the reason Windows gave attached to the badge, and the
  banner explaining that removal needs a normal session appears when Windows
  refuses for that reason.
- Filtering: a search with no match and a category that excludes everything are
  different sentences, "clear filters" restores both, category segments carry
  their own counts, groups collapse and reopen, and "select all" in a group
  ticks only the rows Windows would allow.
- Selection: presets fill the selection **without starting anything** (asserted
  through a zero call count), the active preset reports `aria-pressed`, and a
  re-scan that reports the package as protected **drops the tick** rather than
  leaving a stale selection to act on.
- Removal: the preview dialog opens with the exact package identity and the
  curated "what you lose" copy, cancel removes nothing, and the confirmed run
  produces a per-app receipt — a verified removal, a refusal shown with the
  reason Windows gave, and a transport failure recorded as **"state unknown"**
  with exactly one attempt, because the package may already be gone. History and
  the list are re-read afterwards, and a refresh that also fails leaves the
  receipt on screen with a line saying the state could not be confirmed.
- Lists: saving writes **catalogue ids** (not package names) to the chosen path;
  a cancelled dialog writes nothing; loading a list selects what it names, counts
  what it could not match, and never removes; a file that is not a WinCraft list
  reports why instead of selecting nothing.
- History lists removals newest first, only offers a Store link back for
  successful ones, and opens the verified link through the opener.
- Suggestions hands privacy back to the sections that own it (`privacy`,
  `profiles`), using the tweaks' own translated names.

Validation: `npm test` **183 tests in 14 files** (~36 s), `tsc`, ESLint,
Prettier, the five check gates and `npm run build` (935 ms) pass.

### Batch Q — game sessions and Turbo Boost, plus an a11y fix (done)

`src/components/gaming.test.tsx` (28 tests) covers the last two large panels, and
writing it turned up a real accessibility defect in the source.

**The defect.** Turbo Boost's comparison table opened with an empty `<th>`. axe
flags that as `empty-table-header`, and it is right: a screen reader announces an
unnamed column. The corner cell belongs to no column — it is the row-label
column's own header — so it is now a `<td>`, and the two real column headers
carry `scope="col"`. No copy was added, no layout changed; the table just
describes itself correctly. This is the kind of thing the audit could only guess
at without a headless axe run, and the new suite is what caught it.

- **Game sessions:** the switch, the game list and the steering status are read
  on mount and each has its own failure mode — a failed list read is shown and
  does **not** leave a silent switch that looks off, while a failed steering read
  (the rollback journal, a different subsystem) hides only the steering row and
  leaves the session control working. The list counts games and opens only when
  there is one; a game that manages its own performance is marked, because Turbo
  Gaming still applies to it and only its own process is skipped; the folder
  dialog is re-read only when it returned a path, and a cancelled dialog adds
  nothing; a removal always re-reads the list rather than trusting the click.
- Steering is described by the kind the machine reports (`vCache` counts CPU
  sets, `hybrid` names both groups, `null` says there is nothing to steer), the
  switch is disabled when there is nothing to steer between, an enabled-but-idle
  steering says it needs a session, and the status is **re-read every five
  seconds while a session is running** — that re-read is how the growing count
  reaches the screen, and it is driven on the fake clock. The `game-session-changed`
  event drives the active-game line and re-reads steering in the same pass.
- **Turbo Boost:** the panel states which way the processor is set and never
  grades the result; the dial reports **labelled** live CPU load (the label is
  what stops an idle 2% reading as the tweak failing); the facts list carries the
  speed measured against the CPU's own rated clock and the power plan's floor,
  and a fact the machine did not report is **left out rather than shown as
  zero**; a failed reading leaves the dial empty instead of claiming 0%; the plan
  note distinguishes "already ran this way" from "was already on"; the last
  applied time is taken from the audit log and an unrelated entry is not mistaken
  for it.
- Turning it on measures **before and after** (two probes of two seconds, either
  side of the write), rolls back with no probe because there is nothing to
  compare, re-reads the parent so the surrounding screen knows, and files each
  result under the column for the mode it was measured in — including the
  percentage against the baseline run when both exist. A refusal is reported in
  the guard's own words (the backend's `PREFIX: detail` string mapped to
  translated copy) and the parent is not told anything changed.

**Harness change.** A real Tauri rejection is a **string**, not an `Error`, so
the fake bridge could not previously express one — `bridge.reply(cmd, "SIZE")`
would have resolved successfully. It now has `bridge.fail(command, ...messages)`
for rejections that are not `Error` objects, which is what the friendly-error
mapping actually reads. Two pitfalls are now documented in the test file:
Testing Library's `waitFor` never fires under Vitest's fake timers (it only
advances a clock it recognises as Jest's), so this file uses an explicit
`settle()`; and jsdom reports an **unfocused** window, so the foreground gate
both panels read through is stubbed open or the live path would silently never
run.

Validation: `npm test` **211 tests in 15 files** (~27 s), `tsc`, ESLint,
Prettier, the five check gates and `npm run build` (605 ms) pass.

### Batch R — the domain in shipped links, live docs and the publisher feed (done)

Everything the product says about itself now names the domain it actually owns.
The rule applied throughout: **`wincraft.app` / `api.wincraft.app` for the product,
`pctweaker` only as the legacy product id** the backend still maps.

- **Two links the app ships were pointing at the retired host.** The Debloat-adjacent
  uninstaller card opened `pctweaker.app/uninstaller/` and the Tweaky Driver card
  opened `pctweaker.app/tweaky-driver/`. Both pages are listed in the site's own
  `sitemap.xml` under `wincraft.app`, and the backend's uninstaller email already
  pointed at `wincraft.app/uninstaller` — so the app was the outlier. Both now use
  the owned origin. (UTM parameters were left exactly as they were: changing them
  would silently re-attribute the site's analytics.)
- **`README.md`, `SECURITY.md`, `PRIVACY.md`, `backend/README.md` and
  `backend/legal/PRIVACY.md`** carried the old origin, and `backend/README.md`
  documented the support address as `support@pctweaker.app` while the code says
  otherwise: `backend/src/support-inbox.ts` and `mailer.ts` both use
  `support@wincraft.app`, and `backend/.env.example` documents it as
  Cloudflare-routed. The docs now agree with the code.
- **`backend/scripts/smoke-test.mjs` defaulted to the retired API host**, so running
  it without `BASE_URL` exercised the wrong server. It now defaults to
  `https://api.wincraft.app`, as does the documented `VITE_API_BASE_URL` and the
  Stripe webhook path in the backend README.
- **`docs/pad.xml` — the published PAD feed — described a two-release-old build.**
  Refreshed from the live release rather than from guesswork: version 1.18.1,
  release day 11 (published 2026-10-11), installer size 6,150,688 bytes / 6,006.53 K
  / 5.87 MB, and the `v1.18.1` download URL, which returns `302` (GitHub serving
  the asset). Its `Program_Change_Info` now summarises the release in the
  changelog's own words. The file still parses as XML (verified with
  `xml.etree`), and the screenshot URL was left alone after checking that
  `docs/screenshots/pc-tweaker-1.16-overview.png` really does exist upstream —
  it is a 404 in this fork's tree, which is exactly why the check mattered before
  "fixing" it.

**Left deliberately, with reasons:** `CHANGELOG.md` (a historical record — those
entries describe what shipped at the time, and rewriting them would falsify the
history), `DEEP-AUDIT.md` (the same, for the earlier audit), and the
`backend/test/*.mjs` fixtures, which pass arbitrary URLs through URL-handling
code and are not claims about the domain.

**Two things this batch found but did not change, because they need one decision
from the owner:**

1. **The site tree is mid-migration and its own SEO gate is red.** `site/src/seo.ts`
   sets `ORIGIN = "https://wincraft.app"`, and the committed
   `site/public/sitemap.xml` lists **17 URLs, all on `wincraft.app`** — but
   `site/scripts/check-seo.mjs:18` asserts `url.origin === "https://pctweaker.app"`
   for every one of them, `site/index.html` and `site/public/tweaky-driver/index.html`
   still carry `pctweaker.app` canonical/OpenGraph/JSON-LD tags, and
   `site/public/CNAME` still names `pctweaker.app`. Reproduced without a site build:
   **17 of 17 sitemap URLs fail the assertion.** `CNAME` is a _deployment_ setting —
   changing it decides where GitHub Pages serves the site — so the fix waits on one
   answer: which origin is live? Once that is known, the other three files follow
   mechanically.
2. **The marketing scripts carry a dated, explicit instruction.** All four
   `marketing/**` files say _"Official pctweaker.app link (2026-08-22, explicitly
   requested)"_. That was the owner's call at the time and the rename came later, so
   overriding it silently would be exactly the wrong move — it is listed below
   instead.

Validation: `tsc`, ESLint, Prettier, `npm test` **211 tests in 15 files**, the five
check gates, `npm run build` (632 ms) and `cd backend && npm test` **161/161** all
pass. `git grep pctweaker.app` now returns **nothing** in the app, the backend (its
test fixtures aside) or the root docs.

### Batch S — the website build, which an earlier batch had broken (done)

**A regression this programme introduced, found and fixed.** Batch E deleted
`src/components/halloween-offer.tsx` and `src/halloween-decor.ts` as "unrendered
commerce files, unrendered in the app". Unrendered in the _app_, yes — but the
**website** rendered them: `site/src/promo.tsx` imports the offer banner from
`../../src/components/halloween-offer`, and that module is used by the site's App,
nav, hero, pricing and Uninstaller pages. `halloween-offer.css` was left behind,
which is what an incomplete deletion looks like. The site build has been failing
since:

```
site/src/promo.tsx(3,47): error TS2307: Cannot find module '../../src/components/halloween-offer'
```

Both files are restored, so the site builds again. They stay out of the app's
bundle — nothing in `src/` imports them, and the built app assets contain no trace
of them (checked).

**Then the site's own dead gate.** `npm run check:seo` is a **blocking step in
`.github/workflows/deploy-site.yml`**, and it failed on **all 17 sitemap routes**:

```
AssertionError: Expected values to be strictly equal:
+ 'https://wincraft.app'   - 'https://pctweaker.app'      at scripts/check-seo.mjs:18
```

The origin was written down in three places and only one of them matched the
pages: `site/src/seo.ts` builds every canonical and OpenGraph URL the site
renders (`wincraft.app`), while `scripts/build-sitemap.mjs` and
`scripts/check-seo.mjs` each restated the pre-rename domain by hand. Both scripts
now read it from `seo.ts` through a new `site/scripts/site-origin.mjs`, which
fails loudly if that line ever stops matching — so the generator and the gate can
no longer disagree with the pages. Re-running `build-sitemap.mjs` no longer
rewrites the sitemap back to the old domain, which it would have done silently.

With the origin sourced once, the gate went from 17 failures to **1**: the static
`tweaky-driver/index.html` (shipped verbatim, not prerendered) carried
`pctweaker.app` in its canonical, OpenGraph tags, JSON-LD `@id`s and its in-page
link to WinCraft, while the site's own sitemap lists that route on `wincraft.app`.
Aligned. `site/index.html` and `public/.well-known/security.txt` were aligned the
same way: prerender overwrites each route's canonical, but **the JSON-LD identity
graph and the `og:image` URLs are rendered as-is**, so every page was shipping an
organization id on the old origin (found by grepping the built output, not the
source). `npm run check:seo` now reports **17 of 17 routes, robots.txt and the 404
page**.

**Left alone, deliberately:** `site/public/CNAME` (it decides where GitHub Pages
serves the site — a deployment decision, not copy) and the
`tweakydriver@pctweaker.app` mailbox on the noindex return page (a live mailbox I
have no evidence for; `support@wincraft.app` I did have evidence for, this one I
do not).

**The reason it went unnoticed, fixed as well.** `deploy-site.yml` triggers on
`site/**` only, so a change under `src/` — which the site imports from directly —
produced no CI signal at all; the first symptom would have been a broken deploy.
It now also watches `src/**`, and `checks.yml` gained a `site` job (build plus
`check:seo` on `ubuntu-latest`, as its own job so the main checks keep their
runtime) so a pull request that breaks the website fails **before** it merges
rather than after. Both workflows are re-parsed as YAML to confirm they are valid.

Validation: the app's `tsc`, ESLint, Prettier, `npm test` **211 tests in 15
files**, the five check gates and `npm run build` (631 ms) pass with the restored
files present; the site's `npm ci && npm run build && npm run check:seo` passes;
design tokens still report 131 legacy classes, so the restored CSS needed no new
baseline.

### Batch T — every gate `npm run check` runs now also runs in CI (done)

The lint-and-formatting step in `checks.yml` carries a comment explaining why it
exists: those gates were reachable **only** through `npm run check`, which
`build.yml` runs on release tags, "so a lint error or an unformatted file could
sit on master until release day". The same hole was still open for eight script
suites. Comparing the two lists mechanically (`npm run check`'s 25 steps against
the workflow's invocations — the three false positives being `tsc`/`eslint`/
`prettier`, which CI spells as `npx tsc`, `npm run lint` and `npm run format:check`)
found these unrun on every push:

| Suite                                    | Covers                                            |
| ---------------------------------------- | ------------------------------------------------- |
| `npm run test:advisor`                   | the advisor's recommendations and their wording   |
| `npm run test:thermals`                  | thermal sampling and the session verdict          |
| `npm run test:repair-eta`                | repair time estimates                             |
| `npm run test:debloat`                   | debloat catalogue and removal rules               |
| `npm run test:download-limit-reconcile`  | the download-limit setting vs. what Windows holds |
| `npm run test:promo`                     | offer parsing and the promo clock                 |
| `node scripts/test-language-default.mjs` | first-run language from the OS                    |
| `node scripts/test-history-model.mjs`    | the change-history timeline model                 |

All eight pass (verified locally before wiring them in, so this cannot land as a
red gate), and they are offline and deterministic, which is the test the comment
above them sets. They are now two steps in `checks.yml`, in the file's existing
PowerShell style with an explicit exit-code check per command.

Two documents were making a claim that was not quite true, and now are accurate:
`docs/ARCHITECTURE.md` said CI runs "`npm test`, the script suites, `cargo test`
and the API tests on every push and pull request" — it does now, so the paragraph
also states the invariant to keep ("anything in `npm run check` that CI does not
also run is a gate that can only fail on release day") and mentions the new `site`
job; its testing-layer table also gained the suites the old row omitted.
`CONTRIBUTING.md` told contributors the list was what CI runs while naming only
three script files, and now points at the whole set and explains why the website
step matters.

Validation: `checks.yml` re-parsed as YAML (24 steps in the `checks` job), Prettier
left the workflow untouched apart from the new steps (27 insertions, no
reformatting), and the full battery passes: `tsc`, ESLint, Prettier, `npm test`
**211 tests in 15 files**, the five check gates, `npm run build` (637 ms) and the
site's `check:seo` (17/17).

### Batch U — coverage, measured honestly, with a ratchet (done)

_Changes not applied_ item 3 has said since Batch G that there is "no coverage
report and no coverage threshold". Both are gone as gaps now, and the measurement
itself is worth recording because the first number was wrong.

**The wrong number.** Vitest reports only the files a test imported unless told
otherwise, so a first run said **58.71% of statements**. Every module no test
touches — `App.tsx`, `overlay.tsx` and a dozen panels — was simply absent from the
denominator. Adding `coverage.include` for all of `src/**/*.{ts,tsx}` (with the
test harness, type-only modules, assets and the entry point excluded) gives the
honest figure:

| Metric     | Measured | Threshold (ratchet) |
| ---------- | -------- | ------------------- |
| Statements | 29.30%   | 28                  |
| Branches   | 26.68%   | 26                  |
| Functions  | 29.18%   | 28                  |
| Lines      | 29.85%   | 29                  |

3,216 of 4,585 instrumented lines are still uncovered, and the mass is
concentrated: `App.tsx` (310 lines), `maintenance.tsx` (225 — the twelve cards
other than the two under test), `before-after.tsx` (210), `change-history.tsx`
(170), `pro.tsx` (151), `advanced-controls.tsx` (149). That is the real shape of
the remaining testing work, and it is now visible instead of asserted.

The thresholds sit about a point below the measured tree, and the comment in
`vitest.config.ts` states the policy: **they are a ratchet, not a target — raise
them when tests are added, never lower one to make a red run green.** Their being
enforced was verified rather than assumed: with `lines` temporarily set to 95 the
run exits 1 with `Coverage for lines (29.85%) does not meet global threshold
(95%)`, and with the real value it exits 0.

CI runs `npm run test:coverage` **instead of** the plain `npm test` rather than
after it — the same suite, instrumented, so the ratchet is enforced without
doubling the job's test time. `npm test` remains the local entry point.

Validation: `npm run test:coverage` passes with 211 tests and the four thresholds
met; `vitest.config.ts` and both documents are Prettier-clean.

Two dependencies the test work had declared — `rollup-plugin-visualizer` and
`@vitest/coverage-v8` — turned out to be referenced by nothing: no config named
them and no batch used them, so both were removed rather than left in the tree
waiting for a purpose. `@vitest/coverage-v8` has since been put back **with the
configuration that uses it** (Batch U): coverage is measured, thresholded and run
in CI. `rollup-plugin-visualizer` stays out.
The rest of what the runner needs **is** declared: the base tree used vitest,
jsdom, jest-axe and Testing Library without ever naming them, which is why a
fresh clone could not run a single test. That declaration is what makes CI's
"Component and module tests" step meaningful.

### Batch V — the Before & After panel, and a broken heading outline (done)

The panel that measures the PC before and after a change is the third-largest
uncovered file in the tree (210 lines) and the one surface where a reader is
asked to trust numbers. Thirty tests now drive it through the fake IPC bridge,
and the axe run added to that mount found a defect the earlier batches had not —
the second time the a11y gate has paid for itself.

**The defect.** The panel's two sub-sections used `<h4>` directly under the
panel's `<h2>`:

```
.ba-between > h4     ← "Changed between the two measurements"
.ba-boot-head h4     ← "Startup time"
```

A screen reader announces that as a broken outline (level 2, then level 4), and
axe's `heading-order` rule catches it — it was the only violation axe reported on
the rendered comparison. Both are `<h3>` now, one level below the panel title and
one above the per-metric cards, and the two stylesheet selectors follow them
(`.ba-between h3`, `.ba-boot-head h3`). Nothing moves on screen: the rules are
parent-scoped and Tailwind's preflight resets heading sizes and margins, so the
element name was carrying meaning, not pixels.

**What the tests pin.** The three mount reads and their arguments (the startup
log is read with `refresh: false` and no baseline date first, then again once the
comparison's date is known — reading Windows' log again needs administrator
permission, so that waits for the button); the step list and its `aria-current`;
the running state, including `aria-busy` on the panel; a failed measurement
reported as an `alert` instead of a blank card; the values exactly as the backend
measured them, down to the unit switch (850 µs → 1.40 ms) and the wider of the
two spreads; the reading order (`launch_ms` before `startup_apps` before
`disk_free_mb`, whatever order the backend sent); "no significant change" in
neutral wording with no delta; a lower result called "higher this time" or
"slower this time" depending on the metric, with the hint that says how to check
it; a single reading marked as one instead of given an invented spread; a
confirmed improvement counted; the ±20% noise warning; the restart note; the
history list (labels, the `(undone)` suffix, the catalogue-name fallback, the
deduplication, and the six-line cap with the remainder counted); the startup
counts split at the baseline date; the too-few-restarts case; a failed log read
that leaves the comparison on screen; and the export flow — dialog cancelled,
saved with a toast, failed with a toast.

**What is not covered, and why.** `renderReport`, the canvas drawing behind "Save
as image", cannot run in jsdom (there is no 2D context), so those tests assert
the call and its path with an empty payload rather than pretending to check the
image. That drawing is the one part of this panel a packaged Windows run would
have to confirm.

| Metric     | Before (Batch U) | After  | Threshold (ratchet) |
| ---------- | ---------------- | ------ | ------------------- |
| Statements | 29.30%           | 32.5%  | 28 → **31**         |
| Branches   | 26.68%           | 30.41% | 26 → **29**         |
| Functions  | 29.18%           | 32.3%  | 28 → **31**         |
| Lines      | 29.85%           | 33.12% | 29 → **32**         |

`before-after.tsx` itself goes from 0% to 65.71% of lines. The thresholds were
raised by the ratchet's own rule — raise them when tests are added — rather than
left at values the tree had already outgrown, and they still sit about a point
under the measurement.

Validation: `npx tsc --noEmit`, `npx eslint src`, Prettier, `npm run test:coverage`
(241 tests, thresholds met, exit 0), the five check gates and `npm run build`.

### Batch W — the site's origin, and every public control count (done)

Two loose ends from the "keep wincraft.app" and "drop the counts" answers, both
about public text rather than code.

**The origin is now single-source, including its deployment setting.** The last
piece of the rename was `site/public/CNAME`, which still named `pctweaker.app`
and decides where GitHub Pages answers; it now says `wincraft.app`. The SEO gate
was asserting everything about the pages _except_ the one setting that decides
where they are served, so it asserts it now too: the shipped `CNAME` must be the
host `site/src/seo.ts` builds every canonical from. Verified to bite by setting it
back and watching the gate fail.

The four marketing CTAs that linked `pctweaker.app` (`instagram-upload/lib.js`,
`x-upload/post-to-x.js`, `youtube-upload/auto-upload.js`,
`youtube-upload/compile-longform.js`) now link `wincraft.app`, and their comment
records both decisions instead of being rewritten as if there had only ever been
one: the owner asked on 2026-08-22 for the product's own site rather than the
GitHub repo, and confirmed on 2026-10-12 that the live one is `wincraft.app`.
Left alone deliberately, because each names an artefact and not the site: the
`winget install AurelioAvila.PCTweaker` line and the upstream repository URL in
`compile-longform.js`, and `tweakydriver@pctweaker.app` on the noindex
checkout-return page, which belongs to a different product and has no evidenced
replacement.

**The Free/Pro split is no longer published anywhere public.** The catalogue's
35 flags stay in the Rust metadata and nothing reads them, but the app has no
licence gate, so a public "46 Free / 35 Pro" was a claim with nothing behind it.
Removed from the README, from `site/src/i18n/dictionary.ts` (the home page's
"46 / CONTROLS INCLUDED FREE" stat is gone, the free plan card and the Pro card
both say the catalogue's 81, and the FAQ answer no longer counts the split), from
`site/src/pages/practical-guides.ts`, and from all six Store listings in their own
languages — opening line, feature bullet, "WITH PRO" paragraph and release notes.
`CHANGELOG.md` and `release-notes/RELEASE-NOTES-*.md` are untouched: those are
records of what a release said at the time, not live claims.

`scripts/check-public-counts.mjs` was rewritten around the new rule, and it is
stricter than the version it replaces. It still takes the total from the Rust
catalogue test, but now: the total is the only count a public text may quote, the
Free/Pro numbers may not appear in these files at all (they have no other reason
to, in any of the six languages), each listing description must still state the
total, and the home page stat must still be the release's controls. Verified red
on both failure modes — restoring the split into a listing's short description
and changing the total in the README — then green again.

What this does **not** settle, and should not: the website still sells plans
(pricing cards at €59.99 / €7.99, the "WITH PRO" sections of the listings, the
FAQ's subscription sentence), `docs/pad.xml` still says "advanced Pro tools are
paid", and the Uninstaller page prices a different product. Those are commercial
claims, not counts, so they need a product decision rather than an edit here.

Validation: `npm run check:public-counts`, `check:i18n` (1,579 keys × 6), the site
build and `check:seo` (17/17 routes, robots, 404 and now the CNAME), plus the full
root battery.

### Measurement — what loading the locale tables on demand would save

Asked for numbers before the decision, so here they are, measured rather than
estimated. The method: in a scratch copy, the five non-English tables in
`src/i18n.ts` were aliased to the English one and the app built with Vite
(type-checking skipped, because this is a payload measurement), then the file was
restored. Nothing was committed.

|                          | Entry chunk (`main-*.js`) | gzip                    |
| ------------------------ | ------------------------- | ----------------------- |
| Today (six tables eager) | 631,461 B (631.46 kB)     | 211,422 B               |
| Without the five tables  | 228,691 B (228.69 kB)     | 71,738 B                |
| Saving                   | **402,770 B (−63.8%)**    | **−139,684 B (−66.1%)** |

The other entry (`overlay.html`'s chunk, 228,900 B) does not import the tables and
does not move. Each locale would become its own chunk of roughly 80 kB (about
28 kB gzip), fetched the first time that language is chosen — so English users pay
nothing and a German user pays one extra request once.

The work is smaller than "touches every `STRINGS[…]` reader" suggests: all 36
panels take `s` as a prop and do not change. What does change is `src/i18n.ts`
(the loader plus one module per locale), `App.tsx:188`, `main.tsx:15`,
`advanced-controls.tsx` (five reads), `debloat.tsx:124`, `tool-section.tsx:106`
(which identifies the language by object identity — `Object.keys(STRINGS).find(k
=> STRINGS[k] === s)` — and needs the loader's map instead), and four scripts that
read the tables statically (`i18n-tables.mjs`, `audit-i18n.mjs`, `check-i18n.mjs`,
`test-live-metrics.ts`) plus two tests that iterate locales
(`catalog.test.ts`, `lib.test.ts`). One behaviour to handle deliberately: a
language switch would show English until the chunk lands, unless the loader keeps
the outgoing table until the incoming one arrives.

### Batch X — the tweak list leaves App.tsx (done)

The app's core surface — the rows that apply a control — was rendered inline
inside a 1,340-line shell that mounts the whole workspace, so no part of a row
could be tested on its own. That is why `App.tsx` was the largest uncovered file
in the tree (310 lines) and why the earlier batches stopped at its edge.

**Both halves are pure moves.** The rule that decides _which_ controls a section
shows went to `src/tweak-list-model.ts` as `tweaksForSection(tweaks, filter,
query, s)`; the rule itself is unchanged — Turbo Boost is still left out because
it has its own card, a search still ignores the open section, the seven screens
that are not a tweak category still show none, and a category is still ordered by
the catalogue's own feature order. The row went to `src/components/tweak-row.tsx`
as `TweakRow`, both branches included: the ordinary row, and the three
configurable controls that open a card of their own. That card's lazy import moved
with it — to the file that renders it — so the chunk split from Batch I is
untouched (the build still emits `advanced-controls-*.js`, 24.75 kB). The shell
keeps the state and the IPC and passes ten props; the JSX is otherwise the same
markup, checked line by line against the block it replaced.

**Twenty-one tests came with it** — seven for the rule, fourteen for the row:

- the rule: the excluded control, the section filter, the search across every
  section, the whitespace-only query, the five screens with no controls, and the
  ordering (including that a category without an order list keeps the catalogue's
  order);
- the row: the dictionary's words over the catalogue's, the disclosure button
  _instead of_ a hive badge rather than as well as one, the requirements badge
  composed from build and edition, the admin badge, all five reasons a control
  cannot be applied plus the note's build number, an applied control staying
  switchable, the click that reports the control, the busy captions (applying and
  restoring are different waits), the panel that only renders when open, the entry
  stagger, the priority marker, and the three configurable controls rendering their
  card with no switch of their own.

One more thing the tests pin, because it is easy to lose in a refactor: a search
matches the words **on screen**. For a control the translations name themselves,
the catalogue's English text is not what a reader sees, so it is not what a search
finds — and for a control no translation names, the catalogue's text is both.

| Metric     | Before (Batch V) | After  | Threshold (ratchet) |
| ---------- | ---------------- | ------ | ------------------- |
| Statements | 32.5%            | 34.32% | 31 → **33**         |
| Branches   | 30.41%           | 33.27% | 29 → **32**         |
| Functions  | 32.3%            | 33.86% | 31 → **32**         |
| Lines      | 33.12%           | 35.05% | 32 → **34**         |

`tweak-list-model.ts` and `tweak-row.tsx` arrive at 100% of their lines.

Two things stated plainly rather than implied. The extraction does **not** cover
the shell: `App.tsx` goes from 310 to 295 uncovered lines and is still at 0%, and
what is left there — state, IPC, routing, layout — is the hard part to test, not
the part that was moved. And the entry chunk grew by 170 bytes
(631.46 → 631.63 kB), which is what a component boundary costs.

Validation: `npx tsc --noEmit`, `npx eslint src`, Prettier, `npm run test:coverage`
(262 tests in 18 files, thresholds met), `npm run build` with the lazy chunk still
split out, the five check gates, and the site build with its SEO gate.

### Batch Y — Change history under test (done)

`change-history.tsx` was the largest panel left untested after the shell: 741
lines, and the only place the app shows a reader everything it has done to their
PC, with the values before and after each change, filters, exports and an undo
that writes to the registry. Its model (`history-model.ts`) already had a script
suite from an earlier batch, which is exactly the trap: the rules were covered
while the panel that puts them on screen was not, so a row could render the wrong
value, a dialog could confirm the wrong ids and no test would notice.

**Twenty-one tests, and two of them run axe over the rendered panel.**

- **Reading**: the "reading" state before the reads answer; the empty state with
  a zeroed summary and no export or filter chrome; a failed read reported in the
  panel with a refresh button that recovers.
- **A row**: the dictionary's name for the setting (not the id), the action, the
  origin ("Its own switch"), the elevation marker, the machine-readable `<time>`,
  a failure marked and _not_ offered an undo, an applied change marked "In effect"
  _with_ one.
- **Undo**: the confirmation naming the one change, listing the registry value it
  will put back; the write with the right ids and a success toast; a partial undo
  reported as partial rather than as a success; a cancelled confirmation writing
  nothing.
- **Filters**: search by the setting's name, by a value underneath it (which is on
  the row only once the values are opened), the dead end when nothing matches, the
  way out of it, and the type/result combination that matches nothing.
- **Values and comparison**: the before/after table behind "Show values", the
  "not recorded" sentence for a pre-1.18.1 change instead of an empty table, the
  "in effect now" list, and the sentence used when nothing is in effect.
- **Exports and clearing**: a CSV written through the file dialog carrying the
  row's own words rather than an action id, nothing written when the dialog is
  dismissed, and clearing the history only behind a confirmation that says what
  it means — then the list is empty.
- **A removal from the Debloat history** appearing beside the audit entries.

No defect was found, which is worth stating: the panel already marked status by
shape and colour (`✓`/`×` rather than colour alone), gave every filter an
accessible name, scoped its table headers (`scope="col"`/`scope="row"`) and
carried `aria-busy` while reading. The two axe passes — one on a plain listing,
one with a row's values expanded and the comparison list open — are there to keep
it that way.

**A process note, recorded because it cost time.** This batch was nearly written
twice: `src/components/before-after.test.tsx` looked like an untested panel, so a
suite was drafted for it — and the file already existed, with thirty tests from
Batch V. The draft was a subset of what was already there: every case in it is in
the Batch V suite, which also covers four it lacked (a failed startup-log read, a
machine with no stored startup times, no export before there is anything to
export, and a failed save reported through the toast). It was restored from the
commit, byte for byte, and only the numbers below survive it. The lesson belongs
in this file next to the re-clone note: **a new turn must check whether a file
exists before writing it** — and count the tests, because a suite count falling by
ten is what gave the mistake away.

| Metric     | Before (Batch X) | After  | Threshold (ratchet) |
| ---------- | ---------------- | ------ | ------------------- |
| Statements | 34.32%           | 39.1%  | 33 → **38**         |
| Branches   | 33.27%           | 37.74% | 32 → **36**         |
| Functions  | 33.86%           | 38.63% | 32 → **37**         |
| Lines      | 35.05%           | 39.8%  | 34 → **38**         |

283 tests in 19 files. The threshold was verified to bite, not just to pass: the
suite exits non-zero when the statement threshold is set above what the tree
measures, and zero with the values above.

Nothing shipped changed: the entry chunk is byte-for-byte the same size
(631.63 kB / 212.78 kB gzip) and the lazy `advanced-controls` chunk is still
split out, because this batch adds a test file and a threshold. Validation: tsc,
eslint, Prettier, `npm run test:coverage` (283 tests, 19 files, thresholds met),
`npm run build`, the five check gates, `scripts/test-scan.mjs`,
`scripts/test-history-model.mjs`, and the site build with its SEO gate.

### Batch Z — one language in the bundle, the other five on demand (done)

The entry chunk was 631 kB and the measurement said why: the six locale tables
were one 562 kB module, imported by the shell, so every reader downloaded all six
whether or not they ever opened the language menu. That was 77% of the bundle for
a setting most people never touch, and it was the one performance item the gate
answers had been holding.

**What the reader gets now.** English stays in the bundle — it is the product's
primary language and the fallback for every other, so it cannot be a request — and
each of the other five is its own chunk, fetched the first time that language is
chosen and cached by the browser afterwards:

| Asset                                   | Before    | After                                |
| --------------------------------------- | --------- | ------------------------------------ |
| Entry `main-*.js`                       | 631.63 kB | **229.49 kB**                        |
| Entry, gzipped                          | 212.78 kB | **72.07 kB**                         |
| `it` / `es` / `pt` / `de` / `fr` chunks | —         | 78.27–83.07 kB (28.03–29.49 kB gzip) |

**How it is built.** The tables are data now, one file each, in
`src/locales/<code>.ts`. `src/i18n.ts` keeps the types, the language list, the
`format` helper and the loading: `stringsFor(lang)` is the synchronous read the
app makes while drawing (English until the chosen table has arrived), and
`loadStrings(lang)` is the one writer, caching what it fetched. `main.tsx` fetches
the saved language before the first render, so nobody sees a frame of English
first — and if that fetch fails, the app still starts rather than going blank.
`src/i18n-tables.ts` imports all six statically for the code that genuinely needs
them: the two i18n gates, the live-metrics suite, the catalogue drift guard, and
the tests. **The app must never import it** — that sentence is in the file, because
one import would undo this whole batch.

Two small things fell out of it. `tool-section.tsx` used to name the current
language by finding which of the six tables was identity-equal to the table it was
handed; with one table in memory that search is gone, replaced by `langOfTable`,
which only compares tables that have actually been read — otherwise English would
be reported as whatever language was asked for first. And `detectInitialLang` now
validates the stored code against the languages the app offers rather than against
the keys of a table that may not be loaded yet.

**Six tests** (`src/i18n.test.ts`): English until the table arrives; a language
read once however many callers ask; English answered without a fetch; a table
named by identity, and only once it exists; the stored language taken and a
garbage one refused; and every one of the six tables checked to have the same key
shape as English — the i18n gates compare keys from the outside, this compares
them from inside the app.

#### The defect the split exposed

Splitting `i18n.ts` into one file per language made a shipped mistake visible that
no gate had seen: **the pricing copy was in the wrong table in four of the six
languages.** `src/locales/en.ts` held the Italian text and `it.ts` the English,
`fr.ts` held the German and `de.ts` the French; Spanish and Portuguese were
correct. The Plans screen in the app (the one screen that copy belongs to) was
therefore showing Italian to English readers and English to Italian readers,
German to French and French to German — in a release.

It came from the Batches A–Q rewrite that replaced the paid plans with the free
page. That edit rewrote the same section in all six tables and applied the texts
in the wrong order to two pairs of them. **Every gate passed, and would pass
again**: `check:i18n` proves each table has every key with matching placeholders —
all true; `check:i18n-quality` flags a translation that is _identical to English_ —
but a swap leaves the two strings perfectly distinct, one being Italian and the
other English, just in each other's table. The shape test in this batch would not
have caught it either, for the same reason.

The fix is a block-for-block swap back, and it is now pinned: `src/i18n.test.ts`
asserts each locale's `pricing.title` against its own literal, six lines that
exist precisely because nothing automatic can judge arbitrary copy. The two
tables are also why the tables are one file per language now — a rewrite that has
to name the file it writes cannot cross two of them by index.

A one-off fingerprint pass over all 58 sections of all six tables (function-word
counts per language, best match per section) found no other crossed block.

Validation: tsc, eslint, Prettier, `npm run test:coverage` (290 tests in 20 files,
thresholds met), `npm run build` with the entry and the five locale chunks
measured above, the five check gates, `test-scan`, `test-live-metrics`, and the
site build with its SEO gate. Not measured: memory at runtime on Windows, and the
cost of the first fetch for a reader whose language is not English (a local file
in the packaged app, so a disk read rather than a network one).

## Final report

### Changes applied

| Area         | Change                                                                                                                                                                                                                | Breaking?                                                                                                |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Desktop app  | Pricing page is a free page, translated in six locales; Pro price constants and the paywall dialog removed                                                                                                            | **BREAKING (UI only)** — the Pro purchase path in the app is gone                                        |
| Desktop app  | "Pro" badges removed where they rendered on now-free features; Lifetime-only framing and upsell removed from the profile tools                                                                                        | No                                                                                                       |
| Desktop app  | Dead commerce components deleted (`halloween-offer`, `halloween-decor`, `use-promo`, `use-lifetime-offer`)                                                                                                            | No (unreferenced)                                                                                        |
| Testing      | Root `npm test` (Vitest + jsdom + Testing Library + jest-axe): 58 tests in 6 files over `lib.ts`, the Fix-all pipeline, `Badge`/`Toggle`, the free plans page and three IPC-facing panels through a fake Tauri bridge | No                                                                                                       |
| Desktop app  | `recommendedTweaks()` no longer takes a licence flag; scan's dead Pro section removed                                                                                                                                 | **BREAKING (internal API)** — call sites updated in `scan.tsx`, `scan-runner.ts`, `scripts/test-scan.ts` |
| Desktop app  | `DiskHealthCard` derives its reading from the drive it belongs to; paused-scan writes behind helpers                                                                                                                  | No                                                                                                       |
| Backend      | `pctweaker` is a first-class legacy alias of `wincraft`; migration rewrites entitlement rows                                                                                                                          | No (data preserved)                                                                                      |
| Backend      | Refunds of legacy Lifetime purchases still revoke access; abandoned legacy checkouts still get reminders; legacy app id still accepted for error reports                                                              | No                                                                                                       |
| Backend      | `DATABASE_CA` enables verified TLS; `.env.example` corrected (sender name, price comments)                                                                                                                            | No (opt-in)                                                                                              |
| CI           | `checks.yml` runs ESLint and Prettier                                                                                                                                                                                 | No                                                                                                       |
| Repo hygiene | NUL byte and CRLF in `cleanup.rs` fixed; ten zero-byte junk files deleted; design-token baseline re-locked                                                                                                            | No                                                                                                       |
| Docs         | `CONTRIBUTING.md`, `docs/ARCHITECTURE.md`, `docs/API.md` added; README licence/plan copy corrected; RELEASING.md documents the fork's updater and signing-key options                                                 | No                                                                                                       |

### Changes not applied (and why)

1. **The 35 controls still flagged `requires_pro` in the Rust catalogue —
   decided, and now inert.** `src-tauri/src/lib.rs:2727-2729` still asserts
   `81 total / 35 Pro / 46 Free` and the flags stay as metadata nothing reads; what
   changed (Batch W, on the owner's instruction) is that no public text publishes
   the split any more, and `check-public-counts` fails if one does. Flipping the
   flags themselves would mean rebuilding and re-testing Rust, which this
   environment cannot do, and would change nothing the app does.
2. **The Rust-side licence stub.** `require_pro()` now always returns `Ok`, and
   ~35 catalogue entries still carry `requires_pro` flags that no code reads.
   Removing the stub means touching every gated command's signature, and the
   metadata is the public Free/Pro split quoted in item 1, so both are left for a
   decision rather than a silent sweep. The frontend plumbing that used to
   consume them is gone (Batch F).
3. **Frontend coverage: 40.03% of lines, now measured and ratcheted.** 290 tests (Batches G–Z) cover
   `lib.ts`, the Fix-all pipeline, the scan flow, `Badge`/`Toggle`, the plans
   page, the cleaners/maintenance cards, the startup/drift/crash surfaces, the
   thermal panel and its profiles, the thermal judge and driver plans, the driver
   audit and update catalogue, the debloat panel, and the catalogue/translation
   drift guard, the Before & After panel, the tweak list, the change history and
   the language loading.
   The fake `invoke` harness the earlier batches were waiting for
   exists (`src/test-bridge.ts`) and is what the IPC-facing cards are tested
   through. `vitest.config.ts` now carries thresholds just under the measured tree
   and CI enforces them, so the number cannot quietly fall; the thresholds were
   raised with the tests (28/26/28/29 → 31/29/31/32 → 33/32/32/34 → 38/36/37/38
   → 38/36/38/39) instead of being left where they were. Still uncovered, in order
   of missing lines: `App.tsx` (295 — the
   shell: state, IPC, routing and layout, now that the tweak list itself is out
   and tested), `maintenance.tsx` (225 — ten cards beyond the two under test),
   `pro.tsx` (151), `advanced-controls.tsx` (149), then `repair.tsx`,
   `account.tsx`, `health.tsx`, `live-dashboard.tsx`, `diagnostics.tsx` and the
   remaining panels. The drawing
   half of `before-after.tsx` (its canvas report) cannot be covered in jsdom: that
   needs a packaged Windows run.
4. **Load locales on demand.** The panel split is done (Batch I) but the entry
   chunk is still 631 kB, and `src/i18n.ts` measured alone accounts for 486 kB of
   it (77%). English could load eagerly and the other five tables on demand. That
   touches every direct `STRINGS[...]` reader and both i18n gates, so it is
   proposed rather than started.
5. **Rust-side gates** (`cargo fmt --check`, `cargo clippy -D warnings`,
   `cargo audit`, `cargo test`), and the Rust `unwrap`/`expect` review. No
   `cargo`/`rustc` in this environment — see _Remaining risks_. Note: the earlier
   audit's "111 non-test `unwrap`/`expect`" figure did not survive re-measurement.
   Depending on how `#[cfg(test)]` items are excluded, a text heuristic lands
   anywhere between ~40 and ~250 hits, and the largest files differ per method
   (`rollback.rs`, `debloat.rs`, `download_limit.rs`, `dns.rs`, `gaming.rs`,
   `turbo.rs`), with a large share of them in test support. This needs a
   Rust-aware pass (`cargo clippy`), not a grep.
6. **Website and marketing trees** (`site/`, `marketing/`, Python and PowerShell
   scripts) have not been audited in depth; they have their own dependency trees.
   What Batch W did cover: the site's origin end to end (including `CNAME` and the
   marketing CTAs) and every public control count. What it did not touch, because
   it is a commercial claim rather than a stale number: the pricing cards
   (€59.99 / €7.99 / €99), the FAQ's subscription sentence, the listings' "WITH
   PRO" sections, `docs/pad.xml`'s Pro prose, and the Uninstaller page's own
   pricing. The app itself has no licence gate, so those texts describe something
   the app does not enforce.
7. **The old origin outside the app — resolved in Batch R, three pieces left.**
   Every live doc, shipped link and the PAD feed now names `wincraft.app`, and the
   support address follows the code (`support@wincraft.app`, documented in
   `backend/.env.example` as Cloudflare-routed). Still on the old origin:
   - **`site/public/CNAME` and the marketing CTAs — closed in Batch W.** The
     owner confirmed on 2026-10-12 that `wincraft.app` is the live origin: `CNAME`
     follows it, the SEO gate now asserts the shipped `CNAME` against
     `site/src/seo.ts`, and the four marketing files link the new domain with a
     comment recording both decisions.
   - **`docs/pad.xml`'s Pro/pricing prose** (`Char_Desc_2000`: "advanced Pro tools
     are paid", plus the `Expire_Other_Info` and `Char_Desc_250/450` access
     wording) still describes a paid tier, in the publisher feed no gate watches.
     It publishes no count, so the "no split" rule does not cover it; it needs the
     same product decision as the website's pricing copy (item 6).
8. **Rename leftovers outside the UI** (flagged, not changed, because each is an
   external or persisted name): the uninstaller download URL in
   `maintenance.tsx` points at the upstream `pc-tweaker-uninstaller` release and
   file name; the Redaxa cross-promo link carries `?ref=pctweaker` and the
   receiving site may only recognise that value; `repair-eta.ts` stores its
   measurements under the `pctweaker.repair.stepDurations` key, so renaming it
   would discard existing estimates; and the ≤1.16.x offer parsers in
   `lifetime-offer.ts`/`promo.ts` must keep the legacy product id to read the
   offers those clients receive. Rust temp-file prefixes (`pctweaker-*`) are
   internal and harmless. The exported profile file name was renamed to
   `.wincraft.json`, which is safe because importing matches on the extension.
9. **The offer pipeline in the backend** (`/api/offers/lifetime`, `/api/offers/promo`,
   promo coupons) still runs for installed clients up to 1.16.x. Its client-side
   parsers stay because the promo test suites import them.
10. **`COMPREHENSIVE-AUDIT-FIX-PLAN.md` itself is new** — the file was never in the
    repository, so this is the record the instruction asked to keep, created here.

### Commands run

All commands run from the repository root unless stated. Results are from the
final pass (2026-10-12).

| Command                                                                                                                                                                                                      | Result                                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npx tsc --noEmit`                                                                                                                                                                                           | PASS (also type-checks the new test files)                                                                                                                          |
| `npm test` (Vitest, jsdom)                                                                                                                                                                                   | PASS — 241 tests in 16 files (~28 s); 18 repeat runs after an unreproduced one-off failure, see Batch M                                                             |
| `rm -rf node_modules && npm ci` (fresh clone)                                                                                                                                                                | PASS — 323 packages; the suite runs afterwards, which is the proof that the runner's dependencies are declared and not just present in one machine's `node_modules` |
| `npx eslint src`                                                                                                                                                                                             | PASS — 0 errors, 0 warnings (was 2 errors, 6 warnings); whole-tree run, which is how the Batch L miss was found                                                     |
| `npx prettier --check "src/**/*.{ts,tsx,css}"`                                                                                                                                                               | PASS                                                                                                                                                                |
| `npm run check:i18n`                                                                                                                                                                                         | PASS — 1,583 keys × 6 languages                                                                                                                                     |
| `npm run check:i18n-quality`                                                                                                                                                                                 | PASS — 175 identical-to-English keys on the reviewed list                                                                                                           |
| `npm run check:public-counts`                                                                                                                                                                                | PASS — "81 controls, published without a Free/Pro split" (9 files; verified red twice, see Batches U-W)                                                             |
| `npm run check:no-test-pro`                                                                                                                                                                                  | PASS                                                                                                                                                                |
| `node scripts/check-design-tokens.mjs`                                                                                                                                                                       | PASS — 131 legacy raw palette classes, exit 0                                                                                                                       |
| `node scripts/test-scan.mjs`                                                                                                                                                                                 | PASS — 15/15 (was 14/15)                                                                                                                                            |
| `node scripts/test-ui-polish.mjs`                                                                                                                                                                            | PASS                                                                                                                                                                |
| `node scripts/test-live-metrics.mjs`, `test-debloat-model.mjs`, `test-feature-order.mjs`, `test-starter-presets.mjs`, `test-language-default.mjs`, `test-history-model.mjs`, `release-verification.test.mjs` | PASS                                                                                                                                                                |
| `npm run test:advisor                                                                                                                                                                                        | thermals                                                                                                                                                            | repair-eta | updater | debloat | download-limit-reconcile | promo | lifetime-offer` | PASS |
| `npm run build`                                                                                                                                                                                              | PASS — entry 631.46 kB / 211.69 kB gzip plus 16 lazy panel chunks (7–75 kB), CSS 210.51 kB in one file                                                              |
| `cd site && npm ci && npm run build && npm run check:seo`                                                                                                                                                    | PASS — the site builds and its SEO gate covers 17/17 routes (was: the build failed on the deleted component, then the gate failed on all 17 origins; see Batch S)   |
| Site SEO origin assertion, reproduced without a site build (`site/scripts/check-seo.mjs:18` against the committed sitemap)                                                                                   | **FAILS — 17 of 17 sitemap URLs are on `wincraft.app` while the assertion demands `pctweaker.app`**; see Batch R                                                    |
| `cd backend && npm test`                                                                                                                                                                                     | PASS — 161/161 (was 121/161 on master)                                                                                                                              |
| `cargo test --manifest-path src-tauri/Cargo.toml` and `npm run check:rust`                                                                                                                                   | **NOT RUN — no Rust toolchain in this environment** (`cargo`/`rustc` absent; `check:native-policy` fails with `spawnSync cargo ENOENT`)                             |
| `npm run check` (full)                                                                                                                                                                                       | **NOT RUN** — it ends in `check:rust`, which needs the Windows VM. Run every other step with the commands above                                                     |

### Remaining risks

1. **Rust is unverified in this environment.** All Rust statements here are static
   review, and text heuristics over Rust files proved unreliable (see the
   `unwrap`/`expect` note under _Changes not applied_), so no Rust finding in this
   report should be treated as measured. Before merging, run on Windows:
   `cargo fmt --check --manifest-path src-tauri/Cargo.toml`,
   `cargo clippy --all-targets --manifest-path src-tauri/Cargo.toml -- -D warnings`,
   `cargo test --manifest-path src-tauri/Cargo.toml`,
   `cargo audit --manifest-path src-tauri/Cargo.toml`.
2. **The fork cannot ship updates** as configured: the updater endpoint and public
   key in `src-tauri/tauri.conf.json` are upstream's, and the fork has no releases
   (0 Actions runs, ever). Documented in RELEASING.md; changing the endpoint
   without a matching key change makes every update fail verification.
3. **CI has still never executed.** The workflow is now correct as far as static
   reading goes, but the first real run may surface environment problems (Node
   version, pg-mem, Rust target). Treat the first CI run as a gate, not a formality.
4. **Catalogue metadata still says "35 Pro", and nothing public repeats it.**
   The app ignores the flag; the data and the Rust assertion keep the split as
   metadata; the nine public files no longer publish it, and
   `check-public-counts` fails if they start again. What remains is the flag
   itself, which only a Rust build can change.
5. **`require_pro()` is an always-`Ok` stub** in `src-tauri/src/lib.rs`, and the
   `PRO_REQUIRED: ` error path it can no longer produce is still handled in
   `App.tsx` and `profiles.tsx`. Harmless today, but a reader has to follow it to
   learn that the gate is gone.
6. **The app shell has no test.** The tweak list left it in Batch X, so the rows
   and the rule that selects them are covered — but the shell itself is not:
   `App.tsx` still has 295 uncovered lines of state, IPC, routing and layout, and
   mounting it means mocking every read the workspace makes on mount plus the
   486 kB locale table. The same axe pass the panels now get has not run over
   `live-dashboard.tsx`, `lifetime-tools.tsx` or `starter-profiles.tsx` — asked
   directly, all three are fine on the one rule most likely to be broken by hand:
   each puts its `<h4>` under an `<h3>` (a `Card`'s own title, the block's title,
   the section's heading), so nothing skips a level. What is untested there is
   everything else axe looks at. Everything below the shell has been exercised at least
   once, but a packaged-app run on Windows is still the only check that the real
   IPC and the lazy chunks behave under Tauri.
7. **Deliberate rule suppressions.** Five `react-hooks/set-state-in-effect`
   suppressions carry rationale comments. They are honest but they are still
   suppressions: a reviewer should confirm the fetch-then-set shape is what they
   want, or schedule the restructuring.
8. **Lazy chunks are unverified on Windows.** The split builds, keeps the CSS
   cascade and is referenced through dynamic imports only, but nothing here can
   load a chunk through the Tauri asset protocol. A failed chunk is caught by
   `PageBoundary` (retry button) — a recovery path, not a substitute for the
   smoke test. Vite still warns about a >500 kB entry chunk.
9. **Untested trees**: `site/`, `marketing/`, the Python and PowerShell tooling,
   and the Store submission scripts.

### Next steps

Ranked by value per unit of risk. None of these are started.

1. **Run the Rust gates on Windows** (commands above) and add `cargo fmt --check`,
   `cargo clippy -D warnings` and `cargo audit` to CI.
2. **Decide the catalogue Pro split** (item 1 under _Changes not applied_): either
   flip the 35 flags and update the nine public files plus the assertion, or drop
   the Free/Pro counts from the public text. Then `check:public-counts` follows.
3. **Retire the Rust `require_pro()` stub** and the `PRO_REQUIRED: ` handling in
   `App.tsx`/`profiles.tsx` once the catalogue split (item 2) is decided, so the
   free build has no licence gate to misread.
4. **Keep growing the frontend suite.** Nineteen files and 283 tests now (Batches
   G–Y), the coverage ratchet is in place and was raised with them (Batch U, X, Y),
   and every gate in the release chain now also runs on every push (Batch T). The
   tweak list left `App.tsx` and is covered (Batch X); so is the change history
   (Batch Y). Next by size: `maintenance.tsx` (225 lines, ten of its twelve cards
   beyond the two under test), `pro.tsx` (151), `advanced-controls.tsx` (149),
   then `repair.tsx`, `account.tsx`, `health.tsx`, `live-dashboard.tsx`. The
   panels not yet under an axe pass are the ones to write next, not the biggest
   ones: `live-dashboard.tsx`, `lifetime-tools.tsx` and `starter-profiles.tsx`.
   Their heading levels were checked by reading them and are sound, so what is
   missing there is the rest of the pass — contrast, names, live regions. A
   packaged-app smoke test needs a Windows runner.
5. **Smoke-test the lazy chunks on Windows**: open every section once in a
   packaged build and confirm the skeleton resolves and no chunk fails to load.
   Nothing in this sandbox can exercise the Tauri asset protocol.
6. **Answer one question about the site's origin, then finish the copy pass.**
   Done in Batch R: the app's shipped links, the root and backend docs, the
   support address and the PAD feed. Waiting: **is the site served from
   `wincraft.app` or `pctweaker.app`?** If the answer is `wincraft.app`,
   `site/public/CNAME` follows, and with it the canonical/OpenGraph tags in
   `site/index.html` and `site/public/tweaky-driver/index.html` plus the origin
   assertion in `site/scripts/check-seo.mjs` (red on all 17 sitemap URLs today).
   The marketing CTAs need the same answer.
7. **Retire the offer pipeline** once installed clients below 1.17 are out of
   support: remove `src/promo.ts`, `src/lifetime-offer.ts`, their tests and the
   `/api/offers/*` routes together.
8. **Rust unwrap audit** with `cargo clippy` (see item 5 above for why the count
   is not quoted here). Replace `unwrap`/`expect` with propagated errors where
   the failure is reachable at runtime — file I/O, registry reads and process
   launch are the likely places; `Regex::new` on a literal is not.
9. **Accessibility pass** with a real tool (axe/NVDA) on the six main panels,
   then wire the result into CI if it can run headless.
10. **The locale tables on demand — measured, waiting on the decision.** See
    _Measurement_ above: −402,770 B from the entry chunk (−63.8%), one ~80 kB
    chunk per language fetched on first use, and a touch list of seven app files
    plus four scripts. Approved in principle; the numbers came first on request.
11. **Mount the shell itself.** The tweak list is out of `App.tsx` (Batch X), so
    what is left there is the part worth testing next: the section routing, the
    mount reads and the toasts. It needs the workspace's own reads mocked and the
    locale table accepted, which makes it the heaviest single test in the tree.
12. **Decide the site's remaining commercial copy** (Batch W, item 6): the pricing
    cards, the FAQ's subscription sentence, the listings' "WITH PRO" sections and
    `docs/pad.xml`'s Pro prose all describe a paid tier the app does not enforce.
    Either the plans are real and the copy stays, or the copy follows the app.
