"use client"

import { useRef } from "react"
import Pitch from "./Pitch"
import type { BuilderPlayer, PitchZone } from "@/lib/builder"

interface Props {
  zone:      PitchZone
  players:   BuilderPlayer[]
  ball:      { x: number; y: number }
  onMove:    (id: string, x: number, y: number) => void
  onMoveBall:(x: number, y: number) => void
}

const TOKEN  = 30  // taille token joueur px
const BALL   = 14  // taille ballon px

const COLORS = {
  home: { bg: "#8a1f1f", border: "rgba(210,90,90,0.75)", text: "rgba(255,255,255,0.92)" },
  away: { bg: "#2e3e31", border: "rgba(122,154,130,0.65)", text: "rgba(180,220,190,0.95)" },
}

export default function BuilderPitch({ zone, players, ball, onMove, onMoveBall }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  function getRelativePos(clientX: number, clientY: number) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return null
    return {
      x: Math.min(98, Math.max(2, ((clientX - rect.left) / rect.width)  * 100)),
      y: Math.min(98, Math.max(2, ((clientY - rect.top)  / rect.height) * 100)),
    }
  }

  function makeDraggable(
    onDrop: (x: number, y: number) => void
  ) {
    return {
      draggable: true as const,
      onDragEnd: (e: React.DragEvent) => {
        const pos = getRelativePos(e.clientX, e.clientY)
        if (pos) onDrop(pos.x, pos.y)
      },
      onTouchEnd: (e: React.TouchEvent) => {
        const t = e.changedTouches[0]
        const pos = getRelativePos(t.clientX, t.clientY)
        if (pos) onDrop(pos.x, pos.y)
      },
    }
  }

  return (
    <div ref={ref} className="relative w-full select-none" style={{
      aspectRatio: "600/900",
      boxShadow: "0 0 60px rgba(122,154,130,0.08), 0 0 0 1px rgba(122,154,130,0.15)",
      borderRadius: 16, overflow: "hidden",
    }}>
      {/* Terrain */}
      <div className="absolute inset-0">
        <Pitch />
      </div>

      {/* Zone highlight */}
      <div style={{
        position: "absolute",
        left:   `${zone.x1}%`, top:    `${zone.y1}%`,
        width:  `${zone.x2 - zone.x1}%`,
        height: `${zone.y2 - zone.y1}%`,
        backgroundColor: "rgba(122,154,130,0.1)",
        border: "1.5px dashed rgba(122,154,130,0.4)",
        pointerEvents: "none",
      }} />

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

      {/* Joueurs */}
      {players.map(p => {
        const c = COLORS[p.team]
        return (
          <div
            key={p.id}
            title={`${p.team === "home" ? "Ton équipe" : "Adversaire"} — glisser pour repositionner`}
            {...makeDraggable((x, y) => onMove(p.id, x, y))}
            style={{
              position: "absolute",
              left: `${p.x}%`, top: `${p.y}%`,
              marginLeft: -TOKEN / 2, marginTop: -TOKEN / 2,
              width: TOKEN, height: TOKEN,
              borderRadius: "50%",
              backgroundColor: c.bg,
              border: `2px solid ${c.border}`,
              boxShadow: `0 0 10px 2px rgba(0,0,0,0.4)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: c.text, fontSize: 9, fontWeight: 700,
              fontFamily: "var(--font-mono), monospace",
              cursor: "grab", zIndex: 10,
              transition: "transform 0.15s",
            }}
          >
            {p.id.replace("h", "").replace("a", "")}
          </div>
        )
      })}

      {/* Ballon — draggable */}
      <div
        title="Ballon — glisser pour repositionner"
        {...makeDraggable((x, y) => onMoveBall(x, y))}
        style={{
          position: "absolute",
          left: `${ball.x}%`, top: `${ball.y}%`,
          marginLeft: -BALL / 2, marginTop: -BALL / 2,
          width: BALL, height: BALL,
          borderRadius: "50%",
          background: "radial-gradient(circle at 35% 30%, #ffffff, #cccccc)",
          border: "1.5px solid rgba(0,0,0,0.25)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.5), 0 0 8px rgba(255,255,255,0.3)",
          cursor: "grab", zIndex: 15,
        }}
      />
    </div>
  )
}
