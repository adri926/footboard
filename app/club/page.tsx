import { auth } from "@clerk/nextjs/server"
import Link from "next/link"

const SECTIONS = [
  { href: "/club/effectif",      icon: "👥", title: "Effectif",       desc: "Gérer tes joueurs, statuts, contacts"        },
  { href: "/club/entrainements", icon: "⚙️", title: "Entraînements", desc: "Planifier, convoquer, prendre les présences" },
  { href: "/club/matchs",        icon: "⚽", title: "Matchs",         desc: "Composer l'équipe, tactique, résultats"      },
  { href: "/club/stats",         icon: "📊", title: "Statistiques",   desc: "Buts, passes, temps de jeu, classement"     },
]

export default async function ClubPage() {
  const { userId } = await auth()

  return (
    <main className="min-h-[calc(100vh-56px)] text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">

        <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
          <div>
            <Link href="/" className="text-xs text-white/30 hover:text-white/60 transition mb-2 inline-block">← Accueil</Link>
            <h1 className="text-4xl font-black">Mon Club</h1>
            <p className="mt-2 text-gray-300">
              Gérez votre club — effectif, entraînements, matchs, stats.
            </p>
          </div>

          {/* Connexion optionnelle */}
          {!userId ? (
            <div className="flex items-center gap-3 mt-4 p-4 rounded-xl"
              style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)" }}>
              <div>
                <p className="text-white text-sm font-semibold">Sauvegarder mes données</p>
                <p className="text-xs text-gray-400 mt-0.5">Connecte-toi pour ne rien perdre</p>
              </div>
              <Link href="/sign-in"
                className="px-4 py-2 rounded-lg text-sm font-bold text-black whitespace-nowrap hover:opacity-90 transition"
                style={{ backgroundColor: "white" }}>
                Se connecter
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ backgroundColor: "rgba(74,222,128,0.1)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.3)" }}>
              ● Connecté
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SECTIONS.map(({ href, icon, title, desc }) => (
            <Link key={href} href={href}
              className="flex gap-4 p-5 rounded-2xl transition hover:scale-[1.02]"
              style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
              <span className="text-3xl">{icon}</span>
              <div>
                <p className="text-white font-bold text-lg">{title}</p>
                <p className="text-sm text-gray-300 mt-0.5">{desc}</p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  )
}
