import Link from "next/link"

const sections = [
  {
    href: "/tactique/animations",
    icon: "⚽",
    title: "Animations",
    desc: "Terrain interactif — positionne les joueurs, simule des situations, anime les tactiques.",
    status: "live",
    cta: "Ouvrir →",
  },
  {
    href: "/tactique/creer",
    icon: "✏️",
    title: "Créer une situation",
    desc: "Place une zone, des joueurs et une finalité pour construire ta propre situation tactique.",
    status: "live",
    cta: "Créer →",
  },
  {
    href: "/tactique/mes-situations",
    icon: "⭐",
    title: "Mes situations",
    desc: "Retrouve et gère toutes les situations que tu as sauvegardées.",
    status: "live",
    cta: "Voir →",
  },
  {
    href: "/tactique/concepts",
    icon: "📖",
    title: "Concepts",
    desc: "Articles et schémas pour comprendre les systèmes de jeu, le pressing, les transitions.",
    status: "live",
    cta: "Lire →",
  },
]

export default function TactiquePage() {
  return (
    <main className="min-h-[calc(100vh-56px)] text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-xs text-white/30 hover:text-white/60 transition mb-8 inline-block">← Accueil</Link>
        <h1 className="text-4xl font-black mb-3">Tactique</h1>
        <p className="text-lg mb-12" style={{ color: "rgba(255,255,255,0.4)" }}>
          Crée, anime et comprends les systèmes de jeu.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map(({ href, icon, title, desc, status, cta }) => (
            <div key={href} className="flex flex-col gap-3 p-5 rounded-2xl"
              style={{
                backgroundColor: status === "live" ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)",
                border: status === "live" ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(255,255,255,0.05)",
              }}>
              <div className="flex items-center justify-between">
                <span className="text-2xl">{icon}</span>
                {status === "soon" && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.25)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    Bientôt
                  </span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-white font-bold mb-1">{title}</p>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>{desc}</p>
              </div>
              {cta && <Link href={href} className="text-sm font-semibold hover:opacity-80 transition" style={{ color: "rgba(255,255,255,0.7)" }}>{cta}</Link>}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
