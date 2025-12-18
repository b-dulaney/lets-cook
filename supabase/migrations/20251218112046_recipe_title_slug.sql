-- Add title_slug column for normalized, unique recipe lookups
-- This ensures consistent matching regardless of case, punctuation, or extra whitespace

-- Step 1: Create a function to generate a normalized slug from a title
CREATE OR REPLACE FUNCTION generate_recipe_slug(title text)
RETURNS text AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        trim(title),
        '[^a-zA-Z0-9\s]', '', 'g'  -- Remove non-alphanumeric (keep spaces)
      ),
      '\s+', ' ', 'g'  -- Collapse multiple spaces to single space
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Step 2: Add the title_slug column
ALTER TABLE public.recipes
ADD COLUMN IF NOT EXISTS title_slug text;

-- Step 3: Populate title_slug for existing recipes
UPDATE public.recipes
SET title_slug = generate_recipe_slug(title)
WHERE title_slug IS NULL;

-- Step 4: Remove duplicates, keeping the most recently created one
-- First, identify and delete older duplicates
DELETE FROM public.recipes
WHERE id IN (
  SELECT id FROM (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY generate_recipe_slug(title) ORDER BY created_at DESC) as rn
    FROM public.recipes
  ) ranked
  WHERE rn > 1
);

-- Step 5: Make title_slug NOT NULL and add unique constraint
ALTER TABLE public.recipes
ALTER COLUMN title_slug SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_recipes_title_slug_unique
ON public.recipes (title_slug);

-- Step 6: Create a trigger to auto-generate title_slug on insert/update
CREATE OR REPLACE FUNCTION set_recipe_title_slug()
RETURNS TRIGGER AS $$
BEGIN
  NEW.title_slug := generate_recipe_slug(NEW.title);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_recipe_title_slug ON public.recipes;
CREATE TRIGGER trigger_set_recipe_title_slug
  BEFORE INSERT OR UPDATE OF title ON public.recipes
  FOR EACH ROW
  EXECUTE FUNCTION set_recipe_title_slug();

-- Add comments
COMMENT ON COLUMN public.recipes.title_slug IS 'Normalized lowercase slug for unique lookups. Auto-generated from title.';
COMMENT ON FUNCTION generate_recipe_slug(text) IS 'Generates a normalized slug: lowercase, alphanumeric only, single spaces.';
