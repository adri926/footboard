import Link from "next/link"

const COLUMNS = [
  {
    title: "Produit",
    links: [
      { label: "Terrain tactique", href: "/tactique/animations", available: true },
      { label: "Mon club",         href: "/club",                available: true },
      { label: "Concepts",         href: "/tactique/concepts",   available: false },
      { label: "Data",             href: "#",                    available: false },
    ],
  },
  {
    title: "Ressources",
    links: [
      { label: "Formations",  href: "/formations", available: true },
      { label: "Animations",  href: "/tactique/animations", available: true },
      { label: "Blog",        href: "#",           available: false },
    ],
  },
  {
    title: "Légal",
    links: [
      { label: "Mentions légales",    href: "#", available: false },
      { label: "Politique de confidentialité", href: "#", available: false },
      { label: "CGU",                 href: "#", available: false },
    ],
  },
]

const SOCIALS = [
  { label: "X",         href: "#" },
  { label: "Instagram", href: "#" },
  { label: "YouTube",   href: "#" },
]

export default function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid rgba(122,154,130,0.12)",
      backgroundColor: "#181812",
      color: "rgba(255,255,255,0.92)",
    }}>
      <div className="max-w-4xl mx-auto px-6 py-14">

        {/* Haut : logo + colonnes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">

          {/* Logo + tagline */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontWeight: 900, fontSize: 20, letterSpacing: "0.05em",
              color: "rgba(255,255,255,0.95)",
            }}>
              FOOTBOARD
            </Link>
            <p style={{
              fontFamily: "var(--font-body), sans-serif",
              fontWeight: 300, fontSize: 13, lineHeight: 1.6,
              color: "rgba(255,255,255,0.35)", marginTop: 10, maxWidth: 180,
            }}>
              La plateforme tactique pour les coaches.
            </p>
          </div>

          {/* Colonnes */}
          {COLUMNS.map(({ title, links }) => (
            <div key={title}>
              <p style={{
                fontFamily: "var(--font-mono), monospace",
                fontWeight: 700, fontSize: 9, letterSpacing: "0.14em",
                color: "#7A9A82", marginBottom: 14, textTransform: "uppercase",
              }}>
                {title}
              </p>
              <ul className="flex flex-col gap-2.5">
                {links.map(({ label, href, available }) => (
                  <li key={label}>
                    <Link href={available ? href : "#"}
                      style={{
                        fontFamily: "var(--font-body), sans-serif",
                        fontWeight: 300, fontSize: 13,
                        color: available ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)",
                        pointerEvents: available ? "auto" : "none",
                        display: "flex", alignItems: "center", gap: 6,
                      }}
                      className={available ? "hover:text-white transition" : ""}>
                      {label}
                      {!available && (
                        <span style={{
                          fontFamily: "var(--font-mono), monospace",
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
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bas : réseaux + copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6"
          style={{ borderTop: "1px solid rgba(122,154,130,0.08)" }}>

          <div className="flex gap-4">
            {SOCIALS.map(({ label, href }) => (
              <Link key={label} href={href}
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontWeight: 700, fontSize: 9, letterSpacing: "0.1em",
                  color: "rgba(122,154,130,0.45)",
                }}
                className="hover:text-[#7A9A82] transition">
                {label.toUpperCase()}
              </Link>
            ))}
          </div>

          <p style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 9, letterSpacing: "0.08em",
            color: "rgba(255,255,255,0.2)",
          }}>
            © FOOTBOARD 2026 — TOUS DROITS RÉSERVÉS
          </p>
        </div>

      </div>
    </footer>
  )
}
