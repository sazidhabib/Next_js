/**
 * Sync Live Data Script
 * Downloads the latest portfolio-content.json and uploaded media from your live production website
 * into your local project before building.
 *
 * Usage:
 *   node scripts/sync-live-data.mjs https://yourdomain.com
 *   npm run sync:live -- https://yourdomain.com
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let liveUrl = process.argv[2] || process.env.LIVE_SITE_URL || '';

if (!liveUrl) {
  console.error('\x1b[31m[Error] Please provide your live website URL.\x1b[0m');
  console.log('\x1b[33mExample:\x1b[0m');
  console.log('  node scripts/sync-live-data.mjs https://sazidhabib.com\n');
  process.exit(1);
}

// Clean trailing slash
liveUrl = liveUrl.trim().replace(/\/+$/, '');

async function fetchJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'SazidPortfolioSync/1.0' } });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }
  return await res.json();
}

async function downloadFile(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download ${url}: ${res.status}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
}

async function main() {
  console.log(`\n\x1b[36m>>> Fetching live content from ${liveUrl}...\x1b[0m`);

  const jsonUrl = `${liveUrl}/data/portfolio-content.json`;
  let liveData;

  try {
    liveData = await fetchJson(jsonUrl);
    console.log(`\x1b[32m✓ Downloaded live portfolio-content.json successfully.\x1b[0m`);
  } catch (err) {
    console.error(`\x1b[31m[Error] Could not fetch ${jsonUrl}: ${err.message}\x1b[0m`);
    process.exit(1);
  }

  // Backup existing local data just in case
  const localDataPath = path.join(rootDir, 'public', 'data', 'portfolio-content.json');
  if (fs.existsSync(localDataPath)) {
    const backupPath = path.join(rootDir, 'public', 'data', `portfolio-content.backup-${Date.now()}.json`);
    fs.copyFileSync(localDataPath, backupPath);
    console.log(`  (Created local backup: ${path.basename(backupPath)})`);
  }

  // Save new content
  fs.mkdirSync(path.dirname(localDataPath), { recursive: true });
  fs.writeFileSync(localDataPath, JSON.stringify(liveData, null, 2), 'utf-8');
  console.log(`\x1b[32m✓ Saved to local: public/data/portfolio-content.json\x1b[0m`);

  // Scan JSON string for any uploaded assets in /uploads/
  const jsonStr = JSON.stringify(liveData);
  const uploadRegex = /\/?uploads\/[a-zA-Z0-9_\-\.\/]+/g;
  const matches = [...new Set(jsonStr.match(uploadRegex) || [])];

  if (matches.length > 0) {
    console.log(`\n\x1b[36m>>> Checking ${matches.length} media file(s) referenced in live content...\x1b[0m`);
    let downloadedCount = 0;

    for (const relUrl of matches) {
      const cleanRel = relUrl.replace(/^\/+/, '');
      const localFilePath = path.join(rootDir, 'public', cleanRel);

      if (!fs.existsSync(localFilePath)) {
        const fileRemoteUrl = `${liveUrl}/${cleanRel}`;
        try {
          process.stdout.write(`  Downloading missing: ${cleanRel} ... `);
          await downloadFile(fileRemoteUrl, localFilePath);
          console.log(`\x1b[32mDone\x1b[0m`);
          downloadedCount++;
        } catch (downloadErr) {
          console.log(`\x1b[33mWarning: ${downloadErr.message}\x1b[0m`);
        }
      }
    }

    if (downloadedCount > 0) {
      console.log(`\x1b[32m✓ Successfully downloaded ${downloadedCount} missing media file(s) to public/uploads/.\x1b[0m`);
    } else {
      console.log(`\x1b[32m✓ All referenced media files are already present locally.\x1b[0m`);
    }
  }

  console.log(`\n\x1b[32m✔ Live sync complete! You can now safely run:\x1b[0m`);
  console.log(`  \x1b[33mnpm run build\x1b[0m\n`);
}

main().catch(e => {
  console.error('\x1b[31m[Sync Failed]:\x1b[0m', e);
  process.exit(1);
});

