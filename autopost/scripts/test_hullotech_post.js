const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testHulloTechPost() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const page = await context.newPage();

  console.log('1. Logging in to https://hullotech.com/admin...');
  await page.goto('https://hullotech.com/admin', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(1500);

  const emailInput = await page.$('input[name="email"], input[type="email"], #email');
  const passwordInput = await page.$('input[name="password"], input[type="password"], #password');

  if (emailInput && passwordInput) {
    await emailInput.fill('admin@hullotech.com');
    await passwordInput.fill('admin123');
    const submitBtn = await page.$('button[type="submit"], input[type="submit"], #login-btn');
    if (submitBtn) await submitBtn.click();
    else await page.keyboard.press('Enter');
    await page.waitForTimeout(2500);
  }

  console.log('2. Navigating to https://hullotech.com/admin/products...');
  await page.goto('https://hullotech.com/admin/products', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Check if "Add Product" button is on the page
  console.log('3. Checking for "Add Product" button...');
  const addBtn = await page.$(
    'button:has-text("Add Product"), a:has-text("Add Product"), button:has-text("New Product"), a:has-text("New Product"), button:has-text("+ Add")'
  );

  if (addBtn) {
    console.log('Clicking "Add Product" button...');
    await addBtn.click();
    await page.waitForTimeout(1500);
  }

  // Verify modal is open
  const modalHeader = await page.$('h1:has-text("Add"), h2:has-text("Add"), label:has-text("Product Name")');
  if (!modalHeader) {
    console.error('Modal did not appear!');
    await browser.close();
    return;
  }
  console.log('Modal is open! Starting field inspection & test filling...');

  // Helper to fill by label or container
  async function fillByLabel(labelRegex, value) {
    const labels = await page.$$('label');
    for (const label of labels) {
      const text = await label.innerText();
      if (labelRegex.test(text)) {
        // Look for input inside the same parent or following sibling
        const input = await label.evaluateHandle((el) => {
          const parent = el.parentElement;
          return parent.querySelector('input, textarea, select');
        });
        if (input && input.asElement()) {
          const el = input.asElement();
          const tag = await el.evaluate((e) => e.tagName.toLowerCase());
          if (tag === 'select') {
            const options = await el.$$eval('option', (opts) =>
              opts.map((o) => ({ value: o.value, text: o.text.trim() }))
            );
            const matched = options.find((o) => o.text.toLowerCase().includes(value.toLowerCase()));
            if (matched) await el.selectOption(matched.value);
            else if (options.length > 1) await el.selectOption(options[1].value);
          } else {
            await el.fill(String(value));
          }
          console.log(`Filled [${text.trim()}]: ${value}`);
          return true;
        }
      }
    }
    return false;
  }

  await fillByLabel(/Product Name/i, 'Arctic Alpine 23 CO Compact AMD CPU Cooler');
  await fillByLabel(/Slug/i, 'arctic-alpine-23-co-compact-amd-cpu-cooler');
  await fillByLabel(/Price \(৳\)/i, '1200');
  await fillByLabel(/Regular Price/i, '1350');
  await fillByLabel(/Category/i, 'Components');
  await page.waitForTimeout(500);
  await fillByLabel(/Subcategory/i, 'CPU Cooler');
  await fillByLabel(/Brand/i, 'Arctic');
  await fillByLabel(/Model/i, 'Alpine 23 CO');
  await fillByLabel(/Warranty/i, '6 Years Warranty');

  // Fill Main Product Image URL
  const imgUrlInput = await page.$('input[placeholder*="Or paste an image URL here..."]');
  if (imgUrlInput) {
    await imgUrlInput.fill('https://www.startech.com.bd/image/cache/catalog/cpu-cooler/arctic/alpine-23-co/alpine-23-co-01-500x500.jpg');
    console.log('Filled image URL input.');
  }

  // Fill Key Features
  const keyFeaturesInput = await page.$('input[placeholder*="Intel i7"], input[placeholder*="RAM"]');
  if (keyFeaturesInput) {
    await keyFeaturesInput.fill('Compatibility: AMD AM4/AM5, Fan: 900–2000 RPM, Bearing: Dual Ball Bearing');
    console.log('Filled Key Features.');
  }

  // Structured Specifications: Section Title
  const sectionTitleInput = await page.$('input[placeholder*="Section Name"]');
  if (sectionTitleInput) {
    await sectionTitleInput.fill('Key Features');
    console.log('Filled Section Title.');
  }

  // Description
  const descEl = await page.$('div[contenteditable="true"], div[placeholder*="Enter product description"]');
  if (descEl) {
    await descEl.evaluate((el) => {
      el.innerHTML = '<p>Arctic Alpine 23 CO Compact AMD CPU Cooler is designed for continuous operation.</p>';
    });
    console.log('Filled Rich Description.');
  }

  // Checkboxes
  const checkboxes = await page.$$('input[type="checkbox"]');
  for (const cb of checkboxes) {
    if (!(await cb.isChecked())) await cb.check();
  }
  console.log(`Checked ${checkboxes.length} checkboxes.`);

  await page.screenshot({ path: 'public/screenshots/hullotech_filled_form.png' });
  console.log('Saved public/screenshots/hullotech_filled_form.png');

  // Find Save Product button
  const saveBtn = await page.$(
    'button:has-text("Save Product"), button:has-text("Create Product"), button:has-text("Save")'
  );
  if (saveBtn) {
    console.log('Found Save Button:', await saveBtn.innerText());
    await saveBtn.click();
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'public/screenshots/hullotech_after_save.png' });
    console.log('Saved public/screenshots/hullotech_after_save.png. Current URL:', page.url());
  } else {
    console.error('Save Button NOT found!');
  }

  await browser.close();
}

testHulloTechPost();
