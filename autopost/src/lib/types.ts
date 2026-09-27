export interface PriorityCategory {
  id: string;
  name: string;
  url?: string;
  priority: number; // 1 = highest
}

export interface ScraperConfig {
  targetUrl: string;
  priorityCategories: PriorityCategory[];
  maxProductsPerCategory: number;
  downloadImages: boolean;
  userAgent?: string;
}

export interface SpecField {
  label: string;
  value: string;
}

export interface SpecSection {
  sectionTitle: string;
  fields: SpecField[];
}

export interface AdminSelectors {
  loginUserSelector: string;
  loginPasswordSelector: string;
  loginSubmitSelector: string;
  // Product Details
  titleSelector: string;
  slugSelector: string;
  priceSelector: string;
  regularPriceSelector: string;
  categorySelector: string;
  subcategorySelector: string;
  subSubcategorySelector: string;
  brandSelector: string;
  modelSelector: string;
  warrantySelector: string;
  // Images
  mainImageInputSelector: string;
  galleryImageInputSelector: string;
  // Specifications
  keyFeaturesSelector: string;
  addSectionBtnSelector: string;
  sectionTitleInputSelector: string;
  addFieldBtnSelector: string;
  specLabelInputSelector: string;
  specValueInputSelector: string;
  // Description & Status
  descriptionSelector: string;
  featuredCheckboxSelector: string;
  inStockCheckboxSelector: string;
  // Submit & Validation
  saveButtonSelector: string;
  successIndicatorSelector?: string;
}

export interface AdminConfig {
  adminLoginUrl: string;
  adminUsername: string;
  adminPassword: string;
  newProductUrl: string;
  headless: boolean;
  slowMoMs: number;
  selectors: AdminSelectors;
}

export type ProductStatus = 'pending' | 'approved' | 'syncing' | 'synced' | 'failed';

export interface ProductItem {
  id: string;
  title: string;
  slug: string;
  price: number; // Price (৳)
  regularPrice?: number; // Regular Price (৳) (Strikethrough)
  currency: string; // '৳' or 'BDT'
  category: string;
  subcategory: string;
  subSubcategory?: string;
  brand: string;
  model: string;
  warranty: string;
  mainImage?: string;
  localMainImage?: string;
  galleryImages: string[];
  localGalleryImages?: string[];
  // Legacy / fallback image arrays
  images: string[];
  localImages?: string[];
  // Key features comma-separated string
  keyFeaturesText: string;
  // Structured specifications with sections & key-value fields
  structuredSpecs: SpecSection[];
  description: string;
  features: string[];
  specs: Record<string, string>;
  featuredProduct: boolean;
  inStock: boolean;
  sourceUrl: string;
  status: ProductStatus;
  errorMessage?: string;
  scrapedAt: string;
  syncedAt?: string;
}

export type LogLevel = 'info' | 'warn' | 'error' | 'success';

export interface AgentLog {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  category?: string;
  details?: string;
}

export interface AppStore {
  scraperConfig: ScraperConfig;
  adminConfig: AdminConfig;
  products: ProductItem[];
  logs: AgentLog[];
  isScrapingActive: boolean;
  isSyncingActive: boolean;
}

// Utility to create clean URL slugs
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
