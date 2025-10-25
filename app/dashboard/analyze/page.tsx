"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X, Search, AlertCircle, Loader2, TrendingUp, Zap, Clock, Globe } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function AnalyzePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [keywords, setKeywords] = useState<string[]>(["", "", ""])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [mode, setMode] = useState<"fast" | "deep">("fast")
  const [region, setRegion] = useState("US")
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 })
  const [userSubscription, setUserSubscription] = useState({
    tier: 'free' as 'free' | 'pro' | 'enterprise',
    searchesThisMonth: 0,
    monthlyLimit: 5
  })

  useEffect(() => {
    fetchUserSubscription()
  }, [])

  const fetchUserSubscription = async () => {
    try {
      const response = await fetch('/api/user/subscription')
      if (response.ok) {
        const data = await response.json()
        type Tier = 'free' | 'pro' | 'enterprise';
        const monthlyLimits: Record<Tier, number> = { free: 5, pro: 50, enterprise: Number.MAX_SAFE_INTEGER };

        const tierKey: Tier = (data.subscription_tier ?? 'free') as Tier;

        setUserSubscription({
          tier: tierKey,
          searchesThisMonth: data.searches_this_month || 0,
          monthlyLimit: monthlyLimits[tierKey],
        })
        
        // Set default mode based on tier
        if (data.subscription_tier === 'free') {
          setMode('fast')
        }
      }
    } catch (err) {
      console.error('Failed to fetch user subscription:', err)
    }
  }

  const addKeyword = () => {
    if (keywords.length < 10) {
      setKeywords([...keywords, ""])
    }
  }

  const removeKeyword = (index: number) => {
    if (keywords.length > 3) {
      setKeywords(keywords.filter((_, i) => i !== index))
    }
  }

  const updateKeyword = (index: number, value: string) => {
    const newKeywords = [...keywords]
    newKeywords[index] = value
    setKeywords(newKeywords)
  }

  const analyzeBatch = async (batch: string[], batchNum: number, totalBatches: number) => {
    setBatchProgress({ current: batchNum, total: totalBatches })

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Pass explicit defaults so backend doesn't guess
        body: JSON.stringify({
          keywords: batch,
          mode: mode,
          region: region,
          timeframe: "today 12-m",
        }),
      })

      const raw = await response.text()
      let data: any
      try {
        data = raw ? JSON.parse(raw) : {}
      } catch {
        // Non-JSON upstream error
        throw new Error(raw?.slice(0, 200) || "Invalid response from server")
      }

      if (!response.ok) {
        if (response.status === 402 && data?.error === "plan_limit") {
          throw new Error("plan_limit")
        }
        if (response.status === 403 && data?.error === "plan_restriction") {
          throw new Error("plan_restriction")
        }
        if (response.status === 429 && data?.error === "serp_quota") {
          throw new Error("serp_quota")
        }
        if (response.status === 504 && data?.error === "timeout") {
          throw new Error("timeout")
        }
        throw new Error(data?.error || data?.detail || "Analysis failed")
      }

      return data
    } catch (err: any) {
      // Preserve prior messaging but without client aborts
      if (typeof err?.message === "string" && err.message.toLowerCase().includes("timeout")) {
        throw new Error("timeout")
      }
      throw err
    }
  }

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const filledKeywords = keywords.filter((k) => k.trim() !== "")
    if (filledKeywords.length < 3) {
      setError("Please enter at least 3 keywords")
      return
    }

    if (filledKeywords.length > 10) {
      setError("Maximum 10 keywords allowed")
      return
    }

    setLoading(true)

    try {
      if (filledKeywords.length <= 5) {
        const data = await analyzeBatch(filledKeywords, 1, 1)
        router.push(`/dashboard/results/${data.searchId}`)
      } else {
        const batchSize = mode === "deep" ? 3 : 5
        const batches: string[][] = []
        for (let i = 0; i < filledKeywords.length; i += batchSize) {
          batches.push(filledKeywords.slice(i, i + batchSize))
        }

        let lastSearchId = ""
        for (let i = 0; i < batches.length; i++) {
          const data = await analyzeBatch(batches[i], i + 1, batches.length)
          lastSearchId = data.searchId
        }

        router.push(`/dashboard/results/${lastSearchId}`)
      }
    } catch (err: any) {
      console.error("[v0] Analysis error:", err)

      if (err.message === "plan_limit") {
        setError("You've reached your monthly search limit. Upgrade your plan to continue.")
        toast({
          title: "Search Limit Reached",
          description: "Upgrade to Pro for more searches per month.",
          variant: "destructive",
          action: (
            <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/upgrade')}>
              Upgrade
            </Button>
          ),
        })
      } else if (err.message === "plan_restriction") {
        setError("Deep Mode requires Pro subscription.")
        toast({
          title: "Pro Feature",
          description: "Deep Mode is available with Pro subscription.",
          variant: "destructive",
          action: (
            <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/upgrade')}>
              Upgrade
            </Button>
          ),
        })
      } else if (err.message === "serp_quota") {
        setError("External data quota exceeded. Try again later or use Fast Mode.")
        toast({
          title: "Data Quota Exceeded",
          description: "Try again later or use Fast Mode for quicker results.",
          variant: "destructive",
        })
      } else if (err.message === "timeout") {
        setError("Analysis timed out. Try using Fast Mode or fewer keywords.")
        toast({
          title: "Analysis Timeout",
          description: mode === "deep"
            ? "Deep analysis took too long. Try Fast Mode for quicker results."
            : "Request timed out. Please try again with fewer keywords.",
          variant: "destructive",
        })
      } else {
        setError(err.message || "Failed to analyze keywords. Please try again.")
        toast({
          title: "Analysis Failed",
          description: err.message || "An error occurred during analysis",
          variant: "destructive",
        })
      }
      setLoading(false)
      setBatchProgress({ current: 0, total: 0 })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950">
      {/* Header */}
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

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Analyze Keywords</h1>
          <p className="text-slate-400 text-lg">
            Enter 3-10 product keywords to discover market opportunities and trends
          </p>
        </div>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Search className="h-5 w-5 text-indigo-400" />
              Keyword Input
            </CardTitle>
            <CardDescription className="text-slate-400">
              Enter product keywords you want to research. We'll analyze data from Google Trends, AliExpress, and
              Amazon.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAnalyze} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/50 text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                {/* Usage Limits Display */}
                <div className="bg-gradient-to-br from-slate-700/20 to-slate-800/20 border border-slate-600/30 rounded-lg p-4 hover:border-slate-500/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-slate-200">Monthly Usage</h3>
                      <p className="text-xs text-slate-300">
                        {userSubscription.searchesThisMonth} of {userSubscription.monthlyLimit === Number.MAX_SAFE_INTEGER ? '∞' : userSubscription.monthlyLimit} searches used
                      </p>
                    </div>
                    <Badge className={`${userSubscription.tier === 'free' ? 'bg-gradient-to-r from-slate-600 to-slate-700' : userSubscription.tier === 'pro' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-purple-600 to-pink-600'} text-white shadow-lg`}>
                      {userSubscription.tier.toUpperCase()}
                    </Badge>
                  </div>
                  {userSubscription.searchesThisMonth >= userSubscription.monthlyLimit && (
                    <div className="mt-2 text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded px-2 py-1">
                      ⚠️ You've reached your monthly limit. Upgrade to continue analyzing.
                    </div>
                  )}
                </div>

                {/* Mode Toggle */}
                <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 rounded-lg p-4 hover:border-blue-400/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {mode === "deep" ? (
                        <Clock className="h-5 w-5 text-blue-400" />
                      ) : (
                        <Zap className="h-5 w-5 text-emerald-400" />
                      )}
                      <div>
                        <h3 className="text-sm font-medium text-blue-300">
                          {mode === "deep" ? "Deep Analysis Mode" : "Fast Mode"}
                        </h3>
                        <p className="text-xs text-slate-300">
                          {mode === "deep"
                            ? "Deep Mode: includes Amazon & AliExpress supply data (slower, ~60s per batch)"
                            : "Fast Mode: Google Trends only (faster, ~10-20s for 3-5 keywords)"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-300">Fast</span>
                      <Switch 
                        checked={mode === "deep"} 
                        onCheckedChange={(checked) => setMode(checked ? "deep" : "fast")} 
                        disabled={loading || userSubscription.tier === 'free'} 
                      />
                      <span className="text-xs text-slate-300">Deep</span>
                    </div>
                  </div>
                  {userSubscription.tier === 'free' && (
                    <div className="mt-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded px-2 py-1">
                      💡 <button 
                        onClick={() => router.push('/dashboard/upgrade')}
                        className="underline hover:text-amber-300 transition-colors"
                      >
                        Deep Mode requires Pro subscription
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-slate-500/10 border border-slate-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-slate-400" />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-slate-300 mb-2">Analysis Region</h3>
                      <Select value={region} onValueChange={setRegion} disabled={loading}>
                        <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="US">🇺🇸 United States</SelectItem>
                          <SelectItem value="GB">🇬🇧 United Kingdom</SelectItem>
                          <SelectItem value="CA">🇨🇦 Canada</SelectItem>
                          <SelectItem value="AU">🇦🇺 Australia</SelectItem>
                          <SelectItem value="DE">🇩🇪 Germany</SelectItem>
                          <SelectItem value="FR">🇫🇷 France</SelectItem>
                          <SelectItem value="IT">🇮🇹 Italy</SelectItem>
                          <SelectItem value="ES">🇪🇸 Spain</SelectItem>
                          <SelectItem value="NL">🇳🇱 Netherlands</SelectItem>
                          <SelectItem value="SE">🇸🇪 Sweden</SelectItem>
                          <SelectItem value="NO">🇳🇴 Norway</SelectItem>
                          <SelectItem value="DK">🇩🇰 Denmark</SelectItem>
                          <SelectItem value="FI">🇫🇮 Finland</SelectItem>
                          <SelectItem value="JP">🇯🇵 Japan</SelectItem>
                          <SelectItem value="KR">🇰🇷 South Korea</SelectItem>
                          <SelectItem value="SG">🇸🇬 Singapore</SelectItem>
                          <SelectItem value="IN">🇮🇳 India</SelectItem>
                          <SelectItem value="BR">🇧🇷 Brazil</SelectItem>
                          <SelectItem value="MX">🇲🇽 Mexico</SelectItem>
                          <SelectItem value="AR">🇦🇷 Argentina</SelectItem>
                          <SelectItem value="ZA">🇿🇦 South Africa</SelectItem>
                          <SelectItem value="NG">🇳🇬 Nigeria</SelectItem>
                          <SelectItem value="EG">🇪🇬 Egypt</SelectItem>
                          <SelectItem value="KE">🇰🇪 Kenya</SelectItem>
                          <SelectItem value="MA">🇲🇦 Morocco</SelectItem>
                          <SelectItem value="CN">🇨🇳 China</SelectItem>
                          <SelectItem value="TW">🇹🇼 Taiwan</SelectItem>
                          <SelectItem value="HK">🇭🇰 Hong Kong</SelectItem>
                          <SelectItem value="TH">🇹🇭 Thailand</SelectItem>
                          <SelectItem value="MY">🇲🇾 Malaysia</SelectItem>
                          <SelectItem value="ID">🇮🇩 Indonesia</SelectItem>
                          <SelectItem value="PH">🇵🇭 Philippines</SelectItem>
                          <SelectItem value="VN">🇻🇳 Vietnam</SelectItem>
                          <SelectItem value="RU">🇷🇺 Russia</SelectItem>
                          <SelectItem value="PL">🇵🇱 Poland</SelectItem>
                          <SelectItem value="CZ">🇨🇿 Czech Republic</SelectItem>
                          <SelectItem value="HU">🇭🇺 Hungary</SelectItem>
                          <SelectItem value="RO">🇷🇴 Romania</SelectItem>
                          <SelectItem value="BG">🇧🇬 Bulgaria</SelectItem>
                          <SelectItem value="GR">🇬🇷 Greece</SelectItem>
                          <SelectItem value="PT">🇵🇹 Portugal</SelectItem>
                          <SelectItem value="IE">🇮🇪 Ireland</SelectItem>
                          <SelectItem value="BE">🇧🇪 Belgium</SelectItem>
                          <SelectItem value="AT">🇦🇹 Austria</SelectItem>
                          <SelectItem value="CH">🇨🇭 Switzerland</SelectItem>
                          <SelectItem value="LU">🇱🇺 Luxembourg</SelectItem>
                          <SelectItem value="IS">🇮🇸 Iceland</SelectItem>
                          <SelectItem value="NZ">🇳🇿 New Zealand</SelectItem>
                          <SelectItem value="IL">🇮🇱 Israel</SelectItem>
                          <SelectItem value="AE">🇦🇪 UAE</SelectItem>
                          <SelectItem value="SA">🇸🇦 Saudi Arabia</SelectItem>
                          <SelectItem value="TR">🇹🇷 Turkey</SelectItem>
                          <SelectItem value="UA">🇺🇦 Ukraine</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-400 mt-1">
                        Choose the region for Google Trends analysis. This affects search interest data.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {loading && batchProgress.total > 1 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">
                      Processing batch {batchProgress.current} of {batchProgress.total}
                    </span>
                    <span className="text-indigo-400">
                      {Math.round((batchProgress.current / batchProgress.total) * 100)}%
                    </span>
                  </div>
                  <Progress value={(batchProgress.current / batchProgress.total) * 100} className="h-2" />
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300 text-base">Keywords ({keywords.length}/10)</Label>
                  <Badge variant="outline" className="border-indigo-500/50 text-indigo-300">
                    Minimum 3 required
                  </Badge>
                </div>

                {keywords.map((keyword, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1">
                      <Input
                        type="text"
                        placeholder={`Keyword ${index + 1} (e.g., "wireless earbuds")`}
                        value={keyword}
                        onChange={(e) => updateKeyword(index, e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                        disabled={loading}
                      />
                    </div>
                    {keywords.length > 3 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeKeyword(index)}
                        className="text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                        disabled={loading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}

                {keywords.length < 10 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addKeyword}
                    className="w-full border-white/10 text-slate-300 hover:bg-white/5 bg-transparent"
                    disabled={loading}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Keyword
                  </Button>
                )}
              </div>

              <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
                <h3 className="text-sm font-medium text-indigo-300 mb-2">What we'll analyze:</h3>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Google Trends search interest and growth patterns</li>
                  {mode === "deep" && (
                    <>
                      <li>• AliExpress product availability and supplier data</li>
                      <li>• Amazon competition and market metrics</li>
                    </>
                  )}
                  <li>• Opportunity Score (0–100); in Fast Mode it’s demand‑weighted, Deep adds supply signals</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-emerald-500/20 transition-all"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin text-emerald-400" />
                      Crunching the numbers...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Analyze Keywords
                    </>
                  )}
                </Button>
                <Link href="/dashboard">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-white/10 text-slate-300 hover:bg-white/5 bg-transparent"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tips Section */}
        <Card className="mt-6 bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">Tips for Better Results</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300 space-y-2 text-sm leading-relaxed">
            <p>
              <strong className="text-white">Be specific:</strong> Use detailed product names like "wireless noise
              cancelling earbuds" instead of just "earbuds"
            </p>
            <p>
              <strong className="text-white">Compare variations:</strong> Try different keyword variations to find the
              best opportunity (e.g., "smart watch" vs "fitness tracker")
            </p>
            <p>
              <strong className="text-white">Think like a buyer:</strong> Use terms that customers would actually search
              for when shopping
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
