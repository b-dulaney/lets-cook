-- Add appliances column to user_preferences table
-- Stores kitchen appliances user has: air-fryer, slow-cooker, instant-pot, grill

ALTER TABLE public.user_preferences
ADD COLUMN IF NOT EXISTS appliances text[] DEFAULT '{}';

COMMENT ON COLUMN public.user_preferences.appliances IS 'Kitchen appliances user owns: air-fryer, slow-cooker, instant-pot, grill';
