# 1-Click Universal Skills Installer for Windows
$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Installing Universal Agent Skills (Taste, Security, Gravitas)  " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$SourceSkills = Join-Path $PSScriptRoot "skills"
$OpenCodeSkills = Join-Path $HOME ".config\opencode\skills"
$AntigravitySkills = Join-Path $HOME ".gemini\config\skills"
$GlobalAgentsSkills = Join-Path $HOME ".agents\skills"

# 1. Install to OpenCode
if (!(Test-Path $OpenCodeSkills)) {
    New-Item -ItemType Directory -Path $OpenCodeSkills -Force | Out-Null
}
Copy-Item -Path "$SourceSkills\*" -Destination $OpenCodeSkills -Recurse -Force
Write-Host "[✓] Installed to OpenCode ($OpenCodeSkills)" -ForegroundColor Green

# 2. Install to Antigravity / Gemini
if (!(Test-Path $AntigravitySkills)) {
    New-Item -ItemType Directory -Path $AntigravitySkills -Force | Out-Null
}
Copy-Item -Path "$SourceSkills\*" -Destination $AntigravitySkills -Recurse -Force
Write-Host "[✓] Installed to Antigravity ($AntigravitySkills)" -ForegroundColor Green

# 3. Install to Global ~/.agents
if (!(Test-Path $GlobalAgentsSkills)) {
    New-Item -ItemType Directory -Path $GlobalAgentsSkills -Force | Out-Null
}
Copy-Item -Path "$SourceSkills\*" -Destination $GlobalAgentsSkills -Recurse -Force
Write-Host "[✓] Installed to Global Agents ($GlobalAgentsSkills)" -ForegroundColor Green

Write-Host "`nSetup Complete! All agents on this machine now have access to high-standard skills." -ForegroundColor Yellow
