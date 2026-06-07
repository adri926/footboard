"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import MatchForm from "@/components/dashboard/MatchForm"
import PageHeader from "@/components/dashboard/PageHeader"
import { deleteMatch } from "./actions"
import { sendConvocations } from "./convocations"
import type { Match } from "./actions"
import type { ConvocablePlayer } from "./convocations"

function parseDate(dateStr: string): Date | null {
  const m = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return null
  return new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]))
}
function formatDate(dateStr: string) {
  const d = parseDate(dateStr)
  if (!d) return dateStr
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
}
function dateKey(dateStr: string): string {
  const m = dateStr.match(/(\d{4}-\d{2}-\d{2})/)
  return m ? m[1] : dateStr
}

const POSITION_ORDER: Record<string, number> = { GK: 0, DEF: 1, MIL: 2, ATT: 3 }

function ConvocationModal({
  match, players, onClose,
}: { match: Match; players: ConvocablePlayer[]; onClose: () => void }) {
  const sorted = [...players].sort(
    (a, b) => (POSITION_ORDER[a.position] ?? 9) - (POSITION_ORDER[b.position] ?? 9)
  )
  const [selected, setSelected]   = useState<Set<string>>(
    new Set(players.filter(p => p.status === "available" && p.email).map(p => p.id))
  )
  const [sending, startSend]      = useTransition()
  const [result, setResult]       = useState<{ sent: number } | null>(null)
  const [error, setError]         = useState<string | null>(null)

  function toggle(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function handleSend() {
    setError(null)
    startSend(async () => {
      const res = await sendConvocations(match.id, [...selected])
      if (res.ok) setResult({ sent: res.sent })
      else setError(res.error)
    })
  }

  const canSend = selected.size > 0 && !sending && !result

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      }}
    >
      <div style={{
        backgroundColor: "#1f1f19",
        border: "1px solid rgba(122,154,130,0.18)",
        borderRadius: 16, padding: "28px 28px",
        width: "100%", maxWidth: 480,
        boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
        maxHeight: "85vh", display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
          <div>
            <p style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontWeight: 900, fontSize: 18, color: "rgba(255,255,255,0.92)",
            }}>
              Convoquer
            </p>
            <p style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 9, letterSpacing: "0.08em",
              color: "rgba(122,154,130,0.6)", marginTop: 4,
            }}>
              vs {match.opponent} · {formatDate(match.date)}
            </p>
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(255,255,255,0.3)", fontSize: 18, padding: 4,
          }}>✕</button>
        </div>

        {result ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: "24px 0" }}>
            <p style={{ fontSize: 32 }}>✓</p>
            <p style={{
              fontFamily: "var(--font-body), sans-serif", fontWeight: 500,
              fontSize: 15, color: "rgba(255,255,255,0.85)", textAlign: "center",
            }}>
              {result.sent} convocation{result.sent > 1 ? "s" : ""} envoyée{result.sent > 1 ? "s" : ""}
            </p>
            <button onClick={onClose} style={{
              marginTop: 8, padding: "10px 24px", borderRadius: 10, cursor: "pointer",
              fontFamily: "var(--font-mono), monospace", fontSize: 10, fontWeight: 700,
              backgroundColor: "#7A9A82", color: "#181812", border: "none",
            }}>
              FERMER
            </button>
          </div>
        ) : (
          <>
            {/* Liste joueurs */}
            <div style={{ flex: 1, overflowY: "auto", margin: "16px 0", display: "flex", flexDirection: "column", gap: 4 }}>
              {sorted.length === 0 ? (
                <p style={{
                  fontFamily: "var(--font-body), sans-serif", fontWeight: 300,
                  fontSize: 13, color: "rgba(255,255,255,0.3)", textAlign: "center", padding: "24px 0",
                }}>
                  Aucun joueur dans l'effectif.
                </p>
              ) : sorted.map(p => {
                const hasEmail  = Boolean(p.email)
                const isChecked = selected.has(p.id)
                return (
                  <div
                    key={p.id}
                    onClick={() => hasEmail && toggle(p.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "10px 12px", borderRadius: 8, cursor: hasEmail ? "pointer" : "default",
                      backgroundColor: isChecked ? "rgba(122,154,130,0.08)" : "transparent",
                      border: `1px solid ${isChecked ? "rgba(122,154,130,0.2)" : "transparent"}`,
                      opacity: hasEmail ? 1 : 0.38,
                      transition: "all 0.12s",
                    }}
                  >
                    <div style={{
                      width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                      backgroundColor: isChecked ? "#7A9A82" : "transparent",
                      border: `1.5px solid ${isChecked ? "#7A9A82" : "rgba(122,154,130,0.3)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {isChecked && <span style={{ color: "#181812", fontSize: 10, fontWeight: 900 }}>✓</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontFamily: "var(--font-body), sans-serif",
                        fontWeight: 500, fontSize: 13, color: "rgba(255,255,255,0.82)",
                      }}>
                        {p.first_name} {p.last_name}
                        <span style={{
                          fontFamily: "var(--font-mono), monospace", fontSize: 9,
                          color: "rgba(255,255,255,0.25)", marginLeft: 6,
                        }}>
                          {p.number ? `#${p.number} · ` : ""}{p.position}
                        </span>
                      </p>
                      {!hasEmail && (
                        <p style={{
                          fontFamily: "var(--font-mono), monospace", fontSize: 8,
                          color: "rgba(224,112,112,0.5)", marginTop: 2,
                        }}>
                          Pas d'email renseigné
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {error && (
              <p style={{
                fontFamily: "var(--font-body), sans-serif", fontSize: 12, color: "#e07070",
                backgroundColor: "rgba(224,112,112,0.08)",
                border: "1px solid rgba(224,112,112,0.2)",
                borderRadius: 6, padding: "8px 12px", marginBottom: 12,
              }}>
                {error}
              </p>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" onClick={onClose} style={{
                flex: 1, padding: "11px 0", borderRadius: 10, cursor: "pointer",
                fontFamily: "var(--font-mono), monospace", fontSize: 10, fontWeight: 700,
                backgroundColor: "transparent", border: "1px solid rgba(122,154,130,0.15)",
                color: "rgba(255,255,255,0.3)",
              }}>
                ANNULER
              </button>
              <button
                onClick={handleSend}
                disabled={!canSend}
                style={{
                  flex: 2, padding: "11px 0", borderRadius: 10,
                  cursor: canSend ? "pointer" : "default",
                  fontFamily: "var(--font-mono), monospace", fontSize: 10, fontWeight: 700,
                  backgroundColor: canSend ? "#7A9A82" : "rgba(122,154,130,0.2)",
                  border: "none", color: canSend ? "#181812" : "rgba(255,255,255,0.2)",
                  transition: "all 0.15s",
                }}
              >
                {sending ? "ENVOI..." : `ENVOYER (${selected.size})`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

interface Props { matches: Match[]; players: ConvocablePlayer[] }

export default function MatchsClient({ matches, players }: Props) {
  const [showForm, setShowForm]         = useState(false)
  const [editing, setEditing]           = useState<Match | undefined>(undefined)
  const [convokingMatch, setConvoking]  = useState<Match | null>(null)
  const [deleting, startDelete]         = useTransition()

  const _d       = new Date()
  const today    = `${_d.getFullYear()}-${String(_d.getMonth()+1).padStart(2,"0")}-${String(_d.getDate()).padStart(2,"0")}`
  const upcoming = matches.filter(m => dateKey(m.date) >= today && m.goals_for === null)
    .sort((a, b) => dateKey(a.date).localeCompare(dateKey(b.date)))
  const played   = matches.filter(m => dateKey(m.date) < today || m.goals_for !== null)
    .sort((a, b) => dateKey(b.date).localeCompare(dateKey(a.date)))

  function openAdd()      { setEditing(undefined); setShowForm(true) }
  function openEdit(m: Match) { setEditing(m); setShowForm(true) }
  function handleDelete(id: string) {
    if (!confirm("Supprimer ce match ?")) return
    startDelete(async () => { await deleteMatch(id) })
  }

  return (
    <>
      <PageHeader
        label="Mon Club"
        title="Matchs"
        action={
          <button onClick={openAdd} style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
            padding: "10px 20px", borderRadius: 10, cursor: "pointer",
            backgroundColor: "#7A9A82", color: "#181812", border: "none",
          }}>
            + AJOUTER UN MATCH
          </button>
        }
      />

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
                  <button onClick={() => setConvoking(m)} style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 8, fontWeight: 700, letterSpacing: "0.06em",
                    padding: "5px 10px", borderRadius: 6, cursor: "pointer",
                    backgroundColor: "rgba(122,154,130,0.1)",
                    border: "1px solid rgba(122,154,130,0.25)",
                    color: "#7A9A82",
                  }}>
                    CONVOQUER
                  </button>
                  <button onClick={() => openEdit(m)} style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 8, letterSpacing: "0.06em",
                    padding: "5px 10px", borderRadius: 6, cursor: "pointer",
                    backgroundColor: "transparent",
                    border: "1px solid rgba(122,154,130,0.2)",
                    color: "rgba(122,154,130,0.5)",
                  }}>
                    SCORE
                  </button>
                  <Link href={`/dashboard/matchs/${m.id}/preparation`} style={{
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

      {convokingMatch && (
        <ConvocationModal
          match={convokingMatch}
          players={players}
          onClose={() => setConvoking(null)}
        />
      )}
    </>
  )
}
