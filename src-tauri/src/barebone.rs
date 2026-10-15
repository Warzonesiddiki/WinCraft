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
    let mut findings = Vec::new();
    #[cfg(windows)]
    {
        if !crate::elevation::is_elevated() {
            findings.push(PreflightFinding {
                code: "not_elevated".to_string(),
                message: "Barebone changes need administrator rights; the app will ask once for the whole batch.".to_string(),
            });
        }
        if !crate::elevation::current_user_session_allowed() {
            findings.push(PreflightFinding {
                code: "foreign_session".to_string(),
                message: "This process runs as a different user than the signed-in session; per-user state cannot be inventoried honestly.".to_string(),
            });
        }
        if crate::services::user_choice_protected() {
            findings.push(PreflightFinding {
                code: "ucpd_protected".to_string(),
                message: "User Choice Protection is running: Windows refuses other programs' writes to protected switches.".to_string(),
            });
        }
        if crate::services::installed("GamingServices") {
            findings.push(PreflightFinding {
                code: "gaming_services_present".to_string(),
                message: "Gaming Services is installed: Xbox-tied items must stay out of any Barebone selection.".to_string(),
            });
        }
    }
    #[cfg(not(windows))]
    {
        findings.push(PreflightFinding {
            code: "unsupported_platform".to_string(),
            message: "Barebone changes apply to Windows only.".to_string(),
        });
    }
    findings
}

/// One explicit Tier 3 consent: the id plus what the user typed to confirm.
/// The UI collects free-form acknowledgement in Phase B5; the backend only
/// checks that a record exists, never what it says.
#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ConsentRecord {
    pub id: String,
    pub text: String,
    pub timestamp: u64,
}

fn consent_path(app_data_dir: &Path) -> PathBuf {
    app_data_dir.join("barebone_consent.json")
}

fn load_consents(app_data_dir: &Path) -> Vec<ConsentRecord> {
    let bytes = std::fs::read(consent_path(app_data_dir)).unwrap_or_default();
    if bytes.is_empty() {
        return Vec::new();
    }
    serde_json::from_slice(&bytes).unwrap_or_default()
}

/// Record explicit consent for one Tier 3 id. Overwrites any prior consent
/// for the same id; consent is per-item, never blanket.
pub fn record_consent(app_data_dir: &Path, id: &str, text: &str) -> Result<(), String> {
    if id.is_empty() || text.trim().is_empty() {
        return Err("consent needs an item and an acknowledgement".into());
    }
    let mut records = load_consents(app_data_dir);
    records.retain(|r| r.id != id);
    records.push(ConsentRecord {
        id: id.to_string(),
        text: text.to_string(),
        timestamp: now_secs(),
    });
    if let Some(parent) = consent_path(app_data_dir).parent() {
        std::fs::create_dir_all(parent).map_err(|e| format!("could not create dir: {e}"))?;
    }
    let json =
        serde_json::to_vec_pretty(&records).map_err(|e| format!("could not serialize: {e}"))?;
    std::fs::write(consent_path(app_data_dir), json)
        .map_err(|e| format!("could not write: {e}"))?;
    crate::audit::record("barebone-consent", id, true, None);
    Ok(())
}

/// Block Tier 3 work without a recorded consent. The error names the missing
/// item so the UI can route the user to the consent screen.
pub fn assert_consented(app_data_dir: &Path, id: &str) -> Result<(), String> {
    if load_consents(app_data_dir).iter().any(|r| r.id == id) {
        Ok(())
    } else {
        Err(format!(
            "barebone consent required for {id}; record it first"
        ))
    }
}

pub fn list_consents(app_data_dir: &Path) -> Vec<ConsentRecord> {
    load_consents(app_data_dir)
}

/// Attempt a restore point before Barebone work and report the outcome for
/// the consent screen to display. Best-effort and never blocking: the caller
/// decides, with the outcome on record. Skipped (not failed) when not
/// elevated, since the elevated retry happens after.
pub fn restore_point_for_barebone() -> crate::restore_point::RestorePointOutcome {
    use crate::restore_point::RestorePointOutcome;
    let outcome = if crate::elevation::is_elevated() {
        crate::restore_point::create_restore_point()
    } else {
        RestorePointOutcome::Skipped {
            reason: "not elevated; the administrator retry creates one".to_string(),
        }
    };
    let (success, detail) = match &outcome {
        RestorePointOutcome::Created => (true, None),
        RestorePointOutcome::Failed { reason } | RestorePointOutcome::Skipped { reason } => {
            (false, Some(reason.clone()))
        }
    };
    crate::audit::record("barebone-restore-point", "pre-apply", success, detail);
    outcome
}

/// Export the applied Barebone set plus consents as JSON text. The UI saves
/// it where the user chooses (the `wincraft-barebone-record` list-file
/// pattern); the backend never picks a path.
pub fn barebone_record_json(app_data_dir: &Path) -> Result<String, String> {
    let record = serde_json::json!({
        "format": 1,
        "kind": "wincraft-barebone-record",
        "history": list_barebone(app_data_dir),
        "consents": list_consents(app_data_dir),
    });
    serde_json::to_string_pretty(&record).map_err(|e| format!("could not serialize: {e}"))
}

/// List-only preflight for the consent screen (Phase B5 renders this).
#[tauri::command(async)]
pub fn barebone_preflight() -> Vec<PreflightFinding> {
    preflight()
}

/// Record explicit Tier 3 consent from the consent screen.
#[tauri::command(async)]
pub fn record_barebone_consent(
    app: tauri::AppHandle,
    id: String,
    text: String,
) -> Result<(), String> {
    record_consent(&crate::store_for_dir(&app)?, &id, &text)
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
    fn preflight_reports_only_known_codes() {
        for finding in crate::barebone::preflight() {
            assert!(
                [
                    "not_elevated",
                    "foreign_session",
                    "ucpd_protected",
                    "gaming_services_present",
                    "unsupported_platform",
                ]
                .contains(&finding.code.as_str()),
                "unknown preflight code: {}",
                finding.code
            );
            assert!(!finding.message.is_empty(), "{}", finding.code);
        }
    }

    #[test]
    fn consent_is_per_item_and_blocks_without_a_record() {
        let dir = std::env::temp_dir().join(format!(
            "wincraft-barebone-consent-test-{}-{}",
            std::process::id(),
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_nanos()
        ));
        std::fs::create_dir_all(&dir).unwrap();
        let id = "barebone_task_probe";
        // Blocked before any record exists.
        assert!(crate::barebone::assert_consented(&dir, id).is_err());
        // Empty item or acknowledgement is refused.
        assert!(crate::barebone::record_consent(&dir, "", "yes").is_err());
        assert!(crate::barebone::record_consent(&dir, id, "  ").is_err());
        crate::barebone::record_consent(&dir, id, "I understand this needs a reinstall to undo")
            .unwrap();
        assert!(crate::barebone::assert_consented(&dir, id).is_ok());
        // Re-consent overwrites rather than duplicating; other ids unaffected.
        crate::barebone::record_consent(&dir, id, "confirmed again").unwrap();
        let records = crate::barebone::list_consents(&dir);
        assert_eq!(records.len(), 1);
        assert_eq!(records[0].text, "confirmed again");
        assert!(crate::barebone::assert_consented(&dir, "barebone_other").is_err());
        // Export carries both history (empty) and the consent.
        let exported = crate::barebone::barebone_record_json(&dir).unwrap();
        assert!(exported.contains("wincraft-barebone-record"));
        assert!(exported.contains(id));
        let _ = std::fs::remove_dir_all(&dir);
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
