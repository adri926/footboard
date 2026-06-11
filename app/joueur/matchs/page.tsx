import { redirect } from "next/navigation"
import Link from "next/link"
import PageHeader from "@/components/dashboard/PageHeader"
import { getLinkedPlayer, getClubMatches } from "../actions"
import type { Match } from "@/app/dashboard/matchs/actions"

function localToday(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`
}

function formatDateLong(dateStr: string) {
  const m = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return dateStr
  const d = new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]))
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
}

function MatchCard({ match }: { match: Match }) {
  const hasScore = match.goals_for !== null && match.goals_against !== null
  const win   = hasScore && match.goals_for! > match.goals_against!
  const draw  = hasScore && match.goals_for === match.goals_against
  const color = hasScore ? (win ? "#7A9A82" : draw ? "#d4a847" : "#e07070") : "#d4a847"

  return (
    <Link href={`/joueur/matchs/${match.id}`} style={{ textDecoration: "none" }}>
      <div style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid rgba(122,154,130,0.08)",
        borderRadius: 12, padding: "16px 18px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
      }}>
        <div>
          <p style={{
            fontFamily: "var(--font-mono), monospace", fontSize: 9,
            letterSpacing: "0.08em", color: "rgba(122,154,130,0.6)",
            textTransform: "capitalize", marginBottom: 6,
          }}>
            {formatDateLong(match.date)}
          </p>
          <p style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontWeight: 900, fontSize: 18, color: "rgba(255,255,255,0.92)",
          }}>
            vs {match.opponent}
          </p>
          <p style={{
            fontFamily: "var(--font-body), sans-serif", fontWeight: 400, fontSize: 12,
            color: "rgba(255,255,255,0.4)", marginTop: 4,
          }}>
            {match.home_away === "home" ? "🏠 Domicile" : "✈️ Extérieur"}
            {match.competition ? ` · ${match.competition}` : ""}
            {match.venue ? ` · ${match.venue}` : ""}
          </p>
        </div>

        {hasScore ? (
          <div style={{ textAlign: "right" }}>
            <p style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontWeight: 900, fontSize: 24, color: "rgba(255,255,255,0.9)",
            }}>
              {match.goals_for} – {match.goals_against}
            </p>
            <span style={{
              fontFamily: "var(--font-mono), monospace", fontSize: 8, fontWeight: 700,
              letterSpacing: "0.08em", color,
              backgroundColor: `${color}18`, border: `1px solid ${color}40`,
              padding: "3px 10px", borderRadius: 100,
            }}>
              {win ? "VICTOIRE" : draw ? "NUL" : "DÉFAITE"}
            </span>
          </div>
        ) : (
          <span style={{
            fontFamily: "var(--font-mono), monospace", fontSize: 8, fontWeight: 700,
            letterSpacing: "0.08em", color: "rgba(212,168,71,0.7)",
            backgroundColor: "rgba(212,168,71,0.1)", border: "1px solid rgba(212,168,71,0.3)",
            padding: "3px 10px", borderRadius: 100, whiteSpace: "nowrap",
          }}>
            À VENIR
          </span>
        )}
      </div>
    </Link>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "var(--font-mono), monospace",
      fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
      color: "rgba(122,154,130,0.5)", textTransform: "uppercase",
      marginBottom: 12,
    }}>
      {children}
    </p>
  )
}

export default async function JoueurMatchsPage() {
  const linked = await getLinkedPlayer()
  if (!linked) redirect("/onboarding")

  const matches = await getClubMatches(linked.club.owner_id)
  const today = localToday()

  const upcoming = matches.filter(m => m.date.slice(0, 10) >= today).sort((a, b) => a.date.localeCompare(b.date))
  const past     = matches.filter(m => m.date.slice(0, 10) < today)

  return (
    <div style={{ padding: "32px 36px", maxWidth: 760 }}>
      <PageHeader label="Mon Club" title="Matchs" />

      {matches.length === 0 && (
        <p style={{
          fontFamily: "var(--font-body), sans-serif", fontWeight: 400, fontSize: 13,
          color: "rgba(255,255,255,0.3)",
        }}>
          Aucun match programmé pour le moment.
        </p>
      )}

      {upcoming.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <SectionLabel>À venir</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {upcoming.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <SectionLabel>Passés</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {past.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        </div>
      )}
    </div>
  )
}
