"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { saveMatchStats } from "@/app/dashboard/matchs/actions"
import { getSuggestedMatchStats } from "@/app/tactique/analyse-video/actions"
import type { SuggestedStatRow } from "@/app/tactique/analyse-video/actions"
import type { Match, Lineup, MatchPlayerStat } from "@/app/dashboard/matchs/actions"
import type { Player } from "@/app/dashboard/effectif/actions"

interface Props {
  match:        Match
  players:      Player[]
  lineup:       Lineup
  initialStats: MatchPlayerStat[]
  linkedAnalysisId: string | null
}

interface Row {
  goals:         number
  assists:       number
  yellowCards:   number
  redCards:      number
  minutesPlayed: number
}

const EMPTY_ROW: Row = { goals: 0, assists: 0, yellowCards: 0, redCards: 0, minutesPlayed: 0 }

const FIELDS: { key: keyof Row; label: string; max: number }[] = [
  { key: "goals",         label: "Buts",     max: 20 },
  { key: "assists",       label: "Passes D", max: 20 },
  { key: "yellowCards",   label: "Jaunes",   max: 2  },
  { key: "redCards",      label: "Rouges",   max: 1  },
  { key: "minutesPlayed", label: "Minutes",  max: 120 },
]

function parseDate(s: string) {
  const m = s.match(/(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return null
  return new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]))
}

function formatDate(s: string) {
  const d = parseDate(s)
  if (!d) return s
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
}

export default function BilanClient({ match, players, lineup, initialStats, linkedAnalysisId }: Props) {
  const participantIds = [...lineup.starters, ...lineup.substitutes]
  const participants = participantIds
    .map(id => players.find(p => p.id === id))
    .filter((p): p is Player => Boolean(p))

  const [rows, setRows] = useState<Record<string, Row>>(() => {
    const r: Record<string, Row> = {}
    for (const p of participants) {
      const stat = initialStats.find(s => s.playerId === p.id)
      r[p.id] = stat
        ? { goals: stat.goals, assists: stat.assists, yellowCards: stat.yellowCards, redCards: stat.redCards, minutesPlayed: stat.minutesPlayed }
        : { ...EMPTY_ROW }
    }
    return r
  })
  const [saved, setSaved]   = useState(initialStats.length > 0)
  const [error, setError]   = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const [highlighted, setHighlighted] = useState<Set<string>>(new Set())
  const [unassigned, setUnassigned] = useState<SuggestedStatRow[]>([])
  const [suggestPending, setSuggestPending] = useState(false)

  function update(playerId: string, key: keyof Row, value: number) {
    setRows(prev => ({ ...prev, [playerId]: { ...prev[playerId], [key]: value } }))
    setSaved(false)
    setError(null)
    setHighlighted(prev => {
      if (!prev.has(playerId)) return prev
      const next = new Set(prev)
      next.delete(playerId)
      return next
    })
  }

  function handleSave() {
    startTransition(async () => {
      const payload = participants.map(p => ({ playerId: p.id, ...rows[p.id] }))
      const res = await saveMatchStats(match.id, payload)
      if (res.ok) setSaved(true)
      else setError(res.error)
    })
  }

  function applyPrefill() {
    if (!linkedAnalysisId) return
    const hasExistingValues = participants.some(p => {
      const r = rows[p.id]
      return r.goals > 0 || r.yellowCards > 0 || r.redCards > 0
    })
    if (hasExistingValues && !confirm("Ceci va remplacer les buts/cartons déjà saisis par les valeurs détectées dans la vidéo. Continuer ?")) {
      return
    }

    setSuggestPending(true)
    setError(null)
    getSuggestedMatchStats(linkedAnalysisId).then(suggestions => {
      setSuggestPending(false)
      const resolved = suggestions.filter(s => s.playerId)
      const notResolved = suggestions.filter(s => !s.playerId)

      setRows(prev => {
        const next = { ...prev }
        for (const s of resolved) {
          if (!s.playerId || !next[s.playerId]) continue
          next[s.playerId] = { ...next[s.playerId], goals: s.goals, yellowCards: s.yellowCards, redCards: s.redCards }
        }
        return next
      })
      setHighlighted(new Set(resolved.map(s => s.playerId!)))
      setUnassigned(notResolved)
      setSaved(false)
    })
  }

  function assignUnassigned(row: SuggestedStatRow, playerId: string) {
    if (!playerId) return
    setRows(prev => ({
      ...prev,
      [playerId]: { ...prev[playerId], goals: prev[playerId].goals + row.goals, yellowCards: prev[playerId].yellowCards + row.yellowCards, redCards: prev[playerId].redCards + row.redCards },
    }))
    setHighlighted(prev => new Set(prev).add(playerId))
    setUnassigned(prev => prev.filter(r => r !== row))
    setSaved(false)
  }

  const inputStyle: React.CSSProperties = {
    width: 56, padding: "6px 8px", borderRadius: 6, textAlign: "center",
    fontFamily: "var(--font-mono), monospace", fontSize: 12,
    backgroundColor: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(122,154,130,0.15)",
    color: "rgba(255,255,255,0.85)",
  }

  return (
    <div className="page-pad" style={{ maxWidth: 880 }}>
      <Link href="/dashboard/matchs" style={{
        fontFamily: "var(--font-mono), monospace",
        fontSize: 8, letterSpacing: "0.08em",
        color: "rgba(122,154,130,0.4)",
        display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 14,
      }}>
        ← MATCHS
      </Link>

      <div style={{ marginBottom: 28 }}>
        <p style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
          color: "rgba(122,154,130,0.5)", textTransform: "uppercase", marginBottom: 6,
        }}>
          Bilan du match
        </p>
        <h1 style={{
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontWeight: 900, fontSize: 24, letterSpacing: "0.02em",
          color: "rgba(255,255,255,0.95)", marginBottom: 8,
        }}>
          vs {match.opponent}
          {match.goals_for !== null && match.goals_against !== null && (
            <span style={{ color: "rgba(255,255,255,0.4)", marginLeft: 12 }}>
              {match.goals_for} – {match.goals_against}
            </span>
          )}
        </h1>
        <p style={{ fontFamily: "var(--font-mono), monospace", fontSize: 9, letterSpacing: "0.06em", color: "rgba(255,255,255,0.35)" }}>
          {formatDate(match.date)} · {match.home_away === "home" ? "DOMICILE" : "EXTÉRIEUR"}
          {match.competition && ` · ${match.competition}`}
        </p>
        {linkedAnalysisId && participants.length > 0 && (
          <button
            onClick={applyPrefill}
            disabled={suggestPending}
            style={{
              marginTop: 14,
              fontFamily: "var(--font-mono), monospace",
              fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
              color: "#7A9A82", backgroundColor: "rgba(122,154,130,0.1)",
              border: "1px solid rgba(122,154,130,0.3)", borderRadius: 8,
              padding: "9px 16px", cursor: suggestPending ? "default" : "pointer",
            }}
          >
            {suggestPending ? "Analyse en cours..." : "⚡ Pré-remplir depuis l'analyse vidéo"}
          </button>
        )}
      </div>

      {participants.length === 0 ? (
        <div style={{
          padding: "48px 32px", borderRadius: 12, textAlign: "center",
          backgroundColor: "var(--bg-card)", border: "1px dashed rgba(122,154,130,0.2)",
        }}>
          <p style={{
            fontFamily: "var(--font-body), sans-serif", fontWeight: 400,
            fontSize: 14, color: "rgba(255,255,255,0.3)", marginBottom: 8,
          }}>
            Aucune composition enregistrée pour ce match.
          </p>
          <Link href={`/dashboard/matchs/${match.id}/preparation`} style={{
            fontFamily: "var(--font-mono), monospace", fontSize: 9,
            letterSpacing: "0.08em", color: "rgba(122,154,130,0.5)",
          }}>
            PRÉPARER LA COMPOSITION →
          </Link>
        </div>
      ) : (
        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid rgba(122,154,130,0.1)", borderRadius: 12, padding: "20px 22px" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{
                    textAlign: "left", padding: "0 12px 12px 0",
                    fontFamily: "var(--font-mono), monospace", fontSize: 9, fontWeight: 700,
                    letterSpacing: "0.08em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase",
                  }}>
                    Joueur
                  </th>
                  {FIELDS.map(f => (
                    <th key={f.key} style={{
                      textAlign: "center", padding: "0 8px 12px",
                      fontFamily: "var(--font-mono), monospace", fontSize: 9, fontWeight: 700,
                      letterSpacing: "0.08em", color: "rgba(122,154,130,0.5)", textTransform: "uppercase",
                    }}>
                      {f.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {participants.map(p => {
                  const role = lineup.starters.includes(p.id) ? "T" : "R"
                  return (
                    <tr key={p.id} style={{ borderTop: "1px solid rgba(122,154,130,0.06)" }}>
                      <td style={{ padding: "10px 12px 10px 0" }}>
                        <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 9, color: "rgba(255,255,255,0.2)", marginRight: 8 }}>
                          #{p.number ?? "—"}
                        </span>
                        <span style={{ fontFamily: "var(--font-body), sans-serif", fontWeight: 400, fontSize: 13, color: "rgba(255,255,255,0.8)" }}>
                          {p.first_name} {p.last_name.toUpperCase()}
                        </span>
                        <span style={{
                          fontFamily: "var(--font-mono), monospace", fontSize: 8, fontWeight: 700,
                          color: role === "T" ? "#7A9A82" : "rgba(220,180,80,0.8)", marginLeft: 8,
                        }}>
                          {role}
                        </span>
                      </td>
                      {FIELDS.map(f => {
                        const isPrefilled = highlighted.has(p.id) && (f.key === "goals" || f.key === "yellowCards" || f.key === "redCards")
                        return (
                          <td key={f.key} style={{ padding: "10px 8px", textAlign: "center" }}>
                            <input
                              type="number"
                              min={0}
                              max={f.max}
                              value={rows[p.id][f.key]}
                              onChange={e => {
                                const v = Math.max(0, Math.min(f.max, parseInt(e.target.value) || 0))
                                update(p.id, f.key, v)
                              }}
                              style={isPrefilled ? { ...inputStyle, backgroundColor: "var(--sauge-dim)", borderColor: "var(--sauge-border)" } : inputStyle}
                              title={isPrefilled ? "Pré-rempli depuis l'analyse vidéo — vérifie avant d'enregistrer" : undefined}
                            />
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {unassigned.length > 0 && (
            <div style={{ marginTop: 20, padding: "14px 16px", borderRadius: 10, backgroundColor: "rgba(220,180,80,0.06)", border: "1px dashed rgba(220,180,80,0.25)" }}>
              <p style={{ fontFamily: "var(--font-mono), monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(220,180,80,0.8)", marginBottom: 10 }}>
                ÉVÉNEMENTS DÉTECTÉS NON ASSIGNÉS — numéro lu mais joueur non identifié
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {unassigned.map((row, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12 }}>
                    <span style={{ fontFamily: "var(--font-mono), monospace", color: "rgba(255,255,255,0.6)", minWidth: 120 }}>
                      #{row.jerseyNumber ?? "?"} — {row.goals > 0 ? `${row.goals} but(s)` : ""}{row.yellowCards > 0 ? ` ${row.yellowCards} jaune(s)` : ""}{row.redCards > 0 ? ` ${row.redCards} rouge(s)` : ""}
                    </span>
                    <select
                      defaultValue=""
                      onChange={e => assignUnassigned(row, e.target.value)}
                      style={{ ...inputStyle, width: "auto" }}
                    >
                      <option value="">Assigner à...</option>
                      {participants.map(p => (
                        <option key={p.id} value={p.id}>#{p.number ?? "—"} {p.first_name} {p.last_name}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 12 }}>
            {error && (
              <p style={{ fontFamily: "var(--font-body), sans-serif", fontSize: 11, color: "#e07070" }}>{error}</p>
            )}
            <button
              onClick={handleSave}
              disabled={pending}
              style={{
                padding: "10px 20px", borderRadius: 8,
                cursor: pending ? "default" : "pointer",
                fontFamily: "var(--font-mono), monospace",
                fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
                backgroundColor: saved ? "rgba(122,154,130,0.15)" : "#7A9A82",
                border: saved ? "1px solid rgba(122,154,130,0.3)" : "none",
                color: saved ? "#7A9A82" : "var(--bg)",
              }}
            >
              {pending ? "..." : saved ? "BILAN SAUVEGARDÉ ✓" : "SAUVEGARDER LE BILAN"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
