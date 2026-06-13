import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import PageHeader from "@/components/dashboard/PageHeader"
import { getLinkedPlayer, getClubMatchById, getClubMatchLineup, getMyAvailability } from "../../actions"
import { getPlayerClubScope } from "@/lib/scope"
import type { Player } from "@/app/dashboard/effectif/actions"

const POSITION_LABELS: Record<string, string> = {
  GK: "Gardien", DEF: "Défenseur", MIL: "Milieu", ATT: "Attaquant",
}

function formatDateLong(dateStr: string) {
  const m = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return dateStr
  const d = new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]))
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
}

function PlayerRow({ player, isMe }: { player: Player; isMe: boolean }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "8px 12px", borderRadius: 8,
      backgroundColor: isMe ? "rgba(122,154,130,0.1)" : "transparent",
      border: isMe ? "1px solid rgba(122,154,130,0.3)" : "1px solid transparent",
    }}>
      <span style={{
        fontFamily: "var(--font-mono), monospace", fontSize: 11, fontWeight: 700,
        color: "rgba(122,154,130,0.6)", width: 24, textAlign: "center", flexShrink: 0,
      }}>
        {player.number ?? "—"}
      </span>
      <span style={{
        fontFamily: "var(--font-body), sans-serif", fontWeight: isMe ? 600 : 400, fontSize: 13,
        color: isMe ? "#7A9A82" : "rgba(255,255,255,0.75)", flex: 1,
      }}>
        {player.first_name} {player.last_name}
      </span>
      <span style={{
        fontFamily: "var(--font-mono), monospace", fontSize: 8,
        letterSpacing: "0.06em", color: "rgba(255,255,255,0.25)",
        textTransform: "uppercase",
      }}>
        {POSITION_LABELS[player.position] ?? player.position}
      </span>
    </div>
  )
}

export default async function JoueurMatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const linked = await getLinkedPlayer()
  if (!linked) redirect("/onboarding")

  const scope = getPlayerClubScope(linked.club)
  const match = await getClubMatchById(scope, id)
  if (!match) notFound()

  const lineup = await getClubMatchLineup(scope, id)
  const myAvailability = await getMyAvailability(scope, linked.player.id)
  const myStatus = myAvailability[id]
  const hasLineup = lineup.starters.length > 0 || lineup.substitutes.length > 0
  const hasScore = match.goals_for !== null && match.goals_against !== null
  const win  = hasScore && match.goals_for! > match.goals_against!
  const draw = hasScore && match.goals_for === match.goals_against
  const resultColor = win ? "#7A9A82" : draw ? "#d4a847" : "#e07070"

  return (
    <div style={{ padding: "32px 36px", maxWidth: 640 }}>
      <Link href="/joueur/matchs" style={{
        fontFamily: "var(--font-mono), monospace", fontSize: 9, fontWeight: 700,
        letterSpacing: "0.08em", color: "rgba(122,154,130,0.6)",
        textDecoration: "none", display: "inline-block", marginBottom: 16,
      }}>
        ← Retour aux matchs
      </Link>

      <PageHeader
        label={match.home_away === "home" ? "Domicile" : "Extérieur"}
        title={`vs ${match.opponent}`}
        subtitle={formatDateLong(match.date)}
      />

      <div style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid rgba(122,154,130,0.08)",
        borderRadius: 12, padding: "20px 22px", marginBottom: 24,
      }}>
        {hasScore ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <span style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontWeight: 900, fontSize: 32, color: "rgba(255,255,255,0.9)",
            }}>
              {match.goals_for} – {match.goals_against}
            </span>
            <span style={{
              fontFamily: "var(--font-mono), monospace", fontSize: 8, fontWeight: 700,
              letterSpacing: "0.1em", color: resultColor,
              backgroundColor: `${resultColor}18`, border: `1px solid ${resultColor}40`,
              padding: "3px 10px", borderRadius: 100,
            }}>
              {win ? "VICTOIRE" : draw ? "NUL" : "DÉFAITE"}
            </span>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              fontFamily: "var(--font-mono), monospace", fontSize: 9, fontWeight: 700,
              letterSpacing: "0.08em", color: "rgba(212,168,71,0.7)",
              backgroundColor: "rgba(212,168,71,0.1)", border: "1px solid rgba(212,168,71,0.3)",
              padding: "3px 10px", borderRadius: 100,
            }}>
              À VENIR
            </span>
            {myStatus && (
              <span style={{
                fontFamily: "var(--font-mono), monospace", fontSize: 9, fontWeight: 700,
                letterSpacing: "0.08em", color: myStatus === "present" ? "#7A9A82" : "#e07070",
                backgroundColor: myStatus === "present" ? "rgba(122,154,130,0.1)" : "rgba(224,112,112,0.1)",
                border: `1px solid ${myStatus === "present" ? "rgba(122,154,130,0.3)" : "rgba(224,112,112,0.3)"}`,
                padding: "3px 10px", borderRadius: 100,
              }}>
                {myStatus === "present" ? "✓ PRÉSENT" : "✗ ABSENT"}
              </span>
            )}
          </div>
        )}

        {match.competition && (
          <p style={{ fontFamily: "var(--font-body), sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 12 }}>
            🏆 {match.competition}
          </p>
        )}
        {match.venue && (
          <p style={{ fontFamily: "var(--font-body), sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>
            📍 {match.venue}
          </p>
        )}
        {match.notes && (
          <p style={{ fontFamily: "var(--font-body), sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 12, lineHeight: 1.5 }}>
            {match.notes}
          </p>
        )}
      </div>

      <p style={{
        fontFamily: "var(--font-mono), monospace",
        fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
        color: "rgba(122,154,130,0.5)", textTransform: "uppercase",
        marginBottom: 12,
      }}>
        Composition
      </p>

      {!hasLineup ? (
        <p style={{
          fontFamily: "var(--font-body), sans-serif", fontWeight: 400, fontSize: 13,
          color: "rgba(255,255,255,0.3)",
        }}>
          La composition n&apos;a pas encore été communiquée par le coach.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {lineup.starters.length > 0 && (
            <div>
              <p style={{
                fontFamily: "var(--font-mono), monospace", fontSize: 8, fontWeight: 700,
                letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)",
                textTransform: "uppercase", marginBottom: 8,
              }}>
                Titulaires
              </p>
              <div style={{
                backgroundColor: "var(--bg-card)", border: "1px solid rgba(122,154,130,0.08)",
                borderRadius: 12, padding: 8, display: "flex", flexDirection: "column", gap: 2,
              }}>
                {lineup.starters.map(p => <PlayerRow key={p.id} player={p} isMe={p.id === linked.player.id} />)}
              </div>
            </div>
          )}
          {lineup.substitutes.length > 0 && (
            <div>
              <p style={{
                fontFamily: "var(--font-mono), monospace", fontSize: 8, fontWeight: 700,
                letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)",
                textTransform: "uppercase", marginBottom: 8,
              }}>
                Remplaçants
              </p>
              <div style={{
                backgroundColor: "var(--bg-card)", border: "1px solid rgba(122,154,130,0.08)",
                borderRadius: 12, padding: 8, display: "flex", flexDirection: "column", gap: 2,
              }}>
                {lineup.substitutes.map(p => <PlayerRow key={p.id} player={p} isMe={p.id === linked.player.id} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
