"use client"

import { useState, useTransition } from "react"
import TrainingForm from "@/components/dashboard/TrainingForm"
import { deleteTraining } from "./actions"
import { TRAINING_TYPES } from "@/lib/training-types"
import type { Training } from "./actions"

function formatDate(dateStr: string) {
  const m = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return dateStr
  const d = new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]))
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
}

const TYPE_COLORS: Record<string, string> = {
  tactique:     "#7A9A82",
  technique:    "#6b9ab8",
  physique:     "#d4a847",
  cpa:          "#a87ab8",
  recuperation: "#7ab8a8",
  amical:       "#e07070",
}

function TypeBadge({ type }: { type: string | null }) {
  if (!type) return null
  const label = TRAINING_TYPES.find(t => t.value === type)?.label ?? type
  const color = TYPE_COLORS[type] ?? "#7A9A82"
  return (
    <span style={{
      fontFamily: "var(--font-mono), monospace",
      fontSize: 7, fontWeight: 700, letterSpacing: "0.1em",
      color, backgroundColor: `${color}18`,
      border: `1px solid ${color}40`,
      padding: "2px 8px", borderRadius: 100,
      whiteSpace: "nowrap",
    }}>
      {label.toUpperCase()}
    </span>
  )
}

/* ── Calendrier annuel ──────────────────────────────────── */
const MONTHS = ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Aoû","Sep","Oct","Nov","Déc"]
const DAYS   = ["L","M","M","J","V","S","D"]

function CalendarView({ trainings, year, onEdit }: { trainings: Training[]; year: number; onEdit: (t: Training) => void }) {
  const trainingDates  = new Set(trainings.map(t => t.date.slice(0, 10)))
  const trainingByDate = Object.fromEntries(trainings.map(t => [t.date.slice(0, 10), t]))

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
      {MONTHS.map((monthName, monthIdx) => {
        const firstDay = new Date(year, monthIdx, 1)
        const daysInMonth = new Date(year, monthIdx + 1, 0).getDate()
        // Monday-based offset
        const startOffset = (firstDay.getDay() + 6) % 7

        const cells: (number | null)[] = [
          ...Array(startOffset).fill(null),
          ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
        ]

        return (
          <div key={monthIdx} style={{
            backgroundColor: "#1f1f19",
            border: "1px solid rgba(122,154,130,0.08)",
            borderRadius: 10, padding: "14px 14px",
          }}>
            <p style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 9, fontWeight: 700, letterSpacing: "0.12em",
              color: "#7A9A82", textTransform: "uppercase", marginBottom: 10,
            }}>
              {monthName} {year}
            </p>

            {/* En-têtes jours */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
              {DAYS.map((d, i) => (
                <div key={i} style={{
                  textAlign: "center",
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 7, color: "rgba(255,255,255,0.2)", letterSpacing: "0.06em",
                }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Cases */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
              {cells.map((day, i) => {
                if (!day) return <div key={i} />
                const dateStr = `${year}-${String(monthIdx + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                const hasTraining = trainingDates.has(dateStr)
                const training = trainingByDate[dateStr]
                const color = training?.type ? (TYPE_COLORS[training.type] ?? "#7A9A82") : "#7A9A82"

                return (
                  <div
                    key={i}
                    onClick={() => training && onEdit(training)}
                    title={hasTraining ? (training?.theme ?? training?.type ?? "Séance") : undefined}
                    style={{
                      aspectRatio: "1",
                      borderRadius: 4,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: 9,
                      backgroundColor: hasTraining ? `${color}25` : "transparent",
                      color: hasTraining ? color : "rgba(255,255,255,0.3)",
                      border: hasTraining ? `1px solid ${color}50` : "1px solid transparent",
                      cursor: hasTraining ? "pointer" : "default",
                      fontWeight: hasTraining ? 700 : 300,
                      transition: "opacity 0.15s",
                    }}
                  >
                    {day}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ── Page principale ────────────────────────────────────── */
interface Props { trainings: Training[] }

export default function EntraineementsClient({ trainings }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing]   = useState<Training | undefined>(undefined)
  const [deleting, startDelete] = useTransition()
  const [view, setView]         = useState<"list" | "calendar">("list")
  const [calYear, setCalYear]   = useState(new Date().getFullYear())

  function openAdd()             { setEditing(undefined); setShowForm(true) }
  function openEdit(t: Training) { setEditing(t); setShowForm(true) }
  function handleDelete(id: string) {
    if (!confirm("Supprimer cette séance ?")) return
    startDelete(async () => { await deleteTraining(id) })
  }

  return (
    <>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <p style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
            color: "rgba(122,154,130,0.5)", textTransform: "uppercase", marginBottom: 6,
          }}>
            Mon Club
          </p>
          <h1 style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontWeight: 900, fontSize: 26, color: "rgba(255,255,255,0.95)",
          }}>
            Entraînements
          </h1>
          <p style={{
            fontFamily: "var(--font-body), sans-serif",
            fontWeight: 300, fontSize: 13,
            color: "rgba(255,255,255,0.3)", marginTop: 4,
          }}>
            {trainings.length} séance{trainings.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {/* Toggle vue */}
          <div style={{
            display: "flex", borderRadius: 8,
            border: "1px solid rgba(122,154,130,0.15)", overflow: "hidden",
          }}>
            {(["list", "calendar"] as const).map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: "8px 14px", cursor: "pointer", border: "none",
                fontFamily: "var(--font-mono), monospace",
                fontSize: 8, fontWeight: 700, letterSpacing: "0.08em",
                backgroundColor: view === v ? "rgba(122,154,130,0.15)" : "transparent",
                color: view === v ? "#7A9A82" : "rgba(255,255,255,0.25)",
              }}>
                {v === "list" ? "LISTE" : "CALENDRIER"}
              </button>
            ))}
          </div>

          <button onClick={openAdd} style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
            padding: "10px 20px", borderRadius: 10, cursor: "pointer",
            backgroundColor: "#7A9A82", color: "#181812", border: "none",
          }}>
            + AJOUTER
          </button>
        </div>
      </div>

      {/* Vide */}
      {trainings.length === 0 && (
        <div style={{
          padding: "48px 32px", borderRadius: 12, textAlign: "center",
          backgroundColor: "#1f1f19", border: "1px dashed rgba(122,154,130,0.2)",
        }}>
          <p style={{ fontFamily: "var(--font-body), sans-serif", fontWeight: 300, fontSize: 14, color: "rgba(255,255,255,0.3)", marginBottom: 8 }}>
            Aucune séance enregistrée.
          </p>
          <p style={{ fontFamily: "var(--font-mono), monospace", fontSize: 9, letterSpacing: "0.08em", color: "rgba(122,154,130,0.35)" }}>
            Utilise le bouton AJOUTER pour créer ta première séance.
          </p>
        </div>
      )}

      {/* Vue calendrier */}
      {view === "calendar" && trainings.length > 0 && (
        <div>
          {/* Nav année */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <button onClick={() => setCalYear(y => y - 1)} style={{
              background: "none", border: "1px solid rgba(122,154,130,0.15)",
              borderRadius: 6, padding: "4px 10px", cursor: "pointer",
              color: "rgba(255,255,255,0.4)", fontSize: 14,
            }}>‹</button>
            <span style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontWeight: 900, fontSize: 20, color: "rgba(255,255,255,0.85)",
            }}>
              {calYear}
            </span>
            <button onClick={() => setCalYear(y => y + 1)} style={{
              background: "none", border: "1px solid rgba(122,154,130,0.15)",
              borderRadius: 6, padding: "4px 10px", cursor: "pointer",
              color: "rgba(255,255,255,0.4)", fontSize: 14,
            }}>›</button>
          </div>
          <CalendarView trainings={trainings} year={calYear} onEdit={openEdit} />
        </div>
      )}

      {/* Vue liste */}
      {view === "list" && trainings.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {trainings.map(t => (
            <div key={t.id} style={{
              padding: "18px 20px", borderRadius: 12,
              backgroundColor: "#1f1f19",
              border: "1px solid rgba(122,154,130,0.08)",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <p style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: 9, letterSpacing: "0.08em",
                      color: "rgba(122,154,130,0.5)", textTransform: "uppercase",
                    }}>
                      {formatDate(t.date)}
                    </p>
                    <TypeBadge type={t.type} />
                  </div>
                  <p style={{
                    fontFamily: "var(--font-body), sans-serif",
                    fontWeight: 500, fontSize: 14,
                    color: t.theme ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)",
                  }}>
                    {t.theme ?? (t.type ? TRAINING_TYPES.find(x => x.value === t.type)?.label : "Séance sans thème")}
                  </p>
                  {t.location && (
                    <p style={{
                      fontFamily: "var(--font-body), sans-serif",
                      fontWeight: 300, fontSize: 12,
                      color: "rgba(255,255,255,0.3)", marginTop: 4,
                    }}>
                      {t.location}
                    </p>
                  )}
                  {t.notes && (
                    <p style={{
                      fontFamily: "var(--font-body), sans-serif",
                      fontWeight: 300, fontSize: 12, lineHeight: 1.5,
                      color: "rgba(255,255,255,0.25)", marginTop: 6,
                      borderLeft: "2px solid rgba(122,154,130,0.15)",
                      paddingLeft: 10,
                    }}>
                      {t.notes}
                    </p>
                  )}
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0, marginLeft: 16 }}>
                  <button onClick={() => openEdit(t)} style={{
                    fontFamily: "var(--font-mono), monospace", fontSize: 8, letterSpacing: "0.06em",
                    padding: "5px 10px", borderRadius: 6, cursor: "pointer",
                    backgroundColor: "transparent",
                    border: "1px solid rgba(122,154,130,0.2)",
                    color: "rgba(122,154,130,0.5)",
                  }}>ÉDITER</button>
                  <button onClick={() => handleDelete(t.id)} disabled={deleting} style={{
                    fontFamily: "var(--font-mono), monospace", fontSize: 8,
                    padding: "5px 8px", borderRadius: 6, cursor: "pointer",
                    backgroundColor: "transparent",
                    border: "1px solid rgba(224,112,112,0.15)",
                    color: "rgba(224,112,112,0.4)",
                  }}>✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <TrainingForm training={editing} onClose={() => setShowForm(false)} />
      )}
    </>
  )
}
