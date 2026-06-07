// Données mockées du module Data & statistiques — une saison complète
// (club + joueurs + résultats match par match), réutilise l'effectif
// défini dans lib/mock/medical.ts pour rester cohérent entre modules.
// À remplacer par des requêtes Supabase une fois les tables créées.

import { MOCK_PLAYERS } from "@/lib/mock/medical"
import type { ClubStats, PlayerStats, SeasonResult } from "@/types/stats"

const SEASON = "2025-2026"

const OPPONENTS = [
  "FC Belleville", "AS Montrouge", "US Créteil", "Stade Vincennois", "ES Vitry",
  "RC Nogent", "FC Ivry", "AS Champigny", "US Maisons-Alfort", "Stade Bonneuil",
  "FC Choisy", "AS Orly", "US Villejuif", "RC Cachan", "FC Arcueil",
  "AS Gentilly", "US Bagneux", "Stade Fontenaisien",
]

const RESULTS_PLAN: { score: string; result: "W" | "D" | "L" }[] = [
  { score: "2-1", result: "W" }, { score: "1-1", result: "D" }, { score: "3-0", result: "W" },
  { score: "0-2", result: "L" }, { score: "2-2", result: "D" }, { score: "4-1", result: "W" },
  { score: "1-0", result: "W" }, { score: "0-1", result: "L" }, { score: "2-0", result: "W" },
  { score: "1-3", result: "L" }, { score: "3-1", result: "W" }, { score: "2-2", result: "D" },
  { score: "1-0", result: "W" }, { score: "0-0", result: "D" }, { score: "2-1", result: "W" },
  { score: "1-2", result: "L" }, { score: "3-2", result: "W" }, { score: "2-0", result: "W" },
]

export const SEASON_RESULTS: SeasonResult[] = RESULTS_PLAN.map((r, i) => {
  const date = new Date("2025-09-07")
  date.setDate(date.getDate() + i * 14) // un match toutes les deux semaines
  return {
    matchId: `m${String(i + 1).padStart(2, "0")}`,
    date: date.toISOString().slice(0, 10),
    opponent: OPPONENTS[i],
    score: r.score,
    result: r.result,
  }
})

export const CLUB_STATS: ClubStats = SEASON_RESULTS.reduce<ClubStats>((acc, r) => {
  const [gf, ga] = r.score.split("-").map(Number)
  acc.matches += 1
  acc.goalsFor += gf
  acc.goalsAgainst += ga
  if (r.result === "W") acc.wins += 1
  else if (r.result === "D") acc.draws += 1
  else acc.losses += 1
  return acc
}, { season: SEASON, matches: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, possession: 54 })

// Profils de production par poste — sert à générer des stats individuelles
// plausibles plutôt que des valeurs purement aléatoires.
const PROFILE: Record<string, { matches: number; starts: number; goals: [number, number]; assists: [number, number]; minPerMatch: number; rating: number }> = {
  GK:  { matches: 16, starts: 14, goals: [0, 0],  assists: [0, 1], minPerMatch: 88, rating: 6.6 },
  DEF: { matches: 17, starts: 15, goals: [0, 2],  assists: [0, 3], minPerMatch: 82, rating: 6.4 },
  MIL: { matches: 17, starts: 14, goals: [1, 5],  assists: [2, 7], minPerMatch: 75, rating: 6.7 },
  ATT: { matches: 16, starts: 12, goals: [4, 12], assists: [1, 6], minPerMatch: 70, rating: 6.8 },
}

function pseudoRand(seed: number, lo: number, hi: number): number {
  const v = (seed * 9301 + 49297) % 233280
  return lo + Math.round((v / 233280) * (hi - lo))
}

export const PLAYER_STATS: PlayerStats[] = MOCK_PLAYERS.map((player, i) => {
  const profile = PROFILE[player.position]
  const seed = i + 1
  const matchesPlayed = profile.matches - pseudoRand(seed, 0, 3)
  const starts = Math.min(profile.starts - pseudoRand(seed * 2, 0, 2), matchesPlayed)
  const goals = pseudoRand(seed * 3, profile.goals[0], profile.goals[1])
  const assists = pseudoRand(seed * 5, profile.assists[0], profile.assists[1])
  const minutesPlayed = matchesPlayed * profile.minPerMatch - pseudoRand(seed * 7, 0, 120)
  const rating = Math.round((profile.rating + pseudoRand(seed * 11, -4, 4) / 10) * 10) / 10
  // Le 12 (gardien remplaçant) joue très peu — pas encore noté par le coach
  const lowVolume = player.id === "p12"
  return {
    playerId: player.id,
    season: SEASON,
    matchesPlayed: lowVolume ? 3 : matchesPlayed,
    starts: lowVolume ? 1 : starts,
    goals: lowVolume ? 0 : goals,
    assists: lowVolume ? 0 : assists,
    minutesPlayed: lowVolume ? 180 : Math.max(minutesPlayed, starts * 60),
    rating: lowVolume ? null : rating,
  }
})

export function getPlayerStats(playerId: string): PlayerStats | undefined {
  return PLAYER_STATS.find(s => s.playerId === playerId)
}

// Progression saison (note match par match, sur les 8 dernières apparitions)
// — généré à partir de la note moyenne du joueur pour rester cohérent.
export function getPlayerProgression(playerId: string): { matchIndex: number; rating: number }[] {
  const stats = getPlayerStats(playerId)
  if (!stats || stats.rating === null) return []
  const seed = MOCK_PLAYERS.findIndex(p => p.id === playerId) + 1
  return Array.from({ length: 8 }, (_, i) => {
    const variation = pseudoRand(seed * 13 + i, -12, 12) / 10
    return { matchIndex: i + 1, rating: Math.max(4, Math.min(10, Math.round((stats.rating! + variation) * 10) / 10)) }
  })
}
