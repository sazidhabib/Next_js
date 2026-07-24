export default function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`rounded-xl border border-border bg-background p-6 ${hover ? 'hover:border-border-hover hover:shadow-sm transition-all' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
