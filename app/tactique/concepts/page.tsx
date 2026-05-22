import Link from "next/link"

const CONCEPTS = [
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
    schema: `
  Adversaire
  ┌──────────────┐
  │  CB  ← 🔴   │   ST ferme la passe
  │       CB  ↑  │   LW + RW bloquent les côtés
  │  ──── ──── ──│   Milieux montent (piège)
  └──────────────┘
    `,
    tag: "Pressing",
    animLink: "gegenpressing",
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
    schema: `
  Récupération (t=0)
  ──────────────────
  Passe verticale (t=1)
  ──────────────────
  Sprints des ailiers (t=2-3)
  ──────────────────
  Situation de danger (t=5-6)
    `,
    tag: "Transition",
    animLink: "contre-attaque",
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
    schema: `
  Milieu (support)
       ●
      / \\
     /   \\
    ●─────●
  Latéral  Ailier
  (couloir) (intérieur)
    `,
    tag: "Possession",
    animLink: "triangle-aile-droite",
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
    schema: `
  Possession       Défense
  GK               GK
  LB  CB CB  RB    LB  CB CB  RB
  LM  CM    RM     LM  CM    RM
    LW  ST  RW          DM
                    LW     RW
    `,
    tag: "Système",
    animLink: "pressing-haut",
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
    schema: `
  Adversaire
  ──────────────────────
        GK
   LB  CB  CB  RB
   LM  CM  CM  RM   ← compacts
       ST  ST         (< 25m)
  ──────────────────────
  Notre but
    `,
    tag: "Défense",
    animLink: "bloc-bas",
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
    schema: `
  Perte de balle (t=0)
  ─────────────────────
  3-4 joueurs proches   ← pression en 2 sec
  ferment les passes    ← avant réorganisation
  adverses              adverse
  ─────────────────────
  Récupération ou faute → possession retrouvée
    `,
    tag: "Pressing",
    animLink: "gegenpressing",
  },
]

const TAG_COLORS: Record<string, string> = {
  Pressing:   "rgba(239,68,68,0.2)|#f87171",
  Transition: "rgba(251,146,60,0.2)|#fb923c",
  Possession: "rgba(59,130,246,0.2)|#60a5fa",
  Système:    "rgba(168,85,247,0.2)|#c084fc",
  Défense:    "rgba(34,197,94,0.2)|#4ade80",
}

export default function ConceptsPage() {
  return (
    <main className="min-h-[calc(100vh-56px)] text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/tactique" className="text-xs text-white/30 hover:text-white/60 transition mb-2 inline-block">← Tactique</Link>
        <h1 className="text-3xl font-black mb-2">Concepts</h1>
        <p className="mb-12" style={{ color: "rgba(255,255,255,0.4)" }}>
          Les principes fondamentaux du football moderne — théorie et application.
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
                    <Link
                      href="/tactique/animations"
                      className="mt-2 text-xs font-semibold px-4 py-2 rounded-lg w-fit transition hover:opacity-80"
                      style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.12)" }}>
                      Voir l'animation →
                    </Link>
                  </div>

                  {/* Schéma */}
                  <div className="flex flex-col justify-center">
                    <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.2)" }}>Schéma</p>
                    <pre className="text-xs leading-relaxed whitespace-pre rounded-xl p-3 font-mono"
                      style={{ backgroundColor: "rgba(0,0,0,0.3)", color: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.06)", fontSize: "10px" }}>
                      {c.schema.trim()}
                    </pre>
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
