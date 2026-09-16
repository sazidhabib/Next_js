export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-surface text-foreground border-border',
    primary: 'bg-primary-light text-primary border-primary/20',
    success: 'bg-success-light text-success border-success/20',
    warning: 'bg-warning-light text-yellow-700 border-yellow-200',
    danger: 'bg-error-light text-error border-error/20',
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
