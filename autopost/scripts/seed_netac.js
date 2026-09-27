const fs = require('fs');
const path = require('path');

const storePath = path.join(process.cwd(), '.data', 'agent_store.json');
const store = JSON.parse(fs.readFileSync(storePath, 'utf8'));

const sample = {
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
    'https://www.startech.com.bd/image/cache/catalog/ssd/netac/n535s/n535s-03-500x500.webp'
  ],
  images: [
    'https://www.startech.com.bd/image/cache/catalog/ssd/netac/n535s/n535s-001-500x500.webp',
    'https://www.startech.com.bd/image/cache/catalog/ssd/netac/n535s/n535s-02-500x500.webp'
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
        { label: 'Others', value: 'TRIM, S.M.A.R.T, LDPC ECC' }
      ]
    },
    {
      sectionTitle: 'Physical Specification',
      fields: [
        { label: 'Dimension', value: '100 × 70 × 7 mm' },
        { label: 'Weight', value: '54 g' }
      ]
    },
    {
      sectionTitle: 'Warranty',
      fields: [
        { label: 'Manufacturing Warranty', value: '3 years warranty' }
      ]
    }
  ],
  description: '<h2>Netac N535S 120GB 2.5-inch SATAIII SSD</h2><p>Netac N535S SSD comes with SATA III 6.0 Gbit/s (backwards compatible with 3.0 Gbit/s and 1.5 Gbit/s) interface. This SSD featured with Read Speed: 510MB/s, Write Speed: 440MB/s and Form Factor: 2.5". This new Netac N535S 120GB 2.5-inch SATAIII SSD has 3 years warranty.</p>',
  features: ['Capacity: 120GB', 'Form Factor: 2.5"', 'Interface: SATA III', '3 Years Warranty'],
  specs: {
    Capacity: '120GB',
    Interface: 'SATA III',
    Warranty: '3 years warranty'
  },
  featuredProduct: true,
  inStock: true,
  sourceUrl: 'https://www.startech.com.bd/netac-n535s-120gb-sataiii-ssd',
  status: 'pending',
  scrapedAt: new Date().toISOString()
};

// Filter out old if exists and prepend
store.products = [sample, ...store.products.filter(p => p.id !== 'prod-netac-n535s')];
fs.writeFileSync(storePath, JSON.stringify(store, null, 2));
console.log('Successfully staged Netac SSD with all structured fields');
