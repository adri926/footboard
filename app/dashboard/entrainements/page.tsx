import { getTrainings } from "./actions"
import { supabase } from "@/lib/supabase"
import { getClubScope } from "@/lib/scope"
import EntraineementsClient from "./EntraineementsClient"

export default async function EntraineementsPage() {
  const scope = await getClubScope()
  const [trainings, { data: savedSessions }] = await Promise.all([
    getTrainings(),
    supabase
      .from("training_sessions")
      .select("id, name, session_type, total_duration, date")
      .eq(scope.column, scope.value)
      .order("date", { ascending: false }),
  ])

  return (
    <div style={{ padding: "32px 36px", maxWidth: 960 }}>
      <EntraineementsClient trainings={trainings} savedSessions={savedSessions ?? []} />
    </div>
  )
}
