-- Phase 9.2 — Situations en plusieurs temps + branches
-- Ajoute les frames authored et les branches alternatives sur built_situations

alter table built_situations add column if not exists frames jsonb not null default '[]'::jsonb;
alter table built_situations add column if not exists branches jsonb not null default '[]'::jsonb;
