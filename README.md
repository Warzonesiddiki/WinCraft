<p align="center">
  <img src="src-tauri/icons/128x128@2x.png" width="112" alt="WinCraft logo">
</p>

<h1 align="center">WinCraft — free Windows debloat, optimizer and tuning tool</h1>

<p align="center"><strong>Tune Windows with every change in plain sight — and nothing held back.</strong><br>141 controls for Windows 11 and Windows 10: debloat, optimize, turn tracking off and tune for gaming, with restore tools for supported settings. Free and open source, no account required.</p>

<p align="center">
  <a href="#reviews-and-distribution"><img src="https://img.shields.io/badge/Total_downloads-120k%2B-2E7D32?style=for-the-badge" alt="120,000+ total downloads across distribution channels"></a>
  <a href="https://www.softpedia.com/get/Tweak/System-Tweak/Avila-PC-Tweaker.shtml"><img src="https://img.shields.io/badge/Softpedia-5%2F5%20%7C%2092%20votes-0078D4?style=for-the-badge" alt="Softpedia user rating: 5 out of 5 from 92 votes"></a>
  <a href="https://www.majorgeeks.com/files/details/pc_tweaker.html"><img src="https://img.shields.io/badge/MajorGeeks-5%2F5%20%7C%20129%20votes-C48B28?style=for-the-badge" alt="MajorGeeks user rating: 5 out of 5 from 129 votes"></a>
</p>

<p align="center">
  <a href="https://github.com/Warzonesiddiki/WinCraft/releases"><img src="https://img.shields.io/github/v/release/Warzonesiddiki/WinCraft" alt="Latest release"></a>
  <a href="https://github.com/microsoft/winget-pkgs/tree/master/manifests/a/Warzonesiddiki/PCTweaker"><img src="https://img.shields.io/winget/v/Warzonesiddiki.WinCraft?label=WinGet&color=0078D4" alt="Latest version available in WinGet"></a>
  <a href="https://community.chocolatey.org/packages/pc-tweaker"><img src="https://img.shields.io/chocolatey/v/pc-tweaker?label=Chocolatey&color=80B5E3" alt="Latest approved version in Chocolatey"></a>
  <a href="https://github.com/Warzonesiddiki/WinCraft/releases"><img src="https://img.shields.io/github/downloads/Warzonesiddiki/WinCraft/total?label=GitHub%20asset%20downloads" alt="GitHub release asset download events"></a>
  <img src="https://img.shields.io/badge/platform-Windows%2010%2F11%20x64-0078D4" alt="Windows 10 and 11 x64">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-2E7D32" alt="MIT License"></a>
  <a href="#zero-compromises"><img src="https://img.shields.io/badge/every_feature-free-2E7D32" alt="Every feature is free"></a>
</p>

**[Download for Windows](https://github.com/Warzonesiddiki/WinCraft/releases/latest/download/PCTweaker-Setup.exe)** · **[Microsoft Store](https://apps.microsoft.com/detail/9nh3c6dt1g87)** · [Chocolatey](https://community.chocolatey.org/packages/pc-tweaker) · [Website](https://wincraft.app/) · [Support](https://wincraft.app/support/) · [Release notes](CHANGELOG.md)

<p align="center"><a href="#zero-compromises">Zero compromises</a> · <a href="#find-your-task">Find your task</a> · <a href="#what-you-can-do">Features</a> · <a href="#what-changes-on-your-system">What changes</a> · <a href="#frequently-asked-questions">FAQ</a> · <a href="#whats-new-in-118">What's new</a> · <a href="#download-integrity-and-code-signing">Code signing</a> · <a href="#build-from-source">Build from source</a></p>

<p align="center"><img src="docs/screenshots/pc-tweaker-1.16-overview.png" alt="WinCraft 1.16 Overview in the default Graphite Ember theme, showing live CPU, memory and applied settings" width="85%"></p>

If you searched for how to **debloat Windows 11**, how to **remove bloatware** from Windows 10, the best **free Windows optimizer**, how to **turn off telemetry in Windows**, how to **reduce input lag** for gaming, or a **Windows tweaking tool that shows what it changes before it changes it** — this page is that answer, with the trade-offs written down. WinCraft is a native Windows 10/11 x64 app that reads the value a setting has now, shows the value it would write, records the original first, and puts it back on request. It is free and open source under the MIT license: all 141 controls, nothing withheld, no account needed.

**Start with one task:** review a setting, read its trade-offs, apply it if appropriate, and use its restore control when supported. See [what changes on your system](#what-changes-on-your-system) before tuning, or jump straight to [the task you came for](#find-your-task).

## Zero compromises

Most Windows "optimizers" ask you to trade something away: a paywall in the middle of the feature you came for, an offer in the installer, a background service reporting back, a change you cannot undo, or an FPS number nobody measured. WinCraft does not make those trades, and every claim below is checkable in this repository.

- **Every feature is free, permanently.** All 141 controls, every panel, every tool, in this version and the next: no subscription, no licence key, no expiring trial. The desktop app has no licence check left to run, and its Plans & pricing page states the one plan there is. The build fails if public copy ever splits the catalog into paid and free again.
- **No account required.** Tuning, scanning, cleanup, gaming profiles and reports work signed out. An account is optional, for the account-based features: support, ratings, the newsletter, and the licence of the separate WinCraft Uninstaller product.
- **Nothing bundled, nothing paid to be there.** The installer installs WinCraft and nothing else: no ads, no sponsored entries in the Debloat list, no offer or discount screen. Three cards inside the app introduce tools from the same publisher — the WinCraft Uninstaller, Tweaky Driver and Redaxa — each of which opens its page only when you click it, with a campaign or referral tag on the link so the publisher can see WinCraft sent you.
- **No telemetry by default.** Monitoring, scans, history and reports are read and kept on this PC. Anonymous error reporting is off unless you switch it on yourself, and there are no advertising trackers or behavioral analytics in the app or on the website. See [PRIVACY.md](PRIVACY.md).
- **Every change is reversible, and the undo is shown before the write.** Supported tweaks keep the previous value, appear in Change history with the registry values before and after, and restore individually, by session, or all at once. An application that fails partway is rolled back on the spot.
- **Nothing is written without you seeing exactly what it writes.** Each control states the registry path, the value now and the value to be set, plus the privileges and Windows edition it needs.
- **Unsupported is reported, never faked.** If this Windows build or edition cannot honor a control, it says "Not available on this PC" instead of writing something Windows will silently put back.
- **No number we cannot stand behind.** There is no published FPS, latency or temperature claim to take on faith: the [performance register](#performance-evidence) lists what is measured and, just as plainly, what is not established. Before & After exists so you can measure this machine instead.
- **Open source under the MIT license.** Rust and Tauri on the desktop, React and TypeScript in the interface. [Build it from source](#build-from-source) and read the code that writes your registry before it runs.
- **Easy to leave.** Restore what you applied, quit from the tray icon, uninstall like any other Windows app: no retention offer and no survey gate.

<p align="center">
  <a href="#quick-install-powershell"><img src="https://img.shields.io/badge/Quick_Launch-PowerShell-0078D4?style=for-the-badge&logo=powershell" alt="Quick launch via PowerShell"></a>
  <a href="#safe-download-via-winget"><img src="https://img.shields.io/badge/Safe_download-via_Winget-1793D1?style=for-the-badge" alt="Safe download via Winget"></a>
  <a href="https://wincraft.app/#tip"><img src="https://img.shields.io/badge/%E2%98%95_Buy_me_a_coffee-Support_development-FF5500?style=for-the-badge&labelColor=1c1c1c" alt="Buy me a coffee — support WinCraft development"></a>
</p>

## Quick Install (PowerShell)

Launch or install WinCraft immediately with a single PowerShell command:

```powershell
irm https://raw.githubusercontent.com/Warzonesiddiki/WinCraft/master/install.ps1 | iex
```

## Safe download via Winget

Download an installer from an official channel above, or use Windows Package Manager:

```powershell
winget install --id Warzonesiddiki.WinCraft --exact
```

To check for a package update:

```powershell
winget upgrade --id Warzonesiddiki.WinCraft --exact
```

Package catalogs can lag behind a release. Check the release version before installing. Windows 10/11 x64 is the current binary target; individual features depend on the Windows build, edition, drivers and available hardware. App compatibility does not extend Microsoft's support lifecycle for your operating system.

## Closing and reopening WinCraft

Closing the window keeps WinCraft running in the Windows notification area. Click its icon to reopen it, or right-click and choose **Exit WinCraft** to quit. To make closing the window quit instead, clear **Keep running in the background** in the icon's menu. Windows may place the icon in its hidden-icons panel.

## What's new in 1.18

- **Before & After is a measured comparison.** Measure, apply your changes, measure again. Each timed test runs at least seven times and reports its median and spread; a difference is called only when the two series are clearly apart (exact rank test, p < 0.01), at least 5% apart and in the same direction. Otherwise it says there is no meaningful change.
- **Change history is a timeline** by day and session, with the registry values before and after, filters, search, CSV/JSON export, PDF print, and undo for one change, a whole session or everything still in effect.
- **Debloat now says how each app is really used** — when its data last changed, whether it starts with Windows, how much memory it holds — covering 25 curated bloatware apps (matching AtlasOS, ReviOS and Tiny11 debloat targets including Cortana, Maps, Quick Assist, Tips, Power Automate, 3D Viewer, and Paint 3D), with Minimal, Balanced, Aggressive and Barebone selections that only stage candidates in preview before removal. A selection can be saved as a file and loaded on another PC.
- **Nine starter profiles:** Gaming, Streaming, Work, Study, Laptop, No interruptions, Barebone (Atlas OS level), Browser Only and Browser + MS Office, using only reversible per-user switches, with nothing preselected.
- **Fifteen new controls since 1.17**, including the Windows AI layer: Click to Do, the Windows AI Components Host service, and the AI features in Microsoft Edge, Paint and Notepad — plus Fast Startup, Storage Sense, End task in the taskbar menu, the drag tray, Widgets, File Explorer's opening folder, the Start Recommended section, blocking automatic manufacturer apps, tips and suggestions, and Game Bar captures. The catalog is 141 controls.
- **Every card states what it needs** — user or machine scope, administrator rights, Windows version and edition — and reports "Not available on this PC" when it does not apply. Every tweak has a "What this changes, exactly" panel listing each value as it is now and as it will be set.
- **PC Health is a live dashboard:** processor load per core, memory, disk, network, graphics load, temperature, fan and video memory on NVIDIA cards, and "What's using resources" grouped by app, over 1 or 5 minutes.
- **Scan runs 13 checks** and can be paused, resumed or ended early; a partial result names the checks that did not run instead of passing them.
- **Turbo Boost shows measured numbers** — processor load smoothed over about three seconds, clock speeds, the power plan's minimum processor state and the processes using the most — plus a fixed 3-second workload to compare work done in each mode.

See the [changelog](CHANGELOG.md) for every release.

## Find your task

If you came from a search, this is the map: the phrase you used, and where it lives in the app. Nothing here is a promise of a number — each entry is a control or a reading you can inspect before you use it.

| What you are trying to do                                                                                           | Where it is      | What you get                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Debloat Windows 11 or Windows 10, remove bloatware                                                                  | Debloat          | Remove optional Windows apps for your account after reviewing the exact packages, with removal history and Microsoft Store links to reinstall                                                  |
| Turn off Windows telemetry, the advertising ID, activity history, tips and suggestions                              | Privacy          | Supported Windows advertising, tracking and diagnostic settings, each reversible, plus an optional password breach lookup                                                                      |
| Remove or quiet the Windows AI features: Click to Do, the AI Components Host, and the AI in Edge, Paint and Notepad | Privacy          | Five controls over the Windows AI layer, each stating the policy it sets and how it is undone                                                                                                  |
| Find out what is slowing this PC down right now                                                                     | PC Health        | A live dashboard: processor load per core, memory, disk read and write, network, graphics load, temperature, fan and video memory on NVIDIA cards, and "What's using resources" grouped by app |
| Speed up Windows startup                                                                                            | Scan and Startup | Startup entries and scheduled tasks with what each one is and what Windows does with it, and 13 checks that keep recommended and optional changes apart                                        |
| Fix stutter, DPC latency or audio dropouts                                                                          | Hardware         | A 5 to 30 second kernel trace that measures DPC and ISR routines and names the driver behind each long one                                                                                     |
| Play with lower, steadier latency                                                                                   | Gaming           | Game Sessions with optional core steering for AMD X3D and Intel hybrid processors, a before/after network check, and the gaming settings Windows exposes                                       |
| Measure whether a change actually helped                                                                            | PC Health        | Before & After: each timed test runs at least seven times, and a difference is reported only when the two series are clearly apart                                                             |
| Undo what a tweaking tool did                                                                                       | Change history   | A timeline by day and session with the registry values before and after, filters, search, CSV/JSON export, and undo by change, by session, or all at once                                      |
| Reclaim disk space                                                                                                  | Maintenance      | Temp cleanup to the Recycle Bin, third-party cache cleanup, and duplicate and large-file searches you can stop                                                                                 |
| Run sfc /scannow and DISM without the command line                                                                  | Maintenance      | Guided repair, integrity and component-cleanup jobs with live progress and an honest ETA                                                                                                       |
| Update drivers                                                                                                      | Hardware         | Driver updates through Windows Update, with the source and the reboot requirement shown                                                                                                        |
| Make the taskbar, Widgets, File Explorer and Start behave                                                           | UI               | File extensions, taskbar options, appearance and supported Windows preferences, each reversible                                                                                                |
| Run Windows tweaks without a black-box script                                                                       | This repository  | The same controls as an open-source app with tests and build gates: MIT licensed, every write recorded                                                                                         |

## What you can do

| Area        | Controls and tools                                                                                                                                         |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gaming      | Game Sessions with optional core steering, supported gaming settings, hardware scheduling options, X3D placement controls and a before/after network check |
| Performance | Power configuration, startup controls and foreground scheduling settings                                                                                   |
| Hardware    | Available sensor readings, a DPC/ISR latency trace that names the responsible driver, supported thermal profiles and driver updates through Windows Update |
| Debloat     | Optional Windows apps removed for the current account only, verified by publisher, with removal history and reinstall links                                |
| Privacy     | Supported Windows advertising, tracking and diagnostic settings; optional password breach lookup                                                           |
| Maintenance | Integrity checks, guided repair, storage analysis and cleanup with operation-specific recovery limits                                                      |
| Interface   | File extensions, taskbar options, appearance and supported Windows preferences                                                                             |

Read the effect and trade-offs before applying a setting. A disabled tweak is not evidence of a fault, and a higher configuration score is not a measured performance gain.

### Ready-to-use profiles

**Nine starter profiles ship with every install: Gaming, Streaming, Work, Study, Laptop, No interruptions, Barebone (Atlas OS level), Browser Only and Browser + MS Office.** Open Profiles, choose one, and review or customize the selection before anything is applied. Nothing is selected or applied until you ask; a control this PC's Windows does not support is shown but never applied. Each profile uses reversible, per-user switches only, and adds its settings without undoing your other tweaks. Results depend on your hardware and workload; no FPS gain is promised.

- **Browser Only:** Strips background apps, search suggestions, and taskbar widgets so maximum RAM and CPU are reserved for browser tabs and web applications.
- **Browser + MS Office:** Workstation setup with immediate folder loading, visible file extensions, snappy menus, and silenced telemetry surveys for seamless document editing and email workflows.
- **Barebone (Atlas OS 0.5.2 level):** Strips background app execution, Windows recommendations, search suggestions, telemetry feedback, transparency, and animation delays for an ultra-lean footprint and lowest desktop latency while keeping all modifications 100% reversible.

### Native power controls

The catalog contains **141 controls**. The five power-policy controls change only mains-power policy in the selected Windows plan. They record the original plan and value before writing, verify the result, and leave battery policy unchanged.

| Control                            | Purpose and limits                                                                                                              |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| CPU energy-performance preference  | Favors performance on systems with autonomous CPPC support; power use and heat can increase.                                    |
| USB selective-suspend diagnosis    | Investigates wake or disconnect problems. Windows recommends leaving selective suspend enabled normally; restore after testing. |
| PCIe link power management         | Disables ASPM for troubleshooting devices affected by link transitions; idle power use can increase.                            |
| Short-thread scheduling preference | Prefers performant cores on CPUs with multiple efficiency classes; does not impose fixed affinity.                              |
| Long-thread scheduling preference  | Prefers performant cores for longer work on compatible hybrid CPUs; other cores remain available.                               |

These controls use Windows power APIs. Unsupported hybrid settings are refused before a system write. No FPS, DPC-latency or micro-stutter improvement is claimed without a workload-specific measurement.

Restoration writes the previous effective AC value back to the original plan. If that value was inherited, it becomes an explicit plan value after restoration; later changes to Windows defaults will not automatically replace it. WinCraft does not change protected registry permissions or reset unrelated plan settings to remove that override.

## What changes on your system

WinCraft can change registry values, power settings, services, startup entries and selected network settings. Other tools interact with files, Windows repair utilities, drivers or supported hardware controls. Administrator access is requested for operations that require it.

| Operation                                      | Recovery scope                                                                                                             |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Supported setting tweaks                       | Previous values are stored for individual restore and Restore All. Check each operation's result.                          |
| Cleanup sent to the Recycle Bin                | Recoverable while the files remain in the bin. This does not free their occupied space until emptied.                      |
| Third-party cache cleanup                      | Deletes selected caches permanently. Applications may need to rebuild them; shader rebuilding can cause temporary stutter. |
| Selective cookie cleanup                       | Copies the database before changing it; restore follows the cleaner's instructions.                                        |
| DISM/SFC, driver updates and hardware controls | Separate recovery procedures and limits; these are not covered by a universal registry rollback guarantee.                 |

**Restore All is not a Windows system image or a recovery guarantee.** Keep normal backups for data you cannot replace. Settings that reduce security, including disabling Memory Integrity/VBS, have material trade-offs; inspect the disclosure before considering them.

## Performance evidence

There is no universal FPS, micro-stutter or DPC-latency improvement. Results depend on the workload and starting configuration. A settings count or health score is not a benchmark.

The following compact benchmark register distinguishes measured results from missing evidence:

| Test                       | Metric                                                     | Verified comparative result |
| -------------------------- | ---------------------------------------------------------- | --------------------------- |
| Repeatable game replay     | Mean FPS, 1% low, p99 frame time, stutter-event count      | Not established             |
| CPU benchmark              | Repeated single- and multi-thread scores                   | Not established             |
| DirectX graphics benchmark | Graphics score, frame-time distribution                    | Not established             |
| Driver latency trace       | DPC/ISR durations and module attribution                   | Not established             |
| App overhead               | CPU time, working set, wakeups, baseline versus monitoring | Not established             |

Third-party pages, including ours, have shown larger figures than these. Where a frame-time trace is drawn rather than captured, it is a schematic; treat any single demonstration as specific to its setup until the test conditions and the repeat runs are published.

What WinCraft gives you instead is a measurement you can run yourself: **Before & After** on PC Health records each timed test at least seven times, reports the median and the spread, and calls a difference meaningful only when the two series are statistically apart, at least 5% apart and moving in the same direction. Otherwise it says there is no meaningful change, which is the honest answer most tuning tools avoid.

For useful comparisons, keep the game build, scene, settings, drivers, power source and capture method fixed. Warm caches, alternate baseline/tuned runs, retain all valid runs and publish raw data. Separate security-reducing configurations from normal recommendations. Report regressions and unchanged results alongside gains.

## Free for Everyone

WinCraft is completely free and open source under the MIT license. All 141 controls, every tool and every panel — no subscription, no paywall, no licence key, and no account required. Download it and start optimizing.

Every capability that used to be an extra is part of the same free app today:

- All system tweaks and optimizations
- Advanced gaming and privacy tools
- Disk cleanup, defragmentation and system repair
- Driver updates and diagnostics
- Game Sessions and monitoring profiles
- Zero-Trace memory purge and secure file shredder
- All future updates included

Existing supporters who previously purchased a licence — thank you for making this possible. Your support helped build a tool that can now reach everyone, and the entitlements on your account are exactly as they were.

## Frequently asked questions

### Is WinCraft really free?

Yes, permanently, under the MIT license. Every one of the 141 controls is unlocked for every user, there is no tier to buy, and the desktop app no longer checks a licence at all. You can also read and build the source yourself.

### Is it safe to debloat and tweak Windows with it?

Every control shows the exact values it will write before writing them, keeps the original values first, and can be undone individually or all at once from Change history. Third-party cache cleanup and shredded files are the exceptions, and the app says so where you use them. Nothing runs unless you click it.

### Which Windows versions are supported?

Windows 10 and Windows 11 on x64. Individual controls depend on your Windows build, edition, drivers and hardware; where a control does not apply, it says "Not available on this PC" instead of applying anyway. Administrator rights are requested only for the operations that need them.

### Does it remove bloatware for good?

It removes the optional apps you select for the current user account, verified by publisher identity, and records each removal in a timeline. Reinstalling is a normal Microsoft Store action, and the app links the Store page it removed. Parts of Windows itself are not touched.

### Does WinCraft collect data or phone home?

No telemetry. Monitoring, scans, history and reports stay local, and anonymous error reporting is off until you turn it on. The only outbound traffic is what a feature needs: the account call for an account you created, the update check, and the two-tweak connection check described in [PRIVACY.md](PRIVACY.md).

### Will it raise my FPS?

Nobody can promise that, and this project does not. Some settings help on some hardware and workloads, some change nothing, and the app gives you Before & After to find out on this machine instead of a marketing number. The [performance register](#performance-evidence) states plainly which comparative results are not established.

### Can I undo everything?

Yes. Supported tweaks keep their previous values, appear in Change history with the values before and after, and restore individually, by session, or all at once after a confirmation that lists what goes back. Restore first, then uninstall — uninstalling does not silently put settings back. For offline recovery outside Windows or inside the Windows Recovery Environment (WinRE) Command Prompt, run `wincraft-emergency-undo.bat` to restore standard system defaults.

### How is this different from a paid optimizer suite?

By what it refuses to do: a subscription in the middle of a feature, installer offers, background reporting, unverifiable speed claims, and locked "premium" buttons. It is also open source, so the claims on this page are checkable rather than asserted.

## Download integrity and code signing

[Version-specific signing inventory and verification guide](https://github.com/Warzonesiddiki/.github/blob/master/CODE_SIGNING.md)

**Verify the release you download.** The [latest release](https://github.com/Warzonesiddiki/WinCraft/releases/latest) is the download entry point; the version-specific inventory above records signing evidence. For an official Windows build, verify a valid Authenticode signature identifying **Aurelio Avila** and a trusted timestamp on the exact application and installer. A verification recorded for an older release does not establish the status of a newer file.

Windows Authenticode and Tauri update signatures have different roles. Authenticode identifies the Windows publisher and detects changes after signing. Tauri's update signature verifies update packages.

Older releases, including v1.8.0, may be unsigned. Their `.sig` update files do not establish Windows Authenticode signing. Check the exact version and the file's Digital Signatures tab.

To inspect a downloaded installer in PowerShell:

```powershell
Get-AuthenticodeSignature -LiteralPath .\PCTweaker-Setup.exe |
    Select-Object Status, StatusMessage, SignerCertificate, TimeStamperCertificate
Get-FileHash -LiteralPath .\PCTweaker-Setup.exe -Algorithm SHA256
```

A valid signature does not guarantee the absence of SmartScreen prompts. Microsoft evaluates file and publisher reputation separately. See [Microsoft's SmartScreen guidance](https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/smartscreen-reputation). Use an official distribution channel and verify the publisher when prompted.

## Reviews and distribution

**120,000+ total downloads** estimated across the Microsoft Store, WinGet and dozens of download sites, as of October 2026. Most of that total is the Microsoft Store, which publishes no public figure; the live GitHub badge covers GitHub release assets only, a small share of it.

User ratings checked October 7, 2026. Existing feedback remains available at its original source:

- [Softpedia](https://www.softpedia.com/get/Tweak/System-Tweak/Avila-PC-Tweaker.shtml): user rating **5.0/5 from 92 votes**; editorial review **4.5/5**.
- [MajorGeeks](https://www.majorgeeks.com/files/details/pc_tweaker.html): user rating **5/5 from 129 votes**; listing and reader reviews.

The GitHub download badge counts release-asset requests, including assets used for updates. It does not count unique people, unique installations or every distribution channel. Third-party listings may describe older releases; this repository's [LICENSE](LICENSE) is the authoritative source for licensing terms.

## Build from source

Prerequisites: Node.js 22 as used by CI, npm, stable Rust installed with [rustup](https://rustup.rs/), Windows Visual Studio Build Tools with **Desktop development with C++**, a Windows SDK, and Microsoft Edge WebView2. See [Tauri's platform prerequisites](https://v2.tauri.app/start/prerequisites/).

```powershell
git clone https://github.com/Warzonesiddiki/WinCraft.git
cd WinCraft
npm ci
npm run tauri dev
```

Run the frontend and translation checks:

```powershell
npm run build
npm run lint
npm run format:check
npm run check:i18n
npm run check:i18n-quality
npm run check:native-policy
```

**Run the complete Rust suite and full check in a disposable Windows VM with a snapshot.** The catalogue policy tests now avoid the Windows tweak adapters. Other existing tests still exercise real file operations and protected-path guards; these are not a replacement for an isolated integration environment. A temporary journal directory alone does not isolate Windows. The focused IPC, rollback-store, lifetime-tool and game-session tests use signed fixtures, a mock runtime, temporary stores or fake operations.

Inside the disposable VM:

```powershell
npm run check
```

Build installers:

```powershell
npm run tauri build
```

Artifacts are written under `src-tauri/target/release/bundle/`. A development build does not acquire an official publisher identity or update-signing key. Release signing is configured separately; follow [RELEASING.md](RELEASING.md), treating Authenticode and update signing as separate verification steps. Never distribute a verification build as an official signed release.

The account and payment backend is in [`backend/`](backend/):

```powershell
cd backend
npm ci
npm test
```

Backend integration tests need a separate configured test environment. Production smoke scripts can create external state and are not part of an ordinary local source check.

The website is in [`site/`](site/): run `npm ci` and `npm run build` from that directory to produce its prerendered pages.

## Report a problem

Use [support](https://wincraft.app/support/) or email [support@wincraft.app](mailto:support@wincraft.app) for billing or private diagnostics. For a reproducible software bug, open a [GitHub issue](https://github.com/Warzonesiddiki/WinCraft/issues) with the app version, Windows build, hardware, selected tweak, steps, expected behavior and actual outcome. Remove tokens, email addresses, licence files and private paths from public attachments.

## Source availability and license

Tauri 2 and Rust · React and TypeScript · Express, PostgreSQL and Stripe.

WinCraft is free and open source under the **MIT license**: use it, modify it and redistribute it, including commercially. See [LICENSE](LICENSE), [PRIVACY.md](PRIVACY.md) and [TERMS.md](TERMS.md).

Everything the app can do is available to everyone: every tweak, every tool, no account, no subscription, no feature gate. Saved-profile comparison and portable tuning reports are part of the app, and a control that once required a licence is simply a control now.
