"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import TeamSelector from "./TeamSelector"
import TabIcon, { type TabIconName } from "./TabIcon"
import type { Team } from "@/lib/teams"
import { getDashboardNavGroups } from "@/lib/dashboardNav"

interface Props {
  clubName:     string
  clubLevel:    string | null
  userName:     string
  teams:        Team[]
  activeTeamId: string
}

// Bandeau bas = 5 destinations fixes et directes, choisies pour leur fréquence
// d'usage réelle — pas dérivées des groupes du menu complet (cf. retour terrain :
// une logique par groupes avec sous-menu caché au 2e tap rendait Matchs/Digiboard
// "perdus", peu découvrable). Le hamburger (menu complet, getDashboardNavGroups)
// reste le filet de sécurité pour tout le reste (Calendrier, Entraînements, Concepts).
//
// L'IA (analyse vidéo) est le différenciateur du produit : on la place AU CENTRE du
// bandeau — la zone la plus accessible au pouce — et on l'accentue en pastille
// surélevée (primary), façon bouton-action signature.
//
// Ordre autour du centre : à GAUCHE de l'IA = le club (Actu = point d'ancrage
// "aujourd'hui" en tête, puis Effectif) ; à DROITE = le jeu (Terrain collé au centre
// car très fréquent, puis Digiboard, outil plus ponctuel). L'IA fait le pont entre
// gérer le club et préparer le jeu.
const BOTTOM_TABS = [
  // "Actu" (ex-Accueil) — écran "Aujourd'hui" (TodayPanel) : ce qui se passe
  // maintenant. Placé en premier comme réflexe d'accueil.
  { href: "/dashboard",               label: "Actu",       iconKey: "actu" as TabIconName },
  { href: "/dashboard/effectif",      label: "Effectif",   iconKey: "effectif" as TabIconName },
  { href: "/tactique/analyse-video",  label: "IA",         iconKey: "ia" as TabIconName, primary: true },
  // "Terrain" couvre Matchs + Entraînements (segment toujours visible en haut des
  // deux pages, voir TerrainSegment.tsx) — le tab doit s'allumer sur les deux routes.
  { href: "/dashboard/matchs",        label: "Terrain",    iconKey: "terrain" as TabIconName, activeOn: ["/dashboard/matchs", "/dashboard/entrainements"] },
  { href: "/tactique/digiboard",      label: "Digiboard",  iconKey: "digiboard" as TabIconName },
]

export default function Sidebar({ clubName, clubLevel, userName, teams, activeTeamId }: Props) {
  const pathname = usePathname()

  const navGroups = getDashboardNavGroups()

  return (
    <>
      {/* Spacer CSS pour la sidebar — injecté inline pour garantir le chargement */}
      <style>{`
        /* Mode app (PWA standalone) : toujours l'interface mobile (bandeau bas), quelle
           que soit la largeur de la fenêtre — une app installée ne doit pas basculer en
           sidebar desktop si la fenêtre est agrandie, l'utilisateur s'attend à une UI
           d'app cohérente. */
        @media (display-mode: standalone) {
          .sb { display: none !important; }
          .sb-bottom-nav { display: flex !important; }
          .dashboard-main { padding-bottom: calc(92px + env(safe-area-inset-bottom)) !important; }
        }
        /* Mode navigateur classique : comportement responsive existant, inchangé */
        @media (display-mode: browser) {
          /* Desktop : plus de sidebar — l'app se vit en COLONNE MOBILE CENTRÉE (header +
             bandeau bas centrés sur la colonne), fond neutre autour. Le grand écran reste
             réservé au marketing dans notre vision. */
          @media (min-width: 768px) {
            .sb { display: none !important; }
            .sb-bottom-nav { display: flex !important; left: 0 !important; right: 0 !important; max-width: 612px; margin: 0 auto; }
            .dashboard-main { max-width: 640px; margin: 0 auto; padding-bottom: calc(92px + env(safe-area-inset-bottom)) !important; }
            /* Pages pleine largeur (analyse vidéo, digiboard) — neutralisent la colonne. */
            html.full-bleed .dashboard-main { max-width: none !important; margin: 0 !important; }
            html.full-bleed .sb-bottom-nav { left: 14px !important; right: 14px !important; max-width: none !important; margin: 0 !important; }
          }
          /* Navigateur mobile (PWA non installée) : sidebar cachée, bandeau bas affiché. */
          @media (max-width: 767px) {
            .sb { display: none !important; }
            .sb-bottom-nav { display: flex !important; }
            .dashboard-main { padding-bottom: calc(92px + env(safe-area-inset-bottom)) !important; }
          }
        }
      `}</style>

      <aside className="sb" style={{
        width: 240, flexShrink: 0,
        backgroundColor: "var(--bg)",
        borderRight: "1px solid rgba(122,154,130,0.1)",
        display: "flex", flexDirection: "column",
        height: "100vh", position: "sticky", top: 0, overflowY: "auto",
        transition: "width 0.2s ease",
      }}>
        {/* Club */}
        <Link href="/dashboard" className="sb-logo" style={{
          padding: "18px 20px 16px",
          borderBottom: "1px solid rgba(122,154,130,0.08)",
          display: "flex", alignItems: "center", gap: 10,
          textDecoration: "none",
        }}>
          <div className="sb-logoicon" style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            backgroundColor: "rgba(122,154,130,0.1)",
            border: "1px solid rgba(122,154,130,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontWeight: 900, fontSize: 14, color: "#7A9A82",
          }}>
            {clubName[0].toUpperCase()}
          </div>
          <div className="sb-label" style={{ minWidth: 0 }}>
            <p style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontWeight: 900, fontSize: 15, letterSpacing: "0.04em",
              color: "rgba(255,255,255,0.95)",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {clubName.toUpperCase()}
            </p>
            {clubLevel && (
              <p style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 9, letterSpacing: "0.1em",
                color: "rgba(122,154,130,0.55)", marginTop: 2,
              }}>
                {clubLevel.toUpperCase()}
              </p>
            )}
          </div>
        </Link>

        <TeamSelector teams={teams} activeTeamId={activeTeamId} />

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 24 }}>
          {navGroups.map(group => (
            <div key={group.label}>
              <p className="sb-group" style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 8, fontWeight: 700, letterSpacing: "0.14em",
                color: "rgba(122,154,130,0.4)",
                textTransform: "uppercase", marginBottom: 6, paddingLeft: 8,
              }}>
                {group.label}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {group.items.map(item => {
                  const active = item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href)
                  return (
                    <Link key={item.href} href={item.href}
                      className="sb-item"
                      data-label={item.label}
                      style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "7px 10px", borderRadius: 8,
                        fontFamily: "var(--font-body), sans-serif",
                        fontWeight: active ? 500 : 300, fontSize: 13,
                        color: active ? "#7A9A82" : "rgba(255,255,255,0.5)",
                        backgroundColor: active ? "rgba(122,154,130,0.08)" : "transparent",
                        border: active ? "1px solid rgba(122,154,130,0.15)" : "1px solid transparent",
                        transition: "all 0.15s",
                      }}
                    >
                      <span style={{ fontSize: 11, opacity: 0.7, flexShrink: 0 }}>{item.icon}</span>
                      <span className="sb-label" style={{ flex: 1 }}>{item.label}</span>
                      {item.badge && (
                        <span className="sb-label" style={{
                          fontFamily: "var(--font-mono), monospace",
                          fontSize: 8, fontWeight: 700, letterSpacing: "0.08em",
                          color: "#7A9A82",
                          backgroundColor: "rgba(122,154,130,0.12)",
                          border: "1px solid rgba(122,154,130,0.25)",
                          borderRadius: 100, padding: "1px 5px", flexShrink: 0,
                        }}>{item.badge}</span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Avatar coach */}
        <Link href="/dashboard/compte" className="sb-av" style={{
          padding: "14px 16px",
          borderTop: "1px solid rgba(122,154,130,0.08)",
          display: "flex", alignItems: "center", gap: 10,
          textDecoration: "none",
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            backgroundColor: "rgba(122,154,130,0.15)",
            border: "1px solid rgba(122,154,130,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-mono), monospace",
            fontSize: 11, fontWeight: 700, color: "#7A9A82",
            flexShrink: 0,
          }}>
            {userName[0].toUpperCase()}
          </div>
          <div className="sb-avtext" style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontFamily: "var(--font-body), sans-serif",
              fontWeight: 500, fontSize: 12, color: "rgba(255,255,255,0.7)",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {userName}
            </p>
            <p style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 8, letterSpacing: "0.06em", color: "rgba(255,255,255,0.2)",
            }}>
              COACH PRINCIPAL
            </p>
          </div>
        </Link>
      </aside>

      {/* Bottom nav mobile — 5 destinations fixes, voir BOTTOM_TABS ci-dessus.
          Flottant (détaché des bords, arrondi) + verre dépoli (fond translucide + flou).
          Pas d'overflow:hidden : la pastille IA surélevée (marginTop:-26) déborde en haut. */}
      <nav className="sb-bottom-nav" style={{
        display: "none",
        position: "fixed",
        bottom: "calc(14px + env(safe-area-inset-bottom))",
        left: 14, right: 14, zIndex: 50,
        height: 62, alignItems: "stretch",
        padding: "0 8px",
        backgroundColor: "rgba(24,24,17,0.52)",
        backdropFilter: "blur(30px) saturate(170%)",
        WebkitBackdropFilter: "blur(30px) saturate(170%)",
        border: "1px solid rgba(122,154,130,0.22)",
        borderRadius: 22,
        boxShadow: "0 14px 36px rgba(0,0,0,0.55)",
      }}>
        {BOTTOM_TABS.map(tab => {
          const activeOn = "activeOn" in tab ? tab.activeOn : undefined
          const active = activeOn
            ? activeOn.some(p => pathname.startsWith(p))
            : tab.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(tab.href)

          const primary = "primary" in tab && tab.primary

          // Onglet IA — pastille sauge surélevée façon bouton-action signature, popant
          // au-dessus du bandeau. Pas d'indicateur borderTop : l'état actif se lit sur
          // l'anneau + l'éclat de la pastille.
          if (primary) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                style={{
                  flex: 1, display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: 4,
                  textDecoration: "none",
                }}>
                <span style={{
                  width: 42, height: 42, borderRadius: "50%", marginTop: -20,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  backgroundColor: active ? "#36453b" : "#29332c",
                  borderStyle: "solid", borderWidth: 1,
                  borderColor: active ? "rgba(122,154,130,0.6)" : "rgba(122,154,130,0.32)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                  color: "#7A9A82", lineHeight: 1,
                }}>
                  <TabIcon name={tab.iconKey} size={20} />
                </span>
                <span style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 9.5, fontWeight: 700, letterSpacing: "0.04em",
                  color: active ? "#7A9A82" : "rgba(122,154,130,0.8)",
                }}>
                  {tab.label.toUpperCase()}
                </span>
              </Link>
            )
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              style={{
                flex: 1, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 3,
                textDecoration: "none",
                margin: "9px 3px", borderRadius: 14,
                backgroundColor: active ? "rgba(122,154,130,0.13)" : "transparent",
              }}>
              <span style={{ color: active ? "#7A9A82" : "rgba(255,255,255,0.62)", display: "flex" }}>
                <TabIcon name={tab.iconKey} size={18} />
              </span>
              <span style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 9.5, fontWeight: 700, letterSpacing: "0.04em",
                color: active ? "#7A9A82" : "rgba(255,255,255,0.62)",
              }}>
                {tab.label.toUpperCase()}
              </span>
            </Link>
          )
        })}
      </nav>

    </>
  )
}
