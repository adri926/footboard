import Link from "next/link"
export default function ComparaisonsPage() {
  return (
    <main className="min-h-[calc(100vh-56px)] text-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-5xl mb-6">📊</p>
        <h1 className="text-3xl font-bold mb-3">Comparaisons</h1>
        <p className="mb-8 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
          Compare deux systèmes côte à côte — zones de supériorité numérique, densité par couloir.
        </p>
        <Link href="/data" className="text-sm px-4 py-2 rounded-lg transition" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>← Données</Link>
      </div>
    </main>
  )
}
