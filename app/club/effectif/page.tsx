import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"

const MOCK_PLAYERS = [
  { id:"1", first_name:"Lucas",   last_name:"Martin",   position:"GK",  number:1,  status:"available" },
  { id:"2", first_name:"Thomas",  last_name:"Dubois",   position:"DEF", number:2,  status:"available" },
  { id:"3", first_name:"Antoine", last_name:"Bernard",  position:"DEF", number:5,  status:"injured"   },
  { id:"4", first_name:"Hugo",    last_name:"Leroy",    position:"DEF", number:4,  status:"available" },
  { id:"5", first_name:"Kevin",   last_name:"Petit",    position:"DEF", number:3,  status:"available" },
  { id:"6", first_name:"Maxime",  last_name:"Robert",   position:"MIL", number:6,  status:"available" },
  { id:"7", first_name:"Nathan",  last_name:"Simon",    position:"MIL", number:8,  status:"suspended" },
  { id:"8", first_name:"Axel",    last_name:"Laurent",  position:"MIL", number:10, status:"available" },
  { id:"9", first_name:"Romain",  last_name:"Michel",   position:"MIL", number:7,  status:"available" },
  { id:"10",first_name:"Julien",  last_name:"Garcia",   position:"ATT", number:9,  status:"available" },
  { id:"11",first_name:"Baptiste",last_name:"Thomas",   position:"ATT", number:11, status:"available" },
]

const STATUS_STYLES = {
  available:  { label: "Disponible",  color: "#4ade80", bg: "rgba(74,222,128,0.15)" },
  injured:    { label: "Blessé",      color: "#f87171", bg: "rgba(248,113,113,0.15)" },
  suspended:  { label: "Suspendu",    color: "#fbbf24", bg: "rgba(251,191,36,0.15)" },
}

const POS_COLORS = {
  GK: { color: "#c084fc", bg: "rgba(192,132,252,0.2)" },
  DEF:{ color: "#4ade80", bg: "rgba(74,222,128,0.2)"  },
  MIL:{ color: "#60a5fa", bg: "rgba(96,165,250,0.2)"  },
  ATT:{ color: "#f87171", bg: "rgba(248,113,113,0.2)" },
}

export default async function EffectifPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const available  = MOCK_PLAYERS.filter(p => p.status === "available").length
  const injured    = MOCK_PLAYERS.filter(p => p.status === "injured").length
  const suspended  = MOCK_PLAYERS.filter(p => p.status === "suspended").length

  return (
    <main className="min-h-[calc(100vh-56px)] text-white">
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <Link href="/club" className="text-xs text-white/30 hover:text-white/60 transition mb-2 inline-block">← Mon Club</Link>
            <h1 className="text-3xl font-black">Effectif</h1>
          </div>
          <button className="px-4 py-2 rounded-xl text-sm font-bold text-black hover:opacity-90 transition mt-4"
            style={{ backgroundColor: "white" }}>
            + Ajouter un joueur
          </button>
        </div>

        {/* Résumé */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "Disponibles", value: available, color: "#4ade80" },
            { label: "Blessés",     value: injured,   color: "#f87171" },
            { label: "Suspendus",   value: suspended, color: "#fbbf24" },
          ].map(({ label, value, color }) => (
            <div key={label} className="p-4 rounded-xl text-center"
              style={{ backgroundColor:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-2xl font-black" style={{ color }}>{value}</p>
              <p className="text-xs mt-1" style={{ color:"rgba(255,255,255,0.4)" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Liste joueurs */}
        <div className="rounded-2xl overflow-hidden" style={{ border:"1px solid rgba(255,255,255,0.08)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor:"rgba(255,255,255,0.04)", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
                {["#","Joueur","Poste","Statut",""].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold"
                    style={{ color:"rgba(255,255,255,0.4)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_PLAYERS.map((p, i) => {
                const s = STATUS_STYLES[p.status as keyof typeof STATUS_STYLES]
                const pos = POS_COLORS[p.position as keyof typeof POS_COLORS]
                return (
                  <tr key={p.id} style={{ borderBottom:"1px solid rgba(255,255,255,0.05)", backgroundColor: i%2===0?"transparent":"rgba(255,255,255,0.02)" }}>
                    <td className="px-4 py-3 text-xs" style={{ color:"rgba(255,255,255,0.3)" }}>{p.number}</td>
                    <td className="px-4 py-3 font-semibold text-white">{p.first_name} {p.last_name}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded"
                        style={{ backgroundColor: pos.bg, color: pos.color }}>{p.position}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: s.bg, color: s.color }}>{s.label}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-xs px-2 py-1 rounded-lg transition hover:bg-white/10"
                        style={{ color:"rgba(255,255,255,0.3)" }}>
                        ···
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
