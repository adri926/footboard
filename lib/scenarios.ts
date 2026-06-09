/* Tunnel tactique — données de positionnement
 *
 * Système de coordonnées : x=0 gauche, x=100 droite, y=0 haut, y=100 bas
 * Équipe HOME attaque vers le bas (y croissant)
 * Équipe AWAY attaque vers le haut (y décroissant)
 *
 * Zone left/right = décalage latéral appliqué dynamiquement via applyZone()
 */

export type Phase   = "attack" | "defense"
export type Style   = "possession" | "counter" | "depth" | "low-block" | "mid-block" | "high-press"
export type Zone    = "left" | "center" | "right"

export interface PlayerPos {
  id:   number   // 1–11
  role: string   // "GB", "DD", "DC"…
  x:    number   // 0–100
  y:    number   // 0–100
}

export interface TacticalScenario {
  id:          string
  phase:       Phase
  style:       Style
  label:       string        // ex. "Conservation de balle"
  description: string        // situation en une phrase
  tip:         string        // conseil tactique clé
  ball:        { x: number; y: number }
  home:        PlayerPos[]   // équipe qui attaque vers le bas
  away:        PlayerPos[]   // équipe qui attaque vers le haut
}

/* ── Décalage latéral selon la zone ─────────────────────── */
const ZONE_SHIFT: Record<Zone, number> = { left: -14, center: 0, right: 14 }

export function applyZone(positions: PlayerPos[], zone: Zone): PlayerPos[] {
  const shift = ZONE_SHIFT[zone]
  return positions.map(p => ({
    ...p,
    x: Math.min(96, Math.max(4, p.x + shift)),
  }))
}

export function applyZoneBall(ball: { x: number; y: number }, zone: Zone) {
  const shift = ZONE_SHIFT[zone]
  return { x: Math.min(96, Math.max(4, ball.x + shift)), y: ball.y }
}

/* ── 6 scénarios de base ────────────────────────────────── */
export const SCENARIOS: TacticalScenario[] = [

  /* ── ATTAQUE 1 — Conservation de balle ── */
  {
    id: "attack-possession",
    phase: "attack",
    style: "possession",
    label: "Conservation de balle",
    description: "Ton équipe fait circuler le ballon patiemment, l'adversaire se replie en bloc médian.",
    tip: "Utilise les demi-espaces et les triangles courts pour faire tourner le bloc adverse.",
    ball: { x: 50, y: 46 },
    home: [
      { id: 1,  role: "GB",  x: 50, y:  8 },
      { id: 2,  role: "DD",  x: 72, y: 28 },
      { id: 3,  role: "DC",  x: 40, y: 22 },
      { id: 4,  role: "DC",  x: 60, y: 22 },
      { id: 5,  role: "DG",  x: 28, y: 28 },
      { id: 6,  role: "MDC", x: 50, y: 40 },
      { id: 7,  role: "MC",  x: 32, y: 52 },
      { id: 8,  role: "MC",  x: 68, y: 52 },
      { id: 9,  role: "AD",  x: 80, y: 38 },
      { id: 10, role: "BU",  x: 50, y: 60 },
      { id: 11, role: "AG",  x: 20, y: 38 },
    ],
    away: [
      { id: 1,  role: "GB",  x: 50, y: 92 },
      { id: 2,  role: "DG",  x: 72, y: 76 },
      { id: 3,  role: "DC",  x: 40, y: 80 },
      { id: 4,  role: "DC",  x: 60, y: 80 },
      { id: 5,  role: "DD",  x: 28, y: 76 },
      { id: 6,  role: "MG",  x: 72, y: 65 },
      { id: 7,  role: "MC",  x: 40, y: 62 },
      { id: 8,  role: "MC",  x: 60, y: 62 },
      { id: 9,  role: "MD",  x: 28, y: 65 },
      { id: 10, role: "BU",  x: 40, y: 55 },
      { id: 11, role: "BU",  x: 60, y: 55 },
    ],
  },

  /* ── ATTAQUE 2 — Attaque rapide ── */
  {
    id: "attack-counter",
    phase: "attack",
    style: "counter",
    label: "Attaque rapide",
    description: "Ton équipe récupère le ballon et se projette vite vers l'avant, l'adversaire est encore haut.",
    tip: "Joue vite vers l'avant, exploite l'espace dans le dos des défenseurs encore montés.",
    ball: { x: 50, y: 54 },
    home: [
      { id: 1,  role: "GB",  x: 50, y:  8 },
      { id: 2,  role: "DD",  x: 80, y: 38 },
      { id: 3,  role: "DC",  x: 40, y: 18 },
      { id: 4,  role: "DC",  x: 60, y: 18 },
      { id: 5,  role: "DG",  x: 20, y: 38 },
      { id: 6,  role: "MDC", x: 50, y: 36 },
      { id: 7,  role: "MC",  x: 30, y: 52 },
      { id: 8,  role: "MC",  x: 70, y: 52 },
      { id: 9,  role: "AD",  x: 84, y: 62 },
      { id: 10, role: "BU",  x: 50, y: 70 },
      { id: 11, role: "AG",  x: 16, y: 62 },
    ],
    away: [
      { id: 1,  role: "GB",  x: 50, y: 92 },
      { id: 2,  role: "DG",  x: 74, y: 55 },
      { id: 3,  role: "DC",  x: 40, y: 62 },
      { id: 4,  role: "DC",  x: 60, y: 62 },
      { id: 5,  role: "DD",  x: 26, y: 55 },
      { id: 6,  role: "MG",  x: 76, y: 44 },
      { id: 7,  role: "MC",  x: 40, y: 46 },
      { id: 8,  role: "MC",  x: 60, y: 46 },
      { id: 9,  role: "MD",  x: 24, y: 44 },
      { id: 10, role: "BU",  x: 42, y: 36 },
      { id: 11, role: "BU",  x: 58, y: 36 },
    ],
  },

  /* ── ATTAQUE 3 — Jeu en profondeur ── */
  {
    id: "attack-depth",
    phase: "attack",
    style: "depth",
    label: "Jeu en profondeur",
    description: "Ton équipe joue long derrière la défense, les ailiers s'écartent au maximum pour étirer l'espace.",
    tip: "Le timing de la course du ST est crucial — part au moment où le ballon quitte le pied.",
    ball: { x: 50, y: 30 },
    home: [
      { id: 1,  role: "GB",  x: 50, y:  8 },
      { id: 2,  role: "DD",  x: 78, y: 30 },
      { id: 3,  role: "DC",  x: 40, y: 20 },
      { id: 4,  role: "DC",  x: 60, y: 20 },
      { id: 5,  role: "DG",  x: 22, y: 30 },
      { id: 6,  role: "MDC", x: 50, y: 40 },
      { id: 7,  role: "MC",  x: 34, y: 52 },
      { id: 8,  role: "MC",  x: 66, y: 52 },
      { id: 9,  role: "AD",  x: 90, y: 46 },
      { id: 10, role: "BU",  x: 50, y: 74 },
      { id: 11, role: "AG",  x: 10, y: 46 },
    ],
    away: [
      { id: 1,  role: "GB",  x: 50, y: 92 },
      { id: 2,  role: "DG",  x: 72, y: 70 },
      { id: 3,  role: "DC",  x: 40, y: 66 },
      { id: 4,  role: "DC",  x: 60, y: 66 },
      { id: 5,  role: "DD",  x: 28, y: 70 },
      { id: 6,  role: "MG",  x: 72, y: 56 },
      { id: 7,  role: "MC",  x: 40, y: 54 },
      { id: 8,  role: "MC",  x: 60, y: 54 },
      { id: 9,  role: "MD",  x: 28, y: 56 },
      { id: 10, role: "BU",  x: 42, y: 42 },
      { id: 11, role: "BU",  x: 58, y: 42 },
    ],
  },

  /* ── DÉFENSE 1 — Bloc bas ── */
  {
    id: "defense-low-block",
    phase: "defense",
    style: "low-block",
    label: "Bloc bas",
    description: "Ton équipe défend profond en deux blocs compacts, l'adversaire fait tourner devant.",
    tip: "Protège le centre à tout prix — laisse les couloirs, ferme l'axe et la surface.",
    ball: { x: 50, y: 52 },
    home: [
      { id: 1,  role: "GB",  x: 50, y: 10 },
      { id: 2,  role: "DD",  x: 74, y: 26 },
      { id: 3,  role: "DC",  x: 40, y: 20 },
      { id: 4,  role: "DC",  x: 60, y: 20 },
      { id: 5,  role: "DG",  x: 26, y: 26 },
      { id: 6,  role: "MD",  x: 74, y: 36 },
      { id: 7,  role: "MC",  x: 40, y: 38 },
      { id: 8,  role: "MC",  x: 60, y: 38 },
      { id: 9,  role: "MG",  x: 26, y: 36 },
      { id: 10, role: "MOC",  x: 50, y: 46 },
      { id: 11, role: "BU",  x: 50, y: 54 },
    ],
    away: [
      { id: 1,  role: "GB",  x: 50, y: 92 },
      { id: 2,  role: "DG",  x: 78, y: 68 },
      { id: 3,  role: "DC",  x: 40, y: 74 },
      { id: 4,  role: "DC",  x: 60, y: 74 },
      { id: 5,  role: "DD",  x: 22, y: 68 },
      { id: 6,  role: "MDC", x: 50, y: 60 },
      { id: 7,  role: "MC",  x: 32, y: 52 },
      { id: 8,  role: "MC",  x: 68, y: 52 },
      { id: 9,  role: "AG",  x: 82, y: 42 },
      { id: 10, role: "BU",  x: 50, y: 38 },
      { id: 11, role: "AD",  x: 18, y: 42 },
    ],
  },

  /* ── DÉFENSE 2 — Bloc médian ── */
  {
    id: "defense-mid-block",
    phase: "defense",
    style: "mid-block",
    label: "Bloc médian",
    description: "Ton équipe tient une ligne organisée entre la ligne médiane et sa surface.",
    tip: "Reste compact entre les lignes, ne cours pas après le ballon — attire l'adversaire et contre.",
    ball: { x: 50, y: 58 },
    home: [
      { id: 1,  role: "GB",  x: 50, y: 10 },
      { id: 2,  role: "DD",  x: 74, y: 28 },
      { id: 3,  role: "DC",  x: 40, y: 22 },
      { id: 4,  role: "DC",  x: 60, y: 22 },
      { id: 5,  role: "DG",  x: 26, y: 28 },
      { id: 6,  role: "MD",  x: 74, y: 44 },
      { id: 7,  role: "MC",  x: 40, y: 46 },
      { id: 8,  role: "MC",  x: 60, y: 46 },
      { id: 9,  role: "MG",  x: 26, y: 44 },
      { id: 10, role: "BU",  x: 40, y: 58 },
      { id: 11, role: "BU",  x: 60, y: 58 },
    ],
    away: [
      { id: 1,  role: "GB",  x: 50, y: 92 },
      { id: 2,  role: "DG",  x: 78, y: 70 },
      { id: 3,  role: "DC",  x: 40, y: 76 },
      { id: 4,  role: "DC",  x: 60, y: 76 },
      { id: 5,  role: "DD",  x: 22, y: 70 },
      { id: 6,  role: "MDC", x: 50, y: 62 },
      { id: 7,  role: "MC",  x: 32, y: 54 },
      { id: 8,  role: "MC",  x: 68, y: 54 },
      { id: 9,  role: "AG",  x: 80, y: 46 },
      { id: 10, role: "BU",  x: 50, y: 40 },
      { id: 11, role: "AD",  x: 20, y: 46 },
    ],
  },

  /* ── DÉFENSE 3 — Pressing haut ── */
  {
    id: "defense-high-press",
    phase: "defense",
    style: "high-press",
    label: "Pressing haut",
    description: "Ton équipe monte haut et agresse dès la relance adverse, y compris le gardien.",
    tip: "Coupe les lignes de passe courtes — force le long ballon que tu peux contester.",
    ball: { x: 50, y: 80 },
    home: [
      { id: 1,  role: "GB",  x: 50, y: 20 },
      { id: 2,  role: "DD",  x: 74, y: 40 },
      { id: 3,  role: "DC",  x: 40, y: 34 },
      { id: 4,  role: "DC",  x: 60, y: 34 },
      { id: 5,  role: "DG",  x: 26, y: 40 },
      { id: 6,  role: "MD",  x: 74, y: 54 },
      { id: 7,  role: "MC",  x: 40, y: 56 },
      { id: 8,  role: "MC",  x: 60, y: 56 },
      { id: 9,  role: "MG",  x: 26, y: 54 },
      { id: 10, role: "BU",  x: 40, y: 68 },
      { id: 11, role: "BU",  x: 60, y: 68 },
    ],
    away: [
      { id: 1,  role: "GB",  x: 50, y: 92 },
      { id: 2,  role: "DG",  x: 72, y: 80 },
      { id: 3,  role: "DC",  x: 40, y: 84 },
      { id: 4,  role: "DC",  x: 60, y: 84 },
      { id: 5,  role: "DD",  x: 28, y: 80 },
      { id: 6,  role: "MDC", x: 50, y: 72 },
      { id: 7,  role: "MC",  x: 36, y: 64 },
      { id: 8,  role: "MC",  x: 64, y: 64 },
      { id: 9,  role: "AG",  x: 72, y: 56 },
      { id: 10, role: "BU",  x: 50, y: 50 },
      { id: 11, role: "AD",  x: 28, y: 56 },
    ],
  },
]

/* ── Helpers ─────────────────────────────────────────────── */

export const PHASES: { value: Phase; label: string; desc: string }[] = [
  { value: "attack",  label: "Avec le ballon",   desc: "Tu attaques — choisis ton style offensif" },
  { value: "defense", label: "Sans le ballon",   desc: "Tu défends — choisis ton bloc défensif"   },
]

export const STYLES_BY_PHASE: Record<Phase, { value: Style; label: string; desc: string }[]> = {
  attack: [
    { value: "possession", label: "Conservation",    desc: "Faire tourner, patient, triangles courts" },
    { value: "counter",    label: "Attaque rapide",  desc: "Transition vite, exploiter le dos de la défense" },
    { value: "depth",      label: "Jeu en profondeur", desc: "Longs ballons, courses en profondeur, largeur max" },
  ],
  defense: [
    { value: "low-block",   label: "Bloc bas",      desc: "Défense profonde, deux blocs compacts" },
    { value: "mid-block",   label: "Bloc médian",   desc: "Organisation entre la médiane et la surface" },
    { value: "high-press",  label: "Pressing haut", desc: "Agression dès la relance adverse" },
  ],
}

export const ZONES: { value: Zone; label: string; emoji: string }[] = [
  { value: "left",   label: "Côté gauche", emoji: "◀" },
  { value: "center", label: "Axe central", emoji: "▲" },
  { value: "right",  label: "Côté droit",  emoji: "▶" },
]

export function getScenario(phase: Phase, style: Style): TacticalScenario | undefined {
  return SCENARIOS.find(s => s.phase === phase && s.style === style)
}
