export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://fileconvert.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/api/', '/login', '/register'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
