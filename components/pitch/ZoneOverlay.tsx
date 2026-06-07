"use client"

// Affiche la grille 9 zones sur le terrain (3 profondeurs × 3 couloirs)
// Coordonnées en % [0-100] mappées sur viewBox 600×900

const W = 600
const H = 900

// Seuils en pourcentage (identiques à rules.ts)
const X_LEFT   = 35   // left  = x < 35
const X_RIGHT  = 65   // right = x > 65
const Y_DEEP   = 33   // deep  = y < 33
const Y_HIGH   = 66   // high  = y > 66

type Zone = { id: string; label: string; x: number; y: number; w: number; h: number; color: string }

const ZONES: Zone[] = [
  // Profond
  { id: "top-left",    label: "Couloir G\nProfond", x: 0,        y: 0,        w: X_LEFT,          h: Y_DEEP,           color: "rgba(96,165,250,0.08)"  },
  { id: "top-center",  label: "Axe\nProfond",       x: X_LEFT,    y: 0,        w: X_RIGHT-X_LEFT,  h: Y_DEEP,           color: "rgba(96,165,250,0.12)"  },
  { id: "top-right",   label: "Couloir D\nProfond", x: X_RIGHT,   y: 0,        w: 100-X_RIGHT,     h: Y_DEEP,           color: "rgba(96,165,250,0.08)"  },
  // Médian
  { id: "mid-left",    label: "Couloir G\nMédian",  x: 0,         y: Y_DEEP,   w: X_LEFT,          h: Y_HIGH-Y_DEEP,    color: "rgba(251,191,36,0.06)"  },
  { id: "mid-center",  label: "Axe\nMédian",        x: X_LEFT,    y: Y_DEEP,   w: X_RIGHT-X_LEFT,  h: Y_HIGH-Y_DEEP,    color: "rgba(251,191,36,0.10)"  },
  { id: "mid-right",   label: "Couloir D\nMédian",  x: X_RIGHT,   y: Y_DEEP,   w: 100-X_RIGHT,     h: Y_HIGH-Y_DEEP,    color: "rgba(251,191,36,0.06)"  },
  // Haut (zone adverse)
  { id: "bot-left",    label: "Couloir G\nHaut",    x: 0,         y: Y_HIGH,   w: X_LEFT,          h: 100-Y_HIGH,       color: "rgba(74,222,128,0.08)"  },
  { id: "bot-center",  label: "Axe\nHaut",          x: X_LEFT,    y: Y_HIGH,   w: X_RIGHT-X_LEFT,  h: 100-Y_HIGH,       color: "rgba(74,222,128,0.12)"  },
  { id: "bot-right",   label: "Couloir D\nHaut",    x: X_RIGHT,   y: Y_HIGH,   w: 100-X_RIGHT,     h: 100-Y_HIGH,       color: "rgba(74,222,128,0.08)"  },
]

interface Props { visible: boolean; activeZone?: string | null }

export default function ZoneOverlay({ visible, activeZone }: Props) {
  if (!visible) return null

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
      style={{ zIndex: 5 }}
    >
      {/* Lignes de grille */}
      {/* Verticales */}
      <line x1={X_LEFT/100*W}  y1="0" x2={X_LEFT/100*W}  y2={H} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="6 4" />
      <line x1={X_RIGHT/100*W} y1="0" x2={X_RIGHT/100*W} y2={H} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="6 4" />
      {/* Horizontales */}
      <line x1="0" y1={Y_DEEP/100*H}  x2={W} y2={Y_DEEP/100*H}  stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="6 4" />
      <line x1="0" y1={Y_HIGH/100*H}  x2={W} y2={Y_HIGH/100*H}  stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="6 4" />

      {/* Cellules colorées — la zone active (où se trouve le ballon) ressort du lot */}
      {ZONES.map((z, i) => {
        const active = activeZone === z.id
        return (
          <rect
            key={i}
            x={z.x / 100 * W}
            y={z.y / 100 * H}
            width={z.w / 100 * W}
            height={z.h / 100 * H}
            fill={active ? "rgba(122,154,130,0.22)" : z.color}
            stroke={active ? "rgba(122,154,130,0.7)" : "none"}
            strokeWidth={active ? 2 : 0}
          />
        )
      })}

      {/* Labels */}
      {ZONES.map((z, i) => {
        const cx = (z.x + z.w / 2) / 100 * W
        const cy = (z.y + z.h / 2) / 100 * H
        const lines = z.label.split("\n")
        return (
          <g key={`lbl-${i}`}>
            {lines.map((line, li) => (
              <text
                key={li}
                x={cx}
                y={cy + (li - (lines.length - 1) / 2) * 18}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="13"
                fontWeight="600"
                fill="rgba(255,255,255,0.55)"
                fontFamily="system-ui, sans-serif"
              >
                {line}
              </text>
            ))}
          </g>
        )
      })}

      {/* Légende couleurs sur le côté */}
      {[
        { y: Y_DEEP/2,                label: "PROFOND", color: "rgba(96,165,250,0.8)" },
        { y: (Y_DEEP + Y_HIGH) / 2,   label: "MÉDIAN",  color: "rgba(251,191,36,0.8)" },
        { y: (Y_HIGH + 100) / 2,      label: "HAUT",    color: "rgba(74,222,128,0.8)" },
      ].map((row, i) => (
        <text key={`row-${i}`}
          x={W - 6} y={row.y / 100 * H}
          textAnchor="end" dominantBaseline="middle"
          fontSize="10" fontWeight="700" letterSpacing="0.1em"
          fill={row.color} fontFamily="system-ui, sans-serif"
          style={{ textTransform: "uppercase" }}>
          {row.label}
        </text>
      ))}
      {[
        { x: X_LEFT/2,              label: "G",  color: "rgba(255,255,255,0.35)" },
        { x: (X_LEFT+X_RIGHT)/2,    label: "C",  color: "rgba(255,255,255,0.35)" },
        { x: (X_RIGHT+100)/2,       label: "D",  color: "rgba(255,255,255,0.35)" },
      ].map((col, i) => (
        <text key={`col-${i}`}
          x={col.x / 100 * W} y={10}
          textAnchor="middle" dominantBaseline="middle"
          fontSize="10" fontWeight="700" letterSpacing="0.1em"
          fill={col.color} fontFamily="system-ui, sans-serif">
          {col.label}
        </text>
      ))}
    </svg>
  )
}
