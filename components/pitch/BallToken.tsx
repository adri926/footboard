"use client"

import { motion, useMotionValue } from "framer-motion"
import type { RefObject } from "react"

interface Props {
  x: number
  y: number
  draggable: boolean
  transitioning?: boolean
  possession?: "red" | "blue" | null
  containerRef: RefObject<HTMLDivElement | null>
  onPositionUpdate: (x: number, y: number) => void
}

const SIZE = 28

function BallSvg({ possession }: { possession?: "red" | "blue" | null }) {
  const glowColor = possession === "red"
    ? "rgba(220,40,40,0.9)"
    : possession === "blue"
      ? "rgba(0,60,220,0.9)"
      : "rgba(255,255,255,0.4)"
  const ringColor = possession === "red"
    ? "rgba(232,16,16,0.85)"
    : possession === "blue"
      ? "rgba(0,68,232,0.85)"
      : null

  return (
    <svg viewBox="0 0 28 28" width={SIZE} height={SIZE}>
      <defs>
        <radialGradient id="ball-grad" cx="40%" cy="35%">
          <stop offset="0%"   stopColor="#ffffff"/>
          <stop offset="100%" stopColor="#d0d0d0"/>
        </radialGradient>
        <filter id="ball-shadow">
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="rgba(0,0,0,0.5)"/>
          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={glowColor}/>
        </filter>
      </defs>
      {/* Possession ring */}
      {ringColor && (
        <circle cx="14" cy="14" r="13.5" fill="none"
          stroke={ringColor} strokeWidth="2.5"/>
      )}
      {/* Ball */}
      <circle cx="14" cy="14" r="11.5" fill="url(#ball-grad)" filter="url(#ball-shadow)"/>
      <path d="M14 4 L17 10 L23 10 L19 15 L21 21 L14 18 L7 21 L9 15 L5 10 L11 10 Z"
        fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="0.8"/>
      <circle cx="14" cy="14" r="2.5" fill="rgba(0,0,0,0.1)"/>
    </svg>
  )
}

export default function BallToken({ x, y, draggable, transitioning = false, possession, containerRef, onPositionUpdate }: Props) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const duration = transitioning ? "0.45" : "0.35"
  const ease = "cubic-bezier(0.4,0,0.2,1)"

  // Non-draggable: plain div — CSS transition guaranteed (no Framer Motion conflict)
  if (!draggable) {
    return (
      <div style={{
        position: "absolute",
        left: `${x}%`, top: `${y}%`,
        marginLeft: -SIZE / 2, marginTop: -SIZE / 2,
        width: SIZE, height: SIZE,
        zIndex: 30,
        pointerEvents: "none",
        transition: `left ${duration}s ${ease}, top ${duration}s ${ease}`,
      }}>
        <BallSvg possession={possession} />
      </div>
    )
  }

  // Draggable: Framer Motion for gesture handling
  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={(_, info) => {
        const container = containerRef.current
        if (!container) return
        const rect = container.getBoundingClientRect()
        const newX = Math.max(2, Math.min(98, ((info.point.x - rect.left) / rect.width) * 100))
        const newY = Math.max(2, Math.min(98, ((info.point.y - rect.top) / rect.height) * 100))
        mx.set(0); my.set(0)
        onPositionUpdate(newX, newY)
      }}
      style={{
        x: mx, y: my,
        position: "absolute",
        left: `${x}%`, top: `${y}%`,
        marginLeft: -SIZE / 2, marginTop: -SIZE / 2,
        width: SIZE, height: SIZE,
        zIndex: 30,
        cursor: "grab",
      }}
      whileHover={{ scale: 1.15 }}
      whileDrag={{ scale: 1.2, cursor: "grabbing" }}
    >
      <BallSvg possession={possession} />
    </motion.div>
  )
}
