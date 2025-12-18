-- Add metadata column to recipes table for storing additional recipe details
-- This includes tips, substitutions, nutrition info, difficulty, and total_time

ALTER TABLE public.recipes
ADD COLUMN IF NOT EXISTS difficulty text,
ADD COLUMN IF NOT EXISTS total_time text,
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}';

-- Add comment explaining the metadata structure
COMMENT ON COLUMN public.recipes.metadata IS 'Stores additional recipe details: tips (string[]), substitutions ({original, alternative, reason}[]), nutrition ({calories, protein, notes})';

-- Create index for title search to speed up recipe lookups by name
CREATE INDEX IF NOT EXISTS idx_recipes_title_lower ON public.recipes (lower(title));
