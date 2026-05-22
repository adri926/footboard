import { createClient } from "@supabase/supabase-js"

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(URL, KEY)

// ─── Types DB ─────────────────────────────────────────────────

export interface Club {
  id: string
  owner_id: string       // Clerk user ID
  name: string
  logo?: string
  level?: string         // ex: "Régional 1", "Départemental 2"
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
  lineup?: Record<string, { x: number; y: number }>  // playerId → position
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
