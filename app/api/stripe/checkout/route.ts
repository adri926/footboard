import { NextResponse } from "next/server"
import Stripe from "stripe"
import { auth } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabase"
import { getClubScope } from "@/lib/scope"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "")

export async function POST() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const priceId = process.env.STRIPE_PRICE_CLUB_MONTHLY
  if (!priceId || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe non configuré." }, { status: 503 })
  }

  const scope = await getClubScope()
  const { data: club } = await supabase
    .from("clubs")
    .select("id, name")
    .eq(scope.column, scope.value)
    .single()

  if (!club) return NextResponse.json({ error: "Club introuvable." }, { status: 404 })

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://footboard-chi.vercel.app"

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { club_id: club.id, user_id: userId },
    success_url: `${baseUrl}/dashboard/abonnement?success=1`,
    cancel_url:  `${baseUrl}/dashboard/abonnement?cancelled=1`,
    allow_promotion_codes: true,
    subscription_data: {
      metadata: { club_id: club.id },
    },
  })

  return NextResponse.json({ url: session.url })
}
