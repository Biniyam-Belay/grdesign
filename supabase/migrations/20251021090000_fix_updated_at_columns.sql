-- Ensure updated_at columns exist to satisfy triggers
alter table if exists public.projects
  add column if not exists updated_at timestamptz;

alter table if exists public.blogs
  add column if not exists updated_at timestamptz;

-- Set defaults (do not enforce NOT NULL to keep flexibility)
alter table if exists public.projects
  alter column updated_at set default now();

alter table if exists public.blogs
  alter column updated_at set default now();

-- Backfill any nulls so subsequent updates work without issues
update public.projects set updated_at = coalesce(updated_at, now());
update public.blogs set updated_at = coalesce(updated_at, now());
