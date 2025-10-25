import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
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

    // Get subscription details - look for any subscription (active, pending, etc.)
    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    console.log("[Subscription Details] User ID:", user.id)
    console.log("[Subscription Details] Subscription query result:", { subscription, subscriptionError })

    if (subscriptionError && subscriptionError.code !== 'PGRST116') {
      console.error("[Subscription Details] Error:", subscriptionError)
      return NextResponse.json({ error: "Failed to fetch subscription" }, { status: 500 })
    }

    return NextResponse.json(subscription || null)
  } catch (error: any) {
    console.error("[Subscription Details] API error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch subscription details",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    )
  }
}
