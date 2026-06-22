import Paperboard from "@/components/tactique/Paperboard"
import { getTacticalBoards } from "./actions"

export default async function AnimationsPage() {
  const boards = await getTacticalBoards()
  return (
    <main className="h-screen bg-black overflow-hidden">
      <Paperboard initialBoards={boards} />
    </main>
  )
}
