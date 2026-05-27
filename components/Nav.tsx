"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV = [
  {
    label: "Mon Club",
    href: "/club",
    children: [
      { href: "/club",              label: "Tableau de bord", available: true  },
      { href: "/club/effectif",     label: "Effectif",        available: true  },
      { href: "/club/entrainements",label: "Entraînements",   available: true  },
      { href: "/club/matchs",       label: "Matchs",          available: true  },
      { href: "/club/stats",        label: "Statistiques",    available: true  },
    ],
  },
  {
    label: "Tactique",
    href: "/tactique",
    children: [
      { href: "/tactique/creer",          label: "Créer une situation", available: true  },
      { href: "/tactique/mes-situations", label: "Mes situations",      available: true  },
    ],
  },
]

const HIDE_ON = ["/tactique/animations"]

export default function Nav() {
  const pathname = usePathname()
  if (HIDE_ON.includes(pathname)) return null

  return (
    <header
      className="sticky top-0 z-50 flex items-center gap-6 px-6 h-14 border-b"
      style={{
        backgroundColor: "rgba(24,24,18,0.94)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderColor: "rgba(122,154,130,0.12)",
      }}
    >
      {/* Logo */}
      <Link href="/"
        className="shrink-0 hover:opacity-70 transition"
        style={{
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontWeight: 900, fontSize: 18, letterSpacing: "0.05em",
          color: "rgba(255,255,255,0.95)",
        }}>
        FOOTBOARD
      </Link>

      {/* Nav principale */}
      <nav className="hidden md:flex items-center gap-1 flex-1">
        {NAV.map(({ label, href, children }) => {
          const active = pathname.startsWith(href)
          return (
            <div key={href} className="relative group">
              {/* Bouton section */}
              <Link href={href}
                className="px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1"
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontWeight: 700, letterSpacing: "0.06em",
                  backgroundColor: active ? "var(--sauge-dim)" : "transparent",
                  color: active ? "var(--sauge)" : "var(--text-muted)",
                  border: active ? "1px solid var(--sauge-border)" : "1px solid transparent",
                }}>
                {label.toUpperCase()}
                <span className="text-[9px] opacity-40">▾</span>
              </Link>

              {/* Dropdown */}
              <div
                className="absolute top-full left-0 mt-1.5 py-1.5 rounded-xl min-w-44 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all"
                style={{
                  backgroundColor: "var(--bg-card-hi)",
                  border: "1px solid rgba(122,154,130,0.18)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                }}
              >
                {children.map(({ href: childHref, label: childLabel, available }) => (
                  <Link key={childHref}
                    href={available ? childHref : "#"}
                    className="flex items-center justify-between px-3 py-2 text-xs transition mx-1 rounded-lg"
                    style={{
                      fontFamily: "var(--font-mono), monospace",
                      letterSpacing: "0.04em",
                      color: pathname === childHref
                        ? "var(--sauge)"
                        : available ? "var(--text-primary)" : "var(--text-faint)",
                      backgroundColor: pathname === childHref ? "var(--sauge-dim)" : "transparent",
                      pointerEvents: available ? "auto" : "none",
                    }}>
                    {childLabel.toUpperCase()}
                    {!available && (
                      <span style={{
                        fontSize: 8, letterSpacing: "0.08em",
                        backgroundColor: "rgba(122,154,130,0.08)",
                        border: "1px solid rgba(122,154,130,0.15)",
                        color: "rgba(122,154,130,0.4)",
                        padding: "1px 5px", borderRadius: 100,
                      }}>
                        BIENTÔT
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </nav>

      {/* CTA Mon Club */}
      <div className="ml-auto">
        <Link href="/club"
          className="text-xs px-4 py-1.5 rounded-lg transition"
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontWeight: 700, letterSpacing: "0.06em",
            color: pathname.startsWith("/club") ? "#181812" : "var(--sauge)",
            backgroundColor: pathname.startsWith("/club") ? "var(--sauge)" : "transparent",
            border: "1px solid var(--sauge-border)",
          }}>
          MON CLUB →
        </Link>
      </div>
    </header>
  )
}
