import Link from "next/link"

const LIGUES = ["Premier League", "Liga", "Ligue 1", "Serie A", "Bundesliga"]

const CLASSEMENT = [
  { pos: 1,  club: "Liverpool",      pays: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj: 30, v: 22, n: 5, d: 3, bp: 72, bc: 31, pts: 71, forme: ["V","V","N","V","V"], xg: 68.2, xgc: 29.4, poss: 57 },
  { pos: 2,  club: "Arsenal",        pays: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj: 30, v: 20, n: 6, d: 4, bp: 63, bc: 28, pts: 66, forme: ["V","V","V","N","D"], xg: 60.1, xgc: 26.8, poss: 55 },
  { pos: 3,  club: "Man City",       pays: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj: 30, v: 19, n: 5, d: 6, bp: 68, bc: 38, pts: 62, forme: ["D","V","V","V","D"], xg: 65.4, xgc: 34.2, poss: 62 },
  { pos: 4,  club: "Chelsea",        pays: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj: 30, v: 16, n: 8, d: 6, bp: 57, bc: 40, pts: 56, forme: ["V","N","V","D","V"], xg: 54.8, xgc: 38.1, poss: 52 },
  { pos: 5,  club: "Newcastle",      pays: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj: 30, v: 15, n: 7, d: 8, bp: 52, bc: 36, pts: 52, forme: ["N","V","D","V","N"], xg: 48.3, xgc: 33.6, poss: 48 },
  { pos: 6,  club: "Aston Villa",    pays: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj: 30, v: 14, n: 8, d: 8, bp: 54, bc: 42, pts: 50, forme: ["V","D","V","V","N"], xg: 51.2, xgc: 39.8, poss: 50 },
  { pos: 7,  club: "Brighton",       pays: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj: 30, v: 13, n: 9, d: 8, bp: 50, bc: 38, pts: 48, forme: ["D","N","V","N","V"], xg: 49.1, xgc: 36.4, poss: 54 },
  { pos: 8,  club: "Tottenham",      pays: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj: 30, v: 12, n: 8, d: 10, bp: 48, bc: 45, pts: 44, forme: ["D","V","D","V","D"], xg: 46.8, xgc: 43.2, poss: 49 },
  { pos: 9,  club: "Man United",     pays: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj: 30, v: 11, n: 7, d: 12, bp: 36, bc: 44, pts: 40, forme: ["D","N","D","V","D"], xg: 38.4, xgc: 42.6, poss: 46 },
  { pos: 10, club: "West Ham",       pays: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj: 30, v: 9,  n: 8, d: 13, bp: 40, bc: 50, pts: 35, forme: ["D","D","N","D","V"], xg: 39.2, xgc: 48.8, poss: 44 },
]

function FormeTag({ result }: { result: string }) {
  const colors: Record<string, string> = { V: "#4ade80", N: "#94a3b8", D: "#f87171" }
  return (
    <span className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
      style={{ backgroundColor: colors[result] + "25", color: colors[result], border: `1px solid ${colors[result]}40` }}>
      {result}
    </span>
  )
}

export default function EquipesPage() {
  return (
    <main className="min-h-[calc(100vh-56px)] text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <Link href="/data" className="text-xs text-white/30 hover:text-white/60 transition mb-2 inline-block">← Données</Link>
            <h1 className="text-3xl font-black">Équipes</h1>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
              Classements et statistiques collectives — saison 2024/25
            </p>
          </div>
          <span className="text-xs px-3 py-1.5 rounded-full mt-6"
            style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.08)" }}>
            Données live bientôt
          </span>
        </div>

        {/* Sélecteur de ligue */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {LIGUES.map(l => (
            <button key={l}
              className="px-4 py-2 rounded-xl text-xs font-semibold transition"
              style={{
                backgroundColor: l === "Premier League" ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)",
                border: l === "Premier League" ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.07)",
                color: l === "Premier League" ? "white" : "rgba(255,255,255,0.35)",
              }}>
              {l}
            </button>
          ))}
        </div>

        {/* Classement */}
        <div className="rounded-2xl overflow-hidden mb-8" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  {["#", "Club", "MJ", "V", "N", "D", "BP", "BC", "+/-", "Pts", "Forme", "xG", "xGc", "Poss"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold whitespace-nowrap"
                      style={{ color: "rgba(255,255,255,0.4)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CLASSEMENT.map((e, i) => {
                  const diff = e.bp - e.bc
                  const zone = e.pos <= 4 ? "rgba(59,130,246,0.15)" : e.pos === 5 ? "rgba(250,204,21,0.08)" : "transparent"
                  return (
                    <tr key={e.club}
                      className="transition cursor-pointer"
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        backgroundColor: i % 2 === 0 ? zone : `rgba(255,255,255,0.02)`,
                      }}>
                      {/* Position */}
                      <td className="px-4 py-3 text-xs font-bold"
                        style={{ color: e.pos <= 4 ? "#60a5fa" : e.pos === 5 ? "#fbbf24" : "rgba(255,255,255,0.3)" }}>
                        {e.pos}
                      </td>
                      {/* Club */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span>{e.pays}</span>
                          <span className="font-semibold text-white whitespace-nowrap">{e.club}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-center" style={{ color: "rgba(255,255,255,0.5)" }}>{e.mj}</td>
                      <td className="px-4 py-3 text-xs text-center font-semibold" style={{ color: "#4ade80" }}>{e.v}</td>
                      <td className="px-4 py-3 text-xs text-center" style={{ color: "rgba(255,255,255,0.5)" }}>{e.n}</td>
                      <td className="px-4 py-3 text-xs text-center font-semibold" style={{ color: "#f87171" }}>{e.d}</td>
                      <td className="px-4 py-3 text-xs text-center" style={{ color: "rgba(255,255,255,0.6)" }}>{e.bp}</td>
                      <td className="px-4 py-3 text-xs text-center" style={{ color: "rgba(255,255,255,0.4)" }}>{e.bc}</td>
                      <td className="px-4 py-3 text-xs text-center font-semibold"
                        style={{ color: diff > 0 ? "#4ade80" : diff < 0 ? "#f87171" : "rgba(255,255,255,0.4)" }}>
                        {diff > 0 ? `+${diff}` : diff}
                      </td>
                      {/* Points */}
                      <td className="px-4 py-3 text-sm text-center font-black text-white">{e.pts}</td>
                      {/* Forme */}
                      <td className="px-4 py-3">
                        <div className="flex gap-0.5">
                          {e.forme.map((f, fi) => <FormeTag key={fi} result={f} />)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-center" style={{ color: "rgba(255,255,255,0.55)" }}>{e.xg}</td>
                      <td className="px-4 py-3 text-xs text-center" style={{ color: "rgba(255,255,255,0.45)" }}>{e.xgc}</td>
                      <td className="px-4 py-3 text-xs text-center" style={{ color: "rgba(255,255,255,0.55)" }}>{e.poss}%</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Légende */}
        <div className="flex gap-4 text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
          <span><span style={{ color: "#60a5fa" }}>■</span> Ligue des Champions</span>
          <span><span style={{ color: "#fbbf24" }}>■</span> Europa League</span>
        </div>

        <p className="text-xs mt-4" style={{ color: "rgba(255,255,255,0.12)" }}>
          Données simulées · les classements réels seront disponibles via API-Football
        </p>

      </div>
    </main>
  )
}
