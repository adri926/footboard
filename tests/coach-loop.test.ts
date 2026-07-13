import { describe, it, expect } from "vitest"
import { matchConcept } from "@/lib/coach-loop"

describe("matchConcept — axe (phase/style) → concept animé", () => {
  it("mappe précisément les combinaisons phase+style", () => {
    expect(matchConcept({ phase: "attack", style: "possession" })?.id).toBe("triangle-milieu")
    expect(matchConcept({ phase: "attack", style: "counter" })?.id).toBe("transition-offensive")
    expect(matchConcept({ phase: "defense", style: "counter" })?.id).toBe("retour-defensif")
    expect(matchConcept({ phase: "defense", style: "high-press" })?.id).toBe("pressing-haut")
    expect(matchConcept({ phase: "attack", style: "depth" })?.id).toBe("faux-9")
  })

  it("renvoie toujours un concept non nul pour un axe valide", () => {
    const phases = ["attack", "defense"] as const
    const styles = ["possession", "counter", "depth", "low-block", "mid-block", "high-press"] as const
    for (const phase of phases) {
      for (const style of styles) {
        expect(matchConcept({ phase, style })).not.toBeNull()
      }
    }
  })
})
