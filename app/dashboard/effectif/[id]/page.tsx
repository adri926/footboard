import { notFound } from "next/navigation"
import { getPlayerById, getPlayerPhysicalStats } from "@/app/dashboard/effectif/actions"
import { getPlayerSeasonStats } from "@/app/dashboard/matchs/actions"
import { buildMedicalRecords } from "@/lib/medical"
import PlayerFicheClient from "./PlayerFicheClient"

export default async function PlayerFichePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [player, seasonStats, physical] = await Promise.all([
    getPlayerById(id),
    getPlayerSeasonStats(),
    getPlayerPhysicalStats(id),
  ])
  if (!player) notFound()

  const stats = seasonStats[player.id] ?? { matchesPlayed: 0, starts: 0, goals: 0, assists: 0, minutesPlayed: 0 }
  const [medical] = buildMedicalRecords([player])

  return <PlayerFicheClient player={player} stats={stats} medical={medical} physical={physical} />
}
