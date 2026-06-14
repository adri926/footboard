/* Relecture d'une situation créée
 *
 * Une situation sauvegardée est un schéma figé (joueurs + ballon + finalité visée).
 * On en déduit ici une courte séquence jouable en 3 étapes : départ → développement →
 * issue — où le ballon progresse vers le but adverse selon l'ambition de la finalité,
 * le porteur l'accompagne, ses partenaires font un appui de soutien, et l'équipe
 * adverse resserre pour suivre le danger.
 */
import type { BuiltSituation } from "./builder"
import { FINALITIES, TRIGGERS, clamp, lerpPoint, nearestTo } from "./builder"

export interface PlaybackFrame {
  label:   string
  info:    string
  duration: number
  players: Record<string, { x: number; y: number }>
  ball:    { x: number; y: number }
}

// Combien le ballon progresse vers le but adverse (0 = sur place, 1 = jusqu'au but) :
// une finalité ambitieuse (tir, contre) fait avancer le jeu loin, une finalité de
// gestion (conservation, dégagement) ne fait que soulager la zone de départ
const FINALITY_PROGRESS: Record<string, number> = {
  shot: 0.82, chance: 0.62, combine: 0.42, keep: 0.18,
  recover: 0.28, press: 0.22, clear: 0.32, "force-long": 0.3,
  counter: 0.7, "build-out": 0.35, fix: 0.38,
}

const TRIGGER_INFO: Record<string, string> = {
  interception:    "Le ballon est intercepté avant d'arriver à son destinataire.",
  tackle:          "Un duel remporté permet de récupérer le ballon proprement.",
  "second-ball":   "Le ballon repoussé retombe favorablement pour relancer l'action.",
  "back-pass":     "L'adversaire joue en retrait ou latéralement : signal pour déclencher le pressing.",
  "keeper-release": "Le gardien adverse relance : le bloc oriente son pressing.",
  "bad-control":   "Un contrôle mal orienté de l'adversaire ouvre une fenêtre de récupération.",
  "switch-play":   "L'adversaire change de côté : le bloc se réoriente pour suivre le ballon.",
  dribble:         "Un dribble réussi déséquilibre le bloc adverse.",
  "run-in-space":  "Une course dans l'espace libre crée une option de passe immédiate.",
  "switch-pass":   "Le ballon est décalé vers un joueur libre, créant une option franche.",
  "set-piece":     "Une phase arrêtée (touche, corner, coup franc) relance l'action.",
  turnover:        "La perte du ballon déclenche immédiatement le repli ou le contre adverse.",
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

/* ── Playback authored (situations en plusieurs temps) ──── */
function buildFramePlayers(
  situation: BuiltSituation,
  frame: { players: Record<string, { x: number; y: number }> }
): Record<string, { x: number; y: number }> {
  const out: Record<string, { x: number; y: number }> = {}
  for (const p of situation.players) out[p.id] = frame.players[p.id] ?? { x: p.x, y: p.y }
  return out
}

export function hasAuthoredFrames(situation: BuiltSituation): boolean {
  return (situation.frames?.length ?? 0) > 0
}

export function buildAuthoredPlayback(situation: BuiltSituation): {
  main: PlaybackFrame[]
  branches: PlaybackFrame[]
} {
  const finality = FINALITIES.find(f => f.id === situation.finality)

  const frame0Players: Record<string, { x: number; y: number }> = {}
  for (const p of situation.players) frame0Players[p.id] = { x: p.x, y: p.y }

  const main: PlaybackFrame[] = [{
    label: "Position de départ",
    info: situation.description || "Schéma de départ tel que configuré.",
    duration: 1400,
    players: frame0Players,
    ball: situation.ball,
  }]

  situation.frames.forEach((f, i) => {
    const isLast = i === situation.frames.length - 1
    const trigger = f.trigger ? TRIGGERS.find(t => t.id === f.trigger) : undefined

    let label = f.label || `Étape ${i + 2}`
    let info = ""
    if (isLast && finality) {
      label = `${finality.emoji} ${f.label || finality.label}`
      info = FINALITY_INFO[situation.finality] ?? ""
    } else if (trigger) {
      label = `${trigger.emoji} ${f.label || trigger.label}`
      info = TRIGGER_INFO[trigger.id] ?? ""
    }

    main.push({
      label,
      info,
      duration: 1500,
      players: buildFramePlayers(situation, f),
      ball: f.ball,
    })
  })

  const branches: PlaybackFrame[] = situation.branches.map(b => ({
    label: b.label || "Branche alternative",
    info: "",
    duration: 1500,
    players: buildFramePlayers(situation, b),
    ball: b.ball,
  }))

  return { main, branches }
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
