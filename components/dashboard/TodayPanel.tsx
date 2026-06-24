import Link from "next/link"
import type { Match } from "@/app/dashboard/matchs/actions"
import type { Training } from "@/app/dashboard/entrainements/actions"

interface Props {
  userName: string
  nextMatch: Match | null
  nextTraining: Training | null
  concernedCount: number
  unsavedBilanMatch: Match | null
}

function formatDate(dateStr: string) {
  const m = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return dateStr
  const d = new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]))
  return d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })
}

function countdownLabel(dateStr: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const m = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return ""
  const target = new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]))
  const days = Math.round((target.getTime() - today.getTime()) / 86400000)
  if (days <= 0) return "AUJOURD'HUI"
  if (days === 1) return "DEMAIN"
  return `DANS ${days} JOURS`
}

function ActionCard({
  icon, eyebrow, title, sub, ctaLabel, href, warn,
}: {
  icon: string
  eyebrow: string
  title: string
  sub: string
  ctaLabel: string
  href: string
  warn?: boolean
}) {
  const accentColor = warn ? "#d4a847" : "#7A9A82"
  return (
    <Link href={href} style={{
      display: "flex", alignItems: "center", gap: 14,
      backgroundColor: "var(--bg-card)",
      border: `1px solid ${warn ? "rgba(212,168,71,0.25)" : "rgba(122,154,130,0.13)"}`,
      borderRadius: 12, padding: "16px 18px",
      textDecoration: "none",
    }}>
      <span style={{
        fontSize: 22, width: 40, height: 40, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        borderRadius: 10, backgroundColor: `${accentColor}18`, color: accentColor,
      }}>
        {icon}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontFamily: "var(--font-mono), monospace", fontSize: 9, fontWeight: 700,
          letterSpacing: "0.1em", color: accentColor, marginBottom: 3,
        }}>
          {eyebrow}
        </p>
        <p style={{
          fontFamily: "var(--font-display), system-ui, sans-serif", fontWeight: 900,
          fontSize: 17, color: "var(--text-primary)", lineHeight: 1.1,
        }}>
          {title}
        </p>
        <p style={{
          fontFamily: "var(--font-body), sans-serif", fontSize: 12,
          color: "var(--text-muted)", marginTop: 2,
        }}>
          {sub}
        </p>
      </div>
      <span style={{
        fontFamily: "var(--font-mono), monospace", fontSize: 9, fontWeight: 700,
        letterSpacing: "0.06em", color: accentColor, whiteSpace: "nowrap", flexShrink: 0,
      }}>
        {ctaLabel} →
      </span>
    </Link>
  )
}

export default function TodayPanel({ userName, nextMatch, nextTraining, concernedCount, unsavedBilanMatch }: Props) {
  const cards: React.ReactNode[] = []

  if (nextMatch) {
    cards.push(
      <ActionCard
        key="match"
        icon="⚽"
        eyebrow={countdownLabel(nextMatch.date)}
        title={`vs ${nextMatch.opponent}`}
        sub={nextMatch.home_away === "home" ? "Domicile" : "Extérieur"}
        ctaLabel="Préparer"
        href={`/dashboard/matchs/${nextMatch.id}/preparation`}
      />
    )
  } else if (nextTraining) {
    cards.push(
      <ActionCard
        key="training"
        icon="🏃"
        eyebrow={countdownLabel(nextTraining.date)}
        title={nextTraining.theme ?? "Entraînement"}
        sub={formatDate(nextTraining.date)}
        ctaLabel="Voir"
        href={`/dashboard/entrainements/${nextTraining.id}`}
      />
    )
  }

  if (concernedCount > 0) {
    cards.push(
      <ActionCard
        key="concerned"
        icon="⚠"
        eyebrow="EFFECTIF"
        title={`${concernedCount} joueur${concernedCount > 1 ? "s" : ""} incertain${concernedCount > 1 ? "s" : ""} ou blessé${concernedCount > 1 ? "s" : ""}`}
        sub="À vérifier avant la prochaine convocation"
        ctaLabel="Voir"
        href="/dashboard/effectif"
        warn
      />
    )
  }

  if (unsavedBilanMatch) {
    cards.push(
      <ActionCard
        key="bilan"
        icon="📋"
        eyebrow="À FAIRE"
        title={`Bilan vs ${unsavedBilanMatch.opponent} non saisi`}
        sub={formatDate(unsavedBilanMatch.date)}
        ctaLabel="Saisir"
        href={`/dashboard/matchs/${unsavedBilanMatch.id}/bilan`}
        warn
      />
    )
  }

  return (
    <div style={{ marginBottom: 32 }}>
      <p style={{
        fontFamily: "var(--font-display), system-ui, sans-serif", fontWeight: 900,
        fontSize: 22, color: "var(--text-primary)", marginBottom: 14,
      }}>
        Salut {userName} 👋
      </p>

      {cards.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {cards}
        </div>
      ) : (
        <div style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid rgba(122,154,130,0.13)",
          borderRadius: 12, padding: "20px 18px",
          display: "flex", alignItems: "center", gap: 14,
        }}>
          <span style={{ fontSize: 22 }}>👌</span>
          <p style={{
            fontFamily: "var(--font-body), sans-serif", fontSize: 13, color: "var(--text-muted)",
          }}>
            Tout est à jour — rien d&apos;urgent pour l&apos;instant.
          </p>
        </div>
      )}
    </div>
  )
}
