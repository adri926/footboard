"use client"

import { useState, useEffect, useMemo, useTransition } from "react"
import Link from "next/link"
import SituationPitch from "@/components/pitch/SituationPitch"
import PlayEngine from "@/components/pitch/PlayEngine"
import Pitch from "@/components/pitch/Pitch"
import {
  PHASES, STYLES_BY_PHASE, ZONES,
  getScenario, applyZone, applyZoneBall,
  type Phase, type Style, type Zone,
} from "@/lib/scenarios"
import { getPlay } from "@/lib/plays"
import { saveSituation } from "./actions"

/* ── Helpers visuels ──────────────────────────────────── */

function StepBadge({ n, active, done }: { n: number; active: boolean; done: boolean }) {
  return (
    <div style={{
      width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-mono), monospace", fontSize: 10, fontWeight: 700,
      backgroundColor: done ? "#7A9A82" : active ? "rgba(122,154,130,0.18)" : "rgba(255,255,255,0.05)",
      border: `1.5px solid ${done ? "#7A9A82" : active ? "rgba(122,154,130,0.5)" : "rgba(255,255,255,0.1)"}`,
      color: done ? "#181812" : active ? "#7A9A82" : "rgba(255,255,255,0.25)",
      transition: "all 0.3s",
    }}>
      {done ? "✓" : n}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "var(--font-mono), monospace",
      fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
      color: "rgba(122,154,130,0.7)", marginBottom: 10,
      textTransform: "uppercase",
    }}>
      {children}
    </p>
  )
}

function Chip({ label, desc, active, done, onClick }: {
  label: string; desc?: string; active: boolean; done: boolean; onClick: () => void
}) {
  return (
    <button onClick={onClick} style={{
      width: "100%", textAlign: "left",
      padding: "11px 14px", borderRadius: 10,
      backgroundColor: active
        ? "rgba(122,154,130,0.14)"
        : done ? "rgba(122,154,130,0.06)" : "rgba(255,255,255,0.03)",
      border: `1px solid ${active ? "rgba(122,154,130,0.45)" : "rgba(122,154,130,0.1)"}`,
      cursor: "pointer", transition: "all 0.2s",
    }}>
      <p style={{
        fontFamily: "var(--font-display), system-ui, sans-serif",
        fontWeight: 700, fontSize: 14,
        color: active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.55)",
        marginBottom: desc ? 2 : 0,
      }}>
        {label}
      </p>
      {desc && (
        <p style={{
          fontFamily: "var(--font-body), sans-serif",
          fontWeight: 300, fontSize: 11, lineHeight: 1.4,
          color: active ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.2)",
        }}>
          {desc}
        </p>
      )}
    </button>
  )
}

/* ── Page principale ───────────────────────────────────── */

export default function SituationsPage() {
  const [phase, setPhase] = useState<Phase | null>(null)
  const [style, setStyle] = useState<Style | null>(null)
  const [zone,  setZone]  = useState<Zone  | null>(null)
  const [copied,  setCopied]  = useState(false)
  const [saveMsg, setSaveMsg] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  /* Lire les paramètres URL au chargement (lien partagé) */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const p = params.get("phase") as Phase | null
    const s = params.get("style") as Style | null
    const z = params.get("zone")  as Zone  | null
    if (p) setPhase(p)
    if (s) setStyle(s)
    if (z) setZone(z)
  }, [])

  const step = !phase ? 1 : !style ? 2 : !zone ? 3 : 4

  /* Scénario courant */
  const scenario = useMemo(
    () => (phase && style ? getScenario(phase, style) : null),
    [phase, style]
  )

  const play = useMemo(
    () => (scenario ? getPlay(scenario.id) : null),
    [scenario]
  )

  const activeZone = zone ?? "center"
  const displayHome = scenario ? applyZone(scenario.home, activeZone) : []
  const displayAway = scenario ? applyZone(scenario.away, activeZone) : []
  const displayBall = scenario
    ? applyZoneBall(scenario.ball, activeZone)
    : { x: 50, y: 50 }

  const showPlayers = !!scenario

  function selectPhase(p: Phase) { setPhase(p); setStyle(null); setZone(null); setSaveMsg(null) }
  function selectStyle(s: Style) { setStyle(s); setZone(null); setSaveMsg(null) }
  function reset()               { setPhase(null); setStyle(null); setZone(null); setSaveMsg(null) }

  function save() {
    if (!scenario || !phase || !style) return
    startTransition(async () => {
      const res = await saveSituation({
        phase, style, zone: activeZone,
        label: scenario.label,
        description: scenario.description,
      })
      setSaveMsg(res.ok ? "✓ SITUATION SAUVEGARDÉE" : `✗ ${res.error}`)
      setTimeout(() => setSaveMsg(null), 3000)
    })
  }

  function share() {
    const url = new URL(window.location.href.split("?")[0])
    if (phase) url.searchParams.set("phase", phase)
    if (style) url.searchParams.set("style", style)
    url.searchParams.set("zone", activeZone)
    navigator.clipboard.writeText(url.toString())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ background: "#181812", minHeight: "100vh", color: "rgba(255,255,255,0.92)" }}>
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* En-tête */}
        <div className="mb-8">
          <Link href="/tactique" style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 9, letterSpacing: "0.1em",
            color: "rgba(122,154,130,0.5)",
          }}>
            ← TACTIQUE
          </Link>
          <h1 style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontWeight: 900, fontSize: "clamp(28px, 5vw, 44px)",
            lineHeight: 0.95, color: "rgba(255,255,255,0.95)",
            marginTop: 8,
          }}>
            MISE EN SITUATION<br />
            <span style={{ color: "#7A9A82" }}>TACTIQUE</span>
          </h1>
        </div>

        {/* Corps — 2 colonnes desktop */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── TUNNEL (gauche) ── */}
          <div className="w-full lg:w-[42%] flex flex-col gap-5 lg:sticky lg:top-20">

            {/* ÉTAPE 1 — Phase */}
            <div style={{
              padding: "16px", borderRadius: 14,
              backgroundColor: "#1f1f19",
              border: `1px solid ${step === 1 ? "rgba(122,154,130,0.35)" : "rgba(122,154,130,0.1)"}`,
              transition: "border-color 0.3s",
            }}>
              <div className="flex items-center gap-2 mb-3">
                <StepBadge n={1} active={step === 1} done={!!phase} />
                <SectionLabel>Phase de jeu</SectionLabel>
              </div>
              <div className="flex flex-col gap-2">
                {PHASES.map(p => (
                  <Chip key={p.value}
                    label={p.label} desc={p.desc}
                    active={phase === p.value}
                    done={!!phase && phase !== p.value}
                    onClick={() => selectPhase(p.value)}
                  />
                ))}
              </div>
            </div>

            {/* ÉTAPE 2 — Style */}
            <div style={{
              padding: "16px", borderRadius: 14,
              backgroundColor: "#1f1f19",
              border: `1px solid ${step === 2 ? "rgba(122,154,130,0.35)" : "rgba(122,154,130,0.1)"}`,
              opacity: !phase ? 0.35 : 1,
              transition: "all 0.3s",
              pointerEvents: !phase ? "none" : "auto",
            }}>
              <div className="flex items-center gap-2 mb-3">
                <StepBadge n={2} active={step === 2} done={!!style} />
                <SectionLabel>Style de jeu</SectionLabel>
              </div>
              <div className="flex flex-col gap-2">
                {(phase ? STYLES_BY_PHASE[phase] : []).map(s => (
                  <Chip key={s.value}
                    label={s.label} desc={s.desc}
                    active={style === s.value}
                    done={!!style && style !== s.value}
                    onClick={() => selectStyle(s.value)}
                  />
                ))}
              </div>
            </div>

            {/* ÉTAPE 3 — Zone */}
            <div style={{
              padding: "16px", borderRadius: 14,
              backgroundColor: "#1f1f19",
              border: `1px solid ${step === 3 ? "rgba(122,154,130,0.35)" : "rgba(122,154,130,0.1)"}`,
              opacity: !style ? 0.35 : 1,
              transition: "all 0.3s",
              pointerEvents: !style ? "none" : "auto",
            }}>
              <div className="flex items-center gap-2 mb-3">
                <StepBadge n={3} active={step === 3} done={!!zone} />
                <SectionLabel>Zone d'action</SectionLabel>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {ZONES.map(z => (
                  <button key={z.value} onClick={() => setZone(z.value)} style={{
                    padding: "10px 8px", borderRadius: 10, textAlign: "center",
                    backgroundColor: zone === z.value
                      ? "rgba(122,154,130,0.18)"
                      : "rgba(255,255,255,0.03)",
                    border: `1px solid ${zone === z.value
                      ? "rgba(122,154,130,0.5)"
                      : "rgba(122,154,130,0.1)"}`,
                    cursor: "pointer", transition: "all 0.2s",
                  }}>
                    <div style={{ fontSize: 16, marginBottom: 4 }}>{z.emoji}</div>
                    <p style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: 8, fontWeight: 700, letterSpacing: "0.08em",
                      color: zone === z.value ? "#7A9A82" : "rgba(255,255,255,0.35)",
                    }}>
                      {z.label.toUpperCase()}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* CONSEIL TACTIQUE — apparaît après sélection style */}
            {scenario && (
              <div style={{
                padding: "14px 16px", borderRadius: 12,
                backgroundColor: "rgba(122,154,130,0.07)",
                border: "1px solid rgba(122,154,130,0.2)",
              }}>
                <p style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 8, fontWeight: 700, letterSpacing: "0.12em",
                  color: "#7A9A82", marginBottom: 6,
                }}>
                  💡 CONSEIL
                </p>
                <p style={{
                  fontFamily: "var(--font-body), sans-serif",
                  fontWeight: 300, fontSize: 13, lineHeight: 1.6,
                  color: "rgba(255,255,255,0.6)",
                }}>
                  {scenario.tip}
                </p>
              </div>
            )}

            {/* ACTIONS — étape 4 */}
            {step === 4 && (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 flex-wrap">
                  {/* Sauvegarder */}
                  <button onClick={save} disabled={isPending} style={{
                    flex: 1,
                    fontFamily: "var(--font-mono), monospace",
                    fontWeight: 700, fontSize: 10, letterSpacing: "0.08em",
                    backgroundColor: "#7A9A82", color: "#181812",
                    padding: "11px 16px", borderRadius: 10, cursor: isPending ? "wait" : "pointer",
                    border: "none", transition: "opacity 0.2s",
                    opacity: isPending ? 0.6 : 1,
                  }}>
                    {isPending ? "SAUVEGARDE..." : "☆ SAUVEGARDER"}
                  </button>
                  {/* Partager */}
                  <button onClick={share} style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontWeight: 700, fontSize: 10, letterSpacing: "0.08em",
                    backgroundColor: "transparent",
                    border: "1px solid rgba(122,154,130,0.3)",
                    color: "#7A9A82",
                    padding: "11px 14px", borderRadius: 10, cursor: "pointer",
                    transition: "all 0.2s",
                  }}>
                    {copied ? "✓" : "⬡ PARTAGER"}
                  </button>
                  {/* Recommencer */}
                  <button onClick={reset} style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontWeight: 700, fontSize: 10, letterSpacing: "0.08em",
                    backgroundColor: "transparent",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.3)",
                    padding: "11px 14px", borderRadius: 10, cursor: "pointer",
                    transition: "all 0.2s",
                  }}>
                    ↺
                  </button>
                </div>
                {/* Feedback save */}
                {saveMsg && (
                  <p style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 9, letterSpacing: "0.1em",
                    color: saveMsg.startsWith("✓") ? "#7A9A82" : "rgba(220,80,80,0.8)",
                    textAlign: "center",
                  }}>
                    {saveMsg}
                  </p>
                )}
                {/* Lien vers mes situations */}
                <Link href="/tactique/mes-situations" style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 9, letterSpacing: "0.1em",
                  color: "rgba(122,154,130,0.4)",
                  textAlign: "center",
                }}>
                  VOIR MES SITUATIONS SAUVEGARDÉES →
                </Link>
              </div>
            )}
          </div>

          {/* ── TERRAIN (droite) ── */}
          <div className="w-full lg:flex-1 lg:sticky lg:top-20">

            {/* Description de la situation */}
            {scenario && (
              <div className="mb-4 px-1">
                <p style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 9, fontWeight: 700, letterSpacing: "0.12em",
                  color: "#7A9A82", marginBottom: 4,
                }}>
                  {scenario.label.toUpperCase()}
                  {zone && (
                    <span style={{ color: "rgba(122,154,130,0.5)", marginLeft: 8 }}>
                      — {ZONES.find(z => z.value === zone)?.label.toUpperCase()}
                    </span>
                  )}
                </p>
                <p style={{
                  fontFamily: "var(--font-body), sans-serif",
                  fontWeight: 300, fontSize: 13, lineHeight: 1.5,
                  color: "rgba(255,255,255,0.45)",
                }}>
                  {scenario.description}
                </p>
              </div>
            )}

            {/* Terrain */}
            {showPlayers && play ? (
              <PlayEngine
                key={`${scenario?.id}-${activeZone}`}
                play={play}
                zone={activeZone}
                autoPlay={!!zone}
              />
            ) : showPlayers ? (
              <SituationPitch
                home={displayHome}
                away={displayAway}
                ball={displayBall}
              />
            ) : (
              /* Terrain vide avec message */
              <div className="relative w-full overflow-hidden rounded-2xl" style={{
                aspectRatio: "600 / 900",
                boxShadow: "0 0 60px rgba(122,154,130,0.06), 0 0 0 1px rgba(122,154,130,0.12)",
              }}>
                <Pitch />
                <div className="absolute inset-0 flex items-center justify-center" style={{
                  background: "rgba(24,24,18,0.6)",
                }}>
                  <p style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
                    color: "rgba(122,154,130,0.5)", textAlign: "center",
                    padding: "0 24px",
                  }}>
                    CHOISIS UNE PHASE<br />ET UN STYLE<br />POUR VOIR LA SITUATION
                  </p>
                </div>
              </div>
            )}

            {/* Légende zone — mini indicateur */}
            {style && !zone && (
              <p style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 9, letterSpacing: "0.1em",
                color: "rgba(122,154,130,0.5)", textAlign: "center", marginTop: 10,
              }}>
                ← CHOISIS LA ZONE POUR FINALISER →
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
