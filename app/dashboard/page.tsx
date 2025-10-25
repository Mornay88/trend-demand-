"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Search, History, Star, BarChart3, LogOut } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import MobileNav from "@/components/MobileNav"

export default function DashboardPage() {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [hideEnterpriseCTA, setHideEnterpriseCTA] = useState(false)
  const [usageStats, setUsageStats] = useState({
    searchesThisMonth: 0,
    totalSearches: 0,
    savedFavorites: 0,
    subscriptionTier: 'free' as 'free' | 'pro' | 'enterprise',
    monthlyLimit: 5
  })
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    fetchUsageStats()
  }, [])

  const fetchUsageStats = async () => {
    try {
      const supabase = getSupabaseBrowserClient()
      if (!supabase) return

      // Fetch user subscription data
      const response = await fetch('/api/user/subscription')
      if (response.ok) {
        const subscriptionData = await response.json()
        const monthlyLimits = { free: 5, pro: 50, enterprise: Number.MAX_SAFE_INTEGER }
        
        // Get user email
        const authResponse = await fetch('/api/user/profile')
        if (authResponse.ok) {
          const authData = await authResponse.json()
          setUserEmail(authData.email || '')
        }
        
        // Fetch total searches count
        const { data: searchesData } = await supabase
          .from("searches")
          .select("id")
        
        // Fetch saved favorites count
        const { data: favoritesData } = await supabase
          .from("searches")
          .select("id")
          .eq("is_favorite", true)

        const tier = subscriptionData.subscription_tier || 'free'
        setUsageStats({
          searchesThisMonth: subscriptionData.searches_this_month || 0,
          totalSearches: searchesData?.length || 0,
          savedFavorites: favoritesData?.length || 0,
          subscriptionTier: tier as 'free' | 'pro' | 'enterprise',
          monthlyLimit: monthlyLimits[tier as keyof typeof monthlyLimits]
        })
      }
    } catch (err) {
      console.error('Failed to fetch usage stats:', err)
    }
  }

  const handleSignOut = async () => {
    setIsSigningOut(true)
    const supabase = getSupabaseBrowserClient()

    if (supabase) {
      await supabase.auth.signOut()
    }

    router.push("/")
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
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-white">
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/history">
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                History
              </Button>
            </Link>
            <Link href="/dashboard/profile">
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                Profile
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="text-slate-300 hover:text-white"
              onClick={handleSignOut}
              disabled={isSigningOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {isSigningOut ? "Signing out..." : "Sign Out"}
            </Button>
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <MobileNav 
              userEmail={userEmail} 
              subscriptionTier={usageStats.subscriptionTier} 
            />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Dashboard</h1>
          <p className="text-slate-400 text-lg">Welcome back! Ready to discover your next winning product?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Link href="/dashboard/analyze">
            <Card className="bg-gradient-to-br from-emerald-600/20 to-teal-600/20 backdrop-blur-sm border-emerald-500/50 hover:border-emerald-400/70 transition-all cursor-pointer h-full hover:shadow-lg hover:shadow-emerald-500/10">
              <CardHeader>
                <Search className="h-10 w-10 text-emerald-400 mb-3" />
                <CardTitle className="text-white">New Analysis</CardTitle>
                <CardDescription className="text-slate-300">
                  Analyze 3-10 keywords to discover product opportunities
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/top-products">
            <Card className="bg-gradient-to-br from-emerald-600/20 to-teal-600/20 backdrop-blur-sm border-emerald-500/50 hover:border-emerald-400/70 transition-all cursor-pointer h-full hover:shadow-lg hover:shadow-emerald-500/10">
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-emerald-400 mb-3" />
                <CardTitle className="text-white">Top Products</CardTitle>
                <CardDescription className="text-slate-300">Live-ranked winners from your account</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/history">
            <Card className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 backdrop-blur-sm border-blue-500/50 hover:border-blue-400/70 transition-all cursor-pointer h-full hover:shadow-lg hover:shadow-blue-500/10">
              <CardHeader>
                <History className="h-10 w-10 text-blue-400 mb-3" />
                <CardTitle className="text-white">Search History</CardTitle>
                <CardDescription className="text-slate-300">View all your past keyword analyses</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/favorites">
            <Card className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 backdrop-blur-sm border-amber-500/50 hover:border-amber-400/70 transition-all cursor-pointer h-full hover:shadow-lg hover:shadow-amber-500/10">
              <CardHeader>
                <Star className="h-10 w-10 text-amber-400 mb-3" />
                <CardTitle className="text-white">Favorites</CardTitle>
                <CardDescription className="text-slate-300">Access your saved searches and top picks</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Stats Overview */}
        <Card className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border-slate-600/30 mb-8 hover:border-slate-500/50 transition-colors">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-cyan-400" />
              Your Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center p-3 sm:p-4 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-1 break-words">
                  {usageStats.searchesThisMonth}/{usageStats.monthlyLimit === Number.MAX_SAFE_INTEGER ? '∞' : usageStats.monthlyLimit}
                </div>
                <div className="text-xs sm:text-sm text-slate-300">Searches This Month</div>
              </div>
              <div className="text-center p-3 sm:p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20">
                <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-1">{usageStats.totalSearches}</div>
                <div className="text-xs sm:text-sm text-slate-300">Total Searches</div>
              </div>
              <div className="text-center p-3 sm:p-4 rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                <div className="text-2xl sm:text-3xl font-bold text-amber-400 mb-1">{usageStats.savedFavorites}</div>
                <div className="text-xs sm:text-sm text-slate-300">Saved Favorites</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade CTA for Free Users Only */}
        {usageStats.subscriptionTier === 'free' && (
          <Card className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 backdrop-blur-sm border-emerald-500/50 hover:border-emerald-400/70 transition-all hover:shadow-lg hover:shadow-emerald-500/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                Upgrade to Pro
              </CardTitle>
              <CardDescription className="text-slate-300">
                Get unlimited searches, advanced analytics, and CSV exports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/upgrade">
                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-emerald-500/20 transition-all">
                  Upgrade Now - R1,100/month
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Thank you message for Pro/Enterprise users */}
        {(usageStats.subscriptionTier === 'pro' || usageStats.subscriptionTier === 'enterprise') && (
          <Card className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm border-green-500/50 hover:border-green-400/70 transition-all hover:shadow-lg hover:shadow-green-500/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                Thank you for being a {usageStats.subscriptionTier === 'pro' ? 'Pro' : 'Enterprise'} subscriber!
              </CardTitle>
              <CardDescription className="text-slate-300">
                You have access to all premium features including Deep Mode analysis and CSV exports.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Badge className={`${usageStats.subscriptionTier === 'pro' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-purple-600 to-pink-600'} text-white shadow-lg`}>
                  {usageStats.subscriptionTier === 'pro' ? 'PRO PLAN' : 'ENTERPRISE PLAN'}
                </Badge>
                <span className="text-sm text-slate-300">
                  {usageStats.subscriptionTier === 'pro' 
                    ? '50 searches per month' 
                    : 'Unlimited searches with 500/day soft cap'}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enterprise Upgrade CTA for Pro Users */}
        {usageStats.subscriptionTier === 'pro' && !hideEnterpriseCTA && (
          <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border-purple-500/50 hover:border-purple-400/70 transition-all hover:shadow-lg hover:shadow-purple-500/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-400" />
                    Ready for Enterprise?
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Get unlimited daily searches, API access, and custom integrations
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setHideEnterpriseCTA(true)}
                  className="text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-full w-8 h-8 p-0"
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">ENTERPRISE</Badge>
                  <span className="text-lg font-semibold text-white">R1,800/month</span>
                </div>
                <Link href="/dashboard/upgrade" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/20 transition-all">
                    Upgrade to Enterprise
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
