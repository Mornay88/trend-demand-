import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    // Accept multiple parameter names (Paystack uses different ones)
    const reference = searchParams.get('ref') || searchParams.get('reference') || searchParams.get('trxref')

    if (!reference) {
      // Redirect to upgrade page with error
      return NextResponse.redirect(new URL('/dashboard/upgrade?error=no_reference', request.url))
    }

    // Verify with Paystack
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY
    if (!paystackSecretKey) {
      console.error('[Paystack] Secret key not configured')
      return NextResponse.redirect(new URL('/dashboard/upgrade?error=config_error', request.url))
    }

    const verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json'
      }
    })

    console.log('[Paystack] Verification response status:', verifyResponse.status)

    if (!verifyResponse.ok) {
      const errorText = await verifyResponse.text()
      console.error('[Paystack] Verification failed:', errorText)
      return NextResponse.redirect(new URL('/dashboard/upgrade?error=verification_failed', request.url))
    }

    const verifyData = await verifyResponse.json()
    console.log('[Paystack] Verification data:', JSON.stringify(verifyData, null, 2))

    if (!verifyData.status || verifyData.data.status !== 'success') {
      console.error('[Paystack] Payment not successful:', verifyData)
      return NextResponse.redirect(new URL('/dashboard/upgrade?error=payment_not_successful', request.url))
    }

    // Extract metadata
    const metadata = verifyData.data.metadata
    const userId = metadata?.userId || metadata?.user_id
    const tier = metadata?.tier
    const planCode = metadata?.plan_code

    if (!userId || !tier) {
      console.error('[Paystack] Missing required metadata:', { userId, tier, planCode })
      return NextResponse.redirect(new URL('/dashboard/upgrade?error=invalid_metadata', request.url))
    }

    // Get Supabase client
    const supabase = await createServerClient()
    if (!supabase) {
      return NextResponse.redirect(new URL('/dashboard/upgrade?error=database_error', request.url))
    }

    // Calculate renewal date (30 days from now)
    const renewalDate = new Date()
    renewalDate.setDate(renewalDate.getDate() + 30)

    // Check if subscription already exists
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('id, tier')
      .eq('paystack_ref', reference)
      .single()

    if (existingSubscription) {
      console.log('[Paystack] Subscription already processed, redirecting to success')
      return NextResponse.redirect(new URL(`/dashboard/upgrade/success?tier=${existingSubscription.tier}&existing=true`, request.url))
    }

    // Create or update subscription
    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        tier,
        paystack_ref: reference,
        plan_code: planCode,
        status: 'active',
        start_date: new Date().toISOString(),
        renewal_date: renewalDate.toISOString(),
        amount: verifyData.data.amount / 100, // Convert from kobo to naira
        currency: verifyData.data.currency || 'NGN'
      }, {
        onConflict: 'paystack_ref'
      })

    if (subscriptionError) {
      console.error('[Paystack] Subscription creation error:', subscriptionError)
      return NextResponse.redirect(new URL('/dashboard/upgrade?error=subscription_creation_failed', request.url))
    }

    // Update user preferences with new subscription tier
    const { error: userPrefsError } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        subscription_tier: tier,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })

    if (userPrefsError) {
      console.error('[Paystack] User preferences update error:', userPrefsError)
      // Don't fail the whole process, just log the error
    }

    console.log(`[Paystack] Successfully processed subscription for user ${userId}, tier: ${tier}`)

    // Redirect to success page with subscription details
    return NextResponse.redirect(
      new URL(`/dashboard/upgrade/success?tier=${tier}&renewal=${renewalDate.toISOString()}`, request.url)
    )

  } catch (error) {
    console.error('[Paystack] Verification error:', error)
    return NextResponse.redirect(new URL('/dashboard/upgrade?error=internal_error', request.url))
  }
}