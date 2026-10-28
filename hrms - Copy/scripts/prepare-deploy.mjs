import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const standaloneDir = path.join(rootDir, '.next', 'standalone');
const staticSrc = path.join(rootDir, '.next', 'static');
const staticDest = path.join(standaloneDir, '.next', 'static');
const publicSrc = path.join(rootDir, 'public');
const publicDest = path.join(standaloneDir, 'public');
const webConfigSrc = path.join(rootDir, 'web.config');
const webConfigDest = path.join(standaloneDir, 'web.config');

function copyRecursiveSync(src, dest) {
  if (!fs.existsSync(src)) return;
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('📦 Preparing deployment package for SmarterASP.NET...');

if (!fs.existsSync(standaloneDir)) {
  console.error('❌ .next/standalone folder not found. Please run "npm run build" first.');
  process.exit(1);
}

// 1. Copy .next/static into .next/standalone/.next/static
console.log('➡️  Copying static assets (.next/static)...');
copyRecursiveSync(staticSrc, staticDest);

// 2. Copy public directory
if (fs.existsSync(publicSrc)) {
  console.log('➡️  Copying public folder...');
  copyRecursiveSync(publicSrc, publicDest);
}

// 3. Copy web.config into standalone root
if (fs.existsSync(webConfigSrc)) {
  console.log('➡️  Copying web.config...');
  fs.copyFileSync(webConfigSrc, webConfigDest);
}

// 4. Copy app.js into standalone root
const appJsSrc = path.join(rootDir, 'app.js');
const appJsDest = path.join(standaloneDir, 'app.js');
if (fs.existsSync(appJsSrc)) {
  console.log('➡️  Copying app.js startup file...');
  fs.copyFileSync(appJsSrc, appJsDest);
}

// 5. Create or update deploy.zip automatically
console.log('➡️  Compressing package into deploy.zip...');
try {
  const { execSync } = await import('child_process');
  const zipPath = path.join(rootDir, 'deploy.zip');
  execSync(`powershell -Command "Compress-Archive -Path '${standaloneDir}\\*' -DestinationPath '${zipPath}' -Force"`, { stdio: 'inherit' });
  console.log('✅ Generated fresh deploy.zip at project root!');
} catch (err) {
  console.warn('⚠️ Could not automatically compress deploy.zip:', err.message);
}

console.log('\n✅ Deployment bundle ready in: .next/standalone & deploy.zip');
console.log('📁 How to deploy:');
console.log('   1. Upload the newly created "deploy.zip" to your server root (/site1 or /wwwroot) and extract it,');
console.log('      OR upload the contents of ".next/standalone" directly.');
console.log('   2. Important: In your hosting control panel (e.g. SmarterASP.NET), click "Restart Site" / recycle the Application Pool, or re-upload web.config.');

