import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabase"

// Étape post-signup : lie le compte Clerk fraîchement créé à la fiche joueur
// invitée, puis consomme l'invitation.
export default async function InvitationConfirmPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const { userId } = await auth()
  if (!userId) redirect(`/invitation/${token}`)

  const { data: invite } = await supabase
    .from("player_invites")
    .select("id, player_id, expires_at")
    .eq("token", token)
    .single()

  if (invite && new Date(invite.expires_at) >= new Date()) {
    await supabase
      .from("players")
      .update({ user_id: userId, invite_status: "accepted" })
      .eq("id", invite.player_id)
    await supabase.from("player_invites").delete().eq("id", invite.id)
  }

  redirect("/joueur")
}
