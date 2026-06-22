create table if not exists player_fees (
  id          uuid primary key default gen_random_uuid(),
  player_id   uuid not null references players(id) on delete cascade,
  owner_id    text not null,
  org_id      text,
  season      text not null,
  amount_due  numeric(8,2) not null default 0,
  amount_paid numeric(8,2) not null default 0,
  paid_at     date,
  notes       text,
  created_at  timestamptz not null default now(),
  unique (player_id, season)
);

create index if not exists player_fees_org_id_idx on player_fees(org_id);
create index if not exists player_fees_owner_id_idx on player_fees(owner_id);