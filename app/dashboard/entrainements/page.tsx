import { getTrainings } from "./actions"
import EntraineementsClient from "./EntraineementsClient"

export default async function EntraineementsPage() {
  const trainings = await getTrainings()
  return (
    <div style={{ padding: "32px 36px", maxWidth: 960 }}>
      <EntraineementsClient trainings={trainings} />
    </div>
  )
}
