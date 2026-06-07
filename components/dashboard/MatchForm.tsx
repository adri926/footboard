"use client"

import { useState, useTransition } from "react"
import { createMatch, updateMatch } from "@/app/dashboard/matchs/actions"
import type { Match } from "@/app/dashboard/matchs/actions"

interface Props {
  match?:   Match
  onClose:  () => void
}

const INPUT: React.CSSProperties = {
  fontFamily: "var(--font-body), sans-serif",
  fontWeight: 300, fontSize: 13,
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

export default function MatchForm({ match, onClose }: Props) {
  const [pending, startTransition] = useTransition()
  const [error, setError]         = useState<string | null>(null)
  const [withScore, setWithScore] = useState(
    match?.goals_for !== null && match?.goals_for !== undefined
  )

  const [form, setForm] = useState({
    opponent:     match?.opponent     ?? "",
    date:         match?.date?.slice(0,10) ?? (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}` })(),
    home_away:    match?.home_away    ?? "home",
    competition:  match?.competition  ?? "",
    venue:        match?.venue        ?? "",
    goals_for:    match?.goals_for    ?? "",
    goals_against: match?.goals_against ?? "",
    notes:        match?.notes        ?? "",
  })

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const data = {
      opponent:      form.opponent,
      date:          form.date,
      home_away:     form.home_away,
      competition:   form.competition || null,
      venue:         form.venue || null,
      goals_for:     withScore && form.goals_for !== "" ? Number(form.goals_for) : null,
      goals_against: withScore && form.goals_against !== "" ? Number(form.goals_against) : null,
      notes:         form.notes || null,
    }

    startTransition(async () => {
      const res = match
        ? await updateMatch(match.id, data)
        : await createMatch(data)

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
        width: "100%", maxWidth: 460,
        boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <p style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontWeight: 900, fontSize: 18, color: "rgba(255,255,255,0.92)",
          }}>
            {match ? "Modifier le match" : "Ajouter un match"}
          </p>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(255,255,255,0.3)", fontSize: 18,
          }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Adversaire */}
          <div>
            <label style={LABEL}>Adversaire</label>
            <input
              value={form.opponent}
              onChange={e => set("opponent", e.target.value)}
              required placeholder="FC Vincennes"
              style={INPUT}
            />
          </div>

          {/* Date + Dom/Ext */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12 }}>
            <div>
              <label style={LABEL}>Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => set("date", e.target.value)}
                required style={INPUT}
              />
            </div>
            <div>
              <label style={LABEL}>Lieu</label>
              <div style={{ display: "flex", gap: 6, paddingTop: 2 }}>
                {(["home", "away"] as const).map(v => (
                  <button key={v} type="button"
                    onClick={() => set("home_away", v)}
                    style={{
                      padding: "9px 14px", borderRadius: 8, cursor: "pointer",
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: 8, fontWeight: 700, letterSpacing: "0.08em",
                      color: form.home_away === v ? "#7A9A82" : "rgba(255,255,255,0.25)",
                      backgroundColor: form.home_away === v ? "rgba(122,154,130,0.12)" : "transparent",
                      border: `1px solid ${form.home_away === v ? "rgba(122,154,130,0.4)" : "rgba(122,154,130,0.1)"}`,
                    }}>
                    {v === "home" ? "DOM" : "EXT"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Compétition + Lieu */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={LABEL}>Compétition (optionnel)</label>
              <input
                value={form.competition}
                onChange={e => set("competition", e.target.value)}
                placeholder="Régional 2"
                style={INPUT}
              />
            </div>
            <div>
              <label style={LABEL}>Adresse / stade (optionnel)</label>
              <input
                value={form.venue}
                onChange={e => set("venue", e.target.value)}
                placeholder="Stade Poincaré, Paris 16"
                style={INPUT}
              />
            </div>
          </div>

          {/* Score */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <label style={{ ...LABEL, marginBottom: 0 }}>Score</label>
              <button type="button" onClick={() => setWithScore(v => !v)} style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 7, letterSpacing: "0.08em",
                padding: "2px 8px", borderRadius: 4, cursor: "pointer",
                backgroundColor: withScore ? "rgba(122,154,130,0.12)" : "transparent",
                border: `1px solid ${withScore ? "rgba(122,154,130,0.3)" : "rgba(122,154,130,0.1)"}`,
                color: withScore ? "#7A9A82" : "rgba(255,255,255,0.2)",
              }}>
                {withScore ? "SAISIR" : "OPTIONNEL"}
              </button>
            </div>
            {withScore && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 20px 1fr", gap: 8, alignItems: "center" }}>
                <div>
                  <label style={{ ...LABEL, fontSize: 7 }}>NOUS</label>
                  <input
                    type="number" min={0} max={30}
                    value={form.goals_for}
                    onChange={e => set("goals_for", e.target.value)}
                    placeholder="0" style={{ ...INPUT, textAlign: "center" }}
                  />
                </div>
                <span style={{ textAlign: "center", color: "rgba(255,255,255,0.2)", fontWeight: 700 }}>–</span>
                <div>
                  <label style={{ ...LABEL, fontSize: 7 }}>EUX</label>
                  <input
                    type="number" min={0} max={30}
                    value={form.goals_against}
                    onChange={e => set("goals_against", e.target.value)}
                    placeholder="0" style={{ ...INPUT, textAlign: "center" }}
                  />
                </div>
              </div>
            )}
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
              {pending ? "..." : match ? "ENREGISTRER" : "AJOUTER"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
