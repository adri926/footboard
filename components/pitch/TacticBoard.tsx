"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import Pitch from "./Pitch"
import PlayerToken from "./PlayerToken"
import ArrowLayer from "./ArrowLayer"
import PlaybackControls from "./PlaybackControls"
import { FORMATIONS, mirrorY } from "@/lib/formations"
import { ANIMATIONS, CATEGORIES } from "@/lib/animations"
import { SITUATIONS, COUNTER, ballPosition, CONTEXT_LABEL } from "@/lib/situations"
import { REACTIONS, BASE_POSITIONS, getZone } from "@/lib/reactions"
import BallToken from "./BallToken"
import type { Player } from "@/types"
import type { TacticAnim } from "@/lib/animations"
import type { Block, Zone } from "@/lib/reactions"

function buildPlayers(formationId: string, team: "red" | "blue"): Player[] {
  const formation = FORMATIONS.find(f => f.id === formationId) ?? FORMATIONS[0]
  const positions = team === "blue" ? mirrorY(formation.players) : formation.players
  return positions.map((p, i) => ({
    id: `${team[0]}${i + 1}`, name: p.name, number: i + 1,
    position: "MID", x: p.x, y: p.y, team,
  }))
}

// Construit l'effectif rouge depuis les joueurs réels du club
// Assigne automatiquement les joueurs aux slots de la formation par poste
function buildClubPlayers(formationId: string, clubPlayers: ClubPlayerLite[]): Player[] {
  const formation = FORMATIONS.find(f => f.id === formationId) ?? FORMATIONS[0]
  const slots = formation.players // chaque slot a un nom de poste (GK, RB, etc.)

  // Groupe les joueurs disponibles par poste
  const available = clubPlayers.filter(p => p.status !== "injured" && p.status !== "suspended")
  const byPos: Record<string, ClubPlayerLite[]> = { GK:[], DEF:[], MIL:[], ATT:[] }
  available.forEach(p => { (byPos[p.position] ?? byPos.MIL).push(p) })

  // Pour chaque slot, trouve le meilleur joueur (priorité au même poste)
  const used = new Set<string>()
  const result: Player[] = []

  slots.forEach((slot, i) => {
    const slotPos = inferPosition(slot.name)
    // Cherche dans le bon poste d'abord
    let player = byPos[slotPos]?.find(p => !used.has(p.id))
    // Sinon, n'importe quel joueur disponible
    if (!player) {
      for (const pos of ["MIL","DEF","ATT","GK"]) {
        player = byPos[pos]?.find(p => !used.has(p.id))
        if (player) break
      }
    }
    if (player) used.add(player.id)
    result.push({
      id: player?.id ?? `r${i+1}`,
      name: player ? (player.number?.toString() ?? player.last_name.slice(0,3).toUpperCase()) : slot.name,
      number: player?.number ?? i + 1,
      position: "MID",
      x: slot.x, y: slot.y,
      team: "red",
    })
  })

  return result
}

function inferPosition(slotName: string): string {
  if (slotName === "GK") return "GK"
  if (["RB","LB","CB","RWB","LWB"].includes(slotName)) return "DEF"
  if (["RW","LW","ST","SS","CF"].includes(slotName)) return "ATT"
  return "MIL"
}

interface ClubPlayerLite {
  id: string; first_name: string; last_name: string
  position: string; number?: number; status?: string
}

interface ClubData {
  club: { id: string; name: string }
  players: ClubPlayerLite[]
}

interface Props {
  clubData?: ClubData | null
}

const DEFAULT_RED  = "4-3-3"
const DEFAULT_BLUE = "4-4-2"

export default function TacticBoard({ clubData }: Props = {}) {
  // Mode joueurs : "demo" (génériques) ou "club" (vrais joueurs)
  const hasClub = !!clubData && clubData.players.length > 0
  const [mode, setMode] = useState<"demo" | "club">(hasClub ? "club" : "demo")
  const [redFormation,   setRedFormation]   = useState(DEFAULT_RED)
  const [blueFormation,  setBlueFormation]  = useState(DEFAULT_BLUE)
  const buildRed = useCallback((fId: string) => {
    return hasClub && mode === "club"
      ? buildClubPlayers(fId, clubData!.players)
      : buildPlayers(fId, "red")
  }, [hasClub, mode, clubData])
  const [players,        setPlayers]        = useState<Player[]>([
    ...buildPlayers(DEFAULT_RED, "red"),
    ...buildPlayers(DEFAULT_BLUE, "blue"),
  ])

  // Au montage, si le club est dispo, remplace l'équipe rouge par les vrais joueurs
  useEffect(() => {
    if (hasClub && mode === "club") {
      setPlayers(prev => [
        ...buildClubPlayers(redFormation, clubData!.players),
        ...prev.filter(p => p.team === "blue"),
      ])
    }
  }, [mode, hasClub])
  const [transitioning,  setTransitioning]  = useState(false)
  const [activeAnim,     setActiveAnim]     = useState<TacticAnim | null>(null)
  const [currentStep,    setCurrentStep]    = useState(0)
  const [isPlaying,      setIsPlaying]      = useState(false)
  const [animPlayers,    setAnimPlayers]    = useState<Record<string, { x: number; y: number }>>({})
  const [activeArrows,   setActiveArrows]   = useState<TacticAnim["steps"][0]["arrows"]>([])
  const [activeBall,     setActiveBall]     = useState<{ x: number; y: number } | undefined>()
  const [activeCategory, setActiveCategory] = useState<string>("pressing")
  const [activeSituation,setActiveSituation]= useState<string | null>(null)
  const [situationTeam,  setSituationTeam]  = useState<"red" | "blue">("blue")

  // ── Mode Sparring ──
  const [sparring,        setSparring]        = useState(false)
  const [sparringBall,    setSparringBall]    = useState({ x: 50, y: 50 })
  const [sparringBlock,   setSparringBlock]   = useState<Block>("bloc-bas")
  const [currentZone,     setCurrentZone]     = useState<Zone | null>(null)
  const [currentReaction, setCurrentReaction] = useState<{ label:string; description:string } | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const timerRef     = useRef<ReturnType<typeof setTimeout> | null>(null)

  const applyStep = useCallback((anim: TacticAnim, stepIdx: number) => {
    const step = anim.steps[stepIdx]
    if (!step) return
    setAnimPlayers(prev => ({ ...prev, ...(step.moves ?? {}) }))
    setActiveArrows(step.arrows ?? [])
    setActiveBall(step.ball)
    setCurrentStep(stepIdx)
  }, [])

  const startAnim = useCallback((anim: TacticAnim) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    const base = buildPlayers("4-3-3", "red")
    const baseMap: Record<string, { x: number; y: number }> = {}
    base.forEach(p => { baseMap[p.id] = { x: p.x, y: p.y } })
    setAnimPlayers(baseMap)
    setActiveAnim(anim); setCurrentStep(0); setIsPlaying(false)
    setActiveArrows(anim.steps[0].arrows ?? [])
    setActiveBall(anim.steps[0].ball)
  }, [])

  useEffect(() => {
    if (!isPlaying || !activeAnim) return
    const step = activeAnim.steps[currentStep]
    timerRef.current = setTimeout(() => {
      const next = currentStep + 1
      if (next < activeAnim.steps.length) applyStep(activeAnim, next)
      else setIsPlaying(false)
    }, step.duration)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [isPlaying, currentStep, activeAnim, applyStep])

  const handlePlay  = () => { if (activeAnim) { applyStep(activeAnim, currentStep); setIsPlaying(true) } }
  const handlePause = () => { setIsPlaying(false); if (timerRef.current) clearTimeout(timerRef.current) }
  const handleNext  = () => { if (!activeAnim) return; applyStep(activeAnim, Math.min(currentStep + 1, activeAnim.steps.length - 1)); setIsPlaying(false) }
  const handlePrev  = () => { if (!activeAnim) return; applyStep(activeAnim, Math.max(currentStep - 1, 0)); setIsPlaying(false) }
  const handleStop  = () => {
    setIsPlaying(false); setActiveAnim(null); setAnimPlayers({})
    setActiveArrows([]); setActiveBall(undefined)
    if (timerRef.current) clearTimeout(timerRef.current)
  }

  const changeFormation = useCallback((team: "red" | "blue", formationId: string) => {
    setTransitioning(true)
    if (team === "red") setRedFormation(formationId)
    else setBlueFormation(formationId)
    const newTeam = team === "red" ? buildRed(formationId) : buildPlayers(formationId, "blue")
    setPlayers(prev => [...prev.filter(p => p.team !== team), ...newTeam])
    setActiveSituation(null)
    setActiveBall(undefined)
    setTimeout(() => setTransitioning(false), 500)
  }, [buildRed])

  // ── Applique la situation choisie ET la contre-réaction automatique ──
  const applySituation = useCallback((situationId: string, team: "red" | "blue") => {
    const situation  = SITUATIONS.find(s => s.id === situationId)
    const counterId  = COUNTER[situationId]
    const counter    = SITUATIONS.find(s => s.id === counterId)
    const otherTeam  = team === "red" ? "blue" : "red"
    if (!situation) return

    setTransitioning(true)
    setActiveSituation(situationId)
    setSituationTeam(team)
    setActiveArrows([])

    const teamOverrides  = situation.positions[team]
    const otherOverrides = counter?.positions[otherTeam] ?? []
    const allOverrides   = [...teamOverrides, ...otherOverrides]

    setPlayers(prev => prev.map(p => {
      const ov = allOverrides.find(o => o.id === p.id)
      return ov ? { ...p, x: ov.x, y: ov.y } : p
    }))

    setActiveBall(ballPosition(situationId, team))
    setTimeout(() => setTransitioning(false), 500)
  }, [])

  const updatePosition = useCallback((id: string, x: number, y: number) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, x, y } : p))
  }, [])

  // ── Réaction adversaire quand le ballon change de zone ──
  const handleSparringBall = useCallback((x: number, y: number) => {
    setSparringBall({ x, y })
    const newZone = getZone(x, y)
    if (newZone === currentZone) return
    setCurrentZone(newZone)

    const reaction = REACTIONS[newZone]?.[sparringBlock]
    if (!reaction) return

    setCurrentReaction({ label: reaction.label, description: reaction.description })
    setTransitioning(true)

    // Appliquer les positions de base du bloc + la réaction
    const base = BASE_POSITIONS[sparringBlock]
    const merged = { ...base, ...reaction.moves }

    setPlayers(prev => prev.map(p => {
      const pos = merged[p.id]
      return pos && p.team === "blue" ? { ...p, x: pos.x, y: pos.y } : p
    }))

    if (reaction.arrows?.length) setActiveArrows(reaction.arrows)
    else setActiveArrows([])

    setTimeout(() => setTransitioning(false), 500)
  }, [currentZone, sparringBlock])

  // Démarrer le sparring — reset les positions
  const startSparring = useCallback(() => {
    handleStop()
    setActiveSituation(null)
    setSparring(true)
    setSparringBall({ x: 50, y: 50 })
    setCurrentZone(null)
    setCurrentReaction(null)
    setActiveArrows([])

    // Bleu en bloc bas par défaut au départ
    const base = BASE_POSITIONS[sparringBlock]
    setPlayers(prev => prev.map(p => {
      const pos = base[p.id]
      return pos && p.team === "blue" ? { ...p, x: pos.x, y: pos.y } : p
    }))
  }, [sparringBlock, handleStop])

  const stopSparring = useCallback(() => {
    setSparring(false)
    setCurrentReaction(null)
    setActiveArrows([])
    setSparringBall({ x: 50, y: 50 })
    setCurrentZone(null)
  }, [])

  const displayPlayers = players.map(p => ({
    ...p,
    x: animPlayers[p.id]?.x ?? p.x,
    y: animPlayers[p.id]?.y ?? p.y,
  }))

  const activeStep    = activeAnim?.steps[currentStep]
  const filteredAnims = ANIMATIONS.filter(a => a.category === activeCategory)
  const otherTeam     = situationTeam === "red" ? "blue" : "red"
  const ctx           = activeSituation ? CONTEXT_LABEL[activeSituation] : null

  const teamAccent = (t: "red" | "blue") => t === "red"
    ? { border: "rgba(232,16,16,0.6)", bg: "rgba(232,16,16,0.15)", text: "#ff5555", dim: "rgba(232,16,16,0.35)" }
    : { border: "rgba(0,68,232,0.6)",  bg: "rgba(0,68,232,0.15)",  text: "#5599ff", dim: "rgba(0,68,232,0.35)" }

  return (
    <div
      className="flex flex-col md:flex-row h-screen overflow-hidden"
      style={{ background: "linear-gradient(150deg, #06060e 0%, #060e06 100%)" }}
    >
      {/* ── GAUCHE : contrôles ── */}
      <aside
        className="md:w-64 md:h-full shrink-0 flex flex-row md:flex-col gap-3 px-4 py-4 overflow-x-auto md:overflow-y-auto md:overflow-x-hidden border-b md:border-b-0 md:border-r"
        style={{
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          backgroundColor: "rgba(0,0,0,0.45)",
          borderColor: "rgba(255,255,255,0.1)",
        }}
      >
        {/* Titre + retour */}
        <div className="hidden md:block shrink-0">
          <a href="/tactique" className="text-xs text-white/25 hover:text-white/60 transition mb-2 inline-block">← Tactique</a>
          <h1 className="text-sm font-bold text-white tracking-wide">Footboard</h1>
          <p className="text-xs mt-0.5 text-gray-500">Glisse · anime · simule · affronte</p>
        </div>

        <Divider />

        {/* Toggle Démo / Mon Club */}
        {hasClub && (
          <>
            <Section label="Équipe rouge">
              <div className="flex gap-1 p-1 rounded-lg" style={{ backgroundColor:"rgba(255,255,255,0.04)" }}>
                <button onClick={() => setMode("club")}
                  className="flex-1 py-1.5 rounded-md text-xs font-semibold transition"
                  style={{
                    backgroundColor: mode === "club" ? "rgba(239,68,68,0.25)" : "transparent",
                    color: mode === "club" ? "#fca5a5" : "rgba(255,255,255,0.4)",
                  }}>
                  {clubData!.club.name}
                </button>
                <button onClick={() => setMode("demo")}
                  className="flex-1 py-1.5 rounded-md text-xs font-semibold transition"
                  style={{
                    backgroundColor: mode === "demo" ? "rgba(255,255,255,0.1)" : "transparent",
                    color: mode === "demo" ? "white" : "rgba(255,255,255,0.4)",
                  }}>
                  Démo
                </button>
              </div>
            </Section>
            <Divider />
          </>
        )}

        {/* Formations */}
        <Section label="Formations">
          <FormSelect team="red"  value={redFormation}  onChange={v => changeFormation("red", v)} />
          <FormSelect team="blue" value={blueFormation} onChange={v => changeFormation("blue", v)} />
        </Section>

        <Divider />

        {/* Opposition */}
        <Section label="Simulation">
          {/* Équipe qui choisit */}
          <div className="flex gap-1.5">
            {(["red", "blue"] as const).map(t => {
              const a = teamAccent(t)
              const active = situationTeam === t
              return (
                <button key={t} onClick={() => setSituationTeam(t)}
                  className="flex-1 py-1.5 rounded-lg text-xs font-bold transition"
                  style={{
                    backgroundColor: active ? a.bg : "rgba(255,255,255,0.04)",
                    border: `1px solid ${active ? a.border : "rgba(255,255,255,0.1)"}`,
                    color: active ? a.text : "rgba(255,255,255,0.4)",
                    boxShadow: active ? `0 0 12px ${a.dim}` : "none",
                  }}>
                  ● {t === "red" ? "Rouge" : "Bleu"}
                </button>
              )
            })}
          </div>

          {/* Blocs */}
          <div className="flex gap-1.5 mt-1">
            {SITUATIONS.map(s => {
              const a  = teamAccent(situationTeam)
              const active = activeSituation === s.id
              return (
                <button key={s.id} onClick={() => applySituation(s.id, situationTeam)}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold transition"
                  style={{
                    backgroundColor: active ? a.bg : "rgba(255,255,255,0.04)",
                    border: `1px solid ${active ? a.border : "rgba(255,255,255,0.1)"}`,
                    color: active ? a.text : "rgba(255,255,255,0.45)",
                    boxShadow: active ? `0 0 14px ${a.dim}` : "none",
                  }}>
                  {s.label}
                </button>
              )
            })}
          </div>

          {/* Contexte de match */}
          {ctx && activeSituation && (
            <div className="mt-1.5 rounded-lg p-2.5 flex flex-col gap-1"
              style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: teamAccent(situationTeam).text }} />
                <span className="text-xs text-white font-medium">{ctx.owner}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: teamAccent(otherTeam).text }} />
                <span className="text-xs text-gray-400">{ctx.other}</span>
              </div>
            </div>
          )}
        </Section>

        <Divider />

        {/* ── MODE SPARRING ── */}
        <Section label="Sparring">
          {!sparring ? (
            <div className="flex flex-col gap-2">
              <div>
                <label className="text-xs mb-1 block" style={{ color:"rgba(255,255,255,0.4)" }}>Bloc adverse</label>
                <div className="flex gap-1">
                  {(["bloc-haut","bloc-median","bloc-bas"] as Block[]).map(b => {
                    const labels: Record<Block, string> = { "bloc-haut":"Haut", "bloc-median":"Médian", "bloc-bas":"Bas" }
                    return (
                      <button key={b} onClick={() => setSparringBlock(b)}
                        className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition"
                        style={{
                          backgroundColor: sparringBlock === b ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
                          border: sparringBlock === b ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(255,255,255,0.08)",
                          color: sparringBlock === b ? "white" : "rgba(255,255,255,0.35)",
                        }}>
                        {labels[b]}
                      </button>
                    )
                  })}
                </div>
              </div>
              <button onClick={startSparring}
                className="w-full py-2 rounded-xl text-sm font-bold transition hover:opacity-90"
                style={{ backgroundColor:"rgba(255,255,255,0.9)", color:"black" }}>
                ▶ Lancer le sparring
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {currentReaction ? (
                <div className="p-3 rounded-xl"
                  style={{ backgroundColor:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)" }}>
                  <p className="text-white text-xs font-bold">{currentReaction.label}</p>
                  <p className="text-xs mt-1" style={{ color:"rgba(255,255,255,0.4)" }}>{currentReaction.description}</p>
                </div>
              ) : (
                <div className="p-3 rounded-xl text-center"
                  style={{ backgroundColor:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
                  <p className="text-xs" style={{ color:"rgba(255,255,255,0.3)" }}>
                    🟡 Glisse le ballon sur le terrain
                  </p>
                </div>
              )}
              <button onClick={stopSparring}
                className="w-full py-1.5 rounded-lg text-xs font-semibold transition"
                style={{ border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.4)" }}>
                ■ Arrêter
              </button>
            </div>
          )}
        </Section>

        <Divider />

        {/* Playback */}
        {activeAnim && activeStep && (
          <>
            <Section label={activeAnim.title}>
              <PlaybackControls
                currentStep={currentStep} totalSteps={activeAnim.steps.length}
                isPlaying={isPlaying} stepLabel={activeStep.label} stepInfo={activeStep.info}
                onPlay={handlePlay} onPause={handlePause}
                onNext={handleNext} onPrev={handlePrev} onStop={handleStop}
              />
            </Section>
            <Divider />
          </>
        )}

        {/* Animations */}
        <Section label="Animations" className="flex-1">
          <div className="flex gap-1 flex-wrap mb-1">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className="px-2.5 py-0.5 rounded-full text-xs capitalize transition"
                style={{
                  backgroundColor: activeCategory === cat ? "#ffffff" : "transparent",
                  color: activeCategory === cat ? "#000" : "rgba(255,255,255,0.4)",
                  border: activeCategory === cat ? "none" : "1px solid rgba(255,255,255,0.12)",
                  fontWeight: activeCategory === cat ? "700" : "400",
                }}>
                {cat}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-1">
            {filteredAnims.map(anim => {
              const active = activeAnim?.id === anim.id
              return (
                <button key={anim.id} onClick={() => startAnim(anim)}
                  className="text-left px-3 py-2 rounded-xl transition"
                  style={{
                    backgroundColor: active ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${active ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)"}`,
                    boxShadow: active ? "0 0 16px rgba(255,255,255,0.06)" : "none",
                  }}>
                  <p className="text-white text-xs font-semibold">{anim.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{anim.summary}</p>
                </button>
              )
            })}
          </div>
        </Section>

        {/* Reset */}
        {!activeAnim && (
          <button
            onClick={() => {
              setPlayers([...buildPlayers(redFormation, "red"), ...buildPlayers(blueFormation, "blue")])
              setActiveSituation(null); setActiveBall(undefined)
            }}
            className="shrink-0 text-xs py-1.5 rounded-lg transition text-gray-600 hover:text-gray-300"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
            Réinitialiser
          </button>
        )}
      </aside>

      {/* ── DROITE : terrain ── */}
      <main className="flex-1 flex items-center justify-center p-3 md:p-5 order-first md:order-last">
        <div
          ref={containerRef}
          className="relative rounded-2xl overflow-hidden"
          style={{
            height: "min(calc(100vh - 2.5rem), calc((100vw - 17rem) * 1.5))",
            aspectRatio: "600 / 900",
            boxShadow: "0 0 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)",
          }}
        >
          <Pitch />
          <ArrowLayer
            arrows={activeArrows ?? []}
            ball={sparring ? undefined : activeBall}
          />
          {displayPlayers.map(player => (
            <PlayerToken
              key={player.id} id={player.id} label={player.name}
              x={player.x} y={player.y} team={player.team}
              transitioning={transitioning || !!activeAnim || sparring}
              containerRef={containerRef} onPositionUpdate={updatePosition}
            />
          ))}
          {/* Ballon sparring (draggable par l'user) */}
          {sparring && (
            <BallToken
              x={sparringBall.x}
              y={sparringBall.y}
              draggable={true}
              containerRef={containerRef}
              onPositionUpdate={handleSparringBall}
            />
          )}
          {/* Ballon animation (non draggable) */}
          {!sparring && activeBall && (
            <BallToken
              x={activeBall.x}
              y={activeBall.y}
              draggable={false}
              containerRef={containerRef}
              onPositionUpdate={() => {}}
            />
          )}
        </div>
      </main>
    </div>
  )
}

function Divider() {
  return <hr className="shrink-0 hidden md:block border-white/10" />
}

function Section({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`shrink-0 md:shrink flex flex-col gap-1.5 min-w-44 md:min-w-0 ${className}`}>
      <p className="text-xs uppercase tracking-widest text-white/25">{label}</p>
      {children}
    </div>
  )
}

function FormSelect({ team, value, onChange }: { team: "red" | "blue"; value: string; onChange: (v: string) => void }) {
  const color = team === "red" ? "#ff5555" : "#5599ff"
  return (
    <div>
      <label className="text-xs font-bold" style={{ color }}>● {team === "red" ? "Rouge" : "Bleu"}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="mt-0.5 w-full text-white text-xs rounded-lg px-2 py-1.5 cursor-pointer focus:outline-none"
        style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}>
        {FORMATIONS.map(f => (
          <option key={f.id} value={f.id} style={{ backgroundColor: "#111" }}>
            {f.label} — {f.description}
          </option>
        ))}
      </select>
    </div>
  )
}
