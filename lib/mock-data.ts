/* Données mockées — remplacées par Supabase en prod */

export type PlayerStatus = "available" | "injured" | "uncertain"
export type Position = "GK" | "DEF" | "MIL" | "ATT"

export interface MockPlayer {
  id: string
  firstName: string
  lastName: string
  number: number
  position: Position
  status: PlayerStatus
  goals: number
  assists: number
  matchesPlayed: number
  minutesPlayed: number
  injuryNote?: string
}

export interface MockMatch {
  id: string
  opponent: string
  date: string
  homeAway: "home" | "away"
  competition: string
  goalsFor?: number
  goalsAgainst?: number
  formation?: string
}

export interface MockTraining {
  id: string
  date: string
  theme: string
  location: string
  attendees: number
  total: number
}

export const MOCK_PLAYERS: MockPlayer[] = [
  { id: "p1",  firstName: "Lucas",    lastName: "Moreau",    number: 1,  position: "GK",  status: "available", goals: 0, assists: 0, matchesPlayed: 12, minutesPlayed: 1080 },
  { id: "p2",  firstName: "Thomas",   lastName: "Bernard",   number: 2,  position: "DEF", status: "available", goals: 1, assists: 2, matchesPlayed: 11, minutesPlayed: 950 },
  { id: "p3",  firstName: "Antoine",  lastName: "Dupont",    number: 5,  position: "DEF", status: "available", goals: 0, assists: 1, matchesPlayed: 12, minutesPlayed: 1080 },
  { id: "p4",  firstName: "Karim",    lastName: "Diallo",    number: 4,  position: "DEF", status: "injured",   goals: 0, assists: 0, matchesPlayed: 7,  minutesPlayed: 560, injuryNote: "Élongation ischio — retour estimé J+14" },
  { id: "p5",  firstName: "Romain",   lastName: "Petit",     number: 3,  position: "DEF", status: "available", goals: 0, assists: 3, matchesPlayed: 10, minutesPlayed: 880 },
  { id: "p6",  firstName: "Mehdi",    lastName: "Saïd",      number: 6,  position: "MIL", status: "available", goals: 2, assists: 5, matchesPlayed: 12, minutesPlayed: 1020 },
  { id: "p7",  firstName: "Julien",   lastName: "Martin",    number: 8,  position: "MIL", status: "uncertain", goals: 1, assists: 2, matchesPlayed: 9,  minutesPlayed: 756, injuryNote: "Douleur genou — à évaluer à l'entraînement" },
  { id: "p8",  firstName: "Sacha",    lastName: "Leroy",     number: 10, position: "MIL", status: "available", goals: 4, assists: 6, matchesPlayed: 12, minutesPlayed: 1060 },
  { id: "p9",  firstName: "Hugo",     lastName: "Simon",     number: 7,  position: "MIL", status: "available", goals: 3, assists: 1, matchesPlayed: 11, minutesPlayed: 900 },
  { id: "p10", firstName: "Nathan",   lastName: "Richard",   number: 11, position: "ATT", status: "available", goals: 6, assists: 2, matchesPlayed: 12, minutesPlayed: 980 },
  { id: "p11", firstName: "Axel",     lastName: "Fontaine",  number: 9,  position: "ATT", status: "available", goals: 8, assists: 3, matchesPlayed: 12, minutesPlayed: 1040 },
  { id: "p12", firstName: "Damien",   lastName: "Leblanc",   number: 14, position: "ATT", status: "injured",   goals: 2, assists: 1, matchesPlayed: 6,  minutesPlayed: 480, injuryNote: "Fracture métatarse — retour estimé J+30" },
  { id: "p13", firstName: "Pierre",   lastName: "Garnier",   number: 15, position: "DEF", status: "available", goals: 0, assists: 0, matchesPlayed: 5,  minutesPlayed: 320 },
  { id: "p14", firstName: "Théo",     lastName: "Rousseau",  number: 16, position: "GK",  status: "available", goals: 0, assists: 0, matchesPlayed: 0,  minutesPlayed: 0 },
  { id: "p15", firstName: "Clément",  lastName: "Marchand",  number: 17, position: "MIL", status: "available", goals: 1, assists: 0, matchesPlayed: 8,  minutesPlayed: 540 },
  { id: "p16", firstName: "Baptiste", lastName: "Girard",    number: 18, position: "ATT", status: "uncertain", goals: 0, assists: 1, matchesPlayed: 4,  minutesPlayed: 210, injuryNote: "Gêne musculaire — repos préventif" },
]

export const MOCK_MATCHES: MockMatch[] = [
  { id: "m1", opponent: "FC Vincennes",    date: "2026-06-01", homeAway: "home", competition: "Régional 2", goalsFor: undefined, goalsAgainst: undefined },
  { id: "m2", opponent: "US Créteil B",    date: "2026-06-07", homeAway: "away", competition: "Régional 2" },
  { id: "m3", opponent: "Antony FC",       date: "2026-06-14", homeAway: "home", competition: "Régional 2" },
  { id: "m4", opponent: "Massy Essonne",   date: "2026-05-25", homeAway: "away", competition: "Régional 2", goalsFor: 2, goalsAgainst: 1 },
  { id: "m5", opponent: "CS Brétigny",     date: "2026-05-18", homeAway: "home", competition: "Régional 2", goalsFor: 0, goalsAgainst: 0 },
  { id: "m6", opponent: "Épinay FC",       date: "2026-05-11", homeAway: "away", competition: "Régional 2", goalsFor: 3, goalsAgainst: 2 },
]

export const MOCK_TRAININGS: MockTraining[] = [
  { id: "t1", date: "2026-05-28", theme: "Pressing haut — triggers et couvertures", location: "Stade Poincaré", attendees: 15, total: 16 },
  { id: "t2", date: "2026-05-26", theme: "Jeu en transition — contre-attaque rapide",  location: "Stade Poincaré", attendees: 14, total: 16 },
  { id: "t3", date: "2026-05-24", theme: "Séance physique — endurance + VMA",           location: "Stade Poincaré", attendees: 16, total: 16 },
  { id: "t4", date: "2026-05-21", theme: "Coups de pied arrêtés — corners attaque",     location: "Stade Poincaré", attendees: 13, total: 16 },
]

/* ── Helpers ─────────────────────────────────────────────── */
export function getAvailableCount() {
  return MOCK_PLAYERS.filter(p => p.status === "available").length
}
export function getInjuredCount() {
  return MOCK_PLAYERS.filter(p => p.status === "injured").length
}
export function getUncertainCount() {
  return MOCK_PLAYERS.filter(p => p.status === "uncertain").length
}
export function getNextMatch() {
  const today = new Date().toISOString().slice(0, 10)
  return MOCK_MATCHES.find(m => m.date >= today && !m.goalsFor && m.goalsFor !== 0) ?? MOCK_MATCHES[0]
}
export function getMonthTrainings() {
  return MOCK_TRAININGS.length
}
