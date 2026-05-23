"use server"

import { auth } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabase"

export async function createClub(formData: FormData) {
  const { userId } = await auth()
  if (!userId) throw new Error("Non connecté")

  // Vérifie si un club existe déjà
  const { data: existing } = await supabase
    .from("clubs")
    .select("id")
    .eq("owner_id", userId)
    .single()

  if (existing) return existing.id

  const { data } = await supabase
    .from("clubs")
    .insert({
      owner_id: userId,
      name:     formData.get("name")  as string,
      city:     formData.get("city")  as string || null,
      level:    formData.get("level") as string || null,
    })
    .select("id")
    .single()

  return data?.id
}
