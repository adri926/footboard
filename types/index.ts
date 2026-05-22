export type Position = "GK" | "DEF" | "MID" | "ATT"

export interface Player {
  id: string
  name: string
  number: number
  position: Position
  x: number // position sur le terrain (0-100)
  y: number // position sur le terrain (0-100)
  team: "red" | "blue"
}

export interface Formation {
  id: string
  name: string // ex: "4-3-3", "4-2-3-1"
  players: Player[]
}

export interface Tactic {
  id: string
  title: string
  description: string
  formation: Formation
  createdAt: string
}
