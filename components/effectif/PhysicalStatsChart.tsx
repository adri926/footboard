// Graphique en barres SVG natif — distance parcourue sur les dernières
// entrées physiques. Pas de dépendance externe, cohérent avec TrainingLoadChart.

import type { PhysicalEntry } from "@/types/physical"

const W = 100
const H = 56
const PAD_BOTTOM = 14
const PAD_TOP = 4
const BAR_GAP = 2.4

interface Props {
  entries: PhysicalEntry[] // triées du plus récent au plus ancien
}

export default function PhysicalStatsChart({ entries }: Props) {
  const withDistance = entries.filter(e => e.distanceM !== null).slice(0, 8).reverse()
  if (withDistance.length === 0) return null

  const max = Math.max(...withDistance.map(e => e.distanceM ?? 0), 1)
  const barWidth = (W - BAR_GAP * (withDistance.length - 1)) / withDistance.length
  const chartHeight = H - PAD_BOTTOM - PAD_TOP

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="var(--chart-warm)" rx="1" />
      <line x1="0" y1={H - PAD_BOTTOM} x2={W} y2={H - PAD_BOTTOM} stroke="rgba(122,154,130,0.2)" strokeWidth="0.4" />

      {withDistance.map((e, i) => {
        const distance = e.distanceM ?? 0
        const barHeight = (distance / max) * chartHeight
        const x = i * (barWidth + BAR_GAP)
        const y = H - PAD_BOTTOM - barHeight
        const label = new Date(e.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })
        return (
          <g key={e.id}>
            <rect x={x} y={y} width={barWidth} height={barHeight} rx="0.8"
              fill={e.context === "match" ? "rgba(122,154,130,0.6)" : "rgba(212,168,71,0.5)"} />
            <text x={x + barWidth / 2} y={H - 4} textAnchor="middle"
              fontSize="2.6" fontFamily="var(--font-mono), monospace"
              fill="rgba(255,255,255,0.25)">
              {label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
