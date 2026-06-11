import { redirect } from "next/navigation"
import CalendrierClient from "@/app/dashboard/calendrier/CalendrierClient"
import { getLinkedPlayer, getClubMatches, getClubTrainings } from "./actions"

export default async function JoueurCalendrierPage() {
  const linked = await getLinkedPlayer()
  if (!linked) redirect("/onboarding")

  const [matches, trainings] = await Promise.all([
    getClubMatches(linked.club.owner_id),
    getClubTrainings(linked.club.owner_id),
  ])

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1100 }}>
      <CalendrierClient matches={matches} trainings={trainings} />
    </div>
  )
}
