import Link from "next/link"
import PageHeader from "@/components/dashboard/PageHeader"
import PlayerStatsTable from "@/components/data/PlayerStatsTable"
import { getPlayers } from "@/app/dashboard/effectif/actions"
import { toRosterPlayer } from "@/lib/mock/medical"
import { CLUB_STATS, buildPlayerStats, getPlayerStats } from "@/lib/mock/stats"

export default async function StatsJoueursPage() {
  const players = await getPlayers()
  const roster = players.map(toRosterPlayer)
  const playerStats = buildPlayerStats(roster)
  const rows = roster.map(player => ({
    player,
    stats: getPlayerStats(playerStats, player.id)!,
  }))

  return (
    <div style={{ padding: "32px 36px", maxWidth: 960 }}>
      <PageHeader
        label="Mon Club"
        title="Stats individuelles"
        subtitle={`Saison ${CLUB_STATS.season} — ${rows.length} joueur${rows.length !== 1 ? "s" : ""}`}
      />

      {rows.length === 0 ? (
        <div style={{
          padding: "48px 32px", borderRadius: 12, textAlign: "center",
          backgroundColor: "#1f1f19", border: "1px dashed rgba(122,154,130,0.2)",
        }}>
          <p style={{
            fontFamily: "var(--font-body), sans-serif", fontWeight: 300,
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
          <PlayerStatsTable rows={rows} />
        </div>
      )}
    </div>
  )
}
