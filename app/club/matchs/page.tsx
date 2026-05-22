import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"

const MOCK_MATCHES = [
  { id:"1", date:"2026-05-18", opponent:"FC Mougins",    home_away:"home", goals_for:3, goals_against:1, competition:"Régional 2" },
  { id:"2", date:"2026-05-11", opponent:"AS Grasse",     home_away:"away", goals_for:1, goals_against:1, competition:"Régional 2" },
  { id:"3", date:"2026-05-04", opponent:"Antibes FC",    home_away:"home", goals_for:2, goals_against:0, competition:"Régional 2" },
  { id:"4", date:"2026-04-27", opponent:"OGC Nice B",    home_away:"away", goals_for:0, goals_against:2, competition:"Régional 2" },
  { id:"5", date:"2026-05-30", opponent:"Cannes AC",     home_away:"home", goals_for:null, goals_against:null, competition:"Régional 2" },
]

export default async function MatchsPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  return (
    <main className="min-h-[calc(100vh-56px)] text-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <Link href="/club" className="text-xs text-white/30 hover:text-white/60 transition mb-2 inline-block">← Mon Club</Link>
            <h1 className="text-3xl font-black">Matchs</h1>
          </div>
          <button className="px-4 py-2 rounded-xl text-sm font-bold text-black hover:opacity-90 transition mt-4"
            style={{ backgroundColor:"white" }}>
            + Nouveau match
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {MOCK_MATCHES.map(m => {
            const played = m.goals_for !== null
            const result = !played ? null
              : m.goals_for! > m.goals_against! ? "V"
              : m.goals_for! < m.goals_against! ? "D" : "N"
            const resultColors = { V:"#4ade80", D:"#f87171", N:"#94a3b8" }
            const dateObj = new Date(m.date)
            const upcoming = !played

            return (
              <Link key={m.id} href={`/club/matchs/${m.id}`}
                className="flex items-center gap-4 p-4 rounded-2xl transition hover:scale-[1.01]"
                style={{
                  backgroundColor: upcoming ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
                  border: upcoming ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(255,255,255,0.07)",
                }}>

                {/* Date */}
                <div className="text-center w-14 shrink-0">
                  <p className="text-xs font-bold" style={{ color:"rgba(255,255,255,0.4)" }}>
                    {dateObj.toLocaleDateString("fr-FR", { day:"2-digit", month:"short" })}
                  </p>
                  <p className="text-[10px]" style={{ color:"rgba(255,255,255,0.2)" }}>
                    {m.home_away === "home" ? "Domicile" : "Extérieur"}
                  </p>
                </div>

                {/* Adversaire */}
                <div className="flex-1">
                  <p className="font-bold text-white">{m.opponent}</p>
                  <p className="text-xs mt-0.5" style={{ color:"rgba(255,255,255,0.35)" }}>{m.competition}</p>
                </div>

                {/* Score / À venir */}
                {played ? (
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-black text-white">{m.goals_for} – {m.goals_against}</span>
                    <span className="w-7 h-7 rounded-full text-xs font-black flex items-center justify-center"
                      style={{ backgroundColor: resultColors[result!]+"25", color: resultColors[result!] }}>
                      {result}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-3 py-1.5 rounded-full font-semibold"
                      style={{ backgroundColor:"rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.7)" }}>
                      Préparer →
                    </span>
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
