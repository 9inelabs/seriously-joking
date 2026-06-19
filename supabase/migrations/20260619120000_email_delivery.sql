-- ============================================================
--  Email-based ticket delivery
--  Adds rejection metadata, and a trigger that calls the right Edge Function
--  (send-ticket-email / send-rejection-email) whenever payment_status moves
--  out of 'pending'. Idempotent / safe to re-run.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Schema additions
-- ------------------------------------------------------------
alter table public.registrations
  add column if not exists rejection_reason text,
  add column if not exists rejected_at      timestamptz,
  add column if not exists rejected_by       uuid references auth.users(id);

-- Keep rejection_reason sane in length (mirrors the 500-char admin field).
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'registrations_rejection_reason_len'
  ) then
    alter table public.registrations
      add constraint registrations_rejection_reason_len
      check (rejection_reason is null or char_length(rejection_reason) <= 500);
  end if;
end $$;

-- ------------------------------------------------------------
-- 2. pg_net — async HTTP from Postgres (preinstalled on Supabase)
-- ------------------------------------------------------------
create extension if not exists pg_net;

-- ------------------------------------------------------------
-- 3. Private config — NO secrets live in this migration (git-safe).
--    Populate once with your real values (see supabase/EMAIL_SETUP.md):
--
--      insert into private.app_config (key, value) values
--        ('edge_base_url', 'https://<project-ref>.functions.supabase.co'),
--        ('webhook_secret', '<a-long-random-string>')
--      on conflict (key) do update set value = excluded.value;
-- ------------------------------------------------------------
create schema if not exists private;

create table if not exists private.app_config (
  key   text primary key,
  value text not null
);

-- Lock it down — only the definer-owned trigger function reads it.
revoke all on schema private from anon, authenticated;
revoke all on private.app_config from anon, authenticated;

-- ------------------------------------------------------------
-- 4. Trigger function — fire the matching Edge Function on transition
-- ------------------------------------------------------------
create or replace function public.on_registration_status_change()
returns trigger
language plpgsql
security definer
set search_path = public, private, extensions
as $$
declare
  v_base   text;
  v_secret text;
  v_fn     text;
begin
  -- only act on an actual status change
  if new.payment_status is not distinct from old.payment_status then
    return new;
  end if;

  if old.payment_status = 'pending' and new.payment_status = 'approved' then
    v_fn := 'send-ticket-email';
  elsif old.payment_status = 'pending' and new.payment_status = 'rejected' then
    v_fn := 'send-rejection-email';
  else
    return new; -- any other transition: no email
  end if;

  select value into v_base   from private.app_config where key = 'edge_base_url';
  select value into v_secret from private.app_config where key = 'webhook_secret';

  if v_base is null or v_secret is null then
    raise warning 'app_config missing edge_base_url/webhook_secret; no email sent for %', new.ref_number;
    return new;
  end if;

  -- async: never block (or fail) the admin's UPDATE on email delivery
  perform net.http_post(
    url     := v_base || '/' || v_fn,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-webhook-secret', v_secret
    ),
    body    := jsonb_build_object('registration_id', new.id)
  );

  return new;
end;
$$;

drop trigger if exists trg_registration_status_change on public.registrations;
create trigger trg_registration_status_change
  after update of payment_status on public.registrations
  for each row
  execute function public.on_registration_status_change();

-- ============================================================
--  ADMIN CONTRACT (important for the separate admin dashboard):
--   • To APPROVE:  update ... set payment_status='approved', approved_at=now()
--                  where ref_number = '...';
--   • To REJECT:   update ... set payment_status='rejected', rejected_at=now(),
--                  rejected_by = auth.uid(),            -- optional
--                  rejection_reason = '<required, <=500 chars>'
--                  where ref_number = '...';
--     The rejection email REQUIRES rejection_reason — the Edge Function refuses
--     to send without one. Always set it in the SAME update as the status.
--   • The trigger fires on payment_status change only; emails send themselves.
-- ============================================================
