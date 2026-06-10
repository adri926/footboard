import type { Exercise } from "@/types/training"

export const EXERCISES: Exercise[] = [

  // ─── FAMILLE 1 — ACTIVATION ────────────────────────────────────────────────

  {
    id: "EX_A01",
    name: "Échauffement dynamique sans ballon",
    family: "activation",
    defaultDuration: 10,
    minPlayers: 15,
    maxPlayers: 22,
    description: "Footing léger + gammes athlétiques : talons-fesses, montées genoux, pas chassés, accélérations progressives.",
    objectives: [
      "Élévation progressive de la fréquence cardiaque",
      "Activation musculaire générale",
      "Préparation neuromusculaire",
    ],
    instructions: "Intensité progressive — 50% puis 70% en fin de séquence. Insister sur la qualité des appuis.",
    variants: [
      "Avec changements de direction sur signal coach",
      "Ajout de sauts verticaux sur les 2 dernières longueurs",
    ],
    niveau: "les_deux",
    positionSemaine: "les_deux",
    intensite: "faible",
    animation: {
      pions: [
        { id: "p1", x: 10, y: 10, team: "A", label: "1" },
        { id: "p2", x: 20, y: 10, team: "A", label: "2" },
        { id: "p3", x: 30, y: 10, team: "A", label: "3" },
        { id: "p4", x: 40, y: 10, team: "A", label: "4" },
        { id: "p5", x: 50, y: 10, team: "A", label: "5" },
        { id: "p6", x: 60, y: 10, team: "A", label: "6" },
      ],
      arrows: [
        { from: { x: 10, y: 10 }, to: { x: 10, y: 85 }, style: "solid" },
        { from: { x: 20, y: 10 }, to: { x: 20, y: 85 }, style: "solid" },
        { from: { x: 30, y: 10 }, to: { x: 30, y: 85 }, style: "solid" },
      ],
      // Ligne de joueurs qui parcourt le terrain en longueur (gammes athlétiques)
      sequence: [
        {
          duration: 0,
          pions: {
            p1: { x: 10, y: 10 }, p2: { x: 20, y: 10 }, p3: { x: 30, y: 10 },
            p4: { x: 40, y: 10 }, p5: { x: 50, y: 10 }, p6: { x: 60, y: 10 },
          },
        },
        {
          duration: 1800,
          pions: {
            p1: { x: 10, y: 85 }, p2: { x: 20, y: 85 }, p3: { x: 30, y: 85 },
            p4: { x: 40, y: 85 }, p5: { x: 50, y: 85 }, p6: { x: 60, y: 85 },
          },
        },
      ],
    },
  },

  {
    id: "EX_A02",
    name: "Rondo 4v1 activation",
    family: "activation",
    defaultDuration: 8,
    minPlayers: 5,
    maxPlayers: 10,
    description: "4 joueurs forment un carré, 1 défenseur au centre. Conservation 2 touches max avec déplacement après chaque passe.",
    objectives: [
      "Mise en route technique — premiers touchers de balle",
      "Concentration et réactivité",
      "Warm-up technique en douceur",
    ],
    instructions: "2 touches maximum. Se déplacer immédiatement après la passe — ne pas rester statique.",
    variants: [
      "5v2 pour groupes plus expérimentés",
      "1 touche obligatoire après 3 min",
    ],
    niveau: "les_deux",
    positionSemaine: "les_deux",
    intensite: "faible",
    animation: {
      pions: [
        { id: "p1", x: 35, y: 30, team: "A", label: "1" },
        { id: "p2", x: 65, y: 30, team: "A", label: "2" },
        { id: "p3", x: 35, y: 70, team: "A", label: "3" },
        { id: "p4", x: 65, y: 70, team: "A", label: "4" },
        { id: "p5", x: 50, y: 50, team: "B", label: "D" },
      ],
      arrows: [
        { from: { x: 35, y: 30 }, to: { x: 65, y: 30 }, style: "solid" },
        { from: { x: 65, y: 30 }, to: { x: 65, y: 70 }, style: "dashed" },
        { from: { x: 65, y: 70 }, to: { x: 35, y: 70 }, style: "solid" },
      ],
      ball: { x: 35, y: 30 },
      // Le ballon tourne 1→2→4→3→1, le passeur se décale vers le centre
      // pour offrir une nouvelle ligne de passe, le défenseur suit le ballon.
      sequence: [
        {
          duration: 0,
          ball: { x: 35, y: 30 },
          pions: {
            p1: { x: 35, y: 30 }, p2: { x: 65, y: 30 },
            p3: { x: 35, y: 70 }, p4: { x: 65, y: 70 },
            p5: { x: 50, y: 50 },
          },
        },
        {
          duration: 900,
          ball: { x: 65, y: 30 },
          pions: {
            p1: { x: 42, y: 38 }, p2: { x: 65, y: 30 },
            p3: { x: 35, y: 70 }, p4: { x: 65, y: 70 },
            p5: { x: 58, y: 38 },
          },
        },
        {
          duration: 900,
          ball: { x: 65, y: 70 },
          pions: {
            p1: { x: 35, y: 30 }, p2: { x: 58, y: 38 },
            p3: { x: 35, y: 70 }, p4: { x: 65, y: 70 },
            p5: { x: 58, y: 58 },
          },
        },
        {
          duration: 900,
          ball: { x: 35, y: 70 },
          pions: {
            p1: { x: 35, y: 30 }, p2: { x: 65, y: 30 },
            p3: { x: 35, y: 70 }, p4: { x: 58, y: 58 },
            p5: { x: 42, y: 58 },
          },
        },
        {
          duration: 900,
          ball: { x: 35, y: 30 },
          pions: {
            p1: { x: 35, y: 30 }, p2: { x: 65, y: 30 },
            p3: { x: 35, y: 70 }, p4: { x: 65, y: 70 },
            p5: { x: 50, y: 50 },
          },
        },
      ],
    },
  },

  {
    id: "EX_A03",
    name: "Passe et suit",
    family: "activation",
    defaultDuration: 8,
    minPlayers: 8,
    maxPlayers: 12,
    description: "2 colonnes face à face. On passe et on suit sa passe dans la colonne adverse. Rythme progressif.",
    objectives: [
      "Coordination, timing des déplacements",
      "Premiers appels de balle",
      "Synchronisation collective",
    ],
    instructions: "Passe précise au pied du receveur. Partir dès l'envoi de la passe, pas avant.",
    variants: [
      "Ajout d'une jonglerie avant de passer",
      "3 colonnes avec croisement",
    ],
    niveau: "les_deux",
    positionSemaine: "les_deux",
    intensite: "faible",
    animation: {
      pions: [
        { id: "c1a", x: 25, y: 20, team: "A", label: "1" },
        { id: "c1b", x: 25, y: 35, team: "A", label: "2" },
        { id: "c1c", x: 25, y: 50, team: "A", label: "3" },
        { id: "c2a", x: 75, y: 20, team: "neutral", label: "4" },
        { id: "c2b", x: 75, y: 35, team: "neutral", label: "5" },
        { id: "c2c", x: 75, y: 50, team: "neutral", label: "6" },
      ],
      arrows: [
        { from: { x: 25, y: 20 }, to: { x: 75, y: 20 }, style: "solid" },
        { from: { x: 25, y: 20 }, to: { x: 75, y: 35 }, style: "dashed" },
      ],
      ball: { x: 25, y: 20 },
      // Le 1er joueur passe dans la colonne d'en face puis suit sa passe
      sequence: [
        { duration: 0,    ball: { x: 25, y: 20 }, pions: { c1a: { x: 25, y: 20 } } },
        { duration: 700,  ball: { x: 75, y: 20 }, pions: { c1a: { x: 25, y: 20 } } },
        { duration: 1000, ball: { x: 75, y: 20 }, pions: { c1a: { x: 75, y: 65 } } },
      ],
    },
  },

  {
    id: "EX_A04",
    name: "Étirements dynamiques pré-effort",
    family: "activation",
    defaultDuration: 8,
    minPlayers: 10,
    maxPlayers: 22,
    description: "Séquence : fentes marchées, rotations hanches, cercles épaules, swings jambes, rotations tronc, high knees lents.",
    objectives: [
      "Mobilité articulaire active",
      "Préparation musculaire sans étirement statique",
      "Activation du système proprioceptif",
    ],
    instructions: "Mouvements amples et contrôlés. Jamais de rebond sur l'amplitude. Respiration régulière et profonde.",
    variants: [
      "En binômes avec légère résistance partenaire sur les rotations",
      "Circuit en déplacement sur 20m",
    ],
    pedagogicNote: "Étirements STATIQUES à éviter avant l'effort — contre-indiqués car ils réduisent la puissance musculaire. À réserver au retour au calme uniquement.",
    niveau: "les_deux",
    positionSemaine: "les_deux",
    intensite: "faible",
    animation: {
      pions: [
        { id: "l1", x: 15, y: 40, team: "A", label: "1" },
        { id: "l2", x: 28, y: 40, team: "A", label: "2" },
        { id: "l3", x: 41, y: 40, team: "A", label: "3" },
        { id: "l4", x: 54, y: 40, team: "A", label: "4" },
        { id: "l5", x: 67, y: 40, team: "A", label: "5" },
        { id: "l6", x: 80, y: 40, team: "A", label: "6" },
      ],
      arrows: [
        { from: { x: 15, y: 40 }, to: { x: 80, y: 40 }, style: "dashed" },
      ],
      // Mouvement amples et progressifs sur la ligne (fentes, swings, rotations)
      sequence: [
        {
          duration: 0,
          pions: {
            l1: { x: 15, y: 40 }, l2: { x: 28, y: 40 }, l3: { x: 41, y: 40 },
            l4: { x: 54, y: 40 }, l5: { x: 67, y: 40 }, l6: { x: 80, y: 40 },
          },
        },
        {
          duration: 1600,
          pions: {
            l1: { x: 30, y: 40 }, l2: { x: 43, y: 40 }, l3: { x: 56, y: 40 },
            l4: { x: 69, y: 40 }, l5: { x: 82, y: 40 }, l6: { x: 95, y: 40 },
          },
        },
      ],
    },
  },

  // ─── FAMILLE 2 — FONCIER ───────────────────────────────────────────────────

  {
    id: "EX_F01",
    name: "Circuit explosivité sans ballon",
    family: "foncier",
    defaultDuration: 15,
    minPlayers: 8,
    maxPlayers: 22,
    description: "4 ateliers en rotation : haies basses, échelle de coordination, slalom cônes, démarrages 10m. Récup 30s entre ateliers.",
    objectives: [
      "Puissance musculaire et vitesse de démarrage",
      "Coordination neuromusculaire",
      "Explosivité spécifique football",
    ],
    instructions: "Effort maximal sur chaque sprint. Récupération active (marche) de 30s entre les ateliers. Ne jamais sauter la récup.",
    variants: [
      "Chrono individuel pour compétition bienveillante",
      "Ajout d'une passe avant le sprint final",
    ],
    niveau: "les_deux",
    positionSemaine: "j+2",
    intensite: "elevee",
    animation: {
      pions: [
        { id: "z1", x: 20, y: 20, team: "A", label: "A" },
        { id: "z2", x: 60, y: 20, team: "A", label: "B" },
        { id: "z3", x: 20, y: 65, team: "A", label: "C" },
        { id: "z4", x: 60, y: 65, team: "A", label: "D" },
      ],
      arrows: [
        { from: { x: 20, y: 20 }, to: { x: 60, y: 20 }, style: "dashed" },
        { from: { x: 60, y: 20 }, to: { x: 60, y: 65 }, style: "dashed" },
        { from: { x: 60, y: 65 }, to: { x: 20, y: 65 }, style: "dashed" },
        { from: { x: 20, y: 65 }, to: { x: 20, y: 20 }, style: "dashed" },
      ],
      zones: [
        { x: 10, y: 10, width: 25, height: 20, color: "rgba(74,106,138,0.15)" },
        { x: 50, y: 10, width: 25, height: 20, color: "rgba(74,106,138,0.15)" },
        { x: 10, y: 55, width: 25, height: 20, color: "rgba(74,106,138,0.15)" },
        { x: 50, y: 55, width: 25, height: 20, color: "rgba(74,106,138,0.15)" },
      ],
      // Rotation des 4 ateliers : A → B → D → C → A
      sequence: [
        { duration: 0,    pions: { z1: { x: 20, y: 20 }, z2: { x: 60, y: 20 }, z3: { x: 20, y: 65 }, z4: { x: 60, y: 65 } } },
        { duration: 900,  pions: { z1: { x: 60, y: 20 }, z2: { x: 60, y: 65 }, z3: { x: 20, y: 20 }, z4: { x: 20, y: 65 } } },
        { duration: 900,  pions: { z1: { x: 60, y: 65 }, z2: { x: 20, y: 65 }, z3: { x: 60, y: 20 }, z4: { x: 20, y: 20 } } },
        { duration: 900,  pions: { z1: { x: 20, y: 65 }, z2: { x: 20, y: 20 }, z3: { x: 60, y: 65 }, z4: { x: 60, y: 20 } } },
        { duration: 900,  pions: { z1: { x: 20, y: 20 }, z2: { x: 60, y: 20 }, z3: { x: 20, y: 65 }, z4: { x: 60, y: 65 } } },
      ],
    },
  },

  {
    id: "EX_F02",
    name: "Fartlek avec ballon",
    family: "foncier",
    defaultDuration: 15,
    minPlayers: 10,
    maxPlayers: 22,
    description: "Chaque joueur conduit son propre ballon, librement et à allure modérée, sur l'ensemble du terrain. Au signal du coach, tous les joueurs accélèrent en sprint 15m balle au pied vers un espace libre, puis reprennent immédiatement une conduite tranquille.",
    objectives: [
      "Endurance spécifique football (alternance trot / sprint)",
      "Gestion de l'effort et de la récupération avec ballon",
      "Réactivité sur signal et conduite de balle sous fatigue",
    ],
    instructions: "Chaque joueur a son ballon. Phase de base : conduite tranquille, tête relevée, en évitant les autres joueurs et leurs ballons. Au signal (sifflet) : sprint 15m balle au pied vers un espace libre, puis reprendre immédiatement la conduite tranquille. Le signal peut retentir à intervalles variables (principe du fartlek).",
    variants: [
      "Zones de sprint imposées (couloirs)",
      "Variante avancée : au signal, passe-et-va avec le partenaire le plus proche avant de reprendre la conduite",
    ],
    niveau: "les_deux",
    positionSemaine: "j+2",
    intensite: "elevee",
    animation: {
      pions: [
        { id: "p1", x: 20, y: 30, team: "A", label: "1" },
        { id: "p2", x: 50, y: 50, team: "A", label: "2" },
        { id: "p3", x: 75, y: 25, team: "A", label: "3" },
        { id: "p4", x: 35, y: 70, team: "A", label: "4" },
      ],
      arrows: [
        { from: { x: 28, y: 38 }, to: { x: 45, y: 52 }, style: "dashed", color: "#e07070" },
        { from: { x: 45, y: 58 }, to: { x: 30, y: 68 }, style: "dashed", color: "#e07070" },
        { from: { x: 68, y: 32 }, to: { x: 50, y: 45 }, style: "dashed", color: "#e07070" },
        { from: { x: 42, y: 62 }, to: { x: 60, y: 45 }, style: "dashed", color: "#e07070" },
      ],
      balls: { b1: { x: 20, y: 30 }, b2: { x: 50, y: 50 }, b3: { x: 75, y: 25 }, b4: { x: 35, y: 70 } },
      // Chaque joueur a son ballon : conduite libre (fartlek), puis au signal
      // tous sprintent 15m balle au pied, puis reprennent la conduite (retour au point de départ).
      sequence: [
        {
          duration: 0,
          pions: { p1: { x: 20, y: 30 }, p2: { x: 50, y: 50 }, p3: { x: 75, y: 25 }, p4: { x: 35, y: 70 } },
          balls: { b1: { x: 20, y: 30 }, b2: { x: 50, y: 50 }, b3: { x: 75, y: 25 }, b4: { x: 35, y: 70 } },
        },
        {
          // Phase de base : conduite libre à allure modérée pour tout le monde
          duration: 1500,
          pions: { p1: { x: 28, y: 38 }, p2: { x: 45, y: 58 }, p3: { x: 68, y: 32 }, p4: { x: 42, y: 62 } },
          balls: { b1: { x: 28, y: 38 }, b2: { x: 45, y: 58 }, b3: { x: 68, y: 32 }, b4: { x: 42, y: 62 } },
        },
        {
          // Signal : sprint 15m balle au pied, chacun vers un espace libre
          duration: 900,
          pions: { p1: { x: 45, y: 52 }, p2: { x: 30, y: 68 }, p3: { x: 50, y: 45 }, p4: { x: 60, y: 45 } },
          balls: { b1: { x: 45, y: 52 }, b2: { x: 30, y: 68 }, b3: { x: 50, y: 45 }, b4: { x: 60, y: 45 } },
        },
        {
          // Reprise de la conduite tranquille : retour vers le point de départ
          duration: 1400,
          pions: { p1: { x: 20, y: 30 }, p2: { x: 50, y: 50 }, p3: { x: 75, y: 25 }, p4: { x: 35, y: 70 } },
          balls: { b1: { x: 20, y: 30 }, b2: { x: 50, y: 50 }, b3: { x: 75, y: 25 }, b4: { x: 35, y: 70 } },
        },
      ],
    },
  },

  {
    id: "EX_F03",
    name: "Navettes progressives (Yo-Yo)",
    family: "foncier",
    defaultDuration: 12,
    minPlayers: 10,
    maxPlayers: 22,
    description: "Navettes 20m avec paliers progressifs selon le protocole Yo-Yo intermittent. Suivi individuel du palier d'abandon.",
    objectives: [
      "Évaluation et développement de la VMA",
      "Endurance intermittente spécifique football",
      "Mesure de la condition physique individuelle",
    ],
    instructions: "Suivre le signal sonore strictement. Noter le palier d'abandon pour chaque joueur — utile pour individualiser la charge.",
    variants: [
      "Yo-Yo niveau 2 pour joueurs semi-pros",
      "Navettes par groupes de niveau",
    ],
    niveau: "semi_pro",
    positionSemaine: "j+2",
    intensite: "elevee",
    animation: {
      pions: [
        { id: "l1", x: 15, y: 55, team: "A", label: "1" },
        { id: "l2", x: 15, y: 60, team: "A", label: "2" },
        { id: "l3", x: 15, y: 65, team: "A", label: "3" },
        { id: "l4", x: 15, y: 70, team: "A", label: "4" },
      ],
      arrows: [
        { from: { x: 15, y: 60 }, to: { x: 85, y: 60 }, style: "solid" },
        { from: { x: 85, y: 60 }, to: { x: 15, y: 60 }, style: "dashed" },
      ],
      zones: [
        { x: 10, y: 50, width: 5, height: 30, color: "rgba(74,106,138,0.25)" },
        { x: 83, y: 50, width: 5, height: 30, color: "rgba(74,106,138,0.25)" },
      ],
      // Navette aller-retour entre les deux plots, au signal sonore
      sequence: [
        { duration: 0,    pions: { l1: { x: 15, y: 55 }, l2: { x: 15, y: 60 }, l3: { x: 15, y: 65 }, l4: { x: 15, y: 70 } } },
        { duration: 1200, pions: { l1: { x: 85, y: 55 }, l2: { x: 85, y: 60 }, l3: { x: 85, y: 65 }, l4: { x: 85, y: 70 } } },
        { duration: 1200, pions: { l1: { x: 15, y: 55 }, l2: { x: 15, y: 60 }, l3: { x: 15, y: 65 }, l4: { x: 15, y: 70 } } },
      ],
    },
  },

  {
    id: "EX_F04",
    name: "Puissance course avec ballon",
    family: "foncier",
    defaultDuration: 15,
    minPlayers: 8,
    maxPlayers: 22,
    description: "Sprint conduite 30m suivi d'une frappe en mouvement. Récupération pendant le retour en colonne.",
    objectives: [
      "Explosivité et conduite sous vitesse maximale",
      "Technique de frappe sous fatigue",
      "Lien physique-technique",
    ],
    instructions: "Départ sur signal. Conduite droite à pleine vitesse, frappe en pleine course sur la zone de but.",
    variants: [
      "Conduite avec crochet avant frappe",
      "2 joueurs simultanément en duel",
    ],
    niveau: "les_deux",
    positionSemaine: "j+4",
    intensite: "moderee",
    animation: {
      pions: [
        { id: "c1", x: 50, y: 85, team: "A", label: "1" },
        { id: "c2", x: 50, y: 75, team: "A", label: "2" },
        { id: "c3", x: 50, y: 65, team: "A", label: "3" },
      ],
      arrows: [
        { from: { x: 50, y: 85 }, to: { x: 50, y: 15 }, style: "solid" },
        { from: { x: 50, y: 15 }, to: { x: 30, y: 5 }, style: "dashed", color: "#e07070" },
      ],
      zones: [
        { x: 20, y: 0, width: 60, height: 12, color: "rgba(224,112,112,0.10)" },
      ],
      ball: { x: 50, y: 85 },
      // Sprint conduite 30m puis frappe en mouvement vers le but
      sequence: [
        { duration: 0,    ball: { x: 50, y: 85 }, pions: { c1: { x: 50, y: 85 } } },
        { duration: 1300, ball: { x: 50, y: 15 }, pions: { c1: { x: 50, y: 15 } } },
        { duration: 600,  ball: { x: 30, y: 5 },  pions: { c1: { x: 50, y: 15 } } },
      ],
    },
  },

  // ─── FAMILLE 3 — TECHNIQUE ─────────────────────────────────────────────────

  {
    id: "EX_T01",
    name: "Conservation 5v2 (Rondo carré)",
    family: "technique",
    defaultDuration: 15,
    minPlayers: 7,
    maxPlayers: 14,
    description: "5 joueurs conservent dans un carré 15×15m, 2 pressent au centre. Rotation : les 2 qui perdent la balle défendent.",
    objectives: [
      "Jeu en mouvement et passes sous pression",
      "Positionnement et soutien constant",
      "Lecture du jeu et prise de décision rapide",
    ],
    instructions: "Se déplacer avant de recevoir. Offrir toujours 2 solutions au porteur du ballon. Triangle permanent.",
    variants: [
      "1 touche obligatoire après 5 min",
      "Appuis extérieurs (+2 joueurs bords du carré)",
    ],
    niveau: "les_deux",
    positionSemaine: "j+2",
    intensite: "moderee",
    animation: {
      pions: [
        { id: "a1", x: 30, y: 25, team: "A", label: "1" },
        { id: "a2", x: 70, y: 25, team: "A", label: "2" },
        { id: "a3", x: 15, y: 50, team: "A", label: "3" },
        { id: "a4", x: 85, y: 50, team: "A", label: "4" },
        { id: "a5", x: 50, y: 75, team: "A", label: "5" },
        { id: "d1", x: 45, y: 42, team: "B", label: "D" },
        { id: "d2", x: 55, y: 55, team: "B", label: "D" },
      ],
      arrows: [
        { from: { x: 30, y: 25 }, to: { x: 70, y: 25 }, style: "solid" },
        { from: { x: 70, y: 25 }, to: { x: 85, y: 50 }, style: "dashed" },
        { from: { x: 15, y: 50 }, to: { x: 50, y: 75 }, style: "dashed" },
      ],
      zones: [
        { x: 10, y: 20, width: 80, height: 60, color: "rgba(138,122,74,0.08)" },
      ],
      ball: { x: 30, y: 25 },
      // Le ballon circule sur le pentagone (1→2→4→5→3→1), les 2 défenseurs suivent le ballon
      sequence: [
        { duration: 0,   ball: { x: 30, y: 25 }, pions: { d1: { x: 45, y: 42 }, d2: { x: 55, y: 55 } } },
        { duration: 800, ball: { x: 70, y: 25 }, pions: { d1: { x: 60, y: 35 }, d2: { x: 50, y: 45 } } },
        { duration: 800, ball: { x: 85, y: 50 }, pions: { d1: { x: 60, y: 45 }, d2: { x: 70, y: 55 } } },
        { duration: 800, ball: { x: 50, y: 75 }, pions: { d1: { x: 50, y: 55 }, d2: { x: 60, y: 65 } } },
        { duration: 800, ball: { x: 15, y: 50 }, pions: { d1: { x: 40, y: 45 }, d2: { x: 35, y: 55 } } },
        { duration: 800, ball: { x: 30, y: 25 }, pions: { d1: { x: 45, y: 42 }, d2: { x: 55, y: 55 } } },
      ],
    },
  },

  {
    id: "EX_T02",
    name: "Conservation avec appuis extérieurs",
    family: "technique",
    defaultDuration: 20,
    minPlayers: 10,
    maxPlayers: 12,
    description: "4v4 dans un carré + 3 joueurs neutres sur les côtés (appuis à 1 touche max). Rotation : appui rentre, un intérieur sort.",
    objectives: [
      "Utilisation des appuis extérieurs",
      "Jeu à 3, triangles et losanges",
      "Créer une supériorité numérique permanente",
    ],
    instructions: "L'appui = 1 touche maximum. Après la passe à l'appui, l'appui rentre dans le carré et un intérieur sort.",
    variants: [
      "Appuis sur 2 côtés seulement (simulation couloirs de jeu)",
      "L'appui peut conserver 2 touches si l'intérieur ne se déplace pas",
    ],
    niveau: "les_deux",
    positionSemaine: "j+2",
    intensite: "moderee",
    animation: {
      pions: [
        { id: "i1", x: 40, y: 35, team: "A", label: "1" },
        { id: "i2", x: 60, y: 35, team: "A", label: "2" },
        { id: "i3", x: 40, y: 65, team: "A", label: "3" },
        { id: "i4", x: 60, y: 65, team: "A", label: "4" },
        { id: "b1", x: 60, y: 35, team: "B", label: "5" },
        { id: "b2", x: 40, y: 65, team: "B", label: "6" },
        { id: "n1", x: 20, y: 50, team: "neutral", label: "N" },
        { id: "n2", x: 80, y: 50, team: "neutral", label: "N" },
        { id: "n3", x: 50, y: 15, team: "neutral", label: "N" },
      ],
      arrows: [
        { from: { x: 40, y: 35 }, to: { x: 20, y: 50 }, style: "solid" },
        { from: { x: 20, y: 50 }, to: { x: 40, y: 65 }, style: "dashed" },
        { from: { x: 60, y: 35 }, to: { x: 50, y: 15 }, style: "dashed" },
      ],
      zones: [
        { x: 30, y: 25, width: 40, height: 50, color: "rgba(138,122,74,0.08)" },
      ],
      ball: { x: 40, y: 35 },
      // Le ballon circule dans le carré et passe par un appui extérieur (1 touche)
      sequence: [
        { duration: 0,   ball: { x: 40, y: 35 }, pions: {} },
        { duration: 800, ball: { x: 20, y: 50 }, pions: {} },
        { duration: 800, ball: { x: 40, y: 65 }, pions: {} },
        { duration: 800, ball: { x: 60, y: 35 }, pions: {} },
        { duration: 800, ball: { x: 40, y: 35 }, pions: {} },
      ],
    },
  },

  {
    id: "EX_T03",
    name: "Jeu de position 7v7 à thème",
    family: "technique",
    defaultDuration: 25,
    minPlayers: 14,
    maxPlayers: 16,
    description: "Terrain 40×30m divisé en 3 zones horizontales. Point bonus si traversée d'une zone en moins de 3 passes.",
    objectives: [
      "Occupation de l'espace et jeu entre les lignes",
      "Pressing collectif et compacité",
      "Verticalité et transitions rapides",
    ],
    instructions: "La zone centrale doit toujours avoir un joueur disponible. Valider les phases de 3 zones pour marquer.",
    variants: [
      "Interdire les passes en arrière dans la zone centrale",
      "Bonus si but marqué dans les 5s après récupération",
    ],
    niveau: "les_deux",
    positionSemaine: "j+2",
    intensite: "moderee",
    animation: {
      pions: [
        { id: "a1", x: 20, y: 15, team: "A", label: "1" },
        { id: "a2", x: 40, y: 15, team: "A", label: "2" },
        { id: "a3", x: 60, y: 15, team: "A", label: "3" },
        { id: "a4", x: 50, y: 50, team: "A", label: "4" },
        { id: "b1", x: 30, y: 85, team: "B", label: "5" },
        { id: "b2", x: 50, y: 85, team: "B", label: "6" },
        { id: "b3", x: 70, y: 85, team: "B", label: "7" },
        { id: "b4", x: 45, y: 50, team: "B", label: "8" },
      ],
      arrows: [
        { from: { x: 20, y: 15 }, to: { x: 50, y: 50 }, style: "solid" },
        { from: { x: 50, y: 50 }, to: { x: 30, y: 85 }, style: "dashed" },
      ],
      zones: [
        { x: 5, y: 5,  width: 90, height: 28, color: "rgba(138,122,74,0.08)" },
        { x: 5, y: 35, width: 90, height: 28, color: "rgba(138,122,74,0.12)" },
        { x: 5, y: 65, width: 90, height: 28, color: "rgba(138,122,74,0.08)" },
      ],
      ball: { x: 20, y: 15 },
      // Le ballon traverse les 3 zones horizontales en 2 passes
      sequence: [
        { duration: 0,   ball: { x: 20, y: 15 }, pions: {} },
        { duration: 900, ball: { x: 50, y: 50 }, pions: {} },
        { duration: 900, ball: { x: 30, y: 85 }, pions: {} },
      ],
    },
  },

  {
    id: "EX_T04",
    name: "Conservation 8v8 avec sorties",
    family: "technique",
    defaultDuration: 20,
    minPlayers: 16,
    maxPlayers: 18,
    description: "Grand terrain. Conserver collectivement + chercher une sortie dans une zone adverse définie. Transition conservation → attaque.",
    objectives: [
      "Lien entre la phase de conservation et la transition offensive",
      "Gestion du tempo",
      "Sécurisation puis verticalité",
    ],
    instructions: "Phase 1 : conserver 5 passes. Phase 2 : chercher une sortie dans les zones latérales définies.",
    variants: [
      "Zones de sortie qui changent sur signal coach",
      "Gardien autorisé pour simuler la relance",
    ],
    niveau: "semi_pro",
    positionSemaine: "j+2",
    intensite: "moderee",
    animation: {
      pions: [
        { id: "a1", x: 25, y: 30, team: "A", label: "1" },
        { id: "a2", x: 50, y: 20, team: "A", label: "2" },
        { id: "a3", x: 75, y: 30, team: "A", label: "3" },
        { id: "a4", x: 40, y: 50, team: "A", label: "4" },
        { id: "b1", x: 35, y: 60, team: "B", label: "5" },
        { id: "b2", x: 65, y: 60, team: "B", label: "6" },
        { id: "b3", x: 50, y: 75, team: "B", label: "7" },
      ],
      arrows: [
        { from: { x: 50, y: 20 }, to: { x: 80, y: 15 }, style: "dashed", color: "#e07070" },
        { from: { x: 25, y: 30 }, to: { x: 40, y: 50 }, style: "solid" },
      ],
      zones: [
        { x: 75, y: 5, width: 22, height: 30, color: "rgba(224,112,112,0.10)" },
        { x: 3, y: 5, width: 22, height: 30, color: "rgba(224,112,112,0.10)" },
      ],
      ball: { x: 25, y: 30 },
      // Phase 1 conservation (a1→a4→a2) puis phase 2 sortie en zone latérale
      sequence: [
        { duration: 0,   ball: { x: 25, y: 30 }, pions: {} },
        { duration: 800, ball: { x: 40, y: 50 }, pions: {} },
        { duration: 800, ball: { x: 50, y: 20 }, pions: {} },
        { duration: 900, ball: { x: 80, y: 15 }, pions: {} },
      ],
    },
  },

  // ─── FAMILLE 4 — TACTIQUE ──────────────────────────────────────────────────

  {
    id: "EX_TAC01",
    name: "Pressing haut 4v4+GK",
    family: "tactique",
    defaultDuration: 20,
    minPlayers: 9,
    maxPlayers: 12,
    description: "Équipe A sort du GK, Équipe B presse haut dès la relance. Pressing déclenché au signal du milieu relayeur.",
    objectives: [
      "Organisation du pressing collectif",
      "Couvertures et permutations défensives",
      "Déclenchement synchronisé sur signal",
    ],
    instructions: "Pressing déclenché au signal du milieu relayeur. Couper les lignes de passe plutôt que courir sur le porteur.",
    variants: [
      "Pressing en 4-4-2 bloc médian",
      "Pressing en 4-3-3 sur sortie GK",
      "Équipe B autorisée à jouer long si pressing échoue",
    ],
    niveau: "les_deux",
    positionSemaine: "j+4",
    intensite: "moderee",
    animation: {
      pions: [
        { id: "gk", x: 50, y: 5, team: "A", label: "GK" },
        { id: "a1", x: 30, y: 20, team: "A", label: "3" },
        { id: "a2", x: 50, y: 18, team: "A", label: "5" },
        { id: "a3", x: 70, y: 20, team: "A", label: "2" },
        { id: "b1", x: 25, y: 38, team: "B", label: "P" },
        { id: "b2", x: 50, y: 35, team: "B", label: "P" },
        { id: "b3", x: 75, y: 38, team: "B", label: "P" },
        { id: "b4", x: 50, y: 48, team: "B", label: "P" },
      ],
      arrows: [
        { from: { x: 25, y: 38 }, to: { x: 30, y: 20 }, style: "solid", color: "#e07070" },
        { from: { x: 50, y: 35 }, to: { x: 50, y: 18 }, style: "solid", color: "#e07070" },
        { from: { x: 75, y: 38 }, to: { x: 70, y: 20 }, style: "solid", color: "#e07070" },
      ],
      zones: [
        { x: 5, y: 0, width: 90, height: 55, color: "rgba(122,154,130,0.04)" },
      ],
      // Pressing déclenché sur signal : les 3 attaquants montent presser, puis se replacent
      sequence: [
        {
          duration: 0,
          pions: { b1: { x: 25, y: 38 }, b2: { x: 50, y: 35 }, b3: { x: 75, y: 38 }, b4: { x: 50, y: 48 } },
        },
        {
          duration: 900,
          pions: { b1: { x: 30, y: 22 }, b2: { x: 50, y: 20 }, b3: { x: 70, y: 22 }, b4: { x: 50, y: 38 } },
        },
        {
          duration: 900,
          pions: { b1: { x: 25, y: 38 }, b2: { x: 50, y: 35 }, b3: { x: 75, y: 38 }, b4: { x: 50, y: 48 } },
        },
      ],
    },
  },

  {
    id: "EX_TAC02",
    name: "Transition défense-attaque",
    family: "tactique",
    defaultDuration: 20,
    minPlayers: 14,
    maxPlayers: 16,
    description: "Après récupération du ballon : transition offensive rapide en 6 secondes maximum vers le camp adverse.",
    objectives: [
      "Vitesse et verticalité de la transition",
      "Appels de balle immédiats après récupération",
      "Décision rapide du porteur sous pression",
    ],
    instructions: "Dans les 3 premières passes après récup : être dans le camp adverse. Pas de latéral pour gagner du temps.",
    variants: [
      "Contre-pressing adverse immédiat pour simuler la réalité",
      "Bonus si tir cadré dans les 8 secondes",
    ],
    niveau: "les_deux",
    positionSemaine: "j+4",
    intensite: "elevee",
    animation: {
      pions: [
        { id: "a1", x: 30, y: 55, team: "A", label: "6" },
        { id: "a2", x: 50, y: 60, team: "A", label: "8" },
        { id: "a3", x: 20, y: 45, team: "A", label: "7" },
        { id: "a4", x: 80, y: 45, team: "A", label: "11" },
        { id: "b1", x: 35, y: 40, team: "B", label: "4" },
        { id: "b2", x: 60, y: 40, team: "B", label: "6" },
      ],
      arrows: [
        { from: { x: 50, y: 60 }, to: { x: 50, y: 30 }, style: "solid", color: "#7A9A82" },
        { from: { x: 20, y: 45 }, to: { x: 15, y: 20 }, style: "dashed", color: "#7A9A82" },
        { from: { x: 80, y: 45 }, to: { x: 85, y: 20 }, style: "dashed", color: "#7A9A82" },
      ],
      ball: { x: 50, y: 60 },
      // Transition rapide après récupération : passe verticale + courses des ailiers
      sequence: [
        {
          duration: 0,
          ball: { x: 50, y: 60 },
          pions: { a3: { x: 20, y: 45 }, a4: { x: 80, y: 45 } },
        },
        {
          duration: 1000,
          ball: { x: 50, y: 30 },
          pions: { a3: { x: 15, y: 20 }, a4: { x: 85, y: 20 } },
        },
      ],
    },
  },

  {
    id: "EX_TAC03",
    name: "Bloc médian défensif",
    family: "tactique",
    defaultDuration: 20,
    minPlayers: 14,
    maxPlayers: 16,
    description: "Une équipe défend en bloc médian/bas. Travail de compacité, distance maximale 20m entre les lignes, déclenchement du duel.",
    objectives: [
      "Organisation défensive collective",
      "Compacité — distance max 20m entre les lignes",
      "Déclenchement du duel au bon moment",
    ],
    instructions: "Bloc compact : jamais plus de 20m entre la ligne défensive et la ligne offensive. Déclencher le duel uniquement sur signal du capitaine.",
    variants: [
      "Bloc 4-4 puis 4-5-1 en fin de match",
      "Contre-attaque rapide dès récupération",
    ],
    niveau: "les_deux",
    positionSemaine: "j+2",
    intensite: "moderee",
    animation: {
      pions: [
        { id: "d1", x: 20, y: 68, team: "A", label: "2" },
        { id: "d2", x: 38, y: 68, team: "A", label: "5" },
        { id: "d3", x: 56, y: 68, team: "A", label: "4" },
        { id: "d4", x: 74, y: 68, team: "A", label: "3" },
        { id: "m1", x: 20, y: 55, team: "A", label: "7" },
        { id: "m2", x: 38, y: 55, team: "A", label: "6" },
        { id: "m3", x: 56, y: 55, team: "A", label: "8" },
        { id: "m4", x: 74, y: 55, team: "A", label: "11" },
        { id: "b1", x: 30, y: 35, team: "B", label: "9" },
        { id: "b2", x: 55, y: 40, team: "B", label: "10" },
      ],
      arrows: [
        { from: { x: 20, y: 55 }, to: { x: 20, y: 68 }, style: "dashed" },
        { from: { x: 74, y: 55 }, to: { x: 74, y: 68 }, style: "dashed" },
      ],
      zones: [
        { x: 5, y: 48, width: 90, height: 27, color: "rgba(122,154,130,0.06)" },
      ],
      // L'attaquant avance, le bloc se compacte (max 20m) puis un défenseur déclenche le duel
      sequence: [
        {
          duration: 0,
          pions: {
            m1: { x: 20, y: 55 }, m4: { x: 74, y: 55 },
            d2: { x: 38, y: 68 }, b1: { x: 30, y: 35 },
          },
        },
        {
          duration: 1000,
          pions: {
            m1: { x: 20, y: 60 }, m4: { x: 74, y: 60 },
            d2: { x: 32, y: 58 }, b1: { x: 30, y: 50 },
          },
        },
        {
          duration: 900,
          pions: {
            m1: { x: 20, y: 55 }, m4: { x: 74, y: 55 },
            d2: { x: 38, y: 68 }, b1: { x: 30, y: 35 },
          },
        },
      ],
    },
  },

  {
    id: "EX_TAC04",
    name: "Situation DTN : 3 phases",
    family: "tactique",
    defaultDuration: 30,
    minPlayers: 16,
    maxPlayers: 22,
    description: "Enchaînement continu : Phase 1 Récupération (pressing) → Phase 2 Conservation (jeu de position) → Phase 3 Finition.",
    objectives: [
      "Enchaînement des 3 moments du jeu sans interruption",
      "Décision en moins de 3 secondes à chaque transition",
      "Automatismes collectifs en situation globale",
    ],
    instructions: "Chaque phase = décision collective en moins de 3 secondes. Le coach ne siffle pas entre les phases.",
    variants: [
      "Minuteur visible sur tablette pour les 3 secondes",
      "Bonus si les 3 phases s'enchaînent sans perte de balle",
    ],
    niveau: "semi_pro",
    positionSemaine: "j+2",
    intensite: "elevee",
    animation: {
      pions: [
        { id: "a1", x: 25, y: 40, team: "A", label: "6" },
        { id: "a2", x: 50, y: 45, team: "A", label: "8" },
        { id: "a3", x: 75, y: 40, team: "A", label: "10" },
        { id: "a4", x: 50, y: 20, team: "A", label: "9" },
        { id: "b1", x: 30, y: 60, team: "B", label: "5" },
        { id: "b2", x: 60, y: 58, team: "B", label: "4" },
      ],
      arrows: [
        { from: { x: 25, y: 40 }, to: { x: 50, y: 45 }, style: "solid", color: "#e07070" },
        { from: { x: 50, y: 45 }, to: { x: 75, y: 40 }, style: "solid", color: "#d4a847" },
        { from: { x: 75, y: 40 }, to: { x: 50, y: 20 }, style: "dashed", color: "#7A9A82" },
      ],
      zones: [
        { x: 5,  y: 55, width: 90, height: 20, color: "rgba(224,112,112,0.06)" },
        { x: 5,  y: 30, width: 90, height: 25, color: "rgba(212,168,71,0.06)"  },
        { x: 5,  y: 5,  width: 90, height: 25, color: "rgba(122,154,130,0.06)" },
      ],
      ball: { x: 25, y: 40 },
      // Enchaînement des 3 phases : récupération (rouge) → conservation (or) → finition (vert)
      sequence: [
        { duration: 0,   ball: { x: 25, y: 40 }, pions: {} },
        { duration: 700, ball: { x: 50, y: 45 }, pions: {} },
        { duration: 700, ball: { x: 75, y: 40 }, pions: {} },
        { duration: 900, ball: { x: 50, y: 20 }, pions: {} },
      ],
    },
  },

  // ─── FAMILLE 5 — JEU GLOBAL ────────────────────────────────────────────────

  {
    id: "EX_J01",
    name: "Match à thème : pressing haut",
    family: "jeu_global",
    defaultDuration: 20,
    minPlayers: 14,
    maxPlayers: 22,
    description: "Match 11v11 ou adapté. Règle : récupération obligatoire avant la ligne médiane, sinon but annulé.",
    objectives: [
      "Application du pressing haut en situation de match",
      "Récompenser l'équipe qui presse haut",
      "Automatismes en situation réelle",
    ],
    instructions: "But annulé si récupération après la ligne médiane. Coach arbitre et valide les buts.",
    variants: [
      "Pressing en 4-3-3 imposé",
      "Bonus si but marqué dans les 5s après récupération haute",
    ],
    niveau: "les_deux",
    positionSemaine: "j+4",
    intensite: "elevee",
    animation: {
      pions: [
        { id: "gk1", x: 50, y: 5, team: "A", label: "GK" },
        { id: "a1", x: 20, y: 25, team: "A", label: "2" },
        { id: "a2", x: 50, y: 20, team: "A", label: "5" },
        { id: "a3", x: 80, y: 25, team: "A", label: "3" },
        { id: "a4", x: 35, y: 45, team: "A", label: "8" },
        { id: "a5", x: 65, y: 45, team: "A", label: "10" },
        { id: "gk2", x: 50, y: 95, team: "B", label: "GK" },
        { id: "b1", x: 30, y: 70, team: "B", label: "9" },
        { id: "b2", x: 55, y: 60, team: "B", label: "6" },
      ],
      arrows: [
        { from: { x: 35, y: 45 }, to: { x: 30, y: 70 }, style: "solid", color: "#e07070" },
        { from: { x: 65, y: 45 }, to: { x: 55, y: 60 }, style: "solid", color: "#e07070" },
      ],
      zones: [
        { x: 5, y: 47, width: 90, height: 3, color: "rgba(224,112,112,0.30)" },
      ],
      ball: { x: 50, y: 95 },
      // Relance du gardien adverse pressée par les n°8 et 10 avant la ligne médiane
      sequence: [
        {
          duration: 0,
          ball: { x: 50, y: 95 },
          pions: { a4: { x: 35, y: 45 }, a5: { x: 65, y: 45 } },
        },
        {
          duration: 1000,
          ball: { x: 30, y: 70 },
          pions: { a4: { x: 32, y: 60 }, a5: { x: 58, y: 52 } },
        },
        {
          duration: 900,
          ball: { x: 50, y: 95 },
          pions: { a4: { x: 35, y: 45 }, a5: { x: 65, y: 45 } },
        },
      ],
    },
  },

  {
    id: "EX_J02",
    name: "Match à thème : jeu en largeur",
    family: "jeu_global",
    defaultDuration: 20,
    minPlayers: 14,
    maxPlayers: 22,
    description: "Match avec zones de but sur les côtés. Obligation de jouer dans les couloirs avant de tirer au but.",
    objectives: [
      "Utilisation de la largeur du terrain",
      "Animation des couloirs offensifs",
      "Centrage et jeu aérien",
    ],
    instructions: "But valable uniquement si une passe dans un couloir précède le tir. Couloirs : bandes latérales de 15m.",
    variants: [
      "Zones latérales élargies à 20m",
      "Joueur fixe (ailier) dans chaque couloir",
    ],
    niveau: "les_deux",
    positionSemaine: "j+4",
    intensite: "moderee",
    animation: {
      pions: [
        { id: "a1", x: 20, y: 50, team: "A", label: "7" },
        { id: "a2", x: 45, y: 45, team: "A", label: "10" },
        { id: "a3", x: 65, y: 35, team: "A", label: "9" },
        { id: "b1", x: 80, y: 50, team: "B", label: "11" },
        { id: "b2", x: 55, y: 55, team: "B", label: "8" },
      ],
      arrows: [
        { from: { x: 45, y: 45 }, to: { x: 20, y: 50 }, style: "solid" },
        { from: { x: 20, y: 50 }, to: { x: 65, y: 35 }, style: "dashed", color: "#7A9A82" },
      ],
      zones: [
        { x: 0,  y: 5, width: 18, height: 90, color: "rgba(122,154,130,0.10)" },
        { x: 82, y: 5, width: 18, height: 90, color: "rgba(122,154,130,0.10)" },
      ],
      ball: { x: 45, y: 45 },
      // Jeu dans le couloir avant le centre vers l'attaquant
      sequence: [
        { duration: 0,   ball: { x: 45, y: 45 }, pions: {} },
        { duration: 800, ball: { x: 20, y: 50 }, pions: {} },
        { duration: 900, ball: { x: 65, y: 35 }, pions: {} },
      ],
    },
  },

  {
    id: "EX_J03",
    name: "Match libre",
    family: "jeu_global",
    defaultDuration: 20,
    minPlayers: 10,
    maxPlayers: 22,
    description: "Jeu libre sans contraintes tactiques. Expression, plaisir, créativité individuelle.",
    objectives: [
      "Maintenir le plaisir de jouer",
      "Expression et créativité individuelle",
      "Décompression après séquences intensives",
    ],
    instructions: "Laisser jouer. Pas d'interruptions coach sauf faute dangereuse. Observer sans intervenir.",
    variants: [
      "Format 5v5 pour plus de touches de balle",
      "Buts de l'adversaire autorisés pour réduire la pression",
    ],
    niveau: "les_deux",
    positionSemaine: "j+4",
    intensite: "moderee",
    animation: {
      pions: [
        { id: "a1", x: 25, y: 30, team: "A", label: "9" },
        { id: "a2", x: 50, y: 40, team: "A", label: "10" },
        { id: "a3", x: 70, y: 25, team: "A", label: "7" },
        { id: "b1", x: 40, y: 60, team: "B", label: "6" },
        { id: "b2", x: 60, y: 65, team: "B", label: "4" },
        { id: "b3", x: 30, y: 70, team: "B", label: "5" },
      ],
      arrows: [
        { from: { x: 50, y: 40 }, to: { x: 25, y: 30 }, style: "dashed" },
      ],
      ball: { x: 50, y: 40 },
      // Circulation libre du ballon entre les 3 attaquants
      sequence: [
        { duration: 0,   ball: { x: 50, y: 40 }, pions: {} },
        { duration: 800, ball: { x: 25, y: 30 }, pions: {} },
        { duration: 800, ball: { x: 70, y: 25 }, pions: {} },
        { duration: 800, ball: { x: 50, y: 40 }, pions: {} },
      ],
    },
  },

  {
    id: "EX_J04",
    name: "Jeu réduit 5v5 tournant",
    family: "jeu_global",
    defaultDuration: 25,
    minPlayers: 15,
    maxPlayers: 22,
    description: "3 matchs 5v5 simultanés sur terrains 20×25m. Rotation toutes les 5 min. Intensité maximale, nombreux contacts balle.",
    objectives: [
      "Nombreux contacts balle par joueur",
      "Intensité et compétition",
      "Maintenir l'engagement en fin de séance",
    ],
    instructions: "Chaque équipe joue 3 rotations. L'équipe qui gagne le plus de matchs l'emporte. Chrono visible.",
    variants: [
      "Format 4v4 pour encore plus de contacts",
      "Petits buts sans GK pour favoriser la finition",
    ],
    niveau: "les_deux",
    positionSemaine: "j+4",
    intensite: "elevee",
    animation: {
      pions: [
        { id: "m1a", x: 15, y: 30, team: "A", label: "1" },
        { id: "m1b", x: 25, y: 50, team: "B", label: "2" },
        { id: "m2a", x: 50, y: 30, team: "A", label: "3" },
        { id: "m2b", x: 55, y: 55, team: "B", label: "4" },
        { id: "m3a", x: 80, y: 30, team: "A", label: "5" },
        { id: "m3b", x: 85, y: 55, team: "B", label: "6" },
      ],
      arrows: [],
      zones: [
        { x: 5,  y: 18, width: 28, height: 45, color: "rgba(122,154,130,0.06)" },
        { x: 38, y: 18, width: 28, height: 45, color: "rgba(122,154,130,0.06)" },
        { x: 71, y: 18, width: 28, height: 45, color: "rgba(122,154,130,0.06)" },
      ],
      ball: { x: 25, y: 50 },
      // Duels 1v1 simultanés dans les 3 mini-terrains — intensité maximale
      sequence: [
        {
          duration: 0,
          ball: { x: 25, y: 50 },
          pions: { m1a: { x: 15, y: 30 }, m2a: { x: 50, y: 30 }, m3a: { x: 80, y: 30 } },
        },
        {
          duration: 800,
          ball: { x: 20, y: 40 },
          pions: { m1a: { x: 20, y: 40 }, m2a: { x: 52, y: 42 }, m3a: { x: 82, y: 42 } },
        },
        {
          duration: 800,
          ball: { x: 25, y: 50 },
          pions: { m1a: { x: 15, y: 30 }, m2a: { x: 50, y: 30 }, m3a: { x: 80, y: 30 } },
        },
      ],
    },
  },

  {
    id: "EX_J05",
    name: "Retour au calme",
    family: "jeu_global",
    defaultDuration: 8,
    minPlayers: 10,
    maxPlayers: 22,
    description: "Footing très léger 2 min puis séquence : balancements jambes, rotations chevilles, étirements ischio en mouvement, ouvertures hanches, mobilisation colonne.",
    objectives: [
      "Récupération active et retour FC normale",
      "Prévention des courbatures",
      "Transition physique-mentale vers la fin de séance",
    ],
    instructions: "Aucune douleur. Amplitude progressive. Respiration profonde et lente.",
    variants: [
      "Finir par 2 min de cohérence cardiaque (respiration 5s/5s) pour récupération mentale",
      "Étirements statiques en cercle selon préférence coach",
    ],
    pedagogicNote: "C'est ici que les étirements statiques peuvent être ajoutés par le coach s'il le souhaite — ils sont contre-indiqués AVANT l'effort mais bénéfiques en fin de séance pour la récupération.",
    niveau: "les_deux",
    positionSemaine: "les_deux",
    intensite: "faible",
    animation: {
      pions: [
        { id: "c1", x: 35, y: 40, team: "A", label: "●" },
        { id: "c2", x: 50, y: 32, team: "A", label: "●" },
        { id: "c3", x: 65, y: 40, team: "A", label: "●" },
        { id: "c4", x: 65, y: 58, team: "A", label: "●" },
        { id: "c5", x: 50, y: 65, team: "A", label: "●" },
        { id: "c6", x: 35, y: 58, team: "A", label: "●" },
      ],
      arrows: [
        { from: { x: 35, y: 40 }, to: { x: 35, y: 58 }, style: "dashed" },
        { from: { x: 65, y: 40 }, to: { x: 65, y: 58 }, style: "dashed" },
      ],
      // Étirements dynamiques en cercle : amplitude douce vers l'extérieur puis retour
      sequence: [
        {
          duration: 0,
          pions: {
            c1: { x: 35, y: 40 }, c2: { x: 50, y: 32 }, c3: { x: 65, y: 40 },
            c4: { x: 65, y: 58 }, c5: { x: 50, y: 65 }, c6: { x: 35, y: 58 },
          },
        },
        {
          duration: 1300,
          pions: {
            c1: { x: 32, y: 37 }, c2: { x: 50, y: 27 }, c3: { x: 68, y: 37 },
            c4: { x: 68, y: 61 }, c5: { x: 50, y: 70 }, c6: { x: 32, y: 61 },
          },
        },
        {
          duration: 1300,
          pions: {
            c1: { x: 35, y: 40 }, c2: { x: 50, y: 32 }, c3: { x: 65, y: 40 },
            c4: { x: 65, y: 58 }, c5: { x: 50, y: 65 }, c6: { x: 35, y: 58 },
          },
        },
      ],
    },
  },
]

// Lookup par ID
export function getExerciseById(id: string): Exercise | undefined {
  return EXERCISES.find(e => e.id === id)
}

// Filtrage selon profil club
export function filterExercisesForProfile(
  exercises: Exercise[],
  level: "amateur" | "semi_pro",
  sessionType: "j+2" | "j+4" | "libre"
): Exercise[] {
  return exercises.filter(ex => {
    // Filtrer les exercices semi_pro si le club est amateur
    if (level === "amateur" && ex.niveau === "semi_pro") return false
    // Masquer le foncier lourd en J+4 pour les amateurs
    if (level === "amateur" && sessionType === "j+4" && ex.family === "foncier" && ex.intensite === "elevee") return false
    // Filtrer les positions séance
    if (ex.positionSemaine === "les_deux") return true
    if (sessionType === "libre") return true
    return ex.positionSemaine === sessionType
  })
}
