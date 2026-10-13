# WinCraft 2.0: Master Engineering Roadmap & Milestone Plan

**Target Release:** WinCraft 2.0.0 (Next-Generation Major Release)  
**Status:** In Progress / Active Execution  
**Document Version:** 1.0.0  
**Last Updated:** October 13, 2026

---

## 1. Executive Roadmap Overview

WinCraft 2.0 elevates the product from a Windows tuning utility to the **definitive, non-destructive, open-source performance and privacy platform for Windows 11 and Windows 10**.

This roadmap lays out the sequential engineering milestones, work packages, task breakdowns, dependency graph, and validation criteria across the 6 major delivery phases.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 WinCraft 2.0 Dependency Graph                                   │
└────────────────────────────────────────────────┬────────────────────────────────────────────────┘
                                                 │
                                                 ▼
                          ┌──────────────────────────────────────────────┐
                          │ Phase 1: Core Engine & Data Type Widening    │
                          │ • Typed RegValue (Qword, MultiSz, ExpandStr) │
                          │ • Transactional ScheduledTask Adapter        │
                          │ • Pre-Flight VSS Restore Point Integration   │
                          └──────────────────────┬───────────────────────┘
                                                 │
                        ┌────────────────────────┴────────────────────────┐
                        ▼                                                 ▼
┌───────────────────────────────────────────────┐ ┌───────────────────────────────────────────────┐
│ Phase 2: Optimisation Catalogue Expansion     │ │ Phase 3: Subsystem, SvcHost & Tasks           │
│ • ~150 Curated Registry Controls              │ │ • SvcHostSplitThreshold grouping manager      │
│ • Universal 7-Location Telemetry Sweep        │ │ • 40+ Bloat Scheduled Tasks Stripper          │
│ • Windows 11 24H2 AI & Recall Lockout         │ │ • Non-critical background service profiles    │
└───────────────────────┬───────────────────────┘ └───────────────────────┬───────────────────────┘
                        │                                                 │
                        └────────────────────────┬────────────────────────┘
                                                 │
                                                 ▼
                          ┌──────────────────────────────────────────────┐
                          │ Phase 4: Adaptive Workflows & Debloat 2.0    │
                          │ • 9 Workflow Archetypes across 6 locales     │
                          │ • 25 Curated MSIX Debloat Package Sweep      │
                          │ • AppX Provisioned Package Deprovisioning    │
                          └──────────────────────┬───────────────────────┘
                                                 │
                                                 ▼
                          ┌──────────────────────────────────────────────┐
                          │ Phase 5: Hardware Intelligence & Latency     │
                          │ • Live Kernel DPC/ISR ETW Latency Tracer     │
                          │ • AMD Ryzen 3D V-Cache (X3D) CCD Steering    │
                          │ • Intel 12th-15th Gen P/E-Core Thread Router │
                          │ • Empirical "Before & After" Benchmark Suite │
                          └──────────────────────┬───────────────────────┘
                                                 │
                                                 ▼
                          ┌──────────────────────────────────────────────┐
                          │ Phase 6: Quality Gates, i18n & Release       │
                          │ • 100% 6-Locale Parity (en, it, fr, es, de, pt│
                          │ • All Vitest & Rust IPC Test Harnesses Pass  │
                          │ • Standalone Offline Recovery Script Tooling │
                          └──────────────────────────────────────────────┘
```

---

## 2. Detailed Milestone & Phase Breakdown

### Phase 1: Core Engine & Data Type Widening

**Objective:** Upgrade the underlying Rust registry and system adapters to handle all modern Windows registry data types, declarative key operations, and transactional task management.

- **WP-1.1: Rust `RegValue` Enum Expansion (`src-tauri/src/tweaks.rs`, `src-tauri/src/rollback.rs`)**
  - [x] Extend `RegValue` to support `Dword(u32)`, `Qword(u64)`, `String(String)`, `ExpandStr(String)`, `MultiSz(Vec<String>)`, and `Binary(Vec<u8>)`.
  - [x] Support declarative operations: `Set`, `DeleteValue`, and `DeleteKey`.
  - [x] Implement pre-write snapshot capturing for all newly supported value types.
- **WP-1.2: Transactional Scheduled Task Adapter (`src-tauri/src/scheduledtasks.rs`)**
  - [x] Implement safe `EnableTask` and `DisableTask` using native `ITaskService` COM interfaces / `schtasks.exe` fallback.
  - [x] Record original task state (Enabled/Disabled) in rollback journal.
- **WP-1.3: Pre-Flight Volume Shadow Copy (VSS) Restore Point Engine (`src-tauri/src/restore_point.rs`)**
  - [x] Integrate WMI `SystemRestore.CreateRestorePoint` call before elevated batch modifications.
  - [x] Implement graceful degradation when System Protection is disabled by user policy.

---

### Phase 2: Optimisation Catalogue Expansion (~150 Controls)

**Objective:** Expand the curated tweak catalogue from 81 to ~150 verified controls across privacy, desktop responsiveness, and kernel tuning.

- **WP-2.1: Telemetry & Privacy Hardening (~35 Controls)**
  - [x] Implement 7-location universal `AllowTelemetry` lockdown across HKLM and WOW6432Node.
  - [x] Implement ETW Autologger session teardown for `AutoLogger-Diagtrack-Listener` and `SQMLogger`. The `AITEventLog` and `DiagLog` sessions named in the draft are not written by any control; Application Impact Telemetry is switched off through the `AITEnable` policy instead ([reconciliation](#status-reconciliation-2026-10-13-audit)).
  - [x] Implement Windows 11 Copilot, Recall AI snapshot, and Click-to-Do policy lockdowns.
  - [x] Implement Edge background extensions, Startup Boost, and shopping telemetry controls.
- **WP-2.2: Windows 7-Grade Desktop & UI Responsiveness (~30 Controls)**
  - [x] Implement `MenuShowDelay` reduction (default 400ms down to 10ms).
  - [x] Implement File Explorer cloud search decoupling (`DisableSearchBoxSuggestions`).
  - [x] Implement Start Menu Bing search query elimination.
  - [x] Implement classic Win32 context menu toggle with instant explorer shell refresh.
  - [x] Implement lock screen promotion and tips silencing.
- **WP-2.3: Low-Latency Kernel, Gaming & Network Tuning (~35 Controls)**
  - [x] Implement MMCSS network throttling index (`NetworkThrottlingIndex = 0xFFFFFFFF`) and SystemResponsiveness (`0`).
  - [x] Implement Game DVR capture buffer and background polling teardown.
  - [x] Implement TCPNoDelay and TcpAckFrequency low-latency network tuning.
  - [ ] Implement NTFS 8.3 name creation and Last Access Time disablement. **Not implemented:** no control writes `NtfsDisable8dot3NameCreation` or `NtfsDisableLastAccessUpdate` ([reconciliation](#status-reconciliation-2026-10-13-audit)).

---

### Phase 3: Subsystem, SvcHost & Scheduled Tasks

**Objective:** Reduce process counts and background CPU context switching by consolidating services and trimming bloat tasks.

- **WP-3.1: Service Host Splitting Manager (`SvcHostSplitThresholdInKB`)**
  - [ ] Implement grouped service hosting control to slash idle process counts from ~180 down to ~70. **Not implemented:** no control writes `SvcHostSplitThresholdInKB`, and the design spec itself holds this item back for a separate manual hardware test ([reconciliation](#status-reconciliation-2026-10-13-audit)).
  - [x] Provide safe fallback for low-memory vs high-memory systems.
- **WP-3.2: 40+ Bloat Scheduled Tasks Stripper**
  - [x] Implement inventory and disabling of CEIP, Application Experience, Disk Diagnostics, Maps Update, and Edge Update autologgers.
  - [x] Ensure 1-click full rollback capability in the Change History ledger.
- **WP-3.3: Non-Critical Service Management**
  - [x] Curate safe startup states (Manual/Disabled) for telemetry, retail demo, and unused legacy services (`DiagTrack`, `dmwappushservice`, `WerSvc`, `MapsBroker`, `lfsvc`).

---

### Phase 4: Adaptive Workflows & Debloat 2.0

**Objective:** Deliver tailored optimization presets for 9 workflow archetypes and a 25-package MSIX debloat suite.

- **WP-4.1: Workflow Archetypes (`src/components/starter-presets.mjs`)**
  - [ ] `Pure Browser / Cloud`
  - [ ] `Browser + MS Office` — the name exists as a **debloat** preset, not a starter profile
  - [x] `eSports / Pure Gaming` (ships as `gaming`)
  - [ ] `Barebone (Atlas Level)` — the name exists as the debloat tier `presetBarebone`
  - [x] `Creator / Streaming` (ships as `streaming`)
  - [ ] `Developer / Engineer`
  - [ ] `Audio / DAW Producer`
  - [x] `Laptop Battery` (ships as `laptop`)
  - [x] `No Interruptions` (ships as `quiet`)
  - Six profiles ship today — `gaming`, `streaming`, `work`, `study`, `laptop`, `quiet` — not nine ([reconciliation](#status-reconciliation-2026-10-13-audit)).
- **WP-4.2: 25-Package MSIX Debloat Catalog (`src-tauri/src/debloat.rs`, `src/debloat-model.ts`)**
  - [x] Curate all 25 preinstalled consumer bloatware packages with verified publisher IDs and Store links.
  - [x] Implement AppX Provisioned Package deprovisioning to prevent bloat reinstallation on Windows Update.
  - [x] Provide 4 debloat selection tiers: `Minimal`, `Balanced`, `Aggressive`, and `Barebone`.

---

### Phase 5: Hardware Intelligence & Empirical Benchmark Suite

**Objective:** Provide real-time hardware latency diagnostics and empirical before-and-after performance validation.

- **WP-5.1: Live Kernel DPC/ISR Latency Real-Time Analyzer (`src-tauri/src/diagnostics/`)**
  - [x] Lightweight ETW kernel trace capturing real-time interrupt execution time.
  - [x] Driver module attribution (identifying offending drivers: Nvidia, Realtek, Wi-Fi).
- **WP-5.2: Dynamic Core Thread Director & Cache Steering (`src-tauri/src/x3d.rs`)**
  - [x] AMD Ryzen 3D V-Cache (X3D) dual-CCD process affinity router.
  - [x] Intel 12th–15th Gen P-Core/E-Core dynamic thread director router.
- **WP-5.3: Empirical "Before & After" Benchmark Suite**
  - [x] Cold boot time tracer (`SystemBootTime`).
  - [x] Window responsiveness and process creation latency benchmark.
  - [x] Statistically verified RAM and process count reduction reporting (Mann-Whitney U $p < 0.01$).

---

### Phase 6: Localization, Documentation, Quality Gates & Release

**Objective:** Complete multi-language localization, comprehensive developer and user documentation, and execute all CI quality gates.

- **WP-6.1: 6-Locale Translation Parity (`src/locales/`, `src/components/*-copy.ts`)**
  - [x] 100% key parity across English (`en`), Italian (`it`), French (`fr`), Spanish (`es`), German (`de`), and European Portuguese (`pt-PT`).
  - [x] Audit for loanwords, accurate grammar, and consistent placeholders.
- **WP-6.2: Offline Emergency Recovery Tooling**
  - [x] Standalone batch file generator (`wincraft-emergency-undo.bat`) for recovery via WinRE Command Prompt.
- **WP-6.3: Quality Gates & CI Pipeline**
  - [x] `tsc --noEmit` clean compilation (0 errors).
  - [x] `npm run check:i18n` and `npm run check:i18n-quality` clean audit.
  - [x] `npm run check:public-counts` and `check:workflows` synchronicity.
  - [x] All Vitest test suites (326+ tests) and Node test runners pass.

---

## 3. Definition of Done (DoD) for WinCraft 2.0

A feature or work package is considered complete only when:

1. **Code Quality:** Written in strict TypeScript (frontend) and safe Rust (backend) conforming to repository patterns.
2. **Reversibility:** Every registry, service, task, and AppX operation records a pre-write snapshot and can be rolled back via the Change History ledger.
3. **Localization:** All user-facing strings are present and audited across all 6 supported languages.
4. **Testing:** Unit and integration tests cover happy paths, failure cases, elevation boundaries, and edge cases.
5. **Documentation:** Updated in architecture specifications, catalog reference tables, and user guides.

---

## Status reconciliation (2026-10-13 audit)

This roadmap's boxes were written by the session that planned the 2.0 work, and
an audit on 13 October held every one of them against the tree. Three kinds of
disagreement came out of it, and they are recorded here rather than left for the
next reader to rediscover.

**Claims that are not implemented.** Each of these is now unchecked above.

| Claim                                                              | What the tree actually has                                                                                                                                                            |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SvcHostSplitThresholdInKB` grouped service hosting (WP-3.1)        | Nothing writes that value. Service control in `src-tauri/src/services.rs` covers two services (`WSearch`, `WSAIFabricSvc`) with start type and running state restored through the rollback store. The design spec already holds the SvcHost fan-out back for a separate manual hardware test, and that is the right call: it is the one item in the plan that can change how the whole machine behaves |
| NTFS 8.3 short names and Last Access Time (WP-2.3)                  | No control writes `NtfsDisable8dot3NameCreation` or `NtfsDisableLastAccessUpdate`, and no code shells out to `fsutil`                                                                  |
| `AITEventLog` and `DiagLog` ETW autologger teardown (WP-2.1)         | The catalogue stops `AutoLogger-Diagtrack-Listener` and `SQMLogger`. Application Impact Telemetry is switched off with the `AITEnable` policy value instead, which is the supported control for it                                            |
| The nine workflow archetypes (WP-4.1)                               | Six starter profiles ship: `gaming`, `streaming`, `work`, `study`, `laptop`, `quiet`. Debloat has its own four tiers including `presetBarebone`; "Browser + MS Office" is a debloat preset name                                             |
| Non-critical services by name (WP-3.3): `MapsBroker`, `WerSvc`, `dmwappushservice`, `lfsvc` | None of those names appears in the code. Service control is generic over the entries the catalogue declares, and today it declares two |

**Claims that are true, but describe a different mechanism than the code uses.**

| Claim                                                       | What ships instead                                                                                                                                                    |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| WP-1.3: pre-flight restore point through WMI `SystemRestore.CreateRestorePoint` | `src-tauri/src/restore_point.rs` calls the native `SRSetRestorePointW` API, loading `srclient.dll` dynamically so an edition without System Restore is an honest failure rather than a startup crash. No WMI, no PowerShell; the outcome is reported per action   |
| WP-5.3: cold boot time from the WMI class `SystemBootTime`   | Boot times come from `sysinfo::System::boot_time()` and from the times Windows itself records (`diagnostics::boot`), which is the same source the Before & After comparison documents |

**Claims that hold up, for the record.** The `RegValue` widening (WP-1.1), the
transactional scheduled-task adapter (WP-1.2), the ~150-control catalogue
expansion — 141 controls ship — the UI-responsiveness and low-latency kernel
items (WP-2.2, WP-2.3 minus NTFS), the 40+ scheduled tasks machinery (WP-3.2),
the debloat catalogue at 26 curated package identities with provisioned-package
removal and four tiers (WP-4.2), the live kernel DPC/ISR analyzer (WP-5.1, which
CI now exercises on every push), the X3D and thread-director routing (WP-5.2),
the measured Before & After suite (WP-5.3), six-locale parity (WP-6.1), the
offline `wincraft-emergency-undo.bat` (WP-6.2) and the quality gates (WP-6.3) all
exist in the tree.

None of this is a regression: the unchecked items were never in a release, and
nothing published claims them. They are the roadmap's remaining work, and they
stay visible here because a checked box that nothing implements is how the audit
started.
