"use client"

// Mini-animation de concept — enchaîne plusieurs schémas en boucle, en lecture
// seule (aucune interaction utilisateur). Sert d'illustration fidèle au texte,
// sans passer par le terrain interactif (qui recalcule les positions et casse
// la cohérence avec le concept décrit).

import { useEffect, useState } from "react"
import type { SchemaPlayer, SchemaArrow } from "./ConceptSchema"

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

const ARROW_COLOR: Record<string, string> = {
  run:      "rgba(122,154,130,0.8)",
  pass:     "rgba(232,226,208,0.8)",
  press:    "rgba(138,31,31,0.8)",
  triangle: "rgba(96,165,250,0.7)",
}

export interface ConceptFrame {
  caption: string
  players: SchemaPlayer[]
  arrows?: SchemaArrow[]
  ball?: { x: number; y: number }
  durationMs?: number
}

interface Props {
  frames: ConceptFrame[]
}

const DEFAULT_DURATION = 2600
const MOVE_MS = 900

export default function ConceptAnimation({ frames }: Props) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (frames.length < 2) return
    const current = frames[step]
    const t = setTimeout(() => setStep(s => (s + 1) % frames.length), current.durationMs ?? DEFAULT_DURATION)
    return () => clearTimeout(t)
  }, [step, frames])

  const frame = frames[step]
  const moveStyle = { transition: `cx ${MOVE_MS}ms ease, cy ${MOVE_MS}ms ease` }

  return (
    <div>
      <svg viewBox="0 0 100 140" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="concept-anim-arrowhead" markerWidth="6" markerHeight="6" refX="4" refY="2" orient="auto">
            <path d="M0,0 L4,2 L0,4 Z" fill="rgba(122,154,130,0.7)" />
          </marker>
        </defs>

        <rect width="100" height="140" fill="rgba(0,0,0,0.25)" rx="6" />
        <rect x={PAD_X} y={PAD_Y} width={W} height={H} fill="none" stroke={LINE} strokeWidth="0.6" />
        <line x1={PAD_X} y1={PAD_Y + H / 2} x2={PAD_X + W} y2={PAD_Y + H / 2} stroke={LINE} strokeWidth="0.6" />
        <circle cx={PAD_X + W / 2} cy={PAD_Y + H / 2} r="11" fill="none" stroke={LINE} strokeWidth="0.6" />
        <circle cx={PAD_X + W / 2} cy={PAD_Y + H / 2} r="0.8" fill={LINE} />
        <rect x={PAD_X + W * 0.24} y={PAD_Y} width={W * 0.52} height={H * 0.16} fill="none" stroke={LINE_D} strokeWidth="0.5" />
        <rect x={PAD_X + W * 0.24} y={PAD_Y + H - H * 0.16} width={W * 0.52} height={H * 0.16} fill="none" stroke={LINE_D} strokeWidth="0.5" />

        {(frame.arrows ?? []).map((a, i) => (
          <line key={i}
            x1={px(a.x1)} y1={py(a.y1)} x2={px(a.x2)} y2={py(a.y2)}
            stroke={ARROW_COLOR[a.type ?? "run"]}
            strokeWidth="0.7"
            strokeDasharray={a.type === "press" ? "2,1.4" : undefined}
            markerEnd="url(#concept-anim-arrowhead)"
            style={{ transition: `all ${MOVE_MS}ms ease`, opacity: 0.9 }}
          />
        ))}

        {frame.players.map((p, i) => (
          <g key={i}>
            <circle cx={px(p.x)} cy={py(p.y)} r="2.6"
              fill={p.team === "home" ? RED : BLUE}
              stroke="rgba(255,255,255,0.2)" strokeWidth="0.4"
              style={moveStyle} />
            {p.label && (
              <text x={px(p.x)} y={py(p.y) + 4.6} textAnchor="middle"
                fontSize="2.6" fontFamily="var(--font-mono), monospace"
                fill="rgba(255,255,255,0.4)"
                style={moveStyle}>
                {p.label}
              </text>
            )}
          </g>
        ))}

        {frame.ball && (
          <circle cx={px(frame.ball.x)} cy={py(frame.ball.y)} r="1.4"
            fill={BALL} stroke="rgba(0,0,0,0.4)" strokeWidth="0.3"
            style={moveStyle} />
        )}
      </svg>

      <div className="mt-2 flex items-center justify-between gap-2">
        <p className="text-[10px] leading-snug" style={{ color: "rgba(255,255,255,0.4)" }}>
          {frame.caption}
        </p>
        {frames.length > 1 && (
          <div className="flex items-center gap-1 shrink-0">
            {frames.map((_, i) => (
              <span key={i} className="rounded-full transition-all"
                style={{
                  width: i === step ? 12 : 4, height: 4,
                  backgroundColor: i === step ? "var(--sauge)" : "rgba(255,255,255,0.15)",
                }} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
