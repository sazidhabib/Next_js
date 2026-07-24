export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      <div className="spinner w-8 h-8" />
      <p className="text-sm text-muted mt-4">Loading...</p>
    </div>
  )
}
