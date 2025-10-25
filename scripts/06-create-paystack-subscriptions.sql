-- Create subscriptions table for Paystack integration
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('pro', 'enterprise')),
  paystack_ref TEXT UNIQUE NOT NULL,
  plan_code TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  renewal_date TIMESTAMP WITH TIME ZONE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update user_preferences table to support Paystack
ALTER TABLE user_preferences 
  ADD COLUMN IF NOT EXISTS paystack_customer_code TEXT,
  ADD COLUMN IF NOT EXISTS paystack_subscription_code TEXT;

-- Update subscription_tier to include enterprise
ALTER TABLE user_preferences 
  DROP CONSTRAINT IF EXISTS user_preferences_subscription_tier_check;

ALTER TABLE user_preferences 
  ADD CONSTRAINT user_preferences_subscription_tier_check 
  CHECK (subscription_tier IN ('free', 'pro', 'enterprise'));

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_paystack_ref ON subscriptions(paystack_ref);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_renewal_date ON subscriptions(renewal_date);

-- Create function to update user subscription tier
CREATE OR REPLACE FUNCTION update_user_subscription_tier(
  p_user_id UUID,
  p_tier TEXT
) RETURNS VOID AS $$
BEGIN
  UPDATE user_preferences 
  SET 
    subscription_tier = p_tier,
    updated_at = NOW()
  WHERE user_id = p_user_id;
  
  -- If no user_preferences record exists, create one
  IF NOT FOUND THEN
    INSERT INTO user_preferences (user_id, subscription_tier, created_at, updated_at)
    VALUES (p_user_id, p_tier, NOW(), NOW());
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create function to get user subscription status
CREATE OR REPLACE FUNCTION get_user_subscription_status(p_user_id UUID)
RETURNS TABLE(
  subscription_tier TEXT,
  is_active BOOLEAN,
  renewal_date TIMESTAMP WITH TIME ZONE,
  searches_this_month INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(up.subscription_tier, 'free') as subscription_tier,
    CASE 
      WHEN s.status = 'active' AND s.renewal_date > NOW() THEN true
      ELSE false
    END as is_active,
    s.renewal_date,
    COALESCE(up.searches_this_month, 0) as searches_this_month
  FROM user_preferences up
  LEFT JOIN subscriptions s ON up.user_id = s.user_id 
    AND s.status = 'active' 
    AND s.renewal_date > NOW()
  WHERE up.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;
