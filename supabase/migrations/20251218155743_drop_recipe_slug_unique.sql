-- Remove unique constraint on title_slug
-- We moved to ID-based recipe linking (via meal_plan_recipes junction table)
-- instead of slug-based caching, so uniqueness is no longer required.
--
-- The column, function, and trigger are kept for potential search/display use,
-- but multiple recipes can now have the same normalized title (different users,
-- different serving sizes, etc.)

DROP INDEX IF EXISTS idx_recipes_title_slug_unique;

-- Make title_slug nullable again since it's no longer a required lookup key
ALTER TABLE public.recipes
ALTER COLUMN title_slug DROP NOT NULL;
