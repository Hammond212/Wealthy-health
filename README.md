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

## Chat assistant

A chat bubble (bottom right) answers common questions from the site's own data: services, prices, areas and travel fees, hours, cancellation, payment. It reads `CATS`, `AREAS` and `WA_NUMBER`, so it updates when you edit those. Unknown questions hand off to WhatsApp. The wording of the answers is in the `reply()` function near the end of `index.html`. It is not AI, so it only answers what is written there.

---

## New in this version

**Reminders and cancellation policy.** The last booking step shows the cancellation rule (free up to 4 hours before, later may be charged). In the dashboard, Upcoming has a **Send reminder** button on every confirmed booking (opens WhatsApp with the message ready) and a banner for sessions in the next 36 hours not yet reminded. Send reminders the day before.

**Health notes and boundaries.** Customers can add health notes when booking (pregnancy, injuries, allergies). You see them on the booking card in the dashboard. The "What to expect" section states what is and is not included.

**Reviews.** Customers send reviews from the site. They stay hidden until you open the dashboard, go to **Reviews**, and tap **Show on website**. No review is ever fake or pre-filled.

**Gift vouchers and packages.** Customers request a voucher (P300, P500, P800, P1200) or a package (3 sessions save 5%, 5 sessions save 10%). In the dashboard **Vouchers** tab: Send payment details, then Mark paid, then Issue code, then Send code. Edit amounts or discounts in `index.html` (search `var AM=` and `G.n===5?.10:.05`). Voucher terms (6 months, no cash exchange) are in the terms text; change them if your rules differ.

**Database.** Run the new `setup.sql` once more in Supabase SQL Editor (already applied to the live project).

## Get found on Google (about 20 minutes)

1. Go to business.google.com and create a **Business Profile** called Wealthy Health.
2. Choose **Spa** or **Massage therapist** as the category. Add Beauty salon and Health spa as extras.
3. Pick **Service area business** (you travel to customers). Hide any street address. Add Gaborone and the areas you serve.
4. Hours: daily 08:00 to 22:00. Phone: +267 75 945 724. Website: https://hammond212.github.io/Wealthy-health/
5. Add 5 to 10 real photos (treatments, setup, products). No stock photos.
6. Add each service with its price. Ask every happy client for a Google review (send the review link by WhatsApp after their session).
7. Put the same website link in your Instagram and Facebook bios.
8. In Google Search Console, add the site and submit `sitemap.xml`.

The site already has search tags, a social sharing preview and structured business data for Google. Put your own photo in the `<meta property="og:image">` tag later for a nicer link preview.

## Chat assistant: saved questions and low data use

Answers are worked out on the visitor's phone (no network, no AI cost) and repeat questions reuse a cached answer. Typed questions are cleaned of phone numbers and emails, counted on the device, and sent in one small batch (at most every 3 minutes, or when the chat closes). Open the dashboard **Questions** tab to see what clients ask most. Gold lines are questions the assistant could not answer: add those to the website or services. The dashboard also fetches reviews, vouchers, settings and time off only when you open their tab or every 5 minutes, so it uses less data. Approved reviews are cached on the visitor's device for 10 minutes.
