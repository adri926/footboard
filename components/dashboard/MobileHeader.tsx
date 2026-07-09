"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { useClerk } from "@clerk/nextjs"
import Logo from "@/components/Logo"

// Le tiroir mobile n'est plus un miroir de la navigation (déjà portée par le bandeau bas
// + le cockpit) : il sert le « compte & réglages » du coach, plus une section « Plus »
// pour les vues secondaires qui ne tiennent pas dans les 5 onglets du bandeau.
interface MenuItem { href: string; label: string; icon: string; external?: boolean }
interface MenuGroup { label: string; items: MenuItem[] }

const MENU_GROUPS: MenuGroup[] = [
  { label: "Compte", items: [
    { href: "/dashboard/compte",     label: "Profil & notifications", icon: "◉" },
    { href: "/dashboard/abonnement", label: "Abonnement",             icon: "◆" },
  ] },
  { label: "Club", items: [
    { href: "/dashboard/effectif/equipes", label: "Équipes",       icon: "◐" },
    { href: "/dashboard/club/equipe",      label: "Staff & rôles", icon: "◈" },
    { href: "/dashboard/club/cotisations", label: "Cotisations",   icon: "◎" },
  ] },
  { label: "Plus", items: [
    { href: "/dashboard/calendrier", label: "Calendrier",   icon: "▦" },
    { href: "/dashboard/data",       label: "Data & stats", icon: "▤" },
    { href: "/tactique/concepts",    label: "Concepts",     icon: "▶" },
  ] },
  { label: "Aide & légal", items: [
    { href: "/mentions-legales", label: "Mentions légales", icon: "·", external: true },
    { href: "/cgu",              label: "CGU",              icon: "·", external: true },
    { href: "/confidentialite",  label: "Confidentialité",  icon: "·", external: true },
  ] },
]

interface Props {
  clubName:  string
  clubLevel: string | null
  userName:  string
}

export default function MobileHeader({ clubName, clubLevel, userName }: Props) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { signOut } = useClerk()

  const [prevPathname, setPrevPathname] = useState(pathname)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    setOpen(false)
  }

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
        <Link href="/dashboard" style={{ textDecoration: "none" }}>
          <Logo size={26} fontSize={15} />
        </Link>
        <button
          onClick={() => setOpen(o => !o)}
          aria-label={open ? "Fermer" : "Compte & réglages"}
          style={{
            backgroundColor: "transparent", borderStyle: "none", cursor: "pointer",
            color: "rgba(255,255,255,0.7)", padding: 2, lineHeight: 1,
            display: "flex", alignItems: "center",
          }}
        >
          {open ? (
            <span style={{ fontSize: 20, padding: "2px 6px" }}>✕</span>
          ) : (
            <span style={{
              width: 30, height: 30, borderRadius: "50%",
              backgroundColor: "rgba(122,154,130,0.15)",
              border: "1px solid rgba(122,154,130,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-mono), monospace", fontSize: 12, fontWeight: 700,
              color: "#7A9A82",
            }}>
              {userName[0]?.toUpperCase() ?? "?"}
            </span>
          )}
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
          <Logo size={22} fontSize={16} />
          <p style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 8, letterSpacing: "0.1em",
            color: "rgba(122,154,130,0.5)", marginTop: 4,
          }}>
            {clubName.toUpperCase()}{clubLevel ? ` — ${clubLevel}` : ""}
          </p>
        </div>

        {/* Compte & réglages */}
        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 24, overflowY: "auto" }}>
          {MENU_GROUPS.map(group => (
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
                  const active = pathname.startsWith(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "7px 10px", borderRadius: 8,
                        fontFamily: "var(--font-body), sans-serif",
                        fontWeight: active ? 500 : 300, fontSize: 13,
                        color: active ? "#7A9A82" : "rgba(255,255,255,0.5)",
                        backgroundColor: active ? "rgba(122,154,130,0.08)" : "transparent",
                        border: active ? "1px solid rgba(122,154,130,0.15)" : "1px solid transparent",
                        textDecoration: "none",
                      }}
                    >
                      <span style={{ fontSize: 11, opacity: 0.7 }}>{item.icon}</span>
                      <span style={{ flex: 1 }}>{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Déconnexion */}
        <button
          onClick={() => signOut({ redirectUrl: "/" })}
          style={{
            display: "flex", alignItems: "center", gap: 8, width: "100%",
            padding: "12px 22px", cursor: "pointer", textAlign: "left",
            borderStyle: "none", borderTop: "1px solid rgba(122,154,130,0.08)",
            backgroundColor: "transparent",
            fontFamily: "var(--font-body), sans-serif", fontSize: 13, fontWeight: 400,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <span style={{ fontSize: 12, opacity: 0.7 }}>⏻</span>
          Se déconnecter
        </button>

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
