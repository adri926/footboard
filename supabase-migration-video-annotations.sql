-- Annotations libres dessinées par le coach sur une image figée de la vidéo
-- (flèches, zones, texte, traits libres) — indépendant de l'IA, même schéma
-- de Drawing que le digiboard (types/tactical.ts) mais validé séparément ici
-- par convention projet (pas de dépendance vers app/tactique/digiboard/).

create table video_annotations (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid not null references video_analyses(id) on delete cascade,
  owner_id text not null,
  org_id text,
  timestamp_sec numeric not null,
  drawings jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index video_annotations_analysis_id_idx on video_annotations(analysis_id);
