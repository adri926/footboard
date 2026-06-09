import type { PlayerMedicalStatus } from "@/types/medical"

// Palette alignée sur le moodboard (sauge / ochre / rouge mat) — cohérente
// avec PlayerStatusBadge.
const STATUS_STYLE: Record<PlayerMedicalStatus, { label: string; color: string; bg: string }> = {
  disponible: { label: "Disponible", color: "#7A9A82", bg: "rgba(122,154,130,0.1)"  },
  incertain:  { label: "Incertain",  color: "#d4a847", bg: "rgba(212,168,71,0.08)"  },
  blesse:     { label: "Blessé",     color: "#e07070", bg: "rgba(224,112,112,0.08)" },
}

interface Props {
  status: PlayerMedicalStatus
}

export default function StatusBadge({ status }: Props) {
  const s = STATUS_STYLE[status]
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "3px 10px", borderRadius: 100,
      fontFamily: "var(--font-mono), monospace", fontSize: 10, fontWeight: 700,
      letterSpacing: "0.04em",
      color: s.color, backgroundColor: s.bg,
      border: `1px solid ${s.color}33`,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: s.color }} />
      {s.label}
    </span>
  )
}
