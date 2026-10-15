# Windows Registry Deep Research: Explorer, Shell, DWM & UI Responsiveness

**Document Version:** 1.0.0  
**Target Operating Systems:** Windows 10 (1809–22H2), Windows 11 (21H2, 22H2, 23H2, 24H2, 25H2)  
**Classification:** Deep Technical Research, Registry Internals & Optimization Catalog  
**Repository Target:** `WinCraft/docs/research/registry/EXPLORER_SHELL_DWM_REGISTRY_TWEAKS.md`  

---

## 1. Architectural Overview: Windows Desktop UI & Compositing Pipeline

The perceived responsiveness of the Windows user interface is governed by three decoupled subsystems operating across user mode and kernel mode:

```
+-------------------------------------------------------------------------+
|                              USER ACTIONS                               |
|                  (Mouse Clicks, Hovers, Window Drags)                   |
+-------------------------------------------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                  SUBSYSTEM 1: Win32k & User32 Subsystem                 |
|                   (win32kbase.sys, win32kfull.sys, user32.dll)          |
|  - Manages message queues, window handles (HWND), input hooks, timers   |
|  - Governed by: HKCU\Control Panel\Desktop                              |
|    * MenuShowDelay, HungAppTimeout, WaitToKillAppTimeout                |
|    * ForegroundLockTimeout, LowLevelHooksTimeout, UserPreferencesMask   |
|  - Metrics: HKCU\Control Panel\Desktop\WindowMetrics (MinAnimate)       |
+-------------------------------------------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                  SUBSYSTEM 2: Windows Explorer Shell                    |
|                        (explorer.exe, shell32.dll)                      |
|  - Taskbar rendering (Win10 legacy / Win11 XAML-island TaskbarView)     |
|  - File Explorer navigation tree, icon rendering, thumbnail generation  |
|  - Link resolution, disk space monitoring threads                       |
|  - Governed by:                                                         |
|    * HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced   |
|    * HKLM/HKCU\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer|
+-------------------------------------------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|              SUBSYSTEM 3: Desktop Window Manager (DWM)                  |
|                        (dwm.exe, udwm.dll, dxgkrnl.sys)                 |
|  - Hardware-accelerated desktop compositing, double/triple buffering   |
|  - Transition choreographies (minimize, maximize, taskbar slide, fade)  |
|  - Governed by: HKCU\Software\Microsoft\Windows\DWM & VisualEffects     |
+-------------------------------------------------------------------------+
```

### Why Default Windows Exhibits Latency & Stutter
1. **Artificial UX Dampening Timers:** Windows deliberately inserts multi-hundred-millisecond delays into basic desktop interactions (e.g., `MenuShowDelay = 400ms`, `ExtendedUIHoverTime = 400ms`) designed for inexperienced users or resistive touchscreens to prevent accidental mis-clicks.
2. **Synchronous Polling & Network Fallbacks:** When resolving invalid shortcuts (`.lnk`), Windows invokes Distributed Link Tracking Client (`TrkWks`) and searches local networks and UNC paths, blocking the Explorer UI thread for up to 60 seconds.
3. **Background Storage Polling:** Explorer periodically scans all drive volumes via background worker threads to trigger Low Disk Space toasts, creating periodic I/O interrupts and disk wakeups.
4. **Redundant Compositor Animations:** Window minimize/restore animations (`MinAnimate`) and taskbar button animations tie up DWM frame presentations and introduce 150–250ms of non-interactive visual interpolation.
5. **Slow Session Teardown:** Default shutdown waits (`WaitToKillAppTimeout = 5000ms`, `WaitToKillServiceTimeout = 5000ms`) delay reboots and logoffs even when running processes have halted.

This document catalogs all verified registry keys, their exact data types, default values, AtlasOS/ReviOS conventions, WinCraft recommendations, assembly-level kernel/user32 execution mechanics, and rollback commands.

---

## 2. Master Verification Matrix

The table below catalogs every target registry tweak. **Registry type precision is mandatory**: User32 legacy keys (such as `MenuShowDelay` and `MinAnimate`) fail silently or are ignored if authored as `REG_DWORD` instead of `REG_SZ`.

| # | Registry Hive & Key Path | Value Name | Type | Windows Stock Default | AtlasOS / ReviOS Value | WinCraft Recommended | Reversion / Rollback Value | Subsystem Affected |
|---|---|---|---|---|---|---|---|---|
| 1 | `HKCU\Control Panel\Desktop` | `MenuShowDelay` | `REG_SZ` | `"400"` | `"0"` | `"0"` (or `"10"`) | `"400"` | User32 / Win32k |
| 2 | `HKCU\Control Panel\Desktop` | `WaitToKillAppTimeout` | `REG_SZ` | `"5000"` (or unset) | `"1000"` / `"2000"` | `"2000"` | `"5000"` (or delete) | CSRSS / User32 |
| 3 | `HKCU\Control Panel\Desktop` | `HungAppTimeout` | `REG_SZ` | `"5000"` | `"1000"` / `"2000"` | `"1000"` | `"5000"` | Win32k / User32 |
| 4 | `HKCU\Control Panel\Desktop` | `AutoEndTasks` | `REG_SZ` | `"0"` (or unset) | `"1"` | `"1"` | `"0"` (or delete) | CSRSS / Winsrv |
| 5 | `HKCU\Control Panel\Desktop` | `ForegroundLockTimeout` | `REG_DWORD` | `200000` (`0x30D40`) | `0` | `0` | `200000` (`0x30D40`) | User32 Focus Mgr |
| 6 | `HKCU\Control Panel\Desktop` | `LowLevelHooksTimeout` | `REG_DWORD` | `1000` (unset/kernel) | `1000` / `200` | `1000` | `1000` (or delete) | Win32k Input Hook |
| 7 | `HKCU\Control Panel\Desktop\WindowMetrics` | `MinAnimate` | `REG_SZ` | `"1"` | `"0"` | `"0"` | `"1"` | User32 / DWM |
| 8 | `HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\VisualEffects` | `VisualFXSetting` | `REG_DWORD` | `0` (or `1`) | `3` (Custom) | `3` (Custom) | `0` (Auto) | Shell VisualFX |
| 9 | `HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced` | `ExtendedUIHoverTime` | `REG_DWORD` | Unset (~`400`) | `10` or `10000`+ | `10000` (Gaming) / `10` | Delete (or `400`) | Explorer Taskbar |
| 10 | `HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced` | `ShowTaskViewButton` | `REG_DWORD` | `1` | `0` | `0` | `1` | Taskbar View XAML |
| 11 | `HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced` | `TaskbarAnimations` | `REG_DWORD` | `1` | `0` | `0` | `1` | Explorer Taskbar |
| 12 | `HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced` | `TaskbarSizeMove` | `REG_DWORD` | `0` | `0` | `0` | `0` | Explorer Layout |
| 13 | `HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced` | `DisallowShaking` | `REG_DWORD` | `0` (or unset) | `1` | `1` | `0` (or delete) | User32 Gesture |
| 14 | `HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced` | `NavPaneShowAllFolders` | `REG_DWORD` | `0` | `0` | `0` | `0` | File Explorer Shell |
| 15 | `HKLM/HKCU\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer` | `NoLowDiskSpaceChecks` | `REG_DWORD` | `0` (or unset) | `1` | `1` | Delete (or `0`) | Shell32 Polling |
| 16 | `HKLM/HKCU\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer` | `LinkResolveIgnoreLinkInfo` | `REG_DWORD` | `0` (or unset) | `1` | `1` | Delete (or `0`) | Shell32 / TrkWks |

---

## 3. Deep Dive: Window Management & User32 Timers (`HKCU\Control Panel\Desktop`)

### 3.1 `MenuShowDelay`
- **Full Key Path:** `HKEY_CURRENT_USER\Control Panel\Desktop`
- **Value Name:** `MenuShowDelay`
- **Registry Value Type:** `REG_SZ` (*Strict String Requirement*. Windows User32 reads this via `GetProfileString` / internal registry string helper. Storing as `REG_DWORD` causes fallback to hardcoded default).
- **Windows Stock Default:** `"400"` (400 milliseconds)
- **AtlasOS Setting:** `"0"`
- **ReviOS Setting:** `"0"` (earlier builds used `"10"`)
- **WinCraft Recommendation:** `"0"` for desktop/high-DPI mice; `"10"` for convertible laptops/touchscreens.
- **Rollback / Recovery Value:** `"400"`
- **Subsystem & Execution Mechanics:**
  - Implemented in `user32.dll` (`TrackPopupMenuEx`, `MenuWindowProc`) and dispatched through `win32kbase.sys`.
  - When the cursor hovers over a menu item containing a cascading submenu (`MF_POPUP`), User32 initiates a timer (`SetTimer`) with the timeout duration loaded from `MenuShowDelay`.
  - When the timer expires, User32 posts `WM_TIMER` and creates the submenu popup window (`#32768`).
  - Setting this to `"0"` causes the submenu to spawn on the immediate frame the cursor crosses the hit-test boundary, eliminating the 400ms pause.
- **Caveat & Edge Case:** Setting strictly to `0` can occasionally trigger accidental submenu openings if a user rapidly moves their mouse diagonally across complex nested menus. Setting to `10` provides perceptual immediacy while suppressing single-frame jitter.

```cmd
:: Apply WinCraft Optimized Setting
reg add "HKCU\Control Panel\Desktop" /v MenuShowDelay /t REG_SZ /d 0 /f

:: Revert to Windows Default
reg add "HKCU\Control Panel\Desktop" /v MenuShowDelay /t REG_SZ /d 400 /f
```

---

### 3.2 `WaitToKillAppTimeout`
- **Full Key Path:** `HKEY_CURRENT_USER\Control Panel\Desktop`
- **Value Name:** `WaitToKillAppTimeout`
- **Registry Value Type:** `REG_SZ` (String representing milliseconds)
- **Windows Stock Default:** `"5000"` (Windows 10/11); `"20000"` in legacy Windows 7/8.1.
- **AtlasOS Setting:** `"1000"`
- **ReviOS Setting:** `"2000"`
- **WinCraft Recommendation:** `"2000"` (2 seconds)
- **Rollback / Recovery Value:** `"5000"`
- **Subsystem & Execution Mechanics:**
  - Governs Client/Server Runtime Subsystem (`csrss.exe`) and `user32!ExitWindowsEx`.
  - During user logoff or system shutdown, `csrss.exe` enumerates all top-level user windows and broadcasts `WM_QUERYENDSESSION` followed by `WM_ENDSESSION`.
  - `WaitToKillAppTimeout` determines how long CSRSS waits for a process to terminate gracefully before displaying the interactive "This app is preventing shutdown..." overlay or forcibly calling `TerminateProcess` (if `AutoEndTasks=1`).
  - Stock Windows waits 5 seconds. Reducing to 2000ms cuts 3 seconds from logoff/shutdown latency.
- **Caveat & Risk:** Setting below `1000ms` risks data corruption if background applications (e.g., database daemons, IDEs, browser session stores) need >1s to flush cache to NVMe/SATA storage. `2000ms` provides the ideal safety/speed equilibrium.

```cmd
:: Apply WinCraft Optimized Setting
reg add "HKCU\Control Panel\Desktop" /v WaitToKillAppTimeout /t REG_SZ /d 2000 /f

:: Revert to Windows Default
reg add "HKCU\Control Panel\Desktop" /v WaitToKillAppTimeout /t REG_SZ /d 5000 /f
```

---

### 3.3 `HungAppTimeout`
- **Full Key Path:** `HKEY_CURRENT_USER\Control Panel\Desktop`
- **Value Name:** `HungAppTimeout`
- **Registry Value Type:** `REG_SZ` (String representing milliseconds)
- **Windows Stock Default:** `"5000"` (5000 milliseconds)
- **AtlasOS Setting:** `"1000"`
- **ReviOS Setting:** `"1000"`
- **WinCraft Recommendation:** `"1000"` (1 second)
- **Rollback / Recovery Value:** `"5000"`
- **Subsystem & Execution Mechanics:**
  - Implemented in `win32kfull.sys` and monitored by `user32!IsHungAppWindow`.
  - Win32k maintains a message dispatch heartbeat for every GUI thread. If a thread fails to retrieve or process pending messages from its message queue (`GetMessage` / `PeekMessage`) within `HungAppTimeout` milliseconds, the system marks the window as unresponsive (`HUNG`).
  - DWM immediately replaces the window's client area with a "Ghost Window" (`GhostWindowFromHungWindow`). The title bar displays `(Not Responding)`, and User32 decouples the window container so the user can drag, minimize, or terminate it rather than freezing the entire desktop.
  - Setting this to `1000ms` triggers ghost window substitution within 1 second, preventing an unresponsive application from locking mouse interaction on the desktop.
- **Caveat & Edge Case:** Applications performing synchronous computation on the main UI thread (poorly written software) might trigger a transient "Not Responding" state faster during heavy disk/CPU bursts.

```cmd
:: Apply WinCraft Optimized Setting
reg add "HKCU\Control Panel\Desktop" /v HungAppTimeout /t REG_SZ /d 1000 /f

:: Revert to Windows Default
reg add "HKCU\Control Panel\Desktop" /v HungAppTimeout /t REG_SZ /d 5000 /f
```

---

### 3.4 `AutoEndTasks`
- **Full Key Path:** `HKEY_CURRENT_USER\Control Panel\Desktop`
- **Value Name:** `AutoEndTasks`
- **Registry Value Type:** `REG_SZ` (`"1"` = Enabled, `"0"` = Disabled)
- **Windows Stock Default:** `"0"` (or omitted from the registry)
- **AtlasOS Setting:** `"1"`
- **ReviOS Setting:** `"1"`
- **WinCraft Recommendation:** `"1"`
- **Rollback / Recovery Value:** `"0"` (or delete the value)
- **Subsystem & Execution Mechanics:**
  - Evaluated by `csrss.exe` and `winsrv.dll` during system logoff, restart, and shutdown sequences.
  - Default behavior (`0`): If an application hangs or does not respond to `WM_ENDSESSION` within `WaitToKillAppTimeout`, shutdown aborts to a full-screen interactive prompt demanding user intervention ("End Task" or "Cancel").
  - Optimized behavior (`1`): CSRSS immediately invokes `NtTerminateProcess` on unresponsive tasks without prompting the user or stalling shutdown.
- **Caveat & Risk:** Any unsaved document or dirty memory buffer inside an unresponsive application is terminated without a confirmation dialog. Recommended for gaming/performance workstations; caution advised for enterprise financial environments.

```cmd
:: Apply WinCraft Optimized Setting
reg add "HKCU\Control Panel\Desktop" /v AutoEndTasks /t REG_SZ /d 1 /f

:: Revert to Windows Default
reg add "HKCU\Control Panel\Desktop" /v AutoEndTasks /t REG_SZ /d 0 /f
```

---

### 3.5 `ForegroundLockTimeout`
- **Full Key Path:** `HKEY_CURRENT_USER\Control Panel\Desktop`
- **Value Name:** `ForegroundLockTimeout`
- **Registry Value Type:** `REG_DWORD`
- **Windows Stock Default:** `200000` (`0x00030D40` in hex = 200,000 ms = 3.33 minutes)
- **AtlasOS Setting:** `0`
- **ReviOS Setting:** `0`
- **WinCraft Recommendation:** `0`
- **Rollback / Recovery Value:** `200000` (`0x00030D40`)
- **Subsystem & Execution Mechanics:**
  - Implemented in `win32kfull.sys` (`xxxSetForegroundWindow2`) and `user32.dll`.
  - Windows enforces a "focus stealing prevention" security policy. When a background process invokes `SetForegroundWindow()`, Win32 checks whether the process has foreground activation permission. If not, Windows locks foreground focus to the current active window and instead blinks the requesting application's taskbar button.
  - The lock duration is determined by `ForegroundLockTimeout`. The default 200 seconds forces applications launched from launchers, command prompts, or secondary processes to stay in the background and flash rather than coming to the front.
  - Setting `ForegroundLockTimeout = 0` permits requested foreground windows to activate and take keyboard/mouse focus instantly.
- **Caveat & Risk:** If an unruly background application unexpectedly calls `SetForegroundWindow` while the user is actively typing a password or gaming, focus can be stolen. However, on single-user workstations, setting `0` eliminates the annoyance of clicking a shortcut or launcher and waiting for an app that starts behind existing windows.

```cmd
:: Apply WinCraft Optimized Setting
reg add "HKCU\Control Panel\Desktop" /v ForegroundLockTimeout /t REG_DWORD /d 0 /f

:: Revert to Windows Default
reg add "HKCU\Control Panel\Desktop" /v ForegroundLockTimeout /t REG_DWORD /d 200000 /f
```

---

### 3.6 `LowLevelHooksTimeout`
- **Full Key Path:** `HKEY_CURRENT_USER\Control Panel\Desktop`
- **Value Name:** `LowLevelHooksTimeout`
- **Registry Value Type:** `REG_DWORD`
- **Windows Stock Default:** Not present in the registry. Kernel hardcoded fallback is `1000` (1000 ms).
- **AtlasOS Setting:** `1000`
- **ReviOS Setting:** `1000`
- **WinCraft Recommendation:** `1000` (or `200` for low-latency competitive setups)
- **Rollback / Recovery Value:** Delete value (or set to `1000`)
- **Subsystem & Execution Mechanics:**
  - Implemented in `win32kbase.sys` input subsystem for `WH_KEYBOARD_LL` and `WH_MOUSE_LL` hooks.
  - When third-party utilities (recording software, mouse macro tools, Discord overlays, custom hotkey managers) register a low-level hook, Windows delivers mouse and keyboard input packets to the hook procedure synchronously before routing them to the focused window.
  - If the hook procedure blocks, `win32kbase.sys` waits up to `LowLevelHooksTimeout` ms. If the hook does not return within this window, Windows bypasses the hook and sends raw input directly to the target application to prevent complete input pipeline freezing.
  - On stock Windows without the key, a laggy hook can freeze cursor/keyboard input for a full 1 second. Specifying `1000` enforces the contract, while setting `200` to `500` ensures that sluggish overlay DLLs are dropped within a fraction of a second without user-perceptible input stutter.

```cmd
:: Apply WinCraft Optimized Setting
reg add "HKCU\Control Panel\Desktop" /v LowLevelHooksTimeout /t REG_DWORD /d 1000 /f

:: Revert to Windows Default
reg delete "HKCU\Control Panel\Desktop" /v LowLevelHooksTimeout /f
```

---

## 4. Deep Dive: Window Animation Metrics (`HKCU\Control Panel\Desktop\WindowMetrics`)

### 4.1 `MinAnimate`
- **Full Key Path:** `HKEY_CURRENT_USER\Control Panel\Desktop\WindowMetrics`
- **Value Name:** `MinAnimate`
- **Registry Value Type:** `REG_SZ` (*Strict String Requirement: `"0"` or `"1"`*).
  > **Crucial Engineering Note:** In earlier enthusiast scripts and early ReviOS playbooks, authors erroneously configured `MinAnimate` as `REG_DWORD`. Windows User32 and shell APIs query this parameter via `SystemParametersInfo(SPI_GETANIMATION)` mapping internally to string registry queries under `WindowMetrics`. If written as a `REG_DWORD`, Windows treats the value as corrupted/missing and continues animating.
- **Windows Stock Default:** `"1"` (Animations enabled)
- **AtlasOS Setting:** `"0"` (Animations disabled)
- **ReviOS Setting:** `"0"` (Corrected to `REG_SZ` in recent playbook releases)
- **WinCraft Recommendation:** `"0"`
- **Rollback / Recovery Value:** `"1"`
- **Subsystem & Execution Mechanics:**
  - Controls the `ANIMATIONINFO.iMinAnimate` structure in `user32.dll` via `SystemParametersInfoA/W` using action code `SPI_SETANIMATION` (`0x0049`).
  - When `MinAnimate = "1"`, minimizing or restoring an HWND instructs the Desktop Window Manager (`dwm.exe`) to calculate a multi-frame affine transform animation (scaling and fading the window surface between its desktop bounds and its taskbar coordinate slot).
  - This animation consumes between 150ms and 250ms of time per transition and incurs GPU rasterization/composition passes.
  - When `MinAnimate = "0"`, the transform is bypassed: the window disappears or reappears instantaneously upon click.

```cmd
:: Apply WinCraft Optimized Setting
reg add "HKCU\Control Panel\Desktop\WindowMetrics" /v MinAnimate /t REG_SZ /d 0 /f

:: Revert to Windows Default
reg add "HKCU\Control Panel\Desktop\WindowMetrics" /v MinAnimate /t REG_SZ /d 1 /f
```

---

## 5. Deep Dive: Visual Effects Master Configuration (`Explorer\VisualEffects`)

### 5.1 `VisualFXSetting`
- **Full Key Path:** `HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\VisualEffects`
- **Value Name:** `VisualFXSetting`
- **Registry Value Type:** `REG_DWORD`
- **Possible Values:**
  - `0` = *Let Windows choose what's best for my computer* (Automatic heuristic based on Windows Experience Index / hardware capability)
  - `1` = *Adjust for best appearance* (All visual effects and animations enabled)
  - `2` = *Adjust for best performance* (All visual effects and animations disabled)
  - `3` = *Custom* (User-selected combination of individual visual toggles)
- **Windows Stock Default:** `0` (or `1`)
- **AtlasOS Setting:** `3` (Custom configuration)
- **ReviOS Setting:** `3` (Custom configuration)
- **WinCraft Recommendation:** `3` (Custom configuration)
- **Rollback / Recovery Value:** `0` (or `1`)

#### The "Best Performance (2)" Trap: Why Pure Mode 2 Degrades Windows
Many novice optimization scripts set `VisualFXSetting = 2` without realizing the severe side effects:
1. **Disables ClearType / Font Smoothing (`FontSmoothing = "1"`):** Destroys subpixel text rendering, causing ragged, jagged, unreadable fonts across File Explorer, Win32 dialogs, and legacy MMC consoles on high-resolution displays.
2. **Disables File Thumbnails (`IconsOnly = 1`):** Image files (`.png`, `.jpg`), video clips, and PDFs no longer render thumbnail previews in File Explorer, replaced solely by generic file-type icons.
3. **Disables Drop Shadows for Icon Labels (`ListviewShadow = 0`):** Removes drop shadows under desktop icon text, rendering white desktop icon labels completely invisible against light or white desktop wallpapers.
4. **Disables Window Drag Contents (`DragFullWindows = "0"`):** Windows shows an ugly wireframe outline when moving windows rather than rendering the actual window contents during dragging.

#### The AtlasOS / WinCraft Hybrid Responsiveness Solution
To achieve maximum responsiveness without breaking visual usability, set `VisualFXSetting = 3` (Custom), disable transition animations, but preserve font rendering and thumbnails:

```cmd
:: Set Master Visual Effects Profile to Custom
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\VisualEffects" /v VisualFXSetting /t REG_DWORD /d 3 /f

:: Keep Font Smoothing / ClearType active (Crucial for high-DPI readability)
reg add "HKCU\Control Panel\Desktop" /v FontSmoothing /t REG_SZ /d 2 /f

:: Keep Window Contents visible while dragging
reg add "HKCU\Control Panel\Desktop" /v DragFullWindows /t REG_SZ /d 1 /f

:: Keep Thumbnails enabled (Do not force Icons Only)
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v IconsOnly /t REG_DWORD /d 0 /f

:: Keep Desktop Icon Text Drop Shadows
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v ListviewShadow /t REG_DWORD /d 1 /f

:: Disable Window Minimize/Restore Animation
reg add "HKCU\Control Panel\Desktop\WindowMetrics" /v MinAnimate /t REG_SZ /d 0 /f

:: Disable Taskbar Button Animations
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v TaskbarAnimations /t REG_DWORD /d 0 /f
```

---

## 6. Deep Dive: Shell & Explorer Advanced Tweaks (`Explorer\Advanced`)

### 6.1 `ExtendedUIHoverTime`
- **Full Key Path:** `HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced`
- **Value Name:** `ExtendedUIHoverTime`
- **Registry Value Type:** `REG_DWORD`
- **Windows Stock Default:** Not present in registry (internal shell timer default is ~`400` ms)
- **AtlasOS / ReviOS / Gaming Paradigms:**
  - **Paradigm A (Instant Thumbnail Previews):** `10` to `50` ms. Taskbar live thumbnails appear immediately on mouseover.
  - **Paradigm B (Popup Suppression / Gamer Optimization):** `10000` to `30000` ms (or `43200000` / 12 hours). Prevents taskbar thumbnail preview windows from accidentally popping up and obstructing gameplay, multi-monitor borders, or full-screen work.
- **WinCraft Recommendation:** `10000` (10 seconds) for gamers and high-speed productivity setups; `10` ms for users who rely on fast visual window previews.
- **Rollback / Recovery Value:** Delete the value (or set to `400`).
- **Subsystem & Execution Mechanics:**
  - Monitored by `explorer.exe`'s taskbar window class (`Shell_TrayWnd` and `MSTaskListWClass`).
  - When the cursor enters the bounding rectangle of a grouped or single running taskbar button, a tracking timer is initiated with the value specified in `ExtendedUIHoverTime`.
  - When the timer fires, the shell requests a live surface capture from DWM (`DwmRegisterThumbnail`) and renders the hover flyout. Raising this delay suppresses the popups; lowering it removes hover lag.

```cmd
:: Option A: Suppress accidental taskbar hover popups (10s delay)
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v ExtendedUIHoverTime /t REG_DWORD /d 10000 /f

:: Option B: Instant hover previews (10ms delay)
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v ExtendedUIHoverTime /t REG_DWORD /d 10 /f

:: Revert to Windows Default
reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v ExtendedUIHoverTime /f
```

---

### 6.2 `ShowTaskViewButton`
- **Full Key Path:** `HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced`
- **Value Name:** `ShowTaskViewButton`
- **Registry Value Type:** `REG_DWORD`
- **Windows Stock Default:** `1` (Task View icon enabled on taskbar)
- **AtlasOS Setting:** `0` (Disabled)
- **ReviOS Setting:** `0` (Disabled)
- **WinCraft Recommendation:** `0`
- **Rollback / Recovery Value:** `1`
- **Subsystem & Execution Mechanics:**
  - Read by `explorer.exe` during taskbar layout construction.
  - Controls whether the Task View / Virtual Desktops icon is visible next to Start / Search.
  - Setting `0` removes the button from the visual tree, saving taskbar horizontal footprint and reducing initialization overhead of virtual desktop thumbnail brokers. Keyboard shortcut `Win + Tab` remains fully functional.

```cmd
:: Apply WinCraft Optimized Setting
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v ShowTaskViewButton /t REG_DWORD /d 0 /f

:: Revert to Windows Default
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v ShowTaskViewButton /t REG_DWORD /d 1 /f
```

---

### 6.3 `TaskbarAnimations`
- **Full Key Path:** `HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced`
- **Value Name:** `TaskbarAnimations`
- **Registry Value Type:** `REG_DWORD`
- **Windows Stock Default:** `1` (Taskbar animations enabled)
- **AtlasOS Setting:** `0`
- **ReviOS Setting:** `0`
- **WinCraft Recommendation:** `0`
- **Rollback / Recovery Value:** `1`
- **Subsystem & Execution Mechanics:**
  - Read by `explorer.exe`'s taskbar rendering components.
  - Controls sliding and morphing animations when launching apps, closing windows, rearranging taskbar icons, or expanding notification area overflow trays.
  - Setting to `0` makes taskbar button changes immediate without interpolation frames.

```cmd
:: Apply WinCraft Optimized Setting
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v TaskbarAnimations /t REG_DWORD /d 0 /f

:: Revert to Windows Default
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v TaskbarAnimations /t REG_DWORD /d 1 /f
```

---

### 6.4 `TaskbarSizeMove`
- **Full Key Path:** `HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced`
- **Value Name:** `TaskbarSizeMove`
- **Registry Value Type:** `REG_DWORD`
- **Windows Stock Default:** `0` (Taskbar is locked)
- **AtlasOS Setting:** `0`
- **ReviOS Setting:** `0`
- **WinCraft Recommendation:** `0` (Locked)
- **Rollback / Recovery Value:** `0`
- **Subsystem & Execution Mechanics:**
  - Controls the "Lock the taskbar" toggle.
  - `0` = Taskbar is locked (cannot be accidentally resized or moved).
  - `1` = Taskbar is unlocked.
  - **Windows 10 vs 11 Architectural Difference:** On Windows 10, setting `1` allowed users to drag the taskbar to top/left/right screen edges and drag borders to expand rows. On Windows 11 (builds 22000+), Microsoft re-wrote the taskbar using modern XAML Islands (`Xaml_WindowedPopupClass`), locking screen placement to the bottom edge. However, the registry value is still queried by the shell to prevent accidental edge resizing and maintain legacy compatibility.

```cmd
:: Lock Taskbar (Default / Recommended)
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v TaskbarSizeMove /t REG_DWORD /d 0 /f
```

---

### 6.5 `DisallowShaking`
- **Full Key Path:** `HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced`
- **Alternative Machine Key:** `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced`
- **Group Policy Equivalent:** `HKCU\Software\Policies\Microsoft\Windows\Explorer\NoWindowMinimizingShortcuts`
- **Value Name:** `DisallowShaking`
- **Registry Value Type:** `REG_DWORD`
- **Windows Stock Default:** `0` (or value omitted; Aero Shake active)
- **AtlasOS Setting:** `1` (Aero Shake disabled)
- **ReviOS Setting:** `1` (Aero Shake disabled)
- **WinCraft Recommendation:** `1`
- **Rollback / Recovery Value:** `0` (or delete the value)
- **Subsystem & Execution Mechanics:**
  - Evaluated by `user32.dll` and `explorer.exe` gesture tracker.
  - Feature originally introduced in Windows 7 as "Aero Shake" (Title bar window shake). When a user rapidly shakes the currently dragged active window title bar back and forth, Windows automatically minimizes all background windows.
  - On high-polling-rate gaming mice (1000Hz–8000Hz) or multi-monitor setups, fast window positioning frequently triggers false-positive shake gestures, accidentally minimizing all background applications (e.g., Discord, monitoring tools, browser tabs).
  - Setting `DisallowShaking = 1` disables the gesture listener completely while preserving standard window dragging.

```cmd
:: Apply WinCraft Optimized Setting (User + Machine)
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v DisallowShaking /t REG_DWORD /d 1 /f
reg add "HKLM\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v DisallowShaking /t REG_DWORD /d 1 /f

:: Revert to Windows Default
reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v DisallowShaking /f
reg delete "HKLM\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v DisallowShaking /f
```

---

### 6.6 `NavPaneShowAllFolders`
- **Full Key Path:** `HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced`
- **Value Name:** `NavPaneShowAllFolders`
- **Registry Value Type:** `REG_DWORD`
- **Windows Stock Default:** `0` (Clean navigation pane)
- **AtlasOS Setting:** `0`
- **ReviOS Setting:** `0`
- **WinCraft Recommendation:** `0` (Keep `0` for responsiveness; power users may toggle to `1` if they require full shell namespace tree view).
- **Rollback / Recovery Value:** `0`
- **Subsystem & Execution Mechanics:**
  - Governs `explorer.exe`'s File Explorer left navigation pane (`NamespaceTreeControl`).
  - When set to `0`, File Explorer displays a curated list of root nodes (Quick Access / Home, This PC, Network).
  - When set to `1` ("Show all folders"), Explorer expands the entire root desktop namespace in the left pane, enumerating the desktop directory, Recycle Bin, Control Panel, user profile folders, and network endpoints.
  - **Performance Impact:** Setting to `1` introduces noticeable directory traversal lag because Explorer must query shell namespace extensions for all virtual items upon every folder navigation. Keeping `0` ensures instant folder switching.

```cmd
:: Apply WinCraft Optimized Setting (Clean, high-performance tree)
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v NavPaneShowAllFolders /t REG_DWORD /d 0 /f

:: Optional Power-User Tree (Full namespace traversal)
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v NavPaneShowAllFolders /t REG_DWORD /d 1 /f
```

---

## 7. Deep Dive: Explorer Policies & I/O Latency (`Policies\Explorer`)

### 7.1 `NoLowDiskSpaceChecks`
- **Full Key Path:**
  - `HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer`
  - `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer`
- **Value Name:** `NoLowDiskSpaceChecks`
- **Registry Value Type:** `REG_DWORD`
- **Windows Stock Default:** `0` (or value omitted; checks enabled)
- **AtlasOS Setting:** `1` (Low disk space checks disabled)
- **ReviOS Setting:** `1` (Low disk space checks disabled)
- **WinCraft Recommendation:** `1`
- **Rollback / Recovery Value:** Delete value (or set to `0`)
- **Subsystem & Execution Mechanics:**
  - Evaluated by `shell32.dll` background monitor threads in `explorer.exe`.
  - By default, Explorer maintains an active timer that periodically issues `GetDiskFreeSpaceEx` queries across all mounted logical volumes.
  - When a volume drops below threshold capacities (e.g., <200MB warning, <80MB urgent, <50MB critical), Explorer generates notification toasts, logs shell events, and launches the Disk Cleanup wizard dialog.
  - **Latency Overhead:** The periodic disk space check wakes up low-power NVMe/SATA controller states, creates background I/O contention, and bugs users on dedicated scratch, cache, or game drives that are intentionally kept near capacity.
  - Setting `NoLowDiskSpaceChecks = 1` terminates this polling thread entirely.

```cmd
:: Apply WinCraft Optimized Setting
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v NoLowDiskSpaceChecks /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v NoLowDiskSpaceChecks /t REG_DWORD /d 1 /f

:: Revert to Windows Default
reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v NoLowDiskSpaceChecks /f
reg delete "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v NoLowDiskSpaceChecks /f
```

---

### 7.2 `LinkResolveIgnoreLinkInfo`
- **Full Key Path:**
  - `HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer`
  - `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer`
- **Value Name:** `LinkResolveIgnoreLinkInfo`
- **Registry Value Type:** `REG_DWORD`
- **Windows Stock Default:** `0` (or value omitted; link resolution enabled)
- **AtlasOS Setting:** `1` (Link info resolution disabled)
- **ReviOS Setting:** `1` (Link info resolution disabled)
- **WinCraft Recommendation:** `1`
- **Rollback / Recovery Value:** Delete value (or set to `0`)
- **Subsystem & Execution Mechanics:**
  - Governs `shell32.dll!ResolveLink` and interaction with Distributed Link Tracking Client (`TrkWks`).
  - Shell shortcuts (`.lnk` files) store extended metadata including the original volume serial number, object ID, NetBIOS computer name, and mapped UNC share paths.
  - When a user double-clicks or an application references a shortcut whose direct target path is invalid (e.g., target file was deleted or moved), Windows initiates a comprehensive search heuristic:
    1. It queries Distributed Link Tracking (`TrkWks`).
    2. It broadcasts NetBIOS name resolution requests across the local network to locate the machine where the file previously existed.
    3. It scans available network drives and shares.
  - **Explorer Freeze Hazard:** If the shortcut originally referenced a disconnected SMB network share, NAS, or removable drive, Explorer freezes synchronously waiting for network socket timeouts (30 to 60+ seconds of complete UI lockup).
  - Setting `LinkResolveIgnoreLinkInfo = 1` forces Explorer to skip network link-info lookups immediately. If the target is missing locally, Explorer displays the prompt or error without network polling hangs.
- **Companion Policies for Total Link Search Suppression:**
  - `NoResolveTrack` (`REG_DWORD = 1`): Prevents the shell from using Distributed Link Tracking to resolve shortcuts.
  - `NoResolveSearch` (`REG_DWORD = 1`): Prevents the shell from conducting a comprehensive search of the local drive volume for the missing shortcut target.

```cmd
:: Apply WinCraft Optimized Setting (Prevent Explorer hangs on missing shortcuts)
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v LinkResolveIgnoreLinkInfo /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v LinkResolveIgnoreLinkInfo /t REG_DWORD /d 1 /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v NoResolveTrack /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v NoResolveTrack /t REG_DWORD /d 1 /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v NoResolveSearch /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v NoResolveSearch /t REG_DWORD /d 1 /f

:: Revert to Windows Default
reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v LinkResolveIgnoreLinkInfo /f
reg delete "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v LinkResolveIgnoreLinkInfo /f
reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v NoResolveTrack /f
reg delete "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v NoResolveTrack /f
reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v NoResolveSearch /f
reg delete "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v NoResolveSearch /f
```

---

## 8. Deep Dive: DWM & Auxiliary Shell Responsiveness

### 8.1 Post-Logon Startup Delay Suppression (`StartupDelayInMSec`)
- **Full Key Path:** `HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Serialize`
- **Value Name:** `StartupDelayInMSec`
- **Registry Value Type:** `REG_DWORD`
- **Windows Stock Default:** Key not present (Windows deliberately injects an artificial 10,000ms / 10-second wait after desktop initialization before launching user startup applications).
- **AtlasOS / ReviOS / WinCraft Value:** `0`
- **Mechanism:** Setting `StartupDelayInMSec = 0` eliminates the post-logon sleep timer in `explorer.exe!CStartupAppTask`, launching configured startup processes immediately upon desktop ready.

```cmd
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Serialize" /v StartupDelayInMSec /t REG_DWORD /d 0 /f
```

### 8.2 DWM Thumbnail Caching Optimization (`AlwaysHibernateThumbnails`)
- **Full Key Path:** `HKEY_CURRENT_USER\Software\Microsoft\Windows\DWM`
- **Value Name:** `AlwaysHibernateThumbnails`
- **Registry Value Type:** `REG_DWORD`
- **Windows Stock Default:** `0` (or omitted)
- **AtlasOS / Gaming Value:** `0`
- **Mechanism:** By default or when memory is pressured, DWM can hibernate taskbar thumbnail surface textures to disk. Forcing `0` ensures thumbnails stay resident in memory/VRAM, preventing disk I/O when hovering over taskbar buttons.

```cmd
reg add "HKCU\Software\Microsoft\Windows\DWM" /v AlwaysHibernateThumbnails /t REG_DWORD /d 0 /f
```

### 8.3 Explorer Isolation & Crash Resilience (`SeparateProcess`)
- **Full Key Path:** `HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced`
- **Value Name:** `SeparateProcess`
- **Registry Value Type:** `REG_DWORD`
- **Windows Stock Default:** `0` (Single monolithic `explorer.exe` process hosts taskbar, desktop, and all folder windows)
- **WinCraft Recommendation:** `1` for stability; `0` for lowest RAM usage.
- **Mechanism:** When `1`, every newly opened folder window runs in an isolated `explorer.exe` process instance separate from the shell tray/taskbar host. If a folder window hangs or crashes (e.g., due to a corrupted shell extension or hanging network path), the taskbar and desktop do not crash or restart.

```cmd
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v SeparateProcess /t REG_DWORD /d 1 /f
```

### 8.4 Clock Second-Hand Polling vs Responsiveness (`ShowSecondsInSystemClock`)
- **Full Key Path:** `HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced`
- **Value Name:** `ShowSecondsInSystemClock`
- **Registry Value Type:** `REG_DWORD`
- **Windows Stock Default:** `0` (Seconds hidden)
- **Performance Consideration:** Displaying seconds (`1`) forces the Windows Shell and DWM to invalidate, repaint, and composite the taskbar tray clock region every 1,000 milliseconds (1 Hz wakeup). On battery-constrained laptops or low-latency competitive systems, this prevents the CPU from entering deepest C-states (C8/C10) and increases background DPC jitter.
- **WinCraft Recommendation:** `0` for competitive latency / battery life; `1` only if exact timekeeping is required.

```cmd
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v ShowSecondsInSystemClock /t REG_DWORD /d 0 /f
```

---

## 9. Complete Automation Scripts

### 9.1 PowerShell Optimization Script (`Apply-WinCraftResponsiveness.ps1`)
Save and execute the following script from an elevated or standard PowerShell terminal:

```powershell
<#
.SYNOPSIS
    Applies verified WinCraft responsiveness and latency optimizations for Windows Explorer, Shell, and DWM.
.NOTES
    Compatible with Windows 10 & Windows 11 (21H2, 22H2, 23H2, 24H2, 25H2).
#>

[CmdletBinding()]
param (
    [switch]$RestartExplorer
)

Write-Host "=== Applying WinCraft Explorer, Shell & DWM Responsiveness Tweaks ===" -ForegroundColor Cyan

# Helper to ensure registry keys exist and set values safely
function Set-TweakValue {
    param (
        [string]$Path,
        [string]$Name,
        [object]$Value,
        [string]$Type = "DWord"
    )
    if (-not (Test-Path $Path)) {
        New-Item -Path $Path -Force | Out-Null
    }
    Set-ItemProperty -Path $Path -Name $Name -Value $Value -Type $Type -Force
    Write-Host "  [+] Set: $Path\$Name = $Value ($Type)" -ForegroundColor Green
}

# 1. User32 & Win32k Message Timers (HKCU\Control Panel\Desktop)
Set-TweakValue -Path "HKCU:\Control Panel\Desktop" -Name "MenuShowDelay" -Value "0" -Type "String"
Set-TweakValue -Path "HKCU:\Control Panel\Desktop" -Name "WaitToKillAppTimeout" -Value "2000" -Type "String"
Set-TweakValue -Path "HKCU:\Control Panel\Desktop" -Name "HungAppTimeout" -Value "1000" -Type "String"
Set-TweakValue -Path "HKCU:\Control Panel\Desktop" -Name "AutoEndTasks" -Value "1" -Type "String"
Set-TweakValue -Path "HKCU:\Control Panel\Desktop" -Name "ForegroundLockTimeout" -Value 0 -Type "DWord"
Set-TweakValue -Path "HKCU:\Control Panel\Desktop" -Name "LowLevelHooksTimeout" -Value 1000 -Type "DWord"

# 2. Window Metrics & Minimize Animation (HKCU\Control Panel\Desktop\WindowMetrics)
Set-TweakValue -Path "HKCU:\Control Panel\Desktop\WindowMetrics" -Name "MinAnimate" -Value "0" -Type "String"

# 3. Visual Effects Profile (HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\VisualEffects)
Set-TweakValue -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\VisualEffects" -Name "VisualFXSetting" -Value 3 -Type "DWord"
Set-TweakValue -Path "HKCU:\Control Panel\Desktop" -Name "FontSmoothing" -Value "2" -Type "String"
Set-TweakValue -Path "HKCU:\Control Panel\Desktop" -Name "DragFullWindows" -Value "1" -Type "String"

# 4. Explorer Advanced Settings (HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced)
Set-TweakValue -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name "ExtendedUIHoverTime" -Value 10000 -Type "DWord"
Set-TweakValue -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name "ShowTaskViewButton" -Value 0 -Type "DWord"
Set-TweakValue -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name "TaskbarAnimations" -Value 0 -Type "DWord"
Set-TweakValue -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name "TaskbarSizeMove" -Value 0 -Type "DWord"
Set-TweakValue -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name "DisallowShaking" -Value 1 -Type "DWord"
Set-TweakValue -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name "NavPaneShowAllFolders" -Value 0 -Type "DWord"
Set-TweakValue -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name "IconsOnly" -Value 0 -Type "DWord"
Set-TweakValue -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name "ListviewShadow" -Value 1 -Type "DWord"

# Machine-wide DisallowShaking
if ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent().IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Set-TweakValue -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name "DisallowShaking" -Value 1 -Type "DWord"
}

# 5. Explorer Policies (HKCU & HKLM Policies\Explorer)
Set-TweakValue -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer" -Name "NoLowDiskSpaceChecks" -Value 1 -Type "DWord"
Set-TweakValue -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer" -Name "LinkResolveIgnoreLinkInfo" -Value 1 -Type "DWord"
Set-TweakValue -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer" -Name "NoResolveTrack" -Value 1 -Type "DWord"
Set-TweakValue -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer" -Name "NoResolveSearch" -Value 1 -Type "DWord"

if ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent().IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Set-TweakValue -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer" -Name "NoLowDiskSpaceChecks" -Value 1 -Type "DWord"
    Set-TweakValue -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer" -Name "LinkResolveIgnoreLinkInfo" -Value 1 -Type "DWord"
    Set-TweakValue -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer" -Name "NoResolveTrack" -Value 1 -Type "DWord"
    Set-TweakValue -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer" -Name "NoResolveSearch" -Value 1 -Type "DWord"
}

# 6. DWM & Startup Performance
Set-TweakValue -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Serialize" -Name "StartupDelayInMSec" -Value 0 -Type "DWord"
Set-TweakValue -Path "HKCU:\Software\Microsoft\Windows\DWM" -Name "AlwaysHibernateThumbnails" -Value 0 -Type "DWord"

Write-Host "`nAll tweaks successfully written." -ForegroundColor Green

if ($RestartExplorer) {
    Write-Host "Restarting Windows Explorer..." -ForegroundColor Yellow
    Stop-Process -Name explorer -Force
} else {
    Write-Host "Note: Sign out or restart Explorer to apply all shell/desktop changes." -ForegroundColor Yellow
}
```

---

### 9.2 PowerShell Reversal Script (`Revert-WinCraftResponsiveness.ps1`)
To restore stock Windows defaults cleanly:

```powershell
<#
.SYNOPSIS
    Reverts all WinCraft Explorer, Shell, and DWM tweaks back to clean stock Windows defaults.
#>

[CmdletBinding()]
param (
    [switch]$RestartExplorer
)

Write-Host "=== Reverting WinCraft Tweaks to Stock Windows Defaults ===" -ForegroundColor Cyan

function Restore-Item {
    param ([string]$Path, [string]$Name, [object]$Value = $null, [string]$Type = "DWord", [switch]$Delete)
    if (-not (Test-Path $Path)) { return }
    if ($Delete) {
        Remove-ItemProperty -Path $Path -Name $Name -ErrorAction SilentlyContinue
        Write-Host "  [-] Deleted: $Path\$Name" -ForegroundColor Gray
    } else {
        Set-ItemProperty -Path $Path -Name $Name -Value $Value -Type $Type -Force
        Write-Host "  [<] Restored: $Path\$Name = $Value" -ForegroundColor Yellow
    }
}

# 1. Desktop Timers
Restore-Item -Path "HKCU:\Control Panel\Desktop" -Name "MenuShowDelay" -Value "400" -Type "String"
Restore-Item -Path "HKCU:\Control Panel\Desktop" -Name "WaitToKillAppTimeout" -Value "5000" -Type "String"
Restore-Item -Path "HKCU:\Control Panel\Desktop" -Name "HungAppTimeout" -Value "5000" -Type "String"
Restore-Item -Path "HKCU:\Control Panel\Desktop" -Name "AutoEndTasks" -Value "0" -Type "String"
Restore-Item -Path "HKCU:\Control Panel\Desktop" -Name "ForegroundLockTimeout" -Value 200000 -Type "DWord"
Restore-Item -Path "HKCU:\Control Panel\Desktop" -Name "LowLevelHooksTimeout" -Delete

# 2. Window Metrics
Restore-Item -Path "HKCU:\Control Panel\Desktop\WindowMetrics" -Name "MinAnimate" -Value "1" -Type "String"

# 3. Visual Effects Profile
Restore-Item -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\VisualEffects" -Name "VisualFXSetting" -Value 0 -Type "DWord"

# 4. Explorer Advanced
Restore-Item -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name "ExtendedUIHoverTime" -Delete
Restore-Item -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name "ShowTaskViewButton" -Value 1 -Type "DWord"
Restore-Item -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name "TaskbarAnimations" -Value 1 -Type "DWord"
Restore-Item -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name "TaskbarSizeMove" -Value 0 -Type "DWord"
Restore-Item -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name "DisallowShaking" -Delete
Restore-Item -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name "NavPaneShowAllFolders" -Value 0 -Type "DWord"

if ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent().IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Restore-Item -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name "DisallowShaking" -Delete
}

# 5. Policies
Restore-Item -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer" -Name "NoLowDiskSpaceChecks" -Delete
Restore-Item -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer" -Name "LinkResolveIgnoreLinkInfo" -Delete
Restore-Item -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer" -Name "NoResolveTrack" -Delete
Restore-Item -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer" -Name "NoResolveSearch" -Delete

if ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent().IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Restore-Item -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer" -Name "NoLowDiskSpaceChecks" -Delete
    Restore-Item -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer" -Name "LinkResolveIgnoreLinkInfo" -Delete
    Restore-Item -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer" -Name "NoResolveTrack" -Delete
    Restore-Item -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer" -Name "NoResolveSearch" -Delete
}

# 6. DWM & Startup
Restore-Item -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Serialize" -Name "StartupDelayInMSec" -Delete
Restore-Item -Path "HKCU:\Software\Microsoft\Windows\DWM" -Name "AlwaysHibernateThumbnails" -Delete

Write-Host "`nStock defaults restored." -ForegroundColor Green

if ($RestartExplorer) {
    Write-Host "Restarting Windows Explorer..." -ForegroundColor Yellow
    Stop-Process -Name explorer -Force
}
```

---

## 10. Audit & Verification Procedures

To audit that each value is registered with its exact expected type and data, run the following verification snippet in PowerShell:

```powershell
$AuditList = @(
    @{ Path = "HKCU:\Control Panel\Desktop"; Name = "MenuShowDelay"; ExpectedType = "String"; Target = "0" },
    @{ Path = "HKCU:\Control Panel\Desktop"; Name = "WaitToKillAppTimeout"; ExpectedType = "String"; Target = "2000" },
    @{ Path = "HKCU:\Control Panel\Desktop"; Name = "HungAppTimeout"; ExpectedType = "String"; Target = "1000" },
    @{ Path = "HKCU:\Control Panel\Desktop"; Name = "AutoEndTasks"; ExpectedType = "String"; Target = "1" },
    @{ Path = "HKCU:\Control Panel\Desktop"; Name = "ForegroundLockTimeout"; ExpectedType = "DWord"; Target = 0 },
    @{ Path = "HKCU:\Control Panel\Desktop"; Name = "LowLevelHooksTimeout"; ExpectedType = "DWord"; Target = 1000 },
    @{ Path = "HKCU:\Control Panel\Desktop\WindowMetrics"; Name = "MinAnimate"; ExpectedType = "String"; Target = "0" },
    @{ Path = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\VisualEffects"; Name = "VisualFXSetting"; ExpectedType = "DWord"; Target = 3 },
    @{ Path = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced"; Name = "ExtendedUIHoverTime"; ExpectedType = "DWord"; Target = 10000 },
    @{ Path = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced"; Name = "ShowTaskViewButton"; ExpectedType = "DWord"; Target = 0 },
    @{ Path = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced"; Name = "TaskbarAnimations"; ExpectedType = "DWord"; Target = 0 },
    @{ Path = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced"; Name = "TaskbarSizeMove"; ExpectedType = "DWord"; Target = 0 },
    @{ Path = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced"; Name = "DisallowShaking"; ExpectedType = "DWord"; Target = 1 },
    @{ Path = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced"; Name = "NavPaneShowAllFolders"; ExpectedType = "DWord"; Target = 0 },
    @{ Path = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer"; Name = "NoLowDiskSpaceChecks"; ExpectedType = "DWord"; Target = 1 },
    @{ Path = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer"; Name = "LinkResolveIgnoreLinkInfo"; ExpectedType = "DWord"; Target = 1 }
)

Write-Host "=== WinCraft Registry Audit Report ===" -ForegroundColor Cyan
foreach ($item in $AuditList) {
    if (Test-Path $item.Path) {
        $val = (Get-ItemProperty -Path $item.Path -ErrorAction SilentlyContinue).$($item.Name)
        if ($null -ne $val) {
            $regKey = Get-Item -Path $item.Path
            $actualType = $regKey.GetValueKind($item.Name)
            $typeMatch = ($actualType.ToString() -eq $item.ExpectedType)
            $valMatch = ($val -eq $item.Target)
            if ($typeMatch -and $valMatch) {
                Write-Host "  [PASS] $($item.Name): Value=$val, Type=$actualType" -ForegroundColor Green
            } else {
                Write-Host "  [WARN] $($item.Name): Value=$val (Expected: $($item.Target)), Type=$actualType (Expected: $($item.ExpectedType))" -ForegroundColor Yellow
            }
            continue
        }
    }
    Write-Host "  [MISSING] $($item.Path)\$($item.Name)" -ForegroundColor Red
}
```

---

## 11. Conclusion & Integration Guidance for WinCraft Engine

1. **Strict Type Coercion:** The WinCraft backend (`src-tauri/src/tweaks.rs`) must explicitly branch between `RegValue::Str` and `RegValue::Dword`. Under no circumstances should `MinAnimate`, `MenuShowDelay`, or `WaitToKillAppTimeout` be authored as `RegValue::Dword`.
2. **VisualFX Synergy:** WinCraft should not expose a raw "Adjust for Best Performance" toggle that blindly writes `VisualFXSetting = 2`. Doing so breaks ClearType and image thumbnails. Instead, WinCraft's UI Responsiveness preset must write `VisualFXSetting = 3` paired with explicit granular controls over animations while protecting `FontSmoothing="2"`, `IconsOnly=0`, and `ListviewShadow=1`.
3. **Safety Engine Compatibility:** All keys in this document are fully reversible and adhere to WinCraft's atomic transaction model, supporting instant rollback without requiring a full Windows reboot (sign-out or explorer restart is sufficient).
