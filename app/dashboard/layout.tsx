import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Sidebar from "@/components/dashboard/Sidebar"
import MobileHeader from "@/components/dashboard/MobileHeader"
import { getMyClub } from "@/app/dashboard/club/actions"
import { getLinkedPlayer } from "@/app/joueur/actions"
import { getCoachShellData } from "@/lib/dashboardShellData"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const club = await getMyClub()
  if (!club) {
    const linked = await getLinkedPlayer()
    redirect(linked ? "/joueur" : "/onboarding")
  }

  const { userName, canManageFees, teams, activeTeam } = await getCoachShellData()

  return (
    <>
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
