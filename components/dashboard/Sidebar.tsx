"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import TeamSelector from "./TeamSelector"
import type { Team } from "@/lib/teams"

const NAV_GROUPS = [
  {
    label: "Vue d'ensemble",
    items: [
      { href: "/dashboard", label: "Tableau de bord", icon: "◈" },
    ],
  },
  {
    label: "Club",
    items: [
      { href: "/dashboard/club/equipe",      label: "Équipe & accès", icon: "◎" },
      { href: "/dashboard/club/cotisations", label: "Cotisations",   icon: "€" },
    ],
  },
  {
    label: "Activité",
    items: [
      { href: "/dashboard/calendrier",    label: "Calendrier",    icon: "▦" },
      { href: "/dashboard/matchs",        label: "Matchs",        icon: "◷" },
      { href: "/dashboard/entrainements", label: "Entraînements", icon: "◈" },
    ],
  },
  {
    label: "Effectif",
    items: [
      { href: "/dashboard/effectif",         label: "Effectif",       icon: "◻" },
      { href: "/dashboard/effectif/equipes", label: "Équipes",        icon: "◐" },
      { href: "/dashboard/data",             label: "Data & stats",   icon: "▤" },
      { href: "/tactique/analyse-video",     label: "Analyse vidéo",  icon: "◬", badge: "IA" },
    ],
  },
]

interface Props {
  clubName:      string
  clubLevel:     string | null
  userName:      string
  canManageFees: boolean
  teams:         Team[]
  activeTeamId:  string
}

export default function Sidebar({ clubName, clubLevel, userName, canManageFees, teams, activeTeamId }: Props) {
  const pathname = usePathname()

  const navGroups = NAV_GROUPS.map(group => ({
    ...group,
    items: group.items.filter(item => item.href !== "/dashboard/club/cotisations" || canManageFees),
  }))

  return (
    <>
      {/* Spacer CSS pour la sidebar — injecté inline pour garantir le chargement */}
      <style>{`
        @media (max-width: 1024px) and (min-width: 768px) {
          .sb { width: 64px !important; }
          .sb-label, .sb-group, .sb-sub, .sb-avtext { display: none !important; }
          .sb-logoicon { display: flex !important; }
          .sb-item { justify-content: center !important; padding: 10px !important; gap: 0 !important; position: relative; }
          .sb-item:hover::after {
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
          .sb-av { justify-content: center !important; padding: 14px 0 !important; }
          .sb-logo { padding: 20px 0 16px !important; justify-content: center !important; }
        }
        @media (max-width: 767px) {
          .sb { display: none !important; }
          .sb-bottom-nav { display: flex !important; }
          .dashboard-main { padding-bottom: 72px !important; }
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

      {/* Bottom nav mobile */}
      <nav className="sb-bottom-nav" style={{
        display: "none",
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
        height: 64, alignItems: "stretch",
        backgroundColor: "#16160f",
        borderTop: "1px solid rgba(122,154,130,0.15)",
      }}>
        {[
          { href: "/dashboard",                label: "Accueil",    icon: "◈" },
          { href: "/dashboard/matchs",         label: "Matchs",     icon: "◷" },
          { href: "/dashboard/entrainements",  label: "Séances",    icon: "▣" },
          { href: "/dashboard/effectif",       label: "Effectif",   icon: "◻" },
          { href: "/tactique/analyse-video",   label: "IA",         icon: "◬" },
        ].map(item => {
          const active = item.href === "/dashboard"
            ? pathname === "/dashboard"
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
                {item.label.toUpperCase()}
              </span>
            </Link>
          )
        })}
      </nav>

    </>
  )
}
