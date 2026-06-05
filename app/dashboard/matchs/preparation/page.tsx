import Link from "next/link"
import { getNextMatch, MOCK_PLAYERS } from "@/lib/mock-data"
import PlayerStatusBadge from "@/components/dashboard/PlayerStatusBadge"

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
}

export default function MatchPreparationPage() {
  const match = getNextMatch()
  const availablePlayers = MOCK_PLAYERS.filter(p => p.status === "available")
  const unavailablePlayers = MOCK_PLAYERS.filter(p => p.status !== "available")

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <Link href="/dashboard/matchs" style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 8, letterSpacing: "0.08em",
          color: "rgba(122,154,130,0.4)",
          display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 14,
        }}>
          ← MATCHS
        </Link>
        <p style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
          color: "rgba(122,154,130,0.5)", textTransform: "uppercase", marginBottom: 6,
        }}>
          Préparation match
        </p>
        <h1 style={{
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontWeight: 900, fontSize: 24, letterSpacing: "0.02em",
          color: "rgba(255,255,255,0.95)",
        }}>
          vs {match?.opponent ?? "—"}
        </h1>
        {match && (
          <p style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 9, letterSpacing: "0.06em",
            color: "rgba(255,255,255,0.3)", marginTop: 6,
          }}>
            {formatDate(match.date)} · {match.homeAway === "home" ? "DOMICILE" : "EXTÉRIEUR"} · {match.competition}
          </p>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* Joueurs disponibles */}
        <div style={{
          backgroundColor: "#1f1f19",
          border: "1px solid rgba(122,154,130,0.1)",
          borderRadius: 12, padding: "20px 22px",
        }}>
          <p style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
            color: "#7A9A82", textTransform: "uppercase", marginBottom: 14,
          }}>
            Disponibles ({availablePlayers.length})
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {availablePlayers.map(p => (
              <div key={p.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "8px 12px", borderRadius: 8,
                backgroundColor: "rgba(122,154,130,0.04)",
                border: "1px solid rgba(122,154,130,0.07)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontWeight: 900, fontSize: 14, color: "rgba(255,255,255,0.15)",
                    width: 22, textAlign: "center", flexShrink: 0,
                  }}>
                    {p.number}
                  </span>
                  <p style={{
                    fontFamily: "var(--font-body), sans-serif",
                    fontWeight: 400, fontSize: 13,
                    color: "rgba(255,255,255,0.7)",
                  }}>
                    {p.firstName} {p.lastName}
                  </p>
                </div>
                <span style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 8, letterSpacing: "0.06em",
                  color: "rgba(122,154,130,0.5)",
                }}>
                  {p.position}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Indisponibles + lien tactique */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{
            backgroundColor: "#1f1f19",
            border: "1px solid rgba(122,154,130,0.1)",
            borderRadius: 12, padding: "20px 22px",
          }}>
            <p style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
              color: "rgba(224,112,112,0.6)", textTransform: "uppercase", marginBottom: 14,
            }}>
              Indisponibles ({unavailablePlayers.length})
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {unavailablePlayers.map(p => (
                <div key={p.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  gap: 8,
                }}>
                  <p style={{
                    fontFamily: "var(--font-body), sans-serif",
                    fontWeight: 400, fontSize: 13,
                    color: "rgba(255,255,255,0.45)",
                  }}>
                    {p.firstName} {p.lastName}
                    <span style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: 9, color: "rgba(255,255,255,0.2)", marginLeft: 6,
                    }}>
                      #{p.number}
                    </span>
                  </p>
                  <PlayerStatusBadge status={p.status} />
                </div>
              ))}
            </div>
          </div>

          {/* CTA tactique */}
          <div style={{
            backgroundColor: "rgba(122,154,130,0.07)",
            border: "1px solid rgba(122,154,130,0.2)",
            borderRadius: 12, padding: "20px 22px",
          }}>
            <p style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
              color: "#7A9A82", textTransform: "uppercase", marginBottom: 8,
            }}>
              Préparer une situation
            </p>
            <p style={{
              fontFamily: "var(--font-body), sans-serif",
              fontWeight: 300, fontSize: 12, lineHeight: 1.5,
              color: "rgba(255,255,255,0.35)", marginBottom: 14,
            }}>
              Créez une situation tactique pour votre causerie d'avant-match.
            </p>
            <Link href="/tactique/creer" style={{
              display: "inline-block",
              fontFamily: "var(--font-mono), monospace",
              fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
              color: "#7A9A82",
              backgroundColor: "rgba(122,154,130,0.1)",
              border: "1px solid rgba(122,154,130,0.3)",
              padding: "9px 16px", borderRadius: 8,
            }}>
              CRÉER UNE SITUATION →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
