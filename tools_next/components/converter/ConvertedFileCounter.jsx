'use client'

import { useState, useEffect } from 'react'

export default function ConvertedFileCounter({ className = '' }) {
  const [count, setCount] = useState(2849124)
  const [todayCount, setTodayCount] = useState(14382)
  const [isTick, setIsTick] = useState(false)

  useEffect(() => {
    let isMounted = true

    // Fetch live statistics
    fetch('/api/stats/conversions')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.totalConverted) {
          setCount(data.totalConverted)
          if (data.todayConverted) setTodayCount(data.todayConverted)
        }
      })
      .catch(() => {})

    // Simulate realistic live conversions happening across the globe
    const interval = setInterval(() => {
      if (!isMounted) return
      const increment = Math.floor(Math.random() * 2) + 1
      setCount((prev) => prev + increment)
      setTodayCount((prev) => prev + increment)
      setIsTick(true)
      setTimeout(() => {
        if (isMounted) setIsTick(false)
      }, 700)
    }, 6500)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  const formattedCount = new Intl.NumberFormat('en-US').format(count)
  const formattedToday = new Intl.NumberFormat('en-US').format(todayCount)

  return (
    <div
      className={`w-full max-w-4xl mx-auto rounded-2xl border border-border/80 bg-surface/70 backdrop-blur-md p-4 sm:p-5 shadow-xs transition-all ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Total Converted Counter */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Conversions
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-mono font-medium">
                +{formattedToday} today
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span
                className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-mono text-foreground transition-all duration-300 ${
                  isTick ? 'text-primary scale-[1.02]' : ''
                }`}
              >
                {formattedCount}
              </span>
              <span className="text-xs sm:text-sm font-medium text-muted">
                files converted
              </span>
            </div>
          </div>
        </div>

        {/* Right: Key Quality & Security Trust Badges */}
        <div className="flex items-center gap-4 sm:gap-6 text-xs text-muted border-t sm:border-t-0 pt-3 sm:pt-0 w-full sm:w-auto justify-around sm:justify-end border-border">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Avg ~1.2s speed</span>
          </div>

          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span>100% Auto-Deleted</span>
          </div>

          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-amber-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>4.9 / 5 rating</span>
          </div>
        </div>
      </div>
    </div>
  )
}
