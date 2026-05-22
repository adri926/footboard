import type { Arrow } from "@/lib/animations"

interface Props {
  arrows: Arrow[]
  ball?: { x: number; y: number }
}

const sx = (x: number) => x * 6
const sy = (y: number) => y * 9

function curvedPath(x1: number, y1: number, x2: number, y2: number): string {
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const dx = -(y2 - y1) * 0.18
  const dy =  (x2 - x1) * 0.18
  return `M ${sx(x1)} ${sy(y1)} Q ${sx(mx + dx)} ${sy(my + dy)} ${sx(x2)} ${sy(y2)}`
}

const STYLES: Record<Arrow["type"], { stroke: string; dash?: string; marker: string; width: number }> = {
  run:      { stroke: "rgba(255,255,255,0.85)", marker: "url(#a-run)",   width: 2.5 },
  pass:     { stroke: "rgba(255,215,0,0.95)",   dash: "8 4", marker: "url(#a-pass)",  width: 3   },
  press:    { stroke: "rgba(255,90,30,0.95)",   dash: "5 3", marker: "url(#a-press)", width: 2.5 },
  triangle: { stroke: "rgba(80,220,120,0.45)",  dash: "4 4", marker: "",              width: 1.5 },
}

export default function ArrowLayer({ arrows, ball }: Props) {
  return (
    <svg
      viewBox="0 0 600 900"
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
      style={{ zIndex: 15 }}
    >
      <defs>
        {(["run", "pass", "press"] as const).map(type => (
          <marker key={type} id={`a-${type}`} viewBox="0 0 10 10"
            refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={STYLES[type].stroke} />
          </marker>
        ))}
      </defs>

      {arrows.map((a, i) => {
        const s = STYLES[a.type]
        return (
          <path
            key={i}
            d={curvedPath(a.x1, a.y1, a.x2, a.y2)}
            stroke={s.stroke}
            strokeWidth={s.width}
            strokeDasharray={s.dash}
            fill="none"
            markerEnd={s.marker || undefined}
            strokeLinecap="round"
          />
        )
      })}

      {ball && (
        <>
          <circle cx={sx(ball.x)} cy={sy(ball.y)} r={10}
            fill="white" style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.8))" }} />
          <circle cx={sx(ball.x)} cy={sy(ball.y)} r={7}
            fill="none" stroke="#666" strokeWidth={1.5} />
        </>
      )}
    </svg>
  )
}
