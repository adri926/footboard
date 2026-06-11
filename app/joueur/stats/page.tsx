import { redirect } from "next/navigation"
import Link from "next/link"
import PageHeader from "@/components/dashboard/PageHeader"
import MetricCard from "@/components/dashboard/MetricCard"
import { getLinkedPlayer, getMyPlayerStats, getMyMatchHistory } from "../actions"

function formatDateLong(dateStr: string) {
  const m = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return dateStr
  const d = new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]))
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })
}

export default async function JoueurStatsPage() {
  const linked = await getLinkedPlayer()
  if (!linked) redirect("/onboarding")

  const [stats, history] = await Promise.all([
    getMyPlayerStats(linked.club.owner_id, linked.player.id),
    getMyMatchHistory(linked.club.owner_id, linked.player.id),
  ])

  return (
    <div style={{ padding: "32px 36px", maxWidth: 760 }}>
      <PageHeader label="Mon Profil" title="Mes statistiques" subtitle="Statistiques cumulées sur la saison." />

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: 14, marginBottom: 32,
      }}>
        <MetricCard label="Matchs joués" value={stats.matchesPlayed} accent />
        <MetricCard label="Titularisations" value={stats.starts} />
        <MetricCard label="Buts" value={stats.goals} accent />
        <MetricCard label="Passes décisives" value={stats.assists} />
        <MetricCard label="Minutes jouées" value={stats.minutesPlayed} />
      </div>

      <p style={{
        fontFamily: "var(--font-mono), monospace",
        fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
        color: "rgba(122,154,130,0.5)", textTransform: "uppercase",
        marginBottom: 12,
      }}>
        Historique des matchs
      </p>

      {history.length === 0 ? (
        <p style={{
          fontFamily: "var(--font-body), sans-serif", fontWeight: 400, fontSize: 13,
          color: "rgba(255,255,255,0.3)",
        }}>
          Aucun match joué pour le moment.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {history.map(entry => (
            <Link key={entry.match.id} href={`/joueur/matchs/${entry.match.id}`} style={{ textDecoration: "none" }}>
              <div style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid rgba(122,154,130,0.08)",
                borderRadius: 12, padding: "14px 18px",
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
              }}>
                <div>
                  <p style={{
                    fontFamily: "var(--font-mono), monospace", fontSize: 9,
                    letterSpacing: "0.08em", color: "rgba(122,154,130,0.6)", marginBottom: 4,
                  }}>
                    {formatDateLong(entry.match.date)}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontWeight: 900, fontSize: 16, color: "rgba(255,255,255,0.92)",
                  }}>
                    vs {entry.match.opponent}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-mono), monospace", fontSize: 8,
                    letterSpacing: "0.06em", color: "rgba(255,255,255,0.25)",
                    textTransform: "uppercase", marginTop: 4,
                  }}>
                    {entry.role === "starter" ? "Titulaire" : "Remplaçant"}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 16, textAlign: "center" }}>
                  <div>
                    <p style={{ fontFamily: "var(--font-display), system-ui, sans-serif", fontWeight: 900, fontSize: 18, color: "#7A9A82" }}>{entry.goals}</p>
                    <p style={{ fontFamily: "var(--font-mono), monospace", fontSize: 7, color: "rgba(255,255,255,0.25)", letterSpacing: "0.08em" }}>BUTS</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-display), system-ui, sans-serif", fontWeight: 900, fontSize: 18, color: "rgba(255,255,255,0.85)" }}>{entry.assists}</p>
                    <p style={{ fontFamily: "var(--font-mono), monospace", fontSize: 7, color: "rgba(255,255,255,0.25)", letterSpacing: "0.08em" }}>PASSES D.</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-display), system-ui, sans-serif", fontWeight: 900, fontSize: 18, color: "rgba(255,255,255,0.85)" }}>{entry.minutesPlayed}'</p>
                    <p style={{ fontFamily: "var(--font-mono), monospace", fontSize: 7, color: "rgba(255,255,255,0.25)", letterSpacing: "0.08em" }}>MINUTES</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
