import Link from "next/link"
import PageHeader from "@/components/dashboard/PageHeader"
import PlayerStatusTable from "@/components/sante/PlayerStatusTable"
import MedicalAlert from "@/components/sante/MedicalAlert"
import { getPlayers } from "@/app/dashboard/effectif/actions"
import { toRosterPlayer, buildMedicalRecords, MOCK_NEXT_MATCH } from "@/lib/mock/medical"

function daysUntil(iso: string): number {
  const ms = new Date(iso).getTime() - new Date("2026-06-07").getTime()
  return Math.ceil(ms / 86_400_000)
}

const COUNTER_DEFS: { status: "disponible" | "incertain" | "blesse" | "reprise"; label: string; color: string }[] = [
  { status: "disponible", label: "Disponibles", color: "#7A9A82" },
  { status: "incertain",  label: "Incertains",  color: "#d4a847" },
  { status: "blesse",     label: "Blessés",     color: "#e07070" },
  { status: "reprise",    label: "En reprise",  color: "#6f9bb8" },
]

export default async function SantePage() {
  const players = await getPlayers()
  const roster = players.map(toRosterPlayer)
  const records = buildMedicalRecords(roster)
  const rows = roster.map(player => ({
    player,
    record: records.find(r => r.playerId === player.id)!,
  }))

  const counts = COUNTER_DEFS.map(def => ({
    ...def,
    count: rows.filter(r => r.record.status === def.status).length,
  }))

  const days = daysUntil(MOCK_NEXT_MATCH.date)
  const unavailable = rows.filter(r => r.record.status === "blesse" || r.record.status === "incertain").length
  const showAlert = days <= 7 && days >= 0 && unavailable > 0

  return (
    <div style={{ padding: "32px 36px", maxWidth: 960 }}>
      <PageHeader
        label="Mon Club"
        title="Suivi médical"
        subtitle={`${rows.length} joueur${rows.length !== 1 ? "s" : ""} suivis — vue d'ensemble de l'état de forme de l'effectif`}
      />

      {rows.length === 0 ? (
        <div style={{
          padding: "48px 32px", borderRadius: 12, textAlign: "center",
          backgroundColor: "#1f1f19", border: "1px dashed rgba(122,154,130,0.2)",
        }}>
          <p style={{
            fontFamily: "var(--font-body), sans-serif", fontWeight: 300,
            fontSize: 14, color: "rgba(255,255,255,0.3)", marginBottom: 8,
          }}>
            Aucun joueur dans l'effectif pour le moment.
          </p>
          <Link href="/dashboard/effectif" style={{
            fontFamily: "var(--font-mono), monospace", fontSize: 9,
            letterSpacing: "0.08em", color: "rgba(122,154,130,0.5)",
          }}>
            GÉRER L'EFFECTIF →
          </Link>
        </div>
      ) : (
        <>
          {showAlert && (
            <MedicalAlert
              matchDate={MOCK_NEXT_MATCH.date}
              opponent={MOCK_NEXT_MATCH.opponent}
              unavailableCount={unavailable}
              daysUntil={days}
            />
          )}

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 28,
          }}>
            {counts.map(c => (
              <div key={c.status} style={{
                padding: "16px 18px", borderRadius: 12,
                backgroundColor: "#1f1f19",
                border: "1px solid rgba(122,154,130,0.08)",
              }}>
                <p style={{
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  fontWeight: 900, fontSize: 28, color: c.color, lineHeight: 1,
                }}>
                  {c.count}
                </p>
                <p style={{
                  fontFamily: "var(--font-mono), monospace", fontSize: 9, fontWeight: 700,
                  letterSpacing: "0.06em", color: "rgba(255,255,255,0.35)", marginTop: 6,
                }}>
                  {c.label.toUpperCase()}
                </p>
              </div>
            ))}
          </div>

          <PlayerStatusTable rows={rows} />
        </>
      )}
    </div>
  )
}
