-- Create user_preferences table (one-to-one with users)
create table public.user_preferences (
  user_id uuid primary key references public.users(id) on delete cascade,
  skill_level text check (skill_level in ('beginner', 'intermediate', 'advanced')),
  max_cook_time text,
  budget text,
  household_size integer,
  dietary text[] default '{}',
  allergies text[] default '{}',
  dislikes text[] default '{}',
  favorite_cuisines text[] default '{}',
  pantry_items text[] default '{}',
  additional_notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS
alter table public.user_preferences enable row level security;

-- RLS Policies
create policy "Users can view their own preferences"
  on public.user_preferences for select
  using (auth.uid() = user_id);

create policy "Users can insert their own preferences"
  on public.user_preferences for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own preferences"
  on public.user_preferences for update
  using (auth.uid() = user_id);

-- Trigger for updated_at
create trigger update_user_preferences_updated_at
  before update on public.user_preferences
  for each row execute procedure public.update_updated_at();

-- Create preferences row when user is created
create or replace function public.handle_new_user_preferences()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.user_preferences (user_id)
  values (new.id);
  return new;
end;
$$;

create trigger on_user_created_add_preferences
  after insert on public.users
  for each row execute procedure public.handle_new_user_preferences();

-- Backfill preferences for existing users
insert into public.user_preferences (user_id)
select id from public.users
where id not in (select user_id from public.user_preferences);
