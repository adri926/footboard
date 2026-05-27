"use server"

import { auth } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabase"
import type { ZoneId, BuilderPlayer } from "@/lib/builder"

export async function saveBuiltSituation(data: {
  zone:        ZoneId
  config:      string
  finality:    string
  description: string
  players:     BuilderPlayer[]
  ball:        { x: number; y: number }
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const { userId } = await auth()
  if (!userId) return { ok: false, error: "Connecte-toi pour sauvegarder." }

  const { error } = await supabase
    .from("built_situations")
    .insert({
      owner_id:    userId,
      zone:        data.zone,
      config:      data.config,
      finality:    data.finality,
      description: data.description,
      players:     data.players,
      ball:        data.ball,
    })

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
