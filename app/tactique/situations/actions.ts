"use server"

import { auth } from "@clerk/nextjs/server"
import { z } from "zod"
import { supabase } from "@/lib/supabase"
import type { SavedSituation } from "@/lib/supabase"

const SaveSchema = z.object({
  phase:       z.string().max(50),
  style:       z.string().max(50),
  zone:        z.string().max(50),
  label:       z.string().max(100),
  description: z.string().max(1000).default(""),
})

export async function saveSituation(
  raw: unknown
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { userId } = await auth()
  if (!userId) return { ok: false, error: "Connecte-toi pour sauvegarder." }

  const parsed = SaveSchema.safeParse(raw)
  if (!parsed.success) return { ok: false, error: "Données invalides." }

  const { error } = await supabase
    .from("saved_situations")
    .insert({ ...parsed.data, owner_id: userId })

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function getSavedSituations(): Promise<SavedSituation[]> {
  const { userId } = await auth()
  if (!userId) return []

  const { data } = await supabase
    .from("saved_situations")
    .select("*")
    .eq("owner_id", userId)
    .order("created_at", { ascending: false })

  return data ?? []
}

export async function deleteSituation(id: string): Promise<void> {
  const { userId } = await auth()
  if (!userId) return

  // Valider que l'id est bien un UUID avant d'interroger la base
  if (!/^[0-9a-f-]{36}$/.test(id)) return

  await supabase
    .from("saved_situations")
    .delete()
    .eq("id", id)
    .eq("owner_id", userId)  // double filtre : on ne peut supprimer que ses propres entrées
}
