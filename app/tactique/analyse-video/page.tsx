import Link from "next/link"
import { listAnalyses } from "./actions"
import UploadForm from "./UploadForm"

const STATUS_LABEL: Record<string, string> = {
  uploading: "UPLOAD...",
  processing: "ANALYSE EN COURS...",
  ready: "PRÊT",
  error: "ERREUR",
}

export default async function AnalyseVideoPage() {
  const analyses = await listAnalyses()

  return (
    <main style={{ background: "var(--bg)", minHeight: "calc(100vh - 56px)" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px 64px" }}>

        <Link href="/tactique" style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 10, letterSpacing: "0.08em",
          color: "var(--text-faint)",
          textDecoration: "none", display: "inline-block", marginBottom: 32,
        }}>
          ← TACTIQUE
        </Link>

        <div style={{ marginBottom: 32 }}>
          <p style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10, letterSpacing: "0.12em",
            color: "var(--sauge)", marginBottom: 10,
          }}>
            MODULE TACTIQUE — IA
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

        <div style={{ marginBottom: 32 }}>
          <UploadForm />
        </div>

        {analyses.length > 0 && (
          <div>
            <p style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 9, letterSpacing: "0.12em",
              color: "var(--text-faint)", marginBottom: 12,
            }}>
              ANALYSES
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {analyses.map(a => (
                <Link key={a.id} href={`/tactique/analyse-video/${a.id}`} style={{
                  textDecoration: "none",
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
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  )
}
