"use client"

import Link from "next/link"

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div style={{
      minHeight: "60vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "64px 32px", textAlign: "center",
    }}>
      <p style={{
        fontFamily: "var(--font-mono), monospace",
        fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
        color: "rgba(224,112,112,0.5)", textTransform: "uppercase", marginBottom: 12,
      }}>
        Erreur inattendue
      </p>
      <h1 style={{
        fontFamily: "var(--font-display), system-ui, sans-serif",
        fontWeight: 900, fontSize: "clamp(32px, 7vw, 60px)",
        color: "rgba(255,255,255,0.9)", lineHeight: 0.95, marginBottom: 16,
      }}>
        QUELQUE CHOSE<br />
        <span style={{ color: "#7A9A82" }}>A MAL TOURNÉ</span>
      </h1>
      <p style={{
        fontFamily: "var(--font-body), sans-serif",
        fontWeight: 400, fontSize: 14,
        color: "rgba(255,255,255,0.3)", marginBottom: 32, maxWidth: 360,
      }}>
        Une erreur s'est produite. Réessayez ou revenez à l'accueil.
      </p>
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={reset} style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
          backgroundColor: "#7A9A82", color: "#181812",
          padding: "11px 22px", borderRadius: 8, border: "none", cursor: "pointer",
        }}>
          RÉESSAYER
        </button>
        <Link href="/" style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
          color: "rgba(255,255,255,0.4)",
          border: "1px solid rgba(255,255,255,0.1)",
          padding: "11px 22px", borderRadius: 8, textDecoration: "none",
        }}>
          ACCUEIL
        </Link>
      </div>
    </div>
  )
}
