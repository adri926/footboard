"use client"

import Link from "next/link"
import { useState } from "react"

const MOCK_TACTICS = [
  { id: "1", title: "Pressing PSG style", formation: "4-3-3", date: "il y a 2 jours", views: 124 },
  { id: "2", title: "Contre-attaque rapide", formation: "5-3-2", date: "il y a 5 jours", views: 87  },
  { id: "3", title: "Triangle aile droite", formation: "4-2-3-1", date: "il y a 1 semaine", views: 56 },
]

export default function ComptePage() {
  const [tab, setTab] = useState<"signin" | "signup">("signin")
  const [loggedIn] = useState(false)

  if (loggedIn) return <Dashboard />

  return (
    <main className="min-h-[calc(100vh-56px)] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="text-xs text-white/30 hover:text-white/60 transition mb-8 inline-block">← Accueil</Link>

        {/* Onglets */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          {(["signin", "signup"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="flex-1 py-2 rounded-lg text-sm font-semibold transition"
              style={{
                backgroundColor: tab === t ? "rgba(255,255,255,0.1)" : "transparent",
                color: tab === t ? "white" : "rgba(255,255,255,0.35)",
                border: tab === t ? "1px solid rgba(255,255,255,0.15)" : "1px solid transparent",
              }}>
              {t === "signin" ? "Se connecter" : "S'inscrire"}
            </button>
          ))}
        </div>

        {/* Formulaire */}
        <div className="flex flex-col gap-4">
          {tab === "signup" && (
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Nom d'utilisateur</label>
              <input
                type="text"
                placeholder="tactician_pro"
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-white/20 outline-none"
                style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                disabled
              />
            </div>
          )}

          <div>
            <label className="text-xs text-white/50 mb-1.5 block">Email</label>
            <input
              type="email"
              placeholder="vous@email.com"
              className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-white/20 outline-none"
              style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              disabled
            />
          </div>

          <div>
            <label className="text-xs text-white/50 mb-1.5 block">Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-white/20 outline-none"
              style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              disabled
            />
          </div>

          {/* CTA principal */}
          <button
            disabled
            className="w-full py-2.5 rounded-xl text-sm font-bold text-black/50 cursor-not-allowed mt-1"
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
            {tab === "signin" ? "Se connecter" : "Créer mon compte"}
          </button>

          {/* Séparateur */}
          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}/>
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>ou</span>
            <div className="flex-1 h-px" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}/>
          </div>

          {/* Google */}
          <button
            disabled
            className="w-full py-2.5 rounded-xl text-sm font-semibold cursor-not-allowed flex items-center justify-center gap-2"
            style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)" }}>
            <span>G</span> Continuer avec Google
          </button>
        </div>

        {/* Badge bientôt */}
        <div className="mt-6 p-3 rounded-xl text-center" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            Authentification disponible bientôt · Propulsé par Clerk
          </p>
        </div>

        {/* Avantages */}
        <div className="mt-6 flex flex-col gap-2">
          {[
            "Sauvegarde tes tactiques sans limite",
            "Partage via lien public unique",
            "Accède à ton historique depuis n'importe où",
          ].map(item => (
            <div key={item} className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
              <span>·</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

function Dashboard() {
  return (
    <main className="min-h-[calc(100vh-56px)] text-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-black">Mes tactiques</h1>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>{MOCK_TACTICS.length} tactiques sauvegardées</p>
          </div>
          <Link href="/tactique/animations"
            className="text-sm font-bold px-4 py-2 rounded-xl text-black transition hover:opacity-90"
            style={{ backgroundColor: "white" }}>
            + Créer
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {MOCK_TACTICS.map(t => (
            <div key={t.id} className="flex items-center gap-4 p-4 rounded-xl"
              style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex-1">
                <p className="text-white font-semibold">{t.title}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{t.formation} · {t.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>{t.views} vues</span>
                <button className="text-xs px-3 py-1.5 rounded-lg transition"
                  style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>
                  Partager
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
