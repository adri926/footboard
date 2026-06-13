-- Coller ce SQL dans Supabase > SQL Editor > New Query > Run

-- Phase 8.1 — Fondations multi-équipes
-- Table teams + team_players (many-to-many) + team_id sur matches/trainings
-- Crée "Équipe 1" par défaut pour AS Poincaré et y rattache tout l'existant (idempotent)

create table if not exists teams (
  id         uuid primary key default gen_random_uuid(),
  owner_id   text not null,
  org_id     text,
  name       text not null,
  created_at timestamptz not null default now()
);

create index if not exists teams_org_id_idx on teams(org_id);
create index if not exists teams_owner_id_idx on teams(owner_id);

create table if not exists team_players (
  team_id   uuid not null references teams(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  primary key (team_id, player_id)
);

alter table matches   add column if not exists team_id uuid references teams(id);
alter table trainings add column if not exists team_id uuid references teams(id);

-- Équipe par défaut pour AS Poincaré (idempotent)
insert into teams (owner_id, org_id, name)
select 'user_3E6KpNoP7KUQPMLk8mAlmeHJYq8', 'org_3F0WvOIrDYMhdoXadcHsazfJCWI', 'Équipe 1'
where not exists (
  select 1 from teams where org_id = 'org_3F0WvOIrDYMhdoXadcHsazfJCWI'
);

-- Rattacher tous les joueurs existants à l'équipe par défaut
insert into team_players (team_id, player_id)
select t.id, p.id
from players p
join teams t on t.org_id = p.org_id
on conflict do nothing;

-- Rattacher tous les matchs/entraînements existants à l'équipe par défaut
update matches m set team_id = t.id
from teams t where t.org_id = m.org_id and m.team_id is null;

update trainings tr set team_id = tt.id
from teams tt where tt.org_id = tr.org_id and tr.team_id is null;
