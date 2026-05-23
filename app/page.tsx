import Link from "next/link"

const FEATURES = [
  {
    href: "/tactique/animations",
    icon: "⚽",
    title: "Animations",
    desc: "Terrain interactif — simule des situations de match, anime les tactiques en temps réel.",
    status: "live",
  },
  {
    href: "/tactique/concepts",
    icon: "📖",
    title: "Concepts",
    desc: "Articles et schémas pour comprendre le pressing, les transitions et les systèmes de jeu.",
    status: "soon",
  },
  {
    href: "/data",
    icon: "📊",
    title: "Données",
    desc: "Joueurs (xG, xA, stats), classements des ligues, comparaisons de systèmes.",
    status: "live",
  },
  {
    href: "/club",
    icon: "🏟",
    title: "Mon Club",
    desc: "Gérez votre club — effectif, entraînements, compositions, stats de saison.",
    status: "live",
  },
]

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-56px)] text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* Hero */}
        <div className="mb-16">
          <h1 className="text-5xl font-black mb-4 tracking-tight text-white">
            Footboard
          </h1>
          <p className="text-xl max-w-lg text-gray-300">
            Crée, anime et partage des tactiques football comme un coach professionnel.
          </p>
          <div className="flex gap-3 mt-8">
            <Link href="/tactique/animations"
              className="px-6 py-3 rounded-xl text-sm font-bold text-black hover:opacity-90 transition"
              style={{ backgroundColor: "white" }}>
              Commencer →
            </Link>
            <Link href="/tactique"
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition"
              style={{ border: "1px solid rgba(255,255,255,0.4)" }}>
              Explorer les tactiques
            </Link>
          </div>
        </div>

        {/* Grille features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ href, icon, title, desc, status }) => (
            <div key={href}
              className="flex flex-col gap-3 p-5 rounded-2xl transition"
              style={{
                backgroundColor: status === "live" ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
                border: status === "live" ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.08)",
              }}>
              <div className="flex items-center justify-between">
                <span className="text-2xl">{icon}</span>
                {status === "soon" && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-gray-400"
                    style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
                    Bientôt
                  </span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-base mb-1">{title}</p>
                <p className="text-sm text-gray-300">{desc}</p>
              </div>
              {status === "live" && (
                <Link href={href}
                  className="text-sm font-bold text-white hover:opacity-80 transition">
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
