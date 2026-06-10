"use client"

import { useState, useMemo } from "react"
import ExerciseCard from "./ExerciseCard"
import ExerciseModal from "./ExerciseModal"
import { EXERCISES, filterExercisesForProfile } from "@/lib/exercises"
import type { Exercise, ExerciseFamily, ClubProfile, MatchContext } from "@/types/training"
import { FAMILY_LABELS, FAMILY_COLORS, FAMILY_BORDER, FAMILY_TEXT } from "@/types/training"

const ALL_FAMILIES: ExerciseFamily[] = [
  "activation", "foncier", "technique", "tactique", "jeu_global",
]

interface Props {
  clubProfile:  ClubProfile
  matchContext?: MatchContext
  onAdd:        (exercise: Exercise, notes: string) => void
}

function getRecommendation(ctx: MatchContext): { level: "warn" | "info"; text: string } | null {
  const { daysToNext, daysSinceLast } = ctx

  if (daysToNext !== undefined && daysToNext <= 1)
    return { level: "warn", text: `Match ${daysToNext === 0 ? "aujourd'hui" : "demain"} — Activation légère uniquement, évite toute charge.` }
  if (daysToNext !== undefined && daysToNext <= 3)
    return { level: "warn", text: `Match dans ${daysToNext} jours — Charge élevée déconseillée. Les exercices ⚠ sont marqués.` }
  if (daysToNext !== undefined && daysToNext <= 5)
    return { level: "info", text: `Match dans ${daysToNext} jours — Évite les exercices fonciers intenses. Les exercices ⚠ sont marqués.` }
  if (daysSinceLast !== undefined && daysSinceLast <= 1)
    return { level: "info", text: `Match ${daysSinceLast === 0 ? "aujourd'hui" : "hier"} — Séance de récupération recommandée. Les exercices ⚠ sont marqués.` }

  return null
}

export function isExerciseWarned(ex: Exercise, ctx?: MatchContext): boolean {
  if (!ctx) return false
  const { daysToNext, daysSinceLast } = ctx
  if (daysToNext !== undefined && daysToNext <= 3 && ex.intensite === "elevee") return true
  if (daysSinceLast !== undefined && daysSinceLast <= 1 && ex.intensite !== "faible") return true
  return false
}

export default function ExerciseLibrary({ clubProfile, matchContext, onAdd }: Props) {
  const [family, setFamily] = useState<ExerciseFamily | "all">("all")
  const [search, setSearch] = useState("")
  const [detail, setDetail] = useState<Exercise | null>(null)

  const recommendation = matchContext ? getRecommendation(matchContext) : null

  const filtered = useMemo(() => {
    // Liberté totale — on ne filtre plus par position dans la semaine
    let list = filterExercisesForProfile(EXERCISES, clubProfile.level, "libre")
    if (family !== "all") list = list.filter(e => e.family === family)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.objectives.some(o => o.toLowerCase().includes(q))
      )
    }
    return list
  }, [family, search, clubProfile.level])

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100%",
      backgroundColor: "var(--bg-card)",
      border: "1px solid rgba(122,154,130,0.10)",
      borderRadius: 12, overflow: "hidden",
    }}>
      <div style={{ padding: "16px 16px 0", borderBottom: "1px solid rgba(122,154,130,0.08)", flexShrink: 0 }}>

        {/* Bannière recommandation */}
        {recommendation && (
          <div style={{
            padding: "8px 12px", borderRadius: 8, marginBottom: 12,
            backgroundColor: recommendation.level === "warn"
              ? "rgba(224,112,112,0.08)" : "rgba(212,168,71,0.08)",
            border: `1px solid ${recommendation.level === "warn"
              ? "rgba(224,112,112,0.25)" : "rgba(212,168,71,0.25)"}`,
          }}>
            <p style={{
              fontFamily: "var(--font-body), sans-serif",
              fontSize: 11, lineHeight: 1.5,
              color: recommendation.level === "warn" ? "#e07070" : "#d4a847",
            }}>
              {recommendation.level === "warn" ? "⚠ " : "ℹ "}{recommendation.text}
            </p>
          </div>
        )}

        <p style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
          color: "rgba(122,154,130,0.55)", textTransform: "uppercase", marginBottom: 12,
        }}>
          Bibliothèque · {filtered.length} exercice{filtered.length !== 1 ? "s" : ""}
        </p>

        <input
          type="text"
          placeholder="Rechercher un exercice..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            fontFamily: "var(--font-body), sans-serif",
            fontWeight: 400, fontSize: 12,
            backgroundColor: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(122,154,130,0.15)",
            borderRadius: 8, padding: "8px 12px",
            color: "rgba(255,255,255,0.85)",
            width: "100%", outline: "none", marginBottom: 12,
          }}
        />

        <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 12, scrollbarWidth: "none" }}>
          <FamilyTab label="Tout" active={family === "all"}
            color="rgba(255,255,255,0.55)" bg="rgba(255,255,255,0.06)" border="rgba(255,255,255,0.12)"
            onClick={() => setFamily("all")} />
          {ALL_FAMILIES.map(f => (
            <FamilyTab key={f} label={FAMILY_LABELS[f]} active={family === f}
              color={FAMILY_TEXT[f] === "#181812" ? "#7A9A82" : FAMILY_TEXT[f]}
              bg={FAMILY_COLORS[f]} border={FAMILY_BORDER[f]}
              onClick={() => setFamily(f)} />
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: 6 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 16px" }}>
            <p style={{ fontFamily: "var(--font-body), sans-serif", fontSize: 13, color: "rgba(255,255,255,0.28)" }}>
              Aucun exercice trouvé.
            </p>
            {search && (
              <button onClick={() => setSearch("")} style={{
                fontFamily: "var(--font-mono), monospace", fontSize: 9,
                color: "rgba(122,154,130,0.55)", background: "none", border: "none", cursor: "pointer", marginTop: 6,
              }}>
                EFFACER LA RECHERCHE
              </button>
            )}
          </div>
        ) : (
          filtered.map(ex => (
            <ExerciseCard
              key={ex.id}
              exercise={ex}
              matchContext={matchContext}
              onAdd={() => onAdd(ex, "")}
              onDetail={() => setDetail(ex)}
            />
          ))
        )}
      </div>

      {detail && (
        <ExerciseModal
          exercise={detail}
          onClose={() => setDetail(null)}
          onAdd={(ex, notes) => { onAdd(ex, notes); setDetail(null) }}
        />
      )}
    </div>
  )
}

function FamilyTab({ label, active, color, bg, border, onClick }: {
  label: string; active: boolean; color: string; bg: string; border: string; onClick: () => void
}) {
  return (
    <button onClick={onClick} style={{
      fontFamily: "var(--font-mono), monospace",
      fontSize: 8, fontWeight: 700, letterSpacing: "0.07em",
      padding: "5px 10px", borderRadius: 6, cursor: "pointer", whiteSpace: "nowrap",
      backgroundColor: active ? bg : "transparent",
      border: `1px solid ${active ? border : "rgba(122,154,130,0.12)"}`,
      color: active ? color : "rgba(255,255,255,0.30)",
      transition: "all 0.12s",
    }}>
      {label.toUpperCase()}
    </button>
  )
}
