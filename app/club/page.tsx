import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

const SECTIONS = [
  { href: "/club/effectif",      icon: "👥", title: "Effectif",       desc: "Joueurs, statuts, contacts"                  },
  { href: "/club/entrainements", icon: "⚙️", title: "Entraînements", desc: "Sessions, convocations, présences"           },
  { href: "/club/matchs",        icon: "⚽", title: "Matchs",         desc: "Compositions, tactiques, résultats"          },
  { href: "/club/stats",         icon: "📊", title: "Statistiques",   desc: "Buts, passes, temps de jeu, classement"     },
]

export default async function ClubPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  // Récupère le club de l'utilisateur
  const { data: club } = await supabase
    .from("clubs")
    .select("*")
    .eq("owner_id", userId)
    .single()

  // Pas encore de club → onboarding
  if (!club) redirect("/club/onboarding")

  const { count: playerCount } = await supabase
    .from("club_players")
    .select("*", { count: "exact", head: true })
    .eq("club_id", club.id)

  const { count: matchCount } = await supabase
    .from("matches")
    .select("*", { count: "exact", head: true })
    .eq("club_id", club.id)

  const { count: trainingCount } = await supabase
    .from("trainings")
    .select("*", { count: "exact", head: true })
    .eq("club_id", club.id)

  return (
    <main className="min-h-[calc(100vh-56px)] text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Header club */}
        <div className="mb-10">
          <Link href="/" className="text-xs text-white/30 hover:text-white/60 transition mb-3 inline-block">← Accueil</Link>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-black">{club.name}</h1>
              <p className="text-gray-400 mt-1">
                {[club.level, club.city].filter(Boolean).join(" · ")}
              </p>
            </div>
            <Link href="/tactique/animations"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition hover:opacity-80"
              style={{ border: "1px solid rgba(255,255,255,0.2)" }}>
              ⚽ Terrain tactique
            </Link>
          </div>
        </div>

        {/* Chiffres rapides */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {[
            { label: "Joueurs",        value: playerCount   ?? 0 },
            { label: "Matchs",         value: matchCount    ?? 0 },
            { label: "Entraînements",  value: trainingCount ?? 0 },
          ].map(({ label, value }) => (
            <div key={label} className="p-4 rounded-xl text-center"
              style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <p className="text-3xl font-black text-white">{value}</p>
              <p className="text-xs text-gray-400 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Sections */}
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
