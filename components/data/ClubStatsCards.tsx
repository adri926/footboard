import type { ClubStats } from "@/types/stats"

interface Props {
  stats: ClubStats
}

export default function ClubStatsCards({ stats }: Props) {
  const cards = [
    { label: "Matchs joués",   value: stats.matches,                                   sub: `${stats.wins}V · ${stats.draws}N · ${stats.losses}D` },
    { label: "Buts marqués",   value: stats.goalsFor,                                  sub: `${(stats.goalsFor / Math.max(stats.matches, 1)).toFixed(1)} / match` },
    { label: "Buts encaissés", value: stats.goalsAgainst,                              sub: `${(stats.goalsAgainst / Math.max(stats.matches, 1)).toFixed(1)} / match` },
    { label: "Possession moy.", value: `${stats.possession}%`,                          sub: `Saison ${stats.season}` },
  ]

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 28 }}>
      {cards.map(c => (
        <div key={c.label} style={{
          padding: "16px 18px", borderRadius: 12,
          backgroundColor: "#1f1f19",
          border: "1px solid rgba(122,154,130,0.08)",
        }}>
          <p style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontWeight: 900, fontSize: 26, color: "rgba(255,255,255,0.92)", lineHeight: 1,
          }}>
            {c.value}
          </p>
          <p style={{
            fontFamily: "var(--font-mono), monospace", fontSize: 9, fontWeight: 700,
            letterSpacing: "0.06em", color: "rgba(122,154,130,0.55)", marginTop: 6,
          }}>
            {c.label.toUpperCase()}
          </p>
          <p style={{
            fontFamily: "var(--font-body), sans-serif", fontWeight: 300,
            fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2,
          }}>
            {c.sub}
          </p>
        </div>
      ))}
    </div>
  )
}
