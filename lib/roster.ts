import type { Player } from "@/app/dashboard/effectif/actions"

export interface RosterPlayer {
  id: string
  name: string
  number: number
  position: "GK" | "DEF" | "MIL" | "ATT"
}

export function toRosterPlayer(p: Player): RosterPlayer {
  return {
    id: p.id,
    name: `${p.first_name} ${p.last_name}`,
    number: p.number ?? 0,
    position: p.position,
  }
}
