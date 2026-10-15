WinCraft 2.0.0 is the major generation release of the non-destructive Windows performance and privacy platform. The catalogue is expanded to 150 controls across Windows 11 and Windows 10, with SvcHost process consolidation, telemetry autologger session teardowns, 40 allowlisted background scheduled tasks, Tier-3 safety consent gates, and evidence/effect metadata.

## What changed in 2.0.0

- **150 verified controls, 100% free.** Expanded from the previous catalogue: SvcHost process consolidation (`SvcHostSplitThresholdInKB`), NTFS 8.3 short name and last access timestamp disablement, 5 ETW Autologger session teardowns (`AutoLogger-Diagtrack-Listener`, `SQMLogger`, `AITEventLog`, `DiagLog`, `WiFiSession`), and background service startup management for `WerSvc`, `MapsBroker`, and `lfsvc`.
- **40 allowlisted bloat scheduled tasks:** Expanded from CEIP uploaders to full Application Experience, Autochk, Disk Diagnostic, Maps, and Edge Update background task management in the startup manager.
- **Evidence & effect calibration:** Every tweak displays empirical evidence (`Measured`, `Modest`, `Neutral`), taking effect indicator (`Immediate`, `Sign-out`, `Restart`, `Reboot`), and documented risk factors.
- **Tier-3 consent modal & execution gate:** Explicit consent required before executing potentially irreversible or machine-wide settings; consent records persisted in `%APPDATA%\WinCraft\barebone_consent.json`.
- **Pre-flight System Restore Point verification:** Integrates native `SRSetRestorePointW` before elevated operations with non-blocking graceful fallback.
- **Full 6-locale translation parity:** 100% key parity across English, Italian, German, Spanish, French, and European Portuguese (1,769 keys per locale).

## Verification

- Frontend: `tsc --noEmit`, ESLint, Prettier, design tokens (128 baseline held), i18n key parity and quality audits, and 28 Vitest files / 369 tests all pass.
- Backend & Site: `npm test --prefix backend` passes 194 unit tests; `npm run build --prefix site` verifies 19 prerendered routes, 36 font subsets, and 47 hydrated reveals.
- Rust: `cargo test` passes 552 unit tests; `check:native-policy` executes 19 isolated native test suites.

## Known gaps

- **The binaries in this release are not code-signed.** Authenticode signing identifies the publisher; without it Windows SmartScreen may warn on first run. Unsigned binaries do not affect functionality or reversibility.
- **Automatic updates are paused for this fork build.** Updater endpoints and minisign keys are configured for independent distribution.

## Trust wording

Authenticode establishes publisher identity and file integrity. Tauri signatures protect updater packages. Neither is Microsoft endorsement, a performance guarantee, or a promise that SmartScreen will never warn.
