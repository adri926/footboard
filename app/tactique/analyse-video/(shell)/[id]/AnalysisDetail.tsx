"use client"

import { useRef, useState, useTransition } from "react"
import type { AnalysisEvent } from "../actions"
import { askAboutMatch } from "../actions"

function formatTime(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

export default function AnalysisDetail({
  analysisId,
  videoUrl,
  events,
}: {
  analysisId: string
  videoUrl: string | null
  events: AnalysisEvent[]
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState<string | null>(null)
  const [askError, setAskError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function seekTo(sec: number) {
    if (videoRef.current) {
      videoRef.current.currentTime = sec
      videoRef.current.play()
    }
  }

  function ask() {
    if (!question.trim()) return
    setAnswer(null)
    setAskError(null)
    startTransition(async () => {
      const res = await askAboutMatch(analysisId, question.trim())
      if (res.ok) setAnswer(res.answer)
      else setAskError(res.error)
    })
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {videoUrl && (
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          style={{ width: "100%", borderRadius: 12, backgroundColor: "#000" }}
        />
      )}

      {events.length > 0 && (
        <div>
          <p style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 9, letterSpacing: "0.12em",
            color: "var(--text-faint)", marginBottom: 12,
          }}>
            TIMELINE
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {events.map(e => (
              <button
                key={e.id}
                onClick={() => seekTo(e.timestamp_sec)}
                style={{
                  textAlign: "left",
                  display: "flex", alignItems: "flex-start", gap: 12,
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid rgba(122,154,130,0.13)",
                  borderRadius: 10, padding: "10px 14px",
                  cursor: "pointer",
                }}
              >
                <span style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 11, fontWeight: 700, color: "var(--sauge)",
                  minWidth: 40,
                }}>
                  {formatTime(e.timestamp_sec)}
                </span>
                <span>
                  <span style={{
                    display: "block",
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 10, letterSpacing: "0.06em",
                    color: "var(--text-primary)", fontWeight: 700,
                    marginBottom: 2,
                  }}>
                    {e.label}
                  </span>
                  <span style={{
                    fontFamily: "var(--font-body), sans-serif",
                    fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5,
                  }}>
                    {e.description}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid rgba(122,154,130,0.13)",
        borderRadius: 14, padding: "20px 22px",
        display: "flex", flexDirection: "column", gap: 10,
      }}>
        <p style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 9, letterSpacing: "0.12em",
          color: "var(--sauge)",
        }}>
          QUESTION SUR LE MATCH
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => e.key === "Enter" && ask()}
            placeholder="Ex: Combien d'occasions pour l'équipe à domicile ?"
            style={{
              flex: 1,
              backgroundColor: "var(--bg-input)",
              border: "1px solid rgba(122,154,130,0.18)",
              borderRadius: 8, padding: "10px 12px",
              color: "var(--text-primary)",
              fontFamily: "var(--font-body), sans-serif", fontSize: 13,
            }}
          />
          <button
            onClick={ask}
            disabled={isPending}
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
              color: "var(--sauge)",
              backgroundColor: "var(--sauge-dim)",
              border: "1px solid var(--sauge-border)",
              borderRadius: 8, padding: "10px 16px",
              cursor: isPending ? "default" : "pointer",
              opacity: isPending ? 0.6 : 1,
            }}
          >
            {isPending ? "..." : "DEMANDER"}
          </button>
        </div>
        {answer && (
          <p style={{
            fontFamily: "var(--font-body), sans-serif",
            fontSize: 13, color: "var(--text-primary)", lineHeight: 1.6,
          }}>
            {answer}
          </p>
        )}
        {askError && (
          <p style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10, color: "rgba(220,80,80,0.8)",
          }}>
            {askError}
          </p>
        )}
      </div>
    </div>
  )
}
