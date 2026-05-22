import Link from "next/link"

export default function TacticsPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link href="/" className="text-gray-400 hover:text-white text-sm mb-8 inline-block">
          ← Retour
        </Link>
        <h1 className="text-4xl font-bold mb-2">Tactiques</h1>
        <p className="text-gray-400 mb-10">Crée et sauvegarde tes tactiques</p>

        <div className="bg-gray-900 rounded-xl p-8 text-center">
          <p className="text-gray-500 mb-4">Aucune tactique sauvegardée</p>
          <Link
            href="/formations"
            className="inline-block bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg transition"
          >
            Créer une tactique
          </Link>
        </div>
      </div>
    </main>
  )
}
