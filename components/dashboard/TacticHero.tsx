import Link from "next/link"
import type { VideoAnalysis } from "@/app/tactique/analyse-video/actions"

// Bloc héros de la home — l'analyse vidéo IA est le coeur du produit, elle ouvre
// le tableau de bord avant la gestion (cf. refonte "tactique/IA au centre").
// Présentationnel pur : reçoit la dernière analyse côté serveur (pas de localStorage
// → pas de risque d'hydratation), ce qui suffit à offrir un vrai "reprends où tu
// t'es arrêté" basé sur des données réelles.

const STATUS: Record<VideoAnalysis["status"], { label: string; color: string }> = {
  ready:      { label: "PRÊTE",    color: "#7A9A82" },
  processing: { label: "EN COURS", color: "#d4a847" },
  uploading:  { label: "UPLOAD",   color: "#d4a847" },
  error:      { label: "ERREUR",   color: "#e07070" },
}

const QUICK = [
  { href: "/tactique/digiboard", icon: "⬡", label: "Digiboard" },
  { href: "/tactique/concepts",  icon: "◆", label: "Concepts" },
]

export default function TacticHero({ lastAnalysis }: { lastAnalysis: VideoAnalysis | null }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid rgba(122,154,130,0.22)",
        borderRadius: 16, padding: "22px 22px 20px",
      }}>
        <p style={{
          fontFamily: "var(--font-mono), monospace", fontSize: 9, fontWeight: 700,
          letterSpacing: "0.14em", color: "rgba(122,154,130,0.7)",
          textTransform: "uppercase", marginBottom: 8,
        }}>
          Studio tactique · IA
        </p>
        <p style={{
          fontFamily: "var(--font-display), system-ui, sans-serif", fontWeight: 900,
          fontSize: 24, lineHeight: 1.05, color: "var(--text-primary)", marginBottom: 6,
        }}>
          Analyse ton prochain match
        </p>
        <p style={{
          fontFamily: "var(--font-body), sans-serif", fontSize: 13,
          color: "var(--text-muted)", lineHeight: 1.5, marginBottom: 18, maxWidth: 420,
        }}>
          Filme, upload, laisse l&apos;IA débriefer — ou annote toi-même image par image.
        </p>

        <Link href="/tactique/analyse-video" style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          backgroundColor: "#7A9A82", color: "#16160f",
          borderRadius: 12, padding: "13px 22px", textDecoration: "none",
          fontFamily: "var(--font-mono), monospace", fontSize: 12, fontWeight: 700,
          letterSpacing: "0.06em",
        }}>
          <span style={{ fontSize: 16, lineHeight: 1 }}>◬</span>
          ANALYSER UNE VIDÉO →
        </Link>

        {lastAnalysis && (
          <Link href={`/tactique/analyse-video/${lastAnalysis.id}`} style={{
            display: "flex", alignItems: "center", gap: 12, marginTop: 14,
            padding: "12px 14px", borderRadius: 10, textDecoration: "none",
            backgroundColor: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(122,154,130,0.12)",
          }}>
            <span style={{ fontSize: 15, flexShrink: 0 }}>↺</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontFamily: "var(--font-mono), monospace", fontSize: 8, fontWeight: 700,
                letterSpacing: "0.1em", color: "rgba(122,154,130,0.55)", marginBottom: 2,
              }}>
                REPRENDRE
              </p>
              <p style={{
                fontFamily: "var(--font-body), sans-serif", fontSize: 13, fontWeight: 500,
                color: "var(--text-primary)",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {lastAnalysis.title}
              </p>
            </div>
            <span style={{
              fontFamily: "var(--font-mono), monospace", fontSize: 7, fontWeight: 700,
              letterSpacing: "0.08em", flexShrink: 0,
              color: STATUS[lastAnalysis.status].color,
              backgroundColor: `${STATUS[lastAnalysis.status].color}18`,
              border: `1px solid ${STATUS[lastAnalysis.status].color}40`,
              padding: "2px 7px", borderRadius: 100,
            }}>
              {STATUS[lastAnalysis.status].label}
            </span>
          </Link>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
        {QUICK.map(q => (
          <Link key={q.href} href={q.href} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "13px 16px", borderRadius: 12, textDecoration: "none",
            backgroundColor: "var(--bg-card)",
            border: "1px solid rgba(122,154,130,0.12)",
          }}>
            <span style={{ fontSize: 15, color: "#7A9A82", flexShrink: 0 }}>{q.icon}</span>
            <span style={{
              fontFamily: "var(--font-body), sans-serif", fontSize: 13, fontWeight: 500,
              color: "var(--text-primary)",
            }}>
              {q.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
