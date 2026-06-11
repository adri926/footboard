import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import PlayerSidebar from "@/components/joueur/PlayerSidebar"
import PlayerMobileHeader from "@/components/joueur/PlayerMobileHeader"
import { getMyClub } from "@/app/dashboard/club/actions"
import { getLinkedPlayer } from "./actions"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function JoueurLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const linked = await getLinkedPlayer()
  if (!linked) {
    const club = await getMyClub()
    redirect(club ? "/dashboard" : "/onboarding")
  }

  const { player, club } = linked

  return (
    <>
      <PlayerMobileHeader clubName={club.name} playerName={player.first_name} />
      <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg)" }}>
        <PlayerSidebar clubName={club.name} clubLevel={club.level} playerName={player.first_name} />
        <main style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>
          {children}
        </main>
      </div>
    </>
  )
}
