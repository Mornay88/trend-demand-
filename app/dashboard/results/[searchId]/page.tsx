"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { TrendingUp, Download, ArrowLeft, Loader2, AlertCircle, RefreshCw, Info, Target, TrendingDown, TrendingUp as TrendingUpIcon, BarChart3, ArrowUp, ArrowDown } from "lucide-react"
import { ExplainWithAI } from "@/components/ExplainWithAI"
import { createBrowserClient } from "@/lib/supabase/client"
import type { KeywordRecord, SearchRecord } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface KeywordData {
  keyword: string
  opportunityScore: number
  trends: {
    interest: number
    growthRate: number
    region: string
    trend: "up" | "down" | "stable"
  }
  aliexpress: {
    productCount: number
    avgPrice: number
    avgOrders: number
    topSupplier: string
  }
  amazon: {
    productCount: number
    avgPrice: number
    avgRating: number
    reviewCount: number
  }
}

interface AnalysisResults {
  searchId: string
  createdAt: string
  keywords: KeywordData[]
}

export default function ResultsPage({ params }: { params: Promise<{ searchId: string }> }) {
  const { searchId } = use(params)
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState<SearchRecord | null>(null)
  const [keywords, setKeywords] = useState<KeywordRecord[]>([])
  const [retrying, setRetrying] = useState<string | null>(null)
  const [showExplanations, setShowExplanations] = useState(false)
  const [userSubscription, setUserSubscription] = useState({
    tier: 'free' as 'free' | 'pro' | 'enterprise'
  })

  useEffect(() => {
    loadResults()
    fetchUserSubscription()
  }, [searchId])

  const fetchUserSubscription = async () => {
    try {
      const response = await fetch('/api/user/subscription')
      if (response.ok) {
        const data = await response.json()
        setUserSubscription({
          tier: data.subscription_tier || 'free'
        })
      }
    } catch (err) {
      console.error('Failed to fetch user subscription:', err)
    }
  }

  const loadResults = async () => {
    try {
      const supabase = createBrowserClient()
      if (!supabase) {
        setError("Database not configured")
        setLoading(false)
        return
      }

      const { data: searchData, error: searchError } = await supabase
        .from("searches")
        .select("*")
        .eq("id", searchId)
        .single()

      if (searchError || !searchData) {
        setError("Search not found")
        setLoading(false)
        return
      }

      const { data: keywordsData, error: keywordsError } = await supabase
        .from("keywords")
        .select("*")
        .eq("search_id", searchId)
        .order("created_at", { ascending: true })

      if (keywordsError) {
        setError("Failed to load keywords")
        setLoading(false)
        return
      }

      setSearch(searchData)
      setKeywords(keywordsData || [])
      setLoading(false)
    } catch (err) {
      console.error("[v0] Error loading results:", err)
      setError("Failed to load analysis results")
      setLoading(false)
    }
  }

  const handleRetryKeyword = async (keyword: string) => {
    setRetrying(keyword)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // API requires 3–10 keywords; duplicate to meet the minimum
          keywords: [keyword, keyword, keyword],
          include_supply: true,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Retry failed")
      }

      toast({
        title: "Retry Successful",
        description: `Successfully re-analyzed "${keyword}"`,
      })

      await loadResults()
    } catch (err: any) {
      toast({
        title: "Retry Failed",
        description: err.message || "Failed to retry analysis",
        variant: "destructive",
      })
    } finally {
      setRetrying(null)
    }
  }

  const handleExportCSV = () => {
    if (!keywords.length) return

    const csvRows = [
      [
        "Keyword",
        "Opportunity Score",
        "Trends Interest",
        "Growth Rate",
        "Region",
        "Amazon SERP",
        "AliExpress SERP",
        "Spocket Products",
        "Zendrop Products",
      ],
      ...keywords.map((kw) => [
        kw.keyword,
        kw.opportunity_score,
        kw.trends_interest,
        kw.trends_growth_rate,
        kw.trends_region,
        kw.amazon_serp_estimate || "N/A",
        kw.aliexpress_serp_estimate || "N/A",
        kw.spocket_count || "N/A",
        kw.zendrop_count || "N/A",
      ]),
    ]

    const csvContent = csvRows.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `trend-demand-analysis-${searchId}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-emerald-400 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border-emerald-500/50 shadow-lg shadow-emerald-500/10"
    if (score >= 50) return "text-amber-400 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-500/50 shadow-lg shadow-amber-500/10"
    return "text-red-400 bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-500/50 shadow-lg shadow-red-500/10"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-indigo-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-300 text-lg">Loading analysis results...</p>
        </div>
      </div>
    )
  }

  if (error || !search) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950">
        <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50 bg-slate-950/50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-indigo-400" />
              <span className="text-xl font-bold text-white">Trend & Demand</span>
            </Link>
          </div>
        </header>
        <div className="container mx-auto px-4 py-12 max-w-2xl">
          <Alert variant="destructive" className="bg-red-500/10 border-red-500/50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-400">{error || "Analysis results not found"}</AlertDescription>
          </Alert>
          <div className="mt-6 text-center">
            <Link href="/dashboard/analyze">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Run New Analysis</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const failedKeywords = keywords.filter((kw) => kw.opportunity_score === 0 && !kw.trends_interest)

  if (!loading && !error && search && keywords.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950">
        <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50 bg-slate-950/50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-indigo-400" />
              <span className="text-xl font-bold text-white">Trend & Demand</span>
            </Link>
          </div>
        </header>
        <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
          <Alert className="mb-6 bg-indigo-500/10 border-indigo-500/50">
            <AlertCircle className="h-4 w-4 text-indigo-400" />
            <AlertDescription className="text-indigo-300">
              Your analysis was created, but no keyword rows are saved yet. This can happen if the backend responded
              after the database insert failed. Try refreshing the results.
            </AlertDescription>
          </Alert>
          <Button onClick={loadResults} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh Results
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950">
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50 bg-slate-950/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-indigo-400" />
            <span className="text-xl font-bold text-white">Trend & Demand</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/history">
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                History
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Analysis Results</h1>
              <p className="text-slate-400">
                {keywords.length} keywords analyzed • {new Date(search.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          {userSubscription.tier !== 'free' && (
            <Button onClick={handleExportCSV} className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-emerald-500/20 transition-all">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          )}
        </div>

        {failedKeywords.length > 0 && (
          <Alert className="mb-6 bg-yellow-500/10 border-yellow-500/50">
            <AlertCircle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-400">
              {failedKeywords.length} keyword(s) failed during analysis. You can retry them individually below.
            </AlertDescription>
          </Alert>
        )}

        {/* Results Explanation Section */}
        <Collapsible open={showExplanations} onOpenChange={setShowExplanations}>
          <Card className="mb-8 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/30">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-indigo-500/5 transition-colors">
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-indigo-400" />
                    Understanding Your Results
                  </div>
                  <div className="text-sm text-indigo-400">
                    {showExplanations ? "Hide" : "Show"} explanations
                  </div>
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Here's what each metric means and how to interpret your keyword analysis
                </CardDescription>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Opportunity Score */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-indigo-400" />
                  <h3 className="text-sm font-medium text-white">Opportunity Score</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-slate-300"><strong>75-100:</strong> Excellent opportunity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-slate-300"><strong>50-74:</strong> Good opportunity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-slate-300"><strong>0-49:</strong> Consider other keywords</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  Combines demand trends, competition level, and market saturation to give you an overall opportunity rating.
                </p>
              </div>

              {/* Trends Interest */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-indigo-400" />
                  <h3 className="text-sm font-medium text-white">Trends Interest</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-slate-300"><strong>80-100:</strong> Very high interest</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-slate-300"><strong>40-79:</strong> Moderate interest</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-slate-300"><strong>0-39:</strong> Low interest</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  Google Trends search interest level (0-100) showing how popular this keyword is in your selected region.
                </p>
              </div>

              {/* Growth Rate */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUpIcon className="h-4 w-4 text-indigo-400" />
                  <h3 className="text-sm font-medium text-white">Growth Rate</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <TrendingUpIcon className="h-3 w-3 text-green-400" />
                    <span className="text-slate-300"><strong>+20%+:</strong> Rapidly growing trend</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUpIcon className="h-3 w-3 text-yellow-400" />
                    <span className="text-slate-300"><strong>+5% to +19%:</strong> Steady growth</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-3 w-3 text-red-400" />
                    <span className="text-slate-300"><strong>Negative:</strong> Declining interest</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  Year-over-year change in search interest. Positive means growing demand, negative means declining.
                </p>
              </div>

              {/* Supply Data */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-indigo-400" />
                  <h3 className="text-sm font-medium text-white">Supply Data</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-slate-300"><strong>SERP 1-30:</strong> Low competition</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-slate-300"><strong>SERP 31-70:</strong> Moderate competition</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-slate-300"><strong>SERP 70+:</strong> High competition</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  SERP estimates show competition level. Spocket/Zendrop counts show supplier availability.
                </p>
              </div>
            </div>

            {/* Pro Tips */}
            <div className="bg-slate-500/10 border border-slate-500/30 rounded-lg p-4">
              <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                <Target className="h-4 w-4 text-slate-400" />
                Pro Tips for Success
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
                <div className="space-y-2">
                  <p><strong>🎯 Best Opportunities:</strong> High opportunity score (75+) with growing trends (+10%+)</p>
                  <p><strong>📈 Rising Trends:</strong> Look for keywords with positive growth rates and moderate competition</p>
                </div>
                <div className="space-y-2">
                  <p><strong>⚠️ Avoid:</strong> Keywords with declining trends or extremely high competition</p>
                  <p><strong>🔍 Research More:</strong> Keywords with medium scores need deeper market research</p>
                </div>
              </div>
            </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {keywords.map((kw) => (
            <Card key={kw.id} className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border-slate-600/30 hover:border-slate-500/50 transition-all hover:shadow-lg hover:shadow-slate-500/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">{kw.keyword}</CardTitle>
                <CardDescription>
                  {kw.opportunity_score === 0 && !kw.trends_interest ? (
                    <Badge variant="destructive" className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-500/50 text-red-400 shadow-lg shadow-red-500/10">
                      Failed
                    </Badge>
                  ) : (
                    <Badge className={getScoreColor(kw.opportunity_score)}>Score: {kw.opportunity_score}/100</Badge>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {kw.opportunity_score === 0 && !kw.trends_interest ? (
                  <div className="space-y-3">
                    <p className="text-sm text-slate-400">Analysis failed for this keyword</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRetryKeyword(kw.keyword)}
                      disabled={retrying === kw.keyword}
                      className="w-full border-white/10 text-slate-300 hover:bg-white/5 bg-transparent"
                    >
                      {retrying === kw.keyword ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Retrying...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Retry
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Opportunity:</span>
                      <span className="text-white font-medium">{kw.opportunity_score}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Trends Interest:</span>
                      <span className="text-white font-medium">{kw.trends_interest ?? "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Amazon SERP:</span>
                      <span className="text-white font-medium">{kw.amazon_serp_estimate ?? "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">AliExpress SERP:</span>
                      <span className="text-white font-medium">{kw.aliexpress_serp_estimate ?? "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Spocket Products:</span>
                      <span className="text-white font-medium">{kw.spocket_count ?? "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Zendrop Products:</span>
                      <span className="text-white font-medium">{kw.zendrop_count ?? "—"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Growth:</span>
                      <div className={`flex items-center gap-1 font-medium ${kw.trends_growth_rate && kw.trends_growth_rate > 0 ? "text-green-400" : "text-red-400"}`}>
                        {kw.trends_growth_rate && kw.trends_growth_rate > 0 ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )}
                        <span>
                          {kw.trends_growth_rate && kw.trends_growth_rate > 0 ? "+" : ""}
                          {kw.trends_growth_rate ?? 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Explanation */}
                <div className="mt-4 pt-4 border-t border-slate-600/30">
                  <ExplainWithAI
                    keyword={kw.keyword}
                    demand={{
                      current: Number(kw.trends_interest ?? 0),
                      momentum_pct: Number(kw.trends_growth_rate ?? 0),
                      series: [],
                      rising_queries: []
                    }}
                    supply={{
                      spocket_count: kw.spocket_count ?? null,
                      zendrop_count: kw.zendrop_count ?? null,
                      amazon_serp_estimate: kw.amazon_serp_estimate ?? null,
                      aliexpress_serp_estimate: kw.aliexpress_serp_estimate ?? null
                    }}
                    scores={{
                      opportunity: Number(kw.opportunity_score ?? 0),
                      label:
                        kw.opportunity_score >= 80
                          ? "Hot Opportunity"
                          : kw.opportunity_score >= 60
                          ? "Good Potential"
                          : kw.opportunity_score >= 40
                          ? "Moderate"
                          : "Saturated",
                      confidence: 0.8
                    }}
                    userTier={userSubscription.tier}
                    onUsageUpdate={(tier: 'free' | 'pro' | 'enterprise', keywordCount: number) => {
                      console.log(`AI Explain used: ${tier} tier, ${keywordCount} keyword(s)`)
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
