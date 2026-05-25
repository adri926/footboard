import { createClient } from "@supabase/supabase-js"

const URL          = process.env.NEXT_PUBLIC_SUPABASE_URL!
const ANON_KEY     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY

// Client serveur (bypasse RLS, sécurité gérée par Clerk + filtres owner_id)
// Si la service_role key n'est pas définie, retombe sur l'anon key
export const supabase = createClient(
  URL,
  SERVICE_KEY ?? ANON_KEY,
  { auth: { persistSession: false } }
)

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
