# WinCraft: Past Projects Knowledge Base & Optimization Synthesis

**Document Version:** 1.0.0  
**Date:** October 13, 2026  
**Scope:** Synthesis and integration of proven optimizations, registry keys, and debloat definitions from previous optimization repositories:

1. **`Warzonesiddiki/winforge`** (240 structured tweaks, operation sets, rollback schemas)
2. **`Warzonesiddiki/Win11Debloat`** (105 `.reg` files, 119 features, AI/Copilot/Recall presets)
3. **`Warzonesiddiki/Win-Debloat-Tools`** (Low-End PC performance, memory optimization, privacy hardening)

---

## 1. Inventory & Synthesis Map

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              Past Projects Synthesis Map                               │
├──────────────────────────┬──────────────────────────────────────┬──────────────────────┤
│ Source Repository        │ Key Assets Extracted                 │ Integration Target   │
├──────────────────────────┼──────────────────────────────────────┼──────────────────────┤
│ 1. WinForge              │ • 240 structured JSON tweaks         │ • Catalogue & Engine │
│                          │ • Operation & revert schema rules    │ • Rollback Store     │
│                          │ • Playbook profiles                  │ • Workflow Presets   │
├──────────────────────────┼──────────────────────────────────────┼──────────────────────┤
│ 2. Win11Debloat          │ • 105 `.reg` policy definitions      │ • Tweak Inventory    │
│                          │ • AI, Recall & Click-to-Do lockdowns │ • Privacy Hardening  │
│                          │ • Explorer & Start declutter rules   │ • UI Responsiveness  │
├──────────────────────────┼──────────────────────────────────────┼──────────────────────┤
│ 3. Win-Debloat-Tools     │ • `Optimize-LowEndPC.ps1` routines   │ • Memory & Kernel    │
│                          │ • SvcHost splitting & Ndu RAM fix    │ • Diagnostic Engine  │
│                          │ • Task scheduler bloat inventory     │ • Scheduled Tasks    │
└──────────────────────────┴──────────────────────────────────────┴──────────────────────┘
```

---

## 2. Key Optimizations Harvested

### 2.1 Low-End PC & Memory Management (`Win-Debloat-Tools`)

1. **`Ndu` High Non-Paged Pool RAM Leak Fix:**
   - Path: `HKLM\SYSTEM\ControlSet001\Services\Ndu`
   - Name: `Start` = `4` (Disabled)
   - _Impact:_ Prevents Windows Network Diagnostic Usage driver from leaking gigabytes of non-paged RAM during high network throughput.
2. **Dynamic `SvcHostSplitThresholdInKB`:**
   - Path: `HKLM\SYSTEM\CurrentControlSet\Control`
   - Name: `SvcHostSplitThresholdInKB` = `0xFFFFFFFF` (or total RAM in KB)
   - _Impact:_ Reduces idle background process count from ~180 down to ~70 on systems with >4 GB RAM.
3. **Visual Performance Acceleration:**
   - Path: `HKCU\Control Panel\Desktop`
   - `MenuShowDelay` = `"10"`, `HungAppTimeout` = `"1000"`, `WaitToKillServiceTimeout` = `"2000"`, `AutoEndTasks` = `"1"`.

---

### 2.2 Deep Privacy & Telemetry Lockdown (`Win11Debloat` & `winforge`)

1. **Full Content Delivery Manager Teardown:**
   - `ContentDeliveryAllowed = 0`
   - `FeatureManagementEnabled = 0`
   - `SilentInstalledAppsEnabled = 0`
   - `OemPreInstalledAppsEnabled = 0`
   - `PreInstalledAppsEnabled = 0`
   - `SubscribedContent-310093Enabled = 0`, `338393Enabled = 0`, `353694Enabled = 0`, `353696Enabled = 0`, `338387Enabled = 0`, `338388Enabled = 0`, `338389Enabled = 0`
2. **AI & Modern Windows 11 Privacy Suite:**
   - Windows Recall AI Snapshots: `DisableAIDataAnalysis = 1`, `AllowRecall = 0`
   - Click to Do: `DisableClickToDo = 1`
   - Edge AI Features: `MetricsReportingEnabled = 0`, `StartupBoostEnabled = 0`, `BackgroundModeEnabled = 0`
   - Cloud Search & Web Suggestions: `BingSearchEnabled = 0`, `CortanaConsent = 0`, `AllowCloudSearch = 0`, `DisableSearchBoxSuggestions = 1`, `IsDynamicSearchBoxEnabled = 0`

---

### 2.3 Shell & Desktop Modernization (`Win11Debloat`)

1. **Explorer Clutter Removal:**
   - Hide Gallery: `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Desktop\NameSpace_36329700\{e88865ea-0e1c-4e20-9aa6-ed353b709b61}`
   - Hide Home / Quick Access sync provider notifications: `ShowSyncProviderNotifications = 0`
   - Hide duplicate removable drive entries: `HideDuplicateRemovableDrives = 1`
   - Instant classic right-click menu: `CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\InprocServer32` = `""`

---

## 3. Integration Status in WinCraft 2.0

All validated, non-destructive, and reversible tweaks from `winforge`, `Win11Debloat`, and `Win-Debloat-Tools` are now synthesized into WinCraft's master catalogue specifications and engineering roadmap.
