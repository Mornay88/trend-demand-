"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { TrendingUp, Search, Calendar, Eye, Loader2, AlertCircle } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import type { SearchRecord } from "@/lib/types"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SearchWithScore extends SearchRecord {
  topScore: number
  keywordCount: number
}

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searches, setSearches] = useState<SearchWithScore[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      const supabase = createBrowserClient()
      if (!supabase) {
        setError("Database not configured")
        setLoading(false)
        return
      }

      const { data: searchesData, error: searchesError } = await supabase
        .from("searches")
        .select("*")
        .order("created_at", { ascending: false })

      if (searchesError) {
        setError("Failed to load search history")
        setLoading(false)
        return
      }

      const searchesWithScores = await Promise.all(
        (searchesData || []).map(async (search) => {
          const { data: keywordsData } = await supabase
            .from("keywords")
            .select("opportunity_score")
            .eq("search_id", search.id)

          const topScore = keywordsData?.length ? Math.max(...keywordsData.map((k) => k.opportunity_score)) : 0

          return {
            ...search,
            topScore,
            keywordCount: search.keywords.length,
          }
        }),
      )

      setSearches(searchesWithScores)
      setLoading(false)
    } catch (err) {
      console.error("[v0] Error loading history:", err)
      setError("Failed to load search history")
      setLoading(false)
    }
  }

  const filteredSearches = searches.filter((search) =>
    search.keywords.some((kw) => kw.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-400 bg-green-500/20 border-green-500/50"
    if (score >= 50) return "text-yellow-400 bg-yellow-500/20 border-yellow-500/50"
    return "text-red-400 bg-red-500/20 border-red-500/50"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-indigo-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-300 text-lg">Loading search history...</p>
        </div>
      </div>
    )
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
              <Button variant="ghost" className="text-white">
                History
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Search History</h1>
          <p className="text-slate-400 text-lg">View and manage all your past keyword analyses</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6 bg-red-500/10 border-red-500/50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        )}

        <Card className="bg-white/5 backdrop-blur-sm border-white/10 mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
              />
            </div>
          </CardContent>
        </Card>

        {filteredSearches.length === 0 ? (
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="py-12 text-center">
              <Search className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-300 mb-2">No searches found</h3>
              <p className="text-slate-400 mb-6">
                {searchQuery ? "Try a different search term" : "Start analyzing keywords to see your history"}
              </p>
              <Link href="/dashboard/analyze">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Start New Analysis</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredSearches.map((search) => (
              <Card key={search.id} className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-white text-lg">{search.keywordCount} Keywords Analyzed</CardTitle>
                        <Badge className={getScoreColor(search.topScore)}>Top Score: {search.topScore}</Badge>
                      </div>
                      <CardDescription className="text-slate-400 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(search.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {search.keywords.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="border-indigo-500/50 text-indigo-300">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                  <Link href={`/dashboard/results/${search.id}`}>
                    <Button
                      variant="outline"
                      className="border-white/10 text-slate-300 hover:bg-white/5 bg-transparent"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Results
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
