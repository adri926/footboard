"use server"

import { auth } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

async function getClubId(userId: string) {
  const { data } = await supabase.from("clubs").select("id").eq("owner_id", userId).single()
  return data?.id
}

export async function getMatches() {
  const { userId } = await auth()
  if (!userId) return []
  const clubId = await getClubId(userId)
  if (!clubId) return []
  const { data } = await supabase
    .from("matches")
    .select("*")
    .eq("club_id", clubId)
    .order("date", { ascending: false })
  return data ?? []
}

export async function getMatchDetail(id: string) {
  const { userId } = await auth()
  if (!userId) return null
  const clubId = await getClubId(userId)
  if (!clubId) return null

  const [{ data: match }, { data: players }, { data: stats }] = await Promise.all([
    supabase.from("matches").select("*").eq("id", id).single(),
    supabase.from("club_players").select("*").eq("club_id", clubId).order("position").order("number"),
    supabase.from("match_stats").select("*").eq("match_id", id),
  ])

  return { match, players: players ?? [], stats: stats ?? [] }
}

export async function createMatch(formData: FormData) {
  const { userId } = await auth()
  if (!userId) throw new Error("Non connecté")
  const clubId = await getClubId(userId)
  if (!clubId) throw new Error("Club introuvable")

  const { data } = await supabase
    .from("matches")
    .insert({
      club_id:     clubId,
      date:        formData.get("date")        as string,
      opponent:    formData.get("opponent")    as string,
      home_away:   formData.get("home_away")   as string,
      competition: formData.get("competition") as string || null,
    })
    .select("id")
    .single()

  revalidatePath("/club/matchs")
  return data?.id
}

export async function updateResult(id: string, goalsFor: number, goalsAgainst: number) {
  await supabase.from("matches").update({ goals_for: goalsFor, goals_against: goalsAgainst }).eq("id", id)
  revalidatePath(`/club/matchs/${id}`)
}

export async function saveLineup(id: string, lineup: Record<string, string>, formation: string) {
  await supabase.from("matches").update({ lineup, formation }).eq("id", id)
  revalidatePath(`/club/matchs/${id}`)
}

export async function upsertPlayerStat(matchId: string, playerId: string, stats: {
  goals: number; assists: number; yellow_cards: number; red_cards: number; minutes_played: number
}) {
  await supabase.from("match_stats").upsert(
    { match_id: matchId, player_id: playerId, ...stats },
    { onConflict: "match_id,player_id" }
  )
  revalidatePath(`/club/matchs/${matchId}`)
}

export async function deleteMatch(id: string) {
  await supabase.from("matches").delete().eq("id", id)
  revalidatePath("/club/matchs")
}
