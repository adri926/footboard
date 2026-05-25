import Link from "next/link"
import { notFound } from "next/navigation"
import { getMatchDetail, sendMatchConvocations } from "../actions"
import MatchDetailClient from "./MatchDetailClient"
import ConvocationButton from "@/components/ConvocationButton"

export default async function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getMatchDetail(id)
  if (!data?.match) notFound()

  const { match, players, stats } = data
  const date    = new Date(match.date)
  const played  = match.goals_for !== null && match.goals_against !== null
  const result  = !played ? null
    : (match.goals_for ?? 0) > (match.goals_against ?? 0) ? "V"
    : (match.goals_for ?? 0) < (match.goals_against ?? 0) ? "D" : "N"
  const rc = { V:"#4ade80", D:"#f87171", N:"#94a3b8" }

  return (
    <main className="min-h-[calc(100vh-56px)] text-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <Link href="/club/matchs" className="text-xs text-white/30 hover:text-white/60 transition mb-4 inline-block">
          ← Matchs
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl font-black">{match.opponent}</h1>
              {played && result && (
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-white">
                    {match.goals_for} – {match.goals_against}
                  </span>
                  <span className="w-8 h-8 rounded-full text-sm font-black flex items-center justify-center"
                    style={{ backgroundColor: rc[result]+"25", color: rc[result] }}>
                    {result}
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-3 text-sm text-gray-400 flex-wrap">
              <span>📅 {date.toLocaleDateString("fr-FR", { weekday:"long", day:"2-digit", month:"long" })}</span>
              <span>{match.home_away === "home" ? "🏠 Domicile" : "✈️ Extérieur"}</span>
              {match.competition && <span>🏆 {match.competition}</span>}
            </div>
          </div>
          {!played && (
            <ConvocationButton onSend={async () => await sendMatchConvocations(id)} />
          )}
        </div>

        <MatchDetailClient
          matchId={id}
          match={match}
          players={players}
          stats={stats}
          played={played}
        />
      </div>
    </main>
  )
}
