import Link from "next/link"
import MetricCard from "@/components/dashboard/MetricCard"
import PlayerStatusBadge from "@/components/dashboard/PlayerStatusBadge"
import PageHeader from "@/components/dashboard/PageHeader"
import { getPlayers } from "@/app/dashboard/effectif/actions"
import { getMatches } from "@/app/dashboard/matchs/actions"
import { getTrainings } from "@/app/dashboard/entrainements/actions"
import { getMyClub } from "@/app/dashboard/club/actions"
import { TRAINING_TYPES } from "@/lib/training-types"
import type { Match } from "@/app/dashboard/matchs/actions"
import type { Training } from "@/app/dashboard/entrainements/actions"

function formatDate(dateStr: string) {
  const m = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return dateStr
  const d = new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]))
  return d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })
}

const TYPE_COLORS: Record<string, string> = {
  tactique: "#7A9A82", technique: "#6b9ab8", physique: "#d4a847",
  cpa: "#a87ab8", recuperation: "#7ab8a8", amical: "#e07070",
}

const DAYS   = ["L","M","M","J","V","S","D"]
const MONTHS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"]

function MiniCalendar({ trainings, matches }: { trainings: Training[]; matches: Match[] }) {
  const now  = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()

  const trainingSet = new Set(trainings.map(t => t.date.slice(0, 10)))
  const matchSet    = new Set(matches.map(m => m.date.slice(0, 10)))

  const firstDay    = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startOffset = (firstDay.getDay() + 6) % 7

  const todayStr = `${year}-${String(month+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <p style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
          color: "rgba(122,154,130,0.7)", textTransform: "uppercase",
        }}>
          Agenda — {MONTHS[month]} {year}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#7A9A82", display: "inline-block" }} />
            <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 8, color: "rgba(255,255,255,0.45)" }}>Entraînement</span>
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#d4a847", display: "inline-block" }} />
            <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 8, color: "rgba(255,255,255,0.45)" }}>Match</span>
          </span>
        </div>
      </div>

      {/* En-têtes jours */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
        {DAYS.map((d, i) => (
          <div key={i} style={{
            textAlign: "center",
            fontFamily: "var(--font-mono), monospace",
            fontSize: 8, color: "rgba(255,255,255,0.2)", letterSpacing: "0.04em",
          }}>
            {d}
          </div>
        ))}
      </div>

      {/* Grille */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
        {cells.map((day, i) => {
          if (!day) return <div key={i} />
          const dateStr   = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`
          const hasT      = trainingSet.has(dateStr)
          const hasM      = matchSet.has(dateStr)
          const isToday   = dateStr === todayStr
          const hasEvent  = hasT || hasM

          return (
            <div key={i} style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: 3, padding: "6px 0", borderRadius: 7,
              backgroundColor: isToday ? "rgba(122,154,130,0.12)" : hasEvent ? "rgba(255,255,255,0.02)" : "transparent",
              border: isToday ? "1px solid rgba(122,154,130,0.25)" : "1px solid transparent",
            }}>
              <span style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 11,
                color: isToday ? "#7A9A82" : "rgba(255,255,255,0.65)",
                fontWeight: isToday ? 700 : 400,
              }}>
                {day}
              </span>
              <div style={{ display: "flex", gap: 2, height: 7, alignItems: "center" }}>
                {hasT && <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#7A9A82", opacity: 0.9 }} />}
                {hasM && <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#d4a847", opacity: 0.9 }} />}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default async function DashboardPage() {
  const [players, matches, trainings, club] = await Promise.all([
    getPlayers(),
    getMatches(),
    getTrainings(),
    getMyClub(),
  ])

  const today = new Date().toISOString().slice(0, 10)
  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()

  const nextMatch = matches
    .filter(m => m.date.slice(0,10) >= today && m.goals_for === null)
    .sort((a, b) => a.date.slice(0,10).localeCompare(b.date.slice(0,10)))[0]

  const recentResults = matches
    .filter(m => m.goals_for !== null)
    .slice(0, 3)

  const monthTrainings = trainings.filter(t => {
    const d = new Date(t.date.slice(0, 10) + "T12:00:00")
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear
  })

  const availablePlayers  = players.filter(p => p.status === "available")
  const injuredPlayers    = players.filter(p => p.status === "injured")
  const uncertainPlayers  = players.filter(p => p.status === "uncertain")
  const nonAvailable      = players.filter(p => p.status !== "available")

  const lastTrainings = trainings.slice(0, 4)

  return (
    <div className="page-pad" style={{ maxWidth: 1100 }}>

      <PageHeader
        label="Tableau de bord"
        title={club?.name ?? "Mon Club"}
        subtitle={[club?.level, "Saison 2025/2026"].filter(Boolean).join(" — ")}
      />

      {/* 4 metric cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 32 }}>
        <MetricCard
          label="Prochain match"
          value={nextMatch ? formatDate(nextMatch.date) : "—"}
          sub={nextMatch
            ? `vs ${nextMatch.opponent} · ${nextMatch.home_away === "home" ? "Domicile" : "Extérieur"}`
            : "Aucun match à venir"}
          accent
        />
        <MetricCard
          label="Joueurs disponibles"
          value={availablePlayers.length || (players.length === 0 ? "—" : 0)}
          sub={players.length > 0 ? `sur ${players.length} dans l'effectif` : "Effectif vide"}
          accent
        />
        <MetricCard
          label="Entraînements ce mois"
          value={monthTrainings.length || (trainings.length === 0 ? "—" : 0)}
          sub="séances réalisées"
        />
        <MetricCard
          label="Blessés en cours"
          value={injuredPlayers.length + uncertainPlayers.length || (players.length === 0 ? "—" : 0)}
          sub={players.length > 0
            ? `${injuredPlayers.length} blessé${injuredPlayers.length !== 1 ? "s" : ""} · ${uncertainPlayers.length} incertain${uncertainPlayers.length !== 1 ? "s" : ""}`
            : "Effectif vide"}
          warn={injuredPlayers.length > 0}
        />
      </div>

      {/* Mini calendrier */}
      <div style={{
        backgroundColor: "var(--bg-card)", border: "1px solid rgba(122,154,130,0.1)",
        borderRadius: 12, padding: "20px 22px", marginBottom: 20,
      }}>
        <MiniCalendar trainings={trainings} matches={matches} />
      </div>

      {/* 2 columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

        {/* Santé effectif */}
        <div style={{
          backgroundColor: "var(--bg-card)", border: "1px solid rgba(122,154,130,0.1)",
          borderRadius: 12, padding: "20px 22px",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <p style={{
              fontFamily: "var(--font-mono), monospace", fontSize: 9, fontWeight: 700,
              letterSpacing: "0.14em", color: "rgba(122,154,130,0.5)", textTransform: "uppercase",
            }}>
              Santé effectif
            </p>
            <Link href="/dashboard/effectif" style={{
              fontFamily: "var(--font-mono), monospace", fontSize: 8,
              letterSpacing: "0.08em", color: "rgba(122,154,130,0.4)",
            }}>
              VOIR TOUT →
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {nonAvailable.length === 0 ? (
              <p style={{
                fontFamily: "var(--font-body), sans-serif", fontWeight: 400,
                fontSize: 13, color: "rgba(255,255,255,0.3)",
              }}>
                {players.length === 0 ? "Aucun joueur dans l'effectif." : "Tous les joueurs sont disponibles."}
              </p>
            ) : nonAvailable.map(p => (
              <div key={p.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 12px", borderRadius: 8,
                backgroundColor: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(122,154,130,0.07)",
              }}>
                <div>
                  <p style={{
                    fontFamily: "var(--font-body), sans-serif", fontWeight: 500,
                    fontSize: 13, color: "rgba(255,255,255,0.75)",
                  }}>
                    {p.first_name} {p.last_name}
                    <span style={{
                      fontFamily: "var(--font-mono), monospace", fontSize: 9,
                      letterSpacing: "0.06em", color: "rgba(255,255,255,0.25)", marginLeft: 6,
                    }}>
                      {p.number ? `#${p.number} · ` : ""}{p.position === "GK" ? "GB" : p.position}
                    </span>
                  </p>
                  {p.injury_note && (
                    <p style={{
                      fontFamily: "var(--font-body), sans-serif", fontWeight: 400,
                      fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2,
                    }}>
                      {p.injury_note}
                    </p>
                  )}
                </div>
                <PlayerStatusBadge status={p.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Résultats récents */}
        <div style={{
          backgroundColor: "var(--bg-card)", border: "1px solid rgba(122,154,130,0.1)",
          borderRadius: 12, padding: "20px 22px",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <p style={{
              fontFamily: "var(--font-mono), monospace", fontSize: 9, fontWeight: 700,
              letterSpacing: "0.14em", color: "rgba(122,154,130,0.5)", textTransform: "uppercase",
            }}>
              Résultats récents
            </p>
            <Link href="/dashboard/matchs" style={{
              fontFamily: "var(--font-mono), monospace", fontSize: 8,
              letterSpacing: "0.08em", color: "rgba(122,154,130,0.4)",
            }}>
              VOIR TOUT →
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {recentResults.length === 0 ? (
              <p style={{
                fontFamily: "var(--font-body), sans-serif", fontWeight: 400,
                fontSize: 13, color: "rgba(255,255,255,0.3)",
              }}>
                Aucun résultat enregistré.
              </p>
            ) : recentResults.map(m => {
              const gf = m.goals_for ?? 0
              const ga = m.goals_against ?? 0
              const win = gf > ga, draw = gf === ga
              const resultColor = win ? "#7A9A82" : draw ? "#d4a847" : "#e07070"
              const resultLabel = win ? "V" : draw ? "N" : "D"
              return (
                <div key={m.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 12px", borderRadius: 8,
                  backgroundColor: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(122,154,130,0.07)",
                }}>
                  <div>
                    <p style={{
                      fontFamily: "var(--font-body), sans-serif", fontWeight: 500,
                      fontSize: 13, color: "rgba(255,255,255,0.75)",
                    }}>
                      vs {m.opponent}
                    </p>
                    <p style={{
                      fontFamily: "var(--font-mono), monospace", fontSize: 9,
                      letterSpacing: "0.06em", color: "rgba(255,255,255,0.25)", marginTop: 2,
                    }}>
                      {formatDate(m.date)} · {m.home_away === "home" ? "DOM" : "EXT"}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      fontFamily: "var(--font-display), system-ui, sans-serif",
                      fontWeight: 900, fontSize: 18, color: "rgba(255,255,255,0.8)",
                    }}>
                      {gf} – {ga}
                    </span>
                    <span style={{
                      fontFamily: "var(--font-mono), monospace", fontSize: 8,
                      fontWeight: 700, letterSpacing: "0.1em",
                      color: resultColor, backgroundColor: `${resultColor}18`,
                      border: `1px solid ${resultColor}40`,
                      padding: "2px 7px", borderRadius: 100,
                    }}>
                      {resultLabel}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Derniers entraînements */}
      <div style={{
        backgroundColor: "var(--bg-card)", border: "1px solid rgba(122,154,130,0.1)",
        borderRadius: 12, padding: "20px 22px",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <p style={{
            fontFamily: "var(--font-mono), monospace", fontSize: 9, fontWeight: 700,
            letterSpacing: "0.14em", color: "rgba(122,154,130,0.5)", textTransform: "uppercase",
          }}>
            Derniers entraînements
          </p>
          <Link href="/dashboard/entrainements" style={{
            fontFamily: "var(--font-mono), monospace", fontSize: 8,
            letterSpacing: "0.08em", color: "rgba(122,154,130,0.4)",
          }}>
            VOIR TOUT →
          </Link>
        </div>

        {lastTrainings.length === 0 ? (
          <p style={{
            fontFamily: "var(--font-body), sans-serif", fontWeight: 400,
            fontSize: 13, color: "rgba(255,255,255,0.3)",
          }}>
            Aucune séance enregistrée.
          </p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
            {lastTrainings.map(t => {
              const color = t.type ? (TYPE_COLORS[t.type] ?? "#7A9A82") : "#7A9A82"
              const typeLabel = t.type ? (TRAINING_TYPES.find(x => x.value === t.type)?.label ?? t.type) : null
              return (
                <div key={t.id} style={{
                  padding: "12px 14px", borderRadius: 8,
                  backgroundColor: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(122,154,130,0.07)",
                  display: "flex", flexDirection: "column", gap: 4,
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <p style={{
                      fontFamily: "var(--font-mono), monospace", fontSize: 9,
                      letterSpacing: "0.06em", color: "rgba(122,154,130,0.5)",
                    }}>
                      {formatDate(t.date)}
                    </p>
                    {typeLabel && (
                      <span style={{
                        fontFamily: "var(--font-mono), monospace", fontSize: 7,
                        fontWeight: 700, letterSpacing: "0.08em",
                        color, backgroundColor: `${color}18`,
                        border: `1px solid ${color}40`,
                        padding: "2px 7px", borderRadius: 100,
                      }}>
                        {typeLabel.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p style={{
                    fontFamily: "var(--font-body), sans-serif", fontWeight: 400,
                    fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.4,
                  }}>
                    {t.theme ?? typeLabel ?? "Séance"}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}
