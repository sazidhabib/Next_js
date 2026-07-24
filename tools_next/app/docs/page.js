import Link from 'next/link'

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="prose">
        <h1>API Documentation</h1>
        <p>The FileConvert API lets you convert files programmatically. Authenticate with an API key, create conversion jobs, and download results.</p>

        <h2>Authentication</h2>
        <p>All API requests require an API key in the Authorization header:</p>
        <pre><code>{`Authorization: Bearer YOUR_API_KEY`}</code></pre>
        <p>Generate API keys in your <Link href="/dashboard/api-keys">dashboard</Link>.</p>

        <h2>Create a Job</h2>
        <p><code>POST /v2/jobs</code></p>
        <p>Create a conversion job with import, convert, and export tasks:</p>
        <pre><code>{`{
  "tasks": {
    "import-1": {
      "operation": "import/url",
      "url": "https://example.com/file.pdf"
    },
    "convert-1": {
      "operation": "convert",
      "input": "import-1",
      "input_format": "pdf",
      "output_format": "docx"
    },
    "export-1": {
      "operation": "export/url",
      "input": "convert-1"
    }
  }
}`}</code></pre>

        <h2>Get Job Status</h2>
        <p><code>GET /v2/jobs/:id</code></p>
        <p>Returns the current status and progress of a job.</p>

        <h2>Pricing</h2>
        <p>API usage is charged in conversion credits. Most conversions use 1 credit per minute of processing time. See the <Link href="/pricing">pricing page</Link> for details.</p>

        <h2>Rate Limits</h2>
        <ul>
          <li>Free tier: 10 conversions per day</li>
          <li>Package/Subscription: Unlimited concurrent tasks</li>
          <li>Enterprise: Custom limits</li>
        </ul>
      </div>
    </div>
  )
}
