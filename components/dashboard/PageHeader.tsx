interface Props {
  label: string
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export default function PageHeader({ label, title, subtitle, action }: Props) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28 }}>
      <div>
        <p style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
          color: "rgba(122,154,130,0.5)", textTransform: "uppercase", marginBottom: 6,
        }}>
          {label}
        </p>
        <h1 style={{
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontWeight: 900, fontSize: 26,
          color: "rgba(255,255,255,0.95)",
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{
            fontFamily: "var(--font-body), sans-serif",
            fontWeight: 300, fontSize: 13,
            color: "rgba(255,255,255,0.3)", marginTop: 4,
          }}>
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  )
}
