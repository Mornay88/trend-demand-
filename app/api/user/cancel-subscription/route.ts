import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { subscriptionId } = await request.json()
    console.log("[Cancel Subscription] Request data:", { subscriptionId, userId: user.id })

    if (!subscriptionId) {
      return NextResponse.json({ error: "Subscription ID is required" }, { status: 400 })
    }

    // First, check if subscription exists
    const { data: existingSubscription, error: fetchError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("id", subscriptionId)
      .eq("user_id", user.id)
      .single()

    if (fetchError || !existingSubscription) {
      console.error("[Cancel Subscription] Subscription not found:", fetchError)
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 })
    }

    console.log("[Cancel Subscription] Found subscription:", existingSubscription)

    // Update subscription status to cancelled
    const { error: subscriptionError } = await supabase
      .from("subscriptions")
      .update({ 
        status: "cancelled",
        updated_at: new Date().toISOString()
      })
      .eq("id", subscriptionId)
      .eq("user_id", user.id)

    if (subscriptionError) {
      console.error("[Cancel Subscription] Error:", subscriptionError)
      return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 })
    }

    console.log("[Cancel Subscription] Subscription updated successfully")

    // Update user preferences to free tier
    const { error: userPrefsError } = await supabase
      .from("user_preferences")
      .update({ 
        subscription_tier: "free",
        subscription_status: "cancelled",
        updated_at: new Date().toISOString()
      })
      .eq("user_id", user.id)

    if (userPrefsError) {
      console.error("[Cancel Subscription] User prefs error:", userPrefsError)
      // Don't fail the whole process, just log the error
    }

    return NextResponse.json({ 
      message: "Subscription cancelled successfully",
      cancelled: true 
    })
  } catch (error: any) {
    console.error("[Cancel Subscription] API error:", error)
    return NextResponse.json(
      {
        error: "Failed to cancel subscription",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    )
  }
}
