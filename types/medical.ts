// Types du module Suivi médical — structure pensée pour mapper
// directement vers de futures tables Supabase (medical_records,
// injuries, training_loads).

// Reflète directement le statut réel du joueur (table `players`,
// modifiable depuis l'effectif) — disponible/blessé/incertain.
export type PlayerMedicalStatus = "disponible" | "incertain" | "blesse"

export interface Injury {
  id: string
  playerId: string
  type: string        // ex: "Élongation", "Entorse", "Fracture"
  bodyZone: string    // ex: "Ischio-jambier droit", "Cheville gauche"
  startDate: string   // ISO date
  endDate: string | null // null = blessure en cours
  notes: string
}

export interface TrainingLoad {
  playerId: string
  week: string        // ISO date du lundi de la semaine, ex: "2026-04-13"
  load: number        // charge perçue (RPE × durée), échelle 0-1000
  sessionsCount: number
  minutesTotal: number
}

export interface MedicalRecord {
  playerId: string
  status: PlayerMedicalStatus
  returnDate: string | null // date de retour estimée (si blessé/incertain/reprise)
  injuries: Injury[]
  loads: TrainingLoad[]
  notes: string
}
