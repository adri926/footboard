/* Créateur de situations tactiques
 *
 * Une situation = une zone du terrain + N joueurs par équipe + une finalité.
 * Les joueurs sont auto-placés dans la zone puis draggables.
 */

/* ── Zones du terrain (grille 3×3) ─────────────────────── */
export type ZoneId =
  | "def-left" | "def-center" | "def-right"
  | "mid-left" | "mid-center" | "mid-right"
  | "att-left" | "att-center" | "att-right"

export interface PitchZone {
  id:      ZoneId
  label:   string
  short:   string        // ex. "DG"
  // bounds en % sur le terrain (x: gauche→droite, y: haut→bas)
  x1: number; x2: number
  y1: number; y2: number
}

export const PITCH_ZONES: PitchZone[] = [
  { id: "def-left",   label: "Défense gauche",   short: "DG", x1:  0, x2: 33, y1:  3, y2: 36 },
  { id: "def-center", label: "Défense centrale",  short: "DC", x1: 33, x2: 67, y1:  3, y2: 36 },
  { id: "def-right",  label: "Défense droite",    short: "DD", x1: 67, x2:100, y1:  3, y2: 36 },
  { id: "mid-left",   label: "Milieu gauche",     short: "MG", x1:  0, x2: 33, y1: 36, y2: 64 },
  { id: "mid-center", label: "Milieu central",    short: "MC", x1: 33, x2: 67, y1: 36, y2: 64 },
  { id: "mid-right",  label: "Milieu droit",      short: "MD", x1: 67, x2:100, y1: 36, y2: 64 },
  { id: "att-left",   label: "Attaque gauche",    short: "AG", x1:  0, x2: 33, y1: 64, y2: 97 },
  { id: "att-center", label: "Attaque centrale",  short: "AC", x1: 33, x2: 67, y1: 64, y2: 97 },
  { id: "att-right",  label: "Attaque droite",    short: "AD", x1: 67, x2:100, y1: 64, y2: 97 },
]

/* ── Configurations joueurs ─────────────────────────────── */
export interface PlayerConfig {
  home: number   // nb joueurs équipe home
  away: number   // nb joueurs équipe away
  label: string  // ex. "2v1"
}

export const PLAYER_CONFIGS: PlayerConfig[] = [
  { home: 1, away: 1, label: "1v1" },
  { home: 2, away: 1, label: "2v1" },
  { home: 2, away: 2, label: "2v2" },
  { home: 3, away: 2, label: "3v2" },
  { home: 3, away: 3, label: "3v3" },
  { home: 4, away: 3, label: "4v3" },
  { home: 4, away: 4, label: "4v4" },
  { home: 5, away: 4, label: "5v4" },
]

/* ── Finalités ──────────────────────────────────────────── */
export type FinalityCategory = "offensive" | "defensive" | "transition"

export interface Finality {
  id:       string
  category: FinalityCategory
  label:    string
  emoji:    string
}

export const FINALITIES: Finality[] = [
  // Offensif
  { id: "shot",       category: "offensive",   label: "Finir par un tir",       emoji: "⚽" },
  { id: "chance",     category: "offensive",   label: "Créer une occasion",      emoji: "🎯" },
  { id: "combine",    category: "offensive",   label: "Combiner pour avancer",   emoji: "↗" },
  { id: "keep",       category: "offensive",   label: "Conserver le ballon",     emoji: "🔄" },
  // Défensif
  { id: "recover",    category: "defensive",   label: "Récupérer le ballon",     emoji: "🛡" },
  { id: "press",      category: "defensive",   label: "Maintenir le pressing",   emoji: "⬆" },
  { id: "clear",      category: "defensive",   label: "Dégager proprement",      emoji: "↑" },
  { id: "force-long", category: "defensive",   label: "Forcer le long ballon",   emoji: "📐" },
  // Transition
  { id: "counter",    category: "transition",  label: "Déclencher un contre",    emoji: "⚡" },
  { id: "build-out",  category: "transition",  label: "Sortir proprement",       emoji: "🔑" },
  { id: "fix",        category: "transition",  label: "Fixer et jouer derrière", emoji: "⟳" },
]

export const FINALITY_CATEGORIES: { id: FinalityCategory; label: string }[] = [
  { id: "offensive",  label: "Offensif"    },
  { id: "defensive",  label: "Défensif"    },
  { id: "transition", label: "Transition"  },
]

/* ── Vocabulaire tactique (principes de jeu) ────────────── */
export interface TacticalTag {
  id:    string
  label: string
}

export const TACTICAL_TAGS: TacticalTag[] = [
  { id: "surnombre",    label: "Surnombre" },
  { id: "couverture",   label: "Couverture" },
  { id: "appui-soutien", label: "Appui-soutien" },
  { id: "permutation",  label: "Permutation de postes" },
  { id: "fixation",     label: "Fixation" },
  { id: "jeu-dos",      label: "Jeu dans le dos" },
  { id: "largeur",      label: "Jeu en largeur" },
  { id: "profondeur",   label: "Appel en profondeur" },
  { id: "pressing",     label: "Pressing déclenché" },
  { id: "repli",        label: "Repli défensif" },
  { id: "transition",   label: "Transition rapide" },
  { id: "temporisation", label: "Temporisation" },
]

/* ── Joueur dans le builder ─────────────────────────────── */
export interface BuilderPlayer {
  id:   string   // ex. "h1", "a1"
  team: "home" | "away"
  x:    number   // 0-100 (global terrain)
  y:    number
}

/* ── Déclencheurs (vocabulaire tactique de la frame "Déclencheur") ─── */
export type TriggerCategory = "recovery" | "opponent-cue" | "individual" | "set-piece" | "transition"

export interface SituationTrigger {
  id:       string
  category: TriggerCategory
  label:    string
  emoji:    string
}

export const TRIGGER_CATEGORIES: { id: TriggerCategory; label: string }[] = [
  { id: "recovery",     label: "Récupération" },
  { id: "opponent-cue", label: "Signal adverse" },
  { id: "individual",   label: "Action individuelle" },
  { id: "set-piece",    label: "Phase arrêtée" },
  { id: "transition",   label: "Transition" },
]

export const TRIGGERS: SituationTrigger[] = [
  { id: "interception",   category: "recovery",     label: "Interception",                    emoji: "🤚" },
  { id: "tackle",         category: "recovery",     label: "Tacle / duel gagné",               emoji: "🦵" },
  { id: "second-ball",    category: "recovery",     label: "Second ballon",                    emoji: "🔁" },
  { id: "back-pass",      category: "opponent-cue", label: "Passe en retrait / latérale",      emoji: "↩" },
  { id: "keeper-release", category: "opponent-cue", label: "Relance du gardien adverse",       emoji: "🧤" },
  { id: "bad-control",    category: "opponent-cue", label: "Contrôle mal orienté",             emoji: "🌀" },
  { id: "switch-play",    category: "opponent-cue", label: "Renversement de jeu",              emoji: "↔" },
  { id: "dribble",        category: "individual",   label: "Dribble / 1v1 gagné",              emoji: "⚡" },
  { id: "run-in-space",   category: "individual",   label: "Appel dans l'espace",              emoji: "🏃" },
  { id: "switch-pass",    category: "individual",   label: "Décalage vers joueur libre",       emoji: "🎯" },
  { id: "set-piece",      category: "set-piece",    label: "Touche / corner / coup franc",     emoji: "🚩" },
  { id: "turnover",       category: "transition",   label: "Perte de balle (contre adverse)",  emoji: "↯" },
]

/* ── Frame additionnelle (situation en plusieurs temps) ─── */
export interface SituationFrame {
  label:    string   // ex. "Déclencheur", "Issue", "Branche A"
  players:  Record<string, { x: number; y: number }>   // playerId -> position
  ball:     { x: number; y: number }
  trigger?: string   // SituationTrigger.id — uniquement pour frames[0] ("Déclencheur")
}

export const MAX_FRAMES   = 3   // dont la frame de départ (players/ball)
export const MAX_BRANCHES = 3
export const MAX_SQUAD_SELECTION = 5   // joueurs max par équipe sélectionnables à l'étape 1

/* ── Situation créée ────────────────────────────────────── */
export interface BuiltSituation {
  id?:         string   // uuid Supabase après save
  zone:        ZoneId
  config:      string   // ex. "3v2"
  finality:    string   // Finality.id
  description: string
  players:     BuilderPlayer[]
  ball:        { x: number; y: number }
  tags:        string[]      // TacticalTag.id[]
  frames:      SituationFrame[]    // frames authored après la position de départ (max 2)
  branches:    SituationFrame[]    // issues alternatives à la dernière frame (max 3)
  created_at?: string
}

/* ── Formation 4-3-3 (positions globales 0-100) ─────────── */
const FORMATION_433 = {
  home: [
    { x: 50, y: 93 },                                                          // GK
    { x: 18, y: 80 }, { x: 37, y: 78 }, { x: 63, y: 78 }, { x: 82, y: 80 }, // DEF
    { x: 22, y: 62 }, { x: 50, y: 60 }, { x: 78, y: 62 },                    // MIL
    { x: 18, y: 33 }, { x: 50, y: 30 }, { x: 82, y: 33 },                    // ATT
  ],
  away: [
    { x: 50, y:  7 },
    { x: 18, y: 20 }, { x: 37, y: 22 }, { x: 63, y: 22 }, { x: 82, y: 20 },
    { x: 22, y: 38 }, { x: 50, y: 40 }, { x: 78, y: 38 },
    { x: 18, y: 67 }, { x: 50, y: 70 }, { x: 82, y: 67 },
  ],
}

/* ── Formation complète avec postes (pour la sélection des joueurs impliqués) ── */
export interface FormationSlot { x: number; y: number; post: string }

const POSTS_433 = ["GB", "DG", "DC", "DC", "DD", "MG", "MC", "MD", "AG", "BU", "AD"]

export const FULL_FORMATION: { home: FormationSlot[]; away: FormationSlot[] } = {
  home: FORMATION_433.home.map((p, i) => ({ ...p, post: POSTS_433[i] })),
  away: FORMATION_433.away.map((p, i) => ({ ...p, post: POSTS_433[i] })),
}

/* Joueurs fantômes : formation complète moins ceux sélectionnés */
export function getGhostPlayers(selectedHome: Set<number>, selectedAway: Set<number>) {
  return {
    home: FORMATION_433.home.filter((_, i) => !selectedHome.has(i)),
    away: FORMATION_433.away.filter((_, i) => !selectedAway.has(i)),
  }
}

/* Positions de départ des joueurs sélectionnés (formation réaliste) */
export function playersFromSelection(selectedHome: Set<number>, selectedAway: Set<number>): BuilderPlayer[] {
  const players: BuilderPlayer[] = []
  let i = 1
  for (const idx of selectedHome) players.push({ id: `h${i++}`, team: "home", x: FULL_FORMATION.home[idx].x, y: FULL_FORMATION.home[idx].y })
  i = 1
  for (const idx of selectedAway) players.push({ id: `a${i++}`, team: "away", x: FULL_FORMATION.away[idx].x, y: FULL_FORMATION.away[idx].y })
  return players
}

/* ── Helpers géométriques (utilisés pour la relecture et les suggestions) ── */
export function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v))
}

export function lerpPoint(a: { x: number; y: number }, b: { x: number; y: number }, t: number) {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
}

export function nearestTo(players: BuilderPlayer[], point: { x: number; y: number }, team: "home" | "away") {
  let best: BuilderPlayer | null = null
  let bestDist = Infinity
  for (const p of players) {
    if (p.team !== team) continue
    const d = Math.hypot(p.x - point.x, p.y - point.y)
    if (d < bestDist) { bestDist = d; best = p }
  }
  return best
}

/* ── Suggestion de positions pour la frame "Déclencheur" ───
 * Réaction automatique du ballon/des joueurs selon la catégorie du déclencheur choisi,
 * calculée depuis les positions de "Départ" (players/ball).
 */
export function suggestTriggerPositions(
  category: TriggerCategory,
  players: BuilderPlayer[],
  ball: { x: number; y: number }
): { players: Record<string, { x: number; y: number }>; ball: { x: number; y: number } } {
  const out: Record<string, { x: number; y: number }> = {}
  for (const p of players) out[p.id] = { x: p.x, y: p.y }
  let newBall = { ...ball }

  const place = (id: string, pos: { x: number; y: number }) => {
    out[id] = { x: clamp(pos.x, 2, 98), y: clamp(pos.y, 2, 98) }
  }

  switch (category) {
    case "recovery": {
      // Le ballon "saute" sur le joueur home le plus proche (récupération réussie)
      const winner = nearestTo(players, ball, "home")
      if (winner) newBall = { x: winner.x, y: winner.y }
      // L'adversaire le plus proche du ballon recule légèrement (duel perdu)
      const loser = nearestTo(players, ball, "away")
      if (loser) place(loser.id, lerpPoint(loser, { x: loser.x, y: 98 }, 0.2))
      break
    }
    case "opponent-cue": {
      // L'adversaire fait circuler/relance vers son camp
      newBall = { x: clamp(ball.x, 2, 98), y: clamp(ball.y + (98 - 2) * 0.15, 2, 98) }
      // Le bloc home avance légèrement vers le ballon (pressing déclenché)
      for (const p of players) {
        if (p.team === "home") place(p.id, lerpPoint(p, newBall, 0.2))
      }
      break
    }
    case "individual": {
      // Le porteur home le plus proche du ballon avance vers le but adverse, ballon avec lui
      const carrier = nearestTo(players, ball, "home")
      if (carrier) {
        const advanced = lerpPoint(carrier, { x: carrier.x, y: 2 }, 0.35)
        place(carrier.id, advanced)
        newBall = { x: advanced.x, y: advanced.y }
      }
      break
    }
    case "set-piece": {
      // Le ballon est replacé sur le bord de terrain le plus proche (touche/corner/CF)
      const candidates = [
        { x: 2,  y: ball.y, d: ball.x - 2 },
        { x: 98, y: ball.y, d: 98 - ball.x },
        { x: ball.x, y: 2,  d: ball.y - 2 },
        { x: ball.x, y: 98, d: 98 - ball.y },
      ]
      const nearest = candidates.reduce((a, b) => (b.d < a.d ? b : a))
      newBall = { x: nearest.x, y: nearest.y }
      break
    }
    case "transition": {
      // Perte de balle : le ballon "saute" sur l'adversaire le plus proche
      const winner = nearestTo(players, ball, "away")
      if (winner) newBall = { x: winner.x, y: winner.y }
      // Le bloc home recule vers son camp (repli)
      for (const p of players) {
        if (p.team === "home") place(p.id, lerpPoint(p, { x: p.x, y: 98 }, 0.2))
      }
      break
    }
  }

  newBall = { x: clamp(newBall.x, 2, 98), y: clamp(newBall.y, 2, 98) }
  return { players: out, ball: newBall }
}
