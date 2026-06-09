"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV = [
  {
    label: "Mon Club",
    href: "/dashboard",
    children: [
      { href: "/dashboard",               label: "Tableau de bord", available: true  },
      { href: "/dashboard/effectif",      label: "Effectif",        available: true  },
      { href: "/dashboard/matchs",        label: "Matchs",          available: true  },
      { href: "/dashboard/entrainements", label: "Entraînements",   available: true  },
      { href: "/dashboard/joueurs",       label: "Joueurs",         available: true  },
    ],
  },
  {
    label: "Tactique",
    href: "/tactique",
    children: [
      { href: "/tactique/digiboard",       label: "Digiboard",           available: true  },
      { href: "/tactique/creer",          label: "Créer une situation", available: true  },
      { href: "/tactique/mes-situations", label: "Mes situations",      available: true  },
      { href: "/tactique/concepts",       label: "Concepts",            available: true  },
    ],
  },
  { label: "Blog",   href: "#", children: [], soon: true },
  { label: "Tarifs", href: "/#tarifs", children: [] },
]

const HIDE_ON = ["/tactique/digiboard"]

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
        {NAV.map(({ label, href, children, soon }) => {
          const active = href !== "#" && href !== "/#tarifs" && pathname.startsWith(href)
          const hasDropdown = children.length > 0

          return (
            <div key={label} className="relative group">
              <Link href={href}
                className="px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1.5"
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontWeight: 700, letterSpacing: "0.06em",
                  backgroundColor: active ? "var(--sauge-dim)" : "transparent",
                  color: active ? "var(--sauge)" : "var(--text-muted)",
                  border: active ? "1px solid var(--sauge-border)" : "1px solid transparent",
                }}>
                {label.toUpperCase()}
                {soon && (
                  <span style={{
                    fontSize: 7, letterSpacing: "0.08em",
                    backgroundColor: "rgba(122,154,130,0.08)",
                    border: "1px solid rgba(122,154,130,0.2)",
                    color: "rgba(122,154,130,0.5)",
                    padding: "1px 4px", borderRadius: 100,
                  }}>BIENTÔT</span>
                )}
                {hasDropdown && <span className="text-[9px] opacity-40">▾</span>}
              </Link>

              {hasDropdown && (
                <div
                  className="absolute top-full left-0 mt-1.5 py-1.5 rounded-xl min-w-48 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all"
                  style={{
                    backgroundColor: "var(--bg-card-hi)",
                    border: "1px solid rgba(122,154,130,0.18)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                  }}
                >
                  {children.map(({ href: ch, label: cl, available }) => (
                    <Link key={ch} href={available ? ch : "#"}
                      className="flex items-center justify-between px-3 py-2 text-xs transition mx-1 rounded-lg"
                      style={{
                        fontFamily: "var(--font-mono), monospace",
                        letterSpacing: "0.04em",
                        color: pathname === ch ? "var(--sauge)" : available ? "var(--text-primary)" : "var(--text-faint)",
                        backgroundColor: pathname === ch ? "var(--sauge-dim)" : "transparent",
                        pointerEvents: available ? "auto" : "none",
                      }}>
                      {cl.toUpperCase()}
                      {!available && (
                        <span style={{
                          fontSize: 7, backgroundColor: "rgba(122,154,130,0.08)",
                          border: "1px solid rgba(122,154,130,0.15)",
                          color: "rgba(122,154,130,0.4)",
                          padding: "1px 5px", borderRadius: 100,
                        }}>BIENTÔT</span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* CTA */}
      {!pathname.startsWith("/dashboard") && (
        <div className="ml-auto">
          <Link href="/dashboard"
            className="text-xs px-4 py-1.5 rounded-lg transition"
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontWeight: 700, letterSpacing: "0.06em",
              color: "var(--sauge)",
              backgroundColor: "transparent",
              border: "1px solid var(--sauge-border)",
            }}>
            MON CLUB →
          </Link>
        </div>
      )}
    </header>
  )
}
