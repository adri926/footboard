"use server"

import { auth } from "@clerk/nextjs/server"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/supabase"

export interface Club {
  id:         string
  owner_id:   string
  name:       string
  city:       string | null
  level:      string | null
  created_at: string
}

const ClubSchema = z.object({
  name:  z.string().min(1).max(100).trim(),
  city:  z.string().max(100).trim().nullable().optional(),
  level: z.string().max(100).trim().nullable().optional(),
})

async function requireUserId() {
  const { userId } = await auth()
  if (!userId) throw new Error("Non authentifié")
  return userId
}

export async function getMyClub(): Promise<Club | null> {
  const userId = await requireUserId()
  const { data } = await supabase
    .from("clubs")
    .select("*")
    .eq("owner_id", userId)
    .single()
  return data ?? null
}

export async function createClub(
  raw: unknown
): Promise<{ ok: true } | { ok: false; error: string }> {
  const userId = await requireUserId()

  const parsed = ClubSchema.safeParse(raw)
  if (!parsed.success) return { ok: false, error: "Données invalides." }

  const { error } = await supabase
    .from("clubs")
    .insert({ ...parsed.data, owner_id: userId })

  if (error) return { ok: false, error: error.message }
  revalidatePath("/dashboard")
  return { ok: true }
}

export async function updateClub(
  raw: unknown
): Promise<{ ok: true } | { ok: false; error: string }> {
  const userId = await requireUserId()

  const parsed = ClubSchema.safeParse(raw)
  if (!parsed.success) return { ok: false, error: "Données invalides." }

  const { error } = await supabase
    .from("clubs")
    .update(parsed.data)
    .eq("owner_id", userId)

  if (error) return { ok: false, error: error.message }
  revalidatePath("/dashboard", "layout")
  return { ok: true }
}
