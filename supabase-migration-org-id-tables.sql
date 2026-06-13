-- Phase 4 — Refonte multi-comptes (Clerk Organizations)
-- Ajoute org_id sur les tables de données du club et migre AS Poincaré

alter table players              add column if not exists org_id text;
alter table player_invites       add column if not exists org_id text;
alter table player_physical_stats add column if not exists org_id text;
alter table trainings            add column if not exists org_id text;
alter table training_sessions    add column if not exists org_id text;
alter table matches              add column if not exists org_id text;
alter table match_lineups        add column if not exists org_id text;
alter table convocations         add column if not exists org_id text;

update players              set org_id = 'org_3F0WvOIrDYMhdoXadcHsazfJCWI' where owner_id = 'user_3E6KpNoP7KUQPMLk8mAlmeHJYq8';
update player_invites       set org_id = 'org_3F0WvOIrDYMhdoXadcHsazfJCWI' where owner_id = 'user_3E6KpNoP7KUQPMLk8mAlmeHJYq8';
update player_physical_stats set org_id = 'org_3F0WvOIrDYMhdoXadcHsazfJCWI' where owner_id = 'user_3E6KpNoP7KUQPMLk8mAlmeHJYq8';
update trainings            set org_id = 'org_3F0WvOIrDYMhdoXadcHsazfJCWI' where owner_id = 'user_3E6KpNoP7KUQPMLk8mAlmeHJYq8';
update training_sessions    set org_id = 'org_3F0WvOIrDYMhdoXadcHsazfJCWI' where owner_id = 'user_3E6KpNoP7KUQPMLk8mAlmeHJYq8';
update matches               set org_id = 'org_3F0WvOIrDYMhdoXadcHsazfJCWI' where owner_id = 'user_3E6KpNoP7KUQPMLk8mAlmeHJYq8';
update match_lineups         set org_id = 'org_3F0WvOIrDYMhdoXadcHsazfJCWI' where owner_id = 'user_3E6KpNoP7KUQPMLk8mAlmeHJYq8';
update convocations          set org_id = 'org_3F0WvOIrDYMhdoXadcHsazfJCWI' where owner_id = 'user_3E6KpNoP7KUQPMLk8mAlmeHJYq8';

create index if not exists players_org_id_idx              on players(org_id);
create index if not exists player_invites_org_id_idx       on player_invites(org_id);
create index if not exists player_physical_stats_org_id_idx on player_physical_stats(org_id);
create index if not exists trainings_org_id_idx            on trainings(org_id);
create index if not exists training_sessions_org_id_idx    on training_sessions(org_id);
create index if not exists matches_org_id_idx              on matches(org_id);
create index if not exists match_lineups_org_id_idx        on match_lineups(org_id);
create index if not exists convocations_org_id_idx         on convocations(org_id);
