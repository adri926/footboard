"use client"

import { useState, useMemo } from "react"
import type { Match } from "@/app/dashboard/matchs/actions"
import type { Training } from "@/app/dashboard/entrainements/actions"
import { TRAINING_TYPES } from "@/lib/training-types"
import PageHeader from "@/components/dashboard/PageHeader"

type SelectedEvent = CalEvent & { dateStr: string }

const DAYS_HEADER = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"]
const MONTHS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"]

const TYPE_COLORS: Record<string, string> = {
  tactique: "#7A9A82", technique: "#6b9ab8", physique: "#d4a847",
  cpa: "#a87ab8", recuperation: "#7ab8a8", amical: "#e07070",
}

function dateKey(dateStr: string): string {
  const m = dateStr.match(/(\d{4}-\d{2}-\d{2})/)
  return m ? m[1] : dateStr
}

function localToday(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`
}

type CalEvent =
  | { kind: "training"; id: string; theme: string | null; type: string | null; location: string | null }
  | { kind: "match";    id: string; opponent: string; home_away: "home" | "away"; goals_for: number | null; goals_against: number | null }

interface Props { matches: Match[]; trainings: Training[] }

export default function CalendrierClient({ matches, trainings }: Props) {
  const now   = new Date()
  const [year, setYear]     = useState(now.getFullYear())
  const [month, setMonth]   = useState(now.getMonth())
  const [selected, setSelected] = useState<SelectedEvent | null>(null)

  const today = localToday()

  function prev() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  function next() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }
  function goToday() { setYear(now.getFullYear()); setMonth(now.getMonth()) }

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalEvent[]> = {}
    trainings.forEach(t => {
      const k = dateKey(t.date)
      if (!map[k]) map[k] = []
      map[k].push({ kind: "training", id: t.id, theme: t.theme, type: t.type, location: t.location })
    })
    matches.forEach(m => {
      const k = dateKey(m.date)
      if (!map[k]) map[k] = []
      map[k].push({ kind: "match", id: m.id, opponent: m.opponent, home_away: m.home_away, goals_for: m.goals_for, goals_against: m.goals_against })
    })
    return map
  }, [matches, trainings])

  const firstDay    = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startOffset = (firstDay.getDay() + 6) % 7

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const monthStr = `${year}-${String(month+1).padStart(2,"0")}`

  return (
    <>
      <PageHeader
        label="Mon Club"
        title="Calendrier"
        action={
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{
              fontFamily: "var(--font-mono), monospace", fontSize: 7, fontWeight: 700,
              letterSpacing: "0.05em", color: "#7A9A82",
              backgroundColor: "rgba(122,154,130,0.15)", border: "1px solid rgba(122,154,130,0.35)",
              padding: "3px 8px", borderRadius: 4,
            }}>
              ENTRAÎNEMENT
            </span>
            <span style={{
              fontFamily: "var(--font-mono), monospace", fontSize: 7, fontWeight: 700,
              letterSpacing: "0.05em", color: "#d4a847",
              backgroundColor: "rgba(212,168,71,0.12)", border: "1px solid rgba(212,168,71,0.3)",
              padding: "3px 8px", borderRadius: 4,
            }}>
              MATCH
            </span>
          </div>
        }
      />

      {/* Navigation mois */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button onClick={prev} style={{
          background: "none", border: "1px solid rgba(122,154,130,0.15)",
          borderRadius: 6, padding: "5px 12px", cursor: "pointer",
          color: "rgba(255,255,255,0.5)", fontSize: 16, lineHeight: 1,
        }}>‹</button>

        <span style={{
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontWeight: 900, fontSize: 22, color: "rgba(255,255,255,0.9)",
          minWidth: 220, textAlign: "center",
        }}>
          {MONTHS[month]} {year}
        </span>

        <button onClick={next} style={{
          background: "none", border: "1px solid rgba(122,154,130,0.15)",
          borderRadius: 6, padding: "5px 12px", cursor: "pointer",
          color: "rgba(255,255,255,0.5)", fontSize: 16, lineHeight: 1,
        }}>›</button>

        <button onClick={goToday} style={{
          marginLeft: 8, padding: "6px 14px", borderRadius: 6, cursor: "pointer",
          fontFamily: "var(--font-mono), monospace", fontSize: 8, fontWeight: 700, letterSpacing: "0.08em",
          background: "none", border: "1px solid rgba(122,154,130,0.2)", color: "rgba(122,154,130,0.6)",
        }}>
          AUJOURD'HUI
        </button>
      </div>

      {/* Grille */}
      <div style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid rgba(122,154,130,0.08)",
        borderRadius: 12, overflow: "hidden",
      }}>
        {/* En-têtes jours */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "1px solid rgba(122,154,130,0.08)" }}>
          {DAYS_HEADER.map((d, i) => (
            <div key={i} style={{
              padding: "10px 0", textAlign: "center",
              fontFamily: "var(--font-mono), monospace",
              fontSize: 8, fontWeight: 700, letterSpacing: "0.1em",
              color: i >= 5 ? "rgba(122,154,130,0.4)" : "rgba(255,255,255,0.2)",
            }}>
              {d}
            </div>
          ))}
        </div>

        {/* Cellules */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
          {cells.map((day, i) => {
            if (!day) {
              return (
                <div key={i} style={{
                  minHeight: 100,
                  borderRight: (i + 1) % 7 !== 0 ? "1px solid rgba(122,154,130,0.06)" : "none",
                  borderBottom: "1px solid rgba(122,154,130,0.06)",
                  backgroundColor: "rgba(0,0,0,0.1)",
                }} />
              )
            }

            const dateStr  = `${monthStr}-${String(day).padStart(2,"0")}`
            const events   = eventsByDate[dateStr] ?? []
            const isToday  = dateStr === today
            const isPast   = dateStr < today
            const isWeekend = ((i % 7) === 5 || (i % 7) === 6)

            return (
              <div key={i} style={{
                minHeight: 100,
                padding: "8px 8px 6px",
                borderRight: (i + 1) % 7 !== 0 ? "1px solid rgba(122,154,130,0.06)" : "none",
                borderBottom: "1px solid rgba(122,154,130,0.06)",
                backgroundColor: isToday
                  ? "rgba(122,154,130,0.06)"
                  : isWeekend ? "rgba(0,0,0,0.06)" : "transparent",
              }}>
                {/* Numéro du jour */}
                <div style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: isToday ? 12 : 11,
                  fontWeight: isToday ? 700 : 400,
                  color: isToday
                    ? "#7A9A82"
                    : isPast ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.55)",
                  marginBottom: 5,
                  display: "flex", alignItems: "center", gap: 4,
                }}>
                  {day}
                  {isToday && (
                    <span style={{
                      width: 4, height: 4, borderRadius: "50%",
                      backgroundColor: "#7A9A82", display: "inline-block",
                    }} />
                  )}
                </div>

                {/* Événements */}
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {events.map((ev, ei) => {
                    if (ev.kind === "training") {
                      return (
                        <div
                          key={ei}
                          onClick={() => setSelected({ ...ev, dateStr })}
                          style={{
                            backgroundColor: "rgba(122,154,130,0.15)",
                            border: "1px solid rgba(122,154,130,0.35)",
                            borderRadius: 4, padding: "2px 5px", cursor: "pointer",
                          }}
                        >
                          <p style={{
                            fontFamily: "var(--font-mono), monospace",
                            fontSize: 7, fontWeight: 700, color: "#7A9A82",
                            letterSpacing: "0.05em",
                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                          }}>
                            ENTRAÎNEMENT
                          </p>
                        </div>
                      )
                    }

                    const hasScore   = ev.goals_for !== null && ev.goals_against !== null
                    const win        = hasScore && ev.goals_for! > ev.goals_against!
                    const draw       = hasScore && ev.goals_for === ev.goals_against
                    const matchColor = hasScore ? (win ? "#7A9A82" : draw ? "#d4a847" : "#e07070") : "#d4a847"

                    return (
                      <div
                        key={ei}
                        onClick={() => setSelected({ ...ev, dateStr })}
                        style={{
                          backgroundColor: `${matchColor}18`,
                          border: `1px solid ${matchColor}40`,
                          borderRadius: 4, padding: "2px 5px", cursor: "pointer",
                        }}
                      >
                        <p style={{
                          fontFamily: "var(--font-mono), monospace",
                          fontSize: 7, fontWeight: 700, color: matchColor,
                          letterSpacing: "0.05em",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        }}>
                          MATCH
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {/* Modale détail */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid rgba(122,154,130,0.18)",
              borderRadius: 16, padding: "28px 28px",
              width: "100%", maxWidth: 380,
              boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
            }}
          >
            {selected.kind === "training" ? (
              <TrainingDetail ev={selected} onClose={() => setSelected(null)} />
            ) : (
              <MatchDetail ev={selected} onClose={() => setSelected(null)} />
            )}
          </div>
        </div>
      )}
    </>
  )
}

function formatDateLong(dateStr: string) {
  const m = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return dateStr
  const d = new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]))
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
}

function DetailHeader({ title, date, onClose }: { title: string; date: string; onClose: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
      <div>
        <p style={{
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontWeight: 900, fontSize: 18, color: "rgba(255,255,255,0.92)",
        }}>
          {title}
        </p>
        <p style={{
          fontFamily: "var(--font-mono), monospace", fontSize: 9,
          letterSpacing: "0.08em", color: "rgba(122,154,130,0.6)", marginTop: 4,
        }}>
          {formatDateLong(date)}
        </p>
      </div>
      <button onClick={onClose} style={{
        background: "none", border: "none", cursor: "pointer",
        color: "rgba(255,255,255,0.3)", fontSize: 18, padding: 4,
      }}>✕</button>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <p style={{
        fontFamily: "var(--font-mono), monospace", fontSize: 8, fontWeight: 700,
        letterSpacing: "0.1em", color: "rgba(122,154,130,0.45)",
        textTransform: "uppercase", marginBottom: 3,
      }}>
        {label}
      </p>
      <p style={{
        fontFamily: "var(--font-body), sans-serif", fontWeight: 400,
        fontSize: 13, color: "rgba(255,255,255,0.75)",
      }}>
        {value}
      </p>
    </div>
  )
}

function TrainingDetail({ ev, onClose }: { ev: SelectedEvent & { kind: "training" }; onClose: () => void }) {
  const typeLabel = ev.type ? (TRAINING_TYPES.find(t => t.value === ev.type)?.label ?? ev.type) : null
  const color     = ev.type ? (TYPE_COLORS[ev.type] ?? "#7A9A82") : "#7A9A82"

  return (
    <>
      <DetailHeader title="Entraînement" date={ev.dateStr} onClose={onClose} />
      {typeLabel && (
        <div style={{ marginBottom: 16 }}>
          <span style={{
            fontFamily: "var(--font-mono), monospace", fontSize: 8, fontWeight: 700,
            letterSpacing: "0.08em", color,
            backgroundColor: `${color}18`, border: `1px solid ${color}40`,
            padding: "3px 10px", borderRadius: 100,
          }}>
            {typeLabel.toUpperCase()}
          </span>
        </div>
      )}
      {ev.theme    && <DetailRow label="Thème"    value={ev.theme} />}
      {ev.location && <DetailRow label="Lieu"     value={ev.location} />}
      {!ev.theme && !typeLabel && (
        <p style={{
          fontFamily: "var(--font-body), sans-serif", fontWeight: 400,
          fontSize: 13, color: "rgba(255,255,255,0.3)",
        }}>
          Aucun détail renseigné.
        </p>
      )}
    </>
  )
}

function MatchDetail({ ev, onClose }: { ev: SelectedEvent & { kind: "match" }; onClose: () => void }) {
  const hasScore = ev.goals_for !== null && ev.goals_against !== null
  const win      = hasScore && ev.goals_for! > ev.goals_against!
  const draw     = hasScore && ev.goals_for === ev.goals_against
  const resultColor = win ? "#7A9A82" : draw ? "#d4a847" : "#e07070"
  const resultLabel = win ? "VICTOIRE" : draw ? "NUL" : "DÉFAITE"

  return (
    <>
      <DetailHeader title={`vs ${ev.opponent}`} date={ev.dateStr} onClose={onClose} />
      {hasScore && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <span style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontWeight: 900, fontSize: 32, color: "rgba(255,255,255,0.9)",
          }}>
            {ev.goals_for} – {ev.goals_against}
          </span>
          <span style={{
            fontFamily: "var(--font-mono), monospace", fontSize: 8, fontWeight: 700,
            letterSpacing: "0.1em", color: resultColor,
            backgroundColor: `${resultColor}18`, border: `1px solid ${resultColor}40`,
            padding: "3px 10px", borderRadius: 100,
          }}>
            {resultLabel}
          </span>
        </div>
      )}
      <DetailRow label="Lieu" value={ev.home_away === "home" ? "Domicile" : "Extérieur"} />
      {!hasScore && (
        <p style={{
          fontFamily: "var(--font-mono), monospace", fontSize: 9,
          color: "rgba(212,168,71,0.6)", letterSpacing: "0.08em",
        }}>
          Score non encore saisi
        </p>
      )}
    </>
  )
}
