// Courbe d'évolution des résultats sur la saison — SVG natif, pas de
// dépendance externe (cohérent avec TrainingLoadChart/ConceptSchema).

import type { SeasonResult } from "@/types/stats"

const W = 100
const H = 50
const PAD = 6

const RESULT_VALUE: Record<SeasonResult["result"], number> = { W: 1, D: 0, L: -1 }
const RESULT_COLOR: Record<SeasonResult["result"], string> = {
  W: "#7A9A82",
  D: "rgba(255,255,255,0.35)",
  L: "#e07070",
}

interface Props {
  results: SeasonResult[]
}

export default function ResultsChart({ results }: Props) {
  if (results.length === 0) return null

  const innerW = W - PAD * 2
  const innerH = H - PAD * 2
  const step = innerW / Math.max(results.length - 1, 1)
  const midY = PAD + innerH / 2

  const points = results.map((r, i) => ({
    x: PAD + i * step,
    y: midY - RESULT_VALUE[r.result] * (innerH / 2) * 0.85,
    result: r,
  }))

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        <line x1={PAD} y1={midY} x2={W - PAD} y2={midY} stroke="rgba(122,154,130,0.15)" strokeWidth="0.4" strokeDasharray="1.5,1.5" />
        <path d={path} fill="none" stroke="rgba(122,154,130,0.4)" strokeWidth="0.6" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="1.4" fill={RESULT_COLOR[p.result.result]} />
        ))}
      </svg>
      <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
        <Legend color={RESULT_COLOR.W} label="Victoire" />
        <Legend color={RESULT_COLOR.D} label="Nul" />
        <Legend color={RESULT_COLOR.L} label="Défaite" />
      </div>
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: color }} />
      <span style={{
        fontFamily: "var(--font-mono), monospace", fontSize: 9,
        letterSpacing: "0.04em", color: "rgba(255,255,255,0.3)",
      }}>
        {label}
      </span>
    </div>
  )
}
