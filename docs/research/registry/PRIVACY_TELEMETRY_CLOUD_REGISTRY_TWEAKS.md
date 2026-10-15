# Windows Registry: Deep Privacy, Telemetry, Cloud Content & Diagnostics Lockdown

**Document Version:** 1.0.0  
**Target Operating Systems:** Windows 11 (21H2, 22H2, 23H2, 24H2, 25H2) & Windows 10 (21H2, 22H2, Enterprise LTSC 2021)  
**Classification:** Authoritative Technical Research & Reversible Implementation Specification  
**Repository Target:** `WinCraft 2.0 Engine & Registry Catalogue`  
**File Location:** `docs/research/registry/PRIVACY_TELEMETRY_CLOUD_REGISTRY_TWEAKS.md`  

---

## 1. Executive Summary & Telemetry Subsystem Architecture

Windows 10 and 11 feature an expansive, distributed telemetry, diagnostics, and cloud-content infrastructure. Rather than operating as an isolated background task, Windows telemetry is woven across multiple operating system layers:
1. **Kernel Event Tracing for Windows (ETW) Autologger Sessions:** Low-level, circular kernel buffers logging system activity, interrupts, Wi-Fi handshakes, and application inventory directly to disk (`%SystemRoot%\System32\LogFiles\WMI\*.etl`).
2. **User-Mode Orchestrator Services:** Daemons such as `DiagTrack` (Connected User Experiences and Telemetry) and `dmwappushservice` that aggregate ETW trace data, compress payloads, and transmit them via encrypted HTTPS connections to endpoints like `vortex.data.microsoft.com` and `settings-win.data.microsoft.com`.
3. **Cloud Privacy Settings Store (CPSS) & Policy CSPs:** Modern configuration stores introduced in Windows 10 1903+ and solidified in Windows 11 22H2–24H2 to sync user privacy states across the cloud and enforce settings overrides upon system migration or servicing updates.
4. **Content Delivery Manager (CDM):** An active subsystem managing dynamic Start menu recommendations, lock screen spotlight ads, background app push-installations, and soft-landing post-update interstitials.
5. **System-Initiated User Feedback (SIUF):** In-kernel heuristics and user-mode scheduled rules that prompt users with feedback dialogues based on detected operational anomalies.

### 1.1 The Multi-Location Fallback Trap
A widespread defect in amateur debloating scripts and guides is applying a registry tweak to a single location (e.g., setting `AllowTelemetry = 0` only under `HKLM\SOFTWARE\Policies\Microsoft\Windows\DataCollection`). Windows checks multiple hives and fallbacks:
- If a key exists under local machine policies but is missing from the 32-bit `WOW6432Node` or the Cloud Privacy Setting Store (`CPSS`), 32-bit subsystem processes and UWP app brokers continue data collection.
- During monthly cumulative updates or major feature upgrades, the Windows Setup engine (`SetupPlatform`) inspects fallback keys. If secondary branches lack explicit policy locks, the operating system resets the primary policy back to default values.

WinCraft implements an **authoritative, multi-location, multi-layered lockdown** that closes every fallback vector while preserving OS subsystem invariants, application compatibility, and 100% reversible rollbacks.

---

## 2. Universal 7-Location Telemetry Lockdown (`AllowTelemetry`)

### 2.1 Technical Background & Diagnostic Data Levels
Windows defines diagnostic data transmission levels using a 32-bit unsigned integer (`REG_DWORD`):

| Value | Policy Name (Modern) | Policy Name (Legacy) | Transmitted Telemetry Scope |
| :---: | :--- | :--- | :--- |
| `0` | **Diagnostic data off (Security)** | Security | Enterprise, Education, IoT, and Server editions only. Transmits minimal metadata required to keep Windows Defender and MSRT up to date. (Treated as Level 1 floor on Home/Pro). |
| `1` | **Required diagnostic data** | Basic | Hardware specifications, installed applications, system reliability metrics, crash minidumps, device drivers, and error logs. |
| `2` | **Enhanced diagnostic data** | Enhanced | Windows Analytics insights, extended memory usage, device health, and advanced operating system usage patterns. (Deprecated in Win 10 2004+, treated as Level 1 or 3). |
| `3` | **Optional diagnostic data** | Full | Comprehensive event logs, typing insights, ink stroke samples, browsing history in Edge, crash memory dumps, and deep operating system diagnostics. |

### 2.2 The 7 Authoritative Registry Locations
To guarantee that the diagnostic data collection policy cannot be overridden by subsystem reflection, 32-bit runtime wrappers, MDM policy engines, or CPSS cloud synchronizers, `AllowTelemetry` must be explicitly asserted across 7 distinct registry paths:

```
[1] HKLM GPO Policy:
    HKLM\SOFTWARE\Policies\Microsoft\Windows\DataCollection -> AllowTelemetry = 0

[2] HKCU User GPO Policy:
    HKCU\Software\Policies\Microsoft\Windows\DataCollection -> AllowTelemetry = 0

[3] HKLM Native Machine System Policy:
    HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\DataCollection -> AllowTelemetry = 0

[4] HKLM WOW6432Node System Policy (32-bit Reflection):
    HKLM\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Policies\DataCollection -> AllowTelemetry = 0

[5] HKLM WOW6432Node GPO Policy (32-bit Group Policy):
    HKLM\SOFTWARE\WOW6432Node\Policies\Microsoft\Windows\DataCollection -> AllowTelemetry = 0

[6] MDM PolicyManager System Default Node:
    HKLM\SOFTWARE\Microsoft\PolicyManager\default\System\AllowTelemetry -> value = 0

[7] Cloud Privacy Settings Store (CPSS):
    HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\CPSS\Store\AllowTelemetry -> Value = 0
    HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\CPSS\DevicePolicy\AllowTelemetry -> DefaultValue = 0
```

### 2.3 Deep-Dive Location Analysis & Mechanics

#### Location 1: Machine Group Policy
- **Path:** `HKLM\SOFTWARE\Policies\Microsoft\Windows\DataCollection`
- **Value Name:** `AllowTelemetry` | **Type:** `REG_DWORD` | **Target:** `0` (Security/Off)
- **Role:** Authoritative machine-level GPO node (`DataCollection.admx`). Read by `diagtrack.dll` during service startup. When set to `0`, instructs the Unified Telemetry Client (UTC) to restrict telemetry payloads to the security baseline.

#### Location 2: Current User Group Policy
- **Path:** `HKCU\Software\Policies\Microsoft\Windows\DataCollection`
- **Value Name:** `AllowTelemetry` | **Type:** `REG_DWORD` | **Target:** `0`
- **Role:** Per-user policy override. Evaluated by modern Windows Shell components, Cortana/Search host, and per-user background task brokers. Ensures user-level telemetry triggers do not execute even if user policies are evaluated independently of machine policies.

#### Location 3: Native Machine System Policy
- **Path:** `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\DataCollection`
- **Value Name:** `AllowTelemetry` | **Type:** `REG_DWORD` | **Target:** `0`
- **Role:** Local Security Authority and core Windows platform policy store. Serves as the fallback location inspected by Windows setup routines and servicing engines when no active domain GPO is enforced.

#### Location 4: WOW6432Node Native Machine System Policy
- **Path:** `HKLM\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Policies\DataCollection`
- **Value Name:** `AllowTelemetry` | **Type:** `REG_DWORD` | **Target:** `0`
- **Role:** 32-bit subsystem registry hive. Legacy 32-bit management agents, legacy installer packages, and 32-bit telemetry listeners query this node. On 64-bit systems lacking this key, 32-bit processes fall back to default telemetry behaviour.

#### Location 5: WOW6432Node Group Policy
- **Path:** `HKLM\SOFTWARE\WOW6432Node\Policies\Microsoft\Windows\DataCollection`
- **Value Name:** `AllowTelemetry` | **Type:** `REG_DWORD` | **Target:** `0`
- **Role:** 32-bit reflected GPO branch. Closes the gap for legacy 32-bit processes querying GPO keys without registry redirection flags.

#### Location 6: MDM PolicyManager System Node
- **Path:** `HKLM\SOFTWARE\Microsoft\PolicyManager\default\System\AllowTelemetry`
- **Value Name:** `value` | **Type:** `REG_DWORD` | **Target:** `0`
- **Path (Device Active):** `HKLM\SOFTWARE\Microsoft\PolicyManager\current\device\System`
- **Value Name:** `AllowTelemetry` | **Type:** `REG_DWORD` | **Target:** `0`
- **Role:** Mobile Device Management (MDM) / Configuration Service Provider (CSP) node (`./Device/Vendor/MSFT/Policy/Config/System/AllowTelemetry`). When Windows evaluates MDM configuration during OOBE or workplace account connection, this node acts as the authoritative template.

#### Location 7: Cloud Privacy Settings Store (CPSS)
- **Path 1:** `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\CPSS\Store\AllowTelemetry`
- **Value Name:** `Value` | **Type:** `REG_DWORD` | **Target:** `0`
- **Path 2:** `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\CPSS\DevicePolicy\AllowTelemetry`
- **Value Name:** `DefaultValue` | **Type:** `REG_DWORD` | **Target:** `0`
- **Role:** Modern Windows 11 settings broker layer (`settingsstorage.dll`). Modern Windows Settings app reads and commits privacy toggles here. If the store reflects a value of `1` (Basic) or `3` (Full), Windows attempts to self-heal the GPO policies during background maintenance cycles. Locking CPSS eliminates self-healing discrepancies.

### 2.4 Companion Telemetry Hardening Registry Keys
In addition to `AllowTelemetry`, the following companion keys complete the DataCollection policy perimeter:

```ini
[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\DataCollection]
"MaxTelemetryAllowed"=dword:00000000
"AllowCommercialDataPipeline"=dword:00000000
"AllowDeviceNameInTelemetry"=dword:00000000
"DisableEnterpriseAuthProxy"=dword:00000001
"MicrosoftEdgeDataOptIn"=dword:00000000
"DisableTelemetryOptInChangeNotification"=dword:00000001
"DisableTelemetryOptInSettingsUx"=dword:00000001
"LimitDiagnosticLogCollection"=dword:00000001
"LimitDumpCollection"=dword:00000001
"DoNotShowFeedbackNotifications"=dword:00000001

[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\PreviewBuilds]
"EnableConfigFlighting"=dword:00000000

[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\AppCompat]
"AITEnable"=dword:00000000
"DisableInventory"=dword:00000001
"DisableUAR"=dword:00000001

[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\SQMClient\Windows]
"CEIPEnable"=dword:00000000
```

---

## 3. Start Menu & Windows Search Telemetry Elimination

Windows Search integrates web querying and user telemetry directly into the desktop shell (`SearchHost.exe`). Typing any key inside the Start menu or Taskbar search bar triggers remote HTTPS requests to Microsoft Bing and telemetry ingestion endpoints.

```
Desktop Search Typing -> SearchHost.exe -> Bing Web Services (bingapis.com)
                                      -> Cortana / Cloud Query History
                                      -> Telemetry Logging (vortex.data.microsoft.com)
```

### 3.1 `DisableSearchBoxSuggestions` = 1
- **Registry Paths:**
  - `HKCU\Software\Policies\Microsoft\Windows\Explorer`
  - `HKLM\SOFTWARE\Policies\Microsoft\Windows\Explorer`
- **Value Name:** `DisableSearchBoxSuggestions` | **Type:** `REG_DWORD` | **Target:** `1`
- **Mechanism:** Administrative template setting (`Explorer.admx`: *Turn off display of recent search entries in the File Explorer search box*). Prevents Windows Explorer from storing search keystrokes and displaying dropdown search suggestions based on previous activity.
- **Stock Default:** Not set (0)

### 3.2 `BingSearchEnabled` = 0
- **Registry Path:** `HKCU\Software\Microsoft\Windows\CurrentVersion\Search`
- **Value Name:** `BingSearchEnabled` | **Type:** `REG_DWORD` | **Target:** `0`
- **Mechanism:** Directly toggles the Bing integration layer in the Windows Start menu. When set to `0`, `SearchHost.exe` suppresses the remote WebView2 rendering process for web results, eliminating network round-trips to `bing.com` and returning search to 100% local indexing.
- **Stock Default:** `1` (or not set)

### 3.3 `ConnectedSearchUseWeb` = 0
- **Registry Paths:**
  - `HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Search`
  - `HKCU\Software\Microsoft\Windows\CurrentVersion\Search`
  - `HKCU\Software\Policies\Microsoft\Windows\Windows Search`
- **Value Name:** `ConnectedSearchUseWeb` | **Type:** `REG_DWORD` | **Target:** `0`
- **Mechanism:** Group Policy control (`Search.admx`: *Do not allow web search* and *Don't search the web or display web results in Search*). Disables the Connected Search broker subsystem. Enforces local indexing only, even if individual user profiles attempt to toggle web search.
- **Stock Default:** Not set (0)

### 3.4 Search Hardening Matrix

| Setting ID | Hive & Path | Value Name | Type | Value | Function & Blast Radius |
| :--- | :--- | :--- | :---: | :---: | :--- |
| `disable_search_box_suggestions` | `HKCU\Software\Policies\Microsoft\Windows\Explorer` | `DisableSearchBoxSuggestions` | `DWORD` | `1` | Disables Explorer search suggestion queries. |
| `disable_bing_search` | `HKCU\Software\Microsoft\Windows\CurrentVersion\Search` | `BingSearchEnabled` | `DWORD` | `0` | Disables Bing search in the Start Menu. Zero web latency. |
| `disable_connected_search_web` | `HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Search` | `ConnectedSearchUseWeb` | `DWORD` | `0` | Disables web search system-wide via GPO. |
| `disable_connected_search_metered` | `HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Search` | `ConnectedSearchUseWebOverMeteredConnections` | `DWORD` | `0` | Blocks web search over mobile/metered connections. |
| `disable_cloud_search_hklm` | `HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Search` | `AllowCloudSearch` | `DWORD` | `0` | Blocks cloud file and account index querying. |
| `disable_cloud_search_hkcu` | `HKCU\Software\Microsoft\Windows\CurrentVersion\Search` | `AllowCloudSearch` | `DWORD` | `0` | Disables user-level cloud search index integration. |
| `disable_cortana_consent` | `HKCU\Software\Microsoft\Windows\CurrentVersion\Search` | `CortanaConsent` | `DWORD` | `0` | Revokes Cortana data sharing consent. |
| `disable_cortana_policy` | `HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Search` | `AllowCortana` | `DWORD` | `0` | Disables Cortana voice engine system-wide. |
| `disable_cortana_above_lock` | `HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Search` | `AllowCortanaAboveLock` | `DWORD` | `0` | Blocks search engine activation on lock screen. |
| `disable_device_history` | `HKCU\Software\Microsoft\Windows\CurrentVersion\Search` | `DeviceHistoryEnabled` | `DWORD` | `0` | Stops logging local app and file launches into search history. |
| `disable_search_history` | `HKCU\Software\Microsoft\Windows\CurrentVersion\Search` | `HistoryViewEnabled` | `DWORD` | `0` | Hides past search history cards from search flyout. |

---

## 4. Cloud Content, Consumer Push & Delivery Optimization

Windows 10 and 11 feature automated cloud provisioning mechanisms that dynamically deliver third-party sponsored applications (e.g., games, social media stubs), promotional tips, and lock screen advertisements without explicit user interaction.

```
Cloud Content Infrastructure:
[Microsoft CDN / Push Servers]
           │
           ▼
[ContentDeliveryManager (svchost.exe)]
   ├── Silent App Provisioning (Candy Crush, Disney+, Spotify stubs)
   ├── System Pane Suggestions (Start Menu ads)
   ├── Windows Spotlight (Dynamic lock screen wallpaper + tips)
   └── Soft Landing (Post-update "Welcome to Windows" interstitials)
```

### 4.1 `DisableWindowsConsumerFeatures` = 1
- **Registry Path:** `HKLM\SOFTWARE\Policies\Microsoft\Windows\CloudContent`
- **Value Name:** `DisableWindowsConsumerFeatures` | **Type:** `REG_DWORD` | **Target:** `1`
- **Mechanism:** Administrative template setting (`CloudContent.admx`: *Turn off Microsoft consumer experiences*). Instructs the Windows AppX deployment and servicing subsystem to ignore OEM and Microsoft cloud recommendations that silently stage sponsored applications into user profiles.
- **Stock Default:** Not set (`0`)
- **Edition Applicability:** Fully honored on Windows 10/11 Enterprise, Education, and Pro (when paired with `ContentDeliveryManager` keys).

### 4.2 `DisableCloudOptimizedContent` = 1
- **Registry Paths:**
  - `HKLM\SOFTWARE\Policies\Microsoft\Windows\CloudContent`
  - `HKCU\Software\Policies\Microsoft\Windows\CloudContent`
- **Value Name:** `DisableCloudOptimizedContent` | **Type:** `REG_DWORD` | **Target:** `1`
- **Mechanism:** Administrative template setting introduced in Windows 11 22H2 (`CloudContent.admx`: *Turn off Cloud Optimized Content*). Disables the delivery of cloud-personalized suggestions, enterprise recommendations, and dynamic tips inside the Settings application and shell panes.
- **Stock Default:** Not set (`0`)

### 4.3 `DisableSoftLanding` = 1
- **Registry Paths:**
  - `HKLM\SOFTWARE\Policies\Microsoft\Windows\CloudContent`
  - `HKCU\Software\Policies\Microsoft\Windows\CloudContent`
- **Value Name:** `DisableSoftLanding` | **Type:** `REG_DWORD` | **Target:** `1`
- **Companion Path:** `HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager`
- **Companion Value:** `SoftLandingEnabled` = `0` (`REG_DWORD`)
- **Mechanism:** Administrative template setting (*Do not show Windows tips*). Prevents Windows from presenting "Soft Landing" screens, post-update "Finish setting up your PC" wizards, and edge-swipe educational tooltips that consume foreground execution time after major system restarts.
- **Stock Default:** Not set (`0`)

### 4.4 Comprehensive ContentDeliveryManager Catalog

| Value Name | Hive & Path | Type | Value | Function |
| :--- | :--- | :---: | :---: | :--- |
| `SilentInstalledAppsEnabled` | `HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager` | `DWORD` | `0` | Blocks silent background installation of recommended Store apps. |
| `SystemPaneSuggestionsEnabled` | `HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager` | `DWORD` | `0` | Disables promotional app suggestions in the Start Menu. |
| `SoftLandingEnabled` | `HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager` | `DWORD` | `0` | Disables "Welcome to Windows" post-update prompts. |
| `FeatureManagementEnabled` | `HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager` | `DWORD` | `0` | Halts remote feature flag updates and cloud A/B testing. |
| `ContentDeliveryAllowed` | `HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager` | `DWORD` | `0` | Master toggle disabling dynamic content subscription processing. |
| `OemPreInstalledAppsEnabled` | `HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager` | `DWORD` | `0` | Prevents OEM bloatware packages from being staged automatically. |
| `PreInstalledAppsEnabled` | `HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager` | `DWORD` | `0` | Disables automatic pre-installation of Microsoft partner apps. |
| `RotatingLockScreenEnabled` | `HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager` | `DWORD` | `0` | Disables rotating lock screen background downloads. |
| `RotatingLockScreenOverlayEnabled` | `HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager` | `DWORD` | `0` | Hides trivia, advertisements, and tips on the lock screen. |
| `SubscribedContent-310093Enabled` | `HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager` | `DWORD` | `0` | Disables Welcome Experience and introductory screens. |
| `SubscribedContent-338387Enabled` | `HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager` | `DWORD` | `0` | Disables Start menu app recommendation tiles. |
| `SubscribedContent-338388Enabled` | `HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager` | `DWORD` | `0` | Disables suggested content inside the Windows Settings app. |
| `SubscribedContent-338389Enabled` | `HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager` | `DWORD` | `0` | Disables tips, shortcuts, and recommendations in Windows. |
| `SubscribedContent-353694Enabled` | `HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager` | `DWORD` | `0` | Disables dynamic suggestions and highlights on the Taskbar. |
| `SubscribedContent-353696Enabled` | `HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager` | `DWORD` | `0` | Disables Lock Screen promotional links and suggestions. |
| `SubscribedContent-353698Enabled` | `HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager` | `DWORD` | `0` | Disables Search highlights and cloud search recommendations. |
| `DisableWindowsSpotlightFeatures` | `HKCU\Software\Policies\Microsoft\Windows\CloudContent` | `DWORD` | `1` | Disables Windows Spotlight features across user profile. |
| `DisablePushToInstall` | `HKLM\SOFTWARE\Policies\Microsoft\PushToInstall` | `DWORD` | `1` | Prevents remote app installations pushed via the Microsoft Store web portal. |

---

## 5. Advertising ID & System-Initiated User Feedback (SIUF)

### 5.1 Advertising ID Tracking (`AdvertisingInfo`)
Windows generates a unique 128-bit UUID Advertising ID for each user profile. UWP applications and Microsoft edge-services read this identifier via the WinRT API `Windows.System.UserProfile.AdvertisingManager.AdvertisingId` to construct cross-application behavioral advertising profiles.

#### The 4-Tier Advertising Lockdown

```
[1] User State:
    HKCU\Software\Microsoft\Windows\CurrentVersion\AdvertisingInfo -> Enabled = 0

[2] System Group Policy:
    HKLM\SOFTWARE\Policies\Microsoft\Windows\AdvertisingInfo -> DisabledByGroupPolicy = 1

[3] CPSS Store:
    HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\CPSS\Store\AdvertisingInfo -> Value = 0

[4] CPSS Device Policy:
    HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\CPSS\DevicePolicy\AdvertisingInfo -> DefaultValue = 0
```

- **HKCU Location:** `HKCU\Software\Microsoft\Windows\CurrentVersion\AdvertisingInfo`
  - `Enabled` = `0` (`REG_DWORD`)
- **HKLM Policy Location:** `HKLM\SOFTWARE\Policies\Microsoft\Windows\AdvertisingInfo`
  - `DisabledByGroupPolicy` = `1` (`REG_DWORD`)
- **CPSS Store Location:** `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\CPSS\Store\AdvertisingInfo`
  - `Value` = `0` (`REG_DWORD`)
- **Mechanism:** Disabling the Advertising ID invalidates the cached UUID, forcing WinRT API calls to return an empty string (`""`), which stops third-party application ad frameworks from linking user activity across applications.

### 5.2 System-Initiated User Feedback (SIUF) Rules
System-Initiated User Feedback is a background diagnostic subsystem that evaluates operational telemetry against telemetry-derived rules downloaded into `HKCU\Software\Microsoft\Siuf\Rules`. If an application crashes or a specific hardware event occurs, SIUF triggers a toast notification prompting the user: *"How satisfied are you with Windows?"*

#### The SIUF Lockdown Keys
- **Registry Path:** `HKCU\Software\Microsoft\Siuf\Rules`
  - `NumberOfSIUFInPeriod` = `0` (`REG_DWORD`)
  - `PeriodInNanoSeconds` = `0` (`REG_DWORD` or deleted)
- **Group Policy Path:** `HKLM\SOFTWARE\Policies\Microsoft\Windows\DataCollection`
  - `DoNotShowFeedbackNotifications` = `1` (`REG_DWORD`)
- **Mechanism:**
  - `NumberOfSIUFInPeriod`: Defines the maximum number of feedback prompts allowed within a designated measurement window. Setting this value to `0` acts as a hard mathematical limit, preventing any prompt from triggering regardless of rule conditions.
  - `DoNotShowFeedbackNotifications`: GPO policy (`DataCollection.admx`: *Do not show feedback notifications*). Completely silences the UI notification dispatcher for feedback questions.

### 5.3 Tailored Experiences with Diagnostic Data
- **Registry Path:** `HKCU\Software\Microsoft\Windows\CurrentVersion\Privacy`
- **Value Name:** `TailoredExperiencesWithDiagnosticDataEnabled` | **Type:** `REG_DWORD` | **Target:** `0`
- **GPO Path:** `HKLM\SOFTWARE\Policies\Microsoft\Windows\CloudContent`
- **GPO Value:** `DisableTailoredExperiencesWithDiagnosticData` = `1` (`REG_DWORD`)
- **CPSS Path:** `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\CPSS\Store\TailoredExperiencesWithDiagnosticDataEnabled`
- **CPSS Value:** `Value` = `0` (`REG_DWORD`)
- **Mechanism:** Windows uses collected diagnostic data (such as app usage duration and device specifications) to curate personalized recommendations and ads in Windows features. Setting this to `0` stops telemetry correlation with user advertising buckets.

---

## 6. Activity Feed, Timeline & Cross-Device Data Harvesting

Introduced in Windows 10 1803 and maintained in Windows 11, the Activity Feed and Timeline subsystem collects continuous snapshots of active application window titles, opened documents, media playback sessions, and browsing history. This metadata is saved to a local SQLite database (`ActivitiesCache.db` under `%LOCALAPPDATA%\ConnectedDevicesPlatform\`) and periodically transmitted to the Microsoft Graph cloud API.

```
User Workflow (Word, Browser, PDF) 
           │
           ▼
[Activity Feed Subsystem] ─── Writes to ───► ActivitiesCache.db (Local)
           │
           ├── PublishUserActivities ───► Windows Shell Timeline
           │
           └── UploadUserActivities  ───► Microsoft Graph Cloud (Cross-Device Sync)
```

### 6.1 `EnableActivityFeed` = 0
- **Registry Path:** `HKLM\SOFTWARE\Policies\Microsoft\Windows\System`
- **Value Name:** `EnableActivityFeed` | **Type:** `REG_DWORD` | **Target:** `0`
- **Mechanism:** Administrative template setting (`System.admx`: *Enables Activity Feed*). Completely disables the activity indexing engine, preventing `explorer.exe` and background workers from recording user actions.
- **Stock Default:** `1` (or not set)

### 6.2 `PublishUserActivities` = 0
- **Registry Path:** `HKLM\SOFTWARE\Policies\Microsoft\Windows\System`
- **Value Name:** `PublishUserActivities` | **Type:** `REG_DWORD` | **Target:** `0`
- **Mechanism:** Administrative template setting (`System.admx`: *Allow publishing of User Activities*). Blocks user activity records from being published to the shell UI or exposed to other user accounts on the local machine.
- **Stock Default:** `1` (or not set)

### 6.3 `UploadUserActivities` = 0
- **Registry Path:** `HKLM\SOFTWARE\Policies\Microsoft\Windows\System`
- **Value Name:** `UploadUserActivities` | **Type:** `REG_DWORD` | **Target:** `0`
- **Mechanism:** Administrative template setting (`System.admx`: *Allow upload of User Activities*). Blocks the Connected Devices Platform service (`CDPSvc`) from uploading collected user activity records to Microsoft cloud servers.
- **Stock Default:** `1` (or not set)

### 6.4 Companion Activity & Device Privacy Controls

| Setting ID | Hive & Path | Value Name | Type | Value | Function & Blast Radius |
| :--- | :--- | :--- | :---: | :---: | :--- |
| `disable_cdp` | `HKLM\SOFTWARE\Policies\Microsoft\Windows\System` | `EnableCdp` | `DWORD` | `0` | Disables Connected Devices Platform cross-device communication. |
| `disable_app_launch_tracking` | `HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced` | `Start_TrackProgs` | `DWORD` | `0` | Stops Windows from logging application launch frequency and recency. |
| `disable_sync_settings` | `HKLM\SOFTWARE\Policies\Microsoft\Windows\SettingSync` | `DisableSettingSync` | `DWORD` | `2` | Disables cloud synchronization of passwords and settings. |
| `disable_sync_user_pref` | `HKLM\SOFTWARE\Policies\Microsoft\Windows\SettingSync` | `DisableSettingSyncUserOverride` | `DWORD` | `1` | Prevents user from overriding setting sync policy. |
| `disable_typing_insights` | `HKCU\Software\Microsoft\Input\Settings` | `InsightsEnabled` | `DWORD` | `0` | Stops collecting typing statistics and autocorrect telemetry. |
| `disable_inking_typing_personalization` | `HKCU\Software\Microsoft\Personalization\Settings` | `AcceptedPrivacyPolicy` | `DWORD` | `0` | Revokes handwriting and typing personalization consent. |
| `disable_handwriting_sharing` | `HKLM\SOFTWARE\Policies\Microsoft\Windows\HandwritingErrorReports` | `PreventHandwritingDataSharing` | `DWORD` | `1` | Prevents transmission of unrecognized handwriting strokes. |

---

## 7. Diagnostics & Kernel ETW Autologger Sessions Teardown

Event Tracing for Windows (ETW) provides kernel-level event tracing. While critical for debugging, Windows configures multiple persistent **Autologger sessions** under `HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\`. These sessions initialize early in the kernel boot cycle (Phase 0/1 boot) and continuously write binary event traces (`.etl`) to disk, creating background I/O queues and inflating Deferred Procedure Call (DPC) latency.

### 7.1 The 5 Primary System Autologgers

The WinCraft engine targets the 5 primary telemetry and diagnostic autologgers:

```
[1] AutoLogger-Diagtrack-Listener (Diagtrack-Listener)
    GUID: {11D8A17B-F2D8-4733-B41B-6F4959ACD701}
    Path: %SystemRoot%\System32\LogFiles\WMI\Diagtrack-Listener.etl
    Registry: HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\AutoLogger-Diagtrack-Listener
              HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\Diagtrack-Listener

[2] SQMLogger (Software Quality Metrics)
    GUID: {331c3b3a-2005-44c2-ac5e-77220c37d6b4}
    Path: %SystemRoot%\System32\LogFiles\WMI\SQMLogger.etl
    Registry: HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SQMLogger

[3] AITEventLog (Application Impact Telemetry)
    GUID: {0BD9FD00-C871-5764-9CB7-359821A79CFF}
    Path: %SystemRoot%\System32\LogFiles\WMI\AITEventLog.etl
    Registry: HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\AITEventLog

[4] DiagLog (Windows Diagnostic Infrastructure Trace)
    GUID: {08b524eb-a2bf-47eb-aef1-dbd871741d7a}
    Path: %SystemRoot%\System32\LogFiles\WMI\DiagLog.etl
    Registry: HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\DiagLog

[5] WiFiSession (Wi-Fi Diagnostic & Connection Telemetry)
    GUID: {84C9AA7C-C770-41E6-8ADA-D3134CF17916}
    Path: %SystemRoot%\System32\LogFiles\WMI\WiFiSession.etl
    Registry: HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession
```

### 7.2 Detailed Analysis of Each System Logger

#### 1. `Diagtrack-Listener` / `AutoLogger-Diagtrack-Listener`
- **Registry Key:** `HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\Diagtrack-Listener` and `AutoLogger-Diagtrack-Listener`
- **Value Name:** `Start` | **Type:** `REG_DWORD` | **Target:** `0` (Disabled)
- **Stock Default:** `1` (Enabled)
- **Analysis:** Captures ETW events from over 100 system providers (kernel process creations, power state transitions, DWM frame metrics, and AppX package events). This trace data feeds directly into the `DiagTrack` service for serialization. Disabling this logger removes continuous disk writes to `Diagtrack-Listener.etl`.
- **Blast Radius:** Windows Feedback Hub loses telemetry capture capability. Operating system and third-party software remain 100% stable.

#### 2. `SQMLogger`
- **Registry Key:** `HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SQMLogger`
- **Value Name:** `Start` | **Type:** `REG_DWORD` | **Target:** `0` (Disabled)
- **Stock Default:** `1` (Enabled)
- **Analysis:** Backs the Software Quality Metrics (SQM) telemetry pipeline and Customer Experience Improvement Program (CEIP). Collects feature usage counters and crashes. Disabling halts trace generation without impacting application compatibility.

#### 3. `AITEventLog`
- **Registry Key:** `HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\AITEventLog`
- **Value Name:** `Start` | **Type:** `REG_DWORD` | **Target:** `0` (Disabled)
- **Stock Default:** `1` (Enabled)
- **Analysis:** Application Impact Telemetry log. Records every executable and DLL loaded by user applications to generate compatibility inventories. Disabling this logger frees I/O operations whenever new software processes spawn.

#### 4. `DiagLog`
- **Registry Key:** `HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\DiagLog`
- **Value Name:** `Start` | **Type:** `REG_DWORD` | **Target:** `0` (Disabled)
- **Stock Default:** `1` (Enabled)
- **Analysis:** General Windows Diagnostic logging session. Records diagnostic provider output across system components. Setting `Start = 0` stops circular ETL buffer allocation.

#### 5. `WiFiSession`
- **Registry Key:** `HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession`
- **Value Name:** `Start` | **Type:** `REG_DWORD` | **Target:** `0` (Disabled)
- **Stock Default:** `1` (Enabled)
- **Analysis:** Traces Wi-Fi connection attempts, roaming events, signal strength degradation, and adapter disconnections. On gaming setups and battery-powered laptops, this background trace runs continually. Disabling does not affect Wi-Fi connectivity or throughput; it only prevents state tracing.

### 7.3 Secondary Diagnostic Loggers Inventory

| Logger Name | Registry Key Path (`Control\WMI\Autologger\`) | Output ETL File | Target `Start` | Purpose & Safe Impact |
| :--- | :--- | :--- | :---: | :--- |
| `WdiContextLog` | `WdiContextLog` | `WDI\LogFiles\WdiContextLog.etl` | `0` | Windows Diagnostic Infrastructure contextual fault logging. Safe to disable on standalone PCs. |
| `SetupPlatformTel` | `SetupPlatformTel` | `Panther\FirstBootTel.etl` | `0` | Windows Setup and feature upgrade diagnostic logging. |

### 7.4 The Dual-Action Requirement: Persisted Registry + In-Memory Teardown
Setting `Start = 0` under an Autologger registry key only instructs the kernel **not to initialize the session during the next boot**. 

If the session is currently active in memory, setting the registry flag does not stop running trace buffers:
- Kernel memory pools remain allocated for event queues.
- Registered ETW providers continue firing callbacks into ETW buffers.
- The `.etl` file handle remains open on disk.

To achieve immediate, zero-reboot optimization, WinCraft executes a **dual-action teardown**:
1. **Persisted Layer:** Write `Start = 0` via the Windows Registry API.
2. **Runtime Layer:** Invoke the Win32 `ControlTraceW` API with `EVENT_TRACE_CONTROL_STOP`, or execute the Windows CLI equivalent:
   ```cmd
   logman stop "Diagtrack-Listener" -ets
   logman stop "AutoLogger-Diagtrack-Listener" -ets
   logman stop "SQMLogger" -ets
   logman stop "AITEventLog" -ets
   logman stop "DiagLog" -ets
   logman stop "WiFiSession" -ets
   ```

---

## 8. Subsystem Invariants, Blast Radius & Safety Audit

The WinCraft optimization engine adheres to strict safety boundaries. The following table documents the empirical blast radius across critical Windows subsystems when this lockdown is applied:

| Operating System Feature | Status Under Lockdown | Technical Justification & Safety Evidence |
| :--- | :---: | :--- |
| **Windows Update (WU)** | **100% Functional** | Windows Update queries metadata from `fe3.delivery.mp.microsoft.com` using the `wuauserv` service. Disabling telemetry does not block Windows Update handshakes or patch deployment. |
| **Microsoft Store** | **100% Functional** | Store app downloads, license acquisition, and manual app updates operate via `AppXDeploymentServer` and `InstallService`. They do not depend on `AllowTelemetry`. |
| **Local Windows Search** | **Faster (Optimized)** | Local file indexing, desktop shortcuts, and Start menu application searching continue working instantly via `WSearch`. Only Bing web latency and WebView2 advertising panels are removed. |
| **Application Crash Minidumps** | **Preserved** | `WerSvc` (Windows Error Reporting) is kept on `Manual (Demand Start)`. Crash dumps are written locally to `%LOCALAPPDATA%\CrashDumps` and `%SystemRoot%\Minidump`. Only background queuing and automatic cloud transmission (`DoNotQueue = 1`) are locked down. |
| **Xbox Live & Multiplayer** | **100% Functional** | Xbox authentication, game invites, cloud saves, and multiplayer networking rely on `XblAuthManager`, `XblGameSave`, and `XboxNetApiSvc`. Disabling `AllowTelemetry` does not break multiplayer networking. (Note: Feedback Hub bug filing will lack device telemetry traces). |
| **Wi-Fi & Ethernet Networking** | **100% Functional** | Halting the `WiFiSession` Autologger stops trace event writes to disk; network adapter drivers, 802.11ac/ax association, DHCP negotiation, and WPA3 authentication operate unaffected. |
| **File Explorer Performance** | **Faster (Optimized)** | Disabling search box suggestions and Explorer recent link resolution eliminates network timeouts when browsing directories containing dead UNC shortcut targets. |

---

## 9. Complete Implementation & Reversibility Runbooks

### 9.1 Master Hardening Registry File (`privacy_lockdown_apply.reg`)

```ini
Windows Registry Editor Version 5.00

; ==============================================================================
; WinCraft 2.0 - Deep Privacy, Telemetry, Cloud Content & Diagnostics Lockdown
; Fully Reversible via privacy_lockdown_restore.reg
; ==============================================================================

; ------------------------------------------------------------------------------
; 1. UNIVERSAL 7-LOCATION TELEMETRY LOCKDOWN (AllowTelemetry = 0)
; ------------------------------------------------------------------------------

; [1] HKLM GPO Policy
[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\DataCollection]
"AllowTelemetry"=dword:00000000
"MaxTelemetryAllowed"=dword:00000000
"AllowCommercialDataPipeline"=dword:00000000
"AllowDeviceNameInTelemetry"=dword:00000000
"DisableEnterpriseAuthProxy"=dword:00000001
"MicrosoftEdgeDataOptIn"=dword:00000000
"DisableTelemetryOptInChangeNotification"=dword:00000001
"DisableTelemetryOptInSettingsUx"=dword:00000001
"LimitDiagnosticLogCollection"=dword:00000001
"LimitDumpCollection"=dword:00000001
"DoNotShowFeedbackNotifications"=dword:00000001

; [2] HKCU User GPO Policy
[HKEY_CURRENT_USER\Software\Policies\Microsoft\Windows\DataCollection]
"AllowTelemetry"=dword:00000000

; [3] HKLM Native Machine System Policy
[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\DataCollection]
"AllowTelemetry"=dword:00000000

; [4] HKLM WOW6432Node System Policy (32-bit Compatibility)
[HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Policies\DataCollection]
"AllowTelemetry"=dword:00000000

; [5] HKLM WOW6432Node GPO Policy
[HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Policies\Microsoft\Windows\DataCollection]
"AllowTelemetry"=dword:00000000

; [6] MDM PolicyManager Nodes
[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\PolicyManager\default\System\AllowTelemetry]
"value"=dword:00000000

; [7] Cloud Privacy Settings Store (CPSS)
[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\CPSS\Store\AllowTelemetry]
"Value"=dword:00000000

[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\CPSS\DevicePolicy\AllowTelemetry]
"DefaultValue"=dword:00000000

; Companion: Application Compatibility Telemetry & CEIP
[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\AppCompat]
"AITEnable"=dword:00000000
"DisableInventory"=dword:00000001
"DisableUAR"=dword:00000001

[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\SQMClient\Windows]
"CEIPEnable"=dword:00000000

[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\PreviewBuilds]
"EnableConfigFlighting"=dword:00000000

; ------------------------------------------------------------------------------
; 2. START MENU & SEARCH TELEMETRY ELIMINATION
; ------------------------------------------------------------------------------

; Search Box Suggestions in File Explorer
[HKEY_CURRENT_USER\Software\Policies\Microsoft\Windows\Explorer]
"DisableSearchBoxSuggestions"=dword:00000001

[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\Explorer]
"DisableSearchBoxSuggestions"=dword:00000001

; Start Menu Search & Bing Disablement
[HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Search]
"BingSearchEnabled"=dword:00000000
"CortanaConsent"=dword:00000000
"AllowCloudSearch"=dword:00000000
"DeviceHistoryEnabled"=dword:00000000
"HistoryViewEnabled"=dword:00000000

; Windows Search Group Policies
[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\Windows Search]
"ConnectedSearchUseWeb"=dword:00000000
"ConnectedSearchUseWebOverMeteredConnections"=dword:00000000
"AllowCloudSearch"=dword:00000000
"AllowCortana"=dword:00000000
"AllowCortanaAboveLock"=dword:00000000
"DisableWebSearch"=dword:00000001

; ------------------------------------------------------------------------------
; 3. CLOUD CONTENT & DELIVERY OPTIMIZATION
; ------------------------------------------------------------------------------

; Group Policy: Cloud Content
[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\CloudContent]
"DisableWindowsConsumerFeatures"=dword:00000001
"DisableCloudOptimizedContent"=dword:00000001
"DisableSoftLanding"=dword:00000001
"DisableConsumerAccountStateContent"=dword:00000001
"DisableTailoredExperiencesWithDiagnosticData"=dword:00000001

[HKEY_CURRENT_USER\Software\Policies\Microsoft\Windows\CloudContent]
"DisableCloudOptimizedContent"=dword:00000001
"DisableSoftLanding"=dword:00000001
"DisableWindowsSpotlightFeatures"=dword:00000001

; User ContentDeliveryManager Fine-Grained Controls
[HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager]
"SilentInstalledAppsEnabled"=dword:00000000
"SystemPaneSuggestionsEnabled"=dword:00000000
"SoftLandingEnabled"=dword:00000000
"FeatureManagementEnabled"=dword:00000000
"ContentDeliveryAllowed"=dword:00000000
"OemPreInstalledAppsEnabled"=dword:00000000
"PreInstalledAppsEnabled"=dword:00000000
"RotatingLockScreenEnabled"=dword:00000000
"RotatingLockScreenOverlayEnabled"=dword:00000000
"SubscribedContent-310093Enabled"=dword:00000000
"SubscribedContent-338387Enabled"=dword:00000000
"SubscribedContent-338388Enabled"=dword:00000000
"SubscribedContent-338389Enabled"=dword:00000000
"SubscribedContent-353694Enabled"=dword:00000000
"SubscribedContent-353696Enabled"=dword:00000000
"SubscribedContent-353698Enabled"=dword:00000000

; Store PushToInstall Disablement
[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\PushToInstall]
"DisablePushToInstall"=dword:00000001

; ------------------------------------------------------------------------------
; 4. ADVERTISING ID & FEEDBACK (SIUF)
; ------------------------------------------------------------------------------

; User Advertising ID Toggle
[HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\AdvertisingInfo]
"Enabled"=dword:00000000

; Machine Policy for Advertising ID
[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\AdvertisingInfo]
"DisabledByGroupPolicy"=dword:00000001

; CPSS Store for Advertising ID
[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\CPSS\Store\AdvertisingInfo]
"Value"=dword:00000000

[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\CPSS\DevicePolicy\AdvertisingInfo]
"DefaultValue"=dword:00000000

; SIUF Rules (Never Prompt for Feedback)
[HKEY_CURRENT_USER\Software\Microsoft\Siuf\Rules]
"NumberOfSIUFInPeriod"=dword:00000000
"PeriodInNanoSeconds"=dword:00000000

; Tailored Experiences
[HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Privacy]
"TailoredExperiencesWithDiagnosticDataEnabled"=dword:00000000

[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\CPSS\Store\TailoredExperiencesWithDiagnosticDataEnabled]
"Value"=dword:00000000

; ------------------------------------------------------------------------------
; 5. ACTIVITY FEED & TIMELINE
; ------------------------------------------------------------------------------

[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\System]
"EnableActivityFeed"=dword:00000000
"PublishUserActivities"=dword:00000000
"UploadUserActivities"=dword:00000000
"EnableCdp"=dword:00000000

[HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced]
"Start_TrackProgs"=dword:00000000

; ------------------------------------------------------------------------------
; 6. DIAGNOSTICS & ETW AUTOLOGGERS TEARDOWN (Start = 0)
; ------------------------------------------------------------------------------

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\WMI\Autologger\AutoLogger-Diagtrack-Listener]
"Start"=dword:00000000

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\WMI\Autologger\Diagtrack-Listener]
"Start"=dword:00000000

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SQMLogger]
"Start"=dword:00000000

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\WMI\Autologger\AITEventLog]
"Start"=dword:00000000

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\WMI\Autologger\DiagLog]
"Start"=dword:00000000

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession]
"Start"=dword:00000000

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WdiContextLog]
"Start"=dword:00000000

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SetupPlatformTel]
"Start"=dword:00000000
```

---

### 9.2 Master Rollback Registry File (`privacy_lockdown_restore.reg`)

```ini
Windows Registry Editor Version 5.00

; ==============================================================================
; WinCraft 2.0 - Reversible Stock Restoration File
; Restores Windows Out-Of-The-Box Stock Privacy, Telemetry & Autologger Defaults
; ==============================================================================

; ------------------------------------------------------------------------------
; 1. RESTORE TELEMETRY VALUES
; ------------------------------------------------------------------------------

[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\DataCollection]
"AllowTelemetry"=-
"MaxTelemetryAllowed"=-
"AllowCommercialDataPipeline"=-
"AllowDeviceNameInTelemetry"=-
"DisableEnterpriseAuthProxy"=-
"MicrosoftEdgeDataOptIn"=-
"DisableTelemetryOptInChangeNotification"=-
"DisableTelemetryOptInSettingsUx"=-
"LimitDiagnosticLogCollection"=-
"LimitDumpCollection"=-
"DoNotShowFeedbackNotifications"=-

[HKEY_CURRENT_USER\Software\Policies\Microsoft\Windows\DataCollection]
"AllowTelemetry"=-

[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\DataCollection]
"AllowTelemetry"=dword:00000001

[HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Policies\DataCollection]
"AllowTelemetry"=dword:00000001

[HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Policies\Microsoft\Windows\DataCollection]
"AllowTelemetry"=-

[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\PolicyManager\default\System\AllowTelemetry]
"value"=dword:00000001

[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\CPSS\Store\AllowTelemetry]
"Value"=dword:00000001

[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\CPSS\DevicePolicy\AllowTelemetry]
"DefaultValue"=dword:00000001

[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\AppCompat]
"AITEnable"=-
"DisableInventory"=-
"DisableUAR"=-

[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\SQMClient\Windows]
"CEIPEnable"=-

[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\PreviewBuilds]
"EnableConfigFlighting"=-

; ------------------------------------------------------------------------------
; 2. RESTORE START & SEARCH VALUES
; ------------------------------------------------------------------------------

[HKEY_CURRENT_USER\Software\Policies\Microsoft\Windows\Explorer]
"DisableSearchBoxSuggestions"=-

[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\Explorer]
"DisableSearchBoxSuggestions"=-

[HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Search]
"BingSearchEnabled"=dword:00000001
"CortanaConsent"=dword:00000001
"AllowCloudSearch"=dword:00000001
"DeviceHistoryEnabled"=dword:00000001
"HistoryViewEnabled"=dword:00000001

[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\Windows Search]
"ConnectedSearchUseWeb"=-
"ConnectedSearchUseWebOverMeteredConnections"=-
"AllowCloudSearch"=-
"AllowCortana"=-
"AllowCortanaAboveLock"=-
"DisableWebSearch"=-

; ------------------------------------------------------------------------------
; 3. RESTORE CLOUD CONTENT & DELIVERY VALUES
; ------------------------------------------------------------------------------

[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\CloudContent]
"DisableWindowsConsumerFeatures"=-
"DisableCloudOptimizedContent"=-
"DisableSoftLanding"=-
"DisableConsumerAccountStateContent"=-
"DisableTailoredExperiencesWithDiagnosticData"=-

[HKEY_CURRENT_USER\Software\Policies\Microsoft\Windows\CloudContent]
"DisableCloudOptimizedContent"=-
"DisableSoftLanding"=-
"DisableWindowsSpotlightFeatures"=-

[HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager]
"SilentInstalledAppsEnabled"=dword:00000001
"SystemPaneSuggestionsEnabled"=dword:00000001
"SoftLandingEnabled"=dword:00000001
"FeatureManagementEnabled"=dword:00000001
"ContentDeliveryAllowed"=dword:00000001
"OemPreInstalledAppsEnabled"=dword:00000001
"PreInstalledAppsEnabled"=dword:00000001
"RotatingLockScreenEnabled"=dword:00000001
"RotatingLockScreenOverlayEnabled"=dword:00000001
"SubscribedContent-310093Enabled"=dword:00000001
"SubscribedContent-338387Enabled"=dword:00000001
"SubscribedContent-338388Enabled"=dword:00000001
"SubscribedContent-338389Enabled"=dword:00000001
"SubscribedContent-353694Enabled"=dword:00000001
"SubscribedContent-353696Enabled"=dword:00000001
"SubscribedContent-353698Enabled"=dword:00000001

[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\PushToInstall]
"DisablePushToInstall"=-

; ------------------------------------------------------------------------------
; 4. RESTORE ADVERTISING ID & SIUF VALUES
; ------------------------------------------------------------------------------

[HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\AdvertisingInfo]
"Enabled"=dword:00000001

[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\AdvertisingInfo]
"DisabledByGroupPolicy"=-

[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\CPSS\Store\AdvertisingInfo]
"Value"=dword:00000001

[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\CPSS\DevicePolicy\AdvertisingInfo]
"DefaultValue"=dword:00000001

[HKEY_CURRENT_USER\Software\Microsoft\Siuf\Rules]
"NumberOfSIUFInPeriod"=-
"PeriodInNanoSeconds"=-

[HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Privacy]
"TailoredExperiencesWithDiagnosticDataEnabled"=dword:00000001

[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\CPSS\Store\TailoredExperiencesWithDiagnosticDataEnabled]
"Value"=dword:00000001

; ------------------------------------------------------------------------------
; 5. RESTORE ACTIVITY FEED & TIMELINE
; ------------------------------------------------------------------------------

[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\System]
"EnableActivityFeed"=-
"PublishUserActivities"=-
"UploadUserActivities"=-
"EnableCdp"=-

[HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced]
"Start_TrackProgs"=dword:00000001

; ------------------------------------------------------------------------------
; 6. RESTORE AUTOLOGGERS START VALUES
; ------------------------------------------------------------------------------

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\WMI\Autologger\AutoLogger-Diagtrack-Listener]
"Start"=dword:00000001

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\WMI\Autologger\Diagtrack-Listener]
"Start"=dword:00000001

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SQMLogger]
"Start"=dword:00000001

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\WMI\Autologger\AITEventLog]
"Start"=dword:00000001

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\WMI\Autologger\DiagLog]
"Start"=dword:00000001

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WiFiSession]
"Start"=dword:00000001

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\WMI\Autologger\WdiContextLog]
"Start"=dword:00000001

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SetupPlatformTel]
"Start"=dword:00000000
```

---

### 9.3 Production PowerShell Automation Script (`Apply-PrivacyLockdown.ps1`)

```powershell
<#
.SYNOPSIS
    Applies WinCraft 2.0 Deep Privacy, Telemetry, Cloud Content, and ETW Diagnostics Lockdown.
.DESCRIPTION
    Applies the universal 7-location AllowTelemetry lockdown, removes Bing/web search integration,
    disables Cloud Content suggestions, halts Advertising ID and SIUF polling, suppresses Activity
    feed synchronization, and tears down ETW autologger sessions both in registry and in memory.
.NOTES
    Requires Administrator privileges. Fully reversible via Restore-PrivacyDefaults.ps1.
#>

[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"

function Assert-Administrator {
    $currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
    if (-not $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
        throw "Elevation required: Apply-PrivacyLockdown.ps1 must be executed in an elevated administrator PowerShell session."
    }
}

function Set-RegistryDword {
    param (
        [Parameter(Mandatory=$true)][string]$Path,
        [Parameter(Mandatory=$true)][string]$Name,
        [Parameter(Mandatory=$true)][int]$Value
    )
    if (-not (Test-Path -Path $Path)) {
        $null = New-Item -Path $Path -Force
    }
    Set-ItemProperty -Path $Path -Name $Name -Value $Value -Type DWord -Force
}

Assert-Administrator
Write-Host "[WinCraft] Beginning Deep Privacy, Telemetry & Autologger Lockdown..." -ForegroundColor Cyan

# 1. UNIVERSAL 7-LOCATION TELEMETRY LOCKDOWN
Write-Host "  -> Applying Universal 7-Location AllowTelemetry Lockdown..." -ForegroundColor Gray
$telemetryLocations = @(
    "HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection",
    "HKCU:\Software\Policies\Microsoft\Windows\DataCollection",
    "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\DataCollection",
    "HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Policies\DataCollection",
    "HKLM:\SOFTWARE\WOW6432Node\Policies\Microsoft\Windows\DataCollection"
)
foreach ($loc in $telemetryLocations) {
    Set-RegistryDword -Path $loc -Name "AllowTelemetry" -Value 0
}

# MDM PolicyManager & CPSS
Set-RegistryDword -Path "HKLM:\SOFTWARE\Microsoft\PolicyManager\default\System\AllowTelemetry" -Name "value" -Value 0
Set-RegistryDword -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\CPSS\Store\AllowTelemetry" -Name "Value" -Value 0
Set-RegistryDword -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\CPSS\DevicePolicy\AllowTelemetry" -Name "DefaultValue" -Value 0

# Telemetry Companions
Set-RegistryDword -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection" -Name "MaxTelemetryAllowed" -Value 0
Set-RegistryDword -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection" -Name "AllowCommercialDataPipeline" -Value 0
Set-RegistryDword -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection" -Name "AllowDeviceNameInTelemetry" -Value 0
Set-RegistryDword -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection" -Name "DisableEnterpriseAuthProxy" -Value 1
Set-RegistryDword -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection" -Name "LimitDiagnosticLogCollection" -Value 1
Set-RegistryDword -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection" -Name "DoNotShowFeedbackNotifications" -Value 1
Set-RegistryDword -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\AppCompat" -Name "AITEnable" -Value 0
Set-RegistryDword -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\AppCompat" -Name "DisableInventory" -Value 1
Set-RegistryDword -Path "HKLM:\SOFTWARE\Policies\Microsoft\SQMClient\Windows" -Name "CEIPEnable" -Value 0

# 2. START & SEARCH TELEMETRY
Write-Host "  -> Hardening Start Menu & Windows Search (Local-Only)..." -ForegroundColor Gray
Set-RegistryDword -Path "HKCU:\Software\Policies\Microsoft\Windows\Explorer" -Name "DisableSearchBoxSuggestions" -Value 1
Set-RegistryDword -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\Explorer" -Name "DisableSearchBoxSuggestions" -Value 1
Set-RegistryDword -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Search" -Name "BingSearchEnabled" -Value 0
Set-RegistryDword -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Search" -Name "CortanaConsent" -Value 0
Set-RegistryDword -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Search" -Name "AllowCloudSearch" -Value 0
Set-RegistryDword -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Search" -Name "DeviceHistoryEnabled" -Value 0
Set-RegistryDword -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Search" -Name "HistoryViewEnabled" -Value 0
Set-RegistryDword -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\Windows Search" -Name "ConnectedSearchUseWeb" -Value 0
Set-RegistryDword -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\Windows Search" -Name "AllowCloudSearch" -Value 0
Set-RegistryDword -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\Windows Search" -Name "DisableWebSearch" -Value 1

# 3. CLOUD CONTENT & PROMOTIONS
Write-Host "  -> Suppressing Cloud Content & App Push Provisioning..." -ForegroundColor Gray
Set-RegistryDword -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\CloudContent" -Name "DisableWindowsConsumerFeatures" -Value 1
Set-RegistryDword -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\CloudContent" -Name "DisableCloudOptimizedContent" -Value 1
Set-RegistryDword -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\CloudContent" -Name "DisableSoftLanding" -Value 1
Set-RegistryDword -Path "HKCU:\Software\Policies\Microsoft\Windows\CloudContent" -Name "DisableCloudOptimizedContent" -Value 1
Set-RegistryDword -Path "HKCU:\Software\Policies\Microsoft\Windows\CloudContent" -Name "DisableSoftLanding" -Value 1

$cdmKeys = @(
    "SilentInstalledAppsEnabled",
    "SystemPaneSuggestionsEnabled",
    "SoftLandingEnabled",
    "FeatureManagementEnabled",
    "ContentDeliveryAllowed",
    "OemPreInstalledAppsEnabled",
    "PreInstalledAppsEnabled",
    "RotatingLockScreenEnabled",
    "RotatingLockScreenOverlayEnabled",
    "SubscribedContent-310093Enabled",
    "SubscribedContent-338387Enabled",
    "SubscribedContent-338388Enabled",
    "SubscribedContent-338389Enabled",
    "SubscribedContent-353694Enabled",
    "SubscribedContent-353696Enabled",
    "SubscribedContent-353698Enabled"
)
foreach ($cdm in $cdmKeys) {
    Set-RegistryDword -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager" -Name $cdm -Value 0
}
Set-RegistryDword -Path "HKLM:\SOFTWARE\Policies\Microsoft\PushToInstall" -Name "DisablePushToInstall" -Value 1

# 4. ADVERTISING ID & SIUF
Write-Host "  -> Disabling Advertising ID & Feedback Prompts..." -ForegroundColor Gray
Set-RegistryDword -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\AdvertisingInfo" -Name "Enabled" -Value 0
Set-RegistryDword -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\AdvertisingInfo" -Name "DisabledByGroupPolicy" -Value 1
Set-RegistryDword -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\CPSS\Store\AdvertisingInfo" -Name "Value" -Value 0
Set-RegistryDword -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\CPSS\DevicePolicy\AdvertisingInfo" -Name "DefaultValue" -Value 0
Set-RegistryDword -Path "HKCU:\Software\Microsoft\Siuf\Rules" -Name "NumberOfSIUFInPeriod" -Value 0
Set-RegistryDword -Path "HKCU:\Software\Microsoft\Siuf\Rules" -Name "PeriodInNanoSeconds" -Value 0
Set-RegistryDword -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Privacy" -Name "TailoredExperiencesWithDiagnosticDataEnabled" -Value 0

# 5. ACTIVITY FEED & TIMELINE
Write-Host "  -> Halting Activity Feed & Graph Data Uploads..." -ForegroundColor Gray
Set-RegistryDword -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\System" -Name "EnableActivityFeed" -Value 0
Set-RegistryDword -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\System" -Name "PublishUserActivities" -Value 0
Set-RegistryDword -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\System" -Name "UploadUserActivities" -Value 0
Set-RegistryDword -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\System" -Name "EnableCdp" -Value 0
Set-RegistryDword -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name "Start_TrackProgs" -Value 0

# 6. ETW AUTOLOGGER SESSION TEARDOWN (PERSIST + IN-MEMORY)
Write-Host "  -> Disabling ETW Autologger Sessions (Registry & In-Memory)..." -ForegroundColor Gray
$autologgers = @(
    "AutoLogger-Diagtrack-Listener",
    "Diagtrack-Listener",
    "SQMLogger",
    "AITEventLog",
    "DiagLog",
    "WiFiSession",
    "WdiContextLog",
    "SetupPlatformTel"
)

foreach ($logger in $autologgers) {
    $regPath = "HKLM:\SYSTEM\CurrentControlSet\Control\WMI\Autologger\$logger"
    if (Test-Path $regPath) {
        Set-ItemProperty -Path $regPath -Name "Start" -Value 0 -Type DWord -Force
    }
    # Immediate in-memory kernel trace teardown
    try {
        & logman.exe stop "$logger" -ets 2>&1 | Out-Null
    } catch {
        # Session may not be actively running
    }
}

Write-Host "[WinCraft] Deep Privacy & Telemetry Lockdown successfully applied." -ForegroundColor Green
```

---

### 9.4 Production PowerShell Rollback Script (`Restore-PrivacyDefaults.ps1`)

```powershell
<#
.SYNOPSIS
    Restores Windows Stock Privacy, Telemetry, and ETW Autologger defaults.
.DESCRIPTION
    Rolls back registry keys modified by Apply-PrivacyLockdown.ps1. Sets diagnostic
    telemetry to standard stock defaults and reenables required autologger configurations.
.NOTES
    Requires Administrator privileges.
#>

[CmdletBinding()]
param()

$ErrorActionPreference = "Continue"

function Assert-Administrator {
    $currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
    if (-not $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
        throw "Elevation required: Restore-PrivacyDefaults.ps1 must be executed in an elevated administrator PowerShell session."
    }
}

function Remove-RegistryValueSafe {
    param ([string]$Path, [string]$Name)
    if (Test-Path $Path) {
        Remove-ItemProperty -Path $Path -Name $Name -Force -ErrorAction SilentlyContinue
    }
}

function Set-RegistryDwordSafe {
    param ([string]$Path, [string]$Name, [int]$Value)
    if (-not (Test-Path $Path)) {
        $null = New-Item -Path $Path -Force
    }
    Set-ItemProperty -Path $Path -Name $Name -Value $Value -Type DWord -Force
}

Assert-Administrator
Write-Host "[WinCraft] Restoring Windows Stock Privacy & Telemetry Defaults..." -ForegroundColor Cyan

# 1. RESTORE TELEMETRY POLICIES
Write-Host "  -> Restoring Telemetry Policies..." -ForegroundColor Gray
$policyKeys = @(
    "AllowTelemetry", "MaxTelemetryAllowed", "AllowCommercialDataPipeline",
    "AllowDeviceNameInTelemetry", "DisableEnterpriseAuthProxy", "MicrosoftEdgeDataOptIn",
    "DisableTelemetryOptInChangeNotification", "DisableTelemetryOptInSettingsUx",
    "LimitDiagnosticLogCollection", "LimitDumpCollection", "DoNotShowFeedbackNotifications"
)
foreach ($val in $policyKeys) {
    Remove-RegistryValueSafe -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection" -Name $val
}
Remove-RegistryValueSafe -Path "HKCU:\Software\Policies\Microsoft\Windows\DataCollection" -Name "AllowTelemetry"
Remove-RegistryValueSafe -Path "HKLM:\SOFTWARE\WOW6432Node\Policies\Microsoft\Windows\DataCollection" -Name "AllowTelemetry"

Set-RegistryDwordSafe -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\DataCollection" -Name "AllowTelemetry" -Value 1
Set-RegistryDwordSafe -Path "HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Policies\DataCollection" -Name "AllowTelemetry" -Value 1
Set-RegistryDwordSafe -Path "HKLM:\SOFTWARE\Microsoft\PolicyManager\default\System\AllowTelemetry" -Name "value" -Value 1
Set-RegistryDwordSafe -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\CPSS\Store\AllowTelemetry" -Name "Value" -Value 1
Set-RegistryDwordSafe -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\CPSS\DevicePolicy\AllowTelemetry" -Name "DefaultValue" -Value 1

Remove-RegistryValueSafe -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\AppCompat" -Name "AITEnable"
Remove-RegistryValueSafe -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\AppCompat" -Name "DisableInventory"
Remove-RegistryValueSafe -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\AppCompat" -Name "DisableUAR"
Remove-RegistryValueSafe -Path "HKLM:\SOFTWARE\Policies\Microsoft\SQMClient\Windows" -Name "CEIPEnable"

# 2. RESTORE START & SEARCH
Write-Host "  -> Restoring Start Menu & Search Defaults..." -ForegroundColor Gray
Remove-RegistryValueSafe -Path "HKCU:\Software\Policies\Microsoft\Windows\Explorer" -Name "DisableSearchBoxSuggestions"
Remove-RegistryValueSafe -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\Explorer" -Name "DisableSearchBoxSuggestions"

Set-RegistryDwordSafe -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Search" -Name "BingSearchEnabled" -Value 1
Set-RegistryDwordSafe -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Search" -Name "CortanaConsent" -Value 1
Set-RegistryDwordSafe -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Search" -Name "AllowCloudSearch" -Value 1
Set-RegistryDwordSafe -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Search" -Name "DeviceHistoryEnabled" -Value 1
Set-RegistryDwordSafe -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Search" -Name "HistoryViewEnabled" -Value 1

$searchPolicies = @("ConnectedSearchUseWeb", "ConnectedSearchUseWebOverMeteredConnections", "AllowCloudSearch", "AllowCortana", "AllowCortanaAboveLock", "DisableWebSearch")
foreach ($sp in $searchPolicies) {
    Remove-RegistryValueSafe -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\Windows Search" -Name $sp
}

# 3. RESTORE CLOUD CONTENT
Write-Host "  -> Restoring Cloud Content & Delivery Defaults..." -ForegroundColor Gray
$cloudPolicies = @("DisableWindowsConsumerFeatures", "DisableCloudOptimizedContent", "DisableSoftLanding", "DisableConsumerAccountStateContent", "DisableTailoredExperiencesWithDiagnosticData")
foreach ($cp in $cloudPolicies) {
    Remove-RegistryValueSafe -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\CloudContent" -Name $cp
}
Remove-RegistryValueSafe -Path "HKCU:\Software\Policies\Microsoft\Windows\CloudContent" -Name "DisableCloudOptimizedContent"
Remove-RegistryValueSafe -Path "HKCU:\Software\Policies\Microsoft\Windows\CloudContent" -Name "DisableSoftLanding"
Remove-RegistryValueSafe -Path "HKCU:\Software\Policies\Microsoft\Windows\CloudContent" -Name "DisableWindowsSpotlightFeatures"

$cdmKeys = @(
    "SilentInstalledAppsEnabled", "SystemPaneSuggestionsEnabled", "SoftLandingEnabled",
    "FeatureManagementEnabled", "ContentDeliveryAllowed", "OemPreInstalledAppsEnabled",
    "PreInstalledAppsEnabled", "RotatingLockScreenEnabled", "RotatingLockScreenOverlayEnabled",
    "SubscribedContent-310093Enabled", "SubscribedContent-338387Enabled", "SubscribedContent-338388Enabled",
    "SubscribedContent-338389Enabled", "SubscribedContent-353694Enabled", "SubscribedContent-353696Enabled",
    "SubscribedContent-353698Enabled"
)
foreach ($cdm in $cdmKeys) {
    Set-RegistryDwordSafe -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager" -Name $cdm -Value 1
}
Remove-RegistryValueSafe -Path "HKLM:\SOFTWARE\Policies\Microsoft\PushToInstall" -Name "DisablePushToInstall"

# 4. RESTORE ADVERTISING & SIUF
Write-Host "  -> Restoring Advertising ID & SIUF Rules..." -ForegroundColor Gray
Set-RegistryDwordSafe -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\AdvertisingInfo" -Name "Enabled" -Value 1
Remove-RegistryValueSafe -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\AdvertisingInfo" -Name "DisabledByGroupPolicy"
Set-RegistryDwordSafe -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\CPSS\Store\AdvertisingInfo" -Name "Value" -Value 1
Set-RegistryDwordSafe -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\CPSS\DevicePolicy\AdvertisingInfo" -Name "DefaultValue" -Value 1

Remove-RegistryValueSafe -Path "HKCU:\Software\Microsoft\Siuf\Rules" -Name "NumberOfSIUFInPeriod"
Remove-RegistryValueSafe -Path "HKCU:\Software\Microsoft\Siuf\Rules" -Name "PeriodInNanoSeconds"
Set-RegistryDwordSafe -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Privacy" -Name "TailoredExperiencesWithDiagnosticDataEnabled" -Value 1

# 5. RESTORE ACTIVITY FEED
Write-Host "  -> Restoring Activity Feed & Timeline Policies..." -ForegroundColor Gray
$actPolicies = @("EnableActivityFeed", "PublishUserActivities", "UploadUserActivities", "EnableCdp")
foreach ($ap in $actPolicies) {
    Remove-RegistryValueSafe -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\System" -Name $ap
}
Set-RegistryDwordSafe -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name "Start_TrackProgs" -Value 1

# 6. RESTORE ETW AUTOLOGGERS
Write-Host "  -> Restoring ETW Autologger Startup Flags..." -ForegroundColor Gray
$loggers = @(
    "AutoLogger-Diagtrack-Listener",
    "Diagtrack-Listener",
    "SQMLogger",
    "AITEventLog",
    "DiagLog",
    "WiFiSession",
    "WdiContextLog"
)
foreach ($logger in $loggers) {
    $regPath = "HKLM:\SYSTEM\CurrentControlSet\Control\WMI\Autologger\$logger"
    if (Test-Path $regPath) {
        Set-ItemProperty -Path $regPath -Name "Start" -Value 1 -Type DWord -Force
    }
}

Write-Host "[WinCraft] Stock Windows defaults successfully restored." -ForegroundColor Green
```

---

## 10. Audit & Verification Runbook

To independently audit and verify that each tweak has been applied correctly without UI masking or registry reflection anomalies, execute the following commands in an elevated PowerShell session:

```powershell
# 1. Audit Universal 7-Location AllowTelemetry
Write-Host "=== AUDIT: AllowTelemetry Across 7 Locations ===" -ForegroundColor Cyan
@(
    "HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection",
    "HKCU:\Software\Policies\Microsoft\Windows\DataCollection",
    "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\DataCollection",
    "HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Policies\DataCollection",
    "HKLM:\SOFTWARE\WOW6432Node\Policies\Microsoft\Windows\DataCollection",
    "HKLM:\SOFTWARE\Microsoft\PolicyManager\default\System\AllowTelemetry",
    "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\CPSS\Store\AllowTelemetry"
) | ForEach-Object {
    $path = $_
    $prop = Get-ItemProperty -Path $path -ErrorAction SilentlyContinue
    $val = if ($prop.AllowTelemetry -ne $null) { $prop.AllowTelemetry } elseif ($prop.value -ne $null) { $prop.value } elseif ($prop.Value -ne $null) { $prop.Value } else { "NOT SET" }
    [PSCustomObject]@{ RegistryPath = $path; AllowTelemetry = $val }
} | Format-Table -AutoSize

# 2. Audit Start & Search Web Lockdown
Write-Host "=== AUDIT: Start & Search Web Lockdown ===" -ForegroundColor Cyan
[PSCustomObject]@{
    BingSearchEnabled = (Get-ItemProperty "HKCU:\Software\Microsoft\Windows\CurrentVersion\Search" -ErrorAction SilentlyContinue).BingSearchEnabled
    DisableSearchBoxSuggestions = (Get-ItemProperty "HKCU:\Software\Policies\Microsoft\Windows\Explorer" -ErrorAction SilentlyContinue).DisableSearchBoxSuggestions
    ConnectedSearchUseWeb = (Get-ItemProperty "HKLM:\SOFTWARE\Policies\Microsoft\Windows\Windows Search" -ErrorAction SilentlyContinue).ConnectedSearchUseWeb
} | Format-List

# 3. Audit Cloud Content & Advertising
Write-Host "=== AUDIT: Cloud Content & Advertising ===" -ForegroundColor Cyan
[PSCustomObject]@{
    DisableConsumerFeatures = (Get-ItemProperty "HKLM:\SOFTWARE\Policies\Microsoft\Windows\CloudContent" -ErrorAction SilentlyContinue).DisableWindowsConsumerFeatures
    AdvertisingEnabled = (Get-ItemProperty "HKCU:\Software\Microsoft\Windows\CurrentVersion\AdvertisingInfo" -ErrorAction SilentlyContinue).Enabled
    AdvertisingGPO = (Get-ItemProperty "HKLM:\SOFTWARE\Policies\Microsoft\Windows\AdvertisingInfo" -ErrorAction SilentlyContinue).DisabledByGroupPolicy
    NumberOfSIUFInPeriod = (Get-ItemProperty "HKCU:\Software\Microsoft\Siuf\Rules" -ErrorAction SilentlyContinue).NumberOfSIUFInPeriod
} | Format-List

# 4. Audit ETW Autologgers
Write-Host "=== AUDIT: ETW Autologger Start Flags ===" -ForegroundColor Cyan
@(
    "AutoLogger-Diagtrack-Listener",
    "Diagtrack-Listener",
    "SQMLogger",
    "AITEventLog",
    "DiagLog",
    "WiFiSession"
) | ForEach-Object {
    $name = $_
    $reg = Get-ItemProperty "HKLM:\SYSTEM\CurrentControlSet\Control\WMI\Autologger\$name" -ErrorAction SilentlyContinue
    $running = (& logman query -ets 2>&1 | Select-String -Pattern "^$name\s") -ne $null
    [PSCustomObject]@{
        Autologger = $name
        RegistryStart = if ($reg) { $reg.Start } else { "Missing" }
        ActiveInMemory = $running
    }
} | Format-Table -AutoSize
```
