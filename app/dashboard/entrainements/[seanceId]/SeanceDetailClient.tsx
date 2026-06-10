"use client"

import { useState } from "react"
import Link from "next/link"
import MiniTerrain from "@/components/training/MiniTerrain"
import type { SessionBlock } from "@/types/training"
import { FAMILY_BORDER, FAMILY_TEXT, FAMILY_LABELS, INTENSITY_COLORS, INTENSITY_LABELS, POSITION_LABELS } from "@/types/training"

interface Session {
  id: string
  name: string
  date: string
  session_type: string
  player_count: number
  total_duration: number
}

interface Props {
  session: Session
  blocks: SessionBlock[]
}

const SESSION_TYPE_LABELS: Record<string, string> = {
  "j+4": "J+4 Pré-match",
  "j+2": "J+2 Récupération",
  "libre": "Libre",
}

function formatDate(dateStr: string) {
  const m = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return dateStr
  const d = new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]))
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
}

export default function SeanceDetailClient({ session, blocks }: Props) {
  const [present, setPresent] = useState(false)

  if (present) {
    return <PresentationMode session={session} blocks={blocks} onExit={() => setPresent(false)} />
  }

  return (
    <div style={{ padding: "28px 32px", maxWidth: 900 }}>
      <Link href="/dashboard/entrainements" style={{
        fontFamily: "var(--font-mono), monospace",
        fontSize: 8, letterSpacing: "0.08em",
        color: "rgba(122,154,130,0.45)",
        display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 16,
        textDecoration: "none",
      }}>
        ← ENTRAÎNEMENTS
      </Link>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, gap: 16, flexWrap: "wrap" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 8, fontWeight: 700, letterSpacing: "0.10em",
              color: "#7A9A82", background: "rgba(122,154,130,0.10)",
              border: "1px solid rgba(122,154,130,0.25)",
              padding: "2px 8px", borderRadius: 100,
            }}>
              {SESSION_TYPE_LABELS[session.session_type] ?? session.session_type}
            </span>
          </div>
          <h1 style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontWeight: 900, fontSize: 28, lineHeight: 1,
            color: "rgba(255,255,255,0.92)", marginBottom: 6,
          }}>
            {session.name}
          </h1>
          <p style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em",
          }}>
            {formatDate(session.date)} · {session.total_duration} MIN · {session.player_count} JOUEURS
          </p>
        </div>

        <button
          onClick={() => setPresent(true)}
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
            padding: "10px 18px", borderRadius: 8, cursor: "pointer",
            backgroundColor: "rgba(122,154,130,0.10)",
            border: "1px solid rgba(122,154,130,0.25)",
            color: "#7A9A82",
          }}
        >
          ▶ MODE PRÉSENTATION
        </button>
      </div>

      {/* Blocs */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {blocks.map((block, index) => (
          <div key={block.id} style={{
            display: "flex", gap: 16, alignItems: "flex-start",
            padding: "16px 20px",
            backgroundColor: "var(--bg-card)",
            border: "1px solid rgba(122,154,130,0.08)",
            borderLeft: `4px solid ${FAMILY_BORDER[block.exercise.family]}`,
            borderRadius: 10,
          }}>
            <span style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.20)",
              minWidth: 20, paddingTop: 2,
            }}>
              {index + 1}
            </span>

            <MiniTerrain animation={block.exercise.animation} width={80} height={52} />

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                <p style={{
                  fontFamily: "var(--font-body), sans-serif",
                  fontWeight: 600, fontSize: 15,
                  color: "rgba(255,255,255,0.88)", margin: 0,
                }}>
                  {block.exercise.name}
                </p>
                <span style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 7, fontWeight: 700, letterSpacing: "0.08em",
                  color: FAMILY_TEXT[block.exercise.family],
                  border: `1px solid ${FAMILY_BORDER[block.exercise.family]}`,
                  padding: "1px 6px", borderRadius: 4,
                }}>
                  {FAMILY_LABELS[block.exercise.family].toUpperCase()}
                </span>
              </div>
              <p style={{
                fontFamily: "var(--font-body), sans-serif",
                fontSize: 12, color: "rgba(255,255,255,0.40)",
                margin: "0 0 6px",
              }}>
                {block.exercise.description}
              </p>
              {block.customNotes && (
                <p style={{
                  fontFamily: "var(--font-body), sans-serif",
                  fontSize: 11, color: "#d4a847",
                  borderLeft: "2px solid rgba(212,168,71,0.3)",
                  paddingLeft: 8, margin: 0,
                }}>
                  {block.customNotes}
                </p>
              )}
            </div>

            <div style={{ flexShrink: 0, textAlign: "right" }}>
              <p style={{
                fontFamily: "var(--font-mono), monospace",
                fontWeight: 700, fontSize: 16, color: "#7A9A82", margin: 0,
              }}>
                {block.duration}′
              </p>
              <p style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 7, color: INTENSITY_COLORS[block.exercise.intensite],
                marginTop: 2, letterSpacing: "0.06em",
              }}>
                {INTENSITY_LABELS[block.exercise.intensite].toUpperCase()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PresentationMode({ session, blocks, onExit }: { session: Session; blocks: SessionBlock[]; onExit: () => void }) {
  const [current, setCurrent] = useState(0)
  const block = blocks[current]

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      backgroundColor: "var(--bg)",
      display: "flex", flexDirection: "column",
    }}>
      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 28px",
        borderBottom: "1px solid rgba(122,154,130,0.10)",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontWeight: 900, fontSize: 14, color: "rgba(255,255,255,0.7)",
          }}>
            {session.name}
          </span>
          <span style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 8, color: "rgba(255,255,255,0.25)", letterSpacing: "0.06em",
          }}>
            {current + 1} / {blocks.length}
          </span>
        </div>
        <button
          onClick={onExit}
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 8, letterSpacing: "0.08em",
            padding: "6px 12px", borderRadius: 6, cursor: "pointer",
            backgroundColor: "transparent",
            border: "1px solid rgba(255,255,255,0.10)",
            color: "rgba(255,255,255,0.35)",
          }}
        >
          ✕ QUITTER
        </button>
      </div>

      {/* Contenu principal */}
      {block && (
        <div style={{ flex: 1, display: "flex", gap: 0, minHeight: 0 }}>
          {/* Terrain */}
          <div style={{
            flex: "0 0 45%", display: "flex", alignItems: "center", justifyContent: "center",
            borderRight: "1px solid rgba(122,154,130,0.08)",
            padding: 32,
          }}>
            <MiniTerrain animation={block.exercise.animation} width={380} height={250} />
          </div>

          {/* Infos */}
          <div style={{ flex: 1, padding: "32px 40px", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 8, fontWeight: 700, letterSpacing: "0.10em",
                color: FAMILY_TEXT[block.exercise.family],
                border: `1px solid ${FAMILY_BORDER[block.exercise.family]}`,
                padding: "2px 8px", borderRadius: 4,
              }}>
                {FAMILY_LABELS[block.exercise.family].toUpperCase()}
              </span>
              <span style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 11, fontWeight: 700, color: "#7A9A82",
              }}>
                {block.duration} MIN
              </span>
            </div>

            <h2 style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontWeight: 900, fontSize: "clamp(24px, 3vw, 36px)",
              color: "rgba(255,255,255,0.92)", lineHeight: 1.0, marginBottom: 16,
            }}>
              {block.exercise.name}
            </h2>

            <p style={{
              fontFamily: "var(--font-body), sans-serif",
              fontSize: 14, color: "rgba(255,255,255,0.55)",
              lineHeight: 1.6, marginBottom: 20,
            }}>
              {block.exercise.description}
            </p>

            <div style={{ marginBottom: 16 }}>
              <p style={{ fontFamily: "var(--font-mono), monospace", fontSize: 8, letterSpacing: "0.10em", color: "rgba(122,154,130,0.5)", marginBottom: 8 }}>
                CONSIGNES COACH
              </p>
              <p style={{
                fontFamily: "var(--font-body), sans-serif",
                fontSize: 13, color: "rgba(255,255,255,0.70)",
                fontStyle: "italic", lineHeight: 1.6,
                borderLeft: "2px solid rgba(122,154,130,0.25)", paddingLeft: 12,
              }}>
                {block.exercise.instructions}
              </p>
            </div>

            {block.customNotes && (
              <div style={{
                padding: "10px 14px", borderRadius: 8,
                backgroundColor: "rgba(212,168,71,0.06)",
                border: "1px solid rgba(212,168,71,0.20)",
              }}>
                <p style={{ fontFamily: "var(--font-mono), monospace", fontSize: 7, letterSpacing: "0.08em", color: "#d4a847", marginBottom: 4 }}>
                  NOTES
                </p>
                <p style={{ fontFamily: "var(--font-body), sans-serif", fontSize: 13, color: "#d4a847" }}>
                  {block.customNotes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
        padding: "16px 28px",
        borderTop: "1px solid rgba(122,154,130,0.08)",
        flexShrink: 0,
      }}>
        <button
          onClick={() => setCurrent(n => Math.max(0, n - 1))}
          disabled={current === 0}
          style={navBtn(current === 0)}
        >
          ‹ PRÉCÉDENT
        </button>

        <div style={{ display: "flex", gap: 4 }}>
          {blocks.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: 8, height: 8, borderRadius: "50%", cursor: "pointer",
                border: "none",
                backgroundColor: i === current ? "#7A9A82" : "rgba(255,255,255,0.15)",
              }}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrent(n => Math.min(blocks.length - 1, n + 1))}
          disabled={current === blocks.length - 1}
          style={navBtn(current === blocks.length - 1)}
        >
          SUIVANT ›
        </button>
      </div>
    </div>
  )
}

function navBtn(disabled: boolean): React.CSSProperties {
  return {
    fontFamily: "var(--font-mono), monospace",
    fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
    padding: "10px 20px", borderRadius: 8, cursor: disabled ? "default" : "pointer",
    backgroundColor: disabled ? "transparent" : "rgba(122,154,130,0.10)",
    border: `1px solid ${disabled ? "rgba(255,255,255,0.06)" : "rgba(122,154,130,0.25)"}`,
    color: disabled ? "rgba(255,255,255,0.15)" : "#7A9A82",
  }
}
