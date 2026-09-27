const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testHulloTech() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('1. Navigating to https://hullotech.com/admin...');
  try {
    await page.goto('https://hullotech.com/admin', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);
    console.log('Current URL after load:', page.url());

    // Take screenshot of login page
    await page.screenshot({ path: 'public/screenshots/hullotech_login.png' });
    console.log('Saved public/screenshots/hullotech_login.png');

    // Fill login
    const emailInput = await page.$('input[name="email"], input[type="email"], #email');
    const passwordInput = await page.$('input[name="password"], input[type="password"], #password');

    if (emailInput && passwordInput) {
      console.log('Found email and password fields. Typing credentials...');
      await emailInput.fill('admin@hullotech.com');
      await passwordInput.fill('admin123');

      const submitBtn = await page.$('button[type="submit"], input[type="submit"], #login-btn');
      if (submitBtn) {
        await submitBtn.click();
      } else {
        await page.keyboard.press('Enter');
      }
      await page.waitForTimeout(3000);
      console.log('URL after login:', page.url());
      await page.screenshot({ path: 'public/screenshots/hullotech_after_login.png' });
    } else {
      console.log('Email/Password input not found on page. HTML snippet:');
      const html = await page.content();
      console.log(html.slice(0, 1000));
    }

    // Now go to https://hullotech.com/admin/products
    console.log('2. Navigating to https://hullotech.com/admin/products...');
    await page.goto('https://hullotech.com/admin/products', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2500);
    console.log('URL at products page:', page.url());
    await page.screenshot({ path: 'public/screenshots/hullotech_products_page.png' });

    // Find "Add Product" button
    const addProductBtn = await page.$(
      'button:has-text("Add Product"), a:has-text("Add Product"), button:has-text("New Product"), a:has-text("New Product"), [data-testid="add-product"], button:has-text("+ Add")'
    );

    if (addProductBtn) {
      console.log('Found "Add Product" button! Text:', await addProductBtn.innerText());
      await addProductBtn.click();
      await page.waitForTimeout(2000);
      console.log('Clicked "Add Product". Capturing modal screenshot...');
      await page.screenshot({ path: 'public/screenshots/hullotech_add_product_modal.png' });

      // Dump all input names and IDs inside the modal
      const inputs = await page.$$eval('input, select, textarea, [contenteditable]', (elements) =>
        elements.map((el) => ({
          tag: el.tagName.toLowerCase(),
          id: el.id,
          name: el.getAttribute('name'),
          type: el.getAttribute('type'),
          placeholder: el.getAttribute('placeholder'),
          text: el.innerText ? el.innerText.slice(0, 30) : '',
        }))
      );
      console.log('Form inputs detected inside modal:', JSON.stringify(inputs, null, 2));
    } else {
      console.log('"Add Product" button NOT found directly. Listing all buttons and links:');
      const allButtons = await page.$$eval('button, a', (els) =>
        els.map((e) => ({
          tag: e.tagName.toLowerCase(),
          text: e.innerText?.trim(),
          href: e.getAttribute('href'),
          class: e.className,
        })).filter(b => b.text && b.text.length < 50)
      );
      console.log('Buttons & links on products page:', allButtons.slice(0, 30));
    }
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    await browser.close();
  }
}

testHulloTech();
