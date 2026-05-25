"use server"

import { auth } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { resend, hasEmailKey, matchTemplate } from "@/lib/email"

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

export async function sendMatchConvocations(matchId: string, onlyLineup = false, meetingPoint?: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Non connecté")
  if (!hasEmailKey() || !resend) {
    return { sent: 0, skipped: 0, error: "Resend API key manquante. Ajoute RESEND_API_KEY dans .env.local" }
  }

  const clubId = await getClubId(userId)
  if (!clubId) throw new Error("Club introuvable")

  const [{ data: match }, { data: club }, { data: players }] = await Promise.all([
    supabase.from("matches").select("*").eq("id", matchId).single(),
    supabase.from("clubs").select("name").eq("id", clubId).single(),
    supabase.from("club_players").select("*").eq("club_id", clubId),
  ])

  if (!match || !club) throw new Error("Données introuvables")

  // Si onlyLineup, on ne convoque que les joueurs du onze de départ
  let recipients = (players ?? []).filter(p => p.email && p.email.trim() !== "")
  if (onlyLineup && match.lineup) {
    const lineupIds = new Set(Object.values(match.lineup as Record<string, string>))
    recipients = recipients.filter(p => lineupIds.has(p.id))
  }

  if (recipients.length === 0) {
    return { sent: 0, skipped: (players?.length ?? 0), error: "Aucun destinataire éligible" }
  }

  let sent = 0
  for (const p of recipients) {
    try {
      const { subject, html } = matchTemplate({
        clubName:        club.name,
        playerFirstName: p.first_name,
        date:            match.date,
        opponent:        match.opponent,
        homeAway:        match.home_away,
        competition:     match.competition,
        meetingPoint,
      })
      await resend.emails.send({
        from:    process.env.RESEND_FROM ?? "Footboard <onboarding@resend.dev>",
        to:      p.email!,
        subject,
        html,
      })
      sent++
    } catch (err) {
      console.error(`Échec envoi à ${p.email}`, err)
    }
  }

  return { sent, skipped: (players?.length ?? 0) - sent }
}
