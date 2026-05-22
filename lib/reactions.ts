// Système de réaction de l'adversaire selon la position du ballon
// Terrain divisé en 9 zones (3×3)
// x: 0=gauche 100=droite | y: 0=haut(rouge) 100=bas(bleu)

export type Zone =
  | "top-left"  | "top-center"  | "top-right"
  | "mid-left"  | "mid-center"  | "mid-right"
  | "bot-left"  | "bot-center"  | "bot-right"

export type Block = "bloc-haut" | "bloc-median" | "bloc-bas"

export interface Reaction {
  label: string
  description: string
  moves: Partial<Record<string, { x: number; y: number }>>
  arrows?: Array<{ x1:number; y1:number; x2:number; y2:number; type:"run"|"press"|"pass"|"triangle" }>
}

export function getZone(x: number, y: number): Zone {
  const col = x < 33 ? "left" : x < 67 ? "center" : "right"
  const row = y < 33 ? "top"  : y < 67 ? "mid"    : "bot"
  return `${row}-${col}` as Zone
}

// Positions de base bleues selon le bloc (point de départ des réactions)
export const BASE_POSITIONS: Record<Block, Partial<Record<string, { x: number; y: number }>>> = {
  "bloc-haut": {
    b1:{x:50,y:70}, b2:{x:80,y:58}, b3:{x:62,y:60}, b4:{x:38,y:60}, b5:{x:20,y:58},
    b6:{x:80,y:46}, b7:{x:60,y:44}, b8:{x:40,y:44}, b9:{x:20,y:46},
    b10:{x:63,y:33}, b11:{x:37,y:33},
  },
  "bloc-median": {
    b1:{x:50,y:84}, b2:{x:80,y:72}, b3:{x:62,y:74}, b4:{x:38,y:74}, b5:{x:20,y:72},
    b6:{x:80,y:60}, b7:{x:60,y:58}, b8:{x:40,y:58}, b9:{x:20,y:60},
    b10:{x:63,y:48}, b11:{x:37,y:48},
  },
  "bloc-bas": {
    b1:{x:50,y:93}, b2:{x:80,y:82}, b3:{x:62,y:84}, b4:{x:38,y:84}, b5:{x:20,y:82},
    b6:{x:76,y:72}, b7:{x:60,y:70}, b8:{x:40,y:70}, b9:{x:24,y:72},
    b10:{x:63,y:60}, b11:{x:37,y:60},
  },
}

// ─── RÉACTIONS PAR ZONE × BLOC ────────────────────────────────
// Seuls les joueurs qui bougent sont listés dans `moves`

const R: Record<Zone, Record<Block, Reaction>> = {

  // ── ZONE HAUTE GAUCHE (ballon dans le camp de l'attaque rouge, côté gauche)
  "top-left": {
    "bloc-bas": {
      label: "Bloc bas — retrait profond",
      description: "Ballon loin → bleu reste groupé, deux ST légèrement abaissés",
      moves: { b10:{x:55,y:62}, b11:{x:35,y:62} },
    },
    "bloc-median": {
      label: "Bloc médian — vigilance",
      description: "Les milieux gauches surveillent la montée latérale",
      moves: { b11:{x:30,y:52}, b8:{x:38,y:56}, b9:{x:22,y:58} },
      arrows: [{ x1:37,y1:48, x2:30,y2:52, type:"run" }],
    },
    "bloc-haut": {
      label: "Bloc haut — pressing côté gauche",
      description: "Le ST gauche et le milieu gauche montent presser",
      moves: { b11:{x:22,y:28}, b9:{x:18,y:38}, b8:{x:38,y:40} },
      arrows: [
        { x1:37,y1:33, x2:22,y2:28, type:"press" },
        { x1:20,y1:46, x2:18,y2:38, type:"press" },
      ],
    },
  },

  // ── ZONE HAUTE CENTRE
  "top-center": {
    "bloc-bas": {
      label: "Bloc bas — forme compacte",
      description: "Ballon dans le camp rouge → bleu reste dans son bloc profond",
      moves: {},
    },
    "bloc-median": {
      label: "Bloc médian — deux ST pressent",
      description: "Les deux attaquants montent pour contester la relance",
      moves: { b10:{x:60,y:42}, b11:{x:40,y:42} },
      arrows: [
        { x1:63,y1:48, x2:60,y2:42, type:"press" },
        { x1:37,y1:48, x2:40,y2:42, type:"press" },
      ],
    },
    "bloc-haut": {
      label: "Bloc haut — pressing total",
      description: "ST + milieux montent agressivement sur la relance courte",
      moves: { b10:{x:58,y:26}, b11:{x:42,y:26}, b7:{x:55,y:38}, b8:{x:42,y:38} },
      arrows: [
        { x1:63,y1:33, x2:58,y2:26, type:"press" },
        { x1:37,y1:33, x2:42,y2:26, type:"press" },
        { x1:60,y1:44, x2:55,y2:38, type:"press" },
      ],
    },
  },

  // ── ZONE HAUTE DROITE
  "top-right": {
    "bloc-bas": {
      label: "Bloc bas — retrait profond",
      description: "Ballon loin → bleu reste groupé",
      moves: { b10:{x:65,y:62}, b11:{x:45,y:62} },
    },
    "bloc-median": {
      label: "Bloc médian — vigilance droite",
      description: "Les milieux droits surveillent la montée latérale",
      moves: { b10:{x:68,y:52}, b7:{x:62,y:56}, b6:{x:78,y:58} },
      arrows: [{ x1:63,y1:48, x2:68,y2:52, type:"run" }],
    },
    "bloc-haut": {
      label: "Bloc haut — pressing côté droit",
      description: "Le ST droit et le milieu droit montent presser",
      moves: { b10:{x:75,y:28}, b6:{x:80,y:38}, b7:{x:62,y:40} },
      arrows: [
        { x1:63,y1:33, x2:75,y2:28, type:"press" },
        { x1:80,y1:46, x2:80,y2:38, type:"press" },
      ],
    },
  },

  // ── ZONE MILIEU GAUCHE (couloir gauche)
  "mid-left": {
    "bloc-bas": {
      label: "Bloc bas — fermeture couloir gauche",
      description: "LM monte légèrement, CB gauche glisse, ST couvre l'intérieur",
      moves: { b9:{x:18,y:64}, b4:{x:34,y:76}, b11:{x:30,y:56} },
      arrows: [
        { x1:24,y1:72, x2:18,y2:64, type:"run" },
        { x1:38,y1:84, x2:34,y2:76, type:"run" },
      ],
    },
    "bloc-median": {
      label: "Bloc médian — double pression gauche",
      description: "LM + LB ferment le couloir, milieu centre couvre",
      moves: { b9:{x:16,y:55}, b5:{x:18,y:64}, b8:{x:36,y:54}, b11:{x:25,y:46} },
      arrows: [
        { x1:20,y1:60, x2:16,y2:55, type:"press" },
        { x1:20,y1:72, x2:18,y2:64, type:"run"  },
      ],
    },
    "bloc-haut": {
      label: "Bloc haut — piège couloir gauche",
      description: "3 joueurs piègent le porteur sur la touche gauche",
      moves: { b9:{x:14,y:48}, b5:{x:16,y:56}, b11:{x:18,y:38}, b4:{x:35,y:62} },
      arrows: [
        { x1:20,y1:46, x2:14,y2:48, type:"press" },
        { x1:20,y1:58, x2:16,y2:56, type:"press" },
        { x1:37,y1:33, x2:18,y2:38, type:"press" },
      ],
    },
  },

  // ── ZONE MILIEU CENTRE
  "mid-center": {
    "bloc-bas": {
      label: "Bloc bas — compression centrale",
      description: "Les 4 milieux se resserrent, les CB montent légèrement",
      moves: { b7:{x:55,y:66}, b8:{x:45,y:66}, b3:{x:60,y:80}, b4:{x:40,y:80} },
    },
    "bloc-median": {
      label: "Bloc médian — pressing 2v1 central",
      description: "Deux milieux pressent le porteur central, les ST couvrent les passes",
      moves: { b7:{x:56,y:54}, b8:{x:44,y:54}, b10:{x:60,y:48}, b11:{x:40,y:48} },
      arrows: [
        { x1:60,y1:58, x2:56,y2:54, type:"press" },
        { x1:40,y1:58, x2:44,y2:54, type:"press" },
      ],
    },
    "bloc-haut": {
      label: "Bloc haut — gegenpressing central",
      description: "4 joueurs encerclent le porteur — récupération immédiate",
      moves: { b7:{x:55,y:46}, b8:{x:45,y:46}, b10:{x:58,y:38}, b11:{x:42,y:38}, b3:{x:60,y:56}, b4:{x:40,y:56} },
      arrows: [
        { x1:60,y1:44, x2:55,y2:46, type:"press" },
        { x1:40,y1:44, x2:45,y2:46, type:"press" },
        { x1:63,y1:33, x2:58,y2:38, type:"press" },
        { x1:37,y1:33, x2:42,y2:38, type:"press" },
      ],
    },
  },

  // ── ZONE MILIEU DROITE (couloir droit)
  "mid-right": {
    "bloc-bas": {
      label: "Bloc bas — fermeture couloir droit",
      description: "RM monte, CB droit glisse, ST couvre l'intérieur",
      moves: { b6:{x:82,y:64}, b3:{x:66,y:76}, b10:{x:70,y:56} },
      arrows: [
        { x1:76,y1:72, x2:82,y2:64, type:"run" },
        { x1:62,y1:84, x2:66,y2:76, type:"run" },
      ],
    },
    "bloc-median": {
      label: "Bloc médian — double pression droite",
      description: "RM + RB ferment le couloir, milieu centre couvre",
      moves: { b6:{x:84,y:55}, b2:{x:82,y:64}, b7:{x:64,y:54}, b10:{x:74,y:46} },
      arrows: [
        { x1:80,y1:60, x2:84,y2:55, type:"press" },
        { x1:80,y1:72, x2:82,y2:64, type:"run"  },
      ],
    },
    "bloc-haut": {
      label: "Bloc haut — piège couloir droit",
      description: "3 joueurs piègent le porteur sur la touche droite",
      moves: { b6:{x:86,y:48}, b2:{x:84,y:56}, b10:{x:82,y:38}, b3:{x:65,y:62} },
      arrows: [
        { x1:80,y1:46, x2:86,y2:48, type:"press" },
        { x1:80,y1:58, x2:84,y2:56, type:"press" },
        { x1:63,y1:33, x2:82,y2:38, type:"press" },
      ],
    },
  },

  // ── ZONE BAS GAUCHE (dans la surface, côté gauche)
  "bot-left": {
    "bloc-bas": {
      label: "Bloc bas — défense en zone gauche",
      description: "CB gauche et LB serrent, milieux descendent en couverture",
      moves: { b4:{x:30,y:80}, b5:{x:14,y:76}, b8:{x:36,y:68}, b11:{x:26,y:62} },
      arrows: [
        { x1:38,y1:84, x2:30,y2:80, type:"run" },
        { x1:20,y1:82, x2:14,y2:76, type:"run" },
      ],
    },
    "bloc-median": {
      label: "Bloc médian — pressing sur le flanc gauche",
      description: "LM + LB pressent, CB et milieu couvrent l'intérieur",
      moves: { b9:{x:12,y:62}, b5:{x:16,y:70}, b4:{x:32,y:76}, b8:{x:34,y:60} },
      arrows: [
        { x1:20,y1:60, x2:12,y2:62, type:"press" },
        { x1:20,y1:72, x2:16,y2:70, type:"press" },
      ],
    },
    "bloc-haut": {
      label: "Bloc haut — pressing agressif gauche",
      description: "4 joueurs pressent immédiatement dans la surface adverse",
      moves: { b9:{x:10,y:55}, b5:{x:14,y:65}, b11:{x:20,y:50}, b4:{x:30,y:70}, b8:{x:35,y:56} },
      arrows: [
        { x1:20,y1:60, x2:10,y2:55, type:"press" },
        { x1:37,y1:33, x2:20,y2:50, type:"press" },
      ],
    },
  },

  // ── ZONE BAS CENTRE (devant le but bleu)
  "bot-center": {
    "bloc-bas": {
      label: "Bloc bas — mur défensif",
      description: "Les 4 défenseurs se resserrent, les milieux descendent en renfort",
      moves: { b3:{x:58,y:80}, b4:{x:42,y:80}, b2:{x:74,y:78}, b5:{x:26,y:78}, b7:{x:55,y:68}, b8:{x:45,y:68} },
      arrows: [
        { x1:62,y1:84, x2:58,y2:80, type:"run" },
        { x1:38,y1:84, x2:42,y2:80, type:"run" },
      ],
    },
    "bloc-median": {
      label: "Bloc médian — défense compacte devant le but",
      description: "Bloc resserré, les milieux descendent pour doubler les défenseurs",
      moves: { b3:{x:60,y:78}, b4:{x:40,y:78}, b7:{x:56,y:65}, b8:{x:44,y:65}, b10:{x:58,y:58}, b11:{x:42,y:58} },
    },
    "bloc-haut": {
      label: "Bloc haut — sortie de balle agressive",
      description: "Les défenseurs sortent au contact, les milieux suivent",
      moves: { b3:{x:60,y:72}, b4:{x:40,y:72}, b2:{x:76,y:68}, b5:{x:24,y:68}, b7:{x:56,y:60}, b8:{x:44,y:60} },
      arrows: [
        { x1:62,y1:84, x2:60,y2:72, type:"press" },
        { x1:38,y1:84, x2:40,y2:72, type:"press" },
      ],
    },
  },

  // ── ZONE BAS DROITE (dans la surface, côté droit)
  "bot-right": {
    "bloc-bas": {
      label: "Bloc bas — défense en zone droite",
      description: "CB droit et RB serrent, milieux descendent en couverture",
      moves: { b3:{x:70,y:80}, b2:{x:86,y:76}, b7:{x:64,y:68}, b10:{x:74,y:62} },
      arrows: [
        { x1:62,y1:84, x2:70,y2:80, type:"run" },
        { x1:80,y1:82, x2:86,y2:76, type:"run" },
      ],
    },
    "bloc-median": {
      label: "Bloc médian — pressing sur le flanc droit",
      description: "RM + RB pressent, CB et milieu couvrent l'intérieur",
      moves: { b6:{x:88,y:62}, b2:{x:84,y:70}, b3:{x:68,y:76}, b7:{x:66,y:60} },
      arrows: [
        { x1:80,y1:60, x2:88,y2:62, type:"press" },
        { x1:80,y1:72, x2:84,y2:70, type:"press" },
      ],
    },
    "bloc-haut": {
      label: "Bloc haut — pressing agressif droit",
      description: "4 joueurs pressent immédiatement dans la surface adverse",
      moves: { b6:{x:90,y:55}, b2:{x:86,y:65}, b10:{x:80,y:50}, b3:{x:70,y:70}, b7:{x:65,y:56} },
      arrows: [
        { x1:80,y1:60, x2:90,y2:55, type:"press" },
        { x1:63,y1:33, x2:80,y2:50, type:"press" },
      ],
    },
  },
}

export const REACTIONS = R
