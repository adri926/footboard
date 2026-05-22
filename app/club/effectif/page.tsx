import Link from "next/link"
import { getPlayers } from "./actions"
import EffectifClient from "./EffectifClient"

export default async function EffectifPage() {
  const players = await getPlayers()

  return (
    <main className="min-h-[calc(100vh-56px)] text-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <Link href="/club" className="text-xs text-white/30 hover:text-white/60 transition mb-2 inline-block">← Mon Club</Link>
          <h1 className="text-3xl font-black">Effectif</h1>
        </div>
        <EffectifClient players={players} />
      </div>
    </main>
  )
}
