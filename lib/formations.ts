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
      { name: "GB", x: 50, y: 6 },
      { name: "DD", x: 82, y: 19 }, { name: "DC", x: 62, y: 17 }, { name: "DC", x: 38, y: 17 }, { name: "DG", x: 18, y: 19 },
      { name: "MC", x: 78, y: 33 }, { name: "MC", x: 50, y: 30 }, { name: "MC", x: 22, y: 33 },
      { name: "AD", x: 82, y: 45 }, { name: "BU", x: 50, y: 43 }, { name: "AG", x: 18, y: 45 },
    ],
  },
  {
    id: "4-2-3-1",
    label: "4-2-3-1",
    description: "Double pivot, contrôle du milieu",
    players: [
      { name: "GB",  x: 50, y: 6 },
      { name: "DD",  x: 82, y: 19 }, { name: "DC",  x: 62, y: 17 }, { name: "DC",  x: 38, y: 17 }, { name: "DG",  x: 18, y: 19 },
      { name: "MDC", x: 65, y: 29 }, { name: "MDC", x: 35, y: 29 },
      { name: "MD",  x: 80, y: 40 }, { name: "MOC", x: 50, y: 37 }, { name: "MG",  x: 20, y: 40 },
      { name: "BU",  x: 50, y: 47 },
    ],
  },
  {
    id: "4-4-2",
    label: "4-4-2",
    description: "Classique, équilibre défense/attaque",
    players: [
      { name: "GB", x: 50, y: 6 },
      { name: "DD", x: 82, y: 19 }, { name: "DC", x: 62, y: 17 }, { name: "DC", x: 38, y: 17 }, { name: "DG", x: 18, y: 19 },
      { name: "MD", x: 82, y: 33 }, { name: "MC", x: 60, y: 31 }, { name: "MC", x: 40, y: 31 }, { name: "MG", x: 18, y: 33 },
      { name: "BU", x: 65, y: 44 }, { name: "BU", x: 35, y: 44 },
    ],
  },
  {
    id: "4-4-2-diamant",
    label: "4-4-2 Diamant",
    description: "Milieu en losange, CAM créateur",
    players: [
      { name: "GB",  x: 50, y: 6 },
      { name: "DD",  x: 82, y: 19 }, { name: "DC",  x: 62, y: 17 }, { name: "DC",  x: 38, y: 17 }, { name: "DG",  x: 18, y: 19 },
      { name: "MDC", x: 50, y: 29 },
      { name: "MC",  x: 75, y: 37 }, { name: "MC",  x: 25, y: 37 },
      { name: "MOC", x: 50, y: 43 },
      { name: "BU",  x: 63, y: 47 }, { name: "BU",  x: 37, y: 47 },
    ],
  },
  {
    id: "3-5-2",
    label: "3-5-2",
    description: "Largeur par les pistons",
    players: [
      { name: "GB",  x: 50, y: 6 },
      { name: "DC",  x: 75, y: 17 }, { name: "DC",  x: 50, y: 15 }, { name: "DC",  x: 25, y: 17 },
      { name: "PD", x: 88, y: 32 }, { name: "MC",  x: 68, y: 29 }, { name: "MC",  x: 50, y: 27 }, { name: "MC",  x: 32, y: 29 }, { name: "PG", x: 12, y: 32 },
      { name: "BU",  x: 63, y: 44 }, { name: "BU",  x: 37, y: 44 },
    ],
  },
  {
    id: "3-4-3",
    label: "3-4-3",
    description: "Très offensif, trois attaquants",
    players: [
      { name: "GB", x: 50, y: 6 },
      { name: "DC", x: 75, y: 17 }, { name: "DC", x: 50, y: 15 }, { name: "DC", x: 25, y: 17 },
      { name: "MD", x: 80, y: 31 }, { name: "MC", x: 60, y: 29 }, { name: "MC", x: 40, y: 29 }, { name: "MG", x: 20, y: 31 },
      { name: "AD", x: 78, y: 44 }, { name: "BU", x: 50, y: 42 }, { name: "AG", x: 22, y: 44 },
    ],
  },
  {
    id: "5-3-2",
    label: "5-3-2",
    description: "Bloc défensif solide, contre-attaque",
    players: [
      { name: "GB",  x: 50, y: 6 },
      { name: "PD", x: 88, y: 21 }, { name: "DC",  x: 70, y: 17 }, { name: "DC",  x: 50, y: 15 }, { name: "DC",  x: 30, y: 17 }, { name: "PG", x: 12, y: 21 },
      { name: "MC",  x: 25, y: 33 }, { name: "MC",  x: 50, y: 31 }, { name: "MC",  x: 75, y: 33 },
      { name: "BU",  x: 62, y: 44 }, { name: "BU",  x: 38, y: 44 },
    ],
  },
  {
    id: "5-4-1",
    label: "5-4-1",
    description: "Très défensif, une pointe",
    players: [
      { name: "GB",  x: 50, y: 6 },
      { name: "PD", x: 88, y: 21 }, { name: "DC",  x: 70, y: 17 }, { name: "DC",  x: 50, y: 15 }, { name: "DC",  x: 30, y: 17 }, { name: "PG", x: 12, y: 21 },
      { name: "MD",  x: 80, y: 33 }, { name: "MC",  x: 60, y: 31 }, { name: "MC",  x: 40, y: 31 }, { name: "MG",  x: 20, y: 33 },
      { name: "BU",  x: 50, y: 44 },
    ],
  },
  {
    id: "4-1-4-1",
    label: "4-1-4-1",
    description: "CDM protecteur, bloc compact",
    players: [
      { name: "GB",  x: 50, y: 6 },
      { name: "DD",  x: 82, y: 18 }, { name: "DC",  x: 62, y: 16 }, { name: "DC",  x: 38, y: 16 }, { name: "DG",  x: 18, y: 18 },
      { name: "MDC", x: 50, y: 27 },
      { name: "MD",  x: 80, y: 37 }, { name: "MC",  x: 60, y: 35 }, { name: "MC",  x: 40, y: 35 }, { name: "MG",  x: 20, y: 37 },
      { name: "BU",  x: 50, y: 46 },
    ],
  },
  {
    id: "4-3-2-1",
    label: "4-3-2-1",
    description: "Sapin de Noël, deux meneur",
    players: [
      { name: "GB", x: 50, y: 6 },
      { name: "DD", x: 82, y: 18 }, { name: "DC", x: 62, y: 16 }, { name: "DC", x: 38, y: 16 }, { name: "DG", x: 18, y: 18 },
      { name: "MC", x: 22, y: 30 }, { name: "MC", x: 50, y: 28 }, { name: "MC", x: 78, y: 30 },
      { name: "SO", x: 65, y: 39 }, { name: "SO", x: 35, y: 39 },
      { name: "BU", x: 50, y: 47 },
    ],
  },
  {
    id: "4-5-1",
    label: "4-5-1",
    description: "Cinq milieux, occupation du terrain",
    players: [
      { name: "GB", x: 50, y: 6 },
      { name: "DD", x: 82, y: 18 }, { name: "DC", x: 62, y: 16 }, { name: "DC", x: 38, y: 16 }, { name: "DG", x: 18, y: 18 },
      { name: "MD", x: 88, y: 34 }, { name: "MC", x: 68, y: 32 }, { name: "MC", x: 50, y: 30 }, { name: "MC", x: 32, y: 32 }, { name: "MG", x: 12, y: 34 },
      { name: "BU", x: 50, y: 45 },
    ],
  },
  {
    id: "3-4-1-2",
    label: "3-4-1-2",
    description: "CAM entre les lignes, deux attaquants",
    players: [
      { name: "GB",  x: 50, y: 6 },
      { name: "DC",  x: 75, y: 17 }, { name: "DC",  x: 50, y: 15 }, { name: "DC",  x: 25, y: 17 },
      { name: "MD",  x: 80, y: 29 }, { name: "MC",  x: 60, y: 27 }, { name: "MC",  x: 40, y: 27 }, { name: "MG",  x: 20, y: 29 },
      { name: "MOC", x: 50, y: 39 },
      { name: "BU",  x: 63, y: 46 }, { name: "BU",  x: 37, y: 46 },
    ],
  },
  {
    id: "4-2-4",
    label: "4-2-4",
    description: "Ultra offensif, double pivot",
    players: [
      { name: "GB",  x: 50, y: 6 },
      { name: "DD",  x: 82, y: 19 }, { name: "DC",  x: 62, y: 17 }, { name: "DC",  x: 38, y: 17 }, { name: "DG",  x: 18, y: 19 },
      { name: "MDC", x: 65, y: 30 }, { name: "MDC", x: 35, y: 30 },
      { name: "AD",  x: 85, y: 43 }, { name: "BU",  x: 62, y: 41 }, { name: "BU",  x: 38, y: 41 }, { name: "AG",  x: 15, y: 43 },
    ],
  },
  {
    id: "3-6-1",
    label: "3-6-1",
    description: "Six milieux, domination possession",
    players: [
      { name: "GB",  x: 50, y: 6 },
      { name: "DC",  x: 75, y: 17 }, { name: "DC",  x: 50, y: 15 }, { name: "DC",  x: 25, y: 17 },
      { name: "PD", x: 88, y: 30 }, { name: "MC",  x: 70, y: 28 }, { name: "MC",  x: 54, y: 26 }, { name: "MC",  x: 46, y: 26 }, { name: "MC",  x: 30, y: 28 }, { name: "PG", x: 12, y: 30 },
      { name: "BU",  x: 50, y: 43 },
    ],
  },
  {
    id: "5-2-3",
    label: "5-2-3",
    description: "Défense à cinq, trois attaquants",
    players: [
      { name: "GB",  x: 50, y: 6 },
      { name: "PD", x: 88, y: 21 }, { name: "DC",  x: 70, y: 17 }, { name: "DC",  x: 50, y: 15 }, { name: "DC",  x: 30, y: 17 }, { name: "PG", x: 12, y: 21 },
      { name: "MC",  x: 62, y: 33 }, { name: "MC",  x: 38, y: 33 },
      { name: "AD",  x: 80, y: 44 }, { name: "BU",  x: 50, y: 42 }, { name: "AG",  x: 20, y: 44 },
    ],
  },
  {
    id: "4-6-0",
    label: "4-6-0",
    description: "Sans attaquant, faux neuf, tiki-taka",
    players: [
      { name: "GB",  x: 50, y: 6 },
      { name: "DD",  x: 82, y: 18 }, { name: "DC",  x: 62, y: 16 }, { name: "DC",  x: 38, y: 16 }, { name: "DG",  x: 18, y: 18 },
      { name: "MD",  x: 88, y: 30 }, { name: "MC",  x: 68, y: 28 }, { name: "MOC", x: 55, y: 38 }, { name: "MOC", x: 45, y: 38 }, { name: "MC",  x: 32, y: 28 }, { name: "MG",  x: 12, y: 30 },
    ],
  },
]
