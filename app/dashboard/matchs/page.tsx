import { getMatches } from "./actions"
import MatchsClient from "./MatchsClient"

export default async function MatchsPage() {
  const matches = await getMatches()
  return (
    <div style={{ padding: "32px 36px", maxWidth: 960 }}>
      <MatchsClient matches={matches} />
    </div>
  )
}
