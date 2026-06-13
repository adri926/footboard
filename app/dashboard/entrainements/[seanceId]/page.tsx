import { auth } from "@clerk/nextjs/server"
import { redirect, notFound } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { getClubScope } from "@/lib/scope"
import { getExerciseById } from "@/lib/exercises"
import SeanceDetailClient from "./SeanceDetailClient"
import type { SessionBlock } from "@/types/training"

export default async function SeanceDetailPage({
  params,
}: {
  params: Promise<{ seanceId: string }>
}) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const scope = await getClubScope()
  const { seanceId } = await params

  const { data: session } = await supabase
    .from("training_sessions")
    .select("*")
    .eq("id", seanceId)
    .eq(scope.column, scope.value)
    .single()

  if (!session) notFound()

  const { data: rawBlocks } = await supabase
    .from("session_blocks")
    .select("*")
    .eq("session_id", seanceId)
    .order("block_order", { ascending: true })

  const blocks: SessionBlock[] = (rawBlocks ?? [])
    .map((b, i): SessionBlock | null => {
      const exercise = getExerciseById(b.exercise_id)
      if (!exercise) return null
      return {
        id: b.id,
        exerciseId: b.exercise_id,
        exercise,
        duration: b.duration,
        order: b.block_order ?? i,
        customNotes: b.custom_notes ?? undefined,
      }
    })
    .filter((b): b is SessionBlock => b !== null)

  return <SeanceDetailClient session={session} blocks={blocks} />
}
