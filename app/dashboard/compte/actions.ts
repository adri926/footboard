"use server"

import { auth, clerkClient } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { supabase } from "@/lib/supabase"

export async function deleteAccount(): Promise<{ ok: false; error: string } | never> {
  const { userId } = await auth()
  if (!userId) return { ok: false, error: "Non authentifié" }

  // Supprimer toutes les données Supabase de l'utilisateur
  await Promise.all([
    supabase.from("match_lineups").delete().eq("owner_id", userId),
    supabase.from("convocations").delete().eq("owner_id", userId),
  ])
  await supabase.from("players").delete().eq("owner_id", userId)
  await supabase.from("matches").delete().eq("owner_id", userId)
  await supabase.from("trainings").delete().eq("owner_id", userId)
  await supabase.from("clubs").delete().eq("owner_id", userId)

  // Supprimer le compte Clerk
  const client = await clerkClient()
  await client.users.deleteUser(userId)

  redirect("/")
}
