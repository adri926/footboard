import { NextRequest, NextResponse } from "next/server"
import { fetchScorers, hasToken, COMPETITION_CODES } from "@/lib/football-data"
import { PLAYERS } from "@/lib/data"

export async function GET(req: NextRequest) {
  const ligue = req.nextUrl.searchParams.get("ligue") ?? "Toutes"

  if (!hasToken()) {
    const filtered = ligue === "Toutes" ? PLAYERS : PLAYERS.filter(p => p.ligue === ligue)
    return NextResponse.json({ source: "mock", data: filtered })
  }

  try {
    const ligues = ligue === "Toutes"
      ? Object.keys(COMPETITION_CODES)
      : [ligue]

    // Fetch séquentiel pour respecter le rate limit (10 req/min)
    const results: any[] = []
    for (const l of ligues) {
      const data = await fetchScorers(l, 20)
      results.push(...data)
      if (ligues.length > 1) await new Promise(r => setTimeout(r, 200))
    }

    return NextResponse.json({ source: "api", data: results })
  } catch (err) {
    console.error("[players]", err)
    const filtered = ligue === "Toutes" ? PLAYERS : PLAYERS.filter(p => p.ligue === ligue)
    return NextResponse.json({ source: "mock", data: filtered, error: String(err) })
  }
}
