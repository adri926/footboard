import PageHeader from "@/components/dashboard/PageHeader"
import PlayerStatsTable from "@/components/data/PlayerStatsTable"
import { MOCK_PLAYERS } from "@/lib/mock/medical"
import { CLUB_STATS, getPlayerStats } from "@/lib/mock/stats"

export default function StatsJoueursPage() {
  const rows = MOCK_PLAYERS.map(player => ({
    player,
    stats: getPlayerStats(player.id)!,
  }))

  return (
    <div style={{ padding: "32px 36px", maxWidth: 960 }}>
      <PageHeader
        label="Mon Club"
        title="Stats individuelles"
        subtitle={`Saison ${CLUB_STATS.season} — ${rows.length} joueurs`}
      />

      <div style={{
        padding: "20px 22px", borderRadius: 12,
        backgroundColor: "#1a1a15",
        border: "1px solid rgba(122,154,130,0.08)",
      }}>
        <PlayerStatsTable rows={rows} />
      </div>
    </div>
  )
}
