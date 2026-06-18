"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useClerk } from "@clerk/nextjs"
import Link from "next/link"
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

const NEXT_STEPS = [
  {
    href: "/dashboard/effectif",
    icon: "👥",
    label: "Ajouter des joueurs",
    desc: "Crée ton effectif pour gérer les matchs et entraînements.",
    cta: "GÉRER L'EFFECTIF →",
  },
  {
    href: "/dashboard/matchs",
    icon: "📅",
    label: "Planifier un match",
    desc: "Programme ta prochaine rencontre et compose ton équipe.",
    cta: "AJOUTER UN MATCH →",
  },
  {
    href: "/tactique/digiboard",
    icon: "🎯",
    label: "Tester le Digiboard",
    desc: "Place tes joueurs, dessine tes schémas, explique tes idées.",
    cta: "OUVRIR LE DIGIBOARD →",
  },
]

export default function OnboardingPage() {
  const [step, setStep]     = useState<"club" | "welcome">("club")
  const [clubName, setClubName] = useState("")
  const [form, setForm]     = useState({ name: "", city: "", level: "" })
  const [error, setError]   = useState<string | null>(null)
  const [pending, start]    = useTransition()
  const clerk               = useClerk()
  const router              = useRouter()

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
      if (res.ok) {
        if (res.orgId) await clerk.setActive({ organization: res.orgId })
        setClubName(form.name)
        setStep("welcome")
      } else setError(res.error)
    })
  }

  if (step === "welcome") {
    return (
      <div style={{
        minHeight: "100vh", backgroundColor: "#181812",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}>
        <div style={{ width: "100%", maxWidth: 480 }}>
          <p style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontWeight: 900, fontSize: 18, letterSpacing: "0.06em",
            color: "rgba(255,255,255,0.95)", marginBottom: 40,
          }}>
            FOOTBOARD
          </p>

          <div style={{ marginBottom: 36 }}>
            <p style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
              color: "rgba(122,154,130,0.5)", textTransform: "uppercase", marginBottom: 8,
            }}>
              Club créé ✓
            </p>
            <h1 style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontWeight: 900, fontSize: 26, letterSpacing: "0.02em",
              color: "rgba(255,255,255,0.95)", marginBottom: 8,
            }}>
              Bienvenue, {clubName} !
            </h1>
            <p style={{
              fontFamily: "var(--font-body), sans-serif",
              fontWeight: 400, fontSize: 13, lineHeight: 1.6,
              color: "rgba(255,255,255,0.35)",
            }}>
              Ton espace est prêt. Par où veux-tu commencer ?
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
            {NEXT_STEPS.map(s => (
              <Link key={s.href} href={s.href} style={{
                textDecoration: "none",
                display: "flex", alignItems: "flex-start", gap: 16,
                padding: "16px 18px", borderRadius: 12,
                backgroundColor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(122,154,130,0.15)",
              }}>
                <span style={{ fontSize: 22, lineHeight: 1, marginTop: 2 }}>{s.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontFamily: "var(--font-body), sans-serif",
                    fontWeight: 600, fontSize: 14,
                    color: "rgba(255,255,255,0.85)", marginBottom: 3,
                  }}>
                    {s.label}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-body), sans-serif",
                    fontWeight: 400, fontSize: 12, lineHeight: 1.5,
                    color: "rgba(255,255,255,0.3)",
                  }}>
                    {s.desc}
                  </p>
                </div>
                <span style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 8, fontWeight: 700, letterSpacing: "0.08em",
                  color: "rgba(122,154,130,0.5)",
                  alignSelf: "center", flexShrink: 0,
                }}>
                  {s.cta}
                </span>
              </Link>
            ))}
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            style={{
              width: "100%", padding: "12px 0", borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.08)",
              cursor: "pointer", backgroundColor: "transparent",
              fontFamily: "var(--font-mono), monospace",
              fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
              color: "rgba(255,255,255,0.25)",
            }}
          >
            PASSER — ACCÉDER AU DASHBOARD
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: "100vh", backgroundColor: "#181812",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      <div style={{ width: "100%", maxWidth: 440 }}>

        <p style={{
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontWeight: 900, fontSize: 18, letterSpacing: "0.06em",
          color: "rgba(255,255,255,0.95)", marginBottom: 40,
        }}>
          FOOTBOARD
        </p>

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
            {pending ? "..." : "CRÉER MON CLUB →"}
          </button>
        </form>
      </div>
    </div>
  )
}
