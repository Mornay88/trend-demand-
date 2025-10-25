# Trend & Demand - Setup Guide

## Environment Variables

This project requires the following environment variables to function properly:

### Required for Supabase Integration

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Your Supabase project URL
   - Found in: Supabase Dashboard → Project Settings → API → Project URL

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Your Supabase anonymous/public key
   - Found in: Supabase Dashboard → Project Settings → API → Project API keys → anon/public

### Required for Paystack Integration

3. **NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY**
   - Your Paystack public key
   - Found in: Paystack Dashboard → Settings → API Keys & Webhooks → Public Key

4. **PAYSTACK_SECRET_KEY**
   - Your Paystack secret key (server-side only)
   - Found in: Paystack Dashboard → Settings → API Keys & Webhooks → Secret Key

### Optional Environment Variables

5. **NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL** (Development only)
   - Redirect URL after email confirmation
   - Default: `http://localhost:3000/dashboard`
   - For production, the app uses `window.location.origin`

### How to Add Environment Variables in v0

1. Click the sidebar icon on the left side of the chat
2. Select "Vars" from the menu
3. Add each environment variable with its corresponding value
4. The app will automatically use these values

### How to Get Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (or create a new one)
3. Navigate to: **Project Settings** → **API**
4. Copy the **Project URL** and **anon/public key**

### Database Setup

Once Supabase is connected, run the SQL scripts in the `scripts/` folder:

1. `01-create-tables.sql` - Creates all necessary tables
2. `02-enable-rls.sql` - Enables Row Level Security policies
3. `03-create-functions.sql` - Creates helper functions
4. `06-create-paystack-subscriptions.sql` - Creates Paystack subscription tables

You can run these scripts directly from v0 or from the Supabase SQL Editor.

### Paystack Setup

1. Create a Paystack account at [paystack.com](https://paystack.com)
2. Get your API keys from the dashboard
3. Set up webhooks pointing to: `https://yourdomain.com/api/webhooks/paystack`
4. Configure the webhook events: `invoice.payment_succeeded`, `subscription.disable`

## Features Enabled with Supabase + Paystack

- ✅ User authentication (signup/login)
- ✅ Protected dashboard routes
- ✅ Search history storage
- ✅ Favorites tracking
- ✅ User preferences
- ✅ Paystack subscription management
- ✅ Payment processing with Paystack
- ✅ Webhook handling for subscription events

## Next Steps

After adding Supabase and Paystack:
1. Implement the web scraping service for real data analysis
2. Deploy to Vercel
3. Test the complete payment flow
