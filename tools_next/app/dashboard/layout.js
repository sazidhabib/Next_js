import DashboardNav from '@/components/dashboard/DashboardNav'

export default function DashboardLayout({ children }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-56 shrink-0">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3 px-3">Dashboard</h2>
          <DashboardNav />
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}
