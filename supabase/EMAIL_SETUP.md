# Email-based ticket delivery — setup & deploy

Tickets and rejections are delivered **by email**, automatically, after an admin
changes `payment_status`. A Postgres trigger calls a Supabase Edge Function, which
renders a branded email and sends it through **SendGrid** (`/v3/mail/send`).

```
admin UPDATE payment_status ──▶ trigger (pg_net) ──▶ Edge Function ──▶ SendGrid ──▶ inbox
   pending → approved                              send-ticket-email
   pending → rejected                              send-rejection-email
```

## Prerequisites
- [Supabase CLI](https://supabase.com/docs/guides/cli) installed and `supabase login` done.
- A [SendGrid](https://sendgrid.com) account.
- A Gmail account you'll create just for sending (the verified single sender).
- This project linked: `supabase link --project-ref lbeicatsvzbvlfhqjkgg`

---

## 1. SendGrid (Single Sender Verification)
1. Sign up at sendgrid.com and finish onboarding.
2. **Verify the sender:** Settings → **Sender Authentication** → **Verify a Single Sender** →
   fill the form using your new **Gmail** address as the *From* address → click the
   confirmation link SendGrid emails to that Gmail. The `From` you use in `EMAIL_FROM`
   (step 3) **must exactly match** this verified address.
3. **API key:** Settings → **API Keys** → **Create API Key** → give it **Mail Send**
   permission (Restricted Access → enable *Mail Send*) → copy it (starts `SG.…`; shown once).

> ⚠️ **Deliverability note:** sending *from* an `@gmail.com` address through SendGrid means
> SPF/DKIM align to SendGrid, not Gmail, so some inboxes may file it under spam (Gmail's
> domain policy is lenient, so it won't be outright rejected). Fine for testing / low volume.
> For best inbox placement later, verify a custom domain (Domain Authentication) and send
> from `tickets@your-domain` instead.

## 2. Apply the migration
Run `supabase/migrations/20260619120000_email_delivery.sql` — either:
- `supabase db push`, or
- paste it into the Studio SQL editor and run.

This adds `rejection_reason` / `rejected_at` / `rejected_by`, enables `pg_net`, creates
`private.app_config`, and installs the trigger.

## 3. Set the Edge Function secrets
`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically — do **not** set
them. Set the rest (pick a long random `WEBHOOK_SECRET`, e.g. `openssl rand -hex 24`):

```bash
supabase secrets set \
  SENDGRID_API_KEY="SG.xxxxxxxx" \
  EMAIL_FROM="Seriously Joking <your-verified-gmail@gmail.com>" \
  WEBHOOK_SECRET="<long-random-string>" \
  SITE_URL="https://your-domain.vercel.app" \
  SUPPORT_PHONE="08080355773" \
  EVENT_DATE="2026-07-10T18:00:00+01:00" \
  EVENT_VENUE="Lavianto Lounge, Ikenegbu, Owerri"
```
> `EMAIL_FROM` must match the **Verified Single Sender** from step 1 (the `<…>` address).
> The display name before it is free text.

## 4. Deploy the functions
They authenticate with a shared secret (not a Supabase JWT), so deploy with
`--no-verify-jwt`:

```bash
supabase functions deploy send-ticket-email   --no-verify-jwt
supabase functions deploy send-rejection-email --no-verify-jwt
```

## 5. Point the trigger at the functions
In the Studio SQL editor (these values are **not** in git). `webhook_secret` here MUST
equal the `WEBHOOK_SECRET` you set in step 3:

```sql
insert into private.app_config (key, value) values
  ('edge_base_url',  'https://lbeicatsvzbvlfhqjkgg.functions.supabase.co'),
  ('webhook_secret', '<the same long-random-string>')
on conflict (key) do update set value = excluded.value;
```

---

## 6. Acceptance test
1. Make a fresh booking via the live registration form.
2. Approve it:
   ```sql
   update public.registrations
      set payment_status='approved', approved_at=now()
    where ref_number='SJ26-XXXX-XXXX';
   ```
   → ticket email should arrive within a minute. Confirm the **QR scans** and the
   **"View your ticket online"** link works.
3. Make another booking. Reject it (reason is **required**):
   ```sql
   update public.registrations
      set payment_status='rejected', rejected_at=now(),
          rejection_reason='Bank reference did not match any pending order'
    where ref_number='SJ26-YYYY-YYYY';
   ```
   → rejection email should arrive with the reason quoted.
4. Cleanup: `delete from public.registrations where ref_number in ('SJ26-XXXX-XXXX','SJ26-YYYY-YYYY');`

## Troubleshooting
- **No email?** Check the function logs: `supabase functions logs send-ticket-email`.
- **Trigger fired?** Inspect pg_net's async responses:
  ```sql
  select id, status_code, content, created
    from net._http_response order by created desc limit 5;
  ```
  A `401` means `webhook_secret` ≠ the function's `WEBHOOK_SECRET`. A `404`/timeout means
  `edge_base_url` is wrong (must be the `*.functions.supabase.co` host, no trailing slash).
- **Rejection 422** in logs = `rejection_reason` was null. Always set it in the same UPDATE.
- **SendGrid 401** = bad/old `SENDGRID_API_KEY`. **403 "from address does not match a
  verified Sender Identity"** = `EMAIL_FROM` ≠ your Verified Single Sender. **413** = payload
  too big (shouldn't happen here).
- **Email in spam?** Expected-ish with a Gmail `From` via SendGrid (see the deliverability
  note above) — check the spam folder during testing.

## Admin dashboard contract (separate project)
- **Approve:** set `payment_status='approved'`, `approved_at=now()`.
- **Reject:** set `payment_status='rejected'`, `rejected_at=now()`, optionally
  `rejected_by=auth.uid()`, and **always** `rejection_reason` (≤500 chars).
- Do nothing else — the trigger sends the email. Keep `private.app_config` populated.
