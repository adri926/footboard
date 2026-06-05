"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import MatchForm from "@/components/dashboard/MatchForm"
import { deleteMatch } from "./actions"
import type { Match } from "./actions"

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00")
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
}

interface Props { matches: Match[] }

export default function MatchsClient({ matches }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing]   = useState<Match | undefined>(undefined)
  const [deleting, startDelete] = useTransition()

  const today    = new Date().toISOString().slice(0, 10)
  const upcoming = matches.filter(m => m.date >= today && m.goals_for === null)
    .sort((a, b) => a.date.localeCompare(b.date))
  const played   = matches.filter(m => m.date < today || m.goals_for !== null)
    .sort((a, b) => b.date.localeCompare(a.date))

  function openAdd()      { setEditing(undefined); setShowForm(true) }
  function openEdit(m: Match) { setEditing(m); setShowForm(true) }
  function handleDelete(id: string) {
    if (!confirm("Supprimer ce match ?")) return
    startDelete(async () => { await deleteMatch(id) })
  }

  return (
    <>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28 }}>
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
            Matchs
          </h1>
        </div>
        <button onClick={openAdd} style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
          padding: "10px 20px", borderRadius: 10, cursor: "pointer",
          backgroundColor: "#7A9A82", color: "#181812", border: "none",
        }}>
          + AJOUTER UN MATCH
        </button>
      </div>

      {/* Vide */}
      {matches.length === 0 && (
        <div style={{
          padding: "48px 32px", borderRadius: 12, textAlign: "center",
          backgroundColor: "#1f1f19", border: "1px dashed rgba(122,154,130,0.2)",
        }}>
          <p style={{
            fontFamily: "var(--font-body), sans-serif", fontWeight: 300, fontSize: 14,
            color: "rgba(255,255,255,0.3)", marginBottom: 8,
          }}>
            Aucun match pour l'instant.
          </p>
          <p style={{
            fontFamily: "var(--font-mono), monospace", fontSize: 9, letterSpacing: "0.08em",
            color: "rgba(122,154,130,0.35)",
          }}>
            Utilise le bouton en haut à droite pour planifier ton premier match.
          </p>
        </div>
      )}

      {/* À venir */}
      {upcoming.length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <p style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
            color: "#7A9A82", textTransform: "uppercase", marginBottom: 12,
          }}>
            À venir
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {upcoming.map(m => (
              <div key={m.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px 20px", borderRadius: 10,
                backgroundColor: "rgba(122,154,130,0.06)",
                border: "1px solid rgba(122,154,130,0.18)",
                gap: 12,
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontFamily: "var(--font-body), sans-serif",
                    fontWeight: 500, fontSize: 15, color: "rgba(255,255,255,0.85)",
                  }}>
                    vs {m.opponent}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 9, letterSpacing: "0.06em",
                    color: "rgba(255,255,255,0.3)", marginTop: 4,
                  }}>
                    {formatDate(m.date)} · {m.home_away === "home" ? "DOMICILE" : "EXTÉRIEUR"}
                    {m.competition && ` · ${m.competition}`}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button onClick={() => openEdit(m)} style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 8, letterSpacing: "0.06em",
                    padding: "5px 10px", borderRadius: 6, cursor: "pointer",
                    backgroundColor: "transparent",
                    border: "1px solid rgba(122,154,130,0.2)",
                    color: "rgba(122,154,130,0.5)",
                  }}>
                    SAISIR SCORE
                  </button>
                  <Link href="/dashboard/matchs/preparation" style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
                    color: "#7A9A82",
                    backgroundColor: "rgba(122,154,130,0.1)",
                    border: "1px solid rgba(122,154,130,0.25)",
                    padding: "6px 14px", borderRadius: 8, whiteSpace: "nowrap",
                  }}>
                    PRÉPARER →
                  </Link>
                  <button onClick={() => handleDelete(m.id)} disabled={deleting} style={{
                    fontFamily: "var(--font-mono), monospace", fontSize: 8,
                    padding: "5px 8px", borderRadius: 6, cursor: "pointer",
                    backgroundColor: "transparent",
                    border: "1px solid rgba(224,112,112,0.15)",
                    color: "rgba(224,112,112,0.4)",
                  }}>✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Résultats */}
      {played.length > 0 && (
        <div>
          <p style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
            color: "rgba(122,154,130,0.5)", textTransform: "uppercase", marginBottom: 12,
          }}>
            Résultats
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {played.map(m => {
              const hasScore = m.goals_for !== null && m.goals_against !== null
              const win  = hasScore && m.goals_for! > m.goals_against!
              const draw = hasScore && m.goals_for === m.goals_against
              const resultColor = win ? "#7A9A82" : draw ? "#d4a847" : "#e07070"
              const resultLabel = win ? "VICTOIRE" : draw ? "NUL" : "DÉFAITE"

              return (
                <div key={m.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 20px", borderRadius: 10,
                  backgroundColor: "#1f1f19",
                  border: "1px solid rgba(122,154,130,0.08)",
                  gap: 12,
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontFamily: "var(--font-body), sans-serif",
                      fontWeight: 500, fontSize: 14, color: "rgba(255,255,255,0.75)",
                    }}>
                      vs {m.opponent}
                    </p>
                    <p style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: 9, letterSpacing: "0.06em",
                      color: "rgba(255,255,255,0.25)", marginTop: 3,
                    }}>
                      {formatDate(m.date)} · {m.home_away === "home" ? "DOM" : "EXT"}
                      {m.competition && ` · ${m.competition}`}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {hasScore ? (
                      <>
                        <span style={{
                          fontFamily: "var(--font-display), system-ui, sans-serif",
                          fontWeight: 900, fontSize: 22, color: "rgba(255,255,255,0.85)",
                        }}>
                          {m.goals_for} – {m.goals_against}
                        </span>
                        <span style={{
                          fontFamily: "var(--font-mono), monospace",
                          fontSize: 7, fontWeight: 700, letterSpacing: "0.1em",
                          color: resultColor,
                          backgroundColor: `${resultColor}18`,
                          border: `1px solid ${resultColor}40`,
                          padding: "3px 10px", borderRadius: 100,
                        }}>
                          {resultLabel}
                        </span>
                      </>
                    ) : (
                      <button onClick={() => openEdit(m)} style={{
                        fontFamily: "var(--font-mono), monospace",
                        fontSize: 8, letterSpacing: "0.06em",
                        padding: "5px 10px", borderRadius: 6, cursor: "pointer",
                        backgroundColor: "transparent",
                        border: "1px solid rgba(122,154,130,0.2)",
                        color: "rgba(122,154,130,0.5)",
                      }}>
                        SAISIR SCORE
                      </button>
                    )}
                    <button onClick={() => openEdit(m)} style={{
                      fontFamily: "var(--font-mono), monospace", fontSize: 8,
                      padding: "5px 10px", borderRadius: 6, cursor: "pointer",
                      backgroundColor: "transparent",
                      border: "1px solid rgba(122,154,130,0.15)",
                      color: "rgba(122,154,130,0.4)",
                    }}>ÉDITER</button>
                    <button onClick={() => handleDelete(m.id)} disabled={deleting} style={{
                      fontFamily: "var(--font-mono), monospace", fontSize: 8,
                      padding: "5px 8px", borderRadius: 6, cursor: "pointer",
                      backgroundColor: "transparent",
                      border: "1px solid rgba(224,112,112,0.15)",
                      color: "rgba(224,112,112,0.4)",
                    }}>✕</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {showForm && (
        <MatchForm match={editing} onClose={() => setShowForm(false)} />
      )}
    </>
  )
}
