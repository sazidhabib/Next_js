export default function PricingCard({ name, description, price, period, credits, features, cta, highlighted, href }) {
  return (
    <div
      className={`rounded-xl border p-6 flex flex-col ${
        highlighted
          ? 'border-primary bg-background shadow-md ring-1 ring-primary'
          : 'border-border bg-background'
      }`}
    >
      {highlighted && (
        <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Most Popular</div>
      )}
      <h3 className="text-lg font-bold text-foreground">{name}</h3>
      <p className="text-sm text-muted mt-1 mb-4">{description}</p>

      <div className="mb-4">
        <span className="text-3xl font-bold text-foreground">{price}</span>
        {period && <span className="text-sm text-muted ml-1">{period}</span>}
      </div>

      {credits && (
        <p className="text-sm font-medium text-foreground mb-4">
          {credits} conversion credits
        </p>
      )}

      <ul className="space-y-2 mb-6 flex-1">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <svg className="w-4 h-4 text-success mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className={feature.included ? 'text-foreground' : 'text-muted-light line-through'}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      <a
        href={href || '#'}
        className={`block text-center py-2.5 rounded-lg font-medium text-sm transition-colors ${
          highlighted
            ? 'bg-primary text-white hover:bg-primary-hover'
            : 'border border-border text-foreground hover:bg-surface'
        }`}
      >
        {cta}
      </a>
    </div>
  )
}
