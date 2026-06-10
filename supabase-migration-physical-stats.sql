-- Coller ce SQL dans Supabase > SQL Editor > New Query > Run
-- (déjà exécuté le 2026-06-10)

-- Données physiques par joueur (saisie manuelle par le coach, match ou entraînement)
-- RLS désactivée (comme les autres tables) — sécurité via Clerk + filtres owner_id côté actions
create table if not exists player_physical_stats (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null,
  player_id uuid not null references players(id) on delete cascade,
  date date not null,
  context text not null default 'entrainement',
  distance_m int,
  sprints int,
  vmax_kmh numeric(4,1),
  notes text,
  created_at timestamptz default now()
);
