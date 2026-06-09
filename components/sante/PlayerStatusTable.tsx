"use client"

import { useState } from "react"
import Link from "next/link"
import StatusBadge from "@/components/sante/StatusBadge"
import type { RosterPlayer } from "@/lib/roster"
import type { MedicalRecord, PlayerMedicalStatus } from "@/types/medical"

const FILTERS: { value: PlayerMedicalStatus | "tous"; label: string }[] = [
  { value: "tous",       label: "Tous" },
  { value: "disponible", label: "Disponibles" },
  { value: "incertain",  label: "Incertains" },
  { value: "blesse",     label: "Blessés" },
]

interface Row {
  player: RosterPlayer
  record: MedicalRecord
}

interface Props {
  rows: Row[]
}

export default function PlayerStatusTable({ rows }: Props) {
  const [filter, setFilter] = useState<PlayerMedicalStatus | "tous">("tous")
  const filtered = filter === "tous" ? rows : rows.filter(r => r.record.status === filter)

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {FILTERS.map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            style={{
              fontFamily: "var(--font-mono), monospace", fontSize: 10, fontWeight: 700,
              letterSpacing: "0.05em",
              padding: "6px 12px", borderRadius: 8, cursor: "pointer",
              color: filter === f.value ? "var(--sauge)" : "rgba(255,255,255,0.4)",
              backgroundColor: filter === f.value ? "var(--sauge-dim)" : "transparent",
              border: filter === f.value ? "1px solid var(--sauge-border)" : "1px solid rgba(122,154,130,0.12)",
            }}>
            {f.label.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {filtered.map(({ player, record }) => (
          <Link key={player.id} href={`/dashboard/sante/${player.id}`} style={{
            display: "flex", alignItems: "center", gap: 16,
            padding: "14px 18px", borderRadius: 10,
            backgroundColor: "var(--bg-card)",
            border: "1px solid rgba(122,154,130,0.08)",
            textDecoration: "none",
          }}>
            <div style={{ width: 36, textAlign: "center", flexShrink: 0 }}>
              <p style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontWeight: 900, fontSize: 18, color: "rgba(255,255,255,0.2)",
              }}>
                {player.number}
              </p>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontFamily: "var(--font-body), sans-serif", fontWeight: 500,
                fontSize: 14, color: "rgba(255,255,255,0.9)",
              }}>
                {player.name}
              </p>
              <p style={{
                fontFamily: "var(--font-mono), monospace", fontSize: 9,
                letterSpacing: "0.06em", color: "rgba(255,255,255,0.3)", marginTop: 2,
              }}>
                {player.position === "GK" ? "GB" : player.position}
                {record.returnDate && ` · RETOUR ESTIMÉ ${new Date(record.returnDate).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }).toUpperCase()}`}
              </p>
            </div>
            <StatusBadge status={record.status} />
          </Link>
        ))}
        {filtered.length === 0 && (
          <p style={{
            fontFamily: "var(--font-body), sans-serif", fontWeight: 400,
            fontSize: 13, color: "rgba(255,255,255,0.3)",
            padding: "24px 0", textAlign: "center",
          }}>
            Aucun joueur dans cette catégorie.
          </p>
        )}
      </div>
    </div>
  )
}
