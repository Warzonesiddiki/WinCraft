# WinCraft Backend Optimization Engine Specification
## AtlasOS-Grade Batch Task Engine, Active ETW Teardown, Provisioned Package Deprovisioning, and SvcHost Service Grouping

**Document Identifier:** `SPEC-BACKEND-OPT-001`  
**Classification:** Technical Architecture & Code Specification  
**Target Repository:** `WinCraft` (`src-tauri/`)  
**Target Systems:** Windows 10 (21H2+) & Windows 11 (22H2, 23H2, 24H2, 25H2)  
**Status:** Approved for Implementation  

---

## 1. Executive Summary & Architectural Overview

This technical specification establishes the architecture, system APIs, data structures, and rollback state machines required to implement an AtlasOS-parity optimization engine within WinCraft's native Rust backend (`src-tauri/`).

While third-party debloaters (AtlasOS, ReviOS, Tiny11) rely on non-atomic PowerShell scripts and batch files with `-ErrorAction SilentlyContinue`, WinCraft enforces strict safety invariants:
1. **Single-UAC Elevation Protocol:** Multi-item tasks (such as batch processing 40 scheduled tasks or sweeping hundreds of service keys) execute through a single elevated child process without generating multiple UAC prompts.
2. **Deterministic Rollback Snapshots:** 100% pre-state capture with the "oldest original" invariant; changes never overwrite the baseline snapshot if re-applied.
3. **Atomic Two-Phase Commits:** System changes only commit to disk after registry, file-system, or scheduler mutations pass immediate re-read verification.
4. **Immediate In-Memory Teardown:** Registry-based Autologger disablement is augmented by Win32 Event Tracing for Windows (ETW) runtime control calls (`ControlTraceW`) so kernel trace buffers stop immediately without requiring an OS reboot.
5. **Machine-Wide Provisioned AppX Stripping:** Deprovisioning packages via dual-path WinRT / DISM execution to prevent bloatware rehydration following Windows Cumulative Updates, strictly gated as Tier 3 with explicit consent.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 WinCraft Frontend UI                                    │
│                    (React 19 / TypeScript / Vite / IPC Command Bridge)                  │
└────────────────────────────────────────┬───────────────────────────────────────────────┘
                                         │ invoke("disable_all_barebone_tasks", ...)
                                         ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                             Tauri IPC Boundary (`lib.rs`)                              │
│                      Capability Manifests & Permission Enforcers                       │
└────────────────────────────────────────┬───────────────────────────────────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 │                                               │ (requires_admin)
                 ▼                                               ▼
┌─────────────────────────────────┐             ┌────────────────────────────────────────┐
│     Unelevated Process Session  │             │        Elevated Helper Process         │
│     - Consent Verification      │             │        (--elevated-barebone-*)         │
│     - Snapshot Load & Validate  │             │  - Restore Point Creation              │
│     - Relaunch Elevated Child   │────────────►│  - Win32 Native API Mutators           │
│     - Read Back Result JSON     │             │  - XML SchTasks Verification           │
└─────────────────────────────────┘             │  - Atomic Store Commit                 │
                                                └────────────────────────────────────────┘
```

---

## 2. Batch 40 Scheduled Tasks Execution Engine

### 2.1 Allowlist Inventory & Categorization
The Barebone scheduled task inventory contains exactly 40 telemetry, diagnostic, customer experience (CEIP), error reporting, and background indexing tasks shipped in Windows under `\Microsoft\`. 

In normal operation, `src-tauri/src/scheduledtasks.rs` hides all tasks under `\Microsoft\` to prevent arbitrary OS servicing disruptions. The Barebone engine unlocks access strictly to the items in `BAREBONE_TASKS`:

| Category | Path | Impact / Functional Rationale |
|---|---|---|
| **CEIP / SQM** | `\Microsoft\Windows\Customer Experience Improvement Program\Consolidator` | Aggregates and sends telemetry metrics to Microsoft servers. |
| **CEIP / SQM** | `\Microsoft\Windows\Customer Experience Improvement Program\UsbCeip` | Collects USB device bus telemetry. |
| **CEIP / SQM** | `\Microsoft\Windows\Customer Experience Improvement Program\KernelCeipTask` | Kernel-level telemetry upload. |
| **CEIP / SQM** | `\Microsoft\Windows\Customer Experience Improvement Program\BthSQM` | Bluetooth quality metrics collection. |
| **CEIP / SQM** | `\Microsoft\Windows\Customer Experience Improvement Program\HypervisorFlightingTask` | Hyper-V flighting metrics. |
| **App Experience**| `\Microsoft\Windows\Application Experience\Microsoft Compatibility Appraiser`| Scans application binaries and telemetry for OS upgrade readiness. |
| **App Experience**| `\Microsoft\Windows\Application Experience\ProgramDataUpdater` | Gathers telemetry on program usage. |
| **App Experience**| `\Microsoft\Windows\Application Experience\StartupAppTask` | Scans startup applications. |
| **App Experience**| `\Microsoft\Windows\Application Experience\AitAgent` | Application Impact Telemetry agent. |
| **App Experience**| `\Microsoft\Windows\Application Experience\MareBackup` | Machine Appraisal and Reporting telemetry. |
| **App Experience**| `\Microsoft\Windows\Application Experience\PcaWallpaperAppDetect`| Compatibility assistant detection. |
| **Diagnostics** | `\Microsoft\Windows\Autochk\Proxy` | Telemetry proxy for disk health checks. |
| **Diagnostics** | `\Microsoft\Windows\DiskDiagnostic\Microsoft-Windows-DiskDiagnosticDataCollector` | Background disk telemetry collection. |
| **Diagnostics** | `\Microsoft\Windows\DiskDiagnostic\Microsoft-Windows-DiskDiagnosticResolver` | Disk diagnostic resolver. |
| **Diagnostics** | `\Microsoft\Windows\DiskFootprint\Diagnostics` | Disk usage telemetry. |
| **Diagnostics** | `\Microsoft\Windows\DiskFootprint\StorageSense` | Periodic storage sense triggers. |
| **Maps** | `\Microsoft\Windows\Maps\MapsUpdateTask` | Offline maps background updater. |
| **Maps** | `\Microsoft\Windows\Maps\MapsToastTask` | Offline maps notification handler. |
| **Feedback** | `\Microsoft\Windows\Feedback\Siuf\DmClient` | Customer feedback client upload. |
| **Feedback** | `\Microsoft\Windows\Feedback\Siuf\DmClientOnScenarioDownload` | Scenario-triggered feedback downloader. |
| **Edge Update** | `\Microsoft\EdgeUpdate\EdgeUpdateTaskMachineCore` | Periodic Edge updater. |
| **Edge Update** | `\Microsoft\EdgeUpdate\EdgeUpdateTaskMachineUA` | Edge User Agent updater. |
| **Diagnostics** | `\Microsoft\Windows\Diagnosis\Scheduled` | Windows diagnostic infrastructure runner. |
| **Maintenance** | `\Microsoft\Windows\Maintenance\WinSAT` | Windows System Assessment Tool benchmark runs. |
| **PI SQM** | `\Microsoft\Windows\PI\Sqm-Tasks` | Software Quality Metrics uploader. |
| **Diagnostics** | `\Microsoft\Windows\Power Efficiency Diagnostics\AnalyzeSystem`| Background power diagnostics collector. |
| **WER** | `\Microsoft\Windows\Windows Error Reporting\QueueReporting` | Windows Error Reporting queue uploader. |
| **Cloud** | `\Microsoft\Windows\CloudExperienceHost\CreateObjectTask`| OOBE cloud experience runner. |
| **Shell** | `\Microsoft\Windows\Shell\FamilySafetyMonitor` | Family safety telemetry monitor. |
| **Shell** | `\Microsoft\Windows\Shell\FamilySafetyRefreshTask` | Family safety policy sync. |
| **Media** | `\Microsoft\Windows\Windows Media Player\UpdateLibrary` | WMP legacy library scan. |
| **Media** | `\Microsoft\Windows\Windows Media Player\WMPNSSCert` | WMP network sharing cert check. |
| **Device Info** | `\Microsoft\Windows\Device Information\Device` | Device census metadata collection. |
| **Device Info** | `\Microsoft\Windows\Device Information\Device User` | Per-user device metadata collector. |
| **File History** | `\Microsoft\Windows\FileHistory\File History (maintenance mode)` | Maintenance task for File History. |
| **Language** | `\Microsoft\Windows\LanguageComponentsInstaller\Installation` | Language pack sync task. |
| **Language** | `\Microsoft\Windows\LanguageComponentsInstaller\Uninstallation` | Language cleanup task. |
| **Licensing** | `\Microsoft\Windows\License Manager\TempSignedLicenseExchange`| Temporary license exchange worker. |
| **NetTrace** | `\Microsoft\Windows\NetTrace\GatherNetworkInfo` | Network tracing diagnostic collector. |
| **Speech** | `\Microsoft\Windows\Speech\SpeechModelDownloadTask` | Speech recognition dictionary download. |

### 2.2 Data Structures & Outcomes
```rust
#[derive(serde::Serialize, serde::Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct BareboneBatchOutcome {
    pub total_allowlisted: usize,
    pub succeeded: Vec<String>,
    pub failed: Vec<(String, String)>,
    pub skipped_absent: Vec<String>,
    pub restore_point: crate::restore_point::RestorePointOutcome,
}
```

### 2.3 Elevated Batch Dispatch Protocol
Executing 40 `schtasks /change /tn ...` commands sequentially from an unelevated context would fail with `Access Denied` or spawn 40 UAC dialogs. WinCraft routes batch execution through a single elevated run:

1. **Unelevated IPC Call:** `disable_all_barebone_tasks(app)` checks consent:
   ```rust
   let dir = crate::store_for_dir(&app)?;
   crate::barebone::assert_consented(&dir, "barebone_tasks_batch")?;
   ```
2. **Elevation Routing:** If not elevated, invoke the helper:
   ```rust
   crate::elevation::run_elevated_action(
       "--elevated-barebone-tasks-batch",
       "disable",
   )?;
   ```
3. **Elevated Child Execution (`lib.rs:run_elevated_headless`):**
   - Creates a single restore point.
   - Executes `scheduledtasks::batch_disable_barebone_tasks(&store)`.
   - Serializes `BareboneBatchOutcome` to `%APPDATA%/last_barebone_batch_result.json`.
   - Exits with `0`.
4. **Parent Process Completion:** The parent reads `last_barebone_batch_result.json` and resolves the IPC Promise.

### 2.4 Transactional Batch Execution Implementation
```rust
#[cfg(windows)]
pub fn batch_disable_barebone_tasks(
    store: &crate::rollback::RollbackStore,
) -> Result<BareboneBatchOutcome, String> {
    use crate::rollback::SnapshotEntry;

    let mut succeeded = Vec::new();
    let mut failed = Vec::new();
    let mut skipped_absent = Vec::new();

    let mut transaction = store.transaction()?;

    for &task_path in crate::barebone::BAREBONE_TASKS {
        // Step 1: Probe presence without failing batch
        let enabled = match barebone_task_enabled(task_path) {
            Ok(en) => en,
            Err(_) => {
                skipped_absent.push(task_path.to_string());
                continue;
            }
        };

        // Step 2: Snapshot prior state (oldest-original invariant)
        if transaction.entry(task_path).is_none() {
            transaction.save_entry(
                task_path,
                SnapshotEntry::ScheduledTask {
                    path: task_path.to_string(),
                    previously_enabled: enabled,
                },
            )?;
        }

        // Step 3: Mutate task state
        match imp::set_enabled(task_path, false) {
            Ok(()) => {
                // Step 4: Verification re-read
                match barebone_task_enabled(task_path) {
                    Ok(false) => succeeded.push(task_path.to_string()),
                    Ok(true) => failed.push((
                        task_path.to_string(),
                        "Task remained enabled after schtasks /disable".to_string(),
                    )),
                    Err(e) => failed.push((task_path.to_string(), e)),
                }
            }
            Err(e) => failed.push((task_path.to_string(), e)),
        }
    }

    crate::audit::record(
        "barebone-tasks-batch-disable",
        &format!("{}/{} disabled", succeeded.len(), crate::barebone::BAREBONE_TASKS.len()),
        failed.is_empty(),
        if failed.is_empty() { None } else { Some(format!("{} tasks failed", failed.len())) },
    );

    Ok(BareboneBatchOutcome {
        total_allowlisted: crate::barebone::BAREBONE_TASKS.len(),
        succeeded,
        failed,
        skipped_absent,
        restore_point: crate::restore_point::RestorePointOutcome::Created,
    })
}
```

### 2.5 Batch Rollback State Machine
Rollback reverses only tasks that have valid snapshot entries in `RollbackStore`:
```rust
#[cfg(windows)]
pub fn batch_rollback_barebone_tasks(
    store: &crate::rollback::RollbackStore,
) -> Result<BareboneBatchOutcome, String> {
    use crate::rollback::SnapshotEntry;

    let mut succeeded = Vec::new();
    let mut failed = Vec::new();
    let mut skipped_absent = Vec::new();

    let mut transaction = store.transaction()?;

    for &task_path in crate::barebone::BAREBONE_TASKS {
        let entry = match transaction.entry(task_path) {
            Some(e) => e,
            None => continue, // Task was never touched by WinCraft
        };

        let SnapshotEntry::ScheduledTask { previously_enabled, .. } = entry else {
            failed.push((task_path.to_string(), "Corrupt snapshot type".to_string()));
            continue;
        };

        // Check if task exists on current OS
        if barebone_task_enabled(task_path).is_err() {
            skipped_absent.push(task_path.to_string());
            let _ = transaction.delete_entry(task_path);
            continue;
        }

        match imp::set_enabled(task_path, previously_enabled) {
            Ok(()) => {
                // Verify restoration
                if barebone_task_enabled(task_path) == Ok(previously_enabled) {
                    succeeded.push(task_path.to_string());
                    let _ = transaction.delete_entry(task_path);
                } else {
                    failed.push((
                        task_path.to_string(),
                        "State verification mismatch on rollback".to_string(),
                    ));
                }
            }
            Err(e) => failed.push((task_path.to_string(), e)),
        }
    }

    Ok(BareboneBatchOutcome {
        total_allowlisted: crate::barebone::BAREBONE_TASKS.len(),
        succeeded,
        failed,
        skipped_absent,
        restore_point: crate::restore_point::RestorePointOutcome::Skipped {
            reason: "Rollback restores baseline state".to_string(),
        },
    })
}
```

---

## 3. Real-Time ETW Session Teardown Engine

### 3.1 The Diagnostic Logging Defect in Conventional Debloaters
Traditional tuning suites write `Start=0` to:
`HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\<LoggerName>`
This prevents Autologger startup during subsequent boots. However, the active kernel-level trace session remains initialized in physical memory. The kernel's ETW logging subsystem continues to allocate paged and non-paged buffers, process event registrations, and write traces to disk until the machine is rebooted.

### 3.2 Win32 ETW API Architecture
WinCraft interacts directly with `Advapi32.dll` via `windows-sys::Win32::System::Diagnostics::Etw`:
```rust
use windows_sys::Win32::System::Diagnostics::Etw::{
    ControlTraceW, CONTROLTRACE_HANDLE, EVENT_TRACE_PROPERTIES,
    EVENT_TRACE_CONTROL_STOP, EVENT_TRACE_CONTROL_QUERY, WNODE_FLAG_TRACED_GUID,
};
```

#### Memory Layout Requirements for `EVENT_TRACE_PROPERTIES`
Win32 ETW requires that `EVENT_TRACE_PROPERTIES` is immediately followed in contiguous memory by space allocated for the `LoggerName` and `LogFileName` null-terminated UTF-16 strings:
```rust
#[repr(C)]
struct TraceSessionProperties {
    props: EVENT_TRACE_PROPERTIES,
    logger_name: [u16; 256],
    log_file_name: [u16; 256],
}

impl TraceSessionProperties {
    fn new() -> Self {
        let mut me: Self = unsafe { std::mem::zeroed() };
        me.props.Wnode.BufferSize = std::mem::size_of::<Self>() as u32;
        me.props.Wnode.Flags = WNODE_FLAG_TRACED_GUID;
        me.props.LoggerNameOffset = std::mem::size_of::<EVENT_TRACE_PROPERTIES>() as u32;
        me.props.LogFileNameOffset = (std::mem::size_of::<EVENT_TRACE_PROPERTIES>()
            + 256 * std::mem::size_of::<u16>()) as u32;
        me
    }
}
```

### 3.3 Active Session Mapping Table
The following Autologgers must be stopped at runtime when corresponding tweaks are applied:

| Tweak ID | Registry Path | Active Runtime Session Name(s) |
|---|---|---|
| `telemetry_autologger_diagtrack` | `Control\WMI\Autologger\AutoLogger-Diagtrack-Listener` | `Diagtrack-Listener`, `AutoLogger-Diagtrack-Listener` |
| `telemetry_autologger_sqm` | `Control\WMI\Autologger\SQMLogger` | `SQMLogger` |
| `telemetry_autologger_ait` | `Control\WMI\Autologger\AITEventLog` | `AITEventLog` |
| `telemetry_autologger_diaglog` | `Control\WMI\Autologger\DiagLog` | `DiagLog` |
| `telemetry_autologger_wifisession`| `Control\WMI\Autologger\WiFiSession` | `WiFiSession` |

### 3.4 Runtime Teardown Implementation
```rust
pub struct EtwTeardownResult {
    pub session_name: String,
    pub was_running: bool,
    pub buffers_freed: u32,
    pub events_lost: u32,
}

pub fn stop_runtime_etw_session(name: &str) -> Result<EtwTeardownResult, String> {
    let wide_name: Vec<u16> = name.encode_utf16().chain(std::iter::once(0)).collect();
    let mut props = TraceSessionProperties::new();

    let status = unsafe {
        ControlTraceW(
            CONTROLTRACE_HANDLE { Value: 0 },
            wide_name.as_ptr(),
            &mut props.props,
            EVENT_TRACE_CONTROL_STOP,
        )
    };

    match status {
        0 => Ok(EtwTeardownResult {
            session_name: name.to_string(),
            was_running: true,
            buffers_freed: props.props.NumberOfBuffers,
            events_lost: props.props.EventsLost,
        }),
        4201 => {
            // ERROR_WMI_INSTANCE_NOT_FOUND: session was already inactive
            Ok(EtwTeardownResult {
                session_name: name.to_string(),
                was_running: false,
                buffers_freed: 0,
                events_lost: 0,
            })
        }
        5 => Err("Access Denied: Administrative elevation required to stop ETW session".into()),
        code => Err(format!("Win32 ControlTraceW error code: {code}")),
    }
}
```

### 3.5 Tweak Pipeline Integration
In `src-tauri/src/tweaks.rs`, the Autologger apply handlers are augmented:
```rust
pub fn apply_autologger_tweak(
    store: &crate::rollback::RollbackStore,
    tweak: &Tweak,
    session_names: &[&str],
) -> Result<(), String> {
    // 1. Snapshot and set registry Start = 0
    apply_registry_tweak(store, tweak)?;

    // 2. Immediate in-memory teardown if elevated
    if crate::elevation::is_elevated() {
        for &name in session_names {
            let _ = stop_runtime_etw_session(name);
        }
    }
    Ok(())
}
```

---

## 4. Machine-Wide AppX Provisioned Package Deprovisioning

### 4.1 Per-User vs Machine-Wide Provisioned Architecture
Windows modern applications have two deployment layers:
1. **User Registrations (`AppModel`):** Removed via `PackageManager::RemovePackageAsync`. Only removes the shortcut and app container for the current user SID (`S-1-5-21-...`).
2. **Provisioned Packages (`InboxApplications`):** Stored under `%ProgramFiles%\WindowsApps` and `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Appx\AppxAllUserStore\InboxApplications`. 
   * When any new user signs in, or when Windows Update installs a Cumulative Update or Feature Update, the AppX deployment engine scans the provisioned list and re-stages the package across all profiles.

### 4.2 System-Critical Safety Boundaries (Exclusion List)
The deprovisioning engine must refuse any operation targeting infrastructure packages, even if requested:
```rust
pub const FORBIDDEN_DEPROVISION_PACKAGES: &[&str] = &[
    "Microsoft.WindowsStore",
    "Microsoft.DesktopAppInstaller",
    "Microsoft.WindowsTerminal",
    "Microsoft.UI.Xaml",
    "Microsoft.VCLibs",
    "Microsoft.NET.Native.Runtime",
    "Microsoft.NET.Native.Framework",
    "Microsoft.Windows.ShellExperienceHost",
    "Microsoft.Windows.StartMenuExperienceHost",
    "Microsoft.Windows.SecHealthUI",
    "Microsoft.GamingServices",
    "Microsoft.XboxIdentityProvider",
];

pub fn is_deprovision_allowed(package_family_name: &str) -> bool {
    let lower = package_family_name.to_lowercase();
    !FORBIDDEN_DEPROVISION_PACKAGES.iter().any(|&forbidden| {
        lower.contains(&forbidden.to_lowercase())
    })
}
```

### 4.3 Dual-Path Deprovisioning Engine
WinCraft implements dual-path execution: primary execution via WinRT `PackageManager`, falling back to `Dism.exe /Online /Remove-ProvisionedAppxPackage` for resilient cross-build compatibility.

```rust
#[cfg(windows)]
pub fn deprovision_machine_package(package_family_name: &str) -> Result<(), String> {
    if !is_deprovision_allowed(package_family_name) {
        return Err(format!("Package {package_family_name} is protected system infrastructure"));
    }

    if !crate::elevation::is_elevated() {
        return Err("Machine-wide deprovisioning requires elevated administrator rights".into());
    }

    // Path A: WinRT PackageManager DeprovisionPackageForAllUsersAsync
    match winrt_deprovision(package_family_name) {
        Ok(()) => Ok(()),
        Err(winrt_err) => {
            // Path B: Fallback to DISM
            dism_deprovision(package_family_name)
                .map_err(|dism_err| format!("WinRT error: {winrt_err}; DISM error: {dism_err}"))
        }
    }
}

#[cfg(windows)]
fn winrt_deprovision(package_family_name: &str) -> Result<(), String> {
    use windows::core::HSTRING;
    use windows::Management::Deployment::PackageManager;

    let manager = PackageManager::new().map_err(|e| format!("WinRT CoCreate failed: {e}"))?;
    let operation = manager
        .DeprovisionPackageForAllUsersAsync(&HSTRING::from(package_family_name))
        .map_err(|e| format!("Deprovision call failed: {e}"))?;

    let result = operation.get().map_err(|e| format!("Async wait failed: {e}"))?;
    let code = result.ExtendedErrorCode().unwrap_or_default();
    if code.is_err() {
        return Err(format!("WinRT deprovision refused: {code:?}"));
    }
    Ok(())
}

#[cfg(windows)]
fn dism_deprovision(package_family_name: &str) -> Result<(), String> {
    // 1. Resolve exact ProvisionedPackageName using DISM query
    let output = std::process::Command::new("dism.exe")
        .args(&["/Online", "/NoRestart", "/Get-ProvisionedAppxPackages", "/Format:Table"])
        .output()
        .map_err(|e| format!("Failed to spawn dism.exe: {e}"))?;

    let text = String::from_utf8_lossy(&output.stdout);
    let full_package_name = text
        .lines()
        .find(|line| line.contains(package_family_name))
        .and_then(|line| line.split_whitespace().next())
        .ok_or_else(|| format!("Package {package_family_name} not provisioned in image"))?;

    // 2. Execute /Remove-ProvisionedAppxPackage
    let remove_output = std::process::Command::new("dism.exe")
        .args(&[
            "/Online",
            "/NoRestart",
            "/Remove-ProvisionedAppxPackage",
            &format!("/PackageName:{}", full_package_name),
        ])
        .output()
        .map_err(|e| format!("Failed to execute dism removal: {e}"))?;

    if remove_output.status.success() {
        Ok(())
    } else {
        Err(format!(
            "DISM exited with code {:?}",
            remove_output.status.code()
        ))
    }
}
```

### 4.4 Tier 3 Gating and History Journal
Deprovisioning cannot be reversed from local disk cache once staged files are purged. As specified in Addendum 16.3:
- Excluded from `rollback_store.json` (prevents false "instant restore" guarantees).
- Requires typed consent via `barebone::assert_consented(dir, package_id)`.
- Appended to `%APPDATA%/barebone_history.json`:
  ```json
  {
    "id": "barebone_package_solitaire",
    "tier": "irreversible",
    "detail": "Microsoft.MicrosoftSolitaireCollection deprovisioned machine-wide",
    "storeUrl": "https://apps.microsoft.com/detail/9wzdncrfhwd2",
    "timestamp": 1776243892
  }
  ```

---

## 5. `SvcHostSplitDisable` Service Grouping Fan-Out Engine

### 5.1 Architecture & RAM Impact
Windows 10 Version 1703 decoupled svchost service hosting: machines with > 3.5GB RAM host each shared service in a separate `svchost.exe` process instance. On modern hardware, this results in 80–120 active `svchost.exe` processes, consuming 200MB–450MB of additional paged/non-paged pool memory and page tables.

AtlasOS collapses processes via:
```powershell
Get-ChildItem HKLM:\SYSTEM\CurrentControlSet\Services | Set-ItemProperty -Name SvcHostSplitDisable -Value 1 -ErrorAction SilentlyContinue
```

### 5.2 WinCraft Engineered Enhancements over AtlasOS
AtlasOS's PowerShell script has notable engineering limitations:
1. **Blind Driver Invalidation:** It attempts to write `SvcHostSplitDisable` to hundreds of kernel drivers (`SERVICE_KERNEL_DRIVER`, `SERVICE_FILE_SYSTEM_DRIVER`), cluttering keys.
2. **No Undo/Rollback State:** Once applied, the user cannot revert to Windows standard service isolation.
3. **Permission Halts:** Fails silently on `TrustedInstaller`-protected services.

WinCraft implements an intelligent filtering and snapshot engine:
1. **Target Filter:** Evaluates keys under `HKLM\SYSTEM\CurrentControlSet\Services`:
   - Must have `Type` = `0x20` (`SERVICE_WIN32_SHARE_PROCESS`) or `0x10` (`SERVICE_WIN32_OWN_PROCESS`).
   - Must have `ImagePath` containing `svchost.exe` (case-insensitive).
   - Skips security-isolated core services (`RpcSs`, `DcomLaunch`).
2. **Permission Handling:** Catches `ERROR_ACCESS_DENIED` on hardened keys without terminating the batch transaction.

### 5.3 Snapshot Representation & Data Schema
In `src-tauri/src/rollback.rs`:
```rust
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct SvcHostSplitSnapshot {
    pub service_name: String,
    pub original_value: Option<u32>, // None = key was created by WinCraft
}

// Added to SnapshotEntry enum:
#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(tag = "kind")]
pub enum SnapshotEntry {
    // ... existing variants ...
    SvcHostSplitFanout {
        records: Vec<SvcHostSplitSnapshot>,
    },
}
```

### 5.4 Implementation of Apply and Rollback State Machines
```rust
#[cfg(windows)]
pub fn apply_svchost_split_fanout(
    store: &crate::rollback::RollbackStore,
) -> Result<usize, String> {
    use winreg::enums::{HKEY_LOCAL_MACHINE, KEY_READ, KEY_SET_VALUE};
    use winreg::RegKey;

    let hklm = RegKey::predef(HKEY_LOCAL_MACHINE);
    let services_key = hklm
        .open_subkey_with_flags(r"SYSTEM\CurrentControlSet\Services", KEY_READ)
        .map_err(|e| format!("Failed to open Services hive: {e}"))?;

    let mut records = Vec::new();
    let mut modified_count = 0;

    for name in services_key.enum_keys().filter_map(Result::ok) {
        // Exclude critical infrastructure that must stay isolated
        if name.eq_ignore_ascii_case("RpcSs") || name.eq_ignore_ascii_case("DcomLaunch") {
            continue;
        }

        let subkey_path = format!(r"SYSTEM\CurrentControlSet\Services\{}", name);
        let subkey = match hklm.open_subkey_with_flags(&subkey_path, KEY_READ | KEY_SET_VALUE) {
            Ok(k) => k,
            Err(_) => continue, // Skip access-denied or locked keys
        };

        // Filter: Must be a svchost-hosted service
        let image_path: String = subkey.get_value("ImagePath").unwrap_or_default();
        if !image_path.to_lowercase().contains("svchost.exe") {
            continue;
        }

        let original_val: Option<u32> = subkey.get_value("SvcHostSplitDisable").ok();

        // If already 1, skip mutation
        if original_val == Some(1) {
            continue;
        }

        records.push(SvcHostSplitSnapshot {
            service_name: name.clone(),
            original_value: original_val,
        });

        if subkey.set_value("SvcHostSplitDisable", &1u32).is_ok() {
            modified_count += 1;
        }
    }

    // Save transactional snapshot
    let mut transaction = store.transaction()?;
    transaction.save_entry(
        "service_svchost_split_disable_all",
        crate::rollback::SnapshotEntry::SvcHostSplitFanout { records },
    )?;

    Ok(modified_count)
}

#[cfg(windows)]
pub fn rollback_svchost_split_fanout(
    store: &crate::rollback::RollbackStore,
) -> Result<usize, String> {
    use winreg::enums::{HKEY_LOCAL_MACHINE, KEY_SET_VALUE};
    use winreg::RegKey;

    let hklm = RegKey::predef(HKEY_LOCAL_MACHINE);
    let mut restored_count = 0;

    store.restore_entry("service_svchost_split_disable_all", |entry| {
        let crate::rollback::SnapshotEntry::SvcHostSplitFanout { records } = entry else {
            return Err("Unexpected snapshot variant for SvcHostSplitFanout".into());
        };

        for item in records {
            let path = format!(r"SYSTEM\CurrentControlSet\Services\{}", item.service_name);
            let subkey = match hklm.open_subkey_with_flags(&path, KEY_SET_VALUE) {
                Ok(k) => k,
                Err(_) => continue,
            };

            match item.original_value {
                Some(orig) => {
                    let _ = subkey.set_value("SvcHostSplitDisable", &orig);
                }
                None => {
                    let _ = subkey.delete_value("SvcHostSplitDisable");
                }
            }
            restored_count += 1;
        }
        Ok(())
    })?;

    Ok(restored_count)
}
```

---

## 6. 100% Rollback Snapshot Integrity Verification

### 6.1 Strict Invariants for State Durability
To maintain system stability across Windows updates and crashes, every mutation conforms to four mathematical guarantees:

1. **Oldest-Original Retention:**
   If a tweak is applied multiple times, the snapshot records the system state before the **first** application:
   ```rust
   if let Some(existing) = self.state.snapshots.get(tweak_id) {
       // Target identity must match, but previous values are never overwritten
       return Ok(());
   }
   ```
2. **Disjoint Target Conflict Checking (`check_conflicts`):**
   No two tweaks may claim ownership of the same registry key path, service name, or scheduled task path. Overlapping tweaks are rejected before any write occurs.
3. **Atomic Two-Phase Journaling:**
   The `RollbackStore` writes updates to a temporary sibling file (`rollback_store.json.tmp.<pid>.<seq>`), calls `FlushFileBuffers`, and executes an atomic replace (`MoveFileExW` with `MOVEFILE_REPLACE_EXISTING`).
4. **Post-Mutation Read Verification:**
   Every setter function re-reads the registry or Task Scheduler XML immediately after modification. If the value does not match the desired target, the snapshot is retained on disk and an error is returned to the user.

### 6.2 Snapshot Schema Validator Updates (`rollback.rs`)
The `validate_snapshot` gate is updated to validate new types:
```rust
pub(crate) fn validate_snapshot(id: &str, entry: &SnapshotEntry) -> Result<(), String> {
    let allowed = match id {
        // ... existing cases ...
        "service_svchost_split_disable_all" => {
            matches!(entry, SnapshotEntry::SvcHostSplitFanout { records }
                if records.len() <= 2048 && records.iter().all(|r| {
                    !r.service_name.is_empty() 
                    && r.service_name.len() <= 256 
                    && !r.service_name.contains('\0')
                }))
        }
        _ => {
            matches!(entry, SnapshotEntry::ScheduledTask { path, .. }
                if crate::barebone::BAREBONE_TASKS.contains(&path.as_str())
                    && path.len() <= 512
                    && !path.contains('\0'))
        }
    };

    if allowed {
        Ok(())
    } else {
        Err(format!("Snapshot validation rejected entry for {id}"))
    }
}
```

---

## 7. IPC Bridge & Capability Manifest Integration

### 7.1 New IPC Commands Registration
The following commands are registered in `src-tauri/src/ipc_commands.rs`:
```rust
pub const APP_COMMANDS: &[&str] = &[
    // ... existing commands ...
    "disable_all_barebone_tasks",
    "rollback_all_barebone_tasks",
    "deprovision_barebone_package",
    "apply_svchost_split_fanout",
    "rollback_svchost_split_fanout",
    "stop_etw_trace_session",
];
```

### 7.2 Capability Manifest Declarations (`permissions/desktop.toml`)
```toml
[[set]]
identifier = "desktop-commands"
description = "Main desktop window permissions for AtlasOS optimization engine."
permissions = [
    # ... existing permissions ...
    "allow-disable-all-barebone-tasks",
    "allow-rollback-all-barebone-tasks",
    "allow-deprovision-barebone-package",
    "allow-apply-svchost-split-fanout",
    "allow-rollback-svchost-split-fanout",
    "allow-stop-etw-trace-session",
]
```

### 7.3 IPC Parity Test Assertions (`ipc_tests.rs`)
The integration test `every_registered_application_command_has_an_explicit_permission()` will assert that:
1. Every handler in `tauri::generate_handler![...]` has an identical string in `APP_COMMANDS`.
2. Every string in `APP_COMMANDS` has a corresponding `allow-<kebab-case>` rule in `permissions/desktop.toml`.

---

## 8. Implementation Roadmap & Quality Gates

| Phase | Milestone | Acceptance Criteria |
|---|---|---|
| **Phase B2.1** | Scheduled Tasks Batch Engine | Single-UAC dispatch; 40 tasks processed, absent tasks skipped, verified state output. |
| **Phase B2.2** | Active ETW Control | `ControlTraceW` terminates `Diagtrack-Listener` and `AutoLogger-*` sessions at runtime. |
| **Phase B2.3** | Provisioned AppX Stripping | WinRT/DISM dual-path removes provisioned packages; blocks protected system apps. |
| **Phase B2.4** | SvcHost Service Grouping | `SvcHostSplitDisable` applied across filtered svchost services with 100% snapshot restoration. |
| **Phase B2.5** | CI & Rigorous Verification | `cargo test` passes; IPC parity test passes; VM matrix validation green. |
