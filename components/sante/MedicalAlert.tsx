interface Props {
  matchDate: string   // ISO date du prochain match
  opponent: string
  unavailableCount: number
  daysUntil: number
}

export default function MedicalAlert({ matchDate, opponent, unavailableCount, daysUntil }: Props) {
  if (unavailableCount === 0) return null

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: "14px 18px", borderRadius: 10, marginBottom: 24,
      backgroundColor: "rgba(224,112,112,0.08)",
      border: "1px solid rgba(224,112,112,0.25)",
    }}>
      <span style={{ fontSize: 18, lineHeight: 1 }}>⚠</span>
      <div>
        <p style={{
          fontFamily: "var(--font-body), sans-serif", fontWeight: 500,
          fontSize: 13, color: "rgba(255,255,255,0.85)",
        }}>
          Match contre {opponent} dans {daysUntil} jour{daysUntil > 1 ? "s" : ""} ({new Date(matchDate).toLocaleDateString("fr-FR", { day: "2-digit", month: "long" })})
        </p>
        <p style={{
          fontFamily: "var(--font-mono), monospace", fontSize: 10,
          letterSpacing: "0.04em", color: "rgba(224,112,112,0.85)", marginTop: 2,
        }}>
          {unavailableCount} JOUEUR{unavailableCount > 1 ? "S" : ""} INDISPONIBLE{unavailableCount > 1 ? "S" : ""} OU INCERTAIN{unavailableCount > 1 ? "S" : ""} — À ANTICIPER POUR LA COMPOSITION
        </p>
      </div>
    </div>
  )
}
