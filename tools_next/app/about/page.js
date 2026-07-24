import Link from 'next/link'

export const metadata = {
  title: 'About Us',
  description: 'FileConvert was founded with the vision to build a universal tool for file conversions. Learn more about us.',
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-foreground mb-4">About FileConvert</h1>
      <p className="text-muted leading-relaxed mb-8">
        FileConvert was founded with the vision to build a universal tool for file conversions.
        Our product is used by both end users and corporate customers via our API.
        We believe it is important to focus on core business competencies and let others do everything else.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatBox label="Formats" value="200+" />
        <StatBox label="Conversions" value="Millions" />
        <StatBox label="Customers" value="10,000+" />
        <StatBox label="Uptime" value="99.99%" />
      </div>

      <h2 className="text-xl font-bold text-foreground mb-4">Why FileConvert?</h2>
      <div className="space-y-4 mb-10">
        <ReasonItem title="Custom Workflows" desc="Our feature-rich and flexible API can be integrated with your unique business cases." />
        <ReasonItem title="Security" desc="We use robust security measures. Read more about that in our security overview." />
        <ReasonItem title="Scalability" desc="Our infrastructure scales automatically. We are ready to handle your load peaks." />
        <ReasonItem title="Affordable Pricing" desc="Our pricing is fair and affordable, especially for high-volume customers." />
        <ReasonItem title="Support" desc="We provide free and timely support, directly from the builders of FileConvert." />
      </div>

      <div className="rounded-xl border border-border bg-background p-6 text-center">
        <h3 className="font-semibold text-foreground mb-2">Ready to get started?</h3>
        <p className="text-sm text-muted mb-4">Start free with 10 conversions per day.</p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary-hover transition-colors"
        >
          Get Started Free
        </Link>
      </div>
    </div>
  )
}

function StatBox({ label, value }) {
  return (
    <div className="rounded-lg border border-border bg-background p-4 text-center">
      <p className="text-2xl font-bold text-primary">{value}</p>
      <p className="text-xs text-muted mt-1">{label}</p>
    </div>
  )
}

function ReasonItem({ title, desc }) {
  return (
    <div className="flex gap-3">
      <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center shrink-0 mt-0.5">
        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <h3 className="font-medium text-foreground">{title}</h3>
        <p className="text-sm text-muted mt-0.5">{desc}</p>
      </div>
    </div>
  )
}
