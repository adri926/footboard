import { PLAYER_ROLES, PLAYER_SIDE, BASE_DEPTH, BASE_WIDTH } from "./roles"

export type PossessionState = "red" | "blue" | "contested" | "transition"

export interface EngineCtx {
  ball: { x: number; y: number }
  possession: PossessionState
  // who holds the ball this tick (red player = attacking down, blue = attacking up)
  ballHolder?: string
}

// 9-zone grid helpers (rouge perspective: y=0 top, y=100 bottom)
export type ZoneDepth = "deep" | "mid" | "high"   // deep=0-33, mid=33-66, high=66-100
export type ZoneSide  = "left" | "center" | "right"

export function ballZoneDepth(y: number): ZoneDepth {
  if (y < 33) return "deep"
  if (y < 66) return "mid"
  return "high"
}

export function ballZoneSide(x: number): ZoneSide {
  if (x < 35) return "left"
  if (x > 65) return "right"
  return "center"
}

// Clamp helper
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)) }

// Mirror y for blue team (blue attacks up, y=0 is their goal)
function mirrorY(y: number) { return 100 - y }

// ── Target computation ──────────────────────────────────────────────────────

function attackTarget(id: string, ctx: EngineCtx): { x: number; y: number } {
  const role = PLAYER_ROLES[id]
  const side = PLAYER_SIDE[id] ?? "center"
  const isBlue = id.startsWith("b")
  const bx = ctx.ball.x
  const by = isBlue ? mirrorY(ctx.ball.y) : ctx.ball.y
  const depth = ballZoneDepth(by)
  const ballSide = ballZoneSide(bx)

  const baseX = BASE_WIDTH[role][side]
  const baseY = BASE_DEPTH[role]

  let tx = baseX
  let ty = baseY

  // Push lines forward when ball is in high zone
  const depthPush = depth === "high" ? 12 : depth === "mid" ? 6 : 0

  switch (role) {
    case "GK":
      tx = 50
      ty = clamp(by * 0.12, 5, 14)
      break
    case "CB":
      tx = side === "right" ? clamp(60 + (ballSide === "right" ? 6 : -4), 54, 72)
                            : clamp(40 - (ballSide === "left"  ? 6 : -4), 28, 46)
      ty = clamp(baseY + depthPush - 4, 16, 42)
      break
    case "RB":
    case "LB":
      // Fullbacks overlap aggressively in possession
      tx = side === "right" ? clamp(76 + (ballSide === "right" ? 8 : -6), 62, 90)
                            : clamp(24 - (ballSide === "left"  ? 8 : -6), 10, 38)
      ty = clamp(baseY + depthPush + (depth === "high" ? 10 : 0), 20, 68)
      break
    case "DM":
      tx = clamp(50 + (ballSide === "right" ? 8 : ballSide === "left" ? -8 : 0), 36, 64)
      ty = clamp(baseY + depthPush * 0.5, 24, 46)
      break
    case "CM":
      tx = clamp(baseX + (ballSide === "right" ? 10 : ballSide === "left" ? -10 : 0), 22, 78)
      ty = clamp(baseY + depthPush, 28, 60)
      break
    case "CAM":
      tx = clamp(baseX + (ballSide === side ? 8 : -4), 26, 74)
      ty = clamp(baseY + depthPush, 40, 68)
      break
    case "RW":
    case "LW":
      // Wide players hug touch line, pull into box in high zone
      tx = side === "right"
        ? (depth === "high" ? clamp(bx > 50 ? 72 : 82, 60, 90) : 84)
        : (depth === "high" ? clamp(bx < 50 ? 28 : 18, 10, 40) : 16)
      ty = clamp(baseY + depthPush + (depth === "high" ? 8 : 0), 44, 74)
      break
    case "ST": {
      // En attaque à deux pointes, le binôme s'écarte pour ne pas se superposer
      const stOffset = side === "right" ? 9 : side === "left" ? -9 : 0
      tx = clamp(50 + stOffset + (ballSide === "right" ? 6 : ballSide === "left" ? -6 : 0), 30, 70)
      ty = clamp(baseY + depthPush + (depth === "high" ? 12 : 0), 48, 82)
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
  const depth = ballZoneDepth(by)
  const ballSide = ballZoneSide(bx)

  let tx = BASE_WIDTH[role][side]
  let ty = BASE_DEPTH[role]

  // Pull entire block toward ball — depth compression
  const depthPull = depth === "deep" ? -8 : depth === "mid" ? 0 : 8

  switch (role) {
    case "GK":
      tx = 50
      ty = clamp(5 + (depth === "deep" ? 2 : 0), 4, 12)
      break
    case "CB":
      tx = side === "right" ? clamp(62 + (ballSide === "right" ? 4 : -6), 52, 74)
                            : clamp(38 - (ballSide === "left"  ? 4 : -6), 26, 48)
      ty = clamp(ty + depthPull, 14, 36)
      break
    case "RB":
    case "LB":
      // Defensive fullbacks tuck in, narrow width
      tx = side === "right" ? clamp(72 - (depth === "deep" ? 6 : 0), 58, 82)
                            : clamp(28 + (depth === "deep" ? 6 : 0), 18, 42)
      ty = clamp(ty + depthPull, 18, 38)
      break
    case "DM":
      tx = clamp(50 + (ballSide === "right" ? 10 : ballSide === "left" ? -10 : 0), 32, 68)
      ty = clamp(30 + depthPull * 0.6, 22, 44)
      break
    case "CM": {
      // Garde un écart latéral entre les trois milieux quel que soit le côté du ballon
      const cmOffset = side === "right" ? 6 : side === "left" ? -6 : 0
      tx = clamp(BASE_WIDTH[role][side] + cmOffset + (ballSide === side ? 10 : -6), 18, 82)
      ty = clamp(ty + depthPull, 28, 50)
      break
    }
    case "CAM":
      // CAM drops to press in defense
      tx = clamp(50 + (ballSide === "right" ? 12 : ballSide === "left" ? -12 : 0), 28, 72)
      ty = clamp(40 + depthPull, 28, 52)
      break
    case "RW":
    case "LW":
      // Wingers track back to midfield line
      tx = side === "right" ? clamp(76 - (depth === "deep" ? 10 : 0), 54, 86)
                            : clamp(24 + (depth === "deep" ? 10 : 0), 14, 46)
      ty = clamp(ty + depthPull + 4, 34, 56)
      break
    case "ST": {
      // ST presses high, doesn't track deep — le binôme s'écarte pour couvrir plus large
      const stOffset = side === "right" ? 9 : side === "left" ? -9 : 0
      tx = clamp(50 + stOffset + (ballSide === "right" ? 8 : ballSide === "left" ? -8 : 0), 28, 72)
      ty = clamp(depth === "deep" ? 42 : depth === "mid" ? 36 : 28, 22, 48)
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
  const ballSide = ballZoneSide(bx)

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
      tx = clamp(50 + lateral + (ballSide === "right" ? 8 : ballSide === "left" ? -8 : 0), 22, 78)
      ty = clamp(by * 0.55 + 14, 26, 54); break
    }
    case "CAM": case "RW": case "LW":
      tx = BASE_WIDTH[role][side]
      ty = clamp(by * 0.65 + 12, 32, 62); break
    case "ST": {
      const stOffset = side === "right" ? 9 : side === "left" ? -9 : 0
      tx = clamp(50 + stOffset + (ballSide === "right" ? 6 : ballSide === "left" ? -6 : 0), 28, 72)
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
  const ballSide = ballZoneSide(bx)

  let tx = BASE_WIDTH[role][side]
  let ty = BASE_DEPTH[role]

  switch (role) {
    case "GK": tx = 50; ty = 7; break
    case "CB":
      tx = side === "right" ? 62 : 38; ty = clamp(20 + by * 0.1, 16, 28); break
    case "RB": case "LB":
      tx = side === "right" ? 76 : 24; ty = clamp(22 + by * 0.12, 18, 34); break
    case "DM":
      tx = clamp(50 + (ballSide === "right" ? 8 : ballSide === "left" ? -8 : 0), 34, 66)
      ty = clamp(by * 0.4 + 14, 24, 42); break
    case "CM":
      tx = clamp(BASE_WIDTH[role][side] + (ballSide === side ? 6 : -4), 22, 78)
      ty = clamp(by * 0.45 + 16, 28, 46); break
    case "CAM": case "RW": case "LW":
      tx = BASE_WIDTH[role][side]
      ty = clamp(by * 0.5 + 18, 32, 52); break
    case "ST": {
      const stOffset = side === "right" ? 9 : side === "left" ? -9 : 0
      tx = clamp(50 + stOffset + (ballSide === "right" ? 6 : ballSide === "left" ? -6 : 0), 28, 72)
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
