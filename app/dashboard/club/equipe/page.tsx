import { getTeamData } from "./actions"
import EquipeClient from "./EquipeClient"

export const metadata = { robots: { index: false, follow: false } }

export default async function EquipePage() {
  const data = await getTeamData()
  return <EquipeClient data={data} />
}
