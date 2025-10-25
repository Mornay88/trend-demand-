// Minimal declaration so TS doesn’t complain if @types/node isn’t installed yet
declare const process: { env: Record<string, string | undefined> }

import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import type { AnalysisRequest, KeywordAnalysisResult } from "@/lib/types"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 300


export async function POST(request: Request) {
  try {
    const body: AnalysisRequest = await request.json()
    const { keywords, mode = "fast", region = "US", timeframe = "today 12-m" } = body

    if (!keywords || !Array.isArray(keywords) || keywords.length < 3 || keywords.length > 10) {
      return NextResponse.json({ error: "Please provide 3-10 keywords" }, { status: 400 })
    }

    const pythonServiceUrl = process.env.PY_SERVICE_URL
    if (!pythonServiceUrl) {
      return NextResponse.json({ error: "Backend service not configured" }, { status: 500 })
    }

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

    // Check subscription tier and usage limits
    const { data: userPrefs, error: prefsError } = await supabase
      .from("user_preferences")
      .select("subscription_tier, searches_this_month")
      .eq("user_id", user.id)
      .single()

    if (prefsError && prefsError.code !== 'PGRST116') {
      console.error("[v0] Error fetching user preferences:", prefsError)
      return NextResponse.json({ error: "Failed to check usage limits" }, { status: 500 })
    }

    const subscriptionTier = userPrefs?.subscription_tier || 'free'
    const searchesThisMonth = userPrefs?.searches_this_month || 0

    // Define monthly limits by tier
    const MONTHLY_LIMITS = {
      free: 5,
      pro: 50,
      enterprise: Number.MAX_SAFE_INTEGER
    }

    const monthlyLimit = MONTHLY_LIMITS[subscriptionTier as keyof typeof MONTHLY_LIMITS] || 5

    // Check if user has reached their limit
    if (searchesThisMonth >= monthlyLimit) {
      return NextResponse.json(
        { 
          error: "plan_limit", 
          message: "You've reached your monthly searches for your current plan." 
        }, 
        { status: 402 }
      )
    }

    // Validate mode based on subscription tier
    if (mode === "deep" && subscriptionTier === "free") {
      return NextResponse.json(
        { 
          error: "plan_restriction", 
          message: "Deep Mode requires Pro subscription." 
        }, 
        { status: 403 }
      )
    }

    // Map mode to include_supply
    const include_supply = mode === "deep"

    const response = await fetch(`${pythonServiceUrl}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        keywords,
        options: {
          include_supply,
          region,
          timeframe,
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      
      // Handle SerpAPI quota exceeded
      if (response.status === 429 || errorText.toLowerCase().includes("exceeded your api calls")) {
        return NextResponse.json(
          {
            error: "serp_quota",
            message: "We hit the external data quota. Try again later or use Fast Mode."
          },
          { status: 429 }
        )
      }
      
      // Handle timeout errors
      if (response.status === 504 || errorText.toLowerCase().includes("timeout")) {
        return NextResponse.json(
          {
            error: "timeout",
            message: "Analysis took too long. Try Fast Mode or fewer keywords."
          },
          { status: 504 }
        )
      }
      
      // Handle other upstream errors
      const truncatedError = errorText.substring(0, 300)
      return NextResponse.json(
        {
          error: "upstream_error",
          status: response.status,
          detail: truncatedError,
        },
        { status: response.status },
      )
    }

    const analysisData: { results: KeywordAnalysisResult[] } = await response.json()

    const { data: searchRecord, error: searchError } = await supabase
      .from("searches")
      .insert({
        user_id: user.id,
        keywords,
      })
      .select()
      .single()

    if (searchError || !searchRecord) {
      console.error("[v0] Failed to create search record:", searchError)
      return NextResponse.json({ error: "Failed to save search" }, { status: 500 })
    }

    const keywordRecords = analysisData.results.map((result) => {
      // Handle failed keywords
      if (result.error) {
        return {
          search_id: searchRecord.id,
          keyword: result.keyword,
          opportunity_score: 0,
          trends_interest: null,
          trends_growth_rate: null,
          trends_region: region,
          // New supply fields - null for failed keywords
          spocket_count: null,
          zendrop_count: null,
          amazon_serp_estimate: null,
          aliexpress_serp_estimate: null,
          // Legacy fields - null for failed keywords
          amazon_product_count: null,
          amazon_avg_price: null,
          amazon_avg_rating: null,
          amazon_review_count: null,
          aliexpress_product_count: null,
          aliexpress_avg_price: null,
          aliexpress_avg_orders: null,
          aliexpress_top_supplier: null,
          alibaba_supplier_count: null,
          alibaba_moq: null,
          alibaba_price_range: null,
        }
      }

      return {
        search_id: searchRecord.id,
        keyword: result.keyword,
        opportunity_score: result.scores.opportunity,
        trends_interest: result.demand.current,
        trends_growth_rate: result.demand.momentum_pct,
        trends_region: region,
        // New supply fields from API
        spocket_count: result.supply?.spocket_count || null,
        zendrop_count: result.supply?.zendrop_count || null,
        amazon_serp_estimate: result.supply?.amazon_serp_estimate || null,
        aliexpress_serp_estimate: result.supply?.aliexpress_serp_estimate || null,
        // Legacy Amazon data
        amazon_product_count: result.supply?.amazon_product_count || null,
        amazon_avg_price: null, // Not provided by API yet
        amazon_avg_rating: null, // Not provided by API yet
        amazon_review_count: null, // Not provided by API yet
        // Legacy AliExpress data
        aliexpress_product_count: result.supply?.aliexpress_product_count || null,
        aliexpress_avg_price: null, // Not provided by API yet
        aliexpress_avg_orders: null, // Not provided by API yet
        aliexpress_top_supplier: null, // Not provided by API yet
        // Alibaba data (for future)
        alibaba_supplier_count: null,
        alibaba_moq: null,
        alibaba_price_range: null,
      }
    })

    const { error: keywordsError } = await supabase.from("keywords").insert(keywordRecords)

    if (keywordsError) {
      console.error("[v0] Failed to save keywords:", keywordsError)
    }

    await supabase.rpc("increment_searches_this_month", { user_id_param: user.id })

    return NextResponse.json({
      success: true,
      searchId: searchRecord.id,
      results: analysisData.results,
    })
  } catch (error: any) {
    console.error("[v0] Analysis error:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze keywords",
        details: error.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}
