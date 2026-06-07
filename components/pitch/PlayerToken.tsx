"use client"

import { motion, useMotionValue } from "framer-motion"
import type { RefObject } from "react"

const SIZE = 38
const EASE = "cubic-bezier(0.4,0,0.2,1)"

interface Props {
  id: string
  label: string
  x: number
  y: number
  team: "red" | "blue"
  // Durée (ms) du déplacement CSS — synchronisée sur la durée réelle de l'étape
  // pour un mouvement continu et fluide plutôt qu'un saut suivi d'une pause.
  transitionMs?: number
  // Ce joueur a actuellement le ballon — anneau doré pulsant
  hasBall?: boolean
  // Joueur clé / en mouvement à cette étape — halo renforcé
  highlighted?: boolean
  containerRef: RefObject<HTMLDivElement | null>
  onPositionUpdate: (id: string, x: number, y: number) => void
}

export default function PlayerToken({ id, label, x, y, team, transitionMs, hasBall, highlighted, containerRef, onPositionUpdate }: Props) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  // Moodboard : rouge mat + vert sauge mat — sans néon
  const colors = team === "red"
    ? {
        bg:          "#8a1f1f",
        border:      "rgba(192,80,80,0.7)",
        borderActive:"rgba(255,150,150,0.95)",
        glow:        "rgba(140,32,32,0.5)",
        text:        "rgba(255,255,255,0.92)",
      }
    : {
        bg:          "#2e3e31",
        border:      "rgba(122,154,130,0.55)",
        borderActive:"rgba(180,220,190,0.95)",
        glow:        "rgba(46,62,49,0.6)",
        text:        "rgba(122,154,130,0.95)",
      }

  const moveTransition = transitionMs
    ? { transition: `left ${transitionMs}ms ${EASE}, top ${transitionMs}ms ${EASE}` }
    : {}

  return (
    <>
      {hasBall && (
        <motion.div
          style={{
            position: "absolute",
            left: `${x}%`, top: `${y}%`,
            marginLeft: -(SIZE + 16) / 2, marginTop: -(SIZE + 16) / 2,
            width: SIZE + 16, height: SIZE + 16,
            borderRadius: "50%",
            border: "2px solid rgba(255,210,100,0.9)",
            pointerEvents: "none",
            zIndex: 9,
            ...moveTransition,
          }}
          animate={{ scale: [1, 1.16, 1], opacity: [0.85, 0.35, 0.85] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
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
          border: `2px solid ${highlighted ? colors.borderActive : colors.border}`,
          boxShadow: highlighted
            ? `0 0 20px ${colors.glow}, 0 0 0 3px rgba(255,255,255,0.18)`
            : `0 0 12px ${colors.glow}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: colors.text,
          fontSize: 10,
          fontWeight: 700,
          fontFamily: "var(--font-mono), monospace",
          cursor: "grab",
          userSelect: "none",
          zIndex: 10,
          ...moveTransition,
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
    </>
  )
}
