import { getTrainings } from "./actions"
import { supabase } from "@/lib/supabase"
import { getClubScope } from "@/lib/scope"
import { getClubTeams, getActiveTeam } from "@/lib/teams"
import EntraineementsClient from "./EntraineementsClient"

export default async function EntraineementsPage() {
  const scope = await getClubScope()
  const [trainings, { data: savedSessions }, teams, activeTeam] = await Promise.all([
    getTrainings(),
    supabase
      .from("training_sessions")
      .select("id, name, session_type, total_duration, date")
      .eq(scope.column, scope.value)
      .order("date", { ascending: false }),
    getClubTeams(scope),
    getActiveTeam(scope),
  ])
  const activeTeamName = teams.length > 1 ? activeTeam.name : null

  return (
    <div style={{ padding: "32px 36px", maxWidth: 960 }}>
      <EntraineementsClient trainings={trainings} savedSessions={savedSessions ?? []} activeTeamName={activeTeamName} />
    </div>
  )
}
