-- Phase 2 — Refonte multi-comptes (Clerk Organizations)
-- Ajoute org_id sur clubs et migre le club existant (AS Poincaré)
-- owner_id est conservé temporairement (legacy) le temps du refactor (Phase 4)

alter table clubs add column if not exists org_id text;

update clubs
set org_id = 'org_3F0WvOIrDYMhdoXadcHsazfJCWI'
where owner_id = 'user_3E6KpNoP7KUQPMLk8mAlmeHJYq8';

create index if not exists clubs_org_id_idx on clubs(org_id);
