// Données mockées du module Suivi médical — 15 joueurs fictifs avec
// statuts, historiques de blessures et charges d'entraînement réalistes.
// À remplacer par des requêtes Supabase une fois les tables créées.

import type { Injury, MedicalRecord, PlayerMedicalStatus, TrainingLoad } from "@/types/medical"

export interface MockPlayer {
  id: string
  name: string
  number: number
  position: "GK" | "DEF" | "MIL" | "ATT"
}

export const MOCK_PLAYERS: MockPlayer[] = [
  { id: "p01", name: "Lucas Bernard",   number: 1,  position: "GK"  },
  { id: "p02", name: "Karim Haddad",    number: 2,  position: "DEF" },
  { id: "p03", name: "Théo Lefebvre",   number: 3,  position: "DEF" },
  { id: "p04", name: "Noah Girard",     number: 4,  position: "DEF" },
  { id: "p05", name: "Yanis Moreau",    number: 5,  position: "DEF" },
  { id: "p06", name: "Hugo Lambert",    number: 6,  position: "MIL" },
  { id: "p07", name: "Adam Roussel",    number: 7,  position: "MIL" },
  { id: "p08", name: "Enzo Faure",      number: 8,  position: "MIL" },
  { id: "p09", name: "Rayan Dubois",    number: 9,  position: "ATT" },
  { id: "p10", name: "Mathis Picard",   number: 10, position: "ATT" },
  { id: "p11", name: "Sacha Renault",   number: 11, position: "ATT" },
  { id: "p12", name: "Léo Marchand",    number: 12, position: "GK"  },
  { id: "p13", name: "Nathan Garcia",   number: 14, position: "MIL" },
  { id: "p14", name: "Ilyes Benamar",   number: 16, position: "DEF" },
  { id: "p15", name: "Tom Lacroix",     number: 17, position: "ATT" },
]

// Une semaine = lundi au format ISO. Génère les 8 dernières semaines glissantes.
function lastWeeks(count: number): string[] {
  const weeks: string[] = []
  const now = new Date("2026-06-01") // ancrage stable pour des données reproductibles
  const day = now.getDay() || 7
  const monday = new Date(now)
  monday.setDate(now.getDate() - day + 1)
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(monday)
    d.setDate(monday.getDate() - i * 7)
    weeks.push(d.toISOString().slice(0, 10))
  }
  return weeks
}

const WEEKS = lastWeeks(8)

// Génère une charge d'entraînement plausible, avec une légère baisse pour
// les joueurs blessés ou en reprise.
function buildLoads(playerId: string, status: PlayerMedicalStatus, seed: number): TrainingLoad[] {
  return WEEKS.map((week, i) => {
    const base = 480 + ((seed * 37 + i * 53) % 220) // variation pseudo-aléatoire stable
    const reduced = (status === "blesse" || status === "reprise") && i >= 5
    const load = reduced ? Math.round(base * 0.4) : base
    const sessionsCount = reduced ? 2 : 4 + (i % 2)
    const minutesTotal = reduced ? load : load + 60
    return { playerId, week, load, sessionsCount, minutesTotal }
  })
}

const INJURY_TYPES: { type: string; zones: string[] }[] = [
  { type: "Élongation",       zones: ["Ischio-jambier droit", "Ischio-jambier gauche", "Mollet droit"] },
  { type: "Entorse",          zones: ["Cheville gauche", "Cheville droite", "Genou droit"] },
  { type: "Contusion",        zones: ["Cuisse gauche", "Hanche droite"] },
  { type: "Tendinite",        zones: ["Genou gauche", "Talon d'Achille droit"] },
  { type: "Fracture de fatigue", zones: ["Métatarse droit"] },
]

function buildInjuries(playerId: string, seed: number, count: number, ongoing: boolean): Injury[] {
  const injuries: Injury[] = []
  for (let i = 0; i < count; i++) {
    const def = INJURY_TYPES[(seed + i) % INJURY_TYPES.length]
    const zone = def.zones[(seed * 3 + i) % def.zones.length]
    const monthsAgo = (count - i) * 3 + (seed % 4)
    const start = new Date("2026-06-01")
    start.setMonth(start.getMonth() - monthsAgo)
    const durationDays = 10 + ((seed * 17 + i * 11) % 35)
    const end = new Date(start)
    end.setDate(start.getDate() + durationDays)
    const isLast = i === count - 1
    injuries.push({
      id: `${playerId}-inj-${i + 1}`,
      playerId,
      type: def.type,
      bodyZone: zone,
      startDate: start.toISOString().slice(0, 10),
      endDate: isLast && ongoing ? null : end.toISOString().slice(0, 10),
      notes: isLast && ongoing
        ? "Suivi en cours avec le kiné — reprise progressive de la charge."
        : "Reprise complète validée par le staff médical.",
    })
  }
  return injuries
}

// Statuts répartis sur les 15 joueurs : majorité disponible, quelques cas
// de blessure / incertitude / reprise pour rendre la vue d'ensemble réaliste.
const STATUS_PLAN: { status: PlayerMedicalStatus; returnDate: string | null; injuryCount: number; notes: string }[] = [
  { status: "disponible", returnDate: null,         injuryCount: 0, notes: "RAS — aucune restriction." },
  { status: "disponible", returnDate: null,         injuryCount: 1, notes: "RAS — bilan post-saison dernière prévu en juillet." },
  { status: "blesse",     returnDate: "2026-06-21", injuryCount: 2, notes: "Suit un protocole de renforcement spécifique avant retour à l'entraînement collectif." },
  { status: "disponible", returnDate: null,         injuryCount: 1, notes: "RAS." },
  { status: "incertain",  returnDate: "2026-06-12", injuryCount: 1, notes: "Gêne légère ressentie à l'entraînement de mardi — réévaluation avant le prochain match." },
  { status: "disponible", returnDate: null,         injuryCount: 0, notes: "RAS — aucun antécédent cette saison." },
  { status: "reprise",    returnDate: "2026-06-08", injuryCount: 2, notes: "Reprise individualisée encadrée par le préparateur physique, charge progressive." },
  { status: "disponible", returnDate: null,         injuryCount: 1, notes: "RAS." },
  { status: "disponible", returnDate: null,         injuryCount: 0, notes: "RAS." },
  { status: "blesse",     returnDate: "2026-07-02", injuryCount: 3, notes: "Indisponibilité longue durée — passage à l'IRM prévu cette semaine pour confirmer le délai." },
  { status: "disponible", returnDate: null,         injuryCount: 1, notes: "RAS." },
  { status: "disponible", returnDate: null,         injuryCount: 0, notes: "RAS — doublure gardien, faible volume de jeu." },
  { status: "incertain",  returnDate: "2026-06-10", injuryCount: 1, notes: "Douleur au dos signalée après le dernier match — surveillance rapprochée." },
  { status: "disponible", returnDate: null,         injuryCount: 1, notes: "RAS." },
  { status: "reprise",    returnDate: "2026-06-09", injuryCount: 1, notes: "Dernière séance individuelle avant réintégration au groupe." },
]

export const MEDICAL_RECORDS: MedicalRecord[] = MOCK_PLAYERS.map((player, i) => {
  const plan = STATUS_PLAN[i]
  const ongoing = plan.status === "blesse" || plan.status === "reprise"
  return {
    playerId: player.id,
    status: plan.status,
    returnDate: plan.returnDate,
    injuries: buildInjuries(player.id, i + 1, plan.injuryCount, ongoing),
    loads: buildLoads(player.id, plan.status, i + 1),
    notes: plan.notes,
  }
})

// Prochain match mocké — sert uniquement à illustrer l'alerte "joueurs
// indisponibles avant match" sans dépendre du calendrier réel (Supabase).
export const MOCK_NEXT_MATCH = {
  opponent: "FC Belleville",
  date: "2026-06-13",
}

export function getMedicalRecord(playerId: string): MedicalRecord | undefined {
  return MEDICAL_RECORDS.find(r => r.playerId === playerId)
}

export function getPlayerName(playerId: string): string {
  return MOCK_PLAYERS.find(p => p.id === playerId)?.name ?? "Joueur inconnu"
}
