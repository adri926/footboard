import { getMatches } from "./actions"
import { getConvocablePlayers, getAvailabilityByMatch } from "./convocations"
import { getMyClub } from "@/app/dashboard/club/actions"
import { getClubScope } from "@/lib/scope"
import { getClubTeams, getActiveTeam } from "@/lib/teams"
import MatchsClient from "./MatchsClient"

export default async function MatchsPage() {
  const scope = await getClubScope()
  const [matches, players, club, teams, activeTeam] = await Promise.all([
    getMatches(), getConvocablePlayers(), getMyClub(), getClubTeams(scope), getActiveTeam(scope),
  ])
  const availability = await getAvailabilityByMatch(matches.map(m => m.id))
  const activeTeamName = teams.length > 1 ? activeTeam.name : null
  return (
    <div style={{ padding: "32px 36px", maxWidth: 960 }}>
      <MatchsClient matches={matches} players={players} club={club} availability={availability} activeTeamName={activeTeamName} />
    </div>
  )
}
