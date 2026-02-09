# WIMESSA Website

React + Vite frontend for WIMESSA (Women in Islamic and Middle Eastern Studies in South Asia). Features a contact form via Supabase (Edge Function + Resend), optional Express API for events (Google Calendar iCal), and Maktoub annual publication with PDF flipbook viewer.

---

## Site structure

| Page | Route | Description |
|------|-------|-------------|
| Home | `/:locale` (e.g. `/en`, `/fr`) | Hero, About section, Upcoming Events |
| About | `/:locale/about` | About WIMESSA, mission, team |
| Events | `/:locale/events` | Calendar view (react-big-calendar) of upcoming events |
| Event Detail | `/:locale/events/:id` | Individual event page with date, time, location, description |
| Maktoub | `/:locale/maktoub` | Annual publication archive (years 2022–2024) |
| Maktoub Year | `/:locale/maktoub/:year` | PDF flipbook viewer for a given year |
| Contact | `/:locale/contact` | Contact form (Supabase or Node API) |

---

## Tech stack

- **Frontend:** React 19, Vite 7, react-router-dom
- **i18n:** react-i18next — English, French, and Arabic with URL-prefixed routes (`/en/...`, `/fr/...`, `/ar/...`). Arabic uses RTL layout.
- **Contact form:** Supabase Edge Function + Resend (or optional Node API fallback)
- **Events:** Optional Express API parsing Google Calendar iCal; `useEvents` hook; react-big-calendar, date-fns
- **Maktoub:** react-pageflip, react-pdf for PDF flipbook viewer
- **Deployment:** GitHub Actions → FTP deploy to SiteGround

---

## Private information and security

**This repository contains no secrets.** If you clone the repo, you get only code and config templates. No API keys, passwords, or private email addresses are committed.

- **Never committed (gitignored):**  
  `.env`, `.env.development`, `.env.production` — these hold API keys, passwords, and email addresses. They are in [.gitignore](.gitignore) and must stay out of the repo.

- **What you must do after cloning:**  
  Create your own `.env` by copying [.env.example](.env.example). Fill in your own values (Resend API key, Gmail App Password, contact email, etc.). **Do not commit `.env`** or paste real keys into any file that gets committed.

- **What belongs where:**  
  - **Local development:** Put secrets only in `.env` (or `.env.development`) on your machine.  
  - **Production frontend (e.g. GitHub Actions):** Use **Settings → Secrets and variables → Actions** for `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL`, `VITE_EVENTS_API`.  
  - **Production backend (e.g. Render):** Use the host's **Environment** / **Variables** for `GOOGLE_CALENDAR_ICAL_URL` etc. if you run the Node API.  
  - **Supabase contact form:** Set secrets in Supabase Dashboard (Resend, contact email, etc.).

- **If you ever commit a secret:** Rotate it immediately (new API key, new password) and remove the secret from git history (e.g. `git filter-branch` or BFG Repo-Cleaner). Consider the old value compromised.

---

## First-time setup (after cloning)

```bash
npm install
cp .env.example .env
```

Edit `.env` and add your own values (see [Environment variables](#environment-variables) below). Do not commit `.env`.

---

## Running locally

- **Frontend:** `npm run dev` (Vite dev server; proxies `/api` to the backend).
- **Backend (optional):** `npm run server` (Express on port 3001).

---

## Contact form

The contact form uses **Supabase** (Edge Function + Resend). It stores submissions in a Supabase table and sends email notifications.

### Supabase setup

1. **Create a Supabase project** and enable the Database.

2. **Create the `contact_submissions` table:**
   ```sql
   CREATE TABLE contact_submissions (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     name TEXT NOT NULL,
     email TEXT NOT NULL,
     subject TEXT,
     message TEXT NOT NULL
   );
   ```

3. **Deploy the Edge Function:**
   ```bash
   supabase functions deploy contact --no-verify-jwt
   ```

4. **Set Supabase secrets** (Dashboard → Edge Functions → contact → Secrets):
   - `RESEND_API_KEY` — Resend API key
   - `CONTACT_EMAIL` — Email that receives submissions
   - `SMTP_FROM` (optional) — "From" address for Resend (e.g. `onboarding@resend.dev`)

5. **Set `.env`** with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (from Supabase Dashboard → Settings → API).

6. Start the frontend: `npm run dev`, go to **Contact**, fill the form, and submit.

If the form says "Contact form is not configured", ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in `.env` and in GitHub Actions secrets for production.

### Optional: Node API fallback

If Supabase is not configured, the frontend can use the Express API (`POST /api/contact`). See [Environment variables](#environment-variables) for `CONTACT_EMAIL`, `RESEND_API_KEY`, and SMTP vars.

---

## Events

Events are loaded from `VITE_EVENTS_API`, which can point to the Node API (`/api/events`) or another compatible JSON API.

- **Node API:** Set `GOOGLE_CALENDAR_ICAL_URL` in `.env`. The server fetches the public iCal feed, parses it, and returns events as JSON. In production, host the API (e.g. Render) and set `VITE_EVENTS_API` to its `/api/events` URL.
- **Frontend:** The `useEvents` hook fetches events and normalizes them for react-big-calendar. Supports both `{ events }` and `{ items }` response shapes.
- **Upcoming Events (Home):** The homepage shows upcoming events in a section; uses the same `useEvents` hook.

---

## Maktoub

Maktoub is WIMESSA’s annual publication. The `/maktoub` page lists years (2022–2024); each year opens a PDF flipbook.

To add PDFs: import the file in `src/pages/MaktoubYear.jsx` and add it to `MAKTOUB_PDFS`:

```js
import maktoub2024 from '../assets/maktoub2024.pdf'
const MAKTOUB_PDFS = {
  2024: maktoub2024,
}
```

Add the year to `MAKTOUB_YEARS` in `src/pages/Maktoub.jsx` if needed.

---

## Environment variables

All of these are **secret or environment-specific**. Store them only in `.env` locally or in your deployment platform’s env/secrets. **Never commit them.**

| Variable | Used by | Description |
|----------|---------|-------------|
| `VITE_SUPABASE_URL` | Frontend (build) | Supabase project URL (contact form). |
| `VITE_SUPABASE_ANON_KEY` | Frontend (build) | Supabase anon key (contact form). |
| `VITE_EVENTS_API` | Frontend (build) | Production events API URL (e.g. `https://your-api.com/api/events`). |
| `VITE_API_URL` | Frontend (build) | Optional; production Node API base URL. |
| `GOOGLE_CALENDAR_ICAL_URL` | Backend | Public iCal feed URL for the events API. |
| `CONTACT_EMAIL` | Backend / Supabase | Email address that receives contact form submissions. |
| `RESEND_API_KEY` | Backend / Supabase | Resend API key. |
| `SMTP_FROM` | Backend / Supabase | "From" address when using Resend. |
| `SMTP_USER`, `SMTP_PASS` | Backend | Gmail credentials (use an [App Password](https://support.google.com/accounts/answer/185833) with 2FA) for Node API contact fallback. |

See [.env.example](.env.example) for a minimal list. Copy it to `.env` and fill in your values; keep `.env`, `.env.development`, and `.env.production` out of the repo (they are in [.gitignore](.gitignore)).

---

## Production

Production config and secrets are **not in the repo**. Set them in your hosting and CI platforms only.

### Frontend (deploys `dist/` to SiteGround via GitHub Actions)

- **Build-time env vars:** In GitHub go to **Settings → Secrets and variables → Actions**. Add repository secrets:
  - `VITE_SUPABASE_URL` — Supabase project URL (contact form).
  - `VITE_SUPABASE_ANON_KEY` — Supabase anon key (contact form).
  - `VITE_EVENTS_API` — production events API URL if you use an external API.
  - `VITE_API_URL` — optional; production Node API base URL.
  - `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` — SiteGround FTP credentials.
- The [deploy workflow](.github/workflows/deploy.yml) builds the site and deploys `dist/` to `wimessa.ca/public_html/` via FTP.

### Optional: Node API (events / contact fallback)

The Express server is not deployed by the workflow. If you run it (e.g. on Render) for the events API or contact fallback, set `GOOGLE_CALENDAR_ICAL_URL`, `CONTACT_EMAIL`, `RESEND_API_KEY`, and SMTP vars in that host’s dashboard.

---

## Internationalization (i18n)

The site supports **English**, **French**, and **Arabic** via URL-prefixed routes (`/en/about`, `/fr/contact`, `/ar/contact`). Visiting `/` redirects to `/en`, `/fr`, or `/ar` based on browser language. Arabic enables RTL (right-to-left) layout automatically.

- **Language switcher:** EN | FR | عربي in the navbar
- **Translation files:** `src/locales/en.json`, `src/locales/fr.json`, `src/locales/ar.json`
- **To add a language:** Create `src/locales/xx.json`, add `xx` to `SUPPORTED_LOCALES` in `src/i18n.js`, add it to the language switcher in the navbar

---

## Project structure

```
├── public/
│   └── .htaccess          # SPA routing + cache control for index.html
├── server/
│   └── index.js           # Express API: /api/events, /api/contact
├── src/
│   ├── assets/            # Images, logos
│   ├── components/        # Hero, AboutSection, FlipBook, LocaleLink, Navbar, etc.
│   ├── hooks/
│   │   ├── useEvents.js   # Fetches and normalizes events from VITE_EVENTS_API
│   │   └── useLocale.js   # Current locale and switchLocale for language switcher
│   ├── i18n.js            # react-i18next config
│   ├── locales/           # en.json, fr.json translation files
│   ├── pages/             # Home, About, Events, EventDetail, Maktoub, MaktoubYear, Contact
│   ├── App.jsx
│   └── main.jsx
├── supabase/functions/contact/
│   └── index.ts           # Supabase Edge Function for contact form
├── .github/workflows/deploy.yml
└── vite.config.js         # Proxies /api to backend in dev
```

---

## React + Vite (template notes)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules. It uses [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) with [SWC](https://swc.rs/) for Fast Refresh.
