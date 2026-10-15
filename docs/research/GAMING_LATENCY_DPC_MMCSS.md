# Gaming Latency, DPC Spikes, MMCSS, and Kernel Scheduling: Architecture, Research, and Implementation Specifications for WinCraft

**Document Version:** 1.0.0  
**Target Architecture:** Windows 10 (20H2+) & Windows 11 (21H2, 22H2, 23H2, 24H2)  
**Target Repository:** `WinCraft` (`src-tauri` / Rust Core & React UI)  
**Author:** WinCraft Core Systems & Performance Research  
**Status:** Approved Technical Reference & Implementation Specification  

---

## 1. Executive Summary & Core Engineering Principles

Modern competitive gaming demands low, deterministic end-to-end latency. Total system latency is the sum of input collection, OS kernel scheduling, driver DPC/ISR processing, render queueing, compositing, and display scanout:

$$\text{Latency}_{\text{total}} = T_{\text{input}} + T_{\text{kernel/DPC}} + T_{\text{game-sim}} + T_{\text{render-queue}} + T_{\text{display-scanout}}$$

Custom stripped gaming distributions (e.g., AtlasOS, ReviOS, KernelOS) achieve measurable reductions in latency jitter and frame-time variance. However, they frequently apply folklore registry settings, disable critical security mitigations (VBS, HVCI) indiscriminately, break Windows Update, and provide **zero rollback capability**.

### WinCraft Guiding Principles
1. **Reversibility Invariant:** Every system modification must be snapshotted prior to mutation, backed by a persistent journal (`RollbackStore`), and cleanly reversible without requiring OS reinstallation.
2. **Empirical Grounding:** Distinguish between actual kernel mechanisms that reduce jitter (e.g., MMCSS network throttling disabling, power throttling bypass, sleep quantization reduction) and pure placebo myths (e.g., `SystemResponsiveness = 0`, `GPU Priority` in MMCSS, global HPET disabling).
3. **Fail-Closed Safety:** Refuse writes when target prerequisites (privileges, hardware capabilities, OS build) are not met.

---

## 2. Kernel Scheduling & Win32PrioritySeparation

### 2.1 The 6-Bit Bitmask Architecture
The Windows NT kernel scheduler allocates execution time in **quantums**. A quantum is an integer multiple of clock timer ticks (by default, 3 ticks on client SKUs, where 1 tick $\approx 10\text{--}15.625\text{ ms}$ depending on timer resolution; 6 ticks on server SKUs).

Thread quantum allocation is controlled machine-wide by the registry DWORD:
`HKLM\SYSTEM\CurrentControlSet\Control\PriorityControl\Win32PrioritySeparation`

The value is a 6-bit bitmask structured as three 2-bit fields ($\text{AABBCC}_2$):

```
 Bit:   5     4     3     2     1     0
      [ Q-Length ] [ Q-Type ] [ FG-Boost ]
         (AA)         (BB)        (CC)
```

| Bit Pair | Field Name | Binary Value | Meaning & Kernel Behavior |
| :--- | :--- | :--- | :--- |
| **Bits 4–5 (AA)** | **Quantum Length** | `00` or `11` | Default for OS SKU (Short on Client, Long on Server). |
| | | `01` | **Long Quantums:** Threads run for extended intervals (e.g., 36–120 ms). Optimizes overall server throughput; increases UI/game preemption latency. |
| | | `10` | **Short Quantums:** Threads run for brief intervals (e.g., 18–36 ms). Scheduler recalculates priorities frequently; minimizes interactive latency. |
| **Bits 2–3 (BB)** | **Quantum Type** | `00` or `11` | Default for OS SKU (Variable on Client, Fixed on Server). |
| | | `01` | **Variable Quantums:** The foreground process can receive a longer quantum than background processes, scaled by bits 0–1. |
| | | `10` | **Fixed Quantums:** All processes receive identical quantum durations regardless of foreground status. Prevents thread quantum stretching. |
| **Bits 0–1 (CC)** | **Foreground Boost** | `00` | **1:1 Ratio:** No boost. Foreground and background threads receive identical CPU allocation. |
| | | `01` | **2:1 Ratio:** Foreground threads receive twice the quantum duration of background threads. |
| | | `10` | **3:1 Ratio:** Foreground threads receive three times the quantum duration of background threads. |
| | | `11` | Reserved (historically treated as 3:1). |

---

### 2.2 Deep Dive: Candidate Values Comparison

```
+------------+---------+-------------+--------------+--------------+---------------------------------------+
| Hex (Dec)  | Binary  | Length (AA) | Type (BB)    | Boost (CC)   | System Profile & Behavioral Outcome   |
+------------+---------+-------------+--------------+--------------+---------------------------------------+
| 0x02 (2)   | 000010  | Default(00) | Default(00)  | 3:1 (10)     | Windows Client Out-of-Box Default     |
| 0x26 (38)  | 100110  | Short (10)  | Variable(01) | 3:1 (10)     | Desktop "Adjust for Best Performance" |
| 0x28 (40)  | 101000  | Short (10)  | Fixed (10)   | None (00)    | E-Sports Competitive (Jitter Control) |
| 0x2A (42)  | 101010  | Short (10)  | Fixed (10)   | Max (10)     | Custom Hybrid (Fixed Quantum + Boost) |
| 0x16 (22)  | 010110  | Long (01)   | Variable(01) | 3:1 (10)     | Throughput Focused / Creator Mode     |
| 0x18 (24)  | 011000  | Long (01)   | Fixed (10)   | None (00)    | Windows Server Default (Services)     |
+------------+---------+-------------+--------------+--------------+---------------------------------------+
```

#### Detailed Breakdown:
- **`0x02` (Client Default):** Relies on implicit client SKU defaults (`Short` + `Variable` + `Boost 2`). Functionally identical to `0x26`.
- **`0x26` (AtlasOS, ReviOS Standard):** Explicitly enforces Short, Variable, 3:1 Foreground Boost. When the user sets *"Adjust for best performance of: Programs"* in `sysdm.cpl` (Performance Options), Windows writes `0x26`. Foreground gaming threads get 36 clock ticks vs 12 clock ticks for background processes.
- **`0x28` (Competitive Gaming / Low Jitter Favorite):** Enforces Short, Fixed quantums with no boost. Under heavy multitasking (e.g., Discord, OBS, browser in background), variable quantums can cause scheduling delays if background threads take priority bursts. `0x28` guarantees uniform time-slicing across all active threads, reducing standard deviation of frame delivery times on high-core-count CPUs (8+ physical cores).
- **`0x18` (Server Default):** Enforces Long, Fixed quantums with no boost. When set to *"Adjust for best performance of: Background services"*, Windows writes `0x18`. Threads hold cores longer before context switching, maximizing L1/L2 cache hit rates and throughput at the expense of interactive latency.

---

## 3. MMCSS (Multimedia Class Scheduler Service)

### 3.1 Kernel Architecture of MMCSS (`mmcss.sys`)
The Multimedia Class Scheduler Service coordinates thread priorities to ensure time-sensitive multimedia and gaming threads receive guaranteed CPU execution cycles without starving low-priority system tasks.

When an application registers a thread using the Win32 API:
```c
HANDLE hTask = AvSetMmThreadCharacteristicsW(L"Games", &taskIndex);
```
`mmcss.sys` intercepts the request and dynamically promotes the thread into the multimedia scheduling priority band:

| MMCSS Category | Dynamic Thread Priority Range | Target Workload |
| :--- | :--- | :--- |
| **High** | 23 – 26 | Pro Audio, Real-time DAW buffers, Low-latency audio engines |
| **Medium** | 16 – 22 | Foreground interactive multimedia applications & registered games |
| **Low** | 8 – 15 | Background media processing tasks |
| **Depleted** | 1 – 7 | Multimedia threads that exhausted their allocated CPU cycle budget |

---

### 3.2 Registry Configuration & Demystifying the Myths
Registry Location:  
`HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile`

#### 1. `SystemResponsiveness` (DWORD)
- **Documented Purpose:** Defines the percentage of CPU execution cycles reserved for background and non-multimedia tasks to prevent complete system starvation.
- **The 0% Myth Exposed:** Custom OS guides frequently claim setting `SystemResponsiveness = 0` allocates 100% of CPU time to games.
  - **Kernel Reality (Microsoft Docs & Kernel Disassembly):** `mmcss.sys` validates and clamps this parameter:
    $$\text{If } \text{Value} < 10 \text{ or } \text{Value} > 100 \implies \text{Value is clamped to } 20$$
    *Setting `SystemResponsiveness = 0` results in a fallback to the default 20% reservation!*
  - **Optimal Implementation:** Set `SystemResponsiveness = 10` (Decimal 10). This allocates **90%** of CPU cycles to MMCSS-registered tasks while reserving 10% for non-multimedia tasks, avoiding the clamp fallback.

#### 2. `NetworkThrottlingIndex` (DWORD)
- **Documented Purpose:** By default (`0x0000000A` / 10), Windows throttles non-multimedia network processing to 10 packets per millisecond (approx. 10,000 packets/sec) whenever an MMCSS thread is running to protect CPU time for audio/video rendering.
- **Gaming Impact:** If a gamer plays an online multiplayer game while running Discord, Spotify, or in-game voice chat (which register with MMCSS), Windows throttles incoming and outgoing TCP/UDP network packet processing, resulting in artificial packet drops, ping spikes, and input lag.
- **Optimal Implementation:** Set `NetworkThrottlingIndex = 0xFFFFFFFF` (`4294967295`). This **completely disables network throttling**, allowing unrestricted wire-speed packet processing regardless of multimedia activity.

#### 3. `NoLazyMode` (DWORD)
- Setting `NoLazyMode = 1` prevents MMCSS from entering a lazy scheduling state during low-activity transitions.

---

### 3.3 Task Profile Dissection (`Tasks\Games`)
Registry Location:  
`HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games`

| Value Name | Type | Value (Atlas/Revi) | WinCraft Optimal | Kernel Reality & Analysis |
| :--- | :--- | :--- | :--- | :--- |
| `Affinity` | REG_DWORD | `0` | `0` | `0` indicates all logical processors are eligible. |
| `Background Only` | REG_SZ | `"False"` | `"False"` | Ensures MMCSS treats the task as foreground-active. |
| `Clock Rate` | REG_DWORD | `0x00002710` (10000) | `0x00002710` | Requested timer tick rate in 100ns units ($10000 \times 100\text{ns} = 1.0\text{ ms}$). Removed in Win7+ to save power, but parsed by MMCSS. |
| `GPU Priority` | REG_DWORD | `8` | `8` | **Placebo Note:** WDDM graphics kernel does not read GPU Priority from MMCSS; GPU scheduling is governed by WDDM scheduler / HAGS. Harmless to set. |
| `Priority` | REG_DWORD | `6` | `6` | Priority class (1 to 8). When `Scheduling Category` is `"High"`, this value is clamped to 2. |
| `Scheduling Category`| REG_SZ | `"High"` | `"High"` | Maps threads to priority bracket 23–26. |
| `SFIO Priority` | REG_SZ | `"High"` | `"High"` | Scheduled File I/O priority. Prioritizes asset loading from disk. |

> **Critical Fact:** Most modern game engines (Unreal Engine 5, Unity, custom AAA engines) do **not** register their main render loop via `AvSetMmThreadCharacteristicsW("Games")`. They rely on native Win32 thread priorities (`THREAD_PRIORITY_HIGHEST` / `TIME_CRITICAL`). MMCSS tweaks primarily benefit audio threads (WASAPI, Wwise, FMOD), VoIP applications, and older games that explicitly call MMCSS.

---

## 4. Timer Resolution & Interrupt Granularity

### 4.1 Fundamentals & Hardware Clocks
The Windows NT kernel relies on periodic hardware timer interrupts (driven by the Local APIC timer or HPET) to advance system time, process thread wait queues (`Sleep()`, `WaitForSingleObject()`), and trigger DPCs.

- **Default Timer Resolution:** $15.625\text{ ms}$ (64 timer ticks per second).
- **Target Timer Resolution:** $1.0\text{ ms}$ (1000 Hz) or $0.5\text{ ms}$ ($5000 \times 100\text{ns}$, 2000 Hz).

### 4.2 API Mechanics: `timeBeginPeriod` vs `NtSetTimerResolution`
1. `timeBeginPeriod(1)`: Win32 Multimedia API (`winmm.dll`). Requests a minimum timer resolution of 1 ms.
2. `NtSetTimerResolution(5000, TRUE, &CurrentResolution)`: Undocumented native NT kernel system call (`ntdll.dll`). Requests timer resolution down to the hardware limit ($0.5\text{ ms}$ or 5000 in 100-nanosecond units).

```c
typedef NTSTATUS(NTAPI* PFN_NtSetTimerResolution)(
    ULONG DesiredResolution,
    BOOLEAN SetResolution,
    PULONG CurrentResolution
);
typedef NTSTATUS(NTAPI* PFN_NtQueryTimerResolution)(
    PULONG MinimumResolution,
    PULONG MaximumResolution,
    PULONG CurrentResolution
);
```

---

### 4.3 The Windows 10 Version 2004 Architectural Shift
Prior to Windows 10 Version 2004 (Build 19041), any application calling `timeBeginPeriod(1)` or `NtSetTimerResolution` altered the timer interrupt rate **globally** for all running processes.

In Windows 10 2004+, Microsoft overhauled the timer infrastructure to improve battery life on mobile devices:
1. `timeBeginPeriod` was scoped **per-process**. If Process A calls `timeBeginPeriod(1)`, only Process A's waits are evaluated at 1 ms; Process B's `Sleep(1)` continues to wake up on the default 15.625 ms tick.
2. **Global Override Key:** To restore global timer resolution across all processes, Microsoft introduced:
   - Key: `HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\kernel`
   - Value: `GlobalTimerResolutionRequests` (REG_DWORD) = `1`

---

### 4.4 Trade-Off Analysis

```
                              TIMER RESOLUTION TRADE-OFF
       0.5 ms (2000 Hz Interrupts)                 15.625 ms (64 Hz Interrupts)
 <------------------------------------------+------------------------------------------>
  PROS:                                     PROS:
  - Sleep(1) precision: wake error < 0.5ms  - CPU Package deep C-states (C6/C7/C8)
  - Eliminates physics/pacing micro-stutter - Maximum battery endurance (15-30% longer)
  - Deterministic frame presentation pacing - Lower idle thermals (-2 to -5°C)
  
  CONS:                                     CONS:
  - Prevents deep package sleep             - Sleep(1) can delay up to 15.6 ms!
  - 2000 context switches/sec per core      - Frame-time quantization jitter
  - Higher idle power draw (+1.5 - 3W)      - Micro-stutters in frame-capped engines
```

---

## 5. DPC & ISR Spike Elimination

### 5.1 Interrupt Architecture (DIRQL $\to$ DISPATCH_LEVEL $\to$ PASSIVE_LEVEL)
When hardware (NIC, GPU, NVMe controller) needs servicing:
1. **ISR (Interrupt Service Routine):** Executes at **DIRQL** (Device IRQL). Hardware interrupts are masked. Microsoft threshold: $\text{ISR} < 25\ \mu\text{s}$.
2. **DPC (Deferred Procedure Call):** ISR queues a DPC to execute at **`DISPATCH_LEVEL`**. At `DISPATCH_LEVEL`, the Windows thread scheduler is suspended on that CPU core. No thread can preempt the DPC.
3. **The Spike Problem:** If a buggy driver (e.g., `nvlddmkm.sys`, `ndis.sys`, `ACPI.sys`) runs a DPC for $> 500\ \mu\text{s}\text{--}2000\ \mu\text{s}$, the game's audio and render threads are starved of CPU execution. The result: audible audio dropouts (crackling) and severe frame-time spikes (stutter).

```
+--------------------------------------------------------------------------------+
| Hardware Interrupt -> ISR (DIRQL, < 25us)                                      |
|    |                                                                           |
|    v                                                                           |
| Queues DPC -> Kernel DPC Queue                                                 |
|    |                                                                           |
|    v                                                                           |
| DPC Executes at DISPATCH_LEVEL (< 100us target)                                |
|    |                                                                           |
|    +---> If DPC runs for > 500us:                                              |
|          - Windows thread scheduler is BLOCKED on this core                     |
|          - Game render loop stalls -> Frame Drop / 0.1% Low Collapse           |
|          - Audio buffer runs empty -> Audio Crackle / Glitch                   |
+--------------------------------------------------------------------------------+
```

---

### 5.2 Key Kernel Mitigations

#### 1. CPU Power Throttling & EcoQoS Bypass
Windows 11 automatically assigns background tasks and worker threads to EcoQoS / Power Throttling (`THREAD_POWER_THROTTLING_EXECUTION_SPEED`), downclocking cores or dispatching work to E-cores.
- Key: `HKLM\SYSTEM\CurrentControlSet\Control\Power\PowerThrottling`
- Value: `PowerThrottlingOff` = `1` (REG_DWORD)
- Effect: Disables OS-directed power throttling machine-wide, preventing anticheat, Discord, audio, and background game services from incurring wake-up stalls.

#### 2. Paging Executive (`DisablePagingExecutive`)
- Key: `HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management`
- Value: `DisablePagingExecutive` = `1` (REG_DWORD)
- Effect: Forces kernel-mode drivers and executive system pools to stay resident in physical RAM. Prevents page faults when drivers invoke DPCs or kernel worker threads (page faults at `DISPATCH_LEVEL` result in `IRQL_NOT_LESS_OR_EQUAL` 0x0A bugchecks).

#### 3. Core Unparking (`CPMinCores`)
Core parking puts unused CPU cores into an ultra-low power sleep state. Unparking a core requires a hardware interrupt, PLL relock, and voltage ramp taking $30\text{--}100\ \mu\text{s}$.
- Subgroup: `54533251-82be-4824-96c1-47b60b740d00` (Processor power management)
- Setting: `0cc5b647-c1df-4637-891a-dec35c318583` (`CPMinCores`)
- Command:
  ```cmd
  powercfg -setacvalueindex scheme_current 54533251-82be-4824-96c1-47b60b740d00 0cc5b647-c1df-4637-891a-dec35c318583 100
  powercfg -setactive scheme_current
  ```
- Effect: Disables CPU core parking completely on AC power; 100% of physical and logical cores remain awake and ready to accept DPC dispatches.

#### 4. Message Signaled Interrupts (MSI-X)
Legacy Line-Based Interrupts (INTx) share IRQ lines across PCI devices, requiring the kernel to poll all devices on that line. MSI-X delivers interrupts via dedicated memory writes directly to targeted CPU cores.
- Registry Location:
  `HKLM\SYSTEM\CurrentControlSet\Enum\PCI\<DeviceID>\<InstanceID>\Device Parameters\Interrupt Management\MessageSignaledInterruptProperties`
- Key Value: `MSISupported` = `1` (REG_DWORD)
- Affinity Control: Using `Interrupt Management\Affinity Policy\DevicePolicy` = `4` (`IrqPolicySpreadMessagesAcrossAllProcessors`) or setting a specific CPU affinity mask routes GPU and NIC interrupts away from Core 0 (where system timers fire).

---

### 5.3 Primary Driver Culprits & Remediation Matrix

| Driver | Subsystem | Typical Cause of DPC Spike | Remediation Strategy |
| :--- | :--- | :--- | :--- |
| `nvlddmkm.sys` | NVIDIA GPU Driver | Power state switching (P8 $\to$ P0), G-Sync handshake, HD Audio conflict | In NVIDIA Control Panel: Power management mode $\to$ *"Prefer maximum performance"*; disable NVIDIA HD Audio device if unused. |
| `dxgkrnl.sys` | DirectX Graphics Kernel | Frame presentation queue contention, flip model sync | Enable HAGS (`HwSchMode = 2`); update GPU drivers; disable legacy Game DVR hooks. |
| `ndis.sys` / `tcpip.sys` | Network Stack | Interrupt moderation, Receive Side Scaling (RSS) queue stalls, large send offload | In NIC Advanced Properties: Enable RSS, disable Energy Efficient Ethernet (EEE), disable Green Ethernet; configure `TcpAckFrequency=1` and `TCPNoDelay=1`. |
| `ACPI.sys` | Thermal / Battery Sensor | Hardware sensor polling (especially battery query loops on gaming laptops) | Disable Microsoft ACPI-Compliant Control Method Battery when running on desktop-replacement AC power. |
| `storport.sys` | NVMe Controller Driver | APST (Autonomous Power State Transitions) deep sleep latency | Configure NVMe primary power plan idle timeout to 0; disable PCIe Link State Power Management (ASPM). |

---

## 6. GPU Scheduling & Display Presentation Latency

### 6.1 Hardware-Accelerated GPU Scheduling (HAGS)
Introduced in WDDM 2.7 (Windows 10 2004):
- Key: `HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers`
- Value: `HwSchMode` = `2` (REG_DWORD) (1 = Disabled, 2 = Enabled)
- **Kernel Architecture:** Replaces the CPU-based high-priority thread in `dxgkrnl.sys` with a dedicated scheduling coprocessor built into the GPU (NVIDIA Pascal+, AMD RDNA+, Intel Arc).
- **Latency Impact:** Eliminates CPU-to-GPU context-switch overhead; reduces render queue latency by $1\text{--}3\text{ ms}$. Prerequisite for DLSS 3 Frame Generation.
- **Trade-off:** In VRAM-constrained setups (e.g., 8GB GPUs running modern games at 1440p/4K), HAGS reserves a small portion of dedicated VRAM, which can trigger paging over PCIe if VRAM is exceeded.

---

### 6.2 Game DVR & Windows Game Bar Overlays
Background recording and Game Bar overlays inject hooks into DirectX swapchains and consume VRAM buffers.

```
REGISTRY KEYS TO FULLY DISABLE GAME DVR:
1. HKLM\SOFTWARE\Policies\Microsoft\Windows\GameDVR
   - AllowGameDVR = 0 (REG_DWORD)
2. HKCU\System\GameConfigStore
   - GameDVR_Enabled = 0 (REG_DWORD)
   - GameDVR_FSEBehaviorMode = 2 (REG_DWORD)
   - GameDVR_HonorUserFSEBehaviorMode = 1 (REG_DWORD)
   - GameDVR_DXGIHonorFSEWindowsCompatible = 1 (REG_DWORD)
   - GameDVR_EFSEFeatureFlags = 0 (REG_DWORD)
3. HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\GameDVR
   - AppCaptureEnabled = 0 (REG_DWORD)
```

---

### 6.3 Fullscreen Optimizations (FSO) vs Fullscreen Exclusive (FSE)
Windows display presentation has undergone a complete architectural evolution:

```
[ Legacy BitBlt ] --------> [ Fullscreen Exclusive (FSE) ]
 (1-2 frames lag, DWM copy)     (Zero lag, black screen on Alt-Tab, breaks overlays)
                                       |
                                       v
                             [ Fullscreen Optimizations (FSO) ]
                             [ Modern Flip Model (iFlip / Direct Flip) ]
                              (Zero lag, Hardware MPO scanout, instant Alt-Tab)
```

1. **Legacy FSE:** The game takes exclusive ownership of the display controller. Bypasses DWM compositing entirely. Downside: Alt-Tab causes mode-switch latency (black screens), HDR/VRR synchronization hiccups.
2. **Modern Flip Model (`DXGI_SWAP_EFFECT_FLIP_DISCARD`):** When running borderless or FSO in modern Windows 11, DWM promotes the surface to **Independent Flip (iFlip)** or **Direct Flip** via Multi-Plane Overlays (MPO). The display controller scans out the game front buffer directly.
3. **The Global FSO Myth:** Disabling FSO globally harms modern DX12 and Vulkan games that natively use the flip model. Global FSO disablement should **only** be targeted at legacy DX9/DX11 games that utilize legacy BitBlt (`DXGI_SWAP_EFFECT_DISCARD`) and fail to enter iFlip.

---

## 7. Fact vs Myth Matrix

| Optimization | Custom OS Myth | Empirical Kernel Reality | Latency & FPS Verdict | WinCraft Default Recommendation |
| :--- | :--- | :--- | :--- | :--- |
| **`Win32PrioritySeparation = 0x26`** | "Boosts FPS by 20%+" | Default desktop client is already functionally equivalent (`0x02`). Explicitly reinforces short variable quantums. | **Zero FPS gain.** Modest stabilization under background load. | **Enabled** in Gaming Profile. |
| **`Win32PrioritySeparation = 0x28`** | "Secret competitive e-sports setting" | Sets short, fixed quantums with no boost. Prevents quantum stretching. | **Zero FPS gain.** Slightly tighter frame-time variance on 8+ core CPUs. | **Optional** in Competitive Profile. |
| **`SystemResponsiveness = 0`** | "Gives 100% CPU to games" | `mmcss.sys` clamps values $< 10$ to $20$! Setting 0 falls back to default 20%. | **Pure Placebo.** | **Do NOT use 0.** Set to `10`. |
| **`NetworkThrottlingIndex = 0xFFFFFFFF`** | "Lowers ping by 50ms" | Completely disables MMCSS network packet throttling (10 pkts/ms limit). | **Measurable.** Eliminates packet queueing & jitter when VoIP/music is playing. | **Enabled** in Gaming Profile. |
| **`GlobalTimerResolutionRequests = 1`** | "Mandatory for 0.5ms timers" | Restores global timer resolution behavior across all processes on Win10 2004+. | **Measurable.** Reduces `Sleep(1)` quantization jitter from 15.6ms to 0.5ms. | **Enabled** in Gaming Profile (AC power). |
| **Disable HPET (`useplatformclock no`)** | "Fixes all micro-stutter" | Modern systems use Invariant TSC (RDTSC). Indiscriminate BCD changes can break timer synchronization. | **High Risk.** Can degrade latency or break anticheat. | **Exclude from Catalog.** |
| **`DisablePagingExecutive = 1`** | "Keeps all system in RAM" | Keeps kernel drivers and executive pools in physical RAM; avoids paging stalls. | **Modest.** Eliminates driver page faults during heavy gaming. | **Enabled** (if system RAM $\ge 16\text{ GB}$). |
| **Disable Game DVR** | "Doubles FPS" | Stops background encoding buffer allocation and hook injection. | **Measurable.** Eliminates stutter in VRAM/CPU-bound systems. | **Enabled** in Gaming Profile. |

---

## 8. WinCraft Implementation Specifications & Rust Code Patterns

### 8.1 Typed Registry Definitions
WinCraft defines its tweaks using typed structures with rollback snapshots:

```rust
// Location: src-tauri/src/tweaks/gaming_specs.rs

use crate::tweaks::{Category, Effect, Evidence, Hive, RegValue, RegistryTweak};

pub fn latency_catalog() -> Vec<RegistryTweak> {
    vec![
        RegistryTweak {
            id: "priority_separation_gaming",
            name: "Optimized CPU Quantum Scheduling",
            description: "Configures Win32PrioritySeparation to 0x26 (Short quantums, variable length, 3:1 foreground boost).",
            category: Category::Gaming,
            hive: Hive::Hklm,
            key_path: r"SYSTEM\CurrentControlSet\Control\PriorityControl",
            value_name: "Win32PrioritySeparation",
            on_value: RegValue::Dword(0x26),
            requires_admin: true,
            requires_pro: false,
            evidence: Evidence::Modest,
            effect: Effect::Reboot,
            risk: None,
            group: Some("scheduling"),
        },
        RegistryTweak {
            id: "mmcss_system_responsiveness",
            name: "MMCSS Background CPU Allocation Limit",
            description: "Sets SystemResponsiveness to 10 (allocating 90% CPU share to MMCSS multimedia/audio tasks; avoids the kernel clamp fallback at 0).",
            category: Category::Gaming,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile",
            value_name: "SystemResponsiveness",
            on_value: RegValue::Dword(10),
            requires_admin: true,
            requires_pro: false,
            evidence: Evidence::Measured,
            effect: Effect::Reboot,
            risk: None,
            group: Some("mmcss"),
        },
        RegistryTweak {
            id: "mmcss_network_throttling_disable",
            name: "Disable MMCSS Network Packet Throttling",
            description: "Sets NetworkThrottlingIndex to 0xFFFFFFFF, preventing Windows from capping packet processing while multimedia or voice chat is active.",
            category: Category::Gaming,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile",
            value_name: "NetworkThrottlingIndex",
            on_value: RegValue::Dword(0xFFFFFFFF),
            requires_admin: true,
            requires_pro: false,
            evidence: Evidence::Measured,
            effect: Effect::Immediate,
            risk: None,
            group: Some("mmcss"),
        },
        RegistryTweak {
            id: "global_timer_resolution_enable",
            name: "Enable Global Timer Resolution Requests",
            description: "Enables GlobalTimerResolutionRequests on Windows 10 2004+ so high-resolution timer requests affect background and foreground game waits globally.",
            category: Category::Gaming,
            hive: Hive::Hklm,
            key_path: r"SYSTEM\CurrentControlSet\Control\Session Manager\kernel",
            value_name: "GlobalTimerResolutionRequests",
            on_value: RegValue::Dword(1),
            requires_admin: true,
            requires_pro: false,
            evidence: Evidence::Measured,
            effect: Effect::Reboot,
            risk: Some("Slightly higher power consumption on idle"),
            group: Some("timers"),
        },
        RegistryTweak {
            id: "power_throttling_disable",
            name: "Disable Windows EcoQoS Power Throttling",
            description: "Disables system-wide power throttling to prevent Windows from downclocking background game worker threads or anticheat services.",
            category: Category::Gaming,
            hive: Hive::Hklm,
            key_path: r"SYSTEM\CurrentControlSet\Control\Power\PowerThrottling",
            value_name: "PowerThrottlingOff",
            on_value: RegValue::Dword(1),
            requires_admin: true,
            requires_pro: false,
            evidence: Evidence::Measured,
            effect: Effect::Immediate,
            risk: Some("Reduces battery runtime on portable devices"),
            group: Some("power"),
        },
        RegistryTweak {
            id: "hardware_accelerated_gpu_scheduling",
            name: "Hardware-Accelerated GPU Scheduling (HAGS)",
            description: "Enables WDDM hardware-accelerated GPU scheduling (HwSchMode = 2), offloading graphics scheduling from the CPU kernel to the GPU coprocessor.",
            category: Category::Gaming,
            hive: Hive::Hklm,
            key_path: r"SYSTEM\CurrentControlSet\Control\GraphicsDrivers",
            value_name: "HwSchMode",
            on_value: RegValue::Dword(2),
            requires_admin: true,
            requires_pro: false,
            evidence: Evidence::Measured,
            effect: Effect::Reboot,
            risk: Some("May increase VRAM usage slightly in memory-constrained games"),
            group: Some("graphics"),
        },
    ]
}
```

---

### 8.2 Safe Transactional MMCSS Composite Module
When modifying composite structures such as `Tasks\Games`, WinCraft utilizes snapshot transactions:

```rust
// Location: src-tauri/src/tweaks/mmcss_games.rs

use crate::rollback::{RegValue, RegistrySnapshot, RollbackStore, SnapshotEntry};
use crate::tweaks::windows_impl::{hive_from_str, read_value, write_value, restore_value};

pub const TWEAK_ID: &str = "mmcss_games_full_profile";
const HIVE: &str = "HKLM";
const PATH: &str = r"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games";

#[cfg(windows)]
pub fn apply(store: &RollbackStore) -> Result<(), String> {
    let mut transaction = store.transaction()?;
    let hive = hive_from_str(HIVE);

    // Target configuration matrix
    let targets: [(&str, RegValue); 6] = [
        ("Affinity", RegValue::Dword(0)),
        ("Background Only", RegValue::Str("False".to_string())),
        ("Clock Rate", RegValue::Dword(10000)),
        ("GPU Priority", RegValue::Dword(8)),
        ("Priority", RegValue::Dword(6)),
        ("Scheduling Category", RegValue::Str("High".to_string())),
    ];

    let mut entries = Vec::new();
    for (name, hint) in &targets {
        // Read existing value; if absent, snapshot as None
        let original = read_value(hive, PATH, name, hint).map_err(|e| e.to_string())?;
        entries.push(SnapshotEntry::Registry(RegistrySnapshot {
            hive: HIVE.to_string(),
            path: PATH.to_string(),
            name: name.to_string(),
            original_value: original,
        }));
    }

    // Persist snapshot before mutating system state
    transaction
        .save_entry(TWEAK_ID, SnapshotEntry::Composite { entries })
        .map_err(|e| e.to_string())?;

    // Apply mutations
    for (name, value) in &targets {
        write_value(hive, PATH, name, value)?;
    }

    Ok(())
}

#[cfg(windows)]
pub fn rollback(store: &RollbackStore) -> Result<(), String> {
    store.restore_entry(TWEAK_ID, |entry| {
        let SnapshotEntry::Composite { entries } = entry else {
            return Err("Unexpected snapshot type for MMCSS Games".to_string());
        };

        for e in entries {
            if let SnapshotEntry::Registry(snapshot) = e {
                restore_value(&snapshot)?;
            }
        }
        Ok(())
    })
}
```

---

### 8.3 Dynamic Timer Resolution Daemon (RAII Guard Pattern)
For runtime game sessions, WinCraft implements a dynamic timer guard that requests 0.5ms resolution during active gaming and automatically restores default resolution upon exit:

```rust
// Location: src-tauri/src/diagnostics/timer_resolution.rs

use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use windows_sys::Win32::Foundation::NTSTATUS;

type NtSetTimerResolutionFn = unsafe extern "system" fn(
    desired_resolution: u32,
    set_resolution: u8,
    current_resolution: *mut u32,
) -> NTSTATUS;

type NtQueryTimerResolutionFn = unsafe extern "system" fn(
    minimum_resolution: *mut u32,
    maximum_resolution: *mut u32,
    current_resolution: *mut u32,
) -> NTSTATUS;

pub struct TimerResolutionGuard {
    active: Arc<AtomicBool>,
}

impl TimerResolutionGuard {
    /// Requests 0.5ms (5000 in 100ns units) timer resolution.
    pub fn new() -> Result<Self, String> {
        unsafe {
            let ntdll = windows_sys::Win32::System::LibraryLoader::GetModuleHandleA(
                b"ntdll.dll\0".as_ptr(),
            );
            if ntdll.is_null() {
                return Err("Failed to obtain handle to ntdll.dll".into());
            }

            let set_fn_ptr = windows_sys::Win32::System::LibraryLoader::GetProcAddress(
                ntdll,
                b"NtSetTimerResolution\0".as_ptr(),
            );
            if set_fn_ptr.is_none() {
                return Err("NtSetTimerResolution symbol not found".into());
            }

            let nt_set_timer_resolution: NtSetTimerResolutionFn =
                std::mem::transmute(set_fn_ptr.unwrap());

            let mut current: u32 = 0;
            // 5000 * 100ns = 500,000ns = 0.5ms
            let status = nt_set_timer_resolution(5000, 1, &mut current);
            if status != 0 {
                return Err(format!("NtSetTimerResolution failed with NTSTATUS: {:#X}", status));
            }

            Ok(Self {
                active: Arc::new(AtomicBool::new(true)),
            })
        }
    }
}

impl Drop for TimerResolutionGuard {
    fn drop(&mut self) {
        if self.active.swap(false, Ordering::SeqCst) {
            unsafe {
                let ntdll = windows_sys::Win32::System::LibraryLoader::GetModuleHandleA(
                    b"ntdll.dll\0".as_ptr(),
                );
                if !ntdll.is_null() {
                    let set_fn_ptr = windows_sys::Win32::System::LibraryLoader::GetProcAddress(
                        ntdll,
                        b"NtSetTimerResolution\0".as_ptr(),
                    );
                    if let Some(set_fn) = set_fn_ptr {
                        let nt_set_timer_resolution: NtSetTimerResolutionFn =
                            std::mem::transmute(set_fn);
                        let mut current: u32 = 0;
                        // Release request (set_resolution = 0)
                        nt_set_timer_resolution(5000, 0, &mut current);
                    }
                }
            }
        }
    }
}
```

---

### 8.4 Verification & Measurement Integration

To validate the real-world efficacy of applied tweaks:
1. **DPC / ISR Trace Verification:** WinCraft utilizes its built-in ETW private system logger (`src-tauri/src/diagnostics/dpc.rs`) to trace kernel events (`DPC`, `INTERRUPT`) over 5–30 second runs.
   - Assert: Driver DPC duration $\le 100\ \mu\text{s}$, ISR duration $\le 25\ \mu\text{s}$.
2. **Timer Verification:** Execute `NtQueryTimerResolution` to confirm active system timer resolution:
   - Output: `CurrentResolution` should report `5000` (or $0.5\text{ ms}$).
3. **Frame-Time Variance:** Monitor game processes using PresentMon / ETW `DXGI_Present` events to assert standard deviation reduction in frame times.

---

## 9. Conclusion & Action Plan for WinCraft

1. **Keep Reversibility Paramount:** Unlike AtlasOS and ReviOS, every single tweak documented above is integrated into WinCraft's transactional registry engine with exact rollback records.
2. **Catalog Updates:**
   - Retain `priority_separation` (0x26) as standard gaming default.
   - Update `system_responsiveness` to `10` (discard `0` due to kernel clamping).
   - Ensure `network_throttling_index` (`0xFFFFFFFF`) is grouped into the primary Gaming Profile.
   - Enforce `GlobalTimerResolutionRequests = 1` alongside runtime timer session management.
3. **Diagnostics & Proof:** Expose the DPC/ISR diagnostic results and active timer resolution directly in the WinCraft UI, empowering users to see verified hardware performance without relying on unverified gaming OS folklore.
