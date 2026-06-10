import { auth } from "@clerk/nextjs/server"
import { getTrainings } from "./actions"
import { supabase } from "@/lib/supabase"
import EntraineementsClient from "./EntraineementsClient"

export default async function EntraineementsPage() {
  const { userId } = await auth()
  const [trainings, { data: savedSessions }] = await Promise.all([
    getTrainings(),
    supabase
      .from("training_sessions")
      .select("id, name, session_type, total_duration, date")
      .eq("owner_id", userId)
      .order("date", { ascending: false }),
  ])

  return (
    <div style={{ padding: "32px 36px", maxWidth: 960 }}>
      <EntraineementsClient trainings={trainings} savedSessions={savedSessions ?? []} />
    </div>
  )
}
