import type { PlayerStatus } from "@/lib/mock-data"

const CONFIG = {
  available: { label: "Disponible", color: "#7A9A82",  bg: "rgba(122,154,130,0.1)",  border: "rgba(122,154,130,0.25)" },
  injured:   { label: "Blessé",     color: "#e07070",  bg: "rgba(224,112,112,0.08)", border: "rgba(224,112,112,0.2)"  },
  uncertain: { label: "Incertain",  color: "#d4a847",  bg: "rgba(212,168,71,0.08)",  border: "rgba(212,168,71,0.2)"   },
}

export default function PlayerStatusBadge({ status }: { status: PlayerStatus }) {
  const { label, color, bg, border } = CONFIG[status]
  return (
    <span style={{
      fontFamily: "var(--font-mono), monospace",
      fontSize: 8, fontWeight: 700, letterSpacing: "0.1em",
      color, backgroundColor: bg,
      border: `1px solid ${border}`,
      padding: "2px 8px", borderRadius: 100,
      whiteSpace: "nowrap",
    }}>
      {label.toUpperCase()}
    </span>
  )
}
