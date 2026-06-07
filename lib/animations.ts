// Coordonnées en % (0-100). Rouge joue vers le bas.
// IDs rouge 4-3-3: r1=GK r2=RB r3=CB r4=CB r5=LB r6=CM r7=CM r8=CM r9=RW r10=ST r11=LW

export type ArrowType = "run" | "pass" | "press" | "triangle"

export interface Arrow {
  x1: number; y1: number
  x2: number; y2: number
  type: ArrowType
}

export interface AnimStep {
  duration: number
  label: string
  info: string
  moves?: Record<string, { x: number; y: number }>
  arrows?: Arrow[]
  ball?: { x: number; y: number }
  highlight?: string[]
}

export interface TacticAnim {
  id: string
  title: string
  category: "pressing" | "transition" | "attaque" | "défense" | "scénario"
  // Moment du jeu (taxonomie DTN) — relie l'animation aux mêmes 4 phases que les situations,
  // pour qu'elles apparaissent ensemble dans le même classement côté board.
  phase: "possession" | "perte" | "defense" | "recuperation"
  summary: string
  steps: AnimStep[]
}

// ─────────────────────────────────────────────
// PRESSING
// ─────────────────────────────────────────────

const gegenpressing: TacticAnim = {
  id: "gegenpressing",
  title: "Gegenpressing",
  category: "pressing",
  phase: "perte",
  summary: "Pression immédiate après perte de balle au milieu",
  steps: [
    {
      duration: 1200,
      label: "Perte de balle",
      info: "Le milieu (r7) perd le ballon au centre du terrain",
      ball: { x: 50, y: 35 },
      highlight: ["r7"],
    },
    {
      duration: 1400,
      label: "Pression immédiate",
      info: "Les trois attaquants ferment les passes directes",
      moves: {
        r9:  { x: 68, y: 37 },
        r10: { x: 50, y: 38 },
        r11: { x: 32, y: 37 },
      },
      arrows: [
        { x1: 82, y1: 45, x2: 68, y2: 37, type: "press" },
        { x1: 50, y1: 43, x2: 50, y2: 38, type: "press" },
        { x1: 18, y1: 45, x2: 32, y2: 37, type: "press" },
      ],
      ball: { x: 50, y: 35 },
    },
    {
      duration: 1400,
      label: "Milieux montent",
      info: "Les milieux montent pour fermer le piège",
      moves: {
        r6: { x: 70, y: 35 },
        r7: { x: 50, y: 33 },
        r8: { x: 30, y: 35 },
      },
      arrows: [
        { x1: 78, y1: 33, x2: 70, y2: 35, type: "run" },
        { x1: 50, y1: 30, x2: 50, y2: 33, type: "run" },
        { x1: 22, y1: 33, x2: 30, y2: 35, type: "run" },
      ],
      ball: { x: 50, y: 35 },
    },
    {
      duration: 1400,
      label: "Piège complet",
      info: "Les latéraux montent — ballon encerclé, récupération",
      moves: {
        r2: { x: 75, y: 28 },
        r5: { x: 25, y: 28 },
        r3: { x: 62, y: 24 },
        r4: { x: 38, y: 24 },
      },
      arrows: [
        { x1: 82, y1: 19, x2: 75, y2: 28, type: "run" },
        { x1: 18, y1: 19, x2: 25, y2: 28, type: "run" },
      ],
      ball: { x: 50, y: 35 },
      highlight: ["r6", "r7", "r8", "r9", "r10", "r11"],
    },
  ],
}

const pressingHaut: TacticAnim = {
  id: "pressing-haut",
  title: "Pressing haut 4-3-3",
  category: "pressing",
  phase: "defense",
  summary: "Pressing organisé dans la moitié adverse",
  steps: [
    {
      duration: 1200,
      label: "Bloc haut",
      info: "L'équipe rouge monte son bloc dans la moitié adverse",
      moves: {
        r9:  { x: 82, y: 32 },
        r10: { x: 50, y: 30 },
        r11: { x: 18, y: 32 },
        r6:  { x: 78, y: 42 },
        r7:  { x: 50, y: 40 },
        r8:  { x: 22, y: 42 },
        r2:  { x: 80, y: 32 },
        r5:  { x: 20, y: 32 },
      },
      ball: { x: 38, y: 25 },
    },
    {
      duration: 1400,
      label: "Trigger pressing",
      info: "Le CB adverse reçoit — ST déclenche le pressing",
      moves: {
        r10: { x: 38, y: 22 },
      },
      arrows: [
        { x1: 50, y1: 30, x2: 38, y2: 22, type: "press" },
      ],
      ball: { x: 38, y: 25 },
      highlight: ["r10"],
    },
    {
      duration: 1400,
      label: "Fermeture des côtés",
      info: "RW et LW ferment les passes vers les latéraux adverses",
      moves: {
        r9:  { x: 68, y: 22 },
        r11: { x: 28, y: 26 },
      },
      arrows: [
        { x1: 82, y1: 32, x2: 68, y2: 22, type: "press" },
        { x1: 18, y1: 32, x2: 28, y2: 26, type: "press" },
      ],
      ball: { x: 38, y: 25 },
    },
    {
      duration: 1400,
      label: "Piège déclenché",
      info: "Le milieu adverse est isolé — récupération",
      moves: {
        r7: { x: 44, y: 32 },
        r6: { x: 64, y: 32 },
      },
      arrows: [
        { x1: 50, y1: 40, x2: 44, y2: 32, type: "run" },
        { x1: 78, y1: 42, x2: 64, y2: 32, type: "run" },
      ],
      ball: { x: 38, y: 25 },
      highlight: ["r9", "r10", "r11"],
    },
  ],
}

// ─────────────────────────────────────────────
// TRANSITIONS
// ─────────────────────────────────────────────

const contraAttaque: TacticAnim = {
  id: "contre-attaque",
  title: "Contre-attaque",
  category: "transition",
  phase: "recuperation",
  summary: "Récupération + transition verticale rapide",
  steps: [
    {
      duration: 1000,
      label: "Bloc défensif",
      info: "Équipe rouge en bloc bas, défense compacte",
      moves: {
        r9:  { x: 70, y: 42 },
        r10: { x: 50, y: 43 },
        r11: { x: 30, y: 42 },
        r6:  { x: 70, y: 38 },
        r7:  { x: 50, y: 36 },
        r8:  { x: 30, y: 38 },
        r2:  { x: 78, y: 28 },
        r5:  { x: 22, y: 28 },
      },
      ball: { x: 62, y: 83 },
    },
    {
      duration: 1200,
      label: "Récupération",
      info: "Le milieu (r7) intercepte et récupère le ballon",
      ball: { x: 50, y: 36 },
      highlight: ["r7"],
    },
    {
      duration: 1300,
      label: "Passe verticale",
      info: "Passe directe sur l'attaquant (r10)",
      arrows: [
        { x1: 50, y1: 36, x2: 50, y2: 58, type: "pass" },
      ],
      ball: { x: 50, y: 58 },
      highlight: ["r7", "r10"],
    },
    {
      duration: 1400,
      label: "Appels en profondeur",
      info: "RW et LW partent en sprint dans le dos de la défense",
      moves: {
        r9:  { x: 82, y: 62 },
        r11: { x: 18, y: 62 },
        r10: { x: 50, y: 60 },
      },
      arrows: [
        { x1: 70, y1: 42, x2: 82, y2: 62, type: "run" },
        { x1: 30, y1: 42, x2: 18, y2: 62, type: "run" },
      ],
      ball: { x: 50, y: 60 },
    },
    {
      duration: 1400,
      label: "Finition",
      info: "ST joue dans le couloir pour RW qui attaque le but",
      moves: {
        r9: { x: 85, y: 72 },
      },
      arrows: [
        { x1: 50, y1: 60, x2: 85, y2: 72, type: "pass" },
        { x1: 85, y1: 62, x2: 85, y2: 72, type: "run" },
      ],
      ball: { x: 85, y: 72 },
      highlight: ["r9"],
    },
  ],
}

const retourDefensif: TacticAnim = {
  id: "retour-defensif",
  title: "Retour défensif",
  category: "transition",
  phase: "perte",
  summary: "Récupération défensive organisée après perte",
  steps: [
    {
      duration: 1000,
      label: "Perte en phase offensive",
      info: "Ballon perdu dans la moitié adverse",
      ball: { x: 62, y: 67 },
      moves: {
        r9:  { x: 82, y: 65 },
        r10: { x: 55, y: 63 },
        r11: { x: 28, y: 67 },
        r6:  { x: 75, y: 55 },
        r7:  { x: 52, y: 52 },
        r8:  { x: 28, y: 55 },
        r2:  { x: 82, y: 45 },
        r5:  { x: 18, y: 47 },
      },
    },
    {
      duration: 1300,
      label: "Sprint défensif",
      info: "Tous les joueurs derrière le ballon en urgence",
      moves: {
        r9:  { x: 75, y: 52 },
        r10: { x: 50, y: 50 },
        r11: { x: 25, y: 52 },
        r6:  { x: 72, y: 43 },
        r8:  { x: 28, y: 43 },
      },
      arrows: [
        { x1: 82, y1: 65, x2: 75, y2: 52, type: "run" },
        { x1: 55, y1: 63, x2: 50, y2: 50, type: "run" },
        { x1: 28, y1: 67, x2: 25, y2: 52, type: "run" },
      ],
      ball: { x: 65, y: 65 },
    },
    {
      duration: 1400,
      label: "Bloc reformé",
      info: "Bloc bas reformé, deux lignes de 4 compactes",
      moves: {
        r9:  { x: 70, y: 43 },
        r10: { x: 50, y: 43 },
        r11: { x: 30, y: 43 },
        r6:  { x: 72, y: 36 },
        r7:  { x: 50, y: 34 },
        r8:  { x: 28, y: 36 },
        r2:  { x: 78, y: 26 },
        r3:  { x: 62, y: 23 },
        r4:  { x: 38, y: 23 },
        r5:  { x: 22, y: 26 },
      },
      ball: { x: 65, y: 65 },
      highlight: ["r2", "r3", "r4", "r5", "r6", "r7", "r8"],
    },
  ],
}

// ─────────────────────────────────────────────
// ATTAQUE / PHASES DE JEU
// ─────────────────────────────────────────────

const constructionArriere: TacticAnim = {
  id: "construction-arriere",
  title: "Construction depuis l'arrière",
  category: "attaque",
  phase: "possession",
  summary: "Sortie du gardien en jeu court, possession basse",
  steps: [
    {
      duration: 1100,
      label: "Gardien en possession",
      info: "Le GK a le ballon — les CBs s'écartent",
      moves: {
        r3: { x: 70, y: 18 },
        r4: { x: 30, y: 18 },
        r2: { x: 88, y: 22 },
        r5: { x: 12, y: 22 },
      },
      ball: { x: 50, y: 6 },
      highlight: ["r1"],
    },
    {
      duration: 1300,
      label: "Jeu sur le CB",
      info: "Le GK joue court sur le CB droit",
      arrows: [
        { x1: 50, y1: 6, x2: 70, y2: 18, type: "pass" },
      ],
      ball: { x: 70, y: 18 },
    },
    {
      duration: 1400,
      label: "Le pivot se décroche",
      info: "Le CM (r7) descend pour recevoir entre les lignes",
      moves: {
        r7: { x: 58, y: 26 },
      },
      arrows: [
        { x1: 50, y1: 30, x2: 58, y2: 26, type: "run" },
        { x1: 70, y1: 18, x2: 58, y2: 26, type: "pass" },
      ],
      ball: { x: 58, y: 26 },
    },
    {
      duration: 1400,
      label: "Le latéral monte",
      info: "RB monte en soutien — triangle CB / CM / RB créé",
      moves: {
        r2: { x: 80, y: 30 },
        r6: { x: 72, y: 36 },
      },
      arrows: [
        { x1: 88, y1: 22, x2: 80, y2: 30, type: "run" },
        { x1: 58, y1: 26, x2: 80, y2: 30, type: "pass" },
      ],
      ball: { x: 80, y: 30 },
      highlight: ["r2", "r3", "r7"],
    },
    {
      duration: 1400,
      label: "Progression milieu",
      info: "Le jeu progresse vers la moitié adverse",
      moves: {
        r7: { x: 58, y: 33 },
        r9: { x: 82, y: 43 },
      },
      arrows: [
        { x1: 80, y1: 30, x2: 72, y2: 36, type: "pass" },
        { x1: 82, y1: 30, x2: 82, y2: 43, type: "run" },
      ],
      ball: { x: 72, y: 36 },
    },
  ],
}

const blocBas: TacticAnim = {
  id: "bloc-bas",
  title: "Bloc bas défensif",
  category: "défense",
  phase: "defense",
  summary: "4-4-2 défensif, deux lignes de 4 très compactes",
  steps: [
    {
      duration: 1200,
      label: "Organisation défensive",
      info: "Passage en 4-4-2 défensif bas — ST et LW forment le bloc",
      moves: {
        r9:  { x: 68, y: 37 },
        r10: { x: 50, y: 37 },
        r11: { x: 32, y: 38 },
        r6:  { x: 75, y: 30 },
        r7:  { x: 55, y: 28 },
        r8:  { x: 35, y: 28 },
        r2:  { x: 80, y: 22 },
        r3:  { x: 62, y: 20 },
        r4:  { x: 38, y: 20 },
        r5:  { x: 20, y: 22 },
      },
      ball: { x: 50, y: 60 },
    },
    {
      duration: 1400,
      label: "Fermeture des espaces",
      info: "Les deux lignes se resserrent — couloirs intérieurs fermés",
      moves: {
        r6:  { x: 70, y: 31 },
        r7:  { x: 52, y: 29 },
        r8:  { x: 34, y: 31 },
        r9:  { x: 65, y: 37 },
        r10: { x: 50, y: 38 },
        r11: { x: 35, y: 37 },
      },
      ball: { x: 68, y: 67 },
      highlight: ["r6", "r7", "r8", "r9", "r10", "r11"],
    },
    {
      duration: 1400,
      label: "Pressing ciblé",
      info: "Si le ballon vient sur le flanc — pressing 2v1 immédiat",
      moves: {
        r9:  { x: 80, y: 57 },
        r6:  { x: 78, y: 48 },
      },
      arrows: [
        { x1: 65, y1: 37, x2: 80, y2: 57, type: "press" },
        { x1: 70, y1: 31, x2: 78, y2: 48, type: "press" },
      ],
      ball: { x: 82, y: 65 },
    },
  ],
}

// ─────────────────────────────────────────────
// SCÉNARIOS : JEUX EN TRIANGLE
// ─────────────────────────────────────────────

const triangleAile: TacticAnim = {
  id: "triangle-aile-droite",
  title: "Triangle aile droite",
  category: "scénario",
  phase: "possession",
  summary: "Combinaison RB + CM + RW dans le couloir droit",
  steps: [
    {
      duration: 1100,
      label: "Mise en place",
      info: "Le triangle se forme : RB (r2), CM droit (r6), RW (r9)",
      ball: { x: 72, y: 36 },
      highlight: ["r2", "r6", "r9"],
      arrows: [
        { x1: 82, y1: 19, x2: 78, y2: 33, type: "triangle" },
        { x1: 78, y1: 33, x2: 82, y2: 45, type: "triangle" },
        { x1: 82, y1: 45, x2: 82, y2: 19, type: "triangle" },
      ],
    },
    {
      duration: 1300,
      label: "1er échange",
      info: "CM (r6) joue dans les pieds de RW (r9) qui crochète",
      moves: {
        r9: { x: 78, y: 43 },
      },
      arrows: [
        { x1: 78, y1: 33, x2: 78, y2: 43, type: "pass" },
        { x1: 82, y1: 19, x2: 85, y2: 36, type: "run" },
      ],
      ball: { x: 78, y: 43 },
      highlight: ["r9"],
    },
    {
      duration: 1300,
      label: "RB monte en soutien",
      info: "RB (r2) dépasse en couloir — RW joue dans son dos",
      moves: {
        r2: { x: 88, y: 42 },
      },
      arrows: [
        { x1: 78, y1: 43, x2: 88, y2: 42, type: "pass" },
        { x1: 85, y1: 36, x2: 88, y2: 42, type: "run" },
      ],
      ball: { x: 88, y: 42 },
      highlight: ["r2"],
    },
    {
      duration: 1300,
      label: "Pénétration + centre",
      info: "RB centre depuis le couloir — RW coupe au 2nd poteau",
      moves: {
        r2:  { x: 90, y: 58 },
        r9:  { x: 72, y: 62 },
        r10: { x: 55, y: 65 },
      },
      arrows: [
        { x1: 88, y1: 42, x2: 90, y2: 58, type: "run" },
        { x1: 90, y1: 58, x2: 72, y2: 65, type: "pass" },
        { x1: 78, y1: 43, x2: 72, y2: 62, type: "run" },
      ],
      ball: { x: 72, y: 65 },
      highlight: ["r9", "r10"],
    },
  ],
}

const triangleMilieu: TacticAnim = {
  id: "triangle-milieu",
  title: "Triangle central milieu",
  category: "scénario",
  phase: "possession",
  summary: "Possession par les trois milieux — tiki-taka central",
  steps: [
    {
      duration: 1100,
      label: "Triangle milieu",
      info: "Triangle entre r6 (CM droit), r7 (CM centre), r8 (CM gauche)",
      ball: { x: 50, y: 30 },
      highlight: ["r6", "r7", "r8"],
      arrows: [
        { x1: 78, y1: 33, x2: 50, y2: 30, type: "triangle" },
        { x1: 50, y1: 30, x2: 22, y2: 33, type: "triangle" },
        { x1: 22, y1: 33, x2: 78, y2: 33, type: "triangle" },
      ],
    },
    {
      duration: 1300,
      label: "Décrochage pivot",
      info: "r7 descend entre les CBs pour recevoir et orienter",
      moves: {
        r7: { x: 50, y: 24 },
      },
      arrows: [
        { x1: 50, y1: 30, x2: 50, y2: 24, type: "run" },
        { x1: 38, y1: 17, x2: 50, y2: 24, type: "pass" },
      ],
      ball: { x: 50, y: 24 },
      highlight: ["r7"],
    },
    {
      duration: 1300,
      label: "Appel en profondeur",
      info: "r6 monte entre les lignes — r7 joue dans son dos",
      moves: {
        r6: { x: 68, y: 38 },
      },
      arrows: [
        { x1: 78, y1: 33, x2: 68, y2: 38, type: "run" },
        { x1: 50, y1: 24, x2: 68, y2: 38, type: "pass" },
      ],
      ball: { x: 68, y: 38 },
      highlight: ["r6"],
    },
    {
      duration: 1300,
      label: "3e homme",
      info: "r8 arrive en 3e homme côté gauche — combinaison terminée",
      moves: {
        r8:  { x: 38, y: 40 },
        r11: { x: 18, y: 52 },
      },
      arrows: [
        { x1: 22, y1: 33, x2: 38, y2: 40, type: "run" },
        { x1: 68, y1: 38, x2: 38, y2: 40, type: "pass" },
        { x1: 18, y1: 45, x2: 18, y2: 52, type: "run" },
      ],
      ball: { x: 38, y: 40 },
      highlight: ["r6", "r7", "r8"],
    },
  ],
}

const triangleZoneCentrale: TacticAnim = {
  id: "triangle-zone-centrale",
  title: "Triangle zone centrale",
  category: "scénario",
  phase: "possession",
  summary: "Combinaison ST + CAM + LW dans la zone de finition",
  steps: [
    {
      duration: 1000,
      label: "Zone centrale occupée",
      info: "ST (r10), LW (r11) et CM (r7) créent un triangle offensif",
      moves: {
        r7:  { x: 50, y: 38 },
        r10: { x: 50, y: 52 },
        r11: { x: 28, y: 50 },
      },
      ball: { x: 50, y: 38 },
      highlight: ["r7", "r10", "r11"],
      arrows: [
        { x1: 50, y1: 38, x2: 50, y2: 52, type: "triangle" },
        { x1: 50, y1: 52, x2: 28, y2: 50, type: "triangle" },
        { x1: 28, y1: 50, x2: 50, y2: 38, type: "triangle" },
      ],
    },
    {
      duration: 1300,
      label: "1-2 central",
      info: "r7 joue pour r10, r10 remet en 1 touche",
      arrows: [
        { x1: 50, y1: 38, x2: 50, y2: 52, type: "pass" },
        { x1: 50, y1: 52, x2: 38, y2: 44, type: "pass" },
        { x1: 50, y1: 38, x2: 38, y2: 44, type: "run" },
      ],
      ball: { x: 38, y: 44 },
    },
    {
      duration: 1300,
      label: "LW coupe au but",
      info: "LW (r11) reçoit et part en dribble vers le but",
      moves: {
        r11: { x: 35, y: 58 },
        r10: { x: 52, y: 60 },
      },
      arrows: [
        { x1: 38, y1: 44, x2: 35, y2: 58, type: "pass" },
        { x1: 28, y1: 50, x2: 35, y2: 58, type: "run" },
        { x1: 50, y1: 52, x2: 52, y2: 60, type: "run" },
      ],
      ball: { x: 35, y: 58 },
      highlight: ["r11"],
    },
    {
      duration: 1300,
      label: "Tir ou passe décisive",
      info: "LW tire ou sert r10 au second poteau",
      moves: {
        r11: { x: 30, y: 65 },
      },
      arrows: [
        { x1: 35, y1: 58, x2: 30, y2: 65, type: "run" },
        { x1: 30, y1: 65, x2: 52, y2: 72, type: "pass" },
      ],
      ball: { x: 52, y: 72 },
      highlight: ["r10", "r11"],
    },
  ],
}

const fauxNeuf: TacticAnim = {
  id: "faux-9",
  title: "Faux numéro 9",
  category: "attaque",
  phase: "possession",
  summary: "L'attaquant décroche pour attirer son marqueur et ouvrir l'espace dans son dos",
  steps: [
    {
      duration: 1100,
      label: "Position avancée",
      info: "ST (r10) tient la ligne comme un attaquant de pointe classique",
      moves: {
        r10: { x: 50, y: 30 },
        r9:  { x: 78, y: 33 },
        r11: { x: 22, y: 33 },
        r6:  { x: 70, y: 42 },
        r7:  { x: 50, y: 40 },
        r8:  { x: 30, y: 42 },
      },
      ball: { x: 50, y: 50 },
      highlight: ["r10"],
    },
    {
      duration: 1300,
      label: "Décrochage du faux 9",
      info: "r10 quitte la ligne d'attaque et vient chercher le ballon entre les lignes",
      moves: {
        r10: { x: 50, y: 42 },
      },
      arrows: [
        { x1: 50, y1: 30, x2: 50, y2: 42, type: "run" },
      ],
      ball: { x: 50, y: 42 },
      highlight: ["r10"],
    },
    {
      duration: 1400,
      label: "Le marqueur suit — l'espace s'ouvre",
      info: "Le défenseur central adverse sort de sa ligne pour le suivre : un couloir énorme se libère dans son dos",
      moves: {
        r10: { x: 50, y: 45 },
      },
      ball: { x: 50, y: 45 },
      highlight: ["r10"],
    },
    {
      duration: 1400,
      label: "Appels dans l'espace libéré",
      info: "RW et LW (r9, r11) sprintent dans la zone laissée vide par le défenseur déplacé",
      moves: {
        r9:  { x: 68, y: 52 },
        r11: { x: 32, y: 52 },
      },
      arrows: [
        { x1: 78, y1: 33, x2: 68, y2: 52, type: "run" },
        { x1: 22, y1: 33, x2: 32, y2: 52, type: "run" },
      ],
      ball: { x: 50, y: 45 },
      highlight: ["r9", "r11"],
    },
    {
      duration: 1400,
      label: "Passe filtrée et finition",
      info: "r10 trouve r9 dans l'intervalle — situation de but franche",
      moves: {
        r9:  { x: 74, y: 68 },
        r10: { x: 50, y: 58 },
      },
      arrows: [
        { x1: 50, y1: 45, x2: 74, y2: 68, type: "pass" },
        { x1: 68, y1: 52, x2: 74, y2: 68, type: "run" },
      ],
      ball: { x: 74, y: 68 },
      highlight: ["r9", "r10"],
    },
  ],
}

export const ANIMATIONS: TacticAnim[] = [
  gegenpressing,
  pressingHaut,
  contraAttaque,
  retourDefensif,
  constructionArriere,
  blocBas,
  triangleAile,
  triangleMilieu,
  triangleZoneCentrale,
  fauxNeuf,
]

export const CATEGORIES = ["pressing", "transition", "attaque", "défense", "scénario"] as const
