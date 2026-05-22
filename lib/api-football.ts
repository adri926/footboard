import type { Player, Team } from "./data"

const BASE   = "https://v3.football.api-sports.io"
const KEY    = process.env.API_FOOTBALL_KEY
const SEASON = process.env.API_FOOTBALL_SEASON ?? "2024"

export const LEAGUE_IDS: Record<string, number> = {
  "Premier League": 39,
  "Liga":           140,
  "Ligue 1":        61,
  "Serie A":        135,
  "Bundesliga":     78,
}

export const LEAGUE_FLAGS: Record<string, string> = {
  "Premier League": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "Liga":           "🇪🇸",
  "Ligue 1":        "🇫🇷",
  "Serie A":        "🇮🇹",
  "Bundesliga":     "🇩🇪",
}

function headers() {
  return { "x-apisports-key": KEY! }
}

export function hasKey(): boolean {
  return !!KEY && KEY.length > 5
}

// ─── Classements ──────────────────────────────────────────────

export async function fetchStandings(ligue: string): Promise<Team[]> {
  const leagueId = LEAGUE_IDS[ligue]
  if (!leagueId) return []

  const res = await fetch(
    `${BASE}/standings?league=${leagueId}&season=${SEASON}`,
    { headers: headers(), next: { revalidate: 86400 } }
  )

  if (!res.ok) throw new Error(`API-Football standings: ${res.status}`)
  const json = await res.json()

  const standings = json?.response?.[0]?.league?.standings?.[0] ?? []

  return standings.map((e: any): Team => ({
    pos:  e.rank,
    club: e.team.name,
    pays: LEAGUE_FLAGS[ligue] ?? "🌍",
    mj:   e.all.played,
    v:    e.all.win,
    n:    e.all.draw,
    d:    e.all.lose,
    bp:   e.all.goals.for,
    bc:   e.all.goals.against,
    pts:  e.points,
    forme: (e.form ?? "").slice(-5).split("").map((c: string) =>
      c === "W" ? "V" : c === "D" ? "N" : "D"
    ),
    xg:   0,
    xgc:  0,
    poss: 0,
  }))
}

// ─── Buteurs / Statistiques joueurs ───────────────────────────

const POS_MAP: Record<string, string> = {
  Attacker:   "ATT",
  Midfielder: "MIL",
  Defender:   "DEF",
  Goalkeeper: "GK",
}

const NAT_MAP: Record<string, string> = {
  France: "🇫🇷", England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", Spain: "🇪🇸", Brazil: "🇧🇷",
  Germany: "🇩🇪", Portugal: "🇵🇹", Italy: "🇮🇹", Argentina: "🇦🇷",
  Netherlands: "🇳🇱", Belgium: "🇧🇪", Norway: "🇳🇴", Croatia: "🇭🇷",
  Poland: "🇵🇱", Uruguay: "🇺🇾", Colombia: "🇨🇴", Morocco: "🇲🇦",
  Senegal: "🇸🇳", Egypt: "🇪🇬", Nigeria: "🇳🇬", Canada: "🇨🇦",
  "South Korea": "🇰🇷", Japan: "🇯🇵", Serbia: "🇷🇸", Switzerland: "🇨🇭",
  Austria: "🇦🇹", Sweden: "🇸🇪", Denmark: "🇩🇰", Slovenia: "🇸🇮",
  Georgia: "🇬🇪", Gabon: "🇬🇦", "Ivory Coast": "🇨🇮",
}

export async function fetchTopScorers(ligue: string): Promise<Player[]> {
  const leagueId = LEAGUE_IDS[ligue]
  if (!leagueId) return []

  const res = await fetch(
    `${BASE}/players/topscorers?league=${leagueId}&season=${SEASON}`,
    { headers: headers(), next: { revalidate: 86400 } }
  )

  if (!res.ok) throw new Error(`API-Football players: ${res.status}`)
  const json = await res.json()

  return (json?.response ?? []).map((entry: any): Player => {
    const p    = entry.player
    const stat = entry.statistics?.[0] ?? {}
    const games = stat.games ?? {}
    const goals = stat.goals ?? {}
    const shots = stat.shots ?? {}
    const passes = stat.passes ?? {}
    const dribbles = stat.dribbles ?? {}

    return {
      nom:         p.name,
      club:        stat.team?.name ?? "",
      ligue,
      poste:       POS_MAP[games.position] ?? "MIL",
      nat:         NAT_MAP[p.nationality] ?? "🌍",
      mj:          games.appearences ?? 0,
      min:         games.minutes ?? 0,
      buts:        goals.total ?? 0,
      passes:      goals.assists ?? 0,
      xg:          0,   // non disponible sur plan gratuit
      xa:          0,
      tirs90:      shots.total ? parseFloat((shots.total / Math.max(1, (games.minutes ?? 90) / 90)).toFixed(1)) : 0,
      passes_pct:  passes.accuracy ?? 0,
      dribbles:    dribbles.success ? parseFloat((dribbles.success / Math.max(1, (games.minutes ?? 90) / 90)).toFixed(1)) : 0,
      dist:        0,
    }
  })
}
