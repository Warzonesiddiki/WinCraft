WinCraft 1.19.0 is the first release built after the desktop app was made free and open source. The licence gate is gone from the shipped code, every one of the 81 controls is available to everyone, and the release gates that were supposed to prove it are now wired into CI so a regression is caught on the push that causes it rather than on release day.

## What changed

- **Every feature is free, permanently.** All 81 controls, every panel and every tool: no subscription, no licence key, no expiring trial, no account required to tune anything. The desktop app no longer contains a licence check, a signed licence store or a debug-only unlock path; those were removed rather than hidden. The Plans & pricing page states the single plan there is.
- **The catalogue is no longer split.** The `requires_pro` flag was cleared on all 81 controls, so there is no paid/free split left to state anywhere. The build now fails if any public text — the README, the site, the Store listings, or the release notes for the version being shipped — reintroduces a split or quotes a different total.
- **English is the language on first launch**, whatever the Windows or WebView language says; a language you choose in the menu is remembered. Portuguese is European Portuguese, in the menu and for dates and numbers.
- **The other five language tables load on demand** instead of shipping in the entry chunk. The entry bundle is about 228 kB; each non-English table is fetched the first time it is used.
- **Accessibility work**: `lifetime-tools`, `starter-profiles` and the Before & After panel now have axe-clean suites, and the heading outline that a screen-reader user would have felt was repaired.
- **Every release gate now runs on every push.** TypeScript, ESLint, Prettier, the translation and design-token and public-count gates, the frontend component suite with its coverage ratchet, the backend suite and the Rust suite, plus the site build and its SEO gate as their own job. Previously the model suites and the component tests were reachable only through `npm run check`, which the release workflow runs on tags, so a regression could sit on `master` until release day.

## Verification

- Frontend: `tsc --noEmit`, ESLint, Prettier, the design-token, translation coverage, translation quality and public-count gates, and 23 test files / 326 tests all pass.
- The website build and its SEO gate are part of CI, as are the backend unit tests.
- Rust: `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, `cargo test` and the isolated native-policy suites run on the Windows CI runner. See "Known gaps" below for what was and was not verified locally.

## Known gaps

Stated plainly rather than left to be discovered after download:

- **The binaries in this release are not code-signed.** Authenticode signing identifies the publisher; without it Windows SmartScreen may warn on first run, and the publisher will not read as Aurelio Avila. A signed release needs the publisher certificate loaded through its configured provider, applied during Tauri bundling so the executable metadata is final before the signature.
- **Automatic updates are not enabled in this build.** The updater configuration still points at the upstream project's release endpoint and public key. A fork has two options and no third one: keep both, in which case installed clients keep updating from upstream and never from this repository, or publish its own key pair, which stops updates for every client on the old key. That is an owner's decision, recorded in `RELEASING.md`, and it is not something this release decides.
- **No packaged-build smoke test has been run.** The split chunks build and the asset protocol is not exercised in CI. Opening every section once in a real install is still the outstanding manual check, and it needs a packaged build on a Windows machine.

## Trust wording

Authenticode establishes publisher identity and file integrity. Tauri signatures protect updater packages. Neither is Microsoft endorsement, a performance guarantee, or a promise that SmartScreen will never warn.
