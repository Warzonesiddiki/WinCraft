use crate::rollback::{RegValue, RegistrySnapshot, RollbackStore, SnapshotEntry};
use serde::Serialize;

#[derive(Serialize, Clone, Copy)]
pub enum Category {
    Performance,
    Privacy,
    Ui,
    Maintenance,
    Gaming,
}

#[derive(Serialize, Clone, Copy, Debug, PartialEq, Eq)]
pub enum Hive {
    Hkcu,
    Hklm,
}

/// The three registry operations every tweak is built from. Production code
/// reaches the real registry through `windows_impl::WinRegistry`; unit tests
/// install the in-memory backend in `tests/mock_registry.rs`, so the catalogue
/// and the rollback store can be exercised on a CI runner without touching the
/// machine running them.
pub trait RegistryBackend {
    /// `Ok(None)` when the key or the value is absent. Types other than
    /// REG_DWORD and REG_SZ are `InvalidData`: nothing here could put them
    /// back exactly, so no tweak may snapshot them.
    fn read(&self, hive: Hive, path: &str, name: &str) -> std::io::Result<Option<RegValue>>;
    /// Creates the key when it does not exist yet.
    fn write(&self, hive: Hive, path: &str, name: &str, value: &RegValue) -> std::io::Result<()>;
    /// Removing a value (or key) that is already gone is success.
    fn delete(&self, hive: Hive, path: &str, name: &str) -> std::io::Result<()>;
    /// Whether the key itself exists, values or not.
    fn key_exists(&self, hive: Hive, path: &str) -> std::io::Result<bool>;
    /// Creates the key (and its parents) without writing any value.
    fn create_key(&self, hive: Hive, path: &str) -> std::io::Result<()>;
    /// Deletes the key with everything under it. Already gone is success.
    fn delete_tree(&self, hive: Hive, path: &str) -> std::io::Result<()>;
    /// Names of the values and subkeys directly under a key, empty when the
    /// key is absent.
    fn names(&self, hive: Hive, path: &str) -> std::io::Result<Vec<String>>;
}

/// A tweak backed by a single registry value (DWORD or string).
/// `on_value` is written when applying; the previous value is snapshotted
/// first so `rollback` can put it back exactly as it was.
pub struct RegistryTweak {
    pub id: &'static str,
    pub name: &'static str,
    pub description: &'static str,
    pub category: Category,
    pub hive: Hive,
    pub key_path: &'static str,
    pub value_name: &'static str,
    pub on_value: RegValue,
    pub requires_admin: bool,
    pub requires_pro: bool,
}

/// Every `name`/`description` here is English on purpose: the UI only falls
/// back to these when a tweak id has no translation for the active language
/// (see `textFor` in App.tsx), and English is the app's primary language. They
/// used to be Italian, which meant a missing translation surfaced as an
/// Italian row inside an otherwise English list.
pub fn all_tweaks() -> Vec<RegistryTweak> {
    vec![
        RegistryTweak {
            id: "disable_restart_apps", name: "Stop reopening apps after sign-in",
            description: "Turns off Windows' restartable-app reopening preference for this account. Does not disable Startup entries or close running apps. Restore to recover your previous preference.",
            category: Category::Performance, hive: Hive::Hkcu,
            key_path: r"Software\Microsoft\Windows NT\CurrentVersion\Winlogon", value_name: "RestartApps",
            on_value: RegValue::Dword(0), requires_admin: false, requires_pro: false,
        },
        RegistryTweak {
            id: "enable_long_paths", name: "Enable long paths for compatible apps",
            description: "Allows long Win32 paths for applications that declare longPathAware support. Does not remove every application's path limit. Restart applications or Windows. Restoring the old limit may make existing long paths inaccessible to those apps.",
            category: Category::Maintenance, hive: Hive::Hklm,
            key_path: r"SYSTEM\CurrentControlSet\Control\FileSystem", value_name: "LongPathsEnabled",
            on_value: RegValue::Dword(1), requires_admin: true, requires_pro: false,
        },
        RegistryTweak {
            id: "dark_mode",
            name: "Dark mode",
            description: "Turns on the dark theme for apps and the system.",
            category: Category::Ui,
            hive: Hive::Hkcu,
            key_path: r"SOFTWARE\Microsoft\Windows\CurrentVersion\Themes\Personalize",
            value_name: "AppsUseLightTheme",
            on_value: RegValue::Dword(0),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "show_hidden_files",
            name: "Show hidden files",
            description: "Shows hidden files and folders in File Explorer.",
            category: Category::Ui,
            hive: Hive::Hkcu,
            key_path: r"SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced",
            value_name: "Hidden",
            on_value: RegValue::Dword(1),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "priority_separation",
            name: "Optimize CPU priority",
            description: "Tunes Win32PrioritySeparation (0x26) so the foreground app gets short, variable CPU time slices with a 3x priority boost - the classic desktop/gaming responsiveness value.",
            category: Category::Performance,
            hive: Hive::Hklm,
            key_path: r"SYSTEM\CurrentControlSet\Control\PriorityControl",
            value_name: "Win32PrioritySeparation",
            on_value: RegValue::Dword(38),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_game_dvr",
            name: "Disable Xbox Game Bar / Game DVR",
            description: "Turns off Xbox Game Bar's background recording, which uses CPU/GPU while gaming.",
            category: Category::Performance,
            hive: Hive::Hkcu,
            key_path: r"System\GameConfigStore",
            value_name: "GameDVR_Enabled",
            on_value: RegValue::Dword(0),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_telemetry_tasks",
            name: "Reduce diagnostic data collection",
            description: "Sets the Windows diagnostic data policy to its lowest level. Home and Pro treat that as Required diagnostic data; only Enterprise and Education turn it off completely. Scheduled tasks are not changed.",
            category: Category::Privacy,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Policies\Microsoft\Windows\DataCollection",
            value_name: "AllowTelemetry",
            on_value: RegValue::Dword(0),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "reset_advertising_id",
            name: "Disable advertising ID",
            description: "Stops apps from using your advertising ID to profile you.",
            category: Category::Privacy,
            hive: Hive::Hkcu,
            key_path: r"SOFTWARE\Microsoft\Windows\CurrentVersion\AdvertisingInfo",
            value_name: "Enabled",
            on_value: RegValue::Dword(0),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_location_tracking",
            name: "Disable location tracking",
            description: "Blocks location access for all apps through system policy.",
            category: Category::Privacy,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Policies\Microsoft\Windows\LocationAndSensors",
            value_name: "DisableLocation",
            on_value: RegValue::Dword(1),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_bing_search",
            name: "Disable Bing search in the Start menu",
            description: "Stops your Start menu searches from being sent to Bing.",
            category: Category::Privacy,
            hive: Hive::Hkcu,
            key_path: r"SOFTWARE\Microsoft\Windows\CurrentVersion\Search",
            value_name: "BingSearchEnabled",
            on_value: RegValue::Dword(0),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "hardware_gpu_scheduling",
            name: "Hardware-accelerated GPU scheduling",
            description: "Requests hardware-accelerated GPU scheduling (HAGS). Requires a compatible GPU, driver and Windows version. Performance and latency can improve, worsen or remain unchanged depending on the game. Restart and verify availability in Windows Graphics settings.",
            category: Category::Gaming,
            hive: Hive::Hklm,
            key_path: r"SYSTEM\CurrentControlSet\Control\GraphicsDrivers",
            value_name: "HwSchMode",
            on_value: RegValue::Dword(2),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "network_throttling_index",
            name: "Disable multimedia network throttling",
            description: "Removes the cap Windows puts on network traffic while multimedia apps/games are running (MMCSS NetworkThrottlingIndex), useful against online micro-lag.",
            category: Category::Gaming,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile",
            value_name: "NetworkThrottlingIndex",
            on_value: RegValue::Dword(0xffffffff),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "system_responsiveness",
            name: "Set MMCSS background CPU reserve",
            description: "Writes SystemResponsiveness=0, which Windows treats as 20%; this does not eliminate the CPU share for lower-priority tasks or prioritize every foreground app.",
            category: Category::Gaming,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile",
            value_name: "SystemResponsiveness",
            on_value: RegValue::Dword(0),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "keep_kernel_in_ram",
            name: "Keep the kernel and drivers in RAM",
            description: "Windows may page parts of the kernel and driver code out to disk even when memory is plentiful, and paging them back in is a stall you feel as a stutter. This keeps them resident. Worth it on machines with RAM to spare; on a low-memory PC leave it off.",
            category: Category::Performance,
            hive: Hive::Hklm,
            key_path: r"SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management",
            value_name: "DisablePagingExecutive",
            on_value: RegValue::Dword(1),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "auto_end_frozen_tasks",
            name: "Don't let a frozen app block shutdown",
            description: "When an application stops responding during shutdown, Windows waits and shows the \"This app is preventing shutdown\" screen until someone clicks it. This closes unresponsive apps automatically instead, so a hung program cannot leave the machine sitting powered on. Warning: automatically closing apps can lose unsaved work. Restoring this setting cannot recover that work.",
            category: Category::Maintenance,
            hive: Hive::Hkcu,
            key_path: r"Control Panel\Desktop",
            value_name: "AutoEndTasks",
            on_value: RegValue::Str("1".to_string()),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "instant_folder_loading",
            name: "Open every folder instantly",
            description: "Explorer inspects a folder's contents to guess whether it is Pictures, Music or Documents, and a folder holding thousands of media files can hang for seconds while it decides. This pins every folder to the general layout so it opens at once.",
            category: Category::Ui,
            hive: Hive::Hkcu,
            key_path: r"Software\Classes\Local Settings\Software\Microsoft\Windows\Shell\Bags\AllFolders\Shell",
            value_name: "FolderType",
            on_value: RegValue::Str("NotSpecified".to_string()),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "taskbar_align_left",
            name: "Align the taskbar to the left",
            description: "Puts taskbar icons back on the left (Windows 10 style) instead of centered.",
            category: Category::Ui,
            hive: Hive::Hkcu,
            key_path: r"SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced",
            value_name: "TaskbarAl",
            on_value: RegValue::Dword(0),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "hide_taskbar_chat",
            name: "Hide Chat/Teams from the taskbar",
            description: "Removes the Chat (Microsoft Teams) icon from the taskbar.",
            category: Category::Ui,
            hive: Hive::Hkcu,
            key_path: r"SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced",
            value_name: "TaskbarMn",
            on_value: RegValue::Dword(0),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_start_suggestions",
            name: "Disable Start menu suggestions and recommended apps",
            description: "Stops Windows from showing recommended apps, ads and tips in the Start menu.",
            category: Category::Privacy,
            hive: Hive::Hkcu,
            key_path: r"SOFTWARE\Microsoft\Windows\CurrentVersion\ContentDeliveryManager",
            value_name: "SubscribedContent-338388Enabled",
            on_value: RegValue::Dword(0),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "hide_taskbar_search",
            name: "Hide the search box from the taskbar",
            description: "Removes the search box/icon from the taskbar for a cleaner bar (search still works from the Windows key).",
            category: Category::Ui,
            hive: Hive::Hkcu,
            key_path: r"SOFTWARE\Microsoft\Windows\CurrentVersion\Search",
            value_name: "SearchboxTaskbarMode",
            on_value: RegValue::Dword(0),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_fullscreen_optimizations_global",
            name: "Disable fullscreen optimizations globally",
            description: "Forces DXGI to honor true exclusive fullscreen instead of Windows' emulation, reducing stutter and input lag in many older games.",
            category: Category::Gaming,
            hive: Hive::Hkcu,
            key_path: r"System\GameConfigStore",
            value_name: "GameDVR_DXGIHonorFSEWindowsCompatible",
            on_value: RegValue::Dword(1),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_startup_delay",
            name: "Remove the startup app delay",
            description: "Windows deliberately waits about 10 seconds after sign-in before launching your startup programs. This removes that wait.",
            category: Category::Performance,
            hive: Hive::Hkcu,
            key_path: r"SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Serialize",
            value_name: "StartupDelayInMSec",
            on_value: RegValue::Dword(0),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "menu_show_delay",
            name: "Instant menu response",
            description: "Removes the built-in delay before menus open, which makes the whole desktop feel noticeably snappier.",
            category: Category::Performance,
            hive: Hive::Hkcu,
            key_path: r"Control Panel\Desktop",
            value_name: "MenuShowDelay",
            on_value: RegValue::Str(String::from("0")),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_power_throttling",
            name: "Disable CPU power throttling",
            description: "Stops Windows from slowing down background processes to save power - useful on laptops where throttling causes stutter during long sessions.",
            category: Category::Performance,
            hive: Hive::Hklm,
            key_path: r"SYSTEM\CurrentControlSet\Control\Power\PowerThrottling",
            value_name: "PowerThrottlingOff",
            on_value: RegValue::Dword(1),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "games_gpu_priority",
            name: "Set legacy Games GPU Priority value",
            description: "Writes the Games GPU Priority value, which Microsoft documents as unused. No GPU priority or frame-rate gain is expected.",
            category: Category::Gaming,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games",
            value_name: "GPU Priority",
            on_value: RegValue::Dword(8),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_tailored_experiences",
            name: "Disable tailored experiences",
            description: "Stops Windows from using your diagnostic data to personalize ads, tips and recommendations.",
            category: Category::Privacy,
            hive: Hive::Hkcu,
            key_path: r"SOFTWARE\Microsoft\Windows\CurrentVersion\Privacy",
            value_name: "TailoredExperiencesWithDiagnosticDataEnabled",
            on_value: RegValue::Dword(0),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_app_launch_tracking",
            name: "Stop tracking which apps you open",
            description: "Windows records how often you launch each program to rank Start menu results. This turns that logging off.",
            category: Category::Privacy,
            hive: Hive::Hkcu,
            key_path: r"SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced",
            value_name: "Start_TrackProgs",
            on_value: RegValue::Dword(0),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_feedback_requests",
            name: "Stop Windows feedback prompts",
            description: "Prevents Windows from interrupting you with 'How likely are you to recommend...' surveys.",
            category: Category::Privacy,
            hive: Hive::Hkcu,
            key_path: r"SOFTWARE\Microsoft\Siuf\Rules",
            value_name: "NumberOfSIUFInPeriod",
            on_value: RegValue::Dword(0),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_cortana",
            name: "Disable Cortana",
            description: "Turns Cortana off through system policy, freeing the background resources it reserves.",
            category: Category::Privacy,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Policies\Microsoft\Windows\Windows Search",
            value_name: "AllowCortana",
            on_value: RegValue::Dword(0),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "show_file_extensions",
            name: "Always show file extensions",
            description: "Reveals the real extension of every file. Worth turning on for safety alone: it exposes files like 'invoice.pdf.exe' that Windows otherwise hides.",
            category: Category::Ui,
            hive: Hive::Hkcu,
            key_path: r"SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced",
            value_name: "HideFileExt",
            on_value: RegValue::Dword(0),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "hide_taskbar_widgets",
            name: "Hide Widgets from the taskbar",
            description: "Removes the weather/news Widgets button, which loads content in the background even when you never open it.",
            category: Category::Ui,
            hive: Hive::Hkcu,
            key_path: r"SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced",
            value_name: "TaskbarDa",
            on_value: RegValue::Dword(0),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_transparency",
            name: "Disable transparency effects",
            description: "Turns off the blur/acrylic effects in the taskbar and menus. Small but real GPU saving, and it makes older or integrated-graphics machines feel smoother.",
            category: Category::Ui,
            hive: Hive::Hkcu,
            key_path: r"SOFTWARE\Microsoft\Windows\CurrentVersion\Themes\Personalize",
            value_name: "EnableTransparency",
            on_value: RegValue::Dword(0),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_window_animations",
            name: "Instant window animations",
            description: "Removes the slide/fade animation Windows plays every time a window opens, closes or minimizes. The animation is pure waiting time — cutting it makes the desktop respond the moment you click, and frees the GPU work behind it.",
            category: Category::Performance,
            hive: Hive::Hkcu,
            key_path: r"Control Panel\Desktop\WindowMetrics",
            // REG_SZ, not a DWORD: this is one of the old User32 settings that
            // predate DWORD conventions and Windows only honours it as a string.
            value_name: "MinAnimate",
            on_value: RegValue::Str("0".to_string()),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_drag_full_windows",
            name: "Lighter window dragging",
            description: "Draws an outline while you drag a window instead of repainting its whole contents every frame. Barely noticeable on a fast GPU, a clear difference on integrated graphics or an older machine.",
            category: Category::Performance,
            hive: Hive::Hkcu,
            key_path: r"Control Panel\Desktop",
            value_name: "DragFullWindows",
            on_value: RegValue::Str("0".to_string()),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "mouse_hover_delay",
            name: "Instant mouse hover response",
            description: "Windows waits 400 ms before reacting to the pointer resting on something - taskbar previews, tooltips, menu hovers. This drops that wait to almost nothing, so the interface follows the mouse instead of trailing it.",
            category: Category::Performance,
            hive: Hive::Hkcu,
            key_path: r"Control Panel\Mouse",
            value_name: "MouseHoverTime",
            on_value: RegValue::Str("10".to_string()),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_background_apps",
            name: "Stop apps running in the background",
            description: "Stops Store apps from running, refreshing and polling the network while you are not using them. This is real CPU, RAM and battery spent on apps you did not open.",
            category: Category::Performance,
            hive: Hive::Hkcu,
            key_path: r"SOFTWARE\Microsoft\Windows\CurrentVersion\BackgroundAccessApplications",
            value_name: "GlobalUserDisabled",
            on_value: RegValue::Dword(1),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_delivery_optimization",
            name: "Stop sharing Windows updates with strangers",
            description: "Windows uploads downloaded update files to other PCs over your connection by default. This limits Delivery Optimization to your own machine, which stops that upload eating bandwidth mid-game.",
            category: Category::Maintenance,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Policies\Microsoft\Windows\DeliveryOptimization",
            value_name: "DODownloadMode",
            on_value: RegValue::Dword(0),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_copilot",
            name: "Legacy Copilot policy (restore only)",
            description: "This retired policy does not control the current Copilot app. You can restore its saved registry value here. Manage the separate Copilot app in Debloat; removing it does not prevent future reinstallation.",
            category: Category::Privacy,
            hive: Hive::Hkcu,
            key_path: r"Software\Policies\Microsoft\Windows\WindowsCopilot",
            value_name: "TurnOffWindowsCopilot",
            on_value: RegValue::Dword(1),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_suggested_apps",
            name: "Stop Windows installing apps by itself",
            description: "Windows quietly installs \"suggested\" apps and games into your Start menu without asking, on a fresh install and again after big updates. This turns that off, so nothing lands on your machine that you didn't choose.",
            category: Category::Privacy,
            hive: Hive::Hkcu,
            key_path: r"SOFTWARE\Microsoft\Windows\CurrentVersion\ContentDeliveryManager",
            value_name: "SilentInstalledAppsEnabled",
            on_value: RegValue::Dword(0),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_mouse_acceleration",
            name: "Disable mouse acceleration",
            description: "Turns off \"Enhance pointer precision\", which makes the cursor travel further when you move the mouse faster. That variable response is exactly what you don't want when aiming: the same physical flick should always cover the same distance on screen.",
            category: Category::Gaming,
            hive: Hive::Hkcu,
            key_path: r"Control Panel\Mouse",
            value_name: "MouseSpeed",
            on_value: RegValue::Str(String::from("0")),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_sticky_keys_prompt",
            name: "Stop the Sticky Keys popup",
            description: "Tapping Shift five times normally opens the Sticky Keys dialog — which in a game means an alt-tab out of fullscreen at the worst possible moment, usually mid-fight. This disables the shortcut and its prompt; Sticky Keys itself stays available in Settings.",
            category: Category::Gaming,
            hive: Hive::Hkcu,
            key_path: r"Control Panel\Accessibility\StickyKeys",
            value_name: "Flags",
            on_value: RegValue::Str(String::from("506")),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_recall",
            name: "Disable Recall (AI screen snapshots)",
            description: "Recall takes a screenshot of your desktop every few seconds and builds a searchable, AI-indexed history of everything you have looked at — passwords and private messages included, since it captures whatever is on screen. This sets the system policy that stops it analysing or storing anything.",
            category: Category::Privacy,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Policies\Microsoft\Windows\WindowsAI",
            value_name: "DisableAIDataAnalysis",
            on_value: RegValue::Dword(1),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "global_timer_resolution",
            name: "Global timer resolution",
            description: "Sets the GlobalTimerResolutionRequests registry flag to 1. This does not itself request or verify a specific timer resolution. Behavior depends on the Windows version; lower latency or higher FPS is not guaranteed. Restart required.",
            category: Category::Gaming,
            hive: Hive::Hklm,
            key_path: r"SYSTEM\CurrentControlSet\Control\Session Manager\kernel",
            value_name: "GlobalTimerResolutionRequests",
            on_value: RegValue::Dword(1),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_memory_integrity",
            name: "Disable Memory Integrity (VBS)",
            description: "Requests that Memory Integrity (HVCI) be disabled. If applied, this removes a layer of kernel protection; other VBS features may remain active. Performance impact varies by hardware and workload. Policy or UEFI lock may prevent the change. Restart and verify the status in Windows Security.",
            category: Category::Gaming,
            hive: Hive::Hklm,
            key_path: r"SYSTEM\CurrentControlSet\Control\DeviceGuard\Scenarios\HypervisorEnforcedCodeIntegrity",
            value_name: "Enabled",
            on_value: RegValue::Dword(0),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "enable_regback",
            name: "Enable automatic registry backup (RegBack)",
            description: "Re-enables periodic automatic backups of the Windows registry hives to %SystemRoot%\\System32\\config\\RegBack for emergency recovery.",
            category: Category::Maintenance,
            hive: Hive::Hklm,
            key_path: r"SYSTEM\CurrentControlSet\Control\Session Manager\Configuration Manager",
            value_name: "EnablePeriodicBackup",
            on_value: RegValue::Dword(1),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "explorer_anti_hang",
            name: "Prevent File Explorer shortcut hangs",
            description: "Disables resolving target tracking and network search when opening shortcuts, preventing File Explorer from freezing when shortcuts point to disconnected drives or network shares.",
            category: Category::Performance,
            hive: Hive::Hkcu,
            key_path: r"Software\Microsoft\Windows\CurrentVersion\Policies\Explorer",
            value_name: "LinkResolveIgnoreLinkInfo",
            on_value: RegValue::Dword(1),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "no_internet_open_with",
            name: "Skip Microsoft Store query for unknown files",
            description: "Opens the local 'Open with' application picker immediately instead of prompting to search the Microsoft Store when double-clicking unrecognized file types.",
            category: Category::Ui,
            hive: Hive::Hkcu,
            key_path: r"Software\Microsoft\Windows\CurrentVersion\Policies\Explorer",
            value_name: "NoInternetOpenWith",
            on_value: RegValue::Dword(1),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "detailed_bsod",
            name: "Show detailed BSOD crash parameters",
            description: "Displays exact hexadecimal stop codes, faulting drivers, and memory addresses on blue screens instead of hiding them behind a generic QR code.",
            category: Category::Maintenance,
            hive: Hive::Hklm,
            key_path: r"SYSTEM\CurrentControlSet\Control\CrashControl",
            value_name: "DisplayParameters",
            on_value: RegValue::Dword(1),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_wpbt",
            name: "Block WPBT UEFI software execution",
            description: "Prevents motherboard UEFI firmware from automatically installing OEM bloatware binaries into Windows via the Windows Platform Binary Table.",
            category: Category::Privacy,
            hive: Hive::Hklm,
            key_path: r"SYSTEM\CurrentControlSet\Control\Session Manager",
            value_name: "DisableWpbtExecution",
            on_value: RegValue::Dword(1),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_ndu",
            name: "Disable NDU non-paged pool RAM leak",
            description: "Disables the Network Diagnostic Usage driver service, preventing high non-paged memory pool accumulation during large network downloads.",
            category: Category::Performance,
            hive: Hive::Hklm,
            key_path: r"SYSTEM\ControlSet001\Services\Ndu",
            value_name: "Start",
            on_value: RegValue::Dword(4),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_search_highlights",
            name: "Disable search highlights and doodles",
            description: "Removes web search illustrations, daily Bing doodles, and dynamic trending topics from the Windows Search bar and taskbar search box.",
            category: Category::Privacy,
            hive: Hive::Hkcu,
            key_path: r"Software\Microsoft\Windows\CurrentVersion\SearchSettings",
            value_name: "IsDynamicSearchBoxEnabled",
            on_value: RegValue::Dword(0),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "auto_complete_run",
            name: "Enable Run dialog auto-completion",
            description: "Enables instant command auto-completion and suggestions in the Windows Run dialog (Win + R).",
            category: Category::Ui,
            hive: Hive::Hkcu,
            key_path: r"Software\Microsoft\Windows\CurrentVersion\Explorer\AutoComplete",
            value_name: "Append Completion",
            on_value: RegValue::Str("yes".to_string()),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_aero_shake",
            name: "Disable Aero Shake window minimization",
            description: "Prevents shaking a window's title bar from accidentally minimizing all other background open windows.",
            category: Category::Ui,
            hive: Hive::Hkcu,
            key_path: r"Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced",
            value_name: "DisallowShaking",
            on_value: RegValue::Dword(1),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_remote_assistance",
            name: "Disable Remote Assistance invitations",
            description: "Disables Windows Remote Assistance connections and invitations to protect against unsolicited remote support requests.",
            category: Category::Privacy,
            hive: Hive::Hklm,
            key_path: r"System\CurrentControlSet\Control\Remote Assistance",
            value_name: "fAllowToGetHelp",
            on_value: RegValue::Dword(0),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_llmnr",
            name: "Disable LLMNR protocol",
            description: "Disables Link-Local Multicast Name Resolution (LLMNR) to protect against local network spoofing and hash-harvesting attacks.",
            category: Category::Privacy,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Policies\Microsoft\Windows NT\DNSClient",
            value_name: "EnableMulticast",
            on_value: RegValue::Dword(0),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_wifi_sense",
            name: "Disable Wi-Fi Sense hotspot sharing",
            description: "Prevents Windows from automatically connecting to open Wi-Fi networks and sharing credentials with contacts.",
            category: Category::Privacy,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Microsoft\WcmSvc\wifinetworkmanager\config",
            value_name: "AutoConnectAllowedOEM",
            on_value: RegValue::Dword(0),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_cloud_search",
            name: "Disable cloud search in Windows search",
            description: "Stops Windows Search from querying cloud account history and Microsoft account search logs when looking for local files.",
            category: Category::Privacy,
            hive: Hive::Hkcu,
            key_path: r"Software\Microsoft\Windows\CurrentVersion\Search",
            value_name: "AllowCloudSearch",
            on_value: RegValue::Dword(0),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_app_suggestions_start",
            name: "Disable Start menu suggestions and tips",
            description: "Turns off promotional application suggestions and feature tips inside the Windows Start menu.",
            category: Category::Ui,
            hive: Hive::Hkcu,
            key_path: r"SOFTWARE\Microsoft\Windows\CurrentVersion\ContentDeliveryManager",
            value_name: "SystemPaneSuggestionsEnabled",
            on_value: RegValue::Dword(0),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_handwriting_sharing",
            name: "Disable handwriting error report sharing",
            description: "Prevents Windows from transmitting handwriting recognition error logs and stroke samples to Microsoft.",
            category: Category::Privacy,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Policies\Microsoft\Windows\HandwritingErrorReports",
            value_name: "PreventHandwritingDataSharing",
            on_value: RegValue::Dword(1),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_ceip",
            name: "Disable Customer Experience Improvement Program",
            description: "Turns off the Windows SQM telemetry client for the Customer Experience Improvement Program (CEIP).",
            category: Category::Privacy,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Policies\Microsoft\SQMClient\Windows",
            value_name: "CEIPEnable",
            on_value: RegValue::Dword(0),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_lockscreen_camera",
            name: "Disable lock screen camera",
            description: "Disables the lock screen camera gesture and button to prevent photo capture without unlocking the device.",
            category: Category::Privacy,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Policies\Microsoft\Windows\Personalization",
            value_name: "NoLockScreenCamera",
            on_value: RegValue::Dword(1),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_cortana_consent",
            name: "Disable Cortana search consent",
            description: "Disables Cortana search consent to stop search queries and voice data from being shared with Microsoft cloud services.",
            category: Category::Privacy,
            hive: Hive::Hkcu,
            key_path: r"Software\Microsoft\Windows\CurrentVersion\Search",
            value_name: "CortanaConsent",
            on_value: RegValue::Dword(0),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_wer_queuing",
            name: "Disable Windows error report queuing",
            description: "Prevents Windows Error Reporting from saving and queuing crash reports on disk for later transmission.",
            category: Category::Privacy,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Policies\Microsoft\Windows\Windows Error Reporting",
            value_name: "DoNotQueue",
            on_value: RegValue::Dword(1),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_experimentation",
            name: "Disable Windows experimentation telemetry",
            description: "Disables Microsoft A/B testing and experimentation features on Windows, keeping features consistent and predictable.",
            category: Category::Privacy,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Microsoft\PolicyManager\default\System\AllowExperimentation",
            value_name: "value",
            on_value: RegValue::Dword(0),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_app_inventory_collection",
            name: "Disable Application Compatibility Inventory",
            description: "Disables the Application Compatibility Inventory collector that scans installed software and reports application catalogs to Microsoft.",
            category: Category::Privacy,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Policies\Microsoft\Windows\AppCompat",
            value_name: "DisableInventory",
            on_value: RegValue::Dword(1),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_problem_steps_recorder",
            name: "Disable Problem Steps Recorder telemetry",
            description: "Disables Problem Steps Recorder (PSR) error capture and diagnostic data submission.",
            category: Category::Privacy,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Policies\Microsoft\Windows\AppCompat",
            value_name: "DisableUAR",
            on_value: RegValue::Dword(1),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_ait_telemetry",
            name: "Disable Application Impact Telemetry",
            description: "Disables Application Impact Telemetry (AIT) data collection across software launches.",
            category: Category::Privacy,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Policies\Microsoft\Windows\AppCompat",
            value_name: "AITEnable",
            on_value: RegValue::Dword(0),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_smartscreen_app_install",
            name: "Disable SmartScreen app install telemetry",
            description: "Disables SmartScreen application installation telemetry and URL lookup queries.",
            category: Category::Privacy,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Policies\Microsoft\Windows\System",
            value_name: "EnableSmartScreen",
            on_value: RegValue::Dword(0),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_online_speech_privacy",
            name: "Disable online speech recognition data collection",
            description: "Disables cloud speech recognition data harvesting for voice typing and speech models.",
            category: Category::Privacy,
            hive: Hive::Hkcu,
            key_path: r"Software\Microsoft\Speech_OneCore\Settings\OnlineSpeechPrivacy",
            value_name: "HasAccepted",
            on_value: RegValue::Dword(0),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_edge_shopping",
            name: "Disable Edge shopping assistant",
            description: "Disables Microsoft Edge shopping assistant and coupon tracking telemetry.",
            category: Category::Privacy,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Policies\Microsoft\Edge",
            value_name: "EdgeShoppingAssistantEnabled",
            on_value: RegValue::Dword(0),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_edge_metrics",
            name: "Disable Edge diagnostic metrics reporting",
            description: "Disables Microsoft Edge usage metrics and diagnostic crash report transmission.",
            category: Category::Privacy,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Policies\Microsoft\Edge",
            value_name: "MetricsReportingEnabled",
            on_value: RegValue::Dword(0),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_edge_startup_boost",
            name: "Disable Edge Startup Boost",
            description: "Disables Edge Startup Boost, preventing Edge background processes from launching at Windows boot.",
            category: Category::Performance,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Policies\Microsoft\Edge",
            value_name: "StartupBoostEnabled",
            on_value: RegValue::Dword(0),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_edge_background_mode",
            name: "Disable Edge background extensions mode",
            description: "Prevents Microsoft Edge from running in the background when closed, freeing system memory.",
            category: Category::Performance,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Policies\Microsoft\Edge",
            value_name: "BackgroundModeEnabled",
            on_value: RegValue::Dword(0),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_bluetooth_le_discovery",
            name: "Disable background Bluetooth LE scanning",
            description: "Disables continuous background Bluetooth Low Energy scanning to reduce background CPU cycles and power drain.",
            category: Category::Performance,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Microsoft\Windows\CurrentVersion\Bluetooth",
            value_name: "DisableLEScan",
            on_value: RegValue::Dword(1),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_edge_wallet",
            name: "Disable Edge wallet autofill suggestions",
            description: "Prevents Microsoft Edge from querying payment and wallet services automatically.",
            category: Category::Privacy,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Policies\Microsoft\Edge",
            value_name: "PaymentMethodQueryEnabled",
            on_value: RegValue::Dword(0),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_cortana_above_lock",
            name: "Disable Cortana above lock screen",
            description: "Prevents voice assistants and search from listening or activating while your screen is locked.",
            category: Category::Privacy,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Policies\Microsoft\Windows\Windows Search",
            value_name: "AllowCortanaAboveLock",
            on_value: RegValue::Dword(0),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_device_history",
            name: "Disable Windows device activity history",
            description: "Stops Windows from recording and tracking app and file history on this device.",
            category: Category::Privacy,
            hive: Hive::Hkcu,
            key_path: r"Software\Microsoft\Windows\CurrentVersion\Search",
            value_name: "DeviceHistoryEnabled",
            on_value: RegValue::Dword(0),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_search_history",
            name: "Disable taskbar search history",
            description: "Disables tracking and storing past search queries in the taskbar and Start menu search box.",
            category: Category::Privacy,
            hive: Hive::Hkcu,
            key_path: r"Software\Microsoft\Windows\CurrentVersion\Search",
            value_name: "HistoryViewEnabled",
            on_value: RegValue::Dword(0),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_news_and_interests",
            name: "Disable News and Interests taskbar feed",
            description: "Hides the weather and news widget on the Windows taskbar, saving background network and memory.",
            category: Category::Ui,
            hive: Hive::Hkcu,
            key_path: r"Software\Microsoft\Windows\CurrentVersion\Feeds",
            value_name: "ShellFeedsTaskbarViewMode",
            on_value: RegValue::Dword(2),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_auto_maintenance_wake",
            name: "Disable wake-to-run automatic maintenance",
            description: "Prevents Windows Automatic Maintenance from waking your computer or draining laptop battery overnight.",
            category: Category::Performance,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Schedule\Maintenance",
            value_name: "WakeUp",
            on_value: RegValue::Dword(0),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_diagnostic_data_viewer",
            name: "Disable diagnostic data local datastore",
            description: "Stops Windows diagnostic telemetry from reserving and writing local telemetry database caches on disk.",
            category: Category::Privacy,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Microsoft\Windows\CurrentVersion\Diagnostics\DiagTrack\DataStore",
            value_name: "DisableDataStore",
            on_value: RegValue::Dword(1),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_activity_feed",
            name: "Disable Windows activity feed and timeline",
            description: "Prevents Windows from generating timeline graphs and tracking cross-device user activities.",
            category: Category::Privacy,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Policies\Microsoft\Windows\System",
            value_name: "EnableActivityFeed",
            on_value: RegValue::Dword(0),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_publish_user_activities",
            name: "Disable publishing user activities to cloud",
            description: "Prevents Windows from publishing activity timeline history to Microsoft cloud services.",
            category: Category::Privacy,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Policies\Microsoft\Windows\System",
            value_name: "PublishUserActivities",
            on_value: RegValue::Dword(0),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_typing_insights",
            name: "Disable typing insights telemetry",
            description: "Prevents Windows from analyzing your keystroke patterns and autocomplete statistics.",
            category: Category::Privacy,
            hive: Hive::Hkcu,
            key_path: r"Software\Microsoft\Input\Settings",
            value_name: "InsightsEnabled",
            on_value: RegValue::Dword(0),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_inking_typing_personalization",
            name: "Disable inking and typing personalization",
            description: "Prevents Windows from sending local handwriting and typing dictionary data to Microsoft.",
            category: Category::Privacy,
            hive: Hive::Hkcu,
            key_path: r"Software\Microsoft\Personalization\Settings",
            value_name: "AcceptedPrivacyPolicy",
            on_value: RegValue::Dword(0),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_shared_experiences",
            name: "Disable Connected Devices cross-device sharing",
            description: "Disables Connected Devices Platform (CDP) background synchronization across your accounts.",
            category: Category::Privacy,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Policies\Microsoft\Windows\System",
            value_name: "EnableCdp",
            on_value: RegValue::Dword(0),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_remote_desktop",
            name: "Disable Remote Desktop inbound connections",
            description: "Blocks incoming RDP remote desktop connections to reduce network attack surface.",
            category: Category::Privacy,
            hive: Hive::Hklm,
            key_path: r"SYSTEM\CurrentControlSet\Control\Terminal Server",
            value_name: "fDenyTSConnections",
            on_value: RegValue::Dword(1),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_edge_collections",
            name: "Disable Microsoft Edge Collections",
            description: "Disables Edge Collections and background sync to minimize browser resource footprint.",
            category: Category::Privacy,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Policies\Microsoft\Edge",
            value_name: "EdgeCollectionsEnabled",
            on_value: RegValue::Dword(0),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_edge_quick_search",
            name: "Disable Edge desktop search bar widget",
            description: "Prevents Microsoft Edge from displaying floating search widgets on the Windows desktop.",
            category: Category::Privacy,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Policies\Microsoft\Edge",
            value_name: "SearchbarEnabled",
            on_value: RegValue::Dword(0),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_edge_personalization",
            name: "Disable Edge personalization and browsing telemetry",
            description: "Disables reporting browsing history and personal advertising profiles inside Microsoft Edge.",
            category: Category::Privacy,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Policies\Microsoft\Edge",
            value_name: "PersonalizationReportingEnabled",
            on_value: RegValue::Dword(0),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_lockscreen_spotlight",
            name: "Disable Windows Spotlight on lock screen",
            description: "Stops Windows Spotlight from downloading promotional wallpaper images and tips on the lock screen.",
            category: Category::Privacy,
            hive: Hive::Hkcu,
            key_path: r"Software\Policies\Microsoft\Windows\CloudContent",
            value_name: "DisableWindowsSpotlightFeatures",
            on_value: RegValue::Dword(1),
            requires_admin: false,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_push_install_service",
            name: "Disable Windows PushToInstall remote app service",
            description: "Prevents Microsoft Store from pushing app installations to this PC remotely from the web.",
            category: Category::Maintenance,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Policies\Microsoft\PushToInstall",
            value_name: "DisablePushToInstall",
            on_value: RegValue::Dword(1),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_compatibility_assistant",
            name: "Disable Program Compatibility Assistant",
            description: "Disables Program Compatibility Assistant popups and background application scans when launching legacy tools.",
            category: Category::Performance,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Policies\Microsoft\Windows\AppCompat",
            value_name: "DisablePCA",
            on_value: RegValue::Dword(1),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_cortana_cloud_search",
            name: "Disable Windows Search cloud indexer",
            description: "Prevents Windows Search from querying cloud indices and Bing servers when searching local files.",
            category: Category::Privacy,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Policies\Microsoft\Windows\Windows Search",
            value_name: "AllowCloudSearch",
            on_value: RegValue::Dword(0),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_find_my_device",
            name: "Disable Find My Device tracking",
            description: "Disables continuous GPS and Wi-Fi location broadcasting for Find My Device services.",
            category: Category::Privacy,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Policies\Microsoft\FindMyDevice",
            value_name: "AllowFindMyDevice",
            on_value: RegValue::Dword(0),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_sensors_data_collection",
            name: "Disable hardware sensors data collection",
            description: "Disables background sensor monitoring (ambient light, accelerometer) and location polling.",
            category: Category::Privacy,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Policies\Microsoft\Windows\Sensors",
            value_name: "DisableSensors",
            on_value: RegValue::Dword(1),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_location_scripting",
            name: "Disable location scripting access",
            description: "Prevents background scripts and browser engines from querying device physical location.",
            category: Category::Privacy,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Policies\Microsoft\Windows\LocationAndSensors",
            value_name: "DisableLocationScripting",
            on_value: RegValue::Dword(1),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_advertising_info",
            name: "Disable Windows advertising info policy",
            description: "Enforces a group policy lock disabling advertising ID tracking system-wide for all users.",
            category: Category::Privacy,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Policies\Microsoft\Windows\AdvertisingInfo",
            value_name: "DisabledByGroupPolicy",
            on_value: RegValue::Dword(1),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_sync_settings",
            name: "Disable Windows Settings cloud sync",
            description: "Stops Windows from syncing your personalization, passwords, and system preferences to Microsoft servers.",
            category: Category::Privacy,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Policies\Microsoft\Windows\SettingSync",
            value_name: "DisableSettingSync",
            on_value: RegValue::Dword(2),
            requires_admin: true,
            requires_pro: false,
        },
        RegistryTweak {
            id: "disable_app_diagnostics_access",
            name: "Disable app access to diagnostic information",
            description: "Blocks third-party Store applications from reading diagnostic information and system telemetry.",
            category: Category::Privacy,
            hive: Hive::Hklm,
            key_path: r"SOFTWARE\Policies\Microsoft\Windows\AppPrivacy",
            value_name: "LetAppsGetDiagnosticInfo",
            on_value: RegValue::Dword(2),
            requires_admin: true,
            requires_pro: false,
        },
    ]
}

pub fn find_tweak(id: &str) -> Option<RegistryTweak> {
    all_tweaks().into_iter().find(|t| t.id == id)
}

// Retain the ID for old snapshots and profile imports, but never report a
// successful application of a policy that cannot control the current app.
fn require_active_policy(id: &str) -> Result<(), String> {
    if id == "disable_copilot" {
        return Err("The legacy Copilot policy is retired. Manage the current Copilot app in Debloat; existing policy snapshots can still be restored.".into());
    }
    Ok(())
}

#[test]
fn legacy_copilot_is_restore_only() {
    assert!(require_active_policy("disable_copilot").is_err());
    assert!(find_tweak("disable_copilot").is_some());
    assert!(require_active_policy("disable_suggested_apps").is_ok());
}

#[cfg(windows)]
pub mod windows_impl {
    use super::*;
    use winreg::enums::*;
    use winreg::RegKey;

    pub fn root(hive: &Hive) -> RegKey {
        match hive {
            Hive::Hkcu => RegKey::predef(HKEY_CURRENT_USER),
            Hive::Hklm => RegKey::predef(HKEY_LOCAL_MACHINE),
        }
    }

    pub fn hive_str(hive: &Hive) -> &'static str {
        match hive {
            Hive::Hkcu => "HKCU",
            Hive::Hklm => "HKLM",
        }
    }

    pub fn hive_from_str(s: &str) -> Hive {
        match s {
            "HKLM" => Hive::Hklm,
            _ => Hive::Hkcu,
        }
    }

    /// Reads a DWORD value without changing anything. `None` means it is unset.
    pub fn read_dword(hive: Hive, path: &str, name: &str) -> std::io::Result<Option<u32>> {
        match read_value(hive, path, name, &RegValue::Dword(0))? {
            Some(RegValue::Dword(value)) => Ok(Some(value)),
            None => Ok(None),
            _ => Err(std::io::Error::new(
                std::io::ErrorKind::InvalidData,
                "expected a DWORD registry value",
            )),
        }
    }

    /// Writes a DWORD value, creating the key if needed.
    pub fn write_dword(hive: Hive, path: &str, name: &str, value: u32) -> Result<(), String> {
        write_value(hive, path, name, &RegValue::Dword(value))
    }

    /// The real registry.
    pub struct WinRegistry;

    impl RegistryBackend for WinRegistry {
        fn read(&self, hive: Hive, path: &str, name: &str) -> std::io::Result<Option<RegValue>> {
            let key = match root(&hive).open_subkey(path) {
                Ok(key) => key,
                Err(e) if e.kind() == std::io::ErrorKind::NotFound => return Ok(None),
                Err(e) => return Err(e),
            };
            let value = match key.get_raw_value(name) {
                Ok(value) => value,
                Err(e) if e.kind() == std::io::ErrorKind::NotFound => return Ok(None),
                Err(e) => return Err(e),
            };
            match value.vtype {
                winreg::enums::REG_DWORD => key
                    .get_value::<u32, _>(name)
                    .map(|v| Some(RegValue::Dword(v))),
                winreg::enums::REG_QWORD => key
                    .get_value::<u64, _>(name)
                    .map(|v| Some(RegValue::Qword(v))),
                winreg::enums::REG_SZ => key
                    .get_value::<String, _>(name)
                    .map(|v| Some(RegValue::Str(v))),
                winreg::enums::REG_EXPAND_SZ => key
                    .get_value::<String, _>(name)
                    .map(|v| Some(RegValue::ExpandStr(v))),
                winreg::enums::REG_MULTI_SZ => key
                    .get_value::<Vec<String>, _>(name)
                    .map(|v| Some(RegValue::MultiSz(v))),
                winreg::enums::REG_BINARY => key
                    .get_raw_value(name)
                    .map(|v| Some(RegValue::Binary(v.bytes))),
                _ => Err(std::io::Error::new(
                    std::io::ErrorKind::InvalidData,
                    "unsupported original registry type; the value was not changed",
                )),
            }
        }

        fn write(
            &self,
            hive: Hive,
            path: &str,
            name: &str,
            value: &RegValue,
        ) -> std::io::Result<()> {
            refuse_in_unit_tests()?;
            let (key, _) = root(&hive).create_subkey(path)?;
            match value {
                RegValue::Dword(v) => key.set_value(name, v),
                RegValue::Qword(v) => key.set_value(name, v),
                RegValue::Str(s) => key.set_value(name, s),
                RegValue::ExpandStr(s) => {
                    use std::os::windows::ffi::OsStrExt;
                    let reg_val = winreg::RegValue {
                        vtype: winreg::enums::REG_EXPAND_SZ,
                        bytes: std::ffi::OsStr::new(s)
                            .encode_wide()
                            .chain(std::iter::once(0))
                            .flat_map(|u| u.to_le_bytes())
                            .collect(),
                    };
                    key.set_raw_value(name, &reg_val)
                }
                RegValue::MultiSz(lines) => {
                    use std::os::windows::ffi::OsStrExt;
                    let mut bytes = Vec::new();
                    for line in lines {
                        for u in std::ffi::OsStr::new(line).encode_wide() {
                            bytes.extend_from_slice(&u.to_le_bytes());
                        }
                        bytes.extend_from_slice(&0u16.to_le_bytes());
                    }
                    bytes.extend_from_slice(&0u16.to_le_bytes());
                    let reg_val = winreg::RegValue {
                        vtype: winreg::enums::REG_MULTI_SZ,
                        bytes,
                    };
                    key.set_raw_value(name, &reg_val)
                }
                RegValue::Binary(b) => {
                    let reg_val = winreg::RegValue {
                        vtype: winreg::enums::REG_BINARY,
                        bytes: b.clone(),
                    };
                    key.set_raw_value(name, &reg_val)
                }
            }
        }

        fn key_exists(&self, hive: Hive, path: &str) -> std::io::Result<bool> {
            match root(&hive).open_subkey(path) {
                Ok(_) => Ok(true),
                Err(e) if e.kind() == std::io::ErrorKind::NotFound => Ok(false),
                Err(e) => Err(e),
            }
        }

        fn create_key(&self, hive: Hive, path: &str) -> std::io::Result<()> {
            refuse_in_unit_tests()?;
            root(&hive).create_subkey(path).map(|_| ())
        }

        fn delete_tree(&self, hive: Hive, path: &str) -> std::io::Result<()> {
            refuse_in_unit_tests()?;
            match root(&hive).delete_subkey_all(path) {
                Err(e) if e.kind() == std::io::ErrorKind::NotFound => Ok(()),
                other => other,
            }
        }

        fn names(&self, hive: Hive, path: &str) -> std::io::Result<Vec<String>> {
            let key = match root(&hive).open_subkey(path) {
                Ok(key) => key,
                Err(e) if e.kind() == std::io::ErrorKind::NotFound => return Ok(Vec::new()),
                Err(e) => return Err(e),
            };
            let mut names = Vec::new();
            for value in key.enum_values() {
                names.push(value?.0);
            }
            for subkey in key.enum_keys() {
                names.push(subkey?);
            }
            Ok(names)
        }

        fn delete(&self, hive: Hive, path: &str, name: &str) -> std::io::Result<()> {
            use winreg::enums::{KEY_QUERY_VALUE, KEY_SET_VALUE};
            refuse_in_unit_tests()?;
            let key =
                match root(&hive).open_subkey_with_flags(path, KEY_QUERY_VALUE | KEY_SET_VALUE) {
                    Ok(key) => key,
                    Err(e) if e.kind() == std::io::ErrorKind::NotFound => return Ok(()),
                    Err(e) => return Err(e),
                };
            match key.delete_value(name) {
                Err(e) if e.kind() == std::io::ErrorKind::NotFound => Ok(()),
                other => other,
            }
        }
    }

    /// A unit test that forgets to install the mock must fail, not edit the
    /// registry of whoever runs `cargo test` (CI runners are administrators).
    /// The disposable-VM suites opt in with the same variable as `vm_guard`.
    /// Every other seam (power plans, services, DNS, TCP templates, Filter
    /// Keys) calls this before a real system write for the same reason.
    pub(crate) fn refuse_in_unit_tests() -> std::io::Result<()> {
        if cfg!(test)
            && std::env::var("PC_TWEAKER_EXPANSION_VM_TEST").as_deref()
                != Ok("I_ACKNOWLEDGE_DISPOSABLE_VM")
        {
            return Err(std::io::Error::new(
                std::io::ErrorKind::PermissionDenied,
                "unit tests may not write the real registry; install the mock registry",
            ));
        }
        Ok(())
    }

    #[cfg(test)]
    thread_local! {
        static TEST_BACKEND: std::cell::RefCell<Option<std::rc::Rc<dyn RegistryBackend>>> =
            const { std::cell::RefCell::new(None) };
    }

    /// Routes this thread's registry calls to `backend` (test builds only).
    /// Thread-local, so tests running in parallel never see each other's state.
    #[cfg(test)]
    pub(crate) fn set_test_backend(backend: Option<std::rc::Rc<dyn RegistryBackend>>) {
        TEST_BACKEND.with(|slot| *slot.borrow_mut() = backend);
    }

    fn with_backend<T>(f: impl FnOnce(&dyn RegistryBackend) -> T) -> T {
        #[cfg(test)]
        if let Some(backend) = TEST_BACKEND.with(|slot| slot.borrow().clone()) {
            return f(&*backend);
        }
        f(&WinRegistry)
    }

    /// Reads a registry value, trying the same type as `kind_hint` (Dword or Str).
    pub fn read_value(
        hive: Hive,
        path: &str,
        name: &str,
        _kind_hint: &RegValue,
    ) -> std::io::Result<Option<RegValue>> {
        with_backend(|registry| registry.read(hive, path, name))
    }

    /// Writes a registry value, creating the key if needed, and reads it back.
    pub fn write_value(hive: Hive, path: &str, name: &str, value: &RegValue) -> Result<(), String> {
        with_backend(|registry| registry.write(hive, path, name, value))
            .map_err(|e| format!("could not write {} in {}: {}", name, path, e))?;
        if read_value(hive, path, name, value).map_err(|e| e.to_string())? != Some(value.clone()) {
            return Err(format!(
                "registry verification failed for {name}; the rollback snapshot was retained"
            ));
        }
        Ok(())
    }

    pub fn key_exists(hive: Hive, path: &str) -> std::io::Result<bool> {
        with_backend(|registry| registry.key_exists(hive, path))
    }

    pub fn create_key(hive: Hive, path: &str) -> std::io::Result<()> {
        with_backend(|registry| registry.create_key(hive, path))
    }

    pub fn delete_tree(hive: Hive, path: &str) -> std::io::Result<()> {
        with_backend(|registry| registry.delete_tree(hive, path))
    }

    pub fn names(hive: Hive, path: &str) -> std::io::Result<Vec<String>> {
        with_backend(|registry| registry.names(hive, path))
    }

    /// Restores (or removes) a value from a previously taken snapshot.
    pub fn restore_value(snapshot: &RegistrySnapshot) -> Result<(), String> {
        let hive = match snapshot.hive.as_str() {
            value if value.eq_ignore_ascii_case("HKCU") => Hive::Hkcu,
            value if value.eq_ignore_ascii_case("HKLM") => Hive::Hklm,
            _ => return Err("invalid registry hive in snapshot".into()),
        };
        match &snapshot.original_value {
            Some(value) => write_value(hive, &snapshot.path, &snapshot.name, value)?,
            None => {
                with_backend(|registry| registry.delete(hive, &snapshot.path, &snapshot.name))
                    .map_err(|e| format!("could not remove rollback target: {e}"))?;
                match read_value(hive, &snapshot.path, &snapshot.name, &RegValue::Dword(0)) {
                    Ok(None) => {}
                    Ok(Some(_)) => return Err("registry value still exists after rollback".into()),
                    Err(e) if e.kind() == std::io::ErrorKind::InvalidData => {
                        return Err("registry value still exists after rollback".into())
                    }
                    Err(e) => return Err(format!("could not verify rollback target: {e}")),
                }
            }
        }
        Ok(())
    }

    impl RegistryTweak {
        /// Reads the current value (if any) without changing anything.
        pub fn read_current(&self) -> std::io::Result<Option<RegValue>> {
            read_value(self.hive, self.key_path, self.value_name, &self.on_value)
        }

        /// Snapshots the current value, then writes `on_value`.
        pub fn apply(&self, store: &RollbackStore) -> Result<(), String> {
            require_active_policy(self.id)?;
            let mut transaction = store.transaction()?;
            let original = self.read_current().map_err(|e| e.to_string())?;
            transaction
                .save_entry(
                    self.id,
                    SnapshotEntry::Registry(RegistrySnapshot {
                        hive: hive_str(&self.hive).to_string(),
                        path: self.key_path.to_string(),
                        name: self.value_name.to_string(),
                        original_value: original,
                    }),
                )
                .map_err(|e| e.to_string())?;
            write_value(self.hive, self.key_path, self.value_name, &self.on_value)
        }

        /// Restores the value captured before `apply`, or removes it if it
        /// did not exist beforehand.
        pub fn rollback(&self, store: &RollbackStore) -> Result<(), String> {
            store.restore_entry(self.id, |entry| {
                let SnapshotEntry::Registry(snapshot) = entry else {
                    return Err("unexpected snapshot type for a registry tweak".to_string());
                };

                restore_value(&snapshot)
            })
        }
    }
}
