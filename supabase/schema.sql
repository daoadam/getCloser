-- GetCloser — lead capture for the "move in together" simulator.
-- Run this in the Supabase SQL editor once a project exists.

create table if not exists public.scenarios (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text,
  area_id text not null,
  area_label text not null,
  combined_income integer not null,
  leftover integer not null,
  upfront integer not null,
  months_to_move_in integer,
  verdict text not null,
  lifestyle text not null
);

alter table public.scenarios enable row level security;

-- Anonymous visitors may save their own scenario (insert only); no one can read.
create policy "anon can insert scenarios"
  on public.scenarios for insert
  to anon
  with check (true);
