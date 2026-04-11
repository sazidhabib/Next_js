# ============================================================
# Deployment Script for pathakbondhu.com (cPanel)
# Run this from your project root in PowerShell:
#   .\deploy.ps1
# ============================================================

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Pathak Bondhu - cPanel Deploy Builder" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

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

# Step 3: Create deploy_package directory
Write-Host "`n[3/5] Assembling deployment package..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "deploy_package" -Force | Out-Null

# Copy .next build output (exclude cache to reduce size)
Write-Host "  Copying .next build..." -ForegroundColor Gray
Copy-Item -Recurse ".next" "deploy_package\.next" -Force
if (Test-Path "deploy_package\.next\cache") {
    Remove-Item -Recurse -Force "deploy_package\.next\cache"
}

# Copy backend directories
$backendDirs = @("controllers", "config", "db", "lib", "middlewares", "migrations", "models", "router", "services", "utils", "validators", "public")
foreach ($dir in $backendDirs) {
    if (Test-Path $dir) {
        Write-Host "  Copying $dir..." -ForegroundColor Gray
        Copy-Item -Recurse $dir "deploy_package\$dir" -Force
    }
}

# Copy uploads directory (empty structure if no files needed)
if (Test-Path "uploads") {
    Write-Host "  Copying uploads..." -ForegroundColor Gray
    Copy-Item -Recurse "uploads" "deploy_package\uploads" -Force
}

# Copy essential root files
$rootFiles = @(
    "server.js",
    "package.json",
    "package-lock.json",
    ".npmrc",
    ".htaccess",
    ".env.production",
    "middleware.js",
    "next.config.mjs",
    "postcss.config.mjs",
    "tailwind.config.js",
    "jsconfig.json",
    "run-migration.js"
)
foreach ($file in $rootFiles) {
    if (Test-Path $file) {
        Write-Host "  Copying $file..." -ForegroundColor Gray
        Copy-Item $file "deploy_package\$file" -Force
    }
}

# Copy the app directory (Next.js app router pages - needed for SSR)
if (Test-Path "app") {
    Write-Host "  Copying app directory..." -ForegroundColor Gray
    Copy-Item -Recurse "app" "deploy_package\app" -Force
}

# Rename .env.production to .env in deploy package
if (Test-Path "deploy_package\.env.production") {
    Rename-Item "deploy_package\.env.production" ".env"
    Write-Host "  Renamed .env.production -> .env" -ForegroundColor Gray
}

# Step 4: Create ZIP
Write-Host "`n[4/5] Creating deploy_package.zip..." -ForegroundColor Yellow
Compress-Archive -Path "deploy_package\*" -DestinationPath "deploy_package.zip" -Force
Write-Host "  deploy_package.zip created." -ForegroundColor Green

# Step 5: Report
$zipSize = (Get-Item "deploy_package.zip").Length / 1MB
Write-Host "`n[5/5] Deployment package ready!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  File: deploy_package.zip" -ForegroundColor White
Write-Host "  Size: $([math]::Round($zipSize, 2)) MB" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "  1. Upload deploy_package.zip to cPanel File Manager" -ForegroundColor White
Write-Host "  2. Extract it in your app directory" -ForegroundColor White
Write-Host "  3. Edit .env with your cPanel MySQL credentials" -ForegroundColor White
Write-Host "  4. Set up Node.js app in cPanel (see CPANEL_DEPLOY_GUIDE.md)" -ForegroundColor White
Write-Host "  5. Run npm install and restart`n" -ForegroundColor White
