'use client'

import { useState, useCallback } from 'react'
import FilePicker from './FilePicker'
import FormatSelector from './FormatSelector'
import ConversionProgress from './ConversionProgress'
import { getFormat } from '@/lib/formats'

export default function ConverterWidget({ sourceFormat, targetFormat, compact = false }) {
  const [file, setFile] = useState(null)
  const [from, setFrom] = useState(sourceFormat || '')
  const [to, setTo] = useState(targetFormat || '')
  const [status, setStatus] = useState('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [downloadUrl, setDownloadUrl] = useState(null)
  const [downloadFilename, setDownloadFilename] = useState(null)

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

  const handleSwap = () => {
    const tempFrom = from
    setFrom(to)
    setTo(tempFrom)
    if (file) {
      setFile(null)
      setStatus('idle')
      setDownloadUrl(null)
    }
  }

  const isConverting = status === 'uploading' || status === 'converting'

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <FormatSelector value={from} onChange={setFrom} label="From" excludeFormat={to} />
        <button
          onClick={handleSwap}
          className="mt-5 p-1.5 rounded-lg border border-border hover:bg-surface transition-colors"
          title="Swap formats"
        >
          <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
          </svg>
        </button>
        <FormatSelector value={to} onChange={setTo} label="To" excludeFormat={from} />
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {status === 'idle' && !file && (
        <div className="space-y-4">
          <FilePicker onFileSelect={handleFileSelect} />
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <FormatSelector value={from} onChange={setFrom} label="From" excludeFormat={to} />
            </div>
            <button
              onClick={handleSwap}
              className="mb-0.5 p-2 rounded-lg border border-border hover:bg-surface transition-colors"
              title="Swap formats"
            >
              <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
            </button>
            <div className="flex-1">
              <FormatSelector value={to} onChange={setTo} label="To" excludeFormat={from} />
            </div>
          </div>
        </div>
      )}

      {(file || status !== 'idle') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded bg-primary-light flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{file?.name}</p>
                <p className="text-xs text-muted">
                  {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : ''}
                  {from && to && ` · ${from.toUpperCase()} → ${to.toUpperCase()}`}
                </p>
              </div>
            </div>
            {!isConverting && status !== 'completed' && (
              <button
                onClick={handleReset}
                className="p-1.5 rounded text-muted hover:text-foreground hover:bg-background transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {status === 'idle' && (
            <div className="flex gap-3">
              <div className="flex-1">
                <FormatSelector value={from} onChange={setFrom} label="From" excludeFormat={to} />
              </div>
              <div className="flex-1">
                <FormatSelector value={to} onChange={setTo} label="To" excludeFormat={from} />
              </div>
            </div>
          )}

          <ConversionProgress status={status} progress={progress} error={error} />

          {status === 'idle' && (
            <button
              onClick={handleConvert}
              disabled={!from || !to}
              className="w-full py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Convert {from?.toUpperCase()} to {to?.toUpperCase()}
            </button>
          )}

          {status === 'completed' && downloadUrl && (
            <div className="space-y-2">
              <a
                href={downloadUrl}
                download={downloadFilename}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-success text-white font-medium hover:bg-green-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download {to?.toUpperCase()}
              </a>
              <button
                onClick={handleReset}
                className="w-full py-2 text-sm text-muted hover:text-foreground transition-colors"
              >
                Convert another file
              </button>
            </div>
          )}

          {status === 'failed' && (
            <button
              onClick={handleReset}
              className="w-full py-3 rounded-lg border border-border text-foreground font-medium hover:bg-surface transition-colors"
            >
              Try again
            </button>
          )}
        </div>
      )}
    </div>
  )
}
