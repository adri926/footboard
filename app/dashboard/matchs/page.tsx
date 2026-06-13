import { getMatches } from "./actions"
import { getConvocablePlayers, getAvailabilityByMatch } from "./convocations"
import { getMyClub } from "@/app/dashboard/club/actions"
import MatchsClient from "./MatchsClient"

export default async function MatchsPage() {
  const [matches, players, club] = await Promise.all([getMatches(), getConvocablePlayers(), getMyClub()])
  const availability = await getAvailabilityByMatch(matches.map(m => m.id))
  return (
    <div style={{ padding: "32px 36px", maxWidth: 960 }}>
      <MatchsClient matches={matches} players={players} club={club} availability={availability} />
    </div>
  )
}
