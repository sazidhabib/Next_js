export default function FormatBadge({ format, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`format-badge ${className}`}
      title={format.desc}
    >
      {format.name}
    </button>
  )
}
