"use client"

import { useState, useRef } from "react"
import MiniTerrain from "./MiniTerrain"
import type { Exercise } from "@/types/training"
import {
  FAMILY_COLORS, FAMILY_BORDER, FAMILY_TEXT, FAMILY_LABELS,
  INTENSITY_COLORS, INTENSITY_LABELS, POSITION_LABELS,
} from "@/types/training"

interface Props {
  exercise: Exercise
  onClose:  () => void
  onAdd?:   (ex: Exercise, notes: string) => void
}

export default function ExerciseModal({ exercise: ex, onClose, onAdd }: Props) {
  const [notes, setNotes] = useState("")
  const [page, setPage] = useState<0 | 1>(0)
  const touchStartX = useRef<number | null>(null)

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }
  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (delta < -40) setPage(1)
    else if (delta > 40) setPage(0)
    touchStartX.current = null
  }

  const familyBorder  = FAMILY_BORDER[ex.family]
  const familyColor   = FAMILY_TEXT[ex.family] === "#181812" ? "#7A9A82" : FAMILY_TEXT[ex.family]
  const familyBg      = FAMILY_COLORS[ex.family]
  const intensityColor = INTENSITY_COLORS[ex.intensite]

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        backgroundColor: "rgba(0,0,0,0.70)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px 16px",
      }}
    >
      <div style={{
        backgroundColor: "var(--bg-card)",
        border: `1px solid ${familyBorder}`,
        borderTop: `3px solid ${familyColor}`,
        borderRadius: 14,
        width: "100%", maxWidth: 600,
        maxHeight: "90vh",
        display: "flex", flexDirection: "column",
        boxShadow: "0 24px 64px rgba(0,0,0,0.55)",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          padding: "18px 22px 14px",
          borderBottom: "1px solid rgba(122,154,130,0.08)",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12,
        }}>
          <div>
            <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
              <span style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 8, fontWeight: 700, letterSpacing: "0.08em",
                color: familyColor, backgroundColor: familyBg,
                border: `1px solid ${familyBorder}`, padding: "2px 8px", borderRadius: 100,
              }}>
                {FAMILY_LABELS[ex.family].toUpperCase()}
              </span>
              <span style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 8, fontWeight: 700, letterSpacing: "0.06em",
                color: intensityColor, backgroundColor: `${intensityColor}18`,
                border: `1px solid ${intensityColor}40`, padding: "2px 8px", borderRadius: 100,
              }}>
                {INTENSITY_LABELS[ex.intensite].toUpperCase()}
              </span>
              <span style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 8, letterSpacing: "0.06em",
                color: "rgba(122,154,130,0.60)", backgroundColor: "rgba(122,154,130,0.08)",
                border: "1px solid rgba(122,154,130,0.20)", padding: "2px 8px", borderRadius: 100,
              }}>
                {POSITION_LABELS[ex.positionSemaine]}
              </span>
            </div>
            <h2 style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontWeight: 900, fontSize: 20, lineHeight: 1.1,
              color: "rgba(255,255,255,0.96)", letterSpacing: "0.01em",
            }}>
              {ex.name.toUpperCase()}
            </h2>
            <p style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 9, color: "rgba(255,255,255,0.35)",
              marginTop: 5, letterSpacing: "0.06em",
            }}>
              {ex.defaultDuration} MIN · {ex.minPlayers === ex.maxPlayers ? ex.minPlayers : `${ex.minPlayers}–${ex.maxPlayers}`} JOUEURS · {ex.id}
            </p>
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(255,255,255,0.3)", fontSize: 20, padding: "2px 6px", flexShrink: 0,
          }}>
            ✕
          </button>
        </div>

        {/* Corps paginé : terrain ↔ explications */}
        <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          <div
            style={{ flex: 1, minHeight: 0, position: "relative", overflow: "hidden" }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div style={{
              display: "flex", width: "200%", height: "100%",
              transform: `translateX(${page === 0 ? "0%" : "-50%"})`,
              transition: "transform 0.3s ease",
            }}>

              {/* Page 1 : terrain */}
              <div style={{ width: "50%", height: "100%", position: "relative", padding: "16px 22px", boxSizing: "border-box" }}>
                <div style={{
                  backgroundColor: "#17160f",
                  border: "1px solid rgba(122,154,130,0.12)",
                  borderRadius: 10, overflow: "hidden",
                  width: "100%", height: "100%",
                  display: "flex", alignItems: "center", justifyContent: "center", padding: 14,
                  boxSizing: "border-box",
                }}>
                  <MiniTerrain animation={ex.animation} width={400} height={300} responsive animate />
                </div>
                <button onClick={() => setPage(1)} style={DETAILS_HINT_STYLE}>
                  VOIR LES EXPLICATIONS ›
                </button>
              </div>

              {/* Page 2 : explications */}
              <div style={{ width: "50%", height: "100%", overflowY: "auto", padding: "18px 22px 18px 50px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 18, position: "relative" }}>
                <button onClick={() => setPage(0)} style={{ ...NAV_ARROW_STYLE("left"), width: "auto", borderRadius: 100, padding: "6px 12px", fontSize: 9, letterSpacing: "0.06em", fontFamily: "var(--font-mono), monospace" }}>
                  ‹ TERRAIN
                </button>

                {/* Description */}
                <Section title="Description">
                  <p style={BODY_TEXT}>{ex.description}</p>
                </Section>

                {/* Objectifs */}
                <Section title="Objectifs pédagogiques">
                  <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
                    {ex.objectives.map((obj, i) => (
                      <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <span style={{ color: "#7A9A82", fontSize: 10, marginTop: 2, flexShrink: 0 }}>◈</span>
                        <span style={BODY_TEXT}>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </Section>

                {/* Consignes coach */}
                <Section title="Consignes coach">
                  <p style={{
                    ...BODY_TEXT,
                    backgroundColor: "rgba(122,154,130,0.06)",
                    border: "1px solid rgba(122,154,130,0.12)",
                    borderRadius: 8, padding: "10px 12px",
                    fontStyle: "italic",
                  }}>
                    "{ex.instructions}"
                  </p>
                </Section>

                {/* Variantes */}
                {ex.variants.length > 0 && (
                  <Section title="Variantes">
                    <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
                      {ex.variants.map((v, i) => (
                        <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                          <span style={{ color: "rgba(212,168,71,0.7)", fontSize: 10, marginTop: 2, flexShrink: 0 }}>◷</span>
                          <span style={BODY_TEXT}>{v}</span>
                        </li>
                      ))}
                    </ul>
                  </Section>
                )}

                {/* Note pédagogique */}
                {ex.pedagogicNote && (
                  <div style={{
                    backgroundColor: "rgba(212,168,71,0.06)",
                    border: "1px solid rgba(212,168,71,0.25)",
                    borderRadius: 8, padding: "10px 12px",
                    display: "flex", gap: 10,
                  }}>
                    <span style={{ fontSize: 14, flexShrink: 0 }}>⚠️</span>
                    <p style={{ ...BODY_TEXT, color: "rgba(212,168,71,0.85)", margin: 0 }}>{ex.pedagogicNote}</p>
                  </div>
                )}

                {/* Notes personnelles */}
                {onAdd && (
                  <Section title="Notes personnelles (optionnel)">
                    <textarea
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="Adaptations, observations, variante choisie..."
                      rows={3}
                      style={{
                        fontFamily: "var(--font-body), sans-serif",
                        fontWeight: 400, fontSize: 12,
                        backgroundColor: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(122,154,130,0.15)",
                        borderRadius: 8, padding: "9px 12px",
                        color: "rgba(255,255,255,0.80)",
                        width: "100%", resize: "vertical",
                        outline: "none",
                      }}
                    />
                  </Section>
                )}
              </div>
            </div>
          </div>

          {/* Onglets de page */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "10px 0 2px", flexShrink: 0 }}>
            {([
              { i: 0 as const, label: "TERRAIN" },
              { i: 1 as const, label: "EXPLICATIONS" },
            ]).map(({ i, label }) => (
              <button key={i} onClick={() => setPage(i)} style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
                padding: "5px 14px", borderRadius: 100, cursor: "pointer",
                backgroundColor: page === i ? "rgba(122,154,130,0.15)" : "transparent",
                border: `1px solid ${page === i ? "rgba(122,154,130,0.35)" : "rgba(122,154,130,0.12)"}`,
                color: page === i ? "#7A9A82" : "rgba(255,255,255,0.30)",
                transition: "all 0.15s",
              }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: "14px 22px",
          borderTop: "1px solid rgba(122,154,130,0.08)",
          display: "flex", gap: 10,
        }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "11px 0", borderRadius: 10, cursor: "pointer",
            fontFamily: "var(--font-mono), monospace", fontSize: 10, fontWeight: 700,
            backgroundColor: "transparent",
            border: "1px solid rgba(122,154,130,0.15)",
            color: "rgba(255,255,255,0.35)",
          }}>
            FERMER
          </button>
          {onAdd && (
            <button
              onClick={() => { onAdd(ex, notes); onClose() }}
              style={{
                flex: 2, padding: "11px 0", borderRadius: 10, cursor: "pointer",
                fontFamily: "var(--font-mono), monospace", fontSize: 10, fontWeight: 700,
                backgroundColor: "#7A9A82", color: "var(--bg)", border: "none",
              }}
            >
              + AJOUTER À LA SÉANCE
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{
        fontFamily: "var(--font-mono), monospace",
        fontSize: 8, fontWeight: 700, letterSpacing: "0.12em",
        color: "rgba(122,154,130,0.55)", textTransform: "uppercase", marginBottom: 8,
      }}>
        {title}
      </p>
      {children}
    </div>
  )
}

const BODY_TEXT: React.CSSProperties = {
  fontFamily: "var(--font-body), sans-serif",
  fontWeight: 400, fontSize: 12,
  color: "rgba(255,255,255,0.72)",
  lineHeight: 1.55, margin: 0,
}

function NAV_ARROW_STYLE(side: "left" | "right"): React.CSSProperties {
  return {
    position: "absolute",
    [side]: 6,
    top: "50%", transform: "translateY(-50%)",
    width: 30, height: 30, borderRadius: "50%",
    backgroundColor: "rgba(23,22,15,0.70)",
    border: "1px solid rgba(122,154,130,0.30)",
    color: "#7A9A82", fontSize: 16, fontWeight: 700,
    cursor: "pointer", zIndex: 2,
    display: "flex", alignItems: "center", justifyContent: "center",
    lineHeight: 1, padding: 0,
  }
}

const DETAILS_HINT_STYLE: React.CSSProperties = {
  position: "absolute",
  right: 22, bottom: 22,
  fontFamily: "var(--font-mono), monospace",
  fontSize: 9, fontWeight: 700, letterSpacing: "0.06em",
  padding: "7px 14px", borderRadius: 100,
  backgroundColor: "rgba(23,22,15,0.80)",
  border: "1px solid rgba(122,154,130,0.35)",
  color: "#7A9A82",
  cursor: "pointer", zIndex: 2,
}
