interface Props {
  label: string
  value: string | number
  sub?: string
  accent?: boolean
  warn?: boolean
}

export default function MetricCard({ label, value, sub, accent, warn }: Props) {
  const accentColor = warn ? "#e07070" : accent ? "#7A9A82" : "rgba(255,255,255,0.9)"

  return (
    <div style={{
      padding: "20px 22px", borderRadius: 12,
      backgroundColor: "#1f1f19",
      border: `1px solid ${warn ? "rgba(224,112,112,0.2)" : accent ? "rgba(122,154,130,0.2)" : "rgba(122,154,130,0.1)"}`,
      display: "flex", flexDirection: "column", gap: 6,
    }}>
      <p style={{
        fontFamily: "var(--font-mono), monospace",
        fontSize: 9, fontWeight: 700, letterSpacing: "0.12em",
        color: "rgba(122,154,130,0.5)", textTransform: "uppercase",
      }}>
        {label}
      </p>
      <p style={{
        fontFamily: "var(--font-display), system-ui, sans-serif",
        fontWeight: 900, fontSize: 36, lineHeight: 1,
        color: accentColor,
      }}>
        {value}
      </p>
      {sub && (
        <p style={{
          fontFamily: "var(--font-body), sans-serif",
          fontWeight: 400, fontSize: 11, lineHeight: 1.4,
          color: "rgba(255,255,255,0.3)",
        }}>
          {sub}
        </p>
      )}
    </div>
  )
}
