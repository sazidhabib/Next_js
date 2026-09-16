import { getTopConversionPairs, getAllFormatIds, CATEGORIES, FORMATS } from '@/lib/formats'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://fileconvert.com'

const STATIC_PAGES = [
  { url: '/', changefreq: 'daily', priority: '1.0' },
  { url: '/pricing', changefreq: 'monthly', priority: '0.9' },
  { url: '/api', changefreq: 'monthly', priority: '0.8' },
  { url: '/docs', changefreq: 'monthly', priority: '0.7' },
  { url: '/blog', changefreq: 'weekly', priority: '0.7' },
  { url: '/security', changefreq: 'yearly', priority: '0.5' },
  { url: '/about', changefreq: 'yearly', priority: '0.5' },
  { url: '/contact', changefreq: 'yearly', priority: '0.5' },
  { url: '/privacy', changefreq: 'yearly', priority: '0.3' },
  { url: '/terms', changefreq: 'yearly', priority: '0.3' },
]

export default function sitemap() {
  const conversionPairs = getTopConversionPairs(300)
  const formatIds = getAllFormatIds()

  const conversionUrls = conversionPairs.map((pair) => ({
    url: `${BASE_URL}/${pair.from}-to-${pair.to}`,
    changefreq: 'monthly',
    priority: '0.6',
    lastModified: new Date(),
  }))

  const formatUrls = formatIds.map((id) => ({
    url: `${BASE_URL}/${id}-converter`,
    changefreq: 'monthly',
    priority: '0.6',
    lastModified: new Date(),
  }))

  const staticUrls = STATIC_PAGES.map((page) => ({
    url: `${BASE_URL}${page.url}`,
    changefreq: page.changefreq,
    priority: page.priority,
    lastModified: new Date(),
  }))

  return [...staticUrls, ...conversionUrls, ...formatUrls]
}
