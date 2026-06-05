import { getPlayers } from "./actions"
import EffectifClient from "./EffectifClient"

export default async function EffectifPage() {
  const players = await getPlayers()
  return (
    <div style={{ padding: "32px 36px", maxWidth: 960 }}>
      <EffectifClient players={players} />
    </div>
  )
}
