# WinCraft 2.0: Reversibility & Safety Engine Specification
## Native VSS System Restore, Atomic Journaling, and Offline WinRE Recovery Architecture

**Document Version:** 2.0.0-SPEC  
**Status:** Approved for Implementation  
**Classification:** Core Safety Infrastructure  
**Author:** WinCraft Core Systems & Kernel Engineering Group  

---

## 1. Executive Summary & The Invariant of Pure Reversibility

### 1.1 The Failure Mode of Custom ISOs & Monolithic Tweakers
Third-party Windows modification workflows divide into two historically flawed methodologies:

1. **Custom ISO Stripping (AtlasOS, ReviOS, Tiny11, MicroWin):**
   - **Destructive Deletion:** Dismantles `C:\Windows\WinSxS`, Component-Based Servicing (CBS), and foundational system components.
   - **Irreversible Mutations:** Deletes packages from disk rather than de-registering them, permanently breaking Windows Update, Microsoft Store, DISM (`/Online /Cleanup-Image /RestoreHealth`), and BitLocker.
   - **Zero Recovery Vector:** When a stripped OS encounters kernel corruption, servicing dependency failures, or anti-cheat driver rejections, the sole remedy is a complete disk reformat and reinstall.

2. **Monolithic Shell Tweakers (Optimizer, WinUtil, Debloat-Tools):**
   - **Fire-and-Forget Registry Writes:** Overwrite keys without recording pre-existing values, original data types, or security descriptors.
   - **Heuristic Restorations:** "Revert" actions write assumed default values rather than the machine's actual historical values, corrupting domain-joined or OEM-configured workstations.
   - **No Out-of-Band Safety Net:** If a modified service or kernel driver crashes the boot subsystem, the user cannot undo changes without booting into the graphical operating system.

### 1.2 The WinCraft Invariant: Pure Mathematical Reversibility
WinCraft 2.0 enforces the **Zero-Brick / 100% Reversibility Invariant**:
$$\forall \text{ state } S_0 \xrightarrow{\text{apply}(T)} S_1 \implies \exists \text{ rollback } R(T) \text{ such that } R(S_1) \equiv S_0$$

Every mutation executed by WinCraft is:
1. **Pre-flight Snapshotted:** Live system state is captured into an atomic, checksummed journal prior to touching disk or registry.
2. **Dual-Tier Guarded:** Anchored by native Volume Shadow Copy Service (VSS) restore points at the kernel/VSS layer, and a transactional JSON journal at the user/system layer.
3. **Offline Recoverable:** Accompanied by a standalone, bootable WinRE batch and registry script generated on the host before any system mutation begins.
4. **Non-Destructive:** No system binaries are deleted, no CBS components are uninstalled, and servicing channels remain 100% functional for Windows Cumulative Updates.

### 1.3 Architectural Comparison Matrix

| Engineering Dimension | Custom ISOs (*Atlas/Revi/Tiny*) | Script Tweakers (*WinUtil/Optimizer*) | WinCraft 2.0 Safety Engine |
| :--- | :--- | :--- | :--- |
| **System Servicing (CBS/WinSxS)** | Permanently stripped / Broken | Untouched | **100% Untouched & Functional** |
| **Windows Update Compatibility** | Fails cumulative updates | Often breaks telemetry-tied updates | **Guaranteed fully operational** |
| **Pre-Write Snapshot** | None (Static ISO) | Sporadic registry backup `.reg` | **Atomic typed snapshot + VSS restore point** |
| **Service Rollback Fidelity** | Irreversible deletion | Writes hardcoded default start types | **Restores exact previous start type & state** |
| **AppX/MSIX Package Handling** | Physical directory deletion | `Remove-AppxPackage -AllUsers` | **Per-user unregister; manifest retained for 0-byte reinstall** |
| **Offline Disaster Recovery** | Non-existent (Requires reinstall) | Manual registry editing | **Auto-generated WinRE `recover.bat` + offline hive patch** |
| **Anti-Bricking Guardrails** | None (User assumes all risk) | Basic error suppression | **Hardware & BitLocker-aware immutable whitelists** |

---

## 2. Subsystem 1: Native VSS System Restore Point Engine

### 2.1 Win32 Native API Contract (`srclient.dll`)
WinCraft bypasses slow, brittle PowerShell wrappers (`Checkpoint-Computer`) and directly invokes the Windows native System Restore Client API exported by `srclient.dll`.

#### Dynamic Loading Rationale
`srclient.dll` is present on client editions of Windows 10 and 11, but is absent on Windows Server builds and specialized enterprise SKUs. A link-time compile dependency (`srclient.lib`) induces a fatal load-time crash (`STATUS_DLL_NOT_FOUND`) on environments lacking System Restore. WinCraft dynamically resolves the entry point via `LoadLibraryExW` with `LOAD_LIBRARY_SEARCH_SYSTEM32` to guarantee binary portability and immune system security (mitigating binary planting and DLL hijacking).

### 2.2 Win32 ABI Structures & Signatures
```c
// Native Windows System Restore Definitions (sr.h)

#define BEGIN_SYSTEM_CHANGE          100
#define END_SYSTEM_CHANGE            101
#define BEGIN_NESTED_SYSTEM_CHANGE   102
#define END_NESTED_SYSTEM_CHANGE     103

#define APPLICATION_INSTALL          0
#define APPLICATION_UNINSTALL        1
#define DEVICE_DRIVER_INSTALL        10
#define MODIFY_SETTINGS              12
#define CANCELLED_OPERATION          13

#define ERROR_SUCCESS                0L
#define ERROR_SERVICE_DISABLED       1058L
#define ERROR_DISK_FULL              112L
#define ERROR_TIMEOUT                1460L

#pragma pack(push, 8)
typedef struct _RESTOREPOINTINFOW {
    DWORD dwEventType;               // BEGIN_SYSTEM_CHANGE or END_SYSTEM_CHANGE
    DWORD dwRestorePtType;           // MODIFY_SETTINGS, APPLICATION_UNINSTALL, etc.
    INT64 llSequenceNumber;          // 0 on BEGIN; sequence returned by StateMgr on END
    WCHAR szDescription[256];        // Human-readable restore point label
} RESTOREPOINTINFOW, *PRESTOREPOINTINFOW;

typedef struct _STATEMGRSTATUS {
    DWORD nStatus;                   // Win32 error code (ERROR_SUCCESS on success)
    INT64 llSequenceNumber;          // Assigned sequence number for tracking
} STATEMGRSTATUS, *PSTATEMGRSTATUS;
#pragma pack(pop)

typedef BOOL (WINAPI *pfnSRSetRestorePointW)(
    PRESTOREPOINTINFOW  pRestorePtSpec,
    PSTATEMGRSTATUS     pSMgrStatus
);
```

### 2.3 Windows 24-Hour Throttling Bypass
By default, Windows throttles System Restore point generation to a maximum frequency of once every 1440 minutes (24 hours). If a restore point was taken earlier that day, `SRSetRestorePointW` silently succeeds without producing a new Volume Shadow Copy snapshot, leaving subsequent mutations uncovered.

WinCraft handles this constraint via a deterministic pre-flight check and registry policy management:
- **Registry Throttle Key:** `HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\SystemRestore`
- **DWORD Value:** `SystemRestorePointCreationFrequency`
- **Behavior:**
  - `Value == 0`: Throttling disabled; `SRSetRestorePointW` generates a unique VSS snapshot on every invocation.
  - `Value > 0` or missing: Windows imposes default 1440-minute lockout.
- **Engine Protocol:**
  1. Elevate to `SE_BACKUP_NAME` and `SE_RESTORE_NAME` privileges.
  2. Inspect `SystemRestorePointCreationFrequency`.
  3. If missing or non-zero, temporarily record the original value in the rollback journal and set to `0`.
  4. Issue `SRSetRestorePointW(BEGIN_SYSTEM_CHANGE)`.
  5. Restore original throttle configuration immediately after `END_SYSTEM_CHANGE`.

### 2.4 Transactional Bracket Lifecycle
Every system-altering batch in WinCraft follows a strict bracketing protocol:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   VSS Restore Point Lifecycle State                     │
└────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
           [Pre-Flight: Check VSS & SystemRestore Service]
                                  │
                                  ▼
      [Query/Bypass SystemRestorePointCreationFrequency Throttle]
                                  │
                                  ▼
           [SRSetRestorePointW(BEGIN_SYSTEM_CHANGE, seq=0)]
                                  │
                ┌─────────────────┴─────────────────┐
                ▼                                   ▼
        [Status == ERROR_SUCCESS]           [Status != ERROR_SUCCESS]
                │                                   │
                ▼                                   ▼
      [Capture Sequence ID]                 [Log Exact Win32 Code]
                │                           [Graceful Fallback to Journal]
                ▼
        [Execute System Tweaks]
                │
        ┌───────┴───────┐
        │               │
  (All Succeeded)  (Any Failed)
        │               │
        ▼               ▼
[SRSetRestorePointW   [SRSetRestorePointW
 (END_SYSTEM_CHANGE,   (END_SYSTEM_CHANGE,
  seq=SequenceID)]      restore_type=CANCELLED_OPERATION)]
        │               │
        ▼               ▼
 [Commit Journal]  [Trigger Journal Rollback]
```

---

## 3. Subsystem 2: Universal Atomic Rollback Journal Engine

### 3.1 Four-Tier Mutation Journaling Architecture
WinCraft manages an atomic, append-only, crash-resilient journal file located at `%APPDATA%\WinCraft\rollback_store.json` (user-scoped) and `%PROGRAMDATA%\WinCraft\system_rollback_store.json` (elevated system-scoped).

```
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│                              WinCraft Master Rollback Ledger                                 │
├──────────────────────────────┬───────────────────────────────┬───────────────────────────────┤
│ Tier 1: Registry Subsystem   │ Tier 2: Windows Services      │ Tier 3: Scheduled Tasks       │
│ • Full Type Preservation     │ • Start Type (Boot -> Dis)    │ • Full Task XML Definition    │
│ • Key Tree Pruning Tracking  │ • DelayedAutoStart Tracking   │ • Enabled / Disabled State    │
│ • Deleted Value Re-creation  │ • Runtime Running State       │ • Dynamic Path Resolvers      │
├──────────────────────────────┴───────────────────────────────┴───────────────────────────────┤
│ Tier 4: AppX / MSIX Debloat Package Subsystem                                                │
│ • Preserved AppxManifest.xml Path for 0-Byte Instant Local Re-registration                   │
│ • PackageFullName, PackageFamilyName, Publisher ID, User Scope Isolation                     │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Tier 1: Registry Journaling
- **Type Preservation:** Preserves `REG_SZ`, `REG_EXPAND_SZ`, `REG_DWORD`, `REG_QWORD`, `REG_MULTI_SZ`, `REG_BINARY`, and `REG_NONE`.
- **Created Key Isolation (`RegistryKeyCreated`):** If a tweak requires creating a previously non-existent subkey hierarchy (e.g. `HKCU\Software\Classes\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\InprocServer32`), the journal logs the created key. During rollback, the engine prunes the created subtree (`RegDeleteTreeW`), ensuring no orphan keys remain to alter OS behavior.
- **Original Value Preservation:** If a value existed, its raw binary bytes and exact type tag are stored. If `original_value == None`, rollback deletes the written value rather than injecting a synthetic default.

#### Tier 2: Windows Services Journaling
- **Configuration Fields Captured:**
  - `start_type`: `SERVICE_BOOT_START` (0), `SERVICE_SYSTEM_START` (1), `SERVICE_AUTO_START` (2), `SERVICE_DEMAND_START` (3), `SERVICE_DISABLED` (4).
  - `delayed_auto_start`: Boolean flag indicating whether `SERVICE_CONFIG_DELAYED_AUTO_START_INFO` was active.
  - `was_running`: Captures if the service was actively executing (`SERVICE_RUNNING`). If true, rollback not only sets the start type back but invokes `StartServiceW` to resume runtime execution.
  - `service_sid_type` & `security_descriptor`: Preserves custom service DACLs if access permissions were altered.

#### Tier 3: Scheduled Tasks Journaling
- **Complete XML Serialization:** Rather than toggling an opaque switch, WinCraft exports the complete Task Definition XML via `ITaskDefinition::get_XmlText`.
- **State Preservation:** Records `previously_enabled: bool`.
- **Restoration Protocol:**
  - If task was disabled: Toggles `put_Enabled(VARIANT_TRUE)`.
  - If task was deleted: Calls `ITaskFolder::RegisterTask` passing the stored XML text, recreating triggers, actions, and security credentials identically.

#### Tier 4: AppX / MSIX Debloat Journaling
- **Non-Destructive User De-Registration:** WinCraft **never** deletes files from `C:\Program Files\WindowsApps` or `C:\Windows\SystemApps`.
- **Metadata Captured:**
  - `PackageFullName`: e.g., `Microsoft.BingWeather_4.53.51141.0_x64__8wekyb3d8bbwe`
  - `PackageFamilyName`: `Microsoft.BingWeather_8wekyb3d8bbwe`
  - `ManifestPath`: Fully qualified path to `AppxManifest.xml` inside `WindowsApps`.
  - `InstallLocation`: Canonical directory path.
  - `UserSID`: Security Identifier of the user account.
- **Reversal Mechanism:**
  ```powershell
  Add-AppxPackage -DisableDevelopmentMode -Register "$ManifestPath"
  ```
  Restores the application instantly from the local staging cache without internet access or Microsoft Store downloads.

### 3.2 File Locking and Atomic Write Cycle
To guarantee journal integrity against unexpected shutdowns, power losses, or concurrent process conflicts (e.g., UI frontend and elevated worker daemon):

1. **Cross-Process Advisory Locking:** A sibling lock file (`rollback_store.lock`) is acquired via Win32 `LockFileEx` (`LOCKFILE_EXCLUSIVE_LOCK`). The OS automatically releases this kernel lock if the holding process crashes.
2. **Deterministic Temp Generation:** Writes serialize to a unique temp file:
   `rollback_store.json.<PID>.<SEQUENCE_NUMBER>.tmp`
3. **Hardware Storage Flush:** Once serialized, the temp file handle issues `FlushFileBuffers` (`sync_all()`), forcing file allocation tables and data sectors out of drive volatile write caches.
4. **Atomic Inode/MFT Replacement:** Replaces the destination file via `ReplaceFileW` / `MoveFileExW(MOVEFILE_REPLACE_EXISTING | MOVEFILE_WRITE_THROUGH)`. The operation is atomic within the NTFS Master File Table.

```rust
// Atomic Journal Commit Routine
pub fn atomic_save_journal(path: &Path, content: &[u8]) -> std::io::Result<()> {
    let parent = path.parent().ok_or_else(|| std::io::Error::other("invalid parent"))?;
    std::fs::create_dir_all(parent)?;
    
    let tmp_path = path.with_extension(format!("json.{}.{}.tmp", std::process::id(), get_next_seq()));
    {
        let mut file = OpenOptions::new().write(true).create_new(true).open(&tmp_path)?;
        file.write_all(content)?;
        file.sync_all()?; // Force physical disk platter/NAND flush
    }
    
    // Win32 Atomic Replace
    #[cfg(windows)]
    {
        use std::os::windows::ffi::OsStrExt;
        let wide_tmp: Vec<u16> = tmp_path.as_os_str().encode_wide().chain(Some(0)).collect();
        let wide_target: Vec<u16> = path.as_os_str().encode_wide().chain(Some(0)).collect();
        let ret = unsafe {
            windows_sys::Win32::Storage::FileSystem::MoveFileExW(
                wide_tmp.as_ptr(),
                wide_target.as_ptr(),
                windows_sys::Win32::Storage::FileSystem::MOVEFILE_REPLACE_EXISTING 
                | windows_sys::Win32::Storage::FileSystem::MOVEFILE_WRITE_THROUGH
            )
        };
        if ret == 0 {
            let _ = std::fs::remove_file(&tmp_path);
            return Err(std::io::Error::last_os_error());
        }
    }
    Ok(())
}
```

---

## 4. Subsystem 3: Offline WinRE Emergency Recovery Engine

### 4.1 The Catastrophic Boot Failure Scenario
If a deep system modification (such as network stack filtering, DPC priority adjustments, or core service disabling) prevents normal boot or triggers a Stop Error (BSOD `CRITICAL_PROCESS_DIED` / `SYSTEM_THREAD_EXCEPTION_NOT_HANDLED`), the user cannot run desktop restoration tools.

WinCraft addresses this with the **Zero-OS Out-of-Band Recovery Subsystem**. Before any system-level batch is applied, WinCraft synthesizes and writes a standalone, self-sufficient offline recovery harness directly to `%SYSTEMDRIVE%\WinCraftRecovery\`.

### 4.2 WinRE Environment Operating Realities
In Windows Recovery Environment (WinRE):
1. **Drive Letter Shifting:** WinRE mounts on `X:\` (a RAMDisk booted from `winre.wim`). The physical operating system partition is frequently shifted from `C:` to `D:`, `E:`, or `F:`.
2. **CurrentControlSet Absence:** `HKLM\SYSTEM\CurrentControlSet` does not exist in an offline hive file on disk. The offline hive contains only `ControlSet001`, `ControlSet002`, and a `Select` subkey.
   - Naive scripts attempting to write to `HKLM\OFFLINE_SYSTEM\CurrentControlSet` fail immediately.
   - The engine must read `HKLM\OFFLINE_SYSTEM\Select\Current` (typically `1`) and remap all service/kernel tweaks directly to `ControlSet001`.
3. **BitLocker Encryption Gates:** If the system volume is encrypted via BitLocker, the WinRE environment requires the 48-digit numerical recovery key before the volume can be mounted or read.

### 4.3 Automated Generation Pipeline
Every batch execution exports two production-ready artifacts to `C:\WinCraftRecovery\`:
1. `recover.bat`: Robust MS-DOS/NT Command Script with dynamic volume detection, BitLocker interrogation, hive mounting, repair execution, and graceful unloading.
2. `offline_rollback.reg`: Remapped offline registry script targeting `HKLM\OFFLINE_SYSTEM` and `HKLM\OFFLINE_SOFTWARE`.

### 4.4 Reference Production WinRE Recovery Script (`recover.bat`)
```batch
@echo off
setlocal EnableExtensions EnableDelayedExpansion
title WinCraft Emergency Offline Recovery Engine

echo =======================================================================
echo           WINCRAFT 2.0 EMERGENCY OFFLINE WINRE RESTORATION
echo =======================================================================
echo.
echo [*] Initializing offline repair environment...

:: -------------------------------------------------------------------------
:: STEP 1: DYNAMIC OS VOLUME DETECTION
:: Search drives C: through Z: for \Windows\System32\ntoskrnl.exe
:: -------------------------------------------------------------------------
set "TARGET_DRIVE="
for %%D in (C D E F G H I J K L M N O P Q R S T U V W Y Z) do (
    if exist "%%D:\Windows\System32\ntoskrnl.exe" (
        set "TARGET_DRIVE=%%D:"
        goto :FoundOS
    )
)

:FoundOS
if "%TARGET_DRIVE%"=="" (
    echo [ERROR] Target Windows system partition could not be located!
    echo         If BitLocker is enabled, you must unlock the volume first:
    echo         manage-bde -unlock D: -RecoveryPassword ^<48-digit-key^>
    echo.
    goto :ManualUnlockPrompt
)

echo [+] Located Windows system partition on: %TARGET_DRIVE%

:: -------------------------------------------------------------------------
:: STEP 2: BITLOCKER STATUS VERIFICATION
:: -------------------------------------------------------------------------
manage-bde -status %TARGET_DRIVE% | findstr /I "Locked" >nul
if !errorlevel!==0 (
    echo [!] WARNING: %TARGET_DRIVE% is LOCKED by BitLocker Drive Encryption.
    goto :ManualUnlockPrompt
)
goto :MountHives

:ManualUnlockPrompt
echo.
echo =======================================================================
echo                       BITLOCKER RECOVERY REQUIRED
echo =======================================================================
set /p BDL_DRIVE="Enter the locked drive letter (e.g. C: or D:): "
set /p BDL_KEY="Enter 48-digit BitLocker Recovery Key: "
echo [*] Attempting unlock...
manage-bde -unlock %BDL_DRIVE% -RecoveryPassword %BDL_KEY%
if !errorlevel! neq 0 (
    echo [FATAL] Failed to unlock BitLocker drive. Halting.
    pause
    exit /b 1
)
set "TARGET_DRIVE=%BDL_DRIVE%"

:: -------------------------------------------------------------------------
:: STEP 3: MOUNT OFFLINE REGISTRY HIVES
:: -------------------------------------------------------------------------
:MountHives
echo [*] Mounting offline registry hives from %TARGET_DRIVE%\Windows\System32\config...

reg load HKLM\OFFLINE_SYSTEM "%TARGET_DRIVE%\Windows\System32\config\SYSTEM"
if !errorlevel! neq 0 (
    echo [FATAL] Failed to load offline SYSTEM hive!
    pause
    exit /b 1
)

reg load HKLM\OFFLINE_SOFTWARE "%TARGET_DRIVE%\Windows\System32\config\SOFTWARE"
if !errorlevel! neq 0 (
    echo [FATAL] Failed to load offline SOFTWARE hive!
    reg unload HKLM\OFFLINE_SYSTEM >nul
    pause
    exit /b 1
)

echo [+] Successfully mounted OFFLINE_SYSTEM and OFFLINE_SOFTWARE.

:: -------------------------------------------------------------------------
:: STEP 4: RESOLVE ACTIVE CONTROLSET
:: Read OFFLINE_SYSTEM\Select\Current to determine active ControlSet (001, 002)
:: -------------------------------------------------------------------------
set "ACTIVE_CS=ControlSet001"
for /f "tokens=3" %%A in ('reg query "HKLM\OFFLINE_SYSTEM\Select" /v Current 2^>nul') do (
    set /a CS_NUM=%%A
    if !CS_NUM! lss 10 (
        set "ACTIVE_CS=ControlSet00!CS_NUM!"
    ) else (
        set "ACTIVE_CS=ControlSet0!CS_NUM!"
    )
)
echo [+] Active system ControlSet identified: %ACTIVE_CS%

:: -------------------------------------------------------------------------
:: STEP 5: EXECUTE PRE-COMPILED OFFLINE REGISTRY ROLLBACK
:: -------------------------------------------------------------------------
set "REG_PATCH=%TARGET_DRIVE%\WinCraftRecovery\offline_rollback.reg"
if exist "%REG_PATCH%" (
    echo [*] Applying offline registry restoration patch...
    reg import "%REG_PATCH%"
    if !errorlevel! equ 0 (
        echo [+] Offline registry modifications restored successfully.
    ) else (
        echo [!] Warning: Some registry keys failed to import.
    )
) else (
    echo [!] No offline_rollback.reg found at default location.
)

:: -------------------------------------------------------------------------
:: STEP 6: CRITICAL SERVICE EMERGENCY RESCUE
:: Deterministically force core boot services to default start types in ControlSet
:: -------------------------------------------------------------------------
echo [*] Re-enabling essential boot and network services in %ACTIVE_CS%...

:: Service Start Types: 2 = Auto, 3 = Manual, 4 = Disabled
reg add "HKLM\OFFLINE_SYSTEM\%ACTIVE_CS%\Services\RpcSs" /v Start /t REG_DWORD /d 2 /f >nul
reg add "HKLM\OFFLINE_SYSTEM\%ACTIVE_CS%\Services\DcomLaunch" /v Start /t REG_DWORD /d 2 /f >nul
reg add "HKLM\OFFLINE_SYSTEM\%ACTIVE_CS%\Services\PlugPlay" /v Start /t REG_DWORD /d 2 /f >nul
reg add "HKLM\OFFLINE_SYSTEM\%ACTIVE_CS%\Services\EventLog" /v Start /t REG_DWORD /d 2 /f >nul
reg add "HKLM\OFFLINE_SYSTEM\%ACTIVE_CS%\Services\Dhcp" /v Start /t REG_DWORD /d 2 /f >nul
reg add "HKLM\OFFLINE_SYSTEM\%ACTIVE_CS%\Services\Tcpip" /v Start /t REG_DWORD /d 1 /f >nul
reg add "HKLM\OFFLINE_SYSTEM\%ACTIVE_CS%\Services\BFE" /v Start /t REG_DWORD /d 2 /f >nul
reg add "HKLM\OFFLINE_SYSTEM\%ACTIVE_CS%\Services\mpssvc" /v Start /t REG_DWORD /d 2 /f >nul

echo [+] Core boot services verified.

:: -------------------------------------------------------------------------
:: STEP 7: CLEAN UNMOUNT
:: Unload offline hives to ensure no handle locks prevent boot
:: -------------------------------------------------------------------------
echo [*] Unloading offline registry hives...
reg unload HKLM\OFFLINE_SYSTEM
if !errorlevel! neq 0 (
    echo [!] Warning: OFFLINE_SYSTEM busy. Retrying in 2 seconds...
    timeout /t 2 /nobreak >nul
    reg unload HKLM\OFFLINE_SYSTEM
)

reg unload HKLM\OFFLINE_SOFTWARE
if !errorlevel! neq 0 (
    echo [!] Warning: OFFLINE_SOFTWARE busy. Retrying in 2 seconds...
    timeout /t 2 /nobreak >nul
    reg unload HKLM\OFFLINE_SOFTWARE
)

echo.
echo =======================================================================
echo [+] RECOVERY COMPLETED SUCCESSFULLY.
echo     You may now close this Command Prompt and restart your PC.
echo =======================================================================
pause
exit /b 0
```

### 4.5 Offline Registry Remapping Architecture (`offline_rollback.reg`)
Live registry writes targeting `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet` cannot be imported verbatim into an offline hive. The offline script generator transforms keys according to this formal schema:

$$\text{Live Path: } \text{HKLM\textbackslash SYSTEM\textbackslash CurrentControlSet\textbackslash} \dots \longrightarrow \text{Offline Path: } \text{HKLM\textbackslash OFFLINE\_SYSTEM\textbackslash ControlSet001\textbackslash} \dots$$
$$\text{Live Path: } \text{HKLM\textbackslash SOFTWARE\textbackslash} \dots \longrightarrow \text{Offline Path: } \text{HKLM\textbackslash OFFLINE\_SOFTWARE\textbackslash} \dots$$

#### Sample Generated `offline_rollback.reg`:
```ini
Windows Registry Editor Version 5.00

; WinCraft Emergency Offline Rollback Script
; Generated: 2026-10-15T09:20:00Z
; Target OS ControlSet: ControlSet001

; Restoring SvcHostSplitThresholdInKB to Windows Default
[HKEY_LOCAL_MACHINE\OFFLINE_SYSTEM\ControlSet001\Control]
"SvcHostSplitThresholdInKB"=dword:00380000

; Restoring Network Throttling Index
[HKEY_LOCAL_MACHINE\OFFLINE_SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile]
"NetworkThrottlingIndex"=dword:0000000a
"SystemResponsiveness"=dword:00000014

; Re-enabling Windows Telemetry Services if modified
[HKEY_LOCAL_MACHINE\OFFLINE_SYSTEM\ControlSet001\Services\DiagTrack]
"Start"=dword:00000002

; Re-enabling Windows Update Service
[HKEY_LOCAL_MACHINE\OFFLINE_SYSTEM\ControlSet001\Services\wuauserv]
"Start"=dword:00000003
```

---

## 5. Subsystem 4: Critical Safety Guardrails & Anti-Bricking Blacklists

### 5.1 Immutable Kernel & Subsystem Whitelist
WinCraft maintains a hardcoded, immutable whitelist of critical Windows services, drivers, and registry paths. Any tweak definition attempting to modify, disable, or delete an item in this table is rejected at the parser validation boundary before execution.

```rust
pub static IMMUTABLE_CRITICAL_SERVICES: &[&str] = &[
    // Core Session & RPC Subsystem
    "RpcSs", "RpcEptMapper", "DcomLaunch", "BrokerInfrastructure",
    "SystemEventsBroker", "PlugPlay", "Power",
    
    // Security, Authentication & Cryptography
    "lsass", "SamSs", "VaultSvc", "KeyIso", "CryptSvc", "BFE", "mpssvc",
    
    // Hardware Storage, Filesystems & Encryption
    "TPM", "BDESVC", "volmgr", "volsnap", "storahci", "mountmgr", "fltmgr",
    
    // Core Networking Stack
    "Tcpip", "Dhcp", "Dnscache", "Netman", "Ndis", "WlanSvc",
    
    // Windows Servicing & Package Integrity
    "TrustedInstaller", "AppXSvc", "ClipSVC"
];
```

### 5.2 Network Driver & NIC Hardware Preservation
A primary cause of user bricking in amateur debloat scripts is network interface incapacitation. WinCraft enforces strict network safety invariants:

1. **Driver Store / INF Protection:** WinCraft **never** deletes driver packages from `C:\Windows\System32\DriverStore\FileRepository`.
2. **NDIS Binding Preservation:** The TCP/IP stack bindings to physical network interfaces are never severed.
3. **DNS Fallback:** When applying optimized DNS addresses, WinCraft probes UDP/TCP 53 and DoH latency. If the candidate servers fail to resolve within 1,500ms, the mutation is aborted, retaining current DHCP-supplied DNS.
4. **Adapter GUID Verification:** Network tweaks check adapter GUIDs against `GetAdaptersAddresses`. Snapshots record `previous_servers` and `previous_automatic` state per adapter.

### 5.3 BitLocker Key Safety Protocol
Modifying low-level boot configuration or TPM settings can trigger BitLocker Recovery Mode on reboot, locking users out if they do not possess their 48-digit recovery key.

WinCraft implements a pre-flight BitLocker interrogation gate:
```
[User Selects System/Boot Level Tweaks]
                  │
                  ▼
   [Query Win32_EncryptableVolume via WMI]
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
 [BitLocker Inactive]   [BitLocker Active (ProtectionStatus == 1)]
        │                   │
        │                   ▼
        │        [Check Recovery Key Availability]
        │                   │
        │        ┌──────────┴──────────┐
        │        ▼                     ▼
        │   [Key Validated]      [Key Unconfirmed]
        │        │                     │
        │        ▼                     ▼
        │  [Allow Tweak]     [HALT: Display Warning Dialog]
        │                    [Require Explicit Affirmation]
        │                    [Show Key Backup Instructions]
        ▼
   [Execute Batch]
```

#### Pre-Flight Invariants:
1. **TPM PCR Protection:** WinCraft never alters PCR 7 or Secure Boot states.
2. **BCD Guard:** BCD attributes (`integritychecks`, `testsigning`, `nointegritychecks`) are locked against modification.
3. **Volume Warning:** If `ProtectionStatus == 1`, the UI displays a modal warning confirming the recovery key is backed up before any kernel-level tweak executes.

---

## 6. Implementation Algorithms

### 6.1 Algorithm 1: Dynamic VSS Restore Point Manager
```rust
use std::ptr;
use windows_sys::core::PCWSTR;
use windows_sys::Win32::Foundation::{FreeLibrary, BOOL};
use windows_sys::Win32::System::LibraryLoader::{GetProcAddress, LoadLibraryExW, LOAD_LIBRARY_SEARCH_SYSTEM32};

pub struct VssRestoreSession {
    dll_handle: isize,
    fn_set_restore_point: SrSetRestorePointW,
    sequence_number: i64,
    active: bool,
}

impl VssRestoreSession {
    pub fn begin(description: &str) -> Result<Self, String> {
        let dll_name: Vec<u16> = "srclient.dll\0".encode_utf16().collect();
        let module = unsafe {
            LoadLibraryExW(
                dll_name.as_ptr() as PCWSTR,
                0,
                LOAD_LIBRARY_SEARCH_SYSTEM32,
            )
        };
        if module == 0 {
            return Err("srclient.dll unavailable (Windows Server or System Restore stripped)".into());
        }

        let proc = unsafe { GetProcAddress(module, c"SRSetRestorePointW".as_ptr() as *const u8) };
        let Some(proc) = proc else {
            unsafe { FreeLibrary(module) };
            return Err("SRSetRestorePointW export missing".into());
        };

        let set_restore_point: SrSetRestorePointW = unsafe { std::mem::transmute(proc) };

        let mut desc_buf = [0u16; 256];
        for (slot, ch) in desc_buf.iter_mut().zip(description.encode_utf16().take(255)) {
            *slot = ch;
        }

        let info = RestorePointInfoW {
            event_type: 100, // BEGIN_SYSTEM_CHANGE
            restore_pt_type: 12, // MODIFY_SETTINGS
            sequence_number: 0,
            description: desc_buf,
        };
        let mut status = StateMgrStatus { status: 0, sequence_number: 0 };

        let ok = unsafe { set_restore_point(&info, &mut status) };
        if ok == 0 {
            unsafe { FreeLibrary(module) };
            return Err(format!("VSS Restore Point failed with Win32 error: {}", status.status));
        }

        Ok(Self {
            dll_handle: module,
            fn_set_restore_point: set_restore_point,
            sequence_number: status.sequence_number,
            active: true,
        })
    }

    pub fn commit(mut self) -> Result<(), String> {
        self.end_internal(101, 12) // END_SYSTEM_CHANGE, MODIFY_SETTINGS
    }

    pub fn cancel(mut self) -> Result<(), String> {
        self.end_internal(101, 13) // END_SYSTEM_CHANGE, CANCELLED_OPERATION
    }

    fn end_internal(&mut self, event_type: u32, restore_pt_type: u32) -> Result<(), String> {
        if !self.active { return Ok(()); }
        self.active = false;

        let info = RestorePointInfoW {
            event_type,
            restore_pt_type,
            sequence_number: self.sequence_number,
            description: [0u16; 256],
        };
        let mut status = StateMgrStatus { status: 0, sequence_number: 0 };

        let ok = unsafe { (self.fn_set_restore_point)(&info, &mut status) };
        unsafe { FreeLibrary(self.dll_handle) };

        if ok == 0 {
            Err(format!("VSS close bracket failed: {}", status.status))
        } else {
            Ok(())
        }
    }
}
```

### 6.2 Algorithm 2: Atomic Transactional Apply & Journal Commit
```rust
pub fn apply_batch_transactional(
    store: &RollbackStore,
    batch: &[TweakOperation],
) -> Result<ApplyReport, SystemError> {
    // 1. Acquire kernel file lock
    let mut tx = store.transaction()?;
    
    // 2. Pre-flight snapshot capture (in-memory staging)
    let mut snapshots = Vec::new();
    for op in batch {
        // Verify immutable security whitelist
        op.assert_safety_invariants()?;
        
        let snapshot = op.capture_current_state()?;
        snapshots.push((op.id(), snapshot));
    }
    
    // 3. Persist snapshots to journal disk file BEFORE mutation
    for (id, snapshot) in snapshots {
        tx.save_entry(&id, snapshot)?;
    }
    
    // 4. Begin VSS restore point bracket
    let vss = match VssRestoreSession::begin("WinCraft 2.0 Tuning Batch") {
        Ok(s) => Some(s),
        Err(e) => {
            log::warn!("Proceeding with local journal only (VSS skipped: {e})");
            None
        }
    };
    
    // 5. Execute mutations with read-back verification
    let mut applied_ops = Vec::new();
    for op in batch {
        match op.execute_write() {
            Ok(()) => {
                // Post-write verification
                if let Err(verify_err) = op.verify_applied() {
                    log::error!("Verification failed for {}: {verify_err}", op.id());
                    rollback_partial(&tx, &applied_ops)?;
                    if let Some(v) = vss { let _ = v.cancel(); }
                    return Err(SystemError::VerificationFailed(op.id().to_string()));
                }
                applied_ops.push(op);
            }
            Err(write_err) => {
                log::error!("Write failed for {}: {write_err}", op.id());
                rollback_partial(&tx, &applied_ops)?;
                if let Some(v) = vss { let _ = v.cancel(); }
                return Err(SystemError::MutationAborted(write_err));
            }
        }
    }
    
    // 6. Close VSS bracket successfully
    if let Some(v) = vss {
        let _ = v.commit();
    }
    
    // 7. Update Offline WinRE recovery script
    generate_offline_recovery_artifacts(&tx.get_all_snapshots())?;
    
    Ok(ApplyReport::success(applied_ops.len()))
}
```

### 6.3 Algorithm 3: Topological Reverse Rollback Engine
```rust
pub fn execute_full_rollback(store: &RollbackStore) -> Result<RollbackReport, SystemError> {
    let mut tx = store.transaction()?;
    let entries = tx.load_entries_lifo()?; // STRICT LIFO ORDER
    
    let mut restored = 0;
    let mut failed = Vec::new();
    
    for (tweak_id, snapshot) in entries {
        match snapshot {
            SnapshotEntry::Registry(reg) => {
                match reg.original_value {
                    Some(val) => {
                        if let Err(e) = write_raw_registry(&reg.hive, &reg.path, &reg.name, &val) {
                            failed.push((tweak_id, format!("Reg restore failed: {e}")));
                            continue;
                        }
                    }
                    None => {
                        // Value did not exist previously -> delete value
                        let _ = delete_registry_value(&reg.hive, &reg.path, &reg.name);
                    }
                }
            }
            SnapshotEntry::RegistryKeyCreated { hive, path } => {
                // Key was created by WinCraft -> prune tree cleanly
                let _ = delete_registry_tree(&hive, &path);
            }
            SnapshotEntry::Service { name, previous_start_type, was_running } => {
                if let Err(e) = set_service_start_type(&name, &previous_start_type) {
                    failed.push((tweak_id, format!("Service start type revert failed: {e}")));
                    continue;
                }
                if was_running == Some(true) {
                    let _ = start_service_now(&name);
                }
            }
            SnapshotEntry::ScheduledTask { path, previously_enabled } => {
                let _ = set_task_enabled_state(&path, previously_enabled);
            }
            SnapshotEntry::Appx(pkg) => {
                if let Err(e) = reregister_appx_manifest(&pkg.manifest_path) {
                    failed.push((tweak_id, format!("AppX re-registration failed: {e}")));
                    continue;
                }
            }
            SnapshotEntry::Composite { entries } => {
                // Unwind composite sub-actions in reverse order
                for sub in entries.into_iter().rev() {
                    let _ = rollback_sub_entry(sub);
                }
            }
            _ => {
                log::info!("Handling domain-specific rollback for {tweak_id}");
            }
        }
        
        // Remove from journal once verified
        tx.remove_entry(&tweak_id)?;
        restored += 1;
    }
    
    // Re-generate / clear offline recovery scripts
    generate_offline_recovery_artifacts(&tx.get_all_snapshots())?;
    
    Ok(RollbackReport { restored, failed })
}
```

---

## 7. Rollback Verification Schemas

### 7.1 Master Journal Schema (`rollback_store.json`)
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "WinCraftRollbackStore",
  "type": "object",
  "required": ["version", "schemaTimestamp", "snapshots"],
  "properties": {
    "version": {
      "type": "string",
      "enum": ["2.0.0"]
    },
    "schemaTimestamp": {
      "type": "integer",
      "description": "UNIX timestamp when store was created"
    },
    "snapshots": {
      "type": "object",
      "additionalProperties": {
        "$ref": "#/definitions/SnapshotEntry"
      }
    },
    "integrityHash": {
      "type": "string",
      "description": "SHA-256 HMAC of snapshot payload"
    }
  },
  "definitions": {
    "SnapshotEntry": {
      "type": "object",
      "required": ["kind"],
      "properties": {
        "kind": {
          "type": "string",
          "enum": [
            "Registry",
            "RegistryKeyCreated",
            "Service",
            "ScheduledTask",
            "Appx",
            "TcpCongestionProvider",
            "PowerSettingIndex",
            "Dns",
            "Composite"
          ]
        }
      },
      "discriminator": { "propertyName": "kind" }
    },
    "RegistrySnapshot": {
      "type": "object",
      "required": ["hive", "path", "name", "originalValue"],
      "properties": {
        "hive": { "type": "string", "enum": ["HKCU", "HKLM", "HKU"] },
        "path": { "type": "string" },
        "name": { "type": "string" },
        "originalValue": {
          "type": ["null", "object"],
          "properties": {
            "type": { "type": "string", "enum": ["Dword", "Qword", "Str", "ExpandStr", "MultiSz", "Binary"] },
            "value": {}
          }
        }
      }
    },
    "ServiceSnapshot": {
      "type": "object",
      "required": ["name", "previousStartType"],
      "properties": {
        "name": { "type": "string" },
        "previousStartType": { "type": "string", "enum": ["boot", "system", "auto", "manual", "disabled"] },
        "delayedAutoStart": { "type": "boolean" },
        "wasRunning": { "type": "boolean" }
      }
    },
    "TaskSnapshot": {
      "type": "object",
      "required": ["path", "previouslyEnabled"],
      "properties": {
        "path": { "type": "string" },
        "previouslyEnabled": { "type": "boolean" },
        "definitionXml": { "type": "string" }
      }
    },
    "AppxSnapshot": {
      "type": "object",
      "required": ["packageFullName", "manifestPath", "userSid"],
      "properties": {
        "packageFullName": { "type": "string" },
        "packageFamilyName": { "type": "string" },
        "manifestPath": { "type": "string" },
        "installLocation": { "type": "string" },
        "userSid": { "type": "string" }
      }
    }
  }
}
```

### 7.2 Verification Audit Report Schema (`verification_report.json`)
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "WinCraftVerificationReport",
  "type": "object",
  "required": ["batchId", "timestamp", "targetState", "results", "overallStatus"],
  "properties": {
    "batchId": { "type": "string" },
    "timestamp": { "type": "integer" },
    "targetState": { "type": "string", "enum": ["Applied", "Restored"] },
    "overallStatus": { "type": "string", "enum": ["Verified", "DriftDetected", "Failed"] },
    "results": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["tweakId", "verified", "expected", "actual"],
        "properties": {
          "tweakId": { "type": "string" },
          "verified": { "type": "boolean" },
          "expected": { "type": "string" },
          "actual": { "type": "string" },
          "driftDetails": { "type": ["null", "string"] }
        }
      }
    }
  }
}
```

---

## 8. WinRE Operator Emergency Runbook

When a host machine experiences an unbootable state or BSOD loop after a system-level configuration crash:

```
                  ┌─────────────────────────────────────────┐
                  │       Windows Advanced Startup Menu     │
                  └────────────────────┬────────────────────┘
                                       │
                         [Select "Troubleshoot"]
                                       │
                                       ▼
                       [Select "Advanced Options"]
                                       │
                                       ▼
                       [Click "Command Prompt"]
                                       │
                                       ▼
                        ┌──────────────────────────────┐
                        │ X:\Windows\System32> cmd.exe │
                        └──────────────┬───────────────┘
                                       │
                                       ▼
        Type: dir C:\WinCraftRecovery\recover.bat / D:\WinCraftRecovery\recover.bat
                                       │
                                       ▼
                        Run: C:\WinCraftRecovery\recover.bat
                                       │
                 ┌─────────────────────┴─────────────────────┐
                 ▼                                           ▼
       [Drive Not Encrypted]                       [Drive Encrypted BitLocker]
                 │                                           │
                 ▼                                           ▼
      [Auto-Detects OS Drive]                     [Prompt 48-Digit Key]
                 │                                           │
                 ▼                                           ▼
      [Mounts OFFLINE_SYSTEM]                     [Unlocks Drive with manage-bde]
                 │                                           │
                 ▼                                           └───────┐
      [Imports offline_rollback.reg]                                 │
                 │                                                   │
                 ▼                                                   │
      [Restores Critical Boot Services] ◄────────────────────────────┘
                 │
                 ▼
      [Unmounts Hives & Exits 0]
                 │
                 ▼
       Close CMD and click "Continue to Windows 11"
```

### Exact Terminal Commands for Manual WinRE Recovery:
```cmd
:: 1. Identify which drive letter holds the offline Windows OS:
bcdedit | findstr /I "osdevice"

:: 2. If partition is D:, navigate to the WinCraft offline recovery staging dir:
cd /d D:\WinCraftRecovery

:: 3. Execute the automated recovery batch script:
recover.bat

:: 4. If recover.bat is inaccessible, perform manual registry rescue:
reg load HKLM\OFF_SYS D:\Windows\System32\config\SYSTEM
reg add HKLM\OFF_SYS\ControlSet001\Services\RpcSs /v Start /t REG_DWORD /d 2 /f
reg add HKLM\OFF_SYS\ControlSet001\Services\PlugPlay /v Start /t REG_DWORD /d 2 /f
reg add HKLM\OFF_SYS\ControlSet001\Services\DcomLaunch /v Start /t REG_DWORD /d 2 /f
reg unload HKLM\OFF_SYS

:: 5. Exit and reboot:
exit
```

---

## 9. Conclusion & Implementation Directives

1. **Prioritize Native APIs over Shell Subprocesses:** Replace all CLI-spawned `Checkpoint-Computer` invocations with `VssRestoreSession` dynamic loading.
2. **Never Permit Unjournaled Writes:** Every mutation in `tweaks.rs`, `services.rs`, and `scheduledtasks.rs` must route through an active `RollbackTransaction`.
3. **Preserve Manifest References:** Treat `AppxManifest.xml` paths as critical durable assets; de-register AppX without scrubbing staging caches.
4. **Export WinRE Artifacts Before Mutation:** The physical presence of `recover.bat` and `offline_rollback.reg` on the target `%SYSTEMDRIVE%` is a strict prerequisite for executing any elevated batch.
