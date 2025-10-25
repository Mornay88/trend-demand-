"use client"

import React, { useState, useEffect } from 'react'
import { detectCurrencyFromUser, getPricing, formatCurrency } from '@/lib/currency'

export default function CurrencyDisplay() {
  const [userCurrency, setUserCurrency] = useState('ZAR')
  const [pricing, setPricing] = useState({ pro: 1100, enterprise: 1800 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const detectUserLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/')
        if (response.ok) {
          const data = await response.json()
          const country = data.country_code
          const currency = detectCurrencyFromUser(country)
          const userPricing = getPricing(currency)
          
          setUserCurrency(currency)
          setPricing(userPricing)
          console.log('[CurrencyDisplay] Detected:', { country, currency, pricing: userPricing })
        }
      } catch (error) {
        console.log('[CurrencyDisplay] Could not detect location, using default ZAR')
        setUserCurrency('ZAR')
        setPricing({ pro: 1100, enterprise: 1800 })
      } finally {
        setLoading(false)
      }
    }

    detectUserLocation()
  }, [])

  if (loading) {
    return (
      <div className="text-center">
        <div className="text-sm text-slate-400">Loading pricing...</div>
      </div>
    )
  }

  return (
    <div className="text-center">
      <div className="text-sm text-slate-400 mb-2">
        Pricing in {userCurrency}
      </div>
      <div className="text-xs text-slate-500">
        Pro: {formatCurrency(pricing.pro, userCurrency)} • Enterprise: {formatCurrency(pricing.enterprise, userCurrency)}
      </div>
    </div>
  )
}
