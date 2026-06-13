create table if not exists subscriptions (
  id         uuid primary key default gen_random_uuid(),
  club_id    uuid not null references clubs(id) on delete cascade unique,
  plan       text not null default 'solo' check (plan in ('solo', 'club')),
  status     text not null default 'active',
  created_at timestamptz not null default now()
);

insert into subscriptions (club_id, plan)
select id, 'solo' from clubs
on conflict (club_id) do nothing;

update subscriptions
set plan = 'club'
where club_id = (select id from clubs where org_id = 'org_3F0WvOIrDYMhdoXadcHsazfJCWI');
