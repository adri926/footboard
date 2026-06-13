import { auth } from "@clerk/nextjs/server"
import type { Club } from "@/app/dashboard/club/actions"

export interface ClubScope {
  column: "org_id" | "owner_id"
  value:  string
  userId: string
  orgId:  string | null
}

// Org active sélectionnée (multi-comptes) : prioritaire sur le owner_id legacy
export async function getClubScope(): Promise<ClubScope> {
  const { userId, orgId } = await auth()
  if (!userId) throw new Error("Non authentifié")
  if (orgId) return { column: "org_id", value: orgId, userId, orgId }
  return { column: "owner_id", value: userId, userId, orgId: null }
}

export interface ClubScopeFilter {
  column: "org_id" | "owner_id"
  value:  string
}

// Org active si elle existe (multi-comptes), sinon owner_id legacy
export function getPlayerClubScope(club: Club): ClubScopeFilter {
  if (club.org_id) return { column: "org_id", value: club.org_id }
  return { column: "owner_id", value: club.owner_id }
}
