# Supabase Database Schema

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
- list_data (jsonb)
- created_at (timestamp)
- completed (boolean)
