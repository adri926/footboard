import { NextRequest, NextResponse } from "next/server"
import { fetchStandings, hasToken } from "@/lib/football-data"
import { CLASSEMENTS } from "@/lib/data"

export async function GET(req: NextRequest) {
  const ligue = req.nextUrl.searchParams.get("ligue") ?? "Premier League"

  if (!hasToken()) {
    return NextResponse.json({ source: "mock", data: CLASSEMENTS[ligue] ?? [] })
  }

  try {
    const data = await fetchStandings(ligue)
    return NextResponse.json({ source: "api", data })
  } catch (err) {
    console.error("[standings]", err)
    return NextResponse.json({ source: "mock", data: CLASSEMENTS[ligue] ?? [], error: String(err) })
  }
}
