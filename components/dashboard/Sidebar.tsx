"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV_GROUPS = [
  {
    label: "Vue d'ensemble",
    items: [
      { href: "/dashboard", label: "Tableau de bord", icon: "◈" },
    ],
  },
  {
    label: "Mon Équipe",
    items: [
      { href: "/dashboard/effectif",      label: "Effectif",        icon: "◻" },
      { href: "/dashboard/joueurs",        label: "Joueurs",         icon: "◎" },
      { href: "/dashboard/matchs",         label: "Matchs",          icon: "◷" },
      { href: "/dashboard/entrainements",  label: "Entraînements",   icon: "◈" },
    ],
  },
  {
    label: "Tactique",
    items: [
      { href: "/tactique/creer",          label: "Créer une situation", icon: "◬" },
      { href: "/tactique/mes-situations", label: "Mes situations",      icon: "◫" },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside style={{
      width: 240, flexShrink: 0,
      backgroundColor: "#181812",
      borderRight: "1px solid rgba(122,154,130,0.1)",
      display: "flex", flexDirection: "column",
      height: "100vh", position: "sticky", top: 0, overflowY: "auto",
    }}>
      {/* Logo */}
      <div style={{
        padding: "20px 20px 16px",
        borderBottom: "1px solid rgba(122,154,130,0.08)",
      }}>
        <Link href="/" style={{
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontWeight: 900, fontSize: 16, letterSpacing: "0.06em",
          color: "rgba(255,255,255,0.95)",
        }}>
          FOOTBOARD
        </Link>
        <p style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 8, letterSpacing: "0.1em",
          color: "rgba(122,154,130,0.5)", marginTop: 4,
        }}>
          AS POINCARÉ — R2
        </p>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 24 }}>
        {NAV_GROUPS.map(group => (
          <div key={group.label}>
            <p style={{
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
                    className="hover:text-white"
                  >
                    <span style={{ fontSize: 11, opacity: 0.7 }}>{item.icon}</span>
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Avatar coach */}
      <div style={{
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
          A
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontFamily: "var(--font-body), sans-serif",
            fontWeight: 500, fontSize: 12,
            color: "rgba(255,255,255,0.7)",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            Adrien
          </p>
          <p style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 8, letterSpacing: "0.06em",
            color: "rgba(255,255,255,0.2)",
          }}>
            COACH PRINCIPAL
          </p>
        </div>
      </div>
    </aside>
  )
}
