import type { Metadata } from "next"
import Link from "next/link"
import { FAQ } from "@/lib/faq"
import FaqAccordion from "@/components/blog/FaqAccordion"

export const metadata: Metadata = {
  title: "Blog & FAQ — Footboard",
  description: "Questions fréquentes, mises à jour et guides pour les coachs qui utilisent Footboard.",
}

const CHANGELOG = [
  {
    date: "Juin 2026",
    items: [
      "Partage de tactiques via lien public (Digiboard)",
      "Panneau \"Mes Boards\" pour retrouver les paperboards sauvegardés",
      "Validation temps réel dans le formulaire joueur",
      "Pagination sur les listes de matchs et d'entraînements",
      "Suppression de modèles de séance depuis la modale Planifier",
    ],
  },
  {
    date: "Mai 2026",
    items: [
      "Module Analyse vidéo IA (Gemini 2.5 Flash)",
      "Timeline d'événements horodatée après analyse",
      "Auto-refresh pendant le traitement vidéo",
      "Limite de 500 Mo + feedback d'upload en temps réel",
      "Retour arrière cohérent depuis Analyse vidéo",
    ],
  },
  {
    date: "Avril 2026",
    items: [
      "Digiboard — outil de dessin complet (flèche, courbe, zone, texte, gomme)",
      "Undo / Redo sur les tracés",
      "Sauvegarde et rechargement des paperboards",
      "16 formations jouables (équipes A & B)",
    ],
  },
]

export default function BlogPage() {
  const totalQuestions = FAQ.reduce((n, cat) => n + cat.items.length, 0)

  return (
    <main style={{ background: "var(--bg)", minHeight: "calc(100vh - 56px)" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "56px 24px 96px" }}>

        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <p style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10, letterSpacing: "0.14em",
            color: "var(--sauge)", marginBottom: 12,
          }}>
            FOOTBOARD · RESSOURCES
          </p>
          <h1 style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontWeight: 900, fontSize: 52, lineHeight: 1, letterSpacing: "-0.01em",
            color: "var(--text-primary)", marginBottom: 16,
          }}>
            BLOG & FAQ
          </h1>
          <p style={{
            fontFamily: "var(--font-body), sans-serif",
            fontSize: 15, color: "var(--text-muted)", lineHeight: 1.6,
            maxWidth: 480,
          }}>
            Tout ce que tu dois savoir pour utiliser Footboard. {totalQuestions} questions,
            des mises à jour régulières, et des guides à venir.
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", gap: 0, marginBottom: 48,
          borderBottom: "1px solid rgba(122,154,130,0.12)",
        }}>
          {[
            { label: "FAQ", count: totalQuestions },
            { label: "MISES À JOUR", count: null },
          ].map(({ label, count }, i) => (
            <div key={label} style={{
              padding: "10px 20px",
              borderBottom: i === 0 ? "2px solid #7A9A82" : "2px solid transparent",
              marginBottom: -1,
            }}>
              <span style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
                color: i === 0 ? "#7A9A82" : "rgba(255,255,255,0.3)",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                {label}
                {count !== null && (
                  <span style={{
                    fontSize: 8, padding: "1px 6px", borderRadius: 100,
                    backgroundColor: "rgba(122,154,130,0.12)",
                    border: "1px solid rgba(122,154,130,0.2)",
                    color: "var(--sauge)",
                  }}>
                    {count}
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <section id="faq" style={{ marginBottom: 80 }}>
          <FaqAccordion categories={FAQ} />
        </section>

        {/* Changelog */}
        <section id="changelog">
          <p style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
            color: "var(--text-faint)", marginBottom: 32,
          }}>
            MISES À JOUR
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {CHANGELOG.map(entry => (
              <div key={entry.date} style={{ display: "flex", gap: 24 }}>
                <div style={{ width: 80, flexShrink: 0, paddingTop: 2 }}>
                  <p style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
                    color: "var(--sauge)",
                  }}>
                    {entry.date.toUpperCase()}
                  </p>
                </div>
                <div style={{
                  flex: 1,
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid rgba(122,154,130,0.08)",
                  borderRadius: 10, padding: "16px 20px",
                  display: "flex", flexDirection: "column", gap: 8,
                }}>
                  {entry.items.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
                      <span style={{ color: "rgba(122,154,130,0.4)", fontSize: 10, flexShrink: 0 }}>—</span>
                      <p style={{
                        fontFamily: "var(--font-body), sans-serif",
                        fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.5,
                      }}>
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA bas de page */}
        <div style={{
          marginTop: 72, padding: "32px 28px", borderRadius: 16,
          backgroundColor: "var(--bg-card)",
          border: "1px solid rgba(122,154,130,0.15)",
          textAlign: "center",
        }}>
          <p style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontWeight: 900, fontSize: 22, letterSpacing: "0.02em",
            color: "rgba(255,255,255,0.92)", marginBottom: 8,
          }}>
            Une question qui n&apos;est pas dans la FAQ ?
          </p>
          <p style={{
            fontFamily: "var(--font-body), sans-serif",
            fontSize: 13, color: "var(--text-muted)", marginBottom: 20,
          }}>
            Envoie-nous un message — on répond sous 24h et on enrichit la FAQ avec ta question.
          </p>
          <Link href="mailto:adrisim926@gmail.com" style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
            padding: "11px 24px", borderRadius: 10,
            backgroundColor: "rgba(122,154,130,0.12)",
            border: "1px solid rgba(122,154,130,0.30)",
            color: "#7A9A82",
            textDecoration: "none", display: "inline-block",
          }}>
            NOUS CONTACTER →
          </Link>
        </div>

      </div>
    </main>
  )
}
