import { auth } from "@clerk/nextjs/server"
import Sidebar from "@/components/dashboard/Sidebar"
import MobileHeader from "@/components/dashboard/MobileHeader"
import PlayerSidebar from "@/components/joueur/PlayerSidebar"
import PlayerMobileHeader from "@/components/joueur/PlayerMobileHeader"
import { getMyClub } from "@/app/dashboard/club/actions"
import { getLinkedPlayer } from "@/app/joueur/actions"
import { getCoachShellData } from "@/lib/dashboardShellData"

// Layout conditionnel pour les outils tactique (digiboard, analyse vidéo, concepts) —
// ces pages sont à double usage : marketing public (visiteur non connecté, démo) et
// outil interne (coach/joueur authentifié, linké depuis le dashboard). Un coach/joueur
// connecté doit garder son shell habituel (sidebar + bandeau bas) en y naviguant ; un
// visiteur non connecté ou en onboarding incomplet garde le comportement marketing
// actuel (header <Nav/> du layout racine, inchangé — voir Nav.tsx pour le mécanisme
// de masquage CSS via [data-marketing-nav], pas de logique JS conditionnelle sur l'auth).
export default async function TactiqueShellLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()
  if (!userId) return <>{children}</>

  const club = await getMyClub()
  if (club) {
    const { userName, canManageFees, teams, activeTeam } = await getCoachShellData()
    return (
      <>
        <style>{`[data-marketing-nav] { display: none !important; }`}</style>
        <MobileHeader clubName={club.name} clubLevel={club.level} userName={userName} canManageFees={canManageFees} />
        <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg)" }}>
          <Sidebar clubName={club.name} clubLevel={club.level} userName={userName} canManageFees={canManageFees} teams={teams} activeTeamId={activeTeam.id} />
          <main className="dashboard-main" style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>
            {children}
          </main>
        </div>
      </>
    )
  }

  const linked = await getLinkedPlayer()
  if (linked) {
    return (
      <>
        <style>{`[data-marketing-nav] { display: none !important; }`}</style>
        <PlayerMobileHeader clubName={linked.club.name} playerName={linked.player.first_name} />
        <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg)" }}>
          <PlayerSidebar clubName={linked.club.name} clubLevel={linked.club.level} playerName={linked.player.first_name} />
          <main className="joueur-main" style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>
            {children}
          </main>
        </div>
      </>
    )
  }

  // Authentifié mais onboarding incomplet (ni club ni joueur lié) — comportement marketing
  return <>{children}</>
}
