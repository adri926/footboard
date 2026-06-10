// Types du module planificateur de séance d'entraînement

export type ExerciseFamily =
  | "activation"
  | "foncier"
  | "technique"
  | "tactique"
  | "jeu_global"

export type ExerciseLevel = "amateur" | "semi_pro" | "les_deux"

export type ExercisePosition = "j+2" | "j+4" | "les_deux"

export type ExerciseIntensity = "faible" | "moderee" | "elevee"

// Format d'animation terrain simplifié pour les exercices (statique, lecture seule)
export interface ExercisePion {
  id: string
  x: number          // 0-100 (% du terrain)
  y: number          // 0-100 (% du terrain)
  team: "A" | "B" | "neutral"
  label: string      // numéro ou initiale
}

export interface ExerciseArrow {
  from: { x: number; y: number }
  to:   { x: number; y: number }
  style?: "solid" | "dashed"
  color?: string
}

export interface ExerciseZone {
  x: number; y: number
  width: number; height: number
  color: string
}

// Étape d'une séquence animée : position de chaque pion (par id) + ballon à ce stade.
// `duration` = temps de transition (ms) depuis l'étape précédente. La 1ère étape (index 0)
// sert d'état de départ, sa `duration` n'est pas utilisée. Pour boucler sans saut visuel,
// la dernière étape doit avoir les mêmes positions que la première.
export interface AnimationKeyframe {
  pions: Record<string, { x: number; y: number }>
  ball?:  { x: number; y: number }                // ballon unique (exercices à 1 ballon)
  balls?: Record<string, { x: number; y: number }> // plusieurs ballons (1 par joueur, etc.)
  duration: number
}

export interface ExerciseAnimation {
  pions:  ExercisePion[]
  arrows: ExerciseArrow[]
  zones?: ExerciseZone[]
  ball?:     { x: number; y: number }              // position initiale du ballon unique
  balls?:    Record<string, { x: number; y: number }> // positions initiales (plusieurs ballons)
  sequence?: AnimationKeyframe[]                   // si présent : animation en boucle (lecture seule)
}

export interface Exercise {
  id:               string
  name:             string
  family:           ExerciseFamily
  defaultDuration:  number          // minutes
  minPlayers:       number
  maxPlayers:       number
  description:      string
  objectives:       string[]
  instructions:     string
  variants:         string[]
  pedagogicNote?:   string          // note ⚠️ affichée dans le modal
  niveau:           ExerciseLevel
  positionSemaine:  ExercisePosition
  intensite:        ExerciseIntensity
  animation:        ExerciseAnimation
}

export type SessionType = "j+2" | "j+4" | "libre"

export interface SessionBlock {
  id:           string
  exerciseId:   string
  exercise:     Exercise
  duration:     number              // minutes (peut différer du defaultDuration)
  order:        number
  customNotes?: string
}

export interface TrainingSession {
  id:            string
  ownerId:       string
  name:          string
  date:          string             // YYYY-MM-DD
  sessionType:   SessionType
  blocks:        SessionBlock[]
  totalDuration: number             // calculé
  playerCount:   number
  notes?:        string
  createdAt:     string
}

export interface MatchContext {
  daysToNext?:    number  // jours avant le prochain match
  daysSinceLast?: number  // jours depuis le dernier match
}

export interface ClubProfile {
  trainingsPerWeek: 2 | 3 | 4
  level: "amateur" | "semi_pro"
}

// Seuils de durée par profil
export const SESSION_DURATION_LIMITS: Record<string, { min: number; max: number; warn: number }> = {
  "amateur_j+2": { min: 60, max: 90,  warn: 85  },
  "amateur_j+4": { min: 45, max: 80,  warn: 75  },
  "amateur_libre": { min: 45, max: 90, warn: 85 },
  "semi_pro_j+2":  { min: 60, max: 110, warn: 105 },
  "semi_pro_j+4":  { min: 45, max: 90,  warn: 85  },
  "semi_pro_libre": { min: 45, max: 110, warn: 105 },
}

export const FAMILY_COLORS: Record<ExerciseFamily, string> = {
  activation: "rgba(122,154,130,0.30)",
  foncier:    "rgba(74,106,138,0.30)",
  technique:  "rgba(138,122,74,0.30)",
  tactique:   "rgba(122,154,130,0.55)",
  jeu_global: "#7A9A82",
}

export const FAMILY_BORDER: Record<ExerciseFamily, string> = {
  activation: "rgba(122,154,130,0.50)",
  foncier:    "rgba(74,106,138,0.50)",
  technique:  "rgba(138,122,74,0.50)",
  tactique:   "rgba(122,154,130,0.70)",
  jeu_global: "#7A9A82",
}

export const FAMILY_TEXT: Record<ExerciseFamily, string> = {
  activation: "#7A9A82",
  foncier:    "#6b9ab8",
  technique:  "#c4b472",
  tactique:   "#7A9A82",
  jeu_global: "#181812",
}

export const FAMILY_LABELS: Record<ExerciseFamily, string> = {
  activation: "Activation",
  foncier:    "Foncier",
  technique:  "Technique",
  tactique:   "Tactique",
  jeu_global: "Jeu Global",
}

export const INTENSITY_LABELS: Record<ExerciseIntensity, string> = {
  faible:   "Faible",
  moderee:  "Modérée",
  elevee:   "Élevée",
}

export const INTENSITY_COLORS: Record<ExerciseIntensity, string> = {
  faible:  "#7A9A82",
  moderee: "#d4a847",
  elevee:  "#e07070",
}

export const POSITION_LABELS: Record<ExercisePosition, string> = {
  "j+2":       "J+2 Récup",
  "j+4":       "J+4 Pré-match",
  "les_deux":  "Universel",
}
