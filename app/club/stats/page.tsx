import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { getStats } from "./actions"

const POS_COLORS = {
  GK:  "#c084fc", DEF: "#4ade80", MIL: "#60a5fa", ATT: "#f87171"
}

export default async function StatsPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const data = await getStats()
  if (!data) redirect("/club/onboarding")

  const { team, players, totalTrainings } = data

  // Top stats
  const topScorers = [...players].filter(p => p.goals > 0).sort((a,b) => b.goals - a.goals).slice(0, 3)
  const topAssists = [...players].filter(p => p.assists > 0).sort((a,b) => b.assists - a.assists).slice(0, 3)
  const topPresence = [...players]
    .filter(p => p.trainings > 0)
    .sort((a,b) => (b.presences / b.trainings) - (a.presences / a.trainings))
    .slice(0, 3)

  return (
    <main className="min-h-[calc(100vh-56px)] text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">

        <div className="mb-8">
          <Link href="/club" className="text-xs text-white/30 hover:text-white/60 transition mb-2 inline-block">← Mon Club</Link>
          <h1 className="text-3xl font-black">Statistiques</h1>
          <p className="text-sm text-gray-400 mt-1">Saison en cours</p>
        </div>

        {/* Bilan équipe */}
        <div className="p-5 rounded-2xl mb-8"
          style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <p className="text-sm font-semibold text-gray-300">Bilan collectif</p>
            {team.forme.length > 0 && (
              <div className="flex gap-1">
                {team.forme.map((r, i) => {
                  const c = { V: "#4ade80", N: "#94a3b8", D: "#f87171" }[r]!
                  return <span key={i} className="w-6 h-6 rounded-full text-[10px] font-black flex items-center justify-center"
                    style={{ backgroundColor: c+"25", color: c }}>{r}</span>
                })}
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3 text-center">
            {[
              { label: "J",   value: team.played },
              { label: "V",   value: team.v,   color: "#4ade80" },
              { label: "N",   value: team.n,   color: "#94a3b8" },
              { label: "D",   value: team.d,   color: "#f87171" },
              { label: "BP",  value: team.bp },
              { label: "BC",  value: team.bc },
              { label: "Diff",value: (team.bp - team.bc > 0 ? "+" : "") + (team.bp - team.bc), color: team.bp >= team.bc ? "#4ade80" : "#f87171" },
              { label: "Pts", value: team.pts, color: "white" },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <p className="text-xl font-black" style={{ color: color ?? "rgba(255,255,255,0.85)" }}>{value}</p>
                <p className="text-[10px] text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top 3 — podiums */}
        {(topScorers.length > 0 || topAssists.length > 0 || topPresence.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Podium title="Meilleurs buteurs"   icon="⚽" players={topScorers}  stat="goals"     color="#f87171" />
            <Podium title="Meilleurs passeurs"  icon="🅐" players={topAssists}  stat="assists"   color="#60a5fa" />
            <Podium title="Plus assidus"        icon="📋" players={topPresence} stat="presence"  color="#4ade80" totalTrainings={totalTrainings} />
          </div>
        )}

        {/* Tableau complet joueurs */}
        <h2 className="text-sm font-semibold text-gray-400 mb-3">Détail par joueur</h2>
        {players.length === 0 ? (
          <div className="text-center py-12 rounded-2xl"
            style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-gray-400 text-sm">Aucun joueur dans l'effectif</p>
            <Link href="/club/effectif" className="text-sm text-white font-semibold mt-2 inline-block">
              + Ajouter des joueurs
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    {["Joueur","Pos","MJ","Min","⚽","🅐","🟨","🟥","Présence"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...players]
                    .sort((a,b) => (b.goals + b.assists) - (a.goals + a.assists))
                    .map((p, i) => {
                      const pct = p.trainings > 0 ? Math.round((p.presences / p.trainings) * 100) : null
                      return (
                        <tr key={p.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", backgroundColor: i%2===0?"transparent":"rgba(255,255,255,0.02)" }}>
                          <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">{p.first_name} {p.last_name}</td>
                          <td className="px-4 py-3">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                              style={{ backgroundColor: POS_COLORS[p.position as keyof typeof POS_COLORS]+"30", color: POS_COLORS[p.position as keyof typeof POS_COLORS] }}>
                              {p.position}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-center text-gray-400">{p.played}</td>
                          <td className="px-4 py-3 text-xs text-center text-gray-400">{p.minutes}'</td>
                          <td className="px-4 py-3 text-xs text-center font-bold" style={{ color: p.goals > 0 ? "#f87171" : "rgba(255,255,255,0.2)" }}>{p.goals}</td>
                          <td className="px-4 py-3 text-xs text-center font-bold" style={{ color: p.assists > 0 ? "#60a5fa" : "rgba(255,255,255,0.2)" }}>{p.assists}</td>
                          <td className="px-4 py-3 text-xs text-center" style={{ color: p.yellows > 0 ? "#fbbf24" : "rgba(255,255,255,0.2)" }}>{p.yellows || "—"}</td>
                          <td className="px-4 py-3 text-xs text-center" style={{ color: p.reds > 0 ? "#f87171" : "rgba(255,255,255,0.2)" }}>{p.reds || "—"}</td>
                          <td className="px-4 py-3 text-xs text-center">
                            {pct !== null ? (
                              <span style={{ color: pct >= 80 ? "#4ade80" : pct >= 60 ? "#fbbf24" : "#f87171" }}>
                                {p.presences}/{p.trainings} ({pct}%)
                              </span>
                            ) : <span className="text-gray-600">—</span>}
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}

function Podium({ title, icon, players, stat, color, totalTrainings }: {
  title: string; icon: string; players: any[]; stat: string; color: string; totalTrainings?: number
}) {
  if (players.length === 0) return (
    <div className="p-5 rounded-2xl"
      style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <p className="text-sm font-semibold text-gray-400 mb-3">{icon} {title}</p>
      <p className="text-xs text-gray-600">Aucune donnée</p>
    </div>
  )

  return (
    <div className="p-5 rounded-2xl"
      style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
      <p className="text-sm font-semibold text-gray-300 mb-4">{icon} {title}</p>
      <div className="flex flex-col gap-2.5">
        {players.map((p, i) => {
          const value = stat === "presence" && totalTrainings
            ? `${Math.round((p.presences / p.trainings) * 100)}%`
            : p[stat]
          const medal = ["🥇","🥈","🥉"][i]
          return (
            <div key={p.id} className="flex items-center gap-3">
              <span className="text-sm">{medal}</span>
              <p className="flex-1 text-sm font-semibold text-white truncate">
                {p.first_name} {p.last_name}
              </p>
              <span className="text-base font-black" style={{ color }}>{value}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
