alter table subscriptions
  add column if not exists stripe_subscription_id text;
