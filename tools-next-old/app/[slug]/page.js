import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getFormat, isValidConversion, getTopConversionPairs, CREDIT_COSTS, getAllFormatIds } from '@/lib/formats'
import ConverterWidget from '@/components/converter/ConverterWidget'

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

    return {
      title: `${fmt.name} Converter`,
      description: `Convert ${fmt.name} files to any format online. Free ${fmt.name} converter supporting all common formats. Fast and secure.`,
      openGraph: {
        title: `${fmt.name} Converter | FileConvert`,
        description: `Convert ${fmt.name} files online. Free and secure.`,
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

    return {
      title: `${fromFmt.name} to ${toFmt.name} Converter`,
      description: `Convert ${fromFmt.name} files to ${toFmt.name} format instantly. Free online ${fromFmt.name} to ${toFmt.name} converter. Fast, secure, and high quality.`,
      openGraph: {
        title: `${fromFmt.name} to ${toFmt.name} Converter | FileConvert`,
        description: `Convert ${fromFmt.name} to ${toFmt.name} online. Free and secure.`,
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
    return <FormatHubPage format={format} fmt={fmt} />
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
    return <ConversionPage from={from} to={to} fromFmt={fromFmt} toFmt={toFmt} />
  }

  notFound()
}

// Sub-component: FormatHubPage (formerly /app/[format]-converter/page.js)
function FormatHubPage({ format, fmt }) {
  const allFormats = getAllFormatIds().filter((id) => id !== format)

  const convertFrom = allFormats.map((id) => ({
    id,
    ...getFormat(id),
    href: `${id}-to-${format}`,
  }))

  const convertTo = allFormats.map((id) => ({
    id,
    ...getFormat(id),
    href: `${format}-to-${id}`,
  }))

  return (
    <div className="flex flex-col">
      <section className="py-12 sm:py-16 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <span className="format-badge text-lg px-4 py-1.5 mb-4">{fmt.name}</span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            {fmt.name} Converter
          </h1>
          <p className="mt-3 text-muted max-w-xl mx-auto">
            Convert {fmt.name} ({fmt.desc}) files to any format online.
            Free, fast, and secure. No software installation required.
          </p>
          <div className="mt-8">
            <ConverterWidget />
          </div>
        </div>
      </section>

      <section className="py-12 px-4 border-t border-border">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-xl font-bold text-foreground mb-2">
            Convert from {fmt.name}
          </h2>
          <p className="text-sm text-muted mb-4">
            Pick a target format to start a {fmt.name} conversion.
          </p>
          <div className="flex flex-wrap gap-2 mb-10">
            {convertTo.map((target) => (
              <Link
                key={target.id}
                href={`/${target.href}`}
                className="format-badge"
                title={`${fmt.name} to ${target.name}`}
              >
                {target.name}
              </Link>
            ))}
          </div>

          <h2 className="text-xl font-bold text-foreground mb-2">
            Convert to {fmt.name}
          </h2>
          <p className="text-sm text-muted mb-4">
            Pick a source format to convert into {fmt.name}.
          </p>
          <div className="flex flex-wrap gap-2">
            {convertFrom.map((source) => (
              <Link
                key={source.id}
                href={`/${source.href}`}
                className="format-badge"
                title={`${source.name} to ${fmt.name}`}
              >
                {source.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-surface border-t border-border">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold text-foreground mb-2">
            About {fmt.name}
          </h2>
          <p className="text-muted leading-relaxed">
            {fmt.desc} ({fmt.ext}) is a widely used file format. Our online converter supports
            converting {fmt.name} files to and from dozens of other formats. Simply upload your
            file, select the output format, and download the converted file. All conversions
            happen in the cloud — no software installation required.
          </p>
        </div>
      </section>
    </div>
  )
}

// Sub-component: ConversionPage (formerly /app/[from]-to-[to]/page.js)
function ConversionPage({ from, to, fromFmt, toFmt }) {
  function getCreditCostLocal(f, t) {
    const officeFormats = ['doc', 'docx', 'docm', 'dot', 'dotx', 'odt', 'rtf', 'txt']
    const iworkFormats = ['pages', 'key', 'numbers']
    if (officeFormats.includes(f) && t === 'pdf') return CREDIT_COSTS.office_to_pdf
    if (iworkFormats.includes(f) && t === 'pdf') return CREDIT_COSTS.iwork_to_pdf
    if (f === 'pdf' && officeFormats.includes(t)) return CREDIT_COSTS.pdf_to_office
    return CREDIT_COSTS.general
  }

  const credits = getCreditCostLocal(from, to)

  return (
    <div className="flex flex-col">
      <section className="py-12 sm:py-16 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="format-badge text-base px-4 py-1">{fromFmt.name}</span>
            <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
            <span className="format-badge text-base px-4 py-1">{toFmt.name}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            {fromFmt.name} to {toFmt.name} Converter
          </h1>
          <p className="mt-3 text-muted max-w-xl mx-auto">
            Convert your {fromFmt.name} files ({fromFmt.desc}) to {toFmt.name} ({toFmt.desc}) instantly.
            Free, fast, and secure online conversion.
          </p>
          {credits > 1 && (
            <p className="mt-2 text-xs text-muted-light">
              This conversion uses {credits} credits
            </p>
          )}
          <div className="mt-8">
            <ConverterWidget sourceFormat={from} targetFormat={to} />
          </div>
        </div>
      </section>

      <section className="py-12 px-4 border-t border-border">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold text-foreground mb-6">About the formats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormatInfo format={fromFmt} />
            <FormatInfo format={toFmt} />
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-surface border-t border-border">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-lg font-semibold text-foreground mb-2">
            More {fromFmt.name} conversions
          </h2>
          <p className="text-sm text-muted mb-4">
            Or convert {fromFmt.name} to a different format
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href={`/${from}-converter`} className="format-badge">
              All {fromFmt.name} conversions
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function FormatInfo({ format }) {
  return (
    <div className="rounded-xl border border-border bg-background p-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="format-badge">{format.name}</span>
        <span className="text-sm text-muted">{format.desc}</span>
      </div>
      <p className="text-sm text-muted leading-relaxed">
        {format.desc} files ({format.ext}) can be converted to and from many other formats
        using our online converter. No software installation required.
      </p>
      <Link
        href={`/${format.id}-converter`}
        className="inline-block mt-3 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
      >
        View all {format.name} conversions &rarr;
      </Link>
    </div>
  )
}
