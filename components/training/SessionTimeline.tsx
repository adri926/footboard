"use client"

import { useState } from "react"
import SessionBlockCard from "./SessionBlock"
import type { SessionBlock, SessionType, ClubProfile } from "@/types/training"
import { SESSION_DURATION_LIMITS } from "@/types/training"

interface Props {
  blocks: SessionBlock[]
  sessionType: SessionType
  clubProfile: ClubProfile
  onReorder: (blocks: SessionBlock[]) => void
  onRemove: (id: string) => void
  onChangeDuration: (id: string, delta: number) => void
}

export default function SessionTimeline({
  blocks, sessionType, clubProfile, onReorder, onRemove, onChangeDuration,
}: Props) {
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)

  const totalDuration = blocks.reduce((sum, b) => sum + b.duration, 0)
  const key = `${clubProfile.level}_${sessionType}`
  const limits = SESSION_DURATION_LIMITS[key] ?? { min: 45, max: 90, warn: 85 }
  const pct = Math.min((totalDuration / limits.max) * 100, 100)
  const barColor = totalDuration > limits.max ? "#e07070" : totalDuration >= limits.warn ? "#d4a847" : "#7A9A82"

  function handleDragStart(e: React.DragEvent, index: number) {
    setDragIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    if (overIndex !== index) setOverIndex(index)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    if (dragIndex === null || overIndex === null || dragIndex === overIndex) {
      setDragIndex(null); setOverIndex(null)
      return
    }
    const reordered = [...blocks]
    const [moved] = reordered.splice(dragIndex, 1)
    reordered.splice(overIndex, 0, moved)
    onReorder(reordered.map((b, i) => ({ ...b, order: i })))
    setDragIndex(null); setOverIndex(null)
  }

  function handleDragEnd() {
    setDragIndex(null); setOverIndex(null)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
      {/* Barre durée */}
      <div style={{ marginBottom: 12, flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
          <span style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 8, letterSpacing: "0.10em", color: "rgba(255,255,255,0.30)",
          }}>
            DURÉE TOTALE
          </span>
          <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 11, fontWeight: 700, color: barColor }}>
            {totalDuration} MIN
            <span style={{ fontSize: 8, color: "rgba(255,255,255,0.22)", fontWeight: 400, marginLeft: 4 }}>
              / {limits.max} max
            </span>
          </span>
        </div>
        <div style={{ height: 3, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.06)" }}>
          <div style={{
            height: "100%", width: `${pct}%`,
            backgroundColor: barColor, borderRadius: 2,
            transition: "width 0.25s, background-color 0.25s",
          }} />
        </div>
        {totalDuration >= limits.warn && (
          <p style={{
            fontFamily: "var(--font-mono), monospace", fontSize: 8,
            color: barColor, marginTop: 4, letterSpacing: "0.06em",
          }}>
            {totalDuration > limits.max
              ? `⚠ Dépassement de ${totalDuration - limits.max} min`
              : "⚠ Proche de la limite"}
          </p>
        )}
      </div>

      {/* État vide */}
      {blocks.length === 0 && (
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 6,
          border: "1px dashed rgba(122,154,130,0.12)",
          borderRadius: 8, textAlign: "center", padding: 20,
        }}>
          <p style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontWeight: 900, fontSize: 13, color: "rgba(255,255,255,0.18)",
          }}>
            TIMELINE VIDE
          </p>
          <p style={{
            fontFamily: "var(--font-body), sans-serif",
            fontSize: 12, color: "rgba(255,255,255,0.18)", maxWidth: 200,
          }}>
            Ajoute des exercices depuis la bibliothèque
          </p>
        </div>
      )}

      {/* Liste blocs */}
      {blocks.length > 0 && (
        <div
          style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 5 }}
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
        >
          {blocks.map((block, index) => (
            <div
              key={block.id}
              draggable
              onDragStart={e => handleDragStart(e, index)}
              onDragOver={e => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            >
              <SessionBlockCard
                block={block}
                index={index}
                onRemove={onRemove}
                onChangeDuration={onChangeDuration}
                isDragging={dragIndex === index}
                isOver={overIndex === index && dragIndex !== index}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
