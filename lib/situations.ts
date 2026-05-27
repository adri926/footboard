import type { Arrow } from "./animations"

export interface SituationPlayer { id: string; x: number; y: number }

export type AppelType = "appui" | "profondeur" | "soutien" | "lateral" | "longDeLaLigne"

export interface Appel {
  playerId: string
  type: AppelType
  toX: number
  toY: number
  delay?: number
}

export interface Phase {
  id: string
  label: string       // label court affiché dans la sidebar
  sublabel: string    // terme DTN
  color: string
  dim: string
}

export interface Situation {
  id: string
  phase: string
  label: string
  description: string
  ball: { x: number; y: number }
  arrows?: Arrow[]
  appels?: Appel[]   // mouvements off-ball animés (uniquement quand l'équipe a le ballon)
  positions: {
    red:  SituationPlayer[]
    blue: SituationPlayer[]
  }
}

// Libellés affichés dans la légende
export const APPEL_LABELS: Record<AppelType, string> = {
  appui:         "En appui",
  profondeur:    "En profondeur",
  soutien:       "En soutien",
  lateral:       "Latéral",
  longDeLaLigne: "Long de la ligne",
}

// ── IDs 4-3-3 rouge  : r1=GK  r2=RB  r3=CBd r4=CBg r5=LB  r6=CMd r7=CM  r8=CMg r9=RW  r10=ST  r11=LW
// ── IDs 4-4-2 bleu   : b1=GK  b2=RB  b3=CBd b4=CBg b5=LB  b6=RM  b7=CMd b8=CMg b9=LM  b10=STd b11=STg
// Rouge joue vers le bas (y croissant) · Bleu joue vers le haut (y décroissant)

export const PHASES: Phase[] = [
  {
    id: "possession",
    label: "Avec le ballon",
    sublabel: "Organisation offensive",
    color: "#4ade80",
    dim: "rgba(74,222,128,0.18)",
  },
  {
    id: "perte",
    label: "À la perte",
    sublabel: "Transition défensive",
    color: "#f87171",
    dim: "rgba(248,113,113,0.18)",
  },
  {
    id: "defense",
    label: "Sans le ballon",
    sublabel: "Organisation défensive",
    color: "#60a5fa",
    dim: "rgba(96,165,250,0.18)",
  },
  {
    id: "recuperation",
    label: "À la récup",
    sublabel: "Transition offensive",
    color: "#fbbf24",
    dim: "rgba(251,191,36,0.18)",
  },
]

export const SITUATIONS: Situation[] = [

  // ────────────────────────────────────────────────────
  // AVEC LE BALLON — Organisation offensive
  // ────────────────────────────────────────────────────

  {
    id: "ressortie-balle",
    phase: "possession",
    label: "Ressortie de balle",
    description: "Gardien en possession — CBs écartés, pivot décroché, sorties courtes",
    ball: { x: 50, y: 8 },
    arrows: [
      { x1: 50, y1: 8,  x2: 64, y2: 16, type: "pass" },
      { x1: 50, y1: 8,  x2: 36, y2: 16, type: "pass" },
      { x1: 64, y1: 16, x2: 50, y2: 24, type: "pass" },
      { x1: 50, y1: 34, x2: 50, y2: 24, type: "run"  },
    ],
    positions: {
      red: [
        { id: "r1",  x: 50, y: 8  },
        { id: "r2",  x: 78, y: 18 }, { id: "r3",  x: 64, y: 16 },
        { id: "r4",  x: 36, y: 16 }, { id: "r5",  x: 22, y: 18 },
        { id: "r6",  x: 70, y: 30 }, { id: "r7",  x: 50, y: 24 }, { id: "r8",  x: 30, y: 30 },
        { id: "r9",  x: 82, y: 44 }, { id: "r10", x: 50, y: 44 }, { id: "r11", x: 18, y: 44 },
      ],
      blue: [
        { id: "b1",  x: 50, y: 88 },
        { id: "b2",  x: 78, y: 58 }, { id: "b3",  x: 62, y: 60 },
        { id: "b4",  x: 38, y: 60 }, { id: "b5",  x: 22, y: 58 },
        { id: "b6",  x: 76, y: 46 }, { id: "b7",  x: 58, y: 42 },
        { id: "b8",  x: 42, y: 42 }, { id: "b9",  x: 24, y: 46 },
        { id: "b10", x: 62, y: 30 }, { id: "b11", x: 38, y: 30 },
      ],
    },
  },

  {
    id: "possession-haute",
    phase: "possession",
    label: "Possession haute",
    description: "Bloc offensif dans la moitié adverse — largeur, triangles et profondeur",
    ball: { x: 56, y: 62 },
    arrows: [
      { x1: 56, y1: 62, x2: 86, y2: 60, type: "pass" },
      { x1: 56, y1: 62, x2: 72, y2: 48, type: "pass" },
      { x1: 56, y1: 62, x2: 14, y2: 60, type: "pass" },
      { x1: 86, y1: 60, x2: 86, y2: 72, type: "run"  },
    ],
    positions: {
      red: [
        { id: "r1",  x: 50, y: 16 },
        { id: "r2",  x: 82, y: 34 }, { id: "r3",  x: 64, y: 26 },
        { id: "r4",  x: 36, y: 26 }, { id: "r5",  x: 18, y: 34 },
        { id: "r6",  x: 72, y: 48 }, { id: "r7",  x: 50, y: 46 }, { id: "r8",  x: 28, y: 48 },
        { id: "r9",  x: 86, y: 60 }, { id: "r10", x: 56, y: 62 }, { id: "r11", x: 14, y: 60 },
      ],
      blue: [
        { id: "b1",  x: 50, y: 93 },
        { id: "b2",  x: 78, y: 80 }, { id: "b3",  x: 62, y: 82 },
        { id: "b4",  x: 38, y: 82 }, { id: "b5",  x: 22, y: 80 },
        { id: "b6",  x: 76, y: 70 }, { id: "b7",  x: 60, y: 68 },
        { id: "b8",  x: 40, y: 68 }, { id: "b9",  x: 24, y: 70 },
        { id: "b10", x: 62, y: 58 }, { id: "b11", x: 38, y: 58 },
      ],
    },
  },

  {
    id: "attaque-placee",
    phase: "possession",
    label: "En finition",
    description: "Bloc avancé au bord de la surface — combinaisons et centres",
    ball: { x: 55, y: 68 },
    arrows: [
      { x1: 55, y1: 68, x2: 82, y2: 66, type: "pass" },
      { x1: 55, y1: 68, x2: 50, y2: 52, type: "pass" },
      { x1: 55, y1: 68, x2: 18, y2: 66, type: "pass" },
      { x1: 82, y1: 66, x2: 84, y2: 76, type: "run"  },
    ],
    positions: {
      red: [
        { id: "r1",  x: 50, y: 18 },
        { id: "r2",  x: 85, y: 42 }, { id: "r3",  x: 64, y: 30 },
        { id: "r4",  x: 36, y: 30 }, { id: "r5",  x: 15, y: 42 },
        { id: "r6",  x: 76, y: 56 }, { id: "r7",  x: 50, y: 52 }, { id: "r8",  x: 24, y: 56 },
        { id: "r9",  x: 82, y: 66 }, { id: "r10", x: 55, y: 68 }, { id: "r11", x: 18, y: 66 },
      ],
      blue: [
        { id: "b1",  x: 50, y: 93 },
        { id: "b2",  x: 76, y: 82 }, { id: "b3",  x: 60, y: 84 },
        { id: "b4",  x: 40, y: 84 }, { id: "b5",  x: 24, y: 82 },
        { id: "b6",  x: 74, y: 74 }, { id: "b7",  x: 58, y: 72 },
        { id: "b8",  x: 42, y: 72 }, { id: "b9",  x: 26, y: 74 },
        { id: "b10", x: 60, y: 64 }, { id: "b11", x: 40, y: 64 },
      ],
    },
  },

  // ────────────────────────────────────────────────────
  // AVEC LE BALLON — couloir gauche (4e situation)
  // ────────────────────────────────────────────────────

  {
    id: "circulation-gauche",
    phase: "possession",
    label: "Circulation côté gauche",
    description: "Surcharge sur le couloir gauche — LB + LW + CM créent triangle, ST tire vers le centre",
    ball: { x: 18, y: 56 },
    arrows: [
      { x1: 18, y1: 56, x2: 32, y2: 48, type: "pass" },
      { x1: 18, y1: 56, x2: 14, y2: 68, type: "run"  },
      { x1: 32, y1: 48, x2: 50, y2: 54, type: "pass" },
    ],
    positions: {
      red: [
        { id: "r1",  x: 50, y: 16 },
        { id: "r2",  x: 84, y: 36 }, { id: "r3",  x: 64, y: 28 },
        { id: "r4",  x: 36, y: 28 }, { id: "r5",  x: 14, y: 48 },
        { id: "r6",  x: 70, y: 46 }, { id: "r7",  x: 50, y: 44 }, { id: "r8",  x: 32, y: 48 },
        { id: "r9",  x: 84, y: 56 }, { id: "r10", x: 54, y: 62 }, { id: "r11", x: 18, y: 56 },
      ],
      blue: [
        { id: "b1",  x: 50, y: 93 },
        { id: "b2",  x: 78, y: 78 }, { id: "b3",  x: 62, y: 80 },
        { id: "b4",  x: 40, y: 80 }, { id: "b5",  x: 22, y: 76 },
        { id: "b6",  x: 74, y: 68 }, { id: "b7",  x: 58, y: 64 },
        { id: "b8",  x: 40, y: 66 }, { id: "b9",  x: 26, y: 68 },
        { id: "b10", x: 60, y: 56 }, { id: "b11", x: 36, y: 58 },
      ],
    },
  },

  // ────────────────────────────────────────────────────
  // À LA PERTE — Transition défensive
  // ────────────────────────────────────────────────────

  {
    id: "contre-pressing",
    phase: "perte",
    label: "Contre-pressing",
    description: "Perte au milieu — pression collective dans les 6 secondes",
    ball: { x: 54, y: 54 },
    arrows: [
      { x1: 68, y1: 46, x2: 56, y2: 53, type: "press" },
      { x1: 50, y1: 44, x2: 54, y2: 53, type: "press" },
      { x1: 32, y1: 46, x2: 52, y2: 53, type: "press" },
    ],
    positions: {
      red: [
        { id: "r1",  x: 50, y: 14 },
        { id: "r2",  x: 80, y: 32 }, { id: "r3",  x: 62, y: 28 },
        { id: "r4",  x: 38, y: 28 }, { id: "r5",  x: 20, y: 32 },
        { id: "r6",  x: 68, y: 46 }, { id: "r7",  x: 50, y: 44 }, { id: "r8",  x: 32, y: 46 },
        { id: "r9",  x: 72, y: 52 }, { id: "r10", x: 50, y: 50 }, { id: "r11", x: 28, y: 52 },
      ],
      blue: [
        { id: "b1",  x: 50, y: 90 },
        { id: "b2",  x: 80, y: 72 }, { id: "b3",  x: 62, y: 74 },
        { id: "b4",  x: 38, y: 74 }, { id: "b5",  x: 20, y: 72 },
        { id: "b6",  x: 72, y: 56 }, { id: "b7",  x: 54, y: 54 },
        { id: "b8",  x: 36, y: 56 }, { id: "b9",  x: 24, y: 60 },
        { id: "b10", x: 62, y: 44 }, { id: "b11", x: 38, y: 44 },
      ],
    },
  },

  {
    id: "repli-defensif",
    phase: "perte",
    label: "Repli défensif",
    description: "Perte en phase offensive — sprint collectif derrière le ballon",
    ball: { x: 54, y: 56 },
    arrows: [
      { x1: 75, y1: 50, x2: 72, y2: 38, type: "run" },
      { x1: 50, y1: 52, x2: 50, y2: 36, type: "run" },
      { x1: 25, y1: 50, x2: 28, y2: 38, type: "run" },
    ],
    positions: {
      red: [
        { id: "r1",  x: 50, y: 6  },
        { id: "r2",  x: 80, y: 24 }, { id: "r3",  x: 62, y: 20 },
        { id: "r4",  x: 38, y: 20 }, { id: "r5",  x: 20, y: 24 },
        { id: "r6",  x: 72, y: 38 }, { id: "r7",  x: 50, y: 36 }, { id: "r8",  x: 28, y: 38 },
        { id: "r9",  x: 75, y: 50 }, { id: "r10", x: 50, y: 52 }, { id: "r11", x: 25, y: 50 },
      ],
      blue: [
        { id: "b1",  x: 50, y: 93 },
        { id: "b2",  x: 82, y: 72 }, { id: "b3",  x: 62, y: 76 },
        { id: "b4",  x: 38, y: 76 }, { id: "b5",  x: 18, y: 72 },
        { id: "b6",  x: 78, y: 60 }, { id: "b7",  x: 54, y: 56 },
        { id: "b8",  x: 36, y: 60 }, { id: "b9",  x: 16, y: 62 },
        { id: "b10", x: 66, y: 54 }, { id: "b11", x: 34, y: 54 },
      ],
    },
  },

  {
    id: "second-ballon",
    phase: "perte",
    label: "Second ballon",
    description: "Dégagement ou perte au milieu — bataile pour le second ballon, organisation compacte",
    ball: { x: 52, y: 46 },
    arrows: [
      { x1: 68, y1: 44, x2: 54, y2: 46, type: "press" },
      { x1: 52, y1: 42, x2: 52, y2: 46, type: "press" },
      { x1: 36, y1: 44, x2: 50, y2: 46, type: "press" },
      { x1: 78, y1: 36, x2: 68, y2: 44, type: "run"   },
      { x1: 22, y1: 36, x2: 32, y2: 44, type: "run"   },
    ],
    positions: {
      red: [
        { id: "r1",  x: 50, y: 8  },
        { id: "r2",  x: 78, y: 26 }, { id: "r3",  x: 60, y: 22 },
        { id: "r4",  x: 40, y: 22 }, { id: "r5",  x: 22, y: 26 },
        { id: "r6",  x: 68, y: 44 }, { id: "r7",  x: 52, y: 42 }, { id: "r8",  x: 36, y: 44 },
        { id: "r9",  x: 78, y: 36 }, { id: "r10", x: 52, y: 48 }, { id: "r11", x: 22, y: 36 },
      ],
      blue: [
        { id: "b1",  x: 50, y: 92 },
        { id: "b2",  x: 80, y: 70 }, { id: "b3",  x: 62, y: 74 },
        { id: "b4",  x: 38, y: 74 }, { id: "b5",  x: 20, y: 70 },
        { id: "b6",  x: 74, y: 56 }, { id: "b7",  x: 56, y: 52 },
        { id: "b8",  x: 38, y: 54 }, { id: "b9",  x: 26, y: 58 },
        { id: "b10", x: 64, y: 44 }, { id: "b11", x: 40, y: 44 },
      ],
    },
  },

  // ────────────────────────────────────────────────────
  // SANS LE BALLON — Organisation défensive
  // ────────────────────────────────────────────────────

  {
    id: "bloc-median",
    phase: "defense",
    label: "Bloc médian",
    description: "Deux lignes compactes à hauteur médiane — fermeture des couloirs intérieurs",
    ball: { x: 60, y: 54 },
    arrows: [],
    positions: {
      red: [
        { id: "r1",  x: 50, y: 8  },
        { id: "r2",  x: 78, y: 22 }, { id: "r3",  x: 62, y: 20 },
        { id: "r4",  x: 38, y: 20 }, { id: "r5",  x: 22, y: 22 },
        { id: "r6",  x: 74, y: 32 }, { id: "r7",  x: 52, y: 30 }, { id: "r8",  x: 28, y: 32 },
        { id: "r9",  x: 72, y: 40 }, { id: "r10", x: 50, y: 38 }, { id: "r11", x: 28, y: 40 },
      ],
      blue: [
        { id: "b1",  x: 50, y: 93 },
        { id: "b2",  x: 82, y: 72 }, { id: "b3",  x: 62, y: 76 },
        { id: "b4",  x: 38, y: 76 }, { id: "b5",  x: 18, y: 72 },
        { id: "b6",  x: 78, y: 58 }, { id: "b7",  x: 60, y: 54 },
        { id: "b8",  x: 40, y: 54 }, { id: "b9",  x: 22, y: 58 },
        { id: "b10", x: 62, y: 46 }, { id: "b11", x: 38, y: 46 },
      ],
    },
  },

  {
    id: "bloc-bas",
    phase: "defense",
    label: "Bloc bas",
    description: "Défense profonde et serrée — résistance face à la pression adverse",
    ball: { x: 62, y: 52 },
    arrows: [],
    positions: {
      red: [
        { id: "r1",  x: 50, y: 7  },
        { id: "r2",  x: 78, y: 18 }, { id: "r3",  x: 62, y: 16 },
        { id: "r4",  x: 38, y: 16 }, { id: "r5",  x: 22, y: 18 },
        { id: "r6",  x: 72, y: 28 }, { id: "r7",  x: 50, y: 26 }, { id: "r8",  x: 28, y: 28 },
        { id: "r9",  x: 70, y: 36 }, { id: "r10", x: 50, y: 34 }, { id: "r11", x: 30, y: 36 },
      ],
      blue: [
        { id: "b1",  x: 50, y: 93 },
        { id: "b2",  x: 84, y: 70 }, { id: "b3",  x: 62, y: 74 },
        { id: "b4",  x: 38, y: 74 }, { id: "b5",  x: 16, y: 70 },
        { id: "b6",  x: 80, y: 58 }, { id: "b7",  x: 62, y: 52 },
        { id: "b8",  x: 42, y: 52 }, { id: "b9",  x: 20, y: 58 },
        { id: "b10", x: 60, y: 44 }, { id: "b11", x: 40, y: 44 },
      ],
    },
  },

  {
    id: "pressing-haut",
    phase: "defense",
    label: "Pressing haut",
    description: "Pressing agressif dans la moitié adverse — réduction d'espace, coupure des lignes de passe",
    ball: { x: 58, y: 72 },
    arrows: [
      { x1: 56, y1: 62, x2: 58, y2: 71, type: "press" },
      { x1: 72, y1: 64, x2: 60, y2: 71, type: "press" },
    ],
    positions: {
      red: [
        { id: "r1",  x: 50, y: 12 },
        { id: "r2",  x: 76, y: 32 }, { id: "r3",  x: 60, y: 28 },
        { id: "r4",  x: 40, y: 28 }, { id: "r5",  x: 24, y: 32 },
        { id: "r6",  x: 72, y: 48 }, { id: "r7",  x: 52, y: 46 }, { id: "r8",  x: 32, y: 48 },
        { id: "r9",  x: 72, y: 64 }, { id: "r10", x: 56, y: 62 }, { id: "r11", x: 28, y: 64 },
      ],
      blue: [
        { id: "b1",  x: 50, y: 94 },
        { id: "b2",  x: 80, y: 84 }, { id: "b3",  x: 62, y: 86 },
        { id: "b4",  x: 38, y: 86 }, { id: "b5",  x: 20, y: 84 },
        { id: "b6",  x: 76, y: 76 }, { id: "b7",  x: 58, y: 72 },
        { id: "b8",  x: 38, y: 74 }, { id: "b9",  x: 22, y: 76 },
        { id: "b10", x: 62, y: 66 }, { id: "b11", x: 42, y: 64 },
      ],
    },
  },

  // ────────────────────────────────────────────────────
  // À LA RÉCUP — Transition offensive
  // ────────────────────────────────────────────────────

  {
    id: "contre-attaque",
    phase: "recuperation",
    label: "Contre-attaque",
    description: "Récupération basse — transition verticale immédiate dans le dos de la défense",
    ball: { x: 50, y: 42 },
    arrows: [
      { x1: 50, y1: 42, x2: 82, y2: 60, type: "pass" },
      { x1: 50, y1: 42, x2: 52, y2: 62, type: "pass" },
      { x1: 82, y1: 52, x2: 82, y2: 60, type: "run"  },
      { x1: 18, y1: 52, x2: 18, y2: 60, type: "run"  },
    ],
    positions: {
      red: [
        { id: "r1",  x: 50, y: 6  },
        { id: "r2",  x: 80, y: 28 }, { id: "r3",  x: 62, y: 24 },
        { id: "r4",  x: 38, y: 24 }, { id: "r5",  x: 20, y: 28 },
        { id: "r6",  x: 72, y: 44 }, { id: "r7",  x: 50, y: 42 }, { id: "r8",  x: 28, y: 44 },
        { id: "r9",  x: 82, y: 52 }, { id: "r10", x: 52, y: 62 }, { id: "r11", x: 18, y: 52 },
      ],
      blue: [
        { id: "b1",  x: 50, y: 93 },
        { id: "b2",  x: 78, y: 64 }, { id: "b3",  x: 60, y: 68 },
        { id: "b4",  x: 40, y: 68 }, { id: "b5",  x: 22, y: 64 },
        { id: "b6",  x: 76, y: 48 }, { id: "b7",  x: 58, y: 44 },
        { id: "b8",  x: 44, y: 44 }, { id: "b9",  x: 24, y: 48 },
        { id: "b10", x: 62, y: 34 }, { id: "b11", x: 38, y: 34 },
      ],
    },
  },

  {
    id: "relance-courte",
    phase: "recuperation",
    label: "Relance courte",
    description: "Récupération dans l'axe — 1ère passe propre, pivot décroché pour construire",
    ball: { x: 64, y: 18 },
    arrows: [
      { x1: 64, y1: 18, x2: 50, y2: 28, type: "pass" },
      { x1: 64, y1: 18, x2: 78, y2: 20, type: "pass" },
      { x1: 50, y1: 36, x2: 50, y2: 28, type: "run"  },
    ],
    positions: {
      red: [
        { id: "r1",  x: 50, y: 8  },
        { id: "r2",  x: 80, y: 20 }, { id: "r3",  x: 64, y: 18 },
        { id: "r4",  x: 36, y: 18 }, { id: "r5",  x: 20, y: 20 },
        { id: "r6",  x: 68, y: 32 }, { id: "r7",  x: 50, y: 28 }, { id: "r8",  x: 32, y: 32 },
        { id: "r9",  x: 82, y: 46 }, { id: "r10", x: 52, y: 48 }, { id: "r11", x: 18, y: 46 },
      ],
      blue: [
        { id: "b1",  x: 50, y: 90 },
        { id: "b2",  x: 80, y: 72 }, { id: "b3",  x: 62, y: 76 },
        { id: "b4",  x: 38, y: 76 }, { id: "b5",  x: 20, y: 72 },
        { id: "b6",  x: 74, y: 58 }, { id: "b7",  x: 56, y: 54 },
        { id: "b8",  x: 38, y: 56 }, { id: "b9",  x: 22, y: 60 },
        { id: "b10", x: 60, y: 44 }, { id: "b11", x: 40, y: 44 },
      ],
    },
  },

  {
    id: "pressing-recuperation",
    phase: "recuperation",
    label: "Pressing offensif",
    description: "Récupération haute — pression immédiate sur porteur adverse pour rejouer vers l'avant",
    ball: { x: 44, y: 72 },
    arrows: [
      { x1: 56, y1: 66, x2: 45, y2: 71, type: "press" },
      { x1: 44, y1: 58, x2: 44, y2: 68, type: "run"   },
      { x1: 26, y1: 64, x2: 44, y2: 72, type: "run"   },
    ],
    positions: {
      red: [
        { id: "r1",  x: 50, y: 12 },
        { id: "r2",  x: 82, y: 34 }, { id: "r3",  x: 62, y: 28 },
        { id: "r4",  x: 38, y: 28 }, { id: "r5",  x: 18, y: 34 },
        { id: "r6",  x: 74, y: 50 }, { id: "r7",  x: 44, y: 58 }, { id: "r8",  x: 26, y: 64 },
        { id: "r9",  x: 84, y: 60 }, { id: "r10", x: 56, y: 66 }, { id: "r11", x: 16, y: 58 },
      ],
      blue: [
        { id: "b1",  x: 50, y: 93 },
        { id: "b2",  x: 80, y: 82 }, { id: "b3",  x: 62, y: 84 },
        { id: "b4",  x: 38, y: 84 }, { id: "b5",  x: 20, y: 82 },
        { id: "b6",  x: 74, y: 76 }, { id: "b7",  x: 44, y: 72 },
        { id: "b8",  x: 36, y: 74 }, { id: "b9",  x: 24, y: 76 },
        { id: "b10", x: 60, y: 66 }, { id: "b11", x: 38, y: 64 },
      ],
    },
  },
]
