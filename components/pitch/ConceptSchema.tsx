// Aperçu statique d'une situation — mini-terrain avec positions réelles (%),
// dans le même système de coordonnées que les animations de lib/animations.ts.

const LINE   = "rgba(122,154,130,0.45)"
const LINE_D = "rgba(122,154,130,0.25)"
const RED    = "#8a1f1f"
const BLUE   = "#2e3e31"
const BALL   = "#e8e2d0"

const PAD_X = 4
const PAD_Y = 8
const W = 92
const H = 124

const px = (x: number) => PAD_X + (x / 100) * W
const py = (y: number) => PAD_Y + (y / 100) * H

export interface SchemaPlayer {
  x: number
  y: number
  team: "home" | "away"
  label?: string
}

export interface SchemaArrow {
  x1: number; y1: number
  x2: number; y2: number
  type?: "run" | "pass" | "press" | "triangle"
}

interface Props {
  players: SchemaPlayer[]
  arrows?: SchemaArrow[]
  ball?: { x: number; y: number }
}

const ARROW_COLOR: Record<string, string> = {
  run:      "rgba(122,154,130,0.8)",
  pass:     "rgba(232,226,208,0.8)",
  press:    "rgba(138,31,31,0.8)",
  triangle: "rgba(96,165,250,0.7)",
}

export default function ConceptSchema({ players, arrows = [], ball }: Props) {
  return (
    <svg viewBox="0 0 100 140" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="schema-arrowhead" markerWidth="6" markerHeight="6" refX="4" refY="2" orient="auto">
          <path d="M0,0 L4,2 L0,4 Z" fill="rgba(122,154,130,0.7)" />
        </marker>
      </defs>

      {/* fond */}
      <rect width="100" height="140" fill="rgba(0,0,0,0.25)" rx="6" />

      {/* terrain */}
      <rect x={PAD_X} y={PAD_Y} width={W} height={H} fill="none" stroke={LINE} strokeWidth="0.6" />
      <line x1={PAD_X} y1={PAD_Y + H / 2} x2={PAD_X + W} y2={PAD_Y + H / 2} stroke={LINE} strokeWidth="0.6" />
      <circle cx={PAD_X + W / 2} cy={PAD_Y + H / 2} r="11" fill="none" stroke={LINE} strokeWidth="0.6" />
      <circle cx={PAD_X + W / 2} cy={PAD_Y + H / 2} r="0.8" fill={LINE} />
      {/* surfaces */}
      <rect x={PAD_X + W * 0.24} y={PAD_Y} width={W * 0.52} height={H * 0.16} fill="none" stroke={LINE_D} strokeWidth="0.5" />
      <rect x={PAD_X + W * 0.24} y={PAD_Y + H - H * 0.16} width={W * 0.52} height={H * 0.16} fill="none" stroke={LINE_D} strokeWidth="0.5" />

      {/* flèches */}
      {arrows.map((a, i) => (
        <line key={i}
          x1={px(a.x1)} y1={py(a.y1)} x2={px(a.x2)} y2={py(a.y2)}
          stroke={ARROW_COLOR[a.type ?? "run"]}
          strokeWidth="0.7"
          strokeDasharray={a.type === "press" ? "2,1.4" : undefined}
          markerEnd="url(#schema-arrowhead)"
        />
      ))}

      {/* joueurs */}
      {players.map((p, i) => (
        <g key={i}>
          <circle cx={px(p.x)} cy={py(p.y)} r="2.6"
            fill={p.team === "home" ? RED : BLUE}
            stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
          {p.label && (
            <text x={px(p.x)} y={py(p.y) + 4.6} textAnchor="middle"
              fontSize="2.6" fontFamily="var(--font-mono), monospace"
              fill="rgba(255,255,255,0.4)">
              {p.label}
            </text>
          )}
        </g>
      ))}

      {/* ballon */}
      {ball && (
        <circle cx={px(ball.x)} cy={py(ball.y)} r="1.4" fill={BALL} stroke="rgba(0,0,0,0.4)" strokeWidth="0.3" />
      )}
    </svg>
  )
}
