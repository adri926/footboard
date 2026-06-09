-- Coller ce SQL dans Supabase > SQL Editor > New Query > Run

-- Clubs
create table if not exists clubs (
  id          uuid primary key default gen_random_uuid(),
  owner_id    text not null,        -- Clerk user ID
  name        text not null,
  logo        text,
  level       text,
  city        text,
  created_at  timestamptz default now()
);

-- Joueurs du club
create table if not exists club_players (
  id          uuid primary key default gen_random_uuid(),
  club_id     uuid references clubs(id) on delete cascade,
  first_name  text not null,
  last_name   text not null,
  position    text not null check (position in ('GK','DEF','MIL','ATT')),
  number      int,
  photo       text,
  status      text not null default 'available' check (status in ('available','injured','suspended')),
  birth_date  date,
  email       text,
  phone       text,
  created_at  timestamptz default now()
);

-- Entraînements
create table if not exists trainings (
  id          uuid primary key default gen_random_uuid(),
  club_id     uuid references clubs(id) on delete cascade,
  date        timestamptz not null,
  location    text,
  theme       text,
  notes       text,
  created_at  timestamptz default now()
);

-- Présences entraînement
create table if not exists training_attendance (
  id          uuid primary key default gen_random_uuid(),
  training_id uuid references trainings(id) on delete cascade,
  player_id   uuid references club_players(id) on delete cascade,
  status      text not null default 'absent' check (status in ('present','absent','late','excused')),
  unique (training_id, player_id)
);

-- Matchs
create table if not exists matches (
  id           uuid primary key default gen_random_uuid(),
  club_id      uuid references clubs(id) on delete cascade,
  date         timestamptz not null,
  opponent     text not null,
  home_away    text not null check (home_away in ('home','away')),
  competition  text,
  goals_for    int,
  goals_against int,
  notes        text,
  lineup       jsonb,     -- { playerId: {x, y} }
  formation    text,
  created_at   timestamptz default now()
);

-- Stats joueurs par match
create table if not exists match_stats (
  id             uuid primary key default gen_random_uuid(),
  match_id       uuid references matches(id) on delete cascade,
  player_id      uuid references club_players(id) on delete cascade,
  goals          int default 0,
  assists        int default 0,
  yellow_cards   int default 0,
  red_cards      int default 0,
  minutes_played int default 90,
  unique (match_id, player_id)
);

-- RLS (Row Level Security) — chaque user voit seulement son club
alter table clubs             enable row level security;
alter table club_players      enable row level security;
alter table trainings         enable row level security;
alter table training_attendance enable row level security;
alter table matches           enable row level security;
alter table match_stats       enable row level security;

-- Policies : owner_id = Clerk user ID passé via header
create policy "owner clubs"    on clubs             for all using (owner_id = current_setting('app.user_id', true));
create policy "owner players"  on club_players      for all using (club_id in (select id from clubs where owner_id = current_setting('app.user_id', true)));
create policy "owner trainings" on trainings        for all using (club_id in (select id from clubs where owner_id = current_setting('app.user_id', true)));
create policy "owner attendance" on training_attendance for all using (training_id in (select t.id from trainings t join clubs c on t.club_id = c.id where c.owner_id = current_setting('app.user_id', true)));
create policy "owner matches"  on matches           for all using (club_id in (select id from clubs where owner_id = current_setting('app.user_id', true)));
create policy "owner stats"    on match_stats       for all using (match_id in (select m.id from matches m join clubs c on m.club_id = c.id where c.owner_id = current_setting('app.user_id', true)));

-- Paperboards tactiques (schémas du coach : pions + tracés, sécurité via filtre coach_id côté action)
create table if not exists tactical_boards (
  id          uuid primary key default gen_random_uuid(),
  coach_id    text not null,        -- Clerk user ID
  name        text not null,
  formation   text,
  pions       jsonb not null default '[]',
  drawings    jsonb not null default '[]',
  mode        text not null default 'preparation' check (mode in ('preparation','direct','analyse')),
  created_at  timestamptz default now()
);
