@echo off
setlocal EnableDelayedExpansion
title WinCraft 2.0 - Emergency Recovery and Reversion Tool
cls
echo ===============================================================================
echo                      WinCraft 2.0 - Emergency System Recovery
echo ===============================================================================
echo This recovery script restores standard Windows 10/11 system defaults,
echo re-enables core Windows services, resets networking parameters,
echo and reverts aggressive optimizations.
echo.
echo Useful in Safe Mode, Windows Recovery Environment (WinRE), or standard CMD.
echo ===============================================================================
echo.

:: Check Administrative Privileges
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [ERROR] Administrative rights required.
    echo Please right-click this script and select "Run as administrator".
    pause
    exit /b 1
)

echo [*] Administrative rights confirmed.
echo.
set /p CONFIRM="Are you sure you want to revert system tweaks to safe Windows defaults? (Y/N): "
if /i not "%CONFIRM%"=="Y" (
    echo [INFO] Reversion aborted by user.
    pause
    exit /b 0
)

echo.
echo ===============================================================================
echo 1. Restoring Core Windows Services
echo ===============================================================================
sc config DiagTrack start= auto >nul 2>&1
sc config dmwappushservice start= delayed-auto >nul 2>&1
sc config WerSvc start= demand >nul 2>&1
sc config WSearch start= delayed-auto >nul 2>&1
sc config SysMain start= auto >nul 2>&1
sc config Spooler start= auto >nul 2>&1
sc config wuauserv start= demand >nul 2>&1
sc config BITS start= delayed-auto >nul 2>&1
sc config CryptSvc start= auto >nul 2>&1
echo [OK] Core service startup configurations restored to defaults.

echo.
echo ===============================================================================
echo 2. Re-enabling Windows Security & Defender Policies
echo ===============================================================================
reg delete "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender" /f >nul 2>&1
reg delete "HKLM\SOFTWARE\Policies\Microsoft\Windows\System" /v "EnableSmartScreen" /f >nul 2>&1
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender\Real-Time Protection" /v "DisableRealtimeMonitoring" /t REG_DWORD /d 0 /f >nul 2>&1
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Search" /v "AllowCortana" /t REG_DWORD /d 1 /f >nul 2>&1
echo [OK] Security policies verified and restored.

echo.
echo ===============================================================================
echo 3. Reverting UI, Explorer & Desktop Latency Overrides
echo ===============================================================================
reg add "HKCU\Control Panel\Desktop" /v "MenuShowDelay" /t REG_SZ /d "400" /f >nul 2>&1
reg add "HKCU\Control Panel\Desktop" /v "AutoEndTasks" /t REG_SZ /d "0" /f >nul 2>&1
reg add "HKCU\Control Panel\Desktop" /v "HungAppTimeout" /t REG_SZ /d "5000" /f >nul 2>&1
reg add "HKCU\Control Panel\Desktop" /v "WaitToKillAppTimeout" /t REG_SZ /d "20000" /f >nul 2>&1
reg add "HKCU\Control Panel\Mouse" /v "MouseHoverTime" /t REG_SZ /d "400" /f >nul 2>&1
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v "TaskbarAnimations" /t REG_DWORD /d 1 /f >nul 2>&1
echo [OK] Explorer and UI timing restored to default values.

echo.
echo ===============================================================================
echo 4. Resetting Network & Power Configurations
echo ===============================================================================
netsh winsock reset >nul 2>&1
netsh int ip reset >nul 2>&1
powercfg -restoredefaultschemes >nul 2>&1
echo [OK] TCP/IP stack reset and default power schemes restored.

echo.
echo ===============================================================================
echo 5. Restoring Windows Recall & AI Layer Defaults
echo ===============================================================================
reg delete "HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" /v "DisableAIDataAnalysis" /f >nul 2>&1
reg delete "HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" /v "DisableClickToDo" /f >nul 2>&1
reg delete "HKCU\Software\Policies\Microsoft\Windows\WindowsCopilot" /v "TurnOffWindowsCopilot" /f >nul 2>&1
echo [OK] System AI policies reset.

echo.
echo ===============================================================================
echo                       Recovery Procedure Completed!
echo ===============================================================================
echo All selected default configurations have been written.
echo It is recommended to restart your computer to apply all changes.
echo.
pause
