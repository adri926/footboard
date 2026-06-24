const BG    = "#181812"
const SAUGE = "#7A9A82"
const GLOW  = "#d8e8da"

// Pictogramme Footboard (anneau + ballon) — version DOM du même visuel que
// lib/app-icon.tsx (généré via ImageResponse pour favicon/PWA, non réutilisable
// tel quel en JSX classique). Propriétés CSS en longhand uniquement
// (backgroundColor/borderWidth/borderStyle/borderColor, jamais background/border
// en raccourci) — un raccourci CSS développé en longhands par le navigateur a
// déjà causé deux faux positifs d'hydratation sur ce projet.
export default function FootboardMark({ size = 24 }: { size?: number }) {
  const ring = Math.round(size * 0.62)
  const ball = Math.round(size * 0.16)

  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      display: "flex", alignItems: "center", justifyContent: "center",
      backgroundColor: BG, flexShrink: 0,
    }}>
      <div style={{
        width: ring, height: ring, borderRadius: "50%",
        borderWidth: Math.max(2, Math.round(size * 0.045)),
        borderStyle: "solid", borderColor: SAUGE,
        position: "relative", display: "flex",
      }}>
        <div style={{
          position: "absolute", top: -ball / 2, right: -ball / 2,
          width: ball, height: ball, borderRadius: "50%",
          backgroundColor: GLOW,
          boxShadow: `0 0 ${Math.round(size * 0.18)}px ${Math.round(size * 0.08)}px ${SAUGE}`,
        }} />
      </div>
    </div>
  )
}
