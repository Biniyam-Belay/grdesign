-- Required for gen_random_uuid()
create extension if not exists pgcrypto;

-- Blogs table
create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null,
  cover text not null,
  date timestamptz not null,
  tags text[] default '{}',
  content text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Projects table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null,
  thumb text not null,
  video text,
  roles text[] not null,
  tools text[],
  alt text,
  credits text,
  gallery jsonb, -- [{src,alt}]
  mobile_hero_src text,
  problem text,
  solution text,
  highlights text[],
  approach text,
  process jsonb, -- [{title,body}]
  outcome text,
  deliverables text[],
  year text,
  client text,
  featured_aspect text,
  featured_src text,
  featured_alt text,
  featured boolean default false,
  type text check (type in ('web-dev','ui-ux','branding','social','print')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Triggers to keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger blogs_updated_at
before update on public.blogs
for each row execute function public.set_updated_at();

create trigger projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

-- Enable RLS
alter table public.blogs enable row level security;
alter table public.projects enable row level security;

-- Policies: read for anon, write for authenticated (adjust later for CMS)
create policy "Blogs are readable by anyone" on public.blogs
  for select using (true);
create policy "Projects are readable by anyone" on public.projects
  for select using (true);

create policy "Blogs write by authenticated" on public.blogs
  for insert with check (auth.role() = 'authenticated');
create policy "Blogs update by authenticated" on public.blogs
  for update using (auth.role() = 'authenticated');
create policy "Blogs delete by authenticated" on public.blogs
  for delete using (auth.role() = 'authenticated');

create policy "Projects write by authenticated" on public.projects
  for insert with check (auth.role() = 'authenticated');
create policy "Projects update by authenticated" on public.projects
  for update using (auth.role() = 'authenticated');
create policy "Projects delete by authenticated" on public.projects
  for delete using (auth.role() = 'authenticated');
