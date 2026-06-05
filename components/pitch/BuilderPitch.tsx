"use client"

import { useRef, useState } from "react"
import Pitch from "./Pitch"
import type { BuilderPlayer, PitchZone } from "@/lib/builder"
import { getGhostPlayers } from "@/lib/builder"

type DrawType = "pass" | "run" | "shot"

interface Arrow {
  id:   string
  from: { x: number; y: number }
  to:   { x: number; y: number }
  type: DrawType
}

interface Props {
  zone:       PitchZone
  players:    BuilderPlayer[]
  ball:       { x: number; y: number }
  onMove:     (id: string, x: number, y: number) => void
  onMoveBall: (x: number, y: number) => void
}

const TOKEN = 30
const GHOST = 22
const BALL  = 14

const COLORS = {
  home: { bg: "#8a1f1f", border: "rgba(210,90,90,0.75)", text: "rgba(255,255,255,0.92)" },
  away: { bg: "#2e3e31", border: "rgba(122,154,130,0.65)", text: "rgba(180,220,190,0.95)" },
}

const DRAW_CFG: Record<DrawType, { label: string; color: string; dash: string; w: number }> = {
  pass: { label: "Passe",       color: "#ffffff", dash: "6 3",  w: 0.55 },
  run:  { label: "Déplacement", color: "#f5d84e", dash: "none", w: 0.55 },
  shot: { label: "Tir",         color: "#e07070", dash: "none", w: 0.8  },
}

export default function BuilderPitch({ zone, players, ball, onMove, onMoveBall }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  const [mode,        setMode]        = useState<"move" | "draw">("move")
  const [drawType,    setDrawType]    = useState<DrawType>("pass")
  const [arrows,      setArrows]      = useState<Arrow[]>([])
  const [pendingFrom, setPendingFrom] = useState<{ x: number; y: number; id: string } | null>(null)

  const homeCount = players.filter(p => p.team === "home").length
  const awayCount = players.filter(p => p.team === "away").length
  const ghosts    = getGhostPlayers(zone, homeCount, awayCount)

  function getPos(clientX: number, clientY: number) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return null
    return {
      x: Math.min(98, Math.max(2, ((clientX - rect.left) / rect.width)  * 100)),
      y: Math.min(98, Math.max(2, ((clientY - rect.top)  / rect.height) * 100)),
    }
  }

  function dragHandlers(onDrop: (x: number, y: number) => void) {
    if (mode !== "move") return {}
    return {
      draggable: true as const,
      onDragEnd: (e: React.DragEvent) => {
        const p = getPos(e.clientX, e.clientY)
        if (p) onDrop(p.x, p.y)
      },
      onTouchEnd: (e: React.TouchEvent) => {
        const t = e.changedTouches[0]
        const p = getPos(t.clientX, t.clientY)
        if (p) onDrop(p.x, p.y)
      },
    }
  }

  function handlePlayerClick(id: string, x: number, y: number, e: React.MouseEvent) {
    if (mode !== "draw") return
    e.stopPropagation()
    setPendingFrom({ x, y, id })
  }

  function handleBallClick(e: React.MouseEvent) {
    if (mode !== "draw") return
    e.stopPropagation()
    setPendingFrom({ x: ball.x, y: ball.y, id: "ball" })
  }

  function handlePitchClick(e: React.MouseEvent) {
    if (mode !== "draw" || !pendingFrom) return
    const p = getPos(e.clientX, e.clientY)
    if (!p) return
    setArrows(prev => [...prev, {
      id:   `${Date.now()}`,
      from: { x: pendingFrom.x, y: pendingFrom.y },
      to:   p,
      type: drawType,
    }])
    setPendingFrom(null)
  }

  function switchMode(m: "move" | "draw") {
    setMode(m)
    setPendingFrom(null)
  }

  /* ── Arrow SVG path ─────────────────────────────────────── */
  function arrowPath(a: Arrow) {
    const dx = a.to.x - a.from.x
    const dy = a.to.y - a.from.y
    const len = Math.sqrt(dx * dx + dy * dy) || 1
    // Shorten endpoint so arrowhead doesn't vanish inside token
    const ex = a.to.x - (dx / len) * 3
    const ey = a.to.y - (dy / len) * 3

    if (a.type === "run") {
      // Slight arc
      const cx = (a.from.x + ex) / 2 + (-dy / len) * len * 0.2
      const cy = (a.from.y + ey) / 2 + ( dx / len) * len * 0.2
      return `M ${a.from.x} ${a.from.y} Q ${cx} ${cy} ${ex} ${ey}`
    }
    return `M ${a.from.x} ${a.from.y} L ${ex} ${ey}`
  }

  const isDrawing = mode === "draw"

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

      {/* ── Toolbar ─────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        {(["move", "draw"] as const).map(m => (
          <button key={m} onClick={() => switchMode(m)} style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 8, fontWeight: 700, letterSpacing: "0.1em",
            padding: "4px 12px", borderRadius: 6, cursor: "pointer",
            backgroundColor: mode === m ? "rgba(122,154,130,0.15)" : "transparent",
            border: `1px solid ${mode === m ? "rgba(122,154,130,0.4)" : "rgba(122,154,130,0.15)"}`,
            color: mode === m ? "#7A9A82" : "rgba(255,255,255,0.3)",
          }}>
            {m === "move" ? "DÉPLACER" : "ACTIONS"}
          </button>
        ))}

        {isDrawing && (
          <>
            <div style={{ width: 1, height: 14, backgroundColor: "rgba(122,154,130,0.12)" }} />
            {(Object.entries(DRAW_CFG) as [DrawType, typeof DRAW_CFG[DrawType]][]).map(([type, cfg]) => (
              <button key={type} onClick={() => setDrawType(type)} style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 8, fontWeight: 700, letterSpacing: "0.08em",
                padding: "4px 12px", borderRadius: 6, cursor: "pointer",
                backgroundColor: drawType === type ? `${cfg.color}18` : "transparent",
                border: `1px solid ${drawType === type ? `${cfg.color}55` : "rgba(122,154,130,0.1)"}`,
                color: drawType === type ? cfg.color : "rgba(255,255,255,0.25)",
              }}>
                {cfg.label.toUpperCase()}
              </button>
            ))}

            {arrows.length > 0 && (
              <>
                <div style={{ flex: 1 }} />
                <button onClick={() => setArrows([])} style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 8, letterSpacing: "0.08em",
                  padding: "4px 12px", borderRadius: 6, cursor: "pointer",
                  backgroundColor: "transparent",
                  border: "1px solid rgba(224,112,112,0.2)",
                  color: "rgba(224,112,112,0.5)",
                }}>
                  EFFACER
                </button>
              </>
            )}

            <span style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 8, letterSpacing: "0.06em",
              color: pendingFrom ? "rgba(245,216,78,0.7)" : "rgba(255,255,255,0.2)",
              marginLeft: 6,
            }}>
              {pendingFrom ? "→ Clique sur la destination" : "Clique sur un joueur ou le ballon"}
            </span>
          </>
        )}
      </div>

      {/* ── Terrain ─────────────────────────────────────────── */}
      <div
        ref={ref}
        onClick={handlePitchClick}
        className="relative w-full select-none"
        style={{
          aspectRatio: "600/900",
          boxShadow: "0 0 60px rgba(122,154,130,0.08), 0 0 0 1px rgba(122,154,130,0.15)",
          borderRadius: 16, overflow: "hidden",
          cursor: isDrawing ? (pendingFrom ? "crosshair" : "default") : "default",
        }}
      >
        {/* Fond terrain */}
        <div className="absolute inset-0"><Pitch /></div>

        {/* Zone highlight */}
        <div style={{
          position: "absolute",
          left: `${zone.x1}%`, top:  `${zone.y1}%`,
          width: `${zone.x2 - zone.x1}%`, height: `${zone.y2 - zone.y1}%`,
          backgroundColor: "rgba(122,154,130,0.08)",
          border: "1.5px dashed rgba(122,154,130,0.35)",
          pointerEvents: "none",
        }} />

        {/* ── Joueurs fantômes (formation) ─────────────────── */}
        {(["home", "away"] as const).map(team =>
          ghosts[team].map((pos, i) => {
            const c = COLORS[team]
            return (
              <div key={`ghost-${team}-${i}`} style={{
                position: "absolute",
                left: `${pos.x}%`, top: `${pos.y}%`,
                marginLeft: -GHOST / 2, marginTop: -GHOST / 2,
                width: GHOST, height: GHOST, borderRadius: "50%",
                backgroundColor: c.bg,
                border: `1.5px solid ${c.border}`,
                opacity: 0.22,
                pointerEvents: "none", zIndex: 4,
              }} />
            )
          })
        )}

        {/* ── SVG flèches ──────────────────────────────────── */}
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 12 }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            {(Object.keys(DRAW_CFG) as DrawType[]).map(type => {
              const cfg = DRAW_CFG[type]
              return (
                <marker key={type} id={`ah-${type}`}
                  markerWidth="5" markerHeight="5" refX="4.5" refY="2.5"
                  orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,5 L5,2.5 z" fill={cfg.color} opacity="0.9" />
                </marker>
              )
            })}
          </defs>
          {arrows.map(a => {
            const cfg = DRAW_CFG[a.type]
            return (
              <path
                key={a.id}
                d={arrowPath(a)}
                stroke={cfg.color}
                strokeWidth={cfg.w}
                strokeDasharray={cfg.dash}
                strokeLinecap="round"
                fill="none"
                opacity="0.88"
                markerEnd={`url(#ah-${a.type})`}
              />
            )
          })}
        </svg>

        {/* Légende */}
        <div style={{
          position: "absolute", top: 8, left: 8, right: 8,
          display: "flex", justifyContent: "space-between",
          pointerEvents: "none", zIndex: 20,
        }}>
          {(["home", "away"] as const).map(team => (
            <span key={team} style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 8, fontWeight: 700, letterSpacing: "0.1em",
              color: team === "home" ? "rgba(210,90,90,0.9)" : "rgba(122,154,130,0.9)",
              backgroundColor: "rgba(24,24,18,0.75)",
              padding: "2px 7px", borderRadius: 4,
            }}>
              {team === "home" ? "TON ÉQUIPE" : "ADVERSAIRE"}
            </span>
          ))}
        </div>

        {/* ── Joueurs actifs (zone) ─────────────────────────── */}
        {players.map(p => {
          const c = COLORS[p.team]
          const selected = pendingFrom?.id === p.id
          return (
            <div
              key={p.id}
              onClick={e => handlePlayerClick(p.id, p.x, p.y, e)}
              {...dragHandlers((x, y) => onMove(p.id, x, y))}
              style={{
                position: "absolute",
                left: `${p.x}%`, top: `${p.y}%`,
                marginLeft: -TOKEN / 2, marginTop: -TOKEN / 2,
                width: TOKEN, height: TOKEN, borderRadius: "50%",
                backgroundColor: c.bg,
                border: `2px solid ${selected ? "#f5d84e" : c.border}`,
                boxShadow: selected
                  ? "0 0 14px 4px rgba(245,216,78,0.45)"
                  : "0 0 10px 2px rgba(0,0,0,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: c.text, fontSize: 9, fontWeight: 700,
                fontFamily: "var(--font-mono), monospace",
                cursor: isDrawing ? "pointer" : "grab",
                zIndex: 10,
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}
            >
              {p.id.replace(/[ha]/, "")}
            </div>
          )
        })}

        {/* ── Ballon ────────────────────────────────────────── */}
        <div
          onClick={handleBallClick}
          {...dragHandlers((x, y) => onMoveBall(x, y))}
          style={{
            position: "absolute",
            left: `${ball.x}%`, top: `${ball.y}%`,
            marginLeft: -BALL / 2, marginTop: -BALL / 2,
            width: BALL, height: BALL, borderRadius: "50%",
            background: "radial-gradient(circle at 35% 30%, #ffffff, #cccccc)",
            border: `1.5px solid ${pendingFrom?.id === "ball" ? "#f5d84e" : "rgba(0,0,0,0.25)"}`,
            boxShadow: pendingFrom?.id === "ball"
              ? "0 0 12px 4px rgba(245,216,78,0.4)"
              : "0 2px 6px rgba(0,0,0,0.5), 0 0 8px rgba(255,255,255,0.3)",
            cursor: isDrawing ? "pointer" : "grab",
            zIndex: 15,
            transition: "border-color 0.15s, box-shadow 0.15s",
          }}
        />
      </div>
    </div>
  )
}
