"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createMatch, deleteMatch } from "./actions"

interface Match {
  id: string; date: string; opponent: string; home_away: string
  competition?: string; goals_for?: number; goals_against?: number
}

const COMPETITIONS = [
  "Championnat", "Coupe de France", "Coupe Régionale",
  "Coupe Départementale", "Match amical", "Tournoi",
]

export default function MatchsClient({ matches: initial }: { matches: Match[] }) {
  const [matches, setMatches] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [pending, start]       = useTransition()
  const router                 = useRouter()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    start(async () => {
      const id = await createMatch(fd)
      setShowForm(false)
      router.push(`/club/matchs/${id}`)
    })
  }

  function handleDelete(id: string) {
    if (!confirm("Supprimer ce match ?")) return
    start(async () => {
      await deleteMatch(id)
      setMatches(prev => prev.filter(m => m.id !== id))
    })
  }

  const upcoming = matches.filter(m => m.goals_for === null && m.goals_against === null)
  const played   = matches.filter(m => m.goals_for !== null || m.goals_against !== null)

  const v = played.filter(m => (m.goals_for ?? 0) > (m.goals_against ?? 0)).length
  const n = played.filter(m => m.goals_for === m.goals_against && m.goals_for !== null).length
  const d = played.filter(m => (m.goals_for ?? 0) < (m.goals_against ?? 0)).length

  return (
    <div>
      {played.length > 0 && (
        <div className="flex gap-3 mb-8">
          {[
            { label: "Victoires", value: v, color: "#16a34a" },
            { label: "Nuls",      value: n, color: "#6b7280" },
            { label: "Défaites",  value: d, color: "#dc2626" },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex-1 p-3 rounded-xl text-center"
              style={{ backgroundColor: "#ffffff", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <p className="text-xl font-black" style={{ color }}>{value}</p>
              <p className="text-xs mt-0.5" style={{ color: "#888888" }}>{label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end mb-6">
        <button onClick={() => setShowForm(true)}
          className="px-4 py-2 rounded-xl text-sm font-bold transition hover:opacity-80"
          style={{ backgroundColor: "#111111", color: "#ffffff" }}>
          + Ajouter un match
        </button>
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-16 rounded-2xl"
          style={{ backgroundColor: "#ffffff", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <p className="text-4xl mb-4">⚽</p>
          <p className="font-bold mb-2" style={{ color: "#111111" }}>Aucun match</p>
          <p className="text-sm mb-6" style={{ color: "#888888" }}>Ajoute ton premier match</p>
          <button onClick={() => setShowForm(true)}
            className="px-5 py-2.5 rounded-xl text-sm font-bold transition hover:opacity-80"
            style={{ backgroundColor: "#111111", color: "#ffffff" }}>
            + Ajouter
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {upcoming.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#aaaaaa" }}>À venir</p>
              <div className="flex flex-col gap-2">
                {upcoming.sort((a,b)=>new Date(a.date).getTime()-new Date(b.date).getTime()).map(m => (
                  <MatchRow key={m.id} match={m} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          )}
          {played.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#aaaaaa" }}>Résultats</p>
              <div className="flex flex-col gap-2">
                {played.map(m => (
                  <MatchRow key={m.id} match={m} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          onClick={e => { if (e.target === e.currentTarget) setShowForm(false) }}>
          <div className="w-full max-w-md rounded-2xl p-6"
            style={{ backgroundColor: "#ffffff", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
            <h2 className="text-lg font-black mb-5" style={{ color: "#111111" }}>Nouveau match</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Field label="Adversaire *" name="opponent" required placeholder="ex: FC Lyon" />
              <Field label="Date *" name="date" type="datetime-local" required />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs mb-1 block" style={{ color: "#888888" }}>Lieu *</label>
                  <select name="home_away" required
                    className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none cursor-pointer"
                    style={{ backgroundColor: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.12)", color: "#111111" }}>
                    <option value="home">Domicile</option>
                    <option value="away">Extérieur</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: "#888888" }}>Compétition</label>
                  <select name="competition"
                    className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none cursor-pointer"
                    style={{ backgroundColor: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.12)", color: "#111111" }}>
                    <option value="">—</option>
                    {COMPETITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 rounded-xl text-sm transition hover:bg-black/5"
                  style={{ border: "1px solid rgba(0,0,0,0.12)", color: "#666666" }}>
                  Annuler
                </button>
                <button type="submit" disabled={pending}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold disabled:opacity-40 transition hover:opacity-80"
                  style={{ backgroundColor: "#111111", color: "#ffffff" }}>
                  {pending ? "..." : "Créer →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function MatchRow({ match: m, onDelete }: { match: Match; onDelete: (id:string)=>void }) {
  const played = m.goals_for !== null && m.goals_against !== null
  const result = !played ? null
    : (m.goals_for ?? 0) > (m.goals_against ?? 0) ? "V"
    : (m.goals_for ?? 0) < (m.goals_against ?? 0) ? "D" : "N"
  const rc = { V:"#16a34a", D:"#dc2626", N:"#6b7280" }
  const date = new Date(m.date)

  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl"
      style={{
        backgroundColor: !played ? "#ffffff" : "rgba(0,0,0,0.02)",
        border: !played ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(0,0,0,0.06)",
        boxShadow: !played ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
      }}>
      <div className="text-center w-14 shrink-0">
        <p className="text-xs font-bold" style={{ color: "#444444" }}>
          {date.toLocaleDateString("fr-FR", { day:"2-digit", month:"short" })}
        </p>
        <p className="text-[10px]" style={{ color: "#aaaaaa" }}>
          {m.home_away === "home" ? "Dom." : "Ext."}
        </p>
      </div>

      <div className="flex-1">
        <p className="font-bold" style={{ color: "#111111" }}>{m.opponent}</p>
        {m.competition && <p className="text-xs mt-0.5" style={{ color: "#888888" }}>{m.competition}</p>}
      </div>

      {played ? (
        <div className="flex items-center gap-2">
          <span className="text-xl font-black" style={{ color: "#111111" }}>{m.goals_for} – {m.goals_against}</span>
          <span className="w-7 h-7 rounded-full text-xs font-black flex items-center justify-center"
            style={{ backgroundColor: rc[result!]+"18", color: rc[result!] }}>
            {result}
          </span>
        </div>
      ) : (
        <span className="text-xs" style={{ color: "#aaaaaa" }}>À jouer</span>
      )}

      <div className="flex gap-1">
        <a href={`/club/matchs/${m.id}`}
          className="text-xs px-3 py-1.5 rounded-lg font-semibold transition hover:bg-black/5"
          style={{ color: "#444444" }}>
          {played ? "Détails" : "Préparer →"}
        </a>
        <button onClick={() => onDelete(m.id)}
          className="text-xs px-2 py-1.5 rounded-lg transition hover:text-red-500 hover:bg-red-50"
          style={{ color: "#cccccc" }}>
          ✕
        </button>
      </div>
    </div>
  )
}

function Field({ label, name, type="text", required, placeholder }: {
  label:string; name:string; type?:string; required?:boolean; placeholder?:string
}) {
  return (
    <div>
      <label className="text-xs mb-1 block" style={{ color: "#888888" }}>{label}</label>
      <input type={type} name={name} required={required} placeholder={placeholder}
        className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none"
        style={{ backgroundColor:"rgba(0,0,0,0.04)", border:"1px solid rgba(0,0,0,0.12)", color:"#111111" }} />
    </div>
  )
}
