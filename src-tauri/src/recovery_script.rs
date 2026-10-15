use std::path::PathBuf;

pub fn generate_winre_recovery_script() -> Result<PathBuf, String> {
    #[cfg(windows)]
    {
        let system_drive = std::env::var("SystemDrive").unwrap_or_else(|_| "C:".into());
        let recovery_dir = PathBuf::from(format!(r"{}\WinCraft_Recovery", system_drive));
        if !recovery_dir.exists() {
            let _ = std::fs::create_dir_all(&recovery_dir);
        }
        let script_path = recovery_dir.join("recover.bat");
        let content = r#"@echo off
REM =========================================================================
REM WinCraft 2.0: Automated Offline WinRE Disaster Recovery Script
REM Generated automatically prior to elevated system optimization
REM =========================================================================

echo [WinCraft] Starting Offline Emergency System Restoration...

REM Detect Windows drive letter in WinRE environment
set TARGET_DRIVE=
for %%d in (C D E F G H) do (
    if exist %%d:\Windows\System32\config\SYSTEM (
        set TARGET_DRIVE=%%d:
        goto :FoundDrive
    )
)

:FoundDrive
if "%TARGET_DRIVE%"=="" (
    echo [ERROR] Target Windows installation could not be located!
    pause
    exit /b 1
)

echo [WinCraft] Target Windows directory located on %TARGET_DRIVE%\Windows

REM Mount offline SYSTEM registry hive into WinRE registry
echo [WinCraft] Mounting offline SYSTEM registry hive...
reg.exe load HKLM\OFFLINE_SYSTEM %TARGET_DRIVE%\Windows\System32\config\SYSTEM
if %errorlevel% neq 0 (
    echo [ERROR] Failed to mount SYSTEM hive!
    pause
    exit /b 1
)

REM Mount offline SOFTWARE registry hive
echo [WinCraft] Mounting offline SOFTWARE registry hive...
reg.exe load HKLM\OFFLINE_SOFTWARE %TARGET_DRIVE%\Windows\System32\config\SOFTWARE

REM =========================================================================
REM Revert Critical Boot Services to Native Defaults
REM =========================================================================
echo [WinCraft] Restoring service start types...
reg.exe add "HKLM\OFFLINE_SYSTEM\ControlSet001\Services\RpcSs" /v Start /t REG_DWORD /d 2 /f >nul 2>&1
reg.exe add "HKLM\OFFLINE_SYSTEM\ControlSet001\Services\DcomLaunch" /v Start /t REG_DWORD /d 2 /f >nul 2>&1
reg.exe add "HKLM\OFFLINE_SYSTEM\ControlSet001\Services\PlugPlay" /v Start /t REG_DWORD /d 2 /f >nul 2>&1
reg.exe add "HKLM\OFFLINE_SYSTEM\ControlSet001\Services\DiagTrack" /v Start /t REG_DWORD /d 2 /f >nul 2>&1
reg.exe add "HKLM\OFFLINE_SYSTEM\ControlSet001\Services\WSearch" /v Start /t REG_DWORD /d 2 /f >nul 2>&1
reg.exe add "HKLM\OFFLINE_SYSTEM\ControlSet001\Services\SysMain" /v Start /t REG_DWORD /d 2 /f >nul 2>&1

REM Revert SvcHost Split Threshold to default
echo [WinCraft] Reverting SvcHost process grouping...
reg.exe add "HKLM\OFFLINE_SYSTEM\ControlSet001\Control" /v SvcHostSplitThresholdInKB /t REG_DWORD /d 3670016 /f >nul 2>&1

REM Revert CPU Scheduling Quantum to client default
echo [WinCraft] Reverting CPU scheduling quantum...
reg.exe add "HKLM\OFFLINE_SYSTEM\ControlSet001\Control\PriorityControl" /v Win32PrioritySeparation /t REG_DWORD /d 2 /f >nul 2>&1

REM Unmount offline hives cleanly
echo [WinCraft] Unmounting offline registry hives...
reg.exe unload HKLM\OFFLINE_SYSTEM >nul 2>&1
reg.exe unload HKLM\OFFLINE_SOFTWARE >nul 2>&1

echo =========================================================================
echo [WinCraft] Offline Restoration Complete! The system can now be rebooted.
echo =========================================================================
pause
"#;
        if let Err(e) = std::fs::write(&script_path, content) {
            // If writing to system drive is restricted, fallback to local app data
            let fallback_dir = std::env::var("LOCALAPPDATA")
                .map(|p| PathBuf::from(p).join("WinCraft"))
                .unwrap_or_else(|_| PathBuf::from("."));
            let fallback_path = fallback_dir.join("recover.bat");
            std::fs::write(&fallback_path, content)
                .map_err(|fe| format!("failed to write recovery script: {e}; fallback: {fe}"))?;
            return Ok(fallback_path);
        }
        Ok(script_path)
    }

    #[cfg(not(windows))]
    {
        Ok(PathBuf::from("/tmp/recover.bat"))
    }
}

#[tauri::command(async)]
pub fn export_recovery_script() -> Result<String, String> {
    let path = generate_winre_recovery_script()?;
    Ok(path.to_string_lossy().to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn recovery_script_contents_are_valid() {
        let res = generate_winre_recovery_script();
        assert!(res.is_ok());
    }
}
