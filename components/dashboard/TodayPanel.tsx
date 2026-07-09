import Link from "next/link"
import type { Match } from "@/app/dashboard/matchs/actions"
import type { Training } from "@/app/dashboard/entrainements/actions"

interface Props {
  userName: string
  clubLabel?: string
  nextMatch: Match | null
  nextTraining: Training | null
  concernedCount: number
  unsavedBilanMatch: Match | null
  lastPastMatch: Match | null
  hasAnalysisForLastMatch: boolean
  hasUpcomingTraining: boolean
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
  icon, eyebrow, title, sub, ctaLabel, href, warn, subtle,
}: {
  icon: string
  eyebrow: string
  title: string
  sub: string
  ctaLabel: string
  href: string
  warn?: boolean
  subtle?: boolean
}) {
  const accentColor = warn ? "#d4a847" : "#7A9A82"
  const borderColor = subtle
    ? "rgba(122,154,130,0.10)"
    : warn ? "rgba(212,168,71,0.25)" : "rgba(122,154,130,0.13)"
  return (
    <Link href={href} style={{
      display: "flex", alignItems: "center", gap: 14,
      backgroundColor: "var(--bg-card)",
      border: `1px solid ${borderColor}`,
      borderRadius: 12, padding: "16px 18px",
      textDecoration: "none",
      opacity: subtle ? 0.9 : 1,
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
          letterSpacing: "0.1em", color: subtle ? "var(--text-muted)" : accentColor, marginBottom: 3,
        }}>
          {eyebrow}
        </p>
        <p style={{
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontWeight: subtle ? 700 : 900,
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
        letterSpacing: "0.06em", color: subtle ? "var(--text-muted)" : accentColor,
        whiteSpace: "nowrap", flexShrink: 0,
      }}>
        {ctaLabel} →
      </span>
    </Link>
  )
}

export default function TodayPanel({
  userName, clubLabel, nextMatch, nextTraining, concernedCount, unsavedBilanMatch,
  lastPastMatch, hasAnalysisForLastMatch, hasUpcomingTraining,
}: Props) {
  const cards: React.ReactNode[] = []

  // 1 — Prochaine échéance (le repère n°1 du coach).
  if (nextMatch) {
    cards.push(
      <ActionCard
        key="match"
        icon="⚽"
        eyebrow={countdownLabel(nextMatch.date)}
        title={`vs ${nextMatch.opponent}`}
        sub={nextMatch.home_away === "home" ? "Domicile" : "Extérieur"}
        ctaLabel="Préparer la compo"
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

  // 2 — Bilan du dernier match non saisi.
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

  // 3 — Créer une séance (accès direct manuel, aucune IA imposée).
  if (!hasUpcomingTraining) {
    cards.push(
      <ActionCard
        key="new-session"
        icon="🗒"
        eyebrow="À FAIRE"
        title="Créer la séance de la semaine"
        sub="Compose ta séance à la main, depuis la bibliothèque d'exercices"
        ctaLabel="Créer"
        href="/dashboard/entrainements/nouvelle-seance"
      />
    )
  }

  // 4 — Analyser le dernier match (accélérateur IA, optionnel et discret).
  if (lastPastMatch && !hasAnalysisForLastMatch) {
    cards.push(
      <ActionCard
        key="analyse"
        icon="◬"
        eyebrow="OPTION IA"
        title={`Analyser le match vs ${lastPastMatch.opponent}`}
        sub="Laisse l'IA débriefer la vidéo — facultatif"
        ctaLabel="Analyser"
        href={`/tactique/analyse-video?match=${lastPastMatch.id}`}
        subtle
      />
    )
  }

  // 5 — Effectif incertain / blessés.
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

  return (
    <div style={{ marginBottom: 32 }}>
      <p style={{
        fontFamily: "var(--font-display), system-ui, sans-serif", fontWeight: 900,
        fontSize: 22, color: "var(--text-primary)", marginBottom: 4,
      }}>
        Salut {userName} 👋
      </p>
      {clubLabel && (
        <p style={{
          fontFamily: "var(--font-body), sans-serif", fontSize: 12,
          color: "var(--text-muted)", marginBottom: 14,
        }}>
          {clubLabel}
        </p>
      )}
      <p style={{
        fontFamily: "var(--font-mono), monospace", fontSize: 9, fontWeight: 700,
        letterSpacing: "0.14em", color: "rgba(122,154,130,0.5)",
        textTransform: "uppercase", marginBottom: 14,
      }}>
        Ta semaine
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
