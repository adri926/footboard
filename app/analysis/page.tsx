import Link from "next/link"

export default function AnalysisPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link href="/" className="text-gray-400 hover:text-white text-sm mb-8 inline-block">
          ← Retour
        </Link>
        <h1 className="text-4xl font-bold mb-2">Analyse</h1>
        <p className="text-gray-400 mb-10">Compare des systèmes de jeu</p>

        <div className="bg-gray-900 rounded-xl p-8 text-center">
          <p className="text-gray-500">Sélectionne deux formations pour les comparer</p>
        </div>
      </div>
    </main>
  )
}
