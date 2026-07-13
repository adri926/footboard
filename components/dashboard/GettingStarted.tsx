import Link from "next/link"

// Écran "premier run" du cockpit : tant que le club n'a pas l'essentiel en place (joueurs
// + au moins une échéance), on guide le coach par une checklist d'amorçage plutôt que de le
// laisser face à un tableau de bord vide. Une fois l'essentiel fait, le cockpit complet
// (TodayPanel + effectif/résultats + outils) prend le relais — voir app/dashboard/page.tsx.

interface Props {
  userName: string
  clubLabel?: string
  players: boolean
  match: boolean
  session: boolean
}

export default function GettingStarted({ userName, clubLabel, players, match, session }: Props) {
  const steps = [
    { title: "Créer ton club", sub: "C'est fait 🎉", done: true, href: null as string | null, cta: null as string | null, href2: null as string | null, cta2: null as string | null },
    { title: "Ajouter tes joueurs", sub: "Constitue ton effectif pour convoquer et composer", done: players, href: "/dashboard/effectif", cta: "Ajouter", href2: "/dashboard/effectif?import=1", cta2: "Importer une liste" },
    { title: "Planifier ton premier match", sub: "Date, adversaire, domicile ou extérieur", done: match, href: "/dashboard/matchs", cta: "Planifier", href2: null as string | null, cta2: null as string | null },
    { title: "Créer ta première séance", sub: "Pioche dans la bibliothèque d'exercices", done: session, href: "/dashboard/entrainements/nouvelle-seance", cta: "Créer", href2: null as string | null, cta2: null as string | null },
  ]
  const doneCount = steps.filter(s => s.done).length
  const firstTodo = steps.findIndex(s => !s.done)

  return (
    <div style={{ marginBottom: 32 }}>
      <p style={{
        fontFamily: "var(--font-display), system-ui, sans-serif", fontWeight: 900,
        fontSize: 22, color: "var(--text-primary)", marginBottom: 4,
      }}>
        Salut {userName} 👋
      </p>
      {clubLabel && (
        <p style={{
          fontFamily: "var(--font-body), sans-serif", fontSize: 12,
          color: "var(--text-muted)", marginBottom: 16,
        }}>
          {clubLabel}
        </p>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <p style={{
          fontFamily: "var(--font-mono), monospace", fontSize: 9, fontWeight: 700,
          letterSpacing: "0.14em", color: "rgba(122,154,130,0.5)", textTransform: "uppercase",
        }}>
          Bien démarrer
        </p>
        <span style={{
          fontFamily: "var(--font-mono), monospace", fontSize: 9, fontWeight: 700,
          color: "var(--text-muted)",
        }}>
          {doneCount}/{steps.length}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {steps.map((s, i) => {
          const isNext = i === firstTodo
          return (
            <div key={s.title} style={{
              display: "flex", alignItems: "center", gap: 14,
              backgroundColor: "var(--bg-card)",
              border: `1px solid ${isNext ? "var(--sauge-border)" : "rgba(122,154,130,0.12)"}`,
              borderRadius: 12, padding: "14px 16px",
              opacity: s.done ? 0.65 : 1,
            }}>
              <span style={{
                width: 30, height: 30, flexShrink: 0, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-mono), monospace", fontSize: 13, fontWeight: 700,
                color: s.done ? "#16160f" : "#7A9A82",
                backgroundColor: s.done ? "#7A9A82" : "rgba(122,154,130,0.12)",
                border: "1px solid rgba(122,154,130,0.3)",
              }}>
                {s.done ? "✓" : i + 1}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontFamily: "var(--font-body), sans-serif", fontWeight: 600,
                  fontSize: 14, color: "var(--text-primary)",
                  textDecoration: s.done ? "line-through" : "none",
                }}>
                  {s.title}
                </p>
                <p style={{
                  fontFamily: "var(--font-body), sans-serif", fontSize: 12,
                  color: "var(--text-muted)", marginTop: 1,
                }}>
                  {s.sub}
                </p>
              </div>
              {!s.done && (s.href || s.href2) && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0, alignItems: "flex-end" }}>
                  {s.href && (
                    <Link href={s.href} style={{
                      textDecoration: "none",
                      fontFamily: "var(--font-mono), monospace", fontSize: 10, fontWeight: 700,
                      letterSpacing: "0.06em", color: "var(--sauge)",
                      backgroundColor: isNext ? "var(--sauge-dim)" : "transparent",
                      border: `1px solid ${isNext ? "var(--sauge-border)" : "rgba(122,154,130,0.2)"}`,
                      borderRadius: 8, padding: "8px 12px", whiteSpace: "nowrap",
                    }}>
                      {s.cta} →
                    </Link>
                  )}
                  {s.href2 && (
                    <Link href={s.href2} style={{
                      textDecoration: "none",
                      fontFamily: "var(--font-mono), monospace", fontSize: 9, fontWeight: 700,
                      letterSpacing: "0.06em", color: "var(--text-muted)",
                      whiteSpace: "nowrap",
                    }}>
                      {s.cta2} →
                    </Link>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Teaser du différenciateur — optionnel, hors checklist. */}
      <Link href="/tactique/analyse-video" style={{
        display: "flex", alignItems: "center", gap: 14, marginTop: 14,
        textDecoration: "none",
        border: "1px dashed rgba(122,154,130,0.3)",
        borderRadius: 12, padding: "14px 16px",
      }}>
        <span style={{
          width: 30, height: 30, flexShrink: 0, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 15, color: "#7A9A82",
          backgroundColor: "rgba(122,154,130,0.12)",
          border: "1px solid rgba(122,154,130,0.3)",
        }}>
          ◬
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontFamily: "var(--font-body), sans-serif", fontWeight: 600,
            fontSize: 14, color: "var(--text-primary)",
          }}>
            Découvre l&apos;analyse vidéo IA
          </p>
          <p style={{
            fontFamily: "var(--font-body), sans-serif", fontSize: 12,
            color: "var(--text-muted)", marginTop: 1,
          }}>
            Le point fort de Footboard — facultatif, quand tu veux
          </p>
        </div>
        <span style={{
          fontFamily: "var(--font-mono), monospace", fontSize: 10, fontWeight: 700,
          letterSpacing: "0.06em", color: "var(--sauge)", flexShrink: 0,
        }}>
          Voir →
        </span>
      </Link>
    </div>
  )
}
