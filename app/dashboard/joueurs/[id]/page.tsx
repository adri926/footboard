import { notFound } from "next/navigation"
import Link from "next/link"
import PlayerStatusBadge from "@/components/dashboard/PlayerStatusBadge"
import { MOCK_PLAYERS } from "@/lib/mock-data"

const POSITION_LABELS: Record<string, string> = {
  GK: "Gardien", DEF: "Défenseur", MIL: "Milieu", ATT: "Attaquant",
}

export default async function JoueurPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const player = MOCK_PLAYERS.find(p => p.id === id)
  if (!player) notFound()

  const minutesPerMatch = player.matchesPlayed > 0
    ? Math.round(player.minutesPlayed / player.matchesPlayed)
    : 0

  return (
    <div style={{ padding: "32px 36px", maxWidth: 800 }}>
      <Link href="/dashboard/joueurs" style={{
        fontFamily: "var(--font-mono), monospace",
        fontSize: 8, letterSpacing: "0.08em",
        color: "rgba(122,154,130,0.4)",
        display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 20,
      }}>
        ← JOUEURS
      </Link>

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        marginBottom: 32,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* Avatar */}
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            backgroundColor: "rgba(122,154,130,0.1)",
            border: "1px solid rgba(122,154,130,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontWeight: 900, fontSize: 24, color: "#7A9A82",
            flexShrink: 0,
          }}>
            {player.number}
          </div>
          <div>
            <p style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 9, letterSpacing: "0.1em",
              color: "rgba(122,154,130,0.5)", marginBottom: 4,
            }}>
              {POSITION_LABELS[player.position]} · AS POINCARÉ
            </p>
            <h1 style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontWeight: 900, fontSize: 28, letterSpacing: "0.02em",
              color: "rgba(255,255,255,0.95)",
            }}>
              {player.firstName} {player.lastName.toUpperCase()}
            </h1>
          </div>
        </div>
        <PlayerStatusBadge status={player.status} />
      </div>

      {/* Stats grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24,
      }}>
        {[
          { label: "Matchs joués", value: player.matchesPlayed },
          { label: "Minutes", value: player.minutesPlayed },
          { label: "Buts", value: player.goals },
          { label: "Passes déc.", value: player.assists },
        ].map(stat => (
          <div key={stat.label} style={{
            padding: "16px 18px", borderRadius: 10,
            backgroundColor: "#1f1f19",
            border: "1px solid rgba(122,154,130,0.08)",
          }}>
            <p style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 8, letterSpacing: "0.1em",
              color: "rgba(122,154,130,0.45)", marginBottom: 6, textTransform: "uppercase",
            }}>
              {stat.label}
            </p>
            <p style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontWeight: 900, fontSize: 28, lineHeight: 1,
              color: "rgba(255,255,255,0.85)",
            }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Info complémentaires */}
      <div style={{
        padding: "20px 22px", borderRadius: 12,
        backgroundColor: "#1f1f19",
        border: "1px solid rgba(122,154,130,0.08)",
        display: "flex", flexDirection: "column", gap: 12,
      }}>
        <p style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
          color: "rgba(122,154,130,0.5)", textTransform: "uppercase",
        }}>
          Détails
        </p>

        {[
          { label: "Minutes par match", value: `${minutesPerMatch} min` },
          { label: "Poste", value: POSITION_LABELS[player.position] },
          { label: "Numéro", value: `#${player.number}` },
          { label: "Statut", value: <PlayerStatusBadge status={player.status} /> },
        ].map(({ label, value }) => (
          <div key={label} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            paddingBottom: 12,
            borderBottom: "1px solid rgba(122,154,130,0.06)",
          }}>
            <p style={{
              fontFamily: "var(--font-body), sans-serif",
              fontWeight: 300, fontSize: 13,
              color: "rgba(255,255,255,0.4)",
            }}>
              {label}
            </p>
            {typeof value === "string" ? (
              <p style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 12, fontWeight: 700,
                color: "rgba(255,255,255,0.7)",
              }}>
                {value}
              </p>
            ) : value}
          </div>
        ))}

        {player.injuryNote && (
          <div style={{
            padding: "12px 14px", borderRadius: 8,
            backgroundColor: "rgba(224,112,112,0.06)",
            border: "1px solid rgba(224,112,112,0.15)",
          }}>
            <p style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 8, letterSpacing: "0.1em",
              color: "rgba(224,112,112,0.5)", marginBottom: 4,
            }}>
              NOTE MÉDICALE
            </p>
            <p style={{
              fontFamily: "var(--font-body), sans-serif",
              fontWeight: 300, fontSize: 13, lineHeight: 1.5,
              color: "rgba(255,255,255,0.5)",
            }}>
              {player.injuryNote}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
