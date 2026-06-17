interface Props {
  label: string
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export default function PageHeader({ label, title, subtitle, action }: Props) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{
              width: 5, height: 5, borderRadius: "50%",
              background: "var(--sauge)", display: "inline-block", flexShrink: 0,
            }} />
            <span style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
              color: "var(--sauge)", textTransform: "uppercase" as const,
              background: "var(--sauge-dim)",
              border: "1px solid var(--sauge-border)",
              padding: "2px 8px", borderRadius: 100,
            }}>
              {label}
            </span>
          </div>
          <h1 style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontWeight: 900, fontSize: 34, lineHeight: 1,
            letterSpacing: "0.01em",
            color: "var(--text-primary)",
          }}>
            {title.toUpperCase()}
          </h1>
          {subtitle && (
            <p style={{
              fontFamily: "var(--font-body), sans-serif",
              fontWeight: 400, fontSize: 13,
              color: "var(--text-muted)", marginTop: 6, lineHeight: 1.5,
            }}>
              {subtitle}
            </p>
          )}
        </div>
        {action && <div style={{ flexShrink: 0, paddingTop: 4 }}>{action}</div>}
      </div>
      <div style={{
        height: 1,
        background: "rgba(122,154,130,0.10)",
        marginTop: 20,
      }} />
    </div>
  )
}
