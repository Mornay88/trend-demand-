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

    const { data: userPrefs, error: prefsError } = await supabase
      .from("user_preferences")
      .select("subscription_tier, searches_this_month, subscription_status")
      .eq("user_id", user.id)
      .single()

    if (prefsError && prefsError.code !== 'PGRST116') {
      console.error("[v0] Error fetching user preferences:", prefsError)
      return NextResponse.json({ error: "Failed to fetch subscription data" }, { status: 500 })
    }

    const monthlyLimits = { free: 5, pro: 50, enterprise: Number.MAX_SAFE_INTEGER }
    const tier = userPrefs?.subscription_tier || 'free'

    return NextResponse.json({
      id: user.id,
      email: user.email,
      subscription_tier: tier,
      subscription_status: userPrefs?.subscription_status || 'active',
      searches_this_month: userPrefs?.searches_this_month || 0,
      monthly_limit: monthlyLimits[tier as keyof typeof monthlyLimits],
      created_at: user.created_at,
    })
  } catch (error: any) {
    console.error("[v0] Subscription fetch error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch subscription data",
        details: error.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}
