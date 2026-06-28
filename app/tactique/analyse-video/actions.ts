"use server"

import { auth } from "@clerk/nextjs/server"
import { z } from "zod"
import { GoogleGenAI, FileState, MediaResolution, Type } from "@google/genai"
import { supabase } from "@/lib/supabase"
import { getClubScope } from "@/lib/scope"
import { sendPushToUser } from "@/lib/push"
import { getLineup } from "@/app/dashboard/matchs/actions"
import type { Drawing, DrawingType } from "@/types/tactical"

const BUCKET = "match-videos"
const MODEL = "gemini-2.5-flash"

export type EventType = "but" | "occasion" | "carton" | "changement" | "tactique" | "autre"

export interface VideoAnalysis {
  id: string
  title: string
  status: "uploading" | "processing" | "ready" | "error"
  error_message: string | null
  created_at: string
  summary: string | null
  match_id: string | null
  ai_requested: boolean
}

export interface AnalysisEvent {
  id: string
  timestamp_sec: number
  label: string
  description: string
  event_type: EventType
  jersey_number: number | null
  player_id: string | null
  player_name: string | null
}

function getAI() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error("GEMINI_API_KEY manquante — ajoute-la dans .env.local")
  return new GoogleGenAI({ apiKey })
}

export async function listAnalyses(): Promise<VideoAnalysis[]> {
  const { userId } = await auth()
  if (!userId) return []
  const scope = await getClubScope()

  const { data, error } = await supabase
    .from("video_analyses")
    .select("id, title, status, error_message, created_at, summary, match_id, ai_requested")
    .eq(scope.column, scope.value)
    .order("created_at", { ascending: false })

  if (error || !data) return []
  return data as VideoAnalysis[]
}

export interface PlayerAnalysisEvent {
  id: string
  analysisId: string
  analysisTitle: string
  matchId: string | null
  createdAt: string
  timestampSec: number
  label: string
  description: string
  eventType: EventType
}

// Notes d'analyse vidéo taguées sur un joueur — remontées côté fiche joueur (Effectif)
// pour souder l'IA aux modules de gestion. Filtré au scope du club via les analyses.
export async function getPlayerAnalysisEvents(playerId: string): Promise<PlayerAnalysisEvent[]> {
  const { userId } = await auth()
  if (!userId) return []
  const scope = await getClubScope()

  const { data: analyses } = await supabase
    .from("video_analyses")
    .select("id, title, created_at, match_id")
    .eq(scope.column, scope.value)

  if (!analyses || analyses.length === 0) return []
  const byId = new Map(analyses.map(a => [a.id, a]))

  const { data: events } = await supabase
    .from("analysis_events")
    .select("id, timestamp_sec, label, description, event_type, analysis_id")
    .eq("player_id", playerId)
    .in("analysis_id", analyses.map(a => a.id))

  if (!events) return []

  return events
    .map(e => {
      const a = byId.get(e.analysis_id)!
      return {
        id: e.id,
        analysisId: e.analysis_id,
        analysisTitle: a.title,
        matchId: a.match_id,
        createdAt: a.created_at,
        timestampSec: e.timestamp_sec,
        label: e.label,
        description: e.description,
        eventType: e.event_type as EventType,
      }
    })
    .sort((x, y) =>
      x.createdAt === y.createdAt
        ? x.timestampSec - y.timestampSec
        : x.createdAt < y.createdAt ? 1 : -1
    )
}

export interface VideoAnnotation {
  id: string
  timestampSec: number
  drawings: Drawing[]
  createdAt: string
}

export async function getAnalysis(id: string): Promise<{
  analysis: VideoAnalysis
  events: AnalysisEvent[]
  annotations: VideoAnnotation[]
  videoUrl: string | null
} | null> {
  const { userId } = await auth()
  if (!userId) return null
  const scope = await getClubScope()

  const { data: analysis, error } = await supabase
    .from("video_analyses")
    .select("id, title, status, error_message, created_at, video_path, summary, match_id, ai_requested")
    .eq(scope.column, scope.value)
    .eq("id", id)
    .maybeSingle()

  if (error || !analysis) return null

  const { data: events } = await supabase
    .from("analysis_events")
    .select("id, timestamp_sec, label, description, event_type, jersey_number, player_id")
    .eq("analysis_id", id)
    .order("timestamp_sec", { ascending: true })

  const playerIds = [...new Set((events ?? []).map(e => e.player_id).filter((p): p is string => !!p))]
  const playerNames = new Map<string, string>()
  if (playerIds.length > 0) {
    const { data: players } = await supabase
      .from("players")
      .select("id, first_name, last_name")
      .in("id", playerIds)
    for (const p of players ?? []) playerNames.set(p.id, `${p.first_name} ${p.last_name}`)
  }

  const { data: annotationsRaw } = await supabase
    .from("video_annotations")
    .select("id, timestamp_sec, drawings, created_at")
    .eq("analysis_id", id)
    .order("timestamp_sec", { ascending: true })

  const { data: signed } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(analysis.video_path, 3600)

  return {
    analysis,
    events: (events ?? []).map(e => ({
      ...e,
      player_name: e.player_id ? playerNames.get(e.player_id) ?? null : null,
    })) as AnalysisEvent[],
    annotations: (annotationsRaw ?? []).map(a => ({
      id: a.id,
      timestampSec: a.timestamp_sec,
      drawings: a.drawings as Drawing[],
      createdAt: a.created_at,
    })),
    videoUrl: signed?.signedUrl ?? null,
  }
}

export async function analyzeVideo(
  analysisId: string,
  buffer: Buffer,
  mimeType: string,
  ownerId: string,
  title: string,
  matchId: string | null
) {
  const ai = getAI()

  // Si l'analyse est liée à un match, on charge la composition pour permettre à Gemini
  // d'identifier les joueurs par numéro de maillot — best-effort, la lecture de numéros sur
  // vidéo amateur n'est pas garantie. La résolution jersey_number → player_id se fait après
  // coup, côté serveur (jamais confiance à un ID renvoyé par le modèle).
  let jerseyContext = ""
  let numberToPlayerId = new Map<number, string>()
  if (matchId) {
    const lineup = await getLineup(matchId)
    const allIds = [...lineup.starters, ...lineup.substitutes]
    if (allIds.length > 0) {
      const { data: lineupPlayers } = await supabase
        .from("players")
        .select("id, number, first_name, last_name")
        .in("id", allIds)
      const withNumber = (lineupPlayers ?? []).filter(p => p.number != null)
      if (withNumber.length > 0) {
        numberToPlayerId = new Map(withNumber.map(p => [p.number as number, p.id]))
        jerseyContext =
          "\n\nVoici les numéros de maillot de l'équipe à domicile/visiteuse filmée : " +
          withNumber.map(p => `#${p.number} ${p.first_name} ${p.last_name}`).join(", ") +
          ". Si tu identifies clairement un numéro sur un joueur impliqué dans un événement, " +
          "indique-le en jersey_number — sinon laisse jersey_number vide, ne devine pas."
      }
    }
  }

  // 1. Upload du fichier vers l'API Gemini
  const uploaded = await ai.files.upload({
    file: new Blob([new Uint8Array(buffer)], { type: mimeType }),
    config: { mimeType },
  })

  let file = uploaded
  while (file.state === FileState.PROCESSING) {
    await new Promise(r => setTimeout(r, 3000))
    file = await ai.files.get({ name: file.name! })
  }
  if (file.state !== FileState.ACTIVE) {
    throw new Error("Le traitement de la vidéo par Gemini a échoué.")
  }

  // 2. Génération de la timeline d'événements (sortie JSON structurée)
  const result = await ai.models.generateContent({
    model: MODEL,
    contents: [
      {
        role: "user",
        parts: [
          { fileData: { fileUri: file.uri!, mimeType: file.mimeType! } },
          {
            text:
              "Tu es un analyste tactique de football. Regarde cette vidéo de match et " +
              "identifie les événements clés (buts, occasions, cartons, changements, fautes " +
              "importantes, temps forts tactiques). Pour chaque événement, donne le timestamp " +
              "en secondes depuis le début de la vidéo, un label court, une description en " +
              "français, et une catégorie (event_type) parmi : but, occasion, carton, " +
              "changement, tactique, autre. Donne aussi un résumé global du match en 2-3 " +
              "phrases en français (summary)." + jerseyContext,
          },
        ],
      },
    ],
    config: {
      mediaResolution: MediaResolution.MEDIA_RESOLUTION_LOW,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          events: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                timestamp_sec: { type: Type.INTEGER },
                label: { type: Type.STRING },
                description: { type: Type.STRING },
                event_type: {
                  type: Type.STRING,
                  enum: ["but", "occasion", "carton", "changement", "tactique", "autre"],
                },
                jersey_number: { type: Type.INTEGER, nullable: true },
              },
              required: ["timestamp_sec", "label", "description", "event_type"],
            },
          },
        },
        required: ["summary", "events"],
      },
    },
  })

  const parsed = JSON.parse(result.text ?? "{}") as {
    summary?: string
    events?: {
      timestamp_sec: number; label: string; description: string
      event_type: EventType; jersey_number?: number | null
    }[]
  }
  const events = parsed.events ?? []

  if (events.length > 0) {
    await supabase.from("analysis_events").insert(
      events.map(e => ({
        analysis_id: analysisId,
        timestamp_sec: e.timestamp_sec,
        label: e.label,
        description: e.description,
        event_type: e.event_type,
        jersey_number: e.jersey_number ?? null,
        // Résolution côté serveur uniquement — jamais confiance à un ID renvoyé par le modèle.
        player_id: e.jersey_number != null ? numberToPlayerId.get(e.jersey_number) ?? null : null,
      }))
    )
  }

  // Pas de cache de contexte Gemini : sur le palier gratuit il échoue systématiquement
  // (nécessite la facturation activée), et sur le palier payant son coût de stockage
  // ($/M tokens/heure, facturé même sans question posée) dépasse vite celui de simplement
  // repayer le plein tarif pour 1-3 questions par match. Le Q&A répond depuis la timeline
  // texte (analysis_events) — voir askAboutMatch — avec repli sur gemini_file_uri (valable
  // 48h) seulement si la timeline est vide.
  await supabase
    .from("video_analyses")
    .update({
      status: "ready",
      gemini_file_uri: file.uri,
      summary: parsed.summary ?? null,
    })
    .eq("id", analysisId)

  await sendPushToUser(ownerId, {
    title: "Analyse vidéo prête",
    body: `"${title}" est prête à consulter.`,
    url: `/tactique/analyse-video/${analysisId}`,
  })
}

export async function deleteAnalysis(
  id: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { userId } = await auth()
  if (!userId) return { ok: false, error: "Non autorisé." }
  const scope = await getClubScope()

  const { data, error } = await supabase
    .from("video_analyses")
    .select("video_path")
    .eq(scope.column, scope.value)
    .eq("id", id)
    .maybeSingle()

  if (error || !data) return { ok: false, error: "Analyse introuvable." }

  await supabase.storage.from(BUCKET).remove([data.video_path])

  await supabase
    .from("video_analyses")
    .delete()
    .eq(scope.column, scope.value)
    .eq("id", id)

  return { ok: true }
}

const UpdateEventSchema = z.object({
  label: z.string().trim().min(1).max(80),
  description: z.string().trim().min(1).max(500),
  timestamp_sec: z.coerce.number().int().min(0).max(36000),
  event_type: z.enum(["but", "occasion", "carton", "changement", "tactique", "autre"]),
})

// Vérifie que l'événement appartient bien à une analyse du club courant avant d'autoriser
// une modification — analysis_events n'a pas de owner_id/org_id directement, on remonte via
// video_analyses (analysis_id).
async function assertEventInScope(eventId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!/^[0-9a-f-]{36}$/.test(eventId)) return { ok: false, error: "ID invalide." }
  const scope = await getClubScope()

  const { data: ev } = await supabase
    .from("analysis_events")
    .select("analysis_id")
    .eq("id", eventId)
    .maybeSingle()
  if (!ev) return { ok: false, error: "Événement introuvable." }

  const { data: owns } = await supabase
    .from("video_analyses")
    .select("id")
    .eq("id", ev.analysis_id)
    .eq(scope.column, scope.value)
    .maybeSingle()
  if (!owns) return { ok: false, error: "Non autorisé." }

  return { ok: true }
}

export async function updateAnalysisEvent(
  eventId: string,
  fields: { label: string; description: string; timestamp_sec: number; event_type: EventType }
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { userId } = await auth()
  if (!userId) return { ok: false, error: "Non autorisé." }

  const parsed = UpdateEventSchema.safeParse(fields)
  if (!parsed.success) return { ok: false, error: "Champs invalides." }

  const scopeCheck = await assertEventInScope(eventId)
  if (!scopeCheck.ok) return scopeCheck

  const { error } = await supabase.from("analysis_events").update(parsed.data).eq("id", eventId)
  if (error) return { ok: false, error: "Erreur lors de la sauvegarde." }
  return { ok: true }
}

export async function deleteAnalysisEvent(eventId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const { userId } = await auth()
  if (!userId) return { ok: false, error: "Non autorisé." }

  const scopeCheck = await assertEventInScope(eventId)
  if (!scopeCheck.ok) return scopeCheck

  const { error } = await supabase.from("analysis_events").delete().eq("id", eventId)
  if (error) return { ok: false, error: "Erreur lors de la suppression." }
  return { ok: true }
}

export interface SuggestedStatRow {
  playerId: string | null
  jerseyNumber: number | null
  goals: number
  yellowCards: number
  redCards: number
  sourceEventIds: string[]
}

// Lecture seule — ne touche jamais match_stats. V1 volontairement limité à goals/yellowCards/
// redCards : ni event_type ni description ne garantissent fiablement une passe décisive ou un
// temps de jeu, mieux vaut ne pas suggérer que suggérer faux. Filtre les suggestions dont le
// joueur résolu n'appartient pas à la composition de ce match, pour ne jamais créditer un
// joueur absent.
export async function getSuggestedMatchStats(analysisId: string): Promise<SuggestedStatRow[]> {
  const { userId } = await auth()
  if (!userId) return []
  const scope = await getClubScope()

  const { data: analysis } = await supabase
    .from("video_analyses")
    .select("match_id")
    .eq(scope.column, scope.value)
    .eq("id", analysisId)
    .maybeSingle()
  if (!analysis?.match_id) return []

  const lineup = await getLineup(analysis.match_id)
  const participantIds = new Set([...lineup.starters, ...lineup.substitutes])

  const { data: events } = await supabase
    .from("analysis_events")
    .select("id, label, description, event_type, jersey_number, player_id")
    .eq("analysis_id", analysisId)
    .in("event_type", ["but", "carton"])

  const byKey = new Map<string, SuggestedStatRow>()
  for (const e of events ?? []) {
    if (e.player_id && !participantIds.has(e.player_id)) continue // joueur hors composition — ignoré

    const key = e.player_id ?? `jersey:${e.jersey_number}`
    if (!byKey.has(key)) {
      byKey.set(key, {
        playerId: e.player_id,
        jerseyNumber: e.jersey_number,
        goals: 0, yellowCards: 0, redCards: 0,
        sourceEventIds: [],
      })
    }
    const row = byKey.get(key)!
    row.sourceEventIds.push(e.id)

    if (e.event_type === "but") row.goals += 1
    if (e.event_type === "carton") {
      const text = `${e.label} ${e.description}`.toLowerCase()
      if (text.includes("rouge")) row.redCards += 1
      else row.yellowCards += 1 // par défaut jaune si la couleur n'est pas explicite
    }
  }

  return [...byKey.values()]
}

// Schéma dupliqué depuis le digiboard (pas de dépendance vers app/tactique/digiboard/, par
// convention projet) — mêmes bornes, le type Drawing/DrawingType vient de types/tactical.ts,
// fichier de types neutre partagé.
const DRAWING_TYPES: DrawingType[] = ["fleche", "fleche-tirets", "fleche-courbe", "crayon", "zone", "texte"]

const AnnotationDrawingSchema = z.object({
  type: z.enum(DRAWING_TYPES as [DrawingType, ...DrawingType[]]),
  points: z.array(z.object({ x: z.number().min(0).max(100), y: z.number().min(0).max(100) })).min(1).max(500),
  color: z.string().max(16),
  thickness: z.number().min(1).max(12),
  text: z.string().max(120).optional(),
})

const SaveAnnotationSchema = z.object({
  timestampSec: z.coerce.number().min(0).max(36000),
  drawings: z.array(AnnotationDrawingSchema).max(300),
})

async function assertAnalysisInScope(analysisId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!/^[0-9a-f-]{36}$/.test(analysisId)) return { ok: false, error: "ID invalide." }
  const scope = await getClubScope()
  const { data } = await supabase
    .from("video_analyses")
    .select("id")
    .eq("id", analysisId)
    .eq(scope.column, scope.value)
    .maybeSingle()
  if (!data) return { ok: false, error: "Analyse introuvable." }
  return { ok: true }
}

async function assertAnnotationInScope(annotationId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!/^[0-9a-f-]{36}$/.test(annotationId)) return { ok: false, error: "ID invalide." }
  const { data: ann } = await supabase
    .from("video_annotations")
    .select("analysis_id")
    .eq("id", annotationId)
    .maybeSingle()
  if (!ann) return { ok: false, error: "Annotation introuvable." }
  return assertAnalysisInScope(ann.analysis_id)
}

export async function createVideoAnnotation(
  analysisId: string,
  fields: { timestampSec: number; drawings: Drawing[] }
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const { userId } = await auth()
  if (!userId) return { ok: false, error: "Connecte-toi." }

  const parsed = SaveAnnotationSchema.safeParse(fields)
  if (!parsed.success) return { ok: false, error: "Données invalides." }

  const scopeCheck = await assertAnalysisInScope(analysisId)
  if (!scopeCheck.ok) return scopeCheck
  const scope = await getClubScope()

  const { data: row, error } = await supabase
    .from("video_annotations")
    .insert({
      analysis_id: analysisId,
      owner_id: scope.userId,
      org_id: scope.orgId,
      timestamp_sec: parsed.data.timestampSec,
      drawings: parsed.data.drawings,
    })
    .select("id")
    .single()

  if (error || !row) return { ok: false, error: "Erreur d'enregistrement." }
  return { ok: true, id: row.id as string }
}

export async function updateVideoAnnotation(
  annotationId: string,
  fields: { timestampSec: number; drawings: Drawing[] }
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { userId } = await auth()
  if (!userId) return { ok: false, error: "Non autorisé." }

  const parsed = SaveAnnotationSchema.safeParse(fields)
  if (!parsed.success) return { ok: false, error: "Données invalides." }

  const scopeCheck = await assertAnnotationInScope(annotationId)
  if (!scopeCheck.ok) return scopeCheck

  const { error } = await supabase
    .from("video_annotations")
    .update({
      timestamp_sec: parsed.data.timestampSec,
      drawings: parsed.data.drawings,
      updated_at: new Date().toISOString(),
    })
    .eq("id", annotationId)

  if (error) return { ok: false, error: "Erreur lors de la sauvegarde." }
  return { ok: true }
}

export async function deleteVideoAnnotation(annotationId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const { userId } = await auth()
  if (!userId) return { ok: false, error: "Non autorisé." }

  const scopeCheck = await assertAnnotationInScope(annotationId)
  if (!scopeCheck.ok) return scopeCheck

  const { error } = await supabase.from("video_annotations").delete().eq("id", annotationId)
  if (error) return { ok: false, error: "Erreur lors de la suppression." }
  return { ok: true }
}

export async function askAboutMatch(
  analysisId: string,
  question: string
): Promise<{ ok: true; answer: string } | { ok: false; error: string }> {
  const { userId } = await auth()
  if (!userId) return { ok: false, error: "Connecte-toi." }
  const scope = await getClubScope()

  const { data: analysis, error } = await supabase
    .from("video_analyses")
    .select("gemini_file_uri, status, ai_requested")
    .eq(scope.column, scope.value)
    .eq("id", analysisId)
    .maybeSingle()

  if (error || !analysis) return { ok: false, error: "Analyse introuvable." }
  if (analysis.status !== "ready") return { ok: false, error: "L'analyse n'est pas encore prête." }
  if (!analysis.ai_requested) return { ok: false, error: "Analyse IA non demandée pour cette vidéo." }

  const { data: events } = await supabase
    .from("analysis_events")
    .select("timestamp_sec, label, description")
    .eq("analysis_id", analysisId)
    .order("timestamp_sec", { ascending: true })

  const ai = getAI()

  // Répond depuis la timeline texte déjà extraite — quelques Ko au lieu de toute la vidéo
  // (centaines de milliers de tokens), pour ~100x moins cher sur les questions courantes
  // ("qu'est-ce qui s'est passé à la 23e ?"), et ça fonctionne même après l'expiration du
  // fichier Gemini (48h). Repli sur la vidéo brute seulement si aucun événement n'a été extrait.
  if (events && events.length > 0) {
    const timeline = events
      .map(e => `${Math.floor(e.timestamp_sec / 60)}'${String(e.timestamp_sec % 60).padStart(2, "0")} — ${e.label} : ${e.description}`)
      .join("\n")

    const result = await ai.models.generateContent({
      model: MODEL,
      contents: [
        {
          role: "user",
          parts: [{
            text:
              "Tu es un analyste tactique de football. Voici la timeline des événements clés " +
              "détectés dans un match :\n\n" + timeline +
              "\n\nRéponds en français, de manière concise et concrète, à cette question du coach : " +
              question.slice(0, 500),
          }],
        },
      ],
    })
    return { ok: true, answer: result.text ?? "Pas de réponse." }
  }

  // Aucun événement extrait — on référence directement le fichier Gemini (valable 48h après upload).
  if (!analysis.gemini_file_uri) {
    return {
      ok: false,
      error: "Vidéo plus disponible côté Gemini (48h). Ré-uploade la vidéo pour poser de nouvelles questions.",
    }
  }

  try {
    const result = await ai.models.generateContent({
      model: MODEL,
      contents: [
        {
          role: "user",
          parts: [
            { fileData: { fileUri: analysis.gemini_file_uri } },
            {
              text:
                "Tu es un analyste tactique de football. Réponds en français, de manière " +
                "concise et concrète, à cette question sur le match : " + question.slice(0, 500),
            },
          ],
        },
      ],
      config: { mediaResolution: MediaResolution.MEDIA_RESOLUTION_LOW },
    })
    return { ok: true, answer: result.text ?? "Pas de réponse." }
  } catch {
    return {
      ok: false,
      error: "Vidéo plus disponible côté Gemini (48h). Ré-uploade la vidéo pour poser de nouvelles questions.",
    }
  }
}
