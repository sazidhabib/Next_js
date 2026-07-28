# Install Tools Script for File Converter (FFmpeg & LibreOffice)
# This script downloads and extracts FFmpeg and LibreOffice locally into the project directory.

$ErrorActionPreference = "Stop"

# Define Paths
$ProjectDir = $PSScriptRoot
$BinDir = Join-Path $ProjectDir "bin"
$FfmpegZip = Join-Path $BinDir "ffmpeg.zip"
$LibreOfficeMsi = Join-Path $BinDir "libreoffice.msi"

# Ensure bin directory exists
if (-not (Test-Path $BinDir)) {
    Write-Host "Creating bin directory: $BinDir"
    New-Item -ItemType Directory -Path $BinDir | Out-Null
}

# --- 1. DOWNLOAD & EXTRACT FFMPEG ---
Write-Host "`n=== Setting up FFmpeg ==="
$FfmpegDest = Join-Path $BinDir "ffmpeg.exe"
$GlobalFfmpeg = Get-Command ffmpeg -ErrorAction SilentlyContinue

if (Test-Path $FfmpegDest) {
    Write-Host "FFmpeg binary is already present locally at $FfmpegDest. Skipping download."
} elseif ($GlobalFfmpeg) {
    Write-Host "FFmpeg is already installed globally on your system PATH ($($GlobalFfmpeg.Source)). Skipping download."
} else {
    $FfmpegUrl = "https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip"
    Write-Host "Downloading FFmpeg from $FfmpegUrl..."
    Invoke-WebRequest -Uri $FfmpegUrl -OutFile $FfmpegZip -UserAgent "Mozilla/5.0"
    
    Write-Host "Extracting FFmpeg zip..."
    $ExtractTemp = Join-Path $BinDir "ffmpeg_temp"
    if (Test-Path $ExtractTemp) { Remove-Item -Recurse -Force $ExtractTemp }
    Expand-Archive -Path $FfmpegZip -DestinationPath $ExtractTemp
    
    # Locate ffmpeg.exe and copy it to bin
    $FfmpegExe = Get-ChildItem -Path $ExtractTemp -Filter "ffmpeg.exe" -Recurse | Select-Object -First 1
    if ($FfmpegExe) {
        Copy-Item -Path $FfmpegExe.FullName -Destination $BinDir -Force
        Write-Host "FFmpeg successfully installed at: $(Join-Path $BinDir "ffmpeg.exe")"
    } else {
        throw "Could not find ffmpeg.exe in the extracted zip package."
    }
    
    # Clean up temp files
    Remove-Item -Recurse -Force $ExtractTemp
    Remove-Item -Force $FfmpegZip
}

# --- 2. DOWNLOAD & EXTRACT LIBREOFFICE ---
Write-Host "`n=== Setting up LibreOffice ==="
$LODest = Join-Path $BinDir "libreoffice"
$LOSoffice = Join-Path $LODest "program\soffice.exe"
$GlobalSoffice = Get-Command soffice -ErrorAction SilentlyContinue
$GlobalLO = Get-Command libreoffice -ErrorAction SilentlyContinue

if (Test-Path $LOSoffice) {
    Write-Host "LibreOffice is already present locally at $LOSoffice. Skipping download."
} elseif ($GlobalSoffice) {
    Write-Host "LibreOffice (soffice) is already installed globally on your system PATH ($($GlobalSoffice.Source)). Skipping download."
} elseif ($GlobalLO) {
    Write-Host "LibreOffice is already installed globally on your system PATH ($($GlobalLO.Source)). Skipping download."
} else {
    # Using LibreOffice 24.2.5.2 x64 from the archive (stable target)
    $LOUrl = "https://downloadarchive.documentfoundation.org/libreoffice/old/24.2.5.2/win/x86_64/LibreOffice_24.2.5.2_Win_x86-64.msi"
    Write-Host "Downloading LibreOffice MSI from $LOUrl..."
    Invoke-WebRequest -Uri $LOUrl -OutFile $LibreOfficeMsi -UserAgent "Mozilla/5.0"
    
    Write-Host "Extracting LibreOffice MSI (administrative installation)..."
    if (Test-Path $LODest) { Remove-Item -Recurse -Force $LODest }
    New-Item -ItemType Directory -Path $LODest | Out-Null
    
    # Run administrative installation to extract MSI contents without installing system-wide
    $MsiArgs = "/a `"$LibreOfficeMsi`" /qb TARGETDIR=`"$LODest`""
    $Process = Start-Process -FilePath "msiexec.exe" -ArgumentList $MsiArgs -Wait -NoNewWindow -PassThru
    
    if ($Process.ExitCode -eq 0 -and (Test-Path $LOSoffice)) {
        Write-Host "LibreOffice successfully extracted to: $LODest"
    } else {
        throw "LibreOffice extraction failed or soffice.exe was not found. ExitCode: $($Process.ExitCode)"
    }
    
    # Clean up MSI installer
    Remove-Item -Force $LibreOfficeMsi
}

Write-Host "`n=== Installation Complete! ==="
Write-Host "FFmpeg: $(Join-Path $BinDir 'ffmpeg.exe')"
Write-Host "LibreOffice (soffice): $LOSoffice"
