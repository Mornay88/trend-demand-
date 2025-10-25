# Paystack Integration for Trend & Demand SaaS

This document outlines the complete Paystack subscription integration implemented in the Trend & Demand SaaS application.

## 🏗️ Architecture Overview

The integration consists of four main components:

1. **PayButton Component** - React component for payment initiation
2. **Verification API** - Server-side transaction verification
3. **Webhook Handler** - Processes Paystack webhook events
4. **Database Schema** - Stores subscription data

## 📁 File Structure

```
├── components/
│   └── PayButton.tsx                    # Paystack payment component
├── app/api/
│   ├── paystack/
│   │   └── verify/route.ts             # Transaction verification
│   ├── webhooks/
│   │   └── paystack/route.ts           # Webhook handler
│   └── user/
│       └── profile/route.ts             # User profile API
├── scripts/
│   └── 06-create-paystack-subscriptions.sql  # Database schema
└── app/dashboard/upgrade/page.tsx      # Updated upgrade page
```

## 🔧 Components

### 1. PayButton Component

**Location:** `components/PayButton.tsx`

A React component that integrates with Paystack's inline JS to handle payments.

**Props:**
- `email: string` - User's email address
- `amountCents: number` - Amount in kobo (₦1 = 100 kobo)
- `planCode: string` - Plan identifier
- `tier: 'pro' | 'enterprise'` - Subscription tier
- `userId: string` - User ID for metadata
- `onSuccess?: () => void` - Success callback
- `onError?: (error: string) => void` - Error callback
- `onCancel?: () => void` - Cancel callback

**Features:**
- Loads Paystack inline JS dynamically
- Generates unique transaction references
- Includes user metadata in payment
- Handles payment verification automatically
- Provides loading states and error handling

### 2. Verification API

**Location:** `app/api/paystack/verify/route.ts`

Verifies transactions with Paystack and creates/updates subscriptions.

**Process:**
1. Receives transaction reference from PayButton
2. Verifies with Paystack API using secret key
3. Extracts user metadata from payment
4. Creates/updates subscription in database
5. Updates user preferences with new tier

**Response:**
```json
{
  "ok": true,
  "message": "Payment verified and subscription activated",
  "subscription": {
    "tier": "pro",
    "renewalDate": "2024-01-23T00:00:00.000Z"
  }
}
```

### 3. Webhook Handler

**Location:** `app/api/webhooks/paystack/route.ts`

Processes Paystack webhook events for subscription management.

**Supported Events:**
- `invoice.payment_succeeded` - Extends subscription by 30 days
- `subscription.disable` - Sets status to expired and downgrades user

**Security:**
- Verifies webhook signature using HMAC-SHA512
- Validates against Paystack secret key

### 4. Database Schema

**Location:** `scripts/06-create-paystack-subscriptions.sql`

Creates the `subscriptions` table and updates user preferences.

**Tables:**
- `subscriptions` - Stores subscription data
- `user_preferences` - Updated to support Paystack fields

## 💳 Payment Flow

1. **User clicks PayButton** → Opens Paystack modal
2. **User completes payment** → Paystack processes payment
3. **PayButton calls verification API** → Verifies with Paystack
4. **Verification API creates subscription** → Updates database
5. **User gets success notification** → Redirected to dashboard

## 🔄 Webhook Flow

1. **Paystack sends webhook** → To `/api/webhooks/paystack`
2. **Webhook handler verifies signature** → Using secret key
3. **Processes event** → Updates subscription status
4. **Updates user tier** → Based on subscription status

## 🛠️ Setup Instructions

### 1. Environment Variables

Add these to your `.env.local`:

```bash
# Paystack Configuration
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
PAYSTACK_SECRET_KEY=sk_test_...
```

### 2. Database Setup

Run the SQL script:
```sql
-- Execute scripts/06-create-paystack-subscriptions.sql
```

### 3. Paystack Configuration

1. **Create Paystack Account** at [paystack.com](https://paystack.com)
2. **Get API Keys** from dashboard
3. **Configure Webhooks:**
   - URL: `https://yourdomain.com/api/webhooks/paystack`
   - Events: `invoice.payment_succeeded`, `subscription.disable`

### 4. Test the Integration

1. **Start the development server**
2. **Navigate to `/dashboard/upgrade`**
3. **Click "Upgrade to Pro"**
4. **Complete test payment**
5. **Verify subscription in database**

## 📊 Subscription Tiers

| Tier | Price | Features |
|------|-------|----------|
| Free | ₦0 | 5 searches/month, 3 keywords/search |
| Pro | ₦25,000 | 50 searches/month, 10 keywords/search |
| Enterprise | ₦45,000 | Unlimited searches, API access |

## 🔒 Security Features

- **Webhook signature verification** using HMAC-SHA512
- **Transaction verification** with Paystack API
- **Metadata validation** to prevent unauthorized access
- **Database constraints** for data integrity

## 🐛 Troubleshooting

### Common Issues

1. **"Paystack is not loaded"**
   - Check if `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` is set
   - Verify Paystack inline JS is loading

2. **"Payment verification failed"**
   - Check `PAYSTACK_SECRET_KEY` is correct
   - Verify transaction reference is valid

3. **"Webhook signature invalid"**
   - Ensure webhook URL is correct
   - Check `PAYSTACK_SECRET_KEY` matches dashboard

### Debug Mode

Enable debug logging by checking browser console and server logs for:
- `[Paystack]` - Payment-related logs
- `[Paystack Webhook]` - Webhook processing logs

## 🚀 Production Deployment

1. **Update environment variables** with production keys
2. **Configure webhook URL** to production domain
3. **Test payment flow** with real transactions
4. **Monitor webhook logs** for any issues

## 📈 Monitoring

Monitor these metrics:
- Payment success rate
- Webhook delivery success
- Subscription renewal rates
- Failed payment reasons

## 🔄 Maintenance

Regular tasks:
- Monitor webhook delivery
- Check subscription status accuracy
- Update Paystack API keys when needed
- Review failed payment patterns
