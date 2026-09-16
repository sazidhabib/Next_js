export default function ApiKeysPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">API Keys</h1>
          <p className="text-sm text-muted mt-1">Manage your API keys for programmatic access.</p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors">
          Create Key
        </button>
      </div>

      <div className="rounded-xl border border-border bg-background">
        <div className="p-6 text-center text-sm text-muted">
          <p>No API keys yet.</p>
          <p className="mt-1">Create an API key to start using the FileConvert API.</p>
        </div>
      </div>
    </div>
  )
}
