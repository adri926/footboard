"use client"

import { useState, useTransition } from "react"
import { createPlayer, updatePlayer } from "@/app/dashboard/effectif/actions"
import type { Player } from "@/app/dashboard/effectif/actions"

interface Props {
  player?: Player   // défini = mode édition
  onClose: () => void
}

const POSITIONS = [
  { value: "GK",  label: "Gardien"    },
  { value: "DEF", label: "Défenseur"  },
  { value: "MIL", label: "Milieu"     },
  { value: "ATT", label: "Attaquant"  },
] as const

const STATUSES = [
  { value: "available", label: "Disponible", color: "#7A9A82" },
  { value: "injured",   label: "Blessé",     color: "#e07070" },
  { value: "uncertain", label: "Incertain",  color: "#d4a847" },
] as const

const INPUT = {
  fontFamily: "var(--font-body), sans-serif",
  fontWeight: 300, fontSize: 13,
  backgroundColor: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(122,154,130,0.15)",
  borderRadius: 8, padding: "9px 12px",
  color: "rgba(255,255,255,0.85)",
  width: "100%", outline: "none",
}

const LABEL = {
  fontFamily: "var(--font-mono), monospace",
  fontSize: 8, fontWeight: 700, letterSpacing: "0.1em",
  color: "rgba(122,154,130,0.5)", textTransform: "uppercase" as const,
  marginBottom: 6, display: "block",
}

export default function PlayerForm({ player, onClose }: Props) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    first_name:  player?.first_name  ?? "",
    last_name:   player?.last_name   ?? "",
    number:      player?.number      ?? "",
    position:    player?.position    ?? "DEF",
    status:      player?.status      ?? "available",
    injury_note: player?.injury_note ?? "",
    email:       player?.email       ?? "",
  })

  function set(field: string, value: string | number) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const data = {
      ...form,
      number:      form.number !== "" ? Number(form.number) : null,
      injury_note: form.injury_note || null,
      email:       form.email || null,
    }

    startTransition(async () => {
      const res = player
        ? await updatePlayer(player.id, data)
        : await createPlayer(data)

      if (res.ok) {
        onClose()
      } else {
        setError(res.error)
      }
    })
  }

  const showInjuryNote = form.status !== "available"

  return (
    /* Overlay */
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        backgroundColor: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{
        backgroundColor: "#1f1f19",
        border: "1px solid rgba(122,154,130,0.18)",
        borderRadius: 16, padding: "28px 28px",
        width: "100%", maxWidth: 440,
        boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <p style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontWeight: 900, fontSize: 18, letterSpacing: "0.02em",
            color: "rgba(255,255,255,0.92)",
          }}>
            {player ? "Modifier le joueur" : "Ajouter un joueur"}
          </p>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(255,255,255,0.3)", fontSize: 18, lineHeight: 1,
            padding: 4,
          }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Prénom + Nom */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={LABEL}>Prénom</label>
              <input
                value={form.first_name}
                onChange={e => set("first_name", e.target.value)}
                required placeholder="Lucas"
                style={INPUT}
              />
            </div>
            <div>
              <label style={LABEL}>Nom</label>
              <input
                value={form.last_name}
                onChange={e => set("last_name", e.target.value)}
                required placeholder="Moreau"
                style={INPUT}
              />
            </div>
          </div>

          {/* Numéro + Poste */}
          <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 12 }}>
            <div>
              <label style={LABEL}>N°</label>
              <input
                type="number" min={1} max={99}
                value={form.number}
                onChange={e => set("number", e.target.value)}
                placeholder="1"
                style={INPUT}
              />
            </div>
            <div>
              <label style={LABEL}>Poste</label>
              <select
                value={form.position}
                onChange={e => set("position", e.target.value)}
                style={{ ...INPUT, cursor: "pointer" }}
              >
                {POSITIONS.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Statut */}
          <div>
            <label style={LABEL}>Statut</label>
            <div style={{ display: "flex", gap: 8 }}>
              {STATUSES.map(s => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => set("status", s.value)}
                  style={{
                    flex: 1, padding: "8px 4px", borderRadius: 8, cursor: "pointer",
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 8, fontWeight: 700, letterSpacing: "0.08em",
                    color: form.status === s.value ? s.color : "rgba(255,255,255,0.25)",
                    backgroundColor: form.status === s.value ? `${s.color}18` : "transparent",
                    border: `1px solid ${form.status === s.value ? `${s.color}50` : "rgba(122,154,130,0.1)"}`,
                    transition: "all 0.15s",
                  }}
                >
                  {s.label.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={LABEL}>Email (pour les convocations)</label>
            <input
              type="email"
              value={form.email}
              onChange={e => set("email", e.target.value)}
              placeholder="lucas.moreau@email.com"
              style={INPUT}
              maxLength={200}
            />
          </div>

          {/* Note blessure */}
          {showInjuryNote && (
            <div>
              <label style={LABEL}>Note médicale</label>
              <input
                value={form.injury_note}
                onChange={e => set("injury_note", e.target.value)}
                placeholder="Ex: Élongation ischio — retour estimé J+14"
                style={INPUT}
                maxLength={300}
              />
            </div>
          )}

          {error && (
            <p style={{
              fontFamily: "var(--font-body), sans-serif",
              fontSize: 12, color: "#e07070",
              backgroundColor: "rgba(224,112,112,0.08)",
              border: "1px solid rgba(224,112,112,0.2)",
              borderRadius: 6, padding: "8px 12px",
            }}>
              {error}
            </p>
          )}

          {/* Actions */}
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
              flex: 2, padding: "11px 0", borderRadius: 10, cursor: pending ? "default" : "pointer",
              fontFamily: "var(--font-mono), monospace",
              fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
              backgroundColor: pending ? "rgba(122,154,130,0.4)" : "#7A9A82",
              border: "none",
              color: "#181812",
              transition: "opacity 0.2s",
            }}>
              {pending ? "..." : player ? "ENREGISTRER" : "AJOUTER"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
