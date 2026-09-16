'use client'

export default function ConversionProgress({ status, progress, error }) {
  const statusMessages = {
    uploading: 'Uploading file...',
    converting: 'Converting...',
    completed: 'Conversion complete!',
    failed: 'Conversion failed',
    idle: '',
  }

  if (status === 'idle') return null

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {status === 'converting' && <div className="spinner" />}
          {status === 'uploading' && <div className="spinner" />}
          {status === 'completed' && (
            <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          {status === 'failed' && (
            <div className="w-5 h-5 rounded-full bg-error flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
          <span className={`text-sm font-medium ${
            status === 'completed' ? 'text-success' :
            status === 'failed' ? 'text-error' : 'text-foreground'
          }`}>
            {statusMessages[status]}
          </span>
        </div>
        {status !== 'completed' && status !== 'failed' && (
          <span className="text-xs text-muted">{Math.round(progress)}%</span>
        )}
      </div>

      {(status === 'uploading' || status === 'converting') && (
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && (
        <p className="text-xs text-error bg-error-light rounded-lg px-3 py-2">
          {error}
        </p>
      )}
    </div>
  )
}
