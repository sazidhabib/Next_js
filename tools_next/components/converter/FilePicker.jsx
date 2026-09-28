'use client'

import { useRef } from 'react'

export default function FilePicker({ onFileSelect, disabled, formatName }) {
  const inputRef = useRef(null)

  const handleClick = () => {
    if (!disabled) inputRef.current?.click()
  }

  const handleChange = (e) => {
    const file = e.target.files?.[0]
    if (file) onFileSelect(file)
    e.target.value = ''
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files?.[0]
    if (file && !disabled) onFileSelect(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div
      className={`converter-dropzone rounded-2xl p-8 text-center cursor-pointer transition-all hover:border-primary/60 bg-surface/50 hover:bg-surface ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />
      <div className="flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </div>
        <div>
          <p className="text-base font-semibold text-foreground">
            {formatName ? `Select a ${formatName} file or drag and drop` : 'Select a file or drag and drop'}
          </p>
          <p className="text-xs text-muted mt-1">
            Fast cloud conversion · Supports up to 1 GB
          </p>
        </div>
      </div>
    </div>
  )
}
