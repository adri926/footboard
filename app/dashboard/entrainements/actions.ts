"use server"

import { auth } from "@clerk/nextjs/server"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/supabase"
import type { TrainingType } from "@/lib/training-types"

export interface Training {
  id:         string
  owner_id:   string
  date:       string
  type:       TrainingType | null
  theme:      string | null
  location:   string | null
  notes:      string | null
  created_at: string
}

const TrainingSchema = z.object({
  date:     z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  type:     z.string().nullable().optional(),
  theme:    z.string().max(200).nullable().optional(),
  location: z.string().max(200).nullable().optional(),
  notes:    z.string().max(1000).nullable().optional(),
})

async function requireUserId() {
  const { userId } = await auth()
  if (!userId) throw new Error("Non authentifié")
  return userId
}

export async function getTrainings(): Promise<Training[]> {
  const userId = await requireUserId()
  const { data, error } = await supabase
    .from("trainings")
    .select("*")
    .eq("owner_id", userId)
    .order("date", { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function createTraining(
  raw: unknown
): Promise<{ ok: true } | { ok: false; error: string }> {
  const userId = await requireUserId()

  const parsed = TrainingSchema.safeParse(raw)
  if (!parsed.success) return { ok: false, error: "Données invalides." }

  const { error } = await supabase
    .from("trainings")
    .insert({ ...parsed.data, owner_id: userId })

  if (error) return { ok: false, error: error.message }
  revalidatePath("/dashboard/entrainements")
  return { ok: true }
}

export async function updateTraining(
  id: string,
  raw: unknown
): Promise<{ ok: true } | { ok: false; error: string }> {
  const userId = await requireUserId()
  if (!/^[0-9a-f-]{36}$/.test(id)) return { ok: false, error: "ID invalide." }

  const parsed = TrainingSchema.safeParse(raw)
  if (!parsed.success) return { ok: false, error: "Données invalides." }

  const { error } = await supabase
    .from("trainings")
    .update(parsed.data)
    .eq("id", id)
    .eq("owner_id", userId)

  if (error) return { ok: false, error: error.message }
  revalidatePath("/dashboard/entrainements")
  return { ok: true }
}

export async function deleteTraining(
  id: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const userId = await requireUserId()
  if (!/^[0-9a-f-]{36}$/.test(id)) return { ok: false, error: "ID invalide." }

  const { error } = await supabase
    .from("trainings")
    .delete()
    .eq("id", id)
    .eq("owner_id", userId)

  if (error) return { ok: false, error: error.message }
  revalidatePath("/dashboard/entrainements")
  return { ok: true }
}
