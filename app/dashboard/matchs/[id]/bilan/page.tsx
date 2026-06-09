import { notFound } from "next/navigation"
import { getMatchById, getLineup, getMatchStats } from "@/app/dashboard/matchs/actions"
import { getPlayers } from "@/app/dashboard/effectif/actions"
import BilanClient from "./BilanClient"

export default async function MatchBilanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [match, players, lineup, stats] = await Promise.all([
    getMatchById(id),
    getPlayers(),
    getLineup(id),
    getMatchStats(id),
  ])
  if (!match) notFound()

  return (
    <BilanClient
      match={match}
      players={players}
      lineup={lineup}
      initialStats={stats}
    />
  )
}
