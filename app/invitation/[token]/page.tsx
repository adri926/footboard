import { supabase } from "@/lib/supabase"
import InvitationSignUp from "@/components/invitation/InvitationSignUp"

export default async function InvitationPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params

  const { data: invite } = await supabase
    .from("player_invites")
    .select("id, player_id, owner_id, org_id, email, expires_at")
    .eq("token", token)
    .single()

  const expired = !invite || new Date(invite.expires_at) < new Date()

  if (!invite || expired) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24, backgroundColor: "#181812",
      }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <p style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontWeight: 900, fontSize: 22, color: "rgba(255,255,255,0.92)", marginBottom: 12,
          }}>
            Lien invalide ou expiré
          </p>
          <p style={{
            fontFamily: "var(--font-body), sans-serif", fontWeight: 400, fontSize: 13,
            lineHeight: 1.6, color: "rgba(255,255,255,0.35)",
          }}>
            Demande à ton coach de t&apos;envoyer une nouvelle invitation depuis ta fiche joueur.
          </p>
        </div>
      </div>
    )
  }

  const [{ data: player }, { data: club }] = await Promise.all([
    supabase.from("players").select("first_name").eq("id", invite.player_id).single(),
    invite.org_id
      ? supabase.from("clubs").select("name").eq("org_id", invite.org_id).single()
      : supabase.from("clubs").select("name").eq("owner_id", invite.owner_id).single(),
  ])

  return (
    <InvitationSignUp
      token={token}
      email={invite.email}
      playerFirstName={player?.first_name ?? ""}
      clubName={club?.name ?? "ton club"}
    />
  )
}
