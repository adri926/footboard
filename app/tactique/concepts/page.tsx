import Link from "next/link"
import ConceptAnimation, { type ConceptFrame } from "@/components/pitch/ConceptAnimation"

const CONCEPTS: {
  id: string; icon: string; title: string; subtitle: string; body: string[]
  frames: ConceptFrame[]; tag: string
}[] = [
  {
    id: "pressing-haut",
    icon: "🔴",
    title: "Le pressing haut",
    subtitle: "Récupérer haut, défendre en attaquant",
    body: [
      "Le pressing haut consiste à empêcher l'adversaire de construire depuis l'arrière en envoyant des joueurs presser dès que le gardien ou les défenseurs ont le ballon. L'objectif est de provoquer une erreur dans une zone dangereuse pour l'adversaire.",
      "Il repose sur un trigger — un signal déclencheur — qui synchronise tout le bloc. Le plus courant : la passe latérale vers un défenseur ou la prise de balle dos au jeu. Dès ce signal, les attaquants ferment les lignes de passe et les milieux montent pour couper les relais.",
      "Les équipes qui pratiquent le pressing haut acceptent un risque derrière : si la pression est contournée, les espaces sont larges. C'est pourquoi le gegenpressing — pression immédiate après perte — est son complément naturel.",
    ],
    frames: [
      {
        caption: "Bloc compact en place — l'équipe attend le signal pour déclencher le pressing.",
        players: [
          { x: 38, y: 12, team: "away", label: "CB" },
          { x: 50, y: 30, team: "home", label: "ST" },
          { x: 82, y: 32, team: "home", label: "RW" },
          { x: 18, y: 32, team: "home", label: "LW" },
          { x: 78, y: 42, team: "home", label: "CM" },
          { x: 50, y: 40, team: "home", label: "CM" },
          { x: 22, y: 42, team: "home", label: "CM" },
        ],
        ball: { x: 38, y: 14 },
      },
      {
        caption: "Trigger : passe latérale vers le CB — tout le bloc monte d'un même mouvement.",
        players: [
          { x: 38, y: 15, team: "away", label: "CB" },
          { x: 38, y: 22, team: "home", label: "ST" },
          { x: 68, y: 22, team: "home", label: "RW" },
          { x: 28, y: 26, team: "home", label: "LW" },
          { x: 78, y: 42, team: "home", label: "CM" },
          { x: 50, y: 40, team: "home", label: "CM" },
          { x: 22, y: 42, team: "home", label: "CM" },
        ],
        arrows: [
          { x1: 50, y1: 30, x2: 38, y2: 22, type: "press" },
          { x1: 82, y1: 32, x2: 68, y2: 22, type: "press" },
          { x1: 18, y1: 32, x2: 28, y2: 26, type: "press" },
        ],
        ball: { x: 38, y: 25 },
      },
      {
        caption: "Ballon récupéré haut — transition immédiate vers le but adverse.",
        players: [
          { x: 44, y: 10, team: "away", label: "CB" },
          { x: 38, y: 18, team: "home", label: "ST" },
          { x: 72, y: 18, team: "home", label: "RW" },
          { x: 24, y: 20, team: "home", label: "LW" },
          { x: 74, y: 36, team: "home", label: "CM" },
          { x: 50, y: 34, team: "home", label: "CM" },
          { x: 26, y: 36, team: "home", label: "CM" },
        ],
        arrows: [{ x1: 38, y1: 22, x2: 38, y2: 18, type: "run" }],
        ball: { x: 38, y: 17 },
        durationMs: 3000,
      },
    ],
    tag: "Pressing",
  },
  {
    id: "transition-offensive",
    icon: "⚡",
    title: "La transition offensive",
    subtitle: "De la défense à l'attaque en 6 secondes",
    body: [
      "La transition offensive est le moment où une équipe passe d'une phase défensive à une phase offensive après avoir récupéré le ballon. C'est l'un des moments les plus dangereux du football moderne car l'adversaire est momentanément déséquilibré.",
      "La clé est la vitesse de décision. Le joueur qui récupère le ballon doit regarder vers l'avant immédiatement, pas vers l'arrière. Si une ligne de passe verticale est disponible, il faut l'exploiter avant que l'adversaire ne se réorganise.",
      "Les équipes entraînées à cette phase visent 6 à 8 secondes maximum entre la récupération et la première situation de danger. Au-delà, l'adversaire a eu le temps de se replacer et l'avantage numérique temporaire disparaît.",
    ],
    frames: [
      {
        caption: "Le milieu récupère le ballon — il regarde immédiatement vers l'avant.",
        players: [
          { x: 50, y: 70, team: "away", label: "CB" },
          { x: 50, y: 36, team: "home", label: "CM" },
          { x: 70, y: 42, team: "home", label: "RW" },
          { x: 50, y: 43, team: "home", label: "ST" },
          { x: 30, y: 42, team: "home", label: "LW" },
        ],
        ball: { x: 50, y: 36 },
      },
      {
        caption: "Passe directe sur l'attaquant — RW et LW partent aussitôt en profondeur.",
        players: [
          { x: 50, y: 75, team: "away", label: "CB" },
          { x: 54, y: 40, team: "home", label: "CM" },
          { x: 82, y: 62, team: "home", label: "RW" },
          { x: 50, y: 60, team: "home", label: "ST" },
          { x: 18, y: 62, team: "home", label: "LW" },
        ],
        arrows: [
          { x1: 50, y1: 36, x2: 50, y2: 58, type: "pass" },
          { x1: 70, y1: 42, x2: 82, y2: 62, type: "run" },
          { x1: 30, y1: 42, x2: 18, y2: 62, type: "run" },
        ],
        ball: { x: 50, y: 60 },
      },
      {
        caption: "Finition rapide — moins de 8 secondes entre récupération et occasion de but.",
        players: [
          { x: 62, y: 80, team: "away", label: "CB" },
          { x: 54, y: 50, team: "home", label: "CM" },
          { x: 88, y: 75, team: "home", label: "RW" },
          { x: 58, y: 68, team: "home", label: "ST" },
          { x: 22, y: 70, team: "home", label: "LW" },
        ],
        arrows: [{ x1: 58, y1: 68, x2: 88, y2: 74, type: "pass" }],
        ball: { x: 88, y: 74 },
        durationMs: 3000,
      },
    ],
    tag: "Transition",
  },
  {
    id: "triangle",
    icon: "🔷",
    title: "Le jeu en triangle",
    subtitle: "Créer des supériorités numériques locales",
    body: [
      "Le triangle est l'unité de base de la possession dans le football moderne. Trois joueurs forment un triangle pour offrir toujours deux options de passe au porteur, rendant la pression adverse quasi impossible à maintenir.",
      "Les triangles apparaissent naturellement sur les flancs : latéral + ailier + milieu excentré. Ou au centre : pivot + deux milieux relayeurs. L'ailier qui rentre et le latéral qui monte créent un triangle en mouvement qui désorganise la défense adverse.",
      "La clé est le positionnement : les trois joueurs ne doivent pas être alignés (sinon une pression en diagonale peut fermer deux options). Un joueur doit toujours être dans le dos du presseur adverse.",
    ],
    frames: [
      {
        caption: "Le latéral, l'ailier et le milieu forment un triangle — toujours deux solutions de passe.",
        players: [
          { x: 88, y: 30, team: "away", label: "LB" },
          { x: 82, y: 19, team: "home", label: "RW" },
          { x: 78, y: 33, team: "home", label: "CM" },
          { x: 82, y: 45, team: "home", label: "RB" },
        ],
        arrows: [
          { x1: 82, y1: 19, x2: 78, y2: 33, type: "triangle" },
          { x1: 78, y1: 33, x2: 82, y2: 45, type: "triangle" },
          { x1: 82, y1: 45, x2: 82, y2: 19, type: "triangle" },
        ],
        ball: { x: 82, y: 45 },
      },
      {
        caption: "Le RB joue dans l'axe — le RW fixe son défenseur pour ouvrir la ligne extérieure.",
        players: [
          { x: 88, y: 30, team: "away", label: "LB" },
          { x: 84, y: 16, team: "home", label: "RW" },
          { x: 78, y: 33, team: "home", label: "CM" },
          { x: 82, y: 45, team: "home", label: "RB" },
        ],
        arrows: [{ x1: 82, y1: 45, x2: 78, y2: 33, type: "pass" }],
        ball: { x: 78, y: 33 },
      },
      {
        caption: "Une-deux dans le dos du latéral — le triangle a fait sauter la pression.",
        players: [
          { x: 88, y: 22, team: "away", label: "LB" },
          { x: 90, y: 12, team: "home", label: "RW" },
          { x: 78, y: 33, team: "home", label: "CM" },
          { x: 84, y: 40, team: "home", label: "RB" },
        ],
        arrows: [{ x1: 78, y1: 33, x2: 90, y2: 12, type: "pass" }],
        ball: { x: 90, y: 12 },
        durationMs: 3000,
      },
    ],
    tag: "Possession",
  },
  {
    id: "433-moderne",
    icon: "📐",
    title: "Le 4-3-3 moderne",
    subtitle: "Pourquoi ce système domine le football depuis 2010",
    body: [
      "Le 4-3-3 est devenu le système dominant du football européen sous l'impulsion de Pep Guardiola au Barça (2008-2012), puis à Munich et City. Il allie largeur offensive, pressing organisé et construction courte depuis l'arrière.",
      "Sa force est dans sa polyvalence : en possession, il ressemble à un 3-4-3 (les latéraux montent, un milieu se décroche). Sans ballon, il redevient un 4-3-3 compact avec deux lignes de 4+3. Cette flexibilité le rend difficile à préparer pour l'adversaire.",
      "Le pivot — le milieu central du 3 — est la clé de voûte du système. Il doit casser les lignes en se décrochant entre les défenseurs et les milieux adverses pour recevoir et orienter. Iniesta, Modric et Busquets ont défini ce rôle.",
    ],
    frames: [
      {
        caption: "En possession : les latéraux montent, un milieu se décroche — le 4-3-3 devient un 3-4-3.",
        players: [
          { x: 84, y: 28, team: "home", label: "RB" },
          { x: 16, y: 28, team: "home", label: "LB" },
          { x: 70, y: 46, team: "home", label: "CM" },
          { x: 50, y: 42, team: "home", label: "CM" },
          { x: 30, y: 46, team: "home", label: "CM" },
          { x: 86, y: 20, team: "home", label: "RW" },
          { x: 50, y: 16, team: "home", label: "ST" },
          { x: 14, y: 20, team: "home", label: "LW" },
        ],
        ball: { x: 50, y: 42 },
        durationMs: 3000,
      },
      {
        caption: "Sans ballon : bloc compact 4-3-3, deux lignes de 4 et 3 prêtes à presser.",
        players: [
          { x: 80, y: 32, team: "home", label: "RB" },
          { x: 20, y: 32, team: "home", label: "LB" },
          { x: 78, y: 42, team: "home", label: "CM" },
          { x: 50, y: 40, team: "home", label: "CM" },
          { x: 22, y: 42, team: "home", label: "CM" },
          { x: 84, y: 24, team: "home", label: "RW" },
          { x: 50, y: 30, team: "home", label: "ST" },
          { x: 16, y: 24, team: "home", label: "LW" },
        ],
        ball: { x: 38, y: 25 },
        durationMs: 3000,
      },
    ],
    tag: "Système",
  },
  {
    id: "bloc-bas",
    icon: "🛡",
    title: "Le bloc bas",
    subtitle: "Défendre profond sans subir",
    body: [
      "Le bloc bas consiste à positionner toute l'équipe dans sa propre moitié de terrain, en formant deux lignes denses (généralement 4-4-2 ou 5-4-1), pour fermer les espaces entre les lignes et sur les côtés. L'objectif est d'annuler les qualités offensives adverses par la densité défensive.",
      "C'est une arme tactique légitime utilisée par des équipes moins bien dotées qui misent sur le contre. Il exige une organisation collective extrême : les 10 joueurs de champ doivent être constamment en phase, les lignes restent compactes (moins de 25 mètres entre défense et attaque).",
      "Les transitions sont l'arme principale des équipes en bloc bas. Après une récupération, un ou deux appels rapides en profondeur sur les côtés ou dans le dos de la défense adverse suffisent à créer des situations dangereuses.",
    ],
    frames: [
      {
        caption: "Bloc bas : deux lignes denses, moins de 25 mètres entre défense et attaque.",
        players: [
          { x: 55, y: 85, team: "away", label: "ST" },
          { x: 65, y: 37, team: "home", label: "RW" },
          { x: 50, y: 38, team: "home", label: "ST" },
          { x: 35, y: 37, team: "home", label: "LW" },
          { x: 70, y: 31, team: "home", label: "CM" },
          { x: 52, y: 29, team: "home", label: "CM" },
          { x: 34, y: 31, team: "home", label: "CM" },
          { x: 80, y: 22, team: "home", label: "RB" },
          { x: 62, y: 20, team: "home", label: "CB" },
          { x: 38, y: 20, team: "home", label: "CB" },
          { x: 20, y: 22, team: "home", label: "LB" },
        ],
        ball: { x: 55, y: 85 },
      },
      {
        caption: "Le bloc absorbe l'attaque — interception dans l'axe, prêt à relancer en transition.",
        players: [
          { x: 68, y: 75, team: "away", label: "ST" },
          { x: 65, y: 37, team: "home", label: "RW" },
          { x: 50, y: 38, team: "home", label: "ST" },
          { x: 35, y: 37, team: "home", label: "LW" },
          { x: 70, y: 31, team: "home", label: "CM" },
          { x: 56, y: 44, team: "home", label: "CM" },
          { x: 34, y: 31, team: "home", label: "CM" },
          { x: 80, y: 22, team: "home", label: "RB" },
          { x: 62, y: 20, team: "home", label: "CB" },
          { x: 38, y: 20, team: "home", label: "CB" },
          { x: 20, y: 22, team: "home", label: "LB" },
        ],
        arrows: [{ x1: 52, y1: 29, x2: 56, y2: 44, type: "run" }],
        ball: { x: 56, y: 44 },
      },
      {
        caption: "Transition immédiate : un seul appel en profondeur suffit à punir l'adversaire.",
        players: [
          { x: 80, y: 60, team: "away", label: "ST" },
          { x: 80, y: 60, team: "home", label: "RW" },
          { x: 58, y: 55, team: "home", label: "ST" },
          { x: 35, y: 37, team: "home", label: "LW" },
          { x: 70, y: 31, team: "home", label: "CM" },
          { x: 56, y: 44, team: "home", label: "CM" },
          { x: 34, y: 31, team: "home", label: "CM" },
          { x: 80, y: 22, team: "home", label: "RB" },
          { x: 62, y: 20, team: "home", label: "CB" },
          { x: 38, y: 20, team: "home", label: "CB" },
          { x: 20, y: 22, team: "home", label: "LB" },
        ],
        arrows: [
          { x1: 56, y1: 44, x2: 80, y2: 58, type: "pass" },
          { x1: 65, y1: 37, x2: 80, y2: 60, type: "run" },
        ],
        ball: { x: 80, y: 58 },
        durationMs: 3000,
      },
    ],
    tag: "Défense",
  },
  {
    id: "gegenpressing",
    icon: "🔄",
    title: "Le gegenpressing",
    subtitle: "La philosophie de Klopp — récupérer le ballon immédiatement",
    body: [
      "Le gegenpressing (contre-pressing en allemand) est la réaction immédiate après une perte de balle. Au lieu de se replier, l'équipe presse instinctivement l'adversaire dans les secondes qui suivent la perte, profitant du fait que les joueurs adverses ne sont pas encore organisés.",
      "Jürgen Klopp l'a popularisé au Borussia Dortmund (2008-2015) puis à Liverpool. Sa théorie : \"Le meilleur playmaker du monde est le pressing.\" L'équipe adverse sous pression produit des erreurs qui créent des occasions encore plus dangereuses qu'un schéma d'attaque élaboré.",
      "Pour que le gegenpressing fonctionne, les joueurs qui perdent le ballon ne doivent pas se sentir libres — ils ont la responsabilité collective de participer au pressing immédiatement. C'est un état d'esprit autant qu'une tactique.",
    ],
    frames: [
      {
        caption: "Ballon perdu — au lieu de reculer, l'équipe presse instantanément, en bloc.",
        players: [
          { x: 50, y: 38, team: "away", label: "CM" },
          { x: 72, y: 30, team: "home", label: "RW" },
          { x: 50, y: 28, team: "home", label: "ST" },
          { x: 28, y: 30, team: "home", label: "LW" },
          { x: 74, y: 28, team: "home", label: "CM" },
          { x: 50, y: 26, team: "home", label: "CM" },
          { x: 26, y: 28, team: "home", label: "CM" },
        ],
        ball: { x: 50, y: 38 },
      },
      {
        caption: "Cinq joueurs convergent en quelques secondes — l'adversaire n'a pas le temps de s'organiser.",
        players: [
          { x: 50, y: 43, team: "away", label: "CM" },
          { x: 68, y: 37, team: "home", label: "RW" },
          { x: 50, y: 38, team: "home", label: "ST" },
          { x: 32, y: 37, team: "home", label: "LW" },
          { x: 70, y: 35, team: "home", label: "CM" },
          { x: 50, y: 33, team: "home", label: "CM" },
          { x: 30, y: 35, team: "home", label: "CM" },
        ],
        arrows: [
          { x1: 78, y1: 33, x2: 70, y2: 35, type: "run" },
          { x1: 50, y1: 30, x2: 50, y2: 33, type: "run" },
          { x1: 22, y1: 33, x2: 30, y2: 35, type: "run" },
        ],
        ball: { x: 50, y: 35 },
      },
      {
        caption: "Ballon regagné à 30 mètres du but — exactement la zone visée par Klopp.",
        players: [
          { x: 53, y: 46, team: "away", label: "CM" },
          { x: 66, y: 38, team: "home", label: "RW" },
          { x: 50, y: 40, team: "home", label: "ST" },
          { x: 33, y: 38, team: "home", label: "LW" },
          { x: 68, y: 36, team: "home", label: "CM" },
          { x: 50, y: 36, team: "home", label: "CM" },
          { x: 31, y: 36, team: "home", label: "CM" },
        ],
        ball: { x: 50, y: 36 },
        durationMs: 3000,
      },
    ],
    tag: "Pressing",
  },
  {
    id: "retour-defensif",
    icon: "↩",
    title: "Le repli défensif organisé",
    subtitle: "Reformer le bloc avant que l'adversaire n'exploite l'espace",
    body: [
      "Quand le gegenpressing échoue ou n'est pas la consigne, l'alternative est le repli défensif organisé : au lieu de courir tous vers le ballon en désordre, le joueur le plus proche temporise — il retarde le porteur sans tacler — pendant que ses coéquipiers sprintent pour reformer les lignes derrière lui.",
      "La notion clé est l'ombre de couverture (cover shadow) : se positionner entre le porteur et une option de passe pour fermer la ligne tout en reculant, plutôt que de marquer un joueur individuellement. Cela ralentit la progression adverse sans casser la compacité du bloc.",
      "Diego Simeone a bâti la réputation défensive de l'Atlético Madrid sur cette discipline collective : si la récupération immédiate échoue, l'équipe entière recule comme un seul bloc en quelques secondes, refusant les espaces entre les lignes plutôt que de presser dans le désordre.",
    ],
    frames: [
      {
        caption: "Ballon perdu haut sur le terrain — l'adversaire récupère en position de transition.",
        players: [
          { x: 65, y: 68, team: "away", label: "ST" },
          { x: 82, y: 65, team: "home", label: "RW" },
          { x: 55, y: 63, team: "home", label: "ST" },
          { x: 28, y: 67, team: "home", label: "LW" },
          { x: 75, y: 50, team: "home", label: "CM" },
          { x: 58, y: 55, team: "home", label: "CM" },
          { x: 30, y: 50, team: "home", label: "CM" },
          { x: 85, y: 40, team: "home", label: "RB" },
          { x: 15, y: 42, team: "home", label: "LB" },
        ],
        ball: { x: 65, y: 68 },
      },
      {
        caption: "Le plus proche temporise pendant que les autres sprintent reformer les lignes.",
        players: [
          { x: 65, y: 75, team: "away", label: "ST" },
          { x: 75, y: 52, team: "home", label: "RW" },
          { x: 50, y: 50, team: "home", label: "ST" },
          { x: 25, y: 52, team: "home", label: "LW" },
          { x: 72, y: 43, team: "home", label: "CM" },
          { x: 52, y: 52, team: "home", label: "CM" },
          { x: 28, y: 43, team: "home", label: "CM" },
          { x: 82, y: 45, team: "home", label: "RB" },
          { x: 18, y: 47, team: "home", label: "LB" },
        ],
        arrows: [
          { x1: 82, y1: 65, x2: 75, y2: 52, type: "run" },
          { x1: 55, y1: 63, x2: 50, y2: 50, type: "run" },
          { x1: 28, y1: 67, x2: 25, y2: 52, type: "run" },
        ],
        ball: { x: 65, y: 65 },
      },
      {
        caption: "Bloc reformé en quelques secondes — plus d'espace entre les lignes à exploiter.",
        players: [
          { x: 60, y: 58, team: "away", label: "ST" },
          { x: 70, y: 48, team: "home", label: "RW" },
          { x: 50, y: 46, team: "home", label: "ST" },
          { x: 30, y: 48, team: "home", label: "LW" },
          { x: 65, y: 38, team: "home", label: "CM" },
          { x: 50, y: 42, team: "home", label: "CM" },
          { x: 35, y: 38, team: "home", label: "CM" },
          { x: 78, y: 38, team: "home", label: "RB" },
          { x: 22, y: 40, team: "home", label: "LB" },
        ],
        ball: { x: 60, y: 58 },
        durationMs: 3000,
      },
    ],
    tag: "Transition",
  },
  {
    id: "construction-arriere",
    icon: "🧤",
    title: "La construction depuis l'arrière",
    subtitle: "Sortir du pressing adverse par le jeu court",
    body: [
      "La construction depuis l'arrière consiste à faire progresser le ballon par des passes courtes entre le gardien et les défenseurs plutôt que de dégager long. L'objectif est d'attirer le pressing adverse sur soi pour créer, plus loin, une supériorité numérique dans les lignes suivantes.",
      "Le terme \"salida lavolpiana\" — du nom de l'entraîneur argentin Ricardo La Volpe — désigne la sortie à trois défenseurs : le défenseur central s'écarte, les latéraux montent haut, formant des triangles de passe. Le gardien devient un relayeur presque comme un joueur de champ (sweeper-keeper).",
      "C'est un pari risqué : une perte de balle près de sa propre surface peut coûter un but immédiat. Cela exige une qualité technique et un sang-froid collectif élevés — Pep Guardiola en a fait une doctrine systémique à Barcelone puis Manchester City.",
    ],
    frames: [
      {
        caption: "Le gardien devient un relayeur — les défenseurs s'écartent pour ouvrir des angles de passe.",
        players: [
          { x: 50, y: 14, team: "away", label: "ST" },
          { x: 50, y: 8, team: "home", label: "GK" },
          { x: 68, y: 16, team: "home", label: "CB" },
          { x: 32, y: 16, team: "home", label: "CB" },
          { x: 80, y: 30, team: "home", label: "RB" },
          { x: 55, y: 28, team: "home", label: "CM" },
          { x: 72, y: 36, team: "home", label: "CM" },
        ],
        ball: { x: 50, y: 8 },
      },
      {
        caption: "Le ballon circule vers le côté libre — le pressing adverse est attiré et décalé.",
        players: [
          { x: 55, y: 16, team: "away", label: "ST" },
          { x: 50, y: 8, team: "home", label: "GK" },
          { x: 70, y: 18, team: "home", label: "CB" },
          { x: 30, y: 18, team: "home", label: "CB" },
          { x: 80, y: 30, team: "home", label: "RB" },
          { x: 58, y: 26, team: "home", label: "CM" },
          { x: 72, y: 36, team: "home", label: "CM" },
        ],
        arrows: [
          { x1: 88, y1: 22, x2: 80, y2: 30, type: "run" },
          { x1: 58, y1: 26, x2: 80, y2: 30, type: "pass" },
        ],
        ball: { x: 80, y: 30 },
      },
      {
        caption: "Une fois le pressing dépassé, l'équipe dispose d'une supériorité numérique devant elle.",
        players: [
          { x: 48, y: 22, team: "away", label: "ST" },
          { x: 50, y: 8, team: "home", label: "GK" },
          { x: 70, y: 18, team: "home", label: "CB" },
          { x: 30, y: 18, team: "home", label: "CB" },
          { x: 80, y: 30, team: "home", label: "RB" },
          { x: 58, y: 26, team: "home", label: "CM" },
          { x: 72, y: 40, team: "home", label: "CM" },
        ],
        arrows: [{ x1: 80, y1: 30, x2: 72, y2: 40, type: "pass" }],
        ball: { x: 72, y: 40 },
        durationMs: 3000,
      },
    ],
    tag: "Construction",
  },
  {
    id: "triangle-milieu",
    icon: "🔺",
    title: "Le tiki-taka et les triangles centraux",
    subtitle: "Conserver et progresser par la rotation permanente",
    body: [
      "Le tiki-taka désigne un jeu de passes courtes et rapides organisées en triangles mobiles au milieu de terrain, pour conserver le ballon et briser les lignes adverses progressivement. Popularisé par le Barcelone de Guardiola et l'Espagne championne du monde (2008-2012).",
      "L'exercice fondateur est le rondo : un jeu réduit en cercle où des joueurs en surnombre doivent garder le ballon face à des défenseurs au centre. Il enseigne le jeu à une ou deux touches et l'orientation du corps pour recevoir en demi-tour, prêt à jouer vers l'avant.",
      "La critique classique du tiki-taka est de devenir stérile — la possession pour la possession, sans intention de progresser. Son évolution moderne insiste sur la verticalité dans la possession : utiliser les triangles pour trouver la passe vers l'avant, pas seulement faire circuler le ballon latéralement.",
    ],
    frames: [
      {
        caption: "Premier triangle : ballon à droite, deux solutions de passe disponibles.",
        players: [
          { x: 50, y: 20, team: "away", label: "CM" },
          { x: 78, y: 33, team: "home", label: "CM" },
          { x: 50, y: 30, team: "home", label: "CM" },
          { x: 22, y: 33, team: "home", label: "CM" },
        ],
        arrows: [
          { x1: 78, y1: 33, x2: 50, y2: 30, type: "triangle" },
          { x1: 50, y1: 30, x2: 22, y2: 33, type: "triangle" },
          { x1: 22, y1: 33, x2: 78, y2: 33, type: "triangle" },
        ],
        ball: { x: 78, y: 33 },
      },
      {
        caption: "Rotation permanente — le ballon circule plus vite que l'adversaire ne peut presser.",
        players: [
          { x: 78, y: 33, team: "home", label: "CM" },
          { x: 50, y: 30, team: "home", label: "CM" },
          { x: 22, y: 33, team: "home", label: "CM" },
          { x: 50, y: 20, team: "away", label: "CM" },
        ],
        arrows: [
          { x1: 78, y1: 33, x2: 50, y2: 30, type: "triangle" },
          { x1: 50, y1: 30, x2: 22, y2: 33, type: "triangle" },
          { x1: 22, y1: 33, x2: 78, y2: 33, type: "triangle" },
        ],
        ball: { x: 50, y: 30 },
      },
      {
        caption: "Bascule vers le côté faible — l'équipe progresse en gardant toujours la possession.",
        players: [
          { x: 80, y: 30, team: "home", label: "CM" },
          { x: 50, y: 28, team: "home", label: "CM" },
          { x: 20, y: 36, team: "home", label: "CM" },
          { x: 54, y: 22, team: "away", label: "CM" },
        ],
        arrows: [
          { x1: 80, y1: 30, x2: 50, y2: 28, type: "triangle" },
          { x1: 50, y1: 28, x2: 20, y2: 36, type: "triangle" },
          { x1: 20, y1: 36, x2: 80, y2: 30, type: "triangle" },
        ],
        ball: { x: 20, y: 36 },
        durationMs: 3000,
      },
    ],
    tag: "Possession",
  },
  {
    id: "triangle-zone-centrale",
    icon: "🎯",
    title: "Les combinaisons dans la zone de finition",
    subtitle: "Surcharger la surface pour créer le dernier geste",
    body: [
      "Dans les vingt derniers mètres, la qualité individuelle ne suffit plus : il faut surcharger la surface par des rotations entre l'attaquant, le milieu offensif et l'ailier — remises, appels croisés, une-deux — pour ouvrir une brèche dans une défense regroupée.",
      "Le concept clé est la course du troisième homme (third-man run) : pendant que deux joueurs combinent et attirent l'attention du défenseur, un troisième part dans son dos, hors de son champ de vision. C'est un principe central de l'école italienne du jeu de zone, théorisée notamment par Arrigo Sacchi.",
      "Tout repose sur le timing : la course doit démarrer au moment précis où le défenseur s'engage sur le ballon — trop tôt, elle est lue et neutralisée (ou hors-jeu) ; trop tard, l'espace s'est refermé. C'est l'automatisme le plus difficile à entraîner car il dépend de la complicité entre joueurs.",
    ],
    frames: [
      {
        caption: "Le milieu fixe la défense — l'attaquant et l'ailier se préparent à combiner.",
        players: [
          { x: 38, y: 60, team: "away", label: "CB" },
          { x: 60, y: 62, team: "away", label: "CB" },
          { x: 50, y: 38, team: "home", label: "CM" },
          { x: 50, y: 52, team: "home", label: "ST" },
          { x: 28, y: 50, team: "home", label: "LW" },
        ],
        ball: { x: 50, y: 38 },
      },
      {
        caption: "Remise immédiate de l'attaquant — le troisième homme s'engage dans l'espace.",
        players: [
          { x: 40, y: 52, team: "away", label: "CB" },
          { x: 58, y: 55, team: "away", label: "CB" },
          { x: 52, y: 42, team: "home", label: "CM" },
          { x: 50, y: 52, team: "home", label: "ST" },
          { x: 34, y: 46, team: "home", label: "LW" },
        ],
        arrows: [
          { x1: 50, y1: 38, x2: 50, y2: 52, type: "pass" },
          { x1: 28, y1: 50, x2: 34, y2: 46, type: "run" },
        ],
        ball: { x: 50, y: 52 },
      },
      {
        caption: "Le troisième homme surgit dans le dos de la défense — la combinaison a fait mouche.",
        players: [
          { x: 40, y: 52, team: "away", label: "CB" },
          { x: 58, y: 55, team: "away", label: "CB" },
          { x: 52, y: 44, team: "home", label: "CM" },
          { x: 50, y: 52, team: "home", label: "ST" },
          { x: 42, y: 40, team: "home", label: "LW" },
        ],
        arrows: [{ x1: 50, y1: 52, x2: 42, y2: 40, type: "pass" }],
        ball: { x: 42, y: 40 },
        durationMs: 3000,
      },
    ],
    tag: "Attaque",
  },
  {
    id: "faux-9",
    icon: "🎭",
    title: "Le faux numéro 9",
    subtitle: "Un attaquant qui n'attaque pas là où on l'attend",
    body: [
      "Le faux numéro 9 est un attaquant de pointe qui, au lieu de rester sur la dernière ligne, décroche volontairement vers le milieu de terrain pour venir chercher le ballon. En quittant sa zone naturelle, il emmène son marqueur avec lui — ou le laisse hésiter — et ouvre un espace immense dans le dos de la défense.",
      "La référence moderne est la Roma de Luciano Spalletti avec Francesco Totti (2006), où le capitaine romain abandonnait sa position de pointe pour orchestrer le jeu depuis l'entrejeu. Pep Guardiola a ensuite porté le concept à son sommet avec Lionel Messi au Barça (2009-2012) : aucun défenseur central ne savait s'il devait le suivre ou tenir sa ligne.",
      "C'est un dilemme sans bonne réponse pour la défense : suivre le faux 9 dans le bloc, c'est ouvrir un boulevard derrière soi ; ne pas le suivre, c'est lui laisser tout l'espace pour orienter le jeu. Dans les deux cas, ce sont les ailiers ou les milieux qui doivent immédiatement exploiter la zone libérée — un timing de course identique au principe du « troisième homme ».",
    ],
    frames: [
      {
        caption: "L'attaquant occupe la dernière ligne — le défenseur central le surveille de près.",
        players: [
          { x: 50, y: 26, team: "away", label: "CB" },
          { x: 50, y: 32, team: "home", label: "ST" },
          { x: 78, y: 40, team: "home", label: "RW" },
          { x: 22, y: 40, team: "home", label: "LW" },
          { x: 50, y: 36, team: "home", label: "CM" },
        ],
        ball: { x: 50, y: 36 },
      },
      {
        caption: "Le faux 9 décroche entre les lignes — son marqueur hésite à le suivre.",
        players: [
          { x: 50, y: 30, team: "away", label: "CB" },
          { x: 50, y: 45, team: "home", label: "ST" },
          { x: 68, y: 52, team: "home", label: "RW" },
          { x: 32, y: 52, team: "home", label: "LW" },
          { x: 50, y: 40, team: "home", label: "CM" },
        ],
        arrows: [
          { x1: 50, y1: 30, x2: 50, y2: 45, type: "run" },
          { x1: 78, y1: 33, x2: 68, y2: 52, type: "run" },
          { x1: 22, y1: 33, x2: 32, y2: 52, type: "run" },
        ],
        ball: { x: 50, y: 45 },
      },
      {
        caption: "L'espace libéré dans son dos est exploité par l'ailier qui s'y engouffre.",
        players: [
          { x: 50, y: 38, team: "away", label: "CB" },
          { x: 50, y: 46, team: "home", label: "ST" },
          { x: 56, y: 30, team: "home", label: "RW" },
          { x: 40, y: 50, team: "home", label: "LW" },
          { x: 50, y: 42, team: "home", label: "CM" },
        ],
        arrows: [{ x1: 50, y1: 45, x2: 56, y2: 30, type: "pass" }],
        ball: { x: 56, y: 30 },
        durationMs: 3000,
      },
    ],
    tag: "Attaque",
  },
]

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
              <article key={c.id}
                className="rounded-2xl overflow-hidden"
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
