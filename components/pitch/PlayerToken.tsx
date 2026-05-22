"use client"

import { motion, useMotionValue } from "framer-motion"
import type { RefObject } from "react"

const SIZE = 40

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

  const colors = team === "red"
    ? { bg: "#e81010", border: "#ff4444", glow: "rgba(232,16,16,0.75)", text: "#fff" }
    : { bg: "#0040e8", border: "#4488ff", glow: "rgba(0,64,232,0.75)", text: "#fff" }

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
        border: `2.5px solid ${colors.border}`,
        boxShadow: `0 0 18px ${colors.glow}, 0 0 6px ${colors.glow}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: colors.text,
        fontSize: 10, fontWeight: "800",
        cursor: "grab",
        userSelect: "none",
        zIndex: 10,
        textShadow: "0 1px 3px rgba(0,0,0,0.8)",
        ...(transitioning && {
          transition: "left 0.45s cubic-bezier(0.4,0,0.2,1), top 0.45s cubic-bezier(0.4,0,0.2,1)",
        }),
      }}
      whileHover={{ scale: 1.18 }}
      whileDrag={{ scale: 1.25, cursor: "grabbing", zIndex: 50 }}
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
