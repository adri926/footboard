import { notFound } from "next/navigation"
import { getMatchById, getLineup, getMatchStats } from "@/app/dashboard/matchs/actions"
import { getPlayers } from "@/app/dashboard/effectif/actions"
import { getClubScope } from "@/lib/scope"
import { supabase } from "@/lib/supabase"
import BilanClient from "./BilanClient"

export default async function MatchBilanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const scope = await getClubScope()
  const [match, players, lineup, stats, linkedAnalysis] = await Promise.all([
    getMatchById(id),
    getPlayers(),
    getLineup(id),
    getMatchStats(id),
    supabase
      .from("video_analyses")
      .select("id")
      .eq(scope.column, scope.value)
      .eq("match_id", id)
      .eq("status", "ready")
      .maybeSingle()
      .then(r => r.data),
  ])
  if (!match) notFound()

  return (
    <BilanClient
      match={match}
      players={players}
      lineup={lineup}
      initialStats={stats}
      linkedAnalysisId={linkedAnalysis?.id ?? null}
    />
  )
}
