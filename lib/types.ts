export interface KeywordAnalysisResult {
  keyword: string
  scores: {
    opportunity: number
    demand: number
    supply: number
    competition: number
  }
  demand: {
    current: number
    momentum_pct: number
    trend: "rising" | "falling" | "stable"
  }
  supply?: {
    spocket_count?: number
    zendrop_count?: number
    amazon_serp_estimate?: number
    aliexpress_serp_estimate?: number
    amazon_product_count?: number
    aliexpress_product_count?: number
  }
  error?: string
}

export interface AnalysisRequest {
  keywords: string[]
  mode?: "fast" | "deep"
  region?: string
  timeframe?: string
}

export interface AnalysisResponse {
  success: boolean
  searchId?: string
  results?: KeywordAnalysisResult[]
  error?: string
  details?: string
}

export interface SearchRecord {
  id: string
  user_id: string
  keywords: string[]
  created_at: string
}

export interface KeywordRecord {
  id: string
  search_id: string
  keyword: string
  opportunity_score: number
  trends_interest: number
  trends_growth_rate: number
  trends_region: string
  // New supply fields
  spocket_count: number | null
  zendrop_count: number | null
  amazon_serp_estimate: number | null
  aliexpress_serp_estimate: number | null
  // Legacy Amazon data
  amazon_product_count: number | null
  amazon_avg_price: number | null
  amazon_avg_rating: number | null
  amazon_review_count: number | null
  // Legacy AliExpress data
  aliexpress_product_count: number | null
  aliexpress_avg_price: number | null
  aliexpress_avg_orders: number | null
  aliexpress_top_supplier: string | null
  // Alibaba data
  alibaba_supplier_count: number | null
  alibaba_moq: number | null
  alibaba_price_range: string | null
  created_at: string
}
