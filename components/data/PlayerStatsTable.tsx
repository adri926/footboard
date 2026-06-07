import Link from "next/link"
import type { RosterPlayer } from "@/lib/mock/medical"
import type { PlayerStats } from "@/types/stats"

const POS_ORDER: Record<string, number> = { GK: 0, DEF: 1, MIL: 2, ATT: 3 }

interface Row {
  player: RosterPlayer
  stats: PlayerStats
}

interface Props {
  rows: Row[]
}

export default function PlayerStatsTable({ rows }: Props) {
  const sorted = [...rows].sort((a, b) => {
    const pd = (POS_ORDER[a.player.position] ?? 9) - (POS_ORDER[b.player.position] ?? 9)
    return pd !== 0 ? pd : a.player.number - b.player.number
  })

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
        <thead>
          <tr>
            {["Joueur", "MJ", "Titu.", "Buts", "Passes D.", "Minutes", "Note"].map((h, i) => (
              <th key={h} style={{
                textAlign: i === 0 ? "left" : "right",
                padding: "0 12px 10px", whiteSpace: "nowrap",
                fontFamily: "var(--font-mono), monospace", fontSize: 9, fontWeight: 700,
                letterSpacing: "0.06em", color: "rgba(122,154,130,0.5)",
              }}>
                {h.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map(({ player, stats }) => (
            <tr key={player.id}>
              <td style={{ padding: "10px 12px", borderTop: "1px solid rgba(122,154,130,0.08)" }}>
                <Link href={`/dashboard/data/joueurs/${player.id}`} style={{
                  display: "flex", alignItems: "center", gap: 10, textDecoration: "none",
                }}>
                  <span style={{
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontWeight: 900, fontSize: 14, color: "rgba(255,255,255,0.2)", width: 20,
                  }}>
                    {player.number}
                  </span>
                  <span style={{
                    fontFamily: "var(--font-body), sans-serif", fontWeight: 500,
                    fontSize: 13, color: "rgba(255,255,255,0.85)",
                  }}>
                    {player.name}
                  </span>
                  <span style={{
                    fontFamily: "var(--font-mono), monospace", fontSize: 9,
                    letterSpacing: "0.04em", color: "rgba(255,255,255,0.25)",
                  }}>
                    {player.position}
                  </span>
                </Link>
              </td>
              <Cell value={stats.matchesPlayed} />
              <Cell value={stats.starts} />
              <Cell value={stats.goals} />
              <Cell value={stats.assists} />
              <Cell value={stats.minutesPlayed} />
              <Cell value={stats.rating !== null ? stats.rating.toFixed(1) : "—"} accent />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Cell({ value, accent }: { value: number | string; accent?: boolean }) {
  return (
    <td style={{
      padding: "10px 12px", textAlign: "right",
      borderTop: "1px solid rgba(122,154,130,0.08)",
      fontFamily: "var(--font-mono), monospace", fontWeight: accent ? 700 : 400,
      fontSize: 13, color: accent ? "var(--sauge)" : "rgba(255,255,255,0.7)",
    }}>
      {value}
    </td>
  )
}
