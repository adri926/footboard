import Link from "next/link"
import PageHeader from "@/components/dashboard/PageHeader"
import ClubLogo from "@/components/dashboard/ClubLogo"
import { getMatches } from "@/app/dashboard/matchs/actions"
import { getMyClub } from "@/app/dashboard/club/actions"
import { computeClubStats } from "@/lib/clubStats"

function parseDate(s: string) {
  const m = s.match(/(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return null
  return new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]))
}

function formatDate(s: string) {
  const d = parseDate(s)
  if (!d) return s
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })
}

const CARD_DEFS: { key: keyof ReturnType<typeof computeClubStats>; label: string; color: string }[] = [
  { key: "played",       label: "Matchs joués", color: "rgba(255,255,255,0.7)" },
  { key: "wins",         label: "Victoires",    color: "#7A9A82" },
  { key: "draws",        label: "Nuls",         color: "#d4a847" },
  { key: "losses",       label: "Défaites",     color: "#e07070" },
]

export default async function DataPage() {
  const [matches, club] = await Promise.all([getMatches(), getMyClub()])
  const stats = computeClubStats(matches)
  const played = matches.filter(m => m.goals_for !== null && m.goals_against !== null)
  const goalDiff = stats.goalsFor - stats.goalsAgainst
  const clubName = club?.name ?? "Mon club"
  const clubLogo = club?.logo ?? null

  return (
    <div className="page-pad" style={{ maxWidth: 960 }}>
      <PageHeader
        label="Mon Club"
        title="Data & statistiques"
        subtitle={`${stats.played} match${stats.played !== 1 ? "s" : ""} joué${stats.played !== 1 ? "s" : ""} cette saison`}
      />

      {stats.played === 0 ? (
        <div style={{
          padding: "48px 32px", borderRadius: 12, textAlign: "center",
          backgroundColor: "var(--bg-card)", border: "1px dashed rgba(122,154,130,0.2)",
        }}>
          <p style={{
            fontFamily: "var(--font-body), sans-serif", fontWeight: 400,
            fontSize: 14, color: "rgba(255,255,255,0.3)", marginBottom: 8,
          }}>
            Aucun résultat de match enregistré pour le moment.
          </p>
          <Link href="/dashboard/matchs" style={{
            fontFamily: "var(--font-mono), monospace", fontSize: 9,
            letterSpacing: "0.08em", color: "rgba(122,154,130,0.5)",
          }}>
            SAISIR UN RÉSULTAT →
          </Link>
        </div>
      ) : (
        <>
          <p style={{
            fontFamily: "var(--font-body), sans-serif", fontWeight: 400,
            fontSize: 12, color: "rgba(255,255,255,0.3)", lineHeight: 1.6, marginBottom: 20,
          }}>
            Statistiques calculées à partir des résultats saisis dans{" "}
            <Link href="/dashboard/matchs" style={{ color: "rgba(122,154,130,0.6)" }}>la rubrique Matchs</Link>.
          </p>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16,
          }}>
            {CARD_DEFS.map(def => (
              <div key={def.key} style={{
                padding: "16px 18px", borderRadius: 12,
                backgroundColor: "var(--bg-card)",
                border: "1px solid rgba(122,154,130,0.08)",
              }}>
                <p style={{
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  fontWeight: 900, fontSize: 28, color: def.color, lineHeight: 1,
                }}>
                  {stats[def.key]}
                </p>
                <p style={{
                  fontFamily: "var(--font-mono), monospace", fontSize: 9, fontWeight: 700,
                  letterSpacing: "0.06em", color: "rgba(255,255,255,0.35)", marginTop: 6,
                }}>
                  {def.label.toUpperCase()}
                </p>
              </div>
            ))}
          </div>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 28,
          }}>
            <div style={{ padding: "16px 18px", borderRadius: 12, backgroundColor: "var(--bg-card)", border: "1px solid rgba(122,154,130,0.08)" }}>
              <p style={{ fontFamily: "var(--font-display), system-ui, sans-serif", fontWeight: 900, fontSize: 22, color: "rgba(255,255,255,0.8)" }}>{stats.goalsFor}</p>
              <p style={{ fontFamily: "var(--font-mono), monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", color: "rgba(255,255,255,0.35)", marginTop: 6 }}>BUTS MARQUÉS</p>
            </div>
            <div style={{ padding: "16px 18px", borderRadius: 12, backgroundColor: "var(--bg-card)", border: "1px solid rgba(122,154,130,0.08)" }}>
              <p style={{ fontFamily: "var(--font-display), system-ui, sans-serif", fontWeight: 900, fontSize: 22, color: "rgba(255,255,255,0.8)" }}>{stats.goalsAgainst}</p>
              <p style={{ fontFamily: "var(--font-mono), monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", color: "rgba(255,255,255,0.35)", marginTop: 6 }}>BUTS ENCAISSÉS</p>
            </div>
            <div style={{ padding: "16px 18px", borderRadius: 12, backgroundColor: "var(--bg-card)", border: "1px solid rgba(122,154,130,0.08)" }}>
              <p style={{ fontFamily: "var(--font-display), system-ui, sans-serif", fontWeight: 900, fontSize: 22, color: goalDiff > 0 ? "#7A9A82" : goalDiff < 0 ? "#e07070" : "rgba(255,255,255,0.8)" }}>
                {goalDiff > 0 ? "+" : ""}{goalDiff}
              </p>
              <p style={{ fontFamily: "var(--font-mono), monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", color: "rgba(255,255,255,0.35)", marginTop: 6 }}>DIFFÉRENCE DE BUTS</p>
            </div>
          </div>

          <div style={{
            padding: "20px 22px", borderRadius: 12, marginBottom: 16,
            backgroundColor: "var(--bg-card)",
            border: "1px solid rgba(122,154,130,0.08)",
          }}>
            <h2 style={{
              fontFamily: "var(--font-mono), monospace", fontSize: 10, fontWeight: 700,
              letterSpacing: "0.1em", color: "rgba(122,154,130,0.6)",
              textTransform: "uppercase", marginBottom: 14,
            }}>
              Derniers résultats
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {played.slice(0, 8).map(m => {
                const gf = m.goals_for!
                const ga = m.goals_against!
                const resultColor = gf > ga ? "#7A9A82" : gf === ga ? "#d4a847" : "#e07070"
                return (
                  <div key={m.id} style={{
                    display: "flex", alignItems: "center",
                    padding: "8px 12px", borderRadius: 8,
                    backgroundColor: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(122,154,130,0.06)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 9, color: "rgba(255,255,255,0.25)", width: 50 }}>
                        {formatDate(m.date)}
                      </span>
                      <ClubLogo src={clubLogo} name={clubName} size={22} />
                      <span style={{
                        fontFamily: "var(--font-display), system-ui, sans-serif",
                        fontWeight: 900, fontSize: 18, color: resultColor, minWidth: 48, textAlign: "center",
                      }}>
                        {gf} – {ga}
                      </span>
                      <ClubLogo src={m.opponent_logo} name={m.opponent} size={22} />
                      <span style={{ fontFamily: "var(--font-body), sans-serif", fontWeight: 400, fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                        {m.home_away === "home" ? "vs" : "@"} {m.opponent}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <Link href="/dashboard/data/joueurs" style={{
            fontFamily: "var(--font-mono), monospace", fontSize: 9, fontWeight: 700,
            letterSpacing: "0.06em", color: "rgba(122,154,130,0.5)", textDecoration: "none",
          }}>
            VOIR LES STATISTIQUES JOUEURS →
          </Link>
        </>
      )}
    </div>
  )
}
