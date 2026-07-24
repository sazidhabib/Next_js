import Link from 'next/link'

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing</h1>
        <p className="text-sm text-muted mt-1">Manage your subscription and payment method.</p>
      </div>

      <div className="rounded-xl border border-border bg-background p-6">
        <h2 className="font-semibold text-foreground mb-2">Current Plan</h2>
        <p className="text-sm text-muted mb-4">You are on the free plan.</p>
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          Upgrade Plan
        </Link>
      </div>

      <div className="rounded-xl border border-border bg-background p-6">
        <h2 className="font-semibold text-foreground mb-2">Payment Method</h2>
        <p className="text-sm text-muted">No payment method on file.</p>
      </div>

      <div className="rounded-xl border border-border bg-background p-6">
        <h2 className="font-semibold text-foreground mb-2">Transaction History</h2>
        <p className="text-sm text-muted">No transactions yet.</p>
      </div>
    </div>
  )
}
