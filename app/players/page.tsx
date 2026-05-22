import Link from "next/link"

export default function PlayersPage() {
  return (
    <main className="min-h-[calc(100vh-56px)] text-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-5xl mb-6">👤</p>
        <h1 className="text-3xl font-bold mb-3">Joueurs réels</h1>
        <p className="mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>
          Stats en temps réel via API-Football — joueurs, cotes, positions, performances par saison.
        </p>
        <p className="text-xs mb-8" style={{ color: "rgba(255,255,255,0.2)" }}>
          Nécessite : API-Football + Supabase (cache)
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="text-sm px-4 py-2 rounded-lg transition"
            style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>
            ← Accueil
          </Link>
          <Link href="/board" className="text-sm px-4 py-2 rounded-lg font-semibold text-black transition hover:opacity-90"
            style={{ backgroundColor: "white" }}>
            Ouvrir le terrain
          </Link>
        </div>
      </div>
    </main>
  )
}
