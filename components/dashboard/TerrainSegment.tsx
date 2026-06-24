import Link from "next/link"

// Segment toujours visible en haut de /dashboard/matchs et /dashboard/entrainements
// — bascule par navigation classique entre les deux routes existantes (pas de fusion
// de leurs composants, qui sont chacun déjà denses et fonctionnellement distincts).
export default function TerrainSegment({ active }: { active: "matchs" | "entrainements" }) {
  return (
    <div style={{
      display: "flex", borderRadius: 8,
      border: "1px solid rgba(122,154,130,0.15)", overflow: "hidden",
      width: "fit-content", marginBottom: 16,
    }}>
      <Link href="/dashboard/matchs" style={{
        padding: "8px 14px", cursor: "pointer", border: "none",
        fontFamily: "var(--font-mono), monospace", textDecoration: "none",
        fontSize: 8, fontWeight: 700, letterSpacing: "0.08em",
        backgroundColor: active === "matchs" ? "rgba(122,154,130,0.15)" : "transparent",
        color: active === "matchs" ? "#7A9A82" : "rgba(255,255,255,0.25)",
      }}>
        MATCHS
      </Link>
      <Link href="/dashboard/entrainements" style={{
        padding: "8px 14px", cursor: "pointer", border: "none",
        fontFamily: "var(--font-mono), monospace", textDecoration: "none",
        fontSize: 8, fontWeight: 700, letterSpacing: "0.08em",
        backgroundColor: active === "entrainements" ? "rgba(122,154,130,0.15)" : "transparent",
        color: active === "entrainements" ? "#7A9A82" : "rgba(255,255,255,0.25)",
      }}>
        ENTRAÎNEMENTS
      </Link>
    </div>
  )
}
