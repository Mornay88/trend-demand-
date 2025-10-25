import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Search, BarChart3, Zap, Shield, Clock, Check, ArrowRight, Crown } from "lucide-react"
import CurrencyDisplay from "@/components/CurrencyDisplay"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50 bg-slate-950/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-indigo-400" />
            <span className="text-xl font-bold text-white">Trend & Demand</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm text-slate-300 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm text-slate-300 hover:text-white transition-colors">
              How It Works
            </Link>
            <Link href="#pricing" className="text-sm text-slate-300 hover:text-white transition-colors">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
            Powered by Real-Time Data
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-balance">
            Discover Winning Products Before Your Competition
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-8 text-pretty leading-relaxed max-w-2xl mx-auto">
            Analyze product opportunities across Google Trends, AliExpress, and Amazon in seconds. Get data-driven
            insights with our proprietary Opportunity Score.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/signup">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto">
                Start Free Analysis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button
                size="lg"
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800 w-full sm:w-auto bg-transparent"
              >
                See How It Works
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
              <div className="text-3xl font-bold text-indigo-400 mb-1">10+</div>
              <div className="text-sm text-slate-400">Data Sources</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
              <div className="text-3xl font-bold text-indigo-400 mb-1">3-10</div>
              <div className="text-sm text-slate-400">Keywords at Once</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
              <div className="text-3xl font-bold text-indigo-400 mb-1">&lt;30s</div>
              <div className="text-sm text-slate-400">Analysis Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything You Need to Find Winners</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Comprehensive product research tools designed for e-commerce entrepreneurs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <Search className="h-10 w-10 text-indigo-400 mb-3" />
              <CardTitle className="text-white">Multi-Keyword Analysis</CardTitle>
              <CardDescription className="text-slate-400">
                Analyze 3-10 keywords simultaneously to compare opportunities side-by-side
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <BarChart3 className="h-10 w-10 text-indigo-400 mb-3" />
              <CardTitle className="text-white">Opportunity Score</CardTitle>
              <CardDescription className="text-slate-400">
                Proprietary 0-100 scoring algorithm combining demand, competition, and profitability
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-indigo-400 mb-3" />
              <CardTitle className="text-white">Real-Time Trends</CardTitle>
              <CardDescription className="text-slate-400">
                Live Google Trends data showing search interest and growth patterns
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <Zap className="h-10 w-10 text-indigo-400 mb-3" />
              <CardTitle className="text-white">Lightning Fast</CardTitle>
              <CardDescription className="text-slate-400">
                Get comprehensive analysis in under 30 seconds with our optimized scraping
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <Shield className="h-10 w-10 text-indigo-400 mb-3" />
              <CardTitle className="text-white">Export & Save</CardTitle>
              <CardDescription className="text-slate-400">
                Download results as CSV and save favorite searches for future reference
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <Clock className="h-10 w-10 text-indigo-400 mb-3" />
              <CardTitle className="text-white">Search History</CardTitle>
              <CardDescription className="text-slate-400">
                Access all your past analyses and track how opportunities evolve over time
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">From keywords to insights in three simple steps</p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Enter Keywords</h3>
            <p className="text-slate-400 leading-relaxed">
              Input 3-10 product keywords you want to research. Our system handles the rest.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">We Analyze</h3>
            <p className="text-slate-400 leading-relaxed">
              Our AI scrapes Google Trends, AliExpress, and Amazon for comprehensive market data.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Get Insights</h3>
            <p className="text-slate-400 leading-relaxed">
              View detailed reports with opportunity scores, charts, and actionable recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">Start free, upgrade when you need more power</p>
          <div className="mt-4">
            <CurrencyDisplay />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Tier */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Free</CardTitle>
              <CardDescription className="text-slate-400">Perfect for getting started</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-slate-400">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-slate-300">
                  <Check className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <span>5 searches per month</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300">
                  <Check className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <span>3 keywords per search</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300">
                  <Check className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <span>Basic opportunity scores</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300">
                  <Check className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <span>Google Trends + AliExpress data</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300">
                  <Check className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <span>7-day search history</span>
                </li>
              </ul>
              <Link href="/signup">
                <Button
                  variant="outline"
                  className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
                >
                  Get Started Free
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Pro Tier */}
          <Card className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-sm border-indigo-500/50 relative">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white">Most Popular</Badge>
            <CardHeader>
              <CardTitle className="text-white text-2xl">Pro</CardTitle>
              <CardDescription className="text-slate-300">For serious entrepreneurs</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-white">$59</span>
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
              <Link href="/signup">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-blue-500/20 transition-all">Start Pro Trial</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Enterprise Tier */}
          <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm border-purple-500/50 relative">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white">Enterprise</Badge>
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center gap-2">
                Enterprise
                <Crown className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              </CardTitle>
              <CardDescription className="text-slate-300">For growing businesses</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-white">$99</span>
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
              <Link href="/signup">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/20 transition-all">Contact Sales</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Find Your Next Winning Product?</h2>
          <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
            Join hundreds of entrepreneurs using data-driven insights to build successful e-commerce businesses.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-emerald-500/20 transition-all">
              Start Your Free Analysis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-indigo-400" />
                <span className="font-bold text-white">Trend & Demand</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Data-driven product discovery for e-commerce entrepreneurs.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-sm text-slate-400 hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/help" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-slate-400">
            © 2025 Trend & Demand. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
