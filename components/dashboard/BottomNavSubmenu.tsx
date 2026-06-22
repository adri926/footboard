"use client"

import Link from "next/link"
import type { DashboardNavItem } from "@/lib/dashboardNav"

// Popover ouvert au 2e tap sur un tab du bandeau bas déjà actif (quand son groupe a
// plusieurs pages) — liste les autres destinations du groupe, ancré juste au-dessus
// du bandeau bas.
export default function BottomNavSubmenu({
  items,
  activeHref,
  onSelect,
  onClose,
}: {
  items: DashboardNavItem[]
  activeHref: string
  onSelect: () => void
  onClose: () => void
}) {
  return (
    <>
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 49 }}
      />
      <div style={{
        position: "fixed", bottom: 64, left: 12, right: 12, zIndex: 50,
        backgroundColor: "#1a1a18",
        border: "1px solid rgba(122,154,130,0.2)",
        borderRadius: 12, padding: 6,
        boxShadow: "0 -4px 20px rgba(0,0,0,0.4)",
        display: "flex", flexDirection: "column", gap: 2,
      }}>
        {items.map(item => {
          const active = pathnameMatches(activeHref, item.href)
          return (
            <Link key={item.href} href={item.href} onClick={onSelect} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "11px 12px", borderRadius: 8,
              textDecoration: "none",
              backgroundColor: active ? "rgba(122,154,130,0.1)" : "transparent",
            }}>
              <span style={{ fontSize: 14, color: active ? "#7A9A82" : "rgba(255,255,255,0.5)" }}>
                {item.icon}
              </span>
              <span style={{
                fontFamily: "var(--font-body), sans-serif",
                fontSize: 14, fontWeight: active ? 500 : 400,
                color: active ? "#7A9A82" : "rgba(255,255,255,0.75)",
              }}>
                {item.label}
              </span>
              {item.badge && (
                <span style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 8, fontWeight: 700, letterSpacing: "0.08em",
                  color: "#7A9A82",
                  backgroundColor: "rgba(122,154,130,0.12)",
                  border: "1px solid rgba(122,154,130,0.25)",
                  borderRadius: 100, padding: "1px 5px", marginLeft: "auto",
                }}>{item.badge}</span>
              )}
            </Link>
          )
        })}
      </div>
    </>
  )
}

function pathnameMatches(pathname: string, href: string) {
  return href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href)
}
