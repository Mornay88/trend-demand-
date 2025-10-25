-- Add new supply/demand fields to keywords table
-- This migration adds the new fields from the Python FastAPI response

-- Add new supply fields
ALTER TABLE keywords ADD COLUMN IF NOT EXISTS spocket_count INTEGER;
ALTER TABLE keywords ADD COLUMN IF NOT EXISTS zendrop_count INTEGER;
ALTER TABLE keywords ADD COLUMN IF NOT EXISTS amazon_serp_estimate INTEGER;
ALTER TABLE keywords ADD COLUMN IF NOT EXISTS aliexpress_serp_estimate INTEGER;

-- Add comments for documentation
COMMENT ON COLUMN keywords.spocket_count IS 'Number of products available on Spocket';
COMMENT ON COLUMN keywords.zendrop_count IS 'Number of products available on Zendrop';
COMMENT ON COLUMN keywords.amazon_serp_estimate IS 'Estimated Amazon SERP competition score';
COMMENT ON COLUMN keywords.aliexpress_serp_estimate IS 'Estimated AliExpress SERP competition score';

-- Create indexes for the new fields for better query performance
CREATE INDEX IF NOT EXISTS idx_keywords_spocket_count ON keywords(spocket_count);
CREATE INDEX IF NOT EXISTS idx_keywords_zendrop_count ON keywords(zendrop_count);
CREATE INDEX IF NOT EXISTS idx_keywords_amazon_serp_estimate ON keywords(amazon_serp_estimate);
CREATE INDEX IF NOT EXISTS idx_keywords_aliexpress_serp_estimate ON keywords(aliexpress_serp_estimate);
