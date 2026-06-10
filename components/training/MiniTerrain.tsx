"use client"

// Terrain miniature — utilisé dans les cards et modals d'exercice (statique ou animé en boucle)
import { useEffect, useRef, useState } from "react"
import type { ExerciseAnimation, ExercisePion, ExerciseArrow, ExerciseZone } from "@/types/training"

const LINE  = "rgba(122,154,130,0.55)"
const LINE2 = "rgba(122,154,130,0.25)"
const BG    = "#0d1a0e"
const BG_STRIPE = "#0f1d10"

const PION_COLORS: Record<ExercisePion["team"], { fill: string; stroke: string; text: string }> = {
  A:       { fill: "rgba(122,154,130,0.85)", stroke: "#7A9A82",              text: "#0d1a0e" },
  B:       { fill: "rgba(192,57,43,0.80)",   stroke: "rgba(192,57,43,0.95)", text: "#fff"   },
  neutral: { fill: "rgba(212,168,71,0.80)",  stroke: "rgba(212,168,71,0.95)", text: "#0d1a0e" },
}

// Fond "terrain complet" avec lignes de jeu (médiane, surfaces, rond central)
function FullPitchSvg({ w, h, M, TW, TH }: { w: number; h: number; M: number; TW: number; TH: number }) {
  const cx = M + TW / 2

  return (
    <>
      <rect width={w} height={h} fill="#17160f" />
      <rect x={M} y={M} width={TW} height={TH} fill={BG} />
      {Array.from({ length: 8 }).map((_, i) =>
        i % 2 === 0 ? null : (
          <rect key={i} x={M} y={M + i * (TH / 8)} width={TW} height={TH / 8} fill={BG_STRIPE} />
        )
      )}
      <rect x={M} y={M} width={TW} height={TH} fill="none" stroke={LINE} strokeWidth={0.8} />
      <line x1={M} y1={M + TH / 2} x2={M + TW} y2={M + TH / 2} stroke={LINE} strokeWidth={0.8} />
      <circle cx={cx} cy={M + TH / 2} r={TW * 0.12} fill="none" stroke={LINE} strokeWidth={0.7} />
      <circle cx={cx} cy={M + TH / 2} r={1.5} fill={LINE} />
      {[M, M + TH - TH * 0.14].map((y, i) => (
        <rect key={i} x={cx - TW * 0.33} y={y} width={TW * 0.66} height={TH * 0.14}
          fill="none" stroke={LINE2} strokeWidth={0.6} />
      ))}
    </>
  )
}

// Fond "zone de travail" — gazon simple, sans lignes de terrain (vue zoomée)
function WorkZoneSvg({ w, h, M, TW, TH }: { w: number; h: number; M: number; TW: number; TH: number }) {
  return (
    <>
      <rect width={w} height={h} fill="#17160f" />
      <rect x={M} y={M} width={TW} height={TH} fill={BG} />
      {Array.from({ length: 8 }).map((_, i) =>
        i % 2 === 0 ? null : (
          <rect key={i} x={M} y={M + i * (TH / 8)} width={TW} height={TH / 8} fill={BG_STRIPE} />
        )
      )}
      <rect x={M} y={M} width={TW} height={TH} fill="none" stroke={LINE} strokeWidth={0.8} />
    </>
  )
}

function pct(val: number, total: number, margin: number) {
  return margin + (val / 100) * (total - margin * 2)
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

interface Props {
  animation: ExerciseAnimation
  width?:      number
  height?:     number
  responsive?: boolean // remplit son conteneur au lieu d'une taille fixe (viewBox conservé pour les proportions)
  animate?:    boolean // joue animation.sequence en boucle si présente
}

export default function MiniTerrain({ animation, width = 160, height = 100, responsive = false, animate = false }: Props) {
  const M  = Math.round(width * 0.04)
  const TW = width  - M * 2
  const TH = height - M * 2

  const sequence = animation.sequence
  const hasSequence = animate && !!sequence && sequence.length >= 2

  // ─── Lecture en boucle de la séquence (requestAnimationFrame) ───
  const [elapsed, setElapsed] = useState(0)
  const rafRef   = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    if (!hasSequence || !sequence) return
    const total = sequence.slice(1).reduce((s, k) => s + k.duration, 0)
    if (total <= 0) return

    function tick(ts: number) {
      if (startRef.current === null) startRef.current = ts
      setElapsed((ts - startRef.current!) % total)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      startRef.current = null
    }
  }, [hasSequence, sequence])

  // ─── Positions courantes (interpolées si séquence active) ───
  let currentPions = animation.pions
  let currentBall: { x: number; y: number } | null = animation.ball ?? null
  let currentBalls: Record<string, { x: number; y: number }> = animation.balls ?? {}

  if (hasSequence && sequence) {
    let acc = 0
    let segIdx = 1
    for (; segIdx < sequence.length; segIdx++) {
      if (elapsed < acc + sequence[segIdx].duration) break
      acc += sequence[segIdx].duration
    }
    if (segIdx >= sequence.length) segIdx = sequence.length - 1
    const prev = sequence[segIdx - 1]
    const next = sequence[segIdx]
    const segT = next.duration > 0 ? (elapsed - acc) / next.duration : 1
    const e = easeInOutQuad(Math.min(Math.max(segT, 0), 1))

    currentPions = animation.pions.map(p => {
      const a = prev.pions[p.id]
      const b = next.pions[p.id]
      if (a && b) return { ...p, x: lerp(a.x, b.x, e), y: lerp(a.y, b.y, e) }
      return p
    })

    if (prev.ball && next.ball) {
      currentBall = { x: lerp(prev.ball.x, next.ball.x, e), y: lerp(prev.ball.y, next.ball.y, e) }
    }

    if (prev.balls && next.balls) {
      const balls: Record<string, { x: number; y: number }> = {}
      for (const id of Object.keys(next.balls)) {
        const a = prev.balls[id]
        const b = next.balls[id]
        if (a && b) balls[id] = { x: lerp(a.x, b.x, e), y: lerp(a.y, b.y, e) }
      }
      currentBalls = balls
    }
  }

  // Boîte englobante de tous les éléments de l'animation (en coordonnées 0-100)
  const xs: number[] = []
  const ys: number[] = []
  for (const p of currentPions) { xs.push(p.x); ys.push(p.y) }
  for (const a of animation.arrows) { xs.push(a.from.x, a.to.x); ys.push(a.from.y, a.to.y) }
  for (const z of (animation.zones ?? [])) {
    xs.push(z.x, z.x + z.width); ys.push(z.y, z.y + z.height)
  }
  if (hasSequence && sequence) {
    for (const kf of sequence) {
      for (const pos of Object.values(kf.pions)) { xs.push(pos.x); ys.push(pos.y) }
      if (kf.ball) { xs.push(kf.ball.x); ys.push(kf.ball.y) }
      for (const pos of Object.values(kf.balls ?? {})) { xs.push(pos.x); ys.push(pos.y) }
    }
  }

  let minX = 0, maxX = 100, minY = 0, maxY = 100, zoomed = false
  if (xs.length > 0) {
    const rawMinX = Math.min(...xs), rawMaxX = Math.max(...xs)
    const rawMinY = Math.min(...ys), rawMaxY = Math.max(...ys)
    const rangeX = Math.max(rawMaxX - rawMinX, 10)
    const rangeY = Math.max(rawMaxY - rawMinY, 10)
    const padX = rangeX * 0.25
    const padY = rangeY * 0.25
    const viewMinX = Math.max(0, rawMinX - padX)
    const viewMaxX = Math.min(100, rawMaxX + padX)
    const viewMinY = Math.max(0, rawMinY - padY)
    const viewMaxY = Math.min(100, rawMaxY + padY)
    const scaleX = 100 / (viewMaxX - viewMinX)
    const scaleY = 100 / (viewMaxY - viewMinY)

    if (scaleX > 1.2 || scaleY > 1.2) {
      zoomed = true
      minX = viewMinX; maxX = viewMaxX
      minY = viewMinY; maxY = viewMaxY
    }
  }

  const toX = (x: number) => zoomed
    ? M + ((x - minX) / (maxX - minX)) * TW
    : pct(x, width, M)
  const toY = (y: number) => zoomed
    ? M + ((y - minY) / (maxY - minY)) * TH
    : pct(y, height, M)

  const pionR = Math.max(4, Math.round(width * (zoomed ? 0.034 : 0.028)))
  const fontSize = Math.max(4, Math.round(width * (zoomed ? 0.06 : 0.055)))
  const strokeW = Math.max(0.8, width * 0.006)

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={responsive ? "100%" : width}
      height={responsive ? "100%" : height}
      preserveAspectRatio="xMidYMid meet"
      style={{ display: "block", borderRadius: 4, overflow: "hidden" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* marqueur flèche solide */}
        <marker id={`arr-s-${width}`} markerWidth={6} markerHeight={6}
          refX={5} refY={3} orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#7A9A82" />
        </marker>
        {/* marqueur flèche rouge */}
        <marker id={`arr-r-${width}`} markerWidth={6} markerHeight={6}
          refX={5} refY={3} orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#e07070" />
        </marker>
      </defs>

      {zoomed
        ? <WorkZoneSvg w={width} h={height} M={M} TW={TW} TH={TH} />
        : <FullPitchSvg w={width} h={height} M={M} TW={TW} TH={TH} />}

      {/* zones */}
      {(animation.zones ?? []).map((z: ExerciseZone, i: number) => (
        <rect key={i}
          x={toX(z.x)} y={toY(z.y)}
          width={(z.width / 100) * TW * (zoomed ? (100 / (maxX - minX)) : 1)}
          height={(z.height / 100) * TH * (zoomed ? (100 / (maxY - minY)) : 1)}
          fill={z.color}
          stroke="none"
        />
      ))}

      {/* flèches (masquées pendant la lecture animée) */}
      {!hasSequence && animation.arrows.map((a: ExerciseArrow, i: number) => {
        const color   = a.color ?? "#7A9A82"
        const isRed   = color === "#e07070"
        const markerId = isRed ? `arr-r-${width}` : `arr-s-${width}`
        return (
          <line key={i}
            x1={toX(a.from.x)} y1={toY(a.from.y)}
            x2={toX(a.to.x)}   y2={toY(a.to.y)}
            stroke={color}
            strokeWidth={strokeW}
            strokeDasharray={a.style === "dashed" ? `${strokeW * 3},${strokeW * 2}` : undefined}
            markerEnd={`url(#${markerId})`}
            opacity={0.85}
          />
        )
      })}

      {/* pions */}
      {currentPions.map((p: ExercisePion) => {
        const c = PION_COLORS[p.team]
        const x = toX(p.x)
        const y = toY(p.y)
        return (
          <g key={p.id}>
            <circle cx={x} cy={y} r={pionR} fill={c.fill} stroke={c.stroke} strokeWidth={0.8} />
            <text x={x} y={y + fontSize * 0.36}
              textAnchor="middle"
              fill={c.text}
              fontSize={fontSize * 0.78}
              fontWeight="700"
              fontFamily="monospace"
              style={{ userSelect: "none" }}
            >
              {p.label.length > 2 ? p.label.slice(0, 2) : p.label}
            </text>
          </g>
        )
      })}

      {/* ballon unique */}
      {currentBall && (
        <circle
          cx={toX(currentBall.x)} cy={toY(currentBall.y)}
          r={pionR * 0.45}
          fill="#f4f1e8" stroke="#0d1a0e" strokeWidth={0.8}
        />
      )}

      {/* ballons multiples (1 par joueur, etc.) */}
      {Object.entries(currentBalls).map(([id, b]) => (
        <circle key={id}
          cx={toX(b.x)} cy={toY(b.y)}
          r={pionR * 0.45}
          fill="#f4f1e8" stroke="#0d1a0e" strokeWidth={0.8}
        />
      ))}
    </svg>
  )
}
