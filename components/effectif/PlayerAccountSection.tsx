"use client"

import { useState, useTransition } from "react"
import { invitePlayer } from "@/app/dashboard/effectif/actions"
import type { Player } from "@/app/dashboard/effectif/actions"

export default function PlayerAccountSection({ player }: { player: Player }) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  function handleInvite() {
    setError(null)
    startTransition(async () => {
      const res = await invitePlayer(player.id)
      if (res.ok) setSent(true)
      else setError(res.error)
    })
  }

  if (player.user_id) {
    return (
      <span style={{
        fontFamily: "var(--font-mono), monospace",
        fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
        color: "#7A9A82", backgroundColor: "rgba(122,154,130,0.1)",
        border: "1px solid rgba(122,154,130,0.25)",
        padding: "4px 10px", borderRadius: 100,
      }}>
        COMPTE ACTIF
      </span>
    )
  }

  if (!player.email) {
    return (
      <span style={{
        fontFamily: "var(--font-mono), monospace", fontSize: 9,
        letterSpacing: "0.06em", color: "rgba(255,255,255,0.25)",
      }}>
        Ajoute un email pour inviter {player.first_name}
      </span>
    )
  }

  const label = sent || player.invite_status === "pending"
    ? "RENVOYER L'INVITATION"
    : `INVITER ${player.first_name.toUpperCase()}`

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
      <button
        onClick={handleInvite}
        disabled={pending}
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
          padding: "6px 14px", borderRadius: 8, cursor: pending ? "default" : "pointer",
          backgroundColor: "transparent",
          color: "rgba(122,154,130,0.7)",
          border: "1px solid rgba(122,154,130,0.25)",
        }}
      >
        {pending ? "..." : label}
      </button>
      {sent && !error && (
        <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 8, color: "#7A9A82" }}>
          Invitation envoyée
        </span>
      )}
      {error && (
        <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 8, color: "#e07070" }}>
          {error}
        </span>
      )}
    </div>
  )
}
