"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { formatCurrencyFromKobo, trackCurrencyUsage, detectCurrencyFromUser } from '@/lib/currency'

interface PayButtonProps {
  email: string
  amountCents: number
  planCode: string
  tier: 'pro' | 'enterprise'
  userId: string
  onSuccess?: () => void
  onCancel?: () => void
  onError?: (error: string) => void
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}

export default function PayButton({
  email,
  amountCents,
  planCode,
  tier,
  userId,
  onSuccess,
  onCancel,
  onError,
  disabled = false,
  className,
  children
}: PayButtonProps) {
  const [loading, setLoading] = useState(false)
  const [userCurrency, setUserCurrency] = useState('NGN')
  const [userCountry, setUserCountry] = useState('')

  useEffect(() => {
    // Detect user's location and currency
    const detectUserLocation = async () => {
      try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
        console.log('[PayButton] User timezone:', timezone)
        
        const response = await fetch('https://ipapi.co/json/')
        if (response.ok) {
          const data = await response.json()
          const country = data.country_code
          setUserCountry(country)
          const currency = detectCurrencyFromUser(country)
          setUserCurrency(currency)
          console.log('[PayButton] Detected country:', country, 'Currency:', currency)
        }
      } catch (error) {
        console.log('[PayButton] Could not detect location, using default NGN')
        setUserCurrency('NGN')
      }
    }

    detectUserLocation()
  }, [])

  const handlePayment = async () => {
    console.log('[PayButton] Starting payment process...')
    setLoading(true)

    try {
      // Generate unique reference
      const reference = `trend_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      console.log('[PayButton] Generated reference:', reference)

      // Track currency usage
      trackCurrencyUsage(userCurrency, amountCents, `payment_${tier}`)

      // Initialize transaction with Paystack
      const initResponse = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          amount: amountCents,
          currency: userCurrency,
          reference,
          metadata: {
            userId,
            tier,
            planCode,
          },
          callback_url: `${window.location.origin}/api/paystack/verify`,
          cancel_action: `${window.location.origin}/dashboard/upgrade?cancelled=true`,
        }),
      })

      if (!initResponse.ok) {
        throw new Error('Failed to initialize payment')
      }

      const initData = await initResponse.json()
      
      if (!initData.data?.authorization_url) {
        throw new Error('No authorization URL received')
      }

      console.log('[PayButton] Redirecting to Paystack checkout...')
      
      // Redirect to Paystack's full-page checkout
      window.location.href = initData.data.authorization_url

    } catch (error) {
      console.error('[PayButton] Payment initialization error:', error)
      onError?.(error instanceof Error ? error.message : 'Payment initialization failed')
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || loading}
      className={className}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Redirecting to checkout...
        </>
      ) : (
        children || `Pay ${formatCurrencyFromKobo(amountCents, userCurrency)}`
      )}
    </Button>
  )
}