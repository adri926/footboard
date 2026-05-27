"use server"

import { auth } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabase"
import type { SavedSituation } from "@/lib/supabase"

export async function saveSituation(data: {
  phase: string
  style: string
  zone: string
  label: string
  description: string
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const { userId } = await auth()
  if (!userId) return { ok: false, error: "Connecte-toi pour sauvegarder." }

  const { error } = await supabase
    .from("saved_situations")
    .insert({ ...data, owner_id: userId })

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

  await supabase
    .from("saved_situations")
    .delete()
    .eq("id", id)
    .eq("owner_id", userId)
}
