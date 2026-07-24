'use client'

import Link from 'next/link'

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/apis', label: 'API' },
  { href: '/docs', label: 'Docs' },
  { href: '/blog', label: 'Blog' },
]

export default function MobileNav({ open, onClose }) {
  if (!open) return null

  return (
    <div className="md:hidden border-t border-border bg-background">
      <nav className="flex flex-col px-4 py-4 gap-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-surface transition-colors"
          >
            {item.label}
          </Link>
        ))}
        <hr className="my-2 border-border" />
        <Link
          href="/login"
          onClick={onClose}
          className="block px-3 py-2 rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-surface transition-colors"
        >
          Sign in
        </Link>
        <Link
          href="/register"
          onClick={onClose}
          className="block px-3 py-2 rounded-lg text-sm font-medium text-center text-white bg-primary hover:bg-primary-hover transition-colors"
        >
          Sign up
        </Link>
      </nav>
    </div>
  )
}
