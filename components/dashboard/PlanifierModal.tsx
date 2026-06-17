"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createTraining } from "@/app/dashboard/entrainements/actions"
import { deleteSession } from "@/app/dashboard/entrainements/nouvelle-seance/actions"
import { TRAINING_TYPES } from "@/lib/training-types"

interface SavedSession {
  id: string
  name: string
  session_type: string
  total_duration: number
  date: string
}

interface Props {
  savedSessions: SavedSession[]
  onClose: () => void
}

const SESSION_TYPE_LABELS: Record<string, string> = {
  "j+4": "J+4 Pré-match",
  "j+2": "J+2 Récupération",
  "libre": "Libre",
}

export default function PlanifierModal({ savedSessions, onClose }: Props) {
  const today = new Date().toISOString().slice(0, 10)
  const [mode, setMode]           = useState<"simple" | "modele">("simple")
  const [date, setDate]           = useState(today)
  const [type, setType]           = useState("")
  const [location, setLocation]   = useState("")
  const [notes, setNotes]         = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [errMsg, setErrMsg]       = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isDeleting, startDelete] = useTransition()
  const router = useRouter()

  function handleDeleteSession(id: string) {
    if (!confirm("Supprimer ce modèle de séance ?")) return
    startDelete(async () => {
      await deleteSession(id)
      if (selectedId === id) setSelectedId(null)
      router.refresh()
    })
  }

  function handleSimple() {
    setErrMsg(null)
    if (!date) { setErrMsg("Sélectionne une date."); return }
    startTransition(async () => {
      const res = await createTraining({ date, type: type || null, location: location || null, notes: notes || null })
      if (res.ok) { onClose(); router.refresh() }
      else setErrMsg(res.error)
    })
  }

  function handleModele() {
    setErrMsg(null)
    if (!selectedId) { setErrMsg("Sélectionne un modèle de séance."); return }
    if (!date) { setErrMsg("Sélectionne une date."); return }
    onClose()
    router.push(`/dashboard/entrainements/nouvelle-seance?from=${selectedId}`)
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      backgroundColor: "rgba(0,0,0,0.65)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid rgba(122,154,130,0.18)",
        borderRadius: 16, width: "100%", maxWidth: 480,
        boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px 0",
        }}>
          <div>
            <p style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 8, fontWeight: 700, letterSpacing: "0.14em",
              color: "rgba(122,154,130,0.5)", marginBottom: 4,
            }}>ENTRAÎNEMENTS</p>
            <h2 style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontWeight: 900, fontSize: 20,
              color: "rgba(255,255,255,0.92)",
            }}>PLANIFIER UNE SÉANCE</h2>
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 6, color: "rgba(255,255,255,0.3)",
            width: 28, height: 28, cursor: "pointer", fontSize: 13,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, padding: "16px 24px 0" }}>
          {([
            { key: "simple",  label: "Séance rapide" },
            { key: "modele",  label: "À partir d'un modèle" },
          ] as const).map(t => (
            <button key={t.key} onClick={() => { setMode(t.key); setErrMsg(null) }} style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
              padding: "8px 16px", cursor: "pointer",
              backgroundColor: "transparent", border: "none",
              borderBottom: `2px solid ${mode === t.key ? "#7A9A82" : "rgba(122,154,130,0.12)"}`,
              color: mode === t.key ? "#7A9A82" : "rgba(255,255,255,0.30)",
              transition: "all 0.15s",
            }}>
              {t.label.toUpperCase()}
            </button>
          ))}
        </div>

        <div style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Date (commun aux deux modes) */}
          <div>
            <label style={labelStyle}>DATE DE LA SÉANCE</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
          </div>

          {mode === "simple" && (
            <>
              <div>
                <label style={labelStyle}>TYPE (OPTIONNEL)</label>
                <select value={type} onChange={e => setType(e.target.value)} style={inputStyle}>
                  <option value="">— Choisir —</option>
                  {TRAINING_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>LIEU (OPTIONNEL)</label>
                <input
                  type="text"
                  placeholder="Ex: Stade municipal, Gymnase…"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>NOTES (OPTIONNEL)</label>
                <textarea
                  placeholder="Informations complémentaires…"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  style={{ ...inputStyle, resize: "none" }}
                />
              </div>
            </>
          )}

          {mode === "modele" && (
            <div>
              <label style={labelStyle}>CHOISIR UN MODÈLE</label>
              {savedSessions.length === 0 ? (
                <div style={{
                  padding: "20px 16px", borderRadius: 8, textAlign: "center",
                  border: "1px dashed rgba(122,154,130,0.15)",
                }}>
                  <p style={{ fontFamily: "var(--font-body), sans-serif", fontSize: 13, color: "rgba(255,255,255,0.30)" }}>
                    Aucune séance sauvegardée.
                  </p>
                  <p style={{ fontFamily: "var(--font-mono), monospace", fontSize: 9, color: "rgba(122,154,130,0.35)", marginTop: 6 }}>
                    Crée d'abord une séance via "CRÉER UNE SÉANCE".
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 220, overflowY: "auto" }}>
                  {savedSessions.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedId(s.id)}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "10px 14px", borderRadius: 8, cursor: "pointer", textAlign: "left",
                        backgroundColor: selectedId === s.id ? "rgba(122,154,130,0.12)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${selectedId === s.id ? "rgba(122,154,130,0.40)" : "rgba(255,255,255,0.06)"}`,
                        transition: "all 0.15s",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <p style={{
                          fontFamily: "var(--font-body), sans-serif",
                          fontWeight: 500, fontSize: 13,
                          color: "rgba(255,255,255,0.85)", margin: 0,
                        }}>
                          {s.name}
                        </p>
                        <p style={{
                          fontFamily: "var(--font-mono), monospace",
                          fontSize: 8, color: "rgba(255,255,255,0.30)", marginTop: 2,
                        }}>
                          {SESSION_TYPE_LABELS[s.session_type] ?? s.session_type} · {s.total_duration} min
                        </p>
                      </div>
                      <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                        {selectedId === s.id && (
                          <span style={{ color: "#7A9A82", fontSize: 14 }}>✓</span>
                        )}
                        <button
                          onClick={e => { e.stopPropagation(); handleDeleteSession(s.id) }}
                          disabled={isDeleting}
                          style={{
                            background: "none", border: "none", cursor: "pointer",
                            color: "rgba(224,112,112,0.4)", fontSize: 12, padding: "2px 4px",
                            lineHeight: 1,
                          }}
                        >✕</button>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {errMsg && (
            <p style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 8, letterSpacing: "0.06em", color: "#e07070",
            }}>{errMsg}</p>
          )}

          <button
            onClick={mode === "simple" ? handleSimple : handleModele}
            disabled={isPending || (mode === "modele" && savedSessions.length === 0)}
            style={{
              width: "100%",
              fontFamily: "var(--font-mono), monospace",
              fontWeight: 700, fontSize: 10, letterSpacing: "0.08em",
              padding: "13px 16px", borderRadius: 10,
              backgroundColor: "#7A9A82", color: "var(--bg)",
              border: "none", cursor: "pointer",
              opacity: isPending ? 0.6 : 1,
              marginTop: 4,
            }}
          >
            {isPending ? "ENREGISTREMENT…" :
              mode === "simple" ? "PLANIFIER CETTE SÉANCE" : "OUVRIR LE MODÈLE →"}
          </button>
        </div>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-mono), monospace",
  fontSize: 8, fontWeight: 700, letterSpacing: "0.10em",
  color: "rgba(255,255,255,0.30)", marginBottom: 6,
}

const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  backgroundColor: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(122,154,130,0.15)",
  borderRadius: 8, padding: "9px 12px",
  fontFamily: "var(--font-body), sans-serif",
  fontSize: 13, color: "rgba(255,255,255,0.80)",
  outline: "none",
}
