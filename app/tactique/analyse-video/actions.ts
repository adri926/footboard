"use server"

import { auth } from "@clerk/nextjs/server"
import { GoogleGenAI, FileState, Type } from "@google/genai"
import { supabase } from "@/lib/supabase"
import { getClubScope } from "@/lib/scope"

const BUCKET = "match-videos"
const MODEL = "gemini-2.5-flash"
const CACHE_TTL = "3600s" // 1h

export interface VideoAnalysis {
  id: string
  title: string
  status: "uploading" | "processing" | "ready" | "error"
  error_message: string | null
  created_at: string
}

export interface AnalysisEvent {
  id: string
  timestamp_sec: number
  label: string
  description: string
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
    .select("id, title, status, error_message, created_at")
    .eq(scope.column, scope.value)
    .order("created_at", { ascending: false })

  if (error || !data) return []
  return data as VideoAnalysis[]
}

export async function getAnalysis(id: string): Promise<{
  analysis: VideoAnalysis
  events: AnalysisEvent[]
  videoUrl: string | null
} | null> {
  const { userId } = await auth()
  if (!userId) return null
  const scope = await getClubScope()

  const { data: analysis, error } = await supabase
    .from("video_analyses")
    .select("id, title, status, error_message, created_at, video_path")
    .eq(scope.column, scope.value)
    .eq("id", id)
    .maybeSingle()

  if (error || !analysis) return null

  const { data: events } = await supabase
    .from("analysis_events")
    .select("id, timestamp_sec, label, description")
    .eq("analysis_id", id)
    .order("timestamp_sec", { ascending: true })

  const { data: signed } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(analysis.video_path, 3600)

  return {
    analysis,
    events: (events ?? []) as AnalysisEvent[],
    videoUrl: signed?.signedUrl ?? null,
  }
}

export async function uploadVideo(
  formData: FormData
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const { userId } = await auth()
  if (!userId) return { ok: false, error: "Connecte-toi pour uploader une vidéo." }
  const scope = await getClubScope()

  const file = formData.get("video")
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Sélectionne un fichier vidéo." }
  }
  if (!file.type.startsWith("video/")) {
    return { ok: false, error: "Le fichier doit être une vidéo." }
  }

  const title = (formData.get("title") as string | null)?.trim() || "Match"
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "mp4"
  const path = `${scope.value}/${Date.now()}.${ext}`

  const buffer = Buffer.from(await file.arrayBuffer())
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: file.type })

  if (uploadError) return { ok: false, error: uploadError.message }

  const { data: row, error: insertError } = await supabase
    .from("video_analyses")
    .insert({
      owner_id: scope.userId,
      org_id: scope.orgId,
      title,
      video_path: path,
      status: "processing",
    })
    .select("id")
    .single()

  if (insertError || !row) return { ok: false, error: insertError?.message ?? "Erreur d'enregistrement." }

  // Lance l'analyse — erreurs gérées et stockées sur la ligne (pas de retry auto en V1)
  analyzeVideo(row.id, buffer, file.type).catch(async (err) => {
    await supabase
      .from("video_analyses")
      .update({ status: "error", error_message: String(err?.message ?? err) })
      .eq("id", row.id)
  })

  return { ok: true, id: row.id }
}

async function analyzeVideo(analysisId: string, buffer: Buffer, mimeType: string) {
  const ai = getAI()

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
              "en secondes depuis le début de la vidéo, un label court et une description en " +
              "français.",
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          events: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                timestamp_sec: { type: Type.INTEGER },
                label: { type: Type.STRING },
                description: { type: Type.STRING },
              },
              required: ["timestamp_sec", "label", "description"],
            },
          },
        },
        required: ["events"],
      },
    },
  })

  const parsed = JSON.parse(result.text ?? "{}") as {
    events?: { timestamp_sec: number; label: string; description: string }[]
  }
  const events = parsed.events ?? []

  if (events.length > 0) {
    await supabase.from("analysis_events").insert(
      events.map(e => ({
        analysis_id: analysisId,
        timestamp_sec: e.timestamp_sec,
        label: e.label,
        description: e.description,
      }))
    )
  }

  // 3. Cache de contexte Gemini (optionnel — peut nécessiter un compte avec facturation
  // activée). Si indisponible (palier gratuit), le Q&A retombera sur le fichier Gemini
  // (gemini_file_uri, valable 48h) sans cache.
  let cacheName: string | null = null
  let cacheExpiresAt: string | null = null
  try {
    const cache = await ai.caches.create({
      model: MODEL,
      config: {
        contents: [
          {
            role: "user",
            parts: [{ fileData: { fileUri: file.uri!, mimeType: file.mimeType! } }],
          },
        ],
        systemInstruction:
          "Tu es un analyste tactique de football. Réponds aux questions du coach sur ce match " +
          "en français, de manière concise et concrète.",
        ttl: CACHE_TTL,
      },
    })
    cacheName = cache.name ?? null
    cacheExpiresAt = cache.expireTime ?? null
  } catch {
    // Cache de contexte non disponible (ex: palier gratuit) — pas bloquant.
  }

  await supabase
    .from("video_analyses")
    .update({
      status: "ready",
      gemini_file_uri: file.uri,
      gemini_cache_name: cacheName,
      gemini_cache_expires_at: cacheExpiresAt,
    })
    .eq("id", analysisId)
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
    .select("gemini_cache_name, gemini_cache_expires_at, gemini_file_uri, status")
    .eq(scope.column, scope.value)
    .eq("id", analysisId)
    .maybeSingle()

  if (error || !analysis) return { ok: false, error: "Analyse introuvable." }
  if (analysis.status !== "ready") return { ok: false, error: "L'analyse n'est pas encore prête." }

  const cacheValid =
    !!analysis.gemini_cache_name &&
    !!analysis.gemini_cache_expires_at &&
    new Date(analysis.gemini_cache_expires_at).getTime() > Date.now()

  const ai = getAI()

  if (cacheValid) {
    const result = await ai.models.generateContent({
      model: MODEL,
      contents: [{ role: "user", parts: [{ text: question.slice(0, 500) }] }],
      config: { cachedContent: analysis.gemini_cache_name! },
    })
    return { ok: true, answer: result.text ?? "Pas de réponse." }
  }

  // Pas de cache (palier gratuit ou cache expiré) — on référence directement le fichier
  // Gemini (valable 48h après upload).
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
    })
    return { ok: true, answer: result.text ?? "Pas de réponse." }
  } catch {
    return {
      ok: false,
      error: "Vidéo plus disponible côté Gemini (48h). Ré-uploade la vidéo pour poser de nouvelles questions.",
    }
  }
}
