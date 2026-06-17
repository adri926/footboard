import { getPlayers } from "./actions"
import EffectifClient from "./EffectifClient"

export default async function EffectifPage() {
  const players = await getPlayers()
  return (
    <div className="page-pad" style={{ maxWidth: 960 }}>
      <EffectifClient players={players} />
    </div>
  )
}
