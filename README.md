# Wealthy Health: Website + Booking System

Massage, mobile spa and wellness, Gaborone, Botswana.
Hours: daily 08:00 to 22:00 (Africa/Gaborone, UTC+02:00).

## Files

| File | What it is |
|---|---|
| `index.html` | Public website with the step-by-step booking flow |
| `admin.html` | Private owner dashboard (bookings, time off, settings) |
| `setup.sql` | Database setup for Supabase (tables, security, booking functions) |

All three are plain HTML/SQL. No build step, no frameworks.

## How it works

1. A customer picks a service, then a date (calendar) and time (clock), then enters name, phone and email, and ticks the policy and terms box. A second optional box lets them opt in to offers and discounts.
2. The site shows only free times and saves the booking to Supabase. The database blocks double bookings, even if two people book at the same moment.
3. The owner opens `admin.html`, sees the request, and taps Confirm or Decline.
4. "Tell customer" opens WhatsApp with a ready message. WhatsApp is only for talking to the customer, not for taking bookings.

If the booking system can't be reached, the site falls back to sending the request via WhatsApp so no booking is lost.

## Setup (about 10 minutes)

1. Create a free project at https://supabase.com.
2. Open **SQL Editor**, paste all of `setup.sql`, run it.
3. Go to **Authentication → Users → Add user**. Create the owner's email and password.
4. Go to **Authentication → Providers → Email** and turn off public sign-ups.
5. In the SQL Editor, run (use the owner's email):
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'OWNER_EMAIL_HERE'
   on conflict do nothing;
   ```
6. Go to **Project Settings → API**. Copy the Project URL and the `anon` public key.
7. In both `index.html` and `admin.html`, find this line and fill it in:
   ```js
   var BACKEND={url:'',key:''};
   ```
8. In `index.html`, set `WA_NUMBER` to the real WhatsApp number (digits only, with country code, e.g. `26771234567`).
9. Host the files (Netlify, Vercel, Cloudflare Pages or any static host). Keep the owner link (`/admin.html`) private.

Only use the `anon` key. Never put the `service_role` key in these files.

## Settings (owner dashboard, Settings tab)

- **Therapists working at once:** default 2. Controls how many overlapping bookings are allowed.
- **Travel buffer:** default 30 minutes between bookings.
- **Confirm automatically:** default off, so the owner approves each request.

Use the **Time off** tab to block holidays or leave.

## Customising the site (`index.html`)

- `CATS`: services, treatments and prices (60 / 90 / 120 min).
- `AREAS`: travel areas and fees.
- `TIMES`: bookable start times.
- `PHOTOS`: image URLs (replace with your own photos for best results).
- Landing page has 4 looks. A temporary switcher (`#look`) lets you compare them. Once you pick one, delete the `#look` switcher and its script block.

## Notes

- The price total is calculated in the browser and saved as an estimate. Confirm final prices with the customer.
- Photos and live booking only work when the site is hosted. A local file or sandbox preview will run in WhatsApp-only mode.
- Customer phone numbers are personal data. Keep the dashboard login private and sign out on shared devices.
- Optional: in Supabase, add a Database Webhook on `bookings` (insert) to Zapier/Make to get an email or WhatsApp alert when a booking arrives.

## Contacts

- Email: wealthyhealth44@gmail.com
- Instagram: WealthyHealth.Bw
- Facebook: wealthyhealth44

## Policy and terms

The text is in `index.html` (search `TERMS_HTML`). It is a starting draft: have the owner review and edit it before launch. The database stores whether each customer agreed and whether they opted in to offers, so the owner can see who to send offers to.
