# WinCraft architecture

WinCraft is a Windows tuning tool built as a Tauri 2 desktop application, with a
small HTTP backend that handles accounts, entitlements and payments. This
document is the map: what runs where, how a change reaches the operating system,
and which boundaries the code is not allowed to cross.

```
┌─────────────────────────────── desktop app (signed installer) ───────────────────────────────┐
│  React + TypeScript UI            │  Rust core (src-tauri)         │  elevated helper      │
│  src/  · 39 components            │  · IPC command handlers        │  · admin operations   │
│  · App.tsx shell and tab router   │  · rollback journal            │  · same binary,       │
│  · i18n.ts + locales (chunks)     │  · Windows registry/service    │    separate process   │
│  · catalog.ts tweak catalogue     │    adapters, monitoring,       │    with a narrow      │
│  · scan-runner.ts apply pipeline  │    cleanup, game sessions      │    argument surface   │
└─────────────┬─────────────────────┴───────────────┬──────────────────────────────────────────┘
              │ invoke() over the Tauri IPC bridge  │ HTTPS (accounts, license, offers)
              ▼                                     ▼
      %APPDATA%/<app identifier>              backend/  Express + PostgreSQL + Stripe
      journal, profiles, history,             routes/auth, account, license, entitlements,
      HUD placement, avatars, license.json    stripe, offers, downloads, reviews,
                                              newsletter, support, error-reports, flags
```

## The three trees

**`src/` — user interface.** React 19 with strict TypeScript, bundled by Vite.
`App.tsx` is the shell: it owns the active tab, the toast queue, account state
and the tweak list, and renders one panel per section. Components are grouped by
area (scan, hardware, maintenance, gaming, privacy, profiles) and share the
small primitives in `src/components/ui.tsx`. Everything the user can read comes
from `src/i18n.ts` or a component copy table; there are no hardcoded English
strings in components.

**`src-tauri/` — the Rust core.** 73 modules behind `lib.rs`. They own every
privileged action: registry writes with snapshots, service control, scheduled
task changes, debloat app removal, disk cleanup, driver audits, monitoring
samples, the HUD overlay window, and the license check. The frontend never
touches the system directly — it calls a command, the Rust side validates the
arguments, records a snapshot and performs the write.

**`backend/` — accounts, entitlements and commerce.** Express + `pg` + Stripe,
deployed separately. It issues accounts and JWTs, signs short-lived license
payloads, keeps the `entitlements` table, receives Stripe webhooks, and runs the
mail paths (verification, reset, receipts, support replies). See
`docs/API.md` for the endpoint list.

`site/` holds the prerendered website, and `marketing/` holds the release and
announcement tooling. Both have their own dependency trees and are not part of
the desktop build. The site's origin is written down once, in `site/src/seo.ts`;
`site/scripts/site-origin.mjs` reads it for the sitemap generator and the SEO
gate, and that gate also asserts the shipped `public/CNAME` — the deployment
setting that decides where GitHub Pages answers — so the two cannot drift.

Public copy quotes the catalogue's total from `scripts/check-public-counts.mjs`
and nothing else: the app has no licence gate, so the Free/Pro split the Rust
catalogue still carries is metadata, and the check fails if a public text
publishes it again (or quotes a different total).

## How a change reaches Windows

1. **The UI asks for something.** A component calls a command through
   `invoke()` (`@tauri-apps/api/core`). Only commands listed in
   `src-tauri/src/ipc_commands.rs` may be called: a Rust parity test compares
   that registry with the handlers registered in `lib.rs`, and the capability
   manifests in `src-tauri/capabilities/` decide which windows may call what.
2. **Rust validates and snapshots.** The adapter checks the request (target
   exists, value in range, edition/build requirements met), reads the current
   value and appends a `SnapshotEntry` to the rollback store under the app data
   directory.
3. **The write happens.** Registry and service writes go through adapters that
   keep the change reversible; operations that need administrator rights are
   handed to the elevated helper process, which performs the write and reports
   back. Machine-wide scope and protected paths need an explicit administrator
   grant.
4. **The result is recorded.** The change appears in the change ledger with its
   saved original value, so "restore" puts the machine back exactly as it was —
   including after a Windows update, which the drift watch reports.

A tweak the user can toggle individually lives in `src/catalog.ts`; tweaks that
need a dedicated UI (EcoQoS rules, priority rules, Game Sessions, the X3D cache
aligner) are listed in `CONFIGURABLE_TWEAK_IDS` and are handled by their own
cards instead of the generic toggle path.

## Desktop windows and processes

- **Main window** — the application, capability manifest `default.json`.
- **HUD overlay** — a separate always-on-top window for the live monitor,
  capability manifest `hud.json`, deliberately limited to the HUD commands
  (`hud_snapshot`, `set_hud_click_through`, `set_hud_compact`, …).
- **Elevated helper** — the same executable started with administrator rights
  for operations the unelevated process may not perform. It never builds a UI.

Application data lives in `%APPDATA%/<app identifier>`, resolved in `lib.rs` the
same way Tauri resolves it so the helper can find it without an `AppHandle`. It
contains the rollback store, saved profiles, change history, HUD and window
placement, avatars, monitoring profiles, game sessions and cached results for
the last cleanup, repair, disk optimisation, purge and RAM trim.

## Security boundaries

- **No remote code.** The frontend bundle, the Rust core and all assets ship
  inside the installer. The webview loads local files only, under the CSP in
  `src-tauri/tauri.conf.json`.
- **Least privilege per window.** The two capability manifests are scoped:
  the HUD window cannot call tweak or cleanup commands.
- **Server state is signed.** License payloads are signed by the backend with
  `LICENSE_SIGNING_PRIVATE_KEY` and verified in Rust; the desktop app treats an
  unsigned or expired payload as "no entitlement".
- **The API is defensive by default.** `helmet`, an origin allowlist
  (`CORS_ORIGINS`), per-route rate limiters, a global limiter, a honeypot and a
  shared budget on the public forms, parameterised SQL everywhere, and webhook
  signature verification before any Stripe event is trusted.
- **Secrets stay server-side.** The desktop app holds no Stripe or database
  credentials. Account tokens live in the webview's local storage.
- **Nothing leaves the machine unasked.** Monitoring, scans and tweak results
  are local; the only outbound traffic is the API calls the user triggers, the
  update check, and the crash-report submission the user confirms.

## Product state: everything is free

WinCraft is free for everyone under the MIT license. The desktop app treats every
feature as unlocked (`isProUnlocked` in `App.tsx`), and the Rust gate
`require_pro()` in `lib.rs` is a documented no-op kept so the enforcement
plumbing still compiles. The backend keeps the `entitlements` table, the
`products.ts` catalogue and the Stripe routes because they still serve the
separate Uninstaller product and honour entitlements granted before the change;
`pctweaker` remains a valid alias of the `wincraft` product id so old rows,
licences and Stripe metadata keep resolving.

## Translations

`src/i18n.ts` defines the `Strings` interface, the language list and the loading;
the tables themselves are data files under `src/locales/` (`en`, `it`, `de`,
`es`, `fr`, `pt`). English is imported into the bundle — it is the primary
language and the fallback for every other — and the other five are fetched on
demand, one chunk each, the first time that language is chosen. `stringsFor(lang)`
is the synchronous read while drawing (English until the chosen table arrives) and
`loadStrings(lang)` is the only writer. `src/i18n-tables.ts` imports all six for
the gates and the tests that need them at once: **the app must never import it**,
because that would put all 562 kB of strings back into the entry chunk.
Component-level copy is split into
`*-copy.ts` tables typed against the English table, so a missing key fails
`tsc`. Two gates guard the result: `check:i18n` proves every locale has every key
with matching placeholders, and `check:i18n-quality` flags strings that are
still English inside another locale (with a reviewed-and-accepted list for words
that are genuinely the same).

## Testing layers

| Layer                   | Where                                    | What it covers                                                                                                                                        |
| ----------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Type and style gates    | `tsc`, ESLint, Prettier                  | strictness, unused code, formatting                                                                                                                   |
| Frontend tests          | `npm test` (Vitest, jsdom)               | `src/**/*.test.ts(x)`: module helpers, components (Testing Library) and a11y (jest-axe)                                                               |
| Coverage ratchet        | `npm run test:coverage`                  | thresholds in `vitest.config.ts`, about a point under the measured tree: they refuse a fall, not a target                                             |
| Source/behaviour suites | `scripts/test-*.mjs`                     | scan pipeline, advisor, thermals, repair ETA, updater, debloat model, download limits, promo rules, language default, change history, UI polish, i18n |
| Rust tests              | `src-tauri/src/*.rs`, `src-tauri/tests/` | adapters, IPC/capability parity, rollback store, license verification, game sessions                                                                  |
| API tests               | `backend/test/*.test.mjs`                | auth, entitlements, Stripe policy, webhooks, mail, offers, admin boundaries                                                                           |

`npm test` is the only layer that renders a component: the script suites run the
pure models in Node, while the frontend suite runs them in jsdom with Testing
Library and jest-axe. Tests live beside the module they cover (`src/lib.test.ts`,
`src/scan-runner.test.ts`, `src/tweak-list-model.test.ts`,
`src/components/ui.test.tsx`).

A new test file must be `src/**/*.test.ts(x)` to be picked up, and it is
type-checked by the same `tsc` pass as the app, so it cannot drift out of the
build's strictness.

Coverage counts **every source file**, not only the ones a test imported
(`coverage.include` in `vitest.config.ts`). Without that, untested modules vanish
from the denominator and the number goes up when code is added and never tested —
measured on this tree, the same suite read 30% with everything counted and 58%
with only the imported files. Raise the thresholds as tests are added; never lower
one to make a red run green.

CI (`.github/workflows/checks.yml`) runs the type/style gates, the frontend suite
with its coverage ratchet, every script suite listed above, `cargo test` and the
API tests on every push and pull request, plus a separate `site` job that builds
the website and runs its SEO check — the site imports shared modules straight out of `src/`, so a change here
can break it without touching `site/`. `npm run check` is the same chain plus
`cargo test` for release day; anything in it that CI does not also run is a gate
that can only fail on release day, so keep the two lists in step.
