import { describe, it, expect } from "vitest"
import { buildSessionFromWeakness } from "@/lib/session-generator"

describe("buildSessionFromWeakness — séance déterministe depuis un axe", () => {
  const weakness = { phase: "defense", style: "counter", title: "Transitions fragiles" } as const

  it("assemble une séance équilibrée (activation → cœur → jeu global)", () => {
    const blocks = buildSessionFromWeakness(weakness)
    expect(blocks.length).toBeGreaterThan(0)
    expect(blocks.length).toBeLessThanOrEqual(4)
    // Première brique = activation (échauffement).
    expect(blocks[0].exercise.family).toBe("activation")
    // Se termine par du jeu global si disponible.
    expect(blocks.some(b => b.exercise.family === "jeu_global")).toBe(true)
  })

  it("ordonne les blocs et ne répète pas un exercice", () => {
    const blocks = buildSessionFromWeakness(weakness)
    blocks.forEach((b, i) => expect(b.order).toBe(i))
    const ids = blocks.map(b => b.exerciseId)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it("porte le titre de l'axe dans les notes", () => {
    const blocks = buildSessionFromWeakness(weakness)
    expect(blocks[0].customNotes).toContain("Transitions fragiles")
  })
})
