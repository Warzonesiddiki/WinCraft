# Offline regression tests; no Pester or downloaded EXEs required.
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
$installer = Join-Path $PSScriptRoot '../install.ps1'
. $installer -LibraryOnly
function Assert-Throws([scriptblock]$Action) {
    $threw = $false
    try { & $Action } catch { $threw = $true }
    if (-not $threw) { throw 'Expected a fail-closed error.' }
}
$script:Publisher = 'Aurelio Avila'
$script:Status = 'Valid'
$script:HasTimestamp = $true
$script:Launches = 0
$script:Downloads = @()
$certificate = [pscustomobject]@{}
$certificate | Add-Member -MemberType ScriptMethod -Name GetNameInfo -Value { param($kind, $issuer) return $script:Publisher }
function Get-AuthenticodeSignature {
    param([string]$LiteralPath)
    return [pscustomobject]@{ Status = $script:Status; SignerCertificate = $certificate; TimeStamperCertificate = $(if ($script:HasTimestamp) { $certificate } else { $null }) }
}
function Invoke-WebRequest {
    param([string]$Uri, [string]$OutFile, [switch]$UseBasicParsing)
    $script:Downloads += $Uri
    [IO.File]::WriteAllText($OutFile, 'offline fixture bytes')
}
function Start-Process {
    param([string]$FilePath, [switch]$PassThru, [switch]$Wait)
    $script:Launches++
    # The consumer must deny mutation while launching verified bytes.
    Assert-Throws { [IO.File]::WriteAllText($FilePath, 'tampered') }
    return [pscustomobject]@{ ExitCode = 0 }
}
$url = 'https://github.com/Warzonesiddiki/WinCraft/releases/download/v1.19.0/WinCraft_1.19.0_x64-setup.exe'
$fixture = [pscustomobject]@{ tag_name = 'v1.19.0'; assets = @(
    [pscustomobject]@{ name = 'other.exe'; browser_download_url = 'https://example.com/other.exe' },
    [pscustomobject]@{ name = 'WinCraft_1.19.0_x64-setup.exe'; browser_download_url = $url }
) }
if ((Select-WinCraftInstaller $fixture) -cne $url) { throw 'Wrong asset selected.' }
foreach ($name in @('other.exe', 'WinCraft_1.19.0_arm64-setup.exe', 'WinCraft_1.19.0_x86-setup.exe')) {
    Assert-Throws { Select-WinCraftInstaller ([pscustomobject]@{ tag_name = 'v1.19.0'; assets = @([pscustomobject]@{ name = $name; browser_download_url = $url }) }) }
}
Assert-Throws { Select-WinCraftInstaller ([pscustomobject]@{ tag_name = 'untrusted'; assets = @() }) }
foreach ($bad in @('https://evil.example/installer.exe', 'http://github.com/Warzonesiddiki/WinCraft/releases/installer.exe', 'https://github.com/other/repo/releases/installer.exe')) {
    Assert-Throws { Invoke-WinCraftInstall $bad }
}
foreach ($status in @('NotSigned', 'HashMismatch', 'NotTrusted')) {
    $script:Status = $status
    Assert-Throws { Invoke-WinCraftInstall $url }
}
$script:Status = 'Valid'
$script:Publisher = 'Unexpected publisher'
Assert-Throws { Invoke-WinCraftInstall $url }
$script:Publisher = 'Aurelio Avila'
$script:HasTimestamp = $false
Assert-Throws { Invoke-WinCraftInstall $url }
if ($script:Launches -ne 0) { throw 'Untrusted bytes were launched.' }
$script:HasTimestamp = $true
Invoke-WinCraftInstall $url
if ($script:Launches -ne 1) { throw 'Verified bytes were not launched exactly once.' }

# Exercise discovery/fallback paths in the actual entry point. A signature
# failure after discovery may not trigger another download or a weaker path.
function Invoke-RestMethod { param($Uri, $Headers, [switch]$UseBasicParsing) return $fixture }
$script:Status = 'HashMismatch'
$script:Downloads = @()
Assert-Throws { . $installer }
if ($script:Downloads.Count -ne 1 -or $script:Downloads[0] -cne $url) { throw 'Verification failure fell back.' }
function Invoke-RestMethod { param($Uri, $Headers, [switch]$UseBasicParsing) throw 'Offline discovery failure' }
$script:Downloads = @()
Assert-Throws { . $installer }
if ($script:Downloads.Count -ne 1 -or $script:Downloads[0] -notmatch '/PCTweaker-Setup.exe$') { throw 'Fallback verification path was not exercised.' }
if ($script:Launches -ne 1) { throw 'Invalid fallback was launched.' }
Write-Host 'Quick installer: asset, signature, publisher, timestamp, mutation lock and fallback tests passed.'
