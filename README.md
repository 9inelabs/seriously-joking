# Seriously Joking — Registration Site

The public-facing registration site for **Seriously Joking — Live with MC Oga Micko**
(Fri 10 July 2026 · Lavianto Lounge, Owerri). Attendees pick a package, register,
pay by manual bank transfer, wait for human confirmation, and receive a QR ticket.

> The admin dashboard (screen 06 of the design mockup) is a **separate project** and is
> intentionally not part of this codebase.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** — theme tokens lifted verbatim from the design mockup
- **Supabase** (`@supabase/supabase-js`) — Postgres + RPCs
- **react-hook-form** + **zod** — forms & validation
- **Framer Motion** — marquee, page fades, pending pulse
- **lucide-react** — icons
- **qrcode.react** — the real ticket QR
- **html2canvas** + **jspdf** — ticket PDF export
- Fonts via `next/font`: Anton, Allura, Inter, JetBrains Mono

## Screens / routes

| Route | Purpose |
|---|---|
| `/` | Landing — hero, packages, trust, sponsors, footer |
| `/register?package=<slug>` | Attendee/host details (`regular` `vip` `table_5` `table_8` `premium`) |
| `/payment/[refNumber]` | Bank-transfer instructions |
| `/pending/[refNumber]` | Awaiting confirmation — polls every 8s |
| `/ticket/[refNumber]` | Issued ticket with QR + PDF download (approved only) |

## Local development

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

### Environment variables (`.env.local`)

| Var | Notes |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | **API** URL: `https://<project-ref>.supabase.co` (not the dashboard URL) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon / `sb_publishable_…` key |
| `NEXT_PUBLIC_BANK_NAME` / `_ACCOUNT_NAME` / `_ACCOUNT_NUMBER` | Shown on the payment screen |
| `NEXT_PUBLIC_EVENT_DATE` | ISO 8601, e.g. `2026-07-10T18:00:00+01:00` |
| `NEXT_PUBLIC_EVENT_VENUE` | Venue line |
| `NEXT_PUBLIC_SUPPORT_PHONE` | Support number for error/rejected states |
| `NEXT_PUBLIC_SITE_URL` | Public origin — used by sitemap/robots/OG |

## Database setup

Run [`supabase/schema.sql`](./supabase/schema.sql) in the Supabase SQL editor. It creates:

- `registrations` and `guests` tables (RLS enabled, **no direct table access**)
- `SECURITY DEFINER` RPCs the public may call: `create_registration`,
  `get_registration_by_ref`, `set_transfer_ref`

### Approving / rejecting a payment (manual, by a human)

```sql
-- approve
update public.registrations
   set payment_status = 'approved', approved_at = now()
 where ref_number = 'SJ26-XXXX-0000';

-- reject
update public.registrations
   set payment_status = 'rejected'
 where ref_number = 'SJ26-XXXX-0000';
```

The pending page polls every 8s and moves the attendee to their ticket automatically
on approval (or shows an apologetic state on rejection).

## The headliner photo

The hero shows an on-brand gold-rim **silhouette placeholder** until you drop a real
photo at **`/public/portrait.jpg`** (portrait orientation, ~4:5). No code change needed.

## Deploy to Vercel

1. Push this repo to GitHub/GitLab.
2. **New Project** in Vercel → import the repo (framework auto-detected as Next.js).
3. Add every `NEXT_PUBLIC_*` var from `.env.local` under **Settings → Environment Variables**
   (set `NEXT_PUBLIC_SITE_URL` to your Vercel domain).
4. Deploy. Vercel runs `next build` in its own cloud environment.

## Accessibility & motion

- Semantic landmarks, labelled form fields, visible gold focus rings, a skip link.
- `prefers-reduced-motion` disables the marquee, pending pulse, and page fades.

## Notes

- `npm run build` may run out of memory **locally** if your system drive is nearly
  full (it OOMs at the final "collect traces" step after successfully compiling and
  type-checking). This does not affect Vercel, which builds in the cloud. Free a few GB
  on the system drive to build locally.
