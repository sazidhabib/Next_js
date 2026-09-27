const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });

  await page.goto('https://hullotech.com/admin/login', { waitUntil: 'domcontentloaded' });
  await page.fill('input[type="email"]', 'admin@hullotech.com');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);

  await page.goto('https://hullotech.com/admin/products', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);

  await page.screenshot({ path: 'public/screenshots/hullotech_catalog_verified.png', fullPage: true });
  console.log('Saved verified catalog screenshot!');
  await browser.close();
})();
