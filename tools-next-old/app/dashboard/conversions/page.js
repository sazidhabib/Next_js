export default function ConversionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Conversions</h1>
        <p className="text-sm text-muted mt-1">Your conversion history.</p>
      </div>

      <div className="rounded-xl border border-border bg-background">
        <div className="p-6 text-center text-sm text-muted">
          <p>No conversions yet.</p>
          <p className="mt-1">Your conversion history will appear here after you convert your first file.</p>
        </div>
      </div>
    </div>
  )
}
