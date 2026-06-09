import Link from "next/link"
import PageHeader from "@/components/dashboard/PageHeader"
import { getPlayers } from "@/app/dashboard/effectif/actions"
import { toRosterPlayer } from "@/lib/roster"
import { getPlayerSeasonStats } from "@/app/dashboard/matchs/actions"

const POSITION_ORDER: Record<string, number> = { GK: 0, DEF: 1, MIL: 2, ATT: 3 }

export default async function StatsJoueursPage() {
  const [players, seasonStats] = await Promise.all([
    getPlayers(),
    getPlayerSeasonStats(),
  ])
  const roster = players.map(toRosterPlayer).sort((a, b) => {
    const pd = (POSITION_ORDER[a.position] ?? 9) - (POSITION_ORDER[b.position] ?? 9)
    return pd !== 0 ? pd : a.number - b.number
  })

  const EMPTY = { matchesPlayed: 0, starts: 0, goals: 0, assists: 0, minutesPlayed: 0 }

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1040 }}>
      <PageHeader
        label="Mon Club"
        title="Stats individuelles"
        subtitle={`${roster.length} joueur${roster.length !== 1 ? "s" : ""}`}
      />

      {roster.length === 0 ? (
        <div style={{
          padding: "48px 32px", borderRadius: 12, textAlign: "center",
          backgroundColor: "#1f1f19", border: "1px dashed rgba(122,154,130,0.2)",
        }}>
          <p style={{
            fontFamily: "var(--font-body), sans-serif", fontWeight: 400,
            fontSize: 14, color: "rgba(255,255,255,0.3)", marginBottom: 8,
          }}>
            Aucun joueur dans l'effectif pour le moment.
          </p>
          <Link href="/dashboard/effectif" style={{
            fontFamily: "var(--font-mono), monospace", fontSize: 9,
            letterSpacing: "0.08em", color: "rgba(122,154,130,0.5)",
          }}>
            GÉRER L'EFFECTIF →
          </Link>
        </div>
      ) : (
        <div style={{
          padding: "20px 22px", borderRadius: 12,
          backgroundColor: "#1a1a15",
          border: "1px solid rgba(122,154,130,0.08)",
        }}>
          <p style={{
            fontFamily: "var(--font-body), sans-serif", fontWeight: 400,
            fontSize: 12, color: "rgba(255,255,255,0.3)", lineHeight: 1.6, marginBottom: 16,
          }}>
            Statistiques calculées à partir des compositions et des bilans de match saisis dans{" "}
            <Link href="/dashboard/matchs" style={{ color: "rgba(122,154,130,0.6)" }}>la rubrique Matchs</Link>.
          </p>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{
                    textAlign: "left", padding: "0 12px 10px 0",
                    fontFamily: "var(--font-mono), monospace", fontSize: 9, fontWeight: 700,
                    letterSpacing: "0.08em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase",
                  }}>
                    Joueur
                  </th>
                  {["MJ", "Titu", "Buts", "Passes D", "Minutes"].map(label => (
                    <th key={label} style={{
                      textAlign: "center", padding: "0 10px 10px",
                      fontFamily: "var(--font-mono), monospace", fontSize: 9, fontWeight: 700,
                      letterSpacing: "0.08em", color: "rgba(122,154,130,0.5)", textTransform: "uppercase",
                    }}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {roster.map(player => {
                  const s = seasonStats[player.id] ?? EMPTY
                  return (
                    <tr key={player.id} style={{ borderTop: "1px solid rgba(122,154,130,0.06)" }}>
                      <td style={{ padding: "10px 12px 10px 0" }}>
                        <Link href={`/dashboard/data/joueurs/${player.id}`} style={{
                          display: "flex", alignItems: "center", gap: 10, textDecoration: "none",
                        }}>
                          <span style={{
                            fontFamily: "var(--font-display), system-ui, sans-serif",
                            fontWeight: 900, fontSize: 16, color: "rgba(255,255,255,0.15)",
                            width: 22, textAlign: "center", flexShrink: 0,
                          }}>
                            {player.number || "—"}
                          </span>
                          <span style={{
                            fontFamily: "var(--font-body), sans-serif", fontWeight: 500,
                            fontSize: 13, color: "rgba(255,255,255,0.85)",
                          }}>
                            {player.name}
                          </span>
                          <span style={{
                            fontFamily: "var(--font-mono), monospace", fontSize: 9,
                            letterSpacing: "0.06em", color: "rgba(255,255,255,0.25)",
                          }}>
                            {player.position === "GK" ? "GB" : player.position}
                          </span>
                        </Link>
                      </td>
                      <td style={tdStyle}>{s.matchesPlayed}</td>
                      <td style={tdStyle}>{s.starts}</td>
                      <td style={{ ...tdStyle, color: s.goals > 0 ? "#7A9A82" : tdStyle.color }}>{s.goals}</td>
                      <td style={tdStyle}>{s.assists}</td>
                      <td style={tdStyle}>{s.minutesPlayed}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

const tdStyle: React.CSSProperties = {
  padding: "10px", textAlign: "center",
  fontFamily: "var(--font-mono), monospace", fontSize: 12,
  color: "rgba(255,255,255,0.6)",
}
