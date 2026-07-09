// Boucle IA — étape 3 : transforme un axe de progrès (phase + style) en séance concrète en
// piochant dans la bibliothèque d'exercices (lib/exercises.ts). Déterministe, aucun appel IA.
// Assemble une séance équilibrée : activation → cœur (tactique/technique) → jeu global.

import { EXERCISES } from "./exercises"
import type { Exercise, SessionBlock, ExercisePosition } from "@/types/training"
import type { Phase, Style } from "./scenarios"

// Mots-clés FR par style, cherchés dans le texte des exercices pour scorer la pertinence.
const STYLE_KEYWORDS: Record<Style, string[]> = {
  possession:   ["conservation", "possession", "rondo", "passe", "triangle", "circulation", "à une touche"],
  counter:      ["transition", "contre", "récupération", "vertical", "rapide", "profondeur"],
  depth:        ["profondeur", "appel", "dos", "verticalité", "dernière ligne", "dédoublement"],
  "low-block":  ["bloc", "défensif", "compact", "replacement", "densité", "cadrage"],
  "mid-block":  ["bloc", "pressing", "médian", "orientation", "défensif", "cadrage"],
  "high-press": ["pressing", "presser", "récupération haute", "agressivité", "cadrage", "harcèlement"],
}

// Familles favorisées selon la phase travaillée.
const PHASE_FAMILY_BONUS: Record<Phase, Partial<Record<Exercise["family"], number>>> = {
  attack:  { tactique: 2, technique: 2, jeu_global: 2, foncier: 0, activation: 0 },
  defense: { tactique: 3, jeu_global: 2, technique: 1, foncier: 0, activation: 0 },
}

function haystack(e: Exercise): string {
  return [e.name, e.description, e.instructions, ...e.objectives, ...e.variants]
    .join(" ")
    .toLowerCase()
}

function score(e: Exercise, w: { phase: Phase; style: Style }): number {
  const text = haystack(e)
  let s = 0
  for (const kw of STYLE_KEYWORDS[w.style]) if (text.includes(kw)) s += 3
  s += PHASE_FAMILY_BONUS[w.phase][e.family] ?? 0
  return s
}

function eligible(e: Exercise, pos?: ExercisePosition): boolean {
  if (!pos || pos === "les_deux") return true
  return e.positionSemaine === pos || e.positionSemaine === "les_deux"
}

function toBlock(exercise: Exercise, order: number, note: string): SessionBlock {
  return {
    id: crypto.randomUUID(),
    exerciseId: exercise.id,
    exercise,
    duration: exercise.defaultDuration,
    order,
    customNotes: note || undefined,
  }
}

export function buildSessionFromWeakness(
  w: { phase: Phase; style: Style; title?: string },
  opts: { positionSemaine?: ExercisePosition } = {}
): SessionBlock[] {
  const pool = EXERCISES.filter(e => eligible(e, opts.positionSemaine))
  const ranked = [...pool]
    .map(e => ({ e, s: score(e, w) }))
    .sort((a, b) => b.s - a.s)

  const note = w.title ? `Axe : ${w.title}` : ""
  const picked: Exercise[] = []
  const take = (pred: (e: Exercise) => boolean) => {
    const found = ranked.find(r => pred(r.e) && !picked.includes(r.e))
    if (found) picked.push(found.e)
  }

  // 1 activation → 2 exos de cœur (tactique/technique/foncier) → 1 jeu global.
  take(e => e.family === "activation")
  take(e => e.family === "tactique" || e.family === "technique")
  take(e => e.family === "tactique" || e.family === "technique" || e.family === "foncier")
  take(e => e.family === "jeu_global")

  // Complément si l'une des familles manquait dans le pool filtré.
  for (const r of ranked) {
    if (picked.length >= 4) break
    if (!picked.includes(r.e)) picked.push(r.e)
  }

  return picked.map((e, i) => toBlock(e, i, note))
}
