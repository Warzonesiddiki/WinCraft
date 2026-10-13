# Audit remediation status — 2026-10-13

This records the implementation following [the baseline audit](AUDIT-2026-10-13.md). Changes are on `arena/9dddfe95-wincraft`; no production deployment, release, commit or push was performed.

## Findings addressed

| Finding                            | Implemented change                                                                                                                                                                                                                    | Verification / remaining boundary                                                                                                                                                                                                                                                      |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F01: database TLS                  | Verified certificates and explicit hostname/IP identity checking; broken CA fails startup; connection-string overrides rejected; plaintext restricted to explicit local development                                                   | Unit tests plus a real TLS-enabled PostgreSQL fixture accepted the correct CA/hostname and rejected an unrelated CA and wrong hostname                                                                                                                                                 |
| F02: readiness                     | Successful schema initialization is required for API access, readiness and billing-worker startup                                                                                                                                     | Child-process tests cover both migration failure with successful `SELECT 1` and successful initialization                                                                                                                                                                              |
| F03: quick installer               | Exact x64 asset selection, unique staging, valid Authenticode/expected publisher/timestamp, read-only mutation lock through launch, fail-closed verification outside the discovery fallback                                           | Offline PowerShell regressions added to Windows CI. **Not executed here:** PowerShell/Windows unavailable. Real signed installers and certificate rotation still require Windows release validation                                                                                    |
| F04: session race                  | Extracted session-aware refresh controller; generation/token checks before 401, renewal and account updates; timeout, cancellation, deduplication and focus freshness                                                                 | Deferred-request unit tests and real App state/dispatch tests cover old responses after logout/login, delayed JSON and late renewal                                                                                                                                                    |
| F05: consumed links                | Token consumption and account mutation use one checked-out PostgreSQL transaction; hashing occurs before the short transaction; failed rollback discards the connection                                                               | Route-level fault injection plus real PostgreSQL rollback and concurrent single-use consumption pass                                                                                                                                                                                   |
| F06: proxy/abuse limits            | Proxy trust defaults off; only explicit IP/CIDR lists accepted; moderation no longer trusts the leftmost raw header; global auth-work budgets and concurrency cap added                                                               | Unit/route tests cover policy, source spoofing, capacity and budgets. **Production ingress rewriting is not verified here.** Configure verified networks and restrict direct ingress before deployment. Still single-replica; distributed limit storage remains a scaling prerequisite |
| F07: unsafe preset/recovery claims | Forced app termination is no longer selected by default; unsaved-work warnings in all six locales/native fallback; README/installer claims narrowed; Barebone/browser copy describes tradeoffs instead of zero latency/OS equivalence | Preset, locale and public-copy checks pass. Existing per-operation recovery UI remains; a unified recovery-class metadata system is a follow-up, not claimed as complete                                                                                                               |
| F08: uncovered orchestration       | Added App dispatch/auth, AuthSection, refresh-controller and polling lifecycle tests; raised global coverage floors and added critical-file floors                                                                                    | App line coverage is now 56.12% (previously 0%); account component 23.66% (previously 0%); refresh controller 94.87%. This does not replace Windows/WebView end-to-end tests                                                                                                           |
| F09: formatting                    | Formatted the failing locale files and modified frontend files                                                                                                                                                                        | Full frontend formatting gate passes                                                                                                                                                                                                                                                   |
| F10: callback CSP                  | OAuth code rendered as escaped server text, without inline script; no-store/no-referrer/noindex                                                                                                                                       | Response tests check escaped content and no script. Endpoint retained for tooling compatibility                                                                                                                                                                                        |
| F11: driver cache                  | Complete shape validation, schema version, environment signature, seven-day maximum age, future-date/size limits and guarded storage reads/removal                                                                                    | Malformed/stale/version/environment/blocked-storage tests pass. Hardware replacement within an otherwise identical environment is not detected automatically; timestamp and explicit Rescan remain available                                                                           |
| F12: welcome count                 | Removed independently maintained count from welcome messages; public-count gate includes backend template and rejects reintroducing the stale constant                                                                                | Email and public-count tests pass; current catalog is 141 controls, all free                                                                                                                                                                                                           |

## Second pass: schema, readiness and evidence gates

| Change                                                   | Why it matters                                                                                                                                                                                                              | Verification                                                                                                                                                                                                           |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Versioned migration runner (`backend/src/migrations.ts`) | The schema was applied as one list of `CREATE TABLE IF NOT EXISTS` on every boot: no order, no record of what ran, no way to tell an old database from a new one, and no protection against two instances migrating at once | Real PostgreSQL: concurrent initialization, a failing later migration leaving nothing behind, applied history not replayed, tampered/missing/newer history refused. Runs inside one transaction under an advisory lock |
| Migration ledger and checksums                           | A deploy can now answer "what is this database running, and has anyone edited history?" — and refuses a schema written by a newer application                                                                               | Ledger rows are checked against the checked-in definitions on every boot; a modified name, checksum, gap or unknown version fails closed                                                                               |
| Bounded readiness probe                                  | `/ready` awaited a query with no timeout, so a half-open connection held the deploy gate until the platform gave up                                                                                                         | Timed test: a hung query answers `503` in about four seconds, `/health` stays independent and cheap, and the process stays up                                                                                          |
| `docs/DATA-INVENTORY.md` + gate                          | Nothing recorded which personal data lives where or what removes it. Adding a table now requires classifying it                                                                                                             | `npm run check:data-inventory` cross-checks the inventory against the shipped SQL: 10 tables, each with a retention class and a stated deletion path                                                                   |
| Renderer privilege envelope gate                         | The webview's privileges (no shell plugin, no shell permission, no global Tauri API, no path-opening permission, no capability naming a permission with no file behind it) were spread across files nobody re-read          | `npm run check:no-new-privileges` checks all four mechanically; it resolves all 150 named permissions against the autogenerated files                                                                                  |
| Easing reported as easing (`windowDelta`)                | The note about a busy processor repeated a 30-second average as an alarm even while load was visibly falling a minute later                                                                                                 | Model tests (12 in the live-metrics suite) plus a rendered test at 92% for 75 s then 60% for 15 s: the note quotes the latest reading and the verdict is not shown as unchanged                                        |

### Account deletion, end to end

The data inventory found that closing an account was a manual SQL operation. It is now a feature:

| Piece                         | Behaviour                                                                                                                                                                                                                                                                                                                                                   |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DELETE /api/account`         | Requires the session **and** the current password **and** the word `DELETE` in `confirm`. The bcrypt comparison runs before the transaction opens, so no row is locked while hashing                                                                                                                                                                        |
| One transaction               | `backend/src/account-deletion.ts` removes action tokens, receipts, entitlements, the lifetime bonus, checkout reminders and the user row, discards never-confirmed review submissions, replaces the address on a published review with `deleted+<id>@wincraft.invalid` and clears any stored IP and its hash, and marks the newsletter address unsubscribed |
| Refusal while money is moving | A subscription that is still entitled returns `409` with a machine-readable code. Deleting our row cannot cancel a Stripe subscription, so allowing it would leave a closed account being billed                                                                                                                                                            |
| Notice email                  | Sent only after the commit, and its failure cannot turn a completed deletion into an error the caller retries                                                                                                                                                                                                                                               |
| App                           | A folded-away danger zone in the account menu: password + typed `DELETE`, submit disabled until both are valid, refusals shown in the reader's language (10 new keys in all six locales), and the session is dropped only on success                                                                                                                        |

Verification: 10 backend tests (`backend/test/account-deletion.test.mjs`) including six real-PostgreSQL cases run against the shipped migration SQL, an email-content test, and 8 frontend tests across the request module (6), the account section (2) and App (2) — the App tests prove the session survives a refused deletion and is cleared after a successful one.

One test-only defect surfaced during this work and was fixed rather than retried: a scan-panel test looked up a checkbox and a button with one-shot queries, and under a loaded parallel run the rows could land a tick after the header, so it failed intermittently while passing in isolation. The lookups now retry, which is the same assertion with a deterministic wait.

The privilege gate deliberately does **not** claim that the pinned Tauri plugin presets grant nothing beyond what the app calls. That needs the crate's permission files, which are not vendored in this environment; the check enforces the parts decidable from the tree and the follow-up list records the review that needs them.

### Retention: the rows nobody was removing

Account deletion only helps people who leave. Nothing expired on its own, so `error_reports` and `download_attributions` accumulated forever, a pending review whose confirmation link had long expired stayed in the table, and dead action tokens were kept indefinitely. `backend/src/retention.ts` now runs every six hours and once at startup:

| Data                    | Window                               | Why that number                                                                                                                                                           |
| ----------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `error_reports`         | 180 days                             | Long enough to spot a crash pattern across a monthly release and see it fixed, which is the only reason the pipe exists                                                   |
| `download_attributions` | 400 days                             | Must exceed the widest window the operator report offers (365 days, clamped in `routes/downloads.ts`), or a year-over-year comparison would silently lose its oldest days |
| unconfirmed `reviews`   | 30 days past the confirmation window | Never published, so there is nothing to moderate — only a typed address waiting to be forgotten                                                                           |
| `action_tokens`         | 7 days after expiry                  | An expired token can never be consumed (`tokens.ts` requires `expires_at > now()`), so this only bounds how long a dead credential sits in a table                        |

Deliberately not pruned, each with its reason in the module: `billing_receipts` (the durable record that a receipt was sent), `checkout_reminders` (deleting one would re-send a nudge inside its own cooldown), `newsletter_subscribers` (the row _is_ the unsubscribe) and confirmed reviews (public content).

Deletes run in bounded batches of 5,000 rows and are safe to re-run and to run on two replicas. The inventory gate now compares the documented window with the enforced one: a mismatch fails the build, which is how a stale page was caught during this work rather than after a release.

### The driver cache now knows which machine it describes

`system_profile` gives the app CPU, core counts, GPU, RAM, disk kind, form factor and Windows build. A driver scan cached under the old rules survived a graphics card swap, because `navigator.platform` and the user agent do not change when hardware does — so the panel could list devices that were no longer installed. The cache is now keyed to a hardware signature (power plan and marketing OS version deliberately excluded, since neither changes which drivers are stale), and the panel drops a scan whose signature does not match, clears it from disk, and says why in all six locales.

## The homepage was blank without JavaScript

Prerendering the site was not enough on its own. The entrance animations were
rendered by an animation library, which writes an element's _start_ state into
the markup, so the prerendered homepage shipped **47 elements** as
`style="opacity:0;transform:translateY(28px)"` — section headings, feature copy,
metric labels and both frame-time traces waited for the bundle to arrive and
animate them in. A crawler that does not run script, a reader whose bundle was
blocked, and a phone whose bundle was slow all saw the same thing: a navbar over
an empty page. The bytes were in the response; the content was not on the page.

Nothing about the motion changed. What changed is which state is written down:
the markup and the stylesheet are both visible, and the hidden state lives only
under `[data-reveal-armed]`, an attribute a section sets _after_ its
IntersectionObserver is running and after everything at or above the fold has
been marked shown. A page that never runs the script shows its content, the fold
is never hidden even for a frame, and an element that is hidden always has a live
observer waiting to reveal it — the invariant the old version did not have.
Reduced motion never hides anything, and neither does a browser without
IntersectionObserver: the effect simply returns.

Two gates hold this. `npm run check:reveals --prefix site` reads the built output
and fails on the regression itself: any prerendered page whose markup hides an
element (unless it also declares `aria-hidden="true"`, which is how the promo
cards reserve their space while an offer request is in flight), any SVG left in
its "not yet drawn" state, any stylesheet rule that hides an animated element
without the armed gate, or a reduced-motion block left showing the hidden state.
`npm run check:hydration --prefix site` runs the built bundle in a DOM and checks
what the static read cannot: that the page hydrates without a server/client
disagreement (it builds a development copy of the bundle as well, because
production React repairs an attribute mismatch silently instead of reporting it),
that nothing at or above the fold is ever hidden, that a below-fold element
computes to `opacity: 0` only while an observer is watching it and to `1` once
scrolled to, and that reduced motion is never hidden at all. Twelve mutations of the
built output — hidden markup, an ungated rule, a missing rule, an un-neutralised
reduced-motion block, a disagreement in text, a disagreement in an attribute, the
fold check removed, the reduced-motion check removed, the hiding rule deleted, a
transition put back on `.reveal`, the entrance animation deleted, and the waiting
marker renamed — were each confirmed to fail one of the two gates. Both run as the last step of
`npm run build --prefix site` (as `npm run check:output`), which is the step every
path to production already runs: the CI site job, the Pages deploy and a local
build all verify the artifact they just produced. Removing the animation library
also removed an unused module (`site/src/motion.ts`) and 113 KiB of JavaScript.

**The entrance is a keyframe animation, not a transition.** The first version
animated it with `transition` on `.reveal`, and this stylesheet is unlayered
while Tailwind's utilities are not: `transition-property`, `-duration` and
`-delay` on `.reveal` therefore beat the `transition-all duration-500` the card
classes carry. Fifteen cards hovered with their lift and border fade snapping
instead of easing, and the `transition-delay` that creates the stagger applied
to every property each card transitioned. The animation now runs from
`@keyframes reveal-in`, which none of those utilities can collide with, and it
is gated on `data-reveal-waiting` — set only for an element that was actually
hidden below the fold — so marking the fold as shown can never animate content
the reader is already looking at. `check:reveals` fails if a transition
reappears on `.reveal` or if the animation is no longer wired to that marker,
and `check:hydration` fails if the marker stops being set at runtime; three
further mutations (a transition back on `.reveal`, the animation rule deleted,
the marker renamed in the built bundle) confirm both fail.

## Fonts: 96 files for a site with no Cyrillic

`@fontsource`'s default entry ships every script a family has, and each subset is
a render-blocking `@font-face` rule in the critical stylesheet. The site was
serving **96 font files (1,153 KiB)** and **48 `@font-face` rules — 17,493 of
58,860 bytes of CSS** — for Cyrillic, Cyrillic Extended, Greek, Greek Extended and
Vietnamese. A scan of every string in the site found no character from any of
them; the only non-ASCII characters present were five accented Latin letters.

Importing the named subsets (`latin-*` and `latin-ext-*` for all nine weights)
takes that to **36 files (777 KiB)** and **4,284 bytes of `@font-face` in 47,892
bytes of CSS**: 13 KiB of render-blocking CSS removed, and CSS gzip from 10.6 KiB
to 9.7 KiB. The same scan over the desktop app's six locales found 6,502 accented
Latin characters and nothing else, but its font import was left alone — the app's
own bundle is a separate change.

`npm run check:fonts --prefix site` fails on any font file naming a subset the
site cannot display, and names the import to write instead.

- App error toasts now explicitly import the application telemetry helper. The previous unqualified `reportError` resolved to the browser error-reporting global (or was undefined under jsdom), not the intended opt-in API. A native-write-refusal App test exposed this missing import.
- Visual system monitoring pauses while hidden and uses completion-based polling. Slow pulse/thermal reads have in-flight guards, preventing overlap. Scheduled background maintenance is deliberately unchanged.
- Added tests for slow reads, hidden/resumed windows, unmount, callback failures and session lifecycle.
- Database connection/query/statement timeouts and pool size are bounded; idle pool errors have a handler.
- Backend tests moved into an independent Linux CI job with disposable PostgreSQL 16; Windows CI retains native tests and now includes quick-installer regressions.
- Replaced the inaccurate ShellExecute safety comment in the token/SID query block with its actual buffer/handle invariants.
- A real TLS test exposed `pg`/Node's IP-host identity fallback. TLS options now explicitly bind certificate verification to the database URL's hostname, even for IP literals.

## Website payload, measured

| Measurement                                 | Before                 | After                     |
| ------------------------------------------- | ---------------------- | ------------------------- |
| JavaScript (`index-*.js`)                   | 399 KiB / 129 KiB gz   | **286 KiB / 92 KiB gz**   |
| CSS (`index-*.css`)                         | 57.5 KiB / 10.6 KiB gz | **46.8 KiB / 9.7 KiB gz** |
| Font files                                  | 96 / 1,153 KiB         | **36 / 777 KiB**          |
| `@font-face` bytes in the stylesheet        | 17,493 of 58,860       | **4,284 of 47,892**       |
| Elements hidden in the prerendered homepage | 47                     | **0**                     |

The JavaScript figure is the whole client bundle. The animation library measured
121 KiB raw / 40 KiB gzip on its own (31% of the previous bundle) for `motion`,
`AnimatePresence`, about sixty animated elements and no scroll, layout or gesture
hooks — React plus ReactDOM client is 139 KiB raw / 45 KiB gzip, so the library
was a near-peer of React in the budget. It is now a stylesheet rule, an
IntersectionObserver and one inline custom property per element.

These are byte counts and rendered-markup counts from the build. Lighthouse and
field Core Web Vitals were not measured in this environment, and no real browser
was available: the scroll-triggered behaviour is exercised by `check:hydration`,
which hydrates the built bundle in a DOM with an observer the test drives, so
what is verified is the logic and the computed styles rather than the painting.

## Validation completed

| Check                                                                                  | Result                                                                                            |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Desktop TypeScript + Vite production build                                             | PASS                                                                                              |
| ESLint                                                                                 | PASS, no warnings                                                                                 |
| Full frontend Prettier check                                                           | PASS                                                                                              |
| Frontend coverage run                                                                  | **368 tests / 28 files pass**, including raised/per-file coverage gates                           |
| Frontend line coverage                                                                 | **53.81%**, up from **46.09%**                                                                    |
| Other frontend coverage                                                                | Statements **52.51%**, branches **51.17%**, functions **49.91%**                                  |
| Backend build + tests with real PostgreSQL enabled                                     | **197 pass, 0 failures, 0 skipped**; **194 pass / 3 skipped** without one (the 3 need a database) |
| Explicit PostgreSQL TLS integration                                                    | **1 pass**; correct identity succeeds, wrong CA and hostname fail                                 |
| Website client/SSR/prerender build + SEO                                               | PASS; 17 sitemap routes checked                                                                   |
| Website font-subset and reveal-safety gates                                            | PASS; 36 font files, 0 hidden start states across 19 prerendered pages                            |
| i18n keys/quality, public counts, design-token and workflow-reference checks           | PASS                                                                                              |
| All existing JS model/script suites and release-verification regression tests          | PASS; release verification 3 pass and 2 skipped (the two that need the Rust toolchain)            |
| Rust/native tests, actual installer/Authenticode tests, Windows performance benchmarks | **Not run in this Linux environment**                                                             |

One piece of this work could not be pushed with the branch. Creating or updating a
file under `.github/workflows/` needs the GitHub App's `workflows` permission, and
the app that pushes this branch does not have it, so the branch carries no workflow
changes: the site gates run through `npm run build` instead, and the pieces that
have no other CI path — the standalone PostgreSQL 16 backend job, the Windows
quick-installer step, and the `check:no-new-privileges` and `check:data-inventory`
steps — are kept as a ready patch (`wincraft-ci-workflows.patch`, applied in the
working tree) to push once the permission is granted. Those two gates currently run
only in the root `npm run check` chain, which CI does not call.

Something outside this branch keeps any of it from being live: the site deploy
has failed on every run since the site was added, at `actions/configure-pages`,
with `HttpError: Not Found` from the Pages API — GitHub Pages is not enabled (or
not reachable) for this repository, so nothing from this branch has been
published to wincraft.app by it.

The disposable PostgreSQL 18.4 binaries, database files and generated local certificate fixtures stayed outside Git in an excluded cache directory. CI is configured to use PostgreSQL 16; that CI job has not been run from this unpushed working tree. Local databases were stopped after verification.

## Deployment requirements — do not skip

1. **Database:** supply an authentic provider CA if the provider does not use system-trusted certificates. Remove URL TLS overrides; only `application_name` is accepted as a URL query parameter. Remove `DATABASE_ALLOW_PLAINTEXT=true` in production. Do not restore access by disabling verification.
2. **Proxy:** configure `TRUSTED_PROXY_CIDRS` only after staging proves header sanitization and access is restricted to the ingress. Without configuration, behind-proxy clients share the proxy's per-IP limits. Never use a wildcard or numeric hop count.
3. **Scaling:** keep one replica until rate-limit/global-budget state is shared across instances.
4. **Windows:** run the new quick-installer suite and existing native/release-verification suites, including real signed artifacts. These cannot be certified by JS tests or static inspection. The hardware-signature check reads `system_profile`, whose field values were read from the Rust source, not from a running Windows build: confirm on real hardware that a card swap changes the signature and that nothing else does.

## Explicit follow-ups

The confirmed code findings have implementations and targeted regressions, but not every broader architectural/optimization proposal in the audit is complete. Follow-up work still includes production ingress validation, Windows installer/native verification, unified recovery/evidence metadata, distributed budgets before scaling, additional App/account/WebView integration coverage, OS-protected credential storage evaluation, tested Rust toolchain/advisory gates, and the telemetry half of the measurement plan. Hardware-aware cache invalidation, the bundle, the CSS and the font payload are done and measured above.

Two gaps were found while writing the data inventory. The first is now closed; the second is deliberately left visible rather than papered over:

1. ~~There is no account-deletion path.~~ Implemented, with a refusal while a subscription is still billing.
2. ~~Nothing expires on its own for accounts that still exist.~~ Implemented as the retention worker above, with the windows cross-checked against the data inventory by a gate.
3. **Receipt payloads store the customer-facing text they were sent** rather than re-deriving it, so a receipt row keeps the amount label of the day it was queued. That is intentional for auditability, and it is why those rows are the one class with no timer.

Reviewing the pinned Tauri plugin presets against the permissions the app actually calls needs the crates checked out; the renderer gate covers everything decidable from this tree.

No universal FPS, RAM, latency or battery improvement is claimed. Preserve the audit's measurement plan and optimize against Windows workload baselines rather than adding speculative tweak defaults.

## Reproduce focused checks

```bash
npm run build
npm run lint
npm run format:check
npm run test:coverage
npm test --prefix backend
npm run build --prefix site
npm run check:seo --prefix site
npm run check:fonts --prefix site
npm run check:reveals --prefix site
npm run check:hydration --prefix site
```

For real PostgreSQL rollback/concurrency, set `TEST_DATABASE_URL` to a **disposable loopback database** before `npm test --prefix backend`. Without that variable the PostgreSQL integration test is explicitly skipped.

For TLS identity tests, provide a local TLS PostgreSQL server whose certificate identifies `localhost` (but not `127.0.0.1`), then set `TEST_DATABASE_TLS_URL`, `TEST_DATABASE_CA` and `TEST_WRONG_DATABASE_CA` and run `npm run test:tls --prefix backend`. Do not aim certificate-fixture tests at production.

On x64 Windows, run:

```powershell
./scripts/test-quick-installer.ps1
npm run check:rust
npm run check:native-policy
```

## Third pass, later the same day — the run that finally executed, and the links audit

Branch `arena/0a0ad37e-wincraft`. This pass starts from a pushed branch and a
red CI run, and it ends with the first green Checks run this lineage has had.

### CI, before and after

| Run                | Head      | Result                                                                                     |
| ------------------ | --------- | ------------------------------------------------------------------------------------------ |
| `38430230518`      | `9338a66` | Failure at step 22: `no_value_is_written_twice_or_by_another_tweak` panicked — `disable_edge_hub_sidebar` overlapped the settings card `disable_edge_ai` |
| `38432375696`      | `e26aff1` | **Green, 26/26 steps** — including the four that had never run here: Isolated native policy tests (20 `cargo test --lib` filters), Live DPC capture, Native power policies on a disposable plan, and Backend unit tests |

Getting to step 22 at all was itself work: the previous session's branch did not
compile, and the six errors were the audit's own: six `Category::System`
variants in `tweaks.rs` (the variant does not exist), a non-exhaustive
`RegValue` match in `dns.rs`, and a missing import. The overlap that failed the
run after that was a **real assertion, not a flake** — one registry value with
two owners — so it was fixed by giving `HubsSidebarEnabled` back to its
dedicated control rather than by relaxing the test.

### Catalogue corrections

| Change                                                                                                                                                    | Why                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Six ids renamed or retargeted: `disable_activity_feed` → `disable_consumer_experiences`, `disable_publish_user_activities` → `disable_cloud_clipboard`, `disable_bing_widget_search` → `disable_error_reporting`, `disable_inventory_telemetry` → `disable_diagtrack_autologger`, `disable_sqm_telemetry` → `SQMLogger`, `disable_ndu` → the Ndu service key | Each one wrote a value Windows no longer reads, or wrote the same value as another control. The ids and their names/descriptions were renamed together in all six locale tables, which `check:i18n` verifies |
| `disable_bing_search` keeps its id and now writes `DisableSearchBoxSuggestions` (`HKCU\Software\Policies\Microsoft\Windows\Explorer`)               | `BingSearchEnabled` has been ignored since Windows 10 2004 and is reset by feature updates; the policy value is the durable one. It must stay a non-finding in `recommend.rs`, which a Rust test asserts |
| Six `Category::System` values became `Privacy`                                                                                                          | The variant does not exist; the catalogue compiles again. Categories now read Privacy 58 / Performance 18 / Ui 14 / Gaming 9 / Maintenance 5 |
| `HKLM\SOFTWARE\Policies\Microsoft\Edge\HubsSidebarEnabled` has one owner                                                                            | `disable_edge_ai` writes five Edge AI policies and says the sidebar has its own control; the VM matrix matches the catalogue byte for byte                                   |
| Five orphaned permission files and the unused `ed25519-dalek` dependency removed                                                                          | `ipc_commands.rs` declares 147 commands and 147 `allow-*` permissions remain; `Cargo.lock` went from 569 to 557 packages with no dangling reference                        |

### The links audit

Holding the published claims against the published artifacts found a rename that
had been applied to the reachable half only — the same failure mode as the held
workflow patch, one level down: a session that could not push its workflow
change left every *link* rewritten and the *file names* unchanged.

| Where                                                                   | Said                                              | Reality                                                                                                          |
| ----------------------------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `site/src/constants.ts`, `site/index.html` (JSON-LD `downloadUrl`)      | `.../releases/latest/download/WinCraft-Setup.exe`  | The alias workflow uploads `PCTweaker-Setup.exe`; nothing has ever published `WinCraft-Setup.exe`                 |
| `site/src/constants.ts`, `src/components/maintenance.tsx`               | `WinCraftUninstaller-Setup.exe` in *this* repository | The Uninstaller is a separate product: `AurelioAvila/pc-tweaker-uninstaller`, asset `PCTweakerUninstaller-Setup.exe` |
| `README.md`, `site/src/i18n/dictionary.ts`, the launch kit              | WinGet identifier `Warzonesiddiki.WinCraft`        | winget-pkgs has `AurelioAvila.PCTweaker` (1.18.1); `Warzonesiddiki.WinCraft` was never submitted                  |
| `docs/pad.xml`                                                          | 1.18.1 downloaded from this repository (its size and hash were correct) | The signed 1.18.1 release lives in `AurelioAvila/pc-tweaker-app`; the feed also called the licence "Proprietary terms" |
| `CHANGELOG.md` (the 1.19.0 section), the launch kit, an Instagram caption | 81 controls, a Pro tier at €9.99/mo, 5 languages, 10 themes | 141 controls, no tier, 6 languages, 14 themes                                                                     |

Two gates now hold those statements in place, each verified by reverting the fix
it guards and watching it fail:

- `npm run check:download-links` (`scripts/check-download-links.mjs`) reads the
  stable filenames out of `.github/workflows/*.yml` and the identifiers the
  WinGet workflow submits, then checks every download URL and WinGet reference in
  the tree against them. Cross-repository aliases are listed with the reason they
  cannot be derived. It is enforced in CI through `src/repo-gates.test.ts`, since
  adding a step to `checks.yml` needs the `workflows` permission.
- `npm run check:public-counts` now also reads the changelog section for the
  version being shipped and the launch kit, tolerates a modifier between the number
  and its noun ("81 one-click Windows controls" was invisible to the old pattern)
  and rejects a non-zero price.

### Verified locally

`npx tsc --noEmit`; `npx eslint src`; `prettier --check "src/**/*.{ts,tsx,css}"`;
`npm test` (371 tests); `check:design-tokens`, `check:i18n` (1731 keys × 6),
`check:i18n-quality`, `check:public-counts`, `check:workflows`,
`check:no-new-privileges` (147 permissions), `check:data-inventory`,
`check:download-links`, and the eight model suites — all exit 0;
`npm ci && npm run build && npm run check:seo` in `site/` (17 sitemap routes);
`backend`: 197 pass / 0 skip against a real PostgreSQL 17 on loopback.
`check:rust` and `check:native-policy` cannot run here (no Rust toolchain, and
the rustup hosts are unreachable from this sandbox); CI is their home, and it is
green.

### The same holding-to-account, applied to copy and to a money path

- **Fixed: the site said the wrong thing about signatures.** The hero note and
  the FAQ answer both asserted that WinCraft installers are code-signed and that
  *older* downloads may be unsigned. The published 1.19.0 is a pre-release and
  unsigned — the alias workflow's own run reports `Authenticode verification
  failed (NotSigned): WinCraft_1.19.0_x64_en-US.msi` — while the signed builds
  are the older 1.18.x ones, so both halves were inverted. Both strings now
  state the rule (a signed release identifies Aurelio Avila and carries a
  trusted timestamp), the current state (the published build is a pre-release
  and not code-signed), and what the visitor should do. RELEASING.md's listing
  step now says to re-read those sentences at every release, because they go
  stale the moment the signature state changes.
- **Fixed, in the site's half: where a tip returns.** The backend creates the
  tip session with `${APP_URL}/tip-thanks`; `backend/README.md` documents
  `APP_URL` as the API origin (`https://api.wincraft.app`), and the backend
  serves that page, so the documented configuration already put the tipper
  somewhere real. The site's half did not exist: `site/src/components/TipThanks.tsx`
  acknowledged a tip at `/?tip=thanks` and its own comment claimed Stripe
  redirected there, but no code path produced that URL and
  `https://wincraft.app/tip-thanks` answered with the 404 page — so under
  `stripe.ts`'s own default (`APP_URL=https://wincraft.app`), the one visitor who
  had just paid was the one visitor shown a 404. The site now serves
  `/tip-thanks` as the homepage with the acknowledgement, through the same route
  table the prerender walks, so both configurations land on a page that says
  thank you. The banner answers to the path as well as to the query, the page
  canonicalises to the homepage and stays out of the sitemap, and
  `site/scripts/check-hydration.mjs` loads it and fails when the acknowledgement
  is missing — or when it appears on the homepage uninvited. No Stripe
  parameter, price or redirect target changed, which is also why the redirect's
  target stays a question for the owner rather than an edit here: the backend's
  `/tip-thanks` page and the site's thanks state are both real now, and which
  origin `stripe.ts`'s own default names is a deployment setting this sandbox
  cannot observe.

### The 2.0 roadmap's done-markers, held to account

`docs/WINCRAFT-2.0-ROADMAP.md` marked every work package `[x]`. Holding each box
against the tree found five claims that nothing implements — `SvcHostSplitThresholdInKB`
grouped service hosting, NTFS 8.3 names and Last Access Time, the `AITEventLog`
and `DiagLog` autologgers (only `AutoLogger-Diagtrack-Listener` and `SQMLogger`
are written), the nine workflow archetypes (six starter profiles ship), and the
named non-critical services (`MapsBroker`, `WerSvc`, `dmwappushservice`, `lfsvc`
appear nowhere in the code) — plus two that are true only in effect: the pre-flight
restore point is the native `SRSetRestorePointW` API rather than WMI, and boot
times come from `sysinfo` and Windows' own record rather than the WMI
`SystemBootTime` class. The five are now unchecked, and a reconciliation section
in the roadmap records what ships instead and what holds up. None of it is a
regression: nothing published claims those five, and the design spec already held
the SvcHost fan-out back for a manual hardware test.

### Owner actions this session cannot complete

1. **GitHub Pages.** Every deploy job has failed at `actions/configure-pages`
   with `Get Pages site failed … Not Found`, because the repository has no Pages
   site. The API refuses all three enable routes with this credential (`PUT
   /pages`, `PATCH has_pages=true`, `POST /pages/builds` → 403). Either set
   Settings → Pages → Source = GitHub Actions once, or apply
   `docs/workflows-pending.patch`, which passes `enablement: true` to the action
   so the workflow creates the site itself.
2. **Two held workflow patches** (`docs/checks-annotation.patch`,
   `docs/workflows-pending.patch`) — see [ci-workflow-changes.md](ci-workflow-changes.md).
3. **A signature-verified release in this repository.** The published 1.19.0 is a
   pre-release and unsigned (`WinCraft_1.19.0_x64_en-US.msi`: `NotSigned`), so the
   stable alias does not exist, the in-app updater endpoint
   (`.../releases/latest/download/latest.json`) has nothing to serve, and
   `install.ps1` fails closed exactly as designed. Nothing in this sandbox can
   sign a Windows binary.
4. **The publisher question is settled by reading, not by editing.** `install.ps1`
   requires the Authenticode signer to be `Aurelio Avila`; `tauri.conf.json`'s
   `bundle.publisher` (`WinCraft Contributors`) only sets file metadata, not the
   certificate, and every signed release so far was signed as Aurelio Avila
   (`verify-installers.ps1` pins that certificate's thumbprint). Nothing needs to
   change on either side; the two strings describe different things.

## Fourth pass — the licence cluster, the installer, and gates that had no runner

The links audit's method applied to copy found one more cluster, and it is the
same shape: a decision that changed and three sentences that did not.

`site/src/i18n/dictionary.ts` labelled the MIT `LICENSE` file
"Source-Available License", and the reel and long-form generators carried
"WinCraft isn't open source, but the code is source-available" — with a comment
saying it must never be called open source. That was correct while the project
was source-available and wrong from the day it became MIT, which is why the
sentence had a comment defending it and why no gate noticed: nothing read a
licence claim. All four lines are fixed (including "source available" as a
YouTube tag), the footer's product column now says `WINCRAFT` rather than
`PC TWEAKER`, and `npm run check:license-claims` holds it: it reads the licence
name out of `LICENSE`, fails on "source available", "not open source", "closed
source", "all rights reserved" and "proprietary licence/terms" across the
public copy, and requires README, TERMS.md, `docs/pad.xml` and the site's own
dictionary to name it. Both halves were verified by reverting them.

A third gate closes the same loop for the project's own origin.
`npm run check:site-links` reads every wincraft.app URL in the tree — backends,
docs, listings, workflows — and fails when the path is not a route the site ships
or a file under `site/public/`. It is the check that would have caught the tip
return address, and it found one more: the offer-verification script created test
Checkout sessions on the site's origin with the backend's `/checkout-success` and
`/checkout-cancel` paths. Both now name the origin that answers, and the gate runs
in CI through `src/repo-gates.test.ts` beside the other two.

**Checked live on 2026-10-13, because a URL that resolves is the only evidence
that matters.** The Uninstaller's stable alias is on every release of
`AurelioAvila/pc-tweaker-uninstaller`, Tweaky Driver's is on
`AurelioAvila/Tweaky-Driver-Releases`, the PAD feed's 1.18.1 file, size and
licence line are exact, and this repository's legacy 1.18.x builds are still
published and signed in `AurelioAvila/pc-tweaker-app`. The one URL that does not
resolve is this repository's own alias: the workflow only creates it for a
signature-verified release, and 1.19.0 is a pre-release and unsigned, so the link
404s by design until a signed release exists — and the site's hero note says
exactly that.

Two gates that had no runner now have one, neither needing a workflow edit:

- `scripts/test-quick-installer.ps1`, the offline suite over `install.ps1`, runs
  from `src/repo-gates.test.ts` in the `checks` job, which is already on a
  Windows image — plus a parse of every `.ps1` in the tree, the only check that
  would catch a syntax error in a release script before the day it is needed.
  `docs/workflows-pending.patch` dropped the now-duplicate step and still applies
  cleanly.
- `scripts/check-license-claims.mjs`, beside `check-download-links.mjs`.

`install.ps1` itself is small and security-relevant, so the change to it is
small: a catch that prints what a failed download means and rethrows, and a
UTF-8 BOM so Windows PowerShell 5.1 — what `irm … | iex` runs — stops reading
the script as ANSI and mojibaking the em dash in its banner. Discovery is still
the only stage inside a `catch`; verification, download and execution are still
outside it.
