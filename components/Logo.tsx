import FootboardMark from "@/components/FootboardMark"

// Logo Footboard unifié = pictogramme (cercle + point, FootboardMark) + wordmark
// bichrome « FOOT » + « BOARD » sauge, dans la police d'origine de l'identité v2 :
// Barlow Condensed 900 (var(--font-display)). Source unique pour tout l'app
// (header app/joueur, marketing, auth, onboarding…) — fini le wordmark recopié à
// la main dans chaque fichier, l'identité évolue désormais d'un seul endroit.
export default function Logo({
  size = 22,
  fontSize = 16,
  showMark = true,
}: {
  size?: number
  fontSize?: number
  showMark?: boolean
}) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      {showMark && <FootboardMark size={size} />}
      <span style={{
        fontFamily: "var(--font-display), system-ui, sans-serif",
        fontWeight: 900, fontSize, letterSpacing: "0.04em", lineHeight: 1,
        color: "rgba(255,255,255,0.95)",
      }}>
        FOOT<span style={{ color: "#7A9A82" }}>BOARD</span>
      </span>
    </span>
  )
}
