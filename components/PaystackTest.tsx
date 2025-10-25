"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import PayButton from './PayButton'
import { useToast } from '@/hooks/use-toast'

export default function PaystackTest() {
  const { toast } = useToast()
  const [email, setEmail] = useState('test@example.com')
  const [userId, setUserId] = useState('test-user-123')

  const handleSuccess = () => {
    toast({
      title: "Payment Successful!",
      description: "Test payment completed successfully.",
    })
  }

  const handleError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    })
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Paystack Integration Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="test@example.com"
          />
        </div>
        
        <div>
          <Label htmlFor="userId">User ID</Label>
          <Input
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="test-user-123"
          />
        </div>

        <div className="space-y-2">
          <Label>Test Payments</Label>
          <div className="space-y-2">
            <PayButton
              email={email}
              amountCents={100000} // ₦1,000 in kobo
              planCode="PLN_cpwzbajdesip4oe"
              tier="pro"
              userId={userId}
              onSuccess={handleSuccess}
              onError={handleError}
              className="w-full"
            >
              Test Pro Payment (₦1,000)
            </PayButton>
            
            <PayButton
              email={email}
              amountCents={200000} // ₦2,000 in kobo
              planCode="PLN_ofx76kq76irbkot"
              tier="enterprise"
              userId={userId}
              onSuccess={handleSuccess}
              onError={handleError}
              className="w-full"
            >
              Test Enterprise Payment (₦2,000)
            </PayButton>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <p><strong>Note:</strong> This is a test component. Make sure to:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Set your Paystack public key in environment variables</li>
            <li>Use test mode for development</li>
            <li>Configure webhook URL for production</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
