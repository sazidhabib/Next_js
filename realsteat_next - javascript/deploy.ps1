# ============================================================
# Deployment Script for presidentpropertiesltd.com (cPanel)
# Run this from your project root in PowerShell:
#   .\deploy.ps1
# ============================================================

Write-Host "`n==================================================" -ForegroundColor Cyan
Write-Host "  President Properties - cPanel Deploy Builder" -ForegroundColor Cyan
Write-Host "==================================================`n" -ForegroundColor Cyan

# Step 1: Clean previous build
Write-Host "[1/5] Cleaning previous build..." -ForegroundColor Yellow
if (Test-Path ".next") { Remove-Item -Recurse -Force ".next" }
if (Test-Path "deploy_package") { Remove-Item -Recurse -Force "deploy_package" }
if (Test-Path "deploy_package.zip") { Remove-Item -Force "deploy_package.zip" }
Write-Host "  Done." -ForegroundColor Green

# Step 2: Build Next.js for production
Write-Host "`n[2/5] Building Next.js for production..." -ForegroundColor Yellow
$env:NODE_ENV = "production"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "  BUILD FAILED! Fix errors above and re-run." -ForegroundColor Red
    exit 1
}
Write-Host "  Build successful." -ForegroundColor Green

# Step 3: Run fix-build-paths.js to fix Windows -> Linux paths
Write-Host "`n[3/5] Fixing build paths for Linux cPanel compatibility..." -ForegroundColor Yellow
if (Test-Path "fix-build-paths.js") {
    node fix-build-paths.js
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  Path fixing failed!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "  fix-build-paths.js not found. Skipping." -ForegroundColor Yellow
}

# Step 4: Assemble deployment package
Write-Host "`n[4/5] Assembling deployment package..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "deploy_package" -Force | Out-Null

# Copy .next build output (exclude cache to reduce size)
Write-Host "  Copying .next build..." -ForegroundColor Gray
Copy-Item -Recurse ".next" "deploy_package\.next" -Force
if (Test-Path "deploy_package\.next\cache") {
    Remove-Item -Recurse -Force "deploy_package\.next\cache"
}

# Copy backend directories
$backendDirs = @("server-api", "public")
foreach ($dir in $backendDirs) {
    if (Test-Path $dir) {
        Write-Host "  Copying $dir..." -ForegroundColor Gray
        Copy-Item -Recurse $dir "deploy_package\$dir" -Force
    }
}

# Copy essential root files
$rootFiles = @(
    "server.js",
    "package.json",
    "package-lock.json",
    ".htaccess",
    ".env.production",
    "middleware.js",
    "next.config.mjs",
    "postcss.config.mjs",
    "jsconfig.json",
    "fix-build-paths.js"
)
foreach ($file in $rootFiles) {
    if (Test-Path $file) {
        Write-Host "  Copying $file..." -ForegroundColor Gray
        Copy-Item $file "deploy_package\$file" -Force
    }
}

# Copy the app directory (Next.js app router pages)
if (Test-Path "app") {
    Write-Host "  Copying app directory..." -ForegroundColor Gray
    Copy-Item -Recurse "app" "deploy_package\app" -Force
}

# Rename .env.production to .env in deploy package
if (Test-Path "deploy_package\.env.production") {
    Rename-Item "deploy_package\.env.production" ".env"
    Write-Host "  Renamed .env.production -> .env" -ForegroundColor Gray
}

# Step 5: Create ZIP
Write-Host "`n[5/5] Creating deploy_package.zip..." -ForegroundColor Yellow
Compress-Archive -Path "deploy_package\*" -DestinationPath "deploy_package.zip" -Force
Write-Host "  deploy_package.zip created." -ForegroundColor Green

# Report
$zipSize = (Get-Item "deploy_package.zip").Length / 1MB
Write-Host "`nDeployment package ready!" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  File: deploy_package.zip" -ForegroundColor White
Write-Host "  Size: $([math]::Round($zipSize, 2)) MB" -ForegroundColor White
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "  1. Upload deploy_package.zip to cPanel File Manager" -ForegroundColor White
Write-Host "  2. Extract it in your app directory (e.g. outside public_html)" -ForegroundColor White
Write-Host "  3. Open and edit .env to configure database credentials" -ForegroundColor White
Write-Host "  4. Set up Node.js app in cPanel pointing to server.js" -ForegroundColor White
Write-Host "  5. Run npm install and restart the application`n" -ForegroundColor White
