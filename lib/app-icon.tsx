import { ImageResponse } from "next/og"

const BG    = "#181812"
const SAUGE = "#7A9A82"
const GLOW  = "#d8e8da"

export function renderAppIcon(size: number) {
  const ring = Math.round(size * 0.62)
  const ball = Math.round(size * 0.16)

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: BG,
        }}
      >
        <div
          style={{
            width: ring, height: ring, borderRadius: "50%",
            border: `${Math.max(2, Math.round(size * 0.045))}px solid ${SAUGE}`,
            position: "relative",
            display: "flex",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -ball / 2,
              right: -ball / 2,
              width: ball, height: ball, borderRadius: "50%",
              background: GLOW,
              boxShadow: `0 0 ${Math.round(size * 0.18)}px ${Math.round(size * 0.08)}px ${SAUGE}`,
            }}
          />
        </div>
      </div>
    ),
    { width: size, height: size }
  )
}
