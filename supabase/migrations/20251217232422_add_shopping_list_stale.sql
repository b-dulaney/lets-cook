-- Add stale column to shopping_lists table
-- This tracks whether the shopping list is out of sync with its meal plan
-- (e.g., after a meal has been re-rolled)

ALTER TABLE shopping_lists
ADD COLUMN stale BOOLEAN NOT NULL DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN shopping_lists.stale IS 'Indicates if the shopping list is out of sync with its associated meal plan';
