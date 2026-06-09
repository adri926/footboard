// Terrain de nuit aux proportions officielles (105 x 68 m, échelle 1m = 10u)
// — même charte que le terrain existant (lignes vert sauge mat, fond noir chaud)
const S  = "rgba(122,154,130,0.55)"  // ligne principale
const SD = "rgba(122,154,130,0.30)"  // ligne secondaire
const SW = 1.8

// Dimensions réelles (m) → unités SVG (1m = 10u), terrain en hauteur (équipe A en bas)
const M = 30          // marge autour du terrain
const W = 680         // largeur  : 68m
const H = 1050        // longueur : 105m
const VB_W = W + M * 2
const VB_H = H + M * 2
const CX = M + W / 2  // centre horizontal

export default function Terrain() {
  // Surface de réparation : 40.32m de large, 16.5m de profondeur
  const boxW = 403.2, boxD = 165
  const boxX = CX - boxW / 2
  // Surface de but : 18.32m de large, 5.5m de profondeur
  const goalAreaW = 183.2, goalAreaD = 55
  const goalAreaX = CX - goalAreaW / 2
  // Point de penalty : à 11m de la ligne de but
  const penaltySpot = 110
  // Cercle central et arcs de surface : rayon 9.15m
  const r = 91.5
  // Intersection de l'arc de penalty avec le bord de la surface (Pythagore)
  const dx = Math.sqrt(r * r - (boxD - penaltySpot) * (boxD - penaltySpot))
  const arcXLeft  = CX - dx
  const arcXRight = CX + dx
  // But : 7.32m de large
  const goalW = 73.2
  const goalX = CX - goalW / 2

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* fond noir chaud */}
      <rect width={VB_W} height={VB_H} fill="#181812" />

      {/* surface */}
      <rect x={M} y={M} width={W} height={H} fill="#0d1a0e" />

      {/* bandes herbe alternées */}
      {Array.from({ length: 14 }).map((_, i) => (
        i % 2 === 0 ? null :
        <rect key={i} x={M} y={M + i * (H / 14)} width={W} height={H / 14} fill="#0f1d10" />
      ))}

      {/* délimitations */}
      <rect x={M} y={M} width={W} height={H} fill="none" stroke={S} strokeWidth={SW} />

      {/* ligne médiane */}
      <line x1={M} y1={M + H / 2} x2={M + W} y2={M + H / 2} stroke={S} strokeWidth={SW} />

      {/* cercle central */}
      <circle cx={CX} cy={M + H / 2} r={r} fill="none" stroke={S} strokeWidth={SW} />
      <circle cx={CX} cy={M + H / 2} r={4} fill={S} />

      {/* surfaces de réparation */}
      <rect x={boxX} y={M} width={boxW} height={boxD} fill="none" stroke={S} strokeWidth={SW} />
      <rect x={boxX} y={M + H - boxD} width={boxW} height={boxD} fill="none" stroke={S} strokeWidth={SW} />

      {/* surfaces de but */}
      <rect x={goalAreaX} y={M} width={goalAreaW} height={goalAreaD} fill="none" stroke={SD} strokeWidth={SW} />
      <rect x={goalAreaX} y={M + H - goalAreaD} width={goalAreaW} height={goalAreaD} fill="none" stroke={SD} strokeWidth={SW} />

      {/* points de penalty */}
      <circle cx={CX} cy={M + penaltySpot} r={4} fill={S} />
      <circle cx={CX} cy={M + H - penaltySpot} r={4} fill={S} />

      {/* arcs de penalty (portion du cercle hors de la surface) */}
      <path d={`M ${arcXLeft} ${M + boxD} A ${r} ${r} 0 0 0 ${arcXRight} ${M + boxD}`} fill="none" stroke={SD} strokeWidth={SW} />
      <path d={`M ${arcXLeft} ${M + H - boxD} A ${r} ${r} 0 0 1 ${arcXRight} ${M + H - boxD}`} fill="none" stroke={SD} strokeWidth={SW} />

      {/* buts (7.32m de large) */}
      <rect x={goalX} y={M - 12} width={goalW} height={12} fill="none" stroke={S} strokeWidth={SW} />
      <rect x={goalX} y={M + H} width={goalW} height={12} fill="none" stroke={S} strokeWidth={SW} />

      {/* arcs de coin (rayon 1m) */}
      <path d={`M ${M} ${M + 10} A 10 10 0 0 1 ${M + 10} ${M}`}             fill="none" stroke={SD} strokeWidth={SW} />
      <path d={`M ${M + W - 10} ${M} A 10 10 0 0 1 ${M + W} ${M + 10}`}     fill="none" stroke={SD} strokeWidth={SW} />
      <path d={`M ${M + W} ${M + H - 10} A 10 10 0 0 1 ${M + W - 10} ${M + H}`} fill="none" stroke={SD} strokeWidth={SW} />
      <path d={`M ${M + 10} ${M + H} A 10 10 0 0 1 ${M} ${M + H - 10}`}     fill="none" stroke={SD} strokeWidth={SW} />
    </svg>
  )
}
