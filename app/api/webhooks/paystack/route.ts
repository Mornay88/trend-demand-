import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-paystack-signature')

    if (!signature) {
      console.error('[Paystack Webhook] No signature provided')
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    // Verify webhook signature
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY
    if (!paystackSecretKey) {
      console.error('[Paystack Webhook] Secret key not configured')
      return NextResponse.json({ error: 'Webhook configuration error' }, { status: 500 })
    }

    const hash = crypto
      .createHmac('sha512', paystackSecretKey)
      .update(body)
      .digest('hex')

    if (hash !== signature) {
      console.error('[Paystack Webhook] Invalid signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const event = JSON.parse(body)
    console.log(`[Paystack Webhook] Received event: ${event.event}`)

    // Get Supabase client
    const supabase = await createServerClient()
    if (!supabase) {
      console.error('[Paystack Webhook] Database not configured')
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    switch (event.event) {
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data, supabase)
        break

      case 'subscription.disable':
        await handleSubscriptionDisable(event.data, supabase)
        break

      case 'subscription.create':
        console.log('[Paystack Webhook] Subscription created:', event.data)
        break

      case 'subscription.enable':
        console.log('[Paystack Webhook] Subscription enabled:', event.data)
        break

      default:
        console.log(`[Paystack Webhook] Unhandled event: ${event.event}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('[Paystack Webhook] Error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

async function handleInvoicePaymentSucceeded(data: any, supabase: any) {
  try {
    const subscriptionCode = data.subscription?.subscription_code
    if (!subscriptionCode) {
      console.error('[Paystack Webhook] No subscription code in invoice payment')
      return
    }

    // Find the subscription by Paystack reference
    const { data: subscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('paystack_ref', data.reference)
      .single()

    if (fetchError || !subscription) {
      console.error('[Paystack Webhook] Subscription not found:', fetchError)
      return
    }

    // Extend renewal date by 30 days
    const newRenewalDate = new Date()
    newRenewalDate.setDate(newRenewalDate.getDate() + 30)

    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        renewal_date: newRenewalDate.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', subscription.id)

    if (updateError) {
      console.error('[Paystack Webhook] Failed to update subscription:', updateError)
    } else {
      console.log(`[Paystack Webhook] Extended subscription ${subscription.id} until ${newRenewalDate.toISOString()}`)
    }

  } catch (error) {
    console.error('[Paystack Webhook] Error handling invoice payment:', error)
  }
}

async function handleSubscriptionDisable(data: any, supabase: any) {
  try {
    const subscriptionCode = data.subscription_code
    if (!subscriptionCode) {
      console.error('[Paystack Webhook] No subscription code in disable event')
      return
    }

    // Find the subscription by Paystack reference or subscription code
    const { data: subscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .or(`paystack_ref.eq.${data.reference},plan_code.eq.${subscriptionCode}`)
      .single()

    if (fetchError || !subscription) {
      console.error('[Paystack Webhook] Subscription not found for disable:', fetchError)
      return
    }

    // Update subscription status to expired
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        status: 'expired',
        updated_at: new Date().toISOString()
      })
      .eq('id', subscription.id)

    if (updateError) {
      console.error('[Paystack Webhook] Failed to update subscription status:', updateError)
      return
    }

    // Downgrade user to free tier
    const { error: userPrefsError } = await supabase
      .from('user_preferences')
      .update({
        subscription_tier: 'free',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', subscription.user_id)

    if (userPrefsError) {
      console.error('[Paystack Webhook] Failed to downgrade user:', userPrefsError)
    } else {
      console.log(`[Paystack Webhook] Downgraded user ${subscription.user_id} to free tier`)
    }

  } catch (error) {
    console.error('[Paystack Webhook] Error handling subscription disable:', error)
  }
}
