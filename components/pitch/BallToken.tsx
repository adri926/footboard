"use client"

import { motion, useMotionValue } from "framer-motion"
import type { RefObject } from "react"

interface Props {
  x: number
  y: number
  draggable: boolean
  containerRef: RefObject<HTMLDivElement | null>
  onPositionUpdate: (x: number, y: number) => void
}

const SIZE = 28

export default function BallToken({ x, y, draggable, containerRef, onPositionUpdate }: Props) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  return (
    <motion.div
      drag={draggable}
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
        cursor: draggable ? "grab" : "default",
        transition: "left 0.35s cubic-bezier(0.4,0,0.2,1), top 0.35s cubic-bezier(0.4,0,0.2,1)",
      }}
      whileHover={draggable ? { scale: 1.15 } : {}}
      whileDrag={{ scale: 1.2, cursor: "grabbing" }}
    >
      <svg viewBox="0 0 28 28" width={SIZE} height={SIZE}>
        <defs>
          <radialGradient id="ball-grad" cx="40%" cy="35%">
            <stop offset="0%"   stopColor="#ffffff"/>
            <stop offset="100%" stopColor="#d0d0d0"/>
          </radialGradient>
          <filter id="ball-shadow">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="rgba(0,0,0,0.5)"/>
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="rgba(255,255,255,0.4)"/>
          </filter>
        </defs>
        {/* Ballon blanc avec ombre */}
        <circle cx="14" cy="14" r="12" fill="url(#ball-grad)" filter="url(#ball-shadow)"/>
        {/* Motif pentagone simplifié */}
        <path d="M14 4 L17 10 L23 10 L19 15 L21 21 L14 18 L7 21 L9 15 L5 10 L11 10 Z"
          fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="0.8"/>
        <circle cx="14" cy="14" r="3" fill="rgba(0,0,0,0.12)"/>
      </svg>
    </motion.div>
  )
}
