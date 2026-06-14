"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import ZonePitch from "@/components/pitch/ZonePitch"
import BuilderPitch from "@/components/pitch/BuilderPitch"
import {
  PITCH_ZONES, PLAYER_CONFIGS, FINALITIES, FINALITY_CATEGORIES, TACTICAL_TAGS,
  MAX_FRAMES, MAX_BRANCHES,
  autoPlace, zoneBallPosition, getZone,
  type ZoneId, type PitchZone, type BuilderPlayer, type FinalityCategory, type SituationFrame,
} from "@/lib/builder"
import { saveBuiltSituation } from "./actions"

type Step = 1 | 2 | 3 | 4 | 5

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
function StepBadge({ n, active, done }: { n: number; active: boolean; done: boolean }) {
  return (
    <div style={{
      width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-mono), monospace", fontSize: 9, fontWeight: 700,
      backgroundColor: done ? "#7A9A82" : active ? "rgba(122,154,130,0.18)" : "rgba(255,255,255,0.05)",
      border: `1.5px solid ${done ? "#7A9A82" : active ? "rgba(122,154,130,0.5)" : "rgba(255,255,255,0.1)"}`,
      color: done ? "#181812" : active ? "#7A9A82" : "rgba(255,255,255,0.25)",
      transition: "all 0.3s",
    }}>
      {done ? "✓" : n}
    </div>
  )
}

function Card({ children, active, done }: {
  children: React.ReactNode; active: boolean; done: boolean
}) {
  return (
    <div style={{
      padding: "14px 16px", borderRadius: 14,
      backgroundColor: "#1f1f19",
      border: `1px solid ${active ? "rgba(122,154,130,0.35)" : "rgba(122,154,130,0.1)"}`,
      opacity: !active && !done ? 0.4 : 1,
      transition: "all 0.3s",
      pointerEvents: !active && !done ? "none" : "auto",
    }}>
      {children}
    </div>
  )
}

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

/* ── Page ───────────────────────────────────────────────── */
export default function CreerPage() {
  const [zone,        setZone]        = useState<PitchZone | null>(null)
  const [configLabel, setConfigLabel] = useState<string | null>(null)
  const [players,     setPlayers]     = useState<BuilderPlayer[]>([])
  const [ball,        setBall]        = useState({ x: 50, y: 50 })
  const [finality,    setFinality]    = useState<string | null>(null)
  const [description, setDescription] = useState("")
  const [tags,        setTags]        = useState<string[]>([])
  const [frames,      setFrames]      = useState<SituationFrame[]>([])
  const [branches,    setBranches]    = useState<SituationFrame[]>([])
  const [active,      setActive]      = useState<{ kind: "frame" | "branch"; index: number }>({ kind: "frame", index: 0 })
  const [catFilter,   setCatFilter]   = useState<FinalityCategory>("offensive")
  const [saveMsg,     setSaveMsg]     = useState<string | null>(null)
  const [isPending,   startTransition] = useTransition()

  const step: Step =
    !zone        ? 1 :
    !configLabel ? 2 :
    !finality    ? 3 : 4

  /* ── Handlers ── */
  function selectZone(z: PitchZone) {
    setZone(z)
    setConfigLabel(null)
    setPlayers([])
    setFinality(null)
    setBall(zoneBallPosition(z))
    setFrames([])
    setBranches([])
    setActive({ kind: "frame", index: 0 })
  }

  function selectConfig(label: string) {
    if (!zone) return
    const cfg = PLAYER_CONFIGS.find(c => c.label === label)!
    setConfigLabel(label)
    setPlayers(autoPlace(zone, cfg))
    setFrames([])
    setBranches([])
    setActive({ kind: "frame", index: 0 })
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
    if (!zone || !configLabel || !finality) return
    startTransition(async () => {
      const res = await saveBuiltSituation({
        zone: zone.id,
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
    setZone(null); setConfigLabel(null); setPlayers([])
    setFinality(null); setDescription(""); setTags([]); setSaveMsg(null)
    setFrames([]); setBranches([]); setActive({ kind: "frame", index: 0 })
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

        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── TUNNEL (gauche) ── */}
          <div className="w-full lg:w-[42%] flex flex-col gap-4 lg:sticky lg:top-20">

            {/* ÉTAPE 1 — Zone */}
            <Card active={step === 1} done={!!zone}>
              <div className="flex items-center gap-2 mb-3">
                <StepBadge n={1} active={step === 1} done={!!zone} />
                <SectionLabel>Zone du terrain</SectionLabel>
              </div>
              {zone && (
                <button onClick={() => selectZone(zone)} style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
                  color: "#7A9A82", background: "rgba(122,154,130,0.1)",
                  border: "1px solid rgba(122,154,130,0.3)",
                  padding: "6px 12px", borderRadius: 8, cursor: "pointer",
                  marginBottom: 8, display: "block",
                }}>
                  {zone.label.toUpperCase()} — changer ↩
                </button>
              )}
              {!zone && (
                <p style={{
                  fontFamily: "var(--font-body), sans-serif",
                  fontSize: 12, color: "rgba(255,255,255,0.35)",
                }}>
                  Clique sur une zone du terrain à droite →
                </p>
              )}
            </Card>

            {/* ÉTAPE 2 — Joueurs */}
            <Card active={step === 2} done={!!configLabel}>
              <div className="flex items-center gap-2 mb-3">
                <StepBadge n={2} active={step === 2} done={!!configLabel} />
                <SectionLabel>Joueurs impliqués</SectionLabel>
              </div>
              <div className="flex flex-wrap gap-2">
                {PLAYER_CONFIGS.map(cfg => (
                  <button key={cfg.label} onClick={() => selectConfig(cfg.label)} style={{
                    display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2,
                    padding: "7px 14px", borderRadius: 8, cursor: "pointer", textAlign: "left",
                    backgroundColor: configLabel === cfg.label
                      ? "rgba(122,154,130,0.2)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${configLabel === cfg.label
                      ? "rgba(122,154,130,0.5)" : "rgba(255,255,255,0.08)"}`,
                    transition: "all 0.2s",
                  }}>
                    <span style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontWeight: 700, fontSize: 11, letterSpacing: "0.06em",
                      color: configLabel === cfg.label ? "#7A9A82" : "rgba(255,255,255,0.45)",
                    }}>
                      {cfg.label}
                    </span>
                    <span style={{
                      fontFamily: "var(--font-body), sans-serif",
                      fontWeight: 400, fontSize: 9,
                      color: "rgba(255,255,255,0.25)",
                    }}>
                      {CONFIG_HINTS[cfg.label]}
                    </span>
                  </button>
                ))}
              </div>
              {configLabel && (
                <p style={{
                  fontFamily: "var(--font-body), sans-serif",
                  fontSize: 11, color: "rgba(255,255,255,0.3)",
                  marginTop: 8,
                }}>
                  Glisse les joueurs sur le terrain pour les repositionner.
                </p>
              )}
            </Card>

            {/* ÉTAPE 3 — Finalité */}
            <Card active={step === 3} done={!!finality}>
              <div className="flex items-center gap-2 mb-3">
                <StepBadge n={3} active={step === 3} done={!!finality} />
                <SectionLabel>Finalité de l'action</SectionLabel>
              </div>
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
            </Card>

            {/* ÉTAPE 4 — Description + Save */}
            {step === 4 && (
              <div style={{
                padding: "14px 16px", borderRadius: 14,
                backgroundColor: "#1f1f19",
                border: "1px solid rgba(122,154,130,0.18)",
              }}>
                <div className="flex items-center gap-2 mb-3">
                  <StepBadge n={4} active done={false} />
                  <SectionLabel>Description (optionnel)</SectionLabel>
                </div>
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
                <div className="mt-3 mb-3 flex flex-wrap gap-2">
                  {[zone?.label, configLabel, selectedFinality?.label].filter(Boolean).map(tag => (
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
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button onClick={save} disabled={isPending} style={{
                    flex: 1,
                    fontFamily: "var(--font-mono), monospace",
                    fontWeight: 700, fontSize: 10, letterSpacing: "0.08em",
                    backgroundColor: "#7A9A82", color: "#181812",
                    padding: "11px 16px", borderRadius: 10,
                    cursor: isPending ? "wait" : "pointer",
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
            )}
          </div>

          {/* ── TERRAIN (droite) ── */}
          <div className="w-full lg:flex-1 lg:sticky lg:top-20">
            {!zone ? (
              /* Sélecteur de zone */
              <ZonePitch selected={null} onSelect={selectZone} />
            ) : !configLabel ? (
              /* Builder avec joueurs draggables */
              <BuilderPitch
                zone={zone}
                players={players}
                ball={ball}
                onMove={movePlayer}
                onMoveBall={(x, y) => setBall({ x, y })}
              />
            ) : (
              <>
                {/* Timeline frames / branches */}
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  {["Départ", ...frames.map(f => f.label)].map((label, i) => (
                    <button key={i} onClick={() => setActive({ kind: "frame", index: i })} style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: 9, fontWeight: 700, letterSpacing: "0.06em",
                      padding: "5px 10px", borderRadius: 6, cursor: "pointer",
                      backgroundColor: active.kind === "frame" && active.index === i
                        ? "rgba(122,154,130,0.2)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${active.kind === "frame" && active.index === i
                        ? "rgba(122,154,130,0.5)" : "rgba(255,255,255,0.08)"}`,
                      color: active.kind === "frame" && active.index === i ? "#7A9A82" : "rgba(255,255,255,0.4)",
                    }}>
                      {label}
                    </button>
                  ))}
                  {frames.length < MAX_FRAMES - 1 && (
                    <button onClick={addFrame} style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: 9, fontWeight: 700, letterSpacing: "0.06em",
                      padding: "5px 10px", borderRadius: 6, cursor: "pointer",
                      backgroundColor: "transparent",
                      border: "1px dashed rgba(122,154,130,0.3)",
                      color: "rgba(122,154,130,0.6)",
                    }}>
                      + ÉTAPE
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
                      {b.label}
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
                  zone={zone}
                  players={players.map(p => ({ ...p, ...(activePositions().players[p.id] ?? p) }))}
                  ball={activePositions().ball}
                  onMove={movePlayer}
                  onMoveBall={moveBall}
                />
              </>
            )}

            {/* Hint changement de zone */}
            {zone && (
              <button onClick={() => { setZone(null); setConfigLabel(null); setPlayers([]) }}
                style={{
                  display: "block", margin: "10px auto 0",
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 9, letterSpacing: "0.1em",
                  color: "rgba(122,154,130,0.4)", background: "none",
                  border: "none", cursor: "pointer",
                }}>
                ← CHANGER DE ZONE
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
