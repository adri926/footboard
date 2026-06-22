"use client"

import { useCallback, useEffect, useState } from "react"
import type { RefObject } from "react"
import type { Drawing } from "@/types/tactical"
import type { Tool } from "@/components/tactique/DrawingCanvas"
import type { VideoAnnotation } from "../../actions"
import { createVideoAnnotation, updateVideoAnnotation, deleteVideoAnnotation } from "../../actions"

export type AnnotationMode = "idle" | "editing" | "viewing"

interface DrawHistory {
  past: Drawing[][]
  present: Drawing[]
  future: Drawing[][]
}

const EMPTY_HISTORY: DrawHistory = { past: [], present: [], future: [] }
const DEFAULT_COLOR = "#7A9A82"
const DEFAULT_THICKNESS = 4

// Logique d'annotation libre sur image vidéo figée — même principe que le digiboard
// (historique undo/redo scopé à la session d'édition courante, jamais aux annotations déjà
// sauvegardées), mais le viewBox SVG est calculé dynamiquement depuis les dimensions réelles
// de la vidéo pour éviter tout letterboxing (cf. DrawingCanvas.tsx, props vbWidth/vbHeight).
export function useVideoAnnotation(
  analysisId: string,
  videoRef: RefObject<HTMLVideoElement | null>,
  initialAnnotations: VideoAnnotation[]
) {
  const [mode, setMode] = useState<AnnotationMode>("idle")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [annotations, setAnnotations] = useState<VideoAnnotation[]>(initialAnnotations)

  const [tool, setTool] = useState<Tool>("crayon")
  const [color, setColor] = useState(DEFAULT_COLOR)
  const [thickness, setThickness] = useState(DEFAULT_THICKNESS)
  const [drawState, setDrawState] = useState<DrawHistory>(EMPTY_HISTORY)

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "error">("idle")
  const [saveError, setSaveError] = useState("")

  const [vb, setVb] = useState({ w: 1000, h: 562.5 })
  const [vbReady, setVbReady] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const computeVb = () => {
      if (video.videoWidth && video.videoHeight) {
        setVb({ w: 1000, h: 1000 * (video.videoHeight / video.videoWidth) })
        setVbReady(true)
      }
    }
    if (video.readyState >= 1) computeVb()
    video.addEventListener("loadedmetadata", computeVb)
    return () => video.removeEventListener("loadedmetadata", computeVb)
  }, [videoRef])

  const addDrawing = useCallback((d: Drawing) => {
    setDrawState(s => ({ past: [...s.past, s.present], present: [...s.present, d], future: [] }))
  }, [])

  const eraseDrawing = useCallback((target: Drawing) => {
    setDrawState(s => ({ past: [...s.past, s.present], present: s.present.filter(d => d !== target), future: [] }))
  }, [])

  const undo = useCallback(() => {
    setDrawState(s => {
      if (s.past.length === 0) return s
      const previous = s.past[s.past.length - 1]
      return { past: s.past.slice(0, -1), present: previous, future: [s.present, ...s.future] }
    })
  }, [])

  const redo = useCallback(() => {
    setDrawState(s => {
      if (s.future.length === 0) return s
      const [next, ...rest] = s.future
      return { past: [...s.past, s.present], present: next, future: rest }
    })
  }, [])

  const clearDrawings = useCallback(() => {
    setDrawState(s => s.present.length === 0 ? s : { past: [...s.past, s.present], present: [], future: [] })
  }, [])

  const startAnnotating = useCallback(() => {
    videoRef.current?.pause()
    setEditingId(null)
    setTool("crayon")
    setDrawState(EMPTY_HISTORY)
    setSaveStatus("idle")
    setMode("editing")
  }, [videoRef])

  const openExisting = useCallback((a: VideoAnnotation) => {
    if (videoRef.current) {
      videoRef.current.currentTime = a.timestampSec
      videoRef.current.pause()
    }
    setEditingId(a.id)
    setMode("viewing")
  }, [videoRef])

  const startEditingExisting = useCallback((a: VideoAnnotation) => {
    setDrawState({ past: [], present: a.drawings, future: [] })
    setEditingId(a.id)
    setTool("crayon")
    setSaveStatus("idle")
    setMode("editing")
  }, [])

  const handleCancel = useCallback(() => {
    if (drawState.present.length > 0 && !confirm("Annuler l'annotation en cours ? Les tracés non enregistrés seront perdus.")) return
    setMode("idle")
    setEditingId(null)
    setDrawState(EMPTY_HISTORY)
  }, [drawState.present.length])

  const handleSave = useCallback(async () => {
    if (!videoRef.current) return
    setSaveStatus("saving")
    const timestampSec = videoRef.current.currentTime
    const drawings = drawState.present

    if (editingId) {
      const result = await updateVideoAnnotation(editingId, { timestampSec, drawings })
      if (!result.ok) {
        setSaveStatus("error")
        setSaveError(result.error)
        return
      }
      setAnnotations(prev => prev
        .map(a => a.id === editingId ? { ...a, timestampSec, drawings } : a)
        .sort((a, b) => a.timestampSec - b.timestampSec))
    } else {
      const result = await createVideoAnnotation(analysisId, { timestampSec, drawings })
      if (!result.ok) {
        setSaveStatus("error")
        setSaveError(result.error)
        return
      }
      setAnnotations(prev => [...prev, { id: result.id, timestampSec, drawings, createdAt: new Date().toISOString() }]
        .sort((a, b) => a.timestampSec - b.timestampSec))
    }

    setSaveStatus("idle")
    setMode("idle")
    setEditingId(null)
    setDrawState(EMPTY_HISTORY)
  }, [analysisId, drawState.present, editingId, videoRef])

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Supprimer cette annotation ?")) return
    await deleteVideoAnnotation(id)
    setAnnotations(prev => prev.filter(a => a.id !== id))
    if (editingId === id) {
      setMode("idle")
      setEditingId(null)
      setDrawState(EMPTY_HISTORY)
    }
  }, [editingId])

  const viewingAnnotation = mode === "viewing" && editingId
    ? annotations.find(a => a.id === editingId) ?? null
    : null

  return {
    mode, vb, vbReady,
    tool, setTool, color, setColor, thickness, setThickness,
    drawState, addDrawing, eraseDrawing, undo, redo, clearDrawings,
    annotations, viewingAnnotation, editingId,
    saveStatus, saveError,
    startAnnotating, openExisting, startEditingExisting, handleCancel, handleSave, handleDelete,
  }
}
