import Link from "next/link"
import PageHeader from "@/components/dashboard/PageHeader"
import ClubStatsCards from "@/components/data/ClubStatsCards"
import TopPlayers from "@/components/data/TopPlayers"
import ResultsChart from "@/components/data/ResultsChart"
import { MOCK_PLAYERS } from "@/lib/mock/medical"
import { CLUB_STATS, PLAYER_STATS, SEASON_RESULTS } from "@/lib/mock/stats"

function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
      <h2 style={{
        fontFamily: "var(--font-mono), monospace", fontSize: 10, fontWeight: 700,
        letterSpacing: "0.1em", color: "rgba(122,154,130,0.6)", textTransform: "uppercase",
      }}>
        {children}
      </h2>
      {action}
    </div>
  )
}

export default function DataPage() {
  return (
    <div style={{ padding: "32px 36px", maxWidth: 960 }}>
      <PageHeader
        label="Mon Club"
        title="Data & statistiques"
        subtitle={`Saison ${CLUB_STATS.season} — vue d'ensemble des performances du club`}
      />

      <ClubStatsCards stats={CLUB_STATS} />

      <div style={{
        padding: "20px 22px", borderRadius: 12, marginBottom: 20,
        backgroundColor: "#1a1a15",
        border: "1px solid rgba(122,154,130,0.08)",
      }}>
        <SectionTitle>Évolution des résultats</SectionTitle>
        <ResultsChart results={SEASON_RESULTS} />
      </div>

      <div style={{
        padding: "20px 22px", borderRadius: 12, marginBottom: 20,
        backgroundColor: "#1a1a15",
        border: "1px solid rgba(122,154,130,0.08)",
      }}>
        <SectionTitle action={
          <Link href="/dashboard/data/joueurs" style={{
            fontFamily: "var(--font-mono), monospace", fontSize: 9, fontWeight: 700,
            letterSpacing: "0.06em", color: "rgba(122,154,130,0.5)", textDecoration: "none",
          }}>
            TOUTES LES STATS →
          </Link>
        }>
          Top joueurs de la saison
        </SectionTitle>
        <TopPlayers players={MOCK_PLAYERS} stats={PLAYER_STATS} />
      </div>
    </div>
  )
}
