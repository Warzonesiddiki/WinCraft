# WinCraft Quick Installer. Prefer downloading and reviewing this script first.
[CmdletBinding()]
param([switch]$LibraryOnly)
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function Select-WinCraftInstaller {
    param([Parameter(Mandatory)]$Release)
    $version = [string]$Release.tag_name -replace '^v', ''
    if ($version -notmatch '^\d+\.\d+\.\d+$') { throw 'Unsupported release version.' }
    $expected = "WinCraft_${version}_x64-setup.exe"
    $assets = @($Release.assets | Where-Object { $_.name -ceq $expected })
    if ($assets.Count -ne 1) { throw "Expected exactly one x64 installer: $expected" }
    return [string]$assets[0].browser_download_url
}

function Assert-WinCraftSignature {
    param([Parameter(Mandatory)][string]$Path)
    $signature = Get-AuthenticodeSignature -LiteralPath $Path
    if ($signature.Status -ne 'Valid' -or -not $signature.SignerCertificate) {
        throw 'Installer signature is missing or invalid. Nothing was launched.'
    }
    $publisher = $signature.SignerCertificate.GetNameInfo(
        [System.Security.Cryptography.X509Certificates.X509NameType]::SimpleName, $false)
    if ($publisher -cne 'Aurelio Avila' -or -not $signature.TimeStamperCertificate) {
        throw 'Unexpected installer publisher or missing trusted timestamp. Nothing was launched.'
    }
}

function Invoke-WinCraftInstall {
    param([Parameter(Mandatory)][string]$DownloadUrl)
    $uri = [Uri]$DownloadUrl
    if ($uri.Scheme -cne 'https' -or $uri.Host -cne 'github.com' -or -not $uri.IsDefaultPort -or
        -not $uri.AbsolutePath.StartsWith('/Warzonesiddiki/WinCraft/releases/', [StringComparison]::Ordinal) -or
        $uri.UserInfo -or $uri.Query -or $uri.Fragment) { throw 'Untrusted installer URL.' }
    $staging = Join-Path ([IO.Path]::GetTempPath()) ('WinCraft-' + [Guid]::NewGuid().ToString('N'))
    $locked = $null
    try {
        New-Item -ItemType Directory -Path $staging -ErrorAction Stop | Out-Null
        $file = Join-Path $staging 'WinCraft-Setup.exe'
        Invoke-WebRequest -Uri $DownloadUrl -OutFile $file -UseBasicParsing
        # Hold a read-only share through verification and installation, preventing
        # another process from changing/deleting these bytes between check and use.
        $locked = [IO.File]::Open($file, [IO.FileMode]::Open, [IO.FileAccess]::Read, [IO.FileShare]::Read)
        Assert-WinCraftSignature -Path $file
        Write-Host 'Verified WinCraft installer. Launching...' -ForegroundColor Green
        $process = Start-Process -FilePath $file -PassThru -Wait
        if ($process.ExitCode -notin @(0, 3010)) { throw "Installer exited with code $($process.ExitCode)." }
    } finally {
        if ($locked) { $locked.Dispose() }
        if (Test-Path -LiteralPath $staging) { Remove-Item -LiteralPath $staging -Recurse -Force }
    }
}

if ($LibraryOnly) { return }
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
if (-not [Environment]::Is64BitOperatingSystem -or $env:PROCESSOR_ARCHITECTURE -eq 'ARM64' -or $env:PROCESSOR_ARCHITEW6432 -eq 'ARM64') {
    throw 'This quick installer supports x64 Windows only. See the release page for supported platforms.'
}
Write-Host 'WinCraft — all controls free; supported settings have restore snapshots.' -ForegroundColor Cyan
$download = $null
# Only discovery failures may use the stable compatibility alias. Verification,
# download and execution happen OUTSIDE this catch and fail closed.
try {
    $release = Invoke-RestMethod -Uri 'https://api.github.com/repos/Warzonesiddiki/WinCraft/releases/latest' -Headers @{ 'User-Agent' = 'WinCraft-Installer' } -UseBasicParsing
    $download = Select-WinCraftInstaller -Release $release
} catch {
    Write-Warning 'Release discovery unavailable; using the signed stable x64 installer alias.'
    $download = 'https://github.com/Warzonesiddiki/WinCraft/releases/latest/download/PCTweaker-Setup.exe'
}
try {
    Invoke-WinCraftInstall -DownloadUrl $download
} catch {
    # A raw 404 from the stable alias is the shape of "no signature-verified
    # release exists yet", which is the state this repository is in whenever the
    # only published release is an unsigned pre-release. Say so, and keep the
    # original error: the message is guidance, not a second failure path.
    Write-Host ''
    if ($_.Exception.GetType().Name -in @('WebException', 'HttpResponseException')) {
        Write-Host 'The installer download failed, so nothing was installed.' -ForegroundColor Red
        Write-Host 'If that was a 404, no signature-verified release is published yet — the stable link is created by the first one.' -ForegroundColor Yellow
        Write-Host 'The releases page shows what exists: https://github.com/Warzonesiddiki/WinCraft/releases' -ForegroundColor Yellow
    } else {
        Write-Host 'Nothing was installed.' -ForegroundColor Red
    }
    throw
}
