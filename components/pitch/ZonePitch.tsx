"use client"

import Pitch from "./Pitch"
import { PITCH_ZONES, type ZoneId, type PitchZone } from "@/lib/builder"

interface Props {
  selected?: ZoneId | null
  onSelect:  (zone: PitchZone) => void
}

export default function ZonePitch({ selected, onSelect }: Props) {
  return (
    <div className="relative w-full select-none" style={{ aspectRatio: "600/900" }}>
      {/* Terrain */}
      <div className="absolute inset-0">
        <Pitch />
      </div>

      {/* Zones cliquables */}
      {PITCH_ZONES.map(zone => {
        const isSelected = selected === zone.id
        return (
          <button
            key={zone.id}
            onClick={() => onSelect(zone)}
            style={{
              position: "absolute",
              left:   `${zone.x1}%`,
              top:    `${zone.y1}%`,
              width:  `${zone.x2 - zone.x1}%`,
              height: `${zone.y2 - zone.y1}%`,
              backgroundColor: isSelected
                ? "rgba(122,154,130,0.28)"
                : "rgba(122,154,130,0.04)",
              border: isSelected
                ? "2px solid rgba(122,154,130,0.7)"
                : "1px solid rgba(122,154,130,0.15)",
              cursor: "pointer",
              transition: "all 0.18s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 2,
              borderRadius: 4,
            }}
            className="hover:bg-[rgba(122,154,130,0.14)] group"
          >
            {/* Label court */}
            <span style={{
              fontFamily: "var(--font-mono), monospace",
              fontWeight: 700, fontSize: 9, letterSpacing: "0.1em",
              color: isSelected
                ? "rgba(122,154,130,1)"
                : "rgba(122,154,130,0.4)",
              transition: "color 0.18s",
            }}>
              {zone.short}
            </span>
            {/* Label complet au hover/selected */}
            {isSelected && (
              <span style={{
                fontFamily: "var(--font-body), sans-serif",
                fontWeight: 300, fontSize: 8,
                color: "rgba(122,154,130,0.7)",
                textAlign: "center",
                lineHeight: 1.2,
              }}>
                {zone.label}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
