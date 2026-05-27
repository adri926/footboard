"use client"

import { useEffect, useRef, useState } from "react"
import Pitch from "./Pitch"
import type { PlayerPos } from "@/lib/scenarios"

interface Props {
  home: PlayerPos[]
  away: PlayerPos[]
  ball: { x: number; y: number }
}

const TOKEN_SIZE = 28

const COLORS = {
  home: {
    bg:     "#8a1f1f",
    border: "rgba(210,90,90,0.75)",
    glow:   "rgba(180,40,40,0.55)",
    text:   "rgba(255,255,255,0.92)",
  },
  away: {
    bg:     "#2e3e31",
    border: "rgba(122,154,130,0.65)",
    glow:   "rgba(80,120,90,0.45)",
    text:   "rgba(180,220,190,0.95)",
  },
}

interface TokenProps {
  pos:  PlayerPos
  team: "home" | "away"
}

function Token({ pos, team }: TokenProps) {
  const c = COLORS[team]
  return (
    <div style={{
      position: "absolute",
      left:       `${pos.x}%`,
      top:        `${pos.y}%`,
      marginLeft: -TOKEN_SIZE / 2,
      marginTop:  -TOKEN_SIZE / 2,
      width:      TOKEN_SIZE,
      height:     TOKEN_SIZE,
      borderRadius: "50%",
      backgroundColor: c.bg,
      border:     `1.5px solid ${c.border}`,
      boxShadow:  `0 0 10px 2px ${c.glow}`,
      display:    "flex",
      alignItems: "center",
      justifyContent: "center",
      color:      c.text,
      fontSize:   8,
      fontWeight: 700,
      fontFamily: "var(--font-mono), monospace",
      letterSpacing: "0.04em",
      zIndex:     10,
      /* transition fluide quand les positions changent */
      transition: "left 0.55s cubic-bezier(0.4,0,0.2,1), top 0.55s cubic-bezier(0.4,0,0.2,1)",
      pointerEvents: "none",
      userSelect: "none",
    }}>
      {pos.role}
    </div>
  )
}

interface BallProps {
  x: number
  y: number
}

function Ball({ x, y }: BallProps) {
  return (
    <>
      {/* halo */}
      <div style={{
        position:   "absolute",
        left:       `${x}%`,
        top:        `${y}%`,
        width:      22,
        height:     22,
        marginLeft: -11,
        marginTop:  -11,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%)",
        zIndex:     14,
        transition: "left 0.55s cubic-bezier(0.4,0,0.2,1), top 0.55s cubic-bezier(0.4,0,0.2,1)",
        pointerEvents: "none",
      }} />
      {/* ballon */}
      <div style={{
        position:   "absolute",
        left:       `${x}%`,
        top:        `${y}%`,
        width:      12,
        height:     12,
        marginLeft: -6,
        marginTop:  -6,
        borderRadius: "50%",
        background: "radial-gradient(circle at 35% 30%, #ffffff, #cccccc)",
        border:     "1.5px solid rgba(0,0,0,0.25)",
        boxShadow:  "0 2px 6px rgba(0,0,0,0.5), 0 0 8px rgba(255,255,255,0.3)",
        zIndex:     15,
        transition: "left 0.55s cubic-bezier(0.4,0,0.2,1), top 0.55s cubic-bezier(0.4,0,0.2,1)",
        pointerEvents: "none",
      }} />
    </>
  )
}

export default function SituationPitch({ home, away, ball }: Props) {
  /* On monte les positions dans le state pour déclencher
   * la transition CSS à chaque changement de props */
  const [displayHome, setDisplayHome] = useState(home)
  const [displayAway, setDisplayAway] = useState(away)
  const [displayBall, setDisplayBall] = useState(ball)

  /* Petit délai pour laisser React rendre l'ancienne position
   * avant d'appliquer la nouvelle — garantit la transition */
  const timer = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setDisplayHome(home)
      setDisplayAway(away)
      setDisplayBall(ball)
    }, 30)
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [home, away, ball])

  return (
    <div className="relative w-full overflow-hidden rounded-2xl select-none"
      style={{
        aspectRatio: "600 / 900",
        boxShadow: "0 0 60px rgba(122,154,130,0.08), 0 0 0 1px rgba(122,154,130,0.15)",
      }}>

      {/* Terrain SVG */}
      <div className="absolute inset-0">
        <Pitch />
      </div>

      {/* Vignette douce */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 85% 70% at 50% 50%, transparent 60%, rgba(24,24,18,0.25) 100%)",
        zIndex: 5,
      }} />

      {/* Légende */}
      <div className="absolute top-3 left-3 right-3 flex justify-between items-center" style={{ zIndex: 20 }}>
        <span style={{
          fontFamily: "var(--font-mono), monospace", fontSize: 8, fontWeight: 700,
          letterSpacing: "0.1em", color: "rgba(210,90,90,0.9)",
          backgroundColor: "rgba(24,24,18,0.7)", padding: "2px 7px", borderRadius: 4,
        }}>
          TON ÉQUIPE
        </span>
        <span style={{
          fontFamily: "var(--font-mono), monospace", fontSize: 8, fontWeight: 700,
          letterSpacing: "0.1em", color: "rgba(122,154,130,0.9)",
          backgroundColor: "rgba(24,24,18,0.7)", padding: "2px 7px", borderRadius: 4,
        }}>
          ADVERSAIRE
        </span>
      </div>

      {/* Tokens HOME */}
      {displayHome.map(p => <Token key={`h${p.id}`} pos={p} team="home" />)}

      {/* Tokens AWAY */}
      {displayAway.map(p => <Token key={`a${p.id}`} pos={p} team="away" />)}

      {/* Ballon — toujours visible */}
      <Ball x={displayBall.x} y={displayBall.y} />
    </div>
  )
}
