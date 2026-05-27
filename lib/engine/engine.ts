import { computePlayerTarget, type PossessionState, type EngineCtx } from "./rules"

const ALL_IDS = [
  "r1","r2","r3","r4","r5","r6","r7","r8","r9","r10","r11",
  "b1","b2","b3","b4","b5","b6","b7","b8","b9","b10","b11",
]

export type PositionMap = Record<string, { x: number; y: number }>

// Compute target positions for all 22 players given ball + possession state
export function computeTargetPositions(
  ball: { x: number; y: number },
  possession: PossessionState,
): PositionMap {
  const ctx: EngineCtx = { ball, possession }
  const result: PositionMap = {}
  for (const id of ALL_IDS) {
    result[id] = computePlayerTarget(id, ctx)
  }
  return result
}

// Add small jitter so players don't freeze in identical positions tick-to-tick
export function jitter(pos: PositionMap, amplitude = 1.2): PositionMap {
  const out: PositionMap = {}
  for (const [id, p] of Object.entries(pos)) {
    out[id] = {
      x: Math.max(4, Math.min(96, p.x + (Math.random() - 0.5) * amplitude)),
      y: Math.max(4, Math.min(96, p.y + (Math.random() - 0.5) * amplitude)),
    }
  }
  return out
}

// Blend current positions toward target (smooth movement)
export function lerp(
  current: PositionMap,
  target: PositionMap,
  t = 0.35,
): PositionMap {
  const out: PositionMap = {}
  for (const id of ALL_IDS) {
    const c = current[id]
    const tg = target[id]
    if (!c || !tg) { out[id] = tg ?? c; continue }
    out[id] = {
      x: c.x + (tg.x - c.x) * t,
      y: c.y + (tg.y - c.y) * t,
    }
  }
  return out
}
