"use client"

import { useState, useTransition } from "react"
import { addPhysicalEntry } from "@/app/dashboard/effectif/actions"
import { PHYSICAL_CONTEXT_LABELS, type PhysicalContext } from "@/types/physical"

const INPUT_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-mono), monospace",
  fontSize: 12, fontWeight: 700,
  backgroundColor: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(122,154,130,0.15)",
  borderRadius: 8, padding: "8px 10px",
  color: "rgba(255,255,255,0.85)",
  outline: "none", width: "100%",
}

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-mono), monospace",
  fontSize: 8, letterSpacing: "0.1em",
  color: "rgba(122,154,130,0.45)", marginBottom: 4, textTransform: "uppercase",
  display: "block",
}

export default function PhysicalEntryForm({ playerId }: { playerId: string }) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [context, setContext] = useState<PhysicalContext>("entrainement")
  const [distanceM, setDistanceM] = useState("")
  const [sprints, setSprints] = useState("")
  const [vmaxKmh, setVmaxKmh] = useState("")
  const [notes, setNotes] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const res = await addPhysicalEntry(playerId, {
        date, context,
        distanceM: distanceM === "" ? null : Number(distanceM),
        sprints:   sprints   === "" ? null : Number(sprints),
        vmaxKmh:   vmaxKmh   === "" ? null : Number(vmaxKmh),
        notes: notes || null,
      })
      if (!res.ok) { setError(res.error); return }
      setDistanceM(""); setSprints(""); setVmaxKmh(""); setNotes("")
    })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        <div>
          <label style={LABEL_STYLE}>Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={INPUT_STYLE} required />
        </div>
        <div>
          <label style={LABEL_STYLE}>Contexte</label>
          <select value={context} onChange={e => setContext(e.target.value as PhysicalContext)} style={INPUT_STYLE}>
            {Object.entries(PHYSICAL_CONTEXT_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        <div>
          <label style={LABEL_STYLE}>Distance (m)</label>
          <input type="number" min={0} max={20000} value={distanceM} onChange={e => setDistanceM(e.target.value)} style={INPUT_STYLE} placeholder="ex: 8500" />
        </div>
        <div>
          <label style={LABEL_STYLE}>Sprints</label>
          <input type="number" min={0} max={200} value={sprints} onChange={e => setSprints(e.target.value)} style={INPUT_STYLE} placeholder="ex: 12" />
        </div>
        <div>
          <label style={LABEL_STYLE}>Vitesse max (km/h)</label>
          <input type="number" min={0} max={50} step={0.1} value={vmaxKmh} onChange={e => setVmaxKmh(e.target.value)} style={INPUT_STYLE} placeholder="ex: 28.4" />
        </div>
      </div>

      <div>
        <label style={LABEL_STYLE}>Notes (optionnel)</label>
        <input type="text" value={notes} onChange={e => setNotes(e.target.value)} style={INPUT_STYLE} placeholder="ex: ressenti, contexte particulier..." />
      </div>

      {error && (
        <p style={{ fontFamily: "var(--font-mono), monospace", fontSize: 10, color: "rgba(224,112,112,0.8)" }}>
          {error}
        </p>
      )}

      <button type="submit" disabled={pending} style={{
        alignSelf: "flex-start",
        fontFamily: "var(--font-mono), monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
        padding: "9px 16px", borderRadius: 8, cursor: pending ? "default" : "pointer",
        backgroundColor: "#7A9A82", color: "var(--bg)", border: "none",
        opacity: pending ? 0.6 : 1,
      }}>
        {pending ? "AJOUT..." : "+ AJOUTER"}
      </button>
    </form>
  )
}
