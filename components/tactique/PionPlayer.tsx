"use client"

import { motion, useMotionValue } from "framer-motion"
import type { RefObject } from "react"
import type { TacticalTeam } from "@/types/tactical"

const SIZE = 38
const EASE = "cubic-bezier(0.4,0,0.2,1)"

interface Props {
  id: string
  label: string
  x: number
  y: number
  team: TacticalTeam
  selected?: boolean
  containerRef: RefObject<HTMLDivElement | null>
  onPositionUpdate: (id: string, x: number, y: number) => void
}

// Pion draggable à la souris et au doigt (Framer Motion gère les deux nativement)
// — équipe A en vert sauge, équipe B en rouge, dans la charte Footboard
export default function PionPlayer({ id, label, x, y, team, selected, containerRef, onPositionUpdate }: Props) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const colors = team === "A"
    ? {
        bg:     "#2e3e31",
        border: "rgba(122,154,130,0.6)",
        active: "rgba(180,220,190,0.95)",
        glow:   "rgba(122,154,130,0.45)",
        text:   "#7A9A82",
      }
    : {
        bg:     "#5a2c1d",
        border: "rgba(224,112,80,0.65)",
        active: "rgba(255,170,140,0.95)",
        glow:   "rgba(224,112,80,0.45)",
        text:   "#e07050",
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
        border: `2px solid ${selected ? colors.active : colors.border}`,
        boxShadow: selected
          ? `0 0 18px ${colors.glow}, 0 0 0 3px rgba(255,255,255,0.16)`
          : `0 0 10px ${colors.glow}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: colors.text,
        fontSize: 11,
        fontWeight: 700,
        fontFamily: "var(--font-mono), monospace",
        cursor: "grab",
        userSelect: "none",
        touchAction: "none",
        zIndex: 10,
        transition: `left 320ms ${EASE}, top 320ms ${EASE}`,
      }}
      whileHover={{ scale: 1.12 }}
      whileDrag={{ scale: 1.18, cursor: "grabbing", zIndex: 50 }}
      onDragEnd={(_, info) => {
        const container = containerRef.current
        if (!container) return
        const rect = container.getBoundingClientRect()
        const newX = Math.max(2, Math.min(98, ((info.point.x - rect.left) / rect.width) * 100))
        const newY = Math.max(2, Math.min(98, ((info.point.y - rect.top) / rect.height) * 100))
        mx.set(0); my.set(0)
        onPositionUpdate(id, newX, newY)
      }}
    >
      {label}
    </motion.div>
  )
}
