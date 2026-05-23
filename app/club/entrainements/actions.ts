"use server"

import { auth } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

async function getClubId(userId: string) {
  const { data } = await supabase.from("clubs").select("id").eq("owner_id", userId).single()
  return data?.id
}

export async function getTrainings() {
  const { userId } = await auth()
  if (!userId) return []
  const clubId = await getClubId(userId)
  if (!clubId) return []
  const { data } = await supabase
    .from("trainings")
    .select("*")
    .eq("club_id", clubId)
    .order("date", { ascending: false })
  return data ?? []
}

export async function getTrainingWithAttendance(id: string) {
  const { userId } = await auth()
  if (!userId) return null
  const clubId = await getClubId(userId)
  if (!clubId) return null

  const [{ data: training }, { data: players }, { data: attendance }] = await Promise.all([
    supabase.from("trainings").select("*").eq("id", id).single(),
    supabase.from("club_players").select("*").eq("club_id", clubId).order("position").order("last_name"),
    supabase.from("training_attendance").select("*").eq("training_id", id),
  ])

  return { training, players: players ?? [], attendance: attendance ?? [] }
}

export async function createTraining(formData: FormData) {
  const { userId } = await auth()
  if (!userId) throw new Error("Non connecté")
  const clubId = await getClubId(userId)
  if (!clubId) throw new Error("Club introuvable")

  const { data: training } = await supabase
    .from("trainings")
    .insert({
      club_id:  clubId,
      date:     formData.get("date")     as string,
      location: formData.get("location") as string || null,
      theme:    formData.get("theme")    as string || null,
      notes:    formData.get("notes")    as string || null,
    })
    .select("id")
    .single()

  // Crée une ligne de présence "absent" pour chaque joueur du club
  const { data: players } = await supabase
    .from("club_players")
    .select("id")
    .eq("club_id", clubId)

  if (players?.length && training) {
    await supabase.from("training_attendance").insert(
      players.map(p => ({ training_id: training.id, player_id: p.id, status: "absent" }))
    )
  }

  revalidatePath("/club/entrainements")
  return training?.id
}

export async function updateAttendance(trainingId: string, playerId: string, status: string) {
  await supabase
    .from("training_attendance")
    .upsert({ training_id: trainingId, player_id: playerId, status },
      { onConflict: "training_id,player_id" })
  revalidatePath(`/club/entrainements/${trainingId}`)
}

export async function deleteTraining(id: string) {
  await supabase.from("trainings").delete().eq("id", id)
  revalidatePath("/club/entrainements")
}
