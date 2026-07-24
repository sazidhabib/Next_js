'use client'

import { useState, useRef, useEffect } from 'react'
import { FORMATS } from '@/lib/formats'

export default function FormatSelector({ value, onChange, label, excludeFormat, disabled }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const allFormats = Object.entries(FORMATS).flatMap(([category, fmts]) =>
    fmts
      .filter((f) => f.id !== excludeFormat)
      .map((f) => ({ ...f, category }))
  )

  const filtered = search
    ? allFormats.filter(
        (f) =>
          f.name.toLowerCase().includes(search.toLowerCase()) ||
          f.desc.toLowerCase().includes(search.toLowerCase())
      )
    : allFormats

  const selected = allFormats.find((f) => f.id === value)

  return (
    <div className="relative" ref={ref}>
      <label className="block text-xs font-medium text-muted mb-1">{label}</label>
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border border-border bg-background text-sm font-medium text-foreground hover:border-border-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="flex items-center gap-2">
          {selected ? (
            <>
              <span className="font-bold text-primary">{selected.name}</span>
              <span className="text-xs text-muted truncate">{selected.desc}</span>
            </>
          ) : (
            <span className="text-muted">Select format</span>
          )}
        </span>
        <svg
          className={`w-4 h-4 text-muted transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full max-h-72 overflow-auto rounded-lg border border-border bg-background shadow-lg">
          <div className="sticky top-0 p-2 bg-background border-b border-border">
            <input
              type="text"
              placeholder="Search formats..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-1.5 text-sm rounded border border-border bg-surface text-foreground placeholder:text-muted-light focus:outline-none focus:border-primary"
              autoFocus
            />
          </div>
          <div className="p-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-2 text-xs text-muted">No formats found</p>
            ) : (
              filtered.map((fmt) => (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => {
                    onChange(fmt.id)
                    setOpen(false)
                    setSearch('')
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 rounded text-sm text-left transition-colors ${
                    value === fmt.id
                      ? 'bg-primary-light text-primary font-medium'
                      : 'text-foreground hover:bg-surface'
                  }`}
                >
                  <span className="font-semibold min-w-[3rem]">{fmt.name}</span>
                  <span className="text-xs text-muted truncate">{fmt.desc}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
