"use client"

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TrendingUp } from 'lucide-react'
import PaystackDebug from '@/components/PaystackDebug'
import PaystackTest from '@/components/PaystackTest'

export default function PaystackDebugPage() {
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

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Paystack Integration Debug</h1>
          <p className="text-slate-400 text-lg">
            Use this page to diagnose and test your Paystack integration
          </p>
        </div>

        <div className="space-y-8">
          {/* Debug Component */}
          <PaystackDebug />
          
          {/* Test Component */}
          <PaystackTest />
        </div>
      </div>
    </div>
  )
}
