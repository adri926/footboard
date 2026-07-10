import { supabase } from "@/lib/supabase"
import { getClubScope } from "@/lib/scope"

// Garde-fou coût Gemini : plafond quotidien d'analyses vidéo par club. Auth seule ne suffit
// pas — chaque analyse déclenche un appel Gemini payant. Ajuster au besoin (futur : quota par
// plan Free/Club branché à Stripe).
export const MAX_ANALYSES_PER_DAY = 10

export async function checkVideoAnalysisQuota(): Promise<{ ok: true } | { ok: false; error: string }> {
  const scope = await getClubScope()
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { count } = await supabase
    .from("video_analyses")
    .select("id", { count: "exact", head: true })
    .eq(scope.column, scope.value)
    .gte("created_at", since)

  if ((count ?? 0) >= MAX_ANALYSES_PER_DAY) {
    return {
      ok: false,
      error: `Limite de ${MAX_ANALYSES_PER_DAY} analyses vidéo par jour atteinte. Réessaie demain.`,
    }
  }
  return { ok: true }
}
