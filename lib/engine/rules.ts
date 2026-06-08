import { PLAYER_ROLES, PLAYER_SIDE, BASE_DEPTH, BASE_WIDTH, type Side } from "./roles"

export type PossessionState = "red" | "blue" | "contested" | "transition"

export interface EngineCtx {
  ball: { x: number; y: number }
  possession: PossessionState
  // who holds the ball this tick (red player = attacking down, blue = attacking up)
  ballHolder?: string
}

// Clamp helper
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)) }

// Mirror y for blue team (blue attacks up, y=0 is their goal)
function mirrorY(y: number) { return 100 - y }

// ── Réponse continue à la position du ballon ────────────────────────────────
// On évite volontairement les paliers (zones discrètes) : un joueur doit glisser
// progressivement avec le ballon, pas sauter d'une position à l'autre quand le
// ballon franchit une frontière de zone — c'est ce qui rendait les déplacements
// saccadés et peu crédibles.

// 0 = ligne de fond du camp considéré, 1 = ligne de fond adverse
function depthFactor(y: number) { return clamp(y, 0, 100) / 100 }

// -1 = couloir gauche, 0 = axe central, +1 = couloir droit
function sideFactor(x: number) { return clamp((x - 50) / 50, -1, 1) }

// Alignement entre le côté du joueur et le côté du ballon : +1 = ballon de son côté,
// -1 = ballon du côté opposé, 0 pour un joueur axial
function sideAlign(side: Side, x: number): number {
  if (side === "center") return 0
  const f = sideFactor(x)
  return side === "right" ? f : -f
}

// Interpole linéairement entre deux bornes selon un ratio 0..1
function mix(low: number, high: number, ratio: number) { return low + (high - low) * ratio }

// Interpole entre [ballon côté opposé, ballon aligné] selon un alignement -1..1
function mixAlign(whenOpposite: number, whenAligned: number, align: number) {
  return mix(whenOpposite, whenAligned, (align + 1) / 2)
}

// ── Target computation ──────────────────────────────────────────────────────

function attackTarget(id: string, ctx: EngineCtx): { x: number; y: number } {
  const role = PLAYER_ROLES[id]
  const side = PLAYER_SIDE[id] ?? "center"
  const isBlue = id.startsWith("b")
  const bx = ctx.ball.x
  const by = isBlue ? mirrorY(ctx.ball.y) : ctx.ball.y
  const align = sideAlign(side, bx)

  const baseX = BASE_WIDTH[role][side]
  const baseY = BASE_DEPTH[role]

  let tx = baseX
  let ty = baseY

  // Pousse les lignes vers l'avant à mesure que le ballon avance
  const depthPush = depthFactor(by) * 12

  switch (role) {
    case "GK":
      tx = 50
      ty = clamp(by * 0.12, 5, 14)
      break
    case "CB":
      tx = side === "right" ? clamp(60 + mixAlign(-4, 6, align), 54, 72)
                            : clamp(40 + mixAlign(4, -6, align), 28, 46)
      ty = clamp(baseY + depthPush - 4, 16, 42)
      break
    case "RB":
    case "LB":
      // Fullbacks overlap aggressively in possession
      tx = side === "right" ? clamp(76 + mixAlign(-6, 8, align), 62, 90)
                            : clamp(24 + mixAlign(6, -8, align), 10, 38)
      ty = clamp(baseY + depthPush + depthFactor(by) * 10, 20, 68)
      break
    case "DM":
      tx = clamp(50 + sideFactor(bx) * 8, 36, 64)
      ty = clamp(baseY + depthPush * 0.5, 24, 46)
      break
    case "CM":
      tx = clamp(baseX + sideFactor(bx) * 10, 22, 78)
      ty = clamp(baseY + depthPush, 28, 60)
      break
    case "CAM":
      tx = clamp(baseX + mixAlign(-4, 8, align), 26, 74)
      ty = clamp(baseY + depthPush, 40, 68)
      break
    case "RW":
    case "LW": {
      // Colle à la ligne de touche en phase basse, glisse progressivement vers
      // l'intérieur en zone offensive — plus près du but quand le ballon est de
      // son côté (course au premier poteau), plus large sinon (second poteau)
      const touchlineX = side === "right" ? 84 : 16
      const nearPostX  = side === "right" ? 72 : 28
      const farPostX   = side === "right" ? 82 : 18
      const inboxX = mixAlign(farPostX, nearPostX, align)
      tx = clamp(mix(touchlineX, inboxX, depthFactor(by)), 10, 90)
      ty = clamp(baseY + depthPush + depthFactor(by) * 8, 44, 74)
      break
    }
    case "ST": {
      // En attaque à deux pointes, le binôme s'écarte pour ne pas se superposer
      const stOffset = side === "right" ? 9 : side === "left" ? -9 : 0
      tx = clamp(50 + stOffset + sideFactor(bx) * 6, 30, 70)
      ty = clamp(baseY + depthPush + depthFactor(by) * 12, 48, 82)
      break
    }
  }

  if (isBlue) {
    tx = 100 - tx
    ty = mirrorY(ty)
  }
  return { x: clamp(tx, 4, 96), y: clamp(ty, 4, 96) }
}

function defendTarget(id: string, ctx: EngineCtx): { x: number; y: number } {
  const role = PLAYER_ROLES[id]
  const side = PLAYER_SIDE[id] ?? "center"
  const isBlue = id.startsWith("b")
  const bx = isBlue ? 100 - ctx.ball.x : ctx.ball.x
  const by = isBlue ? mirrorY(ctx.ball.y) : ctx.ball.y
  const align = sideAlign(side, bx)

  let tx = BASE_WIDTH[role][side]
  let ty = BASE_DEPTH[role]

  // Comprime le bloc selon la profondeur du ballon : recule en zone basse, sort en zone haute
  const depthPull = mix(-8, 8, depthFactor(by))
  // Proximité du but propre (1 = ballon collé à la ligne de fond, 0 = ballon haut)
  const ownGoalProximity = 1 - depthFactor(by)

  switch (role) {
    case "GK":
      tx = 50
      ty = clamp(5 + ownGoalProximity * 2, 4, 12)
      break
    case "CB":
      tx = side === "right" ? clamp(62 + mixAlign(-6, 4, align), 52, 74)
                            : clamp(38 + mixAlign(6, -4, align), 26, 48)
      ty = clamp(ty + depthPull, 14, 36)
      break
    case "RB":
    case "LB":
      // Defensive fullbacks tuck in, narrow width
      tx = side === "right" ? clamp(72 - ownGoalProximity * 6, 58, 82)
                            : clamp(28 + ownGoalProximity * 6, 18, 42)
      ty = clamp(ty + depthPull, 18, 38)
      break
    case "DM":
      tx = clamp(50 + sideFactor(bx) * 10, 32, 68)
      ty = clamp(30 + depthPull * 0.6, 22, 44)
      break
    case "CM": {
      // Garde un écart latéral entre les trois milieux quel que soit le côté du ballon
      const cmOffset = side === "right" ? 6 : side === "left" ? -6 : 0
      tx = clamp(tx + cmOffset + mixAlign(-6, 10, align), 18, 82)
      ty = clamp(ty + depthPull, 28, 50)
      break
    }
    case "CAM":
      // CAM drops to press in defense
      tx = clamp(50 + sideFactor(bx) * 12, 28, 72)
      ty = clamp(40 + depthPull, 28, 52)
      break
    case "RW":
    case "LW":
      // Wingers track back to midfield line
      tx = side === "right" ? clamp(76 - ownGoalProximity * 10, 54, 86)
                            : clamp(24 + ownGoalProximity * 10, 14, 46)
      ty = clamp(ty + depthPull + 4, 34, 56)
      break
    case "ST": {
      // ST presses high, doesn't track deep — le binôme s'écarte pour couvrir plus large
      const stOffset = side === "right" ? 9 : side === "left" ? -9 : 0
      tx = clamp(50 + stOffset + sideFactor(bx) * 8, 28, 72)
      ty = clamp(mix(28, 42, ownGoalProximity), 22, 48)
    }
      break
  }

  if (isBlue) {
    tx = 100 - tx
    ty = mirrorY(ty)
  }
  return { x: clamp(tx, 4, 96), y: clamp(ty, 4, 96) }
}

function contestedTarget(id: string, ctx: EngineCtx): { x: number; y: number } {
  // Second ball / dégagement: compact shape around ball, react to zone
  const role = PLAYER_ROLES[id]
  const side = PLAYER_SIDE[id] ?? "center"
  const isBlue = id.startsWith("b")
  const bx = isBlue ? 100 - ctx.ball.x : ctx.ball.x
  const by = isBlue ? mirrorY(ctx.ball.y) : ctx.ball.y

  let tx = BASE_WIDTH[role][side]
  let ty = BASE_DEPTH[role]

  switch (role) {
    case "GK":
      tx = 50; ty = clamp(8 + by * 0.04, 5, 14); break
    case "CB":
      tx = side === "right" ? 64 : 36
      ty = clamp(by * 0.3 + 10, 16, 34); break
    case "RB": case "LB":
      tx = side === "right" ? 76 : 24
      ty = clamp(by * 0.35 + 12, 18, 40); break
    case "DM": case "CM": {
      // Écart latéral entre milieux pour ne pas se superposer sur un second ballon central
      const lateral = side === "right" ? 14 : side === "left" ? -14 : 0
      tx = clamp(50 + lateral + sideFactor(bx) * 8, 22, 78)
      ty = clamp(by * 0.55 + 14, 26, 54); break
    }
    case "CAM": case "RW": case "LW":
      tx = BASE_WIDTH[role][side]
      ty = clamp(by * 0.65 + 12, 32, 62); break
    case "ST": {
      const stOffset = side === "right" ? 9 : side === "left" ? -9 : 0
      tx = clamp(50 + stOffset + sideFactor(bx) * 6, 28, 72)
      ty = clamp(by * 0.7 + 16, 38, 68)
      break
    }
  }

  if (isBlue) {
    tx = 100 - tx
    ty = mirrorY(ty)
  }
  return { x: clamp(tx, 4, 96), y: clamp(ty, 4, 96) }
}

function transitionTarget(id: string, ctx: EngineCtx): { x: number; y: number } {
  // Loss of ball: immediate sprint to structured shape
  const role = PLAYER_ROLES[id]
  const side = PLAYER_SIDE[id] ?? "center"
  const isBlue = id.startsWith("b")
  const bx = isBlue ? 100 - ctx.ball.x : ctx.ball.x
  const by = isBlue ? mirrorY(ctx.ball.y) : ctx.ball.y
  const align = sideAlign(side, bx)

  let tx = BASE_WIDTH[role][side]
  let ty = BASE_DEPTH[role]

  switch (role) {
    case "GK": tx = 50; ty = 7; break
    case "CB":
      tx = side === "right" ? 62 : 38; ty = clamp(20 + by * 0.1, 16, 28); break
    case "RB": case "LB":
      tx = side === "right" ? 76 : 24; ty = clamp(22 + by * 0.12, 18, 34); break
    case "DM":
      tx = clamp(50 + sideFactor(bx) * 8, 34, 66)
      ty = clamp(by * 0.4 + 14, 24, 42); break
    case "CM":
      tx = clamp(tx + mixAlign(-4, 6, align), 22, 78)
      ty = clamp(by * 0.45 + 16, 28, 46); break
    case "CAM": case "RW": case "LW":
      tx = BASE_WIDTH[role][side]
      ty = clamp(by * 0.5 + 18, 32, 52); break
    case "ST": {
      const stOffset = side === "right" ? 9 : side === "left" ? -9 : 0
      tx = clamp(50 + stOffset + sideFactor(bx) * 6, 28, 72)
      ty = clamp(by * 0.5 + 20, 36, 54)
      break
    }
  }

  if (isBlue) {
    tx = 100 - tx
    ty = mirrorY(ty)
  }
  return { x: clamp(tx, 4, 96), y: clamp(ty, 4, 96) }
}

// ── Public API ───────────────────────────────────────────────────────────────

export function computePlayerTarget(
  id: string,
  ctx: EngineCtx,
): { x: number; y: number } {
  const isRed  = id.startsWith("r")
  const isBlue = id.startsWith("b")
  const poss   = ctx.possession

  if (poss === "contested") return contestedTarget(id, ctx)
  if (poss === "transition") return transitionTarget(id, ctx)

  const teamHasBall = (isRed && poss === "red") || (isBlue && poss === "blue")
  return teamHasBall
    ? attackTarget(id, ctx)
    : defendTarget(id, ctx)
}
