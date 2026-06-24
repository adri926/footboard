import { currentUser } from "@clerk/nextjs/server"
import { getClubScope } from "@/lib/scope"
import { getClubTeams, getActiveTeam } from "@/lib/teams"

// Données du shell coach (sidebar/header) — factorisé pour être réutilisé par
// app/dashboard/layout.tsx et components/tactique/TactiqueShellLayout.tsx, qui
// doivent rendre le même shell mais depuis deux arborescences de layout différentes.
export async function getCoachShellData() {
  const user = await currentUser()
  const userName = user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress ?? "Coach"
  const scope = await getClubScope()
  const [teams, activeTeam] = await Promise.all([getClubTeams(scope), getActiveTeam(scope)])
  return { userName, teams, activeTeam }
}
