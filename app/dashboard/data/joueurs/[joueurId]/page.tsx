import Link from "next/link"
import { notFound } from "next/navigation"
import PageHeader from "@/components/dashboard/PageHeader"
import PlayerProgressionChart from "@/components/data/PlayerProgressionChart"
import { getPlayers } from "@/app/dashboard/effectif/actions"
import { toRosterPlayer } from "@/lib/mock/medical"
import { buildPlayerStats, getPlayerStats, getPlayerProgression } from "@/lib/mock/stats"

interface Props {
  params: Promise<{ joueurId: string }>
}

const STAT_LABELS: { key: "matchesPlayed" | "starts" | "goals" | "assists" | "minutesPlayed"; label: string }[] = [
  { key: "matchesPlayed", label: "Matchs joués" },
  { key: "starts",        label: "Titularisations" },
  { key: "goals",         label: "Buts" },
  { key: "assists",       label: "Passes décisives" },
  { key: "minutesPlayed", label: "Minutes jouées" },
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{
      padding: "20px 22px", borderRadius: 12, marginBottom: 16,
      backgroundColor: "#1a1a15",
      border: "1px solid rgba(122,154,130,0.08)",
    }}>
      <h2 style={{
        fontFamily: "var(--font-mono), monospace", fontSize: 10, fontWeight: 700,
        letterSpacing: "0.1em", color: "rgba(122,154,130,0.6)",
        textTransform: "uppercase", marginBottom: 14,
      }}>
        {title}
      </h2>
      {children}
    </section>
  )
}

export default async function ProfilStatsPage({ params }: Props) {
  const { joueurId } = await params
  const players = await getPlayers()
  const roster = players.map(toRosterPlayer)
  const player = roster.find(p => p.id === joueurId)
  const playerStats = buildPlayerStats(roster)
  const stats = getPlayerStats(playerStats, joueurId)
  if (!player || !stats) notFound()

  const progression = getPlayerProgression(playerStats, joueurId)

  return (
    <div style={{ padding: "32px 36px", maxWidth: 760 }}>
      <Link href="/dashboard/data/joueurs" style={{
        fontFamily: "var(--font-mono), monospace", fontSize: 10,
        letterSpacing: "0.06em", color: "rgba(122,154,130,0.5)",
        textDecoration: "none", display: "inline-block", marginBottom: 16,
      }}>
        ← STATS INDIVIDUELLES
      </Link>

      <PageHeader
        label={`${player.position} · N°${player.number}`}
        title={player.name}
        subtitle={`Saison ${stats.season}`}
        action={stats.rating !== null && (
          <div style={{ textAlign: "right" }}>
            <p style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontWeight: 900, fontSize: 28, color: "var(--sauge)", lineHeight: 1,
            }}>
              {stats.rating.toFixed(1)}
            </p>
            <p style={{
              fontFamily: "var(--font-mono), monospace", fontSize: 9,
              letterSpacing: "0.06em", color: "rgba(255,255,255,0.3)", marginTop: 2,
            }}>
              NOTE MOYENNE
            </p>
          </div>
        )}
      />

      <Section title="Statistiques de la saison">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
          {STAT_LABELS.map(({ key, label }) => (
            <div key={key}>
              <p style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontWeight: 900, fontSize: 22, color: "rgba(255,255,255,0.9)", lineHeight: 1,
              }}>
                {stats[key]}
              </p>
              <p style={{
                fontFamily: "var(--font-mono), monospace", fontSize: 9, fontWeight: 700,
                letterSpacing: "0.05em", color: "rgba(255,255,255,0.3)", marginTop: 6,
              }}>
                {label.toUpperCase()}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Progression — notes des derniers matchs">
        <PlayerProgressionChart progression={progression} />
      </Section>
    </div>
  )
}
