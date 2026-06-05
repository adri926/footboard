export const TRAINING_TYPES = [
  { value: "tactique",      label: "Tactique"              },
  { value: "technique",     label: "Technique"             },
  { value: "physique",      label: "Physique"              },
  { value: "cpa",           label: "Coups de pied arrêtés" },
  { value: "recuperation",  label: "Récupération"          },
  { value: "amical",        label: "Match amical"          },
] as const

export type TrainingType = typeof TRAINING_TYPES[number]["value"]
