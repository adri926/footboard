import { createClient } from "@supabase/supabase-js"

// Ne pas throw au chargement du module : `next build` évalue les modules ("collecting page
// data") sans les secrets runtime → un throw casse le build et la CI. createClient avec des
// valeurs vides ne lève rien à la construction (seulement à l'usage réel). En prod, les
// variables d'environnement sont fournies par l'hébergeur.
// Placeholders non-vides : createClient() lève "supabaseUrl/Key is required" sur valeur vide.
// Au build (sans secrets) on veut juste que l'évaluation du module réussisse ; en prod les
// vraies variables sont fournies par l'hébergeur.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:54321"
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY || "build-placeholder-key"

// Client serveur uniquement — service_role key (jamais exposée côté client).
// Chaque action vérifie auth() Clerk AVANT d'appeler ce client.
export const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
})

// ─── Types DB ─────────────────────────────────────────────────

export interface Club {
  id: string
  owner_id: string
  name: string
  logo?: string
  level?: string
  city?: string
  created_at: string
}

export interface ClubPlayer {
  id: string
  club_id: string
  first_name: string
  last_name: string
  position: "GK" | "DEF" | "MIL" | "ATT"
  number?: number
  photo?: string
  status: "available" | "injured" | "suspended"
  birth_date?: string
  email?: string
  phone?: string
  created_at: string
}

export interface Training {
  id: string
  club_id: string
  date: string
  location?: string
  theme?: string
  notes?: string
  created_at: string
}

export interface TrainingAttendance {
  id: string
  training_id: string
  player_id: string
  status: "present" | "absent" | "late" | "excused"
}

export interface Match {
  id: string
  club_id: string
  date: string
  opponent: string
  home_away: "home" | "away"
  competition?: string
  goals_for?: number
  goals_against?: number
  notes?: string
  lineup?: Record<string, { x: number; y: number }>
  formation?: string
  created_at: string
}

export interface MatchStat {
  id: string
  match_id: string
  player_id: string
  goals: number
  assists: number
  yellow_cards: number
  red_cards: number
  minutes_played: number
}
