"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

const STORAGE_KEY = "fb_cookie_notice_seen"

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
  }, [])

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "1")
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div style={{
      position: "fixed", left: 16, right: 16, bottom: 16, zIndex: 200,
      maxWidth: 560, margin: "0 auto",
      backgroundColor: "#1f1f19",
      border: "1px solid rgba(122,154,130,0.2)",
      borderRadius: 14, padding: "18px 22px",
      display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    }}>
      <p style={{
        fontFamily: "var(--font-body), sans-serif",
        fontWeight: 400, fontSize: 13, lineHeight: 1.6,
        color: "rgba(255,255,255,0.55)", flex: "1 1 280px", margin: 0,
      }}>
        Footboard utilise uniquement des cookies strictement nécessaires à l'authentification (Clerk). Aucun cookie publicitaire ou de suivi tiers.{" "}
        <Link href="/confidentialite" style={{ color: "#7A9A82", textDecoration: "underline" }}>
          En savoir plus
        </Link>
      </p>
      <button onClick={dismiss} style={{
        fontFamily: "var(--font-mono), monospace",
        fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
        padding: "10px 22px", borderRadius: 10, cursor: "pointer",
        backgroundColor: "#7A9A82", color: "#181812", border: "none",
        whiteSpace: "nowrap",
      }}>
        J'AI COMPRIS
      </button>
    </div>
  )
}
