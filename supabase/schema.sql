-- =====================================================================
-- Pause Prompt Wiki — Supabase schema
-- Target project: mliqkpmezfniouagozye.supabase.co
-- Run in: Supabase Studio → SQL Editor → paste → RUN.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- profiles  (1:1 with auth.users)
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  nsfw_opt_in boolean not null default false,
  age_verified boolean not null default false,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- for existing installations
alter table public.profiles
  add column if not exists age_verified boolean not null default false;

alter table public.profiles enable row level security;

drop policy if exists "profiles read all" on public.profiles;
create policy "profiles read all" on public.profiles
  for select using (true);

drop policy if exists "profiles self upsert" on public.profiles;
create policy "profiles self upsert" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles self update" on public.profiles;
create policy "profiles self update" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- auto-create a profile row when a user is created
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_zh text not null,
  name_en text not null,
  description_zh text,
  description_en text,
  "order" int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

drop policy if exists "categories read all" on public.categories;
create policy "categories read all" on public.categories
  for select using (true);

drop policy if exists "categories admin write" on public.categories;
create policy "categories admin write" on public.categories
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  ) with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

-- ---------------------------------------------------------------------
-- prompts
-- ---------------------------------------------------------------------
create table if not exists public.prompts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_zh text not null,
  title_en text,
  description_zh text,
  description_en text,
  body text not null,
  negative text,
  parameters text,
  model text,
  tags text[] default array[]::text[],
  category_id uuid references public.categories(id) on delete set null,
  author_id uuid references public.profiles(id) on delete set null,
  is_nsfw boolean not null default false,
  is_published boolean not null default true,
  likes_count int not null default 0,
  favorites_count int not null default 0,
  views_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists prompts_published_created_idx
  on public.prompts (is_published, created_at desc);
create index if not exists prompts_likes_idx
  on public.prompts (likes_count desc);
create index if not exists prompts_favs_idx
  on public.prompts (favorites_count desc);
create index if not exists prompts_category_idx
  on public.prompts (category_id);
create index if not exists prompts_tags_gin
  on public.prompts using gin (tags);

alter table public.prompts enable row level security;

-- anyone may read published prompts; authors & admins see their drafts
drop policy if exists "prompts read published" on public.prompts;
create policy "prompts read published" on public.prompts
  for select using (
    is_published
    or author_id = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

drop policy if exists "prompts author insert" on public.prompts;
create policy "prompts author insert" on public.prompts
  for insert with check (
    auth.uid() is not null
    and (author_id is null or author_id = auth.uid()
         or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin))
  );

drop policy if exists "prompts author update" on public.prompts;
create policy "prompts author update" on public.prompts
  for update using (
    author_id = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  ) with check (
    author_id = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

drop policy if exists "prompts admin delete" on public.prompts;
create policy "prompts admin delete" on public.prompts
  for delete using (
    author_id = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists prompts_touch on public.prompts;
create trigger prompts_touch
  before update on public.prompts
  for each row execute function public.touch_updated_at();

-- increment views (public, limited privilege via SECURITY DEFINER + constant update)
create or replace function public.increment_views(p_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.prompts set views_count = views_count + 1 where id = p_id;
end;
$$;

revoke all on function public.increment_views(uuid) from public;
grant execute on function public.increment_views(uuid) to anon, authenticated;

-- ---------------------------------------------------------------------
-- builder_elements
-- ---------------------------------------------------------------------
create table if not exists public.builder_elements (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in
    ('subject','scene','lighting','camera','style','quality','negative')),
  label_zh text not null,
  label_en text,
  value text not null,
  is_nsfw boolean not null default false,
  weight int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists builder_elements_type_weight_idx
  on public.builder_elements (type, weight desc);

alter table public.builder_elements enable row level security;

drop policy if exists "elements read all" on public.builder_elements;
create policy "elements read all" on public.builder_elements
  for select using (true);

drop policy if exists "elements admin write" on public.builder_elements;
create policy "elements admin write" on public.builder_elements
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  ) with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

-- ---------------------------------------------------------------------
-- likes / favorites (junction tables with counters)
-- ---------------------------------------------------------------------
create table if not exists public.likes (
  user_id uuid not null references public.profiles(id) on delete cascade,
  prompt_id uuid not null references public.prompts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, prompt_id)
);

create table if not exists public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  prompt_id uuid not null references public.prompts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, prompt_id)
);

alter table public.likes enable row level security;
alter table public.favorites enable row level security;

drop policy if exists "likes read all" on public.likes;
create policy "likes read all" on public.likes for select using (true);

drop policy if exists "likes self write" on public.likes;
create policy "likes self write" on public.likes
  for insert with check (auth.uid() = user_id);

drop policy if exists "likes self delete" on public.likes;
create policy "likes self delete" on public.likes
  for delete using (auth.uid() = user_id);

drop policy if exists "favorites read all" on public.favorites;
create policy "favorites read all" on public.favorites for select using (true);

drop policy if exists "favorites self write" on public.favorites;
create policy "favorites self write" on public.favorites
  for insert with check (auth.uid() = user_id);

drop policy if exists "favorites self delete" on public.favorites;
create policy "favorites self delete" on public.favorites
  for delete using (auth.uid() = user_id);

-- counters
create or replace function public.likes_after_insert()
returns trigger language plpgsql as $$
begin
  update public.prompts set likes_count = likes_count + 1 where id = new.prompt_id;
  return new;
end; $$;
create or replace function public.likes_after_delete()
returns trigger language plpgsql as $$
begin
  update public.prompts set likes_count = greatest(likes_count - 1, 0) where id = old.prompt_id;
  return old;
end; $$;

drop trigger if exists likes_ai on public.likes;
create trigger likes_ai after insert on public.likes
  for each row execute function public.likes_after_insert();
drop trigger if exists likes_ad on public.likes;
create trigger likes_ad after delete on public.likes
  for each row execute function public.likes_after_delete();

create or replace function public.favorites_after_insert()
returns trigger language plpgsql as $$
begin
  update public.prompts set favorites_count = favorites_count + 1 where id = new.prompt_id;
  return new;
end; $$;
create or replace function public.favorites_after_delete()
returns trigger language plpgsql as $$
begin
  update public.prompts set favorites_count = greatest(favorites_count - 1, 0) where id = old.prompt_id;
  return old;
end; $$;

drop trigger if exists favs_ai on public.favorites;
create trigger favs_ai after insert on public.favorites
  for each row execute function public.favorites_after_insert();
drop trigger if exists favs_ad on public.favorites;
create trigger favs_ad after delete on public.favorites
  for each row execute function public.favorites_after_delete();

-- ---------------------------------------------------------------------
-- Helpful views
-- ---------------------------------------------------------------------
create or replace view public.prompts_public as
  select p.*, c.slug as category_slug, c.name_zh as category_name_zh, c.name_en as category_name_en
  from public.prompts p
  left join public.categories c on c.id = p.category_id
  where p.is_published;

grant select on public.prompts_public to anon, authenticated;
