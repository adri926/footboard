export type AppelType = "appui" | "profondeur" | "soutien" | "lateral" | "longDeLaLigne"

export interface Appel {
  playerId: string
  type: AppelType
  toX: number
  toY: number
  delay?: number
}

export interface Phase {
  id: string
  label: string       // label court affiché dans la sidebar
  sublabel: string    // terme DTN
  color: string
  dim: string
}

// Libellés affichés dans la légende
export const APPEL_LABELS: Record<AppelType, string> = {
  appui:         "En appui",
  profondeur:    "En profondeur",
  soutien:       "En soutien",
  lateral:       "Latéral",
  longDeLaLigne: "Long de la ligne",
}

export const PHASES: Phase[] = [
  {
    id: "possession",
    label: "Avec le ballon",
    sublabel: "Organisation offensive",
    color: "#4ade80",
    dim: "rgba(74,222,128,0.18)",
  },
  {
    id: "perte",
    label: "À la perte",
    sublabel: "Transition défensive",
    color: "#f87171",
    dim: "rgba(248,113,113,0.18)",
  },
  {
    id: "defense",
    label: "Sans le ballon",
    sublabel: "Organisation défensive",
    color: "#60a5fa",
    dim: "rgba(96,165,250,0.18)",
  },
  {
    id: "recuperation",
    label: "À la récup",
    sublabel: "Transition offensive",
    color: "#fbbf24",
    dim: "rgba(251,191,36,0.18)",
  },
]
