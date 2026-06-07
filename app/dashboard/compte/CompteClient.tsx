"use client"

import { useState, useTransition } from "react"
import { deleteAccount } from "./actions"

export default function CompteClient() {
  const [confirm, setConfirm] = useState("")
  const [open, setOpen]       = useState(false)
  const [pending, start]      = useTransition()

  function handleDelete() {
    start(async () => {
      await deleteAccount()
    })
  }

  return (
    <div style={{ padding: "32px 36px", maxWidth: 640 }}>
      <p style={{
        fontFamily: "var(--font-mono), monospace",
        fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
        color: "rgba(122,154,130,0.5)", textTransform: "uppercase", marginBottom: 6,
      }}>
        Mon compte
      </p>
      <h1 style={{
        fontFamily: "var(--font-display), system-ui, sans-serif",
        fontWeight: 900, fontSize: 24, color: "rgba(255,255,255,0.95)", marginBottom: 32,
      }}>
        Paramètres
      </h1>

      {/* Zone danger */}
      <div style={{
        padding: "20px 22px", borderRadius: 12,
        backgroundColor: "rgba(224,112,112,0.04)",
        border: "1px solid rgba(224,112,112,0.15)",
      }}>
        <p style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
          color: "rgba(224,112,112,0.6)", textTransform: "uppercase", marginBottom: 8,
        }}>
          Zone de danger
        </p>
        <p style={{
          fontFamily: "var(--font-body), sans-serif",
          fontWeight: 300, fontSize: 13, lineHeight: 1.6,
          color: "rgba(255,255,255,0.4)", marginBottom: 16,
        }}>
          La suppression de votre compte est <strong style={{ color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>irréversible</strong>. Toutes vos données (club, joueurs, matchs, entraînements) seront définitivement effacées.
        </p>
        <button
          onClick={() => setOpen(true)}
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
            color: "rgba(224,112,112,0.7)",
            backgroundColor: "rgba(224,112,112,0.08)",
            border: "1px solid rgba(224,112,112,0.2)",
            padding: "9px 18px", borderRadius: 8, cursor: "pointer",
          }}>
          SUPPRIMER MON COMPTE
        </button>
      </div>

      {/* Modal confirmation */}
      {open && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
          }}
        >
          <div style={{
            backgroundColor: "#1f1f19",
            border: "1px solid rgba(224,112,112,0.25)",
            borderRadius: 16, padding: "28px",
            width: "100%", maxWidth: 420,
          }}>
            <p style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontWeight: 900, fontSize: 18, color: "rgba(255,255,255,0.92)", marginBottom: 12,
            }}>
              Confirmer la suppression
            </p>
            <p style={{
              fontFamily: "var(--font-body), sans-serif",
              fontWeight: 300, fontSize: 13, lineHeight: 1.6,
              color: "rgba(255,255,255,0.4)", marginBottom: 20,
            }}>
              Tapez <strong style={{ color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-mono), monospace", fontSize: 12 }}>SUPPRIMER</strong> pour confirmer.
            </p>
            <input
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="SUPPRIMER"
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 13, fontWeight: 700,
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(224,112,112,0.2)",
                borderRadius: 8, padding: "10px 14px",
                color: "rgba(255,255,255,0.85)", width: "100%",
                outline: "none", marginBottom: 20, letterSpacing: "0.08em",
              }}
            />
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setOpen(false)} style={{
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
                disabled={confirm !== "SUPPRIMER" || pending}
                style={{
                  flex: 2, padding: "11px 0", borderRadius: 10,
                  cursor: confirm !== "SUPPRIMER" || pending ? "default" : "pointer",
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
                  backgroundColor: confirm === "SUPPRIMER" ? "rgba(224,112,112,0.8)" : "rgba(224,112,112,0.15)",
                  border: "none",
                  color: confirm === "SUPPRIMER" ? "#fff" : "rgba(224,112,112,0.3)",
                  transition: "all 0.15s",
                }}
              >
                {pending ? "SUPPRESSION..." : "SUPPRIMER DÉFINITIVEMENT"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
