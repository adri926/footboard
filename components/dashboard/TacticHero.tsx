import Link from "next/link"
import type { VideoAnalysis } from "@/app/tactique/analyse-video/actions"

// Bloc "Outils" de la home — accès directs et ÉGAUX aux outils du studio (analyse
// vidéo IA, digiboard, concepts). L'IA reste à un tap sans écraser le reste du
// cockpit : elle est un outil parmi d'autres, jamais un passage obligé.
// Présentationnel pur : reçoit la dernière analyse côté serveur (pas de localStorage
// → pas de risque d'hydratation) pour offrir un "reprends où tu t'es arrêté".

const STATUS: Record<VideoAnalysis["status"], { label: string; color: string }> = {
  ready:      { label: "PRÊTE",    color: "#7A9A82" },
  processing: { label: "EN COURS", color: "#d4a847" },
  uploading:  { label: "UPLOAD",   color: "#d4a847" },
  error:      { label: "ERREUR",   color: "#e07070" },
}

const TOOLS = [
  { href: "/tactique/analyse-video", icon: "◬", label: "Analyse vidéo", badge: "IA" },
  { href: "/tactique/digiboard",     icon: "⬡", label: "Digiboard" },
  { href: "/tactique/concepts",      icon: "◆", label: "Concepts" },
]

export default function TacticHero({ lastAnalysis }: { lastAnalysis: VideoAnalysis | null }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <p style={{
        fontFamily: "var(--font-mono), monospace", fontSize: 9, fontWeight: 700,
        letterSpacing: "0.14em", color: "rgba(122,154,130,0.5)",
        textTransform: "uppercase", marginBottom: 12,
      }}>
        Outils
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {TOOLS.map(t => (
          <Link key={t.href} href={t.href} style={{
            position: "relative",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
            padding: "18px 12px", borderRadius: 12, textDecoration: "none",
            backgroundColor: "var(--bg-card)",
            border: "1px solid rgba(122,154,130,0.14)",
          }}>
            {t.badge && (
              <span style={{
                position: "absolute", top: 8, right: 8,
                fontFamily: "var(--font-mono), monospace", fontSize: 7, fontWeight: 700,
                letterSpacing: "0.08em", color: "#7A9A82",
                backgroundColor: "rgba(122,154,130,0.15)",
                border: "1px solid rgba(122,154,130,0.3)",
                padding: "1px 5px", borderRadius: 100,
              }}>
                {t.badge}
              </span>
            )}
            <span style={{ fontSize: 22, color: "#7A9A82" }}>{t.icon}</span>
            <span style={{
              fontFamily: "var(--font-body), sans-serif", fontSize: 12, fontWeight: 500,
              color: "var(--text-primary)", textAlign: "center", lineHeight: 1.2,
            }}>
              {t.label}
            </span>
          </Link>
        ))}
      </div>

      {lastAnalysis && (
        <Link href={`/tactique/analyse-video/${lastAnalysis.id}`} style={{
          display: "flex", alignItems: "center", gap: 12, marginTop: 10,
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
  )
}
