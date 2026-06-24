import { auth } from "@clerk/nextjs/server"
import { getMyClub } from "@/app/dashboard/club/actions"
import CompteClient from "./CompteClient"

export default async function ComptePage() {
  const [club, { has }] = await Promise.all([getMyClub(), auth()])
  const canManageFees = has({ permission: "org:fees:manage" })
  return <CompteClient club={club} canManageFees={canManageFees} />
}
