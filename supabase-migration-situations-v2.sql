-- Phase 9.1 — Refonte Situations v2 : scope club + vocabulaire tactique
-- built_situations passe au scoping org_id/owner_id (lib/scope.ts) + ajout des tags

alter table built_situations add column if not exists org_id text;
alter table built_situations add column if not exists tags text[] default '{}';

update built_situations set org_id = 'org_3F0WvOIrDYMhdoXadcHsazfJCWI' where owner_id = 'user_3E6KpNoP7KUQPMLk8mAlmeHJYq8';

create index if not exists built_situations_org_id_idx on built_situations(org_id);
