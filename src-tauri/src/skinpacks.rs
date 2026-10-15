use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct SkinpackInfo {
    pub id: String,
    pub name: String,
    pub description: String,
    pub author: String,
    pub active: bool,
    pub preview_accent: String,
}

pub fn available_skinpacks() -> Vec<SkinpackInfo> {
    vec![
        SkinpackInfo {
            id: "cosmic".into(),
            name: "COSMIC Desktop Environment".into(),
            description: "System76 Pop!_OS desktop replica: 32px floating top panel, 48px auto-hiding dock, and #48B9C7 teal window borders.".into(),
            author: "System76 / WinCraft Engine".into(),
            active: false,
            preview_accent: "#48B9C7".into(),
        },
        SkinpackInfo {
            id: "macos_sequoia".into(),
            name: "macOS Sequoia".into(),
            description: "Apple Cupertino aesthetic: frosted glass top menu bar, centered floating dock with dynamic magnification, and San Francisco typography.".into(),
            author: "WinCraft UX".into(),
            active: false,
            preview_accent: "#007AFF".into(),
        },
        SkinpackInfo {
            id: "gnome_47".into(),
            name: "GNOME 47".into(),
            description: "Adwaita design system: unified dark top panel, dynamic activities overview button, and clean distraction-free workflow.".into(),
            author: "GNOME Project / WinCraft".into(),
            active: false,
            preview_accent: "#3584E4".into(),
        },
        SkinpackInfo {
            id: "kde_plasma_6".into(),
            name: "KDE Plasma 6 (Breeze)".into(),
            description: "Modern floating panel, comprehensive applet tray, breeze dark iconography, and customizable geometric accents.".into(),
            author: "KDE Community / WinCraft".into(),
            active: false,
            preview_accent: "#1D99F3".into(),
        },
        SkinpackInfo {
            id: "win10x".into(),
            name: "Windows 10X Modern".into(),
            description: "Microsoft's cancelled modular OS shell: centered taskbar cards, minimalist action center, and fluid fluent acrylic backdrops.".into(),
            author: "Microsoft Design / WinCraft".into(),
            active: false,
            preview_accent: "#0078D4".into(),
        },
    ]
}

#[cfg(windows)]
pub fn set_windows_taskbar_visible(visible: bool) -> Result<(), String> {
    use windows_sys::Win32::UI::WindowsAndMessaging::{
        FindWindowW, ShowWindow, SW_HIDE, SW_SHOW,
    };

    let show_cmd = if visible { SW_SHOW } else { SW_HIDE };

    unsafe {
        let primary_name: Vec<u16> = "Shell_TrayWnd\0".encode_utf16().collect();
        let primary_hwnd = FindWindowW(primary_name.as_ptr(), std::ptr::null());
        if !primary_hwnd.is_null() {
            ShowWindow(primary_hwnd, show_cmd);
        }

        let secondary_name: Vec<u16> = "Shell_SecondaryTrayWnd\0".encode_utf16().collect();
        let secondary_hwnd = FindWindowW(secondary_name.as_ptr(), std::ptr::null());
        if !secondary_hwnd.is_null() {
            ShowWindow(secondary_hwnd, show_cmd);
        }
    }
    Ok(())
}

#[cfg(not(windows))]
pub fn set_windows_taskbar_visible(_visible: bool) -> Result<(), String> {
    Ok(())
}

#[tauri::command(async)]
pub fn list_skinpacks() -> Result<Vec<SkinpackInfo>, String> {
    Ok(available_skinpacks())
}

#[tauri::command(async)]
pub fn apply_skinpack(id: String) -> Result<SkinpackInfo, String> {
    let packs = available_skinpacks();
    let pack = packs.into_iter().find(|p| p.id == id).ok_or_else(|| format!("Unknown skinpack: {id}"))?;
    set_windows_taskbar_visible(false)?;
    let mut active = pack;
    active.active = true;
    Ok(active)
}

#[tauri::command(async)]
pub fn rollback_skinpack() -> Result<(), String> {
    set_windows_taskbar_visible(true)?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn skinpacks_catalog_is_valid() {
        let packs = available_skinpacks();
        assert_eq!(packs.len(), 5);
        assert!(packs.iter().any(|p| p.id == "cosmic"));
        assert!(packs.iter().any(|p| p.id == "macos_sequoia"));
    }
}
