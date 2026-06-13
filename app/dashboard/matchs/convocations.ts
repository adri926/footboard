"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { Resend } from "resend"
import { supabase } from "@/lib/supabase"
import { getClubScope } from "@/lib/scope"
import { sendPushToUser } from "@/lib/push"

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM   = process.env.RESEND_FROM ?? "Footboard <onboarding@resend.dev>"

export interface ConvocablePlayer {
  id:         string
  first_name: string
  last_name:  string
  number:     number | null
  position:   string
  status:     string
  email:      string | null
}

export async function getConvocablePlayers(): Promise<ConvocablePlayer[]> {
  const scope = await getClubScope()
  const { data, error } = await supabase
    .from("players")
    .select("id, first_name, last_name, number, position, status, email")
    .eq(scope.column, scope.value)
    .order("position")
    .order("last_name")

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getAvailabilityByMatch(matchIds: string[]): Promise<Record<string, Record<string, "present" | "absent">>> {
  if (matchIds.length === 0) return {}
  const scope = await getClubScope()

  const { data } = await supabase
    .from("availability_responses")
    .select("match_id, player_id, status")
    .eq(scope.column, scope.value)
    .in("match_id", matchIds)

  const map: Record<string, Record<string, "present" | "absent">> = {}
  for (const row of data ?? []) {
    if (!map[row.match_id]) map[row.match_id] = {}
    map[row.match_id][row.player_id] = row.status as "present" | "absent"
  }
  return map
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00")
  return d.toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  })
}

function emailHtml({
  firstName, opponent, date, location, competition,
}: {
  firstName: string
  opponent: string
  date: string
  location: string
  competition: string | null
}) {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f0ec;font-family:Arial,sans-serif;">
  <div style="max-width:520px;margin:32px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:#181812;padding:24px 28px;">
      <p style="margin:0;color:#7A9A82;font-size:10px;letter-spacing:0.12em;font-weight:700;">FOOTBOARD</p>
      <h1 style="margin:10px 0 0;color:#ffffff;font-size:20px;font-weight:900;letter-spacing:0.02em;">Convocation</h1>
    </div>
    <div style="padding:28px 28px 32px;">
      <p style="margin:0 0 16px;color:#333;font-size:15px;">Bonjour <strong>${firstName}</strong>,</p>
      <p style="margin:0 0 20px;color:#333;font-size:15px;">Tu es convoqué(e) pour le prochain match :</p>
      <div style="background:#f8f8f4;border-radius:10px;padding:18px 22px;border-left:3px solid #7A9A82;">
        <p style="margin:0 0 6px;font-size:19px;font-weight:700;color:#181812;">vs ${opponent}</p>
        <p style="margin:0 0 4px;font-size:13px;color:#555;">${date}</p>
        <p style="margin:0;font-size:13px;color:#555;">${location}${competition ? ` · ${competition}` : ""}</p>
      </div>
      <p style="margin:28px 0 0;color:#888;font-size:13px;line-height:1.6;">
        — Le coach<br>
        <strong style="color:#444;">AS Poincaré</strong>
      </p>
    </div>
  </div>
</body>
</html>`
}

const SendSchema = z.object({
  matchId:   z.string().regex(/^[0-9a-f-]{36}$/),
  playerIds: z.array(z.string().regex(/^[0-9a-f-]{36}$/)).min(1).max(50),
})

export async function sendConvocations(
  matchId: string,
  playerIds: string[],
): Promise<{ ok: true; sent: number } | { ok: false; error: string }> {
  const scope = await getClubScope()

  const parsed = SendSchema.safeParse({ matchId, playerIds })
  if (!parsed.success) return { ok: false, error: "Paramètres invalides." }

  // Récupérer le match
  const { data: match, error: matchErr } = await supabase
    .from("matches")
    .select("opponent, date, home_away, competition")
    .eq("id", matchId)
    .eq(scope.column, scope.value)
    .single()

  if (matchErr || !match) return { ok: false, error: "Match introuvable." }

  // Récupérer les joueurs sélectionnés avec email
  const { data: players, error: playersErr } = await supabase
    .from("players")
    .select("id, first_name, email, user_id")
    .eq(scope.column, scope.value)
    .in("id", playerIds)

  if (playersErr || !players) return { ok: false, error: "Erreur lors de la récupération des joueurs." }

  const withEmail = players.filter(p => p.email)
  if (withEmail.length === 0) return { ok: false, error: "Aucun joueur sélectionné n'a d'adresse email." }

  const date     = formatDate(match.date)
  const location = match.home_away === "home" ? "Domicile" : "Extérieur"

  // Envoyer les emails
  const results = await Promise.allSettled(
    withEmail.map(p =>
      resend.emails.send({
        from:    FROM,
        to:      p.email!,
        subject: `Convocation — vs ${match.opponent} — ${date}`,
        html:    emailHtml({
          firstName:   p.first_name,
          opponent:    match.opponent,
          date,
          location,
          competition: match.competition,
        }),
      })
    )
  )

  const sent = results.filter(r => r.status === "fulfilled").length

  // Notifications push (best-effort, en plus des emails)
  await Promise.allSettled(
    players
      .filter(p => p.user_id)
      .map(p => sendPushToUser(p.user_id!, {
        title: "Convocation",
        body:  `vs ${match.opponent} — ${date}`,
        url:   `/joueur/matchs/${matchId}`,
      }))
  )

  // Tracer les convocations envoyées
  if (sent > 0) {
    const sentIds = withEmail
      .filter((_, i) => results[i].status === "fulfilled")
      .map(p => ({ owner_id: scope.userId, org_id: scope.orgId, match_id: matchId, player_id: p.id }))

    await supabase.from("convocations").upsert(sentIds, { onConflict: "match_id,player_id" })
    revalidatePath("/dashboard/matchs")
  }

  if (sent === 0) return { ok: false, error: "Échec de l'envoi. Vérifie ta clé Resend." }
  return { ok: true, sent }
}
