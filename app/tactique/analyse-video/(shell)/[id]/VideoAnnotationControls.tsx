"use client"

import Toolbar from "@/components/tactique/Toolbar"
import type { Tool } from "@/components/tactique/DrawingCanvas"
import type { AnnotationMode } from "./useVideoAnnotation"

interface Props {
  mode: AnnotationMode
  tool: Tool
  onToolChange: (t: Tool) => void
  color: string
  onColorChange: (c: string) => void
  thickness: number
  onThicknessChange: (t: number) => void
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  onClear: () => void
  saveStatus: "idle" | "saving" | "error"
  saveError: string
  isEditingExisting: boolean
  vbReady: boolean
  onStartAnnotating: () => void
  onSave: () => void
  onCancel: () => void
  onEditExisting: () => void
}

const ENTRY_BUTTON: React.CSSProperties = {
  fontFamily: "var(--font-mono), monospace",
  fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
  color: "#7A9A82", backgroundColor: "rgba(122,154,130,0.1)",
  border: "1px solid rgba(122,154,130,0.3)", borderRadius: 8,
  padding: "9px 16px", cursor: "pointer", alignSelf: "flex-start",
}

const SAVE_BUTTON: React.CSSProperties = {
  fontFamily: "var(--font-mono), monospace",
  fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
  color: "var(--sauge)", backgroundColor: "var(--sauge-dim)",
  border: "1px solid var(--sauge-border)", borderRadius: 8,
  padding: "10px 16px", cursor: "pointer",
}

const CANCEL_BUTTON: React.CSSProperties = {
  fontFamily: "var(--font-mono), monospace",
  fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
  color: "var(--text-faint)", background: "none", border: "none",
  cursor: "pointer", padding: "10px 8px",
}

export default function VideoAnnotationControls({
  mode, tool, onToolChange, color, onColorChange, thickness, onThicknessChange,
  canUndo, canRedo, onUndo, onRedo, onClear,
  saveStatus, saveError, isEditingExisting, vbReady,
  onStartAnnotating, onSave, onCancel, onEditExisting,
}: Props) {
  if (mode === "idle") {
    return (
      <button onClick={onStartAnnotating} disabled={!vbReady} style={{ ...ENTRY_BUTTON, opacity: vbReady ? 1 : 0.5 }}>
        ✎ Annoter cette image
      </button>
    )
  }

  if (mode === "viewing") {
    return (
      <button onClick={onEditExisting} style={ENTRY_BUTTON}>
        ✎ Modifier cette annotation
      </button>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <Toolbar
        tool={tool} onToolChange={onToolChange}
        color={color} onColorChange={onColorChange}
        thickness={thickness} onThicknessChange={onThicknessChange}
        canUndo={canUndo} canRedo={canRedo}
        onUndo={onUndo} onRedo={onRedo} onClear={onClear}
      />
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={onSave} disabled={saveStatus === "saving"} style={{ ...SAVE_BUTTON, opacity: saveStatus === "saving" ? 0.6 : 1 }}>
          {saveStatus === "saving" ? "..." : isEditingExisting ? "Enregistrer les modifications" : "Enregistrer l'annotation"}
        </button>
        <button onClick={onCancel} style={CANCEL_BUTTON}>Annuler</button>
        {saveStatus === "error" && (
          <p style={{ fontFamily: "var(--font-mono), monospace", fontSize: 10, color: "rgba(220,80,80,0.8)" }}>
            {saveError}
          </p>
        )}
      </div>
    </div>
  )
}
