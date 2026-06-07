import { getMatches } from "./actions"
import { getConvocablePlayers } from "./convocations"
import MatchsClient from "./MatchsClient"

export default async function MatchsPage() {
  const [matches, players] = await Promise.all([getMatches(), getConvocablePlayers()])
  return (
    <div style={{ padding: "32px 36px", maxWidth: 960 }}>
      <MatchsClient matches={matches} players={players} />
    </div>
  )
}
