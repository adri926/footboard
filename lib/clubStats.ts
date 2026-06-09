import type { Match } from "@/app/dashboard/matchs/actions"

export interface ClubStats {
  played:       number
  wins:         number
  draws:        number
  losses:       number
  goalsFor:     number
  goalsAgainst: number
}

export function computeClubStats(matches: Match[]): ClubStats {
  const played = matches.filter(m => m.goals_for !== null && m.goals_against !== null)

  const stats: ClubStats = { played: played.length, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 }

  for (const m of played) {
    const gf = m.goals_for!
    const ga = m.goals_against!
    stats.goalsFor += gf
    stats.goalsAgainst += ga
    if (gf > ga) stats.wins += 1
    else if (gf === ga) stats.draws += 1
    else stats.losses += 1
  }

  return stats
}
