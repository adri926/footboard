import { getMatches } from "@/app/dashboard/matchs/actions"
import { getTrainings } from "@/app/dashboard/entrainements/actions"
import CalendrierClient from "./CalendrierClient"

export default async function CalendrierPage() {
  const [matches, trainings] = await Promise.all([getMatches(), getTrainings()])
  return (
    <div style={{ padding: "32px 36px", maxWidth: 1100 }}>
      <CalendrierClient matches={matches} trainings={trainings} />
    </div>
  )
}
