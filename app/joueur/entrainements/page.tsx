import { redirect } from "next/navigation"
import PageHeader from "@/components/dashboard/PageHeader"
import { TRAINING_TYPES } from "@/lib/training-types"
import { getLinkedPlayer, getClubTrainings } from "../actions"
import { getPlayerClubScope } from "@/lib/scope"
import type { Training } from "@/app/dashboard/entrainements/actions"

const TYPE_COLORS: Record<string, string> = {
  tactique: "#7A9A82", technique: "#6b9ab8", physique: "#d4a847",
  cpa: "#a87ab8", recuperation: "#7ab8a8", amical: "#e07070",
}

function localToday(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`
}

function formatDateLong(dateStr: string) {
  const m = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return dateStr
  const d = new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]))
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
}

function TrainingCard({ training }: { training: Training }) {
  const typeLabel = training.type ? (TRAINING_TYPES.find(t => t.value === training.type)?.label ?? training.type) : null
  const color = training.type ? (TYPE_COLORS[training.type] ?? "#7A9A82") : "#7A9A82"

  return (
    <div style={{
      backgroundColor: "var(--bg-card)",
      border: "1px solid rgba(122,154,130,0.08)",
      borderRadius: 12, padding: "16px 18px",
      display: "flex", flexDirection: "column", gap: 8,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <p style={{
          fontFamily: "var(--font-mono), monospace", fontSize: 9,
          letterSpacing: "0.08em", color: "rgba(122,154,130,0.6)",
          textTransform: "capitalize",
        }}>
          {formatDateLong(training.date)}
        </p>
        {typeLabel && (
          <span style={{
            fontFamily: "var(--font-mono), monospace", fontSize: 8, fontWeight: 700,
            letterSpacing: "0.08em", color,
            backgroundColor: `${color}18`, border: `1px solid ${color}40`,
            padding: "3px 10px", borderRadius: 100, whiteSpace: "nowrap",
          }}>
            {typeLabel.toUpperCase()}
          </span>
        )}
      </div>
      {training.theme && (
        <p style={{
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontWeight: 900, fontSize: 17, color: "rgba(255,255,255,0.92)",
        }}>
          {training.theme}
        </p>
      )}
      {training.location && (
        <p style={{
          fontFamily: "var(--font-body), sans-serif", fontWeight: 400, fontSize: 13,
          color: "rgba(255,255,255,0.5)",
        }}>
          📍 {training.location}
        </p>
      )}
      {training.notes && (
        <p style={{
          fontFamily: "var(--font-body), sans-serif", fontWeight: 400, fontSize: 13,
          color: "rgba(255,255,255,0.4)", lineHeight: 1.5,
        }}>
          {training.notes}
        </p>
      )}
      {!training.theme && !training.location && !training.notes && !typeLabel && (
        <p style={{
          fontFamily: "var(--font-body), sans-serif", fontWeight: 400, fontSize: 13,
          color: "rgba(255,255,255,0.3)",
        }}>
          Aucun détail renseigné.
        </p>
      )}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "var(--font-mono), monospace",
      fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
      color: "rgba(122,154,130,0.5)", textTransform: "uppercase",
      marginBottom: 12,
    }}>
      {children}
    </p>
  )
}

export default async function JoueurEntrainementsPage() {
  const linked = await getLinkedPlayer()
  if (!linked) redirect("/onboarding")

  const trainings = await getClubTrainings(getPlayerClubScope(linked.club))
  const today = localToday()

  const upcoming = trainings.filter(t => t.date.slice(0, 10) >= today).sort((a, b) => a.date.localeCompare(b.date))
  const past     = trainings.filter(t => t.date.slice(0, 10) < today)

  return (
    <div style={{ padding: "32px 36px", maxWidth: 760 }}>
      <PageHeader label="Mon Club" title="Entraînements" />

      {trainings.length === 0 && (
        <p style={{
          fontFamily: "var(--font-body), sans-serif", fontWeight: 400, fontSize: 13,
          color: "rgba(255,255,255,0.3)",
        }}>
          Aucun entraînement programmé pour le moment.
        </p>
      )}

      {upcoming.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <SectionLabel>À venir</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {upcoming.map(t => <TrainingCard key={t.id} training={t} />)}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <SectionLabel>Passés</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {past.map(t => <TrainingCard key={t.id} training={t} />)}
          </div>
        </div>
      )}
    </div>
  )
}
