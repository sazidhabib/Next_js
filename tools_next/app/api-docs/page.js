import Link from 'next/link'

export const metadata = {
  title: 'API Documentation',
  description: 'Integrate file conversions into your application with the FileConvert API. Simple, powerful, and developer-friendly.',
}

export default function ApiDocsPage() {
  return (
    <div className="flex flex-col">
      <section className="py-16 sm:py-20 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            File Conversion API
          </h1>
          <p className="mt-4 text-lg text-muted max-w-xl mx-auto">
            One API to handle them all. Convert between more than 200 file formats with a single, powerful API.
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
              Full Documentation
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 border-t border-border">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Quick Start</h2>
          <div className="rounded-xl border border-border bg-[#1e1e2e] p-6 overflow-x-auto">
            <pre className="text-sm text-[#cdd6f4] font-mono leading-relaxed">
              <code>{`POST https://api.fileconvert.com/v2/jobs

{
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
}`}</code>
            </pre>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-surface border-t border-border">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              title="Convert Any Format"
              desc="Support for nearly all audio, video, document, ebook, archive, image, and presentation formats — more than 200 in total."
            />
            <FeatureCard
              title="High-Quality Output"
              desc="Vendor engines and open-source converters selected per file type for the best possible results."
            />
            <FeatureCard
              title="Advanced Options"
              desc="Fine-tune conversions — set quality, add watermarks, and configure dozens of format-specific options."
            />
            <FeatureCard
              title="Storage Integration"
              desc="Fetch files from and write to S3, Azure Blob Storage, Google Cloud, and more."
            />
            <FeatureCard
              title="Custom Workflows"
              desc="Chain multiple operations in a single API call — convert, watermark, and generate thumbnails."
            />
            <FeatureCard
              title="Developer Friendly"
              desc="Comprehensive documentation, SDKs for multiple languages, and responsive support."
            />
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">SDKs & Libraries</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['cURL', 'Python', 'Node.js', 'PHP', 'Ruby'].map((lang) => (
              <div key={lang} className="rounded-lg border border-border bg-background p-4 text-center">
                <span className="text-sm font-medium text-foreground">{lang}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ title, desc }) {
  return (
    <div className="rounded-xl border border-border bg-background p-5">
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{desc}</p>
    </div>
  )
}
