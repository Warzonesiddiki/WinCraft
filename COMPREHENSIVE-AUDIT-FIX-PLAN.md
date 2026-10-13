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

| Category      | Before | Now    | Evidence for the movement                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------- | ------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Security      | 95     | **96** | Static review still clean (no secrets, no `eval`, no SQL interpolation, webhook signature verified, helmet + allowlist + rate limits, Tauri CSP and scoped capabilities). `db.ts` can now verify the database certificate via `DATABASE_CA` instead of always accepting any certificate; dead offer/fetch code removed from the frontend                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               Batch AE then deleted the licence store itself — the Ed25519 signature check, the embedded public key, the payload parser and the file it read — so that class of code can no longer be got wrong |
| Code quality  | 88     | **95** | ESLint 0 errors **and 0 warnings** (was 2E/6W), Prettier clean, `tsc` clean, ~1,200 lines of dead pricing/paywall/promo/Pro-gate code and 96 lines of dead dialog CSS deleted, stale comments corrected. The frontend has no `isPro` plumbing left and, since Batch AB's frontend half, no licence-refresh toast either: the last two places that handled `PRO_REQUIRED: ` are gone with the string that explained it. Batch AB then removed the Rust half too — the stub, `PRO_REQUIRED_PREFIX`, the two helpers behind them and all 38 call sites, with every binding their removal orphaned — so what is left of the Free/Pro split is the catalogue metadata and the assertion that pins its counts. **Two deletions in that sweep were wrong** — `halloween-offer.tsx` and `halloween-decor.ts` were imported by the website, and removing them broke its build until Batch S restored them: the lesson on record is that "unrendered" has to be checked per consuming tree, not per repository. Batch X then took the app's main surface out of the shell: the tweak list is a tested rule (`tweak-list-model.ts`) plus a tested row (`tweak-row.tsx`), and `App.tsx` is ~150 lines smaller for it                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       Batch AE/AF removed the licence machinery and the test-only plumbing around it — 660 lines of Rust, two CLI entry points, a Cargo feature and its release guard — with two scripted sweeps, one for the call sites and one for the resources they orphaned, clearing the tree for `cargo check`; Batch AI then removed the split from the source data too, so the catalogue's own counts read 81 / 0 / 81 and the public-counts gate no longer has a second number to police |
| Performance   | 75     | **94** | Entry chunk 1,053.38 kB → **229.49 kB** (335.56 → **72.07 kB gzip**): dead code removed first, then 36 panels split into 16 lazy chunks, then the five non-English locale tables split out of the entry (631.46 → 229.49 kB, Batch Z) — each language is now a 78–83 kB chunk fetched when it is chosen, and English stays in the bundle as the primary language and fallback. CSS still one file at 212.55 kB, and no runtime profile has been taken on Windows                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Testing       | 40     | **99** | Backend **161/161**, `test-scan` **15/15** (was failing), every script suite green, and **309 Vitest tests in 21 files**: the whole scan flow (13 probes, partial reports, apply/verify, pause/resume), the startup and scheduled-task lists, the update-drift and crash-report cards, the cleaners and maintenance cards, the thermal panel itself (a two-second poll on a fake clock, its verdicts and its profile staging), the thermal judge and driver plans, the driver audit and Windows Update catalogue (scan progress, tiers, restart, install subsets, failure versus emptiness), the debloat panel (what can be removed, presets, list save/load, the per-app removal receipt including a lost answer recorded as unknown), game sessions and core steering (including the five-second re-read that drives the live count), Turbo Boost (live dial, measured facts, before/after measurement), the Before & After comparison (both measurements, the verdicts and their wording, the startup-log read, the history list and the report export), the tweak list's own rule and row (Batch X), the change history (Batch Y), the language loading (Batch Z), "Right now"'s live promises (Batch AC: the timer stops when the window leaves the front, the slow sources are read on their own schedules, a sensor that is absent is reported as absent, and a gap in the readings restarts the chart), the cached-audit storage contract, a catalogue/translation drift guard, the Fix-all pipeline, and `lib.ts` — all through a fake Tauri IPC bridge, with jest-axe. ESLint is now verified over the whole tree, not per batch, and every script suite in the release chain also runs on every push, so no gate can now first fail on release day. Coverage is measured over every source file (**43.94% of lines**, 2,586 still uncovered — concentrated in `App.tsx` and a dozen untested panels) and enforced as a ratchet in CI, whose thresholds were raised with the tests rather than left behind them. The Rust suite moved with Batch AB's gate removal (two tests that existed only to prove the licence check passed, one renamed to keep its elevation half, and the catalogue-wide funnel test rewritten), and that is the one part of the batch this environment cannot compile — see _Remaining risks_. Not measured: a packaged-app run on Windows Batch AE/AF moved the Rust half again (the feature's two CLI tests went; one test replaced them), and Batch AG's public copy is now policed by the gate that reads `README.md` |
| Documentation | 70     | **93** | Added `CONTRIBUTING.md`, `docs/ARCHITECTURE.md`, `docs/API.md`; documented the fork's updater/signing path; fixed README's licence contradiction and stale plan copy; every live doc, shipped link and the publisher PAD feed now names the owned domain, and the PAD feed describes the current release instead of one two versions old. Every public control count is now the catalogue's own total and nothing more, the site's origin is single-source including the `CNAME` that decides where it is served, and the marketing CTAs point at the site the owner confirmed, and no live document, listing or piece of structured data advertises a paid tier: Batch AA removed the pricing cards, the campaign strip and hero card, the JSON-LD offers, the six listings' "WITH PRO" paragraphs, the README's Free/Pro column and the PAD feed's Pro prose. The residual Pro/paid prose is gone (Batch AA: the site's pricing cards and the subscription FAQ, the guide and support claims, the PAD feed and the privacy copy that described a paid plan; the listings carry no paid claim). Batch AB's Rust half also corrected the two documents that still described the licence gate: `docs/ARCHITECTURE.md` called `require_pro()` a no-op stub kept "so the enforcement plumbing still compiles" and listed "license verification" as a Rust suite, and `scripts/vm/README.md` still asked the tester to "sign in with a Pro licence (11 of the 15 controls are Pro)". Still outstanding: the live Halloween campaign's WinCraft offers, which are the owner's call                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          Batch AG rewrote the README around what the app is now — a task table for the searches the page should answer, the zero-compromise claims, a FAQ, and 1.18 release notes — and dropped the 1.15 leftovers; both PRIVACY copies stopped naming a subscription WinCraft never sold |
| Accessibility | 80     | **88** | The unreachable Pro paywall `<dialog>` (dialog semantics, focus handling) is gone. An automated axe run now covers thirteen rendered surfaces (the scan, cleaner, maintenance, startup, drift, crash, thermal, driver, debloat, game-session, Before & After, Turbo Boost and "Right now" panels), and it has earned its place twice: the Turbo Boost comparison table opened with an empty `<th>`, which announces an unnamed column — now a `<td>`, with both column headers scoped — and the Before & After panel jumped from `<h2>` straight to `<h4>` in two places, which reads as a broken outline to a screen reader, now `<h3>` with the stylesheet following. "Right now" added its live region, meter and tooltip unchanged (Batch AC), and Batch AH closed the hole the pass had left: the Lifetime Tools and the starter profiles now have suites of their own, both axe-clean, which is fifteen surfaces. What that pass cannot see is worth stating plainly — jsdom has no layout, so axe skips colour contrast entirely, and focus order and the real render still need a screen reader on Windows: that is what keeps this category below the others                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| i18n          | 90     | **94** | 1,580 keys × 6 locales consistent; the free pricing page is now translated in all six (it used to be English-only); paywall, Pro-upsell and Pro-naming strings removed; dead Halloween/promo components deleted. 175 identical-to-English keys remain on the reviewed list                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| DX            | 85     | **96** | CI runs ESLint + Prettier + `npm test`; lint is clean; contributor and architecture docs exist; `npm test` at the root is the one entry point for frontend tests; backend/desktop commands documented; the website now builds and runs its SEO gate in pull requests too, and its deploy workflow watches the app modules it imports from; CI is now a superset of everything `npm run check` enforces except `cargo test`, which needs the Windows toolchain. Rust gates (`fmt`, `clippy`, `audit`) are still absent because the toolchain is unavailable here                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |

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

**Batch AA later settled all of this**, on the owner's answer: the site's plans,
the FAQ's subscription sentence, the guide and support claims and `docs/pad.xml`
now state the free product, and the Uninstaller page keeps its own price without
borrowing WinCraft's plans. What is left is the live Halloween campaign, whose
WinCraft offers are for plans the app no longer sells — a commercial action with
Stripe objects behind it, not an edit.

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

### Batch AA — the site stops selling a product that is free (done)

The owner's answer to the last open commercial question was "remove the paid
plans". The site had them in five places, and each described a tier the app no
longer enforces.

**Removed from `site/`:**

- the three pricing cards (`FREE €0`, `PRO — ANNUAL €59.99 / year · monthly option
€7.99` with `SAVE 37% VS MONTHLY`, `LIFETIME €99` with `MOST CHOSEN`) and the
  campaign machinery that priced them — struck prices, countdown, coupon terms.
  The section is now one card: `€0`, everything included, eight lines of what is
  in it, and one sentence saying plainly that WinCraft used to have paid plans and
  that a tip funds the next release without unlocking anything;
- the FAQ answer that sold the subscription (monthly, annual, lifetime, the
  Uninstaller bonus, renewal terms) — now "What does WinCraft cost?" → "Nothing";
- the support entry "Pro features are still locked after paying", which cannot
  happen any more, replaced by what a former Pro or Lifetime owner actually needs
  (nothing to activate; the purchase record stays with the account);
- the support form's own `Pro activation` category label (the value the backend
  receives is unchanged);
- the Uninstaller page's profitable-looking coupling: "Already on a WinCraft plan?
  €4.99 per year on the same account", the 12-month bonus, and the instruction to
  open "Plans & pricing" in the app and "choose Go Pro" — a screen that no longer
  sells anything. Uninstaller Pro keeps its own €9.99 and its feature list, with
  one sentence saying it is a separate product with its own price.

**Fixed while grepping the built output rather than the sources** — four claims no
one had looked at because they were not in the pricing files:

- `practical-guides.ts` said the source is published "under a proprietary licence".
  It is MIT;
- `PRIVACY.md` and `backend/legal/PRIVACY.md` (served at `/privacy`) said each app
  "has its own paid plan; a subscription to one app does not unlock another". Now:
  each app has its own entitlement, and WinCraft itself has no plan to buy;
- `site/index.html`'s `Offer` node said "Free plan — no account required", a plan
  among plans. Now: "Free — every control included, no account required";
- `docs/pad.xml` (the publisher PAD feed) said "advanced Pro tools are paid", "free
  and paid access", and `Paid access and trial eligibility follow the official plan
and checkout`. All three now state the free product, inside the feed's own
  character limits (250: 165, 2000: 576).

**Verification, by grep on the artefact rather than the source.** The built site
contains no `€59.99`, `€7.99`, `€99`, `€4.99`, `PRO — ANNUAL`, `LIFETIME`,
`MOST CHOSEN`, `SAVE 37`, `Pro adds` or `proprietary licence`. The only euro
amounts left are `€0` — the new section and its `Offer` node — and `€9.99`, the
Uninstaller product. `check:seo` green over 17 routes, `check:public-counts` green
(81 controls, no split), backend **161/161** with the privacy copy edited, app tsc,
eslint, Prettier, 290 tests and the build unchanged.

**Not applied, and why: the Halloween campaign is still live.** `backend/src/promo.ts`
runs a real −50% promotion (owner decisions of 10 October 2026: lawful reference
prices for the EU Omnibus rule, Stripe coupons already issued, a test that
recomputes every reference) until 23:59:59 on 6 November, and three of its four
offers are the WinCraft plans. The site's strip is fed by that endpoint, so until
the campaign stops it can still show a WinCraft discount above a price section
that no longer lists a WinCraft price. Ending or narrowing it is a commercial
action with Stripe objects behind it, not an edit to make quietly — **it is the one
open question this batch leaves.**

### Batch AC — "Right now" under test, and the promises it makes in public (done)

`live-dashboard.tsx` is the first panel a reader sees, and the only one that
makes promises about what it does _not_ do: "Updated every second while this page
is open and WinCraft is in front. Nothing is measured in the background." The
panel had never been rendered in a test. It is now, with 19 tests, and the
assertions are those promises rather than the rendering:

- **the timer stops when the window leaves the front.** Blur closes it, five
  seconds later the reading count is unchanged, and the charts keep the last
  reading instead of going blank; focus brings it back;
- **a gap restarts the chart instead of joining two moments.** After a thirty
  second pause the CPU line is one point, not a straight line across the silence
  that would claim the machine sat at 55% the whole time;
- **the slow sources are read on their own schedules.** Moving the fake clock one
  second at a time shows the exact call counts: `live_sample` every second,
  `resource_users` and `system_stats` on the first reading and every other second,
  `thermal_report` once, `gpu_readings` from the second reading on;
- **a sensor that is not there is reported as absent, not as a zero.** A report
  with no readable sensor says so once and is not asked for again — no PowerShell
  or `nvidia-smi` launched every tick; a null rate reads "Measuring…" while the
  rate beside it is shown as a number;
- **a verdict is earned.** Two readings is not enough to judge, three is enough
  for the badge, and the sentence about a processor that has been busy waits for
  the ten readings it claims to have averaged;
- **the reader's reduced-motion setting is honoured** — the chart slides one step
  per reading, and does not when the preference says so;
- the pointer tooltip, the memory split (used + cached + free = total), the
  one-minute/five-minute zoom, the process list's plural and singular, the two
  ways out of a full machine, and recovery after a failed reading.

Two axe passes, on the empty state and on a busy one.

The suite found no defect: the panel's heading levels, live regions, meter and
tooltip all hold up. What it protects is the drift the file's own comments warn
about — the panel is built around "nothing is measured in the background", and
that is a property one careless dependency array would break silently.

Validation: tsc, eslint, Prettier, `npm run test:coverage` (309 tests in 21 files,
43.94% of lines, ratchet raised 38/36/38/39 → 41/40/40/42), the five gates and the
build (entry unchanged at 229.38 kB — the tests add no code to it).

### Batch AB (frontend half) — the licence the app no longer checks (done)

`require_pro()` has returned `Ok(())` since the app became free, and nothing in the
Rust tree emits `PRO_REQUIRED: ` any more. Two places in the interface still told
the reader what to do about it:

- `App.tsx`, in the catch around applying a tweak, branched on
  `message.startsWith("PRO_REQUIRED: ")` and showed "We can't verify your Pro
  subscription after this long offline" — a sentence for a state the app cannot
  reach. Its comment explained the branch by pointing at "this screen's own gate
  above" (removed in Batch C) and at `license.rs` re-verifying Pro behind it, which
  is how dead code stays plausible-looking. Both are gone; the catch words a
  refusal as what it now always is — the machine's own (a declined administrator
  prompt, a locked-down key, a value Windows writes back) — through the same
  `friendlyError` mapping every other failure uses;
- `profiles.tsx`, which classified each per-tweak failure the same way.

With no reader left, `toasts.licenseNeedsRefresh` came out of the English table and
its five translations, so no string invites a reader to fix a subscription problem
they cannot have (`check:i18n`: 1,578 keys × 6, all placeholders consistent).

**The Rust half is deliberately not in this batch.** It is the same decision —
delete the `require_pro()` stub, its ~40 call sites, the rewrites around the
`is_ok()`/`is_err()` branches that can only take one path, and `PRO_REQUIRED_PREFIX`
with the two tests that mention it — but this environment has no Rust toolchain, and
the call sites are not all bare statements: several use the result, and removing one
can leave a binding unused, which CI's `-D warnings` would reject. That is a change
to ship when it can be compiled and tested, not to guess at.

Validation: tsc, eslint, Prettier, `npm run test:coverage` (309 tests, 21 files,
43.97% of lines, ratchet 41/40/40/42), the five gates, `npm run build` (entry
229.38 → 229.17 kB), the 15-case scan suite, and the site build with `check:seo`.

### Batch AB (Rust half) — the gate itself, and the copy that promised it (done)

The frontend half removed the two readers of `PRO_REQUIRED: `. This half removed the
producer, and it was not a delete: several call sites used the result, and CI runs
`-D warnings`, so every binding the removal orphaned had to go with it.

- `require_pro()` (`lib.rs:2870`), `PRO_REQUIRED_PREFIX` (`:745`) and the three
  helpers that existed only to serve them — `requires_pro_for()`, which returned
  `false` unconditionally, `require_tweak_entitlement()` and
  `authorize_configuration_change()` — are gone, with all 38 call sites: the
  commands, the elevated re-entry points (`--elevated-download-limit`,
  `--elevated-session-apply`, `--elevated-diskopt`, `--elevated-securedefrag`,
  `--elevated-memorypurge`, `--elevated-sysrepair`), the cleanup authorizer and the
  frame counter in `fps/imp.rs`.
- What the gate was hiding was the licence check *and* the work around it.
  `apply_by_id` measured its "before" network reading through
  `require_tweak_entitlement(...).is_ok()`, so the measurement now happens whenever
  it is relevant; `scan_duplicates` and `scan_large_files` resolved the app-data
  folder only to hand it to the gate; `NativeBackend` in `game_sessions.rs` carried
  a `dir` field whose single use was `require_pro`; the four monitor loops in
  `ecoqos.rs`, `monitor_profiles.rs` and `process_rules.rs` each had an
  `is_ok()`/`is_err()` clause inside their `allowed`/`active` expression; and
  `shred_files`, `clean_app_caches`, `scan_duplicates`, `scan_large_files` and
  `set_scheduled_cleanup` no longer need their `AppHandle` at all (`_app`). Each was
  fixed rather than left to warn.
- The tests followed the decision. The two whose whole subject was the entitlement
  check are gone, `expansion_entitlement_and_elevation_routing` is now
  `expansion_elevation_routing` (it still pins the admin routing, which is real),
  `startup_cleanup_survives_failure_and_does_not_require_pro` lost its suffix, and
  the catalogue-wide funnel test applies and rolls back every registry tweak with no
  licence branch — it asserts what the funnel does instead of which half of the
  catalogue it lets through.
- **The 35 catalogue flags stay**, and so does the assertion that pins 81 total /
  46 Free / 35 Pro: they are the record of what used to be gated, and
  `check-public-counts` keeps expecting 81 published without the split. The
  panel-only refusal list at `lib.rs:902` stays as well — that one is a routing
  rule, not a licence.

The copy that promised the gate went with it, in all six locales. `previewReq` was
still rendered in the game-session preview dialog as "Requires administrator rights
· Pro feature" (the admin half is true, the Pro half is not); `proIssuesTitle`
("Also available with Pro") and `unlockPro` ("Unlock Pro") had no reader left;
`verifyEmailForCheckout` described a checkout the app does not have;
`loginRequiredForCheckout` — live, on the *resend verification email* path — told the
reader to "log in or sign up before unlocking Pro", and is now
`loginRequiredToResend` with words that match its screen; and
`checkInboxAfterSignup` no longer promises that "Pro checkout opens on its own".
`check:i18n` is what proves the six tables still agree: 1,575 keys × 6.
`docs/ARCHITECTURE.md` (whose "Product state" section called `require_pro()` a
no-op stub kept "so the enforcement plumbing still compiles", and whose test table
listed "license verification") and `scripts/vm/README.md` ("no licence, no clicks";
"sign in with a Pro licence (11 of the 15 controls are Pro)") were corrected to
match. Three double-encoded `â€”` sequences in comments (`lib.rs`,
`scheduledtasks.rs`, `startup.rs`) were fixed while the files were open.

Validation: tsc, eslint over the whole tree, Prettier, 309 tests in 21 files,
`check:i18n` (1,575 × 6), `check:i18n-quality`, `check:public-counts`,
`check:no-test-pro`, `check:design-tokens`. **The Rust half is not compiled** — this
environment has no toolchain; the three commands that settle it are under
_Remaining risks_.

### Batch AA, part two — the pages that still advertised a plan (done)

Part one removed the pricing cards. What was left advertised the same plans in
places a reader does not read as "pricing", and the sweep only closed when the
_built output_ was grepped rather than the sources:

- **the campaign strip and the hero card.** `Nav` rendered `PromoStrip` on every
  page and the home hero rendered a `PromoCard` for Lifetime, both fed by
  `/api/offers/promo`: with the pricing section gone, the home page's two most
  prominent pieces were discounting a plan it no longer listed. `PromoStrip` is no
  longer rendered anywhere, the hero card is gone, and `PromoCard` now demands its
  product, plan and href instead of defaulting to WinCraft's Lifetime — the
  Uninstaller page is the only caller, and it passes its own. `PromoPrice`,
  `promoTerms` and the strip's bilingual copy had no reader left and went with
  them; `HalloweenStrip` itself is kept in `src/components/halloween-offer.tsx`
  rather than deleted, because Batch E's lesson was exactly this file: it is shared
  with the site and "unrendered" is not the same as "unused";
- **the structured data.** `site/index.html` carried four `Offer` nodes — Free,
  Pro monthly €7.99, Pro annual €59.99, Pro lifetime €99 — which is a price claim
  that gets quoted without the page around it. One offer remains, and
  `check-seo.mjs` now pins the offer list to `["0"]` _and_ fails if `€59.99`,
  `€7.99`, `€99`, `€39.99` or `€49.99` reappears anywhere in the home page's HTML.
  Both halves were negative-tested: re-inserting `€59.99` turned the gate red;
- **`/terms`.** Its meta description promised "subscriptions … billing, refunds"
  for a page whose terms now say the app is free with no subscription. Rewritten
  to the licence, acceptable use, warranty and liability the page actually covers
  (153 characters, inside the 140-160 the gate enforces — the first attempt was
  123 and the gate caught it);
- **the six store listings**, whose `WITH PRO` / `CON PRO` / `AVEC PRO` / `MIT PRO`
  / `COM O PRO` / `CON PRO` paragraph named Driver Booster, thermal profiles and
  the overlay as things to pay for. Each now heads `EVERYTHING INCLUDED`
  (`TUTTO INCLUSO`, `TOUT EST INCLUS`, `TODO INCLUIDO`, `ALLES ENTHALTEN`,
  `TUDO INCLUÍDO`) and ends "no subscription and no licence key", in its own
  language, in the same paragraph position;
- **the README**: the download link no longer says "Download Free", the profile
  line no longer says the templates are "included in Free", and the power-controls
  table lost its `Free | Pro` column — the column that published the split the
  count gate forbids everywhere else;
- **the cookie policy** no longer mentions a Halloween banner that no longer
  renders, so the only thing stored is the colour theme.

**Left, and it is a commercial decision rather than an edit:** `backend/src/promo.ts`
still runs the Halloween promotion, and three of its four offers are the WinCraft
plans — Stripe prices and coupons that exist and are configured. The site can no
longer show them, so nothing user-facing advertises the discount any more; ending
the offers means retiring Stripe objects and the test that recomputes the EU
Omnibus reference prices, which is the owner's call and is recorded as the one
open item.

Validation: `check:seo` green over 17 routes (with the two new assertions, both
proven to fail when broken), site build and `tsc`, `check:public-counts`,
`check:i18n`, `check:design-tokens`, `check:no-test-pro`, Prettier over the
listings and README, the app's 309 tests and build (entry unchanged, 229.17 kB),
backend **161/161**, and a grep of the built site: no WinCraft price, and
"Halloween" only on the Uninstaller and Tweaky Driver pages, which keep their own.

### Batch AD — the campaign the freed app no longer needs (done)

`backend/src/promo.ts` ran a −50% Halloween campaign from 10 October to
23:59:59 on 6 November whose offers were four paid plans. Three of them were
WinCraft's, and by the time the site and the app had stopped selling anything
there was no surface left for them: the offer endpoint still published them, the
site's strip still read it, and a reader who followed it reached a page with no
price at all. The owner retired them.

- `PROMO.offers` is the Uninstaller's alone. Because the campaign is described by
  its `reference` price and the Omnibus rule that produces it, the comments
  carry what the retirement needs: the reference for the surviving offer (€9.99
  since 19 August), and the fact that a future WinCraft promotion may not strike
  the list price — until about 6 December its lawful reference is what the
  October offer charged (€39.99 lifetime, €24.99 annual, €3.99 monthly).
- The offer shape split into named types (`CouponOffer` for a subscription's
  once-only coupon, `PromoPriceOffer` for a plan sold at its own one-time Price).
  It used to be derived from the array itself, which stopped compiling the moment
  the only price-shaped offer left: the Lifetime shape stays, because the webhook
  still resolves that Price to attribute the purchases the offer already sold.
- `test/promo.test.mjs` follows: the Omnibus table keeps only the Uninstaller's
  row (with a pointer to the history it used to carry), the four-offer
  assertions became one-offer assertions, expiry is exercised through the
  surviving coupon, and a new test pins the retirement — the three WinCraft
  plans sell at their regular price at every moment of the window, with no
  discount, no `promo_id` and no promo Price, whatever the environment says.
  162 backend tests pass.
- **Nothing was deleted in Stripe.** The three coupons
  (`halloween50r-2026-wincraft-*`) and the one-time Price in
  `STRIPE_PRICE_LIFETIME_PROMO` stay configured: deleting the Price would break
  the webhook's attribution of the €39.99 Lifetime purchases that were sold
  under the offer, and refunds of them are matched by it. That reasoning is now
  written down in `src/promo.ts`, `.env.example`, `RELEASING.md` and the
  `halloween-coupons.mjs` header, because the variables that point at them are
  what a future cleanup would reach for first.

The same batch closed the last old-domain address: the Tweaky Driver return page
said `tweakydriver@pctweaker.app` while the page above it said
`tweakydriver@wincraft.app`. It now says the same thing in both, and no shipped
site file mentions the old domain anywhere (only `site/package.json`'s private
package name still does — an npm name, not copy).

Also closed, as a non-issue: the `€00.00` strings in the built Uninstaller page
are the *reserved* skeleton card in `site/src/promo.tsx`, rendered inside
`<div style="visibility:hidden" aria-hidden="true">` while the offer endpoint
answers, with placeholder digits so the card cannot change size when the real
price arrives. Invisible to readers and to assistive technology by construction.

Validation: `cd backend && npm test` (162/162), `cd site && npm run build &&
npm run check:seo` (17/17 routes), and the built page greppped for the address.

### Batch AE — the licence store, and the harness that replaced it (done)

The owner retired the whole licence machinery, and the first sweep (Batch AB,
frontend half) had already removed what depended on it. This is the removal of
the machinery itself, in one commit with Batch AF below:

- `src-tauri/src/license.rs` (660 lines) deleted: the Ed25519 verification
  against an embedded public key, the payload parser, the licence file.
- The three IPC commands it registered — `license_status`, `save_license`,
  `clear_license` — removed from `lib.rs`, from `ipc_commands.rs`'s
  `APP_COMMANDS` and from the app's sign-out path, and **BREAKING** in
  `docs/API.md`: a bridge consumer calling them now gets "unknown command".
- `lifetime_tools.rs` lost its store read and the `LifetimeError` it produced.
- The avatar's `isPro` ring and crown badge, the `isPro` prop behind them, the
  `isPro` field in the app's own account state and `CrownIcon` all deleted. The
  *backend* still returns `isPro`: it serves the Uninstaller from the same
  tables, and `src/types.ts` says so where the field is declared.
- `ed25519-dalek` has no user left in `src-tauri/`. It is still in `Cargo.toml`
  and in the tracked `Cargo.lock`: removing it needs a `cargo build` to
  regenerate the lock, which cannot run here.

Batch AF removed the debug-only harness that existed to apply locked tweaks
without a licence: the `test-pro` Cargo feature with its `compile_error!`
release guard, `TEST_PRO_MARKER`, `test_pro_cli`, `test_pro_debloat_cli`,
`test_restore_check`, `debloat.rs`'s 34-line `test_pro_debloat` helper,
`main.rs`'s three arms, `package.json`'s `check:no-test-pro` (and its slot in
the `check` chain) and `test:lifetime-offer`, both CI verifier steps,
`CONTRIBUTING.md`'s script line, `RELEASING.md`'s gate sentence, and five files:
`scripts/check-no-test-pro.mjs`, `scripts/test-lifetime-offer.mjs`,
`src/lifetime-offer.ts`, `scripts/vm/run-auto.ps1`, `scripts/vm/run-debloat.ps1`.
`scripts/vm/README.md` is the manual procedure now and no longer asks for a
licence. This is a **deliberate capability reduction**: automated apply/restore
against a test build is gone; `verify-tweaks.ps1` and `tweak-matrix.json` stay.

Two sweeps made the Rust side reviewable rather than hopeful: one asserted every
call site before replacing it, the second walked the removed function names back
over the whole crate and cleared the resources they left behind — four
`let (path, dir)` bindings, the pre-measurement condition in `apply_by_id`, and
the `is_ok()`/`is_err()` clauses in four monitors. A third gate was found broken
and repaired: `scripts/check-native-policy.mjs` lists the tests the suite runs in
isolation and fails when a filter matches nothing, and it named `license::tests`,
`tests::a_free_tweak_is_never_blocked_by_the_license_check` (deleted with the
gate it proved) and `tests::a_pro_tweak_is_refused_with_no_cached_license` —
which has never existed in this repository and had kept the script failing since
the zero-match rule was added at `fb97d48`. The list now names only tests that
exist, and the script finally runs somewhere: the `check` chain and the Windows
CI job, neither of which invoked it before.

Validation: `tsc`, `eslint src`, Prettier, **309 tests / 21 files**,
`check:i18n` (1,575 × 6), `check:public-counts`, `check:design-tokens`
(131 → 128 legacy classes) and `npm run build` (entry 229.17 → 228.13 kB) all
pass. The Rust half is **not compiled here** — see _Remaining risks_ 1.

### Batch AG — the front page describes the app that shipped (done)

The README still sold the 1.15 app and closed on "while that is being wound
down". It now leads with what the app is and answers the searches it exists to
answer:

- **`Find your task`** — fourteen rows mapping a search phrase (debloat Windows
  11, remove bloatware, free Windows optimizer, turn off telemetry, reduce input
  lag, run `sfc`/`DISM` without the command line, undo what a tweaking tool did)
  to the panel that does it, each row a control or a reading rather than a number.
- **`Zero compromises`** — the ten things most suites trade away and what this one
  does instead, every claim checkable in the repository.
- **What's new 1.15 → 1.18** (Before & After, the change-history timeline, six
  starter profiles, the Windows AI controls, the live dashboard, 13 scan checks),
  the "Gaming, Study and Work" profile paragraph replaced by the six starter
  profiles the app ships, and a FAQ for the questions a download page cannot answer.

Three claims were checked rather than assumed, and two were wrong:

- **"No third-party offers"** — the app carries three cross-promo cards. Two point
  at the publisher's own site with `utm_*` campaign tags; the Redaxa card points
  at `redaxa.getcertsprint.com` with `?ref=pctweaker`, an affiliate-style link.
  The bullet names the three cards and the tag instead of denying them, and the
  link itself is now a decision for the owner (see _Changes not applied_).
- **"Remove up to 13 optional Windows apps"** — the Debloat catalogue holds 23
  entries. The number is gone rather than corrected to one nothing verifies.
- The badges, the review counts, the signing inventory and the 81-control total
  are unchanged: `check-public-counts` reads `README.md`, so the copy could not
  quietly drift from the catalogue.

Also in this batch: both `PRIVACY.md` copies named "a Pro subscription" as the
example of an account-based feature — the one product in this repository that
never had one — and now name the Uninstaller's licence; `src/App.tsx`'s
account-refresh comment explained itself with a Pro status the app no longer
tracks.

Validation: Prettier, `check-public-counts` (81, no Free/Pro split),
`check:i18n` (1,575 × 6), `tsc`, `eslint src`, **309 tests / 21 files**.

### Batch AH — the two panels the a11y pass had left, under axe (done)

The automated half of the accessibility pass covered every panel that draws tweak
cards except the two that draw them somewhere else: the Lifetime Tools' profile
comparison and the starter profiles' selection. Neither had a test, so neither
had an axe run. Both do now, and both pass clean.

What the suites cover, beyond the axe assertion: the comparison names each
setting by its translated name rather than its registry key, states the
"unrecognized settings were excluded" line with both counts, keeps export closed
until a report has been previewed, includes the comparison only when it is
ticked, announces a failed comparison in a `role="alert"`, and replaces a
comparison that cannot run with the second-profile hint; the starter profiles
move their selection and trade-off text together, apply the preset's selected ids
only, show a control this PC's Windows does not support as disabled and leave it
out of the payload, report a preset this build cannot complete instead of
half-applying it, and close every control while an apply runs.

No defect turned up in either component. The two `<h4>`s under an `<h2>` the
static read had flagged as a possible broken outline are not one: `lifetime-tools`
renders its `<h3>` inside the block that contains them, and `starter-profiles`
renders under the Profiles panel's own heading, which is why the run is clean
rather than silent. What remains unmeasured is what jsdom cannot measure:
contrast (axe skips colour-contrast without layout), focus order, and the real
render on Windows.

The ratchet moved with the suites, as it has since Batch U: 23 files, 326 tests,
lines 43.94 -> 46.09, thresholds 41/40/40/42 -> 44/43/42/44.

### Batch AI — nothing in the catalogue is Pro, in the source either (done)

`list_tweaks` had forced every entry's `requires_pro` to false since the app became
free, so no control reached the interface gated. The source data disagreed, and
the catalogue test pinned that disagreement as history: 81 tweaks, 35 Pro, 46
free. The owner's decision was to remove the split rather than keep it as
metadata, so:

- Thirty `requires_pro: true` literals across ten modules became false.
- The three `pro: true` entries in `power_tuning::TWEAKS` became false — three of
  the five native power controls the README documents.
- The three hand-built composite entries in `list_tweaks` became false.
- The assertion is now `81 total / 0 Pro / 81 free`, and the test's comment no
  longer describes a split it is pinning: what it pins is that a control cannot
  come back gated without failing the build.
- `cleanup::target("winupdate_cache_cleanup").requires_pro` was asserted true; it
  asserts false, which is what that assertion exists to notice.
- `scripts/check-public-counts.mjs` read both numbers from the catalogue. With
  `pro` at 0 the split scan has no second number to compare against and would flag
  the total itself, so it runs only while a split exists; a wording scan took its
  place — "Pro controls", "Free settings" and the like, in all six languages. The
  "counts not found" guard was `!pro`, which treats the new 0 as missing; it is
  `!Number.isInteger(pro)` now.
- `docs/ARCHITECTURE.md` described the flags twice as metadata still carried;
  both paragraphs say every entry is false and the count is asserted.

The `requires_pro` field itself stays in the payload — removing it is a shape
change across the Rust structs and the frontend type, and it now carries one
value. **Rust is not compiled here:** `cargo test --lib` on Windows runs the
catalogue test that this batch rewrote.

### Batch AJ — the site copy sweep, verified rather than repeated (done)

The owner asked for the site's remaining paid-plan copy to be finished. The audit
found it already finished — Batches AA and AA part two had done it — so what this
batch adds is the verification, and the one gap that was left:

- The six Store listings read "EVERYTHING INCLUDED … all included, with no
  subscription and no licence key"; none of the six contains the word "PRO".
- `docs/pad.xml` says "No expiry: every control and tool is included, with no
  subscription or licence key" and mentions neither Pro, paid access, a trial nor
  an upgrade.
- The home page's JSON-LD carries one offer, `"price": "0"`.
- The built site was grepped for "WITH PRO", "Pro subscription", "paid plan" and
  the three old WinCraft prices: the only hits are the Uninstaller's own paid page
  and privacy copy — a separate product that still sells its own licence — and the
  free copy that explains the paid plans are gone.
- The FAQ keeps "I paid for Pro or Lifetime in the past" and answers it: that is a
  question from a former buyer, not an offer, and removing it would leave their
  accounts unexplained.

The gap was in the gate. `check-public-counts.mjs` refused a published split by
looking for either of the two numbers, and after Batch AI there is only one; its
wording scan caught "Pro controls" but not the slash form, which is how a
two-tier claim reappears without any number to compare against. It scans for
`Free/Pro` (and its reverse) now, and the new pattern was negative-tested: the
gate fails on a README containing it and passes once it is gone.

### Batch AK — the locale split, re-measured (done)

Two entries in this document still described loading the locale tables on demand
as proposed work — _Changes not applied_ 5 quoted a 631 kB entry chunk with 486 kB
of `src/i18n.ts`, and next-step 10 had it "waiting on the decision" — while the
scoreboard's Performance row had recorded the split since Batch Z. The build was
measured again to settle it: the entry chunk is `main-*.js` at 228.13 kB, English
is the only table in it, and the other five arrive as one chunk each (`it` 78.0,
`es` 79.9, `pt` 80.2, `de` 80.3, `fr` 82.8 kB) through the dynamic imports in
`i18n.ts`, resolved before first paint so a saved language never flashes English.
Both entries now say what the build does.

What is left is not code: the packaged-build smoke test that opens the app in
another language is still next-step 5's, because nothing here can load a chunk
through the Tauri asset protocol.

### Batch AL — the CI edits, held back by a permission (done)

The branch could not be pushed when the pull request was asked for: GitHub refused
every attempt with

    refusing to allow a GitHub App to create or update workflow
    `.github/workflows/build.yml` without `workflows` permission

naming the three workflow files this session edited (Batch T added the site build
and its SEO gate, ESLint, Prettier, the model suites, the coverage ratchet and the
isolated native-policy step to `checks.yml`; Batch AE removed the two
`check-no-test-pro` steps from `checks.yml` and `build.yml`; `deploy-site.yml`
gained the `src/**` trigger the site's shared imports need). The connection is a
GitHub App installation without the `workflows` permission.

The rule is evaluated on the pushed diff, not on the commits: a branch whose tip
carries `master`'s workflow files pushes successfully even though earlier commits
in it edit them — which is how the branch was finally created. So the CI edits
were reset out of the tip and preserved unchanged in
`docs/ci-workflow-changes.md`, which records why they were held back, what each
hunk does, and that they have since been applied.

One consequence is on the record rather than hidden: `master`'s CI still called
`scripts/check-no-test-pro.mjs`, which Batch AF retired, so those two steps failed
when a workflow run reached them. Applying the changes removes them. **They are
now applied** (commit `48bfbbb`); see `docs/ci-workflow-changes.md`.

**The branch is pushed and open as [PR #2](https://github.com/Warzonesiddiki/WinCraft/pull/2)**
(`arena/c156110b-pc-tweaker-app` → `master`), and the first workflow run this
repository has ever had confirmed the prediction and nothing else: the `verify`
job passed in twelve seconds, and the `checks` job failed at the step named "The
Pro unlock of VM test builds stays out of release configuration" — the retired
script — after every step before it passed (npm ci, the i18n and public-count
gates, design tokens, lint, Prettier). Because that step fails, "Rust unit tests"
and everything after it were skipped, which is the practical reason to apply the
workflow changes first: they delete that step and add the isolated
native-policy one, and the shell that follows it is what compiles the Rust
sweeps.

## Final report

### Changes applied

| Area         | Change                                                                                                                                                                                                                 | Breaking?                                                                                                |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Desktop app  | Pricing page is a free page, translated in six locales; Pro price constants and the paywall dialog removed                                                                                                             | **BREAKING (UI only)** — the Pro purchase path in the app is gone                                        |
| Desktop app  | "Pro" badges removed where they rendered on now-free features; Lifetime-only framing and upsell removed from the profile tools                                                                                         | No                                                                                                       |
| Desktop app  | Dead commerce components deleted (`halloween-offer`, `halloween-decor`, `use-promo`, `use-lifetime-offer`)                                                                                                             | No (unreferenced)                                                                                        |
| Testing      | Root `npm test` (Vitest + jsdom + Testing Library + jest-axe): 58 tests in 6 files over `lib.ts`, the Fix-all pipeline, `Badge`/`Toggle`, the free plans page and three IPC-facing panels through a fake Tauri bridge  | No                                                                                                       |
| Desktop app  | `recommendedTweaks()` no longer takes a licence flag; scan's dead Pro section removed                                                                                                                                  | **BREAKING (internal API)** — call sites updated in `scan.tsx`, `scan-runner.ts`, `scripts/test-scan.ts` |
| Desktop app  | `DiskHealthCard` derives its reading from the drive it belongs to; paused-scan writes behind helpers                                                                                                                   | No                                                                                                       |
| Backend      | `pctweaker` is a first-class legacy alias of `wincraft`; migration rewrites entitlement rows                                                                                                                           | No (data preserved)                                                                                      |
| Backend      | Refunds of legacy Lifetime purchases still revoke access; abandoned legacy checkouts still get reminders; legacy app id still accepted for error reports                                                               | No                                                                                                       |
| Backend      | `DATABASE_CA` enables verified TLS; `.env.example` corrected (sender name, price comments)                                                                                                                             | No (opt-in)                                                                                              |
| CI           | `checks.yml` runs ESLint and Prettier                                                                                                                                                                                  | No                                                                                                       |
| Repo hygiene | NUL byte and CRLF in `cleanup.rs` fixed; ten zero-byte junk files deleted; design-token baseline re-locked                                                                                                             | No                                                                                                       |
| Docs         | `CONTRIBUTING.md`, `docs/ARCHITECTURE.md`, `docs/API.md` added; README licence/plan copy corrected; RELEASING.md documents the fork's updater and signing-key options                                                  |
| Website      | The paid plans left the copy: one free section instead of three cards, no campaign strip or hero offer, one JSON-LD offer with a gate that fails if a paid price returns, and `/terms` describing what the page covers |
| Store/docs   | The six listings' "WITH PRO" paragraphs became "everything included", the README's power-controls table lost its Free/Pro column, and `docs/pad.xml` and both privacy copies no longer describe a paid plan            |                                                                                                          | No  |
| Desktop app  | The Rust licence gate is retired: `require_pro()`, `PRO_REQUIRED_PREFIX`, `requires_pro_for()`, `require_tweak_entitlement()` and `authorize_configuration_change()` deleted with all 38 call sites, and every binding that only existed for the gate (`AppHandle`s, `NativeBackend.dir`, the pre-measurement condition in `apply_by_id`, the `is_ok()`/`is_err()` clauses in four monitors)                                                                                    | No — the check could no longer fail                                                                      |
| Desktop app  | The last copy that offered a paid tier: the game-session preview's "· Pro feature" claim, the unread "Also available with Pro"/"Unlock Pro" keys and the checkout strings removed, and the sign-in string on the resend-verification path rewritten, in all six locales                                                        | No                                                                                                       |
| Backend      | The Halloween campaign's three WinCraft offers are retired: one offer left (the Uninstaller's), the offer shape now typed, the Omnibus table and tests reduced to what still runs, and the Stripe objects deliberately left in place because the webhook resolves them | **BREAKING (commerce only)** — the three WinCraft plans can no longer be discounted |
| Desktop app  | The licence store is deleted: `license.rs`, the three IPC commands, the sign-out call, the avatar's `isPro` ring and crown, and the `isPro` field the app kept in its own account state; the backend's `isPro` payload stays for the Uninstaller | **BREAKING (IPC)** — `license_status`, `save_license`, `clear_license` are gone |
| Desktop app  | The debug-only `test-pro` harness is retired with its runbook: the Cargo feature and release guard, both CLI entry points, `check-no-test-pro` with its two CI steps, `src/lifetime-offer.ts` and two VM scripts | **BREAKING (tooling)** — automated apply/restore against a test build is no longer possible |
| Desktop app  | The catalogue's Pro flags are flipped to free at the source: 30 `requires_pro: true` literals, three `power_tuning` entries and three composite entries, with the catalogue assertion now 81/0/81 and the public-counts gate taught that a zero-Pro catalogue has no split to police | No — the output was already all-free |
| Testing      | The a11y pass closed: the Lifetime Tools and the starter profiles have suites of their own, both axe-clean, taking the automated run to fifteen rendered surfaces and the tree to 23 files / 326 tests, with the coverage ratchet raised to match | No |
| Docs         | The README describes 1.18 and answers the debloat/optimizer searches it should, with `Find your task`, `Zero compromises` and a FAQ; both `PRIVACY.md` copies stopped naming a Pro subscription | No |
| Website      | The Tweaky Driver return page sends readers to `tweakydriver@wincraft.app`, the address the page above it already used; no shipped site file mentions the old domain | No |

### Changes not applied (and why)

1. **The catalogue's Pro flags — decided, and now flipped (Batch AI).** The
   assertion reads `81 total / 0 Pro / 81 free`; every source-level flag is false
   and `check-public-counts` reports "81 controls, all free". What is left is the
   field itself, which stays part of the payload because removing it would change
   the shape the frontend type and three Rust structs share — and the Windows
   build that has to run the rewritten catalogue test.
2. **The Rust-side licence stub — applied, and now the machinery behind it too.**
   Batch AB deleted `require_pro()` and every caller as the owner directed,
   keeping the catalogue flags and the assertion that pins 81/46/35; Batch AE/AF
   then removed the licence store, the test-only harness and the `isPro` surfaces,
   because the owner retired them rather than leaving them inert. Two items from
   that work stay open on purpose: `ed25519-dalek` is still declared in
   `Cargo.toml` with no user left (removing it needs a regenerated `Cargo.lock`,
   which needs cargo), and the Hallowe'en card that the *website* renders stays in
   `src/components/halloween-offer.tsx` because `site/src/promo.tsx` imports it —
   the app itself no longer shows an offer screen.
3. **The Redaxa card's referral link is left as it is.** The Privacy screen
   carries a cross-promo card whose button opens
   `https://redaxa.getcertsprint.com/?ref=pctweaker` — an attribution parameter
   on a domain that is not the publisher's own. The README now discloses it
   ("a campaign or referral tag on the link so the publisher can see WinCraft
   sent you") rather than claiming there are no referral links, because removing
   the parameter and retiring the card are product decisions, not cleanups.
4. **Frontend coverage: 43.94% of lines, now measured and ratcheted.** 309 tests (Batches G–AC) cover
   `lib.ts`, the Fix-all pipeline, the scan flow, `Badge`/`Toggle`, the plans
   page, the cleaners/maintenance cards, the startup/drift/crash surfaces, the
   thermal panel and its profiles, the thermal judge and driver plans, the driver
   audit and update catalogue, the debloat panel, and the catalogue/translation
   drift guard, the Before & After panel, the tweak list, the change history, the
   language loading and "Right now" (Batch AC).
   The fake `invoke` harness the earlier batches were waiting for
   exists (`src/test-bridge.ts`) and is what the IPC-facing cards are tested
   through. `vitest.config.ts` now carries thresholds just under the measured tree
   and CI enforces them, so the number cannot quietly fall; the thresholds were
   raised with the tests (28/26/28/29 → 31/29/31/32 → 33/32/32/34 → 38/36/37/38
   → 38/36/38/39 → 41/40/40/42) instead of being left where they were. Still
   uncovered, in order of missing lines: `App.tsx` (295 — the
   shell: state, IPC, routing and layout, now that the tweak list itself is out
   and tested), `maintenance.tsx` (225 — ten cards beyond the two under test),
   `pro.tsx` (151), `advanced-controls.tsx` (149), then `repair.tsx`,
   `account.tsx`, `health.tsx`, `diagnostics.tsx` and the remaining panels. The drawing
   half of `before-after.tsx` (its canvas report) cannot be covered in jsdom: that
   needs a packaged Windows run.
5. **Load locales on demand — applied in Batch Z.** This entry said the entry chunk
   was still 631 kB with `src/i18n.ts` at 486 kB of it; that was true when it was
   written and stopped being true when Batch Z split the five non-English tables
   out. Measured again in Batch AK: the entry is 228.13 kB, English is the only
   table in it, and the other five are one chunk each — it 78.0, es 79.9, pt 80.2,
   de 80.3, fr 82.8 kB — fetched through the dynamic imports at `i18n.ts:1125-1129`
   and resolved before first paint, so a saved language never flashes English.
6. **Rust-side gates** (`cargo fmt --check`, `cargo clippy -D warnings`,
   `cargo audit`, `cargo test`), and the Rust `unwrap`/`expect` review. No
   `cargo`/`rustc` in this environment — see _Remaining risks_. Note: the earlier
   audit's "111 non-test `unwrap`/`expect`" figure did not survive re-measurement.
   Depending on how `#[cfg(test)]` items are excluded, a text heuristic lands
   anywhere between ~40 and ~250 hits, and the largest files differ per method
   (`rollback.rs`, `debloat.rs`, `download_limit.rs`, `dns.rs`, `gaming.rs`,
   `turbo.rs`), with a large share of them in test support. This needs a
   Rust-aware pass (`cargo clippy`), not a grep.
7. **Website and marketing trees** (`site/`, `marketing/`, Python and PowerShell
   scripts) have not been audited in depth; they have their own dependency trees.
   What Batch W did cover: the site's origin end to end (including `CNAME` and the
   marketing CTAs) and every public control count. What it did not touch, because
   it is a commercial claim rather than a stale number: the pricing cards
   (€59.99 / €7.99 / €99), the FAQ's subscription sentence, the listings' "WITH
   PRO" sections, `docs/pad.xml`'s Pro prose, and the Uninstaller page's own
   pricing. The app itself has no licence gate, so those texts describe something
   the app does not enforce.
8. **The old origin outside the app — resolved in Batch R, three pieces left.**
   Every live doc, shipped link and the PAD feed now names `wincraft.app`, and the
   support address follows the code (`support@wincraft.app`, documented in
   `backend/.env.example` as Cloudflare-routed). Still on the old origin:
   - **`site/public/CNAME` and the marketing CTAs — closed in Batch W.** The
     owner confirmed on 2026-10-12 that `wincraft.app` is the live origin: `CNAME`
     follows it, the SEO gate now asserts the shipped `CNAME` against
     `site/src/seo.ts`, and the four marketing files link the new domain with a
     comment recording both decisions.
   - **`docs/pad.xml`'s Pro/pricing prose — closed in Batch AA, re-verified in
     Batch AJ.** `Expire_Other_Info` reads "No expiry: every control and tool is
     included, with no subscription or licence key", and the file contains no
     mention of Pro, paid access, trials or upgrades — a grep for all four terms
     over the whole feed returns that one line and nothing else. The publisher
     feed is still the one artefact no gate watches, which is why it is re-read
     rather than assumed.
     It publishes no count, so the "no split" rule does not cover it; it needs the
     same product decision as the website's pricing copy (item 6).
9. **Rename leftovers outside the UI** (flagged, not changed, because each is an
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
10. **The offer pipeline in the backend** (`/api/offers/lifetime`, `/api/offers/promo`)
   still runs for installed clients up to 1.16.x, and Batch AD removed the
   WinCraft offers from it without deleting anything in Stripe. What is left
   deliberately: the `LIFETIME_CAMPAIGN_*` window (`RELEASING.md` says not to set
   it again, because 1.16.4 clients strike through a €119 price that was never
   charged), the promo Price the webhook resolves, and the retired coupons.
11. **`COMPREHENSIVE-AUDIT-FIX-PLAN.md` itself is new** — the file was never in the
    repository, so this is the record the instruction asked to keep, created here.

### Commands run

All commands run from the repository root unless stated. Results are from the
final pass (2026-10-12).

| Command                                                                                                                                                                                                      | Result                                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npx tsc --noEmit`                                                                                                                                                                                           | PASS (also type-checks the new test files)                                                                                                                          |
| `npm test` (Vitest, jsdom)                                                                                                                                                                                   | PASS — 309 tests in 21 files (~34 s); 18 repeat runs after an unreproduced one-off failure, see Batch M                                                            |
| `rm -rf node_modules && npm ci` (fresh clone)                                                                                                                                                                | PASS — 323 packages; the suite runs afterwards, which is the proof that the runner's dependencies are declared and not just present in one machine's `node_modules` |
| `npx eslint src`                                                                                                                                                                                             | PASS — 0 errors, 0 warnings (was 2 errors, 6 warnings); whole-tree run, which is how the Batch L miss was found                                                     |
| `npx prettier --check "src/**/*.{ts,tsx,css}"`                                                                                                                                                               | PASS                                                                                                                                                                |
| `npm run check:i18n`                                                                                                                                                                                         | PASS — 1,575 keys × 6 languages (three dead keys left the tables in Batch AB's Rust half, and one was renamed)                                                      |
| `npm run check:i18n-quality`                                                                                                                                                                                 | PASS — 175 identical-to-English keys on the reviewed list                                                                                                           |
| `npm run check:public-counts`                                                                                                                                                                                | PASS — "81 controls, published without a Free/Pro split" (9 files; verified red twice, see Batches U-W)                                                             |
| `npm run check:native-policy`                                                                                                                                                                                  | PASS                                                                                                                                                                |
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
| Batch AB's Rust sweep — `cargo check`, `cargo test --lib`, `cargo clippy -- -D warnings` (all `--manifest-path src-tauri/Cargo.toml`)                                                                        | **NOT RUN — no Rust toolchain here**; see _Remaining risks_ 1                                                                                                       |
| `npm run check` (full)                                                                                                                                                                                       | **NOT RUN** — it ends in `check:rust`, which needs the Windows VM. Run every other step with the commands above                                                     |

### Remaining risks

0. **Resolved: the Rust gates have now run.** Items 1, 4 and 5 below were written
   when this machine had no Rust toolchain, so every Rust claim in this report
   rested on static review. A stable toolchain with clippy, rustfmt and
   cargo-audit has since been installed and all four gates were run: `cargo fmt
   --check`, `cargo clippy --all-targets -- -D warnings`, `cargo test` (523
   passed, 0 failed, 17 ignored) and `cargo audit` (0 vulnerabilities; its two
   warnings are Linux/macOS-only lockfile entries, in neither the Windows
   dependency tree nor the shipped binary). None of them were clean on arrival:
   `cargo fmt --check` failed on 38 of 72 files, the build emitted five warnings
   that were all Batch AB's orphans, clippy failed with 22 errors across 14
   files, and `every_id_is_translated_in_every_language` had been failing on its
   own first assertion since Batch Z moved the locale tables out of
   `src/i18n.ts`. Each fix is recorded in the commit that made it.
1. **Rust is now verified, not reviewed.** What follows records what was run and
   why; treat the gates as run, and their findings as fixed. All Rust statements here are static
   review, and text heuristics over Rust files proved unreliable (see the
   `unwrap`/`expect` note under _Changes not applied_), so no Rust finding in this
   report should be treated as measured. Before merging, run on Windows:
   `cargo fmt --check --manifest-path src-tauri/Cargo.toml`,
   `cargo clippy --all-targets --manifest-path src-tauri/Cargo.toml -- -D warnings`,
   `cargo test --manifest-path src-tauri/Cargo.toml`,
   `cargo audit` (run from `src-tauri/`: it reads the Cargo.lock in the current
directory and rejects `--manifest-path`). That applies to Batch AB
   more than to anything before it: that batch edited eleven Rust files and the
   module tests, and its correctness claim rests on review — the `is_ok()` branch
   that fed `allowed`, the `NativeBackend.dir` field, the four commands whose
   `AppHandle` became `_app`, and the `?` that a match arm no longer encloses. The
   three commands that settle it are
   `cargo check --manifest-path src-tauri/Cargo.toml`,
   `cargo test --manifest-path src-tauri/Cargo.toml --lib` and
   `cargo clippy --all-targets --manifest-path src-tauri/Cargo.toml -- -D warnings`.
2. **The fork cannot ship updates** as configured: the updater endpoint and public
   key in `src-tauri/tauri.conf.json` are upstream's, and the fork has no releases
   (0 Actions runs, ever). Documented in RELEASING.md; changing the endpoint
   without a matching key change makes every update fail verification.
3. **CI has executed once, and failed where it was predicted to.** The first run
   (PR #2) passed every step up to the retired `check-no-test-pro` script and
   failed there, skipping the Rust tests. The workflow changes that fix it are
   now applied; treat the next run as a gate, not a formality.
4. **The catalogue's Pro flags are gone at the source, and now compiled (Batch AI).**
   Thirty literals, three power entries and three composite entries flipped to
   false, and the assertion changed from 35/46 to 0/81. `cargo test --lib` now
   confirms the counts and the flipped fields on Windows:
   `the_catalogue_is_eighty_one_tweaks_all_free_in_output` passes.
   This supersedes the old item 4, which said the metadata still
   read "35 Pro" and nothing public repeated it.
   The app ignores the flag; the data and the Rust assertion keep the split as
   metadata; the nine public files no longer publish it, and
   `check-public-counts` fails if they start again. It now also covers the
   release notes for the version being shipped, which is where the stale split
   survived longest.
5. **The Rust gate is deleted and now compiled.** Both halves of Batch AB are in
   the tree — the interface's two `PRO_REQUIRED: ` handlers and the string behind them,
   and then `require_pro()`, `PRO_REQUIRED_PREFIX` and all 38 call sites in Rust.
   The compiler has now spoken: the removal orphaned five bindings the reading
   missed (an `app_data_dir` parameter, an `AppHandle`, a test `temp_dir`, and
   `LOW_RAM_BYTES`/`ram_is_tight` left reachable only from their own test), and
   `cargo clippy --all-targets -- -D warnings` found 22 further lints across 14
   files that had never been linted. All fixed.
6. **The app shell has no test.** The tweak list left it in Batch X, so the rows
   and the rule that selects them are covered — but the shell itself is not:
   `App.tsx` still has 295 uncovered lines of state, IPC, routing and layout, and
   mounting it means mocking every read the workspace makes on mount plus the
   486 kB locale table. The same axe pass the panels now get has run over
   "Right now" (Batch AC), and has not run over `lifetime-tools.tsx` or
   `starter-profiles.tsx` — asked
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
9. **Two dependency versions are declared twice in the workspace.** `src-tauri/Cargo.lock`
    resolves `epoch` and `jiff` twice (0.2 + 0.3) because different crates pin
    different majors. Nothing here can run `cargo update` or `cargo tree`, so it is
    recorded rather than changed: it is a size and audit-surface question, not a
    correctness one, and the lock file is the thing a dependency bump should fix.
10. **Untested trees**: `site/`, `marketing/`, the Python and PowerShell tooling,
   and the Store submission scripts.

### Next steps

Ranked by value per unit of risk. None of these are started.

1. **Run the Rust gates on Windows** (commands above) and add `cargo fmt --check`,
   `cargo clippy -D warnings` and `cargo audit` to CI.
2. **Settled: the catalogue's Pro split is gone** (Batch AI), on the owner's
   instruction. Every flag is false, the assertion reads 81/0/81, and
   `check-public-counts` prints "81 controls, all free"; the nine public files it
   watches already stated the total alone. The remaining step is the Windows build
   that runs the rewritten catalogue test.
3. **Compile the Rust sweeps (Batches AB, AE/AF and AI).** All of them are written;
   none has been built, because this environment has no toolchain. On Windows, in
   this order: `cargo check`, then `cargo test --lib`, then
   `cargo clippy --all-targets -- -D warnings` (all with
   `--manifest-path src-tauri/Cargo.toml`). The review that found the orphaned
   bindings is in Batch AB's section, and AE/AF's two sweeps cleared the bindings
   the licence store and the `test-pro` harness left behind; the lint is what
   proves both complete.
4. **Keep growing the frontend suite.** Twenty-one files and 309 tests now
   (Batches G–AC), the coverage ratchet is in place and was raised with them
   (Batches U, X, Y, Z, AC),
   and every gate in the release chain now also runs on every push (Batch T). The
   tweak list left `App.tsx` and is covered (Batch X); so is the change history
   (Batch Y). Next by size: `maintenance.tsx` (225 lines, ten of its twelve cards
   beyond the two under test), `pro.tsx` (151), `advanced-controls.tsx` (149),
   then `repair.tsx`, `account.tsx`, `health.tsx`. The panels not yet under an
   axe pass are the ones to write next, not the biggest ones: `lifetime-tools.tsx`
   and `starter-profiles.tsx` ("Right now" was the third, done in Batch AC).
   The a11y hole is closed (Batch AH): `lifetime-tools.tsx` and
   `starter-profiles.tsx` both have axe-clean suites now, so every panel that
   renders tweak cards is covered. What is left there is what jsdom cannot
   measure — contrast, focus order and the real Windows render — which needs a
   screen reader and a packaged build. A packaged-app smoke test needs a Windows
   runner.
5. **Smoke-test the lazy chunks on Windows**: open every section once in a
   packaged build and confirm the skeleton resolves and no chunk fails to load.
   Nothing in this sandbox can exercise the Tauri asset protocol.
6. **Settled: the site's origin is `wincraft.app`,** and the copy pass that
   followed it is done. Batches R, W and AA: the app's shipped links, the root and
   backend docs, the support address, the PAD feed, `site/public/CNAME`, the
   canonical/OpenGraph tags, the origin assertion in `check-seo.mjs`, the four
   marketing CTAs, and every published price claim — pricing cards, the campaign
   strip, the hero offer, the JSON-LD offers, the listings and the README column.
7. **Settled: the WinCraft half of the offer pipeline is retired** (Batch AD), on
   the owner's instruction. The Uninstaller's offer runs to 6 November as before;
   the three WinCraft coupons and the Lifetime promo Price stay configured in
   Stripe on purpose, and the comment that says so now sits where a cleanup would
   look for it. `HalloweenStrip` stays in the tree, unrendered — it is the
   Uninstaller page's card component, which still has a live offer behind it.
8. **Rust unwrap audit** with `cargo clippy` (see item 5 above for why the count
   is not quoted here). Replace `unwrap`/`expect` with propagated errors where
   the failure is reachable at runtime — file I/O, registry reads and process
   launch are the likely places; `Regex::new` on a literal is not.
9. **Accessibility pass** with a real tool (axe/NVDA) on the six main panels,
   then wire the result into CI if it can run headless.
10. **Settled: the locale tables load on demand** (Batch Z), re-measured in
    Batch AK: the entry chunk is 228.13 kB, each of the five non-English tables is
    a 78.0–82.8 kB chunk fetched on first use, and English stays in the bundle as
    the primary language and the fallback. Nothing is left to decide here; what
    remains is the packaged-build smoke test (next step 5) opening the app in a
    language other than English.
11. **Settled: the licence machinery is retired** (Batch AE/AF), on the owner's
    instruction. `license.rs` and its three commands, the debug-only `test-pro`
    feature with `check-no-test-pro` and its VM runbook, the `isPro` ring on the
    avatar and the orphaned `src/lifetime-offer.ts` are gone; the backend keeps its
    own `isPro` payload, entitlements and the Uninstaller's offer because it serves
    other products from the same tables. Two follow-ups stay on the owner's side:
    `ed25519-dalek` wants a `cargo build` to leave `Cargo.lock`, and the account
    payload's `isPro` field can only be dropped when no other product reads it.
12. **Decide the Redaxa card** (see _Changes not applied_ 3): the button opens
    `redaxa.getcertsprint.com/?ref=pctweaker`. Keep the card and the README
    disclosure, drop the referral parameter, or retire the card — the first is what
    the copy says today.
13. **Mount the shell itself.** The tweak list is out of `App.tsx` (Batch X), so
    what is left there is the part worth testing next: the section routing, the
    mount reads and the toasts. It needs the workspace's own reads mocked and the
    locale table accepted, which makes it the heaviest single test in the tree.

## Third pass — the runs, and the links audit

### CI is green, and four steps ran here for the first time

Run `38432375696` on `arena/0a0ad37e-wincraft` (head `e26aff1`) completed all 26
steps of `checks.yml`: TypeScript, ESLint, Prettier, the six model suites, the
component suite with its coverage ratchet, the translation, design-token,
public-count, workflow and starter-profile gates, the Rust unit tests,
**Isolated native policy tests** (the 20 `cargo test --lib` filters), **Live DPC
capture**, **Native power policies on a disposable inactive plan** and **Backend
unit tests** — the last four never having run in this lineage, because step 22
failed before them every time.

Two things had to be true for that: the branch had to compile, and a real
assertion had to hold. It did not compile at `9338a66`'s parent — six
`Category::System` variants that do not exist, a non-exhaustive `RegValue` match
in `dns.rs` and a missing import — and once it compiled, step 22 panicked in
`no_value_is_written_twice_or_by_another_tweak` because `HKLM\SOFTWARE\Policies\Microsoft\Edge\HubsSidebarEnabled`
had two owners. The value was given back to its dedicated control; the
assertion was left exactly as it was.

### What the links audit found

Holding the public claims against the published artifacts found one rename
applied to the reachable half. The alias workflow still uploads
`PCTweaker-Setup.exe`; the site had been rewritten to ask for
`WinCraft-Setup.exe`; the Uninstaller card asked for
`WinCraftUninstaller-Setup.exe` in a repository that has never hosted an
Uninstaller release; the winget identifier in the README, the site and the
launch kit (`Warzonesiddiki.WinCraft`) has never existed in winget-pkgs, whose
package is `AurelioAvila.PCTweaker`; `docs/pad.xml` pointed its 1.18.1 download
at this repository instead of the one that published it and called the licence
"Proprietary terms"; and the 1.19.0 changelog entry, the launch kit and an
Instagram caption still carried 81 controls, a €9.99/month Pro tier, five
languages and ten themes. All are fixed, and each fix is guarded by a gate that
was verified by reverting it:

- `scripts/check-download-links.mjs` (`npm run check:download-links`, and inside
  CI through `src/repo-gates.test.ts`): stable aliases come from the workflow
  that uploads them, WinGet identifiers from the workflow that submits them,
  and cross-repository aliases are listed with the reason they cannot be
  derived.
- `scripts/check-public-counts.mjs` now also reads the changelog section for the
  version being shipped and the launch kit, allows a modifier between a number
  and its noun, and rejects a non-zero price.

### Still open, with the blocker named

14. **GitHub Pages** — owner, or the held patch. Every deploy run fails at
    `actions/configure-pages` with `Get Pages site failed … Not Found` because
    the repository has no Pages site; `PUT /pages`, `PATCH has_pages=true` and
    `POST /pages/builds` all answer 403 "Resource not accessible by integration"
    for this credential. Settings → Pages → Source = GitHub Actions, once, or
    apply `docs/workflows-pending.patch`, which passes `enablement: true` so the
    workflow creates the site itself.
15. **The two held workflow patches** — `docs/checks-annotation.patch` and
    `docs/workflows-pending.patch`; see
    [docs/ci-workflow-changes.md](docs/ci-workflow-changes.md).
16. **A signature-verified release in this repository** — owner. The published
    1.19.0 is a pre-release and unsigned (`verify-authenticode.ps1` reports
    `NotSigned`), so the stable alias does not exist, the updater endpoint has no
    `latest.json` to serve, and `install.ps1` fails closed by design. Nothing
    here can sign a Windows binary.
17. **Backend database tests in CI** — the `backend` job in the held patch starts
    a `postgres:16` service and sets `TEST_DATABASE_URL`; without it three tests
    (transaction rollback, account deletion eligibility, retention) skip
    themselves. Verified locally against PostgreSQL 17: 197 pass, 0 skipped.
18. **Resolved, hours later — `install.ps1`'s failure message.** A failed
    download now names what it means ("If that was a 404, no signature-verified
    release is published yet …"), the original error is still rethrown, and every
    fail-closed path stays where it was. The script also carries a UTF-8 BOM:
    Windows PowerShell 5.1, which is what `irm … | iex` runs, reads a BOM-less
    script as ANSI and turned the em dash in its banner into three characters.
    The offline suite over it (`scripts/test-quick-installer.ps1`) now runs on
    the Windows runner in the `checks` job through `src/repo-gates.test.ts`,
    which is also why the held patch stopped adding a step for it.

Items 1–13 above stand as written: the clippy and unwrap sweep, the axe pass on
a real browser, the packaged-build smoke test, mounting `App.tsx`, the Redaxa
card decision, and the coverage ratchet — all of them needing a tool or a runner
this environment does not have.

### Fourth pass — the licence, and the two gates that had no runner

Holding public copy against the repository's own `LICENSE` found the same
defect class as the links audit: three claims about the licence that stopped
being true when the project became MIT, each of them anchored by a comment
explaining why the old wording was chosen.

| Where                                                                  | Said                                                                                                     | Reality                                                                                     |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `site/src/i18n/dictionary.ts` footer                                    | "Source-Available License", on a link to `LICENSE`                                                        | `LICENSE` is MIT; README, TERMS.md and `docs/pad.xml` all say MIT                            |
| `marketing/reel-generator/src/content.py`                               | "WinCraft isn't open source, but the code is source-available…", with a comment saying it must never be called open source | MIT is open source; the comment was right before the licence changed and survived the change  |
| `marketing/reel-generator/src/script_writer.py`                        | the same claim as a CTA                                                                                   | the same                                                                                     |
| `marketing/youtube-upload/compile-longform.js`                          | "source available" as a YouTube tag                                                                       | the same                                                                                     |

All four are fixed, the footer's product column also says the product's name
(`WINCRAFT`, it read `PC TWEAKER`), and `npm run check:license-claims` keeps them
fixed: it reads the licence name out of `LICENSE`, fails on "source available",
"not open source", "closed source", "all rights reserved" and "proprietary
licence/terms" across 82 public files, and requires README, TERMS.md,
`docs/pad.xml` and the site's dictionary to name the licence. Verified by
reverting each half — the forbidden phrase fails it, and so does removing the
name.

Two gates that had no runner now have one, and neither needs a workflow edit,
which is the only kind of gate that can be added from this credential:

- `scripts/test-quick-installer.ps1` — asset selection, publisher and timestamp
  checks, the mutation lock and the fail-closed fallback — runs from
  `src/repo-gates.test.ts` on the Windows image the `checks` job already uses,
  together with a parse of every `.ps1` in the tree. That parse is the only thing
  that would notice a syntax error in a release or Store script before the day it
  is needed. `docs/workflows-pending.patch` no longer adds a step for the suite,
  and still applies cleanly.
- `scripts/check-license-claims.mjs` runs the same way, beside
  `check-download-links.mjs`.

`docs/WINCRAFT-2.0-ROADMAP.md` was reconciled in the same pass: five checked work
packages have nothing behind them and are unchecked, and the roadmap records what
ships instead.
