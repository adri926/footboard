import type { FeeStatus } from "@/app/dashboard/club/cotisations/actions"

const CONFIG = {
  paid:    { label: "Payée",     color: "#7A9A82", bg: "rgba(122,154,130,0.1)",  border: "rgba(122,154,130,0.25)" },
  partial: { label: "Partielle", color: "#d4a847", bg: "rgba(212,168,71,0.08)",  border: "rgba(212,168,71,0.2)"   },
  unpaid:  { label: "Impayée",   color: "#e07070", bg: "rgba(224,112,112,0.08)", border: "rgba(224,112,112,0.2)"  },
  none:    { label: "—",         color: "rgba(255,255,255,0.35)", bg: "rgba(255,255,255,0.03)", border: "rgba(122,154,130,0.08)" },
}

export default function FeeStatusBadge({ status }: { status: FeeStatus }) {
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
