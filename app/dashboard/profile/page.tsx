"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { TrendingUp, User, Mail, Calendar, CreditCard, AlertTriangle, LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/currency"

interface UserProfile {
  id: string
  email: string
  subscription_tier: 'free' | 'pro' | 'enterprise'
  subscription_status: 'active' | 'expired' | 'cancelled'
  searches_this_month: number
  monthly_limit: number
  created_at: string
}

interface Subscription {
  id: string
  tier: string
  status: string
  start_date: string
  renewal_date: string
  amount: number
  currency: string
  paystack_ref: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/subscription')
        if (response.ok) {
          const data = await response.json()
          setUserProfile(data)
        }

        // Fetch subscription details
        const subResponse = await fetch('/api/user/subscription-details')
        console.log('[Profile] Subscription details response status:', subResponse.status)
        if (subResponse.ok) {
          const subData = await subResponse.json()
          console.log('[Profile] Subscription details data:', subData)
          setSubscription(subData)
        } else {
          const errorData = await subResponse.json()
          console.error('[Profile] Subscription details error:', errorData)
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error)
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [toast])

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/signout', { method: 'POST' })
      if (response.ok) {
        router.push('/')
      }
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const handleCancelSubscription = async () => {
    console.log('[Profile] Cancel button clicked!')
    console.log('[Profile] Subscription data:', subscription)
    
    if (!subscription) {
      console.log('[Profile] No subscription found')
      toast({
        title: "No Subscription",
        description: "No active subscription found to cancel",
        variant: "destructive",
      })
      return
    }

    console.log('[Profile] Starting cancellation process...')
    setCancelling(true)
    try {
      console.log('[Profile] Cancelling subscription:', subscription.id)
      
      const response = await fetch('/api/user/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId: subscription.id })
      })

      console.log('[Profile] Cancel response status:', response.status)
      
      if (response.ok) {
        const result = await response.json()
        console.log('[Profile] Cancel success:', result)
        
        toast({
          title: "Subscription Cancelled",
          description: "Your subscription has been cancelled. You'll retain access until the end of your billing period.",
        })
        // Refresh data
        window.location.reload()
      } else {
        const error = await response.json()
        console.error('[Profile] Cancel error:', error)
        toast({
          title: "Cancellation Failed",
          description: error.error || "Failed to cancel subscription",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('[Profile] Cancellation error:', error)
      toast({
        title: "Error",
        description: "Failed to cancel subscription",
        variant: "destructive",
      })
    } finally {
      setCancelling(false)
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'pro': return 'bg-indigo-600'
      case 'enterprise': return 'bg-purple-600'
      default: return 'bg-slate-600'
    }
  }

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'pro': return 'Pro'
      case 'enterprise': return 'Enterprise'
      default: return 'Free'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center">
        <div className="text-white">Loading profile...</div>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center">
        <div className="text-white">Failed to load profile</div>
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
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="text-slate-300 hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-slate-400">Manage your account and subscription</p>
        </div>

        <div className="grid gap-6">
          {/* Profile Information */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-slate-400" />
                <div>
                  <div className="text-sm text-slate-400">Email</div>
                  <div className="text-white">{userProfile.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-slate-400" />
                <div>
                  <div className="text-sm text-slate-400">Member Since</div>
                  <div className="text-white">
                    {userProfile.created_at ? 
                      new Date(userProfile.created_at).toLocaleDateString() : 
                      'Unknown'
                    }
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Information */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Subscription Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-400">Current Plan</div>
                  <div className="text-white font-medium">
                    {getTierBadge(userProfile.subscription_tier)} Plan
                  </div>
                </div>
                <Badge className={getTierColor(userProfile.subscription_tier)}>
                  {getTierBadge(userProfile.subscription_tier)}
                </Badge>
              </div>

              <Separator className="bg-white/10" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-400">Searches This Month</div>
                  <div className="text-white font-medium">
                    {userProfile.searches_this_month} / {userProfile.monthly_limit === Number.MAX_SAFE_INTEGER ? '∞' : userProfile.monthly_limit}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-400">Status</div>
                  <div className="text-white font-medium capitalize">
                    {userProfile.subscription_status}
                  </div>
                </div>
              </div>

              {subscription && (
                <>
                  <Separator className="bg-white/10" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-slate-400">Next Billing Date</div>
                      <div className="text-white">
                        {new Date(subscription.renewal_date).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400">Amount</div>
                      <div className="text-white">
                        {formatCurrency(subscription.amount, subscription.currency)}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Subscription Actions */}
              {userProfile.subscription_tier !== 'free' && (
                <div className="pt-4">
                  <Separator className="bg-white/10 mb-4" />
                  <div className="text-sm text-slate-400 mb-2">
                    Debug: Tier = {userProfile.subscription_tier}, Subscription = {subscription ? 'Found' : 'Not Found'}
                    {subscription && (
                      <div>Subscription ID: {subscription.id}, Status: {subscription.status}</div>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/dashboard/upgrade" className="flex-1">
                      <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800">
                        Change Plan
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        console.log('[Profile] Button clicked - event:', e)
                        handleCancelSubscription()
                      }}
                      disabled={cancelling || !subscription}
                      className="flex-1 cursor-pointer relative z-10"
                      style={{ pointerEvents: 'auto' }}
                    >
                      {cancelling ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          {subscription ? 'Cancel Subscription' : 'Loading...'}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {userProfile.subscription_tier === 'free' && (
                <div className="pt-4">
                  <Separator className="bg-white/10 mb-4" />
                  <Link href="/dashboard/upgrade">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                      Upgrade to Pro
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Usage Statistics */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Usage Statistics</CardTitle>
              <CardDescription className="text-slate-400">
                Your search activity this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-400">
                    {userProfile.searches_this_month}
                  </div>
                  <div className="text-sm text-slate-400">Searches Used</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-400">
                    {userProfile.monthly_limit === Number.MAX_SAFE_INTEGER ? '∞' : userProfile.monthly_limit}
                  </div>
                  <div className="text-sm text-slate-400">Monthly Limit</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-400">
                    {userProfile.monthly_limit === Number.MAX_SAFE_INTEGER ? '100%' : 
                     Math.round((userProfile.searches_this_month / userProfile.monthly_limit) * 100)}%
                  </div>
                  <div className="text-sm text-slate-400">Usage</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
