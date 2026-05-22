"use client"

import { useState, useTransition } from "react"
import { addPlayer, updatePlayer, updateStatus, deletePlayer } from "./actions"
import type { ClubPlayer } from "@/lib/supabase"

const STATUS_STYLES = {
  available: { label: "Disponible", color: "#4ade80", bg: "rgba(74,222,128,0.15)" },
  injured:   { label: "Blessé",     color: "#f87171", bg: "rgba(248,113,113,0.15)" },
  suspended: { label: "Suspendu",   color: "#fbbf24", bg: "rgba(251,191,36,0.15)"  },
}

const POS_COLORS = {
  GK:  { color: "#c084fc", bg: "rgba(192,132,252,0.2)" },
  DEF: { color: "#4ade80", bg: "rgba(74,222,128,0.2)"  },
  MIL: { color: "#60a5fa", bg: "rgba(96,165,250,0.2)"  },
  ATT: { color: "#f87171", bg: "rgba(248,113,113,0.2)" },
}

const POSITIONS = ["GK", "DEF", "MIL", "ATT"]

interface Props { players: ClubPlayer[] }

export default function EffectifClient({ players: initial }: Props) {
  const [players, setPlayers]   = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing]   = useState<ClubPlayer | null>(null)
  const [pending, startTransition] = useTransition()

  const available = players.filter(p => p.status === "available").length
  const injured   = players.filter(p => p.status === "injured").length
  const suspended = players.filter(p => p.status === "suspended").length

  function openAdd()              { setEditing(null); setShowForm(true) }
  function openEdit(p: ClubPlayer){ setEditing(p);    setShowForm(true) }
  function closeForm()            { setShowForm(false); setEditing(null) }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      if (editing) await updatePlayer(editing.id, fd)
      else         await addPlayer(fd)
      closeForm()
      window.location.reload()
    })
  }

  function handleDelete(id: string) {
    if (!confirm("Supprimer ce joueur ?")) return
    startTransition(async () => {
      await deletePlayer(id)
      setPlayers(prev => prev.filter(p => p.id !== id))
    })
  }

  function handleStatus(id: string, status: string) {
    startTransition(async () => {
      await updateStatus(id, status)
      setPlayers(prev => prev.map(p => p.id === id ? { ...p, status: status as any } : p))
    })
  }

  return (
    <div>
      {/* Résumé */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: "Disponibles", value: available, color: "#4ade80" },
          { label: "Blessés",     value: injured,   color: "#f87171" },
          { label: "Suspendus",   value: suspended, color: "#fbbf24" },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-4 rounded-xl text-center"
            style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <p className="text-2xl font-black" style={{ color }}>{value}</p>
            <p className="text-xs mt-1 text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-400 text-sm">{players.length} joueur{players.length !== 1 ? "s" : ""}</p>
        <button onClick={openAdd}
          className="px-4 py-2 rounded-xl text-sm font-bold text-black hover:opacity-90 transition"
          style={{ backgroundColor: "white" }}>
          + Ajouter un joueur
        </button>
      </div>

      {/* Liste */}
      {players.length === 0 ? (
        <div className="text-center py-16 rounded-2xl"
          style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-4xl mb-4">👥</p>
          <p className="text-white font-bold mb-2">Aucun joueur</p>
          <p className="text-gray-400 text-sm mb-6">Commence par ajouter tes joueurs</p>
          <button onClick={openAdd}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-black"
            style={{ backgroundColor: "white" }}>
            + Ajouter le premier joueur
          </button>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                {["#", "Joueur", "Poste", "Statut", ""].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {players.map((p, i) => {
                const s   = STATUS_STYLES[p.status as keyof typeof STATUS_STYLES] ?? STATUS_STYLES.available
                const pos = POS_COLORS[p.position as keyof typeof POS_COLORS]     ?? POS_COLORS.MIL
                return (
                  <tr key={p.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", backgroundColor: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                    <td className="px-4 py-3 text-xs text-gray-500">{p.number ?? "—"}</td>
                    <td className="px-4 py-3 font-semibold text-white">{p.first_name} {p.last_name}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded"
                        style={{ backgroundColor: pos.bg, color: pos.color }}>{p.position}</span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={p.status}
                        onChange={e => handleStatus(p.id, e.target.value)}
                        className="text-xs font-semibold px-2 py-0.5 rounded-full cursor-pointer focus:outline-none"
                        style={{ backgroundColor: s.bg, color: s.color, border: "none" }}>
                        <option value="available">Disponible</option>
                        <option value="injured">Blessé</option>
                        <option value="suspended">Suspendu</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => openEdit(p)}
                          className="text-xs px-2 py-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition">
                          Modifier
                        </button>
                        <button onClick={() => handleDelete(p.id)}
                          className="text-xs px-2 py-1 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition">
                          Suppr.
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal formulaire */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
          onClick={e => { if (e.target === e.currentTarget) closeForm() }}>
          <div className="w-full max-w-md rounded-2xl p-6"
            style={{ backgroundColor: "#1a1a2e", border: "1px solid rgba(255,255,255,0.15)" }}>

            <h2 className="text-lg font-black text-white mb-5">
              {editing ? "Modifier le joueur" : "Ajouter un joueur"}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Prénom *" name="first_name" required defaultValue={editing?.first_name} />
                <Field label="Nom *"    name="last_name"  required defaultValue={editing?.last_name}  />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Poste *</label>
                  <select name="position" required defaultValue={editing?.position ?? "MIL"}
                    className="w-full px-3 py-2 rounded-xl text-white text-sm focus:outline-none cursor-pointer"
                    style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)" }}>
                    {POSITIONS.map(pos => (
                      <option key={pos} value={pos} style={{ backgroundColor: "#1a1a2e" }}>{pos}</option>
                    ))}
                  </select>
                </div>
                <Field label="Numéro" name="number" type="number" min="1" max="99" defaultValue={editing?.number?.toString()} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Date de naissance" name="birth_date" type="date" defaultValue={editing?.birth_date ?? undefined} />
                <Field label="Téléphone"          name="phone"      type="tel"  defaultValue={editing?.phone ?? undefined}      />
              </div>

              <Field label="Email" name="email" type="email" defaultValue={editing?.email ?? undefined} />

              {editing && (
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Statut</label>
                  <select name="status" defaultValue={editing.status}
                    className="w-full px-3 py-2 rounded-xl text-white text-sm focus:outline-none cursor-pointer"
                    style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)" }}>
                    <option value="available" style={{ backgroundColor: "#1a1a2e" }}>Disponible</option>
                    <option value="injured"   style={{ backgroundColor: "#1a1a2e" }}>Blessé</option>
                    <option value="suspended" style={{ backgroundColor: "#1a1a2e" }}>Suspendu</option>
                  </select>
                </div>
              )}

              <div className="flex gap-3 mt-2">
                <button type="button" onClick={closeForm}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-400 transition"
                  style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                  Annuler
                </button>
                <button type="submit" disabled={pending}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-black transition hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: "white" }}>
                  {pending ? "..." : editing ? "Enregistrer" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, name, type = "text", required, defaultValue, min, max }: {
  label: string; name: string; type?: string
  required?: boolean; defaultValue?: string; min?: string; max?: string
}) {
  return (
    <div>
      <label className="text-xs text-gray-400 mb-1 block">{label}</label>
      <input
        type={type} name={name} required={required}
        defaultValue={defaultValue} min={min} max={max}
        className="w-full px-3 py-2 rounded-xl text-white text-sm focus:outline-none"
        style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)" }}
      />
    </div>
  )
}
