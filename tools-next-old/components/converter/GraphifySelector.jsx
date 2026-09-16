'use client'

import { useState, useRef, useEffect } from 'react'
import { FORMATS, CATEGORIES, isValidConversion } from '@/lib/formats'

export default function GraphifySelector({ fromValue, toValue, onFromChange, onToChange, onSwap }) {
  const [activeDropdown, setActiveDropdown] = useState(null) // 'from' | 'to' | null
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getFormatsList = (excludeValue, checkCompatibility = false) => {
    return Object.entries(FORMATS).flatMap(([category, fmts]) =>
      fmts
        .filter((f) => {
          if (f.id === excludeValue) return false
          if (checkCompatibility && fromValue) {
            return isValidConversion(fromValue, f.id)
          }
          return true
        })
        .map((f) => ({ ...f, category }))
    )
  }

  const allFromFormats = getFormatsList(toValue, false)
  const allToFormats = getFormatsList(fromValue, true)

  // Find selected format metadata
  const selectedFrom = allFromFormats.find((f) => f.id === fromValue)
  const selectedTo = allToFormats.find((f) => f.id === toValue)

  // Set default category when dropdown opens
  const toggleDropdown = (type) => {
    setSearch('')
    if (activeDropdown === type) {
      setActiveDropdown(null)
    } else {
      setActiveDropdown(type)
      const currentSelected = type === 'from' ? selectedFrom : selectedTo
      if (currentSelected) {
        setActiveCategory(currentSelected.category)
      } else {
        // Fallback to first available category
        setActiveCategory('documents')
      }
    }
  }

  const handleSelect = (type, value) => {
    if (type === 'from') {
      onFromChange(value)
    } else {
      onToChange(value)
    }
    setActiveDropdown(null)
    setSearch('')
  }

  // Get filtered formats based on search AND active category
  const getFilteredList = (formats) => {
    let result = formats
    if (search) {
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(search.toLowerCase()) ||
          f.desc.toLowerCase().includes(search.toLowerCase())
      )
    } else if (activeCategory) {
      result = result.filter((f) => f.category === activeCategory)
    }
    return result
  }

  const filteredFrom = getFilteredList(allFromFormats)
  const filteredTo = getFilteredList(allToFormats)

  // Find unique categories present in the formats lists to render tabs
  const getAvailableCategories = (formats) => {
    const cats = [...new Set(formats.map((f) => f.category))]
    return Object.entries(CATEGORIES)
      .filter(([id]) => cats.includes(id))
      .map(([id, info]) => ({ id, ...info }))
  }

  const fromCategories = getAvailableCategories(allFromFormats)
  const toCategories = getAvailableCategories(allToFormats)

  return (
    <div
      className="relative w-full max-w-2xl mx-auto py-12 px-4 flex flex-col items-center justify-center min-h-[320px]"
      ref={dropdownRef}
    >
      {/* Absolute container for grid background that remains clipped with border-radius (WITHOUT clipping the outer container) */}
      <div className="absolute inset-0 rounded-2xl bg-background pointer-events-none overflow-hidden">
        <div className="absolute inset-0 geometric-grid-bg opacity-30" />
        <svg
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] h-[440px] text-muted-light/20 animate-spin-slow"
          viewBox="0 0 100 100"
        >
          <circle cx="50" cy="50" r="18" fill="none" stroke="currentColor" strokeWidth="0.1" />
          <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="0.15" />
          <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="0.2" />
          <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="0.05" strokeDasharray="1 2" />
          <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="0.05" strokeDasharray="1 2" />
        </svg>
      </div>

      {/* Main UI row */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-lg gap-4">
        {/* Left selector: FROM */}
        <div className="relative flex-1 flex flex-col items-center">
          <button
            type="button"
            onClick={() => toggleDropdown('from')}
            className={`w-32 h-32 sm:w-36 sm:h-36 flex flex-col items-center justify-center rounded-2xl border transition-all duration-300 bg-background/90 backdrop-blur-sm cursor-pointer group ${
              activeDropdown === 'from'
                ? 'border-primary glow-glow ring-2 ring-primary/20 scale-[1.03]'
                : 'border-border hover:border-border-hover hover:scale-[1.02] shadow-sm'
            }`}
          >
            <div className="text-muted group-hover:text-primary transition-colors mb-2">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-foreground">
              {selectedFrom?.name || 'Select'}
            </span>
            <div className="absolute bottom-2 right-2 text-muted-light group-hover:text-muted transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          <span className="text-[10px] font-bold tracking-widest text-muted uppercase mt-3">From</span>

          {/* Left Dropdown */}
          {activeDropdown === 'from' && (
            <div className="absolute z-50 top-full mt-2 w-64 rounded-xl border border-border bg-background shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="p-2 border-b border-border bg-surface">
                <input
                  type="text"
                  placeholder="Search formats..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded border border-border bg-background text-foreground focus:outline-none focus:border-primary placeholder:text-muted-light"
                  autoFocus
                />
              </div>

              {/* Category tabs (only shown if not actively searching) */}
              {!search && (
                <div className="flex overflow-x-auto gap-1 border-b border-border p-1 bg-surface/50 scrollbar-none">
                  {fromCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategory(cat.id)}
                      className={`whitespace-nowrap px-2.5 py-1 rounded text-[10px] font-bold transition-colors ${
                        activeCategory === cat.id
                          ? 'bg-primary text-white'
                          : 'text-muted hover:bg-surface hover:text-foreground'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}

              <div className="max-h-56 overflow-y-auto p-1 bg-background">
                {filteredFrom.length === 0 ? (
                  <p className="px-3 py-2 text-xs text-muted text-center">No formats found</p>
                ) : (
                  filteredFrom.map((fmt) => (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => handleSelect('from', fmt.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs text-left transition-colors ${
                        fromValue === fmt.id
                          ? 'bg-primary-light text-primary font-bold'
                          : 'text-foreground hover:bg-surface'
                      }`}
                    >
                      <span className="font-bold">{fmt.name}</span>
                      <span className="text-[10px] text-muted truncate max-w-[120px]">{fmt.desc}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Center: Connectors & Swap Button */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <div className="flex items-center gap-1">
            <div className="w-6 sm:w-10 h-[1px] bg-border" />
            <button
              type="button"
              onClick={onSwap}
              className="w-10 h-10 rounded-full border border-border bg-background hover:border-primary hover:text-primary transition-all duration-300 shadow-sm flex items-center justify-center group cursor-pointer focus:outline-none"
              title="Swap formats"
            >
              <svg className="w-5 h-5 text-muted group-hover:text-primary group-hover:rotate-180 transition-all duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.656 48.656 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3M4.5 12c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l-3 3m3-3l3-3" />
              </svg>
            </button>
            <div className="w-6 sm:w-10 h-[1px] bg-border" />
          </div>
          <span className="text-[10px] font-bold tracking-[0.2em] text-muted-light uppercase mt-3">To</span>
        </div>

        {/* Right selector: TO */}
        <div className="relative flex-1 flex flex-col items-center">
          <button
            type="button"
            onClick={() => toggleDropdown('to')}
            className={`w-32 h-32 sm:w-36 sm:h-36 flex flex-col items-center justify-center rounded-2xl border transition-all duration-300 bg-background/90 backdrop-blur-sm cursor-pointer group ${
              activeDropdown === 'to'
                ? 'border-primary glow-glow ring-2 ring-primary/20 scale-[1.03]'
                : 'border-border hover:border-border-hover hover:scale-[1.02] shadow-sm'
            }`}
          >
            <div className="text-muted group-hover:text-primary transition-colors mb-2">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-foreground">
              {selectedTo?.name || 'Select'}
            </span>
            <div className="absolute bottom-2 right-2 text-muted-light group-hover:text-muted transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          <span className="text-[10px] font-bold tracking-widest text-muted uppercase mt-3">To</span>

          {/* Right Dropdown */}
          {activeDropdown === 'to' && (
            <div className="absolute z-50 top-full mt-2 w-64 rounded-xl border border-border bg-background shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="p-2 border-b border-border bg-surface">
                <input
                  type="text"
                  placeholder="Search formats..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded border border-border bg-background text-foreground focus:outline-none focus:border-primary placeholder:text-muted-light"
                  autoFocus
                />
              </div>

              {/* Category tabs (only shown if not actively searching) */}
              {!search && (
                <div className="flex overflow-x-auto gap-1 border-b border-border p-1 bg-surface/50 scrollbar-none">
                  {toCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategory(cat.id)}
                      className={`whitespace-nowrap px-2.5 py-1 rounded text-[10px] font-bold transition-colors ${
                        activeCategory === cat.id
                          ? 'bg-primary text-white'
                          : 'text-muted hover:bg-surface hover:text-foreground'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}

              <div className="max-h-56 overflow-y-auto p-1 bg-background">
                {filteredTo.length === 0 ? (
                  <p className="px-3 py-2 text-xs text-muted text-center">No formats found</p>
                ) : (
                  filteredTo.map((fmt) => (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => handleSelect('to', fmt.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs text-left transition-colors ${
                        toValue === fmt.id
                          ? 'bg-primary-light text-primary font-bold'
                          : 'text-foreground hover:bg-surface'
                      }`}
                    >
                      <span className="font-bold">{fmt.name}</span>
                      <span className="text-[10px] text-muted truncate max-w-[120px]">{fmt.desc}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
