import { getFees } from "./actions"
import CotisationsClient from "./CotisationsClient"

export const metadata = { robots: { index: false, follow: false } }

export default async function CotisationsPage() {
  const data = await getFees()
  return <CotisationsClient data={data} />
}
