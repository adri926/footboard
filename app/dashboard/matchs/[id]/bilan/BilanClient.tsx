"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { saveMatchStats } from "@/app/dashboard/matchs/actions"
import type { Match, Lineup, MatchPlayerStat } from "@/app/dashboard/matchs/actions"
import type { Player } from "@/app/dashboard/effectif/actions"

interface Props {
  match:        Match
  players:      Player[]
  lineup:       Lineup
  initialStats: MatchPlayerStat[]
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

export default function BilanClient({ match, players, lineup, initialStats }: Props) {
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

  function update(playerId: string, key: keyof Row, value: number) {
    setRows(prev => ({ ...prev, [playerId]: { ...prev[playerId], [key]: value } }))
    setSaved(false)
    setError(null)
  }

  function handleSave() {
    startTransition(async () => {
      const payload = participants.map(p => ({ playerId: p.id, ...rows[p.id] }))
      const res = await saveMatchStats(match.id, payload)
      if (res.ok) setSaved(true)
      else setError(res.error)
    })
  }

  const inputStyle: React.CSSProperties = {
    width: 56, padding: "6px 8px", borderRadius: 6, textAlign: "center",
    fontFamily: "var(--font-mono), monospace", fontSize: 12,
    backgroundColor: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(122,154,130,0.15)",
    color: "rgba(255,255,255,0.85)",
  }

  return (
    <div style={{ padding: "32px 36px", maxWidth: 880 }}>
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
      </div>

      {participants.length === 0 ? (
        <div style={{
          padding: "48px 32px", borderRadius: 12, textAlign: "center",
          backgroundColor: "#1f1f19", border: "1px dashed rgba(122,154,130,0.2)",
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
        <div style={{ backgroundColor: "#1f1f19", border: "1px solid rgba(122,154,130,0.1)", borderRadius: 12, padding: "20px 22px" }}>
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
                      {FIELDS.map(f => (
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
                            style={inputStyle}
                          />
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

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
                color: saved ? "#7A9A82" : "#181812",
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
