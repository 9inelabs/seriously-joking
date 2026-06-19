-- ============================================================
--  Seriously Joking — database schema
--  Run this in the Supabase SQL editor (Studio → SQL → New query).
--  Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE.
-- ============================================================

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- Tables
-- ------------------------------------------------------------
create table if not exists public.registrations (
  id              uuid primary key default gen_random_uuid(),
  ref_number      text not null unique,
  ticket_id       text not null unique,
  package_type    text not null check (package_type in ('regular','vip','table_5','table_8','premium')),
  full_name       text not null,
  email           text not null,
  phone           text not null,
  table_name      text,
  seats           integer not null default 1,
  amount          integer not null default 0,           -- in Naira
  payment_status  text not null default 'pending' check (payment_status in ('pending','approved','rejected')),
  transfer_ref    text,
  created_at      timestamptz not null default now(),
  approved_at     timestamptz
);

create index if not exists registrations_ref_idx on public.registrations (ref_number);

create table if not exists public.guests (
  id               uuid primary key default gen_random_uuid(),
  registration_id  uuid not null references public.registrations(id) on delete cascade,
  seat_number      integer not null,
  name             text,
  contact          text,
  created_at       timestamptz not null default now(),
  unique (registration_id, seat_number)
);

-- ------------------------------------------------------------
-- Row Level Security
--   We expose NO direct table access to the anon role. All reads/writes
--   go through SECURITY DEFINER functions below, so the public can only:
--     * create their own registration
--     * fetch a registration by its exact ref
--     * attach a transfer reference to their own registration
--   They can never list or read other people's records.
-- ------------------------------------------------------------
alter table public.registrations enable row level security;
alter table public.guests        enable row level security;
-- (no policies = no direct anon access; definer functions bypass RLS)

-- ------------------------------------------------------------
-- Helper: shape a registration + its guests as a single json object
-- ------------------------------------------------------------
create or replace function public.registration_json(p_id uuid)
returns jsonb
language sql
stable
as $$
  select to_jsonb(r) || jsonb_build_object(
    'guests',
    coalesce(
      (select jsonb_agg(jsonb_build_object(
         'seat_number', g.seat_number,
         'name', g.name,
         'contact', g.contact
       ) order by g.seat_number)
       from public.guests g where g.registration_id = r.id),
      '[]'::jsonb
    )
  )
  from public.registrations r
  where r.id = p_id;
$$;

-- ------------------------------------------------------------
-- RPC: fetch a registration (+ guests) by ref number
-- ------------------------------------------------------------
create or replace function public.get_registration_by_ref(p_ref text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  select id into v_id from public.registrations where ref_number = p_ref;
  if v_id is null then
    return null;
  end if;
  return public.registration_json(v_id);
end;
$$;

-- ------------------------------------------------------------
-- RPC: create a registration (+ optional guests) atomically.
--   Raises unique_violation if the ref/ticket already exists; the client
--   retries with a freshly generated ref.
--   p_guests is a json array of { seat_number, name, contact }.
-- ------------------------------------------------------------
create or replace function public.create_registration(
  p_ref          text,
  p_ticket_id    text,
  p_package_type text,
  p_full_name    text,
  p_email        text,
  p_phone        text,
  p_table_name   text,
  p_seats        integer,
  p_amount       integer,
  p_guests       jsonb default '[]'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_guest jsonb;
begin
  insert into public.registrations
    (ref_number, ticket_id, package_type, full_name, email, phone, table_name, seats, amount)
  values
    (p_ref, p_ticket_id, p_package_type, p_full_name, p_email, p_phone,
     nullif(p_table_name, ''), p_seats, p_amount)
  returning id into v_id;

  if p_guests is not null and jsonb_typeof(p_guests) = 'array' then
    for v_guest in select * from jsonb_array_elements(p_guests)
    loop
      insert into public.guests (registration_id, seat_number, name, contact)
      values (
        v_id,
        (v_guest->>'seat_number')::int,
        nullif(v_guest->>'name', ''),
        nullif(v_guest->>'contact', '')
      );
    end loop;
  end if;

  return public.registration_json(v_id);
end;
$$;

-- ------------------------------------------------------------
-- RPC: attach a transfer reference to a pending registration
-- ------------------------------------------------------------
create or replace function public.set_transfer_ref(p_ref text, p_transfer_ref text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  update public.registrations
     set transfer_ref = nullif(p_transfer_ref, '')
   where ref_number = p_ref
  returning id into v_id;

  if v_id is null then
    return null;
  end if;
  return public.registration_json(v_id);
end;
$$;

-- ------------------------------------------------------------
-- Grants — let the public (anon) role call the RPCs, nothing else
-- ------------------------------------------------------------
grant execute on function public.get_registration_by_ref(text) to anon, authenticated;
grant execute on function public.create_registration(text,text,text,text,text,text,text,integer,integer,jsonb) to anon, authenticated;
grant execute on function public.set_transfer_ref(text,text) to anon, authenticated;

-- ============================================================
--  Manual approval (admin) — while testing, run this to approve a row:
--
--    update public.registrations
--       set payment_status = 'approved', approved_at = now()
--     where ref_number = 'SJ26-XXXX-0000';
--
--  Or to reject:
--    update public.registrations set payment_status = 'rejected'
--     where ref_number = 'SJ26-XXXX-0000';
-- ============================================================
