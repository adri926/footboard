// Suivi médical — pas encore de table Supabase dédiée (medical_records,
// injuries, training_loads). En attendant, on construit les fiches à partir
// des seules données médicales réelles déjà présentes sur la fiche joueur
// (`players.status` et `players.injury_note`, modifiables depuis l'effectif).
// Historique de blessures et charge d'entraînement restent vides tant que
// ces tables n'existent pas — à remplacer par de vraies requêtes ensuite.

import type { Player } from "@/app/dashboard/effectif/actions"
import type { MedicalRecord, PlayerMedicalStatus } from "@/types/medical"

const STATUS_MAP: Record<Player["status"], PlayerMedicalStatus> = {
  available: "disponible",
  injured:   "blesse",
  uncertain: "incertain",
}

export function buildMedicalRecords(players: Player[]): MedicalRecord[] {
  return players.map(player => ({
    playerId: player.id,
    status: STATUS_MAP[player.status],
    returnDate: null,
    injuries: [],
    loads: [],
    notes: player.injury_note ?? "",
  }))
}

export function getMedicalRecord(records: MedicalRecord[], playerId: string): MedicalRecord | undefined {
  return records.find(r => r.playerId === playerId)
}
