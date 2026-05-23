import Link from "next/link"

const FEATURES = [
  {
    href: "/tactique/animations",
    icon: "⚽",
    title: "Terrain tactique",
    desc: "Construis tes systèmes de jeu, anime les schémas tactiques, simule des situations de match.",
    status: "live",
  },
  {
    href: "/club",
    icon: "🏟",
    title: "Mon Club",
    desc: "Gérez l'effectif, planifiez les entraînements, préparez les matchs, suivez les statistiques.",
    status: "live",
  },
  {
    href: "/tactique/concepts",
    icon: "📖",
    title: "Concepts tactiques",
    desc: "Articles et schémas pour maîtriser le pressing, les transitions et les systèmes modernes.",
    status: "soon",
  },
]

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-56px)] text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">

        <div className="mb-16">
          <h1 className="text-5xl font-black mb-4 tracking-tight text-white">Footboard</h1>
          <p className="text-xl max-w-xl text-gray-300">
            La plateforme tactique pour les coaches — du club amateur au club professionnel.
          </p>
          <div className="flex gap-3 mt-8">
            <Link href="/club"
              className="px-6 py-3 rounded-xl text-sm font-bold text-black hover:opacity-90 transition"
              style={{ backgroundColor: "white" }}>
              Mon Club →
            </Link>
            <Link href="/tactique/animations"
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition"
              style={{ border: "1px solid rgba(255,255,255,0.4)" }}>
              Terrain tactique
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURES.map(({ href, icon, title, desc, status }) => (
            <div key={href}
              className="flex flex-col gap-3 p-5 rounded-2xl"
              style={{
                backgroundColor: status === "live" ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)",
                border: status === "live" ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(255,255,255,0.07)",
              }}>
              <div className="flex items-center justify-between">
                <span className="text-2xl">{icon}</span>
                {status === "soon" && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-gray-400"
                    style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}>
                    Bientôt
                  </span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-base mb-1">{title}</p>
                <p className="text-sm text-gray-300">{desc}</p>
              </div>
              {status === "live" && (
                <Link href={href} className="text-sm font-bold text-white hover:opacity-75 transition">
                  Ouvrir →
                </Link>
              )}
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}
