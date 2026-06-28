"use client"

import { useState, useSyncExternalStore } from "react"

interface Props {
  id:       string
  title?:   string
  children: React.ReactNode
}

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb)
  return () => window.removeEventListener("storage", cb)
}

// Astuce contextuelle affichée une seule fois (mémorisée dans localStorage).
// Snapshot serveur = "masquée" → pas de mismatch d'hydratation, pas d'effet.
export default function OnboardingHint({ id, title = "ASTUCE", children }: Props) {
  const key = `fb_hint_${id}`
  const persistedDismissed = useSyncExternalStore(
    subscribe,
    () => { try { return localStorage.getItem(key) !== null } catch { return true } },
    () => true,
  )
  const [closed, setClosed] = useState(false)

  if (persistedDismissed || closed) return null

  function dismiss() {
    try { localStorage.setItem(key, "1") } catch { /* localStorage indisponible */ }
    setClosed(true)
  }

  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 12,
      padding: "12px 14px", borderRadius: 10, marginBottom: 20,
      backgroundColor: "rgba(122,154,130,0.07)",
      border: "1px solid rgba(122,154,130,0.20)",
    }}>
      <span style={{ fontSize: 14, color: "var(--sauge)", lineHeight: 1.3, flexShrink: 0 }}>◬</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 8, fontWeight: 700, letterSpacing: "0.12em",
          color: "var(--sauge)", marginBottom: 4,
        }}>
          {title}
        </p>
        <p style={{
          fontFamily: "var(--font-body), sans-serif",
          fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.5,
        }}>
          {children}
        </p>
      </div>
      <button
        onClick={dismiss}
        aria-label="Masquer l'astuce"
        style={{
          backgroundColor: "transparent", borderStyle: "none", cursor: "pointer",
          color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1,
          padding: 2, flexShrink: 0,
        }}
      >
        ✕
      </button>
    </div>
  )
}
