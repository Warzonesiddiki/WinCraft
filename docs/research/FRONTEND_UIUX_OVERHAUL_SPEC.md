# WinCraft 2.0: Frontend UI/UX Overhaul & AtlasOS 1-Click Command Deck Specification

**Document Path:** `docs/research/FRONTEND_UIUX_OVERHAUL_SPEC.md`  
**Status:** Approved Architecture Specification  
**Target Version:** WinCraft 2.0  
**Target Surface:** `src/components/`, `src/App.css`, `src/desktop-refresh.css`  

---

## 1. Executive Summary & Core Philosophy

### 1.1 The Custom-ISO Paradigm & Its Critical Flaw
Custom stripped Windows ISOs and playbook installers (*AtlasOS*, *ReviOS*, *Tiny11*) attract millions of power users and competitive gamers by delivering:
- Drastic background process reduction: dropping idle processes from ~180–220 down to ~75–85.
- Idle RAM footprint reduction: dropping memory commit from 4.5 GB to 1.4–1.8 GB.
- DPC latency optimization: eliminating frame stutter and audio buffer underruns via MMCSS priority and network throttle elimination.
- Telemetry suppression: halting continuous ETW disk writing and diagnostic background uploaders.

**The Fatal Flaws of Custom ISOs:**
1. **Destructive WinSxS Stripping:** Stripping components breaks the Windows Servicing Stack. Monthly Cumulative Updates (LCU) fail with error codes `0x800f0922` or `0x800f081f`, bricking systems.
2. **Zero Reversibility:** Custom ISO installations cannot be undone. Reverting any stripped subsystem requires a clean Windows reinstall from official media.
3. **Anti-Cheat & Security Invalidation:** Removing Core Isolation, Defender, or Hypervisor-Protected Code Integrity (HVCI) triggers bans or launch refusals in kernel-level anti-cheat platforms (Vanguard, Easy Anti-Cheat, BattlEye).

### 1.2 The WinCraft 2.0 Command Deck Solution
WinCraft 2.0 delivers the exact performance profile of stripped custom ISOs through non-destructive, atomic, 100% reversible runtime levers:
- **Zero Servicing Corruption:** No files are deleted from `%SystemRoot%` or `%SystemRoot%\WinSxS`.
- **Atomic Rollback Guarantee:** Every tweak records an exact before/after state in the transactional change ledger. A pre-flight Volume Shadow Copy (VSS) restore point is validated before system-level changes.
- **SvcHost Grouping without Dismantling:** Reclaims 80+ processes by tuning `SvcHostSplitThresholdInKB` dynamically instead of permanently disabling system services.
- **1-Click Command Deck:** Exposes immediate high-potency presets (`AtlasOS Ultra`, `ReviOS Balanced`, `Tiny11 Minimal`, `Barebone Lean`) with clear process count targets and real-time visual delta feedback.

---

## 2. Design Tokens & Glassmorphism Design System

The visual design system evolves WinCraft's "Control Room" aesthetic into a high-performance cyber/ember glassmorphism language. It maintains 100% theme resilience across all 14 built-in palettes via OKLab color-mixing.

### 2.1 Color Tokens & Luminance Steps

```css
/* ==========================================================================
   WinCraft 2.0 Design Tokens — Cyber / Ember Glassmorphism Layer
   File: src/desktop-refresh.css (and extensions to src/App.css)
   ========================================================================== */

:root {
  /* Surface Glass Steps (OKLab layered over active theme background) */
  --surface-glass-base:    color-mix(in oklab, var(--app-bg-b) 88%, transparent);
  --surface-glass-1:       color-mix(in oklab, var(--app-bg-a) 82%, transparent);
  --surface-glass-2:       color-mix(in oklab, var(--app-bg-a) 90%, white 3%);
  --surface-glass-hover:   color-mix(in oklab, var(--app-bg-a) 85%, white 6%);
  --surface-glass-active:  color-mix(in oklab, var(--app-bg-a) 78%, var(--app-accent) 8%);

  /* Hairline Borders with Specular Gradients */
  --glass-border-subtle:   color-mix(in oklab, white 10%, transparent);
  --glass-border-strong:   color-mix(in oklab, white 18%, transparent);
  --glass-border-accent:   color-mix(in oklab, var(--app-accent) 45%, transparent);
  --glass-border-cyan:     color-mix(in oklab, #00f2fe 45%, transparent);

  /* Cyber & Ember Glow Accents */
  --glow-ember:            0 0 24px -4px color-mix(in oklab, var(--app-accent) 35%, transparent);
  --glow-cyan:             0 0 24px -4px color-mix(in oklab, #00f2fe 30%, transparent);
  --glow-danger:           0 0 24px -4px color-mix(in oklab, #f87171 30%, transparent);
  --glow-success:          0 0 24px -4px color-mix(in oklab, #34d399 30%, transparent);

  /* Backdrop Blur Physics */
  --glass-backdrop-blur:   blur(16px) saturate(180%);
  --glass-modal-blur:      blur(24px) saturate(200%);

  /* Process Gauge Status Palette */
  --gauge-extreme:         #ef4444; /* >160 processes: Red/Bloated */
  --gauge-moderate:        #f59e0b; /* 120-160 processes: Amber/Suboptimal */
  --gauge-optimized:       #10b981; /* 85-119 processes: Emerald/Tuned */
  --gauge-ultra:           #00f2fe; /* <85 processes: Cyber Cyan/Atlas Extreme */
}
```

### 2.2 Glass Elevation Hierarchy

| Level | Token | CSS Backdrop / Border | Elevation Context |
| :--- | :--- | :--- | :--- |
| **L0: Deck Floor** | `--bg-app` | Solid `#121217` / theme floor | Outer container, root background |
| **L1: Glass Card** | `--surface-glass-1` | `backdrop-filter: var(--glass-backdrop-blur); border: 1px solid var(--glass-border-subtle)` | Preset cards, live telemetry widgets |
| **L2: Command Hero**| `--surface-glass-2` | Gradient background + `var(--glass-border-strong)` + `box-shadow: var(--glow-ember)` | AtlasOS Hero Deck container |
| **L3: Floating Overlay** | `--surface-glass-active` | `backdrop-filter: var(--glass-modal-blur); border: 1px solid var(--glass-border-accent)` | Reboot notification banner, confirmation modals |

---

## 3. The Overview Hero Experience: "AtlasOS & Custom-ISO Extreme Mode" Command Deck

The hero unit sits at the top of the Overview tab (`src/components/overview.tsx`), acting as the high-impact central command deck for Windows decluttering and performance parity.

### 3.1 Hero Wireframe & Visual Layout

```
+---------------------------------------------------------------------------------------------------------+
| [⚡] ATLASOS & CUSTOM-ISO EXTREME MODE                              [100% REVERSIBLE • VSS PROTECTED]     |
| Streamline Windows 11 to bare-metal efficiency. Match stripped ISO responsiveness safely.               |
+----------------------------------------------------+----------------------------------------------------+
| RUNNING PROCESSES GAUGE                            | 1-CLICK EXTREME ACTIONS                            |
|                                                    |                                                    |
|          .-''''-.                                  |  +----------------------------------------------+  |
|        .'        '.   Current: 184 Processes       |  | [⚡] APPLY ATLASOS EXTREME OPTIMIZATION      |  |
|       /   184      \  Target:   85 Processes       |  | SvcHost Grouping • Zero Telemetry • Low Latency|  |
|      |    --> 85    | Delta:   -99 Processes       |  +----------------------------------------------+  |
|       \   Target   /                               |                                                    |
|        '.        .'   Status: Unoptimized Bloat    |  +----------------------+ +---------------------+  |
|          '-....-'     [!] 99 redundant daemons     |  | [↺] RESTORE DEFAULTS | | [🗑] PURGE BLOAT   |  |
|                                                    |  | 100% Reversible Undo | | 25 Apps • 40 Tasks  |  |
|  [|||||||||||||||||..............] 85 / 184 Target |  +----------------------+ +---------------------+  |
|                                                    |                                                    |
|  CPU: 2.1%  |  RAM: 4.8 / 31.9 GiB  |  DPC: 38µs   |  Active Profile: None  |  Servicing: Intact (Safe)  |
+----------------------------------------------------+----------------------------------------------------+
```

### 3.2 Dual-Needle Real-Time Process Target Gauge

#### Architecture & Data Pipeline
1. **Handle-Free Process Enumeration:** Reads the active process count directly from kernel tables via `process_guard::processes()` using `NtQuerySystemInformation`. Zero handles are kept open, ensuring compatibility with kernel anti-cheat.
2. **Dynamic Target Calculation:**
   - Standard Win11 Clean Install: ~170–190 processes.
   - WinCraft Default Tuned: ~110–120 processes.
   - AtlasOS / Barebone Target: ~85 processes (with SvcHost consolidation enabled).
3. **Delta Metric:**
   $$\Delta_{\text{excess}} = \max(0, P_{\text{current}} - P_{\text{target}})$$
   Where $P_{\text{target}} = 85$. When $\Delta_{\text{excess}} > 0$, the gauge displays `-N Processes to Cut` with animated ember pulse.

#### SVG Radial Gauge Technical Geometry
- **ViewBox:** `0 0 240 160` (semi-circular arc from $180^\circ$ to $360^\circ$).
- **Radius:** $R = 90$, Center: $(120, 130)$.
- **Arc Track:** Circumference $C = \pi \times 90 \approx 282.7\text{px}$.
- **Background Arc:** `stroke: rgba(255, 255, 255, 0.08)`, `stroke-width: 14`.
- **Target Indicator Marker:** Located at the 85-process position ($85 / 220 \approx 38.6\%$ along arc), rendered with cyber-cyan marker dot and glowing line.
- **Current Process Arc:** Animated `stroke-dashoffset` driven by CSS transitions (`transition: stroke-dashoffset 600ms cubic-bezier(0.16, 1, 0.3, 1)`).

### 3.3 1-Click Action Button Deck

1. **Primary Action: "Apply AtlasOS Extreme Optimization"**
   - **Styling:** Primary ember-gradient button with glowing cyber borders, bold uppercase typography, pulsating micro-glow.
   - **Click Execution Sequence:**
     1. Preflight check verification (admin rights, battery status, BitLocker readiness).
     2. Pre-apply VSS System Restore Point generation (`create_restore_point("WinCraft Extreme Mode")`).
     3. Batch transaction write:
        - `svchost_split_threshold`: Sets `SvcHostSplitThresholdInKB` to `0x0200_0000` (Consolidates 80+ svchost instances into ~12 shared processes).
        - Low-latency MMCSS audio/network parameters (`NetworkThrottlingIndex=ffffffff`, `SystemResponsiveness=0`).
        - Background app throttling (`disable_background_apps`).
        - Telemetry and feedback suppression (`disable_telemetry`, `disable_feedback_requests`, `disable_bing_search`).
        - 40 bloat scheduled tasks silenced via `set_barebone_task`.
     4. Sets pending reboot flag and raises the Reboot Notification Banner.
2. **Secondary Action: "Restore Windows Defaults" (Safety Net)**
   - **Styling:** Subtle glass button with green/neutral hover state and shield icon.
   - **Guarantee:** 100% reversible. Reads historical values from the local transaction ledger (`audit.rs`) and rolls back all modified keys to Windows factory defaults.
   - Re-enables all grouped services and unpauses scheduled tasks.
3. **Tertiary Quick Actions:**
   - **"Purge All Bloatware":** Instantly queues Tier 1 & Tier 2 non-critical OEM and pre-installed AppX packages for clean removal.
   - **"Silence All Telemetry Tasks":** Instantly disables the 40 Customer Experience & Diagnostic scheduled tasks without removing system files.

---

## 4. Preset Cards Grid: 4 High-Impact Archetypes

Below the Command Deck, WinCraft presents a 4-column responsive grid featuring tailored system archetypes.

```
+-----------------------------------------------------------------------------------------------------------------+
| SELECT OPTIMIZATION ARCHETYPE                                                                                   |
+-----------------------+-----------------------+-----------------------+-----------------------------------------+
| ATLASOS ULTRA         | REVIOS BALANCED       | TINY11 MINIMAL        | BAREBONE LEAN                           |
| [⚡ EXTREME GAMING]   | [⚖️ DAILY & WORK]     | [🪶 LOW-SPEC & VM]    | [🛡️ ZERO CLOUD / PRIVATE]                |
+-----------------------+-----------------------+-----------------------+-----------------------------------------+
| Process Target: ~85   | Process Target: ~110  | Process Target: ~95   | Process Target: ~75                     |
| Latency Target: <45µs | Latency Target: <75µs | Latency Target: Normal| Latency Target: <50µs                   |
+-----------------------+-----------------------+-----------------------+-----------------------------------------+
| • SvcHost Grouping    | • Retains MS Store    | • Aggressive AppX Cut | • Full Telemetry Silence                |
| • MMCSS Latency Pipe  | • Retains Printing/BT | • Strips Pre-installs | • 0ms Menu Delays                       |
| • Game DVR Severed    | • Bing Search Silenced| • Zero Background Web | • Edge Pre-launch Killed                |
| • 40 Tasks Silenced   | • 0ms Menu Latency    | • Reduced Footprint   | • Classic Lightweight Shell             |
+-----------------------+-----------------------+-----------------------+-----------------------------------------+
| [ APPLY ULTRA PRESET ]| [ APPLY BALANCED ]    | [ APPLY MINIMAL ]     | [ APPLY BAREBONE ]                      |
| [ Inspect 48 Changes ]| [ Inspect 26 Changes ]| [ Inspect 34 Changes ]| [ Inspect 52 Changes ]                  |
+-----------------------+-----------------------+-----------------------+-----------------------------------------+
```

### 4.1 Archetype Specifications

#### 1. AtlasOS Ultra
- **Target Audience:** Competitive esports gamers, sim racers, high-refresh-rate gaming enthusiasts.
- **Key Levers:**
  - `svchost_split_threshold`: Consolidated service host processes.
  - `reduce_input_lag`: Multimedia scheduler responsiveness tuned for zero thread starvation.
  - `disable_game_dvr`: Windows background broadcast and DVR recording pipelines fully disabled.
  - Telemetry tasks: 40 diagnostic autologgers silenced.
  - Windows Core Parking / Thread scheduling hints aligned to gaming affinity.
- **Target Metrics:** ~85 processes, RAM reduction ~1.8 GiB, DPC latency <50µs.

#### 2. ReviOS Balanced
- **Target Audience:** Content creators, developers, daily productivity users needing 100% compatibility with Microsoft Office, Microsoft Store, Xbox App, and Bluetooth peripherals.
- **Key Levers:**
  - Maintains full printing subsystem (`spooler`) and Bluetooth audio drivers.
  - Silences Bing search integration in File Explorer and Start Menu.
  - Removes background telemetry uploads without touching enterprise servicing components.
  - Speeds up folder browsing and context menu opening latency.
- **Target Metrics:** ~105–115 processes, zero workflow regressions.

#### 3. Tiny11 Minimal
- **Target Audience:** Budget laptops (8 GB RAM), secondary workstations, virtual machines, handheld gaming devices (Steam Deck, ROG Ally running Windows).
- **Key Levers:**
  - Deep AppX bloat purge (preinstalled games, promotional web wrappers, Cortana, Clipchamp).
  - Background app execution fully restricted.
  - Window animation and transparency blur eliminated to reclaim VRAM and DWM overhead.
- **Target Metrics:** ~95 processes, RAM reduction ~2.2 GiB.

#### 4. Barebone Lean
- **Target Audience:** Minimalist purists, audio engineers (DAW production), benchmarking setups.
- **Key Levers:**
  - Most aggressive non-destructive profile.
  - Eliminates all telemetry autologgers, CEIP, feedback uploaders, and scheduled maintenance wakes.
  - Forces instant folder loading and removes 400ms menu animation lag (`MenuShowDelay=0`).
  - Standby list auto-purged on game launch.
- **Target Metrics:** ~75 processes, lowest possible background thread contention.

### 4.2 Card Anatomy & Interactive States

Each preset card is built with the following component structure:
1. **Header Zone:** Icon + Archetype Title + Impact Tag (`EXTREME`, `BALANCED`, `MINIMAL`, `LEAN`).
2. **Metrics Bar:** Dual-pill display showing **Target Process Count** (`~85 Procs`) and **Latency Impact** (`<50µs DPC`).
3. **Feature List:** 4 bullet points highlighting key active tweaks with tooltips explaining the technical registry/task changes.
4. **Action Footer:**
   - **Primary "Apply Preset" Button:** Triggers modal inspection or direct one-click execution with progress spinner.
   - **Secondary "Inspect Changes" Link:** Opens a glass popover showing the complete diff of affected registry keys and scheduled tasks before committing.
5. **Applied State:** When active, the card border shifts to glowing accent green/ember (`border-color: var(--color-ok)`), and the button renders as `[ ✓ Active Profile ]` with a `Revert` option.

---

## 5. Reboot Notification Banner & Modal

Certain low-level kernel optimizations—most notably `svchost_split_threshold` (`SvcHostSplitThresholdInKB`), `disable_8dot3_names`, and NTFS timestamp tweaks—require a system restart before the Windows Service Control Manager (`services.exe`) consolidates service processes into shared hosts.

### 5.1 Persistent Floating Glass Banner
When `reboot_pending` evaluates to `true` (or when SvcHost grouping is applied), a high-visibility, dismissible glass banner anchors to the top of the application viewport.

```
+---------------------------------------------------------------------------------------------------------+
| [⚠️] SYSTEM RESTART REQUIRED TO FINALIZE EXTREME OPTIMIZATION                             [X Dismiss]  |
| Process consolidation (SvcHost Grouping) takes effect upon next boot. 84 processes will be grouped.     |
| [ 🔄 Reboot Now (Instant) ]    [ ⏳ Reboot Later ]    [ 🔍 View Pending Changes ]                       |
+---------------------------------------------------------------------------------------------------------+
```

#### Banner Design Specifications
- **Position:** Pinned to top of main content pane (`sticky top-0 z-40`).
- **Styling:** Glass surface with subtle amber border glow:
  ```css
  .reboot-banner {
    background: color-mix(in oklab, #f59e0b 12%, var(--surface-glass-2));
    border: 1px solid color-mix(in oklab, #f59e0b 40%, transparent);
    backdrop-filter: var(--glass-backdrop-blur);
    border-radius: var(--radius-m);
    box-shadow: 0 4px 20px -2px rgba(245, 158, 11, 0.2);
  }
  ```
- **Actions:**
  - `Reboot Now`: Invokes the Rust backend command `invoke("reboot_now")`.
  - `Reboot Later`: Temporarily minimizes the banner into a compact status bar pill in the navigation footer.
  - `View Changes`: Opens the restart inspection modal.

### 5.2 Restart Confirmation Modal Flow
Clicking "Reboot Now" presents a safety confirmation modal to protect unsaved work:

```
+-----------------------------------------------------------------------------+
|  [🔄] Ready to Restart Your PC?                                      [ESC]  |
+-----------------------------------------------------------------------------+
|  WinCraft has prepared your system for Extreme Optimization.               |
|                                                                             |
|  Pending optimizations taking effect upon reboot:                           |
|  • SvcHost Process Grouping (SvcHostSplitThresholdInKB = 2000000h)          |
|  • 82 background service processes will merge into 12 shared hosts          |
|  • Low-latency MMCSS thread prioritization active                           |
|  • Estimated post-boot process count: 82 processes (down from 184)          |
|                                                                             |
|  [!] Please ensure all open documents and games are saved.                  |
|                                                                             |
|  +----------------------------------+  +---------------------------------+  |
|  | [🔄] RESTART NOW (3s Countdown)  |  | [ CANCEL / RESTART MANUALLY ]   |  |
|  +----------------------------------+  +---------------------------------+  |
+-----------------------------------------------------------------------------+
```

---

## 6. Frontend TypeScript Component Architecture

### 6.1 Component Hierarchy & Tree

```
src/
└── components/
    ├── CommandDeckHero.tsx         # Central Hero Container for Extreme Mode
    │   ├── ProcessTargetGauge.tsx  # SVG Real-Time Circular Arc Process Gauge
    │   ├── QuickActionBar.tsx      # 1-Click Apply / Restore / Purge Buttons
    │   └── TelemetryMetricsBar.tsx # CPU, RAM, DPC Latency live readouts
    ├── PresetGrid.tsx              # 4-Column Archetype Cards Grid
    │   ├── PresetCard.tsx          # Individual Archetype Card (Atlas, Revi, etc.)
    │   └── PresetInspectModal.tsx  # Registry & Task diff inspection drawer
    ├── RebootBanner.tsx            # Pinned Floating Glass Reboot Banner
    ├── RebootConfirmModal.tsx      # Pre-restart safety dialog & countdown
    ├── overview.tsx                # Overview Tab entry point integrating Deck
    └── overview.css                # Glassmorphic layout styling rules
```

### 6.2 Component TypeScript Interfaces

```typescript
// File: src/components/command-deck-types.ts

export type ArchetypeId = "atlas_ultra" | "revi_balanced" | "tiny11_minimal" | "barebone_lean";

export interface ArchetypePreset {
  id: ArchetypeId;
  name: string;
  badge: string;
  tagline: string;
  targetProcessCount: number;
  expectedDpcLatencyUs: number;
  expectedRamSavingsGb: number;
  description: string;
  features: string[];
  tweakIds: string[];
  bareboneTaskPaths: string[];
  requiresReboot: boolean;
}

export interface CommandDeckState {
  currentProcessCount: number | null;
  targetProcessCount: number;
  cpuPercent: number | null;
  ramUsedBytes: number | null;
  ramTotalBytes: number | null;
  dpcLatencyUs: number | null;
  isApplying: boolean;
  isRestoring: boolean;
  activePresetId: ArchetypeId | null;
  rebootPending: boolean;
}

export interface ProcessGaugeProps {
  currentCount: number | null;
  targetCount: number;
  baselineCount: number; // default ~185
  reducedMotion: boolean;
}
```

### 6.3 State Transitions & Execution Pipeline

```
[ IDLE STATE ] (Displaying ~184 processes, gauge glowing amber)
      |
      |-- User clicks [ APPLY ATLASOS EXTREME OPTIMIZATION ]
      v
[ PHASE 1: PREFLIGHT & SNAPSHOT ]
      |-- Invoke `create_restore_point` (VSS backup)
      |-- Query registry baseline values -> write to `audit.rs` ledger
      v
[ PHASE 2: ATOMIC BATCH EXECUTION ]
      |-- Invoke `apply_tweaks([svchost_split_threshold, mmcss, dvr, ...])`
      |-- Invoke `set_barebone_task(path, enabled: false)` for 40 tasks
      |-- Invoke `remove_debloat_app` for selected OEM bloat
      v
[ PHASE 3: REBOOT REQUIRED NOTICE ]
      |-- Flag `rebootNeeded = true`
      |-- Mount `RebootBanner` with glowing animation
      |-- Update gauge to projected target (85 processes) with dashed line
      v
[ PHASE 4: POST-BOOT VERIFIED STATE ]
      |-- System rebooted
      |-- Live process reading drops to ~82 processes
      |-- Gauge illuminates cyber-cyan (OPTIMIZED / ATLAS EXTREME LEVEL)
```

---

## 7. Responsive Layout & Accessibility (a11y)

### 7.1 Breakpoints & Fluid Grid Mechanics
- **Ultra-Wide ($>1440\text{px}$):**
  - Command Deck Hero: 2-column split (50% Process Gauge / 50% Quick Action Deck).
  - Presets Grid: 4 equal-width cards (`grid-template-columns: repeat(4, 1fr)`).
- **Standard Desktop ($1080\text{px} - 1440\text{px}$):**
  - Command Deck Hero: 2-column split (45% Gauge / 55% Actions).
  - Presets Grid: 2x2 grid (`grid-template-columns: repeat(2, 1fr)`).
- **Compact Window / Minimum ($900\text{px} - 1080\text{px}$):**
  - Command Deck Hero: Stacked single column (Hero Gauge on top, Quick Actions below).
  - Presets Grid: 2-column or horizontal scroll carousel.

### 7.2 Accessibility & WCAG Compliance
- **Color Contrast:** All text tokens meet WCAG AAA requirements ($>7:1$) on glass surfaces. Text labels use high-luminance white ink (`--text-primary`, 92% white mix).
- **Reduced Motion Support (`prefers-reduced-motion`):**
  - Radial gauge needle disables easing transitions; snaps immediately to new counts.
  - Pulsing ember glows and backdrop blur saturation filters are downgraded to static borders.
- **Keyboard Navigation:**
  - Full tab navigation across all preset cards (`role="radio"` in `role="radiogroup"`).
  - `Enter` / `Space` activates presets.
  - `Escape` dismisses the Reboot Notification Banner or closes inspection drawers.
- **Screen Reader Announcements:**
  - Live process counts are wrapped in `aria-live="polite"`.
  - Process reduction delta announces: *"Running processes: 184. Target: 85. 99 excess processes detected."*

---

## 8. Implementation & Verification Roadmap

| Phase | Target Deliverable | Files Modified / Created | Verification Criteria |
| :--- | :--- | :--- | :--- |
| **Phase 1** | Modern Glass Design Tokens & Surfaces | `src/App.css`, `src/desktop-refresh.css` | 14 themes tested for contrast and backdrop-filter rendering. |
| **Phase 2** | Process Target Radial Gauge Component | `src/components/ProcessTargetGauge.tsx` | Accurate handle-free process polling; smooth SVG arc animation. |
| **Phase 3** | Command Deck Hero Container | `src/components/CommandDeckHero.tsx`, `src/components/overview.tsx` | 1-Click AtlasOS optimization trigger; atomic restore point created. |
| **Phase 4** | 4-Archetype Preset Cards Grid | `src/components/PresetGrid.tsx`, `src/components/starter-presets.mjs` | Selection, preview, and batch apply working across all 4 archetypes. |
| **Phase 5** | Reboot Notification Banner & Modal | `src/components/RebootBanner.tsx`, `src/components/hardware.tsx` | Correctly triggers on SvcHost split threshold; calls `reboot_now`. |
| **Phase 6** | End-to-End Vitest & Cypress Suite | `src/components/overview.test.tsx`, `src/components/starter-profiles.test.tsx` | All 43+ UI unit tests passing; zero regressions. |

---

## 9. Conclusion: The WinCraft 2.0 Advantage

By unifying the aggressive low-overhead benefits of custom playbooks (*AtlasOS*, *ReviOS*, *Tiny11*) with enterprise-grade safety, transactional rollbacks, and a cutting-edge cyber-glassmorphic frontend, WinCraft 2.0 establishes the gold standard for modern Windows optimization. Users achieve sub-85 process counts, ultra-low DPC latency, and total telemetry silence with zero risk to Windows Update servicing or system stability.
