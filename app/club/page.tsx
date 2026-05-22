import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"

const SECTIONS = [
  { href: "/club/effectif",      icon: "👥", title: "Effectif",       desc: "Gérer tes joueurs, statuts, contacts"            },
  { href: "/club/entrainements", icon: "⚙️", title: "Entraînements", desc: "Planifier, convoquer, prendre les présences"     },
  { href: "/club/matchs",        icon: "⚽", title: "Matchs",         desc: "Composer l'équipe, tactique, résultats"          },
  { href: "/club/stats",         icon: "📊", title: "Statistiques",   desc: "Buts, passes, temps de jeu, classement"         },
]

export default async function ClubPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  return (
    <main className="min-h-[calc(100vh-56px)] text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">

        <div className="flex items-start justify-between mb-12 flex-wrap gap-4">
          <div>
            <Link href="/" className="text-xs text-white/30 hover:text-white/60 transition mb-2 inline-block">← Accueil</Link>
            <h1 className="text-4xl font-black">Mon Club</h1>
            <p className="mt-2" style={{ color: "rgba(255,255,255,0.4)" }}>
              Gérez votre club de football — effectif, entraînements, matchs, stats.
            </p>
          </div>
          <Link href="/club/effectif"
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-black hover:opacity-90 transition mt-6"
            style={{ backgroundColor: "white" }}>
            + Créer mon club
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SECTIONS.map(({ href, icon, title, desc }) => (
            <Link key={href} href={href}
              className="flex gap-4 p-5 rounded-2xl transition hover:scale-[1.02]"
              style={{ backgroundColor:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)" }}>
              <span className="text-3xl">{icon}</span>
              <div>
                <p className="text-white font-bold text-lg">{title}</p>
                <p className="text-sm mt-0.5" style={{ color:"rgba(255,255,255,0.4)" }}>{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
