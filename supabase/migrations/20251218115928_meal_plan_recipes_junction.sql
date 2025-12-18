-- Junction table to link meal plan days to generated recipes
-- This allows each day in a meal plan to have its own generated recipe

CREATE TABLE IF NOT EXISTS public.meal_plan_recipes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  meal_plan_id uuid NOT NULL REFERENCES public.meal_plans(id) ON DELETE CASCADE,
  day_index integer NOT NULL,  -- 0-indexed day within the meal plan
  recipe_id uuid NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now() NOT NULL,

  -- Each day in a meal plan can only have one recipe
  CONSTRAINT unique_meal_plan_day UNIQUE (meal_plan_id, day_index)
);

-- Index for fast lookups by meal plan
CREATE INDEX IF NOT EXISTS idx_meal_plan_recipes_meal_plan_id
  ON public.meal_plan_recipes(meal_plan_id);

-- Index for finding which meal plans use a specific recipe
CREATE INDEX IF NOT EXISTS idx_meal_plan_recipes_recipe_id
  ON public.meal_plan_recipes(recipe_id);

-- Enable RLS
ALTER TABLE public.meal_plan_recipes ENABLE ROW LEVEL SECURITY;

-- Users can only see links for their own meal plans
CREATE POLICY "Users can view their own meal plan recipes"
  ON public.meal_plan_recipes FOR SELECT
  USING (
    meal_plan_id IN (
      SELECT id FROM public.meal_plans WHERE user_id = auth.uid()
    )
  );

-- Users can only insert links for their own meal plans
CREATE POLICY "Users can insert their own meal plan recipes"
  ON public.meal_plan_recipes FOR INSERT
  WITH CHECK (
    meal_plan_id IN (
      SELECT id FROM public.meal_plans WHERE user_id = auth.uid()
    )
  );

-- Users can only delete links for their own meal plans
CREATE POLICY "Users can delete their own meal plan recipes"
  ON public.meal_plan_recipes FOR DELETE
  USING (
    meal_plan_id IN (
      SELECT id FROM public.meal_plans WHERE user_id = auth.uid()
    )
  );
