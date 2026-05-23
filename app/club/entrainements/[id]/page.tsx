import Link from "next/link"
import { notFound } from "next/navigation"
import { getTrainingWithAttendance } from "../actions"
import PresenceClient from "./PresenceClient"

export default async function TrainingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getTrainingWithAttendance(id)
  if (!data?.training) notFound()

  const { training, players, attendance } = data
  const date = new Date(training.date)

  return (
    <main className="min-h-[calc(100vh-56px)] text-white">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link href="/club/entrainements" className="text-xs text-white/30 hover:text-white/60 transition mb-4 inline-block">
          ← Entraînements
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black">{training.theme ?? "Entraînement"}</h1>
          <div className="flex gap-4 mt-2 text-sm text-gray-400">
            <span>📅 {date.toLocaleDateString("fr-FR", { weekday:"long", day:"2-digit", month:"long" })} à {date.toLocaleTimeString("fr-FR", { hour:"2-digit", minute:"2-digit" })}</span>
            {training.location && <span>📍 {training.location}</span>}
          </div>
          {training.notes && (
            <p className="mt-3 text-sm text-gray-300 p-3 rounded-xl"
              style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              {training.notes}
            </p>
          )}
        </div>

        {/* Feuille de présence */}
        <PresenceClient trainingId={id} players={players} attendance={attendance} />
      </div>
    </main>
  )
}
