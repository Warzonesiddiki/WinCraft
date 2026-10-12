# Contributing to WinCraft

Thanks for taking the time to help. WinCraft is a Windows performance tool that
changes real system settings on real machines, so the bar for a change is
"correct, reversible and tested" rather than "fast to merge".

By contributing you agree that your work is licensed under the repository's
[MIT license](LICENSE).

## Getting set up

Prerequisites on Windows:

- **Node.js 22** and npm (the version CI uses)
- **stable Rust** via [rustup](https://rustup.rs/)
- **Visual Studio Build Tools** with _Desktop development with C++_, a Windows
  SDK, and the WebView2 runtime ([Tauri prerequisites](https://v2.tauri.app/start/prerequisites/))

Then install and run:

```powershell
git clone https://github.com/Warzonesiddiki/pc-tweaker-app.git
cd pc-tweaker-app
npm ci
npm run tauri dev
```

Two other trees have their own `package.json` and lockfile. Install them only
when you work inside them:

```powershell
cd backend   # Express + PostgreSQL + Stripe API
npm ci
cd ..\site   # prerendered marketing site
npm ci
```

## Repository layout

| Path                  | What lives there                                                           |
| --------------------- | -------------------------------------------------------------------------- |
| `src/`                | React + TypeScript user interface (39 components, `i18n.ts`, `catalog.ts`) |
| `src-tauri/`          | Rust core: privileged operations, IPC commands, Windows APIs               |
| `backend/`            | Express API: accounts, entitlements, licenses, Stripe, mail                |
| `scripts/`            | Check and test scripts run by `npm run check` and CI                       |
| `site/`, `marketing/` | Website and release/announcement tooling                                   |
| `docs/`               | [Architecture](docs/ARCHITECTURE.md), [API](docs/API.md), release runbooks |

`docs/ARCHITECTURE.md` explains how the three parts fit together, and
`docs/API.md` lists the HTTP endpoints and the desktop IPC surface.

## The checks a change has to pass

Run these before opening a pull request. They are the same gates CI runs
(`.github/workflows/checks.yml`), and they are all offline and read-only:

```powershell
npx tsc --noEmit                      # strict TypeScript
npm run lint                          # ESLint, zero warnings required
npm run format:check                  # Prettier owns formatting
npm run check:i18n                    # every key exists in all six locales
npm run check:i18n-quality            # no English left in another locale
npm run check:public-counts
npm run check:design-tokens
npm run check:no-test-pro
npm test                              # frontend modules + components (jsdom)
npm run test:coverage                 # the same suite with the coverage ratchet
node scripts/test-scan.mjs            # then every other scripts/test-*.mjs
cd backend; npm test                  # 161 API tests, pg-mem backed
cd site; npm run build; npm run check:seo   # if you touched anything under src/
```

`npm test` is Vitest: it runs `src/**/*.test.ts(x)` in jsdom with Testing
Library and jest-axe, so it is the only gate that renders a component. Add a
test next to the module you change (`src/lib.test.ts`, `ui.test.tsx` and
`pricing.test.tsx` were the first three; there are sixteen files now). It needs
no Rust toolchain and no network.

The website job matters more than it looks: `site/` imports shared modules
straight out of `src/` — the offer banner and the offer format, for instance —
so deleting or renaming one breaks the site build even though nothing under
`site/` changed. `deploy-site.yml` only runs after a merge to master; the `site`
job in `checks.yml` is what makes a pull request fail before that.

`npm run test:coverage` is `npm test` instrumented, with the thresholds in
`vitest.config.ts`. They are a **ratchet**: they sit about a point under what the
tree measures so ordinary refactoring cannot trip them, and they exist to refuse a
fall. Raise them when you add tests; never lower one to make a red run green. The
count includes every file under `src/`, so a module you add and do not test will
pull it down — that is the point.

`npm run check` runs the same list plus `cargo test`, which needs a Windows
machine and a disposable VM snapshot. Rust tests touch real files and protected
paths, so do not run them against a machine you care about.

If you cannot run a check — no Windows box, no Rust toolchain — say so in the
pull request and include the exact command a reviewer should run.

## What a good change looks like

**Keep the change small and reversible.** One subject per pull request. If a fix
needs a refactor first, land the refactor separately.

**Every user-visible string goes through the translation tables.** Add the key to
the `Strings` interface in `src/i18n.ts` and to all six locales (`en`, `it`,
`de`, `es`, `fr`, `pt`); component-scoped copy lives in the matching
`src/components/*-copy.ts` table the same way. `check:i18n` fails when a locale
is missing a key or a placeholder does not match, and `check:i18n-quality` fails
when a "translation" is byte-identical to English without being on the reviewed
list (`scripts/audit-i18n.mjs`).

**Use design tokens, not raw palette classes.** `npm run check:design-tokens`
ratchets the count of legacy raw Tailwind palette classes: it fails on
regressions and accepts improvements. Reach for `text-ink`, `bg-surface-1`,
`border-line`, `text-accent` and friends.

**Never write a setting without a snapshot.** Every change runs through the
rollback journal so the user can undo it. New tweaks go into the catalogue in
`src/catalog.ts` with the metadata the UI and the rollback path expect; new
privileged operations belong in `src-tauri/src/`, registered in
`ipc_commands.rs` (a Rust test checks IPC/capability parity) and added to the
capability manifest under `src-tauri/capabilities/`.

**Respect elevation.** Operations that need administrator rights must go through
the elevated helper rather than trying to widen the main process. Twice-checked
guards (admin required, machine-wide scope, protected paths) are not optional.

**Add a test where it can fail.** Source-checking suites live in `scripts/`
(`test-*.mjs`), the API suite is `backend/test/*.test.mjs`, and Rust tests sit
next to the modules they cover. A test that only asserts a string still exists
in a file is usually worse than no test: assert behaviour, ordering or output.

**Do not add dependencies casually.** A new npm or crate dependency needs a
reason in the pull request and no lighter alternative. No major version upgrades
without discussing them first.

## Commits and pull requests

- Write the commit subject in the imperative ("Fix the drive switch flashing the
  previous health reading"), and use the body for the why, not the what.
- Label breaking changes: a change to a stored file format, an IPC command
  signature, an HTTP response, or the meaning of an existing setting is
  **BREAKING** and must say so in the subject ("**BREAKING**: ...").
- Do not commit secrets, tokens, `.env` files, real emails, license files or
  customer data. `backend/.env.example` documents the environment variables; use
  throwaway values locally.
- Never paste a secret into an issue or a pull request. If one is exposed,
  rotate it first and tell a maintainer. See [SECURITY.md](SECURITY.md).
- Reference the issue a change closes.

## Reporting bugs and vulnerabilities

Use the support link in [README.md](README.md) for anything involving an
account, billing or private diagnostics. For a reproducible software bug, open
an issue with the app version, Windows build, hardware, the tweak or tool you
used, the steps, the expected result and what actually happened.

Security issues go through [SECURITY.md](SECURITY.md), not the public issue
tracker.

## Releasing

Maintainers follow [RELEASING.md](RELEASING.md). A development build carries no
publisher identity and no update signature; never distribute one as an official
release.
