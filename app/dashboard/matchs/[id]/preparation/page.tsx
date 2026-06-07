import { notFound } from "next/navigation"
import { getMatchById, getLineup } from "@/app/dashboard/matchs/actions"
import { getPlayers } from "@/app/dashboard/effectif/actions"
import PreparationClient from "./PreparationClient"

export default async function MatchPreparationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [match, players, lineup] = await Promise.all([
    getMatchById(id),
    getPlayers(),
    getLineup(id),
  ])
  if (!match) notFound()

  return (
    <PreparationClient
      match={match}
      players={players}
      initialStarters={lineup.starters}
      initialSubstitutes={lineup.substitutes}
    />
  )
}
