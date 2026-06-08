import Link from "next/link"
import ConceptAnimation, { type ConceptFrame } from "@/components/pitch/ConceptAnimation"

// ───────────────────────── Silhouettes 11 vs 11 ─────────────────────────
// Chaque concept anime une situation précise tout en gardant les deux
// équipes au complet sur le terrain (11 joueurs face à 11), pour rester
// fidèle à une vraie configuration de match.

type Team = "home" | "away"
interface Pawn { x: number; y: number; team: Team; label: string }

function squad(team: Team, spots: [string, number, number][]): Pawn[] {
  return spots.map(([label, x, y]) => ({ team, label, x, y }))
}
function move(list: Pawn[], overrides: Record<number, [number, number]>): Pawn[] {
  return list.map((p, i) => (overrides[i] ? { ...p, x: overrides[i][0], y: overrides[i][1] } : { ...p }))
}
function shiftY(list: Pawn[], dy: number): Pawn[] {
  return list.map(p => ({ ...p, y: p.y + dy }))
}

interface ConceptDef {
  id: string; icon: string; title: string; subtitle: string; body: string[]
  frames: ConceptFrame[]; tag: string
}
function concept(c: ConceptDef): ConceptDef { return c }

const CONCEPTS: ConceptDef[] = [
  // ───────────────────────────── 1. Pressing haut ─────────────────────────────
  ...(() => {
    const AWAY = squad("away", [
      ["GB",50,8], ["DG",78,22], ["DC",60,18], ["DC",40,18], ["DD",22,22],
      ["MDC",50,32], ["MC",68,34], ["MC",32,34],
      ["AG",78,46], ["BU",50,44], ["AD",22,46],
    ])
    const HOME = squad("home", [
      ["GB",50,86], ["DD",76,50], ["DC",60,54], ["DC",40,54], ["DG",24,50],
      ["MDC",50,40], ["MC",70,38], ["MC",30,38],
      ["AD",76,26], ["BU",50,24], ["AG",24,26],
    ])
    return [concept({
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
          players: [...AWAY, ...shiftY(HOME, 12)],
          ball: { x: 40, y: 20 },
        },
        {
          caption: "Trigger : passe latérale vers le défenseur central — tout le bloc monte d'un même mouvement.",
          players: [
            ...move(AWAY, { 3: [44, 19] }),
            ...move(HOME, { 8: [66, 22], 9: [56, 18], 10: [34, 22] }),
          ],
          arrows: [
            { x1: 76, y1: 26, x2: 66, y2: 22, type: "press" },
            { x1: 50, y1: 24, x2: 56, y2: 18, type: "press" },
            { x1: 24, y1: 26, x2: 34, y2: 22, type: "press" },
          ],
          ball: { x: 60, y: 19 },
        },
        {
          caption: "Ballon récupéré haut — transition immédiate vers le but adverse.",
          players: [
            ...move(AWAY, { 2: [64, 24] }),
            ...move(shiftY(HOME, -10), { 9: [58, 16] }),
          ],
          arrows: [{ x1: 56, y1: 18, x2: 58, y2: 16, type: "run" }],
          ball: { x: 58, y: 15 },
          durationMs: 3000,
        },
      ],
      tag: "Pressing",
    })]
  })(),

  // ───────────────────────── 2. Transition offensive ─────────────────────────
  ...(() => {
    const HOME = squad("home", [
      ["GB",50,10], ["DD",72,26], ["DC",56,22], ["DC",44,22], ["DG",28,26],
      ["MDC",50,38], ["MC",66,44], ["MC",34,44],
      ["AD",74,56], ["BU",50,52], ["AG",26,56],
    ])
    const AWAY = squad("away", [
      ["GB",50,90], ["DG",66,72], ["DC",56,78], ["DC",44,78], ["DD",34,72],
      ["MDC",50,64], ["MC",60,56], ["MC",40,56],
      ["AG",62,34], ["BU",50,30], ["AD",38,34],
    ])
    return [concept({
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
          caption: "Le milieu défensif récupère le ballon — il regarde immédiatement vers l'avant. L'adversaire est pris à contre-pied, son attaque encore engagée.",
          players: [...HOME, ...AWAY],
          ball: { x: 50, y: 38 },
        },
        {
          caption: "Passe directe sur le buteur — l'ailier droit et l'ailier gauche partent aussitôt en profondeur.",
          players: [
            ...move(HOME, { 5: [54, 46], 8: [80, 76], 9: [50, 66], 10: [20, 76] }),
            ...move(AWAY, { 0: [50, 92] }),
          ],
          arrows: [
            { x1: 50, y1: 38, x2: 50, y2: 64, type: "pass" },
            { x1: 74, y1: 56, x2: 80, y2: 76, type: "run" },
            { x1: 26, y1: 56, x2: 20, y2: 76, type: "run" },
          ],
          ball: { x: 50, y: 64 },
        },
        {
          caption: "Finition rapide — moins de 8 secondes entre récupération et occasion de but.",
          players: [
            ...move(HOME, { 5: [56, 50], 8: [88, 86], 9: [58, 78], 10: [24, 80] }),
            ...move(AWAY, { 1: [72, 80], 0: [58, 92] }),
          ],
          arrows: [{ x1: 58, y1: 78, x2: 88, y2: 86, type: "pass" }],
          ball: { x: 88, y: 85 },
          durationMs: 3000,
        },
      ],
      tag: "Transition",
    })]
  })(),

  // ───────────────────────────── 3. Jeu en triangle ─────────────────────────────
  ...(() => {
    const HOME = squad("home", [
      ["GB",50,90],
      ["DD",82,45], ["DC",60,66], ["DC",40,66], ["DG",18,52],
      ["MDC",50,58], ["MC",78,33], ["MC",24,50],
      ["AD",82,19], ["BU",50,38], ["AG",20,32],
    ])
    const AWAY = squad("away", [
      ["GB",50,8],
      ["DD",88,30], ["DC",60,20], ["DC",40,20], ["DG",14,28],
      ["MDC",50,34], ["MC",66,42], ["MC",34,42],
      ["AG",78,52], ["BU",50,50], ["AD",22,52],
    ])
    return [concept({
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
          caption: "Le latéral droit, l'ailier droit et le milieu forment un triangle — toujours deux solutions de passe.",
          players: [...HOME, ...AWAY],
          arrows: [
            { x1: 82, y1: 19, x2: 78, y2: 33, type: "triangle" },
            { x1: 78, y1: 33, x2: 82, y2: 45, type: "triangle" },
            { x1: 82, y1: 45, x2: 82, y2: 19, type: "triangle" },
          ],
          ball: { x: 82, y: 45 },
        },
        {
          caption: "Le latéral joue dans l'axe — l'ailier fixe son défenseur pour ouvrir la ligne extérieure.",
          players: [
            ...move(HOME, { 7: [86, 16] }),
            ...move(AWAY, { 1: [86, 26] }),
          ],
          arrows: [{ x1: 82, y1: 45, x2: 78, y2: 33, type: "pass" }],
          ball: { x: 78, y: 33 },
        },
        {
          caption: "Une-deux dans le dos du latéral — le triangle a fait sauter la pression.",
          players: [
            ...move(HOME, { 7: [90, 10], 1: [84, 38] }),
            ...move(AWAY, { 1: [88, 20] }),
          ],
          arrows: [{ x1: 78, y1: 33, x2: 90, y2: 10, type: "pass" }],
          ball: { x: 90, y: 10 },
          durationMs: 3000,
        },
      ],
      tag: "Possession",
    })]
  })(),

  // ───────────────────────────── 4. 4-3-3 moderne ─────────────────────────────
  ...(() => {
    const HOME = squad("home", [
      ["GB",50,6],
      ["DD",84,28], ["DC",64,18], ["DC",36,18], ["DG",16,28],
      ["MC",70,46], ["MC",50,42], ["MC",30,46],
      ["AD",86,20], ["BU",50,16], ["AG",14,20],
    ])
    const AWAY = squad("away", [
      ["GB",50,94],
      ["DG",82,72], ["DC",62,82], ["DC",38,82], ["DD",18,72],
      ["MG",78,60], ["MC",58,64], ["MC",42,64], ["MD",22,60],
      ["BU",60,50], ["BU",40,50],
    ])
    return [concept({
      id: "433-moderne",
      icon: "📐",
      title: "Le 4-3-3 moderne",
      subtitle: "Pourquoi ce système domine le football depuis 2010",
      body: [
        "Le 4-3-3 est devenu le système dominant du football européen sous l'impulsion de Pep Guardiola au Barça (2008-2012), puis à Munich et City. Il allie largeur offensive, pressing organisé et construction courte depuis l'arrière.",
        "Sa force est dans sa polyvalence : en possession, il ressemble à un 3-4-3 (les latéraux montent, un milieu se décroche). Sans ballon, il redevient un 4-3-3 compact avec deux lignes de 4 et 3. Cette flexibilité le rend difficile à préparer pour l'adversaire.",
        "Le pivot — le milieu central du losange — est la clé de voûte du système. Il doit casser les lignes en se décrochant entre les défenseurs et les milieux adverses pour recevoir et orienter. Iniesta, Modric et Busquets ont défini ce rôle.",
      ],
      frames: [
        {
          caption: "En possession : les latéraux montent, un milieu se décroche — le 4-3-3 devient un 3-4-3.",
          players: [...HOME, ...AWAY],
          ball: { x: 50, y: 42 },
          durationMs: 3000,
        },
        {
          caption: "Sans ballon : bloc compact 4-3-3, deux lignes de 4 et 3 prêtes à presser.",
          players: [
            ...move(HOME, {
              1: [78, 34], 4: [22, 34],
              5: [74, 50], 7: [26, 50],
              8: [80, 28], 9: [50, 34], 10: [20, 28],
            }),
            ...AWAY,
          ],
          ball: { x: 38, y: 30 },
          durationMs: 3000,
        },
      ],
      tag: "Système",
    })]
  })(),

  // ───────────────────────────── 5. Bloc bas ─────────────────────────────
  ...(() => {
    const HOME = squad("home", [
      ["GB",50,8],
      ["DD",80,22], ["DC",62,20], ["DC",38,20], ["DG",20,22],
      ["MC",70,31], ["MC",52,29], ["MC",34,31],
      ["AD",65,37], ["BU",50,38], ["AG",35,37],
    ])
    const AWAY = squad("away", [
      ["GB",50,94],
      ["DG",74,78], ["DC",58,82], ["DC",42,82], ["DD",26,78],
      ["MDC",50,66], ["MC",68,58], ["MC",32,58],
      ["AG",72,46], ["BU",55,85], ["AD",28,46],
    ])
    return [concept({
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
          players: [...HOME, ...AWAY],
          ball: { x: 55, y: 85 },
        },
        {
          caption: "Le bloc absorbe l'attaque — interception dans l'axe, prêt à relancer en transition.",
          players: [
            ...move(HOME, { 6: [56, 44] }),
            ...move(AWAY, { 9: [68, 75] }),
          ],
          arrows: [{ x1: 52, y1: 29, x2: 56, y2: 44, type: "run" }],
          ball: { x: 56, y: 44 },
        },
        {
          caption: "Transition immédiate : un seul appel en profondeur suffit à punir l'adversaire.",
          players: [
            ...move(HOME, { 6: [56, 44], 8: [80, 60], 9: [58, 55] }),
            ...move(AWAY, { 9: [62, 68] }),
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
    })]
  })(),

  // ───────────────────────────── 6. Gegenpressing ─────────────────────────────
  ...(() => {
    const HOME = squad("home", [
      ["GB",50,86],
      ["DD",76,58], ["DC",60,62], ["DC",40,62], ["DG",24,58],
      ["MDC",50,46], ["MC",72,34], ["MC",28,34],
      ["AD",70,26], ["BU",50,28], ["AG",30,26],
    ])
    const AWAY = squad("away", [
      ["GB",50,8],
      ["DG",72,24], ["DC",56,20], ["DC",44,20], ["DD",28,24],
      ["MDC",50,38], ["MC",64,34], ["MC",36,34],
      ["AG",66,46], ["BU",50,50], ["AD",34,46],
    ])
    return [concept({
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
          players: [...HOME, ...AWAY],
          ball: { x: 50, y: 38 },
        },
        {
          caption: "Cinq joueurs convergent en quelques secondes — l'adversaire n'a pas le temps de s'organiser.",
          players: [
            ...move(HOME, { 6: [64, 40], 7: [36, 40], 8: [60, 38], 9: [50, 40], 10: [40, 38] }),
            ...move(AWAY, { 5: [50, 42] }),
          ],
          arrows: [
            { x1: 70, y1: 26, x2: 60, y2: 38, type: "run" },
            { x1: 50, y1: 28, x2: 50, y2: 40, type: "run" },
            { x1: 30, y1: 26, x2: 40, y2: 38, type: "run" },
          ],
          ball: { x: 50, y: 41 },
        },
        {
          caption: "Ballon regagné à 30 mètres du but — exactement la zone visée par Klopp.",
          players: [
            ...move(HOME, { 5: [50, 42], 6: [62, 42], 7: [38, 42], 8: [58, 40], 9: [50, 44], 10: [42, 40] }),
            ...move(AWAY, { 5: [53, 46] }),
          ],
          ball: { x: 50, y: 42 },
          durationMs: 3000,
        },
      ],
      tag: "Pressing",
    })]
  })(),

  // ───────────────────────────── 7. Repli défensif organisé ─────────────────────────────
  ...(() => {
    const HOME = squad("home", [
      ["GB",50,90],
      ["DD",85,40], ["DC",64,76], ["DC",36,76], ["DG",15,42],
      ["MC",75,50], ["MC",58,55], ["MC",30,50],
      ["AD",82,28], ["BU",55,30], ["AG",28,32],
    ])
    const AWAY = squad("away", [
      ["GB",50,10],
      ["DG",28,26], ["DC",44,22], ["DC",56,22], ["DD",72,26],
      ["MDC",50,38], ["MC",38,48], ["MC",62,48],
      ["AG",34,58], ["BU",65,68], ["AD",66,58],
    ])
    return [concept({
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
          players: [...HOME, ...AWAY],
          ball: { x: 65, y: 68 },
        },
        {
          caption: "Le plus proche temporise pendant que les autres sprintent reformer les lignes.",
          players: [
            ...move(HOME, {
              1: [82, 45], 4: [18, 47],
              5: [72, 43], 6: [52, 52], 7: [28, 43],
              8: [75, 52], 9: [50, 50], 10: [25, 52],
            }),
            ...move(AWAY, { 9: [65, 75] }),
          ],
          arrows: [
            { x1: 82, y1: 28, x2: 75, y2: 52, type: "run" },
            { x1: 55, y1: 30, x2: 50, y2: 50, type: "run" },
            { x1: 28, y1: 32, x2: 25, y2: 52, type: "run" },
          ],
          ball: { x: 65, y: 72 },
        },
        {
          caption: "Bloc reformé en quelques secondes — plus d'espace entre les lignes à exploiter.",
          players: [
            ...move(HOME, {
              1: [78, 38], 4: [22, 40],
              5: [65, 38], 6: [50, 42], 7: [35, 38],
              8: [70, 48], 9: [50, 46], 10: [30, 48],
            }),
            ...move(AWAY, { 9: [60, 58] }),
          ],
          ball: { x: 60, y: 58 },
          durationMs: 3000,
        },
      ],
      tag: "Transition",
    })]
  })(),

  // ───────────────────────────── 8. Construction depuis l'arrière ─────────────────────────────
  ...(() => {
    const HOME = squad("home", [
      ["GB",50,8],
      ["DD",80,30], ["DC",68,16], ["DC",32,16], ["DG",20,30],
      ["MDC",55,28], ["MC",72,36], ["MC",28,40],
      ["AD",82,46], ["BU",50,42], ["AG",18,46],
    ])
    const AWAY = squad("away", [
      ["GB",50,90],
      ["DG",70,72], ["DC",58,76], ["DC",42,76], ["DD",30,72],
      ["MDC",50,60], ["MC",64,48], ["MC",36,48],
      ["AG",60,30], ["BU",50,16], ["AD",38,30],
    ])
    return [concept({
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
          players: [...HOME, ...AWAY],
          ball: { x: 50, y: 8 },
        },
        {
          caption: "Le ballon circule vers le côté libre — le pressing adverse est attiré et décalé.",
          players: [
            ...move(HOME, { 1: [80, 30], 2: [70, 18], 3: [30, 18], 6: [58, 26] }),
            ...move(AWAY, { 9: [55, 16], 10: [42, 26] }),
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
            ...move(HOME, { 1: [80, 30], 7: [72, 40] }),
            ...move(AWAY, { 9: [48, 22] }),
          ],
          arrows: [{ x1: 80, y1: 30, x2: 72, y2: 40, type: "pass" }],
          ball: { x: 72, y: 40 },
          durationMs: 3000,
        },
      ],
      tag: "Construction",
    })]
  })(),

  // ───────────────────────────── 9. Tiki-taka et triangles centraux ─────────────────────────────
  ...(() => {
    const HOME = squad("home", [
      ["GB",50,8],
      ["DD",80,28], ["DC",64,18], ["DC",36,18], ["DG",20,28],
      ["MC",78,33], ["MC",50,30], ["MC",22,33],
      ["AD",82,44], ["BU",50,46], ["AG",18,44],
    ])
    const AWAY = squad("away", [
      ["GB",50,92],
      ["DG",70,72], ["DC",56,78], ["DC",44,78], ["DD",30,72],
      ["MC",64,58], ["MC",36,58], ["MOC",50,36],
      ["AG",66,30], ["BU",50,26], ["AD",34,30],
    ])
    return [concept({
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
          caption: "Premier triangle : ballon à droite, deux solutions de passe disponibles. Le milieu offensif adverse monte presser.",
          players: [...HOME, ...AWAY],
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
            ...HOME,
            ...move(AWAY, { 7: [54, 40] }),
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
            ...move(HOME, { 5: [82, 30], 6: [50, 28], 7: [18, 38] }),
            ...move(AWAY, { 7: [40, 34] }),
          ],
          arrows: [
            { x1: 82, y1: 30, x2: 50, y2: 28, type: "triangle" },
            { x1: 50, y1: 28, x2: 18, y2: 38, type: "triangle" },
            { x1: 18, y1: 38, x2: 82, y2: 30, type: "triangle" },
          ],
          ball: { x: 18, y: 38 },
          durationMs: 3000,
        },
      ],
      tag: "Possession",
    })]
  })(),

  // ───────────────────────────── 10. Combinaisons en zone de finition ─────────────────────────────
  ...(() => {
    const HOME = squad("home", [
      ["GB",50,90],
      ["DD",76,70], ["DC",60,74], ["DC",40,74], ["DG",24,70],
      ["MDC",50,56], ["MC",64,46], ["MC",50,38],
      ["AD",72,52], ["BU",50,52], ["AG",28,50],
    ])
    const AWAY = squad("away", [
      ["GB",50,10],
      ["DG",76,28], ["DD",24,28], ["DC",38,60], ["DC",60,62],
      ["MDC",50,46], ["MC",66,38], ["MC",34,38],
      ["AG",70,24], ["BU",50,18], ["AD",30,24],
    ])
    return [concept({
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
          caption: "Le milieu fixe la défense — l'attaquant et l'ailier se préparent à combiner. Les deux défenseurs centraux adverses sont au repos, regroupés.",
          players: [...HOME, ...AWAY],
          ball: { x: 50, y: 38 },
        },
        {
          caption: "Remise immédiate de l'attaquant — le troisième homme s'engage dans l'espace.",
          players: [
            ...move(HOME, { 7: [52, 42], 9: [50, 52], 10: [34, 46] }),
            ...move(AWAY, { 3: [40, 52], 4: [58, 55] }),
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
            ...move(HOME, { 7: [52, 44], 9: [50, 52], 10: [42, 40] }),
            ...move(AWAY, { 3: [40, 52], 4: [58, 55] }),
          ],
          arrows: [{ x1: 50, y1: 52, x2: 42, y2: 40, type: "pass" }],
          ball: { x: 42, y: 40 },
          durationMs: 3000,
        },
      ],
      tag: "Attaque",
    })]
  })(),

  // ───────────────────────────── 11. Faux numéro 9 ─────────────────────────────
  ...(() => {
    const HOME = squad("home", [
      ["GB",50,90],
      ["DD",76,70], ["DC",60,74], ["DC",40,74], ["DG",24,70],
      ["MDC",50,42], ["MC",64,48], ["MC",36,48],
      ["AD",78,40], ["BU",50,32], ["AG",22,40],
    ])
    const AWAY = squad("away", [
      ["GB",50,8],
      ["DG",74,24], ["DD",26,24], ["DC",50,28], ["DC",36,20],
      ["MDC",50,42], ["MC",66,36], ["MC",34,36],
      ["AG",70,50], ["BU",50,50], ["AD",30,50],
    ])
    return [concept({
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
          caption: "Le buteur occupe la dernière ligne — le défenseur central adverse le surveille de près.",
          players: [...HOME, ...AWAY],
          ball: { x: 50, y: 42 },
        },
        {
          caption: "Le faux 9 décroche entre les lignes — son marqueur hésite à le suivre.",
          players: [
            ...move(HOME, { 5: [50, 46], 8: [70, 32], 9: [50, 50], 10: [30, 32] }),
            ...move(AWAY, { 3: [50, 34] }),
          ],
          arrows: [
            { x1: 50, y1: 32, x2: 50, y2: 50, type: "run" },
            { x1: 78, y1: 40, x2: 70, y2: 32, type: "run" },
            { x1: 22, y1: 40, x2: 30, y2: 32, type: "run" },
          ],
          ball: { x: 50, y: 50 },
        },
        {
          caption: "L'espace libéré dans son dos est exploité par l'ailier qui s'y engouffre.",
          players: [
            ...move(HOME, { 8: [58, 22], 9: [50, 48] }),
            ...move(AWAY, { 3: [52, 40] }),
          ],
          arrows: [{ x1: 50, y1: 50, x2: 58, y2: 22, type: "pass" }],
          ball: { x: 58, y: 22 },
          durationMs: 3000,
        },
      ],
      tag: "Attaque",
    })]
  })(),
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
