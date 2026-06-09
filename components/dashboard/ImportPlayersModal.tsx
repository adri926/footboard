"use client"

import { useState, useTransition } from "react"
import Papa from "papaparse"
import { importPlayers } from "@/app/dashboard/effectif/actions"

interface Props {
  onClose: () => void
  onImported: () => void
}

const POSITIONS = [
  { value: "GK",  label: "Gardiens"    },
  { value: "DEF", label: "Défenseurs"  },
  { value: "MIL", label: "Milieux"     },
  { value: "ATT", label: "Attaquants"  },
] as const

const LABEL = {
  fontFamily: "var(--font-mono), monospace",
  fontSize: 8, fontWeight: 700, letterSpacing: "0.1em",
  color: "rgba(122,154,130,0.5)", textTransform: "uppercase" as const,
  marginBottom: 6, display: "block",
}

interface ParsedRow {
  first_name: string
  last_name:  string
  number:     number | null
}

// Repère les colonnes "Nom" / "Prénom" / "Numéro" quel que soit l'intitulé
// exact (les exports FFF/Footclubs varient selon la version et la langue).
function findColumn(headers: string[], candidates: string[]): string | null {
  const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim()
  for (const candidate of candidates) {
    const match = headers.find(h => norm(h) === candidate)
    if (match) return match
  }
  return null
}

function parseCsv(text: string): { rows: ParsedRow[]; error: string | null } {
  const result = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: true })
  if (result.errors.length > 0 && result.data.length === 0) {
    return { rows: [], error: "Impossible de lire ce fichier CSV." }
  }

  const headers = result.meta.fields ?? []
  const lastNameCol  = findColumn(headers, ["nom"])
  const firstNameCol = findColumn(headers, ["prenom", "prénom"])
  const numberCol    = findColumn(headers, ["numero", "numéro", "n", "n°"])

  if (!lastNameCol || !firstNameCol) {
    return { rows: [], error: "Colonnes \"Nom\" et \"Prénom\" introuvables dans le fichier." }
  }

  const rows: ParsedRow[] = result.data
    .map(row => ({
      last_name:  (row[lastNameCol] ?? "").trim(),
      first_name: (row[firstNameCol] ?? "").trim(),
      number:     numberCol ? (Number(row[numberCol]) || null) : null,
    }))
    .filter(r => r.first_name && r.last_name)

  if (rows.length === 0) {
    return { rows: [], error: "Aucune ligne exploitable dans ce fichier." }
  }

  return { rows, error: null }
}

export default function ImportPlayersModal({ onClose, onImported }: Props) {
  const [pending, startTransition] = useTransition()
  const [fileName, setFileName] = useState<string | null>(null)
  const [parsed, setParsed] = useState<ParsedRow[]>([])
  const [position, setPosition] = useState<typeof POSITIONS[number]["value"]>("MIL")
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<number | null>(null)

  function handleFile(file: File) {
    setError(null)
    setDone(null)
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = () => {
      const text = String(reader.result ?? "")
      const { rows, error: parseError } = parseCsv(text)
      if (parseError) { setError(parseError); setParsed([]); return }
      setParsed(rows)
    }
    reader.onerror = () => setError("Impossible de lire ce fichier.")
    reader.readAsText(file, "utf-8")
  }

  function handleImport() {
    setError(null)
    startTransition(async () => {
      const res = await importPlayers(parsed, position)
      if (!res.ok) { setError(res.error); return }
      setDone(res.count)
      onImported()
    })
  }

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        backgroundColor: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid rgba(122,154,130,0.18)",
        borderRadius: 16, padding: "28px 28px",
        width: "100%", maxWidth: 480,
        boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <p style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontWeight: 900, fontSize: 18, letterSpacing: "0.02em",
            color: "rgba(255,255,255,0.92)",
          }}>
            Importer un effectif
          </p>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(255,255,255,0.3)", fontSize: 18, lineHeight: 1,
            padding: 4,
          }}>✕</button>
        </div>

        <p style={{
          fontFamily: "var(--font-body), sans-serif", fontWeight: 400,
          fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginBottom: 20,
        }}>
          Exporte ta liste de licenciés depuis Footclubs
          (<span style={{ color: "rgba(122,154,130,0.7)" }}>Licences → Editions et extractions → Extraction MS Excel</span>),
          ouvre le fichier dans un tableur et enregistre-le au format <strong>CSV</strong>, puis dépose-le ci-dessous.
          Le poste et le statut pourront être ajustés ensuite, joueur par joueur.
        </p>

        {done !== null ? (
          <div style={{
            padding: "20px 18px", borderRadius: 10, textAlign: "center",
            backgroundColor: "rgba(122,154,130,0.08)",
            border: "1px solid rgba(122,154,130,0.2)",
          }}>
            <p style={{
              fontFamily: "var(--font-body), sans-serif", fontWeight: 500,
              fontSize: 14, color: "var(--sauge)", marginBottom: 14,
            }}>
              {done} joueur{done !== 1 ? "s" : ""} importé{done !== 1 ? "s" : ""} avec succès.
            </p>
            <button onClick={onClose} style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
              padding: "10px 24px", borderRadius: 10, cursor: "pointer",
              backgroundColor: "#7A9A82", color: "var(--bg)", border: "none",
            }}>
              FERMER
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Fichier */}
            <div>
              <label style={LABEL}>Fichier CSV</label>
              <label style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "20px 16px", borderRadius: 10, cursor: "pointer",
                backgroundColor: "rgba(255,255,255,0.03)",
                border: "1px dashed rgba(122,154,130,0.25)",
                fontFamily: "var(--font-mono), monospace", fontSize: 11,
                color: fileName ? "rgba(122,154,130,0.8)" : "rgba(255,255,255,0.3)",
                textAlign: "center",
              }}>
                {fileName ?? "Cliquer pour choisir un fichier .csv"}
                <input
                  type="file" accept=".csv,text/csv"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
                  style={{ display: "none" }}
                />
              </label>
            </div>

            {/* Aperçu */}
            {parsed.length > 0 && (
              <div>
                <label style={LABEL}>Aperçu — {parsed.length} joueur{parsed.length !== 1 ? "s" : ""} détecté{parsed.length !== 1 ? "s" : ""}</label>
                <div style={{
                  maxHeight: 140, overflowY: "auto", borderRadius: 8,
                  border: "1px solid rgba(122,154,130,0.1)",
                  display: "flex", flexDirection: "column", gap: 1,
                }}>
                  {parsed.slice(0, 8).map((r, i) => (
                    <div key={i} style={{
                      padding: "6px 10px", backgroundColor: "rgba(255,255,255,0.02)",
                      fontFamily: "var(--font-body), sans-serif", fontWeight: 400,
                      fontSize: 12, color: "rgba(255,255,255,0.6)",
                      display: "flex", justifyContent: "space-between",
                    }}>
                      <span>{r.first_name} {r.last_name.toUpperCase()}</span>
                      {r.number && <span style={{ color: "rgba(255,255,255,0.25)" }}>n°{r.number}</span>}
                    </div>
                  ))}
                  {parsed.length > 8 && (
                    <div style={{
                      padding: "6px 10px",
                      fontFamily: "var(--font-mono), monospace", fontSize: 9,
                      color: "rgba(255,255,255,0.25)", textAlign: "center",
                    }}>
                      + {parsed.length - 8} autre{parsed.length - 8 !== 1 ? "s" : ""}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Poste appliqué */}
            {parsed.length > 0 && (
              <div>
                <label style={LABEL}>Poste à appliquer à ces joueurs</label>
                <select
                  value={position}
                  onChange={e => setPosition(e.target.value as typeof position)}
                  style={{
                    fontFamily: "var(--font-body), sans-serif", fontWeight: 400, fontSize: 13,
                    backgroundColor: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(122,154,130,0.15)",
                    borderRadius: 8, padding: "9px 12px",
                    color: "rgba(255,255,255,0.85)",
                    width: "100%", outline: "none", cursor: "pointer",
                  }}
                >
                  {POSITIONS.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
            )}

            {error && (
              <p style={{
                fontFamily: "var(--font-body), sans-serif",
                fontSize: 12, color: "#e07070",
                backgroundColor: "rgba(224,112,112,0.08)",
                border: "1px solid rgba(224,112,112,0.2)",
                borderRadius: 6, padding: "8px 12px",
              }}>
                {error}
              </p>
            )}

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button type="button" onClick={onClose} style={{
                flex: 1, padding: "11px 0", borderRadius: 10, cursor: "pointer",
                fontFamily: "var(--font-mono), monospace",
                fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
                backgroundColor: "transparent",
                border: "1px solid rgba(122,154,130,0.15)",
                color: "rgba(255,255,255,0.3)",
              }}>
                ANNULER
              </button>
              <button
                type="button" onClick={handleImport}
                disabled={pending || parsed.length === 0}
                style={{
                  flex: 2, padding: "11px 0", borderRadius: 10,
                  cursor: pending || parsed.length === 0 ? "default" : "pointer",
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
                  backgroundColor: pending || parsed.length === 0 ? "rgba(122,154,130,0.25)" : "#7A9A82",
                  border: "none",
                  color: "var(--bg)",
                  transition: "opacity 0.2s",
                }}
              >
                {pending ? "..." : `IMPORTER${parsed.length > 0 ? ` (${parsed.length})` : ""}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
