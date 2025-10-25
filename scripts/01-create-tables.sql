-- Create searches table to store user keyword searches
CREATE TABLE IF NOT EXISTS searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  keywords TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_favorite BOOLEAN DEFAULT FALSE
);

-- Create keywords table to store individual keyword analysis results
CREATE TABLE IF NOT EXISTS keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  search_id UUID NOT NULL REFERENCES searches(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  opportunity_score INTEGER,
  
  -- Google Trends data
  trends_interest INTEGER,
  trends_growth_rate DECIMAL(5,2),
  trends_region TEXT,
  
  -- AliExpress data
  aliexpress_product_count INTEGER,
  aliexpress_avg_price DECIMAL(10,2),
  aliexpress_avg_orders INTEGER,
  aliexpress_top_supplier TEXT,
  
  -- Amazon data
  amazon_product_count INTEGER,
  amazon_avg_price DECIMAL(10,2),
  amazon_avg_rating DECIMAL(3,2),
  amazon_review_count INTEGER,
  
  -- Alibaba data (for future implementation)
  alibaba_supplier_count INTEGER,
  alibaba_moq INTEGER,
  alibaba_price_range TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_preferences table for storing user settings
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT,
  searches_this_month INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_searches_user_id ON searches(user_id);
CREATE INDEX IF NOT EXISTS idx_searches_created_at ON searches(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_keywords_search_id ON keywords(search_id);
CREATE INDEX IF NOT EXISTS idx_keywords_opportunity_score ON keywords(opportunity_score DESC);
