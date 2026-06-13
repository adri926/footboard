import { redirect } from "next/navigation"
import CalendrierClient from "@/app/dashboard/calendrier/CalendrierClient"
import NotificationToggle from "@/components/joueur/NotificationToggle"
import { getLinkedPlayer, getClubMatches, getClubTrainings, getMyAvailability, setAvailability } from "./actions"
import { getPlayerClubScope } from "@/lib/scope"

export default async function JoueurCalendrierPage() {
  const linked = await getLinkedPlayer()
  if (!linked) redirect("/onboarding")

  const scope = getPlayerClubScope(linked.club)
  const [matches, trainings, myAvailability] = await Promise.all([
    getClubMatches(scope),
    getClubTrainings(scope),
    getMyAvailability(scope, linked.player.id),
  ])

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1100 }}>
      <NotificationToggle />
      <CalendrierClient matches={matches} trainings={trainings} myAvailability={myAvailability} onRespond={setAvailability} />
    </div>
  )
}
