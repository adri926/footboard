import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getBuiltSituation } from "@/app/tactique/creer/actions"
import { PITCH_ZONES, PLAYER_CONFIGS, FINALITIES } from "@/lib/builder"
import SituationPlayback from "@/components/pitch/SituationPlayback"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function SituationPlaybackPage({ params }: Props) {
  const { id } = await params
  const situation = await getBuiltSituation(id)
  if (!situation) notFound()

  const zone     = PITCH_ZONES.find(z => z.id === situation.zone)
  const config   = PLAYER_CONFIGS.find(c => c.label === situation.config)
  const finality = FINALITIES.find(f => f.id === situation.finality)

  return (
    <div style={{ background: "#181812", minHeight: "100vh", color: "rgba(255,255,255,0.92)" }}>
      <div className="max-w-3xl mx-auto px-4 py-10">

        <div className="mb-6">
          <Link href="/tactique/mes-situations" style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 9, letterSpacing: "0.1em",
            color: "rgba(122,154,130,0.5)",
          }}>
            ← MES SITUATIONS
          </Link>
          <div className="flex items-center gap-2 flex-wrap mt-3 mb-1">
            <span style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 8, fontWeight: 700, letterSpacing: "0.1em",
              backgroundColor: "rgba(122,154,130,0.1)",
              border: "1px solid rgba(122,154,130,0.2)",
              color: "#7A9A82", padding: "2px 7px", borderRadius: 4,
            }}>
              {zone?.label.toUpperCase() ?? situation.zone}
            </span>
            <span style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 8, letterSpacing: "0.08em",
              color: "rgba(255,255,255,0.25)",
            }}>
              {config?.label ?? situation.config}
            </span>
          </div>
          <h1 style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontWeight: 900, fontSize: "clamp(24px, 4.5vw, 38px)",
            lineHeight: 1,
          }}>
            {finality ? `${finality.emoji} ${finality.label}` : situation.finality}
          </h1>
          {situation.description && (
            <p style={{
              fontFamily: "var(--font-body), sans-serif",
              fontWeight: 400, fontSize: 13, lineHeight: 1.5,
              color: "rgba(255,255,255,0.4)", marginTop: 6, maxWidth: 520,
            }}>
              {situation.description}
            </p>
          )}
        </div>

        <SituationPlayback situation={situation} />
      </div>
    </div>
  )
}
