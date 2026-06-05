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
  goals_for:    number | null
  goals_against: number | null
  notes:        string | null
  created_at:   string
}

const MatchSchema = z.object({
  opponent:     z.string().min(1).max(100).trim(),
  date:         z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  home_away:    z.enum(["home", "away"]),
  competition:  z.string().max(100).nullable().optional(),
  goals_for:    z.coerce.number().int().min(0).max(30).nullable().optional(),
  goals_against: z.coerce.number().int().min(0).max(30).nullable().optional(),
  notes:        z.string().max(1000).nullable().optional(),
})

async function requireUserId() {
  const { userId } = await auth()
  if (!userId) throw new Error("Non authentifié")
  return userId
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
