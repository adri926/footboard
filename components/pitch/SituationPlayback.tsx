"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Pitch from "./Pitch"
import PlayerToken from "./PlayerToken"
import BallToken from "./BallToken"
import PlaybackControls from "./PlaybackControls"
import type { BuiltSituation } from "@/lib/builder"
import { generatePlayback } from "@/lib/situationPlayback"

interface Props {
  situation: BuiltSituation
}

export default function SituationPlayback({ situation }: Props) {
  const frames = useRef(generatePlayback(situation)).current
  const [step,      setStep]      = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const timerRef     = useRef<ReturnType<typeof setTimeout> | null>(null)

  const frame = frames[step]

  useEffect(() => {
    if (!isPlaying) return
    timerRef.current = setTimeout(() => {
      const next = step + 1
      if (next < frames.length) setStep(next)
      else setIsPlaying(false)
    }, frame.duration)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [isPlaying, step, frame.duration, frames.length])

  const handlePlay  = () => { if (step === frames.length - 1) setStep(0); setIsPlaying(true) }
  const handlePause = () => { setIsPlaying(false); if (timerRef.current) clearTimeout(timerRef.current) }
  const handleNext  = () => { setIsPlaying(false); setStep(s => Math.min(s + 1, frames.length - 1)) }
  const handlePrev  = () => { setIsPlaying(false); setStep(s => Math.max(s - 1, 0)) }
  const handleStop  = useCallback(() => { setIsPlaying(false); setStep(0) }, [])

  const noop = () => {}

  return (
    <div className="flex flex-col gap-5 items-center">
      <div
        ref={containerRef}
        className="relative rounded-2xl overflow-hidden w-full"
        style={{
          maxWidth: 420,
          aspectRatio: "600 / 900",
          boxShadow: "0 0 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)",
        }}
      >
        <Pitch />
        {situation.players.map(p => {
          const pos = frame.players[p.id] ?? p
          return (
            <PlayerToken
              key={p.id} id={p.id}
              label={p.id.toUpperCase()}
              x={pos.x} y={pos.y}
              team={p.team === "home" ? "red" : "blue"}
              transitionMs={frame.duration}
              containerRef={containerRef}
              onPositionUpdate={noop}
            />
          )
        })}
        <BallToken
          x={frame.ball.x} y={frame.ball.y}
          draggable={false}
          transitionMs={frame.duration}
          containerRef={containerRef}
          onPositionUpdate={noop}
        />

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
                {frame.label}
              </p>
              <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, whiteSpace: "nowrap", flexShrink: 0 }}>
                {step + 1} / {frames.length}
              </span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 4, lineHeight: 1.4 }}>
              {frame.info}
            </p>
          </div>
        </div>
      </div>

      <PlaybackControls
        currentStep={step} totalSteps={frames.length}
        isPlaying={isPlaying} stepLabel={frame.label} stepInfo={frame.info}
        onPlay={handlePlay} onPause={handlePause}
        onNext={handleNext} onPrev={handlePrev} onStop={handleStop}
      />
    </div>
  )
}
