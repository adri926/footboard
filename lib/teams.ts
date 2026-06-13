import { cookies } from "next/headers"
import { supabase } from "@/lib/supabase"
import type { ClubScope, ClubScopeFilter } from "@/lib/scope"

export const ACTIVE_TEAM_COOKIE = "fb_active_team_id"

export interface Team {
  id:   string
  name: string
}

export async function getClubTeams(scope: ClubScopeFilter): Promise<Team[]> {
  const { data } = await supabase
    .from("teams")
    .select("id, name")
    .eq(scope.column, scope.value)
    .order("created_at")
  return data ?? []
}

// Garantit qu'au moins une équipe existe pour ce club (clubs créés après cette migration
// n'ont pas encore d'équipe par défaut). Retourne la première équipe sinon en crée une.
export async function getOrCreateDefaultTeam(scope: ClubScope): Promise<Team> {
  const existing = await getClubTeams({ column: scope.column, value: scope.value })
  if (existing.length > 0) return existing[0]

  const { data, error } = await supabase
    .from("teams")
    .insert({ owner_id: scope.userId, org_id: scope.orgId, name: "Équipe 1" })
    .select("id, name")
    .single()
  if (error || !data) throw new Error(error?.message ?? "Impossible de créer l'équipe par défaut")
  return data
}

// Équipe active du coach (cookie), repliée sur la première équipe du club si absente/invalide.
export async function getActiveTeam(scope: ClubScope): Promise<Team> {
  const teams = await getClubTeams({ column: scope.column, value: scope.value })
  const fallback = teams[0] ?? await getOrCreateDefaultTeam(scope)
  const cookieStore = await cookies()
  const activeId = cookieStore.get(ACTIVE_TEAM_COOKIE)?.value
  return teams.find(t => t.id === activeId) ?? fallback
}
