"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV_ITEMS = [
  { href: "/joueur",              label: "Calendrier",      icon: "▦" },
  { href: "/joueur/entrainements", label: "Entraînements",  icon: "◈" },
  { href: "/joueur/matchs",        label: "Matchs",          icon: "◷" },
  { href: "/joueur/stats",         label: "Mes statistiques", icon: "▤" },
]

interface Props {
  clubName:   string
  clubLevel:  string | null
  playerName: string
}

export default function PlayerSidebar({ clubName, clubLevel, playerName }: Props) {
  const pathname = usePathname()

  return (
    <>
      <style>{`
        /* Mode app (PWA standalone) : toujours l'interface mobile (bandeau bas), quelle
           que soit la largeur de la fenêtre — cf. components/dashboard/Sidebar.tsx pour
           la même logique côté coach. */
        @media (display-mode: standalone) {
          .psb { display: none !important; }
          .psb-bottom-nav { display: flex !important; }
          .joueur-main { padding-bottom: calc(72px + env(safe-area-inset-bottom)) !important; }
        }
        /* Mode navigateur classique : comportement responsive existant, inchangé */
        @media (display-mode: browser) {
          @media (max-width: 1024px) and (min-width: 768px) {
            .psb { width: 64px !important; }
            .psb-label, .psb-sub, .psb-avtext { display: none !important; }
            .psb-logoicon { display: inline !important; }
            .psb-item { justify-content: center !important; padding: 10px !important; gap: 0 !important; position: relative; }
            .psb-item:hover::after {
              content: attr(data-label);
              position: absolute;
              left: calc(100% + 8px); top: 50%;
              transform: translateY(-50%);
              background: #24221a;
              color: rgba(255,255,255,0.85);
              border: 1px solid rgba(122,154,130,0.2);
              border-radius: 6px;
              padding: 5px 10px;
              font-size: 11px;
              font-family: inherit;
              white-space: nowrap;
              z-index: 100;
              pointer-events: none;
            }
            .psb-av { justify-content: center !important; padding: 14px 0 !important; }
            .psb-logo { padding: 20px 0 16px !important; justify-content: center !important; }
          }
          @media (max-width: 767px) {
            .psb { display: none !important; }
          }
        }
      `}</style>

      <aside className="psb" style={{
        width: 240, flexShrink: 0,
        backgroundColor: "var(--bg)",
        borderRight: "1px solid rgba(122,154,130,0.1)",
        display: "flex", flexDirection: "column",
        height: "100vh", position: "sticky", top: 0, overflowY: "auto",
        transition: "width 0.2s ease",
      }}>
        {/* Logo */}
        <div className="psb-logo" style={{
          padding: "18px 20px 14px",
          borderBottom: "1px solid rgba(122,154,130,0.08)",
          display: "flex", flexDirection: "column",
        }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span className="psb-label" style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontWeight: 900, fontSize: 16, letterSpacing: "0.06em",
              color: "rgba(255,255,255,0.95)",
            }}>
              FOOTBOARD
            </span>
            <span className="psb-logoicon" style={{
              display: "none",
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontWeight: 900, fontSize: 16, letterSpacing: "0.06em",
              color: "rgba(255,255,255,0.95)",
            }}>
              F
            </span>
          </div>
          <p className="psb-sub" style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 8, letterSpacing: "0.1em",
            color: "rgba(122,154,130,0.55)", marginTop: 5,
          }}>
            {clubName.toUpperCase()}{clubLevel ? ` — ${clubLevel}` : ""}
          </p>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV_ITEMS.map(item => {
            const active = item.href === "/joueur"
              ? pathname === "/joueur"
              : pathname.startsWith(item.href)
            return (
              <Link key={item.href} href={item.href}
                className="psb-item"
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
                <span className="psb-label">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Avatar joueur */}
        <div className="psb-av" style={{
          padding: "14px 16px",
          borderTop: "1px solid rgba(122,154,130,0.08)",
          display: "flex", alignItems: "center", gap: 10,
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
            {playerName[0].toUpperCase()}
          </div>
          <div className="psb-avtext" style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontFamily: "var(--font-body), sans-serif",
              fontWeight: 500, fontSize: 12, color: "rgba(255,255,255,0.7)",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {playerName}
            </p>
            <p style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 8, letterSpacing: "0.06em", color: "rgba(255,255,255,0.2)",
            }}>
              JOUEUR
            </p>
          </div>
        </div>
      </aside>

      {/* Bottom nav mobile */}
      <nav className="psb-bottom-nav" style={{
        display: "none",
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
        height: 64, alignItems: "stretch",
        backgroundColor: "#16160f",
        borderTop: "1px solid rgba(122,154,130,0.15)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}>
        {NAV_ITEMS.map(item => {
          const active = item.href === "/joueur"
            ? pathname === "/joueur"
            : pathname.startsWith(item.href)
          return (
            <Link key={item.href} href={item.href} style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 3,
              textDecoration: "none",
              backgroundColor: active ? "rgba(122,154,130,0.06)" : "transparent",
              borderTop: active ? "2px solid rgba(122,154,130,0.6)" : "2px solid transparent",
            }}>
              <span style={{ fontSize: 13, color: active ? "#7A9A82" : "rgba(255,255,255,0.3)" }}>
                {item.icon}
              </span>
              <span style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 7, fontWeight: 700, letterSpacing: "0.06em",
                color: active ? "#7A9A82" : "rgba(255,255,255,0.3)",
              }}>
                {(item.href === "/joueur/stats" ? "Stats" : item.label).toUpperCase()}
              </span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
