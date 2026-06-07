// Progression de la note moyenne sur les derniers matchs — courbe SVG native.

const W = 100
const H = 50
const PAD = 6
const MIN_RATING = 4
const MAX_RATING = 10

interface Props {
  progression: { matchIndex: number; rating: number }[]
}

export default function PlayerProgressionChart({ progression }: Props) {
  if (progression.length === 0) {
    return (
      <p style={{
        fontFamily: "var(--font-body), sans-serif", fontWeight: 300,
        fontSize: 13, color: "rgba(255,255,255,0.3)",
      }}>
        Pas encore de note attribuée par le coach cette saison.
      </p>
    )
  }

  const innerW = W - PAD * 2
  const innerH = H - PAD * 2
  const step = innerW / Math.max(progression.length - 1, 1)
  const norm = (rating: number) => (rating - MIN_RATING) / (MAX_RATING - MIN_RATING)

  const points = progression.map((p, i) => {
    const prev = progression[i - 1]
    return {
      x: PAD + i * step,
      y: PAD + innerH - norm(p.rating) * innerH,
      rating: p.rating,
      // Label sous le point quand la note baisse, pour éviter qu'il chevauche la ligne descendante
      labelBelow: prev !== undefined && p.rating < prev.rating,
    }
  })

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")
  const area = `${path} L ${points[points.length - 1].x} ${PAD + innerH} L ${points[0].x} ${PAD + innerH} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="progression-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(122,154,130,0.25)" />
          <stop offset="100%" stopColor="rgba(122,154,130,0)" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#progression-fill)" />
      <path d={path} fill="none" stroke="var(--sauge)" strokeWidth="0.7" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="1.3" fill="var(--sauge)" />
          <text x={p.x} y={p.labelBelow ? p.y + 5.5 : p.y - 3} textAnchor="middle"
            fontSize="2.6" fontFamily="var(--font-mono), monospace"
            fill="rgba(255,255,255,0.4)">
            {p.rating.toFixed(1)}
          </text>
        </g>
      ))}
    </svg>
  )
}
