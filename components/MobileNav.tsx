"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { TrendingUp, Menu, Home, Search, Settings, User, LogOut, BarChart3 } from "lucide-react"

interface MobileNavProps {
  userEmail?: string
  subscriptionTier?: string
}

export default function MobileNav({ userEmail, subscriptionTier }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

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

  const navigationItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/analyze', label: 'Analyze', icon: Search },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
    { href: '/dashboard/upgrade', label: 'Upgrade', icon: BarChart3 },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden text-slate-300 hover:text-white">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 bg-slate-900 border-slate-800">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-6 w-6 text-indigo-400" />
            <span className="text-xl font-bold text-white">Trend & Demand</span>
          </div>

          {/* User Info */}
          {userEmail && (
            <div className="mb-6 p-4 bg-slate-800/50 rounded-lg">
              <div className="text-sm text-slate-400">Signed in as</div>
              <div className="text-white font-medium truncate">{userEmail}</div>
              {subscriptionTier && subscriptionTier !== 'free' && (
                <div className="text-xs text-indigo-400 mt-1 capitalize">
                  {subscriptionTier} Plan
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-800">
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800/50"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
