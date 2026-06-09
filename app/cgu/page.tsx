export const metadata = {
  title: "Conditions Générales d'Utilisation — Footboard",
}

const SECTIONS = [
  {
    title: "1. Objet",
    content: `Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme Footboard, accessible à l'adresse https://footboard.fr, éditée par Adrien Siméon (ci-après « l'Éditeur »).

En créant un compte et en accédant au service, l'utilisateur accepte sans réserve les présentes CGU. Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser le service.`,
  },
  {
    title: "2. Description du service",
    content: `Footboard est une application web de gestion de club de football destinée aux entraîneurs et dirigeants de clubs amateurs. Elle permet notamment :

• La gestion de l'effectif (joueurs, statuts, statistiques)
• La planification et le suivi des matchs et entraînements
• L'envoi de convocations par email aux joueurs
• La préparation tactique (compositions d'équipe, situations de jeu)
• La consultation d'un calendrier d'équipe

Certaines fonctionnalités peuvent évoluer ou être ajoutées sans préavis.`,
  },
  {
    title: "3. Accès au service",
    content: `L'accès au service est subordonné à la création d'un compte via le système d'authentification Clerk. L'utilisateur doit fournir une adresse email valide.

Chaque compte est strictement personnel et ne peut être partagé. L'utilisateur est responsable de la confidentialité de ses identifiants de connexion.

L'Éditeur se réserve le droit de suspendre ou supprimer un compte en cas de violation des présentes CGU.`,
  },
  {
    title: "4. Données personnelles et RGPD",
    content: `L'utilisation de Footboard implique le traitement de données personnelles :

• Données du coach : adresse email, prénom (collectés via Clerk)
• Données des joueurs : prénom, nom, numéro, poste, statut médical, email, statistiques

L'utilisateur (coach) agit en qualité de responsable de traitement pour les données de ses joueurs. Il s'engage à :
— Informer ses joueurs de l'utilisation de leurs données dans Footboard
— Ne pas saisir de données sans base légale (consentement ou intérêt légitime dans le cadre d'une activité sportive)
— Ne pas utiliser le service à des fins autres que la gestion sportive de son club

L'Éditeur agit en qualité de sous-traitant pour ces données et s'engage à les traiter uniquement selon les instructions de l'utilisateur.

Conformément au RGPD, chaque utilisateur peut exercer ses droits (accès, rectification, suppression, portabilité) via la page Paramètres de son compte ou en contactant contact@footboard.fr.`,
  },
  {
    title: "5. Données des joueurs — responsabilité de l'utilisateur",
    content: `L'utilisateur est seul responsable des données qu'il saisit concernant ses joueurs. Il garantit :

• Avoir obtenu les autorisations nécessaires pour saisir et traiter les données de joueurs mineurs (autorisation parentale si applicable)
• Ne pas saisir de données sensibles non nécessaires à la gestion sportive
• Informer ses joueurs de l'existence du service et de leur droit d'accès à leurs propres données

L'Éditeur ne pourra être tenu responsable d'un traitement de données effectué en violation de ces obligations par l'utilisateur.`,
  },
  {
    title: "6. Propriété intellectuelle",
    content: `L'ensemble des éléments constitutifs de Footboard (logo, interface, code, contenus) est protégé par le droit d'auteur et reste la propriété exclusive de l'Éditeur.

Les données saisies par l'utilisateur (joueurs, matchs, entraînements) lui appartiennent. L'Éditeur ne revendique aucun droit de propriété sur ces données.

L'utilisateur concède à l'Éditeur une licence non exclusive d'utilisation de ses données aux seules fins du fonctionnement technique du service.`,
  },
  {
    title: "7. Disponibilité et limitations",
    content: `L'Éditeur s'efforce d'assurer la disponibilité du service 24h/24, 7j/7, mais ne garantit pas une disponibilité sans interruption.

Le service est fourni « en l'état », sans garantie d'adéquation à un usage particulier. L'Éditeur ne saurait être tenu responsable de toute perte de données ou interruption de service indépendante de sa volonté.

L'Éditeur se réserve le droit de modifier, suspendre ou interrompre le service à tout moment, avec un préavis raisonnable sauf en cas d'urgence.`,
  },
  {
    title: "8. Tarification",
    content: `Les conditions tarifaires en vigueur sont consultables sur la page [URL TARIFS]. L'Éditeur se réserve le droit de modifier ses tarifs avec un préavis de 30 jours.

En cas de refus des nouvelles conditions tarifaires, l'utilisateur peut supprimer son compte depuis la page Paramètres.`,
  },
  {
    title: "9. Résiliation",
    content: `L'utilisateur peut supprimer son compte à tout moment depuis la page Paramètres. Cette suppression entraîne l'effacement de l'ensemble de ses données dans un délai de 30 jours.

L'Éditeur peut résilier l'accès au service en cas de violation des présentes CGU, après notification par email lorsque la situation le permet.`,
  },
  {
    title: "10. Loi applicable et juridiction",
    content: `Les présentes CGU sont régies par le droit français. En cas de litige, les parties s'efforceront de trouver une solution amiable avant tout recours judiciaire.

À défaut d'accord amiable, le litige sera soumis aux tribunaux compétents du ressort de [VILLE DU SIÈGE SOCIAL].`,
  },
  {
    title: "11. Modifications des CGU",
    content: `L'Éditeur se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés de toute modification substantielle par email ou par une notification dans l'application.

La poursuite de l'utilisation du service après notification vaut acceptation des nouvelles CGU.`,
  },
  {
    title: "12. Contact",
    content: `Pour toute question relative aux présentes CGU : contact@footboard.fr`,
  },
]

export default function CGUPage() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "64px 32px", color: "rgba(255,255,255,0.75)" }}>
      <h1 style={{
        fontFamily: "var(--font-display), system-ui, sans-serif",
        fontWeight: 900, fontSize: 28, marginBottom: 8, color: "rgba(255,255,255,0.95)",
      }}>
        Conditions Générales d'Utilisation
      </h1>
      <p style={{
        fontFamily: "var(--font-mono), monospace",
        fontSize: 10, color: "rgba(122,154,130,0.5)", marginBottom: 48,
      }}>
        Dernière mise à jour : juin 2026
      </p>

      {SECTIONS.map(({ title, content }) => (
        <section key={title} style={{ marginBottom: 36 }}>
          <h2 style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
            color: "rgba(122,154,130,0.7)", textTransform: "uppercase", marginBottom: 12,
          }}>
            {title}
          </h2>
          <p style={{
            fontFamily: "var(--font-body), sans-serif",
            fontWeight: 400, fontSize: 14, lineHeight: 1.8, whiteSpace: "pre-line",
          }}>
            {content}
          </p>
        </section>
      ))}
    </main>
  )
}
