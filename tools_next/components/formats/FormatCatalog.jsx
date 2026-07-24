'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CATEGORIES, FORMATS } from '@/lib/formats'

export default function FormatCatalog() {
  const [activeCategory, setActiveCategory] = useState('documents')
  const formats = FORMATS[activeCategory] || []

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-1 border-b border-border">
        {Object.entries(CATEGORIES).map(([key, cat]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeCategory === key
                ? 'text-primary border-primary'
                : 'text-muted border-transparent hover:text-foreground hover:border-border'
            }`}
          >
            {cat.icon} {cat.name}
            <span className="ml-1 text-xs text-muted-light">({cat.count})</span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {formats.map((fmt) => (
          <Link
            key={fmt.id}
            href={`/${fmt.id}-converter`}
            className="format-badge"
            title={fmt.desc}
          >
            {fmt.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
