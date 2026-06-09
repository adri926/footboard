import { getMatches } from "./actions"
import { getConvocablePlayers } from "./convocations"
import { getMyClub } from "@/app/dashboard/club/actions"
import MatchsClient from "./MatchsClient"

export default async function MatchsPage() {
  const [matches, players, club] = await Promise.all([getMatches(), getConvocablePlayers(), getMyClub()])
  return (
    <div style={{ padding: "32px 36px", maxWidth: 960 }}>
      <MatchsClient matches={matches} players={players} club={club} />
    </div>
  )
}
