"use client"

import { useState, useTransition } from "react"
import { updateResult, saveLineup, upsertPlayerStat } from "../actions"

const FORMATIONS = ["4-3-3", "4-2-3-1", "4-4-2", "3-5-2", "5-3-2", "3-4-3", "4-1-4-1"]

const POSITION_SLOTS: Record<string, Array<{ id: string; pos: "GK"|"DEF"|"MIL"|"ATT"; label: string }>> = {
  "4-3-3":   [
    { id:"gk", pos:"GK", label:"GK" },
    { id:"lb", pos:"DEF", label:"LB" }, { id:"cb1", pos:"DEF", label:"CB" },
    { id:"cb2", pos:"DEF", label:"CB" }, { id:"rb", pos:"DEF", label:"RB" },
    { id:"cm1", pos:"MIL", label:"CM" }, { id:"cm2", pos:"MIL", label:"CM" }, { id:"cm3", pos:"MIL", label:"CM" },
    { id:"lw", pos:"ATT", label:"LW" }, { id:"st", pos:"ATT", label:"ST" }, { id:"rw", pos:"ATT", label:"RW" },
  ],
  "4-2-3-1": [
    { id:"gk", pos:"GK", label:"GK" },
    { id:"lb", pos:"DEF", label:"LB" }, { id:"cb1", pos:"DEF", label:"CB" },
    { id:"cb2", pos:"DEF", label:"CB" }, { id:"rb", pos:"DEF", label:"RB" },
    { id:"cdm1", pos:"MIL", label:"CDM" }, { id:"cdm2", pos:"MIL", label:"CDM" },
    { id:"lm", pos:"MIL", label:"LM" }, { id:"cam", pos:"MIL", label:"CAM" }, { id:"rm", pos:"MIL", label:"RM" },
    { id:"st", pos:"ATT", label:"ST" },
  ],
  "4-4-2":   [
    { id:"gk", pos:"GK", label:"GK" },
    { id:"lb", pos:"DEF", label:"LB" }, { id:"cb1", pos:"DEF", label:"CB" },
    { id:"cb2", pos:"DEF", label:"CB" }, { id:"rb", pos:"DEF", label:"RB" },
    { id:"lm", pos:"MIL", label:"LM" }, { id:"cm1", pos:"MIL", label:"CM" },
    { id:"cm2", pos:"MIL", label:"CM" }, { id:"rm", pos:"MIL", label:"RM" },
    { id:"st1", pos:"ATT", label:"ST" }, { id:"st2", pos:"ATT", label:"ST" },
  ],
  "3-5-2":   [
    { id:"gk", pos:"GK", label:"GK" },
    { id:"cb1", pos:"DEF", label:"CB" }, { id:"cb2", pos:"DEF", label:"CB" }, { id:"cb3", pos:"DEF", label:"CB" },
    { id:"lwb", pos:"MIL", label:"LWB" }, { id:"cm1", pos:"MIL", label:"CM" }, { id:"cm2", pos:"MIL", label:"CM" },
    { id:"cm3", pos:"MIL", label:"CM" }, { id:"rwb", pos:"MIL", label:"RWB" },
    { id:"st1", pos:"ATT", label:"ST" }, { id:"st2", pos:"ATT", label:"ST" },
  ],
  "5-3-2":   [
    { id:"gk", pos:"GK", label:"GK" },
    { id:"lwb", pos:"DEF", label:"LWB" }, { id:"cb1", pos:"DEF", label:"CB" }, { id:"cb2", pos:"DEF", label:"CB" },
    { id:"cb3", pos:"DEF", label:"CB" }, { id:"rwb", pos:"DEF", label:"RWB" },
    { id:"cm1", pos:"MIL", label:"CM" }, { id:"cm2", pos:"MIL", label:"CM" }, { id:"cm3", pos:"MIL", label:"CM" },
    { id:"st1", pos:"ATT", label:"ST" }, { id:"st2", pos:"ATT", label:"ST" },
  ],
  "3-4-3":   [
    { id:"gk", pos:"GK", label:"GK" },
    { id:"cb1", pos:"DEF", label:"CB" }, { id:"cb2", pos:"DEF", label:"CB" }, { id:"cb3", pos:"DEF", label:"CB" },
    { id:"lm", pos:"MIL", label:"LM" }, { id:"cm1", pos:"MIL", label:"CM" },
    { id:"cm2", pos:"MIL", label:"CM" }, { id:"rm", pos:"MIL", label:"RM" },
    { id:"lw", pos:"ATT", label:"LW" }, { id:"st", pos:"ATT", label:"ST" }, { id:"rw", pos:"ATT", label:"RW" },
  ],
  "4-1-4-1": [
    { id:"gk", pos:"GK", label:"GK" },
    { id:"lb", pos:"DEF", label:"LB" }, { id:"cb1", pos:"DEF", label:"CB" },
    { id:"cb2", pos:"DEF", label:"CB" }, { id:"rb", pos:"DEF", label:"RB" },
    { id:"cdm", pos:"MIL", label:"CDM" },
    { id:"lm", pos:"MIL", label:"LM" }, { id:"cm1", pos:"MIL", label:"CM" },
    { id:"cm2", pos:"MIL", label:"CM" }, { id:"rm", pos:"MIL", label:"RM" },
    { id:"st", pos:"ATT", label:"ST" },
  ],
}

const POS_COLORS = {
  GK:  { color: "#c084fc", bg: "rgba(192,132,252,0.2)" },
  DEF: { color: "#4ade80", bg: "rgba(74,222,128,0.2)"  },
  MIL: { color: "#60a5fa", bg: "rgba(96,165,250,0.2)"  },
  ATT: { color: "#f87171", bg: "rgba(248,113,113,0.2)" },
}

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

      {tab === "composition" && <CompositionTab matchId={matchId} match={match} players={players} />}
      {tab === "resultat"    && <ResultatTab    matchId={matchId} match={match} />}
      {tab === "stats"       && <StatsTab       matchId={matchId} players={players} initialStats={initialStats} />}
    </div>
  )
}

// ─── COMPOSITION ──────────────────────────────────────────────

function CompositionTab({ matchId, match, players }: { matchId: string; match: any; players: Player[] }) {
  const [formation, setFormation] = useState<string>(match.formation ?? "4-3-3")
  const [lineup, setLineup]       = useState<Record<string, string>>(match.lineup ?? {})
  const [pending, start]          = useTransition()
  const [saved, setSaved]         = useState(false)

  const slots    = POSITION_SLOTS[formation]
  const usedIds  = new Set(Object.values(lineup))
  const available = players.filter(p => p.status !== "injured" && p.status !== "suspended" && !usedIds.has(p.id))
  const filled    = Object.keys(lineup).length

  function changeFormation(newF: string) {
    setFormation(newF)
    setLineup({})
  }

  function assignPlayer(slotId: string, playerId: string) {
    setLineup(prev => {
      const next = { ...prev }
      // Si le joueur est déjà ailleurs, on le retire
      Object.keys(next).forEach(k => { if (next[k] === playerId) delete next[k] })
      next[slotId] = playerId
      return next
    })
  }

  function removePlayer(slotId: string) {
    setLineup(prev => {
      const next = { ...prev }
      delete next[slotId]
      return next
    })
  }

  function handleSave() {
    start(async () => {
      await saveLineup(matchId, lineup, formation)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">

      {/* Formation + Postes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Formation</label>
            <select value={formation} onChange={e => changeFormation(e.target.value)}
              className="px-3 py-2 rounded-xl text-white text-sm cursor-pointer focus:outline-none"
              style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)" }}>
              {FORMATIONS.map(f => <option key={f} value={f} style={{ backgroundColor:"#111" }}>{f}</option>)}
            </select>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-white">{filled}/11</p>
            <p className="text-xs text-gray-400">postes</p>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          {slots.map(slot => {
            const pid = lineup[slot.id]
            const player = pid ? players.find(p => p.id === pid) : null
            const c = POS_COLORS[slot.pos]
            return (
              <div key={slot.id} className="flex items-center gap-3 px-3 py-2 rounded-xl"
                style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded shrink-0"
                  style={{ backgroundColor: c.bg, color: c.color, width: 42, textAlign:"center" }}>
                  {slot.label}
                </span>
                {player ? (
                  <>
                    <p className="flex-1 text-sm font-semibold text-white truncate">
                      {player.first_name} {player.last_name}
                    </p>
                    {player.number && <span className="text-xs text-gray-500">#{player.number}</span>}
                    <button onClick={() => removePlayer(slot.id)}
                      className="text-xs text-gray-500 hover:text-red-400 transition px-1">✕</button>
                  </>
                ) : (
                  <select onChange={e => e.target.value && assignPlayer(slot.id, e.target.value)}
                    defaultValue=""
                    className="flex-1 bg-transparent text-sm text-gray-500 focus:outline-none cursor-pointer">
                    <option value="" style={{ backgroundColor:"#111" }}>+ Assigner un joueur...</option>
                    {available.filter(p => p.position === slot.pos).map(p => (
                      <option key={p.id} value={p.id} style={{ backgroundColor:"#111" }}>
                        {p.first_name} {p.last_name} {p.number ? `(#${p.number})` : ""}
                      </option>
                    ))}
                    {available.filter(p => p.position !== slot.pos).length > 0 && (
                      <>
                        <option disabled style={{ backgroundColor:"#111" }}>──── Autre poste ────</option>
                        {available.filter(p => p.position !== slot.pos).map(p => (
                          <option key={p.id} value={p.id} style={{ backgroundColor:"#111" }}>
                            {p.first_name} {p.last_name} ({p.position})
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                )}
              </div>
            )
          })}
        </div>

        <button onClick={handleSave} disabled={pending}
          className="w-full mt-4 py-2.5 rounded-xl text-sm font-bold transition disabled:opacity-50"
          style={{ backgroundColor: saved ? "#4ade80" : "white", color: saved ? "white" : "black" }}>
          {saved ? "✓ Composition enregistrée" : pending ? "..." : "💾 Enregistrer la composition"}
        </button>
      </div>

      {/* Remplaçants / Convocations */}
      <div>
        <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">Joueurs disponibles ({available.length})</p>
        <div className="flex flex-col gap-1.5 max-h-[600px] overflow-y-auto">
          {available.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              Tous les joueurs disponibles sont alignés
            </p>
          ) : available.map(p => {
            const c = POS_COLORS[p.position as keyof typeof POS_COLORS]
            return (
              <div key={p.id} className="flex items-center gap-3 px-3 py-2 rounded-xl"
                style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: c.bg, color: c.color }}>{p.position}</span>
                <p className="flex-1 text-sm text-white">{p.first_name} {p.last_name}</p>
                {p.number && <span className="text-xs text-gray-500">#{p.number}</span>}
              </div>
            )
          })}
        </div>

        {/* Indisponibles */}
        {players.filter(p => p.status === "injured" || p.status === "suspended").length > 0 && (
          <div className="mt-4">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Indisponibles</p>
            <div className="flex flex-col gap-1">
              {players.filter(p => p.status === "injured" || p.status === "suspended").map(p => (
                <div key={p.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg opacity-50"
                  style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                  <p className="flex-1 text-xs text-gray-400">{p.first_name} {p.last_name}</p>
                  <span className="text-[10px]" style={{ color: p.status === "injured" ? "#f87171" : "#fbbf24" }}>
                    {p.status === "injured" ? "Blessé" : "Suspendu"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
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

  const playersWithStats = players.filter(p => {
    const s = stats[p.id]
    return s && (s.goals || s.assists || s.minutes_played || s.yellow_cards || s.red_cards)
  })
  const playersWithoutStats = players.filter(p => !playersWithStats.includes(p))

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
            {[...playersWithStats, ...playersWithoutStats].map((p, i) => {
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
