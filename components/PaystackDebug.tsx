"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function PaystackDebug() {
  const [checks, setChecks] = useState({
    paystackScript: false,
    paystackKey: false,
    paystackPop: false,
    environment: false
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const runChecks = async () => {
      setLoading(true)
      
      // Check if Paystack script is loaded
      const scriptLoaded = !!document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]')
      
      // Check if PaystackPop is available
      const paystackPopAvailable = typeof window !== 'undefined' && !!window.PaystackPop
      
      // Check environment variables
      const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
      const hasKey = !!paystackKey
      
      // Check if we're in browser environment
      const isBrowser = typeof window !== 'undefined'
      
      setChecks({
        paystackScript: scriptLoaded,
        paystackKey: hasKey,
        paystackPop: paystackPopAvailable,
        environment: isBrowser
      })
      
      setLoading(false)
    }

    // Run checks immediately and after a delay to catch async loading
    runChecks()
    const timeout = setTimeout(runChecks, 2000)
    
    return () => clearTimeout(timeout)
  }, [])

  const loadPaystackScript = () => {
    if (typeof window === 'undefined') return
    
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.async = true
    script.onload = () => {
      console.log('Paystack script loaded manually')
      setTimeout(() => {
        setChecks(prev => ({ ...prev, paystackScript: true, paystackPop: !!window.PaystackPop }))
      }, 1000)
    }
    document.head.appendChild(script)
  }

  const testPayment = () => {
    if (!window.PaystackPop) {
      alert('Paystack not loaded!')
      return
    }

    const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
    if (!paystackKey) {
      alert('Paystack key not configured!')
      return
    }

    try {
      const handler = window.PaystackPop.setup({
        key: paystackKey,
        email: 'test@example.com',
        amount: 100000, // ₦1,000 in kobo
        currency: 'NGN',
        ref: `test_${Date.now()}`,
        callback: function(response: any) {
          console.log('Payment successful:', response)
          alert('Payment successful! Check console for details.')
        },
        onClose: function() {
          console.log('Payment cancelled')
          alert('Payment cancelled')
        }
      })
      
      handler.openIframe()
    } catch (error) {
      console.error('Payment setup error:', error)
      alert('Payment setup failed: ' + error)
    }
  }

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    )
  }

  const getStatusBadge = (status: boolean) => {
    return status ? (
      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">✓ Working</Badge>
    ) : (
      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">✗ Failed</Badge>
    )
  }

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Running diagnostics...
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          Paystack Integration Debug
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Environment Check */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
          <div className="flex items-center gap-2">
            {getStatusIcon(checks.environment)}
            <span className="font-medium">Browser Environment</span>
          </div>
          {getStatusBadge(checks.environment)}
        </div>

        {/* Paystack Key Check */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
          <div className="flex items-center gap-2">
            {getStatusIcon(checks.paystackKey)}
            <span className="font-medium">Paystack Public Key</span>
          </div>
          {getStatusBadge(checks.paystackKey)}
        </div>

        {/* Script Loading Check */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
          <div className="flex items-center gap-2">
            {getStatusIcon(checks.paystackScript)}
            <span className="font-medium">Paystack Script Loaded</span>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(checks.paystackScript)}
            {!checks.paystackScript && (
              <Button size="sm" onClick={loadPaystackScript}>
                Load Script
              </Button>
            )}
          </div>
        </div>

        {/* PaystackPop Check */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
          <div className="flex items-center gap-2">
            {getStatusIcon(checks.paystackPop)}
            <span className="font-medium">PaystackPop Available</span>
          </div>
          {getStatusBadge(checks.paystackPop)}
        </div>

        {/* Environment Variables */}
        <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
          <h4 className="font-medium mb-2">Environment Variables:</h4>
          <div className="text-sm space-y-1">
            <div>NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: {process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ? '✅ Set' : '❌ Missing'}</div>
            <div>PAYSTACK_SECRET_KEY: {process.env.PAYSTACK_SECRET_KEY ? '✅ Set' : '❌ Missing'}</div>
          </div>
        </div>

        {/* Test Payment */}
        {checks.paystackPop && checks.paystackKey && (
          <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700">
            <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Ready to Test!</h4>
            <p className="text-sm text-green-700 dark:text-green-300 mb-3">
              All checks passed. You can now test the payment integration.
            </p>
            <Button onClick={testPayment} className="bg-green-600 hover:bg-green-700 text-white">
              Test Payment (₦1,000)
            </Button>
          </div>
        )}

        {/* Issues Found */}
        {(!checks.paystackPop || !checks.paystackKey) && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Issues found:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {!checks.paystackKey && <li>Paystack public key is not configured</li>}
                {!checks.paystackPop && <li>Paystack script failed to load or initialize</li>}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Debug Info */}
        <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700">
          <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Debug Information:</h4>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <div>User Agent: {typeof window !== 'undefined' ? window.navigator.userAgent.slice(0, 50) + '...' : 'N/A'}</div>
            <div>Current URL: {typeof window !== 'undefined' ? window.location.href : 'N/A'}</div>
            <div>Scripts in DOM: {typeof document !== 'undefined' ? document.querySelectorAll('script').length : 'N/A'}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
