import { getMyClub } from "@/app/dashboard/club/actions"
import CompteClient from "./CompteClient"

export default async function ComptePage() {
  const club = await getMyClub()
  return <CompteClient club={club} />
}
