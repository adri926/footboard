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

  // Bilan
  const v = played.filter(m => (m.goals_for ?? 0) > (m.goals_against ?? 0)).length
  const n = played.filter(m => m.goals_for === m.goals_against && m.goals_for !== null).length
  const d = played.filter(m => (m.goals_for ?? 0) < (m.goals_against ?? 0)).length

  return (
    <div>
      {played.length > 0 && (
        <div className="flex gap-3 mb-8">
          {[
            { label: "Victoires", value: v, color: "#4ade80" },
            { label: "Nuls",      value: n, color: "#94a3b8" },
            { label: "Défaites",  value: d, color: "#f87171" },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex-1 p-3 rounded-xl text-center"
              style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <p className="text-xl font-black" style={{ color }}>{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end mb-6">
        <button onClick={() => setShowForm(true)}
          className="px-4 py-2 rounded-xl text-sm font-bold text-black hover:opacity-90 transition"
          style={{ backgroundColor: "white" }}>
          + Ajouter un match
        </button>
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-16 rounded-2xl"
          style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-4xl mb-4">⚽</p>
          <p className="text-white font-bold mb-2">Aucun match</p>
          <p className="text-gray-400 text-sm mb-6">Ajoute ton premier match</p>
          <button onClick={() => setShowForm(true)}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-black"
            style={{ backgroundColor: "white" }}>
            + Ajouter
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {upcoming.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">À venir</p>
              <div className="flex flex-col gap-2">
                {upcoming.sort((a,b)=>new Date(a.date).getTime()-new Date(b.date).getTime()).map(m => (
                  <MatchRow key={m.id} match={m} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          )}
          {played.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">Résultats</p>
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
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
          onClick={e => { if (e.target === e.currentTarget) setShowForm(false) }}>
          <div className="w-full max-w-md rounded-2xl p-6"
            style={{ backgroundColor: "#1a1a2e", border: "1px solid rgba(255,255,255,0.15)" }}>
            <h2 className="text-lg font-black text-white mb-5">Nouveau match</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Field label="Adversaire *" name="opponent" required placeholder="ex: FC Lyon" />
              <Field label="Date *" name="date" type="datetime-local" required />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Lieu *</label>
                  <select name="home_away" required
                    className="w-full px-3 py-2 rounded-xl text-white text-sm focus:outline-none cursor-pointer"
                    style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)" }}>
                    <option value="home" style={{ backgroundColor:"#111" }}>Domicile</option>
                    <option value="away" style={{ backgroundColor:"#111" }}>Extérieur</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Compétition</label>
                  <select name="competition"
                    className="w-full px-3 py-2 rounded-xl text-white text-sm focus:outline-none cursor-pointer"
                    style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)" }}>
                    <option value="" style={{ backgroundColor:"#111" }}>—</option>
                    {COMPETITIONS.map(c => (
                      <option key={c} value={c} style={{ backgroundColor:"#111" }}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 rounded-xl text-sm text-gray-400"
                  style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                  Annuler
                </button>
                <button type="submit" disabled={pending}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-black disabled:opacity-50"
                  style={{ backgroundColor: "white" }}>
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
  const rc = { V:"#4ade80", D:"#f87171", N:"#94a3b8" }
  const date = new Date(m.date)

  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl"
      style={{
        backgroundColor: !played ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)",
        border: !played ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(255,255,255,0.07)",
      }}>
      <div className="text-center w-14 shrink-0">
        <p className="text-xs font-bold text-gray-300">
          {date.toLocaleDateString("fr-FR", { day:"2-digit", month:"short" })}
        </p>
        <p className="text-[10px] text-gray-500">
          {m.home_away === "home" ? "Dom." : "Ext."}
        </p>
      </div>

      <div className="flex-1">
        <p className="font-bold text-white">{m.opponent}</p>
        {m.competition && <p className="text-xs text-gray-400 mt-0.5">{m.competition}</p>}
      </div>

      {played ? (
        <div className="flex items-center gap-2">
          <span className="text-xl font-black text-white">{m.goals_for} – {m.goals_against}</span>
          <span className="w-7 h-7 rounded-full text-xs font-black flex items-center justify-center"
            style={{ backgroundColor: rc[result!]+"25", color: rc[result!] }}>
            {result}
          </span>
        </div>
      ) : (
        <span className="text-xs text-gray-400">À jouer</span>
      )}

      <div className="flex gap-1">
        <a href={`/club/matchs/${m.id}`}
          className="text-xs px-3 py-1.5 rounded-lg font-semibold text-white transition hover:bg-white/10">
          {played ? "Détails" : "Préparer →"}
        </a>
        <button onClick={() => onDelete(m.id)}
          className="text-xs px-2 py-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition">
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
      <label className="text-xs text-gray-400 mb-1 block">{label}</label>
      <input type={type} name={name} required={required} placeholder={placeholder}
        className="w-full px-3 py-2 rounded-xl text-white text-sm focus:outline-none"
        style={{ backgroundColor:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.15)" }} />
    </div>
  )
}
