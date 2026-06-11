"use server"

import { auth } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabase"
import type { Player } from "@/app/dashboard/effectif/actions"
import type { Club } from "@/app/dashboard/club/actions"
import type { Match, PlayerMatchEntry } from "@/app/dashboard/matchs/actions"
import type { Training } from "@/app/dashboard/entrainements/actions"

export interface PlayerLink {
  player: Player
  club: Club
}

// Résout le compte joueur connecté → fiche joueur + club du coach (owner_id)
export async function getLinkedPlayer(): Promise<PlayerLink | null> {
  const { userId } = await auth()
  if (!userId) return null

  const { data: player } = await supabase
    .from("players")
    .select("*")
    .eq("user_id", userId)
    .single()
  if (!player) return null

  const { data: club } = await supabase
    .from("clubs")
    .select("*")
    .eq("owner_id", player.owner_id)
    .single()
  if (!club) return null

  return { player, club }
}

export async function getClubMatches(ownerId: string): Promise<Match[]> {
  const { data } = await supabase
    .from("matches")
    .select("*")
    .eq("owner_id", ownerId)
    .order("date", { ascending: false })
  return data ?? []
}

export async function getClubTrainings(ownerId: string): Promise<Training[]> {
  const { data } = await supabase
    .from("trainings")
    .select("*")
    .eq("owner_id", ownerId)
    .order("date", { ascending: false })
  return data ?? []
}

export async function getClubMatchById(ownerId: string, matchId: string): Promise<Match | null> {
  if (!/^[0-9a-f-]{36}$/.test(matchId)) return null
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .eq("id", matchId)
    .eq("owner_id", ownerId)
    .single()
  if (error) return null
  return data
}

export interface MatchLineup {
  starters:    Player[]
  substitutes: Player[]
}

export async function getClubMatchLineup(ownerId: string, matchId: string): Promise<MatchLineup> {
  const { data: lineupRows } = await supabase
    .from("match_lineups")
    .select("player_id, role")
    .eq("match_id", matchId)
    .eq("owner_id", ownerId)

  if (!lineupRows || lineupRows.length === 0) return { starters: [], substitutes: [] }

  const { data: players } = await supabase
    .from("players")
    .select("*")
    .eq("owner_id", ownerId)
    .in("id", lineupRows.map(r => r.player_id))

  const byId = new Map((players ?? []).map(p => [p.id, p as Player]))

  return {
    starters:    lineupRows.filter(r => r.role === "starter").map(r => byId.get(r.player_id)).filter((p): p is Player => !!p),
    substitutes: lineupRows.filter(r => r.role === "substitute").map(r => byId.get(r.player_id)).filter((p): p is Player => !!p),
  }
}

export interface MyPlayerStats {
  matchesPlayed: number
  starts:        number
  goals:         number
  assists:       number
  minutesPlayed: number
}

export async function getMyPlayerStats(ownerId: string, playerId: string): Promise<MyPlayerStats> {
  const { data: lineupRows } = await supabase
    .from("match_lineups")
    .select("role")
    .eq("owner_id", ownerId)
    .eq("player_id", playerId)

  const { data: statRows } = await supabase
    .from("match_stats")
    .select("goals, assists, minutes_played")
    .eq("player_id", playerId)

  const result: MyPlayerStats = { matchesPlayed: 0, starts: 0, goals: 0, assists: 0, minutesPlayed: 0 }

  for (const row of lineupRows ?? []) {
    result.matchesPlayed += 1
    if (row.role === "starter") result.starts += 1
  }
  for (const row of statRows ?? []) {
    result.goals += row.goals ?? 0
    result.assists += row.assists ?? 0
    result.minutesPlayed += row.minutes_played ?? 0
  }

  return result
}

export async function getMyMatchHistory(ownerId: string, playerId: string): Promise<PlayerMatchEntry[]> {
  const { data: lineupRows } = await supabase
    .from("match_lineups")
    .select("match_id, role")
    .eq("owner_id", ownerId)
    .eq("player_id", playerId)

  if (!lineupRows || lineupRows.length === 0) return []
  const matchIds = lineupRows.map(r => r.match_id)

  const [{ data: matches }, { data: stats }] = await Promise.all([
    supabase.from("matches").select("*").eq("owner_id", ownerId).in("id", matchIds).order("date", { ascending: false }),
    supabase.from("match_stats").select("match_id, goals, assists, yellow_cards, red_cards, minutes_played").eq("player_id", playerId).in("match_id", matchIds),
  ])
  if (!matches) return []

  return matches.map(match => {
    const lineupRow = lineupRows.find(r => r.match_id === match.id)
    const statRow   = stats?.find(s => s.match_id === match.id)
    return {
      match,
      role:          lineupRow?.role === "starter" ? "starter" : "substitute",
      goals:         statRow?.goals ?? 0,
      assists:       statRow?.assists ?? 0,
      yellowCards:   statRow?.yellow_cards ?? 0,
      redCards:      statRow?.red_cards ?? 0,
      minutesPlayed: statRow?.minutes_played ?? 0,
    }
  })
}
