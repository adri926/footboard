import { notFound } from "next/navigation"
import { getPublicBoard } from "../../actions"
import type { Drawing, Pion } from "@/types/tactical"

// ── Terrain SVG statique (même spec que Terrain.tsx) ──────────────────────
const S  = "rgba(122,154,130,0.55)"
const SD = "rgba(122,154,130,0.30)"
const SW = 1.8
const M = 30
const W = 680
const H = 1050
const VB_W = W + M * 2
const VB_H = H + M * 2
const CX = M + W / 2

function StaticTerrain() {
  const boxW = 403.2, boxD = 165
  const boxX = CX - boxW / 2
  const goalAreaW = 183.2, goalAreaD = 55
  const goalAreaX = CX - goalAreaW / 2
  const penaltyY_top = M + boxD
  const penaltyY_bot = M + H - boxD
  const centerY = M + H / 2
  const cornerR = 10
  const arcR = 91.5

  const goalPostW = 73.2
  const goalPostX = CX - goalPostW / 2

  const penaltySpotD = 110

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <rect x={M} y={M} width={W} height={H} fill="#181612" stroke={S} strokeWidth={SW * 1.5} />
      <line x1={M} y1={centerY} x2={M + W} y2={centerY} stroke={S} strokeWidth={SW} />
      <circle cx={CX} cy={centerY} r={91.5} fill="none" stroke={S} strokeWidth={SW} />
      <circle cx={CX} cy={centerY} r={5} fill={S} />

      {/* Surface de réparation haut */}
      <rect x={boxX} y={M} width={boxW} height={boxD} fill="none" stroke={S} strokeWidth={SW} />
      <rect x={goalAreaX} y={M} width={goalAreaW} height={goalAreaD} fill="none" stroke={S} strokeWidth={SW} />
      <circle cx={CX} cy={M + penaltySpotD} r={5} fill={SD} />
      <path d={`M ${boxX} ${penaltyY_top} A ${arcR} ${arcR} 0 0 0 ${boxX + boxW} ${penaltyY_top}`} fill="none" stroke={S} strokeWidth={SW} clipPath="url(#clip-top)" />

      {/* Surface de réparation bas */}
      <rect x={boxX} y={M + H - boxD} width={boxW} height={boxD} fill="none" stroke={S} strokeWidth={SW} />
      <rect x={goalAreaX} y={M + H - goalAreaD} width={goalAreaW} height={goalAreaD} fill="none" stroke={S} strokeWidth={SW} />
      <circle cx={CX} cy={M + H - penaltySpotD} r={5} fill={SD} />
      <path d={`M ${boxX} ${penaltyY_bot} A ${arcR} ${arcR} 0 0 1 ${boxX + boxW} ${penaltyY_bot}`} fill="none" stroke={S} strokeWidth={SW} clipPath="url(#clip-bot)" />

      {/* Buts */}
      <rect x={goalPostX} y={M - 25} width={goalPostW} height={25} fill="none" stroke={SD} strokeWidth={SW} />
      <rect x={goalPostX} y={M + H} width={goalPostW} height={25} fill="none" stroke={SD} strokeWidth={SW} />

      {/* Corners */}
      <path d={`M ${M} ${M + cornerR} A ${cornerR} ${cornerR} 0 0 1 ${M + cornerR} ${M}`} fill="none" stroke={SD} strokeWidth={SW} />
      <path d={`M ${M + W - cornerR} ${M} A ${cornerR} ${cornerR} 0 0 1 ${M + W} ${M + cornerR}`} fill="none" stroke={SD} strokeWidth={SW} />
      <path d={`M ${M} ${M + H - cornerR} A ${cornerR} ${cornerR} 0 0 0 ${M + cornerR} ${M + H}`} fill="none" stroke={SD} strokeWidth={SW} />
      <path d={`M ${M + W - cornerR} ${M + H} A ${cornerR} ${cornerR} 0 0 0 ${M + W} ${M + H - cornerR}`} fill="none" stroke={SD} strokeWidth={SW} />

      <defs>
        <clipPath id="clip-top"><rect x={boxX} y={M} width={boxW} height={boxD} /></clipPath>
        <clipPath id="clip-bot"><rect x={boxX} y={penaltyY_bot} width={boxW} height={boxD} /></clipPath>
      </defs>
    </svg>
  )
}

// ── Dessins statiques ──────────────────────────────────────────────────────
const vx = (pct: number) => (pct / 100) * W
const vy = (pct: number) => (pct / 100) * H

function pathFor(d: Drawing): string {
  const pts = d.points.map(p => ({ x: vx(p.x), y: vy(p.y) }))
  if (pts.length === 0) return ""
  if (d.type === "crayon") {
    return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ")
  }
  if (pts.length < 2) return ""
  const [a, b] = pts
  if (d.type === "fleche-courbe") {
    const mx = (a.x + b.x) / 2
    const my = (a.y + b.y) / 2
    const dx = -(b.y - a.y) * 0.18
    const dy = (b.x - a.x) * 0.18
    return `M ${a.x} ${a.y} Q ${mx + dx} ${my + dy} ${b.x} ${b.y}`
  }
  return `M ${a.x} ${a.y} L ${b.x} ${b.y}`
}

const ARROW_TYPES = ["fleche", "fleche-tirets", "fleche-courbe"]

function StaticDrawings({ drawings }: { drawings: Drawing[] }) {
  const colors = [...new Set(drawings.map(d => d.color))]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
      <defs>
        {colors.map(c => {
          const id = c.replace("#", "")
          return (
            <marker key={id} id={`arrow-${id}`} viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={c} />
            </marker>
          )
        })}
      </defs>
      {drawings.map((d, i) => {
        const colorId = d.color.replace("#", "")
        if (d.type === "zone") {
          const [a, b] = d.points
          if (!a || !b) return null
          const cx = (vx(a.x) + vx(b.x)) / 2
          const cy = (vy(a.y) + vy(b.y)) / 2
          const rx = Math.abs(vx(a.x) - vx(b.x)) / 2
          const ry = Math.abs(vy(a.y) - vy(b.y)) / 2
          return <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill={`${d.color}22`} stroke={d.color} strokeWidth={d.thickness} />
        }
        if (d.type === "texte") {
          const [p] = d.points
          if (!p) return null
          return (
            <text key={i} x={vx(p.x)} y={vy(p.y)} fill={d.color}
              fontSize={20 + d.thickness * 1.5}
              fontFamily="monospace" fontWeight={700}
              stroke="#181812" strokeWidth={3} style={{ paintOrder: "stroke" }}>
              {d.text}
            </text>
          )
        }
        return (
          <path key={i}
            d={pathFor(d)}
            fill="none"
            stroke={d.color}
            strokeWidth={d.thickness}
            strokeDasharray={d.type === "fleche-tirets" ? "16 9" : undefined}
            strokeLinecap="round"
            strokeLinejoin="round"
            markerEnd={ARROW_TYPES.includes(d.type) ? `url(#arrow-${colorId})` : undefined}
          />
        )
      })}
    </svg>
  )
}

// ── Pions statiques ────────────────────────────────────────────────────────
function StaticPion({ pion }: { pion: Pion }) {
  const SIZE = 38
  const isA = pion.team === "A"
  return (
    <div style={{
      position: "absolute",
      left: `${pion.x}%`, top: `${pion.y}%`,
      marginLeft: -SIZE / 2, marginTop: -SIZE / 2,
      width: SIZE, height: SIZE,
      borderRadius: "50%",
      backgroundColor: isA ? "#2e3e31" : "#5a2c1d",
      border: `2px solid ${isA ? "rgba(122,154,130,0.6)" : "rgba(224,112,80,0.65)"}`,
      boxShadow: `0 0 10px ${isA ? "rgba(122,154,130,0.45)" : "rgba(224,112,80,0.45)"}`,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <span style={{
        fontFamily: "var(--font-mono), monospace",
        fontWeight: 700, fontSize: 13,
        color: isA ? "#7A9A82" : "#e07050",
        userSelect: "none",
      }}>
        {pion.label}
      </span>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────
export default async function SharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const board = await getPublicBoard(token)
  if (!board) notFound()

  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh", padding: "40px 24px 64px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <p style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 9, letterSpacing: "0.14em",
            color: "rgba(122,154,130,0.45)", marginBottom: 8,
          }}>
            FOOTBOARD · LECTURE SEULE
          </p>
          <h1 style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontWeight: 900, fontSize: 32, letterSpacing: "0.02em",
            color: "rgba(255,255,255,0.92)", lineHeight: 1,
          }}>
            {board.name}
          </h1>
          {board.formation && (
            <p style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 10, letterSpacing: "0.08em",
              color: "rgba(122,154,130,0.6)", marginTop: 8,
            }}>
              {board.formation}
            </p>
          )}
        </div>

        {/* Terrain */}
        <div style={{
          position: "relative",
          borderRadius: 16, overflow: "hidden",
          boxShadow: "0 0 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)",
          aspectRatio: `${VB_W} / ${VB_H}`,
        }}>
          <StaticTerrain />
          <div style={{ position: "absolute", inset: `${(M / VB_H) * 100}% ${(M / VB_W) * 100}%` }}>
            <StaticDrawings drawings={board.drawings ?? []} />
            {(board.pions ?? []).map(pion => (
              <StaticPion key={pion.id} pion={pion} />
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}
