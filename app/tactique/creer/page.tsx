"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import Pitch from "@/components/pitch/Pitch"
import BuilderPitch from "@/components/pitch/BuilderPitch"
import {
  FINALITIES, FINALITY_CATEGORIES, TACTICAL_TAGS,
  TRIGGERS, TRIGGER_CATEGORIES, FULL_FORMATION,
  MAX_FRAMES, MAX_BRANCHES, MAX_SQUAD_SELECTION,
  getGhostPlayers, playersFromSelection, suggestTriggerPositions,
  type BuilderPlayer, type FinalityCategory, type TriggerCategory, type SituationFrame,
} from "@/lib/builder"
import { saveBuiltSituation } from "./actions"

const CONFIG_HINTS: Record<string, string> = {
  "1v1": "Duel individuel",
  "2v1": "Supériorité offensive simple",
  "2v2": "Égalité numérique",
  "3v2": "Supériorité numérique",
  "3v3": "Bloc équilibré",
  "4v3": "Avantage collectif",
  "4v4": "Phase de jeu organisée",
  "5v4": "Forte densité dans le dernier tiers",
}

function configHint(home: number, away: number): string {
  const label = `${home}v${away}`
  if (CONFIG_HINTS[label]) return CONFIG_HINTS[label]
  if (home === away) return "Égalité numérique"
  if (home > away) return home - away >= 2 ? "Supériorité numérique" : "Légère supériorité numérique"
  return home - away <= -2 ? "Infériorité numérique" : "Légère infériorité numérique"
}

const FINALITY_HINTS: Record<string, string> = {
  shot:       "Conclure l'action par une frappe cadrée",
  chance:     "Construire une situation de tir",
  combine:    "Avancer par des combinaisons courtes",
  keep:       "Garder la possession sous pression",
  recover:    "Reprendre le ballon à l'adversaire",
  press:      "Empêcher la relance adverse",
  clear:      "Repousser le danger sans prendre de risque",
  "force-long": "Orienter l'adversaire vers le jeu long",
  counter:    "Exploiter l'espace après la récupération",
  "build-out": "Relancer proprement depuis l'arrière",
  fix:        "Attirer l'adversaire pour jouer dans son dos",
}

/* ── Helpers UI ─────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "var(--font-mono), monospace",
      fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
      color: "rgba(122,154,130,0.7)", marginBottom: 10, textTransform: "uppercase",
    }}>
      {children}
    </p>
  )
}

const SQUAD_COLORS = {
  home: { bg: "#8a1f1f", border: "rgba(210,90,90,0.75)", text: "rgba(255,255,255,0.92)" },
  away: { bg: "#2e3e31", border: "rgba(122,154,130,0.65)", text: "rgba(180,220,190,0.95)" },
}

function SquadPicker({ selectedHome, selectedAway, onToggle }: {
  selectedHome: Set<number>
  selectedAway: Set<number>
  onToggle: (team: "home" | "away", index: number) => void
}) {
  return (
    <div className="relative w-full select-none" style={{
      aspectRatio: "600/900",
      boxShadow: "0 0 60px rgba(122,154,130,0.08), 0 0 0 1px rgba(122,154,130,0.15)",
      borderRadius: 16, overflow: "hidden",
    }}>
      <div className="absolute inset-0"><Pitch /></div>

      {/* Légende */}
      <div style={{
        position: "absolute", top: 8, left: 8, right: 8,
        display: "flex", justifyContent: "space-between",
        pointerEvents: "none", zIndex: 20,
      }}>
        {(["home", "away"] as const).map(team => (
          <span key={team} style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 8, fontWeight: 700, letterSpacing: "0.1em",
            color: team === "home" ? "rgba(210,90,90,0.9)" : "rgba(122,154,130,0.9)",
            backgroundColor: "rgba(24,24,18,0.75)",
            padding: "2px 7px", borderRadius: 4,
          }}>
            {team === "home" ? "TON ÉQUIPE" : "ADVERSAIRE"}
          </span>
        ))}
      </div>

      {/* Joueurs en formation, cliquables */}
      {(["home", "away"] as const).map(team =>
        FULL_FORMATION[team].map((slot, i) => {
          const c = SQUAD_COLORS[team]
          const selected = (team === "home" ? selectedHome : selectedAway).has(i)
          return (
            <button key={`${team}-${i}`} onClick={() => onToggle(team, i)} style={{
              position: "absolute",
              left: `${slot.x}%`, top: `${slot.y}%`,
              marginLeft: -15, marginTop: -15,
              width: 30, height: 30, borderRadius: "50%",
              backgroundColor: c.bg,
              border: `2px solid ${selected ? "#f5d84e" : c.border}`,
              boxShadow: selected
                ? "0 0 14px 4px rgba(245,216,78,0.45)"
                : "0 0 10px 2px rgba(0,0,0,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: c.text, fontSize: 9, fontWeight: 700,
              fontFamily: "var(--font-mono), monospace",
              cursor: "pointer", zIndex: 10,
              opacity: selected ? 1 : 0.55,
              transition: "border-color 0.15s, box-shadow 0.15s, opacity 0.15s",
            }}>
              {slot.post}
            </button>
          )
        })
      )}
    </div>
  )
}

/* ── Page ───────────────────────────────────────────────── */
export default function CreerPage() {
  const [selectedHome,  setSelectedHome]  = useState<Set<number>>(new Set())
  const [selectedAway,  setSelectedAway]  = useState<Set<number>>(new Set())
  const [squadValidated, setSquadValidated] = useState(false)
  const [players,     setPlayers]     = useState<BuilderPlayer[]>([])
  const [ball,        setBall]        = useState({ x: 50, y: 50 })
  const [finality,    setFinality]    = useState<string | null>(null)
  const [description, setDescription] = useState("")
  const [tags,        setTags]        = useState<string[]>([])
  const [frames,      setFrames]      = useState<SituationFrame[]>([])
  const [branches,    setBranches]    = useState<SituationFrame[]>([])
  const [active,      setActive]      = useState<{ kind: "frame" | "branch"; index: number }>({ kind: "frame", index: 0 })
  const [touched,     setTouched]     = useState<Set<string>>(new Set())
  const [triggerCat,  setTriggerCat]  = useState<TriggerCategory>("recovery")
  const [catFilter,   setCatFilter]   = useState<FinalityCategory>("offensive")
  const [tab,         setTab]         = useState<"terrain" | "infos">("terrain")
  const [saveMsg,     setSaveMsg]     = useState<string | null>(null)
  const [isPending,   startTransition] = useTransition()

  const homeCount = squadValidated ? selectedHome.size : null
  const awayCount = squadValidated ? selectedAway.size : null
  const configLabel = homeCount && awayCount ? `${homeCount}v${awayCount}` : null

  /* ── Handlers ── */
  function toggleSquadPlayer(team: "home" | "away", index: number) {
    const setter = team === "home" ? setSelectedHome : setSelectedAway
    setter(prev => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else if (next.size < MAX_SQUAD_SELECTION) next.add(index)
      return next
    })
  }

  function validateSquad() {
    if (selectedHome.size === 0 || selectedAway.size === 0) return
    setSquadValidated(true)
    setPlayers(playersFromSelection(selectedHome, selectedAway))
    setBall({ x: 50, y: 50 })
    setFrames([])
    setBranches([])
    setActive({ kind: "frame", index: 0 })
    setTouched(new Set())
    setTab("terrain")
  }

  /* Positions de la frame/branche actuellement éditée */
  function activePositions(): { players: Record<string, { x: number; y: number }>; ball: { x: number; y: number } } {
    if (active.kind === "frame") {
      if (active.index === 0) {
        const map: Record<string, { x: number; y: number }> = {}
        for (const p of players) map[p.id] = { x: p.x, y: p.y }
        return { players: map, ball }
      }
      return frames[active.index - 1]
    }
    return branches[active.index]
  }

  /* Clé "touché" de la frame/branche actuellement éditée */
  function activeKey(): string {
    return active.kind === "frame" ? `frame-${active.index}` : `branch-${active.index}`
  }

  function movePlayer(id: string, x: number, y: number) {
    if (active.kind === "frame" && active.index === 0) {
      setPlayers(prev => prev.map(p => p.id === id ? { ...p, x, y } : p))
    } else if (active.kind === "frame") {
      const idx = active.index - 1
      setFrames(prev => prev.map((f, i) => i === idx ? { ...f, players: { ...f.players, [id]: { x, y } } } : f))
    } else {
      const idx = active.index
      setBranches(prev => prev.map((b, i) => i === idx ? { ...b, players: { ...b.players, [id]: { x, y } } } : b))
    }
    setTouched(prev => new Set(prev).add(activeKey()))
  }

  function moveBall(x: number, y: number) {
    if (active.kind === "frame" && active.index === 0) {
      setBall({ x, y })
    } else if (active.kind === "frame") {
      const idx = active.index - 1
      setFrames(prev => prev.map((f, i) => i === idx ? { ...f, ball: { x, y } } : f))
    } else {
      const idx = active.index
      setBranches(prev => prev.map((b, i) => i === idx ? { ...b, ball: { x, y } } : b))
    }
    setTouched(prev => new Set(prev).add(activeKey()))
  }

  function setFrameTrigger(id: string) {
    const trigger = TRIGGERS.find(t => t.id === id)!
    const suggestion = suggestTriggerPositions(trigger.category, players, ball)
    setFrames(prev => prev.map((f, i) => i === 0
      ? { ...f, trigger: id, players: suggestion.players, ball: suggestion.ball }
      : f))
    setTouched(prev => new Set(prev).add("frame-1"))
  }

  /* Texte d'aide contextuel selon l'étape de la timeline en cours d'édition */
  function hintFor(): string {
    if (active.kind === "branch") {
      return "Variante : une autre issue possible depuis le déclencheur — ajuste les positions de ce scénario alternatif."
    }
    if (active.index === 0) {
      return "Place les joueurs et le ballon dans leur position de départ."
    }
    if (active.index === 1) {
      const trigger = frames[0]?.trigger ? TRIGGERS.find(t => t.id === frames[0].trigger) : undefined
      return trigger
        ? `${trigger.emoji} ${trigger.label} — ajuste les positions à cet instant.`
        : "Choisis ce qui déclenche l'action, puis ajuste les positions à cet instant."
    }
    return "Place les positions au moment où l'action se termine."
  }

  function addFrame() {
    if (frames.length >= MAX_FRAMES - 1) return
    const src = activePositions()
    const labels = ["Déclencheur", "Issue"]
    setFrames(prev => [...prev, { label: labels[prev.length], players: { ...src.players }, ball: { ...src.ball } }])
    setActive({ kind: "frame", index: frames.length + 1 })
  }

  function removeLastFrame() {
    if (frames.length === 0) return
    setBranches([])
    setFrames(prev => prev.slice(0, -1))
    if (active.kind !== "frame" || active.index >= frames.length) {
      setActive({ kind: "frame", index: frames.length - 1 })
    }
  }

  function addBranch() {
    if (branches.length >= MAX_BRANCHES) return
    const src = frames.length > 0
      ? frames[frames.length - 1]
      : (() => {
          const map: Record<string, { x: number; y: number }> = {}
          for (const p of players) map[p.id] = { x: p.x, y: p.y }
          return { players: map, ball }
        })()
    const labels = ["Branche A", "Branche B", "Branche C"]
    setBranches(prev => [...prev, { label: labels[prev.length], players: { ...src.players }, ball: { ...src.ball } }])
    setActive({ kind: "branch", index: branches.length })
  }

  function removeBranch(index: number) {
    setBranches(prev => prev.filter((_, i) => i !== index))
    if (active.kind === "branch") setActive({ kind: "frame", index: frames.length })
  }

  function toggleTag(id: string) {
    setTags(prev => prev.includes(id)
      ? prev.filter(t => t !== id)
      : prev.length < 5 ? [...prev, id] : prev)
  }

  function save() {
    if (!configLabel || !finality) return
    startTransition(async () => {
      const res = await saveBuiltSituation({
        zone: "mid-center",
        config: configLabel,
        finality,
        description,
        players,
        ball,
        tags,
        frames,
        branches,
      })
      setSaveMsg(res.ok ? "✓ SITUATION SAUVEGARDÉE" : `✗ ${res.error}`)
      setTimeout(() => setSaveMsg(null), 3000)
    })
  }

  function reset() {
    setSelectedHome(new Set()); setSelectedAway(new Set()); setSquadValidated(false)
    setPlayers([])
    setFinality(null); setDescription(""); setTags([]); setSaveMsg(null)
    setFrames([]); setBranches([]); setActive({ kind: "frame", index: 0 })
    setTouched(new Set()); setTriggerCat("recovery"); setTab("terrain")
  }

  const selectedFinality = FINALITIES.find(f => f.id === finality)

  return (
    <div style={{ background: "#181812", minHeight: "100vh", color: "rgba(255,255,255,0.92)" }}>
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* En-tête */}
        <div className="mb-8">
          <Link href="/tactique" style={{
            fontFamily: "var(--font-mono), monospace", fontSize: 9,
            letterSpacing: "0.1em", color: "rgba(122,154,130,0.5)",
          }}>
            ← TACTIQUE
          </Link>
          <h1 style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontWeight: 900, fontSize: "clamp(28px, 5vw, 44px)",
            lineHeight: 0.95, marginTop: 8,
          }}>
            CRÉER UNE<br />
            <span style={{ color: "#7A9A82" }}>SITUATION</span>
          </h1>
        </div>

        {/* ── Outil (colonne unique centrée) ── */}
        <div className="flex flex-col gap-4" style={{ maxWidth: 480, margin: "0 auto" }}>

          {!squadValidated ? (
            <>
              {/* Sélection des joueurs impliqués sur le terrain */}
              <SquadPicker selectedHome={selectedHome} selectedAway={selectedAway} onToggle={toggleSquadPlayer} />

              <div style={{
                padding: "14px 16px", borderRadius: 14,
                backgroundColor: "#1f1f19",
                border: "1px solid rgba(122,154,130,0.1)",
              }}>
                <SectionLabel>Joueurs impliqués</SectionLabel>
                <p style={{
                  fontFamily: "var(--font-body), sans-serif",
                  fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 10,
                }}>
                  Clique sur les joueurs concernés par la situation, des deux côtés ↑
                </p>
                <div className="flex items-center gap-4 mb-3">
                  {(["home", "away"] as const).map(team => {
                    const count = team === "home" ? selectedHome.size : selectedAway.size
                    const color = team === "home" ? "#8a1f1f" : "#7A9A82"
                    return (
                      <div key={team} className="flex items-center gap-2">
                        <span style={{
                          display: "inline-block", width: 8, height: 8, borderRadius: "50%",
                          backgroundColor: color, flexShrink: 0,
                        }} />
                        <span style={{
                          fontFamily: "var(--font-mono), monospace",
                          fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
                          color: "rgba(255,255,255,0.45)",
                        }}>
                          {team === "home" ? "TON ÉQUIPE" : "ADVERSAIRE"} : {count}
                        </span>
                      </div>
                    )
                  })}
                </div>
                <button
                  onClick={validateSquad}
                  disabled={selectedHome.size === 0 || selectedAway.size === 0}
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontWeight: 700, fontSize: 10, letterSpacing: "0.08em",
                    backgroundColor: selectedHome.size && selectedAway.size ? "#7A9A82" : "rgba(255,255,255,0.05)",
                    color: selectedHome.size && selectedAway.size ? "#181812" : "rgba(255,255,255,0.25)",
                    padding: "9px 16px", borderRadius: 10, width: "100%",
                    cursor: selectedHome.size && selectedAway.size ? "pointer" : "default",
                    border: "none", transition: "all 0.2s",
                  }}>
                  {selectedHome.size && selectedAway.size
                    ? `VALIDER LA SÉLECTION (${selectedHome.size}V${selectedAway.size})`
                    : "VALIDER LA SÉLECTION"}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Bandeau récap équipe */}
              <button onClick={() => setSquadValidated(false)} style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
                color: "#7A9A82", background: "rgba(122,154,130,0.1)",
                border: "1px solid rgba(122,154,130,0.3)",
                padding: "8px 12px", borderRadius: 8, cursor: "pointer",
                display: "block", width: "100%", textAlign: "left",
              }}>
                {configLabel} — {configHint(homeCount!, awayCount!)} — modifier ↩
              </button>

              {/* Onglets */}
              <div className="flex gap-2">
                {(["terrain", "infos"] as const).map(t => (
                  <button key={t} onClick={() => setTab(t)} style={{
                    flex: 1,
                    fontFamily: "var(--font-mono), monospace",
                    fontWeight: 700, fontSize: 10, letterSpacing: "0.1em",
                    padding: "9px 16px", borderRadius: 10, cursor: "pointer",
                    backgroundColor: tab === t ? "rgba(122,154,130,0.15)" : "transparent",
                    border: `1px solid ${tab === t ? "rgba(122,154,130,0.4)" : "rgba(122,154,130,0.15)"}`,
                    color: tab === t ? "#7A9A82" : "rgba(255,255,255,0.35)",
                    transition: "all 0.2s",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}>
                    {t === "terrain" ? "TERRAIN" : "INFOS"}
                    {t === "infos" && !finality && (
                      <span style={{
                        display: "inline-block", width: 6, height: 6, borderRadius: "50%",
                        backgroundColor: "#f5d84e",
                      }} />
                    )}
                  </button>
                ))}
              </div>

              {tab === "terrain" ? (
                <>
                  <p style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 9, fontWeight: 700, letterSpacing: "0.16em",
                    color: "rgba(122,154,130,0.5)", textTransform: "uppercase", marginBottom: 4,
                  }}>
                    Mise en scène — fais vivre la situation
                  </p>

                  {/* Bandeau d'aide contextuel */}
                  <p style={{
                    fontFamily: "var(--font-body), sans-serif",
                    fontSize: 12, fontWeight: 400, lineHeight: 1.4,
                    color: "rgba(255,255,255,0.4)", marginBottom: 6,
                  }}>
                    {hintFor()}
                  </p>

                  {/* Sélecteur de déclencheur */}
                  {active.kind === "frame" && active.index === 1 && (
                    <div>
                      <div className="flex gap-1 mb-2 flex-wrap">
                        {TRIGGER_CATEGORIES.map(cat => (
                          <button key={cat.id} onClick={() => setTriggerCat(cat.id)} style={{
                            fontFamily: "var(--font-mono), monospace",
                            fontSize: 8, fontWeight: 700, letterSpacing: "0.08em",
                            padding: "4px 10px", borderRadius: 6, cursor: "pointer",
                            backgroundColor: triggerCat === cat.id
                              ? "rgba(122,154,130,0.18)" : "transparent",
                            border: `1px solid ${triggerCat === cat.id
                              ? "rgba(122,154,130,0.4)" : "rgba(255,255,255,0.08)"}`,
                            color: triggerCat === cat.id ? "#7A9A82" : "rgba(255,255,255,0.3)",
                            transition: "all 0.2s",
                          }}>
                            {cat.label.toUpperCase()}
                          </button>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {TRIGGERS.filter(t => t.category === triggerCat).map(t => {
                          const selected = frames[0]?.trigger === t.id
                          return (
                            <button key={t.id} onClick={() => setFrameTrigger(t.id)} style={{
                              fontFamily: "var(--font-mono), monospace",
                              fontSize: 9, fontWeight: 700, letterSpacing: "0.04em",
                              padding: "5px 10px", borderRadius: 6, cursor: "pointer",
                              backgroundColor: selected
                                ? "rgba(122,154,130,0.2)" : "rgba(255,255,255,0.03)",
                              border: `1px solid ${selected
                                ? "rgba(122,154,130,0.5)" : "rgba(255,255,255,0.08)"}`,
                              color: selected ? "#7A9A82" : "rgba(255,255,255,0.4)",
                              transition: "all 0.2s",
                            }}>
                              {t.emoji} {t.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Timeline frames / branches */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {["Départ", ...frames.map(f => f.label)].map((label, i) => {
                      const isActive = active.kind === "frame" && active.index === i
                      const isTouched = touched.has(`frame-${i}`)
                      let prefix: string | null = null
                      if (i === 1) {
                        const trig = frames[0]?.trigger ? TRIGGERS.find(t => t.id === frames[0].trigger) : undefined
                        prefix = trig ? trig.emoji : "❔"
                      } else if (i === 2 && selectedFinality) {
                        prefix = selectedFinality.emoji
                      }
                      return (
                        <button key={i} onClick={() => setActive({ kind: "frame", index: i })} style={{
                          fontFamily: "var(--font-mono), monospace",
                          fontSize: 9, fontWeight: 700, letterSpacing: "0.06em",
                          padding: "5px 10px", borderRadius: 6, cursor: "pointer",
                          backgroundColor: isActive
                            ? "rgba(122,154,130,0.2)" : "rgba(255,255,255,0.03)",
                          border: `1px solid ${isActive
                            ? "rgba(122,154,130,0.5)" : "rgba(255,255,255,0.08)"}`,
                          color: isActive ? "#7A9A82" : "rgba(255,255,255,0.4)",
                        }}>
                          {prefix && <span style={{ marginRight: 4 }}>{prefix}</span>}
                          {label}
                          {isTouched && (
                            <span style={{
                              display: "inline-block", width: 6, height: 6, borderRadius: "50%",
                              backgroundColor: "#7A9A82", marginLeft: 5, verticalAlign: "middle",
                            }} />
                          )}
                        </button>
                      )
                    })}
                    {frames.length < MAX_FRAMES - 1 && (
                      <button onClick={addFrame} style={{
                        fontFamily: "var(--font-mono), monospace",
                        fontSize: 9, fontWeight: 700, letterSpacing: "0.06em",
                        padding: "5px 10px", borderRadius: 6, cursor: "pointer",
                        backgroundColor: "transparent",
                        border: "1px dashed rgba(122,154,130,0.3)",
                        color: "rgba(122,154,130,0.6)",
                      }}>
                        {frames.length === 0 ? "+ DÉCLENCHEUR" : frames.length === 1 ? "+ ISSUE" : "+ ÉTAPE"}
                      </button>
                    )}
                    {frames.length > 0 && (
                      <button onClick={removeLastFrame} style={{
                        fontFamily: "var(--font-mono), monospace",
                        fontSize: 9, letterSpacing: "0.06em",
                        padding: "5px 8px", borderRadius: 6, cursor: "pointer",
                        backgroundColor: "transparent", border: "none",
                        color: "rgba(220,80,80,0.5)",
                      }}>
                        ✕
                      </button>
                    )}

                    {branches.length > 0 && (
                      <div style={{ width: 1, height: 16, backgroundColor: "rgba(122,154,130,0.12)" }} />
                    )}
                    {branches.map((b, i) => (
                      <button key={i} onClick={() => setActive({ kind: "branch", index: i })} style={{
                        fontFamily: "var(--font-mono), monospace",
                        fontSize: 9, fontWeight: 700, letterSpacing: "0.06em",
                        padding: "5px 10px", borderRadius: 6, cursor: "pointer",
                        backgroundColor: active.kind === "branch" && active.index === i
                          ? "rgba(245,216,78,0.15)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${active.kind === "branch" && active.index === i
                          ? "rgba(245,216,78,0.4)" : "rgba(255,255,255,0.08)"}`,
                        color: active.kind === "branch" && active.index === i ? "#f5d84e" : "rgba(255,255,255,0.4)",
                      }}>
                        🌿 {b.label}
                        {touched.has(`branch-${i}`) && (
                          <span style={{
                            display: "inline-block", width: 6, height: 6, borderRadius: "50%",
                            backgroundColor: "#7A9A82", marginLeft: 5, verticalAlign: "middle",
                          }} />
                        )}
                        <span onClick={e => { e.stopPropagation(); removeBranch(i) }} style={{ marginLeft: 6, opacity: 0.6 }}>
                          ✕
                        </span>
                      </button>
                    ))}
                    {branches.length < MAX_BRANCHES && active.kind === "frame" && active.index === frames.length && (
                      <button onClick={addBranch} style={{
                        fontFamily: "var(--font-mono), monospace",
                        fontSize: 9, fontWeight: 700, letterSpacing: "0.06em",
                        padding: "5px 10px", borderRadius: 6, cursor: "pointer",
                        backgroundColor: "transparent",
                        border: "1px dashed rgba(245,216,78,0.3)",
                        color: "rgba(245,216,78,0.6)",
                      }}>
                        + BRANCHE
                      </button>
                    )}
                  </div>

                  {/* Builder avec joueurs draggables */}
                  <BuilderPitch
                    ghosts={getGhostPlayers(selectedHome, selectedAway)}
                    players={players.map(p => ({ ...p, ...(activePositions().players[p.id] ?? p) }))}
                    ball={activePositions().ball}
                    onMove={movePlayer}
                    onMoveBall={moveBall}
                  />
                </>
              ) : (
                <>
                  {/* Finalité de l'action */}
                  <div style={{
                    padding: "14px 16px", borderRadius: 14,
                    backgroundColor: "#1f1f19",
                    border: "1px solid rgba(122,154,130,0.1)",
                  }}>
                    <SectionLabel>Finalité de l'action</SectionLabel>
                    {/* Filtres catégorie */}
                    <div className="flex gap-1 mb-3">
                      {FINALITY_CATEGORIES.map(cat => (
                        <button key={cat.id} onClick={() => setCatFilter(cat.id)} style={{
                          fontFamily: "var(--font-mono), monospace",
                          fontSize: 8, fontWeight: 700, letterSpacing: "0.08em",
                          padding: "4px 10px", borderRadius: 6, cursor: "pointer",
                          backgroundColor: catFilter === cat.id
                            ? "rgba(122,154,130,0.18)" : "transparent",
                          border: `1px solid ${catFilter === cat.id
                            ? "rgba(122,154,130,0.4)" : "rgba(255,255,255,0.08)"}`,
                          color: catFilter === cat.id ? "#7A9A82" : "rgba(255,255,255,0.3)",
                          transition: "all 0.2s",
                        }}>
                          {cat.label.toUpperCase()}
                        </button>
                      ))}
                    </div>
                    {/* Options */}
                    <div className="flex flex-col gap-1.5">
                      {FINALITIES.filter(f => f.category === catFilter).map(f => (
                        <button key={f.id} onClick={() => setFinality(f.id)} style={{
                          display: "flex", alignItems: "center", gap: 10,
                          padding: "9px 12px", borderRadius: 10, cursor: "pointer",
                          textAlign: "left",
                          backgroundColor: finality === f.id
                            ? "rgba(122,154,130,0.14)" : "rgba(255,255,255,0.03)",
                          border: `1px solid ${finality === f.id
                            ? "rgba(122,154,130,0.45)" : "rgba(122,154,130,0.08)"}`,
                          transition: "all 0.2s",
                        }}>
                          <span style={{ fontSize: 14 }}>{f.emoji}</span>
                          <span style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <span style={{
                              fontFamily: "var(--font-body), sans-serif",
                              fontWeight: finality === f.id ? 500 : 300, fontSize: 13,
                              color: finality === f.id ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
                            }}>
                              {f.label}
                            </span>
                            <span style={{
                              fontFamily: "var(--font-body), sans-serif",
                              fontWeight: 400, fontSize: 10,
                              color: "rgba(255,255,255,0.25)",
                            }}>
                              {FINALITY_HINTS[f.id]}
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description + Save */}
                  <div style={{
                    padding: "14px 16px", borderRadius: 14,
                    backgroundColor: "#1f1f19",
                    border: "1px solid rgba(122,154,130,0.18)",
                  }}>
                    <SectionLabel>Description (optionnel)</SectionLabel>
                    <textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Décris la situation, les consignes pour tes joueurs..."
                      rows={3}
                      style={{
                        width: "100%", resize: "none",
                        backgroundColor: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(122,154,130,0.15)",
                        borderRadius: 8, padding: "10px 12px",
                        fontFamily: "var(--font-body), sans-serif",
                        fontWeight: 400, fontSize: 13, lineHeight: 1.5,
                        color: "rgba(255,255,255,0.7)",
                        outline: "none",
                      }}
                    />

                    {/* Vocabulaire tactique */}
                    <p style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: 9, fontWeight: 700, letterSpacing: "0.12em",
                      color: "rgba(122,154,130,0.6)", marginTop: 12, marginBottom: 6,
                      textTransform: "uppercase",
                    }}>
                      Principes de jeu (max 5)
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {TACTICAL_TAGS.map(t => (
                        <button key={t.id} onClick={() => toggleTag(t.id)} style={{
                          fontFamily: "var(--font-mono), monospace",
                          fontSize: 9, fontWeight: 700, letterSpacing: "0.06em",
                          padding: "5px 10px", borderRadius: 6, cursor: "pointer",
                          backgroundColor: tags.includes(t.id)
                            ? "rgba(122,154,130,0.2)" : "rgba(255,255,255,0.03)",
                          border: `1px solid ${tags.includes(t.id)
                            ? "rgba(122,154,130,0.5)" : "rgba(255,255,255,0.08)"}`,
                          color: tags.includes(t.id) ? "#7A9A82" : "rgba(255,255,255,0.4)",
                          transition: "all 0.2s",
                        }}>
                          {t.label}
                        </button>
                      ))}
                    </div>

                    {/* Récap */}
                    <div className="mt-3 mb-3 flex flex-wrap gap-2 items-center">
                      {[selectedFinality?.label].filter(Boolean).map(tag => (
                        <span key={tag} style={{
                          fontFamily: "var(--font-mono), monospace",
                          fontSize: 8, fontWeight: 700, letterSpacing: "0.08em",
                          backgroundColor: "rgba(122,154,130,0.1)",
                          border: "1px solid rgba(122,154,130,0.2)",
                          color: "#7A9A82", padding: "3px 8px", borderRadius: 4,
                        }}>
                          {tag!.toUpperCase()}
                        </span>
                      ))}
                      {homeCount && awayCount && (
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 4,
                          fontFamily: "var(--font-mono), monospace",
                          fontSize: 8, fontWeight: 700, letterSpacing: "0.08em",
                          backgroundColor: "rgba(122,154,130,0.1)",
                          border: "1px solid rgba(122,154,130,0.2)",
                          color: "rgba(255,255,255,0.6)", padding: "3px 8px", borderRadius: 4,
                        }}>
                          <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", backgroundColor: "#8a1f1f" }} />
                          {homeCount}
                          <span style={{ opacity: 0.4 }}>VS</span>
                          <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", backgroundColor: "#7A9A82" }} />
                          {awayCount}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button onClick={save} disabled={isPending || !finality} style={{
                        flex: 1,
                        fontFamily: "var(--font-mono), monospace",
                        fontWeight: 700, fontSize: 10, letterSpacing: "0.08em",
                        backgroundColor: finality ? "#7A9A82" : "rgba(255,255,255,0.05)",
                        color: finality ? "#181812" : "rgba(255,255,255,0.25)",
                        padding: "11px 16px", borderRadius: 10,
                        cursor: isPending ? "wait" : finality ? "pointer" : "default",
                        border: "none", opacity: isPending ? 0.6 : 1, transition: "opacity 0.2s",
                      }}>
                        {isPending ? "SAUVEGARDE..." : "☆ SAUVEGARDER"}
                      </button>
                      <button onClick={reset} style={{
                        fontFamily: "var(--font-mono), monospace",
                        fontWeight: 700, fontSize: 10, letterSpacing: "0.08em",
                        backgroundColor: "transparent",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.3)",
                        padding: "11px 14px", borderRadius: 10, cursor: "pointer",
                      }}>
                        ↺
                      </button>
                    </div>

                    {saveMsg && (
                      <p style={{
                        fontFamily: "var(--font-mono), monospace",
                        fontSize: 9, letterSpacing: "0.1em", marginTop: 8, textAlign: "center",
                        color: saveMsg.startsWith("✓") ? "#7A9A82" : "rgba(220,80,80,0.8)",
                      }}>
                        {saveMsg}
                      </p>
                    )}

                    <Link href="/tactique/mes-situations" style={{
                      display: "block", textAlign: "center", marginTop: 8,
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: 9, letterSpacing: "0.1em",
                      color: "rgba(122,154,130,0.4)",
                    }}>
                      VOIR MES SITUATIONS →
                    </Link>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
