"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createTraining, deleteTraining } from "./actions"

interface Training {
  id: string; date: string; location?: string; theme?: string; notes?: string
}

export default function EntrainementsClient({ trainings: initial }: { trainings: Training[] }) {
  const [trainings, setTrainings] = useState(initial)
  const [showForm, setShowForm]   = useState(false)
  const [pending, start]          = useTransition()
  const router                    = useRouter()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    start(async () => {
      const id = await createTraining(fd)
      setShowForm(false)
      router.push(`/club/entrainements/${id}`)
    })
  }

  function handleDelete(id: string) {
    if (!confirm("Supprimer cet entraînement ?")) return
    start(async () => {
      await deleteTraining(id)
      setTrainings(prev => prev.filter(t => t.id !== id))
    })
  }

  const upcoming = trainings.filter(t => new Date(t.date) >= new Date())
  const past     = trainings.filter(t => new Date(t.date) <  new Date())

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button onClick={() => setShowForm(true)}
          className="px-4 py-2 rounded-xl text-sm font-bold text-black hover:opacity-90 transition"
          style={{ backgroundColor: "white" }}>
          + Planifier un entraînement
        </button>
      </div>

      {trainings.length === 0 ? (
        <div className="text-center py-16 rounded-2xl"
          style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-4xl mb-4">⚙️</p>
          <p className="text-white font-bold mb-2">Aucun entraînement</p>
          <p className="text-gray-400 text-sm mb-6">Planifie ta première session</p>
          <button onClick={() => setShowForm(true)}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-black"
            style={{ backgroundColor: "white" }}>
            + Planifier
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {upcoming.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">À venir</p>
              <div className="flex flex-col gap-2">
                {upcoming.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(t => (
                  <TrainingRow key={t.id} training={t} upcoming onDelete={handleDelete} />
                ))}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">Passés</p>
              <div className="flex flex-col gap-2">
                {past.map(t => (
                  <TrainingRow key={t.id} training={t} onDelete={handleDelete} />
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
            <h2 className="text-lg font-black text-white mb-5">Planifier un entraînement</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Field label="Date et heure *" name="date" type="datetime-local" required />
              <Field label="Lieu"            name="location" placeholder="ex: Stade Municipal" />
              <Field label="Thème"           name="theme"    placeholder="ex: Pressing haut, Finition..." />
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Notes</label>
                <textarea name="notes" rows={3} placeholder="Informations complémentaires..."
                  className="w-full px-3 py-2 rounded-xl text-white text-sm resize-none focus:outline-none"
                  style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)" }} />
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

function TrainingRow({ training: t, upcoming, onDelete }: { training: Training; upcoming?: boolean; onDelete: (id:string)=>void }) {
  const date = new Date(t.date)
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl"
      style={{
        backgroundColor: upcoming ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)",
        border: upcoming ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(255,255,255,0.07)",
      }}>
      <div className="text-center w-14 shrink-0">
        <p className="text-xs font-bold text-gray-300">
          {date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
        </p>
        <p className="text-[10px] text-gray-500">
          {date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
      <div className="flex-1">
        <p className="font-bold text-white">{t.theme ?? "Entraînement"}</p>
        {t.location && <p className="text-xs text-gray-400 mt-0.5">📍 {t.location}</p>}
      </div>
      <div className="flex items-center gap-2">
        <a href={`/club/entrainements/${t.id}`}
          className="text-xs px-3 py-1.5 rounded-lg font-semibold transition"
          style={{
            backgroundColor: upcoming ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)",
            color: upcoming ? "white" : "rgba(255,255,255,0.5)",
          }}>
          {upcoming ? "Gérer →" : "Voir"}
        </a>
        <button onClick={() => onDelete(t.id)}
          className="text-xs px-2 py-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition">
          ✕
        </button>
      </div>
    </div>
  )
}

function Field({ label, name, type = "text", required, placeholder }: {
  label: string; name: string; type?: string; required?: boolean; placeholder?: string
}) {
  return (
    <div>
      <label className="text-xs text-gray-400 mb-1 block">{label}</label>
      <input type={type} name={name} required={required} placeholder={placeholder}
        className="w-full px-3 py-2 rounded-xl text-white text-sm focus:outline-none"
        style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)" }} />
    </div>
  )
}
