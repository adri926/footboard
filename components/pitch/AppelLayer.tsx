"use client"

import { motion } from "framer-motion"
import type { AppelType } from "@/lib/situations"

export interface AppelArrow {
  x1: number; y1: number
  x2: number; y2: number
  type: AppelType
  delay: number
}

interface Props {
  appels: AppelArrow[]
}

const sx = (x: number) => x * 6
const sy = (y: number) => y * 9

const STYLES: Record<AppelType, { stroke: string; dash?: string }> = {
  appui:         { stroke: "rgba(255,255,255,0.88)"  },
  profondeur:    { stroke: "rgba(255,155,30,0.95)"   },
  soutien:       { stroke: "rgba(60,200,255,0.90)",  dash: "7 4" },
  lateral:       { stroke: "rgba(200,110,255,0.88)", dash: "5 4" },
  longDeLaLigne: { stroke: "rgba(70,215,110,0.90)"  },
}

function curvedPath(x1: number, y1: number, x2: number, y2: number): string {
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const dx = -(y2 - y1) * 0.22
  const dy =  (x2 - x1) * 0.22
  return `M ${sx(x1)} ${sy(y1)} Q ${sx(mx + dx)} ${sy(my + dy)} ${sx(x2)} ${sy(y2)}`
}

// Animation: fade in, hold, fade out, pause, repeat
// Each arrow has its own delay so they appear staggered
const ANIM_VARIANTS = {
  opacity: [0, 0, 1, 1, 0, 0],
  // times: start / ramp-up start / full / hold-end / fade-end / gap
}
const TIMES = [0, 0.06, 0.22, 0.62, 0.80, 1]

export default function AppelLayer({ appels }: Props) {
  if (!appels.length) return null

  return (
    <svg
      viewBox="0 0 600 900"
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
      style={{ zIndex: 16 }}
    >
      <defs>
        {(Object.keys(STYLES) as AppelType[]).map(type => (
          <marker key={type} id={`ap-${type}`}
            viewBox="0 0 10 10" refX="8" refY="5"
            markerWidth="4" markerHeight="4" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={STYLES[type].stroke} />
          </marker>
        ))}
      </defs>

      {appels.map((a, i) => {
        const s = STYLES[a.type]
        return (
          <motion.path
            key={`${a.type}-${i}`}
            d={curvedPath(a.x1, a.y1, a.x2, a.y2)}
            stroke={s.stroke}
            strokeWidth={2.4}
            strokeDasharray={s.dash}
            fill="none"
            markerEnd={`url(#ap-${a.type})`}
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: ANIM_VARIANTS.opacity }}
            transition={{
              duration: 2.8,
              delay: a.delay,
              repeat: Infinity,
              ease: "easeInOut",
              times: TIMES,
            }}
          />
        )
      })}
    </svg>
  )
}
