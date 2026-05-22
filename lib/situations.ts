export interface SituationPlayer { id: string; x: number; y: number }

export interface Situation {
  id: string
  label: string
  description: string
  positions: {
    red:  SituationPlayer[]
    blue: SituationPlayer[]
  }
}

// Quelle situation s'applique automatiquement à l'adversaire
export const COUNTER: Record<string, string> = {
  "bloc-haut":   "bloc-bas",
  "bloc-median": "bloc-median",
  "bloc-bas":    "bloc-haut",
}

// Position du ballon selon la situation et l'équipe qui l'a sélectionnée
// L'équipe "bloc-haut" a la possession → ballon dans le camp adverse
export function ballPosition(situationId: string, team: "red" | "blue"): { x: number; y: number } {
  const attacking = situationId === "bloc-haut"
  const balanced  = situationId === "bloc-median"
  if (balanced) return { x: 50, y: 50 }
  // bloc-haut = équipe a la possession, pousse haut
  // bloc-bas  = adversaire a la possession
  const hasball = (situationId === "bloc-haut")
  if (team === "red") return { x: 50, y: hasball ? 64 : 22 }
  return { x: 50, y: hasball ? 36 : 78 }
}

// Label de contexte affiché sur le terrain
export const CONTEXT_LABEL: Record<string, { owner: string; other: string }> = {
  "bloc-haut":   { owner: "Possession · attaque",      other: "Bloc bas · défense" },
  "bloc-median": { owner: "Pressing médian · relance",  other: "Bloc médian · contre" },
  "bloc-bas":    { owner: "Bloc bas · contre-attaque",  other: "Possession · attaque" },
}

export const SITUATIONS: Situation[] = [
  {
    id: "bloc-haut",
    label: "Bloc haut",
    description: "Pression haute dans la moitié adverse",
    positions: {
      // Rouge pousse très haut dans la moitié bleue
      red: [
        { id: "r1",  x: 50, y: 28 },
        { id: "r2",  x: 80, y: 40 }, { id: "r3",  x: 62, y: 42 },
        { id: "r4",  x: 38, y: 42 }, { id: "r5",  x: 20, y: 40 },
        { id: "r6",  x: 78, y: 52 }, { id: "r7",  x: 50, y: 50 }, { id: "r8",  x: 22, y: 52 },
        { id: "r9",  x: 80, y: 63 }, { id: "r10", x: 50, y: 61 }, { id: "r11", x: 20, y: 63 },
      ],
      // Bleu pousse très haut dans la moitié rouge
      blue: [
        { id: "b1",  x: 50, y: 70 },
        { id: "b2",  x: 80, y: 58 }, { id: "b3",  x: 62, y: 60 },
        { id: "b4",  x: 38, y: 60 }, { id: "b5",  x: 20, y: 58 },
        { id: "b6",  x: 80, y: 46 }, { id: "b7",  x: 60, y: 44 }, { id: "b8",  x: 40, y: 44 }, { id: "b9",  x: 20, y: 46 },
        { id: "b10", x: 63, y: 33 }, { id: "b11", x: 37, y: 33 },
      ],
    },
  },
  {
    id: "bloc-median",
    label: "Bloc médian",
    description: "Bloc compact autour de la ligne médiane",
    positions: {
      red: [
        { id: "r1",  x: 50, y: 14 },
        { id: "r2",  x: 80, y: 26 }, { id: "r3",  x: 62, y: 28 },
        { id: "r4",  x: 38, y: 28 }, { id: "r5",  x: 20, y: 26 },
        { id: "r6",  x: 78, y: 38 }, { id: "r7",  x: 50, y: 36 }, { id: "r8",  x: 22, y: 38 },
        { id: "r9",  x: 78, y: 48 }, { id: "r10", x: 50, y: 47 }, { id: "r11", x: 22, y: 48 },
      ],
      blue: [
        { id: "b1",  x: 50, y: 84 },
        { id: "b2",  x: 80, y: 72 }, { id: "b3",  x: 62, y: 74 },
        { id: "b4",  x: 38, y: 74 }, { id: "b5",  x: 20, y: 72 },
        { id: "b6",  x: 80, y: 60 }, { id: "b7",  x: 60, y: 58 }, { id: "b8",  x: 40, y: 58 }, { id: "b9",  x: 20, y: 60 },
        { id: "b10", x: 63, y: 48 }, { id: "b11", x: 37, y: 48 },
      ],
    },
  },
  {
    id: "bloc-bas",
    label: "Bloc bas",
    description: "Défense profonde, deux blocs de 4 serrés",
    positions: {
      red: [
        { id: "r1",  x: 50, y: 6 },
        { id: "r2",  x: 80, y: 18 }, { id: "r3",  x: 62, y: 16 },
        { id: "r4",  x: 38, y: 16 }, { id: "r5",  x: 20, y: 18 },
        { id: "r6",  x: 75, y: 28 }, { id: "r7",  x: 50, y: 26 }, { id: "r8",  x: 25, y: 28 },
        { id: "r9",  x: 72, y: 38 }, { id: "r10", x: 50, y: 37 }, { id: "r11", x: 28, y: 38 },
      ],
      blue: [
        { id: "b1",  x: 50, y: 93 },
        { id: "b2",  x: 80, y: 82 }, { id: "b3",  x: 62, y: 84 },
        { id: "b4",  x: 38, y: 84 }, { id: "b5",  x: 20, y: 82 },
        { id: "b6",  x: 76, y: 72 }, { id: "b7",  x: 60, y: 70 }, { id: "b8",  x: 40, y: 70 }, { id: "b9",  x: 24, y: 72 },
        { id: "b10", x: 63, y: 60 }, { id: "b11", x: 37, y: 60 },
      ],
    },
  },
]
