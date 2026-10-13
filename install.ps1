# WinCraft Quick Installer & Launcher
# Run in PowerShell: irm https://raw.githubusercontent.com/Warzonesiddiki/WinCraft/master/install.ps1 | iex

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host " =============================================================== " -ForegroundColor Cyan
Write-Host "   WinCraft - Free Open-Source Windows Performance & Debloat    " -ForegroundColor Green
Write-Host "   100% Free Forever * No Paywalls * 100% Reversible Snapshots   " -ForegroundColor Yellow
Write-Host " =============================================================== " -ForegroundColor Cyan
Write-Host ""

$Repo = "Warzonesiddiki/WinCraft"
$ApiUrl = "https://api.github.com/repos/$Repo/releases/latest"

Write-Host " [*] Checking for the latest WinCraft release..." -ForegroundColor Gray

try {
    $Release = Invoke-RestMethod -Uri $ApiUrl -Headers @{ "User-Agent" = "WinCraft-Installer" } -UseBasicParsing
    $Version = $Release.tag_name
    Write-Host " [+] Found latest version: $Version" -ForegroundColor Green
    
    $Asset = $Release.assets | Where-Object { $_.name -like "*Setup.exe" -or $_.name -like "*.exe" } | Select-Object -First 1
    if (-not $Asset) {
        throw "Could not locate executable asset in latest release."
    }
    
    $DownloadUrl = $Asset.browser_download_url
    $DestFile = "$env:TEMP\WinCraft-Setup.exe"
    
    Write-Host " [*] Downloading WinCraft from $DownloadUrl..." -ForegroundColor Gray
    Invoke-WebRequest -Uri $DownloadUrl -OutFile $DestFile -UseBasicParsing
    
    Write-Host " [+] Download complete. Launching WinCraft..." -ForegroundColor Green
    Start-Process -FilePath $DestFile
} catch {
    Write-Host " [!] Release API query failed: $_" -ForegroundColor Yellow
    Write-Host " [*] Falling back to primary direct release channel..." -ForegroundColor Gray
    
    $DirectUrl = "https://github.com/$Repo/releases/latest/download/PCTweaker-Setup.exe"
    $DestFile = "$env:TEMP\WinCraft-Setup.exe"
    
    try {
        Invoke-WebRequest -Uri $DirectUrl -OutFile $DestFile -UseBasicParsing
        Write-Host " [+] Download complete. Launching WinCraft..." -ForegroundColor Green
        Start-Process -FilePath $DestFile
    } catch {
        Write-Host " [X] Failed to download WinCraft automatically. Please visit https://github.com/$Repo/releases directly." -ForegroundColor Red
    }
}
