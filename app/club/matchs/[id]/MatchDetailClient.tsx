"use client"

import { useState, useTransition } from "react"
import { updateResult, upsertPlayerStat } from "../actions"
import MatchPitch from "./MatchPitch"

interface Player {
  id: string; first_name: string; last_name: string
  position: string; number?: number; status?: string
}

interface Stat {
  player_id: string
  goals: number; assists: number
  yellow_cards: number; red_cards: number; minutes_played: number
}

interface Props {
  matchId: string
  match: any
  players: Player[]
  stats: Stat[]
  played: boolean
}

type Tab = "composition" | "resultat" | "stats"

export default function MatchDetailClient({ matchId, match, players, stats: initialStats, played }: Props) {
  const [tab, setTab] = useState<Tab>(played ? "resultat" : "composition")

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit"
        style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
        {(["composition","resultat","stats"] as Tab[]).map(t => {
          const labels = { composition:"Composition", resultat:"Résultat", stats:"Stats joueurs" }
          return (
            <button key={t} onClick={() => setTab(t)}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition"
              style={{
                backgroundColor: tab === t ? "rgba(255,255,255,0.1)" : "transparent",
                color: tab === t ? "white" : "rgba(255,255,255,0.4)",
                border: tab === t ? "1px solid rgba(255,255,255,0.15)" : "1px solid transparent",
              }}>
              {labels[t]}
            </button>
          )
        })}
      </div>

      {tab === "composition" && <MatchPitch matchId={matchId} match={match} players={players} />}
      {tab === "resultat"    && <ResultatTab matchId={matchId} match={match} />}
      {tab === "stats"       && <StatsTab matchId={matchId} players={players} initialStats={initialStats} />}
    </div>
  )
}

// ─── RÉSULTAT ─────────────────────────────────────────────────

function ResultatTab({ matchId, match }: { matchId: string; match: any }) {
  const [gf, setGf] = useState(match.goals_for ?? 0)
  const [ga, setGa] = useState(match.goals_against ?? 0)
  const [pending, start] = useTransition()
  const [saved, setSaved] = useState(false)

  function handleSave() {
    start(async () => {
      await updateResult(matchId, gf, ga)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  const result = gf > ga ? "Victoire" : gf < ga ? "Défaite" : "Match nul"
  const color  = gf > ga ? "#4ade80"   : gf < ga ? "#f87171" : "#94a3b8"

  return (
    <div className="max-w-md mx-auto">
      <div className="p-6 rounded-2xl mb-6"
        style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
        <p className="text-center text-sm text-gray-400 mb-4">Saisir le score</p>
        <div className="flex items-center justify-center gap-6">
          <div className="text-center flex-1">
            <p className="text-xs text-gray-400 mb-2">Mon Club</p>
            <input type="number" min="0" value={gf} onChange={e => setGf(Number(e.target.value))}
              className="w-full text-center text-4xl font-black text-white rounded-xl py-3 focus:outline-none"
              style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }} />
          </div>
          <span className="text-2xl font-black text-gray-500">–</span>
          <div className="text-center flex-1">
            <p className="text-xs text-gray-400 mb-2">{match.opponent}</p>
            <input type="number" min="0" value={ga} onChange={e => setGa(Number(e.target.value))}
              className="w-full text-center text-4xl font-black text-white rounded-xl py-3 focus:outline-none"
              style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }} />
          </div>
        </div>
        <p className="text-center mt-4 text-sm font-bold" style={{ color }}>{result}</p>
      </div>
      <button onClick={handleSave} disabled={pending}
        className="w-full py-3 rounded-xl text-sm font-bold transition disabled:opacity-50"
        style={{ backgroundColor: saved ? "#4ade80" : "white", color: saved ? "white" : "black" }}>
        {saved ? "✓ Résultat enregistré" : pending ? "..." : "💾 Enregistrer le résultat"}
      </button>
    </div>
  )
}

// ─── STATS JOUEURS ────────────────────────────────────────────

function StatsTab({ matchId, players, initialStats }: { matchId: string; players: Player[]; initialStats: Stat[] }) {
  const [stats, setStats] = useState<Record<string, Stat>>(() => {
    const map: Record<string, Stat> = {}
    players.forEach(p => {
      const s = initialStats.find(s => s.player_id === p.id)
      map[p.id] = s ?? {
        player_id: p.id, goals: 0, assists: 0,
        yellow_cards: 0, red_cards: 0, minutes_played: 0,
      }
    })
    return map
  })
  const [, start] = useTransition()

  function update(playerId: string, key: keyof Stat, value: number) {
    const newStat = { ...stats[playerId], [key]: value }
    setStats(prev => ({ ...prev, [playerId]: newStat }))
    start(async () => {
      const { player_id, ...rest } = newStat
      await upsertPlayerStat(matchId, playerId, rest)
    })
  }

  return (
    <div>
      <p className="text-xs text-gray-400 mb-4">
        Cliquez +/− pour incrémenter, saisissez directement les minutes
      </p>
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400">Joueur</th>
              <th className="px-2 py-2 text-center text-xs font-semibold text-gray-400">Min</th>
              <th className="px-2 py-2 text-center text-xs font-semibold text-gray-400">⚽</th>
              <th className="px-2 py-2 text-center text-xs font-semibold text-gray-400">🅐</th>
              <th className="px-2 py-2 text-center text-xs font-semibold text-gray-400">🟨</th>
              <th className="px-2 py-2 text-center text-xs font-semibold text-gray-400">🟥</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p, i) => {
              const s = stats[p.id]
              return (
                <tr key={p.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", backgroundColor: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                  <td className="px-3 py-2 font-semibold text-white text-sm whitespace-nowrap">
                    {p.first_name} {p.last_name}
                  </td>
                  <td className="px-2 py-2">
                    <input type="number" min="0" max="120" value={s.minutes_played}
                      onChange={e => update(p.id, "minutes_played", Number(e.target.value))}
                      className="w-14 text-center text-xs px-1 py-1 rounded text-white focus:outline-none"
                      style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
                  </td>
                  {(["goals","assists","yellow_cards","red_cards"] as const).map(k => (
                    <td key={k} className="px-2 py-2 text-center">
                      <Counter value={s[k]} onChange={v => update(p.id, k, v)} />
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Counter({ value, onChange }: { value: number; onChange: (v:number)=>void }) {
  return (
    <div className="inline-flex items-center gap-1.5">
      <button onClick={() => onChange(Math.max(0, value - 1))}
        className="w-5 h-5 rounded text-xs text-gray-400 hover:bg-white/10 transition">−</button>
      <span className="w-5 text-center text-sm font-bold text-white">{value}</span>
      <button onClick={() => onChange(value + 1)}
        className="w-5 h-5 rounded text-xs text-gray-400 hover:bg-white/10 transition">+</button>
    </div>
  )
}
