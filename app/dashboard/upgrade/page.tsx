"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Check, Zap, Loader2, Star } from "lucide-react"
import PayButton from "@/components/PayButton"
import { useToast } from "@/hooks/use-toast"
import { detectCurrencyFromUser, formatCurrency, getCurrencySymbol, getPricing, getPricingInCents } from "@/lib/currency"

export default function UpgradePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [userEmail, setUserEmail] = useState("")
  const [userId, setUserId] = useState("")
  const [userCurrency, setUserCurrency] = useState("ZAR")
  const [userCountry, setUserCountry] = useState("")
  const [pricing, setPricing] = useState({ pro: 1100, enterprise: 1800 })
  const [userSubscription, setUserSubscription] = useState({
    tier: 'free' as 'free' | 'pro' | 'enterprise',
    searchesThisMonth: 0,
    monthlyLimit: 5
  })

  useEffect(() => {
    // Detect user's location and currency
    const detectUserLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/')
        if (response.ok) {
          const data = await response.json()
          const country = data.country_code
          setUserCountry(country)
          const currency = detectCurrencyFromUser(country)
          setUserCurrency(currency)
          const userPricing = getPricing(currency)
          setPricing(userPricing)
          console.log('[Upgrade] Detected country:', country, 'Currency:', currency, 'Pricing:', userPricing)
        }
      } catch (error) {
        console.log('[Upgrade] Could not detect location, using default ZAR')
        setUserCurrency('ZAR')
        setPricing({ pro: 1100, enterprise: 1800 })
      }
    }

    detectUserLocation()

    // Get user email and ID from Supabase
    const getUserData = async () => {
      try {
        const response = await fetch('/api/user/subscription')
        if (response.ok) {
          const data = await response.json()
          const monthlyLimits = { free: 5, pro: 50, enterprise: Number.MAX_SAFE_INTEGER }
          const tier = data.subscription_tier || 'free'
          
          setUserSubscription({
            tier: tier as 'free' | 'pro' | 'enterprise',
            searchesThisMonth: data.searches_this_month || 0,
            monthlyLimit: monthlyLimits[tier as keyof typeof monthlyLimits]
          })
          
          // We need to get the user's email from auth
          const authResponse = await fetch('/api/user/profile')
          if (authResponse.ok) {
            const authData = await authResponse.json()
            setUserEmail(authData.email || '')
            setUserId(authData.id || '')
          }
        }
      } catch (error) {
        console.error('Failed to get user data:', error)
      }
    }

    getUserData()
  }, [])

  const handlePaymentSuccess = () => {
    toast({
      title: "Payment Successful!",
      description: "Your subscription has been activated. Welcome!",
    })
    router.push('/dashboard')
  }

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    })
  }

  const handlePaymentCancel = () => {
    toast({
      title: "Payment Cancelled",
      description: "You can try again anytime.",
    })
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
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-indigo-500/20 text-indigo-300 border-indigo-500/30">Limited Time Offer</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Upgrade to Pro</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Unlock unlimited searches and advanced features to supercharge your product research
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          {/* Free Tier */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Free</CardTitle>
              <CardDescription className="text-slate-400">Your current plan</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-slate-400">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-slate-300">
                  <Check className="h-5 w-5 text-slate-500 mt-0.5 flex-shrink-0" />
                  <span>5 searches per month</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300">
                  <Check className="h-5 w-5 text-slate-500 mt-0.5 flex-shrink-0" />
                  <span>3 keywords per search</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300">
                  <Check className="h-5 w-5 text-slate-500 mt-0.5 flex-shrink-0" />
                  <span>Basic opportunity scores</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300">
                  <Check className="h-5 w-5 text-slate-500 mt-0.5 flex-shrink-0" />
                  <span>Google Trends + AliExpress data</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300">
                  <Check className="h-5 w-5 text-slate-500 mt-0.5 flex-shrink-0" />
                  <span>7-day search history</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Pro Tier */}
          <Card className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-sm border-indigo-500/50 relative">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white">Recommended</Badge>
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center gap-2">
                Pro
                <Zap className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              </CardTitle>
              <CardDescription className="text-slate-300">Everything you need to succeed</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-white">
                  {formatCurrency(pricing.pro, userCurrency)}
                </span>
                <span className="text-slate-300">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-slate-200">
                  <Check className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <span className="font-medium">50 searches per month</span>
                </li>
                <li className="flex items-start gap-2 text-slate-200">
                  <Check className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <span className="font-medium">Up to 10 keywords per search</span>
                </li>
                <li className="flex items-start gap-2 text-slate-200">
                  <Check className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <span className="font-medium">Advanced opportunity scores</span>
                </li>
                <li className="flex items-start gap-2 text-slate-200">
                  <Check className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <span className="font-medium">All data sources (Trends, AliExpress, Amazon)</span>
                </li>
                <li className="flex items-start gap-2 text-slate-200">
                  <Check className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <span className="font-medium">Unlimited search history</span>
                </li>
                <li className="flex items-start gap-2 text-slate-200">
                  <Check className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <span className="font-medium">CSV export</span>
                </li>
                <li className="flex items-start gap-2 text-slate-200">
                  <Check className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <span className="font-medium">Save favorite searches</span>
                </li>
                <li className="flex items-start gap-2 text-slate-200">
                  <Check className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <span className="font-medium">Priority support</span>
                </li>
              </ul>
              {userSubscription.tier === 'free' ? (
                <PayButton
                  email={userEmail}
                  amountCents={getPricingInCents(userCurrency).pro}
                  planCode="PLN_cpwzbajdesip4oe"
                  tier="pro"
                  userId={userId}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  onCancel={handlePaymentCancel}
                  disabled={!userEmail || !userId}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Upgrade to Pro
                </PayButton>
              ) : (
                <div className="w-full bg-green-600/20 border border-green-500/50 rounded-lg p-4 text-center">
                  <div className="text-green-400 font-medium">✓ Pro Plan Active</div>
                  <div className="text-sm text-green-300 mt-1">You already have Pro access</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enterprise Tier */}
          <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm border-purple-500/50 relative">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white">Enterprise</Badge>
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center gap-2">
                Enterprise
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              </CardTitle>
              <CardDescription className="text-slate-300">For growing businesses</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-white">
                  {formatCurrency(pricing.enterprise, userCurrency)}
                </span>
                <span className="text-slate-300">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-slate-200">
                  <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="font-medium">500 searches per day (unlimited)</span>
                </li>
                <li className="flex items-start gap-2 text-slate-200">
                  <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="font-medium">Up to 10 keywords per search</span>
                </li>
                <li className="flex items-start gap-2 text-slate-200">
                  <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="font-medium">Advanced opportunity scores</span>
                </li>
                <li className="flex items-start gap-2 text-slate-200">
                  <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="font-medium">All data sources (Trends, AliExpress, Amazon)</span>
                </li>
                <li className="flex items-start gap-2 text-slate-200">
                  <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="font-medium">Unlimited search history</span>
                </li>
                <li className="flex items-start gap-2 text-slate-200">
                  <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="font-medium">CSV export</span>
                </li>
                <li className="flex items-start gap-2 text-slate-200">
                  <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="font-medium">Save favorite searches</span>
                </li>
                <li className="flex items-start gap-2 text-slate-200">
                  <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="font-medium">Priority support + API access</span>
                </li>
                <li className="flex items-start gap-2 text-slate-200">
                  <Check className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="font-medium">Custom integrations</span>
                </li>
              </ul>
              {userSubscription.tier === 'enterprise' ? (
                <div className="w-full bg-purple-600/20 border border-purple-500/50 rounded-lg p-4 text-center">
                  <div className="text-purple-400 font-medium">✓ Enterprise Plan Active</div>
                  <div className="text-sm text-purple-300 mt-1">You already have Enterprise access</div>
                </div>
              ) : (
                <PayButton
                  email={userEmail}
                  amountCents={getPricingInCents(userCurrency).enterprise}
                  planCode="PLN_ofx76kq76irbkot"
                  tier="enterprise"
                  userId={userId}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  onCancel={handlePaymentCancel}
                  disabled={!userEmail || !userId}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {userSubscription.tier === 'pro' ? 'Upgrade to Enterprise' : 'Upgrade to Enterprise'}
                </PayButton>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features Comparison */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 max-w-5xl mx-auto">
          <CardHeader>
            <CardTitle className="text-white text-center">Why Upgrade to Pro?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-600/20 flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Unlimited Research</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Analyze as many products as you want without monthly limits
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-600/20 flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Better Insights</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Access all data sources and advanced scoring algorithms
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-600/20 flex items-center justify-center mx-auto mb-3">
                  <Check className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Save Time</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Export data, save favorites, and access unlimited history
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-12">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-base">Can I cancel anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Yes! You can cancel your subscription at any time. You'll continue to have Pro access until the end of
                  your billing period.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-base">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm leading-relaxed">
                  We accept all major credit cards, bank transfers, and mobile money through our secure Paystack
                  payment processor.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-base">Is there a free trial?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Your free plan gives you 5 searches per month to try out the platform. Upgrade to Pro when you're
                  ready for unlimited access.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
