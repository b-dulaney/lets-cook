-- Users table (extends Supabase auth.users)
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  dietary_preferences text[] default '{}',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Recipes table
create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  ingredients jsonb not null default '[]',
  instructions jsonb not null default '[]',
  prep_time integer, -- in minutes
  cook_time integer, -- in minutes
  servings integer,
  image_url text,
  source text, -- 'claude', 'spoonacular', 'user', etc.
  created_at timestamptz default now() not null
);

-- Meal plans table
create table public.meal_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  week_start date not null,
  meals jsonb not null default '{}',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Favorite recipes (junction table)
create table public.favorite_recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  created_at timestamptz default now() not null,
  unique(user_id, recipe_id)
);

-- Shopping lists table
create table public.shopping_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  meal_plan_id uuid references public.meal_plans(id) on delete set null,
  items jsonb not null default '[]',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Indexes for common queries
create index idx_meal_plans_user_id on public.meal_plans(user_id);
create index idx_meal_plans_week_start on public.meal_plans(week_start);
create index idx_favorite_recipes_user_id on public.favorite_recipes(user_id);
create index idx_shopping_lists_user_id on public.shopping_lists(user_id);
create index idx_recipes_title on public.recipes using gin(to_tsvector('english', title));

-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.recipes enable row level security;
alter table public.meal_plans enable row level security;
alter table public.favorite_recipes enable row level security;
alter table public.shopping_lists enable row level security;

-- RLS Policies for users
create policy "Users can view their own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.users for update
  using (auth.uid() = id);

-- RLS Policies for recipes (public read, authenticated write)
create policy "Anyone can view recipes"
  on public.recipes for select
  to authenticated
  using (true);

create policy "Authenticated users can create recipes"
  on public.recipes for insert
  to authenticated
  with check (true);

-- RLS Policies for meal_plans
create policy "Users can view their own meal plans"
  on public.meal_plans for select
  using (auth.uid() = user_id);

create policy "Users can create their own meal plans"
  on public.meal_plans for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own meal plans"
  on public.meal_plans for update
  using (auth.uid() = user_id);

create policy "Users can delete their own meal plans"
  on public.meal_plans for delete
  using (auth.uid() = user_id);

-- RLS Policies for favorite_recipes
create policy "Users can view their own favorites"
  on public.favorite_recipes for select
  using (auth.uid() = user_id);

create policy "Users can add their own favorites"
  on public.favorite_recipes for insert
  with check (auth.uid() = user_id);

create policy "Users can remove their own favorites"
  on public.favorite_recipes for delete
  using (auth.uid() = user_id);

-- RLS Policies for shopping_lists
create policy "Users can view their own shopping lists"
  on public.shopping_lists for select
  using (auth.uid() = user_id);

create policy "Users can create their own shopping lists"
  on public.shopping_lists for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own shopping lists"
  on public.shopping_lists for update
  using (auth.uid() = user_id);

create policy "Users can delete their own shopping lists"
  on public.shopping_lists for delete
  using (auth.uid() = user_id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.users (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'name');
  return new;
end;
$$;

-- Trigger to create user profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Triggers for updated_at
create trigger update_users_updated_at
  before update on public.users
  for each row execute procedure public.update_updated_at();

create trigger update_meal_plans_updated_at
  before update on public.meal_plans
  for each row execute procedure public.update_updated_at();

create trigger update_shopping_lists_updated_at
  before update on public.shopping_lists
  for each row execute procedure public.update_updated_at();
