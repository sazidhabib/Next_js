import Link from 'next/link'
import ConverterWidget from '@/components/converter/ConverterWidget'
import FormatCatalog from '@/components/formats/FormatCatalog'
import { POPULAR_CONVERSIONS } from '@/lib/formats'

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="py-16 sm:py-24 px-4">
        <div className="mx-auto max-w-7xl">
          <ConverterWidget showHero={true} />
        </div>
      </section>


      <section className="py-12 px-4 bg-surface border-y border-border">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-sm font-semibold text-muted uppercase tracking-wider mb-6">
            Popular Conversions
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR_CONVERSIONS.map((conv) => (
              <Link
                key={`${conv.from}-${conv.to}`}
                href={`/${conv.from}-to-${conv.to}`}
                className="format-badge"
              >
                {conv.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-center text-foreground mb-2">
            Format Catalog
          </h2>
          <p className="text-center text-muted text-sm mb-8">
            Browse all supported formats by category
          </p>
          <FormatCatalog />
        </div>
      </section>

      <section className="py-16 px-4 bg-surface border-t border-border">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-center text-foreground mb-8">
            Why Choose FileConvert?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              }
              title="Secure & Private"
              desc="Files are processed and deleted immediately. We never access or store your data."
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              }
              title="Fast Conversions"
              desc="Optimized conversion engines process your files in seconds, not minutes."
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                </svg>
              }
              title="200+ Formats"
              desc="Support for documents, images, audio, video, archives, and more."
            />
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Powerful API for Developers
          </h2>
          <p className="text-muted mb-6">
            Integrate file conversions into your application with our RESTful API.
            Simple pricing, reliable uptime, and comprehensive documentation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/apis"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors"
            >
              Explore the API
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-surface transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-surface border-t border-border">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Ready to get started?
          </h2>
          <p className="text-muted mb-6">
            Free for personal use. No account required.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="rounded-xl border border-border bg-background p-6">
      <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{desc}</p>
    </div>
  )
}
