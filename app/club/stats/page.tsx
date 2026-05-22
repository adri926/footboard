import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"

const CLUB_STATS = { j:4, v:2, n:1, d:1, bp:6, bc:4, pts:7, rank:4, total:10 }

const PLAYER_STATS = [
  { name:"Julien Garcia",    pos:"ATT", goals:4, assists:2, yellow:1, red:0, played:4, minutes:352 },
  { name:"Axel Laurent",     pos:"MIL", goals:1, assists:4, yellow:0, red:0, played:4, minutes:360 },
  { name:"Baptiste Thomas",  pos:"ATT", goals:1, assists:1, yellow:2, red:0, played:4, minutes:310 },
  { name:"Romain Michel",    pos:"MIL", goals:0, assists:2, yellow:1, red:0, played:4, minutes:360 },
  { name:"Hugo Leroy",       pos:"DEF", goals:0, assists:1, yellow:0, red:0, played:4, minutes:360 },
  { name:"Maxime Robert",    pos:"MIL", goals:0, assists:0, yellow:1, red:0, played:3, minutes:270 },
  { name:"Kevin Petit",      pos:"DEF", goals:0, assists:0, yellow:1, red:0, played:4, minutes:360 },
  { name:"Thomas Dubois",    pos:"DEF", goals:0, assists:0, yellow:0, red:0, played:4, minutes:360 },
  { name:"Lucas Martin",     pos:"GK",  goals:0, assists:0, yellow:0, red:0, played:4, minutes:360 },
]

const POS_COLORS = { GK:"#c084fc", DEF:"#4ade80", MIL:"#60a5fa", ATT:"#f87171" }

export default async function StatsPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const form = ["V","N","D","V"] // 4 derniers matchs

  return (
    <main className="min-h-[calc(100vh-56px)] text-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <Link href="/club" className="text-xs text-white/30 hover:text-white/60 transition mb-4 inline-block">← Mon Club</Link>
        <h1 className="text-3xl font-black mb-8">Statistiques</h1>

        {/* Stats équipe */}
        <div className="p-5 rounded-2xl mb-8"
          style={{ backgroundColor:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)" }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold" style={{ color:"rgba(255,255,255,0.6)" }}>Saison 2025/26 — Régional 2</p>
            <div className="flex gap-1">
              {form.map((r, i) => {
                const c = { V:"#4ade80", N:"#94a3b8", D:"#f87171" }[r]!
                return <span key={i} className="w-6 h-6 rounded-full text-[10px] font-black flex items-center justify-center"
                  style={{ backgroundColor: c+"25", color: c }}>{r}</span>
              })}
            </div>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3 text-center">
            {[
              { label:"J",  value: CLUB_STATS.j  },
              { label:"V",  value: CLUB_STATS.v,  color:"#4ade80" },
              { label:"N",  value: CLUB_STATS.n,  color:"#94a3b8" },
              { label:"D",  value: CLUB_STATS.d,  color:"#f87171" },
              { label:"BP", value: CLUB_STATS.bp  },
              { label:"BC", value: CLUB_STATS.bc  },
              { label:"Pts",value: CLUB_STATS.pts, color:"white" },
              { label:`${CLUB_STATS.rank}e/${CLUB_STATS.total}`, value:"🏆", color:"#fbbf24" },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <p className="text-xl font-black" style={{ color: color ?? "rgba(255,255,255,0.8)" }}>{value}</p>
                <p className="text-[10px]" style={{ color:"rgba(255,255,255,0.3)" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats joueurs */}
        <h2 className="text-sm font-semibold mb-3" style={{ color:"rgba(255,255,255,0.5)" }}>Statistiques individuelles</h2>
        <div className="rounded-2xl overflow-hidden" style={{ border:"1px solid rgba(255,255,255,0.08)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor:"rgba(255,255,255,0.04)", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
                  {["Joueur","Pos","MJ","Min","⚽","🅐","🟨","🟥"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold"
                      style={{ color:"rgba(255,255,255,0.4)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PLAYER_STATS.sort((a,b) => (b.goals+b.assists)-(a.goals+a.assists)).map((p, i) => (
                  <tr key={p.name} style={{ borderBottom:"1px solid rgba(255,255,255,0.05)", backgroundColor: i%2===0?"transparent":"rgba(255,255,255,0.02)" }}>
                    <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">{p.name}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: POS_COLORS[p.pos as keyof typeof POS_COLORS]+"30", color: POS_COLORS[p.pos as keyof typeof POS_COLORS] }}>
                        {p.pos}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-center" style={{ color:"rgba(255,255,255,0.5)" }}>{p.played}</td>
                    <td className="px-4 py-3 text-xs text-center" style={{ color:"rgba(255,255,255,0.4)" }}>{p.minutes}'</td>
                    <td className="px-4 py-3 text-xs text-center font-bold" style={{ color: p.goals > 0 ? "#f87171" : "rgba(255,255,255,0.25)" }}>{p.goals}</td>
                    <td className="px-4 py-3 text-xs text-center font-bold" style={{ color: p.assists > 0 ? "#60a5fa" : "rgba(255,255,255,0.25)" }}>{p.assists}</td>
                    <td className="px-4 py-3 text-xs text-center" style={{ color: p.yellow > 0 ? "#fbbf24" : "rgba(255,255,255,0.2)" }}>{p.yellow || "—"}</td>
                    <td className="px-4 py-3 text-xs text-center" style={{ color: p.red > 0 ? "#f87171" : "rgba(255,255,255,0.2)" }}>{p.red || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}
