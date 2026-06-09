"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import SituationPitch from "./SituationPitch"
import { applyZone, applyZoneBall, type Zone } from "@/lib/scenarios"
import type { TacticalPlay } from "@/lib/plays"

interface Props {
  play:      TacticalPlay
  zone:      Zone
  autoPlay?: boolean
}

const SPEEDS = [0.5, 1, 1.5, 2] as const
type Speed = typeof SPEEDS[number]

export default function PlayEngine({ play, zone, autoPlay = true }: Props) {
  const [frameIdx,   setFrameIdx]   = useState(0)
  const [isPlaying,  setIsPlaying]  = useState(autoPlay)
  const [speed,      setSpeed]      = useState<Speed>(1)
  const [fullscreen, setFullscreen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const frame      = play.frames[frameIdx]
  const total      = play.frames.length
  const isLastFrame = frameIdx >= total - 1

  /* ── Avance automatiquement vers le prochain frame ── */
  const advance = useCallback(() => {
    setFrameIdx(prev => {
      if (prev >= total - 1) { setIsPlaying(false); return prev }
      return prev + 1
    })
  }, [total])

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (!isPlaying || isLastFrame) return
    timerRef.current = setTimeout(advance, frame.hold / speed)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [isPlaying, frameIdx, frame.hold, speed, advance, isLastFrame])

  /* ── Reset quand le play ou la zone change ── */
  useEffect(() => {
    setFrameIdx(0)
    setIsPlaying(autoPlay)
  }, [play.scenarioId, zone, autoPlay])

  /* ── Fullscreen natif ── */
  useEffect(() => {
    function onFsChange() {
      setFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", onFsChange)
    return () => document.removeEventListener("fullscreenchange", onFsChange)
  }, [])

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  /* ── Contrôles ── */
  function handlePlay()    { if (isLastFrame) { setFrameIdx(0) }; setIsPlaying(true) }
  function handlePause()   { setIsPlaying(false) }
  function handleRestart() { setFrameIdx(0); setIsPlaying(false) }
  function handlePrev()    { setIsPlaying(false); setFrameIdx(i => Math.max(0, i - 1)) }
  function handleNext()    { setIsPlaying(false); setFrameIdx(i => Math.min(total - 1, i + 1)) }
  function cycleSpeed()    { setSpeed(s => SPEEDS[(SPEEDS.indexOf(s) + 1) % SPEEDS.length]) }

  /* ── Positions calculées ── */
  const displayHome = applyZone(frame.home, zone)
  const displayAway = applyZone(frame.away, zone)
  const displayBall = applyZoneBall(frame.ball, zone)

  return (
    <div
      ref={containerRef}
      style={{
        backgroundColor: fullscreen ? "#181812" : "transparent",
        display: "flex",
        flexDirection: "column",
        height: fullscreen ? "100vh" : "auto",
        padding: fullscreen ? "24px" : 0,
      }}
    >
      {/* Label du frame courant */}
      <div className="mb-3 min-h-[44px]" style={{
        padding: "10px 14px", borderRadius: 10,
        backgroundColor: "rgba(122,154,130,0.07)",
        border: "1px solid rgba(122,154,130,0.15)",
      }}>
        <p style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 9, fontWeight: 700, letterSpacing: "0.12em",
          color: "#7A9A82", marginBottom: 3,
        }}>
          FRAME {frameIdx + 1}/{total}
        </p>
        <p style={{
          fontFamily: "var(--font-body), sans-serif",
          fontWeight: 400, fontSize: 13, lineHeight: 1.4,
          color: "rgba(255,255,255,0.65)",
        }}>
          {frame.label}
        </p>
      </div>

      {/* Terrain */}
      <div style={{ flex: fullscreen ? 1 : "none", minHeight: 0 }}>
        <SituationPitch home={displayHome} away={displayAway} ball={displayBall} />
      </div>

      {/* ── Contrôles ── */}
      <div className="mt-3 flex flex-col gap-2">

        {/* Barre de progression frames */}
        <div className="flex items-center gap-1.5 justify-center">
          {play.frames.map((_, i) => (
            <button key={i} onClick={() => { setIsPlaying(false); setFrameIdx(i) }}
              style={{
                height: 4, borderRadius: 2, cursor: "pointer", border: "none",
                width: i === frameIdx ? 28 : 14,
                backgroundColor: i < frameIdx
                  ? "#7A9A82"
                  : i === frameIdx
                  ? "rgba(122,154,130,0.9)"
                  : "rgba(255,255,255,0.12)",
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>

        {/* Boutons */}
        <div className="flex items-center justify-between gap-2">

          {/* Gauche : restart + prev */}
          <div className="flex gap-1">
            <CtrlBtn onClick={handleRestart} title="Restart">⟳</CtrlBtn>
            <CtrlBtn onClick={handlePrev} disabled={frameIdx === 0} title="Précédent">◀</CtrlBtn>
          </div>

          {/* Centre : play/pause */}
          <button
            onClick={isPlaying ? handlePause : handlePlay}
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontWeight: 700, fontSize: 11, letterSpacing: "0.08em",
              backgroundColor: isPlaying ? "rgba(122,154,130,0.15)" : "#7A9A82",
              color: isPlaying ? "#7A9A82" : "#181812",
              border: isPlaying ? "1px solid rgba(122,154,130,0.4)" : "none",
              padding: "8px 22px", borderRadius: 8, cursor: "pointer",
              transition: "all 0.2s", minWidth: 90,
            }}
          >
            {isPlaying ? "⏸ PAUSE" : isLastFrame ? "↺ REJOUER" : "▶ PLAY"}
          </button>

          {/* Droite : next + speed + fullscreen */}
          <div className="flex gap-1">
            <CtrlBtn onClick={handleNext} disabled={isLastFrame} title="Suivant">▶</CtrlBtn>
            <CtrlBtn onClick={cycleSpeed} title="Vitesse">{speed}×</CtrlBtn>
            <CtrlBtn onClick={toggleFullscreen} title="Plein écran">
              {fullscreen ? "⤡" : "⤢"}
            </CtrlBtn>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Bouton contrôle générique ── */
function CtrlBtn({
  onClick, children, disabled = false, title,
}: {
  onClick: () => void
  children: React.ReactNode
  disabled?: boolean
  title?: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        fontFamily: "var(--font-mono), monospace",
        fontWeight: 700, fontSize: 11,
        backgroundColor: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        color: disabled ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.5)",
        padding: "7px 10px", borderRadius: 8,
        cursor: disabled ? "default" : "pointer",
        transition: "all 0.2s", minWidth: 34,
      }}
    >
      {children}
    </button>
  )
}
