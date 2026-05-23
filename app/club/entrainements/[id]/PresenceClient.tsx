"use client"

import { useState, useTransition } from "react"
import { updateAttendance } from "../actions"

type Status = "present" | "absent" | "late" | "excused"

const STATUS = {
  present: { label: "Présent",  color: "#4ade80", bg: "rgba(74,222,128,0.15)"  },
  absent:  { label: "Absent",   color: "#f87171", bg: "rgba(248,113,113,0.15)" },
  late:    { label: "Retard",   color: "#fbbf24", bg: "rgba(251,191,36,0.15)"  },
  excused: { label: "Excusé",   color: "#94a3b8", bg: "rgba(148,163,184,0.15)" },
}

const POS_COLORS = {
  GK: "#c084fc", DEF: "#4ade80", MIL: "#60a5fa", ATT: "#f87171"
}

interface Player { id: string; first_name: string; last_name: string; position: string; number?: number }
interface Att     { player_id: string; status: string }

interface Props {
  trainingId: string
  players: Player[]
  attendance: Att[]
}

export default function PresenceClient({ trainingId, players, attendance }: Props) {
  const [statuses, setStatuses] = useState<Record<string, Status>>(() => {
    const map: Record<string, Status> = {}
    players.forEach(p => {
      const a = attendance.find(a => a.player_id === p.id)
      map[p.id] = (a?.status ?? "absent") as Status
    })
    return map
  })
  const [, start] = useTransition()

  function toggle(playerId: string, status: Status) {
    setStatuses(prev => ({ ...prev, [playerId]: status }))
    start(() => updateAttendance(trainingId, playerId, status))
  }

  const present  = Object.values(statuses).filter(s => s === "present").length
  const total    = players.length
  const pct      = total > 0 ? Math.round((present / total) * 100) : 0

  const byPos: Record<string, Player[]> = { GK:[], DEF:[], MIL:[], ATT:[] }
  players.forEach(p => { (byPos[p.position] ?? byPos.MIL).push(p) })

  return (
    <div>
      {/* Résumé */}
      <div className="flex items-center justify-between mb-6 p-4 rounded-2xl"
        style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
        <div>
          <p className="text-2xl font-black text-white">{present}/{total}</p>
          <p className="text-xs text-gray-400">joueurs présents</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black" style={{ color: pct >= 80 ? "#4ade80" : pct >= 60 ? "#fbbf24" : "#f87171" }}>
            {pct}%
          </p>
          <p className="text-xs text-gray-400">taux de présence</p>
        </div>
      </div>

      {/* Légende */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {(Object.entries(STATUS) as [Status, typeof STATUS[Status]][]).map(([key, s]) => (
          <span key={key} className="text-xs px-2.5 py-1 rounded-full font-semibold"
            style={{ backgroundColor: s.bg, color: s.color }}>
            {s.label} ({Object.values(statuses).filter(v => v === key).length})
          </span>
        ))}
      </div>

      {/* Liste par poste */}
      {(["GK","DEF","MIL","ATT"] as const).map(pos => {
        const group = byPos[pos]
        if (!group?.length) return null
        const labels = { GK:"Gardiens", DEF:"Défenseurs", MIL:"Milieux", ATT:"Attaquants" }
        return (
          <div key={pos} className="mb-5">
            <p className="text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color: POS_COLORS[pos] }}>
              {labels[pos]}
            </p>
            <div className="flex flex-col gap-1.5">
              {group.map(p => {
                const current = statuses[p.id] ?? "absent"
                const s = STATUS[current]
                return (
                  <div key={p.id} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                    style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <span className="text-xs text-gray-500 w-6 text-center">{p.number ?? "—"}</span>
                    <p className="flex-1 font-semibold text-white text-sm">{p.first_name} {p.last_name}</p>
                    {/* Boutons de statut */}
                    <div className="flex gap-1">
                      {(Object.entries(STATUS) as [Status, typeof STATUS[Status]][]).map(([key, style]) => (
                        <button key={key} onClick={() => toggle(p.id, key)}
                          className="text-[10px] px-2 py-1 rounded-lg font-semibold transition"
                          style={{
                            backgroundColor: current === key ? style.bg : "rgba(255,255,255,0.04)",
                            color: current === key ? style.color : "rgba(255,255,255,0.25)",
                            border: current === key ? `1px solid ${style.color}40` : "1px solid rgba(255,255,255,0.07)",
                          }}>
                          {style.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
