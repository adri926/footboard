import { NextRequest, NextResponse } from "next/server"
import { fetchSquads, hasToken } from "@/lib/football-data"
import { SQUADS } from "@/lib/squads"

export async function GET(req: NextRequest) {
  const ligue = req.nextUrl.searchParams.get("ligue") ?? "Premier League"

  if (!hasToken()) {
    // Fallback : convertir les squads mock au même format
    const mock = Object.entries(SQUADS)
      .filter(([, s]) => s.ligue === ligue)
      .map(([name, s]) => ({
        id: 0, name, shortName: name, crest: "",
        squad: s.players.map((p, i) => ({
          id: i, name: p.nom, position: p.poste,
          nationality: "", nat: p.nat,
          dateOfBirth: "", age: 0,
        })),
      }))
    return NextResponse.json({ source: "mock", data: mock })
  }

  try {
    const data = await fetchSquads(ligue)
    return NextResponse.json({ source: "api", data })
  } catch (err) {
    console.error("[squads]", err)
    return NextResponse.json({ source: "mock", data: [], error: String(err) })
  }
}
