# WinCraft 2.0: Optimisation Catalogue Specification (~150 Controls)

**Document Version:** 1.0.0  
**Date:** October 13, 2026  
**Status:** Canonical Reference Specification  
**Scope:** Exhaustive registry key definitions, data types, default vs target values, elevation tiers, and rollback rules for all ~150 WinCraft 2.0 controls.

---

## 1. Schema & Engine Data Types

Every tweak in the WinCraft 2.0 catalogue conforms to the following Rust/TypeScript contract:

```typescript
export type Hive = "HKLM" | "HKCU" | "HKCR" | "HKU";

export type RegValueType =
  | "Dword" // 32-bit unsigned integer (u32)
  | "Qword" // 64-bit unsigned integer (u64)
  | "String" // Null-terminated UTF-16 string
  | "ExpandStr" // String containing unexpanded environment variables
  | "MultiSz" // Array of strings (REG_MULTI_SZ)
  | "Binary" // Raw byte buffer (Vec<u8>)
  | "DeleteKey" // Declarative subkey removal with tree snapshot
  | "DeleteVal"; // Declarative value deletion

export interface TweakDefinition {
  id: string;
  category: "privacy" | "ui" | "services" | "gaming" | "network" | "storage" | "power";
  hive: Hive;
  path: string;
  name: string;
  targetValue: any;
  valueType: RegValueType;
  defaultValue: any;
  requiresAdmin: boolean;
  minBuild?: number;
  maxBuild?: number;
  evidence: "Measured" | "Modest" | "Neutral";
  rebootRequired: boolean;
  signOutRequired: boolean;
}
```

---

## 2. Complete Catalogue Inventory

### 2.1 Domain 1: Telemetry, Privacy & Modern AI Hardening (~35 Controls)

| ID                                  | Hive | Registry Path                                                                   | Value Name                                     | Type  | Default | Optimized | Admin | Evidence |
| :---------------------------------- | :--- | :------------------------------------------------------------------------------ | :--------------------------------------------- | :---- | :------ | :-------- | :---- | :------- |
| `telemetry_allow_telemetry_hklm`    | HKLM | `SOFTWARE\Policies\Microsoft\Windows\DataCollection`                            | `AllowTelemetry`                               | Dword | `3`     | `0`       | Yes   | Measured |
| `telemetry_max_telemetry`           | HKLM | `SOFTWARE\Policies\Microsoft\Windows\DataCollection`                            | `MaxTelemetryAllowed`                          | Dword | `3`     | `0`       | Yes   | Measured |
| `telemetry_commercial_optin`        | HKLM | `SOFTWARE\Policies\Microsoft\Windows\DataCollection`                            | `CommercialDataOptIn`                          | Dword | `1`     | `0`       | Yes   | Modest   |
| `telemetry_diag_data_viewer`        | HKLM | `SOFTWARE\Policies\Microsoft\Windows\DataCollection`                            | `DisableDiagnosticDataViewer`                  | Dword | `0`     | `1`       | Yes   | Modest   |
| `telemetry_feedback_notifications`  | HKLM | `SOFTWARE\Policies\Microsoft\Windows\DataCollection`                            | `DoNotShowFeedbackNotifications`               | Dword | `0`     | `1`       | Yes   | Modest   |
| `telemetry_tailored_experiences`    | HKCU | `Software\Policies\Microsoft\Windows\CloudContent`                              | `DisableTailoredExperiencesWithDiagnosticData` | Dword | `0`     | `1`       | No    | Measured |
| `telemetry_ceip_sqm`                | HKLM | `SOFTWARE\Policies\Microsoft\SQMClient\Windows`                                 | `CEIPEnable`                                   | Dword | `1`     | `0`       | Yes   | Measured |
| `telemetry_wer_disable`             | HKLM | `SOFTWARE\Policies\Microsoft\Windows\Windows Error Reporting`                   | `Disabled`                                     | Dword | `0`     | `1`       | Yes   | Modest   |
| `telemetry_wer_queuing`             | HKLM | `SOFTWARE\Policies\Microsoft\Windows\Windows Error Reporting`                   | `DoNotQueue`                                   | Dword | `0`     | `1`       | Yes   | Modest   |
| `telemetry_autologger_diagtrack`    | HKLM | `SYSTEM\CurrentControlSet\Control\WMI\Autologger\AutoLogger-Diagtrack-Listener` | `Start`                                        | Dword | `1`     | `0`       | Yes   | Measured |
| `telemetry_autologger_sqm`          | HKLM | `SYSTEM\CurrentControlSet\Control\WMI\Autologger\SQMLogger`                     | `Start`                                        | Dword | `1`     | `0`       | Yes   | Measured |
| `telemetry_autologger_ait`          | HKLM | `SYSTEM\CurrentControlSet\Control\WMI\Autologger\AITEventLog`                   | `Start`                                        | Dword | `1`     | `0`       | Yes   | Measured |
| `telemetry_advertising_id`          | HKCU | `Software\Microsoft\Windows\CurrentVersion\AdvertisingInfo`                     | `Enabled`                                      | Dword | `1`     | `0`       | No    | Measured |
| `telemetry_activity_feed`           | HKLM | `SOFTWARE\Policies\Microsoft\Windows\System`                                    | `EnableActivityFeed`                           | Dword | `1`     | `0`       | Yes   | Measured |
| `telemetry_publish_user_activities` | HKLM | `SOFTWARE\Policies\Microsoft\Windows\System`                                    | `PublishUserActivities`                        | Dword | `1`     | `0`       | Yes   | Measured |
| `telemetry_upload_user_activities`  | HKLM | `SOFTWARE\Policies\Microsoft\Windows\System`                                    | `UploadUserActivities`                         | Dword | `1`     | `0`       | Yes   | Measured |
| `telemetry_cloud_clipboard`         | HKLM | `SOFTWARE\Policies\Microsoft\Windows\System`                                    | `AllowCrossDeviceClipboard`                    | Dword | `1`     | `0`       | Yes   | Modest   |
| `telemetry_ink_typing_harvest`      | HKCU | `Software\Microsoft\Input\TIPC`                                                 | `Enabled`                                      | Dword | `1`     | `0`       | No    | Measured |
| `telemetry_handwriting_error`       | HKLM | `SOFTWARE\Policies\Microsoft\Windows\HandwritingErrorReports`                   | `PreventHandwritingDataSharing`                | Dword | `0`     | `1`       | Yes   | Modest   |
| `telemetry_device_metadata`         | HKLM | `SOFTWARE\Policies\Microsoft\Windows\Device Metadata`                           | `PreventDeviceMetadataFromNetwork`             | Dword | `0`     | `1`       | Yes   | Modest   |
| `telemetry_location_sensors`        | HKLM | `SOFTWARE\Policies\Microsoft\Windows\LocationAndSensors`                        | `DisableLocation`                              | Dword | `0`     | `1`       | Yes   | Measured |
| `telemetry_cortana_disable`         | HKLM | `SOFTWARE\Policies\Microsoft\Windows\Windows Search`                            | `AllowCortana`                                 | Dword | `1`     | `0`       | Yes   | Measured |
| `telemetry_copilot_turn_off`        | HKCU | `Software\Policies\Microsoft\Windows\WindowsCopilot`                            | `TurnOffWindowsCopilot`                        | Dword | `0`     | `1`       | No    | Measured |
| `telemetry_recall_disable`          | HKLM | `SOFTWARE\Policies\Microsoft\Windows\Windows AI`                                | `DisableAIDataAnalysis`                        | Dword | `0`     | `1`       | Yes   | Measured |
| `telemetry_recall_user_allow`       | HKCU | `Software\Policies\Microsoft\Windows\Windows AI`                                | `AllowRecall`                                  | Dword | `1`     | `0`       | No    | Measured |
| `telemetry_edge_startup_boost`      | HKLM | `SOFTWARE\Policies\Microsoft\Edge`                                              | `StartupBoostEnabled`                          | Dword | `1`     | `0`       | Yes   | Measured |
| `telemetry_edge_background_mode`    | HKLM | `SOFTWARE\Policies\Microsoft\Edge`                                              | `BackgroundModeEnabled`                        | Dword | `1`     | `0`       | Yes   | Measured |
| `telemetry_edge_metrics`            | HKLM | `SOFTWARE\Policies\Microsoft\Edge`                                              | `MetricsReportingEnabled`                      | Dword | `1`     | `0`       | Yes   | Measured |
| `telemetry_edge_shopping`           | HKLM | `SOFTWARE\Policies\Microsoft\Edge`                                              | `EdgeShoppingAssistantEnabled`                 | Dword | `1`     | `0`       | Yes   | Modest   |
| `telemetry_app_compat_telemetry`    | HKLM | `SOFTWARE\Policies\Microsoft\Windows\AppCompat`                                 | `AITEnable`                                    | Dword | `1`     | `0`       | Yes   | Measured |
| `telemetry_inventory_collector`     | HKLM | `SOFTWARE\Policies\Microsoft\Windows\AppCompat`                                 | `DisableInventory`                             | Dword | `0`     | `1`       | Yes   | Measured |
| `telemetry_steps_recorder`          | HKLM | `SOFTWARE\Policies\Microsoft\Windows\AppCompat`                                 | `DisableUAR`                                   | Dword | `0`     | `1`       | Yes   | Modest   |
| `telemetry_wifi_sense`              | HKLM | `SOFTWARE\Microsoft\WcmSvc\wifinetworkmanager\config`                           | `AutoConnectAllowedOEM`                        | Dword | `1`     | `0`       | Yes   | Modest   |
| `telemetry_smartscreen_app_install` | HKLM | `SOFTWARE\Policies\Microsoft\Windows\System`                                    | `EnableSmartScreen`                            | Dword | `1`     | `0`       | Yes   | Modest   |
| `telemetry_speech_cloud_collection` | HKCU | `Software\Microsoft\Speech_OneCore\Settings\OnlineSpeechPrivacy`                | `HasAccepted`                                  | Dword | `1`     | `0`       | No    | Measured |

---

### 2.2 Domain 2: Desktop, Shell & UI Responsiveness (~30 Controls)

| ID                                  | Hive | Registry Path                                                                  | Value Name                         | Type   | Default  | Optimized | Admin | Evidence |
| :---------------------------------- | :--- | :----------------------------------------------------------------------------- | :--------------------------------- | :----- | :------- | :-------- | :---- | :------- |
| `ui_menu_show_delay`                | HKCU | `Control Panel\Desktop`                                                        | `MenuShowDelay`                    | String | `"400"`  | `"10"`    | No    | Measured |
| `ui_hung_app_timeout`               | HKCU | `Control Panel\Desktop`                                                        | `HungAppTimeout`                   | String | `"5000"` | `"1000"`  | No    | Measured |
| `ui_wait_kill_service`              | HKLM | `SYSTEM\CurrentControlSet\Control`                                             | `WaitToKillServiceTimeout`         | String | `"5000"` | `"2000"`  | Yes   | Measured |
| `ui_auto_end_tasks`                 | HKCU | `Control Panel\Desktop`                                                        | `AutoEndTasks`                     | String | `"0"`    | `"1"`     | No    | Modest   |
| `ui_min_animate`                    | HKCU | `Control Panel\Desktop\WindowMetrics`                                          | `MinAnimate`                       | String | `"1"`    | `"0"`     | No    | Measured |
| `ui_transparency_disable`           | HKCU | `Software\Microsoft\Windows\CurrentVersion\Themes\Personalize`                 | `EnableTransparency`               | Dword  | `1`      | `0`       | No    | Measured |
| `ui_classic_context_menu`           | HKCU | `Software\Classes\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\InprocServer32` | `@`                                | String | (none)   | `""`      | No    | Measured |
| `ui_explorer_launch_this_pc`        | HKCU | `Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced`                  | `LaunchTo`                         | Dword  | `2`      | `1`       | No    | Measured |
| `ui_explorer_hide_recent_files`     | HKCU | `Software\Microsoft\Windows\CurrentVersion\Explorer`                           | `ShowRecent`                       | Dword  | `1`      | `0`       | No    | Modest   |
| `ui_explorer_hide_frequent_folders` | HKCU | `Software\Microsoft\Windows\CurrentVersion\Explorer`                           | `ShowFrequent`                     | Dword  | `1`      | `0`       | No    | Modest   |
| `ui_explorer_hide_cloud_files`      | HKCU | `Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced`                  | `ShowCloudFilesInQuickAccess`      | Dword  | `1`      | `0`       | No    | Modest   |
| `ui_explorer_show_extensions`       | HKCU | `Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced`                  | `HideFileExt`                      | Dword  | `1`      | `0`       | No    | Modest   |
| `ui_explorer_show_hidden_files`     | HKCU | `Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced`                  | `Hidden`                           | Dword  | `2`      | `1`       | No    | Modest   |
| `ui_explorer_separate_process`      | HKCU | `Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced`                  | `SeparateProcess`                  | Dword  | `0`      | `1`       | No    | Modest   |
| `ui_explorer_disable_search_box`    | HKCU | `Software\Policies\Microsoft\Windows\Explorer`                                 | `DisableSearchBoxSuggestions`      | Dword  | `0`      | `1`       | No    | Measured |
| `ui_start_bing_search`              | HKCU | `Software\Policies\Microsoft\Windows\Explorer`                                 | `DisableSearchBoxSuggestions`      | Dword  | `0`      | `1`       | No    | Measured |
| `ui_start_bing_search_enabled`      | HKCU | `Software\Microsoft\Windows\CurrentVersion\Search`                             | `BingSearchEnabled`                | Dword  | `1`      | `0`       | No    | Measured |
| `ui_start_cortana_consent`          | HKCU | `Software\Microsoft\Windows\CurrentVersion\Search`                             | `CortanaConsent`                   | Dword  | `1`      | `0`       | No    | Measured |
| `ui_start_recommendations`          | HKCU | `Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced`                  | `Start_TrackProgs`                 | Dword  | `1`      | `0`       | No    | Measured |
| `ui_start_recently_added`           | HKCU | `Software\Policies\Microsoft\Windows\Explorer`                                 | `HideRecentlyAddedApps`            | Dword  | `0`      | `1`       | No    | Modest   |
| `ui_start_promoted_apps`            | HKCU | `Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager`             | `SilentInstalledAppsEnabled`       | Dword  | `1`      | `0`       | No    | Measured |
| `ui_taskbar_widgets`                | HKCU | `Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced`                  | `TaskbarDa`                        | Dword  | `1`      | `0`       | No    | Measured |
| `ui_taskbar_news_interests`         | HKLM | `SOFTWARE\Policies\Microsoft\Dsh`                                              | `AllowNewsAndInterests`            | Dword  | `1`      | `0`       | Yes   | Measured |
| `ui_taskbar_task_view`              | HKCU | `Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced`                  | `ShowTaskViewButton`               | Dword  | `1`      | `0`       | No    | Modest   |
| `ui_taskbar_chat_meet`              | HKCU | `Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced`                  | `TaskbarMn`                        | Dword  | `1`      | `0`       | No    | Modest   |
| `ui_lockscreen_ads`                 | HKCU | `Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager`             | `RotatingLockScreenOverlayEnabled` | Dword  | `1`      | `0`       | No    | Modest   |
| `ui_lockscreen_tips`                | HKCU | `Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager`             | `SubscribedContent-338387Enabled`  | Dword  | `1`      | `0`       | No    | Modest   |
| `ui_settings_tips`                  | HKCU | `Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager`             | `SubscribedContent-338393Enabled`  | Dword  | `1`      | `0`       | No    | Modest   |
| `ui_welcome_experience`             | HKCU | `Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager`             | `SubscribedContent-310093Enabled`  | Dword  | `1`      | `0`       | No    | Modest   |
| `ui_sticky_keys_prompt`             | HKCU | `Control Panel\Accessibility\StickyKeys`                                       | `Flags`                            | String | `"510"`  | `"506"`   | No    | Measured |

---

### 2.3 Domain 3: Subsystem, SvcHost & Service Optimization (~25 Controls)

| ID                               | Hive | Registry Path                                                     | Value Name                  | Type  | Default      | Optimized    | Admin | Evidence |
| :------------------------------- | :--- | :---------------------------------------------------------------- | :-------------------------- | :---- | :----------- | :----------- | :---- | :------- |
| `subsys_svchost_split`           | HKLM | `SYSTEM\CurrentControlSet\Control`                                | `SvcHostSplitThresholdInKB` | Dword | `0x00380000` | `0xFFFFFFFF` | Yes   | Measured |
| `subsys_service_diagtrack`       | HKLM | `SYSTEM\CurrentControlSet\Services\DiagTrack`                     | `Start`                     | Dword | `2`          | `4`          | Yes   | Measured |
| `subsys_service_wersvc`          | HKLM | `SYSTEM\CurrentControlSet\Services\WerSvc`                        | `Start`                     | Dword | `3`          | `4`          | Yes   | Modest   |
| `subsys_service_dmwappush`       | HKLM | `SYSTEM\CurrentControlSet\Services\dmwappushservice`              | `Start`                     | Dword | `3`          | `4`          | Yes   | Measured |
| `subsys_service_mapsbroker`      | HKLM | `SYSTEM\CurrentControlSet\Services\MapsBroker`                    | `Start`                     | Dword | `2`          | `4`          | Yes   | Modest   |
| `subsys_service_geoloc`          | HKLM | `SYSTEM\CurrentControlSet\Services\lfsvc`                         | `Start`                     | Dword | `3`          | `4`          | Yes   | Modest   |
| `subsys_service_retaildemo`      | HKLM | `SYSTEM\CurrentControlSet\Services\RetailDemo`                    | `Start`                     | Dword | `3`          | `4`          | Yes   | Modest   |
| `subsys_service_pcasvc`          | HKLM | `SYSTEM\CurrentControlSet\Services\PcaSvc`                        | `Start`                     | Dword | `2`          | `4`          | Yes   | Modest   |
| `subsys_service_sysmain`         | HKLM | `SYSTEM\CurrentControlSet\Services\SysMain`                       | `Start`                     | Dword | `2`          | `4`          | Yes   | Measured |
| `subsys_service_wisvc`           | HKLM | `SYSTEM\CurrentControlSet\Services\wisvc`                         | `Start`                     | Dword | `3`          | `4`          | Yes   | Modest   |
| `subsys_service_touchkeyboard`   | HKLM | `SYSTEM\CurrentControlSet\Services\TabletInputService`            | `Start`                     | Dword | `3`          | `4`          | Yes   | Modest   |
| `subsys_service_remote_registry` | HKLM | `SYSTEM\CurrentControlSet\Services\RemoteRegistry`                | `Start`                     | Dword | `3`          | `4`          | Yes   | Measured |
| `subsys_service_edge_elevation`  | HKLM | `SYSTEM\CurrentControlSet\Services\MicrosoftEdgeElevationService` | `Start`                     | Dword | `3`          | `4`          | Yes   | Modest   |
| `subsys_service_edge_update`     | HKLM | `SYSTEM\CurrentControlSet\Services\edgeupdate`                    | `Start`                     | Dword | `2`          | `3`          | Yes   | Modest   |
| `subsys_service_edge_updatem`    | HKLM | `SYSTEM\CurrentControlSet\Services\edgeupdatem`                   | `Start`                     | Dword | `3`          | `3`          | Yes   | Modest   |
| `subsys_service_wsearch`         | HKLM | `SYSTEM\CurrentControlSet\Services\WSearch`                       | `Start`                     | Dword | `2`          | `3`          | Yes   | Measured |
| `subsys_service_sharedaccess`    | HKLM | `SYSTEM\CurrentControlSet\Services\SharedAccess`                  | `Start`                     | Dword | `3`          | `4`          | Yes   | Modest   |
| `subsys_service_sensrsvc`        | HKLM | `SYSTEM\CurrentControlSet\Services\SensrSvc`                      | `Start`                     | Dword | `3`          | `4`          | Yes   | Modest   |
| `subsys_service_xblauth`         | HKLM | `SYSTEM\CurrentControlSet\Services\XblAuthManager`                | `Start`                     | Dword | `3`          | `4`          | Yes   | Modest   |
| `subsys_service_xblgame`         | HKLM | `SYSTEM\CurrentControlSet\Services\XblGameSave`                   | `Start`                     | Dword | `3`          | `4`          | Yes   | Modest   |
| `subsys_service_xboxnet`         | HKLM | `SYSTEM\CurrentControlSet\Services\XboxNetApiSvc`                 | `Start`                     | Dword | `3`          | `4`          | Yes   | Modest   |
| `subsys_service_onedrive_sync`   | HKLM | `SYSTEM\CurrentControlSet\Services\OneSyncSvc`                    | `Start`                     | Dword | `2`          | `4`          | Yes   | Modest   |
| `subsys_service_bluetooth_audio` | HKLM | `SYSTEM\CurrentControlSet\Services\BTAGService`                   | `Start`                     | Dword | `3`          | `4`          | Yes   | Modest   |
| `subsys_service_phone_link`      | HKLM | `SYSTEM\CurrentControlSet\Services\PhoneSvc`                      | `Start`                     | Dword | `3`          | `4`          | Yes   | Modest   |
| `subsys_service_mixed_reality`   | HKLM | `SYSTEM\CurrentControlSet\Services\MixedRealityRuntime`           | `Start`                     | Dword | `3`          | `4`          | Yes   | Modest   |

---

### 2.4 Domain 4: Low-Latency Kernel, Gaming & Network Tuning (~35 Controls)

| ID                               | Hive | Registry Path                                                                                                                    | Value Name                      | Type   | Default             | Optimized           | Admin | Evidence |
| :------------------------------- | :--- | :------------------------------------------------------------------------------------------------------------------------------- | :------------------------------ | :----- | :------------------ | :------------------ | :---- | :------- |
| `perf_network_throttling_index`  | HKLM | `SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile`                                                          | `NetworkThrottlingIndex`        | Dword  | `10`                | `0xFFFFFFFF`        | Yes   | Measured |
| `perf_system_responsiveness`     | HKLM | `SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile`                                                          | `SystemResponsiveness`          | Dword  | `20`                | `0`                 | Yes   | Measured |
| `perf_games_priority`            | HKLM | `SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games`                                              | `Priority`                      | Dword  | `2`                 | `6`                 | Yes   | Measured |
| `perf_games_scheduling_category` | HKLM | `SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games`                                              | `Scheduling Category`           | String | `"Medium"`          | `"High"`            | Yes   | Measured |
| `perf_games_sfio_priority`       | HKLM | `SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games`                                              | `SFIO Priority`                 | String | `"Normal"`          | `"High"`            | Yes   | Measured |
| `perf_games_gpu_priority`        | HKLM | `SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games`                                              | `GPU Priority`                  | Dword  | `8`                 | `8`                 | Yes   | Measured |
| `perf_game_dvr_app_capture`      | HKCU | `System\GameConfigStore`                                                                                                         | `AppCaptureEnabled`             | Dword  | `1`                 | `0`                 | No    | Measured |
| `perf_game_dvr_enabled`          | HKCU | `System\GameConfigStore`                                                                                                         | `GameDVR_Enabled`               | Dword  | `1`                 | `0`                 | No    | Measured |
| `perf_game_dvr_fse`              | HKCU | `System\GameConfigStore`                                                                                                         | `GameDVR_FSEBehaviorMode`       | Dword  | `0`                 | `2`                 | No    | Measured |
| `perf_game_dvr_policy`           | HKLM | `SOFTWARE\Policies\Microsoft\Windows\GameDVR`                                                                                    | `AllowGameDVR`                  | Dword  | `1`                 | `0`                 | Yes   | Measured |
| `perf_raw_mouse_acceleration`    | HKCU | `Control Panel\Mouse`                                                                                                            | `MouseSpeed`                    | String | `"1"`               | `"0"`               | No    | Measured |
| `perf_mouse_threshold1`          | HKCU | `Control Panel\Mouse`                                                                                                            | `MouseThreshold1`               | String | `"6"`               | `"0"`               | No    | Measured |
| `perf_mouse_threshold2`          | HKCU | `Control Panel\Mouse`                                                                                                            | `MouseThreshold2`               | String | `"10"`              | `"0"`               | No    | Measured |
| `perf_hags_gpu_scheduling`       | HKLM | `SYSTEM\CurrentControlSet\Control\GraphicsDrivers`                                                                               | `HwSchMode`                     | Dword  | `1`                 | `2`                 | Yes   | Measured |
| `perf_vrr_variable_refresh`      | HKCU | `Control Panel\GraphicsDrivers`                                                                                                  | `VariableRefreshRate`           | Dword  | `0`                 | `1`                 | No    | Modest   |
| `perf_power_core_parking`        | HKLM | `SYSTEM\CurrentControlSet\Control\Power\PowerSettings\54533251-82be-4824-96c1-47b60b740d00\0cc5b647-c1df-4637-891a-dec35c318583` | `Attributes`                    | Dword  | `1`                 | `0`                 | Yes   | Measured |
| `perf_power_throttling`          | HKLM | `SYSTEM\CurrentControlSet\Control\Power\PowerThrottling`                                                                         | `PowerThrottlingOff`            | Dword  | `0`                 | `1`                 | Yes   | Measured |
| `perf_ntfs_disable_8dot3`        | HKLM | `SYSTEM\CurrentControlSet\Control\FileSystem`                                                                                    | `NtfsDisable8dot3NameCreation`  | Dword  | `2`                 | `1`                 | Yes   | Measured |
| `perf_ntfs_disable_last_access`  | HKLM | `SYSTEM\CurrentControlSet\Control\FileSystem`                                                                                    | `NtfsDisableLastAccess`         | Dword  | `2`                 | `1`                 | Yes   | Measured |
| `perf_tcp_nodelay`               | HKLM | `SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\Interfaces`                                                                  | `TCPNoDelay`                    | Dword  | `0`                 | `1`                 | Yes   | Measured |
| `perf_tcp_ack_frequency`         | HKLM | `SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\Interfaces`                                                                  | `TcpAckFrequency`               | Dword  | `2`                 | `1`                 | Yes   | Measured |
| `perf_tcp_del_ack_ticks`         | HKLM | `SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\Interfaces`                                                                  | `TcpDelAckTicks`                | Dword  | `2`                 | `0`                 | Yes   | Measured |
| `perf_tcp_chimney`               | HKLM | `SYSTEM\CurrentControlSet\Services\Tcpip\Parameters`                                                                             | `EnableTCPChimney`              | Dword  | `1`                 | `0`                 | Yes   | Modest   |
| `perf_rss_receive_side`          | HKLM | `SYSTEM\CurrentControlSet\Services\Tcpip\Parameters`                                                                             | `EnableRSS`                     | Dword  | `0`                 | `1`                 | Yes   | Measured |
| `perf_large_system_cache`        | HKLM | `SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management`                                                             | `LargeSystemCache`              | Dword  | `0`                 | `0`                 | Yes   | Modest   |
| `perf_disable_paging_executive`  | HKLM | `SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management`                                                             | `DisablePagingExecutive`        | Dword  | `0`                 | `1`                 | Yes   | Measured |
| `perf_clear_pagefile_shutdown`   | HKLM | `SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management`                                                             | `ClearPageFileAtShutdown`       | Dword  | `0`                 | `0`                 | Yes   | Modest   |
| `perf_long_paths_enabled`        | HKLM | `SYSTEM\CurrentControlSet\Control\FileSystem`                                                                                    | `LongPathsEnabled`              | Dword  | `0`                 | `1`                 | Yes   | Modest   |
| `perf_wpbt_execution`            | HKLM | `SYSTEM\CurrentControlSet\Control\Session Manager`                                                                               | `DisableWpbtExecution`          | Dword  | `0`                 | `1`                 | Yes   | Modest   |
| `perf_hibernation_fastboot`      | HKLM | `SYSTEM\CurrentControlSet\Control\Session Manager\Power`                                                                         | `HiberbootEnabled`              | Dword  | `1`                 | `0`                 | Yes   | Measured |
| `perf_bluetooth_le_discovery`    | HKLM | `SOFTWARE\Microsoft\Windows\CurrentVersion\Bluetooth`                                                                            | `DisableLEScan`                 | Dword  | `0`                 | `1`                 | Yes   | Modest   |
| `perf_qos_bandwidth_limit`       | HKLM | `SOFTWARE\Policies\Microsoft\Windows\Psched`                                                                                     | `NonBestEffortLimit`            | Dword  | `20`                | `0`                 | Yes   | Modest   |
| `perf_visual_drop_shadows`       | HKCU | `Control Panel\Desktop`                                                                                                          | `UserPreferencesMask`           | Binary | `[158, 30, 7, 128]` | `[142, 30, 7, 128]` | No    | Modest   |
| `perf_visual_font_smoothing`     | HKCU | `Control Panel\Desktop`                                                                                                          | `FontSmoothing`                 | String | `"2"`               | `"2"`               | No    | Neutral  |
| `perf_dynamic_tick_disable`      | HKLM | `SYSTEM\CurrentControlSet\Control\Session Manager\Kernel`                                                                        | `GlobalTimerResolutionRequests` | Dword  | `0`                 | `1`                 | Yes   | Measured |

---

## 3. Verification & Safety Guarantees

1. **Reversibility Guarantee:** All values write snapshot entries to `%APPDATA%\WinCraft\history.json` before applying changes.
2. **Missing Key Handling:** Intermediate subkeys are created dynamically and flagged for clean deletion upon rollback.
3. **No Unprivileged Escalation:** Non-elevated presets strictly query and apply `HKCU` keys without prompting UAC.
