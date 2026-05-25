import TacticBoard from "@/components/pitch/TacticBoard"
import { getMyClubData } from "./actions"

export default async function AnimationsPage() {
  const clubData = await getMyClubData()
  return (
    <main className="h-screen bg-black overflow-hidden">
      <TacticBoard clubData={clubData} />
    </main>
  )
}
