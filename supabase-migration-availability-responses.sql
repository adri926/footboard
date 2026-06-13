-- Coller ce SQL dans Supabase > SQL Editor > New Query > Run

-- Réponses de présence des joueurs aux matchs (Présent / Absent)
create table if not exists availability_responses (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references matches(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  owner_id text not null,
  org_id text,
  status text not null check (status in ('present','absent')),
  responded_at timestamptz default now(),
  unique (match_id, player_id)
);

create index if not exists idx_availability_responses_match_id on availability_responses(match_id);
create index if not exists idx_availability_responses_org_id   on availability_responses(org_id);
