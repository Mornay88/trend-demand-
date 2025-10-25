"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, TrendingUp } from "lucide-react"

interface TrendItem {
  rank: number
  keyword: string
  category: string
  opportunity_score: number
  search_volume: number
  momentum_pct: number
  source: string
}

interface TrendData {
  items: TrendItem[]
  last_data_update: string | null
  next_update: string | null
  updated_at: string
  note?: string
}

export default function TopProductsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [data, setData] = useState<TrendData | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [categories, setCategories] = useState<string[]>(["All"])
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  const fetchCategories = async () => {
    try {
      const pyServiceUrl = process.env.NEXT_PUBLIC_PY_SERVICE_URL
      if (!pyServiceUrl) return

      const res = await fetch(`${pyServiceUrl}/trends/categories`)
      if (!res.ok) throw new Error("Failed to load categories")

      const json = await res.json()
      // Expecting { categories: string[] }
      if (Array.isArray(json?.categories) && json.categories.length > 0) {
        setCategories(["All", ...json.categories])
      }
    } catch (e) {
      // Fallback to a sensible default if endpoint not present
      setCategories([
        "All",
        "Home",
        "Fitness",
        "Beauty",
        "Pets",
        "Electronics",
        "Fashion",
        "Baby",
        "Kitchen",
        "Outdoors",
        "Seasonal",
      ])
    }
  }

  const fetchTrendData = async (categoryForFetch?: string, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      }

      const pyServiceUrl = process.env.NEXT_PUBLIC_PY_SERVICE_URL
      if (!pyServiceUrl) {
        throw new Error("Python service URL not configured")
      }

      const category = categoryForFetch ?? selectedCategory ?? "All"
      const qp = category && category !== "All" ? `&category=${encodeURIComponent(category)}` : ""
      const response = await fetch(`${pyServiceUrl}/trends/top-products?limit=10${qp}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch trends: ${response.status}`)
      }

      const trendData: TrendData = await response.json()
      
      if (isRefresh) {
        console.log('[TopProducts] Background refresh completed')
      } else {
        console.log('[TopProducts] Initial fetch completed')
      }

      setData(trendData)
      setError("")
      return trendData
    } catch (err: any) {
      console.error('[TopProducts] Fetch error:', err)
      setError(err.message || "Couldn't load top products. Try again.")
      return null
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const isDataStale = (lastUpdate: string | null) => {
    if (!lastUpdate) return true // First run
    const now = Date.now()
    const lastUpdateTime = new Date(lastUpdate).getTime()
    return (now - lastUpdateTime) > (2 * 60 * 60 * 1000) // 2 hours
  }

  useEffect(() => {
    let refreshTimeout: NodeJS.Timeout

    const initializeData = async () => {
      await fetchCategories()
      const first = await fetchTrendData(selectedCategory, false)

      // Check if data is stale and schedule refresh
      const lastUpdate = first?.last_data_update ?? null
      if (isDataStale(lastUpdate)) {
        console.log('[TopProducts] Data is stale, scheduling refresh in 15s')
        refreshTimeout = setTimeout(() => {
          fetchTrendData(true)
        }, 15000)
      }
    }

    initializeData()

    return () => {
      if (refreshTimeout) {
        clearTimeout(refreshTimeout)
      }
    }
  }, [/* run once on mount */])

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
    if (score >= 50) return "text-amber-400 bg-amber-500/10 border-amber-500/30"
    return "text-red-400 bg-red-500/10 border-red-500/30"
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—"
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-slate-300">Loading top products…</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950">
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50 bg-slate-950/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="outline" className="border-white/10 text-slate-300 hover:bg-white/5 bg-transparent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Top Products</h1>
          <p className="text-slate-400 text-sm">
            Last data update: {formatDate(data?.last_data_update)} • Next update: {formatDate(data?.next_update)}
          </p>
          <p className="text-slate-500 text-sm mt-1">
            Scores auto update every 2 hours
          </p>
          {refreshing && (
            <p className="text-indigo-400 text-sm mt-1">Refreshing data...</p>
          )}
        </div>

        <div className="mb-6 flex items-center gap-3">
          <label className="text-slate-300 text-sm">Category</label>
          <select
            className="bg-white/5 border border-white/10 rounded-md px-3 py-2 text-slate-200 focus:outline-none"
            value={selectedCategory}
            onChange={(e) => {
              const val = e.target.value
              setSelectedCategory(val)
              setLoading(true)
              fetchTrendData(val, false)
            }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {error && (
          <Alert className="mb-6 bg-red-500/10 border-red-500/50">
            <AlertDescription className="text-red-300">{error}</AlertDescription>
          </Alert>
        )}

        {!data?.items || data.items.length === 0 ? (
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-8 text-center">
              <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No items yet</h3>
              <p className="text-slate-400">
                If this is the first run, the list will appear shortly.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {data.items.map((item, index) => (
              <Card key={`${item.keyword}-${item.rank}`} className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-bold text-white">#{item.rank}</span>
                        <span className="text-lg font-bold text-white">{item.keyword}</span>
                      </div>
                      <div className="text-sm text-slate-400 space-y-1">
                        <div>
                          <span className="font-medium">{item.category}</span>
                          {item.momentum_pct !== 0 && (
                            <span className="ml-2">
                              • Momentum: <span className={item.momentum_pct > 0 ? "text-emerald-400" : "text-red-400"}>
                                {item.momentum_pct > 0 ? "+" : ""}{item.momentum_pct}%
                              </span>
                            </span>
                          )}
                          <span className="ml-2">• Volume: {item.search_volume.toLocaleString()}</span>
                        </div>
                        <div className="text-xs text-slate-500">
                          Source: {item.source}
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <Badge className={`text-lg px-4 py-2 ${getScoreColor(item.opportunity_score)}`}>
                        {Math.round(item.opportunity_score)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}