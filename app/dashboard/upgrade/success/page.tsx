"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, CheckCircle2, Zap, Loader2, AlertCircle } from "lucide-react"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  
  const tier = searchParams.get('tier') as 'pro' | 'enterprise' | null
  const renewal = searchParams.get('renewal')
  const existing = searchParams.get('existing')

  useEffect(() => {
    // Small delay to show loading state (optional)
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  // Show loading state briefly
  if (loading) {
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

        <div className="container mx-auto px-4 py-20 max-w-2xl">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-indigo-400 animate-spin mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Processing...</h2>
              <p className="text-slate-400 text-center">
                Please wait a moment
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // If no tier, something went wrong
  if (!tier) {
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

        <div className="container mx-auto px-4 py-20 max-w-2xl">
          <Card className="bg-gradient-to-br from-red-600/20 to-orange-600/20 backdrop-blur-sm border-red-500/50">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-red-400" />
              </div>
              <CardTitle className="text-3xl text-white mb-2">Something went wrong</CardTitle>
              <CardDescription className="text-slate-300 text-lg">
                We couldn't verify your subscription
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-center text-slate-400">
                Don't worry, if you were charged, your subscription will be processed. Please check your dashboard or contact support.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/dashboard" className="flex-1">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href="/upgrade" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full border-white/10 text-slate-300 hover:bg-white/5 bg-transparent"
                  >
                    Try Again
                  </Button>
                </Link>
              </div>
              <p className="text-center text-sm text-slate-400">
                Need help?{" "}
                <a href="mailto:support@trendanddemand.com" className="text-indigo-400 hover:text-indigo-300">
                  support@trendanddemand.com
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const isEnterprise = tier === 'enterprise'
  const displayTier = isEnterprise ? 'Enterprise' : 'Pro'

  // Show success state
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

      <div className="container mx-auto px-4 py-20 max-w-2xl">
        <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm border-green-500/50">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
            <CardTitle className="text-3xl text-white mb-2">
              {existing ? 'Already Active!' : `Welcome to ${displayTier}!`}
            </CardTitle>
            <CardDescription className="text-slate-300 text-lg">
              {existing 
                ? 'Your subscription is already active' 
                : 'Your subscription has been activated successfully'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                You now have access to:
              </h3>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                  {isEnterprise ? '500 searches per day (unlimited)' : '50 searches per month'}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                  Up to 10 keywords per search
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                  All data sources (Google Trends, AliExpress, Amazon)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                  CSV export functionality
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                  Unlimited search history
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                  Save favorite searches
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                  Priority support{isEnterprise && ' + API access'}
                </li>
                {isEnterprise && (
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                    Custom integrations
                  </li>
                )}
              </ul>
            </div>

            {renewal && (
              <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
                <p className="text-sm text-slate-400">
                  Your subscription will renew on{" "}
                  <span className="text-white font-medium">
                    {new Date(renewal).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/dashboard/analyze" className="flex-1">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                  Start Analyzing Keywords
                </Button>
              </Link>
              <Link href="/dashboard" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full border-white/10 text-slate-300 hover:bg-white/5 bg-transparent"
                >
                  Go to Dashboard
                </Button>
              </Link>
            </div>

            <p className="text-center text-sm text-slate-400">
              Questions? Contact us at{" "}
              <a href="mailto:support@trendanddemand.com" className="text-indigo-400 hover:text-indigo-300">
                support@trendanddemand.com
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}