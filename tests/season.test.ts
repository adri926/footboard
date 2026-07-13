import { describe, it, expect } from "vitest"
import { getCurrentSeason } from "@/lib/season"

describe("getCurrentSeason", () => {
  it("bascule à l'été : juillet → saison y/y+1", () => {
    expect(getCurrentSeason(new Date(2026, 6, 1))).toBe("2026/2027") // juillet (index 6)
    expect(getCurrentSeason(new Date(2026, 6, 15))).toBe("2026/2027")
    expect(getCurrentSeason(new Date(2026, 11, 31))).toBe("2026/2027") // décembre
  })

  it("avant juillet → saison y-1/y", () => {
    expect(getCurrentSeason(new Date(2026, 0, 15))).toBe("2025/2026") // janvier
    expect(getCurrentSeason(new Date(2026, 5, 30))).toBe("2025/2026") // juin (index 5)
  })
})
