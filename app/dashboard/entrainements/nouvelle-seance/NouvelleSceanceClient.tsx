"use client"

import { useState } from "react"
import Link from "next/link"
import ExerciseLibrary from "@/components/training/ExerciseLibrary"
import SessionBuilder from "@/components/training/SessionBuilder"
import type { Exercise, SessionBlock, ClubProfile, MatchContext } from "@/types/training"

interface Props {
  clubProfile:    ClubProfile
  matchContext:   MatchContext
  initialBlocks?: SessionBlock[]
  templateName?:  string
}

export default function NouvelleSceanceClient({ clubProfile, matchContext, initialBlocks, templateName }: Props) {
  const [blocks, setBlocks] = useState<SessionBlock[]>(initialBlocks ?? [])

  function handleAdd(exercise: Exercise, notes: string) {
    const block: SessionBlock = {
      id: crypto.randomUUID(),
      exerciseId: exercise.id,
      exercise,
      duration: exercise.defaultDuration,
      order: blocks.length,
      customNotes: notes || undefined,
    }
    setBlocks(prev => [...prev, block])
  }

  function handleRemove(id: string) {
    setBlocks(prev => prev.filter(b => b.id !== id).map((b, i) => ({ ...b, order: i })))
  }

  function handleChangeDuration(id: string, delta: number) {
    setBlocks(prev => prev.map(b =>
      b.id === id ? { ...b, duration: Math.min(60, Math.max(5, b.duration + delta)) } : b
    ))
  }

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1200, height: "calc(100vh - 56px)", display: "flex", flexDirection: "column" }}>

      <Link href="/dashboard/entrainements" style={{
        fontFamily: "var(--font-mono), monospace",
        fontSize: 8, letterSpacing: "0.08em",
        color: "rgba(122,154,130,0.45)",
        display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 16,
        textDecoration: "none",
      }}>
        ← ENTRAÎNEMENTS
      </Link>

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--sauge)", display: "inline-block" }} />
            <span style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
              color: "var(--sauge)", background: "var(--sauge-dim)",
              border: "1px solid var(--sauge-border)",
              padding: "2px 8px", borderRadius: 100,
            }}>
              ENTRAÎNEMENTS
            </span>
          </div>
          <h1 style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontWeight: 900, fontSize: 28, lineHeight: 1,
            color: "var(--text-primary)", letterSpacing: "0.01em",
          }}>
            {templateName ? `COPIE — ${templateName.toUpperCase()}` : "CRÉER UNE SÉANCE"}
          </h1>
        </div>
      </div>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "35% 1fr", gap: 16, minHeight: 0 }}>
        <ExerciseLibrary
          clubProfile={clubProfile}
          matchContext={matchContext}
          onAdd={handleAdd}
        />

        <SessionBuilder
          blocks={blocks}
          sessionType="libre"
          clubProfile={clubProfile}
          onReorder={setBlocks}
          onRemove={handleRemove}
          onChangeDuration={handleChangeDuration}
          defaultName={templateName ? `Copie — ${templateName}` : ""}
        />
      </div>
    </div>
  )
}
