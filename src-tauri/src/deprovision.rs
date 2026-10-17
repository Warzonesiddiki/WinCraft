//! Machine-wide package deprovisioning is intentionally disabled.
//!
//! The previous implementation used substring filtering and parsed human-readable
//! DISM table output, while providing no journal or supported reinstall/rollback path.
//! Keep this command unavailable until package identity, consent, and recovery are
//! implemented and exercised on supported Windows builds.

const DISABLED_REASON: &str = "Machine-wide package deprovisioning is disabled until exact package allowlisting and a tested recovery path are available";

pub fn deprovision_machine_package(_package_family_name: &str) -> Result<(), String> {
    Err(DISABLED_REASON.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn deprovisioning_is_blocked_for_every_package_until_recovery_is_ready() {
        for package in [
            "Microsoft.BingNews_8wekyb3d8bbwe",
            "Microsoft.WindowsStore_8wekyb3d8bbwe",
            "Microsoft.SecHealthUI_8wekyb3d8bbwe",
            "arbitrary-input",
        ] {
            let error = deprovision_machine_package(package).unwrap_err();
            assert!(error.contains("disabled"));
            assert!(error.contains("recovery path"));
        }
    }
}
