# Supabase Database Schema

## Database Migrations

**IMPORTANT: Always use migrations for database changes. Never run ALTER, CREATE, or DROP statements directly in the Supabase SQL editor.**

### Why Use Migrations?

- **Version control**: Changes are tracked in git
- **Reproducibility**: Easy to set up new environments or reset the database
- **Team collaboration**: Everyone stays in sync
- **Rollback capability**: Can undo changes if needed

### How to Create a Migration

1. Create a new file in `supabase/migrations/` with the format:
   ```
   YYYYMMDDHHMMSS_description.sql
   ```
   Example: `20251217232422_add_shopping_list_stale.sql`

2. Write your SQL in the file

3. Apply the migration:
   ```bash
   # Using Supabase CLI (recommended)
   supabase db push

   # Or apply to remote database
   supabase db push --linked
   ```

### Existing Migrations

Located in `supabase/migrations/`:
- `20251217065641_initial_schema.sql` - Initial tables
- `20251218030000_add_user_preferences.sql` - User preferences table
- `20251217232422_add_shopping_list_stale.sql` - Shopping list stale tracking

---

## Tables

### users

- id (uuid, primary key)
- google_id (text, unique) -- from Google account linking
- email (text)
- created_at (timestamp)

### user_preferences

- id (uuid, primary key)
- user_id (uuid, foreign key)
- dietary_restrictions (text[])
- allergies (text[])
- dislikes (text[])
- favorite_cuisines (text[])
- skill_level (text)
- max_cook_time (integer) -- minutes
- household_size (integer)

### saved_recipes

- id (uuid, primary key)
- user_id (uuid, foreign key)
- recipe_name (text)
- recipe_data (jsonb) -- full recipe object
- source (text) -- 'generated' or 'spoonacular'
- created_at (timestamp)

### meal_plans

- id (uuid, primary key)
- user_id (uuid, foreign key)
- week_start_date (date)
- plan_data (jsonb) -- full week plan
- created_at (timestamp)

### shopping_lists

- id (uuid, primary key)
- user_id (uuid, foreign key)
- meal_plan_id (uuid, foreign key, nullable)
- items (jsonb) -- array of shopping list items
- stale (boolean, default false) -- true if meal plan changed since list was created
- created_at (timestamp)
- updated_at (timestamp)
