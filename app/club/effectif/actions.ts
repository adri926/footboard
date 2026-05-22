"use server"

import { auth } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

async function getOrCreateClub(userId: string) {
  // Cherche le club existant
  const { data: existing } = await supabase
    .from("clubs")
    .select("id")
    .eq("owner_id", userId)
    .single()

  if (existing) return existing.id

  // Crée un club par défaut si premier accès
  const { data: created } = await supabase
    .from("clubs")
    .insert({ owner_id: userId, name: "Mon Club" })
    .select("id")
    .single()

  return created?.id
}

export async function addPlayer(formData: FormData) {
  const { userId } = await auth()
  if (!userId) throw new Error("Non connecté")

  const clubId = await getOrCreateClub(userId)

  await supabase.from("club_players").insert({
    club_id:    clubId,
    first_name: formData.get("first_name") as string,
    last_name:  formData.get("last_name")  as string,
    position:   formData.get("position")   as string,
    number:     formData.get("number") ? Number(formData.get("number")) : null,
    status:     "available",
    birth_date: formData.get("birth_date") as string || null,
    email:      formData.get("email")      as string || null,
    phone:      formData.get("phone")      as string || null,
  })

  revalidatePath("/club/effectif")
}

export async function updatePlayer(id: string, formData: FormData) {
  const { userId } = await auth()
  if (!userId) throw new Error("Non connecté")

  await supabase.from("club_players").update({
    first_name: formData.get("first_name") as string,
    last_name:  formData.get("last_name")  as string,
    position:   formData.get("position")   as string,
    number:     formData.get("number") ? Number(formData.get("number")) : null,
    status:     formData.get("status")     as string,
    birth_date: formData.get("birth_date") as string || null,
    email:      formData.get("email")      as string || null,
    phone:      formData.get("phone")      as string || null,
  }).eq("id", id)

  revalidatePath("/club/effectif")
}

export async function updateStatus(id: string, status: string) {
  await supabase.from("club_players").update({ status }).eq("id", id)
  revalidatePath("/club/effectif")
}

export async function deletePlayer(id: string) {
  await supabase.from("club_players").delete().eq("id", id)
  revalidatePath("/club/effectif")
}

export async function getPlayers() {
  const { userId } = await auth()
  if (!userId) return []

  const clubId = await getOrCreateClub(userId)
  if (!clubId) return []

  const { data } = await supabase
    .from("club_players")
    .select("*")
    .eq("club_id", clubId)
    .order("position")
    .order("number")

  return data ?? []
}
