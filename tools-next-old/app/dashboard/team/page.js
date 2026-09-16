export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Team</h1>
          <p className="text-sm text-muted mt-1">Manage your team members and permissions.</p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors">
          Invite Member
        </button>
      </div>

      <div className="rounded-xl border border-border bg-background p-6">
        <h2 className="font-semibold text-foreground mb-2">Team Members</h2>
        <p className="text-sm text-muted">You are the only team member.</p>
      </div>

      <div className="rounded-xl border border-border bg-background p-6">
        <h2 className="font-semibold text-foreground mb-2">Roles</h2>
        <div className="space-y-2 mt-3">
          <RoleRow role="Admin" desc="Full access to all features and team management." />
          <RoleRow role="Member" desc="Can manage API integrations and shared resources." />
          <RoleRow role="Consumer" desc="Can use shared billing credits. Data is private." />
          <RoleRow role="Billing" desc="Can manage plan, payment method, and invoices." />
        </div>
      </div>
    </div>
  )
}

function RoleRow({ role, desc }) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-border last:border-0">
      <span className="text-sm font-medium text-foreground min-w-[5rem]">{role}</span>
      <span className="text-sm text-muted">{desc}</span>
    </div>
  )
}
