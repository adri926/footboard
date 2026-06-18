"use client"

import { useState } from "react"

export default function UpgradeButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  async function handleUpgrade() {
    setLoading(true)
    setError(null)
    try {
      const res  = await fetch("/api/stripe/checkout", { method: "POST" })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error ?? "Erreur inattendue.")
        setLoading(false)
      }
    } catch {
      setError("Erreur réseau. Réessaie.")
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleUpgrade}
        disabled={loading}
        style={{
          padding: "12px 28px", borderRadius: 10, border: "none",
          cursor: loading ? "default" : "pointer",
          fontFamily: "var(--font-mono), monospace",
          fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
          backgroundColor: loading ? "rgba(122,154,130,0.5)" : "#7A9A82",
          color: "#181812",
        }}
      >
        {loading ? "Redirection…" : "PASSER AU PLAN CLUB →"}
      </button>
      {error && (
        <p style={{ fontFamily: "var(--font-body), sans-serif", fontSize: 12, color: "#e07070", marginTop: 8 }}>
          {error}
        </p>
      )}
    </div>
  )
}
