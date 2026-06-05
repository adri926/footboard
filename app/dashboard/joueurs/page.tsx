import Link from "next/link"
import PlayerStatusBadge from "@/components/dashboard/PlayerStatusBadge"
import { MOCK_PLAYERS } from "@/lib/mock-data"

export default function JoueursPage() {
  const sorted = [...MOCK_PLAYERS].sort((a, b) => {
    const posOrder = ["GK", "DEF", "MIL", "ATT"]
    const pd = posOrder.indexOf(a.position) - posOrder.indexOf(b.position)
    return pd !== 0 ? pd : a.number - b.number
  })

  return (
    <div style={{ padding: "32px 36px", maxWidth: 960 }}>
      <div style={{ marginBottom: 28 }}>
        <p style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
          color: "rgba(122,154,130,0.5)", textTransform: "uppercase", marginBottom: 6,
        }}>
          Mon Club
        </p>
        <h1 style={{
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontWeight: 900, fontSize: 26, letterSpacing: "0.02em",
          color: "rgba(255,255,255,0.95)",
        }}>
          Joueurs
        </h1>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {sorted.map(p => (
          <Link key={p.id} href={`/dashboard/joueurs/${p.id}`} style={{
            display: "flex", alignItems: "center",
            padding: "14px 18px", borderRadius: 10,
            backgroundColor: "#1f1f19",
            border: "1px solid rgba(122,154,130,0.08)",
            gap: 16, textDecoration: "none",
            transition: "border-color 0.15s",
          }}
            className="hover:border-[rgba(122,154,130,0.25)]"
          >
            {/* Numéro + poste */}
            <div style={{ width: 44, textAlign: "center", flexShrink: 0 }}>
              <p style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontWeight: 900, fontSize: 20, lineHeight: 1,
                color: "rgba(255,255,255,0.2)",
              }}>
                {p.number}
              </p>
              <p style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 7, letterSpacing: "0.1em",
                color: "rgba(122,154,130,0.5)", marginTop: 2,
              }}>
                {p.position}
              </p>
            </div>

            {/* Nom */}
            <div style={{ flex: 1 }}>
              <p style={{
                fontFamily: "var(--font-body), sans-serif",
                fontWeight: 500, fontSize: 14,
                color: "rgba(255,255,255,0.8)",
              }}>
                {p.firstName} <span style={{ fontWeight: 700 }}>{p.lastName.toUpperCase()}</span>
              </p>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: 24 }}>
              {[
                { label: "MJ", value: p.matchesPlayed },
                { label: "BUTS", value: p.goals },
                { label: "PD", value: p.assists },
              ].map(stat => (
                <div key={stat.label} style={{ textAlign: "center" }}>
                  <p style={{
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontWeight: 900, fontSize: 16, lineHeight: 1,
                    color: "rgba(255,255,255,0.6)",
                  }}>
                    {stat.value}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 7, letterSpacing: "0.08em",
                    color: "rgba(255,255,255,0.2)", marginTop: 2,
                  }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <PlayerStatusBadge status={p.status} />

            <span style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 12, color: "rgba(122,154,130,0.3)",
            }}>
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
