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

/* ── Joueur dans le builder ─────────────────────────────── */
export interface BuilderPlayer {
  id:   string   // ex. "h1", "a1"
  team: "home" | "away"
  x:    number   // 0-100 (global terrain)
  y:    number
}

/* ── Situation créée ────────────────────────────────────── */
export interface BuiltSituation {
  id?:         string   // uuid Supabase après save
  zone:        ZoneId
  config:      string   // ex. "3v2"
  finality:    string   // Finality.id
  description: string
  players:     BuilderPlayer[]
  ball:        { x: number; y: number }
  created_at?: string
}

/* ── Auto-placement des joueurs dans une zone ───────────── */
export function autoPlace(zone: PitchZone, config: PlayerConfig): BuilderPlayer[] {
  const players: BuilderPlayer[] = []

  const cx = (zone.x1 + zone.x2) / 2
  const cy = (zone.y1 + zone.y2) / 2
  const w  = zone.x2 - zone.x1
  const h  = zone.y2 - zone.y1

  /* Home (rouge) : disposés dans le tiers bas de la zone */
  const homePositions = spreadPlayers(config.home, cx, zone.y1 + h * 0.65, w * 0.7)
  homePositions.forEach((pos, i) => {
    players.push({ id: `h${i + 1}`, team: "home", x: pos.x, y: pos.y })
  })

  /* Away (vert sauge) : disposés dans le tiers haut de la zone */
  const awayPositions = spreadPlayers(config.away, cx, zone.y1 + h * 0.35, w * 0.7)
  awayPositions.forEach((pos, i) => {
    players.push({ id: `a${i + 1}`, team: "away", x: pos.x, y: pos.y })
  })

  return players
}

/* Répartit N joueurs horizontalement autour de (cx, cy) */
function spreadPlayers(n: number, cx: number, cy: number, totalWidth: number) {
  if (n === 1) return [{ x: cx, y: cy }]
  const step = totalWidth / (n - 1)
  return Array.from({ length: n }, (_, i) => ({
    x: cx - totalWidth / 2 + i * step,
    y: cy,
  }))
}

/* Centre du ballon dans la zone (position initiale) */
export function zoneBallPosition(zone: PitchZone) {
  return {
    x: (zone.x1 + zone.x2) / 2,
    y: (zone.y1 + zone.y2) / 2,
  }
}

export function getZone(id: ZoneId): PitchZone {
  return PITCH_ZONES.find(z => z.id === id)!
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

/* Joueurs fantômes : formation complète moins ceux dans la zone active */
export function getGhostPlayers(zone: PitchZone, homeCount: number, awayCount: number) {
  const inZone = (p: { x: number; y: number }) =>
    p.x >= zone.x1 && p.x <= zone.x2 && p.y >= zone.y1 && p.y <= zone.y2
  return {
    home: FORMATION_433.home.filter(p => !inZone(p)).slice(0, 11 - homeCount),
    away: FORMATION_433.away.filter(p => !inZone(p)).slice(0, 11 - awayCount),
  }
}
