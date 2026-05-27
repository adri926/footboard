import Link from "next/link"
import HeroPitch from "@/components/HeroPitch"

const FEATURES = [
  {
    href: "/tactique/animations",
    tag: "TERRAIN TACTIQUE",
    title: "Terrain de nuit",
    desc: "Construis tes systèmes de jeu, anime les schémas tactiques, simule des situations de match.",
    status: "live",
    cta: "OUVRIR →",
  },
  {
    href: "/club",
    tag: "MON CLUB",
    title: "Gestion de club",
    desc: "Gérez l'effectif, planifiez les entraînements, préparez les matchs, suivez les statistiques.",
    status: "live",
    cta: "OUVRIR →",
  },
  {
    href: "/tactique/concepts",
    tag: "CONCEPTS",
    title: "Tactiques modernes",
    desc: "Articles et schémas pour maîtriser le pressing, les transitions et les systèmes modernes.",
    status: "soon",
    cta: null,
  },
]

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-56px)]" style={{ background: "#181812", color: "rgba(255,255,255,0.92)" }}>
      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* ── HERO ── */}
        <div className="mb-20 flex flex-col lg:flex-row items-center gap-10 lg:gap-20">

          {/* Texte */}
          <div className="flex-1">
            {/* Surtitre */}
            <p style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 10, fontWeight: 700,
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: "#7A9A82", marginBottom: 16,
            }}>
              FOOTBOARD · IDENTITÉ V2
            </p>

            {/* Titre principal */}
            <h1 style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontWeight: 900, fontSize: "clamp(52px, 8vw, 80px)",
              lineHeight: 0.92, letterSpacing: "-0.01em",
              color: "rgba(255,255,255,0.95)",
              marginBottom: 20,
            }}>
              NOIR CHAUD<br />
              <span style={{ color: "#7A9A82" }}>+ VERT SAUGE</span>
            </h1>

            <p style={{
              fontFamily: "var(--font-body), sans-serif",
              fontWeight: 300, fontSize: 18, lineHeight: 1.5,
              color: "rgba(255,255,255,0.45)", maxWidth: 420, marginBottom: 32,
            }}>
              La plateforme tactique pour les coaches — du club amateur au club professionnel.
            </p>

            <div className="flex gap-3 flex-wrap">
              <Link href="/club"
                className="transition hover:opacity-85"
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontWeight: 700, fontSize: 11, letterSpacing: "0.1em",
                  backgroundColor: "#7A9A82", color: "#181812",
                  padding: "12px 24px", borderRadius: 10,
                  display: "inline-block",
                }}>
                MON CLUB →
              </Link>
              <Link href="/tactique/animations"
                className="transition hover:opacity-70"
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontWeight: 700, fontSize: 11, letterSpacing: "0.1em",
                  border: "1px solid rgba(122,154,130,0.35)",
                  color: "rgba(122,154,130,0.75)",
                  padding: "12px 24px", borderRadius: 10,
                  display: "inline-block",
                }}>
                TERRAIN TACTIQUE
              </Link>
            </div>
          </div>

          {/* Prévisualisation terrain */}
          <div className="shrink-0 w-full max-w-[300px] lg:max-w-none lg:w-[220px] mx-auto lg:mx-0">
            <div className="h-[300px] lg:h-auto overflow-hidden rounded-2xl"
              style={{ boxShadow: "0 0 60px rgba(122,154,130,0.08), 0 0 0 1px rgba(122,154,130,0.15)" }}>
              <HeroPitch />
            </div>
          </div>

        </div>

        {/* ── CARTES FONCTIONNALITÉS ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {FEATURES.map(({ href, tag, title, desc, status, cta }) => (
            <div key={href}
              className="flex flex-col gap-4 p-5 rounded-2xl transition"
              style={{
                backgroundColor: status === "live" ? "#1f1f19" : "rgba(122,154,130,0.03)",
                border: status === "live"
                  ? "1px solid rgba(122,154,130,0.18)"
                  : "1px solid rgba(122,154,130,0.07)",
              }}>

              {/* Tag */}
              <div className="flex items-center justify-between">
                <span style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 9, fontWeight: 700, letterSpacing: "0.12em",
                  color: status === "live" ? "#7A9A82" : "rgba(122,154,130,0.3)",
                }}>
                  {tag}
                </span>
                {status === "soon" && (
                  <span style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 9, letterSpacing: "0.08em",
                    backgroundColor: "rgba(122,154,130,0.08)",
                    border: "1px solid rgba(122,154,130,0.15)",
                    color: "rgba(122,154,130,0.4)",
                    padding: "2px 8px", borderRadius: 100,
                  }}>
                    BIENTÔT
                  </span>
                )}
              </div>

              {/* Titre */}
              <div className="flex-1">
                <p style={{
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  fontWeight: 700, fontSize: 20, letterSpacing: "0.01em",
                  color: status === "live" ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.25)",
                  marginBottom: 8,
                }}>
                  {title}
                </p>
                <p style={{
                  fontFamily: "var(--font-body), sans-serif",
                  fontWeight: 300, fontSize: 13, lineHeight: 1.5,
                  color: status === "live" ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.18)",
                }}>
                  {desc}
                </p>
              </div>

              {/* CTA */}
              {cta && (
                <Link href={href}
                  className="transition hover:opacity-70"
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontWeight: 700, fontSize: 10, letterSpacing: "0.1em",
                    color: "#7A9A82",
                  }}>
                  {cta}
                </Link>
              )}
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}
