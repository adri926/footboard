import Pitch from "./pitch/Pitch"

// Pressing scene: 4 red players converging on a blue ball carrier
// CSS container-query units (cqw/cqh) keep translation responsive

const S  = 8   // presser token size px
const SB = 10  // ball carrier token size px

const RED_GRAD  = "radial-gradient(circle at 38% 32%, #c9604a, #6e2218)"
const BLUE_GRAD = "radial-gradient(circle at 38% 32%, #5272a8, #1c2e58)"
const RED_BDR   = "rgba(210,130,110,0.65)"
const BLUE_BDR  = "rgba(110,140,200,0.65)"
const RED_GLOW  = "rgba(180,60,40,0.6)"
const BLUE_GLOW = "rgba(40,80,180,0.6)"

// Ball carrier: blue player in his own half trying to play out
const BC_X = 44, BC_Y = 62

// Red pressers: [startX%, startY%, animation delay]
const PRESSERS: [number, number, string][] = [
  [22, 42, "0s"],
  [68, 40, "0.25s"],
  [80, 64, "0.1s"],
  [44, 82, "0.4s"],
]

// Blue support players (static)
const BLUE_SUPPORT: [number, number][] = [
  [24, 74],   // left CB
  [70, 74],   // right CB
  [44, 88],   // GK
]

// Floating red players holding shape higher up the pitch
const RED_HOLDING: [number, number][] = [
  [28, 28],
  [60, 26],
]

function Token({ x, y, red, size }: { x: number; y: number; red: boolean; size: number }) {
  return (
    <div style={{
      position: "absolute",
      left: `${x}%`, top: `${y}%`,
      marginLeft: -size / 2, marginTop: -size / 2,
      width: size, height: size,
      borderRadius: "50%",
      background: red ? RED_GRAD : BLUE_GRAD,
      border: `1.5px solid ${red ? RED_BDR : BLUE_BDR}`,
      boxShadow: `0 0 8px 3px ${red ? RED_GLOW : BLUE_GLOW}`,
      zIndex: 10,
    }} />
  )
}

export default function HeroPitch() {
  return (
    <div
      className="hero-pitch relative rounded-2xl overflow-hidden select-none pointer-events-none"
      style={{
        aspectRatio: "600 / 900",
        width: "100%",
        boxShadow: "0 4px 24px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.07)",
      }}
    >
      {/* Terrain net — légèrement désaturé pour harmonie light theme */}
      <div className="absolute inset-0" style={{ filter: "saturate(0.62) brightness(1.08) contrast(0.93)" }}>
        <Pitch />
      </div>

      {/* Vignette très douce sur les bords */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 90% 75% at 50% 55%, transparent 55%, rgba(248,247,244,0.15) 80%, rgba(248,247,244,0.45) 100%)",
        zIndex: 5,
      }} />

      {/* Red holding players (static, higher up) */}
      {RED_HOLDING.map(([x, y], i) => (
        <Token key={`rh${i}`} x={x} y={y} red={true} size={S} />
      ))}

      {/* Blue support players (static) */}
      {BLUE_SUPPORT.map(([x, y], i) => (
        <Token key={`bs${i}`} x={x} y={y} red={false} size={S} />
      ))}

      {/* Ball carrier (blue, slightly larger) */}
      <Token x={BC_X} y={BC_Y} red={false} size={SB} />

      {/* Ball */}
      <div style={{
        position: "absolute",
        left: `${BC_X + 1.4}%`, top: `${BC_Y - 1.8}%`,
        marginLeft: -3, marginTop: -3,
        width: 6, height: 6,
        borderRadius: "50%",
        background: "radial-gradient(circle at 35% 30%, #ffffff, #d0d0d0)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.35)",
        zIndex: 12,
      }} />

      {/* Red pressers — animated convergence */}
      {PRESSERS.map(([sx, sy, delay], i) => {
        const dx = ((BC_X - sx) * 0.58).toFixed(1)
        const dy = ((BC_Y - sy) * 0.58).toFixed(1)
        return (
          <div
            key={`p${i}`}
            className="press-token"
            style={{
              position: "absolute",
              left: `${sx}%`, top: `${sy}%`,
              animationDelay: delay,
              ["--pdx" as string]: `${dx}cqw`,
              ["--pdy" as string]: `${dy}cqh`,
              zIndex: 10,
            }}
          >
            <div style={{
              marginLeft: -S / 2, marginTop: -S / 2,
              width: S, height: S,
              borderRadius: "50%",
              background: RED_GRAD,
              border: `1.5px solid ${RED_BDR}`,
              boxShadow: `0 0 8px 3px ${RED_GLOW}`,
            }} />
          </div>
        )
      })}
    </div>
  )
}
