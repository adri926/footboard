import Link from "next/link"

const MOCK_PLAYERS = [
  { nom: "Kylian Mbappé",    club: "Real Madrid",    poste: "ATT", nat: "🇫🇷", mj: 28, min: 2380, buts: 24, passes: 8,  xg: 21.4, xa: 6.2,  tirs90: 4.8, passes_pct: 82, dribbles: 3.2, dist: 10.8 },
  { nom: "Erling Haaland",   club: "Man City",       poste: "ATT", nat: "🇳🇴", mj: 25, min: 2120, buts: 22, passes: 5,  xg: 24.1, xa: 3.1,  tirs90: 5.1, passes_pct: 74, dribbles: 1.4, dist: 9.6  },
  { nom: "Vinícius Jr",      club: "Real Madrid",    poste: "ATT", nat: "🇧🇷", mj: 27, min: 2190, buts: 18, passes: 12, xg: 15.8, xa: 9.4,  tirs90: 3.9, passes_pct: 79, dribbles: 5.8, dist: 11.2 },
  { nom: "Phil Foden",       club: "Man City",       poste: "MIL", nat: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj: 26, min: 2050, buts: 14, passes: 11, xg: 11.2, xa: 8.7,  tirs90: 2.8, passes_pct: 88, dribbles: 2.9, dist: 10.4 },
  { nom: "Rodri",            club: "Man City",       poste: "MIL", nat: "🇪🇸", mj: 24, min: 2010, buts: 4,  passes: 9,  xg: 3.8,  xa: 7.2,  tirs90: 1.2, passes_pct: 93, dribbles: 1.1, dist: 11.8 },
  { nom: "Lamine Yamal",     club: "FC Barcelone",   poste: "ATT", nat: "🇪🇸", mj: 29, min: 2340, buts: 12, passes: 17, xg: 10.4, xa: 13.2, tirs90: 2.6, passes_pct: 81, dribbles: 4.7, dist: 10.1 },
  { nom: "Pedri",            club: "FC Barcelone",   poste: "MIL", nat: "🇪🇸", mj: 22, min: 1810, buts: 6,  passes: 10, xg: 5.2,  xa: 8.1,  tirs90: 1.8, passes_pct: 91, dribbles: 2.4, dist: 10.9 },
  { nom: "Mohamed Salah",    club: "Liverpool",      poste: "ATT", nat: "🇪🇬", mj: 28, min: 2390, buts: 20, passes: 15, xg: 17.8, xa: 11.4, tirs90: 4.2, passes_pct: 80, dribbles: 3.8, dist: 10.6 },
  { nom: "Bukayo Saka",      club: "Arsenal",        poste: "ATT", nat: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj: 27, min: 2280, buts: 14, passes: 13, xg: 12.6, xa: 10.8, tirs90: 3.1, passes_pct: 84, dribbles: 3.4, dist: 11.0 },
  { nom: "Jude Bellingham",  club: "Real Madrid",    poste: "MIL", nat: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj: 26, min: 2200, buts: 16, passes: 10, xg: 13.4, xa: 8.2,  tirs90: 3.4, passes_pct: 87, dribbles: 2.8, dist: 11.4 },
]

const POSTES = ["Tous", "ATT", "MIL", "DEF", "GK"]

export default function JoueursPage() {
  return (
    <main className="min-h-[calc(100vh-56px)] text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <Link href="/data" className="text-xs text-white/30 hover:text-white/60 transition mb-2 inline-block">← Données</Link>
            <h1 className="text-3xl font-black">Joueurs</h1>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
              Base de données statistiques — saison 2024/25
            </p>
          </div>
          <span className="text-xs px-3 py-1.5 rounded-full mt-6"
            style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.08)" }}>
            Données live bientôt
          </span>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Recherche */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1 min-w-48"
            style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <span className="text-white/30 text-sm">🔍</span>
            <span className="text-sm" style={{ color: "rgba(255,255,255,0.2)" }}>Rechercher un joueur…</span>
          </div>

          {/* Poste */}
          <div className="flex gap-1">
            {POSTES.map(p => (
              <button key={p}
                className="px-3 py-2 rounded-xl text-xs font-semibold transition"
                style={{
                  backgroundColor: p === "Tous" ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)",
                  border: p === "Tous" ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.07)",
                  color: p === "Tous" ? "white" : "rgba(255,255,255,0.4)",
                }}>
                {p}
              </button>
            ))}
          </div>

          {/* Ligue */}
          <button className="px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1"
            style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)" }}>
            Toutes les ligues ▾
          </button>

          {/* Trier par */}
          <button className="px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1"
            style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)" }}>
            Trier : Buts ▾
          </button>
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  {["#", "Joueur", "Club", "Pos", "MJ", "Min", "Buts", "Passes D", "xG", "xA", "Tirs/90", "Passes %", "Drib/90", "Dist/match"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold whitespace-nowrap"
                      style={{ color: "rgba(255,255,255,0.4)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_PLAYERS.map((p, i) => (
                  <tr key={p.nom}
                    className="transition cursor-pointer"
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      backgroundColor: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)",
                    }}
                  >
                    <td className="px-4 py-3 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span>{p.nat}</span>
                        <span className="font-semibold text-white whitespace-nowrap">{p.nom}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "rgba(255,255,255,0.5)" }}>{p.club}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: p.poste === "ATT" ? "rgba(239,68,68,0.2)" : p.poste === "MIL" ? "rgba(59,130,246,0.2)" : "rgba(34,197,94,0.2)",
                          color: p.poste === "ATT" ? "#f87171" : p.poste === "MIL" ? "#60a5fa" : "#4ade80",
                        }}>
                        {p.poste}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-center" style={{ color: "rgba(255,255,255,0.6)" }}>{p.mj}</td>
                    <td className="px-4 py-3 text-xs text-center" style={{ color: "rgba(255,255,255,0.5)" }}>{p.min}</td>
                    <Stat value={p.buts} max={24} color="#f87171" />
                    <Stat value={p.passes} max={17} color="#60a5fa" />
                    <Stat value={p.xg} max={24} color="#fb923c" decimals />
                    <Stat value={p.xa} max={13} color="#a78bfa" decimals />
                    <td className="px-4 py-3 text-xs text-center" style={{ color: "rgba(255,255,255,0.55)" }}>{p.tirs90}</td>
                    <td className="px-4 py-3 text-xs text-center">
                      <span style={{ color: p.passes_pct >= 90 ? "#4ade80" : p.passes_pct >= 80 ? "rgba(255,255,255,0.7)" : "#f87171" }}>
                        {p.passes_pct}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-center" style={{ color: "rgba(255,255,255,0.55)" }}>{p.dribbles}</td>
                    <td className="px-4 py-3 text-xs text-center" style={{ color: "rgba(255,255,255,0.45)" }}>{p.dist} km</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs mt-4 text-center" style={{ color: "rgba(255,255,255,0.15)" }}>
          Données simulées · les statistiques réelles seront disponibles via API-Football
        </p>

      </div>
    </main>
  )
}

function Stat({ value, max, color, decimals = false }: { value: number; max: number; color: string; decimals?: boolean }) {
  const intensity = Math.round((value / max) * 100)
  return (
    <td className="px-4 py-3 text-xs text-center font-semibold" style={{ color, opacity: 0.4 + (intensity / 100) * 0.6 }}>
      {decimals ? value.toFixed(1) : value}
    </td>
  )
}
