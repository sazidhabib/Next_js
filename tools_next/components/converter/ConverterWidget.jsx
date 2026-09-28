'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import FilePicker from './FilePicker'
import ConversionProgress from './ConversionProgress'
import GraphifySelector from './GraphifySelector'
import ConvertedFileCounter from './ConvertedFileCounter'
import { getFormat } from '@/lib/formats'

export default function ConverterWidget({
  sourceFormat,
  targetFormat,
  compact = false,
  showHero = false,
}) {
  const [file, setFile] = useState(null)
  const [from, setFrom] = useState(sourceFormat || '')
  const [to, setTo] = useState(targetFormat || '')
  const [prevSource, setPrevSource] = useState(sourceFormat)
  const [prevTarget, setPrevTarget] = useState(targetFormat)

  // Sync state during render when format props change (avoids React 19 cascading render warnings)
  if (sourceFormat !== prevSource) {
    setPrevSource(sourceFormat)
    setFrom(sourceFormat || '')
  }
  if (targetFormat !== prevTarget) {
    setPrevTarget(targetFormat)
    setTo(targetFormat || '')
  }

  const [status, setStatus] = useState('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [downloadUrl, setDownloadUrl] = useState(null)
  const [downloadFilename, setDownloadFilename] = useState(null)
  const router = useRouter()

  const handleFileSelect = useCallback(
    (selectedFile) => {
      setFile(selectedFile)
      setError(null)
      setDownloadUrl(null)
      if (!from) {
        const ext = selectedFile.name.split('.').pop()?.toLowerCase()
        if (ext) setFrom(ext)
      }
    },
    [from]
  )

  const handleConvert = async () => {
    if (!file || !from || !to) return

    setStatus('uploading')
    setProgress(0)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('inputFormat', from)
      formData.append('outputFormat', to)

      const uploadRes = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      })

      if (!uploadRes.ok) {
        const data = await uploadRes.json()
        throw new Error(data.error || 'Upload failed')
      }

      const { jobId } = await uploadRes.json()
      setStatus('converting')
      setProgress(50)

      let attempts = 0
      const maxAttempts = 120

      while (attempts < maxAttempts) {
        await new Promise((r) => setTimeout(r, 1000))
        attempts++

        const statusRes = await fetch(`/api/jobs/${jobId}`)
        if (!statusRes.ok) throw new Error('Failed to check status')

        const job = await statusRes.json()

        if (job.status === 'completed') {
          setProgress(100)
          setStatus('completed')
          setDownloadUrl(`/api/download/${jobId}`)
          const toFmt = getFormat(to)
          const baseName = file.name.replace(/\.[^.]+$/, '')
          setDownloadFilename(`${baseName}${toFmt?.ext || '.' + to}`)
          return
        }

        if (job.status === 'failed') {
          throw new Error(job.error_message || 'Conversion failed')
        }

        setProgress(50 + (job.progress || 0) * 0.5)
      }

      throw new Error('Conversion timed out')
    } catch (err) {
      setStatus('failed')
      setError(err.message)
    }
  }

  const handleReset = () => {
    setFile(null)
    setStatus('idle')
    setProgress(0)
    setError(null)
    setDownloadUrl(null)
    setDownloadFilename(null)
  }

  const handleFromChange = (newFrom) => {
    setFrom(newFrom)
    if (newFrom && to) {
      router.push(`/${newFrom}-to-${to}`)
    }
  }

  const handleToChange = (newTo) => {
    setTo(newTo)
    if (from && newTo) {
      router.push(`/${from}-to-${newTo}`)
    }
  }

  const handleSwap = () => {
    const tempFrom = from
    const tempTo = to
    setFrom(tempTo)
    setTo(tempFrom)
    if (file) {
      setFile(null)
      setStatus('idle')
      setDownloadUrl(null)
    }
    if (tempTo && tempFrom) {
      router.push(`/${tempTo}-to-${tempFrom}`)
    }
  }

  const isConverting = status === 'uploading' || status === 'converting'
  const fromFmt = from ? getFormat(from) : null
  const toFmt = to ? getFormat(to) : null

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold">{from?.toUpperCase()} &rarr; {to?.toUpperCase()}</span>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* 2-Column Responsive Layout: Left File Upload Field, Right Previous Animated SVG (GraphifySelector / GeometricCanvas) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center text-left">
        {/* Left Column: File Upload Field & Conversion Area */}
        <div className="lg:col-span-6 space-y-5">
          {showHero && (
            <div className="space-y-3 mb-2">
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
                Convert Any File
              </h1>
              <p className="text-base sm:text-lg text-muted leading-relaxed">
                Drop your file and pick what to turn it into. We handle 200+ formats across documents,
                images, audio, video, and archives — straight from your browser.
              </p>
            </div>
          )}

          {/* File Upload Field (Dropzone) when no file selected */}
          {status === 'idle' && !file ? (
            <div className="space-y-3">
              <FilePicker
                onFileSelect={handleFileSelect}
                formatName={fromFmt?.name || from?.toUpperCase()}
              />
              <div className="flex items-center justify-between text-xs text-muted px-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Instant cloud conversion
                </span>
                <span>Max file size: 1 GB</span>
              </div>
            </div>
          ) : (
            /* Selected File Panel with Actions & Progress */
            <div className="space-y-4 rounded-2xl border border-border bg-surface/60 backdrop-blur-md p-5 shadow-xs">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-background border border-border shadow-2xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{file?.name}</p>
                    <p className="text-xs text-muted">
                      {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : ''}
                      {from && to && ` · ${(fromFmt?.name || from).toUpperCase()} → ${(toFmt?.name || to).toUpperCase()}`}
                    </p>
                  </div>
                </div>

                {!isConverting && status !== 'completed' && (
                  <button
                    onClick={handleReset}
                    className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface transition-colors"
                    title="Remove file"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Conversion Progress Bar */}
              <ConversionProgress status={status} progress={progress} error={error} />

              {/* Action Buttons */}
              {status === 'idle' && (
                <button
                  onClick={handleConvert}
                  disabled={!from || !to}
                  className="w-full py-3.5 px-4 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover shadow-md hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  Convert {(fromFmt?.name || from).toUpperCase()} to {(toFmt?.name || to).toUpperCase()}
                </button>
              )}

              {status === 'completed' && downloadUrl && (
                <div className="space-y-3">
                  <a
                    href={downloadUrl}
                    download={downloadFilename}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all active:scale-[0.99]"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Download Converted {(toFmt?.name || to).toUpperCase()}
                  </a>
                  <button
                    onClick={handleReset}
                    className="w-full py-2.5 text-sm font-medium text-muted hover:text-foreground transition-colors"
                  >
                    &larr; Convert another file
                  </button>
                </div>
              )}

              {status === 'failed' && (
                <button
                  onClick={handleReset}
                  className="w-full py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-surface transition-colors"
                >
                  Try Again
                </button>
              )}
            </div>
          )}

          {/* Trust Guarantees */}
          <div className="flex items-center gap-5 text-xs text-muted pt-1">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              No file limits
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              No watermark
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Auto-delete in 1 hr
            </span>
          </div>
        </div>

        {/* Right Column: Previous Animated SVG Design (GraphifySelector with GeometricCanvas) */}
        <div className="lg:col-span-6 w-full flex items-center justify-center">
          <GraphifySelector
            fromValue={from}
            toValue={to}
            onFromChange={handleFromChange}
            onToChange={handleToChange}
            onSwap={handleSwap}
            autoCycle={!sourceFormat && !targetFormat && !file}
          />
        </div>
      </div>

      {/* Below: Currently Converted File Count */}
      <div className="mt-8 sm:mt-12">
        <ConvertedFileCounter />
      </div>
    </div>
  )
}
