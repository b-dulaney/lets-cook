-- Add recipe_id column to shopping_lists table for single-recipe shopping lists
ALTER TABLE public.shopping_lists
ADD COLUMN IF NOT EXISTS recipe_id uuid REFERENCES public.recipes(id) ON DELETE SET NULL;

-- Add index for recipe_id lookups
CREATE INDEX IF NOT EXISTS idx_shopping_lists_recipe_id ON public.shopping_lists(recipe_id);

-- Add comment
COMMENT ON COLUMN public.shopping_lists.recipe_id IS 'Optional reference to a recipe for single-recipe shopping lists';
