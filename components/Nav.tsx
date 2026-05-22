"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV = [
  {
    section: "Tactique",
    href: "/tactique",
    children: [
      { href: "/tactique/animations", label: "Animations", available: true  },
      { href: "/tactique/concepts",   label: "Concepts",   available: false },
    ],
  },
  {
    section: "Données",
    href: "/data",
    children: [
      { href: "/data",              label: "Tout voir",    available: true  },
      { href: "/data/joueurs",      label: "Joueurs",      available: true  },
      { href: "/data/equipes",      label: "Équipes",      available: true  },
      { href: "/data/comparaisons", label: "Comparaisons", available: false },
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
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        backgroundColor: "rgba(0,0,0,0.5)",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      {/* Logo */}
      <Link href="/" className="text-white font-bold text-sm tracking-wide hover:opacity-75 transition shrink-0">
        ⚽ Tactics Board
      </Link>

      {/* Sections */}
      <nav className="hidden md:flex items-center gap-1 flex-1">
        {NAV.map(({ section, href, children }) => {
          const sectionActive = pathname.startsWith(href)
          return (
            <div key={section} className="relative group">
              {/* Section label */}
              <Link href={href}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1"
                style={{
                  backgroundColor: sectionActive ? "rgba(255,255,255,0.08)" : "transparent",
                  color: sectionActive ? "white" : "rgba(255,255,255,0.45)",
                }}>
                {section}
                <span className="text-[9px] opacity-50">▾</span>
              </Link>

              {/* Dropdown */}
              <div
                className="absolute top-full left-0 mt-1.5 py-1.5 rounded-xl min-w-36 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all"
                style={{
                  backdropFilter: "blur(20px)",
                  backgroundColor: "rgba(0,0,0,0.85)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                }}
              >
                {children.map(({ href: childHref, label, available }) => {
                  const active = pathname === childHref
                  return (
                    <Link key={childHref} href={available ? childHref : "#"}
                      className="flex items-center justify-between px-3 py-2 text-xs transition mx-1 rounded-lg"
                      style={{
                        color: active ? "white" : available ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)",
                        backgroundColor: active ? "rgba(255,255,255,0.08)" : "transparent",
                        pointerEvents: available ? "auto" : "none",
                      }}>
                      {label}
                      {!available && <span className="text-[9px] opacity-40 ml-2">soon</span>}
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* Mon Club */}
      <div className="flex items-center gap-2 ml-auto">
        <Link href="/club"
          className="text-xs px-3 py-1.5 rounded-lg transition font-semibold"
          style={{
            color: pathname.startsWith("/club") ? "white" : "rgba(255,255,255,0.6)",
            backgroundColor: pathname.startsWith("/club") ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)",
            border: pathname.startsWith("/club") ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.1)",
          }}>
          🏟 Mon Club
        </Link>
      </div>
    </header>
  )
}
