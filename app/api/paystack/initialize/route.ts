import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, amount, currency, reference, metadata, callback_url, cancel_action } = body

    if (!email || !amount || !reference) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY
    if (!paystackSecretKey) {
      console.error('[Paystack Initialize] Secret key not configured')
      return NextResponse.json(
        { ok: false, error: 'Payment configuration error' },
        { status: 500 }
      )
    }

    console.log('[Paystack Initialize] Initializing transaction:', {
      email,
      amount,
      currency,
      reference,
      metadata
    })

    // Initialize transaction with Paystack
    const initResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        amount,
        currency: currency || 'NGN',
        reference,
        metadata,
        callback_url: callback_url || `${process.env.NEXT_PUBLIC_APP_URL}/api/paystack/verify`,
        cancel_action: cancel_action || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/upgrade`,
      })
    })

    if (!initResponse.ok) {
      const errorText = await initResponse.text()
      console.error('[Paystack Initialize] Failed:', errorText)
      return NextResponse.json(
        { ok: false, error: 'Failed to initialize payment' },
        { status: 400 }
      )
    }

    const initData = await initResponse.json()
    console.log('[Paystack Initialize] Success:', initData)

    return NextResponse.json({
      ok: true,
      data: initData.data
    })

  } catch (error) {
    console.error('[Paystack Initialize] Error:', error)
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}