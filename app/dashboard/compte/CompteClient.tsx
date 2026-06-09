"use client"

import { useState, useTransition } from "react"
import { updateClub } from "@/app/dashboard/club/actions"
import { deleteAccount } from "./actions"
import PageHeader from "@/components/dashboard/PageHeader"
import ClubLogo from "@/components/dashboard/ClubLogo"
import type { Club } from "@/app/dashboard/club/actions"

const LEVELS = [
  "National 3", "Régional 1", "Régional 2", "Régional 3",
  "Départemental 1", "Départemental 2", "Départemental 3",
  "District", "U18", "U16", "U15", "U13", "Futsal", "Féminin",
]

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

const SECTION: React.CSSProperties = {
  padding: "20px 22px", borderRadius: 12,
  backgroundColor: "var(--bg-card)",
  border: "1px solid rgba(122,154,130,0.08)",
}

interface Props {
  club: Club | null
}

export default function CompteClient({ club }: Props) {
  const [form, setForm] = useState({
    name:  club?.name  ?? "",
    city:  club?.city  ?? "",
    level: club?.level ?? "",
    logo:  club?.logo  ?? "",
  })
  const [clubSaved, setClubSaved]   = useState(false)
  const [clubError, setClubError]   = useState<string | null>(null)
  const [clubPending, startClub]    = useTransition()

  const [confirm, setConfirm]       = useState("")
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletePending, startDelete] = useTransition()

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    setClubSaved(false)
    setClubError(null)
  }

  function handleClubSubmit(e: React.FormEvent) {
    e.preventDefault()
    startClub(async () => {
      const res = await updateClub({
        name:  form.name,
        city:  form.city  || null,
        level: form.level || null,
        logo:  form.logo  || null,
      })
      if (res.ok) setClubSaved(true)
      else setClubError(res.error)
    })
  }

  function handleDelete() {
    startDelete(async () => { await deleteAccount() })
  }

  return (
    <div style={{ padding: "32px 36px", maxWidth: 600 }}>

      <PageHeader label="Mon compte" title="Paramètres" />

      {/* Section club */}
      <div style={{ ...SECTION, marginBottom: 16 }}>
        <p style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
          color: "rgba(122,154,130,0.6)", textTransform: "uppercase", marginBottom: 16,
        }}>
          Mon club
        </p>

        <form onSubmit={handleClubSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={LABEL}>Nom du club</label>
            <input
              value={form.name}
              onChange={e => set("name", e.target.value)}
              required style={INPUT}
            />
          </div>

          <div>
            <label style={LABEL}>Logo du club (URL)</label>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <ClubLogo src={form.logo || null} name={form.name || "?"} size={36} />
              <input
                value={form.logo}
                onChange={e => set("logo", e.target.value)}
                placeholder="https://..."
                style={INPUT}
              />
            </div>
            <p style={{
              fontFamily: "var(--font-body), sans-serif", fontWeight: 400,
              fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 6,
            }}>
              Lien direct vers une image (hébergée ailleurs). Affiché dans les listes de matchs et les statistiques.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={LABEL}>Ville</label>
              <input
                value={form.city}
                onChange={e => set("city", e.target.value)}
                placeholder="Paris"
                style={INPUT}
              />
            </div>
            <div>
              <label style={LABEL}>Niveau</label>
              <select
                value={form.level}
                onChange={e => set("level", e.target.value)}
                style={{ ...INPUT, cursor: "pointer" }}
              >
                <option value="">— Non renseigné —</option>
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {clubError && (
            <p style={{
              fontFamily: "var(--font-body), sans-serif", fontSize: 12,
              color: "#e07070", backgroundColor: "rgba(224,112,112,0.08)",
              border: "1px solid rgba(224,112,112,0.15)",
              borderRadius: 6, padding: "8px 12px",
            }}>
              {clubError}
            </p>
          )}

          <button type="submit" disabled={clubPending} style={{
            padding: "10px 0", borderRadius: 8,
            cursor: clubPending ? "default" : "pointer",
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
            backgroundColor: clubSaved ? "rgba(122,154,130,0.15)" : "#7A9A82",
            border: clubSaved ? "1px solid rgba(122,154,130,0.3)" : "none",
            color: clubSaved ? "#7A9A82" : "var(--bg)",
          }}>
            {clubPending ? "..." : clubSaved ? "MODIFICATIONS SAUVEGARDÉES ✓" : "ENREGISTRER"}
          </button>
        </form>
      </div>

      {/* Zone de danger */}
      <div style={{
        padding: "20px 22px", borderRadius: 12,
        backgroundColor: "rgba(224,112,112,0.03)",
        border: "1px solid rgba(224,112,112,0.12)",
      }}>
        <p style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
          color: "rgba(224,112,112,0.55)", textTransform: "uppercase", marginBottom: 8,
        }}>
          Zone de danger
        </p>
        <p style={{
          fontFamily: "var(--font-body), sans-serif",
          fontWeight: 400, fontSize: 13, lineHeight: 1.6,
          color: "rgba(255,255,255,0.35)", marginBottom: 14,
        }}>
          La suppression de votre compte est <strong style={{ color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>irréversible</strong>. Toutes vos données (club, joueurs, matchs, entraînements) seront définitivement effacées.
        </p>
        <button onClick={() => setDeleteOpen(true)} style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
          color: "rgba(224,112,112,0.65)",
          backgroundColor: "rgba(224,112,112,0.07)",
          border: "1px solid rgba(224,112,112,0.18)",
          padding: "9px 18px", borderRadius: 8, cursor: "pointer",
        }}>
          SUPPRIMER MON COMPTE
        </button>
      </div>

      {/* Modal de confirmation suppression */}
      {deleteOpen && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setDeleteOpen(false) }}
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
          }}
        >
          <div style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid rgba(224,112,112,0.2)",
            borderRadius: 16, padding: "28px",
            width: "100%", maxWidth: 420,
          }}>
            <p style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontWeight: 900, fontSize: 18, color: "rgba(255,255,255,0.92)", marginBottom: 10,
            }}>
              Confirmer la suppression
            </p>
            <p style={{
              fontFamily: "var(--font-body), sans-serif",
              fontWeight: 400, fontSize: 13, lineHeight: 1.6,
              color: "rgba(255,255,255,0.35)", marginBottom: 18,
            }}>
              Tapez <strong style={{ color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-mono), monospace", fontSize: 12 }}>SUPPRIMER</strong> pour confirmer.
            </p>
            <input
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="SUPPRIMER"
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 13, fontWeight: 700, letterSpacing: "0.08em",
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(224,112,112,0.2)",
                borderRadius: 8, padding: "10px 14px",
                color: "rgba(255,255,255,0.85)", width: "100%",
                outline: "none", marginBottom: 18,
              }}
            />
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDeleteOpen(false)} style={{
                flex: 1, padding: "11px 0", borderRadius: 10, cursor: "pointer",
                fontFamily: "var(--font-mono), monospace",
                fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
                backgroundColor: "transparent",
                border: "1px solid rgba(122,154,130,0.15)",
                color: "rgba(255,255,255,0.3)",
              }}>
                ANNULER
              </button>
              <button
                onClick={handleDelete}
                disabled={confirm !== "SUPPRIMER" || deletePending}
                style={{
                  flex: 2, padding: "11px 0", borderRadius: 10,
                  cursor: confirm !== "SUPPRIMER" || deletePending ? "default" : "pointer",
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
                  backgroundColor: confirm === "SUPPRIMER" ? "rgba(224,112,112,0.8)" : "rgba(224,112,112,0.12)",
                  border: "none",
                  color: confirm === "SUPPRIMER" ? "#fff" : "rgba(224,112,112,0.3)",
                  transition: "all 0.15s",
                }}
              >
                {deletePending ? "SUPPRESSION..." : "SUPPRIMER DÉFINITIVEMENT"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
