import fs from 'fs';
import path from 'path';
import { AppStore, ProductItem, AgentLog, ScraperConfig, AdminConfig } from './types';

const DATA_DIR = path.join(process.cwd(), '.data');
const STORE_PATH = path.join(DATA_DIR, 'agent_store.json');

const DEFAULT_SCRAPER_CONFIG: ScraperConfig = {
  targetUrl: 'https://demo-ecommerce.dummyjson.com',
  priorityCategories: [
    { id: 'cat-1', name: 'smartphones', priority: 1 },
    { id: 'cat-2', name: 'laptops', priority: 2 },
    { id: 'cat-3', name: 'fragrances', priority: 3 },
  ],
  maxProductsPerCategory: 5,
  downloadImages: true,
};

const DEFAULT_ADMIN_CONFIG: AdminConfig = {
  adminLoginUrl: 'http://localhost:3002/mock-admin/login',
  adminUsername: 'admin@mystore.com',
  adminPassword: 'Password123!',
  newProductUrl: 'http://localhost:3002/mock-admin/products/new',
  headless: false,
  slowMoMs: 500,
  selectors: {
    loginUserSelector: 'input[name="email"], input[type="email"], #email',
    loginPasswordSelector: 'input[name="password"], input[type="password"], #password',
    loginSubmitSelector: 'button[type="submit"], #login-btn',
    // Product Info
    titleSelector: 'input[name="title"], input[name="name"], #title',
    slugSelector: 'input[name="slug"], #slug',
    priceSelector: 'input[name="price"], #price',
    regularPriceSelector: 'input[name="regular_price"], input[name="regularPrice"], #regular-price',
    categorySelector: 'select[name="category"], #category',
    subcategorySelector: 'select[name="subcategory"], #subcategory',
    subSubcategorySelector: 'select[name="sub_subcategory"], #sub-subcategory',
    brandSelector: 'input[name="brand"], select[name="brand"], #brand',
    modelSelector: 'input[name="model"], #model, input[name="sku"], #sku',
    warrantySelector: 'input[name="warranty"], #warranty',
    // Media
    mainImageInputSelector: '#main-product-image, input[name="main_image"], input[type="file"]',
    galleryImageInputSelector: '#gallery-images, input[name="gallery_images"], input[multiple]',
    // Specifications
    keyFeaturesSelector: 'input[name="key_features"], textarea[name="key_features"], #key-features',
    addSectionBtnSelector: 'button:has-text("+ Add Section"), #add-section-btn',
    sectionTitleInputSelector: 'input[placeholder*="Section Title"], .section-title-input',
    addFieldBtnSelector: 'button:has-text("+ Field"), .add-field-btn',
    specLabelInputSelector: 'input[placeholder*="Label"], input[placeholder*="Key"], .spec-label-input',
    specValueInputSelector: 'input[placeholder*="Value"], textarea[placeholder*="Value"], .spec-value-input',
    // Description & Status
    descriptionSelector: 'textarea[name="description"], #description, .ql-editor, div[contenteditable="true"]',
    featuredCheckboxSelector: 'input[name="featured"], #featured-checkbox',
    inStockCheckboxSelector: 'input[name="in_stock"], #in-stock-checkbox',
    // Submission
    saveButtonSelector: 'button:has-text("Save Product"), button[type="submit"], #save-product-btn',
    successIndicatorSelector: '.success-badge, #product-created-alert',
  },
};

const SAMPLE_INITIAL_PRODUCT: ProductItem = {
  id: 'prod-netac-n535s',
  title: 'Netac N535S 120GB 2.5-inch SATAIII SSD',
  slug: 'netac-n535s-120gb-25-inch-sataii',
  price: 3450,
  regularPrice: 3740,
  currency: '৳',
  category: 'Components',
  subcategory: 'SSD',
  subSubcategory: 'Netac',
  brand: 'Netac',
  model: 'N535S',
  warranty: '3 years warranty',
  mainImage: 'https://www.startech.com.bd/image/cache/catalog/ssd/netac/n535s/n535s-001-500x500.webp',
  galleryImages: [
    'https://www.startech.com.bd/image/cache/catalog/ssd/netac/n535s/n535s-02-500x500.webp',
    'https://www.startech.com.bd/image/cache/catalog/ssd/netac/n535s/n535s-03-500x500.webp',
  ],
  images: [
    'https://www.startech.com.bd/image/cache/catalog/ssd/netac/n535s/n535s-001-500x500.webp',
    'https://www.startech.com.bd/image/cache/catalog/ssd/netac/n535s/n535s-02-500x500.webp',
  ],
  keyFeaturesText: 'MPN: NT01N535S-120G-S3X, Model: N535S, Read Speed: 510MB/s, Write Speed: 440MB/s',
  structuredSpecs: [
    {
      sectionTitle: 'Key Features',
      fields: [
        { label: 'Capacity', value: '120GB' },
        { label: 'Form Factor', value: '2.5"' },
        { label: 'Flash Type', value: '3D NAND Flash' },
        { label: 'Interface', value: 'SATA III' },
        { label: 'Sequential R/W', value: 'Read Speed 510MB/s\nWrite Speed 440MB/s' },
        { label: 'Others', value: 'TRIM, S.M.A.R.T, LDPC ECC' },
      ],
    },
    {
      sectionTitle: 'Physical Specification',
      fields: [
        { label: 'Dimension', value: '100 × 70 × 7 mm' },
        { label: 'Weight', value: '54 g' },
      ],
    },
    {
      sectionTitle: 'Warranty',
      fields: [
        { label: 'Manufacturing Warranty', value: '3 years warranty' },
      ],
    },
  ],
  description:
    '<h2>Netac N535S 120GB 2.5-inch SATAIII SSD</h2><p>Netac N535S SSD comes with SATA III 6.0 Gbit/s (backwards compatible with 3.0 Gbit/s and 1.5 Gbit/s) interface. This SSD featured with Read Speed: 510MB/s, Write Speed: 440MB/s and Form Factor: 2.5". This new Netac N535S 120GB 2.5-inch SATAIII SSD has 3 years warranty.</p>',
  features: ['Capacity: 120GB', 'Form Factor: 2.5"', 'Interface: SATA III', '3 Years Warranty'],
  specs: {
    Capacity: '120GB',
    Interface: 'SATA III',
    Warranty: '3 years warranty',
  },
  featuredProduct: true,
  inStock: true,
  sourceUrl: 'https://www.startech.com.bd/netac-n535s-120gb-sataiii-ssd',
  status: 'pending',
  scrapedAt: new Date().toISOString(),
};

const DEFAULT_STORE: AppStore = {
  scraperConfig: {
    targetUrl: 'https://www.startech.com.bd',
    priorityCategories: [
      { id: 'cat-1', name: 'Components > SSD', priority: 1 },
      { id: 'cat-2', name: 'Components > RAM', priority: 2 },
      { id: 'cat-3', name: 'Components > Processor', priority: 3 },
    ],
    maxProductsPerCategory: 5,
    downloadImages: true,
  },
  adminConfig: DEFAULT_ADMIN_CONFIG,
  products: [SAMPLE_INITIAL_PRODUCT],
  logs: [
    {
      id: 'log-init',
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Product AutoPost Agent initialized with Star Tech / E-commerce SSD schema.',
    },
  ],
  isScrapingActive: false,
  isSyncingActive: false,
};

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const mediaDir = path.join(process.cwd(), 'public', 'scraped_media');
  if (!fs.existsSync(mediaDir)) {
    fs.mkdirSync(mediaDir, { recursive: true });
  }
}

export function readStore(): AppStore {
  ensureDataDir();
  try {
    if (!fs.existsSync(STORE_PATH)) {
      writeStore(DEFAULT_STORE);
      return DEFAULT_STORE;
    }
    const raw = fs.readFileSync(STORE_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STORE,
      ...parsed,
      scraperConfig: { ...DEFAULT_SCRAPER_CONFIG, ...(parsed.scraperConfig || {}) },
      adminConfig: {
        ...DEFAULT_ADMIN_CONFIG,
        ...(parsed.adminConfig || {}),
        selectors: { ...DEFAULT_ADMIN_CONFIG.selectors, ...(parsed.adminConfig?.selectors || {}) },
      },
    };
  } catch (err) {
    console.error('Failed to read store, falling back to default:', err);
    return DEFAULT_STORE;
  }
}

export function writeStore(store: AppStore): void {
  ensureDataDir();
  const tempPath = `${STORE_PATH}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(store, null, 2), 'utf-8');
  fs.renameSync(tempPath, STORE_PATH);
}

export function addLog(level: AgentLog['level'], message: string, category?: string, details?: string): AgentLog {
  const store = readStore();
  const log: AgentLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    level,
    message,
    category,
    details,
  };
  store.logs.unshift(log);
  if (store.logs.length > 500) {
    store.logs = store.logs.slice(0, 500);
  }
  writeStore(store);
  return log;
}

export function getProducts(): ProductItem[] {
  return readStore().products;
}

export function saveProducts(products: ProductItem[]): void {
  const store = readStore();
  // Merge or update products by id or title
  const existingMap = new Map(store.products.map((p) => [p.id, p]));
  for (const prod of products) {
    existingMap.set(prod.id, prod);
  }
  store.products = Array.from(existingMap.values());
  writeStore(store);
}

export function updateProduct(id: string, updates: Partial<ProductItem>): ProductItem | null {
  const store = readStore();
  const index = store.products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  store.products[index] = { ...store.products[index], ...updates };
  writeStore(store);
  return store.products[index];
}

export function deleteProduct(id: string): boolean {
  const store = readStore();
  const initialLength = store.products.length;
  store.products = store.products.filter((p) => p.id !== id);
  if (store.products.length !== initialLength) {
    writeStore(store);
    return true;
  }
  return false;
}

export function clearProducts(): void {
  const store = readStore();
  store.products = [];
  writeStore(store);
}

export function clearLogs(): void {
  const store = readStore();
  store.logs = [];
  writeStore(store);
}

export function updateScraperConfig(config: Partial<ScraperConfig>): ScraperConfig {
  const store = readStore();
  store.scraperConfig = { ...store.scraperConfig, ...config };
  writeStore(store);
  return store.scraperConfig;
}

export function updateAdminConfig(config: Partial<AdminConfig>): AdminConfig {
  const store = readStore();
  store.adminConfig = {
    ...store.adminConfig,
    ...config,
    selectors: {
      ...store.adminConfig.selectors,
      ...(config.selectors || {}),
    },
  };
  writeStore(store);
  return store.adminConfig;
}

export function setScrapingState(isActive: boolean): void {
  const store = readStore();
  store.isScrapingActive = isActive;
  writeStore(store);
}

export function setSyncingState(isActive: boolean): void {
  const store = readStore();
  store.isSyncingActive = isActive;
  writeStore(store);
}
