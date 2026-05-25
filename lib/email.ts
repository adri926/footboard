import { Resend } from "resend"

const KEY = process.env.RESEND_API_KEY
export const resend = KEY ? new Resend(KEY) : null

export function hasEmailKey(): boolean {
  return !!KEY && KEY.length > 5
}

const FROM = process.env.RESEND_FROM ?? "Footboard <onboarding@resend.dev>"

// ─── Templates ────────────────────────────────────────────────

interface TrainingEmailData {
  clubName: string
  playerFirstName: string
  date: string
  location?: string
  theme?: string
  notes?: string
  responseUrl?: string
}

export function trainingTemplate(d: TrainingEmailData): { subject: string; html: string } {
  const dateObj = new Date(d.date)
  const dateStr = dateObj.toLocaleDateString("fr-FR", { weekday:"long", day:"2-digit", month:"long" })
  const timeStr = dateObj.toLocaleTimeString("fr-FR", { hour:"2-digit", minute:"2-digit" })

  return {
    subject: `[${d.clubName}] Convocation entraînement — ${dateStr}`,
    html: emailLayout(`
      <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#fff;">Convocation entraînement</h1>
      <p style="margin:0 0 24px;color:#aaa;">${d.clubName}</p>

      <p style="margin:0 0 16px;font-size:16px;color:#fff;">Bonjour ${d.playerFirstName},</p>
      <p style="margin:0 0 24px;color:#ddd;">Tu es convoqué pour la séance d'entraînement suivante :</p>

      <div style="background:#1a1a2e;border:1px solid #333;border-radius:12px;padding:20px;margin-bottom:24px;">
        ${d.theme ? `<div style="margin-bottom:12px;"><div style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Thème</div><div style="color:#fff;font-weight:600;">${d.theme}</div></div>` : ""}
        <div style="margin-bottom:12px;"><div style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Date</div><div style="color:#fff;font-weight:600;">📅 ${dateStr} à ${timeStr}</div></div>
        ${d.location ? `<div style="margin-bottom:0;"><div style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Lieu</div><div style="color:#fff;font-weight:600;">📍 ${d.location}</div></div>` : ""}
      </div>

      ${d.notes ? `<div style="background:rgba(255,255,255,0.04);border-left:3px solid #4ade80;padding:14px 16px;border-radius:8px;margin-bottom:24px;color:#ddd;">${d.notes}</div>` : ""}

      <p style="margin:0 0 8px;color:#fff;font-weight:600;">Merci de confirmer ta présence à ton coach.</p>
      <p style="margin:0;color:#888;font-size:13px;">À très vite sur le terrain ⚽</p>
    `)
  }
}

interface MatchEmailData {
  clubName: string
  playerFirstName: string
  date: string
  opponent: string
  homeAway: string
  competition?: string
  meetingPoint?: string
}

export function matchTemplate(d: MatchEmailData): { subject: string; html: string } {
  const dateObj = new Date(d.date)
  const dateStr = dateObj.toLocaleDateString("fr-FR", { weekday:"long", day:"2-digit", month:"long" })
  const timeStr = dateObj.toLocaleTimeString("fr-FR", { hour:"2-digit", minute:"2-digit" })
  const lieu    = d.homeAway === "home" ? "🏠 Domicile" : "✈️ Extérieur"

  return {
    subject: `[${d.clubName}] Convocation match vs ${d.opponent} — ${dateStr}`,
    html: emailLayout(`
      <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#fff;">Convocation match</h1>
      <p style="margin:0 0 24px;color:#aaa;">${d.clubName}</p>

      <p style="margin:0 0 16px;font-size:16px;color:#fff;">Bonjour ${d.playerFirstName},</p>
      <p style="margin:0 0 24px;color:#ddd;">Tu es convoqué pour le match suivant :</p>

      <div style="background:#1a1a2e;border:1px solid #333;border-radius:12px;padding:20px;margin-bottom:24px;">
        <div style="text-align:center;margin-bottom:20px;">
          <div style="font-size:28px;font-weight:800;color:#fff;">${d.clubName} <span style="color:#888;">vs</span> ${d.opponent}</div>
          ${d.competition ? `<div style="margin-top:6px;color:#4ade80;font-size:13px;font-weight:600;">🏆 ${d.competition}</div>` : ""}
        </div>
        <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
          <div style="text-align:center;"><div style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Date</div><div style="color:#fff;font-weight:600;">${dateStr}</div></div>
          <div style="text-align:center;"><div style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Heure</div><div style="color:#fff;font-weight:600;">${timeStr}</div></div>
          <div style="text-align:center;"><div style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Lieu</div><div style="color:#fff;font-weight:600;">${lieu}</div></div>
        </div>
      </div>

      ${d.meetingPoint ? `<div style="background:rgba(255,255,255,0.04);border-left:3px solid #60a5fa;padding:14px 16px;border-radius:8px;margin-bottom:24px;color:#ddd;"><strong style="color:#fff;">Point de rendez-vous :</strong> ${d.meetingPoint}</div>` : ""}

      <p style="margin:0 0 8px;color:#fff;font-weight:600;">Merci de confirmer ta présence à ton coach.</p>
      <p style="margin:0;color:#888;font-size:13px;">À très vite sur le terrain ⚽</p>
    `)
  }
}

// ─── Layout commun ────────────────────────────────────────────

function emailLayout(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
</head>
<body style="margin:0;padding:0;background:#0a0a14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#fff;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0a0a14;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">
          <tr>
            <td style="padding:24px 0;text-align:center;">
              <div style="font-size:18px;font-weight:800;color:#fff;">⚽ Footboard</div>
            </td>
          </tr>
          <tr>
            <td style="background:#111122;border:1px solid #2a2a40;border-radius:16px;padding:32px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding:24px 0;text-align:center;color:#555;font-size:12px;">
              Cet email a été envoyé via <span style="color:#888;">Footboard</span> — plateforme de gestion de club
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
