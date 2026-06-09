"use client"

import { FORMATIONS } from "@/lib/formations"
import type { TacticalTeam } from "@/types/tactical"

interface Props {
  team: TacticalTeam
  onTeamChange: (team: TacticalTeam) => void
  formation: string
  onFormationChange: (id: string) => void
}

const TEAM_COLORS: Record<TacticalTeam, string> = { A: "#7A9A82", B: "#e07050" }

// Panneau de droite : équipe à placer + sélecteur de formation — dans la charte Footboard
export default function FormationPanel({ team, onTeamChange, formation, onFormationChange }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-[10px] uppercase tracking-widest mb-1.5" style={{ fontFamily: "var(--font-mono), monospace", color: "rgba(255,255,255,0.3)" }}>
          Équipe à placer
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {(["A", "B"] as TacticalTeam[]).map(t => {
            const isActive = team === t
            const color = TEAM_COLORS[t]
            return (
              <button key={t} onClick={() => onTeamChange(t)}
                className="py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
                style={{
                  backgroundColor: isActive ? `${color}26` : "rgba(255,255,255,0.04)",
                  border: `1px solid ${isActive ? `${color}66` : "rgba(255,255,255,0.08)"}`,
                  color: isActive ? color : "rgba(255,255,255,0.4)",
                }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: color, display: "inline-block" }} />
                Équipe {t}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <label className="text-[10px] uppercase tracking-widest mb-1.5 block" style={{ fontFamily: "var(--font-mono), monospace", color: "rgba(255,255,255,0.3)" }}>
          Formation — équipe {team}
        </label>
        <select value={formation} onChange={e => onFormationChange(e.target.value)}
          className="w-full text-xs rounded-lg px-2.5 py-2 cursor-pointer focus:outline-none"
          style={{
            fontFamily: "var(--font-mono), monospace",
            color: "rgba(255,255,255,0.8)",
            backgroundColor: "rgba(122,154,130,0.06)",
            border: "1px solid rgba(122,154,130,0.18)",
          }}>
          {FORMATIONS.map(f => (
            <option key={f.id} value={f.id} style={{ backgroundColor: "#1f1f19" }}>
              {f.label} — {f.description}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
