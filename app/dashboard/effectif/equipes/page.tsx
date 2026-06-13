import { getTeamsManagementData } from "./actions"
import EquipesClient from "./EquipesClient"

export default async function EquipesPage() {
  const data = await getTeamsManagementData()
  return <EquipesClient data={data} />
}
