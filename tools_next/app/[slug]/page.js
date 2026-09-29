import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  getFormat,
  isValidConversion,
  getTopConversionPairs,
  CREDIT_COSTS,
  getAllFormatIds,
  CATEGORIES,
} from '@/lib/formats'
import { getFormatSpec, generatePairFAQs, generateFormatHubFAQs } from '@/lib/format-details'
import ConverterWidget from '@/components/converter/ConverterWidget'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://tools.nextdigit.dev'

export async function generateStaticParams() {
  const formats = getAllFormatIds().map((format) => ({ slug: `${format}-converter` }))
  const pairs = getTopConversionPairs(300).map((p) => ({ slug: `${p.from}-to-${p.to}` }))
  return [...formats, ...pairs]
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  if (!slug) return {}

  if (slug.endsWith('-converter')) {
    const format = slug.slice(0, -10)
    const fmt = getFormat(format)
    if (!fmt) return {}

    const title = `Free ${fmt.name} Converter Online - Convert ${fmt.name} to Any Format`
    const description = `Online ${fmt.name} converter. Convert ${fmt.name} (${fmt.desc}) files to PDF, JPG, MP3, PNG and 50+ formats instantly. 100% free, secure cloud processing with auto file deletion.`
    const url = `${BASE_URL}/${slug}`

    return {
      title,
      description,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title: `${title} | FileConvert`,
        description,
        url,
        siteName: 'FileConvert',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} | FileConvert`,
        description,
      },
    }
  }

  if (slug.includes('-to-')) {
    const parts = slug.split('-to-')
    if (parts.length !== 2) return {}
    const [from, to] = parts

    const fromFmt = getFormat(from)
    const toFmt = getFormat(to)
    if (!fromFmt || !toFmt) return {}

    const title = `Convert ${fromFmt.name} to ${toFmt.name} Online (Free & Fast)`
    const description = `Convert your ${fromFmt.name} files to ${toFmt.name} format online in seconds. 100% free, secure 256-bit SSL encryption, and preserves maximum quality. No software download or registration required.`
    const url = `${BASE_URL}/${slug}`

    return {
      title,
      description,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title: `${title} | FileConvert`,
        description,
        url,
        siteName: 'FileConvert',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} | FileConvert`,
        description,
      },
    }
  }

  return {}
}

export default async function SlugPage({ params }) {
  const { slug } = await params
  if (!slug) notFound()

  if (slug.endsWith('-converter')) {
    const format = slug.slice(0, -10)
    const fmt = getFormat(format)
    if (!fmt) notFound()
    return <FormatHubPage format={format} fmt={fmt} slug={slug} />
  }

  if (slug.includes('-to-')) {
    const parts = slug.split('-to-')
    if (parts.length !== 2) notFound()
    const [from, to] = parts

    const fromFmt = getFormat(from)
    const toFmt = getFormat(to)
    if (!fromFmt || !toFmt || !isValidConversion(from, to)) {
      notFound()
    }
    return <ConversionPage from={from} to={to} fromFmt={fromFmt} toFmt={toFmt} slug={slug} />
  }

  notFound()
}

// ----------------------------------------------------------------------
// Conversion Page Component (e.g. /webp-to-png, /pdf-to-docx)
// ----------------------------------------------------------------------
function ConversionPage({ from, to, fromFmt, toFmt, slug }) {
  const fromSpec = getFormatSpec(from)
  const toSpec = getFormatSpec(to)
  const faqs = generatePairFAQs(fromFmt, toFmt)
  const pageUrl = `${BASE_URL}/${slug}`

  function getCreditCostLocal(f, t) {
    const officeFormats = ['doc', 'docx', 'docm', 'dot', 'dotx', 'odt', 'rtf', 'txt']
    const iworkFormats = ['pages', 'key', 'numbers']
    if (officeFormats.includes(f) && t === 'pdf') return CREDIT_COSTS.office_to_pdf
    if (iworkFormats.includes(f) && t === 'pdf') return CREDIT_COSTS.iwork_to_pdf
    if (f === 'pdf' && officeFormats.includes(t)) return CREDIT_COSTS.pdf_to_office
    return CREDIT_COSTS.general
  }

  const credits = getCreditCostLocal(from, to)

  // Sibling conversions for internal linking (same source or same target)
  const allFormats = getAllFormatIds()
  const siblingFrom = allFormats
    .filter((id) => id !== to && isValidConversion(from, id))
    .slice(0, 8)
    .map((id) => ({ id, ...getFormat(id) }))

  const siblingTo = allFormats
    .filter((id) => id !== from && isValidConversion(id, to))
    .slice(0, 8)
    .map((id) => ({ id, ...getFormat(id) }))

  // JSON-LD Structured Data
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${pageUrl}/#webapp`,
        name: `Convert ${fromFmt.name} to ${toFmt.name} Online`,
        url: pageUrl,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All (Web Browser)',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '1280',
          bestRating: '5',
          worstRating: '1',
        },
      },
      {
        '@type': 'HowTo',
        '@id': `${pageUrl}/#howto`,
        name: `How to convert ${fromFmt.name} to ${toFmt.name} online in 3 steps`,
        description: `Step-by-step tutorial to convert ${fromFmt.name} files to ${toFmt.name} format securely using FileConvert.`,
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: `Upload your ${fromFmt.name} file`,
            text: `Select or drag and drop your ${fromFmt.name} file from your device, Google Drive, or Dropbox.`,
            url: `${pageUrl}#step1`,
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: `Choose ${toFmt.name} as target format`,
            text: `Select ${toFmt.name} from the output format dropdown list.`,
            url: `${pageUrl}#step2`,
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: `Convert and Download ${toFmt.name}`,
            text: `Click Convert, wait a few moments for fast cloud processing, and download your converted ${toFmt.name} file.`,
            url: `${pageUrl}#step3`,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl}/#faq`,
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}/#breadcrumbs`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: BASE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: `${fromFmt.name} Converter`,
            item: `${BASE_URL}/${from}-converter`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: `${fromFmt.name} to ${toFmt.name}`,
            item: pageUrl,
          },
        ],
      },
    ],
  }

  return (
    <div className="flex flex-col">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      {/* Breadcrumb Bar */}
      <div className="border-b border-border bg-surface/50 py-3 px-4">
        <div className="mx-auto max-w-5xl flex items-center gap-2 text-xs sm:text-sm text-muted">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href={`/${from}-converter`} className="hover:text-foreground transition-colors">
            {fromFmt.name} Converter
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">
            {fromFmt.name} to {toFmt.name}
          </span>
        </div>
      </div>

      {/* Hero Conversion Zone */}
      <section className="py-12 sm:py-16 px-4">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-light text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <span>Free Online Converter</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Convert <span className="text-primary">{fromFmt.name}</span> to{' '}
            <span className="text-primary">{toFmt.name}</span>
          </h1>

          <p className="mt-3 text-muted text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Convert your {fromFmt.name} ({fromFmt.desc}) files to {toFmt.name} ({toFmt.desc}) in
            seconds. 100% free, private, and high quality with zero loss of formatting.
          </p>

          {credits > 1 && (
            <p className="mt-2 text-xs font-medium text-amber-500">
              ⚡ Advanced conversion profile ({credits} credits per run)
            </p>
          )}

          {/* Converter Widget */}
          <div className="mt-8">
            <ConverterWidget sourceFormat={from} targetFormat={to} />
          </div>

          {/* Trust Highlights */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-surface border border-border">
              <span className="text-lg">🔒</span>
              <div className="text-xs">
                <p className="font-semibold text-foreground">256-Bit SSL</p>
                <p className="text-muted">Encrypted transfers</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-surface border border-border">
              <span className="text-lg">⏱️</span>
              <div className="text-xs">
                <p className="font-semibold text-foreground">Auto-Deleted</p>
                <p className="text-muted">Purged after 60 min</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-surface border border-border">
              <span className="text-lg">⚡</span>
              <div className="text-xs">
                <p className="font-semibold text-foreground">Instant Speed</p>
                <p className="text-muted">Cloud processing</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-surface border border-border">
              <span className="text-lg">📱</span>
              <div className="text-xs">
                <p className="font-semibold text-foreground">All Devices</p>
                <p className="text-muted">iOS, Android, PC, Mac</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step How-To Section */}
      <section className="py-12 px-4 bg-surface border-y border-border" id="how-to">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              How to convert {fromFmt.name} to {toFmt.name} in 3 easy steps
            </h2>
            <p className="mt-2 text-sm text-muted">
              Convert your files effortlessly without downloading heavy desktop tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-border bg-background p-6 relative">
              <span className="w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm mb-4">
                1
              </span>
              <h3 className="font-semibold text-foreground text-base mb-2">
                Upload {fromFmt.name} file
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Click &quot;Choose Files&quot; or drag and drop your {fromFmt.name} files directly into the
                upload area. Batch files supported.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background p-6 relative">
              <span className="w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm mb-4">
                2
              </span>
              <h3 className="font-semibold text-foreground text-base mb-2">
                Select {toFmt.name} format
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Choose {toFmt.name} as the target conversion format. You can customize quality or
                compression settings if needed.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background p-6 relative">
              <span className="w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm mb-4">
                3
              </span>
              <h3 className="font-semibold text-foreground text-base mb-2">
                Download {toFmt.name}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Click &quot;Convert&quot; and download your fresh {toFmt.name} file immediately after
                processing completes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Format Comparison Matrix */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              {fromFmt.name} vs {toFmt.name}: Format Comparison
            </h2>
            <p className="mt-2 text-sm text-muted">
              Key technical differences and compatibility between {fromFmt.name} and {toFmt.name}
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border bg-background">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-surface border-b border-border">
                  <th className="p-4 font-semibold text-foreground">Feature / Specification</th>
                  <th className="p-4 font-semibold text-primary">{fromFmt.name}</th>
                  <th className="p-4 font-semibold text-primary">{toFmt.name}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-4 font-medium text-foreground">Full Name</td>
                  <td className="p-4 text-muted">{fromFmt.desc}</td>
                  <td className="p-4 text-muted">{toFmt.desc}</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-foreground">File Extension</td>
                  <td className="p-4 text-muted font-mono">{fromFmt.ext}</td>
                  <td className="p-4 text-muted font-mono">{toFmt.ext}</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-foreground">Format Type</td>
                  <td className="p-4 text-muted">{fromSpec?.type || 'Standard File'}</td>
                  <td className="p-4 text-muted">{toSpec?.type || 'Standard File'}</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-foreground">Developer / Standard</td>
                  <td className="p-4 text-muted">{fromSpec?.developer || 'Standard Body'}</td>
                  <td className="p-4 text-muted">{toSpec?.developer || 'Standard Body'}</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-foreground">MIME Type</td>
                  <td className="p-4 text-muted font-mono text-xs">{fromSpec?.mime || 'N/A'}</td>
                  <td className="p-4 text-muted font-mono text-xs">{toSpec?.mime || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-foreground">Compression / Loss</td>
                  <td className="p-4 text-muted">{fromSpec?.lossy || 'Standard'}</td>
                  <td className="p-4 text-muted">{toSpec?.lossy || 'Standard'}</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-foreground">Transparency Support</td>
                  <td className="p-4 text-muted">{fromSpec?.transparency || 'N/A'}</td>
                  <td className="p-4 text-muted">{toSpec?.transparency || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-foreground">Best Used For</td>
                  <td className="p-4 text-muted">{fromSpec?.bestFor || fromFmt.desc}</td>
                  <td className="p-4 text-muted">{toSpec?.bestFor || toFmt.desc}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Technical Specifications Cards */}
      <section className="py-12 px-4 bg-surface border-t border-border">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6 text-center">
            Detailed Format Overviews
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-border bg-background p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="format-badge text-base px-3 py-1">{fromFmt.name}</span>
                <span className="text-xs text-muted font-mono">{fromSpec?.mime}</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                About {fromFmt.name} ({fromFmt.desc})
              </h3>
              <p className="text-sm text-muted leading-relaxed mb-4">
                {fromFmt.name} files are widely used for {fromSpec?.bestFor || fromFmt.desc}.
                With FileConvert, you can easily transform {fromFmt.name} files into {toFmt.name} and
                many other file types without requiring specialized software.
              </p>
              <Link
                href={`/${from}-converter`}
                className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                All {fromFmt.name} conversion tools &rarr;
              </Link>
            </div>

            <div className="rounded-xl border border-border bg-background p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="format-badge text-base px-3 py-1">{toFmt.name}</span>
                <span className="text-xs text-muted font-mono">{toSpec?.mime}</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                About {toFmt.name} ({toFmt.desc})
              </h3>
              <p className="text-sm text-muted leading-relaxed mb-4">
                {toFmt.name} files offer great portability and are optimal for {toSpec?.bestFor || toFmt.desc}.
                Converting to {toFmt.name} ensures broad compatibility across operating systems and web platforms.
              </p>
              <Link
                href={`/${to}-converter`}
                className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                All {toFmt.name} conversion tools &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (PAA) */}
      <section className="py-16 px-4" id="faq">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm text-muted">
              Everything you need to know about converting {fromFmt.name} to {toFmt.name}
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-xl border border-border bg-background p-6">
                <h3 className="text-base font-semibold text-foreground mb-2 flex items-start gap-2">
                  <span className="text-primary font-bold">Q:</span>
                  <span>{faq.question}</span>
                </h3>
                <p className="text-sm text-muted leading-relaxed pl-6">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Internal Linking & Sibling Clusters */}
      <section className="py-12 px-4 bg-surface border-t border-border">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {siblingFrom.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  More {fromFmt.name} Conversions
                </h3>
                <div className="flex flex-wrap gap-2">
                  {siblingFrom.map((target) => (
                    <Link
                      key={target.id}
                      href={`/${from}-to-${target.id}`}
                      className="format-badge hover:border-primary transition-colors text-xs"
                    >
                      {fromFmt.name} to {target.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {siblingTo.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Convert other formats to {toFmt.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {siblingTo.map((source) => (
                    <Link
                      key={source.id}
                      href={`/${source.id}-to-${to}`}
                      className="format-badge hover:border-primary transition-colors text-xs"
                    >
                      {source.name} to {toFmt.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

// ----------------------------------------------------------------------
// Format Hub Page Component (e.g. /pdf-converter, /mp4-converter)
// ----------------------------------------------------------------------
function FormatHubPage({ format, fmt, slug }) {
  const spec = getFormatSpec(format)
  const faqs = generateFormatHubFAQs(fmt)
  const pageUrl = `${BASE_URL}/${slug}`

  const allFormats = getAllFormatIds().filter((id) => id !== format)

  const convertFrom = allFormats
    .filter((id) => isValidConversion(id, format))
    .map((id) => ({
      id,
      ...getFormat(id),
      href: `${id}-to-${format}`,
    }))

  const convertTo = allFormats
    .filter((id) => isValidConversion(format, id))
    .map((id) => ({
      id,
      ...getFormat(id),
      href: `${format}-to-${id}`,
    }))

  // JSON-LD Structured Data for Hub
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${pageUrl}/#webapp`,
        name: `Free ${fmt.name} Converter Online`,
        url: pageUrl,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All (Web Browser)',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '950',
          bestRating: '5',
          worstRating: '1',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl}/#faq`,
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}/#breadcrumbs`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: BASE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: `${fmt.name} Converter`,
            item: pageUrl,
          },
        ],
      },
    ],
  }

  return (
    <div className="flex flex-col">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      {/* Breadcrumb Bar */}
      <div className="border-b border-border bg-surface/50 py-3 px-4">
        <div className="mx-auto max-w-5xl flex items-center gap-2 text-xs sm:text-sm text-muted">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">{fmt.name} Converter Hub</span>
        </div>
      </div>

      {/* Hero */}
      <section className="py-12 sm:py-16 px-4">
        <div className="mx-auto max-w-5xl text-center">
          <span className="format-badge text-lg px-4 py-1.5 mb-4">{fmt.name}</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Free {fmt.name} Converter Online
          </h1>
          <p className="mt-3 text-muted text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Convert {fmt.name} ({fmt.desc}) files to and from all popular formats online.
            100% free, fast cloud processing, and secure SSL transfers.
          </p>
          <div className="mt-8">
            <ConverterWidget sourceFormat={format} />
          </div>
        </div>
      </section>

      {/* Conversions Grid */}
      <section className="py-12 px-4 border-t border-border">
        <div className="mx-auto max-w-5xl">
          {convertTo.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                Convert from {fmt.name} to Other Formats
              </h2>
              <p className="text-sm text-muted mb-4">
                Choose a target format to convert your {fmt.name} file:
              </p>
              <div className="flex flex-wrap gap-2">
                {convertTo.map((target) => (
                  <Link
                    key={target.id}
                    href={`/${target.href}`}
                    className="format-badge hover:border-primary transition-colors text-sm"
                    title={`${fmt.name} to ${target.name}`}
                  >
                    {fmt.name} to {target.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {convertFrom.length > 0 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                Convert Other Formats to {fmt.name}
              </h2>
              <p className="text-sm text-muted mb-4">
                Choose a source format to convert into {fmt.name}:
              </p>
              <div className="flex flex-wrap gap-2">
                {convertFrom.map((source) => (
                  <Link
                    key={source.id}
                    href={`/${source.href}`}
                    className="format-badge hover:border-primary transition-colors text-sm"
                    title={`${source.name} to ${fmt.name}`}
                  >
                    {source.name} to {fmt.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Specifications */}
      <section className="py-12 px-4 bg-surface border-t border-border">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
            About {fmt.name} ({fmt.desc})
          </h2>
          <div className="rounded-xl border border-border bg-background p-6 space-y-4">
            <p className="text-muted leading-relaxed text-sm">
              {fmt.desc} ({fmt.ext}) is an established file format widely utilized for{' '}
              {spec?.bestFor || fmt.desc}. FileConvert allows you to convert {fmt.name} files
              without installing third-party desktop tools.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-border text-xs">
              <div>
                <span className="text-muted block">Developer</span>
                <span className="font-semibold text-foreground">{spec?.developer || 'Standard'}</span>
              </div>
              <div>
                <span className="text-muted block">MIME Type</span>
                <span className="font-semibold text-foreground font-mono">{spec?.mime || 'N/A'}</span>
              </div>
              <div>
                <span className="text-muted block">Compression</span>
                <span className="font-semibold text-foreground">{spec?.lossy || 'Lossless'}</span>
              </div>
              <div>
                <span className="text-muted block">Transparency</span>
                <span className="font-semibold text-foreground">{spec?.transparency || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-4 border-t border-border">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            {fmt.name} Converter FAQs
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-xl border border-border bg-background p-6">
                <h3 className="text-base font-semibold text-foreground mb-2 flex items-start gap-2">
                  <span className="text-primary font-bold">Q:</span>
                  <span>{faq.question}</span>
                </h3>
                <p className="text-sm text-muted leading-relaxed pl-6">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
