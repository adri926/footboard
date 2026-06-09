import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div style={{
      minHeight: "60vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "64px 32px", textAlign: "center",
    }}>
      <p style={{
        fontFamily: "var(--font-mono), monospace",
        fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
        color: "rgba(122,154,130,0.5)", textTransform: "uppercase", marginBottom: 12,
      }}>
        Erreur 404
      </p>
      <h1 style={{
        fontFamily: "var(--font-display), system-ui, sans-serif",
        fontWeight: 900, fontSize: "clamp(36px, 8vw, 72px)",
        color: "rgba(255,255,255,0.9)", lineHeight: 0.95, marginBottom: 16,
      }}>
        PAGE<br />
        <span style={{ color: "#7A9A82" }}>INTROUVABLE</span>
      </h1>
      <p style={{
        fontFamily: "var(--font-body), sans-serif",
        fontWeight: 400, fontSize: 14,
        color: "rgba(255,255,255,0.3)", marginBottom: 32, maxWidth: 360,
      }}>
        Cette page n'existe pas ou a été déplacée.
      </p>
      <div style={{ display: "flex", gap: 12 }}>
        <Link href="/" style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
          backgroundColor: "#7A9A82", color: "#181812",
          padding: "11px 22px", borderRadius: 8, textDecoration: "none",
        }}>
          ACCUEIL
        </Link>
        <Link href="/dashboard" style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
          color: "#7A9A82",
          backgroundColor: "rgba(122,154,130,0.1)",
          border: "1px solid rgba(122,154,130,0.3)",
          padding: "11px 22px", borderRadius: 8, textDecoration: "none",
        }}>
          MON CLUB →
        </Link>
      </div>
    </div>
  )
}
