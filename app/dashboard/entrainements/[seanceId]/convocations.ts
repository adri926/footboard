"use server"

import { Resend } from "resend"
import { supabase } from "@/lib/supabase"
import { getClubScope } from "@/lib/scope"
import { sendPushToUser } from "@/lib/push"

// Null-safe : Resend throw sans clé → ne pas instancier au chargement (casserait `next build`).
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const FROM   = process.env.RESEND_FROM ?? "Footboard <onboarding@resend.dev>"

function formatDate(dateStr: string) {
  const m = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return dateStr
  const d = new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]))
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
}

function emailHtml({ firstName, sessionName, date }: { firstName: string; sessionName: string; date: string }) {
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
      <p style="margin:0 0 20px;color:#333;font-size:15px;">Tu es convoqué(e) pour l'entraînement :</p>
      <div style="background:#f8f8f4;border-radius:10px;padding:18px 22px;border-left:3px solid #7A9A82;">
        <p style="margin:0 0 6px;font-size:19px;font-weight:700;color:#181812;">${sessionName}</p>
        <p style="margin:0;font-size:13px;color:#555;">${date}</p>
      </div>
      <p style="margin:28px 0 0;color:#888;font-size:13px;line-height:1.6;">— Le coach</p>
    </div>
  </div>
</body>
</html>`
}

export async function sendTrainingConvocations(
  sessionId: string,
): Promise<{ ok: true; sent: number } | { ok: false; error: string }> {
  const scope = await getClubScope()

  const { data: session } = await supabase
    .from("training_sessions")
    .select("name, date")
    .eq("id", sessionId)
    .eq(scope.column, scope.value)
    .single()

  if (!session) return { ok: false, error: "Séance introuvable." }

  const { data: players } = await supabase
    .from("players")
    .select("id, first_name, email, user_id")
    .eq(scope.column, scope.value)
    .eq("status", "available")

  if (!players || players.length === 0) return { ok: false, error: "Aucun joueur disponible." }

  const withEmail = players.filter(p => p.email)
  if (withEmail.length === 0) return { ok: false, error: "Aucun joueur disponible n'a d'adresse email." }
  if (!resend) return { ok: false, error: "Envoi d'email non configuré (clé Resend manquante)." }

  const date = formatDate(session.date)

  const results = await Promise.allSettled(
    withEmail.map(p =>
      resend.emails.send({
        from:    FROM,
        to:      p.email!,
        subject: `Convocation entraînement — ${session.name} — ${date}`,
        html:    emailHtml({ firstName: p.first_name, sessionName: session.name, date }),
      })
    )
  )

  const sent = results.filter(r => r.status === "fulfilled").length

  await Promise.allSettled(
    players
      .filter(p => p.user_id)
      .map(p => sendPushToUser(p.user_id!, {
        title: "Convocation entraînement",
        body:  `${session.name} — ${date}`,
        url:   `/joueur/entrainements`,
      }))
  )

  if (sent === 0) return { ok: false, error: "Échec de l'envoi. Vérifie ta clé Resend." }
  return { ok: true, sent }
}
