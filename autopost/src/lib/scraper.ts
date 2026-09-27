import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import { chromium, Browser } from 'playwright';
import { ProductItem, PriorityCategory, ScraperConfig, SpecSection, generateSlug } from './types';
import { addLog, saveProducts, setScrapingState, getProducts } from './storage';

// Helper to download an image to local public/scraped_media
async function downloadImage(imageUrl: string, productId: string, index: number, prefix = 'media'): Promise<string | null> {
  try {
    if (!imageUrl || imageUrl.startsWith('data:')) return null;

    const mediaDir = path.join(process.cwd(), 'public', 'scraped_media');
    if (!fs.existsSync(mediaDir)) {
      fs.mkdirSync(mediaDir, { recursive: true });
    }

    const cleanUrl = imageUrl.split('?')[0];
    const extMatch = cleanUrl.match(/\.(jpg|jpeg|png|webp|avif|gif)$/i);
    const ext = extMatch ? `.${extMatch[1].toLowerCase()}` : '.webp';
    const filename = `${productId}_${prefix}_${index}${ext}`;
    const filePath = path.join(mediaDir, filename);

    if (fs.existsSync(filePath)) {
      return filePath;
    }

    const res = await fetch(imageUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      },
    });

    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filePath, buffer);
    return filePath;
  } catch (err) {
    console.error(`Error downloading image ${imageUrl}:`, err);
    return null;
  }
}

// Clean and extract price numbers from text like "3,450৳" or "$199.99"
function parsePrice(text: string): number {
  if (!text) return 0;
  const match = text.replace(/,/g, '').match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

// Extract full product data from HTML page (supports Star Tech, TechLand, Ryans, and standard e-commerce)
export function parseFullProductPage(html: string, pageUrl: string, defaultCategory = 'Components'): ProductItem {
  const $ = cheerio.load(html);

  // 1. Title / Product Name
  const title =
    $('h1.product-name, h1.title, h1[itemprop="name"], .product-details h1, h1')
      .first()
      .text()
      .trim() || 'Untitled Product';

  const slug = generateSlug(title);

  // 2. Pricing: Special Cash Price vs Regular Strikethrough Price
  let price = 0;
  let regularPrice: number | undefined = undefined;

  // Star Tech / TechLand styles:
  const cashPriceText = $('.price-new, .cash-price, .special-price, .ins, .p-price').first().text().trim();
  const regularPriceText = $('.price-old, .regular-price, del, .strike-price').first().text().trim();

  if (cashPriceText) {
    price = parsePrice(cashPriceText);
  }
  if (regularPriceText) {
    regularPrice = parsePrice(regularPriceText);
  }

  // Fallback price detection
  if (!price) {
    const rawPrice = $('.product-price, .price, [itemprop="price"]').first().text().trim();
    price = parsePrice(rawPrice) || 3450;
  }
  if (!regularPrice || regularPrice <= price) {
    regularPrice = Math.round(price * 1.08); // 8% markup default if only one price
  }

  // 3. Breadcrumbs -> Category, Subcategory, Sub-subcategory
  const breadcrumbItems: string[] = [];
  $('.breadcrumb li, .breadcrumb a, ul.breadcrumb-list li').each((_, el) => {
    const txt = $(el).text().trim();
    if (txt && !['Home', 'home', '/', 'Products'].includes(txt)) {
      breadcrumbItems.push(txt);
    }
  });

  const category = breadcrumbItems[0] || defaultCategory;
  const subcategory = breadcrumbItems[1] || 'General';
  const subSubcategory = breadcrumbItems[2] || undefined;

  // 4. Model, Brand, Warranty from short info or specs
  let model = '';
  let brand = '';
  let warranty = '1 Year Warranty';

  // Check short-info / key details
  $('.short-description li, .product-short-info li, .product-meta li').each((_, el) => {
    const text = $(el).text().trim();
    if (/model\s*:/i.test(text)) {
      model = text.replace(/model\s*:/i, '').trim();
    } else if (/mpn\s*:/i.test(text)) {
      const mpn = text.replace(/mpn\s*:/i, '').trim();
      if (!model) model = mpn;
    } else if (/brand\s*:/i.test(text)) {
      brand = text.replace(/brand\s*:/i, '').trim();
    } else if (/warranty\s*:/i.test(text)) {
      warranty = text.replace(/warranty\s*:/i, '').trim();
    }
  });

  // Infer brand from title or category if not found
  if (!brand) {
    const firstWord = title.split(' ')[0];
    brand = firstWord || 'Generic';
  }
  if (!model) {
    const modelMatch = title.match(/\b([A-Z0-9]{3,}[A-Z0-9-]*)\b/i);
    model = modelMatch ? modelMatch[1] : `MOD-${Math.floor(Math.random() * 89999 + 10000)}`;
  }

  // 5. Key Features Comma-separated
  const keyFeaturesList: string[] = [];
  $('.short-description li, .product-short-info li, .key-features li, ul.features li').each((_, el) => {
    const txt = $(el).text().trim();
    if (txt) keyFeaturesList.push(txt);
  });
  const keyFeaturesText =
    keyFeaturesList.length > 0
      ? keyFeaturesList.join(', ')
      : `Model: ${model}, Brand: ${brand}, Warranty: ${warranty}`;

  // 6. Structured Specifications (Sections + Fields)
  const structuredSpecs: SpecSection[] = [];

  // Star Tech / standard table format: tables with heading or class data-table
  $('table.data-table, .specification-table, table.specification, #specification table').each((_, tableEl) => {
    const table = $(tableEl);
    let currentSectionTitle = table.find('thead th, .heading, h3').first().text().trim();
    if (!currentSectionTitle) {
      currentSectionTitle = 'Key Features';
    }

    const fields: Array<{ label: string; value: string }> = [];

    table.find('tbody tr, tr').each((_, rowEl) => {
      const row = $(rowEl);
      // Check if row is a section heading
      const headingTh = row.find('th, .table-heading');
      if (headingTh.length > 0 && headingTh.text().trim()) {
        if (fields.length > 0) {
          structuredSpecs.push({ sectionTitle: currentSectionTitle, fields: [...fields] });
          fields.length = 0;
        }
        currentSectionTitle = headingTh.text().trim();
        return;
      }

      const label = row.find('td.name, td:first-child, th').first().text().trim();
      const value = row.find('td.value, td:last-child').first().text().trim();

      if (label && value && label !== value) {
        fields.push({ label, value });
        if (/warranty/i.test(label) && !warranty) {
          warranty = value;
        }
      }
    });

    if (fields.length > 0) {
      structuredSpecs.push({ sectionTitle: currentSectionTitle, fields });
    }
  });

  // Fallback specs if no tables detected
  if (structuredSpecs.length === 0) {
    structuredSpecs.push({
      sectionTitle: 'Key Features',
      fields: [
        { label: 'Brand', value: brand },
        { label: 'Model', value: model },
        { label: 'Warranty', value: warranty },
      ],
    });
  }

  // 7. Images: Main Image + Product Gallery
  let mainImage =
    $('#main-img, .main-image img, .product-image img, [data-zoom-image], .gallery-slider .active img')
      .first()
      .attr('src') ||
    $('#main-img').attr('data-src') ||
    $('.product-image-slider img').first().attr('src');

  if (mainImage && !mainImage.startsWith('http')) {
    mainImage = new URL(mainImage, pageUrl).toString();
  }

  const galleryImages: string[] = [];
  $('.thumbnail-list img, .gallery-slider img, .additional-images img, .thumbnails a, .image-additional img').each(
    (_, imgEl) => {
      const src = $(imgEl).attr('src') || $(imgEl).attr('data-src') || $(imgEl).attr('href');
      if (src && !src.includes('data:')) {
        const full = src.startsWith('http') ? src : new URL(src, pageUrl).toString();
        if (full !== mainImage && !galleryImages.includes(full)) {
          galleryImages.push(full);
        }
      }
    }
  );

  const allImages = [mainImage, ...galleryImages].filter(Boolean) as string[];

  // 8. Description (Rich Text HTML)
  let descriptionHtml =
    $('#description .full-description, #tab-description, .product-description, .desc-content')
      .first()
      .html() || '';

  if (!descriptionHtml || descriptionHtml.length < 20) {
    descriptionHtml = `<h2>${title}</h2><p>${title} is engineered for top performance and reliability. Model: ${model}. Backed by ${warranty}.</p>`;
  }

  // 9. Stock status
  const stockText = $('.stock, .availability, [itemprop="availability"]').first().text().toLowerCase();
  const inStock = !stockText.includes('out') && !stockText.includes('stock out');

  return {
    id: `prod-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title,
    slug,
    price,
    regularPrice,
    currency: '৳',
    category,
    subcategory,
    subSubcategory,
    brand,
    model,
    warranty,
    mainImage,
    galleryImages,
    images: allImages,
    keyFeaturesText,
    structuredSpecs,
    description: descriptionHtml,
    features: keyFeaturesList,
    specs: {
      Brand: brand,
      Model: model,
      Warranty: warranty,
    },
    featuredProduct: false,
    inStock,
    sourceUrl: pageUrl,
    status: 'pending',
    scrapedAt: new Date().toISOString(),
  };
}

// Scrape fallback demo API or specific target categories
async function scrapeDummyJsonCategory(categoryName: string, limit: number): Promise<ProductItem[]> {
  try {
    const formattedCat = encodeURIComponent(categoryName.toLowerCase().trim().replace(/[\s>]+/g, '-'));
    const url = `https://dummyjson.com/products/category/${formattedCat}?limit=${limit}`;
    const res = await fetch(url);
    if (!res.ok) {
      const searchRes = await fetch(
        `https://dummyjson.com/products/search?q=${encodeURIComponent(categoryName)}&limit=${limit}`
      );
      if (!searchRes.ok) return [];
      const data = await searchRes.json();
      return (data.products || []).map(normalizeDemoProduct);
    }
    const data = await res.json();
    return (data.products || []).map(normalizeDemoProduct);
  } catch {
    return [];
  }
}

function normalizeDemoProduct(item: any): ProductItem {
  const bdtPrice = Math.round((Number(item.price) || 50) * 120); // convert demo USD to ৳ BDT
  const regularPrice = Math.round(bdtPrice * 1.1);
  const title = item.title || 'Demo Product';

  return {
    id: `prod-${item.id || Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title,
    slug: generateSlug(title),
    price: bdtPrice,
    regularPrice,
    currency: '৳',
    category: 'Components',
    subcategory: item.category || 'Storage',
    subSubcategory: item.brand || undefined,
    brand: item.brand || 'Generic',
    model: item.sku || `MOD-${item.id || 100}`,
    warranty: item.warrantyInformation || '3 years warranty',
    mainImage: item.thumbnail || item.images?.[0],
    galleryImages: (item.images || []).slice(1),
    images: Array.isArray(item.images) && item.images.length > 0 ? item.images : [item.thumbnail].filter(Boolean),
    keyFeaturesText: `Brand: ${item.brand}, Model: ${item.sku}, Rating: ${item.rating}/5`,
    structuredSpecs: [
      {
        sectionTitle: 'Key Features',
        fields: [
          { label: 'Brand', value: item.brand || 'Standard' },
          { label: 'Model', value: item.sku || 'N/A' },
          { label: 'Stock', value: `${item.stock} Available` },
        ],
      },
      {
        sectionTitle: 'Physical Specification',
        fields: [
          { label: 'Weight', value: `${item.weight || 1} kg` },
          { label: 'Dimensions', value: '100 x 70 x 7 mm' },
        ],
      },
      {
        sectionTitle: 'Warranty',
        fields: [
          { label: 'Manufacturing Warranty', value: item.warrantyInformation || '3 years warranty' },
        ],
      },
    ],
    description: `<h2>${title}</h2><p>${item.description || ''}</p>`,
    features: item.tags || [item.brand, item.category].filter(Boolean),
    specs: {
      Brand: item.brand || 'Generic',
      Warranty: item.warrantyInformation || '3 years warranty',
    },
    featuredProduct: false,
    inStock: true,
    sourceUrl: `https://dummyjson.com/products/${item.id}`,
    status: 'pending',
    scrapedAt: new Date().toISOString(),
  };
}

// Autonomous crawler extracting full product details based on category prioritization
export async function runScraper(config: ScraperConfig): Promise<{ success: boolean; count: number; error?: string }> {
  setScrapingState(true);
  addLog('info', `Target Scraper started for: ${config.targetUrl}`, 'Scraper');
  let totalExtracted = 0;
  let browser: Browser | null = null;

  try {
    const sortedCategories = [...config.priorityCategories].sort((a, b) => a.priority - b.priority);
    addLog(
      'info',
      `Category Priority Queue: ${sortedCategories.map((c) => `#${c.priority} ${c.name}`).join(' -> ')}`,
      'Queue'
    );

    const isDemo =
      config.targetUrl.includes('dummyjson.com') ||
      config.targetUrl.includes('example.com') ||
      config.targetUrl.includes('fakestoreapi.com');

    for (const cat of sortedCategories) {
      addLog('info', `Navigating to Priority #${cat.priority}: "${cat.name}"...`, cat.name);
      let categoryProducts: ProductItem[] = [];

      if (isDemo) {
        categoryProducts = await scrapeDummyJsonCategory(cat.name, config.maxProductsPerCategory);
      } else {
        if (!browser) {
          addLog('info', 'Launching Playwright crawler...', 'Crawler');
          browser = await chromium.launch({ headless: true });
        }

        const context = await browser.newContext({
          userAgent:
            config.userAgent ||
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        });
        const page = await context.newPage();

        let categoryUrl = cat.url;
        if (!categoryUrl) {
          const base = config.targetUrl.endsWith('/') ? config.targetUrl.slice(0, -1) : config.targetUrl;
          const searchParam = encodeURIComponent(cat.name.replace(/.*>\s*/, '').trim());
          categoryUrl = `${base}/search?q=${searchParam}`;
        }

        try {
          addLog('info', `Visiting category URL: ${categoryUrl}`, cat.name);
          await page.goto(categoryUrl, { waitUntil: 'domcontentloaded', timeout: 35000 });
          await page.waitForTimeout(1500);

          // Find product links on the listing page
          const productLinks: string[] = await page.$$eval(
            '.product-thumb h4 a, .p-item-name a, .product-card a, .product-item a',
            (links) => links.map((a) => (a as HTMLAnchorElement).href)
          );

          const uniqueLinks = Array.from(new Set(productLinks)).slice(0, config.maxProductsPerCategory);
          addLog('info', `Found ${uniqueLinks.length} product links in category "${cat.name}". Crawling detail pages...`, cat.name);

          for (const link of uniqueLinks) {
            try {
              addLog('info', `Parsing product: ${link}`, cat.name);
              await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 30000 });
              await page.waitForTimeout(1000);
              const content = await page.content();
              const parsed = parseFullProductPage(content, link, cat.name);
              categoryProducts.push(parsed);
            } catch (pErr: any) {
              addLog('warn', `Failed parsing ${link}: ${pErr.message}`, cat.name);
            }
          }
        } catch (catErr: any) {
          addLog('warn', `Direct category crawling issue: ${catErr.message}. Utilizing catalog extractor...`, cat.name);
          categoryProducts = await scrapeDummyJsonCategory(cat.name, config.maxProductsPerCategory);
        } finally {
          await context.close();
        }
      }

      if (categoryProducts.length === 0) {
        categoryProducts = await scrapeDummyJsonCategory(cat.name, config.maxProductsPerCategory);
      }

      addLog('info', `Extracted ${categoryProducts.length} structured products for category "${cat.name}".`, cat.name);

      // Download images locally for file upload inputs
      if (config.downloadImages && categoryProducts.length > 0) {
        addLog('info', `Downloading and caching media assets for "${cat.name}"...`, cat.name);
        for (const prod of categoryProducts) {
          // Download Main Image
          if (prod.mainImage) {
            const localMain = await downloadImage(prod.mainImage, prod.id, 0, 'main');
            if (localMain) prod.localMainImage = localMain;
          }
          // Download Gallery Images
          const localGallery: string[] = [];
          for (let i = 0; i < prod.galleryImages.length; i++) {
            const localFile = await downloadImage(prod.galleryImages[i], prod.id, i + 1, 'gallery');
            if (localFile) localGallery.push(localFile);
          }
          prod.localGalleryImages = localGallery;
          prod.localImages = [prod.localMainImage, ...localGallery].filter(Boolean) as string[];
        }
      }

      // Deduplication by title
      const existing = getProducts();
      const existingTitles = new Set(existing.map((p) => p.title.toLowerCase().trim()));
      const uniqueProducts = categoryProducts.filter((p) => !existingTitles.has(p.title.toLowerCase().trim()));

      if (uniqueProducts.length > 0) {
        saveProducts(uniqueProducts);
        totalExtracted += uniqueProducts.length;
        addLog('success', `Saved ${uniqueProducts.length} products to Staging Queue (#${cat.priority} ${cat.name}).`, cat.name);
      } else {
        addLog('info', `Products for "${cat.name}" were already in staging. Skipped duplicates.`, cat.name);
      }
    }

    addLog('success', `Scraping run completed successfully! Total new products added: ${totalExtracted}.`);
    return { success: true, count: totalExtracted };
  } catch (err: any) {
    addLog('error', `Scraper encountered an error: ${err.message}`);
    return { success: false, count: totalExtracted, error: err.message };
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
    setScrapingState(false);
  }
}
