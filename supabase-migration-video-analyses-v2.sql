-- Phase 0 du chantier "Analyse vidéo IA approfondie" :
-- lien optionnel vers un match, résumé narratif, catégorisation des événements.

alter table video_analyses
  add column if not exists match_id uuid references matches(id) on delete set null,
  add column if not exists summary text;

alter table analysis_events
  add column if not exists event_type text not null default 'autre'
    check (event_type in ('but', 'occasion', 'carton', 'changement', 'tactique', 'autre'));
