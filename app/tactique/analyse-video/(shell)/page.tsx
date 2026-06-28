import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { listAnalyses } from "../actions"
import { getMatches } from "@/app/dashboard/matchs/actions"
import UploadForm from "./UploadForm"
import BackLink from "./BackLink"
import DeleteAnalysisButton from "./DeleteAnalysisButton"
import OnboardingHint from "@/components/OnboardingHint"

const STATUS_LABEL: Record<string, string> = {
  uploading: "UPLOAD...",
  processing: "ANALYSE EN COURS...",
  ready: "PRÊT",
  error: "ERREUR",
}

export default async function AnalyseVideoPage(
  { searchParams }: { searchParams: Promise<{ match?: string }> }
) {
  // Page à double usage (visiteur marketing non connecté + outil interne coach) —
  // getMatches() exige une session (getClubScope() lève sinon), donc on ne l'appelle
  // que si un utilisateur est authentifié. listAnalyses() gère déjà ce cas (retourne []).
  const { userId } = await auth()
  const [analyses, matches, sp] = await Promise.all([
    listAnalyses(),
    userId ? getMatches() : Promise.resolve([]),
    searchParams,
  ])

  // Lien "Analyser la vidéo de ce match" (depuis la liste des matchs) → on présélectionne
  // le match dans le formulaire pour souder la gestion à l'IA.
  const preselectMatchId = sp.match ?? null

  return (
    <main style={{ background: "var(--bg)", minHeight: "calc(100vh - 56px)" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px 64px" }}>

        <BackLink fallback="/tactique">← RETOUR</BackLink>

        <div style={{ marginBottom: 32 }}>
          <p style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10, letterSpacing: "0.12em",
            color: "var(--sauge)", marginBottom: 10,
          }}>
            STUDIO TACTIQUE — IA
          </p>
          <h1 style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontWeight: 900, fontSize: 48, lineHeight: 1,
            letterSpacing: "-0.01em",
            color: "var(--text-primary)",
          }}>
            ANALYSE VIDÉO
          </h1>
          <p style={{
            fontFamily: "var(--font-body), sans-serif",
            fontSize: 14, color: "var(--text-muted)",
            marginTop: 12, maxWidth: 440, lineHeight: 1.5,
          }}>
            Upload la vidéo d&apos;un match : l&apos;IA génère une timeline d&apos;événements et
            répond à tes questions sur le match.
          </p>
        </div>

        {userId && (
          <OnboardingHint id="ia-loop" title="LA BOUCLE IA">
            Lie une analyse à un match, tague tes joueurs sur la timeline — leurs notes
            remontent automatiquement sur leur fiche (onglet Statistiques).
          </OnboardingHint>
        )}

        <div style={{ marginBottom: 32 }}>
          <UploadForm matches={matches} preselectMatchId={preselectMatchId} />
        </div>

        <div>
          <p style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 9, letterSpacing: "0.12em",
            color: "var(--text-faint)", marginBottom: 12,
          }}>
            ANALYSES
          </p>

          {analyses.length === 0 ? (
            <div style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid rgba(122,154,130,0.10)",
              borderRadius: 10, padding: "28px 20px",
              textAlign: "center",
            }}>
              <p style={{
                fontFamily: "var(--font-body), sans-serif",
                fontSize: 13, color: "var(--text-faint)", lineHeight: 1.6,
              }}>
                Aucune analyse pour l&apos;instant.<br />
                Uploade ta première vidéo de match ci-dessus.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {analyses.map(a => (
                <div key={a.id} style={{
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <Link href={`/tactique/analyse-video/${a.id}`} style={{
                    textDecoration: "none", flex: 1,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid rgba(122,154,130,0.13)",
                    borderRadius: 10, padding: "12px 16px",
                  }}>
                    <span style={{
                      fontFamily: "var(--font-body), sans-serif",
                      fontSize: 14, color: "var(--text-primary)",
                    }}>
                      {a.title}
                    </span>
                    <span style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: 9, letterSpacing: "0.08em",
                      color: a.status === "error" ? "rgba(220,80,80,0.8)" : "var(--sauge)",
                    }}>
                      {STATUS_LABEL[a.status] ?? a.status}
                    </span>
                  </Link>
                  <DeleteAnalysisButton id={a.id} />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  )
}
