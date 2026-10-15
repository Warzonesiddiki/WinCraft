pub const FORBIDDEN_DEPROVISION_SUBSTRINGS: &[&str] = &[
    "windowsstore",
    "desktopappinstaller",
    "windowsterminal",
    "ui.xaml",
    "vclibs",
    "net.native.runtime",
    "net.native.framework",
    "shellexperiencehost",
    "startmenuexperiencehost",
    "sechealthui",
    "gamingservices",
    "xboxidentityprovider",
];

pub fn is_deprovision_allowed(package_family_name: &str) -> bool {
    let lower = package_family_name.to_lowercase();
    !FORBIDDEN_DEPROVISION_SUBSTRINGS.iter().any(|&forbidden| {
        lower.contains(forbidden)
    })
}

#[cfg(windows)]
pub fn deprovision_machine_package(package_family_name: &str) -> Result<(), String> {
    if !is_deprovision_allowed(package_family_name) {
        return Err(format!("Package {package_family_name} is protected system infrastructure"));
    }

    if !crate::elevation::is_elevated() {
        return Err("Machine-wide deprovisioning requires elevated administrator rights".into());
    }

    dism_deprovision(package_family_name)
}

#[cfg(windows)]
fn dism_deprovision(package_family_name: &str) -> Result<(), String> {
    // 1. Resolve exact ProvisionedPackageName using DISM query
    let output = crate::system_tools::run("dism", |cmd| {
        cmd.args(["/Online", "/NoRestart", "/Get-ProvisionedAppxPackages", "/Format:Table"])
            .output()
    })
    .map_err(|e| format!("Failed to spawn dism.exe: {e}"))?;

    let text = String::from_utf8_lossy(&output.stdout);
    let full_package_name = text
        .lines()
        .find(|line| line.contains(package_family_name))
        .and_then(|line| line.split_whitespace().next())
        .ok_or_else(|| format!("Package {package_family_name} not provisioned in image"))?;

    // 2. Execute /Remove-ProvisionedAppxPackage
    let remove_output = crate::system_tools::run("dism", |cmd| {
        cmd.args([
            "/Online",
            "/NoRestart",
            "/Remove-ProvisionedAppxPackage",
            &format!("/PackageName:{}", full_package_name),
        ])
        .output()
    })
    .map_err(|e| format!("Failed to execute dism removal: {e}"))?;

    if remove_output.status.success() {
        Ok(())
    } else {
        Err(format!(
            "DISM exited with code {:?}",
            remove_output.status.code()
        ))
    }
}

#[cfg(not(windows))]
pub fn deprovision_machine_package(_package_family_name: &str) -> Result<(), String> {
    Err("not supported on this platform".into())
}

#[tauri::command(async)]
pub fn deprovision_package(package_family_name: String) -> Result<(), String> {
    deprovision_machine_package(&package_family_name)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn safety_boundary_blocks_critical_infrastructure() {
        assert!(!is_deprovision_allowed("Microsoft.WindowsStore_8wekyb3d8bbwe"));
        assert!(!is_deprovision_allowed("Microsoft.SecHealthUI"));
        assert!(!is_deprovision_allowed("Microsoft.GamingServices"));
        assert!(is_deprovision_allowed("Microsoft.BingNews"));
        assert!(is_deprovision_allowed("Microsoft.ZuneVideo"));
    }
}
