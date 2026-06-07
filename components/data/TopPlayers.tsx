import Link from "next/link"
import type { RosterPlayer } from "@/lib/mock/medical"
import type { PlayerStats } from "@/types/stats"

interface Category {
  label: string
  pick: (s: PlayerStats) => number
  unit: string
}

const CATEGORIES: Category[] = [
  { label: "Buts",            pick: s => s.goals,         unit: "but" },
  { label: "Passes décisives", pick: s => s.assists,      unit: "passe" },
  { label: "Minutes jouées",  pick: s => s.minutesPlayed, unit: "min" },
]

interface Props {
  players: RosterPlayer[]
  stats: PlayerStats[]
}

export default function TopPlayers({ players, stats }: Props) {
  const playerById = new Map(players.map(p => [p.id, p]))

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
      {CATEGORIES.map(cat => {
        const top = [...stats]
          .sort((a, b) => cat.pick(b) - cat.pick(a))
          .slice(0, 3)

        return (
          <div key={cat.label} style={{
            padding: "16px 18px", borderRadius: 12,
            backgroundColor: "#1f1f19",
            border: "1px solid rgba(122,154,130,0.08)",
          }}>
            <p style={{
              fontFamily: "var(--font-mono), monospace", fontSize: 9, fontWeight: 700,
              letterSpacing: "0.08em", color: "rgba(122,154,130,0.55)", marginBottom: 12,
            }}>
              {cat.label.toUpperCase()}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {top.map((s, i) => {
                const player = playerById.get(s.playerId)
                if (!player) return null
                return (
                  <Link key={s.playerId} href={`/dashboard/data/joueurs/${s.playerId}`} style={{
                    display: "flex", alignItems: "center", gap: 10, textDecoration: "none",
                  }}>
                    <span style={{
                      fontFamily: "var(--font-display), system-ui, sans-serif",
                      fontWeight: 900, fontSize: 14, color: "rgba(255,255,255,0.2)", width: 16,
                    }}>
                      {i + 1}
                    </span>
                    <span style={{
                      fontFamily: "var(--font-body), sans-serif", fontWeight: 500,
                      fontSize: 13, color: "rgba(255,255,255,0.8)", flex: 1, minWidth: 0,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {player.name}
                    </span>
                    <span style={{
                      fontFamily: "var(--font-mono), monospace", fontWeight: 700,
                      fontSize: 13, color: "var(--sauge)",
                    }}>
                      {cat.pick(s)}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
