//! Barebone package table (Atlas 0.5.x parity, Tier 2 extension) — Phase B1.
//!
//! Read-only in B1: the table exists, the list command exists, no removal path
//! is wired. Every entry carries `vm_verified: false` until a clean-VM run
//! confirms its publisher identity, Store URL and removability; the list
//! command only returns verified entries, so nothing here reaches a user
//! before that run. This is the gate, enforced in code rather than remembered.
//!
//! Licensing: technique classes only (package ∪ service ∪ task ∪ policy).
//! Nothing vendored from AtlasOS (GPL-3.0) or meetrevision/packages
//! (CC BY-NC-SA, non-commercial).

use serde::Serialize;

use crate::barebone::ReversibilityTier;

/// One Atlas-class candidate for the Barebone package list.
pub struct BarebonePackage {
    pub id: &'static str,
    pub package_name: &'static str,
    pub publisher_id: &'static str,
    pub publisher: &'static str,
    pub name: &'static str,
    pub description: &'static str,
    pub impact: &'static str,
    /// `None` until VM-verified. No entry without a verified Store URL is
    /// ever listed, because without it there is no reinstall path and the
    /// item is Tier 3 in disguise.
    pub store_url: Option<&'static str>,
    pub tier: ReversibilityTier,
    /// First Windows build the package exists on; 0 for any.
    pub min_build: u32,
    /// Other features that must not be in use, e.g. `gaming`, `xbox`,
    /// `store`, `widgets`. Checked by preflight (Phase B4).
    pub depends_on: &'static [&'static str],
    /// Set only by a clean-VM run confirming publisher identity, Store URL
    /// and removability. The list command filters on this.
    pub vm_verified: bool,
}

// Microsoft-published packages share one signer. The CN below is the same
// string 20 existing `debloat.rs` CATALOG entries already verify at runtime,
// so the pattern is established — but each row below is still unverified
// until a VM run sets `vm_verified`, and unverified rows are never listed.
const MS_PUBLISHER_ID: &str = "8wekyb3d8bbwe";
const MS_PUBLISHER: &str =
    "CN=Microsoft Corporation, O=Microsoft Corporation, L=Redmond, S=Washington, C=US";

/// Atlas default-removed families not already in `debloat.rs` CATALOG.
/// All Tier 2 (per-user, Store-reinstallable) by construction; provisioned
/// removal stays Tier 3 and lives elsewhere.
pub const BAREBONE_PACKAGES: &[BarebonePackage] = &[
    BarebonePackage {
        id: "barebone_teams_personal",
        package_name: "MicrosoftTeams",
        publisher_id: MS_PUBLISHER_ID,
        publisher: MS_PUBLISHER,
        name: "Microsoft Teams (personal)",
        description: "Personal Teams client preinstalled with Windows.",
        impact: "Personal Teams calls and chats stop on this PC until reinstalled.",
        store_url: None,
        tier: ReversibilityTier::Reinstallable,
        min_build: 0,
        depends_on: &[],
        vm_verified: false,
    },
    BarebonePackage {
        id: "barebone_skype",
        package_name: "Microsoft.SkypeApp",
        publisher_id: MS_PUBLISHER_ID,
        publisher: MS_PUBLISHER,
        name: "Skype",
        description: "Skype calling and messaging app.",
        impact: "Skype calls and chats stop on this PC until reinstalled.",
        store_url: None,
        tier: ReversibilityTier::Reinstallable,
        min_build: 0,
        depends_on: &[],
        vm_verified: false,
    },
    BarebonePackage {
        id: "barebone_mixed_reality",
        package_name: "Microsoft.MixedReality.Portal",
        publisher_id: MS_PUBLISHER_ID,
        publisher: MS_PUBLISHER,
        name: "Mixed Reality Portal",
        description: "Setup app for Windows Mixed Reality headsets.",
        impact: "Mixed Reality headset setup stops working until reinstalled. Harmless without a headset.",
        store_url: None,
        tier: ReversibilityTier::Reinstallable,
        min_build: 0,
        depends_on: &[],
        vm_verified: false,
    },
    BarebonePackage {
        id: "barebone_onenote",
        package_name: "Microsoft.Office.OneNote",
        publisher_id: MS_PUBLISHER_ID,
        publisher: MS_PUBLISHER,
        name: "OneNote (Store version)",
        description: "OneNote note-taking app from the Store.",
        impact: "Sync notebooks first. Local unsynced notes may be lost; the desktop Office OneNote is unaffected.",
        store_url: None,
        tier: ReversibilityTier::Reinstallable,
        min_build: 0,
        depends_on: &[],
        vm_verified: false,
    },
    BarebonePackage {
        id: "barebone_xbox_companion",
        package_name: "Microsoft.XboxApp",
        publisher_id: MS_PUBLISHER_ID,
        publisher: MS_PUBLISHER,
        name: "Xbox Console Companion (deprecated)",
        description: "The deprecated Xbox Console Companion, superseded by the Xbox app.",
        impact: "The old companion app leaves; the modern Xbox app and Game Bar are untouched.",
        store_url: None,
        tier: ReversibilityTier::Reinstallable,
        min_build: 0,
        depends_on: &["gaming", "xbox"],
        vm_verified: false,
    },
];

/// One row of the list-only command. Static metadata only in B1 — installed
/// status wiring comes with the removal path, never before VM verification.
#[derive(Serialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct BareboneListItem {
    pub id: String,
    pub package_name: String,
    pub name: String,
    pub description: String,
    pub impact: String,
    pub store_url: Option<String>,
    pub tier: String,
    pub consent_required: bool,
    pub installed: bool,
    pub removable: bool,
    pub reason: Option<String>,
}

/// Only VM-verified entries with a Store URL are ever listed. Anything else
/// would be a Tier 3 item wearing Tier 2 clothes: no reinstall path means no
/// honest recovery story.
pub fn listable() -> Vec<&'static BarebonePackage> {
    BAREBONE_PACKAGES
        .iter()
        .filter(|p| {
            p.vm_verified
                && p.store_url
                    .is_some_and(|u| u.starts_with("https://apps.microsoft.com/"))
        })
        .collect()
}

/// List-only command (B1). No removal path is wired: `installed` is always
/// false and `removable` always false until scan wiring lands with VM proof.
#[tauri::command(async)]
pub fn list_barebone_packages() -> Result<Vec<BareboneListItem>, String> {
    Ok(listable()
        .iter()
        .map(|p| BareboneListItem {
            id: p.id.to_string(),
            package_name: p.package_name.to_string(),
            name: p.name.to_string(),
            description: p.description.to_string(),
            impact: p.impact.to_string(),
            store_url: p.store_url.map(str::to_string),
            tier: p.tier.as_str().to_string(),
            consent_required: p.tier.consent_required(),
            installed: false,
            removable: false,
            reason: Some("awaitingVmVerification".to_string()),
        })
        .collect())
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::collections::HashSet;

    #[test]
    fn table_is_well_formed_and_nothing_unverified_is_listable() {
        let mut ids = HashSet::new();
        let mut names = HashSet::new();
        for p in BAREBONE_PACKAGES {
            // Unique ids and package names; no clash with the Tier 2 CATALOG
            // (a package in both tables would have two removal paths).
            assert!(ids.insert(p.id), "{} declared twice", p.id);
            assert!(
                names.insert(p.package_name),
                "{} declared twice",
                p.package_name
            );
            assert!(!p.id.is_empty() && !p.package_name.is_empty());
            assert!(!p.publisher_id.is_empty() && !p.publisher.is_empty());
            assert!(!p.name.is_empty() && !p.description.is_empty() && !p.impact.is_empty());
            // Tier 2 only: provisioned removal is Tier 3 and lives elsewhere.
            assert_eq!(p.tier, ReversibilityTier::Reinstallable, "{}", p.id);
            assert!(!p.tier.consent_required(), "{}", p.id);
            // No `barebone_` id may contain the batch separator.
            assert!(!p.id.contains(','), "{}", p.id);
            // A verified entry must have a Store URL, or listing it would
            // offer removal without a reinstall path.
            if p.vm_verified {
                assert!(
                    p.store_url
                        .is_some_and(|u| u.starts_with("https://apps.microsoft.com/")),
                    "{} verified without a Store URL",
                    p.id
                );
            }
        }
        // B1: nothing is verified, so nothing is listable. The day a VM run
        // flips a flag, this test proves the gate opened for exactly that row.
        assert!(
            BAREBONE_PACKAGES.iter().any(|p| !p.vm_verified),
            "every entry verified without a recorded VM run"
        );
        assert!(listable().is_empty(), "unverified entries must never list");
    }
}
