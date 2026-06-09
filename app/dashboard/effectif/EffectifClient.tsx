"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import PlayerStatusBadge from "@/components/dashboard/PlayerStatusBadge"
import PlayerForm from "@/components/dashboard/PlayerForm"
import ImportPlayersModal from "@/components/dashboard/ImportPlayersModal"
import PageHeader from "@/components/dashboard/PageHeader"
import { deletePlayer } from "./actions"
import type { Player } from "./actions"

type Position = "GK" | "DEF" | "MIL" | "ATT"

const POSITION_ORDER: Position[] = ["GK", "DEF", "MIL", "ATT"]
const POSITION_LABELS: Record<Position, string> = {
  GK: "Gardiens", DEF: "Défenseurs", MIL: "Milieux", ATT: "Attaquants",
}

interface Props { players: Player[] }

export default function EffectifClient({ players }: Props) {
  const router = useRouter()
  const [showForm, setShowForm]     = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [editing, setEditing]       = useState<Player | undefined>(undefined)
  const [deleting, startDelete]     = useTransition()

  function openAdd() {
    setEditing(undefined)
    setShowForm(true)
  }

  function openEdit(p: Player) {
    setEditing(p)
    setShowForm(true)
  }

  function handleDelete(id: string) {
    if (!confirm("Supprimer ce joueur ?")) return
    startDelete(async () => { await deletePlayer(id) })
  }

  const grouped = POSITION_ORDER.map(pos => ({
    pos,
    players: players
      .filter(p => p.position === pos)
      .sort((a, b) => (a.number ?? 99) - (b.number ?? 99)),
  }))

  return (
    <>
      <PageHeader
        label="Mon Club"
        title="Effectif"
        subtitle={`${players.length} joueur${players.length !== 1 ? "s" : ""}`}
        action={
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setShowImport(true)} style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
              padding: "10px 18px", borderRadius: 10, cursor: "pointer",
              backgroundColor: "transparent", color: "rgba(122,154,130,0.7)",
              border: "1px solid rgba(122,154,130,0.25)",
            }}>
              IMPORTER UN EFFECTIF
            </button>
            <button onClick={openAdd} style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
              padding: "10px 20px", borderRadius: 10, cursor: "pointer",
              backgroundColor: "#7A9A82", color: "#181812", border: "none",
            }}>
              + AJOUTER UN JOUEUR
            </button>
          </div>
        }
      />

      {/* Liste vide */}
      {players.length === 0 && (
        <div style={{
          padding: "48px 32px", borderRadius: 12, textAlign: "center",
          backgroundColor: "#1f1f19",
          border: "1px dashed rgba(122,154,130,0.2)",
        }}>
          <p style={{
            fontFamily: "var(--font-body), sans-serif",
            fontWeight: 400, fontSize: 14,
            color: "rgba(255,255,255,0.3)", marginBottom: 8,
          }}>
            Aucun joueur pour l'instant.
          </p>
          <p style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 9, letterSpacing: "0.08em",
            color: "rgba(122,154,130,0.35)",
          }}>
            Utilise le bouton en haut à droite pour ajouter ton premier joueur.
          </p>
        </div>
      )}

      {/* Joueurs groupés par poste */}
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {grouped.filter(g => g.players.length > 0).map(({ pos, players: group }) => (
          <div key={pos}>
            <p style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
              color: "#7A9A82", textTransform: "uppercase", marginBottom: 10,
            }}>
              {POSITION_LABELS[pos]} <span style={{ opacity: 0.4 }}>({group.length})</span>
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {group.map(p => (
                <div key={p.id} style={{
                  display: "flex", alignItems: "center",
                  padding: "11px 16px", borderRadius: 10,
                  backgroundColor: "#1f1f19",
                  border: "1px solid rgba(122,154,130,0.08)",
                  gap: 14,
                }}>
                  {/* Numéro */}
                  <span style={{
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontWeight: 900, fontSize: 18, lineHeight: 1,
                    color: "rgba(255,255,255,0.15)",
                    width: 26, textAlign: "center", flexShrink: 0,
                  }}>
                    {p.number ?? "—"}
                  </span>

                  {/* Nom */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontFamily: "var(--font-body), sans-serif",
                      fontWeight: 500, fontSize: 14,
                      color: "rgba(255,255,255,0.8)",
                    }}>
                      {p.first_name} <span style={{ fontWeight: 700 }}>{p.last_name.toUpperCase()}</span>
                    </p>
                    {p.injury_note && (
                      <p style={{
                        fontFamily: "var(--font-body), sans-serif",
                        fontWeight: 400, fontSize: 11,
                        color: "rgba(255,255,255,0.25)", marginTop: 2,
                      }}>
                        {p.injury_note}
                      </p>
                    )}
                  </div>

                  {/* Stats */}
                  <div style={{ display: "flex", gap: 18 }}>
                    {[
                      { label: "MJ", value: p.matches_played },
                      { label: "BUT", value: p.goals },
                      { label: "PAS", value: p.assists },
                    ].map(stat => (
                      <div key={stat.label} style={{ textAlign: "center" }}>
                        <p style={{
                          fontFamily: "var(--font-mono), monospace",
                          fontSize: 15, fontWeight: 700, lineHeight: 1,
                          color: "rgba(255,255,255,0.6)",
                        }}>
                          {stat.value}
                        </p>
                        <p style={{
                          fontFamily: "var(--font-mono), monospace",
                          fontSize: 7, letterSpacing: "0.08em",
                          color: "rgba(255,255,255,0.2)", marginTop: 2,
                        }}>
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <PlayerStatusBadge status={p.status} />

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <button
                      onClick={() => openEdit(p)}
                      style={{
                        fontFamily: "var(--font-mono), monospace",
                        fontSize: 8, letterSpacing: "0.06em",
                        padding: "4px 10px", borderRadius: 6, cursor: "pointer",
                        backgroundColor: "transparent",
                        border: "1px solid rgba(122,154,130,0.2)",
                        color: "rgba(122,154,130,0.5)",
                      }}
                    >
                      ÉDITER
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deleting}
                      style={{
                        fontFamily: "var(--font-mono), monospace",
                        fontSize: 8, letterSpacing: "0.06em",
                        padding: "4px 10px", borderRadius: 6, cursor: "pointer",
                        backgroundColor: "transparent",
                        border: "1px solid rgba(224,112,112,0.15)",
                        color: "rgba(224,112,112,0.4)",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showForm && (
        <PlayerForm
          player={editing}
          onClose={() => setShowForm(false)}
        />
      )}

      {showImport && (
        <ImportPlayersModal
          onClose={() => setShowImport(false)}
          onImported={() => router.refresh()}
        />
      )}
    </>
  )
}
