import type { Player, Team } from "./data"

const BASE  = "https://api.football-data.org/v4"
const TOKEN = process.env.FOOTBALL_DATA_TOKEN

export function hasToken(): boolean {
  return !!TOKEN && TOKEN.length > 5
}

// Codes des compétitions (plan gratuit)
export const COMPETITION_CODES: Record<string, string> = {
  "Premier League": "PL",
  "Liga":           "PD",
  "Bundesliga":     "BL1",
  "Serie A":        "SA",
  "Ligue 1":        "FL1",
}

export const LEAGUE_FLAGS: Record<string, string> = {
  "Premier League": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "Liga":           "🇪🇸",
  "Bundesliga":     "🇩🇪",
  "Serie A":        "🇮🇹",
  "Ligue 1":        "🇫🇷",
}

function headers() {
  return { "X-Auth-Token": TOKEN! }
}

// ─── Forme : "W W D L W" → ["V","V","N","D","V"] ─────────────
function parseForm(form: string | null): string[] {
  if (!form) return []
  return form.trim().split(/\s+/).slice(-5).map(r =>
    r === "W" ? "V" : r === "D" ? "N" : "D"
  )
}

// ─── Classements ──────────────────────────────────────────────

export async function fetchStandings(ligue: string): Promise<Team[]> {
  const code = COMPETITION_CODES[ligue]
  if (!code) return []

  const res = await fetch(
    `${BASE}/competitions/${code}/standings`,
    { headers: headers(), next: { revalidate: 3600 } } // cache 1h
  )

  if (!res.ok) throw new Error(`football-data standings ${code}: ${res.status}`)
  const json = await res.json()

  // On prend le tableau TOTAL (pas HOME/AWAY)
  const table = json.standings?.find((s: any) => s.type === "TOTAL")?.table ?? []

  return table.map((e: any): Team => ({
    pos:  e.position,
    club: e.team.name.replace(" FC", "").replace(" CF", ""),
    pays: LEAGUE_FLAGS[ligue] ?? "🌍",
    mj:   e.playedGames,
    v:    e.won,
    n:    e.draw,
    d:    e.lost,
    bp:   e.goalsFor,
    bc:   e.goalsAgainst,
    pts:  e.points,
    forme: parseForm(e.form),
    xg:   0,
    xgc:  0,
    poss: 0,
  }))
}

// ─── Buteurs / Meilleurs passeurs ─────────────────────────────

const POS_MAP: Record<string, string> = {
  OFFENCE:   "ATT",
  MIDFIELD:  "MIL",
  DEFENCE:   "DEF",
  GOALKEEPER:"GK",
}

const NAT_MAP: Record<string, string> = {
  France:"🇫🇷", England:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", Spain:"🇪🇸", Brazil:"🇧🇷",
  Germany:"🇩🇪", Portugal:"🇵🇹", Italy:"🇮🇹", Argentina:"🇦🇷",
  Netherlands:"🇳🇱", Belgium:"🇧🇪", Norway:"🇳🇴", Croatia:"🇭🇷",
  Poland:"🇵🇱", Uruguay:"🇺🇾", Colombia:"🇨🇴", Morocco:"🇲🇦",
  Senegal:"🇸🇳", Egypt:"🇪🇬", Nigeria:"🇳🇬", Canada:"🇨🇦",
  "Korea, South":"🇰🇷", Japan:"🇯🇵", Serbia:"🇷🇸", Switzerland:"🇨🇭",
  Austria:"🇦🇹", Sweden:"🇸🇪", Denmark:"🇩🇰", Slovenia:"🇸🇮",
  Georgia:"🇬🇪", Gabon:"🇬🇦", Slovakia:"🇸🇰", Hungary:"🇭🇺",
  Algeria:"🇩🇿", Tunisia:"🇹🇳", "Ivory Coast":"🇨🇮", Ghana:"🇬🇭",
  Mali:"🇲🇱", Ecuador:"🇪🇨", Mexico:"🇲🇽", "United States":"🇺🇸",
  Australia:"🇦🇺", Ukraine:"🇺🇦", Ireland:"🇮🇪", Scotland:"🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  Wales:"🏴󠁧󠁢󠁷󠁬󠁳󠁿", Cameroon:"🇨🇲", "DR Congo":"🇨🇩", Guinea:"🇬🇳",
  Mozambique:"🇲🇿", Kosovo:"🇽🇰", Albania:"🇦🇱", Armenia:"🇦🇲",
  "Czech Republic":"🇨🇿", Finland:"🇫🇮", Jamaica:"🇯🇲", "New Zealand":"🇳🇿",
  "Burkina Faso":"🇧🇫",
}

// ─── Effectifs complets par équipe ────────────────────────────

export interface LivePlayer {
  id: number; name: string; position: string
  nationality: string; nat: string; dateOfBirth: string; age: number
}

export interface LiveTeam {
  id: number; name: string; shortName: string
  crest: string; squad: LivePlayer[]
}

function calcAge(dob: string): number {
  if (!dob) return 0
  return Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 3600 * 1000))
}

export async function fetchSquads(ligue: string): Promise<LiveTeam[]> {
  const code = COMPETITION_CODES[ligue]
  if (!code) return []

  const res = await fetch(
    `${BASE}/competitions/${code}/teams`,
    { headers: headers(), next: { revalidate: 86400 } } // cache 24h
  )

  if (!res.ok) throw new Error(`football-data teams ${code}: ${res.status}`)
  const json = await res.json()

  return (json.teams ?? []).map((t: any): LiveTeam => ({
    id:        t.id,
    name:      t.name.replace(" FC","").replace(" CF",""),
    shortName: t.shortName ?? t.tla ?? t.name,
    crest:     t.crest ?? "",
    squad: (t.squad ?? []).map((p: any): LivePlayer => ({
      id:          p.id,
      name:        p.name,
      position:    POS_MAP[p.position] ?? p.position ?? "MIL",
      nationality: p.nationality ?? "",
      nat:         NAT_MAP[p.nationality] ?? "🌍",
      dateOfBirth: p.dateOfBirth ?? "",
      age:         calcAge(p.dateOfBirth),
    })).sort((a: LivePlayer, b: LivePlayer) => {
      const order = { GK:0, DEF:1, MIL:2, ATT:3 }
      return (order[a.position as keyof typeof order]??9) - (order[b.position as keyof typeof order]??9)
    }),
  }))
}

export async function fetchScorers(ligue: string, limit = 30): Promise<Player[]> {
  const code = COMPETITION_CODES[ligue]
  if (!code) return []

  const res = await fetch(
    `${BASE}/competitions/${code}/scorers?limit=${limit}`,
    { headers: headers(), next: { revalidate: 3600 } }
  )

  if (!res.ok) throw new Error(`football-data scorers ${code}: ${res.status}`)
  const json = await res.json()

  return (json.scorers ?? []).map((entry: any): Player => {
    const pl = entry.player
    const stat = entry

    return {
      nom:         pl.name,
      club:        (entry.team?.name ?? "").replace(" FC","").replace(" CF",""),
      ligue,
      poste:       POS_MAP[pl.position] ?? "MIL",
      nat:         NAT_MAP[pl.nationality] ?? "🌍",
      mj:          stat.playedMatches ?? 0,
      min:         (stat.playedMatches ?? 0) * 85,
      buts:        stat.goals ?? 0,
      passes:      stat.assists ?? 0,
      xg:          0,
      xa:          0,
      tirs90:      0,
      passes_pct:  0,
      dribbles:    0,
      dist:        0,
    }
  })
}
