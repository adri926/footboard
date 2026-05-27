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
    <main className="min-h-[calc(100vh-56px)]" style={{ color: "#111111" }}>
      <div className="max-w-5xl mx-auto px-6 py-10">

        <div className="mb-8">
          <Link href="/club" className="text-xs transition mb-2 inline-block hover:opacity-60" style={{ color: "#999999" }}>← Mon Club</Link>
          <h1 className="text-3xl font-black" style={{ color: "#111111" }}>Statistiques</h1>
          <p className="text-sm mt-1" style={{ color: "#888888" }}>Saison en cours</p>
        </div>

        {/* Bilan équipe */}
        <div className="p-5 rounded-2xl mb-8"
          style={{ backgroundColor: "#ffffff", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <p className="text-sm font-semibold" style={{ color: "#666666" }}>Bilan collectif</p>
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
              { label: "V",   value: team.v,   color: "#16a34a" },
              { label: "N",   value: team.n,   color: "#6b7280" },
              { label: "D",   value: team.d,   color: "#dc2626" },
              { label: "BP",  value: team.bp },
              { label: "BC",  value: team.bc },
              { label: "Diff",value: (team.bp - team.bc > 0 ? "+" : "") + (team.bp - team.bc), color: team.bp >= team.bc ? "#16a34a" : "#dc2626" },
              { label: "Pts", value: team.pts, color: "#111111" },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <p className="text-xl font-black" style={{ color: color ?? "#111111" }}>{value}</p>
                <p className="text-[10px]" style={{ color: "#888888" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top 3 — podiums */}
        {(topScorers.length > 0 || topAssists.length > 0 || topPresence.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Podium title="Meilleurs buteurs"   icon="⚽" players={topScorers}  stat="goals"     color="#dc2626" />
            <Podium title="Meilleurs passeurs"  icon="🅐" players={topAssists}  stat="assists"   color="#2563eb" />
            <Podium title="Plus assidus"        icon="📋" players={topPresence} stat="presence"  color="#16a34a" totalTrainings={totalTrainings} />
          </div>
        )}

        {/* Tableau complet joueurs */}
        <h2 className="text-sm font-semibold mb-3" style={{ color: "#888888" }}>Détail par joueur</h2>
        {players.length === 0 ? (
          <div className="text-center py-12 rounded-2xl"
            style={{ backgroundColor: "#ffffff", border: "1px solid rgba(0,0,0,0.08)" }}>
            <p className="text-sm" style={{ color: "#888888" }}>Aucun joueur dans l'effectif</p>
            <Link href="/club/effectif" className="text-sm font-semibold mt-2 inline-block hover:opacity-70" style={{ color: "#111111" }}>
              + Ajouter des joueurs
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(0,0,0,0.08)", backgroundColor: "#ffffff", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: "rgba(0,0,0,0.03)", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                    {["Joueur","Pos","MJ","Min","⚽","🅐","🟨","🟥","Présence"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold whitespace-nowrap" style={{ color: "#888888" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...players]
                    .sort((a,b) => (b.goals + b.assists) - (a.goals + a.assists))
                    .map((p, i) => {
                      const pct = p.trainings > 0 ? Math.round((p.presences / p.trainings) * 100) : null
                      return (
                        <tr key={p.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.05)", backgroundColor: i%2===0?"transparent":"rgba(0,0,0,0.015)" }}>
                          <td className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: "#111111" }}>{p.first_name} {p.last_name}</td>
                          <td className="px-4 py-3">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                              style={{ backgroundColor: POS_COLORS[p.position as keyof typeof POS_COLORS]+"22", color: POS_COLORS[p.position as keyof typeof POS_COLORS] }}>
                              {p.position}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-center" style={{ color: "#888888" }}>{p.played}</td>
                          <td className="px-4 py-3 text-xs text-center" style={{ color: "#888888" }}>{p.minutes}'</td>
                          <td className="px-4 py-3 text-xs text-center font-bold" style={{ color: p.goals > 0 ? "#dc2626" : "#cccccc" }}>{p.goals}</td>
                          <td className="px-4 py-3 text-xs text-center font-bold" style={{ color: p.assists > 0 ? "#2563eb" : "#cccccc" }}>{p.assists}</td>
                          <td className="px-4 py-3 text-xs text-center" style={{ color: p.yellows > 0 ? "#d97706" : "#cccccc" }}>{p.yellows || "—"}</td>
                          <td className="px-4 py-3 text-xs text-center" style={{ color: p.reds > 0 ? "#dc2626" : "#cccccc" }}>{p.reds || "—"}</td>
                          <td className="px-4 py-3 text-xs text-center">
                            {pct !== null ? (
                              <span style={{ color: pct >= 80 ? "#16a34a" : pct >= 60 ? "#d97706" : "#dc2626" }}>
                                {p.presences}/{p.trainings} ({pct}%)
                              </span>
                            ) : <span style={{ color: "#cccccc" }}>—</span>}
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
      style={{ backgroundColor: "#ffffff", border: "1px solid rgba(0,0,0,0.08)" }}>
      <p className="text-sm font-semibold mb-3" style={{ color: "#888888" }}>{icon} {title}</p>
      <p className="text-xs" style={{ color: "#aaaaaa" }}>Aucune donnée</p>
    </div>
  )

  return (
    <div className="p-5 rounded-2xl"
      style={{ backgroundColor: "#ffffff", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      <p className="text-sm font-semibold mb-4" style={{ color: "#666666" }}>{icon} {title}</p>
      <div className="flex flex-col gap-2.5">
        {players.map((p, i) => {
          const value = stat === "presence" && totalTrainings
            ? `${Math.round((p.presences / p.trainings) * 100)}%`
            : p[stat]
          const medal = ["🥇","🥈","🥉"][i]
          return (
            <div key={p.id} className="flex items-center gap-3">
              <span className="text-sm">{medal}</span>
              <p className="flex-1 text-sm font-semibold truncate" style={{ color: "#111111" }}>
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
