"use client"

import MiniTerrain from "./MiniTerrain"
import type { SessionBlock } from "@/types/training"
import { FAMILY_BORDER, FAMILY_TEXT, FAMILY_LABELS } from "@/types/training"

interface Props {
  block: SessionBlock
  index: number
  onRemove: (id: string) => void
  onChangeDuration: (id: string, delta: number) => void
  isDragging: boolean
  isOver: boolean
}

export default function SessionBlockCard({ block, index, onRemove, onChangeDuration, isDragging, isOver }: Props) {
  const { exercise } = block

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "8px 10px",
      backgroundColor: isDragging ? "rgba(122,154,130,0.06)" : "var(--bg)",
      border: `1px solid ${isOver ? "rgba(122,154,130,0.40)" : "rgba(122,154,130,0.10)"}`,
      borderLeft: `3px solid ${FAMILY_BORDER[exercise.family]}`,
      borderRadius: 8,
      opacity: isDragging ? 0.45 : 1,
      transition: "border-color 0.15s, opacity 0.15s",
      cursor: "grab",
      userSelect: "none",
    }}>
      <span style={{
        fontFamily: "var(--font-mono), monospace",
        fontSize: 8, color: "rgba(255,255,255,0.18)",
        minWidth: 14, flexShrink: 0, textAlign: "center",
      }}>
        {index + 1}
      </span>

      <div style={{ flexShrink: 0 }}>
        <MiniTerrain animation={exercise.animation} width={52} height={34} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontFamily: "var(--font-body), sans-serif",
          fontWeight: 500, fontSize: 12,
          color: "rgba(255,255,255,0.85)",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          margin: 0,
        }}>
          {exercise.name}
        </p>
        <span style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 7, fontWeight: 700, letterSpacing: "0.08em",
          color: FAMILY_TEXT[exercise.family],
        }}>
          {FAMILY_LABELS[exercise.family].toUpperCase()}
        </span>
      </div>

      <div
        style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={() => onChangeDuration(block.id, -5)}
          disabled={block.duration <= 5}
          style={{
            width: 20, height: 20, borderRadius: 4, cursor: "pointer",
            backgroundColor: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}
        >−</button>
        <span style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.70)",
          minWidth: 30, textAlign: "center",
        }}>
          {block.duration}′
        </span>
        <button
          onClick={() => onChangeDuration(block.id, 5)}
          disabled={block.duration >= 60}
          style={{
            width: 20, height: 20, borderRadius: 4, cursor: "pointer",
            backgroundColor: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}
        >+</button>
      </div>

      <button
        onClick={e => { e.stopPropagation(); onRemove(block.id) }}
        style={{
          flexShrink: 0, width: 20, height: 20, borderRadius: 4,
          cursor: "pointer", backgroundColor: "transparent",
          border: "1px solid rgba(224,112,112,0.18)",
          color: "rgba(224,112,112,0.45)", fontSize: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >✕</button>
    </div>
  )
}
