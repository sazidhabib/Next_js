import Link from 'next/link'

export const metadata = {
  title: 'File Conversion API',
  description: 'Convert files programmatically with the FileConvert API. Support for 200+ formats, simple pricing, and developer-friendly documentation.',
}

export default function ApiPage() {
  return (
    <div className="flex flex-col">
      <section className="py-16 sm:py-24 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            File Conversion API
          </h1>
          <p className="mt-4 text-lg text-muted max-w-xl mx-auto">
            One API to handle them all. Convert between more than 200 file formats with a single,
            powerful API — reliable, scalable, and developer-friendly.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors"
            >
              Get API Key
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-surface transition-colors"
            >
              Read Documentation
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 border-t border-border">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Everything you need</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ApiFeature
              title="Convert Any Format"
              desc="Your universal toolkit for file conversions. Support for nearly all audio, video, document, ebook, archive, image, and presentation formats — more than 200 in total."
            />
            <ApiFeature
              title="Security First"
              desc="Files are processed in isolated environments and deleted immediately after conversion. We never access or store your data."
            />
            <ApiFeature
              title="High-Quality Conversions"
              desc="We combine open-source software with premium vendor partnerships to deliver the best possible results for every conversion type."
            />
            <ApiFeature
              title="Advanced Options"
              desc="Fine-tune conversions to your needs — set quality, add watermarks, and configure dozens of format-specific options."
            />
            <ApiFeature
              title="Async or Sync"
              desc="By default, files convert asynchronously with webhook notifications on completion. Need instant results? Use our synchronous API."
            />
            <ApiFeature
              title="Developer Friendly"
              desc="Comprehensive documentation, a visual Job Builder for generating code snippets, and free, responsive support."
            />
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-surface border-t border-border">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Quick Example</h2>
          <div className="rounded-xl border border-border bg-[#1e1e2e] p-6 overflow-x-auto">
            <pre className="text-sm text-[#cdd6f4] font-mono leading-relaxed">
              <code>{`curl -X POST https://api.fileconvert.com/v2/jobs \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "tasks": {
      "import-1": {
        "operation": "import/url",
        "url": "https://example.com/file.pdf"
      },
      "convert-1": {
        "operation": "convert",
        "input": "import-1",
        "output_format": "docx"
      },
      "export-1": {
        "operation": "export/url",
        "input": "convert-1"
      }
    }
  }'`}</code>
            </pre>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Starting at $0.005 per file
          </h2>
          <p className="text-muted mb-6">
            Usage-based pricing with volume discounts. Free tier available.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors"
          >
            View Pricing
          </Link>
        </div>
      </section>
    </div>
  )
}

function ApiFeature({ title, desc }) {
  return (
    <div className="rounded-xl border border-border bg-background p-5">
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{desc}</p>
    </div>
  )
}
