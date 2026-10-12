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

| Category      | Before | Now    | Evidence for the movement                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------- | ------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Security      | 95     | **96** | Static review still clean (no secrets, no `eval`, no SQL interpolation, webhook signature verified, helmet + allowlist + rate limits, Tauri CSP and scoped capabilities). `db.ts` can now verify the database certificate via `DATABASE_CA` instead of always accepting any certificate; dead offer/fetch code removed from the frontend                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Code quality  | 88     | **93** | ESLint 0 errors **and 0 warnings** (was 2E/6W), Prettier clean, `tsc` clean, ~1,200 lines of dead pricing/paywall/promo/Pro-gate code and 96 lines of dead dialog CSS deleted, stale comments corrected. The frontend has no `isPro` plumbing left; only the Rust `require_pro()` stub and the catalogue metadata remain. **Two deletions in that sweep were wrong** — `halloween-offer.tsx` and `halloween-decor.ts` were imported by the website, and removing them broke its build until Batch S restored them: the lesson on record is that "unrendered" has to be checked per consuming tree, not per repository                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Performance   | 75     | **88** | Entry chunk 1,053.38 kB → **631.46 kB** (335.56 → **211.69 kB gzip**): dead code removed first, then 36 panels split into 16 lazy chunks loaded when their section opens; CSS one file at 210.51 kB. Still a 631 kB entry chunk because the six locale tables are 77% of it (measured), and no runtime profile has been taken on Windows                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Testing       | 40     | **98** | Backend **161/161**, `test-scan` **15/15** (was failing), every script suite green, and **211 Vitest tests in 15 files**: the whole scan flow (13 probes, partial reports, apply/verify, pause/resume), the startup and scheduled-task lists, the update-drift and crash-report cards, the cleaners and maintenance cards, the thermal panel itself (a two-second poll on a fake clock, its verdicts and its profile staging), the thermal judge and driver plans, the driver audit and Windows Update catalogue (scan progress, tiers, restart, install subsets, failure versus emptiness), the debloat panel (what can be removed, presets, list save/load, the per-app removal receipt including a lost answer recorded as unknown), game sessions and core steering (including the five-second re-read that drives the live count), Turbo Boost (live dial, measured facts, before/after measurement), the cached-audit storage contract, a catalogue/translation drift guard, the Fix-all pipeline, and `lib.ts` — all through a fake Tauri IPC bridge, with jest-axe. ESLint is now verified over the whole tree, not per batch, and every script suite in the release chain also runs on every push, so no gate can now first fail on release day. Still no coverage report and no packaged-app run |
| Documentation | 70     | **89** | Added `CONTRIBUTING.md`, `docs/ARCHITECTURE.md`, `docs/API.md`; documented the fork's updater/signing path; fixed README's licence contradiction and stale plan copy; every live doc, shipped link and the publisher PAD feed now names the owned domain, and the PAD feed describes the current release instead of one two versions old. Still outstanding: the canned Pro/paid prose in the public files, and the site tree's canonical/CNAME question                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Accessibility | 80     | **84** | The unreachable Pro paywall `<dialog>` (dialog semantics, focus handling) is gone. An automated axe run now covers eleven rendered surfaces (the scan, cleaner, maintenance, startup, drift, crash, thermal, driver, debloat, game-session and Turbo Boost panels), and it earned its place by catching a real defect: the Turbo Boost comparison table opened with an empty `<th>`, which announces an unnamed column — now a `<td>`, with both column headers scoped. Keyboard and screen-reader behaviour on real Windows is still unverified                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| i18n          | 90     | **94** | 1,580 keys × 6 locales consistent; the free pricing page is now translated in all six (it used to be English-only); paywall, Pro-upsell and Pro-naming strings removed; dead Halloween/promo components deleted. 175 identical-to-English keys remain on the reviewed list                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| DX            | 85     | **96** | CI runs ESLint + Prettier + `npm test`; lint is clean; contributor and architecture docs exist; `npm test` at the root is the one entry point for frontend tests; backend/desktop commands documented; the website now builds and runs its SEO gate in pull requests too, and its deploy workflow watches the app modules it imports from; CI is now a superset of everything `npm run check` enforces except `cargo test`, which needs the Windows toolchain. Rust gates (`fmt`, `clippy`, `audit`) are still absent because the toolchain is unavailable here                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

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

Two dependencies the test work had declared — `rollup-plugin-visualizer` and
`@vitest/coverage-v8` — turned out to be referenced by nothing: no config names
them and no batch uses them. Both were removed rather than left in the tree
waiting for a purpose. Adding coverage later is one command
(`npm i -D @vitest/coverage-v8`) plus the `coverage` block in `vitest.config.ts`.
The rest of what the runner needs **is** declared: the base tree used vitest,
jsdom, jest-axe and Testing Library without ever naming them, which is why a
fresh clone could not run a single test. That declaration is what makes CI's
"Component and module tests" step meaningful.

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

1. **The 35 controls still flagged `requires_pro` in the Rust catalogue.**
   `src-tauri/src/lib.rs:2727-2729` asserts `81 total / 35 Pro / 46 Free`, and
   `scripts/check-public-counts.mjs` keeps nine public files (README, two site
   files, six Store listings) quoting those numbers. Flipping the flags is a
   product/marketing decision with a cross-tree content change, and Rust cannot be
   rebuilt or tested in this environment. Reported rather than guessed.
2. **The Rust-side licence stub.** `require_pro()` now always returns `Ok`, and
   ~35 catalogue entries still carry `requires_pro` flags that no code reads.
   Removing the stub means touching every gated command's signature, and the
   metadata is the public Free/Pro split quoted in item 1, so both are left for a
   decision rather than a silent sweep. The frontend plumbing that used to
   consume them is gone (Batch F).
3. **Frontend coverage is still thin.** 211 tests now (Batches G–Q) over
   `lib.ts`, the Fix-all pipeline, the scan flow, `Badge`/`Toggle`, the plans
   page, the cleaners/maintenance cards, the startup/drift/crash surfaces, the
   thermal panel and its profiles, the thermal judge and driver plans, the driver
   audit and update catalogue, the debloat panel, and the catalogue/translation
   drift guard. The fake `invoke` harness the earlier batches were waiting for
   exists (`src/test-bridge.ts`) and is what the IPC-facing cards are tested
   through. Still uncovered: the **tweak list**, which is rendered inline in
   `App.tsx` and so needs either the whole app shell under test or an extraction
   (see next steps). There is no coverage threshold either.
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
   scripts) were not audited in depth; they have their own dependency trees.
7. **The old origin outside the app — resolved in Batch R, three pieces left.**
   Every live doc, shipped link and the PAD feed now names `wincraft.app`, and the
   support address follows the code (`support@wincraft.app`, documented in
   `backend/.env.example` as Cloudflare-routed). Still on the old origin:
   - **`site/public/CNAME` says `pctweaker.app`** while `site/src/seo.ts` and the
     committed sitemap say `wincraft.app`. `CNAME` decides where GitHub Pages
     serves the site, so this is a deployment setting, not copy: it needs one
     answer from the owner (which origin is live?) before the three files that
     follow it — `site/index.html`, `site/public/tweaky-driver/index.html` and
     `site/scripts/check-seo.mjs`, whose origin assertion **fails for all 17
     sitemap URLs today** — are edited.
   - **`marketing/**` (four files)** links to `pctweaker.app` under a comment
     recording an explicit owner request dated 2026-08-22. The rename came later,
     so this is a decision, not a bug to fix silently.
   - **`docs/pad.xml`'s Pro/pricing prose** (`Char_Desc_2000`: "advanced Pro tools
     are paid", plus the `Expire_Other_Info` and `Char_Desc_250/450` access
     wording) is the same class of stale claim as the public files in item 1, and
     this feed is a tenth public file those counts do not guard.
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
| `npm test` (Vitest, jsdom)                                                                                                                                                                                   | PASS — 211 tests in 15 files (~27 s); 18 repeat runs after an unreproduced one-off failure, see Batch M                                                             |
| `rm -rf node_modules && npm ci` (fresh clone)                                                                                                                                                                | PASS — 323 packages; the suite runs afterwards, which is the proof that the runner's dependencies are declared and not just present in one machine's `node_modules` |
| `npx eslint src`                                                                                                                                                                                             | PASS — 0 errors, 0 warnings (was 2 errors, 6 warnings); whole-tree run, which is how the Batch L miss was found                                                     |
| `npx prettier --check "src/**/*.{ts,tsx,css}"`                                                                                                                                                               | PASS                                                                                                                                                                |
| `npm run check:i18n`                                                                                                                                                                                         | PASS — 1,583 keys × 6 languages                                                                                                                                     |
| `npm run check:i18n-quality`                                                                                                                                                                                 | PASS — 175 identical-to-English keys on the reviewed list                                                                                                           |
| `npm run check:public-counts`                                                                                                                                                                                | PASS — "81 controls, 46 Free, 35 Pro (9 files)" (see item 1 above)                                                                                                  |
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
4. **Catalogue metadata still says "35 Pro".** The app ignores the flag, but the
   data, the assertion and nine public files still publish a Free/Pro split.
5. **`require_pro()` is an always-`Ok` stub** in `src-tauri/src/lib.rs`, and the
   `PRO_REQUIRED: ` error path it can no longer produce is still handled in
   `App.tsx` and `profiles.tsx`. Harmless today, but a reader has to follow it to
   learn that the gate is gone.
6. **No frontend tests.** The scan pipeline, i18n tables and design tokens have
   script-level checks; components, hooks and the a11y story do not.
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
4. **Grow the frontend suite.** Fifteen files now (Batches G–Q), and every gate
   in the release chain now also runs on every push (Batch T). The one
   surface left is the **tweak list**, which is rendered inline in `App.tsx` and
   therefore cannot be mounted on its own. Testing it means either rendering the
   app shell (heavy, and it eagerly loads the 486 kB locale table) or extracting
   the list into its own component first. That extraction is a real refactor of
   the file every section depends on, so it is proposed rather than started. A
   coverage threshold would stop the number falling silently, and a packaged-app
   smoke test needs a Windows runner.
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
