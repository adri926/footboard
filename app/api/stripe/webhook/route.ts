import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { supabase } from "@/lib/supabase"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "")

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) return NextResponse.json({ error: "Webhook non configuré" }, { status: 503 })

  const body = await req.text()
  const sig  = req.headers.get("stripe-signature") ?? ""

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch {
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const clubId  = session.metadata?.club_id
    if (clubId) {
      await supabase
        .from("subscriptions")
        .upsert({ club_id: clubId, plan: "club", status: "active", stripe_subscription_id: session.subscription as string }, { onConflict: "club_id" })
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub    = event.data.object as Stripe.Subscription
    const clubId = sub.metadata?.club_id
    if (clubId) {
      await supabase
        .from("subscriptions")
        .update({ plan: "solo", status: "cancelled", stripe_subscription_id: null })
        .eq("club_id", clubId)
    }
  }

  return NextResponse.json({ received: true })
}
