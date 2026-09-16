'use client'

import { useState, useRef, useEffect } from 'react'
import { FORMATS, CATEGORIES, isValidConversion } from '@/lib/formats'
import GeometricCanvas from './GeometricCanvas'

export default function GraphifySelector({ fromValue, toValue, onFromChange, onToChange, onSwap, autoCycle = false }) {
  const [activeDropdown, setActiveDropdown] = useState(null) // 'from' | 'to' | null
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [isSwapping, setIsSwapping] = useState(false)
  const [userInteracted, setUserInteracted] = useState(false)
  const [cycleIndex, setCycleIndex] = useState(0)
  const [isCycleTransitioning, setIsCycleTransitioning] = useState(false)
  const dropdownRef = useRef(null)

  const AUTO_CYCLE_PAIRS = [
    { from: 'pdf', to: 'docx' },
    { from: 'png', to: 'jpg' },
    { from: 'mp4', to: 'mp3' },
    { from: 'heic', to: 'jpg' },
    { from: 'xlsx', to: 'csv' },
    { from: 'epub', to: 'pdf' },
    { from: 'mkv', to: 'mp4' },
    { from: 'webp', to: 'png' },
    { from: 'docx', to: 'pdf' },
    { from: 'wav', to: 'mp3' },
    { from: 'csv', to: 'xlsx' },
    { from: 'html', to: 'pdf' },
    { from: 'pptx', to: 'pdf' },
  ]

  // Auto-cycle through format pairs if on homepage without fixed selection or user interaction
  useEffect(() => {
    if (!autoCycle || userInteracted || fromValue || toValue) return

    const interval = setInterval(() => {
      setIsCycleTransitioning(true)
      setTimeout(() => {
        setCycleIndex((prev) => (prev + 1) % AUTO_CYCLE_PAIRS.length)
        setIsCycleTransitioning(false)
      }, 200)
    }, 2800)

    return () => clearInterval(interval)
  }, [autoCycle, userInteracted, fromValue, toValue, AUTO_CYCLE_PAIRS.length])

  // Determine current effective formats
  const isAutoCyclingActive = autoCycle && !userInteracted && !fromValue && !toValue
  const currentPair = AUTO_CYCLE_PAIRS[cycleIndex]
  const effectiveFrom = isAutoCyclingActive ? currentPair.from : fromValue
  const effectiveTo = isAutoCyclingActive ? currentPair.to : toValue

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSwapClick = () => {
    setUserInteracted(true)
    setIsSwapping(true)
    if (isAutoCyclingActive) {
      onFromChange(effectiveTo)
      onToChange(effectiveFrom)
    } else {
      onSwap()
    }
    setTimeout(() => setIsSwapping(false), 500)
  }

  const getFormatsList = (excludeValue, checkCompatibility = false) => {
    return Object.entries(FORMATS).flatMap(([category, fmts]) =>
      fmts
        .filter((f) => {
          if (f.id === excludeValue) return false
          if (checkCompatibility && effectiveFrom) {
            return isValidConversion(effectiveFrom, f.id)
          }
          return true
        })
        .map((f) => ({ ...f, category }))
    )
  }

  const allFromFormats = getFormatsList(effectiveTo, false)
  const allToFormats = getFormatsList(effectiveFrom, true)

  // Find selected format metadata
  const selectedFrom = allFromFormats.find((f) => f.id === effectiveFrom)
  const selectedTo = allToFormats.find((f) => f.id === effectiveTo)

  // Set default category when dropdown opens
  const toggleDropdown = (type) => {
    setUserInteracted(true)
    setSearch('')
    if (activeDropdown === type) {
      setActiveDropdown(null)
    } else {
      setActiveDropdown(type)
      const currentSelected = type === 'from' ? selectedFrom : selectedTo
      if (currentSelected) {
        setActiveCategory(currentSelected.category)
      } else {
        setActiveCategory('documents')
      }
    }
  }

  const handleSelect = (type, value) => {
    setUserInteracted(true)
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
      className="relative w-full max-w-2xl mx-auto py-12 px-4 flex flex-col items-center justify-center min-h-[340px]"
      ref={dropdownRef}
    >
      {/* Animated Geometric Canvas & Astrolabe Background */}
      <GeometricCanvas fromFormat={effectiveFrom} toFormat={effectiveTo} />

      {/* Main UI conversion row */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-lg gap-3 sm:gap-6">
        {/* Left selector: FROM */}
        <div className="relative flex-1 flex flex-col items-center">
          <button
            type="button"
            onClick={() => toggleDropdown('from')}
            className={`w-32 h-32 sm:w-40 sm:h-40 flex flex-col items-center justify-center rounded-2xl border transition-all duration-300 bg-background/95 backdrop-blur-md cursor-pointer group shadow-lg ${
              activeDropdown === 'from'
                ? 'border-primary glow-glow-intense ring-2 ring-primary/30 scale-[1.04]'
                : effectiveFrom
                ? 'border-primary/50 hover:border-primary hover:scale-[1.02] shadow-primary/5'
                : 'border-border hover:border-border-hover hover:scale-[1.02]'
            } ${isAutoCyclingActive && isCycleTransitioning ? 'animate-flash-glow' : ''}`}
          >
            <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center text-muted group-hover:text-primary transition-all duration-300 mb-2 border border-border group-hover:border-primary/40 group-hover:bg-primary-light/50">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <span
              key={`from-${effectiveFrom}`}
              className={`font-black text-xl sm:text-2xl tracking-tight text-foreground ${
                isAutoCyclingActive ? 'animate-format-slide-up' : ''
              }`}
            >
              {selectedFrom?.name || 'Select'}
            </span>
            <span
              key={`desc-${effectiveFrom}`}
              className={`text-[10px] text-muted-light group-hover:text-muted max-w-[110px] truncate text-center px-1 ${
                isAutoCyclingActive ? 'animate-format-slide-up' : ''
              }`}
            >
              {selectedFrom?.desc || 'Source format'}
            </span>
            <div className="absolute bottom-2.5 right-2.5 text-muted-light group-hover:text-primary transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          <div className="flex items-center gap-1.5 mt-3">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping opacity-75" />
            <span className="text-[11px] font-bold tracking-widest text-muted uppercase">Convert From</span>
          </div>


          {/* Left Dropdown */}
          {activeDropdown === 'from' && (
            <div className="absolute z-50 top-full mt-2 w-72 rounded-xl border border-border bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-2 border-b border-border bg-surface/70">
                <input
                  type="text"
                  placeholder="Search 200+ formats..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary placeholder:text-muted-light shadow-inner"
                  autoFocus
                />
              </div>

              {/* Category tabs (only shown if not actively searching) */}
              {!search && (
                <div className="flex overflow-x-auto gap-1 border-b border-border p-1.5 bg-surface/50 scrollbar-none">
                  {fromCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategory(cat.id)}
                      className={`whitespace-nowrap px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                        activeCategory === cat.id
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-muted hover:bg-surface hover:text-foreground'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}

              <div className="max-h-60 overflow-y-auto p-1.5 bg-background/90">
                {filteredFrom.length === 0 ? (
                  <p className="px-3 py-3 text-xs text-muted text-center">No matching formats</p>
                ) : (
                  filteredFrom.map((fmt) => (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => handleSelect('from', fmt.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-left transition-all ${
                        fromValue === fmt.id
                          ? 'bg-primary-light text-primary font-bold shadow-sm'
                          : 'text-foreground hover:bg-surface'
                      }`}
                    >
                      <span className="font-bold">{fmt.name}</span>
                      <span className="text-[10px] text-muted truncate max-w-[130px]">{fmt.desc}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Center: Laser Connectors & Animated Swap Button */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Left animated beam pulse */}
            <div className="w-6 sm:w-12 h-[2px] bg-gradient-to-r from-primary/30 to-primary relative overflow-hidden rounded-full">
              <div className="absolute inset-0 bg-white/70 animate-pulse-beam" />
            </div>

            {/* Central Swap Orb Button */}
            <button
              type="button"
              onClick={handleSwapClick}
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-primary/40 bg-background/95 backdrop-blur-md hover:border-primary hover:text-primary transition-all duration-300 shadow-md flex items-center justify-center group cursor-pointer focus:outline-none hover:shadow-primary/20 hover:scale-110 ${
                isSwapping ? 'rotate-180 scale-125 border-primary glow-glow' : ''
              }`}
              title="Swap formats"
            >
              <svg
                className={`w-5 h-5 text-muted group-hover:text-primary transition-all duration-500 ${
                  isSwapping ? 'rotate-180 text-primary' : 'group-hover:rotate-180'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
            </button>

            {/* Right animated beam pulse */}
            <div className="w-6 sm:w-12 h-[2px] bg-gradient-to-r from-primary to-primary/30 relative overflow-hidden rounded-full">
              <div className="absolute inset-0 bg-white/70 animate-pulse-beam" />
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-primary/70 uppercase mt-3">
            TRANSFORM
          </span>
        </div>

        {/* Right selector: TO */}
        <div className="relative flex-1 flex flex-col items-center">
          <button
            type="button"
            onClick={() => toggleDropdown('to')}
            className={`w-32 h-32 sm:w-40 sm:h-40 flex flex-col items-center justify-center rounded-2xl border transition-all duration-300 bg-background/95 backdrop-blur-md cursor-pointer group shadow-lg ${
              activeDropdown === 'to'
                ? 'border-primary glow-glow-intense ring-2 ring-primary/30 scale-[1.04]'
                : effectiveTo
                ? 'border-primary/50 hover:border-primary hover:scale-[1.02] shadow-primary/5'
                : 'border-border hover:border-border-hover hover:scale-[1.02]'
            } ${isAutoCyclingActive && isCycleTransitioning ? 'animate-flash-glow' : ''}`}
          >
            <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center text-muted group-hover:text-primary transition-all duration-300 mb-2 border border-border group-hover:border-primary/40 group-hover:bg-primary-light/50">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <span
              key={`to-${effectiveTo}`}
              className={`font-black text-xl sm:text-2xl tracking-tight text-foreground ${
                isAutoCyclingActive ? 'animate-format-slide-up' : ''
              }`}
            >
              {selectedTo?.name || 'Select'}
            </span>
            <span
              key={`desc-${effectiveTo}`}
              className={`text-[10px] text-muted-light group-hover:text-muted max-w-[110px] truncate text-center px-1 ${
                isAutoCyclingActive ? 'animate-format-slide-up' : ''
              }`}
            >
              {selectedTo?.desc || 'Target format'}
            </span>
            <div className="absolute bottom-2.5 right-2.5 text-muted-light group-hover:text-primary transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          <div className="flex items-center gap-1.5 mt-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping opacity-75" />
            <span className="text-[11px] font-bold tracking-widest text-muted uppercase">Convert To</span>
          </div>

          {/* Right Dropdown */}
          {activeDropdown === 'to' && (
            <div className="absolute z-50 top-full mt-2 w-72 rounded-xl border border-border bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-2 border-b border-border bg-surface/70">
                <input
                  type="text"
                  placeholder="Search 200+ formats..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary placeholder:text-muted-light shadow-inner"
                  autoFocus
                />
              </div>

              {/* Category tabs (only shown if not actively searching) */}
              {!search && (
                <div className="flex overflow-x-auto gap-1 border-b border-border p-1.5 bg-surface/50 scrollbar-none">
                  {toCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategory(cat.id)}
                      className={`whitespace-nowrap px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                        activeCategory === cat.id
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-muted hover:bg-surface hover:text-foreground'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}

              <div className="max-h-60 overflow-y-auto p-1.5 bg-background/90">
                {filteredTo.length === 0 ? (
                  <p className="px-3 py-3 text-xs text-muted text-center">No matching formats</p>
                ) : (
                  filteredTo.map((fmt) => (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => handleSelect('to', fmt.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-left transition-all ${
                        toValue === fmt.id
                          ? 'bg-primary-light text-primary font-bold shadow-sm'
                          : 'text-foreground hover:bg-surface'
                      }`}
                    >
                      <span className="font-bold">{fmt.name}</span>
                      <span className="text-[10px] text-muted truncate max-w-[130px]">{fmt.desc}</span>
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


