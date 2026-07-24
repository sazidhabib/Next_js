import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted mt-1">Welcome back! Here&apos;s your overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Credits" value="--" sub="Buy credits to start converting" href="/pricing" />
        <StatCard label="Conversions" value="--" sub="Total conversions completed" href="/dashboard/conversions" />
        <StatCard label="API Keys" value="--" sub="Manage your API keys" href="/dashboard/api-keys" />
      </div>

      <div className="rounded-xl border border-border bg-background p-6">
        <h2 className="font-semibold text-foreground mb-4">Quick Convert</h2>
        <p className="text-sm text-muted mb-4">
          Need to convert a file? Head over to the converter.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          Go to Converter
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </div>
  )
}

function StatCard({ label, value, sub, href }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-border bg-background p-5 hover:border-border-hover transition-colors"
    >
      <p className="text-xs font-medium text-muted uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
      <p className="text-xs text-muted-light mt-1">{sub}</p>
    </Link>
  )
}
