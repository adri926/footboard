import Link from "next/link"
import ConceptAnimation from "@/components/pitch/ConceptAnimation"
import { CONCEPTS } from "@/lib/concepts"

const TAG_COLORS: Record<string, string> = {
  Pressing:     "rgba(239,68,68,0.2)|#f87171",
  Transition:   "rgba(251,146,60,0.2)|#fb923c",
  Possession:   "rgba(59,130,246,0.2)|#60a5fa",
  Système:      "rgba(168,85,247,0.2)|#c084fc",
  Défense:      "rgba(34,197,94,0.2)|#4ade80",
  Construction: "rgba(45,212,191,0.2)|#2dd4bf",
  Attaque:      "rgba(244,63,94,0.2)|#fb7185",
}

export default function ConceptsPage() {
  return (
    <main className="min-h-[calc(100vh-56px)] text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/tactique" className="text-xs text-white/30 hover:text-white/60 transition mb-2 inline-block">← Tactique</Link>
        <h1 className="text-3xl font-black mb-2">Concepts</h1>
        <p className="mb-12" style={{ color: "rgba(255,255,255,0.4)" }}>
          Les principes fondamentaux du football moderne — théorie et illustration animée.
        </p>

        <div className="flex flex-col gap-10">
          {CONCEPTS.map(c => {
            const [bg, text] = (TAG_COLORS[c.tag] ?? "rgba(255,255,255,0.1)|white").split("|")
            return (
              <article key={c.id} id={c.id}
                className="rounded-2xl overflow-hidden scroll-mt-20"
                style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>

                {/* Header */}
                <div className="px-6 pt-6 pb-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl mt-0.5">{c.icon}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-xl font-black text-white">{c.title}</h2>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: bg, color: text }}>{c.tag}</span>
                      </div>
                      <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>{c.subtitle}</p>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 grid md:grid-cols-3 gap-6">
                  {/* Texte */}
                  <div className="md:col-span-2 flex flex-col gap-3">
                    {c.body.map((para, i) => (
                      <p key={i} className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>{para}</p>
                    ))}
                  </div>

                  {/* Animation */}
                  <div className="flex flex-col justify-center">
                    <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.2)" }}>Illustration animée</p>
                    <div className="rounded-xl p-2" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                      <ConceptAnimation frames={c.frames} />
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </main>
  )
}
