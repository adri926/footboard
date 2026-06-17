export interface FaqItem {
  question: string
  answer: string
}

export interface FaqCategory {
  title: string
  items: FaqItem[]
}

export const FAQ: FaqCategory[] = [
  {
    title: "Général",
    items: [
      {
        question: "C'est quoi Footboard, et pour qui c'est fait ?",
        answer:
          "Footboard est une plateforme pensée pour les coachs de football amateur et semi-pro. Elle regroupe en un seul endroit la gestion de l'effectif, la planification des entraînements, la préparation des matchs, les convocations par email, un terrain tactique interactif (Digiboard) et une analyse vidéo par IA. L'objectif : passer moins de temps à gérer, plus de temps à coacher.",
      },
      {
        question: "Est-ce que Footboard est gratuit ?",
        answer:
          "Oui, Footboard est actuellement en accès libre. Une offre premium est en cours de développement pour les clubs qui ont besoin de fonctionnalités avancées (multi-coachs, statistiques poussées, exports). Les fonctionnalités de base resteront toujours accessibles gratuitement.",
      },
      {
        question: "Ça marche sur mobile ?",
        answer:
          "La gestion du club (effectif, matchs, entraînements, convocations) est utilisable sur mobile. Le Digiboard et l'analyse vidéo sont optimisés pour desktop — la précision du dessin et la taille de l'écran font une vraie différence sur le terrain tactique.",
      },
      {
        question: "J'ai besoin d'installer quelque chose ?",
        answer:
          "Non. Footboard est une application web — tu accèdes à tout depuis ton navigateur, sans installation. Un compte suffit pour démarrer.",
      },
    ],
  },
  {
    title: "Données & confidentialité",
    items: [
      {
        question: "Mes données sont-elles privées ?",
        answer:
          "Oui. Chaque donnée (joueurs, matchs, entraînements, tactiques) est strictement liée à ton compte. Aucun autre coach ne peut accéder à tes informations. L'accès est sécurisé via Clerk Auth — un système d'authentification utilisé par des milliers d'applications professionnelles.",
      },
      {
        question: "Qui peut voir mes joueurs et mes données de club ?",
        answer:
          "Uniquement toi. Toutes les requêtes en base de données sont filtrées par ton identifiant utilisateur côté serveur. Même en cas d'erreur dans l'interface, il est impossible d'accéder aux données d'un autre club.",
      },
      {
        question: "Que se passe-t-il si je partage une tactique via lien public ?",
        answer:
          "Quand tu crées un lien de partage depuis le Digiboard, tu génères une URL unique qui affiche ce paperboard spécifique en lecture seule. Seules les personnes ayant ce lien peuvent le voir. Aucune autre donnée de ton club n'est accessible via ce lien.",
      },
      {
        question: "Mes vidéos de match sont-elles stockées indéfiniment ?",
        answer:
          "Les vidéos uploadées pour l'analyse IA sont stockées dans un bucket privé Supabase. Elles ne sont accessibles qu'à toi. La suppression de vidéos depuis l'interface est une fonctionnalité prévue dans une prochaine mise à jour.",
      },
    ],
  },
  {
    title: "Effectif & gestion du club",
    items: [
      {
        question: "Combien de joueurs puis-je gérer ?",
        answer:
          "Il n'y a pas de limite fixée. Footboard est pensé pour des clubs avec des effectifs de 15 à 40 joueurs, mais rien ne t'empêche d'en gérer plus.",
      },
      {
        question: "Comment fonctionnent les convocations par email ?",
        answer:
          "Depuis la page d'un match, tu peux envoyer une convocation par email à tous les joueurs ayant une adresse email renseignée dans leur fiche. L'email inclut la date, le lieu et les informations du match. L'envoi est géré via Resend (3 000 emails/mois en version gratuite).",
      },
      {
        question: "Plusieurs coachs peuvent-ils gérer le même club ?",
        answer:
          "Pas encore nativement — chaque compte est lié à un coach. Le support multi-coachs par club est en cours de développement (via le système d'organisations Clerk). Il sera disponible dans une prochaine version.",
      },
      {
        question: "Comment créer plusieurs équipes dans le même club ?",
        answer:
          "Tu peux créer plusieurs équipes depuis la section Équipe & accès. Une équipe active est définie dans les paramètres — elle filtre l'affichage des entraînements. La gestion multi-équipes complète (convocations par équipe, stats séparées) arrive dans la roadmap.",
      },
    ],
  },
  {
    title: "Digiboard & tactique",
    items: [
      {
        question: "Je ferme le Digiboard sans sauvegarder — je perds tout ?",
        answer:
          "Oui. Le Digiboard ne sauvegarde pas automatiquement. Pense à donner un nom à ton paperboard et à cliquer sur \"Enregistrer\" avant de quitter. La sauvegarde automatique (auto-save) est sur la roadmap.",
      },
      {
        question: "Comment retrouver un paperboard sauvegardé ?",
        answer:
          "Depuis le Digiboard, clique sur l'onglet \"MES BOARDS\" dans la sidebar droite. Tu retrouves la liste de tous tes paperboards avec leur formation et leur date. Un clic le charge directement dans le terrain.",
      },
      {
        question: "Comment partager une tactique avec mes joueurs ?",
        answer:
          "Après avoir sauvegardé un paperboard, un bouton \"Créer un lien de partage\" apparaît. Il génère une URL publique en lecture seule que tu peux envoyer par SMS ou email. Tes joueurs voient le terrain, les pions et les dessins — sans avoir besoin d'un compte Footboard.",
      },
      {
        question: "Combien de formations sont disponibles ?",
        answer:
          "16 formations pour l'équipe A et l'équipe B : 4-3-3, 4-4-2, 4-2-3-1, 3-5-2, 5-3-2, et bien d'autres. Les deux équipes peuvent avoir des formations différentes sur le même terrain.",
      },
    ],
  },
  {
    title: "Analyse vidéo IA",
    items: [
      {
        question: "Quels formats vidéo sont acceptés ?",
        answer:
          "Tous les formats vidéo standards du navigateur (MP4, MOV, WebM, MKV). La limite est de 500 Mo par vidéo. Pour les matchs filmés en haute définition, compresse la vidéo en 720p avant l'upload — ça réduit le poids sans impact sur la qualité de l'analyse.",
      },
      {
        question: "Combien de temps prend l'analyse ?",
        answer:
          "L'analyse d'une vidéo de 90 minutes prend généralement entre 2 et 5 minutes. La page se met à jour automatiquement — tu n'as pas besoin de la recharger manuellement.",
      },
      {
        question: "Qu'est-ce que l'IA analyse exactement ?",
        answer:
          "L'IA (Gemini 2.5 Flash de Google) visionne l'intégralité de la vidéo et génère une timeline horodatée des événements clés : buts, occasions, cartons, changements, phases de pression. Elle répond aussi à des questions libres sur le match — tu peux lui demander d'analyser le pressing adverse ou d'identifier les séquences où ton équipe a perdu le ballon.",
      },
      {
        question: "L'IA peut-elle analyser des matchs très longs (>1h30) ?",
        answer:
          "Oui, dans la limite de 500 Mo. Si ta vidéo dépasse cette limite, découpe-la en deux parties (mi-temps) avant l'upload. La gestion automatique des vidéos longues est prévue dans une prochaine version.",
      },
    ],
  },
]
