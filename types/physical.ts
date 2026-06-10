// Types du module Données physiques — saisie manuelle par le coach
// (match ou entraînement), table Supabase `player_physical_stats`.

export type PhysicalContext = "match" | "entrainement"

export interface PhysicalEntry {
  id:         string
  playerId:   string
  date:       string // ISO date
  context:    PhysicalContext
  distanceM:  number | null
  sprints:    number | null
  vmaxKmh:    number | null
  notes:      string
}

export const PHYSICAL_CONTEXT_LABELS: Record<PhysicalContext, string> = {
  match:        "Match",
  entrainement: "Entraînement",
}
