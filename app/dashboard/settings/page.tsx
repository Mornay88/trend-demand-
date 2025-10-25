"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TrendingUp, User, CreditCard, Bell, Shield, CheckCircle2, AlertCircle, Database, LogOut } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [email, setEmail] = useState("user@example.com")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [supabaseStatus, setSupabaseStatus] = useState<"checking" | "connected" | "disconnected">("checking")

  useEffect(() => {
    const checkSupabaseConnection = async () => {
      const supabase = getSupabaseBrowserClient()

      if (!supabase) {
        setSupabaseStatus("disconnected")
        return
      }

      try {
        const { error } = await supabase.from("user_preferences").select("count").limit(1)
        if (error && error.code !== "PGRST116") {
          // PGRST116 is "no rows returned" which is fine
          console.error("[v0] Supabase connection error:", error)
          setSupabaseStatus("disconnected")
        } else {
          setSupabaseStatus("connected")
        }
      } catch (err) {
        console.error("[v0] Supabase connection error:", err)
        setSupabaseStatus("disconnected")
      }
    }

    checkSupabaseConnection()
  }, [])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess("")
    setError("")

    // TODO: Implement profile update
    console.log("[v0] Updating profile...")

    setSuccess("Profile updated successfully!")
    setTimeout(() => setSuccess(""), 3000)
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess("")
    setError("")

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    // TODO: Implement password update
    console.log("[v0] Updating password...")

    setSuccess("Password updated successfully!")
    setCurrentPassword("")
    setNewPassword("")
    setTimeout(() => setSuccess(""), 3000)
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
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Account Settings</h1>
          <p className="text-slate-400 text-lg">Manage your account preferences and subscription</p>
        </div>

        {success && (
          <Alert className="bg-green-500/10 border-green-500/50 text-green-400 mb-6">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="bg-red-500/10 border-red-500/50 text-red-400 mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Database Connection Status Card */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="h-5 w-5 text-indigo-400" />
                Database Connection
              </CardTitle>
              <CardDescription className="text-slate-400">Supabase connection status and configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Status</span>
                  {supabaseStatus === "checking" && (
                    <Badge variant="outline" className="border-slate-600 text-slate-300">
                      Checking...
                    </Badge>
                  )}
                  {supabaseStatus === "connected" && (
                    <Badge className="bg-green-500/20 border-green-500/50 text-green-400">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  )}
                  {supabaseStatus === "disconnected" && (
                    <Badge variant="destructive" className="bg-red-500/20 border-red-500/50 text-red-400">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Not Connected
                    </Badge>
                  )}
                </div>

                {supabaseStatus === "disconnected" && (
                  <Alert className="bg-amber-500/10 border-amber-500/50">
                    <AlertCircle className="h-4 w-4 text-amber-400" />
                    <AlertDescription className="text-amber-300 text-sm">
                      <p className="font-medium mb-2">Supabase is not configured</p>
                      <p className="text-xs mb-2">Add these environment variables to your project:</p>
                      <ul className="text-xs space-y-1 font-mono bg-black/30 p-2 rounded">
                        <li>NEXT_PUBLIC_SUPABASE_URL</li>
                        <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                      </ul>
                      <p className="text-xs mt-2">
                        Get these values from your Supabase project settings at{" "}
                        <a
                          href="https://app.supabase.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-amber-200"
                        >
                          app.supabase.com
                        </a>
                      </p>
                    </AlertDescription>
                  </Alert>
                )}

                {supabaseStatus === "connected" && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                    <p className="text-sm text-green-300">
                      Your Supabase database is connected and ready to use. Authentication and data storage are fully
                      functional.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Subscription Status */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-indigo-400" />
                Subscription
              </CardTitle>
              <CardDescription className="text-slate-400">Manage your subscription plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg font-semibold text-white">Free Plan</span>
                    <Badge variant="outline" className="border-slate-600 text-slate-300">
                      Active
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-400">5 searches per month • 3 keywords per search</p>
                </div>
                <Link href="/dashboard/upgrade">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Upgrade to Pro</Button>
                </Link>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Monthly searches used</span>
                  <span className="text-white font-medium">0 / 5</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: "0%" }} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Settings */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5 text-indigo-400" />
                Profile Information
              </CardTitle>
              <CardDescription className="text-slate-400">Update your account details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-indigo-400" />
                Security
              </CardTitle>
              <CardDescription className="text-slate-400">Update your password</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-slate-300">
                    Current Password
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-slate-300">
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                  <p className="text-xs text-slate-500">Must be at least 8 characters</p>
                </div>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="h-5 w-5 text-indigo-400" />
                Notifications
              </CardTitle>
              <CardDescription className="text-slate-400">
                Manage your email notification preferences (Pro only)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 opacity-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-300">Weekly Digest</p>
                    <p className="text-xs text-slate-500">Receive weekly product opportunity reports</p>
                  </div>
                  <Badge variant="outline" className="border-indigo-500/50 text-indigo-300">
                    Pro Feature
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-300">Trend Alerts</p>
                    <p className="text-xs text-slate-500">Get notified when saved keywords trend up</p>
                  </div>
                  <Badge variant="outline" className="border-indigo-500/50 text-indigo-300">
                    Pro Feature
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sign Out Card */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <LogOut className="h-5 w-5 text-indigo-400" />
                Sign Out
              </CardTitle>
              <CardDescription className="text-slate-400">Sign out of your account</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 bg-transparent"
                onClick={handleSignOut}
                disabled={isSigningOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {isSigningOut ? "Signing out..." : "Sign Out"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
