// Graphique en barres SVG natif — charge d'entraînement sur les 8 dernières
// semaines. Pas de dépendance externe, cohérent avec ConceptSchema/ConceptAnimation.

import type { TrainingLoad } from "@/types/medical"

const W = 100
const H = 56
const PAD_BOTTOM = 14
const PAD_TOP = 4
const BAR_GAP = 2.4

interface Props {
  loads: TrainingLoad[]
}

export default function TrainingLoadChart({ loads }: Props) {
  if (loads.length === 0) return null

  const max = Math.max(...loads.map(l => l.load), 1)
  const barWidth = (W - BAR_GAP * (loads.length - 1)) / loads.length
  const chartHeight = H - PAD_BOTTOM - PAD_TOP

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="var(--chart-warm)" rx="1" />
        {/* ligne de base */}
        <line x1="0" y1={H - PAD_BOTTOM} x2={W} y2={H - PAD_BOTTOM} stroke="rgba(122,154,130,0.2)" strokeWidth="0.4" />

        {loads.map((l, i) => {
          const barHeight = (l.load / max) * chartHeight
          const x = i * (barWidth + BAR_GAP)
          const y = H - PAD_BOTTOM - barHeight
          const reduced = l.load < max * 0.6
          const label = new Date(l.week).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })
          return (
            <g key={l.week}>
              <rect x={x} y={y} width={barWidth} height={barHeight} rx="0.8"
                fill={reduced ? "rgba(212,168,71,0.5)" : "rgba(122,154,130,0.6)"} />
              <text x={x + barWidth / 2} y={H - 4} textAnchor="middle"
                fontSize="2.6" fontFamily="var(--font-mono), monospace"
                fill="rgba(255,255,255,0.25)">
                {label}
              </text>
            </g>
          )
        })}
      </svg>
      <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
        <Legend color="rgba(122,154,130,0.6)" label="Charge normale" />
        <Legend color="rgba(212,168,71,0.5)" label="Charge réduite" />
      </div>
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: color }} />
      <span style={{
        fontFamily: "var(--font-mono), monospace", fontSize: 9,
        letterSpacing: "0.04em", color: "rgba(255,255,255,0.3)",
      }}>
        {label}
      </span>
    </div>
  )
}
