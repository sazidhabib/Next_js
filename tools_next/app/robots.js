export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tools.nextdigit.dev'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/*',
          '/api/*',
          '/login',
          '/register',
          '/checkout',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/dashboard/*',
          '/api/*',
          '/login',
          '/register',
          '/checkout',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
