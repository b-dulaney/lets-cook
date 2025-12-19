-- Add meal_complexity column to user_preferences table
-- Values: 'minimal' (< 5 ingredients), 'simple' (5-7), 'standard' (8-12), 'complex' (12+)

ALTER TABLE public.user_preferences
ADD COLUMN IF NOT EXISTS meal_complexity text;

-- Add a comment describing the column
COMMENT ON COLUMN public.user_preferences.meal_complexity IS 'Preferred recipe complexity: minimal (<5 ingredients), simple (5-7), standard (8-12), complex (12+)';
