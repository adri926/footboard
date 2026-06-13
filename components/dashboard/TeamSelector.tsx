"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { setActiveTeam } from "@/app/dashboard/effectif/equipes/actions"
import type { Team } from "@/lib/teams"

interface Props {
  teams:        Team[]
  activeTeamId: string
}

export default function TeamSelector({ teams, activeTeamId }: Props) {
  const router = useRouter()
  const [pending, start] = useTransition()

  if (teams.length <= 1) return null

  function handleChange(teamId: string) {
    start(async () => {
      await setActiveTeam(teamId)
      router.refresh()
    })
  }

  return (
    <div style={{ padding: "12px 20px", borderBottom: "1px solid rgba(122,154,130,0.08)" }}>
      <p className="sb-group" style={{
        fontFamily: "var(--font-mono), monospace",
        fontSize: 8, fontWeight: 700, letterSpacing: "0.14em",
        color: "rgba(122,154,130,0.4)",
        textTransform: "uppercase", marginBottom: 6,
      }}>
        Équipe active
      </p>
      <select
        value={activeTeamId}
        disabled={pending}
        onChange={e => handleChange(e.target.value)}
        className="sb-label"
        style={{
          fontFamily: "var(--font-body), sans-serif",
          fontWeight: 400, fontSize: 12,
          backgroundColor: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(122,154,130,0.15)",
          borderRadius: 8, padding: "6px 10px",
          color: "rgba(255,255,255,0.85)",
          width: "100%", outline: "none", cursor: pending ? "default" : "pointer",
        }}
      >
        {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>
    </div>
  )
}
