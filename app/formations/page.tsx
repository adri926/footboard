import Link from "next/link"
import { FORMATIONS } from "@/lib/formations"

function MiniPitch({ players, label }: { players: Array<{x: number; y: number; name: string}>; label: string }) {
  return (
    <svg viewBox="0 0 60 90" className="w-full h-full">
      <rect width="60" height="90" fill="#07100a"/>
      <rect x="2" y="2" width="56" height="86" fill="#0d1f0e" rx="1"/>
      <rect x="2" y="2" width="56" height="86" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" rx="1"/>
      <line x1="2" y1="45" x2="58" y2="45" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
      <circle cx="30" cy="45" r="7" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"/>
      <rect x="16" y="2" width="28" height="12" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"/>
      <rect x="16" y="76" width="28" height="12" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"/>
      {players.map((p, i) => (
        <g key={i}>
          <circle cx={p.x * 0.6} cy={p.y * 0.9} r="3.5" fill="#e81010"/>
          <text x={p.x * 0.6} y={p.y * 0.9 + 1.2} textAnchor="middle" fontSize="2.4" fill="white" fontWeight="bold">
            {p.name.slice(0, 2)}
          </text>
        </g>
      ))}
      <text x="30" y="87" textAnchor="middle" fontSize="4" fill="rgba(255,255,255,0.5)" fontWeight="bold">{label}</text>
    </svg>
  )
}

export default function FormationsPage() {
  return (
    <main className="min-h-[calc(100vh-56px)] text-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <Link href="/" className="text-xs text-white/30 hover:text-white/60 transition mb-2 inline-block">← Accueil</Link>
        <h1 className="text-3xl font-black mb-2">Formations</h1>
        <p className="mb-10" style={{ color: "rgba(255,255,255,0.4)" }}>
          {FORMATIONS.length} systèmes de jeu — clique pour l'essayer sur le terrain
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {FORMATIONS.map(f => (
            <Link
              key={f.id}
              href={`/tactique/animations`}
              className="group flex flex-col rounded-2xl overflow-hidden transition hover:scale-[1.02]"
              style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {/* Mini terrain */}
              <div className="aspect-[2/3] w-full">
                <MiniPitch players={f.players} label={f.label} />
              </div>

              {/* Info */}
              <div className="px-3 py-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <p className="text-white font-black text-base">{f.label}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{f.description}</p>
                <p className="text-xs mt-2 opacity-0 group-hover:opacity-100 transition" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Essayer →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
