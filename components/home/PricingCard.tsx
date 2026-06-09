import Link from "next/link"

interface Feature { label: string; included: boolean }

interface Props {
  name:     string
  price:    string
  period:   string
  desc:     string
  features: Feature[]
  cta:      string
  featured?: boolean
}

export default function PricingCard({ name, price, period, desc, features, cta, featured }: Props) {
  return (
    <div style={{
      flex: 1, padding: "28px 24px", borderRadius: 16,
      backgroundColor: featured ? "rgba(122,154,130,0.1)" : "#1f1f19",
      border: `1px solid ${featured ? "rgba(122,154,130,0.45)" : "rgba(122,154,130,0.12)"}`,
      display: "flex", flexDirection: "column", gap: 0,
      position: "relative",
    }}>
      {featured && (
        <div style={{
          position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
          fontFamily: "var(--font-mono), monospace",
          fontSize: 8, fontWeight: 700, letterSpacing: "0.12em",
          backgroundColor: "#7A9A82", color: "#181812",
          padding: "4px 14px", borderRadius: 100,
          whiteSpace: "nowrap",
        }}>
          LE PLUS POPULAIRE
        </div>
      )}

      {/* Nom */}
      <p style={{
        fontFamily: "var(--font-mono), monospace",
        fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
        color: "#7A9A82", marginBottom: 12,
      }}>
        {name.toUpperCase()}
      </p>

      {/* Prix */}
      <div className="flex items-end gap-1 mb-2">
        <span style={{
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontWeight: 900, fontSize: 44, lineHeight: 1,
          color: "rgba(255,255,255,0.95)",
        }}>
          {price}
        </span>
        <span style={{
          fontFamily: "var(--font-body), sans-serif",
          fontWeight: 400, fontSize: 13,
          color: "rgba(255,255,255,0.35)", marginBottom: 6,
        }}>
          {period}
        </span>
      </div>

      <p style={{
        fontFamily: "var(--font-body), sans-serif",
        fontWeight: 400, fontSize: 13, lineHeight: 1.5,
        color: "rgba(255,255,255,0.4)", marginBottom: 20,
      }}>
        {desc}
      </p>

      {/* Features */}
      <ul className="flex flex-col gap-2 mb-6" style={{ flex: 1 }}>
        {features.map(f => (
          <li key={f.label} className="flex items-start gap-2">
            <span style={{
              fontSize: 11, marginTop: 1, flexShrink: 0,
              color: f.included ? "#7A9A82" : "rgba(255,255,255,0.2)",
            }}>
              {f.included ? "✓" : "✕"}
            </span>
            <span style={{
              fontFamily: "var(--font-body), sans-serif",
              fontWeight: 400, fontSize: 12, lineHeight: 1.4,
              color: f.included ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)",
            }}>
              {f.label}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link href="/dashboard" style={{
        display: "block", textAlign: "center",
        fontFamily: "var(--font-mono), monospace",
        fontWeight: 700, fontSize: 11, letterSpacing: "0.08em",
        padding: "12px 20px", borderRadius: 10,
        backgroundColor: featured ? "#7A9A82" : "transparent",
        color: featured ? "#181812" : "#7A9A82",
        border: featured ? "none" : "1px solid rgba(122,154,130,0.35)",
        transition: "opacity 0.2s",
      }}>
        {cta}
      </Link>
    </div>
  )
}
