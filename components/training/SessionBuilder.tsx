"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import SessionTimeline from "./SessionTimeline"
import { saveSession } from "@/app/dashboard/entrainements/nouvelle-seance/actions"
import type { SessionBlock, SessionType, ClubProfile } from "@/types/training"

interface Props {
  blocks: SessionBlock[]
  sessionType: SessionType
  clubProfile: ClubProfile
  defaultName?: string
  onReorder: (blocks: SessionBlock[]) => void
  onRemove: (id: string) => void
  onChangeDuration: (id: string, delta: number) => void
}

export default function SessionBuilder({
  blocks, sessionType, clubProfile, defaultName = "", onReorder, onRemove, onChangeDuration,
}: Props) {
  const today = new Date().toISOString().slice(0, 10)
  const [name, setName] = useState(defaultName)
  const [date, setDate] = useState(today)
  const [playerCount, setPlayerCount] = useState(16)
  const [errMsg, setErrMsg] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSave() {
    setErrMsg(null)
    if (!name.trim()) { setErrMsg("Donne un nom à la séance."); return }
    if (blocks.length === 0) { setErrMsg("Ajoute au moins un exercice."); return }

    startTransition(async () => {
      const res = await saveSession({
        name: name.trim(),
        date,
        sessionType,
        playerCount,
        blocks: blocks.map(b => ({
          exerciseId: b.exerciseId,
          duration: b.duration,
          order: b.order,
          customNotes: b.customNotes ?? "",
        })),
      })
      if (res.ok) {
        router.push(`/dashboard/entrainements/${res.sessionId}`)
      } else {
        setErrMsg(res.error)
      }
    })
  }

  const canSave = blocks.length > 0 && !isPending

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100%",
      backgroundColor: "var(--bg-card)",
      border: "1px solid rgba(122,154,130,0.10)",
      borderRadius: 12, overflow: "hidden",
    }}>
      {/* Header inputs */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(122,154,130,0.08)", flexShrink: 0 }}>
        <p style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 8, fontWeight: 700, letterSpacing: "0.14em",
          color: "rgba(122,154,130,0.45)", marginBottom: 10,
        }}>
          CONSTRUCTEUR DE SÉANCE
        </p>

        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Nom de la séance…"
          style={{
            width: "100%", boxSizing: "border-box",
            backgroundColor: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(122,154,130,0.15)",
            borderRadius: 6, padding: "8px 10px",
            fontFamily: "var(--font-body), sans-serif",
            fontWeight: 500, fontSize: 14,
            color: "rgba(255,255,255,0.85)", outline: "none", marginBottom: 8,
          }}
        />

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{
              flex: 1, backgroundColor: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(122,154,130,0.12)",
              borderRadius: 6, padding: "6px 8px",
              fontFamily: "var(--font-mono), monospace",
              fontSize: 10, color: "rgba(255,255,255,0.55)", outline: "none",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
            <button
              onClick={() => setPlayerCount(n => Math.max(1, n - 1))}
              style={stepBtn}
            >−</button>
            <span style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 10, color: "rgba(255,255,255,0.55)",
              minWidth: 38, textAlign: "center",
            }}>
              {playerCount} jrs
            </span>
            <button
              onClick={() => setPlayerCount(n => Math.min(30, n + 1))}
              style={stepBtn}
            >+</button>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ flex: 1, padding: "14px 20px", minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <SessionTimeline
          blocks={blocks}
          sessionType={sessionType}
          clubProfile={clubProfile}
          onReorder={onReorder}
          onRemove={onRemove}
          onChangeDuration={onChangeDuration}
        />
      </div>

      {/* Footer */}
      <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(122,154,130,0.08)", flexShrink: 0 }}>
        {errMsg && (
          <p style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 8, letterSpacing: "0.06em",
            color: "#e07070", marginBottom: 8,
          }}>
            {errMsg}
          </p>
        )}
        <button
          onClick={handleSave}
          disabled={!canSave}
          style={{
            width: "100%",
            fontFamily: "var(--font-mono), monospace",
            fontWeight: 700, fontSize: 10, letterSpacing: "0.08em",
            padding: "12px 16px", borderRadius: 10, cursor: canSave ? "pointer" : "default",
            backgroundColor: canSave ? "#7A9A82" : "rgba(122,154,130,0.08)",
            color: canSave ? "var(--bg)" : "rgba(122,154,130,0.28)",
            border: "none", transition: "all 0.2s",
          }}
        >
          {isPending ? "SAUVEGARDE…" : "☆ SAUVEGARDER LA SÉANCE"}
        </button>
      </div>
    </div>
  )
}

const stepBtn: React.CSSProperties = {
  width: 24, height: 28, borderRadius: 4, cursor: "pointer",
  backgroundColor: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "rgba(255,255,255,0.40)", fontSize: 14, lineHeight: 1,
}
