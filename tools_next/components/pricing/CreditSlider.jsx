'use client'

import { useState } from 'react'

const SLIDER_STEPS = [100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000]

export default function CreditSlider({ onChange }) {
  const [value, setValue] = useState(3)

  const handleChange = (e) => {
    const idx = parseInt(e.target.value)
    setValue(idx)
    onChange?.(SLIDER_STEPS[idx])
  }

  const credits = SLIDER_STEPS[value]
  const pricePerCredit = credits >= 10000 ? 0.005 : credits >= 5000 ? 0.006 : credits >= 1000 ? 0.007 : 0.009
  const packagePrice = credits * pricePerCredit
  const subPrice = packagePrice * 0.5

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-muted mb-2">Select your volume</p>
        <p className="text-4xl font-bold text-foreground">
          {credits.toLocaleString()} <span className="text-lg font-normal text-muted">credits</span>
        </p>
      </div>

      <div className="px-2">
        <input
          type="range"
          min={0}
          max={SLIDER_STEPS.length - 1}
          value={value}
          onChange={handleChange}
          className="credit-slider w-full"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted">100</span>
          <span className="text-xs text-muted">100,000</span>
        </div>
      </div>
    </div>
  )
}
