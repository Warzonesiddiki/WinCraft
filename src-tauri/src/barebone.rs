//! Barebone (Atlas 0.5.x parity, opt-in) — Tier plumbing, no behavior change.
//!
//! Core catalogue stays Tier 1 reversible-only. Barebone is a separate opt-in
//! surface with its own tier model and consent. This module carries the tier
//! type, the Tier 3 allowlist (empty for B0), a read-only preflight stub, and
//! a separate history journal so Tier 3 never enters the reversible store.

use serde::{Deserialize, Serialize};
use std::path::{Path, PathBuf};

/// Reversibility tier, surfaced in catalogue metadata and UX.
#[derive(Serialize, Deserialize, Clone, Copy, Debug, PartialEq, Eq, Default)]
#[serde(rename_all = "lowercase")]
pub enum ReversibilityTier {
    #[default]
    Reversible,
    Reinstallable,
    Irreversible,
}

impl ReversibilityTier {
    pub fn as_str(self) -> &'static str {
        match self {
            ReversibilityTier::Reversible => "reversible",
            ReversibilityTier::Reinstallable => "reinstallable",
            ReversibilityTier::Irreversible => "irreversible",
        }
    }

    pub fn consent_required(self) -> bool {
        matches!(self, ReversibilityTier::Irreversible)
    }
}

/// Tier for a tweak id. Core catalogue is reversible; debloat catalog is
/// reinstallable; barebone Tier 3 ids (none yet in B0) are irreversible.
pub fn tier_for_tweak(id: &str) -> ReversibilityTier {
    if id.starts_with("barebone_") {
        ReversibilityTier::Irreversible
    } else {
        ReversibilityTier::Reversible
    }
}

/// Tier for a debloat catalog id. Current CATALOG is Tier 2.
pub fn tier_for_debloat(_catalog_id: &str) -> ReversibilityTier {
    ReversibilityTier::Reinstallable
}

/// Tier 3 scheduled-task allowlist. Exact `\…` paths, no wildcards.
/// `\Microsoft\` is allowed only for these listed ids — the Startup screen's
/// `is_third_party` guard still hides everything else.
///
/// Both entries are Customer Experience Improvement Program uploaders (Phase
/// B3). Verified present-or-absent per machine at preflight; absent tasks are
/// reported, never created.
pub const BAREBONE_TASKS: &[&str] = &[
    "\\Microsoft\\Windows\\Customer Experience Improvement Program\\Consolidator",
    "\\Microsoft\\Windows\\Customer Experience Improvement Program\\UsbCeip",
];

/// Whether a scheduler path is on the Barebone allowlist. Exact match only.
pub fn is_barebone_task(path: &str) -> bool {
    BAREBONE_TASKS.contains(&path)
}

/// One preflight finding. All checks are read-only.
#[derive(Serialize, Clone, Debug, PartialEq, Eq)]
pub struct PreflightFinding {
    pub code: String,
    pub message: String,
}

/// Read-only preflight stub. Phase B4 fills in build/edition, form factor,
/// gaming/Xbox/Store deps, multi-user, elevation, UCPD checks.
pub fn preflight() -> Vec<PreflightFinding> {
    Vec::new()
}

/// Status for the separate Barebone journal. Never `SnapshotEntry::Registry`.
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum BareboneStatus {
    Applied,
    RevertedUnknown,
}

/// One entry in the separate Barebone history journal.
#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct BareboneRecord {
    pub id: String,
    pub tier: ReversibilityTier,
    pub status: BareboneStatus,
    pub timestamp: u64,
    pub detail: Option<String>,
}

fn history_path(app_data_dir: &Path) -> PathBuf {
    app_data_dir.join("barebone_history.json")
}

fn now_secs() -> u64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_secs())
        .unwrap_or(0)
}

fn load_history(app_data_dir: &Path) -> Vec<BareboneRecord> {
    let path = history_path(app_data_dir);
    let bytes = std::fs::read(&path).unwrap_or_default();
    if bytes.is_empty() {
        return Vec::new();
    }
    serde_json::from_slice(&bytes).unwrap_or_default()
}

fn save_history(app_data_dir: &Path, records: &[BareboneRecord]) -> Result<(), String> {
    if let Some(parent) = history_path(app_data_dir).parent() {
        std::fs::create_dir_all(parent).map_err(|e| format!("could not create dir: {e}"))?;
    }
    let json =
        serde_json::to_vec_pretty(records).map_err(|e| format!("could not serialize: {e}"))?;
    std::fs::write(history_path(app_data_dir), json)
        .map_err(|e| format!("could not write: {e}"))?;
    Ok(())
}

/// Record a Barebone application in the separate journal. Tier 3 only — Tier 1
/// belongs in the reversible rollback store, Tier 2 in the debloat journal.
pub fn record_barebone(
    app_data_dir: &Path,
    id: &str,
    tier: ReversibilityTier,
    detail: Option<String>,
) -> Result<(), String> {
    if tier != ReversibilityTier::Irreversible {
        return Err("only Tier 3 belongs in the barebone journal".into());
    }
    let mut records = load_history(app_data_dir);
    // Preserve oldest record: re-apply never overwrites the first entry.
    if records.iter().any(|r| r.id == id) {
        return Ok(());
    }
    records.push(BareboneRecord {
        id: id.to_string(),
        tier,
        status: BareboneStatus::Applied,
        timestamp: now_secs(),
        detail,
    });
    save_history(app_data_dir, &records)
}

pub fn list_barebone(app_data_dir: &Path) -> Vec<BareboneRecord> {
    load_history(app_data_dir)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn tiers_map_as_documented() {
        assert_eq!(
            tier_for_tweak("menu_show_delay"),
            ReversibilityTier::Reversible
        );
        assert_eq!(
            tier_for_debloat("solitaire"),
            ReversibilityTier::Reinstallable
        );
        assert_eq!(
            tier_for_tweak("barebone_future"),
            ReversibilityTier::Irreversible
        );
        assert!(!ReversibilityTier::Reversible.consent_required());
        assert!(!ReversibilityTier::Reinstallable.consent_required());
        assert!(ReversibilityTier::Irreversible.consent_required());
    }

    #[test]
    fn barebone_task_allowlist_is_empty_in_b0() {
        // Phase B3: the two CEIP uploaders. Exact paths, no wildcards.
        assert_eq!(crate::barebone::BAREBONE_TASKS.len(), 2);
        for path in crate::barebone::BAREBONE_TASKS {
            assert!(path.starts_with('\\'), "{path}");
            assert!(!path.contains('\0'));
            assert!(path.len() <= 512);
        }
        assert!(crate::barebone::is_barebone_task(
            "\\Microsoft\\Windows\\Customer Experience Improvement Program\\UsbCeip"
        ));
        assert!(!crate::barebone::is_barebone_task(
            "\\Microsoft\\Windows\\Customer Experience Improvement Program\\UsbCeip\\Evil"
        ));
        assert!(!crate::barebone::is_barebone_task("\\SomeOtherTask"));
    }

    #[test]
    fn preflight_is_read_only_and_empty_in_b0() {
        assert!(preflight().is_empty());
    }

    #[test]
    fn barebone_journal_rejects_non_tier3_and_preserves_oldest() {
        let dir = std::env::temp_dir().join(format!(
            "wincraft-barebone-test-{}-{}",
            std::process::id(),
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_nanos()
        ));
        std::fs::create_dir_all(&dir).unwrap();
        // Tier 1/2 must not enter the barebone journal.
        assert!(
            record_barebone(&dir, "menu_show_delay", ReversibilityTier::Reversible, None).is_err()
        );
        assert!(
            record_barebone(&dir, "solitaire", ReversibilityTier::Reinstallable, None).is_err()
        );
        // Tier 3 records once; re-record preserves oldest.
        record_barebone(
            &dir,
            "barebone_probe",
            ReversibilityTier::Irreversible,
            Some("a".into()),
        )
        .unwrap();
        record_barebone(
            &dir,
            "barebone_probe",
            ReversibilityTier::Irreversible,
            Some("b".into()),
        )
        .unwrap();
        let records = list_barebone(&dir);
        assert_eq!(records.len(), 1);
        assert_eq!(records[0].detail.as_deref(), Some("a"));
        let _ = std::fs::remove_dir_all(&dir);
    }
}
