# WIMESSA Website

React + Vite frontend with Supabase for the contact form and an optional Express API for events (Google Calendar).

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
  - **Production backend (e.g. Render):** Use the host’s **Environment** / **Variables** for `GOOGLE_CALENDAR_ICAL_URL` etc. if you run the Node API. Contact form uses Supabase (set secrets in Supabase Dashboard).
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

- **Frontend**: `npm run dev` (Vite dev server; proxies `/api` to the backend).
- **Backend**: `npm run server` (Express on port 3001).

## How to test the contact form

The contact form uses **Supabase** (Edge Function + Resend). See [SUPABASE_CONTACT_SETUP.md](SUPABASE_CONTACT_SETUP.md) for setup.

1. **Set up `.env`** with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (from Supabase Dashboard → Settings → API).
2. **Start the frontend**: `npm run dev`, then open the URL (e.g. [http://localhost:5173](http://localhost:5173)).
3. Go to **Contact**, fill in the form, and submit. You should see a success message; submissions are stored in Supabase and an email is sent via Resend (if configured).

If the form says "Contact form is not configured", ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in `.env` and in GitHub Actions secrets for production.

## Environment variables

All of these are **secret or environment-specific**. Store them only in `.env` locally or in your deployment platform’s env/secrets. **Never commit them.**


| Variable                   | Used by          | Description                                                                                            |
| -------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------ |
| `GOOGLE_CALENDAR_ICAL_URL` | Backend          | Public iCal feed URL for the events API.                                                               |
| `CONTACT_EMAIL`            | Backend          | Email address that receives contact form submissions.                                                  |
| `SMTP_USER`, `SMTP_PASS`   | Backend          | Gmail credentials (use an [App Password](https://support.google.com/accounts/answer/185833) with 2FA). |
| `RESEND_API_KEY`           | Backend          | Resend API key; use with `SMTP_FROM` (e.g. `onboarding@resend.dev`).                                   |
| `SMTP_FROM`                | Backend          | “From” address when using Resend.                                                                      |
| `VITE_API_URL`             | Frontend (build) | Production API base URL; set in **GitHub Actions secrets**, not in the repo.                           |
| `VITE_EVENTS_API`          | Frontend (build) | Production events API URL; set in **GitHub Actions secrets** if needed.                                |


See [.env.example](.env.example) for a full list and comments. Copy it to `.env` and fill in your values; keep `.env`, `.env.development`, and `.env.production` out of the repo (they are in [.gitignore](.gitignore)).

## Production

Production config and secrets are **not in the repo**. Set them in your hosting and CI platforms only.

### Frontend (this repo deploys `dist/` to SiteGround via GitHub Actions)

- **Build-time env vars:** In GitHub go to **Settings → Secrets and variables → Actions**. Add repository secrets (do not put these in any file in the repo):
  - `VITE_SUPABASE_URL` — Supabase project URL (contact form).
  - `VITE_SUPABASE_ANON_KEY` — Supabase anon key (contact form).
  - `VITE_EVENTS_API` — production events API URL if you use a separate API for events.
  - `VITE_API_URL` — optional; production Node API base URL if you run the Express server.
- The [deploy workflow](.github/workflows/deploy.yml) passes these into `npm run build`. The built site uses Supabase for the contact form.

### Optional: Node API (events only)

The Express server is not deployed by the current workflow. If you run it (e.g. on Render) for the events API, set **GOOGLE_CALENDAR_ICAL_URL** and other vars in that host's dashboard. See **docs/DEPLOY_RENDER.md** if it exists.
---

## React + Vite (template notes)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and `[typescript-eslint](https://typescript-eslint.io)` in your project.