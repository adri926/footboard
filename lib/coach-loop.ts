// Boucle IA — étape 2 : relie un axe de progrès (phase + style) détecté sur une vidéo au
// concept tactique animé correspondant (lib/concepts.ts). Mapping pur, aucune donnée nouvelle.

import { CONCEPTS, type ConceptDef } from "./concepts"
import type { Phase, Style } from "./scenarios"

// Mapping précis phase+style → id de concept. Couvre les cas où phase change le concept
// pertinent (ex: "counter" en défense = repli, en attaque = transition offensive).
const CONCEPT_BY_PHASE_STYLE: Record<string, string> = {
  "attack-possession":  "triangle-milieu",
  "attack-counter":     "transition-offensive",
  "attack-depth":       "faux-9",
  "attack-low-block":   "triangle-zone-centrale",
  "attack-mid-block":   "construction-arriere",
  "attack-high-press":  "gegenpressing",
  "defense-possession": "construction-arriere",
  "defense-counter":    "retour-defensif",
  "defense-depth":      "bloc-bas",
  "defense-low-block":  "bloc-bas",
  "defense-mid-block":  "bloc-bas",
  "defense-high-press": "pressing-haut",
}

// Repli par style seul si la combinaison exacte manque.
const CONCEPT_BY_STYLE: Record<Style, string> = {
  possession:   "triangle-milieu",
  counter:      "transition-offensive",
  depth:        "faux-9",
  "low-block":  "bloc-bas",
  "mid-block":  "bloc-bas",
  "high-press": "pressing-haut",
}

// Repli ultime par phase.
const CONCEPT_BY_PHASE: Record<Phase, string> = {
  attack:  "transition-offensive",
  defense: "bloc-bas",
}

export function matchConcept(w: { phase: Phase; style: Style }): ConceptDef | null {
  const id =
    CONCEPT_BY_PHASE_STYLE[`${w.phase}-${w.style}`] ??
    CONCEPT_BY_STYLE[w.style] ??
    CONCEPT_BY_PHASE[w.phase]
  return CONCEPTS.find(c => c.id === id) ?? null
}
