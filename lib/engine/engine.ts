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
