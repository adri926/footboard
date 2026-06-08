/* Relecture d'une situation créée
 *
 * Une situation sauvegardée est un schéma figé (joueurs + ballon + finalité visée).
 * On en déduit ici une courte séquence jouable en 3 étapes : départ → développement →
 * issue — où le ballon progresse vers le but adverse selon l'ambition de la finalité,
 * le porteur l'accompagne, ses partenaires font un appui de soutien, et l'équipe
 * adverse resserre pour suivre le danger.
 */
import type { BuiltSituation, BuilderPlayer } from "./builder"
import { FINALITIES } from "./builder"

export interface PlaybackFrame {
  label:   string
  info:    string
  duration: number
  players: Record<string, { x: number; y: number }>
  ball:    { x: number; y: number }
}

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)) }

function lerpPoint(a: { x: number; y: number }, b: { x: number; y: number }, t: number) {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
}

function nearestTo(players: BuilderPlayer[], point: { x: number; y: number }, team: "home" | "away") {
  let best: BuilderPlayer | null = null
  let bestDist = Infinity
  for (const p of players) {
    if (p.team !== team) continue
    const d = Math.hypot(p.x - point.x, p.y - point.y)
    if (d < bestDist) { bestDist = d; best = p }
  }
  return best
}

// Combien le ballon progresse vers le but adverse (0 = sur place, 1 = jusqu'au but) :
// une finalité ambitieuse (tir, contre) fait avancer le jeu loin, une finalité de
// gestion (conservation, dégagement) ne fait que soulager la zone de départ
const FINALITY_PROGRESS: Record<string, number> = {
  shot: 0.82, chance: 0.62, combine: 0.42, keep: 0.18,
  recover: 0.28, press: 0.22, clear: 0.32, "force-long": 0.3,
  counter: 0.7, "build-out": 0.35, fix: 0.38,
}

const FINALITY_INFO: Record<string, string> = {
  shot:         "Le ballon est amené jusqu'au but adverse pour conclure l'action.",
  chance:       "Une combinaison ouvre une occasion franche près de la surface.",
  combine:      "Le bloc enchaîne les passes courtes pour avancer collectivement.",
  keep:         "Le ballon circule pour conserver la possession et faire reculer le bloc adverse.",
  recover:      "Le pressing collectif permet de regagner le ballon.",
  press:        "Le bloc empêche l'adversaire de ressortir proprement.",
  clear:        "Le ballon est repoussé loin de la zone dangereuse.",
  "force-long": "L'adversaire est contraint de jouer un ballon long, plus facile à récupérer.",
  counter:      "La récupération déclenche immédiatement une transition rapide vers l'avant.",
  "build-out":  "Le ballon ressort proprement du bloc grâce à des appuis courts.",
  fix:          "Le bloc adverse est fixé puis pris de vitesse dans son dos.",
}

export function generatePlayback(situation: BuiltSituation): PlaybackFrame[] {
  const finality = FINALITIES.find(f => f.id === situation.finality)
  const progress = FINALITY_PROGRESS[situation.finality] ?? 0.4
  const info     = FINALITY_INFO[situation.finality] ?? ""

  const start = situation.ball
  // Le ballon avance vers le but adverse (y → 0, l'équipe home attaquant toujours
  // vers le haut) et se recentre légèrement s'il termine près d'un couloir
  const finalBall = {
    x: clamp(start.x + (50 - start.x) * 0.25, 6, 94),
    y: clamp(start.y - start.y * progress, 4, 96),
  }

  const carrier  = nearestTo(situation.players, start, "home")
  const presser  = nearestTo(situation.players, finalBall, "away")

  const startPos: Record<string, { x: number; y: number }> = {}
  for (const p of situation.players) startPos[p.id] = { x: p.x, y: p.y }

  const finalPos: Record<string, { x: number; y: number }> = {}
  for (const p of situation.players) {
    if (p.id === carrier?.id) {
      // Le porteur accompagne le ballon jusqu'à l'issue de l'action
      finalPos[p.id] = { x: finalBall.x, y: clamp(finalBall.y + 4, 4, 96) }
    } else if (p.team === "home") {
      // Soutien : appui partiel vers la nouvelle zone du ballon
      finalPos[p.id] = lerpPoint(startPos[p.id], finalBall, 0.35)
    } else if (p.id === presser?.id) {
      // Le défenseur le plus proche resserre pour s'interposer
      finalPos[p.id] = lerpPoint(startPos[p.id], finalBall, 0.55)
    } else {
      // Le reste du bloc adverse suit le danger sans tout abandonner
      finalPos[p.id] = lerpPoint(startPos[p.id], finalBall, 0.25)
    }
  }

  const frameAt = (t: number): Record<string, { x: number; y: number }> => {
    const out: Record<string, { x: number; y: number }> = {}
    for (const p of situation.players) out[p.id] = lerpPoint(startPos[p.id], finalPos[p.id], t)
    return out
  }

  return [
    {
      label: "Position de départ",
      info: situation.description || "Schéma de départ tel que configuré.",
      duration: 1400,
      players: frameAt(0),
      ball: start,
    },
    {
      label: "Développement de l'action",
      info: "Le ballon circule, les joueurs ajustent leurs courses de soutien et de couverture.",
      duration: 1400,
      players: frameAt(0.55),
      ball: lerpPoint(start, finalBall, 0.55),
    },
    {
      label: finality ? `${finality.emoji} ${finality.label}` : "Issue de l'action",
      info,
      duration: 1600,
      players: frameAt(1),
      ball: finalBall,
    },
  ]
}
