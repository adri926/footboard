"use client"

import type { VideoAnnotation } from "../../actions"

function formatTime(sec: number) {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

export default function VideoAnnotationList({
  annotations,
  activeId,
  onOpen,
  onDelete,
}: {
  annotations: VideoAnnotation[]
  activeId: string | null
  onOpen: (a: VideoAnnotation) => void
  onDelete: (id: string) => void
}) {
  if (annotations.length === 0) return null

  return (
    <div>
      <p style={{
        fontFamily: "var(--font-mono), monospace",
        fontSize: 9, letterSpacing: "0.12em",
        color: "rgba(220,180,80,0.8)", marginBottom: 12,
      }}>
        ✎ ANNOTATIONS
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {annotations.map(a => (
          <div key={a.id} style={{
            display: "flex", alignItems: "center", gap: 12,
            backgroundColor: a.id === activeId ? "rgba(220,180,80,0.08)" : "var(--bg-card)",
            border: `1px solid ${a.id === activeId ? "rgba(220,180,80,0.3)" : "rgba(220,180,80,0.15)"}`,
            borderRadius: 10, padding: "10px 14px",
          }}>
            <button
              onClick={() => onOpen(a)}
              style={{
                flex: 1, textAlign: "left", display: "flex", alignItems: "center", gap: 12,
                background: "none", border: "none", cursor: "pointer", padding: 0,
              }}
            >
              <span style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 11, fontWeight: 700, color: "rgba(220,180,80,0.9)",
                minWidth: 40,
              }}>
                {formatTime(a.timestampSec)}
              </span>
              <span style={{
                fontFamily: "var(--font-body), sans-serif",
                fontSize: 12, color: "var(--text-muted)",
              }}>
                {a.drawings.length} tracé{a.drawings.length > 1 ? "s" : ""}
              </span>
            </button>
            <button
              onClick={() => onDelete(a.id)}
              title="Supprimer"
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "var(--text-faint)", padding: 4 }}
            >
              🗑
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
