"use server"

import { dbError } from "@/lib/db-error"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { supabase } from "@/lib/supabase"
import type { ClubScopeFilter } from "@/lib/scope"
import type { Player } from "@/app/dashboard/effectif/actions"
import type { Club } from "@/app/dashboard/club/actions"
import type { Match, PlayerMatchEntry } from "@/app/dashboard/matchs/actions"
import type { Training } from "@/app/dashboard/entrainements/actions"

export interface PlayerLink {
  player: Player
  club: Club
}

interface PushSubscriptionPayload {
  endpoint: string
  keys: { p256dh: string; auth: string }
}

export async function subscribePush(subscription: PushSubscriptionPayload): Promise<{ ok: true } | { ok: false; error: string }> {
  const { userId } = await auth()
  if (!userId) return { ok: false, error: "Non authentifié" }

  const { error } = await supabase
    .from("push_subscriptions")
    .upsert({
      user_id:  userId,
      endpoint: subscription.endpoint,
      p256dh:   subscription.keys.p256dh,
      auth:     subscription.keys.auth,
    }, { onConflict: "endpoint" })

  if (error) return dbError(error)
  return { ok: true }
}

export async function unsubscribePush(endpoint: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const { userId } = await auth()
  if (!userId) return { ok: false, error: "Non authentifié" }

  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq("endpoint", endpoint)
    .eq("user_id", userId)

  if (error) return dbError(error)
  return { ok: true }
}

const AvailabilitySchema = z.object({
  matchId: z.string().regex(/^[0-9a-f-]{36}$/),
  status:  z.enum(["present", "absent"]),
})

export async function setAvailability(matchId: string, status: "present" | "absent"): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = AvailabilitySchema.safeParse({ matchId, status })
  if (!parsed.success) return { ok: false, error: "Paramètres invalides." }

  const linked = await getLinkedPlayer()
  if (!linked) return { ok: false, error: "Non authentifié" }

  const { error } = await supabase
    .from("availability_responses")
    .upsert({
      match_id:   matchId,
      player_id:  linked.player.id,
      owner_id:   linked.club.owner_id,
      org_id:     linked.club.org_id,
      status,
      responded_at: new Date().toISOString(),
    }, { onConflict: "match_id,player_id" })

  if (error) return dbError(error)
  revalidatePath("/joueur")
  return { ok: true }
}

export async function getMyAvailability(scope: ClubScopeFilter, playerId: string): Promise<Record<string, "present" | "absent">> {
  const { data } = await supabase
    .from("availability_responses")
    .select("match_id, status")
    .eq(scope.column, scope.value)
    .eq("player_id", playerId)

  const map: Record<string, "present" | "absent"> = {}
  for (const row of data ?? []) map[row.match_id] = row.status as "present" | "absent"
  return map
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

export async function getClubMatches(scope: ClubScopeFilter): Promise<Match[]> {
  const { data } = await supabase
    .from("matches")
    .select("*")
    .eq(scope.column, scope.value)
    .order("date", { ascending: false })
  return data ?? []
}

export async function getClubTrainings(scope: ClubScopeFilter): Promise<Training[]> {
  const { data } = await supabase
    .from("trainings")
    .select("*")
    .eq(scope.column, scope.value)
    .order("date", { ascending: false })
  return data ?? []
}

export async function getClubMatchById(scope: ClubScopeFilter, matchId: string): Promise<Match | null> {
  if (!/^[0-9a-f-]{36}$/.test(matchId)) return null
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .eq("id", matchId)
    .eq(scope.column, scope.value)
    .single()
  if (error) return null
  return data
}

export interface MatchLineup {
  starters:    Player[]
  substitutes: Player[]
}

export async function getClubMatchLineup(scope: ClubScopeFilter, matchId: string): Promise<MatchLineup> {
  const { data: lineupRows } = await supabase
    .from("match_lineups")
    .select("player_id, role")
    .eq("match_id", matchId)
    .eq(scope.column, scope.value)

  if (!lineupRows || lineupRows.length === 0) return { starters: [], substitutes: [] }

  const { data: players } = await supabase
    .from("players")
    .select("*")
    .eq(scope.column, scope.value)
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

export async function getMyPlayerStats(scope: ClubScopeFilter, playerId: string): Promise<MyPlayerStats> {
  const { data: lineupRows } = await supabase
    .from("match_lineups")
    .select("role")
    .eq(scope.column, scope.value)
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

export async function getMyMatchHistory(scope: ClubScopeFilter, playerId: string): Promise<PlayerMatchEntry[]> {
  const { data: lineupRows } = await supabase
    .from("match_lineups")
    .select("match_id, role")
    .eq(scope.column, scope.value)
    .eq("player_id", playerId)

  if (!lineupRows || lineupRows.length === 0) return []
  const matchIds = lineupRows.map(r => r.match_id)

  const [{ data: matches }, { data: stats }] = await Promise.all([
    supabase.from("matches").select("*").eq(scope.column, scope.value).in("id", matchIds).order("date", { ascending: false }),
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
