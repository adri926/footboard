import Link from "next/link"
import HeroPitch from "@/components/HeroPitch"

/* ── DONNÉES ────────────────────────────────────────────── */

const STATS = [
  { value: "50+", label: "Animations tactiques" },
  { value: "16",  label: "Formations disponibles" },
  { value: "∞",   label: "Possibilités tactiques" },
]

const SECONDARY_FEATURES = [
  { icon: "⬡", title: "16 formations",        desc: "Du 4-3-3 au 3-4-3, toutes les formations modernes disponibles." },
  { icon: "✉",  title: "Convocations email",   desc: "Envoie les convocations en un clic, les joueurs reçoivent tout automatiquement." },
  { icon: "✓",  title: "Suivi des présences",  desc: "Feuilles d'émargement numériques pour chaque entraînement et chaque match." },
  { icon: "▲",  title: "Stats par joueur",     desc: "Buts, passes, présences — un tableau de bord clair pour chaque membre." },
]

const TESTIMONIALS = [
  {
    quote: "Footboard a changé ma façon de préparer les matchs. J'arrive avec des schémas clairs, les joueurs comprennent directement.",
    name: "Marc D.",
    role: "Entraîneur U17 — Régional 2",
  },
  {
    quote: "La gestion de l'effectif et des convocations me fait gagner un temps fou chaque semaine. Plus de tableurs Excel.",
    name: "Sophie L.",
    role: "Dirigeante de club — Division Honneur",
  },
  {
    quote: "Les animations tactiques sont exactement ce qu'il me fallait pour expliquer le pressing à mes joueurs. Simple et efficace.",
    name: "Karim B.",
    role: "Coach principal — Club amateur Paris",
  },
]

/* ── COMPOSANTS VISUELS ─────────────────────────────────── */

function ClubMockup() {
  const players = [
    { name: "Dupont L.", pos: "GK",  present: true  },
    { name: "Martin R.", pos: "DEF", present: true  },
    { name: "Bernard T.",pos: "DEF", present: false },
    { name: "Leroy A.",  pos: "MIL", present: true  },
    { name: "Moreau J.", pos: "ATT", present: true  },
  ]
  return (
    <div className="rounded-2xl overflow-hidden select-none" style={{
      backgroundColor: "#1f1f19",
      border: "1px solid rgba(122,154,130,0.18)",
      boxShadow: "0 0 60px rgba(122,154,130,0.06), 0 0 0 1px rgba(122,154,130,0.1)",
    }}>
      {/* Header mockup */}
      <div className="flex items-center justify-between px-5 py-3" style={{
        borderBottom: "1px solid rgba(122,154,130,0.1)",
        backgroundColor: "#181812",
      }}>
        <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#7A9A82" }}>
          MON CLUB — EFFECTIF
        </span>
        <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 9, color: "rgba(255,255,255,0.25)" }}>
          18 JOUEURS
        </span>
      </div>
      {/* Stat bar */}
      <div className="grid grid-cols-3 gap-px mx-4 my-4" style={{ backgroundColor: "rgba(122,154,130,0.08)", borderRadius: 8, overflow: "hidden" }}>
        {[{ v: "12", l: "Matchs" }, { v: "68%", l: "Victoires" }, { v: "4.2", l: "Buts/match" }].map(({ v, l }) => (
          <div key={l} className="flex flex-col items-center py-3" style={{ backgroundColor: "#1f1f19" }}>
            <span style={{ fontFamily: "var(--font-display), system-ui, sans-serif", fontWeight: 900, fontSize: 20, color: "#7A9A82" }}>{v}</span>
            <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", marginTop: 2 }}>{l.toUpperCase()}</span>
          </div>
        ))}
      </div>
      {/* Player list */}
      <div className="px-4 pb-4 flex flex-col gap-1.5">
        {players.map(({ name, pos, present }) => (
          <div key={name} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{
            backgroundColor: "rgba(122,154,130,0.04)",
            border: "1px solid rgba(122,154,130,0.07)",
          }}>
            <div className="flex items-center gap-2.5">
              <span style={{
                fontFamily: "var(--font-mono), monospace", fontSize: 8, fontWeight: 700,
                color: "#7A9A82", letterSpacing: "0.08em",
                backgroundColor: "rgba(122,154,130,0.1)", padding: "2px 6px", borderRadius: 4,
              }}>{pos}</span>
              <span style={{ fontFamily: "var(--font-body), sans-serif", fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{name}</span>
            </div>
            <span style={{
              width: 7, height: 7, borderRadius: "50%", display: "block",
              backgroundColor: present ? "#7A9A82" : "rgba(255,255,255,0.15)",
              boxShadow: present ? "0 0 6px rgba(122,154,130,0.6)" : "none",
            }} />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── PAGE ───────────────────────────────────────────────── */

export default function Home() {
  return (
    <main style={{ background: "#181812", color: "rgba(255,255,255,0.92)" }}>
      <div className="max-w-4xl mx-auto px-6">

        {/* ── 1. HERO ── */}
        <div className="pt-16 pb-20 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

          <div className="flex-1 min-w-0">
            <p style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
              color: "#7A9A82", marginBottom: 16,
            }}>
              FOOTBOARD · PLATEFORME TACTIQUE
            </p>
            <h1 style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontWeight: 900, fontSize: "clamp(52px, 8vw, 80px)",
              lineHeight: 0.92, letterSpacing: "-0.01em",
              color: "rgba(255,255,255,0.95)", marginBottom: 20,
            }}>
              LA PLATEFORME<br />
              <span style={{ color: "#7A9A82" }}>TACTIQUE</span>
            </h1>
            <p style={{
              fontFamily: "var(--font-body), sans-serif",
              fontWeight: 300, fontSize: 18, lineHeight: 1.5,
              color: "rgba(255,255,255,0.45)", maxWidth: 420, marginBottom: 32,
            }}>
              La plateforme tactique pour les coaches — du club amateur au club professionnel.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link href="/club" className="transition hover:opacity-85" style={{
                fontFamily: "var(--font-mono), monospace",
                fontWeight: 700, fontSize: 11, letterSpacing: "0.1em",
                backgroundColor: "#7A9A82", color: "#181812",
                padding: "12px 24px", borderRadius: 10, display: "inline-block",
              }}>
                MON CLUB →
              </Link>
              <Link href="/tactique/animations" className="transition hover:opacity-70" style={{
                fontFamily: "var(--font-mono), monospace",
                fontWeight: 700, fontSize: 11, letterSpacing: "0.1em",
                border: "1px solid rgba(122,154,130,0.35)",
                color: "rgba(122,154,130,0.75)",
                padding: "12px 24px", borderRadius: 10, display: "inline-block",
              }}>
                TERRAIN TACTIQUE
              </Link>
            </div>
          </div>

          <div className="shrink-0 w-full max-w-[320px] lg:max-w-none lg:w-[45%] mx-auto lg:mx-0">
            <div className="overflow-hidden rounded-2xl" style={{
              boxShadow: "0 0 60px rgba(122,154,130,0.08), 0 0 0 1px rgba(122,154,130,0.15)",
            }}>
              <HeroPitch />
            </div>
          </div>
        </div>

        {/* ── 2. CHIFFRES CLÉS ── */}
        <div className="mb-24 grid grid-cols-3 gap-px rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(122,154,130,0.12)", backgroundColor: "rgba(122,154,130,0.12)" }}>
          {STATS.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center justify-center py-8 px-4 text-center"
              style={{ backgroundColor: "#1f1f19" }}>
              <span style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontWeight: 900, fontSize: "clamp(36px, 6vw, 56px)",
                lineHeight: 1, color: "#7A9A82", letterSpacing: "-0.02em",
              }}>
                {value}
              </span>
              <span style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.3)", marginTop: 8, textTransform: "uppercase",
              }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* ── 3. FEATURE SHOWCASE — Terrain (texte gauche, visuel droite) ── */}
        <div className="mb-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 min-w-0">
            <p style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
              color: "#7A9A82", marginBottom: 14,
            }}>
              TERRAIN TACTIQUE
            </p>
            <h2 style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontWeight: 900, fontSize: "clamp(32px, 5vw, 52px)",
              lineHeight: 0.95, color: "rgba(255,255,255,0.95)", marginBottom: 16,
            }}>
              CONSTRUIS TES<br />
              <span style={{ color: "#7A9A82" }}>SYSTÈMES.</span><br />
              ANIME LES<br />SITUATIONS.
            </h2>
            <p style={{
              fontFamily: "var(--font-body), sans-serif",
              fontWeight: 300, fontSize: 16, lineHeight: 1.6,
              color: "rgba(255,255,255,0.45)", maxWidth: 380, marginBottom: 28,
            }}>
              Terrain interactif plein écran, 16 formations, 50+ animations tactiques,
              situations DTN en 4 phases. Explique tes idées visuellement.
            </p>
            <Link href="/tactique/animations" className="transition hover:opacity-70" style={{
              fontFamily: "var(--font-mono), monospace",
              fontWeight: 700, fontSize: 11, letterSpacing: "0.1em",
              border: "1px solid rgba(122,154,130,0.35)",
              color: "rgba(122,154,130,0.75)",
              padding: "12px 24px", borderRadius: 10, display: "inline-block",
            }}>
              OUVRIR LE TERRAIN →
            </Link>
          </div>
          <div className="shrink-0 w-full max-w-[300px] lg:max-w-none lg:w-[42%] mx-auto lg:mx-0">
            <div className="overflow-hidden rounded-2xl" style={{
              boxShadow: "0 0 60px rgba(122,154,130,0.08), 0 0 0 1px rgba(122,154,130,0.15)",
            }}>
              <HeroPitch />
            </div>
          </div>
        </div>

        {/* ── 4. FEATURE SHOWCASE — Club (visuel gauche, texte droite) ── */}
        <div className="mb-24 flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-16">
          <div className="flex-1 min-w-0">
            <p style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
              color: "#7A9A82", marginBottom: 14,
            }}>
              MON CLUB
            </p>
            <h2 style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontWeight: 900, fontSize: "clamp(32px, 5vw, 52px)",
              lineHeight: 0.95, color: "rgba(255,255,255,0.95)", marginBottom: 16,
            }}>
              TON CLUB.<br />
              <span style={{ color: "#7A9A82" }}>TON EFFECTIF.</span><br />
              TES STATS.
            </h2>
            <p style={{
              fontFamily: "var(--font-body), sans-serif",
              fontWeight: 300, fontSize: 16, lineHeight: 1.6,
              color: "rgba(255,255,255,0.45)", maxWidth: 380, marginBottom: 28,
            }}>
              Gérez l'effectif, planifiez les entraînements, préparez les compositions,
              suivez les statistiques. Tout au même endroit.
            </p>
            <Link href="/club" className="transition hover:opacity-85" style={{
              fontFamily: "var(--font-mono), monospace",
              fontWeight: 700, fontSize: 11, letterSpacing: "0.1em",
              backgroundColor: "#7A9A82", color: "#181812",
              padding: "12px 24px", borderRadius: 10, display: "inline-block",
            }}>
              ACCÉDER À MON CLUB →
            </Link>
          </div>
          <div className="shrink-0 w-full max-w-[340px] lg:max-w-none lg:w-[42%] mx-auto lg:mx-0">
            <ClubMockup />
          </div>
        </div>

        {/* ── 5. GRILLE FONCTIONNALITÉS ── */}
        <div className="mb-24">
          <p style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
            color: "#7A9A82", marginBottom: 12, textAlign: "center",
          }}>
            TOUT CE DONT TU AS BESOIN
          </p>
          <h2 style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontWeight: 900, fontSize: "clamp(28px, 4vw, 42px)",
            lineHeight: 0.95, color: "rgba(255,255,255,0.95)",
            marginBottom: 40, textAlign: "center",
          }}>
            UNE PLATEFORME,<br />
            <span style={{ color: "#7A9A82" }}>TOUTES LES FONCTIONS.</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SECONDARY_FEATURES.map(({ icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-5 rounded-2xl" style={{
                backgroundColor: "#1f1f19",
                border: "1px solid rgba(122,154,130,0.12)",
              }}>
                <span style={{
                  fontSize: 18, color: "#7A9A82", flexShrink: 0, marginTop: 2,
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                }}>
                  {icon}
                </span>
                <div>
                  <p style={{
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontWeight: 700, fontSize: 16,
                    color: "rgba(255,255,255,0.9)", marginBottom: 6,
                  }}>
                    {title}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-body), sans-serif",
                    fontWeight: 300, fontSize: 13, lineHeight: 1.5,
                    color: "rgba(255,255,255,0.4)",
                  }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 6. TÉMOIGNAGES ── */}
        <div className="mb-24">
          <p style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
            color: "#7A9A82", marginBottom: 12, textAlign: "center",
          }}>
            ILS UTILISENT FOOTBOARD
          </p>
          <h2 style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontWeight: 900, fontSize: "clamp(28px, 4vw, 42px)",
            lineHeight: 0.95, color: "rgba(255,255,255,0.95)",
            marginBottom: 40, textAlign: "center",
          }}>
            CE QUE DISENT<br />
            <span style={{ color: "#7A9A82" }}>LES COACHES.</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {TESTIMONIALS.map(({ quote, name, role }) => (
              <div key={name} className="flex flex-col gap-4 p-6 rounded-2xl" style={{
                backgroundColor: "#1f1f19",
                border: "1px solid rgba(122,154,130,0.12)",
              }}>
                <span style={{ color: "#7A9A82", fontSize: 24, lineHeight: 1, fontFamily: "Georgia, serif" }}>"</span>
                <p style={{
                  fontFamily: "var(--font-body), sans-serif",
                  fontWeight: 300, fontSize: 14, lineHeight: 1.65,
                  color: "rgba(255,255,255,0.55)", flex: 1,
                }}>
                  {quote}
                </p>
                <div style={{ borderTop: "1px solid rgba(122,154,130,0.1)", paddingTop: 16 }}>
                  <p style={{
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontWeight: 700, fontSize: 14,
                    color: "rgba(255,255,255,0.85)", marginBottom: 2,
                  }}>
                    {name}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 9, letterSpacing: "0.08em",
                    color: "rgba(122,154,130,0.6)",
                  }}>
                    {role.toUpperCase()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 7. CTA FINAL ── */}
        <div className="mb-20 rounded-2xl p-10 text-center" style={{
          backgroundColor: "#1f1f19",
          border: "1px solid rgba(122,154,130,0.18)",
          boxShadow: "0 0 80px rgba(122,154,130,0.04)",
        }}>
          <p style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
            color: "#7A9A82", marginBottom: 12,
          }}>
            COMMENCER MAINTENANT
          </p>
          <h2 style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontWeight: 900, fontSize: "clamp(32px, 5vw, 52px)",
            lineHeight: 0.95, color: "rgba(255,255,255,0.95)", marginBottom: 12,
          }}>
            PRÊT À PASSER AU<br />
            <span style={{ color: "#7A9A82" }}>NIVEAU SUPÉRIEUR ?</span>
          </h2>
          <p style={{
            fontFamily: "var(--font-body), sans-serif",
            fontWeight: 300, fontSize: 16, lineHeight: 1.5,
            color: "rgba(255,255,255,0.35)", marginBottom: 32,
          }}>
            Terrain tactique et gestion de club — tout est gratuit.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/club" className="transition hover:opacity-85" style={{
              fontFamily: "var(--font-mono), monospace",
              fontWeight: 700, fontSize: 11, letterSpacing: "0.1em",
              backgroundColor: "#7A9A82", color: "#181812",
              padding: "14px 28px", borderRadius: 10, display: "inline-block",
            }}>
              MON CLUB →
            </Link>
            <Link href="/tactique/animations" className="transition hover:opacity-70" style={{
              fontFamily: "var(--font-mono), monospace",
              fontWeight: 700, fontSize: 11, letterSpacing: "0.1em",
              border: "1px solid rgba(122,154,130,0.35)",
              color: "rgba(122,154,130,0.75)",
              padding: "14px 28px", borderRadius: 10, display: "inline-block",
            }}>
              TERRAIN TACTIQUE
            </Link>
          </div>
        </div>

      </div>
    </main>
  )
}
