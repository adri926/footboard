import { getMatches } from "@/app/dashboard/matchs/actions"
import { getTrainings } from "@/app/dashboard/entrainements/actions"
import { getClubScope } from "@/lib/scope"
import { getClubTeams, getActiveTeam } from "@/lib/teams"
import CalendrierClient from "./CalendrierClient"

export default async function CalendrierPage() {
  const scope = await getClubScope()
  const [matches, trainings, teams, activeTeam] = await Promise.all([
    getMatches(), getTrainings(), getClubTeams(scope), getActiveTeam(scope),
  ])
  const activeTeamName = teams.length > 1 ? activeTeam.name : null
  return (
    <div className="page-pad" style={{ maxWidth: 1100 }}>
      <CalendrierClient matches={matches} trainings={trainings} activeTeamName={activeTeamName} />
    </div>
  )
}
