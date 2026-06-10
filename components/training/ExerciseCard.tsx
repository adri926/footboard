"use client"

import MiniTerrain from "./MiniTerrain"
import type { Exercise, SessionBlock, MatchContext } from "@/types/training"
import {
  FAMILY_COLORS, FAMILY_BORDER, FAMILY_TEXT, FAMILY_LABELS,
  INTENSITY_COLORS, INTENSITY_LABELS, POSITION_LABELS,
} from "@/types/training"
import { isExerciseWarned } from "./ExerciseLibrary"

interface Props {
  exercise:     Exercise
  matchContext?: MatchContext
  onAdd?:       (ex: Exercise) => void
  onDetail?:    (ex: Exercise) => void
  inSession?:   boolean
  block?:       SessionBlock
}

export default function ExerciseCard({ exercise: ex, matchContext, onAdd, onDetail, inSession = false }: Props) {
  const warned = isExerciseWarned(ex, matchContext)
  const familyBg     = FAMILY_COLORS[ex.family]
  const familyBorder = FAMILY_BORDER[ex.family]
  const familyColor  = FAMILY_TEXT[ex.family]
  const intensityColor = INTENSITY_COLORS[ex.intensite]

  return (
    <div
      onClick={() => onDetail?.(ex)}
      style={{
        backgroundColor: "var(--bg-card)",
        border: `1px solid ${familyBorder}`,
        borderLeft: `3px solid ${familyColor === "#181812" ? "#7A9A82" : familyColor}`,
        borderRadius: 8,
        padding: "10px 12px",
        cursor: onDetail ? "pointer" : "default",
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        transition: "border-color 0.15s, background-color 0.15s",
      }}
    >
      {/* Terrain miniature */}
      {!inSession && (
        <div style={{ flexShrink: 0 }}>
          <MiniTerrain animation={ex.animation} width={72} height={46} />
        </div>
      )}

      {/* Infos */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Famille + nom */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
          <span style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 7, fontWeight: 700, letterSpacing: "0.08em",
            color: familyColor === "#181812" ? "#7A9A82" : familyColor,
            backgroundColor: familyBg,
            border: `1px solid ${familyBorder}`,
            padding: "1px 6px", borderRadius: 100,
            whiteSpace: "nowrap",
          }}>
            {FAMILY_LABELS[ex.family].toUpperCase()}
          </span>
          <span style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 7, fontWeight: 700, letterSpacing: "0.06em",
            color: intensityColor,
            backgroundColor: `${intensityColor}18`,
            border: `1px solid ${intensityColor}40`,
            padding: "1px 6px", borderRadius: 100,
            whiteSpace: "nowrap",
          }}>
            {INTENSITY_LABELS[ex.intensite].toUpperCase()}
          </span>
        </div>

        <p style={{
          fontFamily: "var(--font-body), sans-serif",
          fontWeight: 500, fontSize: 12,
          color: "rgba(255,255,255,0.88)",
          lineHeight: 1.3, marginBottom: 4,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {ex.name}
        </p>

        {/* Métadonnées */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 8, color: "rgba(255,255,255,0.45)",
          }}>
            {ex.defaultDuration} min
          </span>
          <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 8 }}>·</span>
          <span style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 8, color: "rgba(255,255,255,0.45)",
          }}>
            {ex.minPlayers === ex.maxPlayers ? ex.minPlayers : `${ex.minPlayers}–${ex.maxPlayers}`} joueurs
          </span>
          <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 8 }}>·</span>
          <span style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 7, color: "rgba(122,154,130,0.55)",
            letterSpacing: "0.04em",
          }}>
            {POSITION_LABELS[ex.positionSemaine]}
          </span>
        </div>
      </div>

      {warned && (
          <span title="Charge déconseillée selon ton calendrier de matchs" style={{
            flexShrink: 0, alignSelf: "flex-start",
            fontFamily: "var(--font-mono), monospace",
            fontSize: 9, color: "#d4a847",
            backgroundColor: "rgba(212,168,71,0.10)",
            border: "1px solid rgba(212,168,71,0.25)",
            borderRadius: 4, padding: "2px 5px", cursor: "default",
          }}>⚠</span>
        )}

      {/* Bouton ajouter */}
      {onAdd && (
        <button
          onClick={e => { e.stopPropagation(); onAdd(ex) }}
          title="Ajouter à la séance"
          style={{
            flexShrink: 0,
            width: 26, height: 26,
            borderRadius: 6,
            border: "1px solid rgba(122,154,130,0.3)",
            backgroundColor: "rgba(122,154,130,0.08)",
            color: "#7A9A82",
            fontFamily: "var(--font-mono), monospace",
            fontSize: 16, fontWeight: 700,
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            lineHeight: 1,
          }}
        >
          +
        </button>
      )}
    </div>
  )
}
