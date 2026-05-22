import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"

const MOCK_TRAININGS = [
  { id:"1", date:"2026-05-27", location:"Stade Municipal", theme:"Pressing haut", present:9, total:11 },
  { id:"2", date:"2026-05-24", location:"Stade Municipal", theme:"Transitions",   present:10, total:11 },
  { id:"3", date:"2026-05-20", location:"Stade Municipal", theme:"Finition",      present:8,  total:11 },
  { id:"4", date:"2026-05-17", location:"Gymnase",         theme:"Fitness",       present:11, total:11 },
  { id:"5", date:"2026-05-31", location:"Stade Municipal", theme:"Préparation match Cannes", present:null, total:11 },
]

export default async function EntrainementsPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  return (
    <main className="min-h-[calc(100vh-56px)] text-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <Link href="/club" className="text-xs text-white/30 hover:text-white/60 transition mb-2 inline-block">← Mon Club</Link>
            <h1 className="text-3xl font-black">Entraînements</h1>
          </div>
          <button className="px-4 py-2 rounded-xl text-sm font-bold text-black hover:opacity-90 transition mt-4"
            style={{ backgroundColor:"white" }}>
            + Planifier
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {MOCK_TRAININGS.map(t => {
            const upcoming = t.present === null
            const attendance = t.present !== null ? Math.round((t.present / t.total) * 100) : null
            const dateObj = new Date(t.date)

            return (
              <Link key={t.id} href={`/club/entrainements/${t.id}`}
                className="flex items-center gap-4 p-4 rounded-2xl transition hover:scale-[1.01]"
                style={{
                  backgroundColor: upcoming ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
                  border: upcoming ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(255,255,255,0.07)",
                }}>

                <div className="text-center w-14 shrink-0">
                  <p className="text-xs font-bold" style={{ color:"rgba(255,255,255,0.4)" }}>
                    {dateObj.toLocaleDateString("fr-FR", { day:"2-digit", month:"short" })}
                  </p>
                  <p className="text-[10px]" style={{ color:"rgba(255,255,255,0.2)" }}>
                    {dateObj.toLocaleDateString("fr-FR", { weekday:"short" })}
                  </p>
                </div>

                <div className="flex-1">
                  <p className="font-bold text-white">{t.theme}</p>
                  <p className="text-xs mt-0.5" style={{ color:"rgba(255,255,255,0.35)" }}>📍 {t.location}</p>
                </div>

                {upcoming ? (
                  <span className="text-xs px-3 py-1.5 rounded-full font-semibold"
                    style={{ backgroundColor:"rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.7)" }}>
                    Convoquer →
                  </span>
                ) : (
                  <div className="text-right">
                    <p className="text-sm font-black text-white">{t.present}/{t.total}</p>
                    <p className="text-xs" style={{ color: attendance! >= 80 ? "#4ade80" : attendance! >= 60 ? "#fbbf24" : "#f87171" }}>
                      {attendance}% présence
                    </p>
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
