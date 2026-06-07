"use server"

import { auth } from "@clerk/nextjs/server"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/supabase"

export interface Player {
  id:             string
  owner_id:       string
  first_name:     string
  last_name:      string
  number:         number | null
  position:       "GK" | "DEF" | "MIL" | "ATT"
  status:         "available" | "injured" | "uncertain"
  injury_note:    string | null
  email:          string | null
  goals:          number
  assists:        number
  matches_played: number
  minutes_played: number
  created_at:     string
}

const PlayerSchema = z.object({
  first_name:  z.string().min(1).max(50).trim(),
  last_name:   z.string().min(1).max(50).trim(),
  number:      z.coerce.number().int().min(1).max(99).nullable().optional(),
  position:    z.enum(["GK", "DEF", "MIL", "ATT"]),
  status:      z.enum(["available", "injured", "uncertain"]),
  injury_note: z.string().max(300).nullable().optional(),
  email:       z.string().email().max(200).nullable().optional(),
})

async function requireUserId() {
  const { userId } = await auth()
  if (!userId) throw new Error("Non authentifié")
  return userId
}

export async function getPlayerById(id: string): Promise<Player | null> {
  const userId = await requireUserId()
  if (!/^[0-9a-f-]{36}$/.test(id)) return null
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("id", id)
    .eq("owner_id", userId)
    .single()
  if (error) return null
  return data
}

export async function getPlayers(): Promise<Player[]> {
  const userId = await requireUserId()
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("owner_id", userId)
    .order("position")
    .order("number", { nullsFirst: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function createPlayer(
  raw: unknown
): Promise<{ ok: true } | { ok: false; error: string }> {
  const userId = await requireUserId()

  const parsed = PlayerSchema.safeParse(raw)
  if (!parsed.success) return { ok: false, error: "Données invalides." }

  const { error } = await supabase
    .from("players")
    .insert({ ...parsed.data, owner_id: userId })

  if (error) return { ok: false, error: error.message }
  revalidatePath("/dashboard/effectif")
  return { ok: true }
}

export async function updatePlayer(
  id: string,
  raw: unknown
): Promise<{ ok: true } | { ok: false; error: string }> {
  const userId = await requireUserId()

  if (!/^[0-9a-f-]{36}$/.test(id)) return { ok: false, error: "ID invalide." }

  const parsed = PlayerSchema.safeParse(raw)
  if (!parsed.success) return { ok: false, error: "Données invalides." }

  const { error } = await supabase
    .from("players")
    .update(parsed.data)
    .eq("id", id)
    .eq("owner_id", userId)  // impossible de modifier un joueur d'un autre coach

  if (error) return { ok: false, error: error.message }
  revalidatePath("/dashboard/effectif")
  return { ok: true }
}

export async function deletePlayer(
  id: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const userId = await requireUserId()

  if (!/^[0-9a-f-]{36}$/.test(id)) return { ok: false, error: "ID invalide." }

  const { error } = await supabase
    .from("players")
    .delete()
    .eq("id", id)
    .eq("owner_id", userId)

  if (error) return { ok: false, error: error.message }
  revalidatePath("/dashboard/effectif")
  return { ok: true }
}
