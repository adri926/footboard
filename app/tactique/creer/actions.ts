"use server"

import { auth } from "@clerk/nextjs/server"
import { z } from "zod"
import { supabase } from "@/lib/supabase"
import { getClubScope } from "@/lib/scope"
import { TACTICAL_TAGS, TRIGGERS, MAX_FRAMES, MAX_BRANCHES, type BuiltSituation } from "@/lib/builder"

const TAG_IDS = TACTICAL_TAGS.map(t => t.id) as [string, ...string[]]
const TRIGGER_IDS = TRIGGERS.map(t => t.id) as [string, ...string[]]

const ZONE_IDS = [
  "def-left", "def-center", "def-right",
  "mid-left", "mid-center", "mid-right",
  "att-left", "att-center", "att-right",
] as const

const CONFIGS   = ["1v1","2v1","2v2","3v2","3v3","4v3","4v4","5v4"] as const
const FINALITIES = [
  "shot","chance","combine","keep",
  "recover","press","clear","force-long",
  "counter","build-out","fix",
] as const

const PositionSchema = z.object({
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
})

const FrameSchema = z.object({
  label:   z.string().max(40),
  players: z.record(z.string().regex(/^[ha]\d+$/).max(4), PositionSchema),
  ball:    PositionSchema,
  trigger: z.enum(TRIGGER_IDS).optional(),
})

const SaveSchema = z.object({
  zone:        z.enum(ZONE_IDS),
  config:      z.enum(CONFIGS),
  finality:    z.enum(FINALITIES),
  description: z.string().max(1000).default(""),
  players: z.array(z.object({
    id:   z.string().regex(/^[ha]\d+$/).max(4),
    team: z.enum(["home", "away"]),
    x:    z.number().min(0).max(100),
    y:    z.number().min(0).max(100),
  })).max(20),
  ball: z.object({
    x: z.number().min(0).max(100),
    y: z.number().min(0).max(100),
  }),
  tags: z.array(z.enum(TAG_IDS)).max(5).default([]),
  frames: z.array(FrameSchema).max(MAX_FRAMES - 1).default([]),
  branches: z.array(FrameSchema).max(MAX_BRANCHES).default([]),
})

export async function saveBuiltSituation(
  raw: unknown
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { userId } = await auth()
  if (!userId) return { ok: false, error: "Connecte-toi pour sauvegarder." }
  const scope = await getClubScope()

  const parsed = SaveSchema.safeParse(raw)
  if (!parsed.success) return { ok: false, error: "Données invalides." }

  const data = parsed.data
  const { error } = await supabase
    .from("built_situations")
    .insert({
      owner_id:    scope.userId,
      org_id:      scope.orgId,
      zone:        data.zone,
      config:      data.config,
      finality:    data.finality,
      description: data.description,
      players:     data.players,
      ball:        data.ball,
      tags:        data.tags,
      frames:      data.frames,
      branches:    data.branches,
    })

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function getBuiltSituations(): Promise<BuiltSituation[]> {
  const { userId } = await auth()
  if (!userId) return []
  const scope = await getClubScope()

  const { data, error } = await supabase
    .from("built_situations")
    .select("id, zone, config, finality, description, players, ball, tags, frames, branches, created_at")
    .eq(scope.column, scope.value)
    .order("created_at", { ascending: false })

  if (error || !data) return []
  return data as BuiltSituation[]
}

export async function getBuiltSituation(id: string): Promise<BuiltSituation | null> {
  const { userId } = await auth()
  if (!userId) return null
  const scope = await getClubScope()

  const { data, error } = await supabase
    .from("built_situations")
    .select("id, zone, config, finality, description, players, ball, tags, frames, branches, created_at")
    .eq(scope.column, scope.value)
    .eq("id", id)
    .maybeSingle()

  if (error || !data) return null
  return data as BuiltSituation
}

export async function deleteBuiltSituation(
  id: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { userId } = await auth()
  if (!userId) return { ok: false, error: "Connecte-toi pour supprimer." }
  const scope = await getClubScope()

  const { error } = await supabase
    .from("built_situations")
    .delete()
    .eq("id", id)
    .eq(scope.column, scope.value)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
