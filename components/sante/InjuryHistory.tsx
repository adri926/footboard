import type { Injury } from "@/types/medical"

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
}

function durationDays(start: string, end: string | null): string {
  if (!end) return "en cours"
  const days = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86_400_000)
  return `${days} jour${days > 1 ? "s" : ""}`
}

interface Props {
  injuries: Injury[]
}

export default function InjuryHistory({ injuries }: Props) {
  if (injuries.length === 0) {
    return (
      <p style={{
        fontFamily: "var(--font-body), sans-serif", fontWeight: 400,
        fontSize: 13, color: "rgba(255,255,255,0.3)",
      }}>
        Aucun antécédent de blessure enregistré cette saison.
      </p>
    )
  }

  // Plus récent en premier
  const sorted = [...injuries].sort((a, b) => b.startDate.localeCompare(a.startDate))

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {sorted.map(injury => (
        <div key={injury.id} style={{
          padding: "12px 16px", borderRadius: 10,
          backgroundColor: "var(--bg-card)",
          border: "1px solid rgba(122,154,130,0.08)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <p style={{
              fontFamily: "var(--font-body), sans-serif", fontWeight: 500,
              fontSize: 13, color: "rgba(255,255,255,0.85)",
            }}>
              {injury.type} — {injury.bodyZone}
            </p>
            <span style={{
              fontFamily: "var(--font-mono), monospace", fontSize: 9, fontWeight: 700,
              letterSpacing: "0.05em", whiteSpace: "nowrap",
              color: injury.endDate ? "rgba(122,154,130,0.6)" : "#e07070",
            }}>
              {durationDays(injury.startDate, injury.endDate).toUpperCase()}
            </span>
          </div>
          <p style={{
            fontFamily: "var(--font-mono), monospace", fontSize: 9,
            letterSpacing: "0.04em", color: "rgba(255,255,255,0.3)", marginTop: 4,
          }}>
            {formatDate(injury.startDate)} {injury.endDate ? `→ ${formatDate(injury.endDate)}` : "→ en cours"}
          </p>
          {injury.notes && (
            <p style={{
              fontFamily: "var(--font-body), sans-serif", fontWeight: 400,
              fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 6, lineHeight: 1.5,
            }}>
              {injury.notes}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
