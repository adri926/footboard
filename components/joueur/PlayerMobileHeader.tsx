"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

const NAV_ITEMS = [
  { href: "/joueur",              label: "Calendrier",      icon: "▦" },
  { href: "/joueur/entrainements", label: "Entraînements",  icon: "◈" },
  { href: "/joueur/matchs",        label: "Matchs",          icon: "◷" },
  { href: "/joueur/stats",         label: "Mes statistiques", icon: "▤" },
]

interface Props {
  clubName:   string
  playerName: string
}

export default function PlayerMobileHeader({ clubName, playerName }: Props) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <>
      <style>{`
        .pmh-bar { display: none !important; }
        .pmh-pad { display: none; }
        @media (max-width: 767px) {
          .pmh-bar { display: flex !important; }
          .pmh-pad { display: block; height: 56px; }
        }
      `}</style>

      <header className="pmh-bar" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        height: 56, backgroundColor: "var(--bg)",
        borderBottom: "1px solid rgba(122,154,130,0.1)",
        alignItems: "center", justifyContent: "space-between",
        padding: "0 16px",
      }}>
        <span style={{
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontWeight: 900, fontSize: 15, letterSpacing: "0.06em",
          color: "rgba(255,255,255,0.95)",
        }}>
          FOOTBOARD
        </span>
        <button
          onClick={() => setOpen(o => !o)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(255,255,255,0.7)", fontSize: 20, padding: "4px 8px",
            lineHeight: 1,
          }}
        >
          {open ? "✕" : "☰"}
        </button>
      </header>

      <div className="pmh-pad" />

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

      <div style={{
        position: "fixed", top: 0, left: 0, bottom: 0,
        width: 240, zIndex: 60,
        backgroundColor: "var(--bg)",
        borderRight: "1px solid rgba(122,154,130,0.15)",
        display: "flex", flexDirection: "column", overflowY: "auto",
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.25s ease",
      }}>
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(122,154,130,0.08)" }}>
          <p style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontWeight: 900, fontSize: 16, letterSpacing: "0.06em",
            color: "rgba(255,255,255,0.95)",
          }}>
            FOOTBOARD
          </p>
          <p style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 8, letterSpacing: "0.1em",
            color: "rgba(122,154,130,0.5)", marginTop: 4,
          }}>
            {clubName.toUpperCase()}
          </p>
        </div>

        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto" }}>
          {NAV_ITEMS.map(item => {
            const active = item.href === "/joueur"
              ? pathname === "/joueur"
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
                {item.label}
              </Link>
            )
          })}
        </nav>

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
            fontSize: 11, fontWeight: 700, color: "#7A9A82", flexShrink: 0,
          }}>
            {playerName[0].toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
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
      </div>
    </>
  )
}
