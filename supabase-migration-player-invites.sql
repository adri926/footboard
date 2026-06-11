-- Coller ce SQL dans Supabase > SQL Editor > New Query > Run

-- Compte joueur lié à la fiche (Clerk user_id une fois le compte créé)
alter table players add column if not exists user_id text;
alter table players add column if not exists invite_status text not null default 'none';

-- Invitations envoyées aux joueurs (lien unique /invitation/[token])
create table if not exists player_invites (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players(id) on delete cascade,
  owner_id text not null,
  email text not null,
  token text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);
