WinCraft 2.0.0 is the major generation release of the non-destructive Windows performance and privacy platform. The catalogue is expanded to 163 controls across Windows 11 and Windows 10, with SvcHost process consolidation, telemetry autologger session teardowns, reversible Windows Update restart protection, bounded deferrals and a standalone driver-offer policy, 40 allowlisted background scheduled tasks, Tier-3 safety consent gates, and evidence/effect metadata.

## What changed in 2.0.0

- **163 controls, 100% free.** Expanded from the previous catalogue: SvcHost process consolidation (`SvcHostSplitThresholdInKB`), NTFS 8.3 short name and last access timestamp disablement, 5 ETW Autologger session teardowns (`AutoLogger-Diagtrack-Listener`, `SQMLogger`, `AITEventLog`, `DiagLog`, `WiFiSession`), and background service startup management for `WerSvc`, `MapsBroker`, and `lfsvc`.
- **Scheduled Windows Update restarts are opt-in to defer:** A reversible Pro-or-higher policy prevents automatic scheduled restarts while a user is signed in. Downloads and installation continue; security updates that need a restart remain pending, so the app tells users to restart promptly.
- **Bounded Windows Update deferrals:** Reversible Pro-or-higher policies delay quality updates by 7 days and feature updates by 30 days. The quality delay also delays security fixes; monthly quality/security updates continue during feature deferral. These are not a pause, update disablement or version pin.
- **Windows Update driver-offer preference:** A reversible Pro-or-higher policy can exclude standalone driver-classified offers from the normal quality-update cycle. Drivers bundled into security/critical updates or installed during feature updates may still arrive; users must manage standalone drivers themselves. This is not a performance tweak.
- **40 allowlisted bloat scheduled tasks:** Expanded from CEIP uploaders to full Application Experience, Autochk, Disk Diagnostic, Maps, and Edge Update background task management in the startup manager.
- **Evidence & effect calibration:** Every tweak displays empirical evidence (`Measured`, `Modest`, `Neutral`), taking effect indicator (`Immediate`, `Sign-out`, `Restart`, `Reboot`), and documented risk factors.
- **Tier-3 consent modal & execution gate:** Explicit consent required before executing potentially irreversible or machine-wide settings; consent records persisted in `%APPDATA%\WinCraft\barebone_consent.json`.
- **Pre-flight System Restore Point verification:** Integrates native `SRSetRestorePointW` before elevated operations with non-blocking graceful fallback.
- **Full 6-locale translation parity:** 100% key parity across English, Italian, German, Spanish, French, and European Portuguese (1,812 keys per locale).

## Verification status for this working tree

- Frontend: **404 tests across 31 files** pass. `npm run build`, lint, formatting, i18n parity and quality (1,812 keys × 6 languages), public counts (163 controls), and no-new-privileges (163 permissions) pass.
- The site production build and SEO checks pass. All four Windows Update controls are represented in the data-driven catalogue and the VM matrix, with their trade-offs localized. This verifies app data and copy only: the VM matrix has not been run, so Windows policy behavior is still unverified.
- Rust and Windows-native validation are outstanding in this environment: `cargo`, `rustc`, `rustfmt`, and `pwsh` are unavailable. Earlier Rust test counts do not validate the current working tree.

## Known gaps

- **The binaries in this release are not code-signed.** Authenticode signing identifies the publisher; without it Windows SmartScreen may warn on first run. Unsigned binaries do not affect functionality or reversibility.
- **Automatic updates are paused for this fork build.** Updater endpoints and minisign keys are configured for independent distribution.

## Trust wording

Authenticode establishes publisher identity and file integrity. Tauri signatures protect updater packages. Neither is Microsoft endorsement, a performance guarantee, or a promise that SmartScreen will never warn.
