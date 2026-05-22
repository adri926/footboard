"use client"

interface Props {
  currentStep: number
  totalSteps: number
  isPlaying: boolean
  stepLabel: string
  stepInfo: string
  onPlay: () => void
  onPause: () => void
  onNext: () => void
  onPrev: () => void
  onStop: () => void
}

export default function PlaybackControls({
  currentStep, totalSteps, isPlaying,
  stepLabel, stepInfo,
  onPlay, onPause, onNext, onPrev, onStop,
}: Props) {
  return (
    <div className="w-full max-w-sm flex flex-col gap-3">

      {/* Barre de progression */}
      <div className="flex gap-1">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ backgroundColor: i <= currentStep ? "white" : "rgba(255,255,255,0.2)" }}
          />
        ))}
      </div>

      {/* Label + info */}
      <div>
        <p className="text-white text-sm font-semibold">{stepLabel}</p>
        <p className="text-gray-400 text-xs mt-0.5">{stepInfo}</p>
      </div>

      {/* Boutons */}
      <div className="flex items-center gap-2">
        <button onClick={onStop}
          className="text-gray-500 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-lg text-xs transition">
          ■ Stop
        </button>

        <button onClick={onPrev} disabled={currentStep === 0}
          className="text-gray-400 hover:text-white disabled:opacity-30 border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-lg text-xs transition">
          ◁
        </button>

        <button
          onClick={isPlaying ? onPause : onPlay}
          className="flex-1 text-sm font-semibold py-2 rounded-lg transition"
          style={{ backgroundColor: isPlaying ? "rgba(255,255,255,0.1)" : "white", color: isPlaying ? "white" : "black" }}
        >
          {isPlaying ? "⏸ Pause" : "▶ Jouer"}
        </button>

        <button onClick={onNext} disabled={currentStep === totalSteps - 1}
          className="text-gray-400 hover:text-white disabled:opacity-30 border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-lg text-xs transition">
          ▷
        </button>
      </div>

      {/* Légende */}
      <div className="flex gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span style={{ color: "white" }}>——</span> Course
        </span>
        <span className="flex items-center gap-1">
          <span style={{ color: "rgba(255,215,0,0.95)" }}>- - -</span> Passe
        </span>
        <span className="flex items-center gap-1">
          <span style={{ color: "rgba(255,90,30,0.95)" }}>···</span> Pressing
        </span>
        <span className="flex items-center gap-1">
          <span style={{ color: "rgba(80,220,120,0.6)" }}>···</span> Triangle
        </span>
      </div>
    </div>
  )
}
