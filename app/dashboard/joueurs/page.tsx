import Link from "next/link"
import PlayerStatusBadge from "@/components/dashboard/PlayerStatusBadge"
import PageHeader from "@/components/dashboard/PageHeader"
import { getPlayers } from "@/app/dashboard/effectif/actions"

const POS_ORDER: Record<string, number> = { GK: 0, DEF: 1, MIL: 2, ATT: 3 }

export default async function JoueursPage() {
  const players = await getPlayers()
  const sorted  = [...players].sort((a, b) => {
    const pd = (POS_ORDER[a.position] ?? 9) - (POS_ORDER[b.position] ?? 9)
    return pd !== 0 ? pd : (a.number ?? 99) - (b.number ?? 99)
  })

  return (
    <div style={{ padding: "32px 36px", maxWidth: 960 }}>
      <PageHeader
        label="Mon Club"
        title="Joueurs"
        subtitle={`${players.length} joueur${players.length !== 1 ? "s" : ""} inscrits`}
      />

      {players.length === 0 ? (
        <div style={{
          padding: "48px 32px", borderRadius: 12, textAlign: "center",
          backgroundColor: "#1f1f19", border: "1px dashed rgba(122,154,130,0.2)",
        }}>
          <p style={{
            fontFamily: "var(--font-body), sans-serif", fontWeight: 400,
            fontSize: 14, color: "rgba(255,255,255,0.3)", marginBottom: 8,
          }}>
            Aucun joueur inscrit.
          </p>
          <Link href="/dashboard/effectif" style={{
            fontFamily: "var(--font-mono), monospace", fontSize: 9,
            letterSpacing: "0.08em", color: "rgba(122,154,130,0.5)",
          }}>
            GÉRER L'EFFECTIF →
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {sorted.map(p => (
            <Link key={p.id} href={`/dashboard/joueurs/${p.id}`} style={{
              display: "flex", alignItems: "center",
              padding: "14px 18px", borderRadius: 10,
              backgroundColor: "#1f1f19",
              border: "1px solid rgba(122,154,130,0.08)",
              gap: 16, textDecoration: "none",
              transition: "border-color 0.15s",
            }}>
              {/* Numéro + poste */}
              <div style={{ width: 44, textAlign: "center", flexShrink: 0 }}>
                <p style={{
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  fontWeight: 900, fontSize: 20, lineHeight: 1,
                  color: "rgba(255,255,255,0.2)",
                }}>
                  {p.number ?? "—"}
                </p>
                <p style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 7, letterSpacing: "0.1em",
                  color: "rgba(122,154,130,0.5)", marginTop: 2,
                }}>
                  {p.position === "GK" ? "GB" : p.position}
                </p>
              </div>

              {/* Nom */}
              <div style={{ flex: 1 }}>
                <p style={{
                  fontFamily: "var(--font-body), sans-serif",
                  fontWeight: 500, fontSize: 14,
                  color: "rgba(255,255,255,0.8)",
                }}>
                  {p.first_name} <span style={{ fontWeight: 700 }}>{p.last_name.toUpperCase()}</span>
                </p>
              </div>

              {/* Stats */}
              <div style={{ display: "flex", gap: 24 }}>
                {[
                  { label: "MJ",   value: p.matches_played },
                  { label: "BUTS", value: p.goals },
                  { label: "PD",   value: p.assists },
                ].map(stat => (
                  <div key={stat.label} style={{ textAlign: "center" }}>
                    <p style={{
                      fontFamily: "var(--font-display), system-ui, sans-serif",
                      fontWeight: 900, fontSize: 16, lineHeight: 1,
                      color: "rgba(255,255,255,0.6)",
                    }}>
                      {stat.value}
                    </p>
                    <p style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: 7, letterSpacing: "0.08em",
                      color: "rgba(255,255,255,0.2)", marginTop: 2,
                    }}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <PlayerStatusBadge status={p.status} />

              <span style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 12, color: "rgba(122,154,130,0.3)",
              }}>→</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
