"use client"

import { useCallback, useState } from "react"
import type { PointerEvent, RefObject } from "react"
import type { Drawing, DrawingType } from "@/types/tactical"

export type Tool = "curseur" | DrawingType | "gomme"

interface Props {
  containerRef: RefObject<HTMLDivElement | null>
  drawings: Drawing[]
  tool: Tool
  color: string
  thickness: number
  onAdd: (drawing: Drawing) => void
  onErase: (drawing: Drawing) => void
  // Repère du calque SVG — par défaut les proportions du terrain (105 x 68 m → 680 x 1050).
  // Le digiboard s'appuie sur ce défaut implicitement via le CSS qui force le même ratio sur
  // son conteneur ; tout autre usage (ex: superposer le calque à une vidéo) doit passer un
  // ratio qui matche le ratio réel rendu du containerRef, sinon le SVG letterboxe et les
  // tracés se décalent par rapport à là où le pointeur a cliqué.
  vbWidth?: number
  vbHeight?: number
}

type Pt = { x: number; y: number }

function pointFromEvent(e: PointerEvent<SVGSVGElement>, container: HTMLDivElement): Pt {
  const rect = container.getBoundingClientRect()
  return {
    x: Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)),
    y: Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)),
  }
}

// Tracé SVG d'un dessin — converti depuis ses points en pourcentage vers le repère du calque
function pathFor(d: Drawing, vbWidth: number, vbHeight: number): string {
  const vx = (pct: number) => (pct / 100) * vbWidth
  const vy = (pct: number) => (pct / 100) * vbHeight
  const pts = d.points.map(p => ({ x: vx(p.x), y: vy(p.y) }))
  if (pts.length === 0) return ""
  if (d.type === "crayon") {
    return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ")
  }
  if (pts.length < 2) return ""
  const [a, b] = pts
  if (d.type === "fleche-courbe") {
    const mx = (a.x + b.x) / 2
    const my = (a.y + b.y) / 2
    const dx = -(b.y - a.y) * 0.18
    const dy = (b.x - a.x) * 0.18
    return `M ${a.x} ${a.y} Q ${mx + dx} ${my + dy} ${b.x} ${b.y}`
  }
  return `M ${a.x} ${a.y} L ${b.x} ${b.y}`
}

const ARROW_TYPES: DrawingType[] = ["fleche", "fleche-tirets", "fleche-courbe"]

// Distance d'un point à un segment — sert à savoir si le pointeur "touche" un tracé
function distanceToSegment(p: Pt, a: Pt, b: Pt): number {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const lengthSq = dx * dx + dy * dy
  if (lengthSq === 0) return Math.hypot(p.x - a.x, p.y - a.y)
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lengthSq))
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy))
}

// Distance approximative du pointeur à un dessin, dans le repère 0-100 (pourcentage du terrain)
function distanceToDrawing(p: Pt, d: Drawing): number {
  if (d.type === "texte") {
    const [a] = d.points
    return a ? Math.hypot(p.x - a.x, p.y - a.y) : Infinity
  }
  if (d.type === "zone") {
    const [a, b] = d.points
    if (!a || !b) return Infinity
    const cx = (a.x + b.x) / 2
    const cy = (a.y + b.y) / 2
    const rx = Math.max(Math.abs(a.x - b.x) / 2, 0.1)
    const ry = Math.max(Math.abs(a.y - b.y) / 2, 0.1)
    const norm = ((p.x - cx) ** 2) / (rx * rx) + ((p.y - cy) ** 2) / (ry * ry)
    if (norm <= 1.05) return 0 // sur le bord ou à l'intérieur de la zone
    return Math.hypot(p.x - cx, p.y - cy) - Math.hypot(rx, ry)
  }
  if (d.type === "fleche-courbe" && d.points.length >= 2) {
    const [a, b] = d.points
    const mx = (a.x + b.x) / 2 - (b.y - a.y) * 0.18
    const my = (a.y + b.y) / 2 + (b.x - a.x) * 0.18
    // approxime la courbe par deux segments passant par son point de contrôle
    return Math.min(distanceToSegment(p, a, { x: mx, y: my }), distanceToSegment(p, { x: mx, y: my }, b))
  }
  let min = Infinity
  for (let i = 0; i < d.points.length - 1; i++) {
    min = Math.min(min, distanceToSegment(p, d.points[i], d.points[i + 1]))
  }
  if (d.points.length === 1) min = Math.hypot(p.x - d.points[0].x, p.y - d.points[0].y)
  return min
}

const ERASE_RADIUS = 2.6 // en pourcentage du terrain — rayon de détection de la gomme

// Représentation visuelle d'un dessin déjà posé sur le terrain
function DrawingShape({ d, vbWidth, vbHeight }: { d: Drawing; vbWidth: number; vbHeight: number }) {
  const vx = (pct: number) => (pct / 100) * vbWidth
  const vy = (pct: number) => (pct / 100) * vbHeight
  const colorId = d.color.replace("#", "")
  if (d.type === "zone") {
    const [a, b] = d.points
    if (!a || !b) return null
    const cx = (vx(a.x) + vx(b.x)) / 2
    const cy = (vy(a.y) + vy(b.y)) / 2
    const rx = Math.abs(vx(a.x) - vx(b.x)) / 2
    const ry = Math.abs(vy(a.y) - vy(b.y)) / 2
    return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`${d.color}22`} stroke={d.color} strokeWidth={d.thickness} />
  }
  if (d.type === "texte") {
    const [p] = d.points
    if (!p) return null
    return (
      <text x={vx(p.x)} y={vy(p.y)} fill={d.color} fontSize={20 + d.thickness * 1.5}
        fontFamily="var(--font-mono), monospace" fontWeight={700} style={{ paintOrder: "stroke" }}
        stroke="#181812" strokeWidth={3}>
        {d.text}
      </text>
    )
  }
  return (
    <path
      d={pathFor(d, vbWidth, vbHeight)}
      fill="none"
      stroke={d.color}
      strokeWidth={d.thickness}
      strokeDasharray={d.type === "fleche-tirets" ? "16 9" : undefined}
      strokeLinecap="round"
      strokeLinejoin="round"
      markerEnd={ARROW_TYPES.includes(d.type) ? `url(#arrow-${colorId})` : undefined}
    />
  )
}

// Calque de dessin superposé au terrain — capture le pointeur seulement quand un outil de dessin
// est actif (le mode "curseur" laisse passer les interactions vers les pions et le ballon).
// La gomme efface par proximité géométrique : on passe le curseur sur un tracé pour le supprimer.
export default function DrawingCanvas({ containerRef, drawings, tool, color, thickness, onAdd, onErase, vbWidth = 680, vbHeight = 1050 }: Props) {
  const [draft, setDraft] = useState<Drawing | null>(null)
  const [erasing, setErasing] = useState(false)

  const eraseNear = useCallback((pt: Pt) => {
    for (const d of drawings) {
      if (distanceToDrawing(pt, d) <= ERASE_RADIUS) {
        onErase(d)
        return
      }
    }
  }, [drawings, onErase])

  const handlePointerDown = useCallback((e: PointerEvent<SVGSVGElement>) => {
    if (tool === "curseur") return
    const container = containerRef.current
    if (!container) return
    const pt = pointFromEvent(e, container)
    e.currentTarget.setPointerCapture(e.pointerId)

    if (tool === "gomme") {
      setErasing(true)
      eraseNear(pt)
      return
    }
    if (tool === "texte") {
      const text = window.prompt("Texte de l'annotation :")?.trim()
      if (text) onAdd({ type: "texte", points: [pt], color, thickness, text })
      return
    }
    if (tool === "crayon") {
      setDraft({ type: "crayon", points: [pt], color, thickness })
    } else {
      setDraft({ type: tool, points: [pt, pt], color, thickness })
    }
  }, [tool, color, thickness, containerRef, onAdd, eraseNear])

  const handlePointerMove = useCallback((e: PointerEvent<SVGSVGElement>) => {
    const container = containerRef.current
    if (!container) return
    const pt = pointFromEvent(e, container)

    if (erasing) {
      eraseNear(pt)
      return
    }
    if (!draft) return
    setDraft(d => {
      if (!d) return d
      if (d.type === "crayon") return { ...d, points: [...d.points, pt] }
      return { ...d, points: [d.points[0], pt] }
    })
  }, [draft, erasing, eraseNear, containerRef])

  const handlePointerUp = useCallback(() => {
    setErasing(false)
    if (draft && draft.points.length >= 2) onAdd(draft)
    setDraft(null)
  }, [onAdd, draft])

  const isDrawing = tool !== "curseur" && tool !== "gomme"
  const arrowColors = Array.from(new Set(
    [...drawings, ...(draft ? [draft] : [])]
      .filter(d => ARROW_TYPES.includes(d.type))
      .map(d => d.color)
  ))

  return (
    <svg
      viewBox={`0 0 ${vbWidth} ${vbHeight}`}
      className="absolute inset-0 w-full h-full"
      style={{
        zIndex: 35,
        pointerEvents: tool === "curseur" ? "none" : "auto",
        cursor: tool === "gomme" || isDrawing ? "crosshair" : "default",
        touchAction: "none",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <defs>
        {arrowColors.map(c => (
          <marker key={c} id={`arrow-${c.replace("#", "")}`} viewBox="0 0 10 10"
            refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={c} />
          </marker>
        ))}
      </defs>

      {drawings.map((d, i) => <DrawingShape key={i} d={d} vbWidth={vbWidth} vbHeight={vbHeight} />)}
      {draft && <DrawingShape d={draft} vbWidth={vbWidth} vbHeight={vbHeight} />}
    </svg>
  )
}
