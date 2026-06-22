-- Phase 4 du chantier "Analyse vidéo IA approfondie" :
-- identification best-effort des joueurs par numéro de maillot sur les événements détectés.

alter table analysis_events
  add column if not exists jersey_number integer,
  add column if not exists player_id uuid references players(id) on delete set null;
