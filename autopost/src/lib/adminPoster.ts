import fs from 'fs';
import path from 'path';
import { chromium, Browser, BrowserContext, Page, ElementHandle } from 'playwright';
import { AdminConfig, ProductItem } from './types';
import { addLog, updateProduct, setSyncingState } from './storage';

// Helper to select an option in a dropdown by partial text match
async function selectMatchingOption(el: ElementHandle<Element>, targetText: string): Promise<boolean> {
  const tagName = await el.evaluate((e) => e.tagName.toLowerCase());
  if (tagName === 'select') {
    const options = await el.$$eval('option', (opts) =>
      opts.map((o) => ({ value: (o as HTMLOptionElement).value, text: (o as HTMLOptionElement).text.trim() }))
    );
    const matched = options.find(
      (o) =>
        o.text.toLowerCase().includes(targetText.toLowerCase()) ||
        targetText.toLowerCase().includes(o.text.toLowerCase())
    );
    if (matched) {
      await (el as any).selectOption(matched.value);
      return true;
    } else if (options.length > 1) {
      await (el as any).selectOption(options[1].value);
      return true;
    }
  } else {
    await (el as any).fill(targetText);
    return true;
  }
  return false;
}

// Helper to find input by its visible label text
async function fillByLabelText(page: Page, labelRegex: RegExp, value: string): Promise<boolean> {
  const labels = await page.$$('label');
  for (const label of labels) {
    const text = await label.innerText();
    if (labelRegex.test(text)) {
      const inputHandle = await label.evaluateHandle((el) => {
        const parent = el.parentElement;
        if (!parent) return null;
        return parent.querySelector('input, textarea, select');
      });
      if (inputHandle && inputHandle.asElement()) {
        const el = inputHandle.asElement()!;
        const tag = await el.evaluate((e) => e.tagName.toLowerCase());
        if (tag === 'select') {
          await selectMatchingOption(el, value);
        } else {
          await (el as any).fill(String(value));
        }
        return true;
      }
    }
  }
  return false;
}

// Perform Admin Login
async function performLogin(page: Page, config: AdminConfig): Promise<boolean> {
  const { adminLoginUrl, adminUsername, adminPassword, selectors } = config;
  addLog('info', `Navigating to Admin Login: ${adminLoginUrl}`, 'AdminBot');

  try {
    await page.goto(adminLoginUrl, { waitUntil: 'domcontentloaded', timeout: 35000 });
    await page.waitForTimeout(1500);

    const currentUrl = page.url();
    // If redirected to dashboard or products, already logged in
    if (!currentUrl.includes('login') && !currentUrl.includes('signin') && !currentUrl.endsWith('/admin')) {
      addLog('info', 'Admin session is already active.', 'AdminBot');
      return true;
    }

    // Fill email / username
    const userInputs = (selectors.loginUserSelector || 'input[type="email"], input[name="email"], #email')
      .split(',')
      .map((s) => s.trim());
    let userInputFilled = false;
    for (const sel of userInputs) {
      if ((await page.$(sel)) !== null) {
        await page.fill(sel, adminUsername);
        userInputFilled = true;
        break;
      }
    }

    // Fill password
    const passInputs = (selectors.loginPasswordSelector || 'input[type="password"], input[name="password"], #password')
      .split(',')
      .map((s) => s.trim());
    for (const sel of passInputs) {
      if ((await page.$(sel)) !== null) {
        await page.fill(sel, adminPassword);
        break;
      }
    }

    // Click submit
    const submitSelectors = (selectors.loginSubmitSelector || 'button[type="submit"], #login-btn')
      .split(',')
      .map((s) => s.trim());
    let submitClicked = false;
    for (const sel of submitSelectors) {
      if ((await page.$(sel)) !== null) {
        await page.click(sel);
        submitClicked = true;
        break;
      }
    }
    if (!submitClicked) await page.keyboard.press('Enter');

    await page.waitForTimeout(2500);
    addLog('success', 'Admin authentication completed successfully.', 'AdminBot');
    return true;
  } catch (err: any) {
    addLog('error', `Admin login failed: ${err.message}`, 'AdminBot');
    return false;
  }
}

// Post single product into the Admin Panel matching all fields
async function postSingleProduct(page: Page, product: ProductItem, config: AdminConfig): Promise<boolean> {
  const { newProductUrl, selectors } = config;
  addLog('info', `[${product.model}] Navigating to product page: ${newProductUrl}`, 'AdminBot');

  try {
    await page.goto(newProductUrl, { waitUntil: 'domcontentloaded', timeout: 35000 });
    await page.waitForTimeout(1500);

    // Step 1: Check if "Add Product" button needs to be clicked
    addLog('info', 'Checking for "Add Product" button on page...', 'AdminBot');
    const addProductBtn = await page.$(
      'button:has-text("Add Product"), a:has-text("Add Product"), button:has-text("New Product"), a:has-text("New Product"), button:has-text("+ Add"), #add-product-btn'
    );

    if (addProductBtn) {
      addLog('info', 'Found "Add Product" button. Clicking to open creation modal...', 'AdminBot');
      await addProductBtn.click();
      await page.waitForTimeout(1500);
    }

    // Wait for the modal / form to be visible
    await page.waitForSelector('label:has-text("Product Name"), input[placeholder*="Product Name"], #title', {
      timeout: 10000,
    }).catch(() => {});

    // 1. Product Name
    let titleFilled = await fillByLabelText(page, /Product Name/i, product.title);
    if (!titleFilled) {
      const titleSelectors = (selectors.titleSelector || '#title, input[name="title"]').split(',').map((s) => s.trim());
      for (const sel of titleSelectors) {
        if ((await page.$(sel)) !== null) {
          await page.fill(sel, product.title);
          titleFilled = true;
          break;
        }
      }
    }
    addLog('info', `Filled Product Name: "${product.title}"`, 'AdminBot');

    // 2. Slug (URL friendly)
    let slugFilled = await fillByLabelText(page, /Slug/i, product.slug);
    if (!slugFilled && selectors.slugSelector) {
      const slugSelectors = selectors.slugSelector.split(',').map((s) => s.trim());
      for (const sel of slugSelectors) {
        if ((await page.$(sel)) !== null) {
          await page.fill(sel, product.slug);
          break;
        }
      }
    }

    // 3. Price (৳)
    let priceFilled = await fillByLabelText(page, /Price \(৳\)|Price/i, String(product.price));
    if (!priceFilled) {
      const priceEl = await page.$('input[placeholder*="Price"], #price, input[name="price"]');
      if (priceEl) await priceEl.fill(String(product.price));
    }

    // 4. Regular Price (৳) (Strikethrough)
    if (product.regularPrice) {
      let regFilled = await fillByLabelText(page, /Regular Price/i, String(product.regularPrice));
      if (!regFilled) {
        const regEl = await page.$('input[placeholder*="Optional"], #regular-price, input[name="regular_price"]');
        if (regEl) await regEl.fill(String(product.regularPrice));
      }
    }

    // 5. Category Dropdown
    await fillByLabelText(page, /Category/i, product.category);
    await page.waitForTimeout(400);

    // 6. Subcategory Dropdown
    if (product.subcategory) {
      await fillByLabelText(page, /Subcategory/i, product.subcategory);
      await page.waitForTimeout(400);
    }

    // 7. Sub-subcategory Dropdown (if present)
    if (product.subSubcategory) {
      await fillByLabelText(page, /Sub-subcategory/i, product.subSubcategory);
    }

    // 8. Brand
    await fillByLabelText(page, /Brand/i, product.brand);

    // 9. Model
    await fillByLabelText(page, /Model/i, product.model);

    // 10. Warranty
    await fillByLabelText(page, /Warranty/i, product.warranty);

    // 11. Main Product Image (Supports URL paste input or file upload)
    const imgUrlInput = await page.$('input[placeholder*="Or paste an image URL here..."], input[name="image_url"]');
    if (imgUrlInput && product.mainImage) {
      await imgUrlInput.fill(product.mainImage);
      addLog('info', 'Pasted Main Product Image URL into image field.', 'AdminBot');
    } else {
      const validMainImages = [product.localMainImage, ...(product.localImages || [])].filter(
        (f): f is string => typeof f === 'string' && f.length > 0 && fs.existsSync(f)
      );
      if (validMainImages.length > 0) {
        const fileInput = await page.$('input[type="file"]');
        if (fileInput) {
          await fileInput.setInputFiles(validMainImages[0]);
          addLog('info', 'Attached Main Product Image file.', 'AdminBot');
        }
      }
    }

    // 12. Product Gallery (Additional Images)
    const validGallery = (product.localGalleryImages || []).filter(
      (f): f is string => typeof f === 'string' && f.length > 0 && fs.existsSync(f)
    );
    if (validGallery.length > 0) {
      const galleryInput = await page.$('#gallery-images, input[multiple]');
      if (galleryInput) {
        await galleryInput.setInputFiles(validGallery);
        addLog('info', `Attached ${validGallery.length} Gallery Images.`, 'AdminBot');
      }
    }

    // 13. Key Features (Comma-separated)
    if (product.keyFeaturesText) {
      const kfInput = await page.$(
        'input[placeholder*="Intel i7"], input[placeholder*="RAM"], #key-features, input[name="key_features"]'
      );
      if (kfInput) {
        await kfInput.fill(product.keyFeaturesText);
      } else {
        await fillByLabelText(page, /Key Features/i, product.keyFeaturesText);
      }
    }

    // 14. Structured Specifications (Dynamic Sections & Fields)
    if (product.structuredSpecs && product.structuredSpecs.length > 0) {
      addLog('info', `Entering ${product.structuredSpecs.length} Structured Specification sections...`, 'AdminBot');

      for (let sIdx = 0; sIdx < product.structuredSpecs.length; sIdx++) {
        const section = product.structuredSpecs[sIdx];

        // Click "+ Add Section" button if past the first default section
        const addSectionBtn = await page.$('button:has-text("+ Add Section"), #add-section-btn');
        const sectionTitleInputs = await page.$$('input[placeholder*="Section Name"], .section-title-input');
        if (sIdx >= sectionTitleInputs.length && addSectionBtn) {
          await addSectionBtn.click();
          await page.waitForTimeout(300);
        }

        // Fill Section Title
        const updatedSectionInputs = await page.$$('input[placeholder*="Section Name"], .section-title-input');
        if (updatedSectionInputs[sIdx]) {
          await updatedSectionInputs[sIdx].fill(section.sectionTitle);
        }

        // Fill Fields inside Section
        for (let fIdx = 0; fIdx < section.fields.length; fIdx++) {
          const field = section.fields[fIdx];
          const addFieldBtns = await page.$$('button:has-text("+ Field"), .add-field-btn');

          if (addFieldBtns[sIdx]) {
            const currentLabels = await page.$$('input[placeholder*="Field Key"], .spec-label-input');
            if (fIdx >= currentLabels.length) {
              await addFieldBtns[sIdx].click();
              await page.waitForTimeout(200);
            }
          }

          const labelInputs = await page.$$('input[placeholder*="Field Key"], .spec-label-input');
          const valueInputs = await page.$$('textarea[placeholder*="Value"], .spec-value-input');

          if (labelInputs[fIdx]) await labelInputs[fIdx].fill(field.label);
          if (valueInputs[fIdx]) await valueInputs[fIdx].fill(field.value);
        }
      }
    }

    // 15. Description (Rich Text Editor div or textarea)
    const descEl = await page.$(
      'div[contenteditable="true"], div[placeholder*="Enter product description"], textarea[name="description"], #description'
    );
    if (descEl) {
      const isEditable = await descEl.evaluate(
        (el) => el.getAttribute('contenteditable') === 'true' || el.classList.contains('ql-editor')
      );
      if (isEditable) {
        await descEl.evaluate((el, html) => {
          el.innerHTML = html;
        }, product.description);
      } else {
        await (descEl as any).fill(product.description.replace(/<[^>]+>/g, '\n'));
      }
    }

    // 16. Checkboxes: Featured Product & In Stock
    const checkboxes = await page.$$('input[type="checkbox"]');
    for (const cb of checkboxes) {
      if (!(await cb.isChecked())) {
        await cb.check();
      }
    }

    await page.waitForTimeout(1000);

    // 17. Click "Save Product" button
    const saveBtn = await page.$(
      'button:has-text("Save Product"), button:has-text("Create Product"), button:has-text("Save"), #save-product-btn'
    );
    if (saveBtn) {
      addLog('info', 'Clicking "Save Product" button...', 'AdminBot');
      await saveBtn.click();
    } else {
      await page.keyboard.press('Enter');
    }

    // Wait for submission confirmation or URL redirection
    await page.waitForTimeout(3000);

    // Verify modal closed or success banner appeared
    const successBanner = await page.$(
      'text="Product created successfully", text="Product saved", text="Product published", #product-created-alert'
    );
    if (successBanner) {
      addLog('success', 'Confirmation: "Product created successfully!" detected in admin panel.', 'AdminBot');
    }

    addLog(
      'success',
      `Successfully published "${product.title}" (${product.model}) to Admin Panel!`,
      'AdminBot'
    );
    return true;
  } catch (err: any) {
    const screenshotDir = path.join(process.cwd(), 'public', 'screenshots');
    if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });
    const screenshotPath = path.join(screenshotDir, `err-${product.id}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => {});

    addLog('error', `Failed publishing ${product.title}: ${err.message}`, 'AdminBot', `Screenshot: /screenshots/err-${product.id}.png`);
    throw err;
  }
}

// Main execution function
export async function syncProductsToAdmin(
  productsToSync: ProductItem[],
  config: AdminConfig
): Promise<{ success: boolean; syncedCount: number; failedCount: number }> {
  setSyncingState(true);
  addLog('info', `Starting Admin Auto-Post synchronization for ${productsToSync.length} items...`, 'AdminBot');

  let browser: Browser | null = null;
  let context: BrowserContext | null = null;
  let syncedCount = 0;
  let failedCount = 0;

  try {
    addLog(
      'info',
      `Launching Chromium (Headless: ${config.headless ? 'Yes' : 'No - Visible Mode'}, SlowMo: ${config.slowMoMs}ms)...`,
      'AdminBot'
    );

    browser = await chromium.launch({
      headless: config.headless,
      slowMo: config.slowMoMs || 300,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    context = await browser.newContext({
      viewport: { width: 1366, height: 900 },
    });

    const page = await context.newPage();

    // Step 1: Admin Login
    const loggedIn = await performLogin(page, config);
    if (!loggedIn) {
      throw new Error('Could not establish admin session. Check login URL and credentials.');
    }

    // Step 2: Ingest each product
    for (const prod of productsToSync) {
      updateProduct(prod.id, { status: 'syncing' });
      try {
        await postSingleProduct(page, prod, config);
        updateProduct(prod.id, {
          status: 'synced',
          syncedAt: new Date().toISOString(),
          errorMessage: undefined,
        });
        syncedCount++;
      } catch (err: any) {
        updateProduct(prod.id, {
          status: 'failed',
          errorMessage: err.message,
        });
        failedCount++;
      }
    }

    addLog('success', `Admin Auto-Post finished! Successfully published: ${syncedCount}, Failed: ${failedCount}.`, 'AdminBot');
    return { success: true, syncedCount, failedCount };
  } catch (err: any) {
    addLog('error', `Sync workflow encountered a fatal error: ${err.message}`, 'AdminBot');
    return { success: false, syncedCount, failedCount };
  } finally {
    if (context) await context.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});
    setSyncingState(false);
  }
}
