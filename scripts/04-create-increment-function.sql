CREATE OR REPLACE FUNCTION increment_searches_this_month(user_id_param UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO user_preferences (user_id, searches_this_month)
  VALUES (user_id_param, 1)
  ON CONFLICT (user_id)
  DO UPDATE SET searches_this_month = user_preferences.searches_this_month + 1;
END;
$$;
