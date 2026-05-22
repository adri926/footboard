export interface FormationPlayer {
  name: string
  x: number
  y: number
}

export interface FormationConfig {
  id: string
  label: string
  description: string
  players: FormationPlayer[]
}

export function mirrorY(players: FormationPlayer[]): FormationPlayer[] {
  return players.map(p => ({ ...p, y: 100 - p.y }))
}

export const FORMATIONS: FormationConfig[] = [
  {
    id: "4-3-3",
    label: "4-3-3",
    description: "Pressing haut, largeur offensive",
    players: [
      { name: "GK", x: 50, y: 6 },
      { name: "RB", x: 82, y: 19 }, { name: "CB", x: 62, y: 17 }, { name: "CB", x: 38, y: 17 }, { name: "LB", x: 18, y: 19 },
      { name: "CM", x: 78, y: 33 }, { name: "CM", x: 50, y: 30 }, { name: "CM", x: 22, y: 33 },
      { name: "RW", x: 82, y: 45 }, { name: "ST", x: 50, y: 43 }, { name: "LW", x: 18, y: 45 },
    ],
  },
  {
    id: "4-2-3-1",
    label: "4-2-3-1",
    description: "Double pivot, contrôle du milieu",
    players: [
      { name: "GK",  x: 50, y: 6 },
      { name: "RB",  x: 82, y: 19 }, { name: "CB",  x: 62, y: 17 }, { name: "CB",  x: 38, y: 17 }, { name: "LB",  x: 18, y: 19 },
      { name: "CDM", x: 65, y: 29 }, { name: "CDM", x: 35, y: 29 },
      { name: "RM",  x: 80, y: 40 }, { name: "CAM", x: 50, y: 37 }, { name: "LM",  x: 20, y: 40 },
      { name: "ST",  x: 50, y: 47 },
    ],
  },
  {
    id: "4-4-2",
    label: "4-4-2",
    description: "Classique, équilibre défense/attaque",
    players: [
      { name: "GK", x: 50, y: 6 },
      { name: "RB", x: 82, y: 19 }, { name: "CB", x: 62, y: 17 }, { name: "CB", x: 38, y: 17 }, { name: "LB", x: 18, y: 19 },
      { name: "RM", x: 82, y: 33 }, { name: "CM", x: 60, y: 31 }, { name: "CM", x: 40, y: 31 }, { name: "LM", x: 18, y: 33 },
      { name: "ST", x: 65, y: 44 }, { name: "ST", x: 35, y: 44 },
    ],
  },
  {
    id: "4-4-2-diamant",
    label: "4-4-2 Diamant",
    description: "Milieu en losange, CAM créateur",
    players: [
      { name: "GK",  x: 50, y: 6 },
      { name: "RB",  x: 82, y: 19 }, { name: "CB",  x: 62, y: 17 }, { name: "CB",  x: 38, y: 17 }, { name: "LB",  x: 18, y: 19 },
      { name: "CDM", x: 50, y: 29 },
      { name: "CM",  x: 75, y: 37 }, { name: "CM",  x: 25, y: 37 },
      { name: "CAM", x: 50, y: 43 },
      { name: "ST",  x: 63, y: 47 }, { name: "ST",  x: 37, y: 47 },
    ],
  },
  {
    id: "3-5-2",
    label: "3-5-2",
    description: "Largeur par les pistons",
    players: [
      { name: "GK",  x: 50, y: 6 },
      { name: "CB",  x: 75, y: 17 }, { name: "CB",  x: 50, y: 15 }, { name: "CB",  x: 25, y: 17 },
      { name: "RWB", x: 88, y: 32 }, { name: "CM",  x: 68, y: 29 }, { name: "CM",  x: 50, y: 27 }, { name: "CM",  x: 32, y: 29 }, { name: "LWB", x: 12, y: 32 },
      { name: "ST",  x: 63, y: 44 }, { name: "ST",  x: 37, y: 44 },
    ],
  },
  {
    id: "3-4-3",
    label: "3-4-3",
    description: "Très offensif, trois attaquants",
    players: [
      { name: "GK", x: 50, y: 6 },
      { name: "CB", x: 75, y: 17 }, { name: "CB", x: 50, y: 15 }, { name: "CB", x: 25, y: 17 },
      { name: "RM", x: 80, y: 31 }, { name: "CM", x: 60, y: 29 }, { name: "CM", x: 40, y: 29 }, { name: "LM", x: 20, y: 31 },
      { name: "RW", x: 78, y: 44 }, { name: "ST", x: 50, y: 42 }, { name: "LW", x: 22, y: 44 },
    ],
  },
  {
    id: "5-3-2",
    label: "5-3-2",
    description: "Bloc défensif solide, contre-attaque",
    players: [
      { name: "GK",  x: 50, y: 6 },
      { name: "RWB", x: 88, y: 21 }, { name: "CB",  x: 70, y: 17 }, { name: "CB",  x: 50, y: 15 }, { name: "CB",  x: 30, y: 17 }, { name: "LWB", x: 12, y: 21 },
      { name: "CM",  x: 25, y: 33 }, { name: "CM",  x: 50, y: 31 }, { name: "CM",  x: 75, y: 33 },
      { name: "ST",  x: 62, y: 44 }, { name: "ST",  x: 38, y: 44 },
    ],
  },
  {
    id: "5-4-1",
    label: "5-4-1",
    description: "Très défensif, une pointe",
    players: [
      { name: "GK",  x: 50, y: 6 },
      { name: "RWB", x: 88, y: 21 }, { name: "CB",  x: 70, y: 17 }, { name: "CB",  x: 50, y: 15 }, { name: "CB",  x: 30, y: 17 }, { name: "LWB", x: 12, y: 21 },
      { name: "RM",  x: 80, y: 33 }, { name: "CM",  x: 60, y: 31 }, { name: "CM",  x: 40, y: 31 }, { name: "LM",  x: 20, y: 33 },
      { name: "ST",  x: 50, y: 44 },
    ],
  },
  {
    id: "4-1-4-1",
    label: "4-1-4-1",
    description: "CDM protecteur, bloc compact",
    players: [
      { name: "GK",  x: 50, y: 6 },
      { name: "RB",  x: 82, y: 18 }, { name: "CB",  x: 62, y: 16 }, { name: "CB",  x: 38, y: 16 }, { name: "LB",  x: 18, y: 18 },
      { name: "CDM", x: 50, y: 27 },
      { name: "RM",  x: 80, y: 37 }, { name: "CM",  x: 60, y: 35 }, { name: "CM",  x: 40, y: 35 }, { name: "LM",  x: 20, y: 37 },
      { name: "ST",  x: 50, y: 46 },
    ],
  },
  {
    id: "4-3-2-1",
    label: "4-3-2-1",
    description: "Sapin de Noël, deux meneur",
    players: [
      { name: "GK", x: 50, y: 6 },
      { name: "RB", x: 82, y: 18 }, { name: "CB", x: 62, y: 16 }, { name: "CB", x: 38, y: 16 }, { name: "LB", x: 18, y: 18 },
      { name: "CM", x: 22, y: 30 }, { name: "CM", x: 50, y: 28 }, { name: "CM", x: 78, y: 30 },
      { name: "SS", x: 65, y: 39 }, { name: "SS", x: 35, y: 39 },
      { name: "ST", x: 50, y: 47 },
    ],
  },
  {
    id: "4-5-1",
    label: "4-5-1",
    description: "Cinq milieux, occupation du terrain",
    players: [
      { name: "GK", x: 50, y: 6 },
      { name: "RB", x: 82, y: 18 }, { name: "CB", x: 62, y: 16 }, { name: "CB", x: 38, y: 16 }, { name: "LB", x: 18, y: 18 },
      { name: "RM", x: 88, y: 34 }, { name: "CM", x: 68, y: 32 }, { name: "CM", x: 50, y: 30 }, { name: "CM", x: 32, y: 32 }, { name: "LM", x: 12, y: 34 },
      { name: "ST", x: 50, y: 45 },
    ],
  },
  {
    id: "3-4-1-2",
    label: "3-4-1-2",
    description: "CAM entre les lignes, deux attaquants",
    players: [
      { name: "GK",  x: 50, y: 6 },
      { name: "CB",  x: 75, y: 17 }, { name: "CB",  x: 50, y: 15 }, { name: "CB",  x: 25, y: 17 },
      { name: "RM",  x: 80, y: 29 }, { name: "CM",  x: 60, y: 27 }, { name: "CM",  x: 40, y: 27 }, { name: "LM",  x: 20, y: 29 },
      { name: "CAM", x: 50, y: 39 },
      { name: "ST",  x: 63, y: 46 }, { name: "ST",  x: 37, y: 46 },
    ],
  },
  {
    id: "4-2-4",
    label: "4-2-4",
    description: "Ultra offensif, double pivot",
    players: [
      { name: "GK",  x: 50, y: 6 },
      { name: "RB",  x: 82, y: 19 }, { name: "CB",  x: 62, y: 17 }, { name: "CB",  x: 38, y: 17 }, { name: "LB",  x: 18, y: 19 },
      { name: "CDM", x: 65, y: 30 }, { name: "CDM", x: 35, y: 30 },
      { name: "RW",  x: 85, y: 43 }, { name: "ST",  x: 62, y: 41 }, { name: "ST",  x: 38, y: 41 }, { name: "LW",  x: 15, y: 43 },
    ],
  },
  {
    id: "3-6-1",
    label: "3-6-1",
    description: "Six milieux, domination possession",
    players: [
      { name: "GK",  x: 50, y: 6 },
      { name: "CB",  x: 75, y: 17 }, { name: "CB",  x: 50, y: 15 }, { name: "CB",  x: 25, y: 17 },
      { name: "RWB", x: 88, y: 30 }, { name: "CM",  x: 70, y: 28 }, { name: "CM",  x: 54, y: 26 }, { name: "CM",  x: 46, y: 26 }, { name: "CM",  x: 30, y: 28 }, { name: "LWB", x: 12, y: 30 },
      { name: "ST",  x: 50, y: 43 },
    ],
  },
  {
    id: "5-2-3",
    label: "5-2-3",
    description: "Défense à cinq, trois attaquants",
    players: [
      { name: "GK",  x: 50, y: 6 },
      { name: "RWB", x: 88, y: 21 }, { name: "CB",  x: 70, y: 17 }, { name: "CB",  x: 50, y: 15 }, { name: "CB",  x: 30, y: 17 }, { name: "LWB", x: 12, y: 21 },
      { name: "CM",  x: 62, y: 33 }, { name: "CM",  x: 38, y: 33 },
      { name: "RW",  x: 80, y: 44 }, { name: "ST",  x: 50, y: 42 }, { name: "LW",  x: 20, y: 44 },
    ],
  },
  {
    id: "4-6-0",
    label: "4-6-0",
    description: "Sans attaquant, faux neuf, tiki-taka",
    players: [
      { name: "GK",  x: 50, y: 6 },
      { name: "RB",  x: 82, y: 18 }, { name: "CB",  x: 62, y: 16 }, { name: "CB",  x: 38, y: 16 }, { name: "LB",  x: 18, y: 18 },
      { name: "RM",  x: 88, y: 30 }, { name: "CM",  x: 68, y: 28 }, { name: "CAM", x: 55, y: 38 }, { name: "CAM", x: 45, y: 38 }, { name: "CM",  x: 32, y: 28 }, { name: "LM",  x: 12, y: 30 },
    ],
  },
]
