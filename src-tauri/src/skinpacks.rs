//! One real, user-space desktop transformation.
//!
//! Scope, stated here the same way it is stated to the user in all six
//! languages — because the previous version of this module hid the taskbar and
//! described itself as a desktop environment, which was not true:
//!
//! - It **re-themes the Windows shell**: light/dark mode, transparency, the
//!   accent colour on title bars and the taskbar, window border padding and the
//!   minimise animation. Those are real, visible changes.
//! - It does **not** install a desktop environment. COSMIC, GNOME, KDE and the
//!   macOS shell are separate programs. This app downloads and runs no
//!   third-party binaries and patches no system file — `uxtheme.dll` included.
//!   Anything claiming otherwise would be a lie dressed as a feature.
//! - Every value is read and recorded **before** it is written, under one
//!   rollback id, so the transformation appears in Change history with the
//!   values before and after and is undone again in one click.
//! - Per-user only (`HKCU`): no administrator prompt, no machine-wide write,
//!   nothing that a Windows update can revert into a broken state.
//!
//! One transformation ships. The rest of the catalog is deliberately absent
//! rather than advertised: a pack that does not exist cannot be applied.

use crate::rollback::{RegValue, RegistrySnapshot, RollbackStore, SnapshotEntry};
use crate::tweaks::Hive;
use serde::Serialize;

/// The rollback id this transformation's snapshot is stored under. It is the
/// key Change history and "restore all" use, so it must stay stable.
const SKINPACK_TWEAK_ID: &str = "skinpack_cosmic_dark";

/// The only transformation this build ships.
pub const SKINPACK_ID: &str = "cosmic_dark";

/// Accent `#48B9C7` exactly as the shell stores it in `AccentColor`:
/// `0xAABBGGRR`, fully opaque. Kept as a named constant so the test can prove
/// it still decodes to the documented teal.
const ACCENT_ABGR: u32 = 0xFFC7_B948;

/// The same colour for `ColorizationColor`, which is `0xAARRGGBB`.
const COLORIZATION_ARGB: u32 = 0xC448_B9C7;

#[derive(Clone, Copy)]
enum Spec {
    Dword(u32),
    Str(&'static str),
}

impl Spec {
    fn value(self) -> RegValue {
        match self {
            Spec::Dword(v) => RegValue::Dword(v),
            Spec::Str(v) => RegValue::Str(v.to_string()),
        }
    }
}

/// Every value the transformation writes, all per-user.
///
/// Each entry is a documented, shell-read value; nothing here is a
/// decorative no-op. Values that Windows 11 no longer honours (for example
/// `TaskbarGlomLevel`) are deliberately left out rather than written and
/// counted.
const WRITES: &[(&str, &str, Spec)] = &[
    // Dark surfaces.
    (
        r"Software\Microsoft\Windows\CurrentVersion\Themes\Personalize",
        "SystemUsesLightTheme",
        Spec::Dword(0),
    ),
    (
        r"Software\Microsoft\Windows\CurrentVersion\Themes\Personalize",
        "AppsUseLightTheme",
        Spec::Dword(0),
    ),
    // Flat, not acrylic: one translucent layer per window is the single most
    // expensive thing the compositor does while a browser is scrolling.
    (
        r"Software\Microsoft\Windows\CurrentVersion\Themes\Personalize",
        "EnableTransparency",
        Spec::Dword(0),
    ),
    // Accent colour on title bars and the taskbar.
    (
        r"Software\Microsoft\Windows\DWM",
        "ColorPrevalence",
        Spec::Dword(1),
    ),
    (
        r"Software\Microsoft\Windows\DWM",
        "AccentColor",
        Spec::Dword(ACCENT_ABGR),
    ),
    (
        r"Software\Microsoft\Windows\DWM",
        "ColorizationColor",
        Spec::Dword(COLORIZATION_ARGB),
    ),
    // No minimise/maximise animation.
    (r"Control Panel\Desktop", "MinAnimate", Spec::Str("0")),
    // Flat window borders: the customisation that actually reads as a
    // different desktop at a glance.
    (
        r"Control Panel\Desktop\WindowMetrics",
        "PaddedBorderWidth",
        Spec::Str("0"),
    ),
    // Taskbar at the left, which is where a COSMIC-style panel puts it.
    (
        r"Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced",
        "TaskbarAl",
        Spec::Dword(0),
    ),
];

/// What the panel needs to render. The name, description and scope text are
/// not sent from here: they are user-facing copy and live in the translation
/// tables with every other user-facing string.
#[derive(Serialize, Clone, Debug, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct SkinpackStatus {
    pub id: String,
    /// True while this transformation's snapshot is held in the rollback
    /// store — that is, applied and undoable.
    pub active: bool,
    pub value_count: usize,
}

fn status(store: &RollbackStore) -> Result<SkinpackStatus, String> {
    Ok(SkinpackStatus {
        id: SKINPACK_ID.to_string(),
        active: store.is_applied_checked(SKINPACK_TWEAK_ID)?,
        value_count: WRITES.len(),
    })
}

#[cfg(windows)]
fn apply_inner(store: &RollbackStore) -> Result<(), String> {
    use crate::tweaks::windows_impl::{read_value, write_value};

    // Record every original first, then write. If any read fails nothing is
    // written and nothing is saved; if any write fails the snapshot stays and
    // the caller reports it, exactly as the other control appliers do.
    let mut transaction = store.transaction()?;
    let mut entries = Vec::new();
    for (path, name, spec) in WRITES {
        let original =
            read_value(Hive::Hkcu, path, name, &spec.value()).map_err(|e| e.to_string())?;
        entries.push(SnapshotEntry::Registry(RegistrySnapshot {
            hive: "HKCU".to_string(),
            path: (*path).to_string(),
            name: (*name).to_string(),
            original_value: original,
        }));
    }
    transaction.save_entry(SKINPACK_TWEAK_ID, SnapshotEntry::Composite { entries })?;

    for (path, name, spec) in WRITES {
        write_value(Hive::Hkcu, path, name, &spec.value())?;
    }
    notify_shell_of_theme_change();
    Ok(())
}

#[cfg(windows)]
fn rollback_inner(store: &RollbackStore) -> Result<(), String> {
    use crate::tweaks::windows_impl::restore_value;

    store.restore_entry(SKINPACK_TWEAK_ID, |entry| {
        let SnapshotEntry::Composite { entries } = entry else {
            return Err("unexpected snapshot type for this transformation".to_string());
        };
        // Every value gets its turn even if an earlier one fails, so one
        // refused key cannot strand the rest of the desktop in the theme.
        let mut first_error = None;
        for e in entries {
            if let SnapshotEntry::Registry(snapshot) = e {
                if let Err(error) = restore_value(&snapshot) {
                    first_error.get_or_insert(error);
                }
            }
        }
        first_error.map_or(Ok(()), Err)
    })?;
    notify_shell_of_theme_change();
    Ok(())
}

/// Asks the shell to re-read its colours, so the change is visible without a
/// sign-out. Best effort by design: a window that does not answer is skipped
/// after 200 ms rather than blocking the apply.
///
/// This is the only place in the skinpack module that defers verification to
/// the live Windows shell. The values are all already written at this point,
/// the rollback stub is in place, and the only thing that can go wrong here is
/// a window that does not answer in time — in which case the theme change still
/// happened, the shell just does not repaint yet. Skipping such a window cannot
/// fail the apply, and treating it as one would be wrong: the request was sent.
#[cfg(windows)]
fn notify_shell_of_theme_change() {
    use windows_sys::Win32::UI::WindowsAndMessaging::{
        SendMessageTimeoutW, HWND_BROADCAST, SMTO_ABORTIFHUNG, WM_SETTINGCHANGE,
    };

    let payload: Vec<u16> = "ImmersiveColorSet\0".encode_utf16().collect();
    let mut result: usize = 0;
    // SAFETY: `HWND_BROADCAST` is a documented pseudo-handle that takes no
    // ownership; the payload is a NUL-terminated UTF-16 string whose lifetime
    // spans the call. The mutable `result` out-pointer is valid for the
    // duration of this synchronous call and is never read or aliased across
    // threads while it is live. `SendMessageTimeoutW` returns after it is
    // done, and no caller-visible state depends on the specific value the
    // interested windows put there.
    unsafe {
        SendMessageTimeoutW(
            HWND_BROADCAST,
            WM_SETTINGCHANGE,
            0,
            payload.as_ptr() as isize,
            SMTO_ABORTIFHUNG,
            200,
            &mut result,
        );
    }
}

#[cfg(not(windows))]
fn notify_shell_of_theme_change() {}
#[cfg(not(windows))]
fn apply_inner(_store: &RollbackStore) -> Result<(), String> {
    Err("not supported on this platform".to_string())
}

#[cfg(not(windows))]
fn rollback_inner(_store: &RollbackStore) -> Result<(), String> {
    Err("not supported on this platform".to_string())
}

#[tauri::command(async)]
pub fn list_skinpacks(app: tauri::AppHandle) -> Result<Vec<SkinpackStatus>, String> {
    let store = crate::store_for(&app)?;
    Ok(vec![status(&store)?])
}

#[tauri::command(async)]
pub fn apply_skinpack(app: tauri::AppHandle, id: String) -> Result<SkinpackStatus, String> {
    if id != SKINPACK_ID {
        return Err(format!("unknown display transformation: {id}"));
    }
    let store = crate::store_for(&app)?;
    apply_inner(&store)?;
    status(&store)
}

#[tauri::command(async)]
pub fn rollback_skinpack(app: tauri::AppHandle) -> Result<(), String> {
    let store = crate::store_for(&app)?;
    // Only undo what this module applied. A snapshot belonging to something
    // else must never be discarded here.
    if !store.is_applied_checked(SKINPACK_TWEAK_ID)? {
        return Ok(());
    }
    rollback_inner(&store)
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::collections::HashSet;

    #[test]
    fn every_value_is_a_distinct_documented_target() {
        let mut seen = HashSet::new();
        for (path, name, _) in WRITES {
            assert!(!path.is_empty(), "empty registry path");
            assert!(!name.is_empty(), "empty value name");
            assert!(
                seen.insert((*path, *name)),
                "duplicate target: {path}\\{name}"
            );
        }
    }

    #[test]
    fn the_transformation_covers_more_than_one_shell_surface() {
        // A "desktop transformation" that touched one key would be a toggle,
        // not a transformation. This pins that the set is genuinely broad.
        assert!(WRITES.len() >= 8, "too few values to be a transformation");
        for surface in [
            r"Software\Microsoft\Windows\CurrentVersion\Themes\Personalize",
            r"Software\Microsoft\Windows\DWM",
            r"Control Panel\Desktop",
            r"Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced",
        ] {
            assert!(
                WRITES.iter().any(|(path, _, _)| *path == surface),
                "transformation does not touch {surface}"
            );
        }
    }

    #[test]
    fn the_accent_colour_still_decodes_to_the_documented_teal() {
        // AccentColor is 0xAABBGGRR: alpha, blue, green, red.
        assert_eq!(ACCENT_ABGR >> 24, 0xFF, "accent must be opaque");
        assert_eq!(ACCENT_ABGR & 0xFF, 0x48, "red channel");
        assert_eq!((ACCENT_ABGR >> 8) & 0xFF, 0xB9, "green channel");
        assert_eq!((ACCENT_ABGR >> 16) & 0xFF, 0xC7, "blue channel");
        // ColorizationColor is 0xAARRGGBB, so the same colour reads the other
        // way round. Getting one of the two wrong is a visibly wrong desktop.
        assert_eq!(COLORIZATION_ARGB & 0xFF, 0xC7, "blue channel");
        assert_eq!((COLORIZATION_ARGB >> 8) & 0xFF, 0xB9, "green channel");
        assert_eq!((COLORIZATION_ARGB >> 16) & 0xFF, 0x48, "red channel");
    }

    #[test]
    fn string_values_are_canonical_decimals_the_shell_can_parse() {
        for (path, name, spec) in WRITES {
            if let Spec::Str(text) = spec {
                assert!(
                    text.parse::<u32>().is_ok(),
                    "{path}\\{name} is not a decimal value the shell parses: {text}"
                );
            }
        }
    }

    #[test]
    fn the_rollback_id_is_stable_and_namespaced() {
        // Change history and "restore all" key off this string; renaming it
        // would orphan every applied transformation.
        assert_eq!(SKINPACK_TWEAK_ID, "skinpack_cosmic_dark");
        assert!(SKINPACK_TWEAK_ID.starts_with("skinpack_"));
        assert_eq!(SKINPACK_ID, "cosmic_dark");
    }
}
