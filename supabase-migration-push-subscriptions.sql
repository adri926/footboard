-- Coller ce SQL dans Supabase > SQL Editor > New Query > Run

-- Abonnements push (Web Push API) liés au compte Clerk de l'utilisateur
create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz default now()
);

create index if not exists idx_push_subscriptions_user_id on push_subscriptions(user_id);
