"use client"

import { useState, useRef, useCallback, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import Pitch from "./Pitch"
import PlayerToken from "./PlayerToken"
import ArrowLayer from "./ArrowLayer"
import PlaybackControls from "./PlaybackControls"
import { FORMATIONS, mirrorY } from "@/lib/formations"
import { ANIMATIONS } from "@/lib/animations"
import { SITUATIONS, PHASES } from "@/lib/situations"
import type { Situation } from "@/lib/situations"
import { REACTIONS, BASE_POSITIONS, getZone } from "@/lib/reactions"
import AppelLayer from "./AppelLayer"
import ZoneOverlay from "./ZoneOverlay"
import BallToken from "./BallToken"
import type { Player } from "@/types"
import type { TacticAnim, AnimStep } from "@/lib/animations"
import type { Block, Zone } from "@/lib/reactions"
import type { AppelArrow } from "./AppelLayer"
import { computeTargetPositions } from "@/lib/engine/engine"
import type { PossessionState } from "@/lib/engine/rules"

function buildPlayers(formationId: string, team: "red" | "blue"): Player[] {
  const formation = FORMATIONS.find(f => f.id === formationId) ?? FORMATIONS[0]
  const positions = team === "blue" ? mirrorY(formation.players) : formation.players
  return positions.map((p, i) => ({
    id: `${team[0]}${i + 1}`, name: p.name, number: i + 1,
    position: "MID", x: p.x, y: p.y, team,
  }))
}

// Qui a le ballon pendant chaque catégorie d'animation — détermine si l'adversaire
// (équipe non scriptée) défend, attaque ou conteste, donc comment il réagit au ballon.
const ANIM_POSSESSION: Record<TacticAnim["phase"], PossessionState> = {
  possession:   "red",       // avec le ballon — le rouge construit, le bleu défend
  perte:        "blue",      // à la perte — le bleu vient de récupérer, le rouge presse pour le reprendre
  defense:      "blue",      // sans le ballon — le bleu a le ballon, le rouge est organisé en bloc
  recuperation: "red",       // à la récup — le rouge vient de récupérer et lance la transition
}

// Calcule la position de chaque joueur à une étape d'animation. Deux catégories :
// — les joueurs « scriptés » (ceux que l'auteur déplace explicitement à un moment ou un
//   autre de la séquence) suivent fidèlement leur tracé chorégraphié, étape après étape —
//   les flèches de la séquence sont dessinées pour pointer exactement vers eux ;
// — le reste de l'équipe (des deux côtés) se positionne selon la logique par poste du
//   moteur tactique réactif, en fonction du ballon et de la possession — ce qui fait
//   bouger l'équipe comme un collectif cohérent sans toucher à la chorégraphie précise.
function computeAnimFrame(
  anim: TacticAnim,
  step: AnimStep,
  ball: { x: number; y: number },
  prev: Record<string, { x: number; y: number }>,
): Record<string, { x: number; y: number }> {
  const scripted = new Set<string>()
  for (const s of anim.steps) {
    if (s.moves) for (const id of Object.keys(s.moves)) scripted.add(id)
  }

  const possession = ANIM_POSSESSION[anim.phase] ?? "contested"
  const reactive = computeTargetPositions(ball, possession)

  const next: Record<string, { x: number; y: number }> = {}
  for (const id of Object.keys(reactive)) {
    next[id] = scripted.has(id) ? (prev[id] ?? reactive[id]) : reactive[id]
  }
  return { ...next, ...(step.moves ?? {}) }
}

// Calcule le placement des 22 joueurs pour une situation (schéma figé). Les deux équipes
// sont positionnées par le moteur tactique réactif autour du même ballon — elles forment
// donc un bloc cohérent l'une par rapport à l'autre (fini les « deux équipes chacune de
// leur côté »). Les joueurs explicitement désignés par une flèche du schéma gardent leur
// emplacement choisi par l'auteur, pour que la flèche reste fidèle à la scène pédagogique.
function computeSituationFrame(situation: Situation): Record<string, { x: number; y: number }> {
  const possession = ANIM_POSSESSION[situation.phase as TacticAnim["phase"]] ?? "contested"
  const reactive = computeTargetPositions(situation.ball, possession)

  const authored: Record<string, { x: number; y: number }> = {}
  for (const p of [...situation.positions.red, ...situation.positions.blue]) {
    authored[p.id] = { x: p.x, y: p.y }
  }

  const featured = new Set<string>()
  for (const arrow of situation.arrows ?? []) {
    for (const pt of [{ x: arrow.x1, y: arrow.y1 }, { x: arrow.x2, y: arrow.y2 }]) {
      let bestId: string | null = null
      let bestDist = Math.hypot(pt.x - situation.ball.x, pt.y - situation.ball.y)
      for (const [id, p] of Object.entries(authored)) {
        const d = Math.hypot(pt.x - p.x, pt.y - p.y)
        if (d < bestDist) { bestDist = d; bestId = id }
      }
      if (bestId) featured.add(bestId)
    }
  }

  const next = { ...reactive }
  for (const id of featured) next[id] = authored[id]
  return next
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
  const [showRoster, setShowRoster] = useState(false)
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
  const [activeSituation,setActiveSituationState]= useState<string | null>(null)
  const [activePhase,    setActivePhase]    = useState<string>("possession")

  // ── Mode du board : un seul outil actif à la fois pour ne pas surcharger la sidebar ──

  // ── Mode Sparring ──
  const [sparring,        setSparring]        = useState(false)
  const [sparringBall,    setSparringBall]    = useState({ x: 50, y: 50 })
  const [sparringBlock,   setSparringBlock]   = useState<Block>("bloc-bas")
  const [currentZone,     setCurrentZone]     = useState<Zone | null>(null)
  const [currentReaction, setCurrentReaction] = useState<{ label:string; description:string } | null>(null)

  const [activeAppels,    setActiveAppels]    = useState<AppelArrow[]>([])
  const [showZones,       setShowZones]       = useState(false)

  const containerRef       = useRef<HTMLDivElement>(null)
  const timerRef           = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Dernière position connue du ballon pendant une animation — sert de référence
  // pour faire réagir l'équipe adverse même sur les étapes qui ne redéfinissent pas `ball`
  const animBallRef        = useRef<{ x: number; y: number }>({ x: 50, y: 50 })
  const activeSituationRef = useRef<string | null>(null)
  const possessionRef      = useRef<"red" | "blue" | null>(null)
  // Wrapper qui garde le ref en sync — utilisé partout à la place du setter brut
  const setActiveSituation = useCallback((v: string | null) => {
    activeSituationRef.current = v
    setActiveSituationState(v)
  }, [])

  const [isMobile,           setIsMobile]           = useState(false)
  const [mobileCtrlOpen,     setMobileCtrlOpen]     = useState(false)

  const applyStep = useCallback((anim: TacticAnim, stepIdx: number) => {
    const step = anim.steps[stepIdx]
    if (!step) return
    // Le ballon de référence : celui de l'étape, sinon le dernier connu (étapes muettes)
    const ball = step.ball ?? animBallRef.current
    animBallRef.current = ball
    setAnimPlayers(prev => computeAnimFrame(anim, step, ball, prev))
    setActiveArrows(step.arrows ?? [])
    // Only update ball when step defines it — keep previous position otherwise
    if (step.ball !== undefined) setActiveBall(step.ball)
    setCurrentStep(stepIdx)
  }, [])

  const startAnim = useCallback((anim: TacticAnim) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    const baseRed  = buildPlayers("4-3-3", "red")
    const baseBlue = buildPlayers("4-4-2", "blue")
    const baseMap: Record<string, { x: number; y: number }> = {}
    baseRed.forEach(p  => { baseMap[p.id] = { x: p.x, y: p.y } })
    baseBlue.forEach(p => { baseMap[p.id] = { x: p.x, y: p.y } })
    const firstStep = anim.steps[0]
    const ball = firstStep.ball ?? { x: 50, y: 50 }
    animBallRef.current = ball
    setAnimPlayers(computeAnimFrame(anim, firstStep, ball, baseMap))
    setActiveAnim(anim); setCurrentStep(0); setIsPlaying(false)
    setActiveArrows(firstStep.arrows ?? [])
    setActiveBall(firstStep.ball)
  }, [])

  // Deep-link : ?anim=<id> ouvre directement l'animation correspondante (ex. depuis un article Concepts)
  const searchParams = useSearchParams()
  useEffect(() => {
    const animId = searchParams.get("anim")
    if (!animId) return
    const anim = ANIMATIONS.find(a => a.id === animId)
    if (!anim) return
    if (sparring) stopSparring()
    setActivePhase(anim.phase)
    startAnim(anim)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
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
  const handleStop  = useCallback(() => {
    setIsPlaying(false); setActiveAnim(null); setAnimPlayers({})
    if (timerRef.current) clearTimeout(timerRef.current)
    // Restore situation context (arrows + ball) without stale closure
    const sit = activeSituationRef.current
      ? SITUATIONS.find(s => s.id === activeSituationRef.current)
      : null
    setActiveArrows(sit?.arrows ?? [])
    setActiveBall(sit?.ball)
  }, [])

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

  // ── Applique la situation choisie (22 joueurs + balle + flèches de contexte) ──
  const applySituation = useCallback((situationId: string) => {
    const situation = SITUATIONS.find(s => s.id === situationId)
    if (!situation) return

    setTransitioning(true)
    setActiveSituation(situationId)
    setActiveAnim(null)
    setAnimPlayers({})

    const frame = computeSituationFrame(situation)
    setPlayers(prev => prev.map(p => {
      const pos = frame[p.id]
      return pos ? { ...p, x: pos.x, y: pos.y } : p
    }))

    setActiveBall(situation.ball)
    setActiveArrows(situation.arrows ?? [])
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

  // Replace l'équipe bleue sur les positions de base d'un bloc donné
  const placeBlueBlock = useCallback((block: Block) => {
    const base = BASE_POSITIONS[block]
    setPlayers(prev => prev.map(p => {
      const pos = base[p.id]
      return pos && p.team === "blue" ? { ...p, x: pos.x, y: pos.y } : p
    }))
  }, [])

  // Changer de bloc en cours de test : repositionne immédiatement et efface la dernière réaction
  const changeSparringBlock = useCallback((block: Block) => {
    setSparringBlock(block)
    placeBlueBlock(block)
    setCurrentZone(null)
    setCurrentReaction(null)
    setActiveArrows([])
  }, [placeBlueBlock])

  // Démarrer le test du bloc défensif — reset le ballon, place le bleu sur son bloc de départ
  const startSparring = useCallback(() => {
    handleStop()
    setActiveSituation(null)
    setSparring(true)
    setSparringBall({ x: 50, y: 50 })
    setCurrentZone(null)
    setCurrentReaction(null)
    setActiveArrows([])
    setShowZones(true) // les zones expliquent le déclenchement des réactions — les afficher d'office
    placeBlueBlock(sparringBlock)
  }, [handleStop, sparringBlock, placeBlueBlock])

  const stopSparring = useCallback(() => {
    setSparring(false)
    setCurrentReaction(null)
    setActiveArrows([])
    setShowZones(false)
    setSparringBall({ x: 50, y: 50 })
    setCurrentZone(null)
  }, [])

  const displayPlayers = players.map(p => ({
    ...p,
    x: animPlayers[p.id]?.x ?? p.x,
    y: animPlayers[p.id]?.y ?? p.y,
  }))

  const activeStep    = activeAnim?.steps[currentStep]
  // Situations (figées) + animations (séquences) du moment de jeu actif, dans une seule liste —
  // elles répondent toutes les deux à "choisis un scénario tactique et regarde-le sur le terrain"
  const phaseSituations = SITUATIONS.filter(s => s.phase === activePhase)
  const phaseAnims      = ANIMATIONS.filter(a => a.phase === activePhase)
  const activeSit     = activeSituation ? SITUATIONS.find(s => s.id === activeSituation) : null
  const activePhaseDef = activeSit ? PHASES.find(p => p.id === activeSit.phase) : null

  // Possession auto : le porteur du ballon est le joueur le plus proche de la balle —
  // on identifie SON id (pas seulement son équipe) pour pouvoir le mettre en évidence sur le terrain
  const ballPos = sparring ? sparringBall : activeBall
  const ballCarrier = useMemo((): { team: "red" | "blue"; playerId: string } | null => {
    if (!ballPos) return null
    let minDist = Infinity
    let closest: { team: "red" | "blue"; playerId: string } | null = null
    for (const p of displayPlayers) {
      const d = Math.hypot(p.x - ballPos.x, p.y - ballPos.y)
      if (d < minDist) { minDist = d; closest = { team: p.team, playerId: p.id } }
    }
    possessionRef.current = closest?.team ?? null
    return closest
  }, [displayPlayers, ballPos])
  const possession = ballCarrier?.team ?? null

  // Joueurs clés / en mouvement à l'étape d'animation courante — donnée déjà présente
  // dans les scénarios (step.highlight), désormais affichée comme un halo sur le terrain
  const highlightedIds = useMemo(() => new Set(activeStep?.highlight ?? []), [activeStep])

  // Durée du déplacement CSS : calée sur la durée réelle de l'étape pendant une animation
  // pour que le mouvement soit continu (et non un saut suivi d'une pause) — sinon une
  // transition fixe plus courte pour les changements de formation/situation/sparring
  const playerTransitionMs = activeAnim
    ? (activeStep?.duration ?? 450)
    : (transitioning || sparring) ? 450 : undefined
  const ballTransitionMs = activeAnim
    ? (activeStep?.duration ?? 450)
    : transitioning ? 450 : 350

  const teamAccent = (t: "red" | "blue") => t === "red"
    ? { border: "rgba(232,16,16,0.6)", bg: "rgba(232,16,16,0.15)", text: "#ff5555", dim: "rgba(232,16,16,0.35)" }
    : { border: "rgba(0,68,232,0.6)",  bg: "rgba(0,68,232,0.15)",  text: "#5599ff", dim: "rgba(0,68,232,0.35)" }

  return (
    <div
      className="flex flex-col md:flex-row h-screen overflow-hidden"
      style={{ background: "#181812" }}
    >
      {/* ── GAUCHE : contrôles ── */}
      <aside
        className="md:w-64 md:h-full shrink-0 flex flex-col border-b md:border-b-0 md:border-r"
        style={{
          backgroundColor: "#1f1f19",
          borderColor: "rgba(122,154,130,0.15)",
        }}
      >
        {/* Mobile toggle */}
        <button
          className="md:hidden flex items-center justify-between px-4 py-3 text-xs transition shrink-0"
          style={{ color: "rgba(255,255,255,0.45)" }}
          onClick={() => setMobileCtrlOpen(o => !o)}
        >
          <span>⚙ Contrôles</span>
          <span className="text-base leading-none">{mobileCtrlOpen ? "▲" : "▼"}</span>
        </button>

        {/* Content wrapper — collapsible on mobile */}
        <div className={`flex flex-row md:flex-col gap-3 px-4 py-2 md:py-4 overflow-x-auto md:overflow-y-auto md:overflow-x-hidden flex-1 ${isMobile && !mobileCtrlOpen ? "hidden" : ""}`}>

        {/* Titre + retour */}
        <div className="hidden md:block shrink-0">
          <a href="/tactique"
            className="transition mb-3 inline-block"
            style={{ fontFamily:"var(--font-mono),monospace", fontSize:10, letterSpacing:"0.06em", color:"rgba(122,154,130,0.45)" }}>
            ← TACTIQUE
          </a>
          <h1 style={{
            fontFamily:"var(--font-display),system-ui,sans-serif",
            fontWeight:900, fontSize:22, letterSpacing:"0.05em",
            color:"rgba(255,255,255,0.92)", lineHeight:1,
          }}>FOOTBOARD</h1>
          <p style={{ fontFamily:"var(--font-mono),monospace", fontSize:9, letterSpacing:"0.08em", color:"rgba(122,154,130,0.5)", marginTop:4 }}>
            GLISSE · ANIME · SIMULE
          </p>
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

        <Section label="Moment de jeu">
          <div className="grid grid-cols-2 gap-1">
            {PHASES.map(phase => {
              const isActive = activePhase === phase.id
              return (
                <button key={phase.id}
                  onClick={() => { if (sparring) stopSparring(); setActivePhase(phase.id) }}
                  className="py-2 px-2 rounded-lg text-left transition"
                  style={{
                    backgroundColor: isActive ? phase.dim : "rgba(255,255,255,0.04)",
                    border: `1px solid ${isActive ? phase.color + "55" : "rgba(255,255,255,0.08)"}`,
                  }}>
                  <p className="text-xs font-bold leading-tight"
                    style={{ color: isActive ? phase.color : "rgba(255,255,255,0.5)" }}>
                    {phase.label}
                  </p>
                  <p className="text-[9px] mt-0.5 leading-tight"
                    style={{ color: isActive ? phase.color + "99" : "rgba(255,255,255,0.2)" }}>
                    {phase.sublabel}
                  </p>
                </button>
              )
            })}
          </div>
        </Section>

        {/* Playback — visible seulement quand une animation tourne */}
        {!sparring && activeAnim && activeStep && (
          <Section label={activeAnim.title}>
            <PlaybackControls
              currentStep={currentStep} totalSteps={activeAnim.steps.length}
              isPlaying={isPlaying} stepLabel={activeStep.label} stepInfo={activeStep.info}
              onPlay={handlePlay} onPause={handlePause}
              onNext={handleNext} onPrev={handlePrev} onStop={handleStop}
            />
          </Section>
        )}

        {/* Schémas, animations et test du bloc défensif du moment de jeu actif — une seule liste,
            le test du bloc défensif est une situation comme une autre (phase "Sans le ballon") */}
        <Section label="Situations" className="flex-1">
          {sparring ? (
            <div className="flex flex-col gap-2">
              <p className="text-[11px] leading-relaxed" style={{ color:"rgba(255,255,255,0.4)" }}>
                Glisse le ballon jaune sur le terrain — l'équipe bleue se replace en bloc selon la zone où il se trouve.
              </p>
              <div className="grid grid-cols-3 gap-1">
                {(["bloc-bas","bloc-median","bloc-haut"] as Block[]).map(b => {
                  const labels: Record<Block, string> = { "bloc-bas": "Bloc bas", "bloc-median": "Bloc médian", "bloc-haut": "Bloc haut" }
                  return (
                    <button key={b} onClick={() => changeSparringBlock(b)}
                      className="py-1.5 px-1 rounded-lg text-xs font-semibold transition text-center"
                      style={{
                        backgroundColor: sparringBlock === b ? "rgba(85,153,255,0.18)" : "rgba(255,255,255,0.04)",
                        border: sparringBlock === b ? "1px solid rgba(85,153,255,0.4)" : "1px solid rgba(255,255,255,0.08)",
                        color: sparringBlock === b ? "#5599ff" : "rgba(255,255,255,0.35)",
                      }}>
                      {labels[b]}
                    </button>
                  )
                })}
              </div>
              {currentReaction && (
                <div className="p-2.5 rounded-lg"
                  style={{ backgroundColor:"rgba(85,153,255,0.1)", border:"1px solid rgba(85,153,255,0.25)" }}>
                  <p className="text-xs font-bold mb-0.5" style={{ color:"#5599ff" }}>{currentReaction.label}</p>
                  <p className="text-[10px] leading-relaxed" style={{ color:"rgba(255,255,255,0.45)" }}>{currentReaction.description}</p>
                </div>
              )}
              <button onClick={stopSparring}
                className="w-full py-1.5 rounded-lg text-xs font-semibold transition"
                style={{ border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.4)" }}>
                ■ Quitter le test du bloc
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {phaseSituations.map(s => {
                const isActive = activeSituation === s.id
                return (
                  <button key={s.id} onClick={() => applySituation(s.id)}
                    className="text-left px-3 py-2.5 rounded-xl transition"
                    style={{
                      backgroundColor: isActive ? "rgba(122,154,130,0.12)" : "rgba(122,154,130,0.03)",
                      border: `1px solid ${isActive ? "rgba(122,154,130,0.4)" : "rgba(122,154,130,0.1)"}`,
                    }}>
                    <p style={{
                      fontFamily:"var(--font-display),system-ui,sans-serif",
                      fontWeight:700, fontSize:13, letterSpacing:"0.02em",
                      color: isActive ? "#7A9A82" : "rgba(255,255,255,0.85)",
                    }}>
                      {s.label}
                    </p>
                    <p style={{ fontFamily:"var(--font-body),sans-serif", fontSize:10, marginTop:2, color:"rgba(122,154,130,0.5)", lineHeight:1.4 }}>
                      {s.description}
                    </p>
                  </button>
                )
              })}
              {phaseAnims.map(anim => {
                const isActive = activeAnim?.id === anim.id
                return (
                  <button key={anim.id} onClick={() => startAnim(anim)}
                    className="text-left px-3 py-2.5 rounded-xl transition"
                    style={{
                      backgroundColor: isActive ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${isActive ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)"}`,
                      boxShadow: isActive ? "0 0 16px rgba(255,255,255,0.06)" : "none",
                    }}>
                    <p className="text-xs font-bold flex items-center gap-1.5"
                      style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.85)" }}>
                      <span style={{ color:"#7A9A82" }}>▶</span>{anim.title}
                    </p>
                    <p style={{ fontFamily:"var(--font-body),sans-serif", fontSize:10, marginTop:2, color:"rgba(255,255,255,0.4)", lineHeight:1.4 }}>
                      {anim.summary}
                    </p>
                  </button>
                )
              })}
              {/* Test du bloc défensif — une situation interactive parmi les autres, pour la phase "Sans le ballon" */}
              {activePhase === "defense" && (
                <button onClick={() => { if (activeAnim) handleStop(); startSparring() }}
                  className="text-left px-3 py-2.5 rounded-xl transition"
                  style={{
                    backgroundColor: "rgba(85,153,255,0.06)",
                    border: "1px solid rgba(85,153,255,0.2)",
                  }}>
                  <p className="text-xs font-bold flex items-center gap-1.5" style={{ color: "#5599ff" }}>
                    <span>⛊</span> Tester le replacement du bloc bleu
                  </p>
                  <p style={{ fontFamily:"var(--font-body),sans-serif", fontSize:10, marginTop:2, color:"rgba(255,255,255,0.4)", lineHeight:1.4 }}>
                    Prends le contrôle du ballon et observe comment le bloc adverse se replace selon la zone
                  </p>
                </button>
              )}
            </div>
          )}
        </Section>

        {/* Reset */}
        {!activeAnim && !sparring && (
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

        </div>{/* end content wrapper */}
      </aside>

      {/* ── DROITE : terrain ── */}
      <main className="flex-1 flex items-center justify-center p-3 md:p-5 order-first md:order-none">
        <div
          ref={containerRef}
          className="relative rounded-2xl overflow-hidden"
          style={{
            height: isMobile
              ? undefined
              : hasClub && mode === "club"
                ? "min(calc(100vh - 2.5rem), calc((100vw - 32rem) * 1.5))"
                : "min(calc(100vh - 2.5rem), calc((100vw - 17rem) * 1.5))",
            width: isMobile
              ? `min(calc(100vw - 24px), calc((100vh - ${mobileCtrlOpen ? 225 : 92}px) / 1.5))`
              : undefined,
            aspectRatio: "600 / 900",
            boxShadow: "0 0 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)",
            touchAction: "none",
          }}
        >
          <Pitch />
          <ZoneOverlay visible={showZones} activeZone={sparring ? currentZone : null} />
          <ArrowLayer
            arrows={activeArrows ?? []}
            ball={sparring ? undefined : activeBall}
          />
          <AppelLayer appels={activeAppels} />
          {displayPlayers.map(player => (
            <PlayerToken
              key={player.id} id={player.id} label={player.name}
              x={player.x} y={player.y} team={player.team}
              transitionMs={playerTransitionMs}
              hasBall={!!ballPos && ballCarrier?.playerId === player.id}
              highlighted={highlightedIds.has(player.id)}
              containerRef={containerRef} onPositionUpdate={updatePosition}
            />
          ))}
          {/* Ballon sparring (draggable par l'user) */}
          {sparring && (
            <BallToken
              x={sparringBall.x}
              y={sparringBall.y}
              draggable={true}
              possession={possession}
              containerRef={containerRef}
              onPositionUpdate={handleSparringBall}
            />
          )}
          {/* Ballon animation (non draggable) — plain div, CSS transition garantie */}
          {!sparring && activeBall && (
            <BallToken
              x={activeBall.x}
              y={activeBall.y}
              draggable={false}
              transitionMs={ballTransitionMs}
              possession={possession}
              containerRef={containerRef}
              onPositionUpdate={() => {}}
            />
          )}

          {/* ── Indicateur possession + attaque/défense ── */}
          {possession && ballPos && (
            <div className="absolute top-3 left-1/2 z-20 pointer-events-none"
              style={{ transform: "translateX(-50%)", whiteSpace: "nowrap" }}>
              <div style={{
                backgroundColor: "rgba(4,6,10,0.76)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                borderRadius: 100,
                padding: "5px 14px",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                gap: 16,
                alignItems: "center",
              }}>
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  color: possession === "red" ? "#ff5555" : "rgba(255,255,255,0.3)",
                  transition: "color 0.3s",
                }}>
                  ● Rouge — {possession === "red" ? "Attaque" : "Défense"}
                </span>
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  color: possession === "blue" ? "#5599ff" : "rgba(255,255,255,0.3)",
                  transition: "color 0.3s",
                }}>
                  ● Bleu — {possession === "blue" ? "Attaque" : "Défense"}
                </span>
              </div>
            </div>
          )}

          {/* ── Overlay : label étape (animation) ── */}
          {activeAnim && activeStep && (
            <div className="absolute bottom-3 left-3 right-3 z-20 pointer-events-none">
              <div style={{
                backgroundColor: "rgba(4,6,10,0.78)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                borderRadius: 12,
                padding: "10px 14px",
                border: "1px solid rgba(255,255,255,0.1)",
              }}>
                <div className="flex items-start justify-between gap-3">
                  <p style={{ color: "#ffffff", fontWeight: 700, fontSize: 13, lineHeight: 1.3 }}>
                    {activeStep.label}
                  </p>
                  <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, whiteSpace: "nowrap", flexShrink: 0 }}>
                    {currentStep + 1} / {activeAnim.steps.length}
                  </span>
                </div>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 4, lineHeight: 1.4 }}>
                  {activeStep.info}
                </p>
              </div>
            </div>
          )}

          {/* ── Overlay : phase + situation (pas d'animation active) ── */}
          {activeSit && activePhaseDef && !activeAnim && (
            <div className="absolute bottom-3 left-3 right-3 z-20 pointer-events-none">
              <div style={{
                backgroundColor: "rgba(4,6,10,0.78)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                borderRadius: 12,
                padding: "10px 14px",
                border: `1px solid ${activePhaseDef.color}33`,
              }}>
                <div className="flex items-center gap-2 mb-1">
                  <span style={{
                    width: 7, height: 7, borderRadius: "50%",
                    backgroundColor: activePhaseDef.color,
                    display: "inline-block", flexShrink: 0,
                  }} />
                  <span style={{ color: activePhaseDef.color, fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    {activePhaseDef.sublabel}
                  </span>
                </div>
                <p style={{ color: "#ffffff", fontWeight: 700, fontSize: 13, lineHeight: 1.3 }}>
                  {activeSit.label}
                </p>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, marginTop: 3, lineHeight: 1.4 }}>
                  {activeSit.description}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── DROITE : effectif COLLAPSIBLE (uniquement si club + mode club) ── */}
      {hasClub && mode === "club" && (
        <>
          {/* Bouton flottant pour ouvrir */}
          {!showRoster && (
            <button onClick={() => setShowRoster(true)}
              className="hidden md:flex items-center gap-2 absolute top-5 right-5 z-30 px-3 py-2 rounded-xl text-xs font-bold transition hover:opacity-90"
              style={{
                backdropFilter: "blur(12px)",
                backgroundColor: "rgba(255,255,255,0.1)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.2)",
              }}>
              👥 Effectif
            </button>
          )}

          {/* Panel collapsible */}
          {showRoster && (
            <aside
              className="hidden md:flex md:w-64 md:h-full shrink-0 flex-col gap-3 px-4 py-4 overflow-y-auto border-l relative"
              style={{
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                backgroundColor: "rgba(0,0,0,0.55)",
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/25">Effectif</p>
                  <h2 className="text-sm font-bold text-white mt-0.5">{clubData!.club.name}</h2>
                  <p className="text-[10px] text-white/30 mt-0.5">{clubData!.players.length} joueurs</p>
                </div>
                <button onClick={() => setShowRoster(false)}
                  className="text-white/40 hover:text-white text-lg leading-none transition px-2"
                  title="Fermer">
                  ✕
                </button>
              </div>

              <Divider />

              <RosterPanel clubPlayers={clubData!.players} onFieldIds={players.filter(p => p.team === "red").map(p => p.id)} />
            </aside>
          )}
        </>
      )}
    </div>
  )
}

function RosterPanel({ clubPlayers, onFieldIds }: {
  clubPlayers: ClubPlayerLite[]
  onFieldIds: string[]
}) {
  const onFieldSet = new Set(onFieldIds)
  const byPos: Record<string, ClubPlayerLite[]> = { GK:[], DEF:[], MIL:[], ATT:[] }
  clubPlayers.forEach(p => { (byPos[p.position] ?? byPos.MIL).push(p) })

  const labels = { GK:"Gardiens", DEF:"Défenseurs", MIL:"Milieux", ATT:"Attaquants" }
  const colors = { GK:"#c084fc", DEF:"#4ade80", MIL:"#60a5fa", ATT:"#f87171" }

  return (
    <div className="flex flex-col gap-3">
      {(["GK","DEF","MIL","ATT"] as const).map(pos => {
        const group = byPos[pos]
        if (!group?.length) return null
        return (
          <div key={pos}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5"
              style={{ color: colors[pos] }}>
              {labels[pos]} ({group.length})
            </p>
            <div className="flex flex-col gap-1">
              {group.sort((a,b) => (a.number ?? 99) - (b.number ?? 99)).map(p => {
                const isOnField    = onFieldSet.has(p.id)
                const isInjured    = p.status === "injured"
                const isSuspended  = p.status === "suspended"
                const isUnavailable = isInjured || isSuspended

                return (
                  <div key={p.id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition"
                    style={{
                      backgroundColor: isOnField ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.02)",
                      border: isOnField ? `1px solid ${colors[pos]}55` : "1px solid rgba(255,255,255,0.05)",
                      opacity: isUnavailable ? 0.4 : 1,
                    }}>
                    <span className="text-[10px] font-bold w-5 text-center"
                      style={{ color: isOnField ? colors[pos] : "rgba(255,255,255,0.3)" }}>
                      {p.number ?? "—"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">
                        {p.first_name} {p.last_name}
                      </p>
                    </div>
                    {isOnField && (
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors[pos] }} />
                    )}
                    {isInjured && <span className="text-[9px]" title="Blessé">🤕</span>}
                    {isSuspended && <span className="text-[9px]" title="Suspendu">🟨</span>}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      <p className="text-[10px] text-white/25 mt-2 leading-relaxed">
        ● = sur le terrain · 🤕 blessé · 🟨 suspendu
      </p>
    </div>
  )
}

function Divider() {
  return <hr className="shrink-0 hidden md:block" style={{ borderColor:"rgba(122,154,130,0.12)" }} />
}

function Section({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`shrink-0 md:shrink flex flex-col gap-1.5 min-w-44 md:min-w-0 ${className}`}>
      <p style={{
        fontFamily:"var(--font-mono),monospace", fontSize:9,
        letterSpacing:"0.12em", textTransform:"uppercase",
        color:"rgba(122,154,130,0.45)",
      }}>{label}</p>
      {children}
    </div>
  )
}

function FormSelect({ team, value, onChange }: { team: "red" | "blue"; value: string; onChange: (v: string) => void }) {
  const color = team === "red" ? "#c07070" : "#7A9A82"
  const label = team === "red" ? "ROUGE" : "BLEU"
  return (
    <div>
      <label style={{
        fontFamily:"var(--font-mono),monospace", fontSize:9, letterSpacing:"0.1em",
        fontWeight:700, color,
      }}>● {label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="mt-0.5 w-full text-xs rounded-lg px-2 py-1.5 cursor-pointer focus:outline-none"
        style={{
          fontFamily:"var(--font-mono),monospace",
          color:"rgba(255,255,255,0.75)",
          backgroundColor:"rgba(122,154,130,0.06)",
          border:"1px solid rgba(122,154,130,0.18)",
        }}>
        {FORMATIONS.map(f => (
          <option key={f.id} value={f.id} style={{ backgroundColor: "#1f1f19" }}>
            {f.label} — {f.description}
          </option>
        ))}
      </select>
    </div>
  )
}
