"use client"

import { useState, useTransition } from "react"
import { createTraining, updateTraining } from "@/app/dashboard/entrainements/actions"
import { TRAINING_TYPES } from "@/lib/training-types"
import type { Training } from "@/app/dashboard/entrainements/actions"

interface Props {
  training?: Training
  onClose:   () => void
}

const INPUT: React.CSSProperties = {
  fontFamily: "var(--font-body), sans-serif",
  fontWeight: 400, fontSize: 13,
  backgroundColor: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(122,154,130,0.15)",
  borderRadius: 8, padding: "9px 12px",
  color: "rgba(255,255,255,0.85)",
  width: "100%", outline: "none",
}

const LABEL: React.CSSProperties = {
  fontFamily: "var(--font-mono), monospace",
  fontSize: 8, fontWeight: 700, letterSpacing: "0.1em",
  color: "rgba(122,154,130,0.5)", textTransform: "uppercase",
  marginBottom: 6, display: "block",
}

export default function TrainingForm({ training, onClose }: Props) {
  const [pending, startTransition] = useTransition()
  const [error, setError]         = useState<string | null>(null)

  const [form, setForm] = useState({
    date:     training?.date?.slice(0,10) ?? (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}` })(),
    type:     training?.type     ?? "",
    theme:    training?.theme    ?? "",
    location: training?.location ?? "",
    notes:    training?.notes    ?? "",
  })

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const data = {
      date:     form.date,
      type:     form.type     || null,
      theme:    form.theme    || null,
      location: form.location || null,
      notes:    form.notes    || null,
    }

    startTransition(async () => {
      const res = training
        ? await updateTraining(training.id, data)
        : await createTraining(data)

      if (res.ok) onClose()
      else setError(res.error)
    })
  }

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      }}
    >
      <div style={{
        backgroundColor: "#1f1f19",
        border: "1px solid rgba(122,154,130,0.18)",
        borderRadius: 16, padding: "28px 28px",
        width: "100%", maxWidth: 420,
        boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <p style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontWeight: 900, fontSize: 18, color: "rgba(255,255,255,0.92)",
          }}>
            {training ? "Modifier la séance" : "Ajouter une séance"}
          </p>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(255,255,255,0.3)", fontSize: 18,
          }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Date */}
          <div>
            <label style={LABEL}>Date</label>
            <input
              type="date" value={form.date}
              onChange={e => set("date", e.target.value)}
              required style={INPUT}
            />
          </div>

          {/* Type */}
          <div>
            <label style={LABEL}>Type de séance</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {TRAINING_TYPES.map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => set("type", form.type === t.value ? "" : t.value)}
                  style={{
                    padding: "6px 12px", borderRadius: 8, cursor: "pointer",
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 8, fontWeight: 700, letterSpacing: "0.08em",
                    color: form.type === t.value ? "#7A9A82" : "rgba(255,255,255,0.3)",
                    backgroundColor: form.type === t.value ? "rgba(122,154,130,0.12)" : "transparent",
                    border: `1px solid ${form.type === t.value ? "rgba(122,154,130,0.4)" : "rgba(122,154,130,0.1)"}`,
                    transition: "all 0.15s",
                  }}
                >
                  {t.label.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Thème libre */}
          <div>
            <label style={LABEL}>Thème spécifique (optionnel)</label>
            <input
              value={form.theme}
              onChange={e => set("theme", e.target.value)}
              placeholder="Ex: Pressing haut — triggers et couvertures"
              style={INPUT} maxLength={200}
            />
          </div>

          {/* Lieu */}
          <div>
            <label style={LABEL}>Lieu (optionnel)</label>
            <input
              value={form.location}
              onChange={e => set("location", e.target.value)}
              placeholder="Ex: Stade Poincaré"
              style={INPUT} maxLength={200}
            />
          </div>

          {/* Notes */}
          <div>
            <label style={LABEL}>Notes (optionnel)</label>
            <textarea
              value={form.notes}
              onChange={e => set("notes", e.target.value)}
              placeholder="Observations, points à retenir..."
              rows={3}
              style={{ ...INPUT, resize: "vertical", lineHeight: 1.5 }}
              maxLength={1000}
            />
          </div>

          {error && (
            <p style={{
              fontFamily: "var(--font-body), sans-serif", fontSize: 12, color: "#e07070",
              backgroundColor: "rgba(224,112,112,0.08)",
              border: "1px solid rgba(224,112,112,0.2)",
              borderRadius: 6, padding: "8px 12px",
            }}>
              {error}
            </p>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <button type="button" onClick={onClose} style={{
              flex: 1, padding: "11px 0", borderRadius: 10, cursor: "pointer",
              fontFamily: "var(--font-mono), monospace",
              fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
              backgroundColor: "transparent",
              border: "1px solid rgba(122,154,130,0.15)",
              color: "rgba(255,255,255,0.3)",
            }}>
              ANNULER
            </button>
            <button type="submit" disabled={pending} style={{
              flex: 2, padding: "11px 0", borderRadius: 10,
              cursor: pending ? "default" : "pointer",
              fontFamily: "var(--font-mono), monospace",
              fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
              backgroundColor: pending ? "rgba(122,154,130,0.4)" : "#7A9A82",
              border: "none", color: "#181812",
            }}>
              {pending ? "..." : training ? "ENREGISTRER" : "AJOUTER"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
