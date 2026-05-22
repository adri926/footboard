"use client"

import Link from "next/link"
import { useState, useMemo, useEffect, useCallback } from "react"
import { FORMATIONS } from "@/lib/formations"
import { PLAYERS as MOCK_PLAYERS, CLASSEMENTS as MOCK_CLASSEMENTS } from "@/lib/data"
import { SQUADS } from "@/lib/squads"
import type { Player, Team } from "@/lib/data"

const LIGUES    = Object.keys(MOCK_CLASSEMENTS)
const POSTES    = ["Tous", "ATT", "MIL", "DEF", "GK"]
const SORT_COLS = ["buts","passes","xg","xa","tirs90","dribbles","min"] as const
type SortCol    = typeof SORT_COLS[number]
const TABS      = ["Joueurs", "Équipes", "Comparaisons"] as const
type Tab        = typeof TABS[number]

export default function DataPage() {
  const [tab,    setTab]    = useState<Tab>("Joueurs")
  const [source, setSource] = useState<"mock"|"api"|null>(null)

  return (
    <main className="min-h-[calc(100vh-56px)] text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
          <div>
            <Link href="/" className="text-xs text-white/30 hover:text-white/60 transition mb-2 inline-block">← Accueil</Link>
            <h1 className="text-3xl font-black">Données</h1>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
              {MOCK_PLAYERS.length} joueurs · {LIGUES.length} ligues · saison 2024/25
            </p>
          </div>
          {source && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mt-1"
              style={{
                backgroundColor: source === "api" ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.05)",
                border: source === "api" ? "1px solid rgba(74,222,128,0.3)" : "1px solid rgba(255,255,255,0.1)",
                color: source === "api" ? "#4ade80" : "rgba(255,255,255,0.3)",
              }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: source === "api" ? "#4ade80" : "rgba(255,255,255,0.3)" }}/>
              {source === "api" ? "Données live API-Football" : "Données simulées"}
            </div>
          )}
        </div>

        <div className="flex gap-1 mb-8 p-1 rounded-xl w-fit"
          style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition"
              style={{
                backgroundColor: tab === t ? "rgba(255,255,255,0.1)" : "transparent",
                color: tab === t ? "white" : "rgba(255,255,255,0.35)",
                border: tab === t ? "1px solid rgba(255,255,255,0.15)" : "1px solid transparent",
              }}>
              {t}
            </button>
          ))}
        </div>

        {tab === "Joueurs"      && <JoueursTab />}
        {tab === "Équipes"      && <EquipesTab />}
        {tab === "Comparaisons" && <ComparaisonsTab />}
      </div>
    </main>
  )
}

// ─── JOUEURS ──────────────────────────────────────────────────

function JoueursTab() {
  const [search,  setSearch]  = useState("")
  const [poste,   setPoste]   = useState("Tous")
  const [ligue,   setLigue]   = useState("Toutes")
  const [sortCol, setSortCol] = useState<SortCol>("buts")
  const [sortDir, setSortDir] = useState<"desc"|"asc">("desc")
  const [players, setPlayers] = useState<Player[]>(MOCK_PLAYERS)
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState<"mock"|"api">("mock")

  useEffect(() => {
    setLoading(true)
    fetch(`/api/football/players?ligue=${encodeURIComponent(ligue)}`)
      .then(r => r.json())
      .then(({ data, source }) => { setPlayers(data); setDataSource(source) })
      .catch(() => { setPlayers(ligue === "Toutes" ? MOCK_PLAYERS : MOCK_PLAYERS.filter(p => p.ligue === ligue)) })
      .finally(() => setLoading(false))
  }, [ligue])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return players
      .filter(p => !q || p.nom.toLowerCase().includes(q) || p.club.toLowerCase().includes(q))
      .filter(p => poste === "Tous" || p.poste === poste)
      .filter(p => ligue === "Toutes" || p.ligue === ligue)
      .sort((a, b) => {
        const av = a[sortCol] as number
        const bv = b[sortCol] as number
        return sortDir === "desc" ? bv - av : av - bv
      })
  }, [search, poste, ligue, sortCol, sortDir, players])

  function toggleSort(col: SortCol) {
    if (sortCol === col) setSortDir(d => d === "desc" ? "asc" : "desc")
    else { setSortCol(col); setSortDir("desc") }
  }

  const cols = [
    { key: "mj",         label: "MJ",       sortable: false },
    { key: "min",        label: "Min",       sortable: true  },
    { key: "buts",       label: "Buts",      sortable: true  },
    { key: "passes",     label: "Passe D",   sortable: true  },
    { key: "xg",        label: "xG",        sortable: true  },
    { key: "xa",        label: "xA",        sortable: true  },
    { key: "tirs90",    label: "Tirs/90",   sortable: true  },
    { key: "passes_pct",label: "Passes%",   sortable: false },
    { key: "dribbles",  label: "Drib/90",   sortable: true  },
    { key: "dist",      label: "Dist",      sortable: false },
  ] as const

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-5">
        {/* Recherche */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1 min-w-52"
          style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <span className="text-white/30">🔍</span>
          <input
            className="bg-transparent text-sm text-white placeholder-white/25 outline-none w-full"
            placeholder="Rechercher un joueur ou un club…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <button onClick={() => setSearch("")} className="text-white/30 hover:text-white/60 text-xs">✕</button>}
        </div>

        {/* Poste */}
        <div className="flex gap-1 flex-wrap">
          {POSTES.map(p => (
            <button key={p} onClick={() => setPoste(p)}
              className="px-3 py-2 rounded-xl text-xs font-semibold transition"
              style={{
                backgroundColor: poste === p ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
                border: poste === p ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(255,255,255,0.07)",
                color: poste === p ? "white" : "rgba(255,255,255,0.4)",
              }}>
              {p}
            </button>
          ))}
        </div>

        {/* Ligue */}
        <select value={ligue} onChange={e => setLigue(e.target.value)}
          className="px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer focus:outline-none"
          style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
          <option value="Toutes" style={{ backgroundColor: "#111" }}>Toutes les ligues</option>
          {LIGUES.map(l => <option key={l} value={l} style={{ backgroundColor: "#111" }}>{l}</option>)}
        </select>
      </div>

      <div className="flex items-center justify-between mb-3">
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
          {loading ? "Chargement…" : `${filtered.length} joueur${filtered.length !== 1 ? "s" : ""}`}
        </p>
        <span className="text-[10px] px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: dataSource === "api" ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.04)",
            color: dataSource === "api" ? "#4ade80" : "rgba(255,255,255,0.2)",
            border: `1px solid ${dataSource === "api" ? "rgba(74,222,128,0.2)" : "rgba(255,255,255,0.07)"}`,
          }}>
          {dataSource === "api" ? "● Live" : "● Simulé"}
        </span>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "rgba(255,255,255,0.3)" }}>#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "rgba(255,255,255,0.4)" }}>Joueur</th>
                <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "rgba(255,255,255,0.4)" }}>Club</th>
                <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "rgba(255,255,255,0.4)" }}>Pos</th>
                {cols.map(({ key, label, sortable }) => {
                  const active = sortable && sortCol === key
                  return (
                    <th key={key}
                      onClick={() => sortable && toggleSort(key as SortCol)}
                      className="px-4 py-3 text-xs font-semibold whitespace-nowrap text-center select-none"
                      style={{
                        color: active ? "white" : "rgba(255,255,255,0.4)",
                        cursor: sortable ? "pointer" : "default",
                      }}>
                      {label} {active ? (sortDir === "desc" ? "↓" : "↑") : ""}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={14} className="px-4 py-10 text-center text-sm" style={{ color: "rgba(255,255,255,0.2)" }}>
                    Aucun joueur trouvé
                  </td>
                </tr>
              ) : filtered.map((p, i) => (
                <tr key={`${p.nom}-${i}`}
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    backgroundColor: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)",
                  }}>
                  <td className="px-4 py-3 text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span>{p.nat}</span>
                      <span className="font-semibold text-white whitespace-nowrap">{p.nom}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "rgba(255,255,255,0.45)" }}>{p.club}</td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: p.poste==="ATT" ? "rgba(239,68,68,0.2)" : p.poste==="MIL" ? "rgba(59,130,246,0.2)" : p.poste==="DEF" ? "rgba(34,197,94,0.2)" : "rgba(168,85,247,0.2)",
                        color: p.poste==="ATT" ? "#f87171" : p.poste==="MIL" ? "#60a5fa" : p.poste==="DEF" ? "#4ade80" : "#c084fc",
                      }}>
                      {p.poste}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-center" style={{ color: "rgba(255,255,255,0.5)" }}>{p.mj}</td>
                  <td className="px-4 py-3 text-xs text-center" style={{ color: "rgba(255,255,255,0.35)" }}>{p.min}</td>
                  <StatCell value={p.buts}   max={30} color="#f87171" />
                  <StatCell value={p.passes} max={19} color="#60a5fa" />
                  <StatCell value={p.xg}     max={28} color="#fb923c" dec />
                  <StatCell value={p.xa}     max={16} color="#a78bfa" dec />
                  <td className="px-4 py-3 text-xs text-center" style={{ color: "rgba(255,255,255,0.5)" }}>{p.tirs90}</td>
                  <td className="px-4 py-3 text-xs text-center font-semibold"
                    style={{ color: p.passes_pct >= 90 ? "#4ade80" : p.passes_pct >= 80 ? "rgba(255,255,255,0.7)" : p.passes_pct > 0 ? "#f87171" : "rgba(255,255,255,0.2)" }}>
                    {p.passes_pct > 0 ? `${p.passes_pct}%` : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-center" style={{ color: "rgba(255,255,255,0.5)" }}>{p.dribbles}</td>
                  <td className="px-4 py-3 text-xs text-center" style={{ color: "rgba(255,255,255,0.35)" }}>{p.dist > 0 ? `${p.dist}km` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.1)" }}>
        Données simulées · connecter API-Football pour les stats réelles (clé requise)
      </p>
    </div>
  )
}

// ─── ÉQUIPES ──────────────────────────────────────────────────

function EquipesTab() {
  const [ligue,      setLigue]      = useState("Premier League")
  const [data,       setData]       = useState<Team[]>(MOCK_CLASSEMENTS["Premier League"])
  const [loading,    setLoading]    = useState(false)
  const [dataSource, setDataSource] = useState<"mock"|"api">("mock")
  const [expanded,   setExpanded]   = useState<string | null>(null)
  const [liveSquads, setLiveSquads] = useState<Record<string, any[]>>({})
  const [squadLoading, setSquadLoading] = useState(false)

  useEffect(() => {
    setExpanded(null)
    setLiveSquads({})
    setLoading(true)
    fetch(`/api/football/standings?ligue=${encodeURIComponent(ligue)}`)
      .then(r => r.json())
      .then(({ data: d, source }) => { setData(d); setDataSource(source) })
      .catch(() => setData(MOCK_CLASSEMENTS[ligue] ?? []))
      .finally(() => setLoading(false))
  }, [ligue])

  // Charge tous les effectifs de la ligue en une requête
  useEffect(() => {
    setLiveSquads({})
    setSquadLoading(true)
    fetch(`/api/football/squads?ligue=${encodeURIComponent(ligue)}`)
      .then(r => r.json())
      .then(({ data }) => {
        const map: Record<string, any[]> = {}
        data.forEach((t: any) => { map[t.name] = t.squad })
        setLiveSquads(map)
      })
      .catch(() => {})
      .finally(() => setSquadLoading(false))
  }, [ligue])

  function toggleExpand(club: string) {
    setExpanded(prev => prev === club ? null : club)
  }

  // Trouve l'effectif d'une équipe (live ou mock)
  function getSquad(club: string): any[] | null {
    // Cherche dans les données live (correspondance partielle)
    const liveKey = Object.keys(liveSquads).find(k =>
      k.toLowerCase().includes(club.toLowerCase()) ||
      club.toLowerCase().includes(k.toLowerCase())
    )
    if (liveKey && liveSquads[liveKey]?.length > 0) return liveSquads[liveKey]
    // Fallback mock
    const mockKey = Object.keys(SQUADS).find(k =>
      k.toLowerCase().includes(club.toLowerCase()) ||
      club.toLowerCase().includes(k.toLowerCase())
    )
    return mockKey ? SQUADS[mockKey].players.map(p => ({
      name: p.nom, position: p.poste, nat: p.nat, age: 0, nationality: ""
    })) : null
  }

  return (
    <div>
      <div className="flex gap-2 mb-5 flex-wrap">
        {LIGUES.map(l => (
          <button key={l} onClick={() => setLigue(l)}
            className="px-4 py-2 rounded-xl text-xs font-semibold transition"
            style={{
              backgroundColor: ligue === l ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)",
              border: ligue === l ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.07)",
              color: ligue === l ? "white" : "rgba(255,255,255,0.35)",
            }}>
            {l}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
          {loading ? "Chargement…" : `${data.length} équipes`}
        </p>
        <span className="text-[10px] px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: dataSource === "api" ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.04)",
            color: dataSource === "api" ? "#4ade80" : "rgba(255,255,255,0.2)",
            border: `1px solid ${dataSource === "api" ? "rgba(74,222,128,0.2)" : "rgba(255,255,255,0.07)"}`,
          }}>
          {dataSource === "api" ? "● Live" : "● Simulé"}
        </span>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                {["#","Club","MJ","V","N","D","BP","BC","+/-","Pts","Forme","xG","xGc","Poss",""].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold whitespace-nowrap"
                    style={{ color: "rgba(255,255,255,0.4)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((e, i) => {
                const diff = e.bp - e.bc
                const zoneColor = e.pos <= 4 ? "rgba(59,130,246,0.06)"
                  : e.pos === 5 ? "rgba(250,204,21,0.05)"
                  : e.pos >= data.length - 2 ? "rgba(239,68,68,0.06)"
                  : "transparent"
                return (
                  <>
                  <tr key={e.club} style={{
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    backgroundColor: i % 2 === 0 ? zoneColor : "rgba(255,255,255,0.02)",
                  }}>
                    <td className="px-4 py-3 text-xs font-bold"
                      style={{ color: e.pos <= 4 ? "#60a5fa" : e.pos === 5 ? "#fbbf24" : e.pos >= data.length - 2 ? "#f87171" : "rgba(255,255,255,0.3)" }}>
                      {e.pos}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span>{e.pays}</span>
                        <span className="font-semibold text-white whitespace-nowrap">{e.club}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-center" style={{ color: "rgba(255,255,255,0.5)" }}>{e.mj}</td>
                    <td className="px-4 py-3 text-xs text-center font-semibold" style={{ color: "#4ade80" }}>{e.v}</td>
                    <td className="px-4 py-3 text-xs text-center" style={{ color: "rgba(255,255,255,0.45)" }}>{e.n}</td>
                    <td className="px-4 py-3 text-xs text-center font-semibold" style={{ color: "#f87171" }}>{e.d}</td>
                    <td className="px-4 py-3 text-xs text-center" style={{ color: "rgba(255,255,255,0.6)" }}>{e.bp}</td>
                    <td className="px-4 py-3 text-xs text-center" style={{ color: "rgba(255,255,255,0.4)" }}>{e.bc}</td>
                    <td className="px-4 py-3 text-xs text-center font-semibold"
                      style={{ color: diff > 0 ? "#4ade80" : diff < 0 ? "#f87171" : "rgba(255,255,255,0.4)" }}>
                      {diff > 0 ? `+${diff}` : diff}
                    </td>
                    <td className="px-4 py-3 text-sm text-center font-black text-white">{e.pts}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-0.5">
                        {e.forme.map((f, fi) => {
                          const c: Record<string,string> = { V:"#4ade80", N:"#94a3b8", D:"#f87171" }
                          return (
                            <span key={fi} className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
                              style={{ backgroundColor: c[f]+"25", color: c[f], border: `1px solid ${c[f]}40` }}>
                              {f}
                            </span>
                          )
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-center" style={{ color: "rgba(255,255,255,0.5)" }}>{e.xg}</td>
                    <td className="px-4 py-3 text-xs text-center" style={{ color: "rgba(255,255,255,0.4)" }}>{e.xgc}</td>
                    <td className="px-4 py-3 text-xs text-center" style={{ color: "rgba(255,255,255,0.5)" }}>{e.poss}%</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleExpand(e.club)}
                        className="text-[10px] px-2 py-0.5 rounded-lg transition"
                        style={{
                          backgroundColor: expanded === e.club ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "rgba(255,255,255,0.6)",
                          cursor: "pointer",
                        }}>
                        {squadLoading ? "…" : (expanded === e.club ? "▲" : "▼ Effectif")}
                      </button>
                    </td>
                  </tr>
                  {expanded === e.club && (() => {
                    const squad = getSquad(e.club)
                    if (!squad) return null
                    const byPos: Record<string, any[]> = { GK:[], DEF:[], MIL:[], ATT:[] }
                    squad.forEach((p: any) => { (byPos[p.position] ?? byPos.MIL).push(p) })
                    return (
                      <tr key={`${e.club}-squad`}>
                        <td colSpan={15} style={{ backgroundColor:"rgba(255,255,255,0.02)", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
                          <div className="px-6 py-5">
                            <div className="flex items-center justify-between mb-4">
                              <p className="text-xs font-semibold" style={{ color:"rgba(255,255,255,0.5)" }}>
                                {e.club} — {squad.length} joueurs
                              </p>
                              <span className="text-[10px] px-2 py-0.5 rounded-full"
                                style={{ backgroundColor: liveSquads[Object.keys(liveSquads).find(k=>k.toLowerCase().includes(e.club.toLowerCase())||e.club.toLowerCase().includes(k.toLowerCase()))??""] ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.04)", color: Object.keys(liveSquads).some(k=>k.toLowerCase().includes(e.club.toLowerCase())) ? "#4ade80" : "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                {Object.keys(liveSquads).some(k=>k.toLowerCase().includes(e.club.toLowerCase())) ? "● Live 2025/26" : "● Mock"}
                              </span>
                            </div>
                            {(["GK","DEF","MIL","ATT"] as const).map(pos => {
                              const players = byPos[pos]
                              if (!players?.length) return null
                              const labels = { GK:"Gardiens", DEF:"Défenseurs", MIL:"Milieux", ATT:"Attaquants" }
                              const colors = { GK:"#c084fc", DEF:"#4ade80", MIL:"#60a5fa", ATT:"#f87171" }
                              const bgs    = { GK:"rgba(168,85,247,0.2)", DEF:"rgba(34,197,94,0.2)", MIL:"rgba(59,130,246,0.2)", ATT:"rgba(239,68,68,0.2)" }
                              return (
                                <div key={pos} className="mb-4">
                                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: colors[pos] }}>
                                    {labels[pos]} ({players.length})
                                  </p>
                                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1.5">
                                    {players.map((sp: any, pi: number) => (
                                      <div key={`${sp.name}-${pi}`} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
                                        style={{ backgroundColor:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.05)" }}>
                                        <span className="text-xs shrink-0">{sp.nat}</span>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-xs font-semibold text-white truncate">{sp.name}</p>
                                          <div className="flex items-center gap-1.5 mt-0.5">
                                            <span className="text-[9px] px-1 rounded font-bold"
                                              style={{ backgroundColor: bgs[pos as keyof typeof bgs], color: colors[pos as keyof typeof colors] }}>
                                              {pos}
                                            </span>
                                            {sp.age > 0 && <span className="text-[9px]" style={{ color:"rgba(255,255,255,0.25)" }}>{sp.age} ans</span>}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </td>
                      </tr>
                    )
                  })()}
                  </>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex gap-4 text-xs mt-3" style={{ color: "rgba(255,255,255,0.2)" }}>
        <span><span style={{ color: "#60a5fa" }}>■</span> Ligue des Champions</span>
        <span><span style={{ color: "#fbbf24" }}>■</span> Europa League</span>
        <span><span style={{ color: "#f87171" }}>■</span> Relégation</span>
      </div>
    </div>
  )
}

// ─── COMPARAISONS ─────────────────────────────────────────────

function MiniPitch({ players, color }: { players: Array<{x:number;y:number;name:string}>; color: string }) {
  return (
    <svg viewBox="0 0 60 90" className="w-full h-full">
      <rect width="60" height="90" fill="#07100a"/>
      <rect x="2" y="2" width="56" height="86" fill="#0d1f0e" rx="1"/>
      <rect x="2" y="2" width="56" height="86" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" rx="1"/>
      <line x1="2" y1="45" x2="58" y2="45" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
      <circle cx="30" cy="45" r="7" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"/>
      <rect x="16" y="2" width="28" height="12" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"/>
      <rect x="16" y="76" width="28" height="12" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"/>
      {players.map((p, i) => (
        <g key={i}>
          <circle cx={p.x*0.6} cy={p.y*0.9} r="3.5" fill={color}/>
          <text x={p.x*0.6} y={p.y*0.9+1.2} textAnchor="middle" fontSize="2.4" fill="white" fontWeight="bold">
            {p.name.slice(0,2)}
          </text>
        </g>
      ))}
    </svg>
  )
}

function ComparaisonsTab() {
  const [formA, setFormA] = useState("4-3-3")
  const [formB, setFormB] = useState("4-2-3-1")

  const fmA = FORMATIONS.find(f => f.id === formA)
  const fmB = FORMATIONS.find(f => f.id === formB)

  const countPos = (players: typeof FORMATIONS[0]["players"], posNames: string[]) =>
    players.filter(p => posNames.some(n => p.name.includes(n))).length

  const stats = [
    { label: "Défenseurs", a: countPos(fmA?.players??[], ["CB","RB","LB","WB"]), b: countPos(fmB?.players??[], ["CB","RB","LB","WB"]) },
    { label: "Milieux",    a: countPos(fmA?.players??[], ["CM","CDM","CAM","RM","LM","DM"]), b: countPos(fmB?.players??[], ["CM","CDM","CAM","RM","LM","DM"]) },
    { label: "Attaquants", a: countPos(fmA?.players??[], ["ST","RW","LW","SS","CF"]), b: countPos(fmB?.players??[], ["ST","RW","LW","SS","CF"]) },
  ]

  return (
    <div>
      <div className="flex gap-6 mb-8 flex-wrap">
        <div className="flex-1 min-w-48">
          <label className="text-xs font-bold mb-1.5 block" style={{ color: "#f87171" }}>● Formation A</label>
          <select value={formA} onChange={e => setFormA(e.target.value)}
            className="w-full text-white text-sm rounded-xl px-3 py-2 cursor-pointer focus:outline-none"
            style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(239,68,68,0.3)" }}>
            {FORMATIONS.map(f => <option key={f.id} value={f.id} style={{ backgroundColor: "#111" }}>{f.label} — {f.description}</option>)}
          </select>
        </div>
        <div className="flex items-end pb-2 text-white/20 font-bold text-xl">vs</div>
        <div className="flex-1 min-w-48">
          <label className="text-xs font-bold mb-1.5 block" style={{ color: "#60a5fa" }}>● Formation B</label>
          <select value={formB} onChange={e => setFormB(e.target.value)}
            className="w-full text-white text-sm rounded-xl px-3 py-2 cursor-pointer focus:outline-none"
            style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(59,130,246,0.3)" }}>
            {FORMATIONS.map(f => <option key={f.id} value={f.id} style={{ backgroundColor: "#111" }}>{f.label} — {f.description}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {[{ id:formA, fm:fmA, color:"#e81010" }, { id:formB, fm:fmB, color:"#0040e8" }].map(({ id, fm, color }) => (
          <div key={id}>
            <p className="text-center text-sm font-bold mb-1" style={{ color }}>{id}</p>
            <p className="text-center text-xs mb-3" style={{ color:"rgba(255,255,255,0.3)" }}>{fm?.description}</p>
            <div className="max-w-[180px] mx-auto aspect-[2/3] rounded-xl overflow-hidden"
              style={{ border:"1px solid rgba(255,255,255,0.1)" }}>
              <MiniPitch players={fm?.players ?? []} color={color} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map(({ label, a, b }) => (
          <div key={label} className="p-4 rounded-xl text-center"
            style={{ backgroundColor:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-xs mb-2" style={{ color:"rgba(255,255,255,0.35)" }}>{label}</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-black" style={{ color:"#f87171" }}>{a}</span>
              <span className="text-xs" style={{ color:"rgba(255,255,255,0.2)" }}>vs</span>
              <span className="text-2xl font-black" style={{ color:"#60a5fa" }}>{b}</span>
            </div>
            {a !== b && (
              <p className="text-[10px] mt-1" style={{ color: a > b ? "#f87171" : "#60a5fa" }}>
                {a > b ? "A plus garni" : "B plus garni"}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <Link href="/tactique/animations"
          className="text-sm font-semibold px-5 py-2.5 rounded-xl transition hover:opacity-90 text-black"
          style={{ backgroundColor:"white" }}>
          Tester sur le terrain →
        </Link>
      </div>
    </div>
  )
}

function StatCell({ value, max, color, dec=false }: { value:number; max:number; color:string; dec?:boolean }) {
  return (
    <td className="px-4 py-3 text-xs text-center font-semibold"
      style={{ color, opacity: value === 0 ? 0.2 : 0.35 + (value/max)*0.65 }}>
      {dec ? value.toFixed(1) : value}
    </td>
  )
}
