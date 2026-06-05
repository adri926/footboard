import Link from "next/link"
import MetricCard from "@/components/dashboard/MetricCard"
import PlayerStatusBadge from "@/components/dashboard/PlayerStatusBadge"
import {
  MOCK_PLAYERS, MOCK_MATCHES, MOCK_TRAININGS,
  getAvailableCount, getInjuredCount, getUncertainCount, getNextMatch,
  getMonthTrainings,
} from "@/lib/mock-data"

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })
}

export default function DashboardPage() {
  const nextMatch = getNextMatch()
  const available = getAvailableCount()
  const injured = getInjuredCount()
  const uncertain = getUncertainCount()
  const trainings = getMonthTrainings()

  const recentResults = MOCK_MATCHES.filter(m => m.goalsFor !== undefined).slice(0, 3)
  const upcomingMatch = nextMatch

  const injuredPlayers = MOCK_PLAYERS.filter(p => p.status !== "available")

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1100 }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <p style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
          color: "rgba(122,154,130,0.5)", textTransform: "uppercase", marginBottom: 6,
        }}>
          Tableau de bord
        </p>
        <h1 style={{
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontWeight: 900, fontSize: 28, letterSpacing: "0.02em",
          color: "rgba(255,255,255,0.95)",
        }}>
          AS Poincaré
        </h1>
        <p style={{
          fontFamily: "var(--font-body), sans-serif",
          fontWeight: 300, fontSize: 13,
          color: "rgba(255,255,255,0.3)", marginTop: 4,
        }}>
          Régional 2 — Saison 2025/2026
        </p>
      </div>

      {/* 4 metric cards */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 32,
      }}>
        <MetricCard
          label="Prochain match"
          value={upcomingMatch ? formatDate(upcomingMatch.date) : "—"}
          sub={upcomingMatch ? `vs ${upcomingMatch.opponent} · ${upcomingMatch.homeAway === "home" ? "Domicile" : "Extérieur"}` : "Aucun match"}
          accent
        />
        <MetricCard
          label="Joueurs disponibles"
          value={available}
          sub={`sur ${MOCK_PLAYERS.length} dans l'effectif`}
          accent
        />
        <MetricCard
          label="Entraînements ce mois"
          value={trainings}
          sub="séances réalisées"
        />
        <MetricCard
          label="Blessés en cours"
          value={injured + uncertain}
          sub={`${injured} blessé${injured > 1 ? "s" : ""} · ${uncertain} incertain${uncertain > 1 ? "s" : ""}`}
          warn={injured > 0}
        />
      </div>

      {/* 2 columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

        {/* Santé effectif */}
        <div style={{
          backgroundColor: "#1f1f19",
          border: "1px solid rgba(122,154,130,0.1)",
          borderRadius: 12, padding: "20px 22px",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <p style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
              color: "rgba(122,154,130,0.5)", textTransform: "uppercase",
            }}>
              Santé effectif
            </p>
            <Link href="/dashboard/effectif" style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 8, letterSpacing: "0.08em",
              color: "rgba(122,154,130,0.4)",
            }}>
              VOIR TOUT →
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {injuredPlayers.length === 0 ? (
              <p style={{
                fontFamily: "var(--font-body), sans-serif",
                fontWeight: 300, fontSize: 13,
                color: "rgba(255,255,255,0.3)",
              }}>
                Tous les joueurs sont disponibles.
              </p>
            ) : injuredPlayers.map(p => (
              <div key={p.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 12px", borderRadius: 8,
                backgroundColor: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(122,154,130,0.07)",
              }}>
                <div>
                  <p style={{
                    fontFamily: "var(--font-body), sans-serif",
                    fontWeight: 500, fontSize: 13,
                    color: "rgba(255,255,255,0.75)",
                  }}>
                    {p.firstName} {p.lastName}
                    <span style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: 9, letterSpacing: "0.06em",
                      color: "rgba(255,255,255,0.25)", marginLeft: 6,
                    }}>
                      #{p.number} · {p.position}
                    </span>
                  </p>
                  {p.injuryNote && (
                    <p style={{
                      fontFamily: "var(--font-body), sans-serif",
                      fontWeight: 300, fontSize: 11,
                      color: "rgba(255,255,255,0.3)", marginTop: 2,
                    }}>
                      {p.injuryNote}
                    </p>
                  )}
                </div>
                <PlayerStatusBadge status={p.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Résultats récents */}
        <div style={{
          backgroundColor: "#1f1f19",
          border: "1px solid rgba(122,154,130,0.1)",
          borderRadius: 12, padding: "20px 22px",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <p style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
              color: "rgba(122,154,130,0.5)", textTransform: "uppercase",
            }}>
              Résultats récents
            </p>
            <Link href="/dashboard/matchs" style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 8, letterSpacing: "0.08em",
              color: "rgba(122,154,130,0.4)",
            }}>
              VOIR TOUT →
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {recentResults.map(m => {
              const win = (m.goalsFor ?? 0) > (m.goalsAgainst ?? 0)
              const draw = m.goalsFor === m.goalsAgainst
              const resultColor = win ? "#7A9A82" : draw ? "#d4a847" : "#e07070"
              const resultLabel = win ? "V" : draw ? "N" : "D"
              return (
                <div key={m.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 12px", borderRadius: 8,
                  backgroundColor: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(122,154,130,0.07)",
                }}>
                  <div>
                    <p style={{
                      fontFamily: "var(--font-body), sans-serif",
                      fontWeight: 500, fontSize: 13,
                      color: "rgba(255,255,255,0.75)",
                    }}>
                      vs {m.opponent}
                    </p>
                    <p style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: 9, letterSpacing: "0.06em",
                      color: "rgba(255,255,255,0.25)", marginTop: 2,
                    }}>
                      {formatDate(m.date)} · {m.homeAway === "home" ? "DOM" : "EXT"}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      fontFamily: "var(--font-display), system-ui, sans-serif",
                      fontWeight: 900, fontSize: 18,
                      color: "rgba(255,255,255,0.8)",
                    }}>
                      {m.goalsFor} – {m.goalsAgainst}
                    </span>
                    <span style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: 8, fontWeight: 700, letterSpacing: "0.1em",
                      color: resultColor,
                      backgroundColor: `${resultColor}18`,
                      border: `1px solid ${resultColor}40`,
                      padding: "2px 7px", borderRadius: 100,
                    }}>
                      {resultLabel}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Agenda entraînements */}
      <div style={{
        backgroundColor: "#1f1f19",
        border: "1px solid rgba(122,154,130,0.1)",
        borderRadius: 12, padding: "20px 22px",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <p style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
            color: "rgba(122,154,130,0.5)", textTransform: "uppercase",
          }}>
            Derniers entraînements
          </p>
          <Link href="/dashboard/entrainements" style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 8, letterSpacing: "0.08em",
            color: "rgba(122,154,130,0.4)",
          }}>
            VOIR TOUT →
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
          {MOCK_TRAININGS.map(t => (
            <div key={t.id} style={{
              padding: "12px 14px", borderRadius: 8,
              backgroundColor: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(122,154,130,0.07)",
              display: "flex", flexDirection: "column", gap: 4,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <p style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 9, letterSpacing: "0.06em",
                  color: "rgba(122,154,130,0.5)",
                }}>
                  {formatDate(t.date)}
                </p>
                <span style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 8, letterSpacing: "0.06em",
                  color: t.attendees === t.total ? "#7A9A82" : "rgba(255,255,255,0.3)",
                }}>
                  {t.attendees}/{t.total}
                </span>
              </div>
              <p style={{
                fontFamily: "var(--font-body), sans-serif",
                fontWeight: 400, fontSize: 12,
                color: "rgba(255,255,255,0.6)", lineHeight: 1.4,
              }}>
                {t.theme}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
