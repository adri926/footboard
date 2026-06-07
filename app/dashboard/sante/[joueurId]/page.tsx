import Link from "next/link"
import { notFound } from "next/navigation"
import PageHeader from "@/components/dashboard/PageHeader"
import StatusBadge from "@/components/sante/StatusBadge"
import InjuryHistory from "@/components/sante/InjuryHistory"
import TrainingLoadChart from "@/components/sante/TrainingLoadChart"
import { getPlayers } from "@/app/dashboard/effectif/actions"
import { toRosterPlayer, buildMedicalRecords, getMedicalRecord } from "@/lib/mock/medical"

interface Props {
  params: Promise<{ joueurId: string }>
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{
      padding: "20px 22px", borderRadius: 12, marginBottom: 16,
      backgroundColor: "#1a1a15",
      border: "1px solid rgba(122,154,130,0.08)",
    }}>
      <h2 style={{
        fontFamily: "var(--font-mono), monospace", fontSize: 10, fontWeight: 700,
        letterSpacing: "0.1em", color: "rgba(122,154,130,0.6)",
        textTransform: "uppercase", marginBottom: 14,
      }}>
        {title}
      </h2>
      {children}
    </section>
  )
}

export default async function FicheMedicalePage({ params }: Props) {
  const { joueurId } = await params
  const players = await getPlayers()
  const roster = players.map(toRosterPlayer)
  const player = roster.find(p => p.id === joueurId)
  const record = getMedicalRecord(buildMedicalRecords(roster), joueurId)
  if (!player || !record) notFound()

  return (
    <div style={{ padding: "32px 36px", maxWidth: 760 }}>
      <Link href="/dashboard/sante" style={{
        fontFamily: "var(--font-mono), monospace", fontSize: 10,
        letterSpacing: "0.06em", color: "rgba(122,154,130,0.5)",
        textDecoration: "none", display: "inline-block", marginBottom: 16,
      }}>
        ← SUIVI MÉDICAL
      </Link>

      <PageHeader
        label={`${player.position} · N°${player.number}`}
        title={player.name}
        action={<StatusBadge status={record.status} />}
      />

      {/* 1. Statut actuel */}
      <Section title="Statut actuel">
        <div style={{ display: "flex", alignItems: "baseline", gap: 24, flexWrap: "wrap" }}>
          <div>
            <p style={{
              fontFamily: "var(--font-mono), monospace", fontSize: 9,
              letterSpacing: "0.06em", color: "rgba(255,255,255,0.3)", marginBottom: 4,
            }}>
              DATE DE RETOUR ESTIMÉE
            </p>
            <p style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontWeight: 900, fontSize: 20, color: "rgba(255,255,255,0.9)",
            }}>
              {record.returnDate
                ? new Date(record.returnDate).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })
                : "—"}
            </p>
          </div>
        </div>
      </Section>

      {/* 2. Historique blessures */}
      <Section title="Historique des blessures">
        <InjuryHistory injuries={record.injuries} />
      </Section>

      {/* 3. Charge d'entraînement */}
      <Section title="Charge d'entraînement — 8 dernières semaines">
        <TrainingLoadChart loads={record.loads} />
      </Section>

      {/* 4. Notes médicales */}
      <Section title="Notes médicales">
        <p style={{
          fontFamily: "var(--font-body), sans-serif", fontWeight: 300,
          fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6,
        }}>
          {record.notes}
        </p>
      </Section>
    </div>
  )
}
