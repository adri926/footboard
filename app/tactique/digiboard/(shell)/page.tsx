import Paperboard from "@/components/tactique/Paperboard"
import { getTacticalBoards } from "../actions"
import DesktopFullBleed from "@/components/dashboard/DesktopFullBleed"

export default async function AnimationsPage() {
  const boards = await getTacticalBoards()
  return (
    <main className="h-screen bg-black overflow-hidden">
      <DesktopFullBleed />
      <Paperboard initialBoards={boards} />
    </main>
  )
}
