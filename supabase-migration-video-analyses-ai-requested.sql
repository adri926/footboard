-- Distingue "IA jamais demandée" (upload en mode manuel) de "IA demandée".
-- Défaut true : préserve le comportement de toutes les lignes existantes,
-- qui ont toutes eu une tentative d'analyse IA.

alter table video_analyses
  add column if not exists ai_requested boolean not null default true;
