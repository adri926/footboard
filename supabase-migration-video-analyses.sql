-- Module "Analyse vidéo" (IA Gemini)

-- Bucket de stockage des vidéos (privé, accès via service role uniquement)
insert into storage.buckets (id, name, public)
values ('match-videos', 'match-videos', false)
on conflict (id) do nothing;

-- Une analyse = une vidéo uploadée + son état de traitement
create table video_analyses (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null,
  org_id text,
  title text not null default 'Match',
  video_path text not null,        -- chemin dans le bucket match-videos
  gemini_file_uri text,            -- URI Files API Gemini (valable ~48h)
  gemini_cache_name text,          -- nom du cache de contexte Gemini (Q&A sans re-upload)
  gemini_cache_expires_at timestamptz,
  status text not null default 'uploading', -- uploading | processing | ready | error
  error_message text,
  created_at timestamptz not null default now()
);

-- Timeline d'événements générée par Gemini
create table analysis_events (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid not null references video_analyses(id) on delete cascade,
  timestamp_sec integer not null,
  label text not null,             -- ex: "But", "Carton jaune", "Occasion"
  description text not null,
  created_at timestamptz not null default now()
);

-- RLS désactivée (cohérent avec le reste du projet — sécurité via owner_id/org_id + Clerk)
