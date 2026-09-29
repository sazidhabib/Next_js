import {
  getAllFormatIds,
  isValidConversion,
  POPULAR_CONVERSIONS,
  getAllCategoryHubSlugs,
} from '@/lib/formats'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://tools.nextdigit.dev'

const STATIC_PAGES = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/pricing', changefreq: 'weekly', priority: 0.9 },
  { url: '/apis', changefreq: 'monthly', priority: 0.8 },
  { url: '/docs', changefreq: 'monthly', priority: 0.8 },
  { url: '/blog', changefreq: 'weekly', priority: 0.8 },
  { url: '/security', changefreq: 'monthly', priority: 0.6 },
  { url: '/about', changefreq: 'monthly', priority: 0.6 },
  { url: '/contact', changefreq: 'monthly', priority: 0.6 },
  { url: '/privacy', changefreq: 'yearly', priority: 0.4 },
  { url: '/terms', changefreq: 'yearly', priority: 0.4 },
]

export default function sitemap() {
  const allFormats = getAllFormatIds()
  const popularSet = new Set(POPULAR_CONVERSIONS.map((p) => `${p.from}-to-${p.to}`))
  const now = new Date()

  // Tier 1: Top high-volume popular conversion pairs
  const tier1Urls = POPULAR_CONVERSIONS.map((pair) => ({
    url: `${BASE_URL}/${pair.from}-to-${pair.to}`,
    changefreq: 'weekly',
    priority: 0.9,
    lastModified: now,
  }))

  // Tier 1.5: Broad Category Hub Pages (e.g. /image-converter, /video-converter)
  const tier1CategoryUrls = getAllCategoryHubSlugs().map((slug) => ({
    url: `${BASE_URL}/${slug}`,
    changefreq: 'weekly',
    priority: 0.85,
    lastModified: now,
  }))

  // Tier 2: Format hub pages (e.g. /pdf-converter, /mp4-converter)
  const tier2FormatUrls = allFormats.map((id) => ({
    url: `${BASE_URL}/${id}-converter`,
    changefreq: 'weekly',
    priority: 0.8,
    lastModified: now,
  }))

  // Tier 3: All other valid conversion pairs
  const tier3PairUrls = []
  for (const from of allFormats) {
    for (const to of allFormats) {
      if (isValidConversion(from, to)) {
        const key = `${from}-to-${to}`
        if (!popularSet.has(key)) {
          tier3PairUrls.push({
            url: `${BASE_URL}/${key}`,
            changefreq: 'monthly',
            priority: 0.7,
            lastModified: now,
          })
        }
      }
    }
  }

  // Static pages
  const staticUrls = STATIC_PAGES.map((page) => ({
    url: `${BASE_URL}${page.url}`,
    changefreq: page.changefreq,
    priority: page.priority,
    lastModified: now,
  }))

  return [
    ...staticUrls,
    ...tier1Urls,
    ...tier1CategoryUrls,
    ...tier2FormatUrls,
    ...tier3PairUrls,
  ]
}
