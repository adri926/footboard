"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { getDashboardNavGroups } from "@/lib/dashboardNav"
import FootboardMark from "@/components/FootboardMark"

interface Props {
  clubName:  string
  clubLevel: string | null
  userName:  string
}

export default function MobileHeader({ clubName, clubLevel, userName }: Props) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const [prevPathname, setPrevPathname] = useState(pathname)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    setOpen(false)
  }

  const navGroups = getDashboardNavGroups()

  return (
    <>
      <style>{`
        .mh-bar { display: none !important; }
        .mh-pad { display: none; }
        @media (display-mode: standalone) {
          .mh-bar { display: flex !important; }
          .mh-pad { display: block; height: calc(56px + env(safe-area-inset-top)); }
        }
        @media (max-width: 767px) and (display-mode: browser) {
          .mh-bar { display: flex !important; }
          .mh-pad { display: block; height: calc(56px + env(safe-area-inset-top)); }
        }
      `}</style>

      {/* Fixed header bar — hidden via CSS at desktop */}
      <header className="mh-bar" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        height: 56, backgroundColor: "var(--bg)",
        borderBottom: "1px solid rgba(122,154,130,0.1)",
        alignItems: "center", justifyContent: "space-between",
        padding: "0 16px",
        paddingTop: "env(safe-area-inset-top)",
      }}>
        <Link href="/dashboard" style={{
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontWeight: 900, fontSize: 15, letterSpacing: "0.06em",
          color: "rgba(255,255,255,0.95)",
        }}>
          FOOTBOARD
        </Link>
        <button
          onClick={() => setOpen(o => !o)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          style={{
            backgroundColor: "transparent", borderStyle: "none", cursor: "pointer",
            color: "rgba(255,255,255,0.7)", fontSize: 20, padding: "4px 8px",
            lineHeight: 1,
          }}
        >
          {open ? "✕" : "☰"}
        </button>
      </header>

      {/* Spacer under fixed header (mobile only) */}
      <div className="mh-pad" />

      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position: "fixed", inset: 0, zIndex: 55,
          backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.25s ease",
        }}
      />

      {/* Drawer */}
      <div style={{
        position: "fixed", top: 0, left: 0, bottom: 0,
        width: 240, zIndex: 60,
        backgroundColor: "var(--bg)",
        borderRight: "1px solid rgba(122,154,130,0.15)",
        display: "flex", flexDirection: "column", overflowY: "auto",
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.25s ease",
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 20px 16px", paddingTop: "calc(20px + env(safe-area-inset-top))", borderBottom: "1px solid rgba(122,154,130,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FootboardMark size={22} />
            <p style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontWeight: 900, fontSize: 16, letterSpacing: "0.06em",
              color: "rgba(255,255,255,0.95)",
            }}>
              FOOTBOARD
            </p>
          </div>
          <p style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 8, letterSpacing: "0.1em",
            color: "rgba(122,154,130,0.5)", marginTop: 4,
          }}>
            {clubName.toUpperCase()}{clubLevel ? ` — ${clubLevel}` : ""}
          </p>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 24, overflowY: "auto" }}>
          {navGroups.map(group => (
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
                    <Link key={item.href} href={item.href} style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "7px 10px", borderRadius: 8,
                      fontFamily: "var(--font-body), sans-serif",
                      fontWeight: active ? 500 : 300, fontSize: 13,
                      color: active ? "#7A9A82" : "rgba(255,255,255,0.5)",
                      backgroundColor: active ? "rgba(122,154,130,0.08)" : "transparent",
                      border: active ? "1px solid rgba(122,154,130,0.15)" : "1px solid transparent",
                    }}>
                      <span style={{ fontSize: 11, opacity: 0.7 }}>{item.icon}</span>
                      <span style={{ flex: 1 }}>{item.label}</span>
                      {item.badge && (
                        <span style={{
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

        {/* Avatar */}
        <Link href="/dashboard/compte" style={{
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
            fontSize: 11, fontWeight: 700, color: "#7A9A82", flexShrink: 0,
          }}>
            {userName[0].toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
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
      </div>
    </>
  )
}
