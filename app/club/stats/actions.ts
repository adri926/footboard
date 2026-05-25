"use server"

import { auth } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabase"

async function getClubId(userId: string) {
  const { data } = await supabase.from("clubs").select("id").eq("owner_id", userId).single()
  return data?.id
}

export async function getStats() {
  const { userId } = await auth()
  if (!userId) return null
  const clubId = await getClubId(userId)
  if (!clubId) return null

  // Récupère tout en parallèle
  const [
    { data: players },
    { data: matches },
    { data: matchStats },
    { data: trainings },
    { data: attendance },
  ] = await Promise.all([
    supabase.from("club_players").select("*").eq("club_id", clubId).order("last_name"),
    supabase.from("matches").select("*").eq("club_id", clubId).order("date", { ascending: false }),
    supabase.from("match_stats").select("*, matches!inner(club_id)").eq("matches.club_id", clubId),
    supabase.from("trainings").select("id").eq("club_id", clubId),
    supabase.from("training_attendance").select("*, trainings!inner(club_id)").eq("trainings.club_id", clubId),
  ])

  // Stats équipe
  const played = (matches ?? []).filter(m => m.goals_for !== null && m.goals_against !== null)
  const v = played.filter(m => m.goals_for > m.goals_against).length
  const n = played.filter(m => m.goals_for === m.goals_against).length
  const d = played.filter(m => m.goals_for < m.goals_against).length
  const bp = played.reduce((sum, m) => sum + (m.goals_for ?? 0), 0)
  const bc = played.reduce((sum, m) => sum + (m.goals_against ?? 0), 0)
  const pts = v * 3 + n

  // Forme (5 derniers)
  const forme = played.slice(0, 5).map(m =>
    m.goals_for > m.goals_against ? "V" : m.goals_for < m.goals_against ? "D" : "N"
  ).reverse()

  // Stats par joueur (agrégées)
  const playerStats = (players ?? []).map(p => {
    const pStats = (matchStats ?? []).filter((s: any) => s.player_id === p.id)
    const pAtt   = (attendance ?? []).filter((a: any) => a.player_id === p.id)

    return {
      ...p,
      goals:      pStats.reduce((sum, s) => sum + (s.goals ?? 0), 0),
      assists:    pStats.reduce((sum, s) => sum + (s.assists ?? 0), 0),
      yellows:    pStats.reduce((sum, s) => sum + (s.yellow_cards ?? 0), 0),
      reds:       pStats.reduce((sum, s) => sum + (s.red_cards ?? 0), 0),
      minutes:    pStats.reduce((sum, s) => sum + (s.minutes_played ?? 0), 0),
      played:     pStats.filter(s => (s.minutes_played ?? 0) > 0).length,
      trainings:  pAtt.length,
      presences:  pAtt.filter((a: any) => a.status === "present").length,
    }
  })

  return {
    team: { v, n, d, bp, bc, pts, played: played.length, forme },
    players: playerStats,
    totalTrainings: trainings?.length ?? 0,
  }
}
