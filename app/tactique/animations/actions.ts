"use server"

import { auth } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabase"

export async function getMyClubData() {
  const { userId } = await auth()
  if (!userId) return null

  const { data: club } = await supabase
    .from("clubs")
    .select("id, name")
    .eq("owner_id", userId)
    .single()

  if (!club) return null

  const { data: players } = await supabase
    .from("club_players")
    .select("id, first_name, last_name, position, number, status")
    .eq("club_id", club.id)
    .order("position")
    .order("number")

  return { club, players: players ?? [] }
}
