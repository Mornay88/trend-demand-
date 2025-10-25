import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    message: "Paystack integration is working",
    endpoints: {
      verify: "/api/paystack/verify",
      webhook: "/api/webhooks/paystack"
    },
    environment: {
      publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ? "✅ Set" : "❌ Missing",
      secretKey: process.env.PAYSTACK_SECRET_KEY ? "✅ Set" : "❌ Missing"
    },
    instructions: [
      "1. Set NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY in your environment",
      "2. Set PAYSTACK_SECRET_KEY in your environment", 
      "3. Run the database migration script",
      "4. Configure Paystack webhooks",
      "5. Test payments using the PayButton component"
    ]
  })
}
