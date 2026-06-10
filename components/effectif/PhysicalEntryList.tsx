"use client"

import { useTransition } from "react"
import { deletePhysicalEntry } from "@/app/dashboard/effectif/actions"
import { PHYSICAL_CONTEXT_LABELS, type PhysicalEntry } from "@/types/physical"

export default function PhysicalEntryList({ entries, playerId }: { entries: PhysicalEntry[]; playerId: string }) {
  const [pending, startTransition] = useTransition()

  if (entries.length === 0) {
    return (
      <p style={{
        fontFamily: "var(--font-body), sans-serif", fontWeight: 400,
        fontSize: 13, color: "rgba(255,255,255,0.3)",
      }}>
        Aucune donnée physique enregistrée pour le moment.
      </p>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {entries.map(e => (
        <div key={e.id} style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "10px 12px", borderRadius: 8,
          backgroundColor: "rgba(122,154,130,0.04)",
          border: "1px solid rgba(122,154,130,0.06)",
        }}>
          <span style={{
            fontFamily: "var(--font-mono), monospace", fontSize: 10, fontWeight: 700,
            color: "rgba(255,255,255,0.7)", minWidth: 70,
          }}>
            {new Date(e.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" })}
          </span>
          <span style={{
            fontFamily: "var(--font-mono), monospace", fontSize: 8, letterSpacing: "0.06em",
            color: e.context === "match" ? "#7A9A82" : "rgba(212,168,71,0.8)",
            border: `1px solid ${e.context === "match" ? "rgba(122,154,130,0.3)" : "rgba(212,168,71,0.3)"}`,
            borderRadius: 100, padding: "2px 8px", textTransform: "uppercase",
          }}>
            {PHYSICAL_CONTEXT_LABELS[e.context]}
          </span>
          <span style={{ fontFamily: "var(--font-body), sans-serif", fontSize: 12, color: "rgba(255,255,255,0.6)", flex: 1 }}>
            {e.distanceM !== null ? `${(e.distanceM / 1000).toFixed(1)} km` : "—"}
            {" · "}
            {e.sprints !== null ? `${e.sprints} sprints` : "—"}
            {" · "}
            {e.vmaxKmh !== null ? `${e.vmaxKmh} km/h max` : "—"}
            {e.notes && ` · ${e.notes}`}
          </span>
          <button
            disabled={pending}
            onClick={() => startTransition(() => { deletePhysicalEntry(e.id, playerId) })}
            style={{
              background: "none", border: "none", cursor: pending ? "default" : "pointer",
              color: "rgba(255,255,255,0.25)", fontSize: 12, padding: "2px 6px",
            }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
