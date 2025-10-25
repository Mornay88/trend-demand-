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

    // Get subscription tier for the user
    const { data: userPrefs } = await supabase
      .from("user_preferences")
      .select("subscription_tier")
      .eq("user_id", user.id)
      .single()

    const tier = (userPrefs?.subscription_tier || "free") as "free" | "pro" | "enterprise"

    // Determine limit by tier
    const limits: Record<typeof tier, number | null> = {
      free: 3, // minimal list for free users
      pro: 10,
      enterprise: null, // no limit
    }
    const limit = limits[tier]

    // Join searches -> keywords to scope to current user
    // Order by opportunity_score desc, then trends_growth_rate desc
    const base = supabase
      .from("keywords")
      .select(
        `
        id,
        keyword,
        opportunity_score,
        trends_interest,
        trends_growth_rate,
        trends_region,
        spocket_count,
        zendrop_count,
        amazon_serp_estimate,
        aliexpress_serp_estimate,
        created_at,
        searches!inner(user_id)
      `
      )
      .eq("searches.user_id", user.id)
      .order("opportunity_score", { ascending: false })
      .order("trends_growth_rate", { ascending: false })

    const { data, error } = limit ? await base.limit(limit) : await base
    if (error) {
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }

    // Map out the joined field
    const items = (data || []).map((row: any) => ({
      id: row.id,
      keyword: row.keyword,
      opportunity_score: row.opportunity_score,
      trends_interest: row.trends_interest,
      trends_growth_rate: row.trends_growth_rate,
      trends_region: row.trends_region,
      spocket_count: row.spocket_count,
      zendrop_count: row.zendrop_count,
      amazon_serp_estimate: row.amazon_serp_estimate,
      aliexpress_serp_estimate: row.aliexpress_serp_estimate,
      created_at: row.created_at,
    }))

    return NextResponse.json({ tier, items })
  } catch (err) {
    console.error("[v0] top-products GET error:", err)
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 })
  }
}


