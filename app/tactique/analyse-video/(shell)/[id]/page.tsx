import Link from "next/link"
import { notFound } from "next/navigation"
import { getAnalysis } from "../../actions"
import { getMatchById } from "@/app/dashboard/matchs/actions"
import AnalysisDetail from "./AnalysisDetail"
import ProcessingPoller from "./ProcessingPoller"

const STATUS_LABEL: Record<string, string> = {
  uploading: "UPLOAD EN COURS...",
  processing: "ANALYSE EN COURS PAR L'IA...",
  ready: "PRÊT",
  error: "ERREUR",
}

export default async function AnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getAnalysis(id)
  if (!data) notFound()

  const { analysis, events, annotations, videoUrl } = data
  const linkedMatch = analysis.match_id ? await getMatchById(analysis.match_id) : null

  return (
    <main style={{ background: "var(--bg)", minHeight: "calc(100vh - 56px)" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px 64px" }}>

        <Link href="/tactique/analyse-video" style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 10, letterSpacing: "0.08em",
          color: "var(--text-faint)",
          textDecoration: "none", display: "inline-block", marginBottom: 24,
        }}>
          ← ANALYSE VIDÉO
        </Link>

        <h1 style={{
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontWeight: 900, fontSize: 32, lineHeight: 1.1,
          color: "var(--text-primary)", marginBottom: 8,
        }}>
          {analysis.title}
        </h1>

        {linkedMatch && (
          <Link href={`/dashboard/matchs/${linkedMatch.id}`} style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10, letterSpacing: "0.06em",
            color: "var(--sauge)",
            textDecoration: "none", display: "inline-block", marginBottom: 16,
          }}>
            Match lié : {linkedMatch.home_away === "home" ? "vs" : "@"} {linkedMatch.opponent} —{" "}
            {new Date(linkedMatch.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
          </Link>
        )}

        {!analysis.ai_requested && (
          <p style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 11, letterSpacing: "0.08em",
            color: "rgba(220,180,80,0.8)",
            marginBottom: 24,
          }}>
            Vidéo en mode manuel — pas d&apos;analyse IA pour cette vidéo.
          </p>
        )}

        {analysis.ai_requested && analysis.status !== "ready" && (
          <p style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 11, letterSpacing: "0.08em",
            color: analysis.status === "error" ? "rgba(220,80,80,0.8)" : "var(--sauge)",
            marginBottom: 24,
          }}>
            {STATUS_LABEL[analysis.status] ?? analysis.status}
            {analysis.status === "error" && analysis.error_message ? ` — ${analysis.error_message}` : ""}
          </p>
        )}

        {analysis.status === "processing" && (
          <>
            <ProcessingPoller />
            <p style={{
              fontFamily: "var(--font-body), sans-serif",
              fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 24,
            }}>
              L&apos;IA regarde la vidéo et génère la timeline d&apos;événements.
              La page se met à jour automatiquement.
            </p>
          </>
        )}

        {videoUrl && (
          <div style={{ marginTop: 16 }}>
            <AnalysisDetail
              analysisId={analysis.id}
              videoUrl={videoUrl}
              events={events}
              annotations={annotations}
              summary={analysis.summary}
              status={analysis.status}
              aiRequested={analysis.ai_requested}
            />
          </div>
        )}

      </div>
    </main>
  )
}
