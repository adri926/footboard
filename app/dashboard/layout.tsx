import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth, currentUser } from "@clerk/nextjs/server"
import Sidebar from "@/components/dashboard/Sidebar"
import MobileHeader from "@/components/dashboard/MobileHeader"
import { getMyClub } from "@/app/dashboard/club/actions"
import { getLinkedPlayer } from "@/app/joueur/actions"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [club, user, { has }] = await Promise.all([getMyClub(), currentUser(), auth()])
  if (!club) {
    const linked = await getLinkedPlayer()
    redirect(linked ? "/joueur" : "/onboarding")
  }

  const userName = user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress ?? "Coach"
  const canManageFees = has({ permission: "org:fees:manage" })

  return (
    <>
      <MobileHeader clubName={club.name} clubLevel={club.level} userName={userName} canManageFees={canManageFees} />
      <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg)" }}>
        <Sidebar clubName={club.name} clubLevel={club.level} userName={userName} canManageFees={canManageFees} />
        <main style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>
          {children}
        </main>
      </div>
    </>
  )
}
