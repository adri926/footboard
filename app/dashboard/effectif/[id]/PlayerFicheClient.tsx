"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import PageHeader from "@/components/dashboard/PageHeader"
import PlayerStatusBadge from "@/components/dashboard/PlayerStatusBadge"
import StatusBadge from "@/components/sante/StatusBadge"
import InjuryHistory from "@/components/sante/InjuryHistory"
import TrainingLoadChart from "@/components/sante/TrainingLoadChart"
import PhysicalStatsChart from "@/components/effectif/PhysicalStatsChart"
import PhysicalEntryForm from "@/components/effectif/PhysicalEntryForm"
import PhysicalEntryList from "@/components/effectif/PhysicalEntryList"
import type { Player } from "@/app/dashboard/effectif/actions"
import type { PlayerSeasonStats } from "@/app/dashboard/matchs/actions"
import type { MedicalRecord } from "@/types/medical"
import type { PhysicalEntry } from "@/types/physical"

const POSITION_LABELS: Record<Player["position"], string> = {
  GK: "Gardien", DEF: "Défenseur", MIL: "Milieu", ATT: "Attaquant",
}

const TABS = [
  { key: "identite", label: "Identité" },
  { key: "stats",    label: "Statistiques" },
  { key: "sante",    label: "Santé" },
  { key: "physique", label: "Données physiques" },
] as const

type Tab = typeof TABS[number]["key"]

interface Props {
  player:   Player
  stats:    PlayerSeasonStats
  medical:  MedicalRecord
  physical: PhysicalEntry[]
}

export default function PlayerFicheClient({ player, stats, medical, physical }: Props) {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const initialTab = TABS.some(t => t.key === tabParam) ? (tabParam as Tab) : "identite"
  const [tab, setTab] = useState<Tab>(initialTab)

  const minutesPerMatch = stats.matchesPlayed > 0
    ? Math.round(stats.minutesPlayed / stats.matchesPlayed)
    : 0

  const distances = physical.filter(e => e.distanceM !== null).map(e => e.distanceM as number)
  const sprintsTotal = physical.filter(e => e.sprints !== null).map(e => e.sprints as number)
  const vmaxValues = physical.filter(e => e.vmaxKmh !== null).map(e => e.vmaxKmh as number)
  const avgDistance = distances.length > 0 ? Math.round(distances.reduce((a, b) => a + b, 0) / distances.length) : 0
  const avgSprints = sprintsTotal.length > 0 ? Math.round(sprintsTotal.reduce((a, b) => a + b, 0) / sprintsTotal.length) : 0
  const maxVmax = vmaxValues.length > 0 ? Math.max(...vmaxValues) : 0

  return (
    <div style={{ padding: "32px 36px", maxWidth: 800 }}>
      <Link href="/dashboard/effectif" style={{
        fontFamily: "var(--font-mono), monospace",
        fontSize: 8, letterSpacing: "0.08em",
        color: "rgba(122,154,130,0.4)",
        display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 20,
        textDecoration: "none",
      }}>
        ← EFFECTIF
      </Link>

      <PageHeader
        label={`${player.position === "GK" ? "GB" : player.position}${player.number ? ` · N°${player.number}` : ""}`}
        title={`${player.first_name} ${player.last_name.toUpperCase()}`}
        action={<PlayerStatusBadge status={player.status} />}
      />

      {/* Onglets */}
      <div style={{ display: "flex", gap: 0, marginBottom: 24, borderBottom: "1px solid rgba(122,154,130,0.08)" }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
            padding: "10px 18px", cursor: "pointer",
            backgroundColor: "transparent", border: "none",
            borderBottom: `2px solid ${tab === t.key ? "#7A9A82" : "transparent"}`,
            color: tab === t.key ? "#7A9A82" : "rgba(255,255,255,0.30)",
            transition: "all 0.15s", marginBottom: -1,
          }}>
            {t.label.toUpperCase()}
          </button>
        ))}
      </div>

      {tab === "identite" && (
        <div style={{
          padding: "20px 22px", borderRadius: 12,
          backgroundColor: "var(--bg-card)",
          border: "1px solid rgba(122,154,130,0.08)",
          display: "flex", flexDirection: "column", gap: 12,
        }}>
          {[
            { label: "Poste",   value: POSITION_LABELS[player.position] },
            { label: "Numéro",  value: player.number ? `#${player.number}` : "—" },
            { label: "Statut",  value: <PlayerStatusBadge status={player.status} /> },
            { label: "Email",   value: player.email ?? "—" },
          ].map(({ label, value }) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              paddingBottom: 12,
              borderBottom: "1px solid rgba(122,154,130,0.06)",
            }}>
              <p style={{
                fontFamily: "var(--font-body), sans-serif",
                fontWeight: 400, fontSize: 13,
                color: "rgba(255,255,255,0.4)",
              }}>
                {label}
              </p>
              {typeof value === "string" ? (
                <p style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 12, fontWeight: 700,
                  color: "rgba(255,255,255,0.7)",
                }}>
                  {value}
                </p>
              ) : value}
            </div>
          ))}

          {player.injury_note && (
            <div style={{
              padding: "12px 14px", borderRadius: 8,
              backgroundColor: "rgba(224,112,112,0.06)",
              border: "1px solid rgba(224,112,112,0.15)",
            }}>
              <p style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 8, letterSpacing: "0.1em",
                color: "rgba(224,112,112,0.5)", marginBottom: 4,
              }}>
                NOTE MÉDICALE
              </p>
              <p style={{
                fontFamily: "var(--font-body), sans-serif",
                fontWeight: 400, fontSize: 13, lineHeight: 1.5,
                color: "rgba(255,255,255,0.5)",
              }}>
                {player.injury_note}
              </p>
            </div>
          )}
        </div>
      )}

      {tab === "stats" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {[
            { label: "Matchs joués",      value: stats.matchesPlayed },
            { label: "Titularisations",   value: stats.starts },
            { label: "Minutes",           value: stats.minutesPlayed },
            { label: "Minutes / match",   value: minutesPerMatch },
            { label: "Buts",              value: stats.goals },
            { label: "Passes déc.",       value: stats.assists },
          ].map(stat => (
            <div key={stat.label} style={{
              padding: "16px 18px", borderRadius: 10,
              backgroundColor: "var(--bg-card)",
              border: "1px solid rgba(122,154,130,0.08)",
            }}>
              <p style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 8, letterSpacing: "0.1em",
                color: "rgba(122,154,130,0.45)", marginBottom: 6, textTransform: "uppercase",
              }}>
                {stat.label}
              </p>
              <p style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontWeight: 900, fontSize: 28, lineHeight: 1,
                color: "rgba(255,255,255,0.85)",
              }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {tab === "sante" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Section title="Statut actuel" action={<StatusBadge status={medical.status} />}>
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
                {medical.returnDate
                  ? new Date(medical.returnDate).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })
                  : "—"}
              </p>
            </div>
          </Section>

          <Section title="Historique des blessures">
            <InjuryHistory injuries={medical.injuries} />
          </Section>

          <Section title="Charge d'entraînement — 8 dernières semaines">
            {medical.loads.length > 0 ? (
              <TrainingLoadChart loads={medical.loads} />
            ) : (
              <p style={{
                fontFamily: "var(--font-body), sans-serif", fontWeight: 400,
                fontSize: 13, color: "rgba(255,255,255,0.3)",
              }}>
                Aucune charge d'entraînement enregistrée pour le moment.
              </p>
            )}
          </Section>

          <Section title="Notes médicales">
            <p style={{
              fontFamily: "var(--font-body), sans-serif", fontWeight: 400,
              fontSize: 13, color: medical.notes ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.3)", lineHeight: 1.6,
            }}>
              {medical.notes || "Aucune note enregistrée pour le moment."}
            </p>
          </Section>

          <p style={{
            fontFamily: "var(--font-mono), monospace", fontSize: 9,
            letterSpacing: "0.06em", color: "rgba(122,154,130,0.35)",
          }}>
            Le statut et les notes médicales se modifient depuis{" "}
            <Link href="/dashboard/effectif" style={{ color: "rgba(122,154,130,0.6)" }}>
              l'effectif
            </Link>.
          </p>
        </div>
      )}

      {tab === "physique" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[
              { label: "Distance moyenne",  value: distances.length > 0 ? `${(avgDistance / 1000).toFixed(1)} km` : "—" },
              { label: "Sprints / séance",  value: sprintsTotal.length > 0 ? avgSprints : "—" },
              { label: "Vitesse max",       value: vmaxValues.length > 0 ? `${maxVmax} km/h` : "—" },
            ].map(stat => (
              <div key={stat.label} style={{
                padding: "16px 18px", borderRadius: 10,
                backgroundColor: "var(--bg-card)",
                border: "1px solid rgba(122,154,130,0.08)",
              }}>
                <p style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 8, letterSpacing: "0.1em",
                  color: "rgba(122,154,130,0.45)", marginBottom: 6, textTransform: "uppercase",
                }}>
                  {stat.label}
                </p>
                <p style={{
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  fontWeight: 900, fontSize: 28, lineHeight: 1,
                  color: "rgba(255,255,255,0.85)",
                }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {distances.length >= 2 && (
            <Section title="Distance — dernières séances">
              <PhysicalStatsChart entries={physical} />
            </Section>
          )}

          <Section title="Heatmap de déplacement">
            <div style={{
              aspectRatio: "16 / 9",
              borderRadius: 8,
              border: "1px dashed rgba(122,154,130,0.20)",
              backgroundColor: "rgba(122,154,130,0.03)",
              display: "flex", alignItems: "center", justifyContent: "center",
              textAlign: "center", padding: 24,
            }}>
              <p style={{
                fontFamily: "var(--font-body), sans-serif", fontWeight: 400,
                fontSize: 13, color: "rgba(255,255,255,0.3)", lineHeight: 1.6,
                maxWidth: 320,
              }}>
                Disponible lorsque les joueurs seront équipés de trackers GPS — affichera la carte de chaleur des déplacements sur le terrain.
              </p>
            </div>
          </Section>

          <Section title="Ajouter une donnée">
            <PhysicalEntryForm playerId={player.id} />
          </Section>

          <Section title="Historique">
            <PhysicalEntryList entries={physical} playerId={player.id} />
          </Section>

          <p style={{
            fontFamily: "var(--font-mono), monospace", fontSize: 9,
            letterSpacing: "0.06em", color: "rgba(122,154,130,0.35)",
          }}>
            Saisie manuelle par le coach (match ou entraînement) — distance, sprints et vitesse max estimés.
          </p>
        </div>
      )}
    </div>
  )
}

function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section style={{
      padding: "20px 22px", borderRadius: 12,
      backgroundColor: "var(--bg-card)",
      border: "1px solid rgba(122,154,130,0.08)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <h2 style={{
          fontFamily: "var(--font-mono), monospace", fontSize: 10, fontWeight: 700,
          letterSpacing: "0.1em", color: "rgba(122,154,130,0.6)",
          textTransform: "uppercase",
        }}>
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  )
}
