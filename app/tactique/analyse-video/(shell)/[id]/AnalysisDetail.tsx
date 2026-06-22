"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import type { AnalysisEvent, EventType, VideoAnnotation } from "../../actions"
import { askAboutMatch, updateAnalysisEvent, deleteAnalysisEvent } from "../../actions"
import DrawingCanvas from "@/components/tactique/DrawingCanvas"
import { useVideoAnnotation } from "./useVideoAnnotation"
import VideoAnnotationControls from "./VideoAnnotationControls"
import VideoAnnotationList from "./VideoAnnotationList"

const EVENT_TYPES: EventType[] = ["but", "occasion", "carton", "changement", "tactique", "autre"]

const SMALL_INPUT: React.CSSProperties = {
  fontFamily: "var(--font-body), sans-serif", fontSize: 12,
  backgroundColor: "var(--bg-input)",
  border: "1px solid rgba(122,154,130,0.18)",
  borderRadius: 6, padding: "5px 8px",
  color: "var(--text-primary)", width: "100%",
}

const ICON_BUTTON: React.CSSProperties = {
  background: "none", border: "none", cursor: "pointer",
  fontSize: 12, color: "var(--text-faint)", padding: 4, lineHeight: 1,
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

const EVENT_ICON: Record<EventType, string> = {
  but: "⚽",
  occasion: "❗",
  carton: "🟨",
  changement: "⇄",
  tactique: "♟",
  autre: "•",
}

const SUGGESTED_QUESTIONS = [
  "Qui a marqué ?",
  "Y'a-t-il eu des cartons ?",
  "Comment était notre pressing ?",
  "Quel a été le tournant du match ?",
]

export default function AnalysisDetail({
  analysisId,
  videoUrl,
  events,
  annotations,
  summary,
  status,
  aiRequested,
}: {
  analysisId: string
  videoUrl: string | null
  events: AnalysisEvent[]
  annotations: VideoAnnotation[]
  summary: string | null
  status: "uploading" | "processing" | "ready" | "error"
  aiRequested: boolean
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const annotation = useVideoAnnotation(analysisId, videoRef, annotations)
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState<string | null>(null)
  const [askError, setAskError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<{ label: string; description: string; timestamp_sec: number; event_type: EventType } | null>(null)
  const [savingId, setSavingId] = useState<string | null>(null)

  function seekTo(sec: number) {
    if (videoRef.current) {
      videoRef.current.currentTime = sec
      videoRef.current.play()
    }
  }

  function startEdit(e: AnalysisEvent) {
    setEditingId(e.id)
    setDraft({ label: e.label, description: e.description, timestamp_sec: e.timestamp_sec, event_type: e.event_type })
  }

  function cancelEdit() {
    setEditingId(null)
    setDraft(null)
  }

  async function saveEdit(eventId: string) {
    if (!draft) return
    setSavingId(eventId)
    const res = await updateAnalysisEvent(eventId, draft)
    setSavingId(null)
    if (res.ok) {
      cancelEdit()
      router.refresh()
    }
  }

  async function removeEvent(eventId: string) {
    if (!confirm("Supprimer cet événement ?")) return
    await deleteAnalysisEvent(eventId)
    router.refresh()
  }

  function ask(q?: string) {
    const text = (q ?? question).trim()
    if (!text) return
    setQuestion(text)
    setAnswer(null)
    setAskError(null)
    startTransition(async () => {
      const res = await askAboutMatch(analysisId, text)
      if (res.ok) setAnswer(res.answer)
      else setAskError(res.error)
    })
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {videoUrl && (
        <div ref={videoContainerRef} style={{ position: "relative" }}>
          <video
            ref={videoRef}
            src={videoUrl}
            controls={annotation.mode === "idle"}
            style={{ width: "100%", borderRadius: 12, backgroundColor: "#000", display: "block" }}
          />
          {annotation.mode !== "idle" && (
            <DrawingCanvas
              containerRef={videoContainerRef}
              drawings={annotation.mode === "viewing" ? (annotation.viewingAnnotation?.drawings ?? []) : annotation.drawState.present}
              tool={annotation.mode === "viewing" ? "curseur" : annotation.tool}
              color={annotation.color}
              thickness={annotation.thickness}
              onAdd={annotation.addDrawing}
              onErase={annotation.eraseDrawing}
              vbWidth={annotation.vb.w}
              vbHeight={annotation.vb.h}
            />
          )}
        </div>
      )}

      {videoUrl && (
        <VideoAnnotationControls
          mode={annotation.mode}
          tool={annotation.tool}
          onToolChange={annotation.setTool}
          color={annotation.color}
          onColorChange={annotation.setColor}
          thickness={annotation.thickness}
          onThicknessChange={annotation.setThickness}
          canUndo={annotation.drawState.past.length > 0}
          canRedo={annotation.drawState.future.length > 0}
          onUndo={annotation.undo}
          onRedo={annotation.redo}
          onClear={annotation.clearDrawings}
          saveStatus={annotation.saveStatus}
          saveError={annotation.saveError}
          isEditingExisting={!!annotation.editingId}
          vbReady={annotation.vbReady}
          onStartAnnotating={annotation.startAnnotating}
          onSave={annotation.handleSave}
          onCancel={annotation.handleCancel}
          onEditExisting={() => annotation.viewingAnnotation && annotation.startEditingExisting(annotation.viewingAnnotation)}
        />
      )}

      <VideoAnnotationList
        annotations={annotation.annotations}
        activeId={annotation.editingId}
        onOpen={annotation.openExisting}
        onDelete={annotation.handleDelete}
      />

      {summary && (
        <div style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid rgba(122,154,130,0.13)",
          borderRadius: 12, padding: "16px 18px",
        }}>
          <p style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 9, letterSpacing: "0.12em",
            color: "var(--sauge)", marginBottom: 8,
          }}>
            RÉSUMÉ
          </p>
          <p style={{
            fontFamily: "var(--font-body), sans-serif",
            fontSize: 13, color: "var(--text-primary)", lineHeight: 1.6,
          }}>
            {summary}
          </p>
        </div>
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
            {events.map(e => {
              const isEditing = editingId === e.id

              if (isEditing && draft) {
                return (
                  <div key={e.id} style={{
                    display: "flex", flexDirection: "column", gap: 6,
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--sauge-border)",
                    borderRadius: 10, padding: "10px 14px",
                  }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <input
                        autoFocus
                        value={draft.label}
                        onChange={ev => setDraft(d => d && { ...d, label: ev.target.value })}
                        onKeyDown={ev => { if (ev.key === "Escape") cancelEdit() }}
                        placeholder="Label"
                        style={{ ...SMALL_INPUT, flex: 1, fontWeight: 700 }}
                      />
                      <select
                        value={draft.event_type}
                        onChange={ev => setDraft(d => d && { ...d, event_type: ev.target.value as EventType })}
                        style={{ ...SMALL_INPUT, width: "auto" }}
                      >
                        {EVENT_TYPES.map(t => <option key={t} value={t}>{EVENT_ICON[t]} {t}</option>)}
                      </select>
                    </div>
                    <textarea
                      value={draft.description}
                      onChange={ev => setDraft(d => d && { ...d, description: ev.target.value })}
                      onKeyDown={ev => { if (ev.key === "Escape") cancelEdit() }}
                      placeholder="Description"
                      rows={2}
                      style={{ ...SMALL_INPUT, resize: "vertical" }}
                    />
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <input
                        type="number"
                        min={0}
                        value={draft.timestamp_sec}
                        onChange={ev => setDraft(d => d && { ...d, timestamp_sec: Number(ev.target.value) })}
                        style={{ ...SMALL_INPUT, width: 80 }}
                      />
                      <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 9, color: "var(--text-faint)" }}>sec.</span>
                      <div style={{ flex: 1 }} />
                      <button
                        onClick={() => saveEdit(e.id)}
                        disabled={savingId === e.id}
                        style={{
                          fontFamily: "var(--font-mono), monospace", fontSize: 10, fontWeight: 700,
                          color: "var(--sauge)", backgroundColor: "var(--sauge-dim)",
                          border: "1px solid var(--sauge-border)", borderRadius: 6,
                          padding: "5px 10px", cursor: "pointer",
                        }}
                      >
                        {savingId === e.id ? "..." : "Valider"}
                      </button>
                      <button onClick={cancelEdit} style={ICON_BUTTON}>Annuler</button>
                    </div>
                  </div>
                )
              }

              return (
                <div key={e.id} style={{
                  display: "flex", alignItems: "flex-start", gap: 12,
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid rgba(122,154,130,0.13)",
                  borderRadius: 10, padding: "10px 14px",
                }}>
                  <button
                    onClick={() => seekTo(e.timestamp_sec)}
                    style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: 11, fontWeight: 700, color: "var(--sauge)",
                      minWidth: 40, background: "none", border: "none",
                      cursor: "pointer", padding: 0, textAlign: "left",
                    }}
                  >
                    {formatTime(e.timestamp_sec)}
                  </button>
                  <span style={{ fontSize: 14, lineHeight: 1.3 }}>
                    {EVENT_ICON[e.event_type] ?? EVENT_ICON.autre}
                  </span>
                  <button
                    onClick={() => seekTo(e.timestamp_sec)}
                    style={{
                      flex: 1, textAlign: "left", background: "none", border: "none",
                      cursor: "pointer", padding: 0,
                    }}
                  >
                    <span style={{
                      display: "block",
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: 10, letterSpacing: "0.06em",
                      color: "var(--text-primary)", fontWeight: 700,
                      marginBottom: 2,
                    }}>
                      {e.label}
                      {e.player_name && (
                        <span style={{ color: "var(--sauge)", fontWeight: 400 }}> — {e.player_name}</span>
                      )}
                    </span>
                    <span style={{
                      fontFamily: "var(--font-body), sans-serif",
                      fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5,
                    }}>
                      {e.description}
                    </span>
                  </button>
                  <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
                    <button onClick={() => startEdit(e)} title="Modifier" style={ICON_BUTTON}>✎</button>
                    <button onClick={() => removeEvent(e.id)} title="Supprimer" style={ICON_BUTTON}>🗑</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {status === "ready" && aiRequested && (
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
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {SUGGESTED_QUESTIONS.map(q => (
            <button
              key={q}
              onClick={() => ask(q)}
              disabled={isPending}
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 9, fontWeight: 700, letterSpacing: "0.06em",
                color: "var(--text-muted)",
                backgroundColor: "transparent",
                border: "1px solid rgba(122,154,130,0.2)",
                borderRadius: 8, padding: "6px 12px",
                cursor: isPending ? "default" : "pointer",
              }}
            >
              {q}
            </button>
          ))}
        </div>
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
            onClick={() => ask()}
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
      )}
    </div>
  )
}
