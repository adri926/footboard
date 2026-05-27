"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createClub } from "./actions"

const LEVELS = [
  "National", "Régional 1", "Régional 2", "Régional 3",
  "Départemental 1", "Départemental 2", "Départemental 3",
  "District", "U18", "U16", "U15", "U13", "Futsal", "Féminin",
]

export default function OnboardingPage() {
  const [step, setStep]     = useState(1)
  const [pending, start]    = useTransition()
  const router              = useRouter()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    start(async () => {
      await createClub(fd)
      router.push("/club")
    })
  }

  return (
    <main className="min-h-[calc(100vh-56px)] flex items-center justify-center px-6" style={{ color: "#111111" }}>
      <div className="w-full max-w-md">

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2].map(s => (
            <div key={s} className="flex-1 h-1 rounded-full transition-all"
              style={{ backgroundColor: s <= step ? "#111111" : "rgba(0,0,0,0.12)" }} />
          ))}
        </div>

        {step === 1 && (
          <div>
            <h1 className="text-3xl font-black mb-2" style={{ color: "#111111" }}>Bienvenue sur Footboard</h1>
            <p className="mb-8" style={{ color: "#666666" }}>Commençons par créer votre club.</p>
            <button onClick={() => setStep(2)}
              className="w-full py-3 rounded-xl font-bold transition hover:opacity-80"
              style={{ backgroundColor: "#111111", color: "#ffffff" }}>
              Créer mon club →
            </button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <h2 className="text-2xl font-black mb-1" style={{ color: "#111111" }}>Votre club</h2>
              <p className="text-sm mb-6" style={{ color: "#888888" }}>Ces informations peuvent être modifiées plus tard.</p>
            </div>

            <div>
              <label className="text-xs mb-1.5 block" style={{ color: "#888888" }}>Nom du club *</label>
              <input name="name" required placeholder="ex: FC Marseille Nord"
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
                style={{ backgroundColor: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.12)", color: "#111111" }} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: "#888888" }}>Ville</label>
                <input name="city" placeholder="ex: Marseille"
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
                  style={{ backgroundColor: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.12)", color: "#111111" }} />
              </div>
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: "#888888" }}>Niveau</label>
                <select name="level"
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none cursor-pointer"
                  style={{ backgroundColor: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.12)", color: "#111111" }}>
                  <option value="">Choisir...</option>
                  {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-2">
              <button type="button" onClick={() => setStep(1)}
                className="px-4 py-3 rounded-xl text-sm transition hover:bg-black/5"
                style={{ border: "1px solid rgba(0,0,0,0.12)", color: "#666666" }}>
                Retour
              </button>
              <button type="submit" disabled={pending}
                className="flex-1 py-3 rounded-xl font-bold transition hover:opacity-80 disabled:opacity-40"
                style={{ backgroundColor: "#111111", color: "#ffffff" }}>
                {pending ? "Création..." : "Créer le club →"}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  )
}
