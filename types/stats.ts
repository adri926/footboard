// Types du module Data & statistiques — structure pensée pour mapper
// directement vers de futures tables Supabase (player_stats, club_stats,
// season_results).

export interface PlayerStats {
  playerId: string
  season: string // ex: "2025-2026"
  matchesPlayed: number
  starts: number
  goals: number
  assists: number
  minutesPlayed: number
  rating: number | null // note moyenne saisie par le coach (sur 10), null si non notée
}

export interface ClubStats {
  season: string
  matches: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  possession: number // pourcentage moyen de possession sur la saison
}

export interface SeasonResult {
  matchId: string
  date: string // ISO date
  opponent: string
  score: string // ex: "2-1"
  result: "W" | "D" | "L"
}
