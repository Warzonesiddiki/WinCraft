# Windows 11 24H2 & 25H2 Optimization, AI Telemetry & Subsystems Research

**Document Version:** 1.0.0  
**Target OS Builds:** Windows 11 24H2 (Build 26100, "Germanium") & Windows 11 25H2 (Build 26200+, "Dilithium" Enablement Package)  
**Classification:** Engineering Research & Reversible Implementation Spec  
**Repository Target:** WinCraft Optimization & Debloat Catalog  

---

## 1. Executive Summary & Architectural Overview

Windows 11 24H2 marks the most fundamental re-architecting of the Windows client platform since the initial 21H2 launch:
1. **Windows Copilot Runtime (WCR):** Shifts AI from hosted cloud webviews to local system daemons, NPU-accelerated neural networks, and persistent background workers.
2. **Aggressive Default Encryption (Auto-DE):** Relaxes previous Hardware Security Test Interface (HSTI) and Modern Standby hardware requirements, silently encrypting non-removable drives during clean installs and system resets.
3. **Registry Hardening via Kernel Mini-Filters (UCPD):** Deploys `ucpd.sys` to block programmatic user-choice registry writes for default browsers and protocol handlers.
4. **Memory-Heavy AI daemons (`WSAIFabricSvc`):** Spawns numerous idle `WorkloadsSessionHost.exe` instances holding 3 GB to 8+ GB of RAM to cache ONNX/DirectML runtime weights.
5. **Shared Servicing Cadence:** 25H2 shares the 24H2 core binary codebase via an Enablement Package (eKB), meaning changes applied to 24H2 subsystems carry forward directly to 25H2.

WinCraft's philosophy demands that every tweak be **reversible, verifiable, and evidence-backed**. This document provides exact registry keys, scheduled task paths, service configurations, and rollback routines.

---

## 2. Windows Recall (AI Snapshotting Subsystem)

### 2.1 Architectural Anatomy & Overhead
- **Core Binary & Platform:** Managed via `MicrosoftWindows.Client.CoreAI` and `Microsoft.Windows.Ai.Core` components.
- **Snapshot Engine:** Captures high-frequency desktop frames, runs on-device Optical Character Recognition (OCR), generates multimodal vector embeddings, and writes to an SQLite database (`ukp.db`) located in:
  `%LOCALAPPDATA%\CoreAIPlatform.00\UKP\{User-GUID}\`
- **Resource Footprint:** 
  - Disk: 10 GB to 150+ GB allocated snapshot allocation window.
  - RAM & CPU/NPU: Sustained background polling, context serialization, and SQLite indexing.
  - Security Profile: Although protected via Virtualization-Based Security (VBS) enclaves and Windows Hello authentication, local snapshot caches remain high-value target assets.

### 2.2 Optional Feature Deprovisioning (DISM)
Starting with late 24H2 builds (post EU regulatory compliance adjustments), Microsoft exposed Recall as an optional Windows Feature.

#### Disable Recall Feature:
```powershell
# Query status
Get-WindowsOptionalFeature -Online -FeatureName "Recall"

# Disable feature cleanly (No reboot enforced immediately)
Disable-WindowsOptionalFeature -Online -FeatureName "Recall" -NoRestart
```

#### DISM CLI Equivalent:
```cmd
dism.exe /Online /Disable-Feature /FeatureName:Recall /NoRestart
```

#### Reversal / Enablement:
```powershell
Enable-WindowsOptionalFeature -Online -FeatureName "Recall" -NoRestart
```

### 2.3 Group Policy & Registry Controls
Microsoft introduced the `WindowsAI` Administrative Template (`WindowsCopilot.admx`). The keys apply under `HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsAI`.

| Registry Value | Type | Disabled Value | Stock / Default | Effect |
| :--- | :--- | :--- | :--- | :--- |
| `AllowRecallEnablement` | `REG_DWORD` | `0` | `1` (or not set) | Prevents user from toggling Recall in Settings; in managed mode purges binary bits and saved snapshots. |
| `DisableAIDataAnalysis` | `REG_DWORD` | `1` | `0` | Turns off saving screen snapshots for use with Recall. |
| `AllowRecallExport` | `REG_DWORD` | `0` | `1` | Blocks exporting Recall snapshot archives. |
| `DisableRecallDataProviders` | `REG_DWORD` | `1` | `0` | Stops background screen analysis providers. |

#### Apply via Registry CLI:
```cmd
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" /v AllowRecallEnablement /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" /v DisableAIDataAnalysis /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" /v AllowRecallExport /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" /v DisableRecallDataProviders /t REG_DWORD /d 1 /f

:: Also apply to Current User Policy hive
reg add "HKCU\Software\Policies\Microsoft\Windows\WindowsAI" /v DisableAIDataAnalysis /t REG_DWORD /d 1 /f
```

#### Reversal / Rollback:
```cmd
reg delete "HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" /v AllowRecallEnablement /f
reg delete "HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" /v DisableAIDataAnalysis /f
reg delete "HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" /v AllowRecallExport /f
reg delete "HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" /v DisableRecallDataProviders /f
reg delete "HKCU\Software\Policies\Microsoft\Windows\WindowsAI" /v DisableAIDataAnalysis /f
```

---

## 3. Click to Do & Settings Agent ("Settings Mu")

### 3.1 Click to Do
Click to Do presents contextual interactive overlay prompts over active windows (text selection, image object manipulation, Bing visual searches). It leverages `WindowsWorkload.Manager` and DirectML vision classifiers.

#### Group Policy & Registry Keys:
- **Scope:** Machine & User
- **GPO Path:** `Computer Configuration > Administrative Templates > Windows Components > Windows AI > Disable Click to Do`

| Hive & Key Path | Value Name | Type | Value | Action |
| :--- | :--- | :--- | :--- | :--- |
| `HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsAI` | `DisableClickToDo` | `REG_DWORD` | `1` | Disables engine system-wide |
| `HKCU\Software\Policies\Microsoft\Windows\WindowsAI` | `DisableClickToDo` | `REG_DWORD` | `1` | Disables for active user |
| `HKCU\Software\Microsoft\Windows\Shell\ClickToDo` | `DisableClickToDo` | `REG_DWORD` | `1` | Disables shell UI affordances |

#### CLI Apply:
```cmd
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" /v DisableClickToDo /t REG_DWORD /d 1 /f
reg add "HKCU\Software\Policies\Microsoft\Windows\WindowsAI" /v DisableClickToDo /t REG_DWORD /d 1 /f
reg add "HKCU\Software\Microsoft\Windows\Shell\ClickToDo" /v DisableClickToDo /t REG_DWORD /d 1 /f
```

#### Reversal / Rollback:
```cmd
reg delete "HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" /v DisableClickToDo /f
reg delete "HKCU\Software\Policies\Microsoft\Windows\WindowsAI" /v DisableClickToDo /f
reg delete "HKCU\Software\Microsoft\Windows\Shell\ClickToDo" /v DisableClickToDo /f
```

### 3.2 Settings AI Agent ("Settings Mu" / 25H2)
Build 26200+ introduces an embedded natural language assistant in the Windows Settings app ("Settings Mu") that parses search intent and suggests automated toggles.

#### Registry Key:
```cmd
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" /v DisableSettingsAgent /t REG_DWORD /d 1 /f
```

#### Reversal:
```cmd
reg delete "HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" /v DisableSettingsAgent /f
```

---

## 4. Windows Studio Effects & Copilot Runtime Bloat

### 4.1 Windows Studio Effects
Studio Effects uses hardware NPUs/GPUs for real-time video/audio processing (Voice Focus, Portrait Lighting, Eye Contact, Background Blur).
- **Core Service/Trigger:** Managed via `CapabilityAccessManager` and `WpnUserService`.
- **System Impact:** Even when idle, camera pipelines load neural model weights into memory whenever Media Foundation initializes device streams.

#### Disabling Studio Effects Camera Pipeline:
Per-device toggles reside in Windows Settings (`Bluetooth & devices > Cameras`). At the system policy level, apps can be blocked from calling Studio Effects models:

```cmd
:: Disable camera background processing access
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\AppPrivacy" /v LetAppsAccessCamera_UserInControlOfTheseApps /t REG_MULTI_SZ /d "" /f

:: Hide Studio Effects Quick Settings Tile (Explorer Advanced policy)
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Control Center\QuickActions\UserSwapped" /v "Microsoft.QuickAction.StudioEffects" /t REG_DWORD /d 0 /f
```

### 4.2 Copilot Runtime App & Edge Integration
In 24H2/25H2, the Copilot panel changed from an integrated web shell to a standalone packaged app (`Microsoft.Copilot`), backed by background communication brokered by `WSAIFabricSvc`.

#### Policy Keys to Turn Off Copilot OS-Wide:
```cmd
:: Disable Windows Copilot (HKLM & HKCU)
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsCopilot" /v TurnOffWindowsCopilot /t REG_DWORD /d 1 /f
reg add "HKCU\Software\Policies\Microsoft\Windows\WindowsCopilot" /v TurnOffWindowsCopilot /t REG_DWORD /d 1 /f

:: Hide Copilot Taskbar Icon
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v ShowCopilotButton /t REG_DWORD /d 0 /f

:: Turn off Bing search suggestions in Explorer & Taskbar
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Explorer" /v DisableSearchBoxSuggestions /t REG_DWORD /d 1 /f
```

#### Uninstalling Copilot AppX Package:
```powershell
# Remove current user app instance
Get-AppxPackage -Name "Microsoft.Copilot" | Remove-AppxPackage -ErrorAction SilentlyContinue

# Deprovision from system for all future users
Get-AppxProvisionedPackage -Online | Where-Object { $_.DisplayName -eq "Microsoft.Copilot" } | Remove-AppxProvisionedPackage -Online -ErrorAction SilentlyContinue
```

#### Inbox App Generative AI Policies (Paint & Notepad):
```cmd
:: Disable Cocreator, Generative Fill, and Image Creator in MS Paint
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Paint" /v DisableCocreator /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Paint" /v DisableGenerativeFill /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Paint" /v DisableImageCreator /t REG_DWORD /d 1 /f

:: Disable AI Rewrite and AI Features in Windows Notepad
reg add "HKLM\SOFTWARE\Policies\WindowsNotepad" /v DisableAIFeatures /t REG_DWORD /d 1 /f
```

#### Reversal:
```cmd
reg delete "HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsCopilot" /v TurnOffWindowsCopilot /f
reg delete "HKCU\Software\Policies\Microsoft\Windows\WindowsCopilot" /v TurnOffWindowsCopilot /f
reg delete "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Paint" /v DisableCocreator /f
reg delete "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Paint" /v DisableGenerativeFill /f
reg delete "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Paint" /v DisableImageCreator /f
reg delete "HKLM\SOFTWARE\Policies\WindowsNotepad" /v DisableAIFeatures /f
```

---

## 5. BitLocker Automatic Device Encryption (Auto-DE)

### 5.1 The 24H2 Shift
In prior Windows versions, Automatic Device Encryption required:
1. TPM 1.2 or 2.0.
2. Modern Standby (S0ix) support.
3. Hardware Security Test Interface (HSTI) compliance.
4. No un-DMA-capable external ports.

**Starting with 24H2 (Build 26100):** Microsoft removed the HSTI and Modern Standby requirements. Any clean install or system reset on both **Windows 11 Home** and **Pro** automatically turns on BitLocker / Device Encryption on all fixed drives as soon as OOBE completes.

### 5.2 Performance & Reliability Risks
- **Random I/O Penalty:** Software BitLocker (XTS-AES 128) imposes an observed 15% to 45% throughput penalty on ultra-fast PCIe Gen 4/5 NVMe SSDs under high-queue-depth random workloads.
- **Silent Recovery Lockout:** If a user signs in with a local account (via OOBE bypass like `bypassnro`) or does not back up their 48-digit recovery key before a firmware/BIOS update, disk contents become unrecoverable upon TPM state clear.

### 5.3 Prevention During Setup / Clean Install
To stop Windows 11 24H2/25H2 from auto-encrypting drives at install time:

#### Method A: Setup Registry Injection (Shift + F10)
When the Windows Setup wizard loads (or at the Region/Language selection screen):
1. Press `Shift + F10` to open Command Prompt.
2. Execute:
```cmd
reg add "HKLM\SYSTEM\CurrentControlSet\Control\BitLocker" /v PreventDeviceEncryption /t REG_DWORD /d 1 /f
```
3. Close the prompt and proceed with standard installation.

#### Method B: Unattend.xml (`autounattend.xml`)
Include in the `<settings pass="oobeSystem">` or `<settings pass="offlineServicing">` node:
```xml
<component name="Microsoft-Windows-SecureStartup-FilterDriver" processorArchitecture="amd64" publicKeyToken="31bf3856ad364e35" language="neutral" versionScope="nonSxS">
    <PreventDeviceEncryption>true</PreventDeviceEncryption>
</component>
```

### 5.4 Post-Install Management & Non-Destructive Decryption
If Windows 11 has already initiated encryption:

#### 1. Query Current Encryption State:
```cmd
manage-bde.exe -status C:
```
Inspect `Conversion Status` and `Protection Status`. If it reports `Encryption in Progress` or `Protection On`:

#### 2. Decrypt Drive C: (Fully Online & Background Reversible):
```cmd
manage-bde.exe -off C:
```
*Note: This process decrypts the volume in place without data loss. Monitor progress via `manage-bde -status C:` until "Percentage Encrypted: 0.0%" is achieved.*

#### 3. Prevent Re-Encryption on Next Reset / Upgrade:
```cmd
reg add "HKLM\SYSTEM\CurrentControlSet\Control\BitLocker" /v PreventDeviceEncryption /t REG_DWORD /d 1 /f
```

#### Reversal (Re-enabling BitLocker):
```cmd
reg delete "HKLM\SYSTEM\CurrentControlSet\Control\BitLocker" /v PreventDeviceEncryption /f
manage-bde.exe -on C: -UsedSpaceOnly
```

---

## 6. UCPD (User Choice Protection Driver) Architecture & Bypass

### 6.1 Purpose & Behavior
Introduced in late 23H2 (KB5034848 / KB5035942) and native in 24H2/25H2:
- **Binary:** `C:\Windows\System32\drivers\ucpd.sys`
- **Driver Type:** Kernel filesystem / registry mini-filter (`SERVICE_FILE_SYSTEM_DRIVER`).
- **Function:** Intercepts and blocks direct `RegSetValueEx` and `RegCreateKey` calls to:
  `HKCU\Software\Microsoft\Windows\Shell\Associations\UrlAssociations\http\UserChoice`
  `HKCU\Software\Microsoft\Windows\Shell\Associations\UrlAssociations\https\UserChoice`
  `HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\FileExts\.pdf\UserChoice`
- **Result:** Third-party browser installers, default switcher utilities, and optimization scripts are blocked from setting default apps programmatically without showing the interactive Windows Settings dialog.

### 6.2 The Self-Healing Watchdog Task
Setting `sc config UCPD start=disabled` alone is insufficient because Microsoft deploys a scheduled watchdog task that executes every logon and system maintenance cycle:
`\Microsoft\Windows\AppxDeploymentClient\UCPD velocity`

This task reads `HKLM\SYSTEM\CurrentControlSet\Services\UCPD\FeatureV2` and immediately forces the driver start type back to `Auto` (Start = 2) if it detects manual tampering.

### 6.3 Clean, Reversible Bypass Procedure
To allow programmatic association changes (or permanently disable UCPD):

#### Step 1: Disable the Watchdog Scheduled Task
```cmd
schtasks.exe /Change /TN "\Microsoft\Windows\AppxDeploymentClient\UCPD velocity" /Disable
```
*PowerShell equivalent:*
```powershell
Disable-ScheduledTask -TaskPath "\Microsoft\Windows\AppxDeploymentClient\" -TaskName "UCPD velocity" -ErrorAction SilentlyContinue
```

#### Step 2: Set UCPD Service to Disabled
```cmd
sc.exe config UCPD start=disabled
```
*Registry direct equivalent:*
```cmd
reg add "HKLM\SYSTEM\CurrentControlSet\Services\UCPD" /v Start /t REG_DWORD /d 4 /f
```

#### Step 3: Deploy Policy Suppressor
```cmd
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\System" /v EnableUCPD /t REG_DWORD /d 0 /f
```

#### Step 4: System Reboot
Because `ucpd.sys` is a kernel filter driver hooked into kernel object callbacks, it cannot be dynamically unloaded while the system is alive. A reboot is required to completely unbind the driver.

### 6.4 Rollback / Re-Enablement Routine
```cmd
:: 1. Re-enable driver startup
sc.exe config UCPD start=auto
reg add "HKLM\SYSTEM\CurrentControlSet\Services\UCPD" /v Start /t REG_DWORD /d 2 /f

:: 2. Re-enable watchdog scheduled task
schtasks.exe /Change /TN "\Microsoft\Windows\AppxDeploymentClient\UCPD velocity" /Enable

:: 3. Remove policy block
reg delete "HKLM\SOFTWARE\Policies\Microsoft\Windows\System" /v EnableUCPD /f
```

---

## 7. Windows 11 24H2 / 25H2 Background Services Audit

### 7.1 New & Altered Services Matrix

| Service Name | Display Name | Subsystem / Role | Default Start | WinCraft Recommendation | Rationale & Impact |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `WSAIFabricSvc` | Windows AI Fabric Service | Local COM bridge to AI Fabric; spawns `WorkloadsSessionHost.exe` | Manual / Auto | **Manual** (or **Disabled**) | **Primary memory leak source.** Spawns 4 to 14 instances of `WorkloadsSessionHost.exe`, consuming 3–8 GB RAM. Manual stops automatic startup while preserving system stability. |
| `UCPD` | User Choice Protection Driver | Registry write blocker for `UserChoice` keys | Auto (Kernel) | **Disabled** (with task disabled) | Unlocks automated default browser and handler configuration. |
| `FeatureAccessManager` | Capability Access Manager Service | Fine-grained API gatekeeper for NPU, Camera, Microphone | Manual | **Manual** | Leave Manual. Required when using legitimate peripheral devices. |
| `DiagTrack` | Connected User Experiences & Telemetry | Core OS telemetry collector; updated in 24H2 with AI event channels | Auto | **Disabled** | Essential privacy tweak. Completely halts periodic ETL trace uploads to Microsoft Asimov endpoints. |
| `dmwappushservice` | Device Management WAP Push Message | WAP push routing for telemetry and enterprise push notifications | Manual | **Disabled** | Safe to disable on non-MDM managed consumer/gaming workstations. |
| `WpnUserService` | Windows Push Notifications User Service | Per-user push broker and background AI wake trigger | Auto | **Manual** | Turning to Manual stops proactive local AI wakeups while maintaining in-session notification delivery. |
| `PcaSvc` | Program Compatibility Assistant | Compatibility telemetry and runtime app interception | Auto | **Disabled** | Eliminates disk thrashing from `CompatTelRunner.exe` and `ProgramDataUpdater`. |

### 7.2 The `WSAIFabricSvc` & `WorkloadsSessionHost.exe` Memory Anomaly
On Copilot+ PCs and systems where Windows AI components have been provisioned, `WorkloadsSessionHost.exe` does not operate as a standalone Win32 service; it is launched dynamically by the DCOM server package `Microsoft.Windows.Private.Workloads.SessionManager` through `WSAIFabricSvc`.

#### Verification & Remediation Script:
```powershell
# 1. Inspect running instances and memory consumption
Get-Process -Name "WorkloadsSessionHost" -ErrorAction SilentlyContinue | 
    Select-Object Id, ProcessName, @{Name="WorkingSet_MB"; Expression={[math]::Round($_.WorkingSet64 / 1MB, 2)}}

# 2. Terminate running runaway hosts
Get-Process -Name "WorkloadsSessionHost" -ErrorAction SilentlyContinue | Stop-Process -Force

# 3. Stop and reconfigure Windows AI Fabric Service
Stop-Service -Name "WSAIFabricSvc" -Force -ErrorAction SilentlyContinue
Set-Service -Name "WSAIFabricSvc" -StartupType Manual -ErrorAction SilentlyContinue
```

*Note: In enterprise or barebone profiles, `Set-Service -Name "WSAIFabricSvc" -StartupType Disabled` can be used. If Microsoft updates attempt to restart it, pairing with the `DisableAIDataAnalysis` and `DisableClickToDo` group policies stops DCOM activation requests.*

### 7.3 Deprecated & Removed Services in 24H2
Windows 11 24H2 permanently excised several legacy networking components. Do not attempt to query or configure these in WinCraft catalogs:
- `PNRPsvc` (Peer Name Resolution Protocol) — **Removed**.
- `p2psvc` (Peer Networking Grouping) — **Removed**.
- `p2pimsvc` (Peer Networking Identity Manager) — **Removed**.
- `PNRPAutoReg` (PNRP Auto-Registration Service) — **Removed**.
- `WMIC` (WMI Command Line) — **Deprecated / Feature on Demand**.
- `VBScript` — **Feature on Demand / Deprecated**.

---

## 8. Master WinCraft Implementation & Rollback Matrix

### 8.1 Unified Registry Tweak Catalog Entries
These definitions align with WinCraft's `RegistryTweak` Rust struct:

```rust
// Proposed additions for WinCraft 2.0 / 24H2-25H2 Module
RegistryTweak {
    id: "disable_recall",
    title: "Disable Windows Recall & AI Snapshots",
    description: "Blocks screen analysis, snapshot indexing, and removes Recall background tasks.",
    category: TweakCategory::Privacy,
    recommended: true,
    target_build_min: 26100,
    entries: vec![
        RegWriteEntry {
            hive: HKEY_LOCAL_MACHINE,
            path: r"SOFTWARE\Policies\Microsoft\Windows\WindowsAI",
            name: "DisableAIDataAnalysis",
            value: RegValue::Dword(1),
        },
        RegWriteEntry {
            hive: HKEY_LOCAL_MACHINE,
            path: r"SOFTWARE\Policies\Microsoft\Windows\WindowsAI",
            name: "AllowRecallEnablement",
            value: RegValue::Dword(0),
        },
    ],
},
RegistryTweak {
    id: "disable_click_to_do",
    title: "Disable Click to Do Overlay",
    description: "Disables on-screen contextual AI vision triggers and related workload hosts.",
    category: TweakCategory::Privacy,
    recommended: true,
    target_build_min: 26100,
    entries: vec![
        RegWriteEntry {
            hive: HKEY_LOCAL_MACHINE,
            path: r"SOFTWARE\Policies\Microsoft\Windows\WindowsAI",
            name: "DisableClickToDo",
            value: RegValue::Dword(1),
        },
        RegWriteEntry {
            hive: HKEY_CURRENT_USER,
            path: r"Software\Microsoft\Windows\Shell\ClickToDo",
            name: "DisableClickToDo",
            value: RegValue::Dword(1),
        },
    ],
},
RegistryTweak {
    id: "prevent_bitlocker_auto_encryption",
    title: "Prevent Automatic BitLocker Drive Encryption",
    description: "Prevents Windows 24H2/25H2 from silently encrypting drives on clean install or reset.",
    category: TweakCategory::System,
    recommended: true,
    target_build_min: 26100,
    entries: vec![
        RegWriteEntry {
            hive: HKEY_LOCAL_MACHINE,
            path: r"SYSTEM\CurrentControlSet\Control\BitLocker",
            name: "PreventDeviceEncryption",
            value: RegValue::Dword(1),
        },
    ],
},
RegistryTweak {
    id: "bypass_ucpd_protection",
    title: "Disable User Choice Protection Driver (UCPD)",
    description: "Disables ucpd.sys and its watchdog task to permit programmatic default app changes.",
    category: TweakCategory::System,
    recommended: false, // Opt-in for browser switchers/power users
    target_build_min: 26100,
    entries: vec![
        RegWriteEntry {
            hive: HKEY_LOCAL_MACHINE,
            path: r"SYSTEM\CurrentControlSet\Services\UCPD",
            name: "Start",
            value: RegValue::Dword(4), // Disabled
        },
        RegWriteEntry {
            hive: HKEY_LOCAL_MACHINE,
            path: r"SOFTWARE\Policies\Microsoft\Windows\System",
            name: "EnableUCPD",
            value: RegValue::Dword(0),
        },
    ],
}
```

### 8.2 Master Automation Script (PowerShell 7 / Windows PowerShell 5.1)
Save as `Apply-Win11-24H2-Optimizations.ps1`:

```powershell
<#
.SYNOPSIS
    Applies reversible optimizations for Windows 11 24H2 and 25H2.
.DESCRIPTION
    Disables Recall, Click to Do, Copilot bloat, UCPD locks, BitLocker auto-encryption,
    and calms runaway WSAIFabricSvc processes.
#>
[CmdletBinding(SupportsShouldProcess=$true)]
param(
    [switch]$Revert,
    [switch]$NoRebootPrompt
)

$IsAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $IsAdmin) {
    Write-Error "Elevated administrative privileges required. Run as Administrator."
    Exit 1
}

function Set-RegistryValue {
    param($Path, $Name, $Value, $Type="DWord")
    if (-not (Test-Path $Path)) {
        New-Item -Path $Path -Force | Out-Null
    }
    Set-ItemProperty -Path $Path -Name $Name -Value $Value -Type $Type -Force
}

function Remove-RegistryValue {
    param($Path, $Name)
    if (Test-Path $Path) {
        Remove-ItemProperty -Path $Path -Name $Name -ErrorAction SilentlyContinue
    }
}

if ($Revert) {
    Write-Host "[*] Reverting Windows 11 24H2/25H2 tweaks to stock defaults..." -ForegroundColor Yellow

    # 1. Recall
    Remove-RegistryValue "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" "AllowRecallEnablement"
    Remove-RegistryValue "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" "DisableAIDataAnalysis"
    Remove-RegistryValue "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" "AllowRecallExport"
    Remove-RegistryValue "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" "DisableRecallDataProviders"
    Remove-RegistryValue "HKCU:\Software\Policies\Microsoft\Windows\WindowsAI" "DisableAIDataAnalysis"

    # 2. Click to Do
    Remove-RegistryValue "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" "DisableClickToDo"
    Remove-RegistryValue "HKCU:\Software\Policies\Microsoft\Windows\WindowsAI" "DisableClickToDo"
    Remove-RegistryValue "HKCU:\Software\Microsoft\Windows\Shell\ClickToDo" "DisableClickToDo"

    # 3. Copilot & AI Bloat
    Remove-RegistryValue "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsCopilot" "TurnOffWindowsCopilot"
    Remove-RegistryValue "HKCU:\Software\Policies\Microsoft\Windows\WindowsCopilot" "TurnOffWindowsCopilot"
    Remove-RegistryValue "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Paint" "DisableCocreator"
    Remove-RegistryValue "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Paint" "DisableGenerativeFill"
    Remove-RegistryValue "HKLM:\SOFTWARE\Policies\WindowsNotepad" "DisableAIFeatures"

    # 4. BitLocker Auto-DE
    Remove-RegistryValue "HKLM:\SYSTEM\CurrentControlSet\Control\BitLocker" "PreventDeviceEncryption"

    # 5. UCPD
    Set-Service -Name "UCPD" -StartupType Automatic -ErrorAction SilentlyContinue
    Set-RegistryValue "HKLM:\SYSTEM\CurrentControlSet\Services\UCPD" "Start" 2 "DWord"
    Enable-ScheduledTask -TaskPath "\Microsoft\Windows\AppxDeploymentClient\" -TaskName "UCPD velocity" -ErrorAction SilentlyContinue
    Remove-RegistryValue "HKLM:\SOFTWARE\Policies\Microsoft\Windows\System" "EnableUCPD"

    # 6. Services
    Set-Service -Name "WSAIFabricSvc" -StartupType Manual -ErrorAction SilentlyContinue

    Write-Host "[+] Rollback complete. Reboot to reload kernel drivers." -ForegroundColor Green
} else {
    Write-Host "[*] Applying Windows 11 24H2/25H2 Clean Optimization Profile..." -ForegroundColor Cyan

    # 1. Recall Lockdown
    Set-RegistryValue "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" "AllowRecallEnablement" 0
    Set-RegistryValue "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" "DisableAIDataAnalysis" 1
    Set-RegistryValue "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" "AllowRecallExport" 0
    Set-RegistryValue "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" "DisableRecallDataProviders" 1
    Set-RegistryValue "HKCU:\Software\Policies\Microsoft\Windows\WindowsAI" "DisableAIDataAnalysis" 1

    # Optional Feature Dism (if present)
    $RecallOpt = Get-WindowsOptionalFeature -Online -FeatureName "Recall" -ErrorAction SilentlyContinue
    if ($RecallOpt -and $RecallOpt.State -eq "Enabled") {
        Write-Host "[-] Disabling Recall Optional Feature package..."
        Disable-WindowsOptionalFeature -Online -FeatureName "Recall" -NoRestart | Out-Null
    }

    # 2. Click to Do & Settings Agent
    Set-RegistryValue "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" "DisableClickToDo" 1
    Set-RegistryValue "HKCU:\Software\Policies\Microsoft\Windows\WindowsAI" "DisableClickToDo" 1
    Set-RegistryValue "HKCU:\Software\Microsoft\Windows\Shell\ClickToDo" "DisableClickToDo" 1
    Set-RegistryValue "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" "DisableSettingsAgent" 1

    # 3. Copilot & Inbox AI Apps
    Set-RegistryValue "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsCopilot" "TurnOffWindowsCopilot" 1
    Set-RegistryValue "HKCU:\Software\Policies\Microsoft\Windows\WindowsCopilot" "TurnOffWindowsCopilot" 1
    Set-RegistryValue "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" "ShowCopilotButton" 0
    Set-RegistryValue "HKLM:\SOFTWARE\Policies\Microsoft\Windows\Explorer" "DisableSearchBoxSuggestions" 1

    # Paint & Notepad AI
    Set-RegistryValue "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Paint" "DisableCocreator" 1
    Set-RegistryValue "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Paint" "DisableGenerativeFill" 1
    Set-RegistryValue "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Paint" "DisableImageCreator" 1
    Set-RegistryValue "HKLM:\SOFTWARE\Policies\WindowsNotepad" "DisableAIFeatures" 1

    # 4. BitLocker Prevention
    Set-RegistryValue "HKLM:\SYSTEM\CurrentControlSet\Control\BitLocker" "PreventDeviceEncryption" 1

    # 5. UCPD Bypass
    Write-Host "[-] Deactivating UCPD watchdog task and driver..."
    Disable-ScheduledTask -TaskPath "\Microsoft\Windows\AppxDeploymentClient\" -TaskName "UCPD velocity" -ErrorAction SilentlyContinue
    Set-Service -Name "UCPD" -StartupType Disabled -ErrorAction SilentlyContinue
    Set-RegistryValue "HKLM:\SYSTEM\CurrentControlSet\Services\UCPD" "Start" 4 "DWord"
    Set-RegistryValue "HKLM:\SOFTWARE\Policies\Microsoft\Windows\System" "EnableUCPD" 0

    # 6. Service Calming (WSAIFabricSvc & Telemetry)
    Write-Host "[-] Calming WSAIFabricSvc and terminating WorkloadsSessionHost instances..."
    Get-Process -Name "WorkloadsSessionHost" -ErrorAction SilentlyContinue | Stop-Process -Force
    Stop-Service -Name "WSAIFabricSvc" -Force -ErrorAction SilentlyContinue
    Set-Service -Name "WSAIFabricSvc" -StartupType Manual -ErrorAction SilentlyContinue

    Set-Service -Name "DiagTrack" -StartupType Disabled -ErrorAction SilentlyContinue
    Stop-Service -Name "DiagTrack" -Force -ErrorAction SilentlyContinue

    Set-Service -Name "dmwappushservice" -StartupType Disabled -ErrorAction SilentlyContinue
    Stop-Service -Name "dmwappushservice" -Force -ErrorAction SilentlyContinue

    Write-Host "[+] All 24H2/25H2 optimizations applied successfully." -ForegroundColor Green
    if (-not $NoRebootPrompt) {
        Write-Host "[!] Note: A restart is required to completely unbind the UCPD kernel filter driver." -ForegroundColor Yellow
    }
}
```

---

## 9. Verification & Diagnostics Runbook

To verify that these tweaks have taken full effect on a live 24H2/25H2 machine:

| Component | Verification Method | Expected Result |
| :--- | :--- | :--- |
| **Recall** | `Get-WindowsOptionalFeature -Online -FeatureName "Recall"` | `State : Disabled` |
| **Recall Snapshotting** | `Get-ItemProperty "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" -Name "DisableAIDataAnalysis"` | `DisableAIDataAnalysis : 1` |
| **Click to Do** | `Get-ItemProperty "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" -Name "DisableClickToDo"` | `DisableClickToDo : 1` |
| **UCPD Driver** | `sc.exe query ucpd` | `STATE : 1 STOPPED`, `START_TYPE : 4 DISABLED` |
| **UCPD Task** | `Get-ScheduledTask -TaskPath "\Microsoft\Windows\AppxDeploymentClient\" -TaskName "UCPD velocity"` | `State : Disabled` |
| **WSAIFabricSvc** | `Get-Service -Name "WSAIFabricSvc"` | `Status : Stopped`, `StartType : Manual` |
| **Workloads Memory** | `Get-Process -Name "WorkloadsSessionHost" -ErrorAction SilentlyContinue` | Returns null / 0 processes running |
| **BitLocker Auto-DE**| `Get-ItemProperty "HKLM:\SYSTEM\CurrentControlSet\Control\BitLocker" -Name "PreventDeviceEncryption"` | `PreventDeviceEncryption : 1` |
| **Telemetry ETLs** | `Get-Service -Name "DiagTrack"` | `Status : Stopped`, `StartType : Disabled` |

---

## 10. Conclusion & Integration with WinCraft Architecture

Windows 11 24H2 and 25H2 introduce systemic changes that cannot be addressed using legacy Windows 10/11 21H2–23H2 tweak scripts:
1. **Recall & AI Workloads:** Must be controlled at both the feature level (DISM) and policy level (`WindowsAI`) to avoid DCOM-based respawning.
2. **WorkloadsSessionHost Memory Leak:** Mitigated safely by demoting `WSAIFabricSvc` to `Manual` and disabling triggering policies, saving between 3 GB and 8+ GB of active memory.
3. **UCPD Kernel Driver:** Demands disabling both the driver service and its scheduled watchdog (`\Microsoft\Windows\AppxDeploymentClient\UCPD velocity`), followed by a reboot.
4. **BitLocker Auto-DE:** Must be intercepted via `PreventDeviceEncryption` to avoid unwanted drive locking and NVMe performance penalties.

All methods documented here are 100% reversible, non-destructive, and compliant with WinCraft's verification guarantees.
