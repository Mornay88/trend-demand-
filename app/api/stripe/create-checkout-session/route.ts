import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // TODO: Get authenticated user
    // const user = await getUser()
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    // TODO: Create Stripe checkout session
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    //
    // const session = await stripe.checkout.sessions.create({
    //   customer_email: user.email,
    //   line_items: [
    //     {
    //       price: process.env.STRIPE_PRICE_ID, // Pro plan price ID
    //       quantity: 1,
    //     },
    //   ],
    //   mode: 'subscription',
    //   success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/upgrade/success?session_id={CHECKOUT_SESSION_ID}`,
    //   cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/upgrade`,
    //   metadata: {
    //     userId: user.id,
    //   },
    // })

    console.log("[v0] Creating Stripe checkout session...")

    // Mock response
    return NextResponse.json({
      url: "/dashboard/upgrade/success",
    })
  } catch (error) {
    console.error("[v0] Stripe checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
