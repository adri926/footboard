import Link from "next/link"
import { getMatches } from "./actions"
import MatchsClient from "./MatchsClient"

export default async function MatchsPage() {
  const matches = await getMatches()
  return (
    <main className="min-h-[calc(100vh-56px)] text-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <Link href="/club" className="text-xs text-white/30 hover:text-white/60 transition mb-2 inline-block">← Mon Club</Link>
          <h1 className="text-3xl font-black">Matchs</h1>
        </div>
        <MatchsClient matches={matches} />
      </div>
    </main>
  )
}
