import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock de Clerk : getClubScope() lit auth() pour décider du filtre d'isolation.
const { authMock } = vi.hoisted(() => ({ authMock: vi.fn() }))
vi.mock("@clerk/nextjs/server", () => ({ auth: authMock }))

import { getClubScope, getPlayerClubScope } from "@/lib/scope"
import type { Club } from "@/app/dashboard/club/actions"

// Cœur de la sécurité multi-clubs : toutes les server actions filtrent leurs requêtes
// Supabase (service-role, RLS off) par le scope renvoyé ici. Si cette décision est fausse,
// c'est la porte ouverte aux fuites entre clubs.
describe("getClubScope — décision du filtre d'isolation multi-clubs", () => {
  beforeEach(() => authMock.mockReset())

  it("org active → filtre par org_id (multi-comptes prioritaire)", async () => {
    authMock.mockResolvedValue({ userId: "user-1", orgId: "org-A" })
    expect(await getClubScope()).toEqual({ column: "org_id", value: "org-A", userId: "user-1", orgId: "org-A" })
  })

  it("sans org → filtre par owner_id (legacy)", async () => {
    authMock.mockResolvedValue({ userId: "user-1", orgId: null })
    expect(await getClubScope()).toEqual({ column: "owner_id", value: "user-1", userId: "user-1", orgId: null })
  })

  it("non authentifié → refuse (throw), jamais de scope permissif", async () => {
    authMock.mockResolvedValue({ userId: null, orgId: null })
    await expect(getClubScope()).rejects.toThrow("Non authentifié")
  })

  it("deux users distincts → deux scopes distincts (isolation)", async () => {
    authMock.mockResolvedValue({ userId: "club-A", orgId: null })
    const a = await getClubScope()
    authMock.mockResolvedValue({ userId: "club-B", orgId: null })
    const b = await getClubScope()
    expect(a.value).not.toBe(b.value)
  })
})

describe("getPlayerClubScope — filtre côté données joueur", () => {
  const club = (org_id: string | null): Club =>
    ({ id: "c1", owner_id: "user-1", org_id, name: "AS Test", created_at: "" } as unknown as Club)

  it("club en org → org_id", () => {
    expect(getPlayerClubScope(club("org-A"))).toEqual({ column: "org_id", value: "org-A" })
  })
  it("club legacy → owner_id", () => {
    expect(getPlayerClubScope(club(null))).toEqual({ column: "owner_id", value: "user-1" })
  })
})
