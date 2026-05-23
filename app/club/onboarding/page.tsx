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
    <main className="min-h-[calc(100vh-56px)] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2].map(s => (
            <div key={s} className="flex-1 h-1 rounded-full transition-all"
              style={{ backgroundColor: s <= step ? "white" : "rgba(255,255,255,0.15)" }} />
          ))}
        </div>

        {step === 1 && (
          <div>
            <h1 className="text-3xl font-black mb-2">Bienvenue sur Footboard</h1>
            <p className="text-gray-300 mb-8">Commençons par créer votre club.</p>
            <button onClick={() => setStep(2)}
              className="w-full py-3 rounded-xl font-bold text-black hover:opacity-90 transition"
              style={{ backgroundColor: "white" }}>
              Créer mon club →
            </button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <h2 className="text-2xl font-black mb-1">Votre club</h2>
              <p className="text-gray-400 text-sm mb-6">Ces informations peuvent être modifiées plus tard.</p>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Nom du club *</label>
              <input name="name" required placeholder="ex: FC Marseille Nord"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 focus:outline-none"
                style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)" }} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Ville</label>
                <input name="city" placeholder="ex: Marseille"
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 focus:outline-none"
                  style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)" }} />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Niveau</label>
                <select name="level"
                  className="w-full px-4 py-3 rounded-xl text-white focus:outline-none cursor-pointer"
                  style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)" }}>
                  <option value="" style={{ backgroundColor: "#111" }}>Choisir...</option>
                  {LEVELS.map(l => (
                    <option key={l} value={l} style={{ backgroundColor: "#111" }}>{l}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-2">
              <button type="button" onClick={() => setStep(1)}
                className="px-4 py-3 rounded-xl text-sm text-gray-400 transition"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                Retour
              </button>
              <button type="submit" disabled={pending}
                className="flex-1 py-3 rounded-xl font-bold text-black hover:opacity-90 transition disabled:opacity-50"
                style={{ backgroundColor: "white" }}>
                {pending ? "Création..." : "Créer le club →"}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  )
}
