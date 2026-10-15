# COSMIC Desktop Environment Specification & Windows 11 Implementation Architecture
## Pixel-Perfect Non-Destructive Skinpack & Shell Replication Specification

**Document Identifier:** `SPEC-SKINPACK-COSMIC-001`  
**Classification:** Deep Research, Visual Specification & Windows Architecture  
**Target Platform:** Windows 11 (22H2, 23H2, 24H2, 25H2)  
**Upstream Reference:** System76 COSMIC Desktop Environment (`cosmic-epoch`, `libcosmic`, `cosmic-comp`, `cosmic-panel`)  
**Status:** Approved Technical Architecture  

---

## 1. Executive Summary & Design Philosophy

The **COSMIC Desktop Environment** (Computer Operating System Main Interface Component), developed in Rust by System76 for Pop!_OS and the broader Linux ecosystem, represents the premier modern desktop interface engineered around the `libcosmic` framework and the `iced` GUI platform toolkit. Its defining characteristics are:
- Crisp geometric minimalism balanced by subtle rounded corner radii (8px/16px/160px pill).
- Independent, decoupled modular surfaces (floating top panel and floating dock).
- Deep system auto-tiling with persistent visual cues (accent colored active hints).
- A distinct high-contrast color system anchored by Cosmic Blue/Teal (`#48B9C7`) and deep slate surfaces (`#1B1B1B` / `#161616`).
- Frictionless keyboard-centric navigation via an integrated modal search launcher and categorized application library.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [Workspaces 1 2 3]  [Applications]                 10:42 AM                     [Tray] [Quick]  │  ◄─ Top Bar (32px, Floating/Docked)
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                                                                    
 ┌───────────────────────────────┐     ┌────────────────────────────────────────────────────────┐   
 │                               │     │                                                        │   
 │                               │     │                                                        │   
 │       Tiled Window A          │     │                    Tiled Window B                      │   
 │                               │     │               (Active Focused Window)                  │   
 │                               │     │           [2px #48B9C7 Active Window Hint]             │   
 │                               │     │                                                        │   
 └───────────────────────────────┘     └────────────────────────────────────────────────────────┘   
                                                                                                    
                       ┌────────────────────────────────────────────────────┐                       
                       │  [Terminal] [Files] [Browser] [Editor] [Settings]  │  ◄─ Floating Dock (48px pill)
                       │               •                 •                  │     (Centered, Intellihide)
                       └────────────────────────────────────────────────────┘                       
```

### Safety Invariant: Zero-DLL Modification Policy
Traditional Windows transformation packs compromise operating system stability, trigger Windows Defender heuristic blocks, fail Windows Cumulative Updates, and risk unbootable systems by patching core system DLLs (`uxtheme.dll`, `themeui.dll`, `explorerframe.dll`, or modifying `explorer.exe`).

WinCraft mandates a **100% Non-Destructive, Non-Patching Architecture**:
1. **Zero System File Patching:** No DLL injection, memory hooking of system processes, or binary replacement.
2. **Native Win32 Clean Shell Suppression:** The Windows 11 Taskbar (`Shell_TrayWnd`) is suppressed via standard Win32 visibility APIs (`ShowWindow(hTray, SW_HIDE)`) or AppBar message states.
3. **Stand-Alone Layered Composited Surfaces:** Top Bar and Dock run as separate lightweight transparent layered desktop surfaces (`WS_EX_LAYERED | WS_EX_TOOLWINDOW | WS_EX_NOACTIVATE`) utilizing native Windows DWM Acrylic/Mica compositing.
4. **Deterministic Instant Rollback:** 1-Click apply, 1-Click instant teardown that restores native Windows 11 taskbar, desktop work area, cursor schemes, and shell state in under 500ms without rebooting.

---

## 2. Upstream System76 COSMIC Architecture Analysis

### 2.1 The `cosmic-epoch` Ecosystem Breakdown
COSMIC is not a monolithic desktop; it is an orchestrated collection of independent Rust binaries communicating over Wayland protocols and IPC:

| Component Binary | Upstream Role | Windows 11 Replication Target |
|---|---|---|
| `cosmic-panel` | Configurable panel & floating dock host | WinCraft Native Layered Bar & Dock (`WS_EX_TOOLWINDOW`) |
| `cosmic-comp` | Wayland compositor & BSP tiling engine | WinCraft Tiling Bridge (GlazeWM Engine + Win32 Event Hooks) |
| `cosmic-launcher` | Super-key modal runner and search bar | WinCraft Centered Modal Launcher (Webview/Flow Launcher Engine) |
| `cosmic-applibrary`| Categorized full application grid modal | WinCraft Fullscreen App Library Overlay Modal |
| `cosmic-applets` | Modular plugins (Workspaces, Status, Time) | Modular Webview Applets / Win32 System Tray Proxy |
| `cosmic-osd` | Volume, brightness, display change toasts | Native WinCraft OSD Layer |
| `cosmic-settings` | Desktop, appearance, and hotkey configuration| WinCraft Theme Control Hub & Registry State Machine |

### 2.2 Deep Look: `libcosmic` Design System Mechanics
`libcosmic` uses a multi-tier token hierarchy written in Rust and serialized using Rusty Object Notation (`.ron`):
- **CosmicPalette:** Core tonal ramp specifying Neutral 0 through 10, Surface Grays 1-2, Accents, and Extended Brand Colors.
- **CornerRadii:** Mathematical corner radius struct defining five distinct radii (`radius_0`, `radius_xs`, `radius_s`, `radius_m`, `radius_l`, `radius_xl`).
- **Spacing / Density:** Layout padding and item margins parameterized by density modes (`Compact`, `Standard`, `Spacious`).

---

## 3. Visual Specification & Design Tokens

### 3.1 Color Palette Specifications
Derived directly from System76 `cosmic-theme/src/model/dark.ron` and `light.ron`:

#### A. Cosmic Dark Palette (Default & Canonical)
| Token Name | Hex Code | RGBA / Usage |
|---|---|---|
| `neutral_0` | `#000000` | Absolute black (deep contrast borders, shadow bases) |
| `neutral_1` | `#030303` | Darkest background floor |
| `neutral_2` | `#161616` | Container background, floating card surface |
| `neutral_3` | `#2E2E2E` | Card border, secondary component background, inactive dividers |
| `neutral_4` | `#484848` | Muted control borders, active divider lines |
| `neutral_5` | `#636363` | Disabled text, subtle icon tint |
| `neutral_6` | `#808080` | Tertiary placeholder text |
| `neutral_7` | `#9E9E9E` | Secondary body text, icon color standard |
| `neutral_8` | `#BEBEBE` | Primary subheadings, active icon tint |
| `neutral_9` | `#DEDEDE` | Primary body text |
| `neutral_10` | `#FFFFFF` | Maximum brightness primary text, active headers |
| `gray_1` | `#1B1B1B` | **Standard Base Window Background**, Top Panel base |
| `gray_2` | `#262626` | Elevated surfaces, button default background, applet base |
| `ext_blue` (Accent) | `#48B9C7` | **Primary Brand Accent (Cosmic Cyan)**, active borders, active toggles |
| `accent_blue` | `#63D0DF` | Accent hover state, highlighted link hover |
| `bright_red` | `#FFA09A` | Error state, destructive action buttons |
| `bright_green` | `#5EDB8C` | Success state, battery charging indicator |
| `bright_orange` | `#FFA37D` | Warning indicator, warm highlight |
| `ext_orange` | `#FFAD00` | Secondary Pop brand orange, notification badge |

#### B. Cosmic Light Palette
| Token Name | Hex Code | RGBA / Usage |
|---|---|---|
| `neutral_0` | `#FFFFFF` | Absolute white base surface |
| `neutral_1` | `#DEDEDE` | Light container outline, panel divider |
| `neutral_2` | `#BEBEBE` | Subtle borders, disabled toggle track |
| `neutral_7` | `#2E2E2E` | High-contrast secondary text |
| `neutral_9` | `#030303` | Primary title and body text |
| `gray_1` | `#D7D7D7` | Light theme secondary container surface |
| `gray_2` | `#E4E4E4` | Light theme primary base surface |
| `ext_blue` | `#00525A` | Deep contrast teal accent for light surfaces |
| `bright_blue` | `#6ACAD8` | Light theme secondary accent highlight |

### 3.2 Spacing & Density Tokens
Derived from `cosmic-theme/src/model/spacing.rs`:

```css
:root {
  /* Spacing Scale (Standard Density) */
  --cosmic-space-none: 0px;
  --cosmic-space-xxxs: 4px;
  --cosmic-space-xxs:  8px;
  --cosmic-space-xs:   12px;
  --cosmic-space-s:    16px;
  --cosmic-space-m:    24px;
  --cosmic-space-l:    32px;
  --cosmic-space-xl:   48px;
  --cosmic-space-xxl:  64px;
  --cosmic-space-xxxl: 128px;

  /* Applet Internal Padding */
  --cosmic-applet-padding-h: 8px;
  --cosmic-applet-padding-v: 4px;
  --cosmic-applet-gap: 6px;
}
```

### 3.3 Corner Radii Tokens
Derived from `cosmic-theme/src/model/corner.rs`:

| Token | Pixels | Application Target |
|---|---|---|
| `radius_0` | `0px` | Edge-to-edge docked panel without margins, sharp split panes |
| `radius_xs` | `4px` | Small tags, badges, tooltip pills, notification counts |
| `radius_s` | `8px` | Applet buttons, dropdown menu items, nested cards, input fields |
| `radius_m` | `16px` | Floating panel ends (when floating), launcher modal, dialogs, cards |
| `radius_l` | `32px` | Large modal panels, settings section containers |
| `radius_xl` | `160px` | **Full Pill**: Floating Dock, Workspaces pill container, search bar |

### 3.4 Surface Shadows and Elevation
COSMIC surfaces feature subtle, high-diffusion drop shadows to maintain legibility against complex wallpapers without heavy blur borders:

```css
/* Elevation Level 1: Applet Dropdowns & Popups */
--cosmic-shadow-elevation-1: 0 4px 16px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.06);

/* Elevation Level 2: Floating Top Bar & Floating Dock */
--cosmic-shadow-elevation-2: 0 8px 32px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.08);

/* Elevation Level 3: Modal Search Launcher & App Library Card */
--cosmic-shadow-elevation-3: 0 16px 48px rgba(0, 0, 0, 0.60), 0 0 0 1px rgba(255, 255, 255, 0.10);
```

### 3.5 Typography & Fonts
- **Primary Interface Font:** `Fira Sans` (Weights: Regular 400, Medium 500, SemiBold 600). Fallback: `Segoe UI Variable Text`, `Inter`.
- **Display / Headers:** `Fira Sans` (SemiBold 600, Bold 700).
- **Monospace / Terminal / Code:** `Fira Code` or `Fira Mono` (Weight: Regular 400, Medium 500).
- **Font Sizes:**
  - Panel Applet Text: `13px` / `0.8125rem`, Weight: 500, Line-height: `16px`.
  - Launcher Input: `18px` / `1.125rem`, Weight: 400.
  - Launcher Results Title: `14px` / `0.875rem`, Weight: 500.
  - Launcher Subtitle / Path: `12px` / `0.75rem`, Weight: 400, Color: `#9E9E9E`.

---

## 4. Shell Components Visual & Functional Architecture

### 4.1 Top Panel (Status Bar)
The COSMIC Top Panel is located at the top edge of the primary monitor (or all monitors in multi-display configurations).

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  ┌───────────────────────┐             ┌─────────────────────┐             ┌─────────────────────────┐ │
│  │ ┌───┐ ┌───┐ ┌───┐ ┌─┐ │             │     10:42 AM        │             │  [WiFi] [Vol] [Bat]     │ │
│  │ │ 1 │ │ 2 │ │ 3 │ │+│ │             │   Wed, Oct 15       │             │   ┌─────────────────┐   │ │
│  │ └───┘ └───┘ └───┘ └─┘ │             │                     │             │   │ 24°C  [Profile] │   │ │
│  └───────────────────────┘             └─────────────────────┘             │   └─────────────────┘   │ │
│   Left Wings: Workspaces                Center: Time & Date                Right Wings: Quick Status │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Detailed Top Panel Properties
- **Geometry & Sizing:**
  - Height: `32px` (Standard density) or `36px` (Spacious density).
  - Width: Mode A (Docked / Edge-to-Edge) = `100vw`; Mode B (Floating Island) = `calc(100vw - 16px)` with 8px margin from top, left, right.
  - Border Radius: Docked = `0px`; Floating = `12px` or `16px`.
- **Background & Material:**
  - Base: `#1B1B1B` with `80%` alpha (`rgba(27, 27, 27, 0.80)`).
  - Backdrop Filter: Windows Acrylic / Mica blur with 20px blur radius.
  - Bottom Border: 1px solid `rgba(255, 255, 255, 0.06)` (Dark mode) or `rgba(0, 0, 0, 0.08)` (Light mode).
- **Layout Partitioning:**
  1. **Left Wing (`plugins_wings.0`):**
     - Workspaces Applet: Shows numbered pills `1`, `2`, `3` or dots. Active workspace pill has solid `#48B9C7` or `#262626` background with active cyan underline.
     - Applications Applet (optional toggle): Text button or Pop icon opening App Library.
  2. **Center (`plugins_center`):**
     - Time & Date Applet: Centered formatted string `10:42 AM` or `Wed Oct 15  10:42 AM`. Clicking drops down the COSMIC Calendar & Notification flyout.
  3. **Right Wing (`plugins_wings.1`):**
     - System Tray Applet: Host for legacy Win32 notification icons.
     - Connectivity & Audio: Combined pill showing Network icon, Speaker volume icon, and Battery percentage (on laptops).
     - Power & Quick Settings: Dropdown chevron or user avatar triggering the Power/Settings flyout.

### 4.2 Floating Dock
The COSMIC Dock defaults to a centered horizontal pill at the bottom edge of the display.

```
       ┌───────────────────────────────────────────────────────────────────────┐
       │   [Files]   [Browser]   [Terminal]   [Code]   [Slack]   [Settings]    │
       │      •                     •            •                             │
       └───────────────────────────────────────────────────────────────────────┘
                                   ▲
                    4px Active Accent Indicator Dot/Capsule
```

#### Detailed Dock Properties
- **Geometry & Alignment:**
  - Position: Bottom Center, offset by `8px` or `12px` anchor gap above screen bottom.
  - Height: `56px` to `64px` total container height (Icon size: `40px` or `48px`).
  - Shape: Full pill (`border-radius: 160px` or `28px`).
  - Padding: `6px 12px` horizontal, `6px` vertical.
  - Item Spacing: `8px` gap between application icon items.
- **Visual Styling:**
  - Background: `rgba(27, 27, 27, 0.82)`.
  - Border: `1px solid rgba(255, 255, 255, 0.10)`.
  - Shadow: `0 12px 36px rgba(0, 0, 0, 0.50), 0 0 0 1px rgba(0, 0, 0, 0.20)`.
- **Running & Pinned Indicators:**
  - Pinned applications without open windows: Clean icon without indicator.
  - Running application: Single circular dot `4px x 4px` centered `3px` below icon in accent color `#48B9C7`.
  - Multiple open windows: Horizontal pill/capsule `8px x 3px` or dual dots.
  - Focused window: Brighter indicator pulse or icon subtle background highlight (`rgba(255, 255, 255, 0.08)`).
- **Auto-Hide / Intellihide Semantics:**
  - Modes: `Always Visible`, `Intellihide` (Dodge Windows), `Always Autohide`.
  - Intellihide Rule: If any active or maximized window overlaps the dock's screen bounding rectangle, dock slides down with transition: `transform: translateY(calc(100% + 16px))`, duration `200ms cubic-bezier(0.16, 1, 0.3, 1)`, wait delay before hiding: `300ms`.
  - Edge trigger: Hovering within 2px of bottom screen edge reveals dock instantly.

---

### 4.3 App Launcher & App Library Modals

#### A. Centered Modal Launcher (Super Key / Super + /)
The Cosmic Launcher is a lightweight, keyboard-focused modal designed for rapid application launching, file search, web queries, and inline calculations.

```
┌────────────────────────────────────────────────────────────────────────┐
│  🔍  Search applications, files, commands...                           │
├────────────────────────────────────────────────────────────────────────┤
│  [Icon]  Alacritty                                         Terminal    │
│          Terminal Emulator                                             │
├────────────────────────────────────────────────────────────────────────┤
│  [Icon]  Brave Browser                                     Web Browser │
│          Access the internet                                           │
├────────────────────────────────────────────────────────────────────────┤
│  [Icon]  Visual Studio Code                                Development │
│          Code Editing. Redefined.                                      │
├────────────────────────────────────────────────────────────────────────┤
│  [Icon]  Files                                             System      │
│          Browse local files and folders                                │
└────────────────────────────────────────────────────────────────────────┘
```

- **Dimensions:** Width `640px`, max-height `420px`, centered horizontally, positioned `20%` from screen top.
- **Corner Radius:** `16px`.
- **Input Field:** `48px` height, `#262626` background, 1px border `#3E3E3E`, placeholder `#808080`, text `#FFFFFF`.
- **Keyboard Navigation:** `Up`/`Down` arrows move selection highlight (`#2E2E2E` background with `#48B9C7` left border or active glow), `Enter` executes default action, `Esc` dismisses modal.

#### B. App Library (Super + A)
The App Library provides a categorized, touch- and mouse-friendly view of all installed software organized in folders:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                  🔍  Search installed applications...                                │
│                                                                                                      │
│  📁 Office & Productivity       📁 Development & Tools         📁 Utilities & System                 │
│  ┌───────────────────────────┐  ┌───────────────────────────┐  ┌───────────────────────────┐         │
│  │ [LibreOffice] [Mail]      │  │ [VS Code] [GitKraken]     │  │ [Settings] [Terminal]     │         │
│  │ [Calendar]    [Calculator]│  │ [Postman] [Docker]        │  │ [Disks]    [Monitor]      │         │
│  └───────────────────────────┘  └───────────────────────────┘  └───────────────────────────┘         │
└──────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

- **Overlay:** Semi-transparent dark curtain (`rgba(0, 0, 0, 0.55)` with 12px backdrop blur).
- **Cards:** Category containers with `16px` border-radius, background `#202020`, 1px border `#2E2E2E`.
- **Drag-and-Drop:** Ability to group applications into drawers/folders.

---

### 4.4 Window Tiling & Active Window Hint

In COSMIC, window management is powered by an integrated Binary Space Partitioning (BSP) auto-tiling engine.

```
┌──────────────────────────────────────────────────┐
│ Focused / Active Window                          │
│                                                  │
│                                                  │
│                                                  │
└──────────────────────────────────────────────────┘
 ▲
 └── 2px Solid #48B9C7 Active Window Hint Border (Corner Radius: 8px)
```

- **Active Window Hint:**
  - Border Width: `2px` (configurable to 1px or 3px).
  - Border Color: `#48B9C7` (`ext_blue`).
  - Corner Radius: Outer `8px` or `12px` (matching window corner).
  - Inactive Window Border: `1px solid rgba(255, 255, 255, 0.06)` or borderless.
- **Window Gaps:**
  - Inner Gap (between tiled windows): `8px` (default).
  - Outer Gap (between window edge and screen boundary / panel): `8px` (default).
- **Tiling Operations & Shortcuts:**
  - `Super + Y`: Toggle Auto-Tiling mode on/off.
  - `Super + Arrow Keys` / `Super + H/J/K/L`: Navigate focus across tiled tree.
  - `Super + Shift + Arrow Keys`: Swap/move window within the tiling tree.
  - `Super + G`: Toggle floating mode for the currently active window.
  - `Super + M`: Toggle maximize current window (temporarily zoom).
  - `Super + Q`: Close active window.

---

## 5. Non-Destructive Windows 11 Architecture

To achieve a 1:1 indistinguishable pixel-perfect visual match on Windows 11 without patching or modifying core system DLLs, WinCraft deploys a four-tier userland shell layer.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 WinCraft COSMIC Skinpack Engine                                 │
└────────────────────────────────────────┬────────────────────────────────────────────────────────┘
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        ▼                                ▼                                ▼
┌──────────────────────┐      ┌──────────────────────┐      ┌───────────────────────────┐
│ 1. Shell Suppression │      │ 2. Layered Surfaces  │      │ 3. Window & Tiling Engine │
│  - FindWindowW       │      │  - Top Bar Surface   │      │  - GlazeWM BSP Engine     │
│  - ShowWindow(HIDE)  │      │  - Dock Surface      │      │  - Active Border Overlay  │
│  - AppBar SetWorkArea│      │  - DWM Mica/Acrylic  │      │  - Win32 Event Hooks      │
└──────────────────────┘      └──────────────────────┘      └───────────────────────────┘
```

### 5.1 Native Windows Taskbar Suppression Engine
Windows 11 renders its taskbar inside `explorer.exe` across two main HWND classes:
- `Shell_TrayWnd`: Primary monitor taskbar.
- `Shell_SecondaryTrayWnd`: Secondary monitor taskbars.

#### Clean Suppression Protocol (No DLL Injection)
Instead of killing `explorer.exe` (which breaks tray notifications, Open/Save file dialogs, and shell folder shortcuts) or injecting DLLs:
1. Locate handles via `FindWindowW(L"Shell_TrayWnd", NULL)`.
2. Intercept desktop work area recalculation via `SystemParametersInfoW(SPI_SETWORKAREA, ...)`.
3. Set tray window visibility to hidden: `ShowWindow(hwndTray, SW_HIDE)`.
4. Register the new WinCraft Top Panel as an authentic Windows Application Desktop Toolbar via `SHAppBarMessage(ABM_NEW, ...)` so all maximized windows automatically respect the panel space without overlapping.

```rust
// Rust implementation snippet in src-tauri for taskbar suppression
use windows::Win32::Foundation::HWND;
use windows::Win32::UI::WindowsAndMessaging::{FindWindowW, ShowWindow, SW_HIDE, SW_SHOW};
use windows::core::w;

pub struct WindowsTaskbarController;

impl WindowsTaskbarController {
    pub fn hide_taskbars() -> Result<(), String> {
        unsafe {
            // 1. Primary taskbar
            let primary_hwnd = FindWindowW(w!("Shell_TrayWnd"), None);
            if !primary_hwnd.is_invalid() {
                let _ = ShowWindow(primary_hwnd, SW_HIDE);
            }
            
            // 2. Secondary monitor taskbars
            let mut secondary_hwnd = FindWindowW(w!("Shell_SecondaryTrayWnd"), None);
            while !secondary_hwnd.is_invalid() {
                let _ = ShowWindow(secondary_hwnd, SW_HIDE);
                secondary_hwnd = FindWindowW(w!("Shell_SecondaryTrayWnd"), None);
            }
        }
        Ok(())
    }

    pub fn restore_taskbars() -> Result<(), String> {
        unsafe {
            let primary_hwnd = FindWindowW(w!("Shell_TrayWnd"), None);
            if !primary_hwnd.is_invalid() {
                let _ = ShowWindow(primary_hwnd, SW_SHOW);
            }
            let mut secondary_hwnd = FindWindowW(w!("Shell_SecondaryTrayWnd"), None);
            while !secondary_hwnd.is_invalid() {
                let _ = ShowWindow(secondary_hwnd, SW_SHOW);
                secondary_hwnd = FindWindowW(w!("Shell_SecondaryTrayWnd"), None);
            }
        }
        Ok(())
    }
}
```

### 5.2 Layered Shell Surfaces (Top Bar & Dock)
The Top Bar and Dock are spawned as independent lightweight Tauri/Webview windows with specialized Win32 extended window styles:
- `WS_POPUP`: Strips standard title bars, borders, and window controls.
- `WS_EX_TOOLWINDOW`: Prevents the Top Bar and Dock from appearing in Alt+Tab, Task View, or the Windows Taskbar.
- `WS_EX_NOACTIVATE`: Prevents clicking an applet on the panel or an icon on the dock from stealing keyboard focus from active document windows.
- `WS_EX_LAYERED`: Enables hardware-accelerated alpha transparency and DWM compositing.

```rust
// Window initialization helper for Tauri layered shell surfaces
use windows::Win32::Foundation::HWND;
use windows::Win32::UI::WindowsAndMessaging::{
    GetWindowLongPtrW, SetWindowLongPtrW, GWL_EXSTYLE,
    WS_EX_LAYERED, WS_EX_NOACTIVATE, WS_EX_TOOLWINDOW,
};

pub fn configure_shell_surface(hwnd: HWND) {
    unsafe {
        let cur_style = GetWindowLongPtrW(hwnd, GWL_EXSTYLE);
        let target_style = cur_style 
            | (WS_EX_TOOLWINDOW.0 as isize) 
            | (WS_EX_NOACTIVATE.0 as isize) 
            | (WS_EX_LAYERED.0 as isize);
        SetWindowLongPtrW(hwnd, GWL_EXSTYLE, target_style);
    }
}
```

#### DWM Backdrop Blur Integration
To match `libcosmic`'s dark translucent frosted acrylic aesthetic:
```rust
use windows::Win32::Graphics::Dwm::{DwmSetWindowAttribute, DWMWA_SYSTEMBACKDROP_TYPE};

// DWM System Backdrop Type 3 = DWMSBT_TRANSIENTWINDOW (Acrylic)
pub fn apply_cosmic_acrylic_backdrop(hwnd: HWND) {
    unsafe {
        let backdrop_type: u32 = 3; // Acrylic blur
        let _ = DwmSetWindowAttribute(
            hwnd,
            DWMWA_SYSTEMBACKDROP_TYPE,
            &backdrop_type as *const _ as *const _,
            std::mem::size_of::<u32>() as u32,
        );
    }
}
```

### 5.3 System Tray Bridge
Windows 11 notification icons reside in the Explorer notification area (`NotifyIconOverflowWindow` and `ToolbarWindow32`).
WinCraft replicates the COSMIC System Tray applet by:
1. Enumerating notification icons using the standard Shell Notification Icon API or monitoring `HKCU\Control Panel\NotifyIconSettings`.
2. Providing a native tray proxy flyout that forwards mouse clicks directly to the target icon's message window (`WM_USER` notification packets) or embedding the icons inside the right wing of the Top Panel.

### 5.4 Window Tiling Engine: GlazeWM Bridge
To deliver the exact COSMIC tiling experience (dynamic BSP splitting, 8px gaps, keyboard navigation), WinCraft integrates with the **GlazeWM** engine:
- GlazeWM runs as a silent, portable userland executable (zero installation, zero registry pollution).
- WinCraft provisions a custom `config.yaml` matching COSMIC keybindings and gap specifications.
- **Active Window Hint Overlay:** Because standard Windows 11 DWM borders cannot be dynamically recolored per-window to `#48B9C7` without patching UXTheme, WinCraft runs a dedicated transparent click-through border overlay window.
  - The overlay tracks the active window via `SetWinEventHook` listening for `EVENT_SYSTEM_FOREGROUND` and `EVENT_OBJECT_LOCATIONCHANGE`.
  - It renders a crisp 2px `#48B9C7` border with 8px corner radius around the active window rectangle using Direct2D or Skia.

---

## 6. Complete Configuration Files & Implementation Artifacts

### 6.1 GlazeWM COSMIC Configuration (`glazewm/config.yaml`)
This configuration establishes COSMIC-parity window gaps, hotkeys, and tiling behaviors:

```yaml
# WinCraft COSMIC Desktop Environment - GlazeWM Configuration
general:
  # COSMIC default window gaps
  inner_gaps: 8px
  outer_gaps: 8px
  focused_border:
    enabled: true
    width: 2px
    active_color: "#48B9C7"    # COSMIC ext_blue accent
    inactive_color: "#2E2E2E"  # COSMIC neutral_3
  cursor_follows_focus: false
  focus_follows_cursor: false

workspaces:
  - name: "1"
    display_name: "1"
  - name: "2"
    display_name: "2"
  - name: "3"
    display_name: "3"
  - name: "4"
    display_name: "4"

keybindings:
  # Focus Navigation (Super + Arrow Keys & Super + H/J/K/L)
  - command: "focus left"
    bindings: ["alt+h", "alt+left"]
  - command: "focus right"
    bindings: ["alt+l", "alt+right"]
  - command: "focus up"
    bindings: ["alt+k", "alt+up"]
  - command: "focus down"
    bindings: ["alt+j", "alt+down"]

  # Window Movement (Super + Shift + Arrow Keys)
  - command: "move left"
    bindings: ["alt+shift+h", "alt+shift+left"]
  - command: "move right"
    bindings: ["alt+shift+l", "alt+shift+right"]
  - command: "move up"
    bindings: ["alt+shift+k", "alt+shift+up"]
  - command: "move down"
    bindings: ["alt+shift+j", "alt+shift+down"]

  # Window Management
  - command: "toggle-tiling-direction"
    binding: "alt+v"
  - command: "toggle-floating"
    binding: "alt+g"
  - command: "toggle-fullscreen"
    binding: "alt+m"
  - command: "close"
    binding: "alt+q"

  # Workspace Switching
  - command: "focus workspace 1"
    binding: "alt+1"
  - command: "focus workspace 2"
    binding: "alt+2"
  - command: "focus workspace 3"
    binding: "alt+3"
  - command: "focus workspace 4"
    binding: "alt+4"

  - command: "move to workspace 1"
    binding: "alt+shift+1"
  - command: "move to workspace 2"
    binding: "alt+shift+2"
  - command: "move to workspace 3"
    binding: "alt+shift+3"
  - command: "move to workspace 4"
    binding: "alt+shift+4"
```

### 6.2 Top Panel CSS Design Spec (`cosmic-top-panel.css`)

```css
/* WinCraft COSMIC Top Panel Stylesheet */
:root {
  --cosmic-bg: rgba(27, 27, 27, 0.82);
  --cosmic-surface: #262626;
  --cosmic-accent: #48B9C7;
  --cosmic-accent-hover: #63D0DF;
  --cosmic-text-primary: #FFFFFF;
  --cosmic-text-secondary: #9E9E9E;
  --cosmic-border: rgba(255, 255, 255, 0.08);
  --cosmic-radius-pill: 160px;
  --cosmic-radius-item: 8px;
  --cosmic-font-family: 'Fira Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI Variable Text', sans-serif;
}

body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: transparent;
  user-select: none;
  font-family: var(--cosmic-font-family);
}

.cosmic-panel-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  padding: 0 12px;
  background-color: var(--cosmic-bg);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--cosmic-border);
  color: var(--cosmic-text-primary);
  font-size: 13px;
  font-weight: 500;
}

/* Left Wings: Workspaces */
.cosmic-workspaces {
  display: flex;
  align-items: center;
  gap: 4px;
}

.cosmic-workspace-pill {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 22px;
  padding: 0 6px;
  border-radius: var(--cosmic-radius-item);
  background-color: transparent;
  color: var(--cosmic-text-secondary);
  cursor: pointer;
  transition: all 150ms ease;
}

.cosmic-workspace-pill:hover {
  background-color: rgba(255, 255, 255, 0.06);
  color: var(--cosmic-text-primary);
}

.cosmic-workspace-pill.active {
  background-color: var(--cosmic-surface);
  color: var(--cosmic-accent);
  box-shadow: inset 0 -2px 0 var(--cosmic-accent);
  font-weight: 600;
}

/* Center: Clock & Calendar */
.cosmic-clock-container {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 10px;
  border-radius: var(--cosmic-radius-item);
  cursor: pointer;
  transition: background-color 150ms ease;
}

.cosmic-clock-container:hover {
  background-color: rgba(255, 255, 255, 0.06);
}

/* Right Wings: System Tray & Quick Settings */
.cosmic-status-area {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cosmic-status-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 8px;
  height: 24px;
  border-radius: var(--cosmic-radius-pill);
  background-color: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--cosmic-border);
  cursor: pointer;
}

.cosmic-status-pill:hover {
  background-color: rgba(255, 255, 255, 0.08);
}
```

### 6.3 Floating Dock CSS Design Spec (`cosmic-dock.css`)

```css
/* WinCraft COSMIC Floating Dock Stylesheet */
.cosmic-dock-container {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 56px;
  padding: 0 12px;
  margin: 0 auto;
  border-radius: 160px;
  background-color: rgba(27, 27, 27, 0.84);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.10);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.50);
}

.cosmic-dock-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 180ms cubic-bezier(0.16, 1, 0.3, 1), background-color 150ms ease;
}

.cosmic-dock-item:hover {
  transform: translateY(-4px) scale(1.08);
  background-color: rgba(255, 255, 255, 0.08);
}

.cosmic-dock-item img {
  width: 36px;
  height: 36px;
  pointer-events: none;
}

/* Running App Indicator Dot */
.cosmic-dock-item.running::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #48B9C7;
}

/* Multiple Windows Open Pill */
.cosmic-dock-item.running.multiple::after {
  width: 10px;
  border-radius: 2px;
}
```

---

## 7. Deterministic Reversibility & Rollback State Machine

WinCraft enforces the core product guarantee: **1-Click Apply, 1-Click Instant Teardown back to stock Windows 11**.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              Skinpack Lifecycle State Machine                          │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
               ┌────────────────────────────┴────────────────────────────┐
               ▼                                                         ▼
       [ APPLY ACTION ]                                          [ REVERT ACTION ]
  1. Capture Pre-State Snapshot                            1. Kill Shell Surfaces & Tiler
     (Taskbar, WorkArea, Cursors)                             (Dock, TopBar, GlazeWM)
  2. Suppress Windows Taskbar                              2. Restore Native Taskbar
     (ShowWindow SW_HIDE)                                     (ShowWindow SW_SHOW)
  3. Update WorkArea Metrics                               3. Restore Desktop WorkArea
  4. Launch Top Bar & Dock Processes                       4. Reapply Default Cursor Scheme
  5. Start GlazeWM & Hotkey Listeners                      5. Flush DWM Window Cache
  6. Apply Cursors & Wallpapers                            6. Verify Explorer Health
```

### 7.1 Pre-State Baseline Snapshot Schema
Before applying the skinpack, the WinCraft backend persists an atomic JSON snapshot to `%LOCALAPPDATA%\WinCraft\snapshots\cosmic_baseline.json`:

```json
{
  "timestamp": 1729012345,
  "schema_version": 1,
  "taskbar": {
    "primary_visible": true,
    "autohide_enabled": false,
    "original_workarea": {
      "left": 0,
      "top": 0,
      "right": 1920,
      "bottom": 1040
    }
  },
  "cursors": {
    "scheme_name": "Windows Default",
    "arrow_path": "C:\\Windows\\Cursors\\aero_arrow.cur",
    "ibeam_path": "C:\\Windows\\Cursors\\aero_beam.cur"
  },
  "running_processes": [
    "explorer.exe"
  ]
}
```

### 7.2 Teardown & Reversion Sequence
Upon clicking **Revert to Stock Windows**:
1. **Kill Shell Child Processes:** Send `WM_CLOSE` (with 500ms fallback `SIGTERM`) to `glazewm.exe`, WinCraft Top Panel, Dock, and Modal Launcher.
2. **Unhide Windows Taskbar:** Call `ShowWindow(FindWindowW(w!("Shell_TrayWnd"), None), SW_SHOW)`.
3. **Restore Work Area:** Call `SystemParametersInfoW(SPI_SETWORKAREA, 0, &snapshot.original_workarea, SPIF_SENDCHANGE | SPIF_UPDATEINIFILE)`.
4. **Restore Cursors:** Call `SystemParametersInfoW(SPI_SETCURSORS, 0, NULL, SPIF_SENDCHANGE | SPIF_UPDATEINIFILE)`.
5. **Flush DWM:** Signal `WM_SETTINGCHANGE` to HWND_BROADCAST so all applications redraw window geometry to standard Windows 11 bounds.
6. **Integrity Validation:** Query `GetProcessById(explorer.exe)` to verify Explorer remains responsive.

---

## 8. Verification Matrix & Quality Gates

| Verification Criterion | Required Outcome | Pass / Fail Condition |
|---|---|---|
| **System File Integrity** | Zero modified system binaries in `C:\Windows\System32\` | `sfc /verifyonly` returns 100% clean |
| **Reversibility Speed** | Teardown from COSMIC to Stock Windows 11 completes in < 500ms | Clock benchmarked via high-precision timer |
| **Taskbar Restoration** | Windows Start menu, tray icons, and clock fully functional | Native Taskbar visible and responsive |
| **Color Accuracy** | Accent `#48B9C7`, background `#1B1B1B` verified against upstream | Digital color meter / pixel probe match |
| **Corner Radii** | Applets 8px, Modals 16px, Dock 160px pill | Pixel-perfect canvas rasterization match |
| **Tiling Keybindings** | Alt+Arrow focus, Alt+Shift+Arrow move, Alt+Y toggle | Event hook telemetry logs correct action |
| **Multi-Monitor Handling** | Top panel and wallpaper scale cleanly across monitors | Win32 `EnumDisplayMonitors` validation |

---

## 9. Conclusion & Implementation Roadmap

System76's COSMIC Desktop Environment achieves its distinction through mathematical consistency, intentional spacing, and keyboard responsiveness. By implementing this architecture on Windows 11 via non-destructive userland layered surfaces, WinCraft brings an authentic Pop!_OS COSMIC experience to Windows without risking system corruption, violating update guarantees, or patching DLLs.

**Next Immediate Steps:**
1. Provision the GlazeWM configuration inside `WinCraft/assets/skinpacks/cosmic/`.
2. Package the Pop cursor `.cur` and Fira Sans font bundle.
3. Wire the Tauri IPC commands (`apply_cosmic_skinpack`, `revert_cosmic_skinpack`) into the frontend Theme Studio.