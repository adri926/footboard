"use client"

import { motion, useMotionValue } from "framer-motion"
import type { RefObject } from "react"

const SIZE = 38

interface Props {
  id: string
  label: string
  x: number
  y: number
  team: "red" | "blue"
  transitioning: boolean
  containerRef: RefObject<HTMLDivElement | null>
  onPositionUpdate: (id: string, x: number, y: number) => void
}

export default function PlayerToken({ id, label, x, y, team, transitioning, containerRef, onPositionUpdate }: Props) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  // Moodboard : rouge mat + vert sauge mat — sans néon
  const colors = team === "red"
    ? {
        bg:     "#8a1f1f",
        border: "rgba(192,80,80,0.7)",
        glow:   "rgba(140,32,32,0.5)",
        text:   "rgba(255,255,255,0.92)",
      }
    : {
        bg:     "#2e3e31",
        border: "rgba(122,154,130,0.55)",
        glow:   "rgba(46,62,49,0.6)",
        text:   "rgba(122,154,130,0.95)",
      }

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      style={{
        x: mx, y: my,
        position: "absolute",
        left: `${x}%`, top: `${y}%`,
        marginLeft: -SIZE / 2, marginTop: -SIZE / 2,
        width: SIZE, height: SIZE,
        borderRadius: "50%",
        backgroundColor: colors.bg,
        border: `2px solid ${colors.border}`,
        boxShadow: `0 0 12px ${colors.glow}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: colors.text,
        fontSize: 10,
        fontWeight: 700,
        fontFamily: "var(--font-mono), monospace",
        cursor: "grab",
        userSelect: "none",
        zIndex: 10,
        ...(transitioning && {
          transition: "left 0.45s cubic-bezier(0.4,0,0.2,1), top 0.45s cubic-bezier(0.4,0,0.2,1)",
        }),
      }}
      whileHover={{ scale: 1.15 }}
      whileDrag={{ scale: 1.2, cursor: "grabbing", zIndex: 50 }}
      onDragEnd={(_, info) => {
        const container = containerRef.current
        if (!container) return
        const rect = container.getBoundingClientRect()
        const newX = Math.max(3, Math.min(97, ((info.point.x - rect.left) / rect.width) * 100))
        const newY = Math.max(3, Math.min(97, ((info.point.y - rect.top) / rect.height) * 100))
        mx.set(0); my.set(0)
        onPositionUpdate(id, newX, newY)
      }}
    >
      {label}
    </motion.div>
  )
}
