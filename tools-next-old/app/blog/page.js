import Link from 'next/link'

export const metadata = {
  title: 'Blog',
  description: 'Product updates, guides, and news from the FileConvert team.',
}

const POSTS = [
  {
    slug: 'getting-started-with-file-conversion',
    title: 'Getting Started with File Conversion',
    date: '2024-01-15',
    excerpt: 'Learn how to convert your first file using FileConvert. A step-by-step guide for beginners.',
  },
  {
    slug: 'api-integration-guide',
    title: 'API Integration Guide',
    date: '2024-01-10',
    excerpt: 'How to integrate FileConvert into your application using our RESTful API.',
  },
  {
    slug: 'supported-formats-overview',
    title: 'Supported Formats Overview',
    date: '2024-01-05',
    excerpt: 'A comprehensive look at all 200+ file formats supported by FileConvert.',
  },
]

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-foreground mb-8">Blog</h1>
      <div className="space-y-6">
        {POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block rounded-xl border border-border bg-background p-6 hover:border-border-hover transition-colors"
          >
            <time className="text-xs text-muted">{post.date}</time>
            <h2 className="text-lg font-semibold text-foreground mt-1">{post.title}</h2>
            <p className="text-sm text-muted mt-2">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
