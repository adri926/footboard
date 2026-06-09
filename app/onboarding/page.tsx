"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createClub } from "@/app/dashboard/club/actions"

const LEVELS = [
  "National 3", "Régional 1", "Régional 2", "Régional 3",
  "Départemental 1", "Départemental 2", "Départemental 3",
  "District", "U18", "U16", "U15", "U13", "Futsal", "Féminin",
]

const INPUT: React.CSSProperties = {
  fontFamily: "var(--font-body), sans-serif",
  fontWeight: 400, fontSize: 14,
  backgroundColor: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(122,154,130,0.2)",
  borderRadius: 10, padding: "12px 14px",
  color: "rgba(255,255,255,0.9)",
  width: "100%", outline: "none",
}

const LABEL: React.CSSProperties = {
  fontFamily: "var(--font-mono), monospace",
  fontSize: 8, fontWeight: 700, letterSpacing: "0.12em",
  color: "rgba(122,154,130,0.6)", textTransform: "uppercase",
  marginBottom: 8, display: "block",
}

export default function OnboardingPage() {
  const [form, setForm]   = useState({ name: "", city: "", level: "" })
  const [error, setError] = useState<string | null>(null)
  const [pending, start]  = useTransition()
  const router            = useRouter()

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    start(async () => {
      const res = await createClub({
        name:  form.name,
        city:  form.city  || null,
        level: form.level || null,
      })
      if (res.ok) router.push("/dashboard")
      else setError(res.error)
    })
  }

  return (
    <div style={{
      minHeight: "100vh", backgroundColor: "#181812",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      <div style={{ width: "100%", maxWidth: 440 }}>

        {/* Logo */}
        <p style={{
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontWeight: 900, fontSize: 18, letterSpacing: "0.06em",
          color: "rgba(255,255,255,0.95)", marginBottom: 40,
        }}>
          FOOTBOARD
        </p>

        {/* Titre */}
        <div style={{ marginBottom: 32 }}>
          <p style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
            color: "rgba(122,154,130,0.5)", textTransform: "uppercase", marginBottom: 8,
          }}>
            Bienvenue
          </p>
          <h1 style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontWeight: 900, fontSize: 26, letterSpacing: "0.02em",
            color: "rgba(255,255,255,0.95)", marginBottom: 8,
          }}>
            Créez votre club
          </h1>
          <p style={{
            fontFamily: "var(--font-body), sans-serif",
            fontWeight: 400, fontSize: 13, lineHeight: 1.6,
            color: "rgba(255,255,255,0.35)",
          }}>
            Ces informations apparaîtront dans votre espace et sur les convocations envoyées à vos joueurs.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          <div>
            <label style={LABEL}>Nom du club *</label>
            <input
              value={form.name}
              onChange={e => set("name", e.target.value)}
              required placeholder="AS Poincaré"
              style={INPUT}
            />
          </div>

          <div>
            <label style={LABEL}>Ville (optionnel)</label>
            <input
              value={form.city}
              onChange={e => set("city", e.target.value)}
              placeholder="Paris"
              style={INPUT}
            />
          </div>

          <div>
            <label style={LABEL}>Niveau de jeu (optionnel)</label>
            <select
              value={form.level}
              onChange={e => set("level", e.target.value)}
              style={{ ...INPUT, cursor: "pointer" }}
            >
              <option value="">— Sélectionner —</option>
              {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {error && (
            <p style={{
              fontFamily: "var(--font-body), sans-serif", fontSize: 12,
              color: "#e07070", backgroundColor: "rgba(224,112,112,0.08)",
              border: "1px solid rgba(224,112,112,0.2)",
              borderRadius: 8, padding: "10px 14px",
            }}>
              {error}
            </p>
          )}

          <button type="submit" disabled={pending} style={{
            padding: "14px 0", borderRadius: 10, border: "none",
            cursor: pending ? "default" : "pointer",
            fontFamily: "var(--font-mono), monospace",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
            backgroundColor: pending ? "rgba(122,154,130,0.5)" : "#7A9A82",
            color: "#181812", marginTop: 4,
          }}>
            {pending ? "..." : "ACCÉDER AU DASHBOARD →"}
          </button>
        </form>
      </div>
    </div>
  )
}
