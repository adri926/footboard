"use server"

import { auth } from "@clerk/nextjs/server"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/supabase"

export interface Match {
  id:           string
  owner_id:     string
  opponent:     string
  date:         string
  home_away:    "home" | "away"
  competition:  string | null
  venue:        string | null
  goals_for:    number | null
  goals_against: number | null
  notes:        string | null
  created_at:   string
}

export interface Lineup {
  starters:    string[]
  substitutes: string[]
}

const MatchSchema = z.object({
  opponent:     z.string().min(1).max(100).trim(),
  date:         z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  home_away:    z.enum(["home", "away"]),
  competition:  z.string().max(100).nullable().optional(),
  venue:        z.string().max(200).nullable().optional(),
  goals_for:    z.coerce.number().int().min(0).max(30).nullable().optional(),
  goals_against: z.coerce.number().int().min(0).max(30).nullable().optional(),
  notes:        z.string().max(1000).nullable().optional(),
})

async function requireUserId() {
  const { userId } = await auth()
  if (!userId) throw new Error("Non authentifié")
  return userId
}

export async function getMatchById(id: string): Promise<Match | null> {
  const userId = await requireUserId()
  if (!/^[0-9a-f-]{36}$/.test(id)) return null
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .eq("id", id)
    .eq("owner_id", userId)
    .single()
  if (error) return null
  return data
}

export async function getLineup(matchId: string): Promise<Lineup> {
  const userId = await requireUserId()
  const { data } = await supabase
    .from("match_lineups")
    .select("player_id, role")
    .eq("match_id", matchId)
    .eq("owner_id", userId)
  if (!data) return { starters: [], substitutes: [] }
  return {
    starters:    data.filter(r => r.role === "starter").map(r => r.player_id),
    substitutes: data.filter(r => r.role === "substitute").map(r => r.player_id),
  }
}

export async function saveLineup(
  matchId: string,
  starters: string[],
  substitutes: string[]
): Promise<{ ok: true } | { ok: false; error: string }> {
  const userId = await requireUserId()
  if (!/^[0-9a-f-]{36}$/.test(matchId)) return { ok: false, error: "ID invalide." }

  const validId = (id: string) => /^[0-9a-f-]{36}$/.test(id)

  await supabase.from("match_lineups").delete().eq("match_id", matchId).eq("owner_id", userId)

  const rows = [
    ...starters.filter(validId).map(id => ({ match_id: matchId, player_id: id, role: "starter",    owner_id: userId })),
    ...substitutes.filter(validId).map(id => ({ match_id: matchId, player_id: id, role: "substitute", owner_id: userId })),
  ]

  if (rows.length === 0) return { ok: true }

  const { error } = await supabase.from("match_lineups").insert(rows)
  if (error) return { ok: false, error: error.message }

  revalidatePath(`/dashboard/matchs/${matchId}/preparation`)
  return { ok: true }
}

export async function getMatches(): Promise<Match[]> {
  const userId = await requireUserId()
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .eq("owner_id", userId)
    .order("date", { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function createMatch(
  raw: unknown
): Promise<{ ok: true } | { ok: false; error: string }> {
  const userId = await requireUserId()

  const parsed = MatchSchema.safeParse(raw)
  if (!parsed.success) return { ok: false, error: "Données invalides." }

  const { error } = await supabase
    .from("matches")
    .insert({ ...parsed.data, owner_id: userId })

  if (error) return { ok: false, error: error.message }
  revalidatePath("/dashboard/matchs")
  return { ok: true }
}

export async function updateMatch(
  id: string,
  raw: unknown
): Promise<{ ok: true } | { ok: false; error: string }> {
  const userId = await requireUserId()
  if (!/^[0-9a-f-]{36}$/.test(id)) return { ok: false, error: "ID invalide." }

  const parsed = MatchSchema.safeParse(raw)
  if (!parsed.success) return { ok: false, error: "Données invalides." }

  const { error } = await supabase
    .from("matches")
    .update(parsed.data)
    .eq("id", id)
    .eq("owner_id", userId)

  if (error) return { ok: false, error: error.message }
  revalidatePath("/dashboard/matchs")
  return { ok: true }
}

export async function deleteMatch(
  id: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const userId = await requireUserId()
  if (!/^[0-9a-f-]{36}$/.test(id)) return { ok: false, error: "ID invalide." }

  const { error } = await supabase
    .from("matches")
    .delete()
    .eq("id", id)
    .eq("owner_id", userId)

  if (error) return { ok: false, error: error.message }
  revalidatePath("/dashboard/matchs")
  return { ok: true }
}
