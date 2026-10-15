//! Tweaks made of several registry values that belong together: a Windows
//! setting or policy that only does what it says when all of its values are
//! written, and is only honest to undo when all of them are put back.
//!
//! Each one is declared once, as data, and everything else is derived from
//! that declaration: the snapshot shape, its validation, the technical
//! disclosure, the dry-run preview, "is it still in effect", and the Windows
//! builds and editions it supports. A tweak never mixes hives, so a user-level
//! setting is never written from an administrator's elevated helper.
//!
//! Every value here is a REG_DWORD. Sources: Microsoft's Policy CSP and Edge
//! policy reference for the policies, and the value Windows itself writes for
//! the Settings switches.

use crate::rollback::{RegValue, RegistrySnapshot, RollbackStore, SnapshotEntry};
use crate::tweaks::{Category, Hive};

pub struct Write {
    pub path: &'static str,
    pub name: &'static str,
    pub value: RegValue,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Edition {
    Any,
    /// Pro, Enterprise or Education (and their IoT/Workstation variants):
    /// the editions Microsoft documents the policy for. Home is refused.
    ProOrHigher,
    /// Enterprise or Education (and their IoT, LTSC and SE variants): for a
    /// policy Microsoft lists for Pro that Start is reported to ignore there.
    EnterpriseOrEducation,
}

pub struct SettingsTweak {
    pub id: &'static str,
    pub name: &'static str,
    pub description: &'static str,
    pub category: Category,
    pub hive: Hive,
    pub writes: &'static [Write],
    pub requires_pro: bool,
    /// The first Windows build the setting exists on; 0 for any.
    pub min_build: u32,
    pub edition: Edition,
    /// Phase 0 plumbing: see `RegistryTweak`. Uncalibrated until per-area
    /// follow-ups; nothing renders these yet.
    pub evidence: crate::tweaks::Evidence,
    pub effect: crate::tweaks::Effect,
    pub risk: Option<&'static str>,
    pub group: Option<&'static str>,
}

impl SettingsTweak {
    /// An HKLM value always needs an administrator; an HKCU one never does.
    pub fn requires_admin(&self) -> bool {
        self.hive == Hive::Hklm
    }

    fn hive_name(&self) -> &'static str {
        match self.hive {
            Hive::Hkcu => "HKCU",
            Hive::Hklm => "HKLM",
        }
    }
}

const ADVANCED: &str = r"SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced";
const CDM: &str = r"SOFTWARE\Microsoft\Windows\CurrentVersion\ContentDeliveryManager";
const EDGE: &str = r"SOFTWARE\Policies\Microsoft\Edge";
const PAINT: &str = r"SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Paint";

/// Windows 11 builds the catalogue refers to.
pub const BUILD_WIN11: u32 = 22000;
pub const BUILD_22H2: u32 = 22621;
pub const BUILD_23H2: u32 = 22631;
pub const BUILD_24H2: u32 = 26100;

pub static TWEAKS: [SettingsTweak; 14] = [
    SettingsTweak {
        id: "disable_click_to_do",
        name: "Turn off Click to Do",
        description: "Sets the Windows policy that removes Click to Do, the feature that takes a screenshot of your screen and analyzes it to suggest actions. Its entry points disappear for every account on this PC. Settings will show it as managed by your organization, which is how Windows labels policies. It has an effect only on PCs where Windows offers Click to Do.",
        category: Category::Privacy,
        hive: Hive::Hklm,
        writes: &[Write { path: r"SOFTWARE\Policies\Microsoft\Windows\WindowsAI", name: "DisableClickToDo", value: RegValue::Dword(1) }],
        requires_pro: false,
        // Microsoft's Policy CSP still lists this policy for Insider builds
        // only, so no Windows version is claimed; the policy is inert where
        // Click to Do does not exist.
        min_build: 0,
        edition: Edition::ProOrHigher,
        evidence: crate::tweaks::Evidence::Measured,
        effect: crate::tweaks::Effect::SignOut,
        risk: None,
        group: Some("content"),
    },
    SettingsTweak {
        id: "disable_edge_ai",
        name: "Turn off AI features in Microsoft Edge",
        // Which profiles each policy reaches is from Microsoft's Edge policy
        // reference ("Applies to a profile that is signed in with a Microsoft
        // account"): only GenAILocalFoundationalModelSettings says yes, and
        // CopilotPageContext and ComposeInlineEnabled are Entra ID only.
        description: "Sets Microsoft Edge policies for its AI features. Which ones take effect depends on the Edge profile: stopping Edge from downloading its on-device AI model works for every profile; hiding the sidebar and turning off AI history search and AI-generated themes work for profiles not signed in with a personal Microsoft account; turning off Copilot's access to page content and its writing help works only for work or school profiles. Edge picks them up without a restart; edge://policy lists them. Edge will show that it is managed by your organization, which is how it labels policies.",
        category: Category::Privacy,
        hive: Hive::Hklm,
        writes: &[
            Write { path: EDGE, name: "HubsSidebarEnabled", value: RegValue::Dword(0) },
            Write { path: EDGE, name: "GenAILocalFoundationalModelSettings", value: RegValue::Dword(1) },
            Write { path: EDGE, name: "EdgeHistoryAISearchEnabled", value: RegValue::Dword(0) },
            Write { path: EDGE, name: "AIGenThemesEnabled", value: RegValue::Dword(0) },
            Write { path: EDGE, name: "CopilotPageContext", value: RegValue::Dword(0) },
            Write { path: EDGE, name: "ComposeInlineEnabled", value: RegValue::Dword(0) },
        ],
        requires_pro: false,
        min_build: 0,
        edition: Edition::Any,
        evidence: crate::tweaks::Evidence::Measured,
        effect: crate::tweaks::Effect::Immediate,
        risk: None,
        group: Some("content"),
    },
    SettingsTweak {
        id: "disable_paint_ai",
        name: "Turn off AI features in Paint",
        description: "Sets the Windows policies that turn off Cocreator, Image Creator and generative fill in Paint. Everything else in Paint works as before.",
        category: Category::Privacy,
        hive: Hive::Hklm,
        writes: &[
            Write { path: PAINT, name: "DisableCocreator", value: RegValue::Dword(1) },
            Write { path: PAINT, name: "DisableImageCreator", value: RegValue::Dword(1) },
            Write { path: PAINT, name: "DisableGenerativeFill", value: RegValue::Dword(1) },
        ],
        requires_pro: false,
        min_build: BUILD_22H2,
        edition: Edition::ProOrHigher,
        evidence: crate::tweaks::Evidence::Measured,
        effect: crate::tweaks::Effect::Immediate,
        risk: None,
        group: Some("content"),
    },
    SettingsTweak {
        id: "disable_notepad_ai",
        name: "Turn off AI features in Notepad",
        description: "Sets the Notepad policy that turns off its Copilot writing tools (rewrite, summarize, write). Close and reopen Notepad to see the change.",
        category: Category::Privacy,
        hive: Hive::Hklm,
        writes: &[Write { path: r"SOFTWARE\Policies\WindowsNotepad", name: "DisableAIFeatures", value: RegValue::Dword(1) }],
        requires_pro: false,
        min_build: BUILD_22H2,
        edition: Edition::Any,
        evidence: crate::tweaks::Evidence::Measured,
        effect: crate::tweaks::Effect::Immediate,
        risk: None,
        group: Some("content"),
    },
    SettingsTweak {
        id: "disable_fast_startup",
        name: "Turn off Fast Startup",
        description: "Makes Shut down a real shutdown instead of a partial hibernation. Windows starts a few seconds slower from cold, but drivers and updates load fresh every time, and dual-boot setups no longer find the Windows drive locked.",
        category: Category::Maintenance,
        hive: Hive::Hklm,
        writes: &[Write { path: r"SYSTEM\CurrentControlSet\Control\Session Manager\Power", name: "HiberbootEnabled", value: RegValue::Dword(0) }],
        requires_pro: false,
        min_build: 0,
        edition: Edition::Any,
        evidence: crate::tweaks::Evidence::Modest,
        effect: crate::tweaks::Effect::Reboot,
        risk: None,
        group: Some("maintenance"),
    },
    SettingsTweak {
        id: "disable_storage_sense",
        name: "Turn off Storage Sense",
        description: "Stops Windows from deleting temporary files, emptying the Recycle Bin and moving OneDrive files online on its own schedule. You decide what gets cleaned and when.",
        category: Category::Maintenance,
        hive: Hive::Hkcu,
        writes: &[Write { path: r"SOFTWARE\Microsoft\Windows\CurrentVersion\StorageSense\Parameters\StoragePolicy", name: "01", value: RegValue::Dword(0) }],
        requires_pro: false,
        min_build: 0,
        edition: Edition::Any,
        evidence: crate::tweaks::Evidence::Modest,
        effect: crate::tweaks::Effect::Immediate,
        risk: None,
        group: Some("maintenance"),
    },
    SettingsTweak {
        id: "taskbar_end_task",
        name: "Add End task to the taskbar",
        description: "Adds End task to the right-click menu of apps on the taskbar, so a frozen app can be closed without opening Task Manager.",
        category: Category::Ui,
        hive: Hive::Hkcu,
        writes: &[Write { path: r"SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced\TaskbarDeveloperSettings", name: "TaskbarEndTask", value: RegValue::Dword(1) }],
        requires_pro: false,
        min_build: BUILD_23H2,
        edition: Edition::Any,
        evidence: crate::tweaks::Evidence::Measured,
        effect: crate::tweaks::Effect::Restart,
        risk: None,
        group: Some("taskbar"),
    },
    SettingsTweak {
        id: "disable_drag_tray",
        name: "Turn off the drag tray",
        description: "Stops the sharing tray (called Drop tray on newer builds) from sliding down from the top of the screen every time you drag a file, so ordinary drag and drop works without it getting in the way. The value comes from Windows community documentation, not from Microsoft; recent Windows 11 updates also offer this switch in Settings.",
        category: Category::Ui,
        hive: Hive::Hkcu,
        writes: &[Write { path: r"SOFTWARE\Microsoft\Windows\CurrentVersion\CDP", name: "DragTrayEnabled", value: RegValue::Dword(0) }],
        requires_pro: false,
        min_build: BUILD_24H2,
        edition: Edition::Any,
        evidence: crate::tweaks::Evidence::Measured,
        effect: crate::tweaks::Effect::Restart,
        risk: None,
        group: Some("explorer"),
    },
    SettingsTweak {
        id: "explorer_open_this_pc",
        name: "Open File Explorer to This PC",
        description: "File Explorer opens on This PC, with your drives and folders, instead of Home and its recent files.",
        category: Category::Ui,
        hive: Hive::Hkcu,
        writes: &[Write { path: ADVANCED, name: "LaunchTo", value: RegValue::Dword(1) }],
        requires_pro: false,
        min_build: 0,
        edition: Edition::Any,
        evidence: crate::tweaks::Evidence::Neutral,
        effect: crate::tweaks::Effect::Immediate,
        risk: None,
        group: Some("explorer"),
    },
    SettingsTweak {
        id: "block_oem_device_apps",
        name: "Stop device makers' apps from installing themselves",
        description: "Stops Windows from downloading manufacturers' apps and custom icons for the devices you plug in, which is how some mouse, keyboard and motherboard utilities arrive without being asked for. Drivers still install as usual.",
        category: Category::Maintenance,
        hive: Hive::Hklm,
        writes: &[Write { path: r"SOFTWARE\Microsoft\Windows\CurrentVersion\Device Metadata", name: "PreventDeviceMetadataFromNetwork", value: RegValue::Dword(1) }],
        requires_pro: false,
        min_build: 0,
        edition: Edition::Any,
        evidence: crate::tweaks::Evidence::Modest,
        effect: crate::tweaks::Effect::Immediate,
        risk: None,
        group: Some("maintenance"),
    },
    SettingsTweak {
        id: "disable_windows_suggestions",
        name: "Turn off Windows tips and suggestions",
        description: "One switch for the prompts Windows adds on its own: tips and suggestions, the welcome screen after updates, suggestions in Settings, \"finish setting up your device\", suggested notifications, Start menu recommendations and account notices, and sync provider ads in File Explorer. These are the values Windows' own Settings switches write, as documented by the Windows community; Microsoft does not document them, so a Windows update can change them.",
        category: Category::Privacy,
        hive: Hive::Hkcu,
        writes: &[
            Write { path: CDM, name: "SubscribedContent-338389Enabled", value: RegValue::Dword(0) },
            Write { path: CDM, name: "SubscribedContent-310093Enabled", value: RegValue::Dword(0) },
            Write { path: CDM, name: "SubscribedContent-353694Enabled", value: RegValue::Dword(0) },
            Write { path: CDM, name: "SubscribedContent-353696Enabled", value: RegValue::Dword(0) },
            Write { path: CDM, name: "SoftLandingEnabled", value: RegValue::Dword(0) },
            Write { path: r"SOFTWARE\Microsoft\Windows\CurrentVersion\UserProfileEngagement", name: "ScoobeSystemSettingEnabled", value: RegValue::Dword(0) },
            Write { path: r"SOFTWARE\Microsoft\Windows\CurrentVersion\Notifications\Settings\Windows.SystemToast.Suggested", name: "Enabled", value: RegValue::Dword(0) },
            Write { path: ADVANCED, name: "ShowSyncProviderNotifications", value: RegValue::Dword(0) },
            Write { path: ADVANCED, name: "Start_IrisRecommendations", value: RegValue::Dword(0) },
            Write { path: ADVANCED, name: "Start_AccountNotifications", value: RegValue::Dword(0) },
        ],
        requires_pro: false,
        min_build: 0,
        edition: Edition::Any,
        evidence: crate::tweaks::Evidence::Measured,
        effect: crate::tweaks::Effect::Restart,
        risk: None,
        group: Some("content"),
    },
    SettingsTweak {
        id: "disable_widgets",
        name: "Turn off Widgets entirely",
        description: "Sets the Windows policy that turns off the Widgets board itself, not just its taskbar button, so its news feed stops loading in the background. Settings will show it as managed by your organization, which is how Windows labels policies.",
        category: Category::Ui,
        hive: Hive::Hklm,
        writes: &[Write { path: r"SOFTWARE\Policies\Microsoft\Dsh", name: "AllowNewsAndInterests", value: RegValue::Dword(0) }],
        requires_pro: false,
        min_build: BUILD_WIN11,
        edition: Edition::ProOrHigher,
        evidence: crate::tweaks::Evidence::Measured,
        effect: crate::tweaks::Effect::Restart,
        risk: None,
        group: Some("taskbar"),
    },
    SettingsTweak {
        id: "hide_start_recommended",
        name: "Remove Recommended from the Start menu",
        description: "Sets the Windows policy that removes the Recommended section from Start, giving your pinned apps the space to themselves. Settings will show it as managed by your organization, which is how Windows labels policies.",
        category: Category::Ui,
        hive: Hive::Hklm,
        writes: &[Write { path: r"SOFTWARE\Policies\Microsoft\Windows\Explorer", name: "HideRecommendedSection", value: RegValue::Dword(1) }],
        requires_pro: false,
        min_build: BUILD_22H2,
        edition: Edition::EnterpriseOrEducation,
        evidence: crate::tweaks::Evidence::Measured,
        effect: crate::tweaks::Effect::Restart,
        risk: None,
        group: Some("explorer"),
    },
    SettingsTweak {
        id: "disable_game_bar_captures",
        name: "Turn off Game Bar captures",
        description: "Turns off Game Bar's capture feature and its background recording, which keeps a rolling video of your last few minutes of play. Complements the Game Bar / Game DVR switch.",
        category: Category::Gaming,
        hive: Hive::Hkcu,
        writes: &[
            Write { path: r"SOFTWARE\Microsoft\Windows\CurrentVersion\GameDVR", name: "AppCaptureEnabled", value: RegValue::Dword(0) },
            Write { path: r"SOFTWARE\Microsoft\Windows\CurrentVersion\GameDVR", name: "HistoricalCaptureEnabled", value: RegValue::Dword(0) },
        ],
        requires_pro: false,
        min_build: 0,
        edition: Edition::Any,
        evidence: crate::tweaks::Evidence::Measured,
        effect: crate::tweaks::Effect::SignOut,
        risk: None,
        group: Some("gaming"),
    },
];

pub fn find(id: &str) -> Option<&'static SettingsTweak> {
    TWEAKS.iter().find(|t| t.id == id)
}

/// Why a tweak cannot be applied on this PC. The code is what the frontend
/// translates; the text is the English fallback.
///
/// The variants read as `Version`/`Edition` rather than `WindowsVersion`/
/// `WindowsEdition` because the enum is already named `Unavailable` and every
/// variant is a Windows check by definition. The `code()` strings are the wire
/// format the frontend's `types.ts` matches on and are deliberately unchanged.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Unavailable {
    Version,
    Edition,
    EditionEnterprise,
}

impl Unavailable {
    pub fn code(self) -> &'static str {
        match self {
            Unavailable::Version => "windows_version",
            Unavailable::Edition => "windows_edition",
            Unavailable::EditionEnterprise => "windows_edition_enterprise",
        }
    }

    pub fn message(self) -> &'static str {
        match self {
            Unavailable::Version => "This setting needs a newer version of Windows.",
            Unavailable::Edition => "This setting needs Windows Pro, Enterprise or Education.",
            Unavailable::EditionEnterprise => "This setting needs Windows Enterprise or Education.",
        }
    }
}

/// Home editions report an EditionID beginning with "Core" (Core,
/// CoreSingleLanguage, CoreCountrySpecific, CoreN).
fn is_home_edition(edition_id: &str) -> bool {
    edition_id.to_ascii_lowercase().starts_with("core")
}

/// Enterprise (EnterpriseN, EnterpriseS for LTSC, IoTEnterprise, ServerRdsh
/// for multi-session), Education (EducationN, ProfessionalEducation) and
/// Windows 11 SE (CloudEdition).
fn is_enterprise_or_education(edition_id: &str) -> bool {
    let id = edition_id.to_ascii_lowercase();
    [
        "enterprise",
        "education",
        "iotenterprise",
        "serverrdsh",
        "cloudedition",
    ]
    .iter()
    .any(|family| id.starts_with(family))
        || id.starts_with("professionaleducation")
}

/// Pure: whether `tweak` fits a machine with this build and edition. Unknown
/// facts do not block, so a read failure never strands a supported machine.
pub fn availability(
    tweak: &SettingsTweak,
    build: Option<u32>,
    edition_id: Option<&str>,
) -> Result<(), Unavailable> {
    if build.is_some_and(|b| b < tweak.min_build) {
        return Err(Unavailable::Version);
    }
    if tweak.edition == Edition::ProOrHigher && edition_id.is_some_and(is_home_edition) {
        return Err(Unavailable::Edition);
    }
    if tweak.edition == Edition::EnterpriseOrEducation
        && edition_id.is_some_and(|id| !is_enterprise_or_education(id))
    {
        return Err(Unavailable::EditionEnterprise);
    }
    Ok(())
}

const VERSION_KEY: &str = r"SOFTWARE\Microsoft\Windows NT\CurrentVersion";

/// This machine's build and edition, read through the same registry seam the
/// tweaks use (so unit tests see the in-memory registry, not the host).
#[cfg(windows)]
pub fn machine() -> (Option<u32>, Option<String>) {
    use crate::tweaks::windows_impl::read_value;
    let text =
        |name: &str| match read_value(Hive::Hklm, VERSION_KEY, name, &RegValue::Str(String::new()))
        {
            Ok(Some(RegValue::Str(s))) => Some(s),
            _ => None,
        };
    (
        text("CurrentBuild").and_then(|b| b.trim().parse().ok()),
        text("EditionID"),
    )
}

#[cfg(windows)]
pub fn available_here(tweak: &SettingsTweak) -> Result<(), Unavailable> {
    let (build, edition) = machine();
    availability(tweak, build, edition.as_deref())
}

/// Every value written as the tweak defines it.
#[cfg(windows)]
pub fn in_effect(tweak: &SettingsTweak) -> Option<bool> {
    use crate::tweaks::windows_impl::read_value;
    let mut all = true;
    for w in tweak.writes {
        match read_value(tweak.hive, w.path, w.name, &w.value) {
            Ok(Some(v)) => all &= v == w.value,
            Ok(_) => all = false,
            Err(_) => return None,
        }
    }
    Some(all)
}

/// Snapshots every value, then writes them. Checks the build and edition
/// first; nothing is saved or written on a machine the setting does not fit.
#[cfg(windows)]
pub fn apply(store: &RollbackStore, tweak: &SettingsTweak) -> Result<(), String> {
    available_here(tweak).map_err(|why| why.message().to_string())?;
    apply_writes(store, tweak)
}

#[cfg(windows)]
pub(crate) fn apply_writes(store: &RollbackStore, tweak: &SettingsTweak) -> Result<(), String> {
    use crate::tweaks::windows_impl::{read_value, write_value};
    let mut transaction = store.transaction()?;
    let mut entries = Vec::new();
    for w in tweak.writes {
        let original =
            read_value(tweak.hive, w.path, w.name, &w.value).map_err(|e| e.to_string())?;
        entries.push(SnapshotEntry::Registry(RegistrySnapshot {
            hive: tweak.hive_name().to_string(),
            path: w.path.to_string(),
            name: w.name.to_string(),
            original_value: original,
        }));
    }
    transaction.save_entry(tweak.id, SnapshotEntry::Composite { entries })?;
    for w in tweak.writes {
        write_value(tweak.hive, w.path, w.name, &w.value)?;
    }
    Ok(())
}

/// Puts every value back. Each one gets its turn even if an earlier one
/// fails; the journal is kept until all of them succeed.
#[cfg(windows)]
pub fn rollback(store: &RollbackStore, tweak: &SettingsTweak) -> Result<(), String> {
    use crate::tweaks::windows_impl::restore_value;
    store.restore_entry(tweak.id, |entry| {
        let SnapshotEntry::Composite { entries } = entry else {
            return Err("unexpected snapshot type for this setting".to_string());
        };
        let mut first_error = None;
        for e in entries {
            if let SnapshotEntry::Registry(snapshot) = e {
                if let Err(error) = restore_value(&snapshot) {
                    first_error.get_or_insert(error);
                }
            }
        }
        first_error.map_or(Ok(()), Err)
    })
}

#[cfg(not(windows))]
pub fn apply(_store: &RollbackStore, _tweak: &SettingsTweak) -> Result<(), String> {
    Err("not supported on this platform".to_string())
}

#[cfg(not(windows))]
pub fn rollback(_store: &RollbackStore, _tweak: &SettingsTweak) -> Result<(), String> {
    Err("not supported on this platform".to_string())
}

/// A snapshot is accepted only if it covers exactly this tweak's values, each
/// once, in its own hive. Snapshot files are user-writable input.
pub fn valid_snapshot(tweak: &SettingsTweak, entry: &SnapshotEntry) -> bool {
    let SnapshotEntry::Composite { entries } = entry else {
        return false;
    };
    entries.len() == tweak.writes.len()
        && tweak.writes.iter().all(|w| {
            entries
                .iter()
                .filter(|e| {
                    matches!(e, SnapshotEntry::Registry(s)
                        if s.hive.eq_ignore_ascii_case(tweak.hive_name())
                            && s.path.eq_ignore_ascii_case(w.path)
                            && s.name.eq_ignore_ascii_case(w.name))
                })
                .count()
                == 1
        })
}

/// What the tweak writes, for the technical disclosure and the preview.
pub fn changes(tweak: &SettingsTweak) -> Vec<crate::technical::TechnicalChange> {
    tweak
        .writes
        .iter()
        .map(|w| crate::technical::TechnicalChange::Registry {
            path: format!("{}\\{}", tweak.hive_name(), w.path),
            value_name: w.name.to_string(),
            value_type: crate::reg_value_type(&w.value),
            sets_to: crate::reg_value_display(&w.value),
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::collections::HashSet;

    #[test]
    fn ids_are_unique_and_new_to_the_catalogue() {
        let mut seen = HashSet::new();
        for t in &TWEAKS {
            assert!(seen.insert(t.id), "{} declared twice", t.id);
            assert!(
                crate::tweaks::find_tweak(t.id).is_none(),
                "{} clashes with a registry tweak",
                t.id
            );
            assert!(!t.writes.is_empty(), "{}", t.id);
            assert!(!t.description.is_empty() && !t.name.is_empty());
        }
    }

    #[test]
    fn no_value_is_written_twice_or_by_another_tweak() {
        let mut targets = HashSet::new();
        for t in &TWEAKS {
            for w in t.writes {
                assert!(
                    targets.insert((
                        t.hive_name(),
                        w.path.to_ascii_lowercase(),
                        w.name.to_ascii_lowercase()
                    )),
                    "{}: {} written twice",
                    t.id,
                    w.name
                );
            }
        }
        for t in crate::tweaks::all_tweaks() {
            let hive = match t.hive {
                Hive::Hkcu => "HKCU",
                Hive::Hklm => "HKLM",
            };
            assert!(
                !targets.contains(&(
                    hive,
                    t.key_path.to_ascii_lowercase(),
                    t.value_name.to_ascii_lowercase()
                )),
                "{} overlaps a settings tweak",
                t.id
            );
        }
    }

    #[test]
    fn builds_and_editions_are_checked_and_unknowns_do_not_block() {
        let click = find("disable_click_to_do").unwrap();
        assert_eq!(
            availability(
                find("disable_drag_tray").unwrap(),
                Some(22631),
                Some("Professional")
            ),
            Err(Unavailable::Version)
        );
        assert_eq!(
            availability(click, Some(22631), Some("Professional")),
            Ok(()),
            "no Windows version is claimed for Click to Do"
        );
        assert_eq!(
            availability(click, Some(26100), Some("Core")),
            Err(Unavailable::Edition)
        );
        assert_eq!(
            availability(click, Some(26100), Some("CoreSingleLanguage")),
            Err(Unavailable::Edition)
        );
        assert_eq!(
            availability(click, Some(26200), Some("Professional")),
            Ok(())
        );
        assert_eq!(availability(click, Some(26200), Some("Enterprise")), Ok(()));
        assert_eq!(availability(click, None, None), Ok(()));
        let start = find("hide_start_recommended").unwrap();
        for id in ["Professional", "ProfessionalWorkstation", "Core"] {
            assert_eq!(
                availability(start, Some(26100), Some(id)),
                Err(Unavailable::EditionEnterprise),
                "{id}"
            );
        }
        for id in [
            "Enterprise",
            "EnterpriseS",
            "Education",
            "ProfessionalEducation",
            "IoTEnterprise",
            "ServerRdsh",
            "CloudEdition",
        ] {
            assert_eq!(availability(start, Some(26100), Some(id)), Ok(()), "{id}");
        }
        assert_eq!(
            availability(start, Some(26100), None),
            Ok(()),
            "unknown edition does not block"
        );
        assert_eq!(
            availability(start, Some(19045), Some("Enterprise")),
            Err(Unavailable::Version)
        );
        let explorer = find("explorer_open_this_pc").unwrap();
        assert_eq!(availability(explorer, Some(19045), Some("Core")), Ok(()));
        assert_eq!(
            availability(find("taskbar_end_task").unwrap(), Some(22621), Some("Core")),
            Err(Unavailable::Version)
        );
    }

    #[test]
    fn snapshots_must_cover_exactly_the_declared_values() {
        let t = find("disable_paint_ai").unwrap();
        let snap = |names: &[&str], hive: &str| SnapshotEntry::Composite {
            entries: names
                .iter()
                .map(|n| {
                    SnapshotEntry::Registry(RegistrySnapshot {
                        hive: hive.into(),
                        path: PAINT.into(),
                        name: (*n).into(),
                        original_value: None,
                    })
                })
                .collect(),
        };
        let all = [
            "DisableCocreator",
            "DisableImageCreator",
            "DisableGenerativeFill",
        ];
        assert!(valid_snapshot(t, &snap(&all, "HKLM")));
        assert!(!valid_snapshot(t, &snap(&all, "HKCU")), "wrong hive");
        assert!(
            !valid_snapshot(t, &snap(&all[..2], "HKLM")),
            "missing value"
        );
        assert!(!valid_snapshot(
            t,
            &snap(
                &[
                    "DisableCocreator",
                    "DisableCocreator",
                    "DisableGenerativeFill"
                ],
                "HKLM"
            )
        ));
        assert!(crate::rollback::validate_snapshot(t.id, &snap(&all, "HKLM")).is_ok());
    }

    /// The Windows versions the 1.18 controls are verified on in a VM, as
    /// (label, CurrentBuild, EditionID).
    const VM_TARGETS: [(&str, u32, &str); 4] = [
        ("win11-pro-24h2", 26100, "Professional"),
        ("win11-home-24h2", 26100, "Core"),
        ("win11-education-24h2", 26100, "Education"),
        ("win10-22h2-pro", 19045, "Professional"),
    ];

    fn vm_matrix() -> serde_json::Value {
        let tweaks: Vec<serde_json::Value> = TWEAKS
            .iter()
            .map(|t| {
                let expected: serde_json::Map<String, serde_json::Value> = VM_TARGETS
                    .iter()
                    .map(|(label, build, edition)| {
                        let verdict = match availability(t, Some(*build), Some(edition)) {
                            Ok(()) => "applies",
                            Err(why) => why.code(),
                        };
                        ((*label).to_string(), verdict.into())
                    })
                    .collect();
                serde_json::json!({
                    "id": t.id,
                    "hive": t.hive_name(),
                    "minBuild": t.min_build,
                    "edition": format!("{:?}", t.edition),
                    "writes": t.writes.iter().map(|w| serde_json::json!({
                        "path": w.path, "name": w.name,
                        // Numeric while every write is a DWORD: verify-tweaks.ps1
                        // casts this to uint32. The day a non-DWORD settings
                        // write lands, that script needs a kind-aware comparison.
                        "value": match &w.value {
                            RegValue::Dword(n) => serde_json::json!(n),
                            other => serde_json::json!(format!("{other:?}")),
                        },
                    })).collect::<Vec<_>>(),
                    "expected": expected,
                })
            })
            .collect();
        let services: Vec<serde_json::Value> = crate::services::SERVICE_TWEAKS
            .iter()
            .map(|t| {
                serde_json::json!({
                    "id": t.id,
                    "service": t.service,
                    "startTypeWhenApplied": if t.manual { "DEMAND_START" } else { "DISABLED" },
                    "expected": "applies where the service is installed; otherwise not_present",
                })
            })
            .collect();
        serde_json::json!({
            "generatedBy": "cargo test settings_tweaks::tests::the_vm_matrix_matches_the_catalogue (PCT_WRITE_VM_MATRIX=1 rewrites it)",
            "targets": VM_TARGETS.iter().map(|(label, build, edition)| serde_json::json!({
                "label": label, "build": build, "editionId": edition,
            })).collect::<Vec<_>>(),
            "settings": tweaks,
            "services": services,
        })
    }

    /// The VM verification script reads its expectations from this file, so
    /// it is derived from the catalogue and checked here: it cannot drift.
    #[test]
    fn the_vm_matrix_matches_the_catalogue() {
        let path = std::path::Path::new(env!("CARGO_MANIFEST_DIR"))
            .join("../scripts/vm/tweak-matrix.json");
        let current = serde_json::to_string_pretty(&vm_matrix()).unwrap() + "\n";
        if std::env::var_os("PCT_WRITE_VM_MATRIX").is_some() {
            std::fs::write(&path, &current).unwrap();
        }
        let stored = std::fs::read_to_string(&path)
            .unwrap_or_default()
            .replace("\r\n", "\n");
        assert_eq!(
            stored,
            current,
            "run with PCT_WRITE_VM_MATRIX=1 to refresh {}",
            path.display()
        );
    }
}
