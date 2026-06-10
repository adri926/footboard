import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { currentUser } from "@clerk/nextjs/server"
import { getMyClub } from "@/app/dashboard/club/actions"
import { supabase } from "@/lib/supabase"
import { getExerciseById } from "@/lib/exercises"
import NouvelleSceanceClient from "./NouvelleSceanceClient"
import type { ClubProfile, MatchContext, SessionBlock } from "@/types/training"

export const metadata = { robots: { index: false, follow: false } }

function resolveClubProfile(level: string | null): ClubProfile {
  const l = (level ?? "").toLowerCase()
  const isSemiPro = l.includes("national") || l.includes("régional") || l.includes("regional")
  return { trainingsPerWeek: isSemiPro ? 4 : 2, level: isSemiPro ? "semi_pro" : "amateur" }
}

function daysBetween(a: string, b: string) {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000)
}

export default async function NouvelleSceancePage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>
}) {
  const { userId } = await auth()
  const [club, user, sp] = await Promise.all([getMyClub(), currentUser(), searchParams])
  if (!club || !user || !userId) redirect("/onboarding")

  const clubProfile = resolveClubProfile(club.level)
  const today = new Date().toISOString().slice(0, 10)

  // Prochain match et dernier match
  const [{ data: nextMatch }, { data: lastMatch }] = await Promise.all([
    supabase.from("matches").select("date").eq("owner_id", userId)
      .gte("date", today).order("date", { ascending: true }).limit(1).maybeSingle(),
    supabase.from("matches").select("date").eq("owner_id", userId)
      .lt("date", today).order("date", { ascending: false }).limit(1).maybeSingle(),
  ])

  const matchContext: MatchContext = {
    daysToNext:    nextMatch ? daysBetween(today, nextMatch.date) : undefined,
    daysSinceLast: lastMatch ? daysBetween(lastMatch.date, today) : undefined,
  }

  // Chargement d'un modèle de séance via ?from=
  let initialBlocks: SessionBlock[] | undefined
  let templateName: string | undefined

  const fromId = sp.from
  if (fromId && /^[0-9a-f-]{36}$/.test(fromId)) {
    const [{ data: tmpl }, { data: rawBlocks }] = await Promise.all([
      supabase.from("training_sessions").select("name").eq("id", fromId).eq("owner_id", userId).single(),
      supabase.from("session_blocks").select("*").eq("session_id", fromId).order("block_order", { ascending: true }),
    ])
    if (tmpl && rawBlocks) {
      templateName = tmpl.name
      initialBlocks = rawBlocks
        .map((b, i) => {
          const exercise = getExerciseById(b.exercise_id)
          if (!exercise) return null
          return {
            id: crypto.randomUUID(),
            exerciseId: b.exercise_id,
            exercise,
            duration: b.duration,
            order: i,
            customNotes: b.custom_notes ?? undefined,
          } satisfies SessionBlock
        })
        .filter((b): b is SessionBlock => b !== null)
    }
  }

  return (
    <NouvelleSceanceClient
      clubProfile={clubProfile}
      matchContext={matchContext}
      initialBlocks={initialBlocks}
      templateName={templateName}
    />
  )
}
