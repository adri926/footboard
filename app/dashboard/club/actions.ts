"use server"

import { dbError } from "@/lib/db-error"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/supabase"
import { getClubScope } from "@/lib/scope"

export interface Club {
  id:         string
  owner_id:   string
  org_id:     string | null
  name:       string
  city:       string | null
  level:      string | null
  logo:       string | null
  created_at: string
}

const ClubSchema = z.object({
  name:  z.string().min(1).max(100).trim(),
  city:  z.string().max(100).trim().nullable().optional(),
  level: z.string().max(100).trim().nullable().optional(),
  logo:  z.string().max(2000).trim().nullable().optional(),
})

export async function getMyClub(): Promise<Club | null> {
  const { userId, orgId } = await auth()
  if (!userId) throw new Error("Non authentifié")

  // Org active sélectionnée (multi-comptes) : prioritaire sur le owner_id legacy
  if (orgId) {
    const { data } = await supabase
      .from("clubs")
      .select("*")
      .eq("org_id", orgId)
      .single()
    if (data) return data
  }

  const { data } = await supabase
    .from("clubs")
    .select("*")
    .eq("owner_id", userId)
    .single()
  return data ?? null
}

export type SubscriptionPlan = "solo" | "club"

export async function getClubPlan(): Promise<SubscriptionPlan> {
  const club = await getMyClub()
  if (!club) return "solo"

  const { data } = await supabase
    .from("subscriptions")
    .select("plan")
    .eq("club_id", club.id)
    .single()

  return (data?.plan as SubscriptionPlan) ?? "solo"
}

export async function requireFeesAccess(): Promise<void> {
  const { has } = await auth()
  if (!has({ permission: "org:fees:manage" })) {
    throw new Error("Accès réservé à l'admin ou au coach adjoint trésorerie")
  }
}

export async function createClub(
  raw: unknown
): Promise<{ ok: true; orgId: string | null } | { ok: false; error: string }> {
  const { userId, orgId: activeOrgId } = await auth()
  if (!userId) throw new Error("Non authentifié")

  const parsed = ClubSchema.safeParse(raw)
  if (!parsed.success) return { ok: false, error: "Données invalides." }

  // Chaque club a son organisation Clerk dès la création (le créateur devient org:admin),
  // ce qui permet d'inviter coach adjoint / trésorier plus tard sans étape de migration.
  let orgId = activeOrgId
  if (!orgId) {
    const clerk = await clerkClient()
    const org = await clerk.organizations.createOrganization({
      name: parsed.data.name,
      createdBy: userId,
    })
    orgId = org.id
  }

  const { error } = await supabase
    .from("clubs")
    .insert({ ...parsed.data, owner_id: userId, org_id: orgId })

  if (error) return dbError(error)
  revalidatePath("/dashboard")
  return { ok: true, orgId }
}

export async function updateClub(
  raw: unknown
): Promise<{ ok: true } | { ok: false; error: string }> {
  const scope = await getClubScope()

  const parsed = ClubSchema.safeParse(raw)
  if (!parsed.success) return { ok: false, error: "Données invalides." }

  const { error } = await supabase
    .from("clubs")
    .update(parsed.data)
    .eq(scope.column, scope.value)

  if (error) return dbError(error)
  revalidatePath("/dashboard", "layout")
  return { ok: true }
}
