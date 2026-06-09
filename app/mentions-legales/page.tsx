import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: false, follow: false },
}

export default function MentionsLegales() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "64px 32px", color: "rgba(255,255,255,0.75)" }}>
      <h1 style={{ fontFamily: "var(--font-display), system-ui, sans-serif", fontWeight: 900, fontSize: 28, marginBottom: 8, color: "rgba(255,255,255,0.95)" }}>
        Mentions légales
      </h1>
      <p style={{ fontFamily: "var(--font-mono), monospace", fontSize: 10, color: "rgba(122,154,130,0.5)", marginBottom: 40 }}>
        Dernière mise à jour : juin 2026
      </p>

      {[
        {
          title: "Éditeur du site",
          content: `Footboard est édité par Adrien Siméon, Paris, France.\nEmail : contact@footboard.fr\nSIRET : [À COMPLÉTER AU LANCEMENT]`,
        },
        {
          title: "Hébergement",
          content: `Le site est hébergé par Vercel Inc., 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis.\nLes données sont stockées sur Supabase (infrastructure AWS).`,
        },
        {
          title: "Directeur de la publication",
          content: `Adrien Siméon`,
        },
        {
          title: "Propriété intellectuelle",
          content: `L'ensemble des contenus présents sur Footboard (textes, graphiques, logo, interface) sont protégés par le droit d'auteur. Toute reproduction sans autorisation est interdite.`,
        },
        {
          title: "Cookies",
          content: `Ce site utilise des cookies strictement nécessaires au fonctionnement de l'authentification (Clerk). Aucun cookie publicitaire ou de suivi tiers n'est utilisé.`,
        },
      ].map(({ title, content }) => (
        <section key={title} style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "var(--font-mono), monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(122,154,130,0.7)", textTransform: "uppercase", marginBottom: 10 }}>
            {title}
          </h2>
          <p style={{ fontFamily: "var(--font-body), sans-serif", fontWeight: 400, fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-line" }}>
            {content}
          </p>
        </section>
      ))}
    </main>
  )
}
