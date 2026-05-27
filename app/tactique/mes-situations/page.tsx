import { getSavedSituations } from "@/app/tactique/situations/actions"
import { deleteSituation }    from "@/app/tactique/situations/actions"
import Link from "next/link"
import DeleteButton from "./DeleteButton"

const PHASE_LABEL: Record<string, string> = {
  attack:  "Avec le ballon",
  defense: "Sans le ballon",
}

const ZONE_LABEL: Record<string, string> = {
  left:   "Côté gauche",
  center: "Axe central",
  right:  "Côté droit",
}

export default async function MesSituationsPage() {
  const situations = await getSavedSituations()

  return (
    <div style={{ background: "#181812", minHeight: "100vh", color: "rgba(255,255,255,0.92)" }}>
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* En-tête */}
        <div className="mb-8">
          <Link href="/tactique/situations" style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 9, letterSpacing: "0.1em",
            color: "rgba(122,154,130,0.5)",
          }}>
            ← SITUATIONS
          </Link>
          <h1 style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontWeight: 900, fontSize: "clamp(28px, 5vw, 44px)",
            lineHeight: 0.95, marginTop: 8,
          }}>
            MES SITUATIONS<br />
            <span style={{ color: "#7A9A82" }}>SAUVEGARDÉES</span>
          </h1>
        </div>

        {situations.length === 0 ? (
          <div style={{
            padding: "40px 24px", textAlign: "center",
            borderRadius: 14, backgroundColor: "#1f1f19",
            border: "1px solid rgba(122,154,130,0.1)",
          }}>
            <p style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 10, letterSpacing: "0.12em",
              color: "rgba(122,154,130,0.4)", marginBottom: 16,
            }}>
              AUCUNE SITUATION SAUVEGARDÉE
            </p>
            <Link href="/tactique/situations" style={{
              fontFamily: "var(--font-mono), monospace",
              fontWeight: 700, fontSize: 10, letterSpacing: "0.08em",
              backgroundColor: "#7A9A82", color: "#181812",
              padding: "10px 20px", borderRadius: 8, display: "inline-block",
            }}>
              CRÉER UNE SITUATION →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {situations.map(s => (
              <div key={s.id} style={{
                padding: "16px 18px", borderRadius: 14,
                backgroundColor: "#1f1f19",
                border: "1px solid rgba(122,154,130,0.12)",
                display: "flex", alignItems: "center", gap: 14,
              }}>
                {/* Infos */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: 8, fontWeight: 700, letterSpacing: "0.1em",
                      backgroundColor: "rgba(122,154,130,0.1)",
                      border: "1px solid rgba(122,154,130,0.2)",
                      color: "#7A9A82", padding: "2px 7px", borderRadius: 4,
                    }}>
                      {PHASE_LABEL[s.phase] ?? s.phase}
                    </span>
                    <span style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: 8, letterSpacing: "0.08em",
                      color: "rgba(255,255,255,0.25)",
                    }}>
                      {ZONE_LABEL[s.zone] ?? s.zone}
                    </span>
                  </div>
                  <p style={{
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontWeight: 700, fontSize: 16,
                    color: "rgba(255,255,255,0.9)", marginBottom: 2,
                  }}>
                    {s.label}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-body), sans-serif",
                    fontWeight: 300, fontSize: 12, lineHeight: 1.4,
                    color: "rgba(255,255,255,0.35)",
                  }}>
                    {s.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 shrink-0">
                  <Link
                    href={`/tactique/situations?phase=${s.phase}&style=${s.style}&zone=${s.zone}`}
                    style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
                      border: "1px solid rgba(122,154,130,0.3)",
                      color: "#7A9A82", padding: "7px 12px", borderRadius: 8,
                      whiteSpace: "nowrap",
                    }}>
                    REVOIR →
                  </Link>
                  <DeleteButton id={s.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
