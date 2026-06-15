import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  robots: { index: false, follow: false },
}

export default function Confidentialite() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "64px 32px", color: "rgba(255,255,255,0.75)" }}>
      <h1 style={{ fontFamily: "var(--font-display), system-ui, sans-serif", fontWeight: 900, fontSize: 28, marginBottom: 8, color: "rgba(255,255,255,0.95)" }}>
        Politique de confidentialité
      </h1>
      <p style={{ fontFamily: "var(--font-mono), monospace", fontSize: 10, color: "rgba(122,154,130,0.5)", marginBottom: 40 }}>
        Dernière mise à jour : juin 2026
      </p>

      {[
        {
          title: "Responsable du traitement",
          content: `Adrien Siméon, contact@footboard.fr.\nEn utilisant Footboard, vous acceptez les pratiques décrites dans cette politique.`,
        },
        {
          title: "Données collectées",
          content: `• Données de compte : adresse email, prénom (via Clerk Auth)\n• Données de club : nom du club, niveau, ville\n• Données de joueurs : prénom, nom, numéro, poste, statut, email, notes médicales, statistiques\n• Données de matchs et d'entraînements : dates, adversaires, résultats, compositions\n• Vidéos de matchs : uploadées volontairement pour l'analyse vidéo IA`,
        },
        {
          title: "Finalité du traitement",
          content: `Ces données sont utilisées exclusivement pour le fonctionnement de l'application : gestion de club, envoi de convocations, préparation de matchs. Elles ne sont ni vendues, ni partagées avec des tiers à des fins commerciales.`,
        },
        {
          title: "Base légale",
          content: `Le traitement est fondé sur l'exécution du contrat (CGU) et, pour les données de joueurs, sur l'intérêt légitime du responsable de traitement dans le cadre de la gestion sportive.`,
        },
        {
          title: "Sous-traitants",
          content: `• Clerk (authentification) — clerkusercontent.com — GDPR compliant via SCCs\n• Supabase (base de données et stockage) — supabase.com — GDPR compliant\n• Resend (emails transactionnels) — resend.com — GDPR compliant\n• Vercel (hébergement) — vercel.com — GDPR compliant\n• Google Gemini API (analyse vidéo par IA) — google.com — vidéos transmises uniquement sur action volontaire du coach`,
        },
        {
          title: "Durée de conservation",
          content: `Les données sont conservées tant que le compte est actif. À la suppression du compte, toutes les données sont définitivement effacées sous 30 jours.`,
        },
        {
          title: "Vos droits (RGPD)",
          content: `Conformément au RGPD, vous disposez des droits suivants :\n• Accès à vos données\n• Rectification\n• Effacement (suppression de compte disponible dans Paramètres)\n• Portabilité\n• Opposition\n\nPour exercer ces droits : contact@footboard.fr`,
        },
        {
          title: "Cookies",
          content: `Footboard utilise uniquement des cookies de session nécessaires à l'authentification. Aucun cookie publicitaire ou analytics tiers n'est déposé.`,
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
