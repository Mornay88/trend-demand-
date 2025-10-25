-- Enable Row Level Security on all tables
ALTER TABLE searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Searches policies: Users can only access their own searches
CREATE POLICY "Users can view their own searches"
  ON searches FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own searches"
  ON searches FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own searches"
  ON searches FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own searches"
  ON searches FOR DELETE
  USING (auth.uid() = user_id);

-- Keywords policies: Users can access keywords from their searches
CREATE POLICY "Users can view keywords from their searches"
  ON keywords FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM searches
      WHERE searches.id = keywords.search_id
      AND searches.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert keywords for their searches"
  ON keywords FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM searches
      WHERE searches.id = keywords.search_id
      AND searches.user_id = auth.uid()
    )
  );

-- User preferences policies: Users can only access their own preferences
CREATE POLICY "Users can view their own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id);
